"""
orchestrator.py — Main Pipeline Orchestrator

Ties all components together into a single end-to-end pipeline:
  1. Fetch news (or accept a specific URL)
  2. Generate video script via LLM
  3. Generate voiceover (TTS)
  4. Extract word-level timestamps
  5. Generate avatar video/image
  6. Capture screenshots
  7. Assemble Remotion props JSON
  8. (Optional) Trigger Remotion render

CLI:
    python -m scripts.orchestrator --topic "AI" --avatar-strategy static
    python -m scripts.orchestrator --url "https://techcrunch.com/..." --output output/final.mp4
    python -m scripts.orchestrator --topic "AI" --fallback-script --engine edge-tts

As module:
    from scripts.orchestrator import run_pipeline
    result = await run_pipeline(config, topic="AI")
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import shutil
import sys
import time
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn, TimeElapsedColumn
from rich.table import Table

from scripts.capture_screenshots import capture_script_screenshots
from scripts.config_loader import PROJECT_ROOT, load_config, resolve_path, setup_logging
from scripts.fetch_news import NewsStory, fetch_news, stories_to_json
from scripts.generate_avatar import AvatarResult, generate_avatar, get_gpu_info
from scripts.generate_script import VideoScript, generate_script, script_to_json
from scripts.generate_timestamps import TimestampResult, generate_timestamps
from scripts.generate_voice import generate_voice

logger = logging.getLogger(__name__)
console = Console()


# ---------------------------------------------------------------------------
# Pipeline Result
# ---------------------------------------------------------------------------


@dataclass
class PipelineResult:
    """Complete output of the pipeline run."""
    success: bool
    run_id: str
    timestamp: str
    # Paths to generated assets
    news_json_path: str = ""
    script_json_path: str = ""
    audio_path: str = ""
    timestamps_json_path: str = ""
    avatar_result: dict[str, Any] = field(default_factory=dict)
    screenshot_results: list[dict[str, Any]] = field(default_factory=list)
    # The final Remotion props JSON path
    remotion_props_path: str = ""
    # Rendered video path (if Remotion render was triggered)
    rendered_video_path: str = ""
    # Errors encountered during the run
    errors: list[str] = field(default_factory=list)
    # Timing information
    timings: dict[str, float] = field(default_factory=dict)


# ---------------------------------------------------------------------------
# Remotion Props Builder
# ---------------------------------------------------------------------------


def build_remotion_props(
    script_data: dict[str, Any],
    timestamps_data: dict[str, Any],
    avatar_data: dict[str, Any],
    screenshot_data: list[dict[str, Any]],
    config: dict[str, Any],
    audio_path: str,
) -> dict[str, Any]:
    """Build the JSON props that Remotion reads for video composition.

    This is the bridge between the Python pipeline and the Remotion frontend.
    """
    video_cfg = config.get("video", {})

    # Map screenshots by URL for easy lookup
    screenshots_by_url: dict[str, str] = {}
    for ss in screenshot_data:
        if ss.get("success") and ss.get("path"):
            screenshots_by_url[ss["url"]] = ss["path"]

    # Build segment props
    segments = []
    for seg in script_data.get("segments", []):
        segment_props: dict[str, Any] = {
            "type": seg["type"],
            "duration": seg["duration"],
            "narration": seg["narration"],
            "durationInFrames": int(seg["duration"] * video_cfg.get("fps", 30)),
        }

        # Add type-specific props
        if seg["type"] == "hook":
            segment_props["hookText"] = script_data.get("hook_text", "")
            segment_props["sourceDescription"] = seg.get("source_description", "")

        elif seg["type"] == "source_proof":
            ss_url = seg.get("screenshot_url", "")
            segment_props["screenshotUrl"] = ss_url
            segment_props["screenshotPath"] = screenshots_by_url.get(ss_url, "")

        elif seg["type"] == "walkthrough":
            segment_props["highlights"] = seg.get("highlights", [])

        elif seg["type"] == "commentary":
            segment_props["emphasisText"] = seg.get("emphasis_text", "")

        elif seg["type"] == "broll":
            segment_props["brollKeywords"] = seg.get("broll_keywords", [])

        elif seg["type"] == "cta":
            segment_props["ctaText"] = seg.get("cta_text", "")

        segments.append(segment_props)

    # Build complete props
    props: dict[str, Any] = {
        "meta": {
            "title": script_data.get("title", "AI News Reel"),
            "generatedAt": datetime.now(tz=timezone.utc).isoformat(),
            "sourceUrl": script_data.get("source_url", ""),
            "sourceName": script_data.get("source_name", ""),
        },
        "video": {
            "width": video_cfg.get("width", 1080),
            "height": video_cfg.get("height", 1920),
            "fps": video_cfg.get("fps", 30),
            "durationInFrames": int(
                script_data.get("estimated_duration", 25) * video_cfg.get("fps", 30)
            ),
        },
        "audio": {
            "narrationPath": audio_path,
            "narrationDuration": timestamps_data.get("duration", 25),
        },
        "captions": {
            "words": timestamps_data.get("words", []),
            "engine": timestamps_data.get("engine", "unknown"),
        },
        "avatar": {
            "strategy": avatar_data.get("strategy", "static"),
            "videoPath": avatar_data.get("video_path"),
            "imagePath": avatar_data.get("image_path"),
            "isPlaceholder": avatar_data.get("is_placeholder", True),
        },
        "segments": segments,
        "screenshots": screenshot_data,
    }

    return props


async def _trigger_remotion_render(
    props_path: Path,
    config: dict[str, Any],
    output_path: Path,
) -> Path | None:
    """Trigger Remotion to render the final video.

    Returns the path to the rendered video, or None if render fails.
    """
    remotion_cfg = config.get("remotion", {})
    project_path = remotion_cfg.get("project_path", "../remotion-video")
    composition_id = remotion_cfg.get("composition_id", "AINewsReel")
    concurrency = remotion_cfg.get("concurrency", 4)

    remotion_root = Path(project_path)
    if not remotion_root.is_absolute():
        remotion_root = PROJECT_ROOT / remotion_root

    if not remotion_root.exists():
        logger.warning("Remotion project not found at %s — skipping render", remotion_root)
        return None

    npx = shutil.which("npx")
    if not npx:
        logger.warning("npx not found — skipping Remotion render")
        return None

    cmd = [
        npx, "remotion", "render",
        composition_id,
        str(output_path),
        "--props", str(props_path),
        "--concurrency", str(concurrency),
    ]

    logger.info("Triggering Remotion render: %s", " ".join(cmd))

    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=str(remotion_root),
        )
        stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=300)

        if proc.returncode == 0:
            logger.info("Remotion render complete: %s", output_path)
            return output_path
        else:
            logger.error("Remotion render failed:\n%s", stderr.decode())
            return None

    except asyncio.TimeoutError:
        logger.error("Remotion render timed out (5 min)")
        return None
    except Exception as exc:
        logger.error("Remotion render error: %s", exc)
        return None


# ---------------------------------------------------------------------------
# Main Pipeline
# ---------------------------------------------------------------------------


async def run_pipeline(
    config: dict[str, Any],
    topic: str | None = None,
    url: str | None = None,
    story_index: int = 0,
    avatar_strategy: str | None = None,
    avatar_cloud: bool = False,
    tts_engine: str | None = None,
    use_fallback_script: bool = False,
    render_video: bool = False,
    output_path: str | None = None,
) -> PipelineResult:
    """Run the complete video generation pipeline.

    Args:
        config: Pipeline configuration dict.
        topic: Search topic for news (uses RSS feeds).
        url: Specific URL to create a video about.
        story_index: Which story to pick (0 = top-ranked).
        avatar_strategy: Override avatar strategy from config.
        avatar_cloud: Use cloud GPU for avatar generation.
        tts_engine: Override TTS engine from config.
        use_fallback_script: Use template script instead of LLM.
        render_video: Whether to trigger Remotion render.
        output_path: Path for final rendered video.

    Returns:
        PipelineResult with all generated asset paths.
    """
    run_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    run_dir = PROJECT_ROOT / config.get("pipeline", {}).get("output_dir", "output") / run_id
    run_dir.mkdir(parents=True, exist_ok=True)

    result = PipelineResult(
        success=False,
        run_id=run_id,
        timestamp=datetime.now(tz=timezone.utc).isoformat(),
    )

    timers: dict[str, float] = {}

    console.print(Panel(
        f"[bold cyan]AI Video Pipeline[/bold cyan] — Run {run_id}",
        subtitle=f"topic={topic or 'N/A'} | url={url or 'N/A'}",
    ))

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        TimeElapsedColumn(),
        console=console,
    ) as progress:

        # ─────────────────────────────────────────────────────────────
        # Step 1: Fetch News
        # ─────────────────────────────────────────────────────────────
        task = progress.add_task("Fetching news...", total=None)
        t0 = time.monotonic()

        try:
            if url:
                # Use provided URL as a story
                story = {
                    "title": "Custom Story",
                    "summary": "",
                    "url": url,
                    "source": "Custom",
                    "category": "custom",
                    "published": datetime.now(tz=timezone.utc).isoformat(),
                    "image_url": "",
                    "score": 100,
                }

                # Try to fetch actual title/summary from the URL
                try:
                    import httpx
                    from bs4 import BeautifulSoup

                    async with httpx.AsyncClient() as client:
                        resp = await client.get(url, follow_redirects=True, timeout=10)
                        soup = BeautifulSoup(resp.text, "html.parser")
                        title_tag = soup.find("title")
                        if title_tag:
                            story["title"] = title_tag.get_text()[:100]
                        # Extract meta description
                        meta = soup.find("meta", attrs={"name": "description"})
                        if meta and meta.get("content"):
                            story["summary"] = meta["content"][:500]
                except Exception as exc:
                    logger.warning("Could not fetch URL metadata: %s", exc)

                stories = [story]
            else:
                stories_list = await fetch_news(config)
                stories = stories_to_json(stories_list)

            if not stories:
                result.errors.append("No news stories found")
                progress.update(task, description="[red]No stories found")
                return result

            # Pick the target story
            story = stories[min(story_index, len(stories) - 1)]

            # Save all stories
            news_path = run_dir / "news.json"
            news_path.write_text(
                json.dumps(stories, indent=2, ensure_ascii=False), encoding="utf-8"
            )
            result.news_json_path = str(news_path)

            timers["fetch_news"] = time.monotonic() - t0
            progress.update(
                task,
                description=f"[green]✓ News: {story['title'][:50]}...",
            )

        except Exception as exc:
            result.errors.append(f"News fetch failed: {exc}")
            progress.update(task, description=f"[red]✗ News fetch failed: {exc}")
            return result

        # ─────────────────────────────────────────────────────────────
        # Step 2: Generate Script
        # ─────────────────────────────────────────────────────────────
        task = progress.add_task("Generating script...", total=None)
        t0 = time.monotonic()

        try:
            script = await generate_script(story, config, use_fallback=use_fallback_script)
            script_data = script_to_json(script)

            script_path = run_dir / "script.json"
            script_path.write_text(
                json.dumps(script_data, indent=2, ensure_ascii=False), encoding="utf-8"
            )
            result.script_json_path = str(script_path)

            timers["generate_script"] = time.monotonic() - t0
            progress.update(
                task,
                description=f"[green]✓ Script: {len(script.segments)} segments, ~{script.estimated_duration:.0f}s",
            )

        except Exception as exc:
            result.errors.append(f"Script generation failed: {exc}")
            progress.update(task, description=f"[red]✗ Script failed: {exc}")
            return result

        # ─────────────────────────────────────────────────────────────
        # Step 3: Generate Voice (TTS)
        # ─────────────────────────────────────────────────────────────
        task = progress.add_task("Generating voice...", total=None)
        t0 = time.monotonic()

        try:
            audio_path = run_dir / "narration.wav"
            await generate_voice(
                script.full_narration,
                config,
                output_path=audio_path,
                engine_name=tts_engine,
            )
            result.audio_path = str(audio_path)

            timers["generate_voice"] = time.monotonic() - t0
            progress.update(task, description="[green]✓ Voice generated")

        except Exception as exc:
            result.errors.append(f"Voice generation failed: {exc}")
            progress.update(task, description=f"[red]✗ Voice failed: {exc}")
            return result

        # ─────────────────────────────────────────────────────────────
        # Step 4 & 5 & 6: Timestamps + Avatar + Screenshots (parallel)
        # ─────────────────────────────────────────────────────────────

        # These three steps can run in parallel since they don't depend on each other
        ts_task = progress.add_task("Generating timestamps...", total=None)
        av_task = progress.add_task("Generating avatar...", total=None)
        ss_task = progress.add_task("Capturing screenshots...", total=None)

        t0 = time.monotonic()

        # Launch all three concurrently
        timestamps_coro = generate_timestamps(audio_path, config)
        avatar_coro = generate_avatar(
            audio_path, config,
            strategy=avatar_strategy,
            use_cloud=avatar_cloud,
            output_dir=run_dir,
        )
        screenshots_coro = capture_script_screenshots(script_data, config, run_dir / "screenshots")

        results = await asyncio.gather(
            timestamps_coro,
            avatar_coro,
            screenshots_coro,
            return_exceptions=True,
        )

        # Process timestamp results
        timestamps_result = results[0]
        if isinstance(timestamps_result, Exception):
            result.errors.append(f"Timestamps failed: {timestamps_result}")
            progress.update(ts_task, description=f"[red]✗ Timestamps: {timestamps_result}")
            timestamps_data: dict[str, Any] = {"words": [], "duration": 25, "engine": "failed"}
        else:
            ts_path = run_dir / "timestamps.json"
            timestamps_data = timestamps_result.to_dict()
            ts_path.write_text(
                json.dumps(timestamps_data, indent=2, ensure_ascii=False), encoding="utf-8"
            )
            result.timestamps_json_path = str(ts_path)
            progress.update(
                ts_task,
                description=f"[green]✓ Timestamps: {len(timestamps_data['words'])} words",
            )

        # Process avatar results
        avatar_result = results[1]
        if isinstance(avatar_result, Exception):
            result.errors.append(f"Avatar failed: {avatar_result}")
            progress.update(av_task, description=f"[red]✗ Avatar: {avatar_result}")
            avatar_data: dict[str, Any] = AvatarResult(
                strategy="failed", video_path=None, image_path=None,
                duration=0, is_placeholder=True,
            ).to_dict()
        else:
            avatar_data = avatar_result.to_dict()
            result.avatar_result = avatar_data
            progress.update(
                av_task,
                description=f"[green]✓ Avatar: {avatar_data['strategy']}",
            )

        # Process screenshot results
        screenshot_results = results[2]
        if isinstance(screenshot_results, Exception):
            result.errors.append(f"Screenshots failed: {screenshot_results}")
            progress.update(ss_task, description=f"[yellow]⚠ Screenshots: {screenshot_results}")
            screenshot_data: list[dict[str, Any]] = []
        else:
            screenshot_data = screenshot_results
            success_count = sum(1 for s in screenshot_data if s.get("success"))
            result.screenshot_results = screenshot_data
            progress.update(
                ss_task,
                description=f"[green]✓ Screenshots: {success_count}/{len(screenshot_data)}",
            )

        timers["parallel_step"] = time.monotonic() - t0

        # ─────────────────────────────────────────────────────────────
        # Step 7: Build Remotion Props JSON
        # ─────────────────────────────────────────────────────────────
        task = progress.add_task("Building Remotion props...", total=None)
        t0 = time.monotonic()

        try:
            props = build_remotion_props(
                script_data=script_data,
                timestamps_data=timestamps_data,
                avatar_data=avatar_data,
                screenshot_data=screenshot_data,
                config=config,
                audio_path=str(audio_path),
            )

            props_path = run_dir / config.get("remotion", {}).get("props_filename", "video-props.json")
            props_path.write_text(
                json.dumps(props, indent=2, ensure_ascii=False), encoding="utf-8"
            )
            result.remotion_props_path = str(props_path)

            timers["build_props"] = time.monotonic() - t0
            progress.update(task, description="[green]✓ Remotion props assembled")

        except Exception as exc:
            result.errors.append(f"Props assembly failed: {exc}")
            progress.update(task, description=f"[red]✗ Props: {exc}")

        # ─────────────────────────────────────────────────────────────
        # Step 8: (Optional) Render with Remotion
        # ─────────────────────────────────────────────────────────────
        if render_video and result.remotion_props_path:
            task = progress.add_task("Rendering video...", total=None)
            t0 = time.monotonic()

            final_output = Path(output_path) if output_path else run_dir / "final.mp4"
            rendered = await _trigger_remotion_render(props_path, config, final_output)

            if rendered:
                result.rendered_video_path = str(rendered)
                timers["render"] = time.monotonic() - t0
                progress.update(task, description=f"[green]✓ Rendered: {rendered}")
            else:
                result.errors.append("Remotion render failed or skipped")
                timers["render"] = time.monotonic() - t0
                progress.update(task, description="[yellow]⚠ Render skipped")

    # ─────────────────────────────────────────────────────────────
    # Summary
    # ─────────────────────────────────────────────────────────────
    result.timings = timers
    result.success = len(result.errors) == 0

    # Print summary table
    table = Table(title="Pipeline Run Summary", show_header=True)
    table.add_column("Step", style="cyan")
    table.add_column("Time", style="green", justify="right")
    table.add_column("Status", justify="center")

    for step, elapsed in timers.items():
        table.add_row(
            step.replace("_", " ").title(),
            f"{elapsed:.1f}s",
            "✓" if step not in str(result.errors) else "✗",
        )

    total_time = sum(timers.values())
    table.add_row("Total", f"{total_time:.1f}s", "✓" if result.success else "⚠", style="bold")
    console.print(table)

    if result.errors:
        console.print(Panel(
            "\n".join(f"• {e}" for e in result.errors),
            title="[yellow]Warnings/Errors",
            border_style="yellow",
        ))

    console.print(f"\n[bold]Output directory:[/bold] {run_dir}")
    if result.remotion_props_path:
        console.print(f"[bold]Remotion props:[/bold] {result.remotion_props_path}")

    # Save pipeline result
    result_path = run_dir / "pipeline_result.json"
    result_path.write_text(
        json.dumps(asdict(result), indent=2, ensure_ascii=False), encoding="utf-8"
    )

    return result


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(
        description="AI Video Pipeline — End-to-end news reel generator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Full pipeline with topic search
  python -m scripts.orchestrator --topic "AI"

  # Use a specific URL
  python -m scripts.orchestrator --url "https://techcrunch.com/..."

  # Quick test with fallback script + edge-tts
  python -m scripts.orchestrator --topic "AI" --fallback-script --engine edge-tts

  # With cloud avatar generation
  python -m scripts.orchestrator --topic "AI" --avatar-strategy musetalk --avatar-cloud

  # Full pipeline with Remotion render
  python -m scripts.orchestrator --topic "AI" --render --output output/final.mp4
        """,
    )

    # Input source
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--topic", type=str, help="Search topic for news")
    source.add_argument("--url", type=str, help="Specific URL to make a video about")

    # Story selection
    parser.add_argument(
        "--story-index", type=int, default=0,
        help="Which ranked story to use (0 = top, default: 0)",
    )

    # Script options
    parser.add_argument(
        "--fallback-script", action="store_true",
        help="Use template script instead of LLM",
    )

    # Voice options
    parser.add_argument(
        "--engine", type=str, default=None,
        choices=["chatterbox", "f5tts", "edge-tts"],
        help="TTS engine override",
    )

    # Avatar options
    parser.add_argument(
        "--avatar-strategy", type=str, default=None,
        choices=["static", "musetalk", "liveportrait", "echomimic"],
        help="Avatar generation strategy",
    )
    parser.add_argument(
        "--avatar-cloud", action="store_true",
        help="Use cloud GPU (RunPod) for avatar",
    )

    # Output options
    parser.add_argument(
        "--render", action="store_true",
        help="Trigger Remotion render after pipeline",
    )
    parser.add_argument(
        "--output", type=str, default=None,
        help="Output video file path",
    )

    # Config
    parser.add_argument(
        "--config", type=str, default=None,
        help="Optional config file override",
    )

    args = parser.parse_args()

    config = load_config(args.config)
    setup_logging(config)

    result = asyncio.run(
        run_pipeline(
            config=config,
            topic=args.topic,
            url=args.url,
            story_index=args.story_index,
            avatar_strategy=args.avatar_strategy,
            avatar_cloud=args.avatar_cloud,
            tts_engine=args.engine,
            use_fallback_script=args.fallback_script,
            render_video=args.render,
            output_path=args.output,
        )
    )

    sys.exit(0 if result.success else 1)


if __name__ == "__main__":
    main()

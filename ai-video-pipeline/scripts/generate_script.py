"""
generate_script.py — Script Generator via Ollama (Local LLM)

Transforms a news story into a structured 7-segment video script
suitable for the AI avatar news reel format.

Standalone:
    python -m scripts.generate_script --story output/news.json --index 0

As module:
    from scripts.generate_script import generate_script
    script = await generate_script(story, config)
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import re
import sys
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any

from scripts.config_loader import PROJECT_ROOT, load_config, setup_logging

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Data Models
# ---------------------------------------------------------------------------


@dataclass
class ScriptSegment:
    """A single segment of the video script."""
    type: str  # hook, source_proof, walkthrough, commentary, demo, broll, cta
    duration: float
    narration: str
    # Optional fields depending on segment type
    source_description: str = ""
    screenshot_url: str = ""
    highlights: list[str] = field(default_factory=list)
    emphasis_text: str = ""
    broll_keywords: list[str] = field(default_factory=list)
    cta_text: str = ""


@dataclass
class VideoScript:
    """Complete video script with all segments."""
    title: str
    hook_text: str
    segments: list[ScriptSegment]
    full_narration: str
    source_url: str = ""
    source_name: str = ""
    estimated_duration: float = 0.0

    def __post_init__(self) -> None:
        if not self.full_narration:
            self.full_narration = " ".join(seg.narration for seg in self.segments)
        if not self.estimated_duration:
            self.estimated_duration = sum(seg.duration for seg in self.segments)


# ---------------------------------------------------------------------------
# LLM Prompt
# ---------------------------------------------------------------------------

SCRIPT_SYSTEM_PROMPT = """You are a viral short-form video scriptwriter for tech news content.
You write scripts for a 20-25 second vertical video (TikTok/Reels/Shorts style).
The video features an AI avatar presenter with dynamic visuals.

Your scripts must be:
- Conversational, punchy, and dramatic
- Factually accurate (don't make up details)
- Written for a young, tech-savvy audience
- Designed to hook viewers in the first 2 seconds

IMPORTANT: You must respond ONLY with valid JSON. No markdown, no commentary."""

SCRIPT_USER_PROMPT = """Write a video script for this tech news story:

**Title:** {title}
**Source:** {source}
**Summary:** {summary}
**URL:** {url}

Generate a JSON object with this EXACT structure:
{{
  "title": "Short catchy title (max 8 words)",
  "hook_text": "2-3 dramatic opening words that appear on screen",
  "segments": [
    {{
      "type": "hook",
      "duration": 3,
      "narration": "A dramatic opening line that makes people stop scrolling. Start with the hook_text words.",
      "source_description": "Brief description of the source (e.g., 'TechCrunch reported today')"
    }},
    {{
      "type": "source_proof",
      "duration": 2,
      "narration": "Reference the source to build credibility. Mention where this news came from.",
      "screenshot_url": "{url}"
    }},
    {{
      "type": "walkthrough",
      "duration": 9,
      "narration": "Detailed explanation of what happened, why it matters, and what it means. This is the meat of the video — make it informative but engaging. Use short sentences.",
      "highlights": ["key point 1", "key point 2", "key point 3"]
    }},
    {{
      "type": "commentary",
      "duration": 2,
      "narration": "Your personal take on this news. What's your hot take? Be opinionated but reasonable.",
      "emphasis_text": "A short impactful phrase to show on screen"
    }},
    {{
      "type": "demo",
      "duration": 2,
      "narration": "Describe a quick visual or demo that would show this in action. Even if hypothetical, paint a picture."
    }},
    {{
      "type": "broll",
      "duration": 2,
      "narration": "Transition thought — connect this to the bigger picture or who it affects.",
      "broll_keywords": ["keyword1", "keyword2"]
    }},
    {{
      "type": "cta",
      "duration": 3.5,
      "narration": "Call to action. Ask a question or prompt engagement. End with energy.",
      "cta_text": "A short CTA text for the screen (e.g., 'Link in captions 👇')"
    }}
  ]
}}

Rules:
- Total narration when spoken should fit within 20-25 seconds
- Keep each narration segment CONCISE — short sentences, no filler
- The hook must be DRAMATIC — use power words
- Make the commentary segment feel personal and authentic
- The CTA should create curiosity or urgency
- broll_keywords should be 2-3 words describing relevant stock footage
- Write the narration as natural speech, not written text
- Do NOT use emojis in narration (they're spoken aloud)
- ONLY return the JSON object, nothing else"""


# ---------------------------------------------------------------------------
# LLM Interaction
# ---------------------------------------------------------------------------


async def _call_ollama(
    prompt: str,
    system_prompt: str,
    config: dict[str, Any],
) -> str:
    """Call Ollama API and return the response text."""
    try:
        import ollama as ollama_lib
    except ImportError:
        logger.error("ollama package not installed. Run: pip install ollama")
        raise

    llm_cfg = config.get("llm", {})
    model = llm_cfg.get("model", "llama3.1:8b")
    base_url = llm_cfg.get("base_url", "http://localhost:11434")
    temperature = llm_cfg.get("temperature", 0.7)
    timeout = llm_cfg.get("timeout", 120)

    logger.info("Calling Ollama model=%s at %s", model, base_url)

    # Use the synchronous ollama client (it manages its own connections)
    client = ollama_lib.Client(host=base_url, timeout=timeout)

    try:
        response = client.chat(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            options={
                "temperature": temperature,
                "num_predict": llm_cfg.get("max_tokens", 2048),
            },
            format="json",
        )
        return response["message"]["content"]
    except Exception as exc:
        # Try fallback model
        fallback = llm_cfg.get("fallback_model", "")
        if fallback and fallback != model:
            logger.warning("Primary model failed (%s), trying fallback: %s", exc, fallback)
            try:
                response = client.chat(
                    model=fallback,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt},
                    ],
                    options={
                        "temperature": temperature,
                        "num_predict": llm_cfg.get("max_tokens", 2048),
                    },
                    format="json",
                )
                return response["message"]["content"]
            except Exception as fallback_exc:
                logger.error("Fallback model also failed: %s", fallback_exc)
                raise fallback_exc from exc
        raise


def _parse_script_json(raw: str) -> dict[str, Any]:
    """Parse LLM output into a dict, handling common formatting issues."""
    # Strip markdown code fences if present
    raw = raw.strip()
    if raw.startswith("```"):
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)

    try:
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        logger.warning("JSON parse failed, attempting repair: %s", exc)
        # Try to find JSON object boundaries
        start = raw.find("{")
        end = raw.rfind("}") + 1
        if start >= 0 and end > start:
            try:
                return json.loads(raw[start:end])
            except json.JSONDecodeError:
                pass
        raise ValueError(f"Could not parse LLM output as JSON: {raw[:200]}...") from exc


def _dict_to_script(data: dict[str, Any], source_url: str = "", source_name: str = "") -> VideoScript:
    """Convert a parsed JSON dict to a VideoScript dataclass."""
    segments = []
    for seg_data in data.get("segments", []):
        segments.append(ScriptSegment(
            type=seg_data.get("type", "unknown"),
            duration=float(seg_data.get("duration", 2)),
            narration=seg_data.get("narration", ""),
            source_description=seg_data.get("source_description", ""),
            screenshot_url=seg_data.get("screenshot_url", ""),
            highlights=seg_data.get("highlights", []),
            emphasis_text=seg_data.get("emphasis_text", ""),
            broll_keywords=seg_data.get("broll_keywords", []),
            cta_text=seg_data.get("cta_text", ""),
        ))

    return VideoScript(
        title=data.get("title", "Untitled"),
        hook_text=data.get("hook_text", ""),
        segments=segments,
        full_narration="",  # Will be auto-generated in __post_init__
        source_url=source_url,
        source_name=source_name,
    )


# ---------------------------------------------------------------------------
# Fallback Script (when LLM is unavailable)
# ---------------------------------------------------------------------------


def generate_fallback_script(story: dict[str, Any]) -> VideoScript:
    """Generate a template-based script without LLM — useful for testing."""
    title = story.get("title", "Breaking Tech News")
    summary = story.get("summary", "Something big just happened in tech.")
    source = story.get("source", "Unknown Source")
    url = story.get("url", "")

    # Truncate summary for narration
    short_summary = summary[:200].rsplit(" ", 1)[0] + "..." if len(summary) > 200 else summary

    segments = [
        ScriptSegment(
            type="hook", duration=3,
            narration=f"Wait, did you see this? {title}",
            source_description=f"Reported by {source}",
        ),
        ScriptSegment(
            type="source_proof", duration=2,
            narration=f"This just dropped from {source}, and it's a big deal.",
            screenshot_url=url,
        ),
        ScriptSegment(
            type="walkthrough", duration=9,
            narration=f"Here's what happened. {short_summary}",
            highlights=["Key development", "Industry impact", "What comes next"],
        ),
        ScriptSegment(
            type="commentary", duration=2,
            narration="Honestly? This could change everything. Keep your eyes on this one.",
            emphasis_text="Game Changer",
        ),
        ScriptSegment(
            type="demo", duration=2,
            narration="Imagine what this looks like in practice. It's wild.",
        ),
        ScriptSegment(
            type="broll", duration=2,
            narration="This affects creators, developers, and everyday users.",
            broll_keywords=["technology", "innovation"],
        ),
        ScriptSegment(
            type="cta", duration=3.5,
            narration="What do you think about this? Drop your take in the comments. Link in the captions for the full story.",
            cta_text="Full story in captions 👇",
        ),
    ]

    return VideoScript(
        title=title[:50],
        hook_text="Wait, did you see this?",
        segments=segments,
        full_narration="",
        source_url=url,
        source_name=source,
    )


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


async def generate_script(
    story: dict[str, Any],
    config: dict[str, Any],
    use_fallback: bool = False,
) -> VideoScript:
    """Generate a video script from a news story.

    Args:
        story: Dict with title, summary, url, source keys.
        config: Full pipeline configuration.
        use_fallback: If True, skip LLM and use template fallback.

    Returns:
        A VideoScript object ready for voice generation.
    """
    if use_fallback:
        logger.info("Using fallback script generator (no LLM)")
        return generate_fallback_script(story)

    prompt = SCRIPT_USER_PROMPT.format(
        title=story.get("title", ""),
        source=story.get("source", "Unknown"),
        summary=story.get("summary", ""),
        url=story.get("url", ""),
    )

    try:
        raw_response = await _call_ollama(prompt, SCRIPT_SYSTEM_PROMPT, config)
        parsed = _parse_script_json(raw_response)
        script = _dict_to_script(
            parsed,
            source_url=story.get("url", ""),
            source_name=story.get("source", ""),
        )
        logger.info(
            "Generated script: '%s' — %d segments, ~%.1fs total",
            script.title,
            len(script.segments),
            script.estimated_duration,
        )
        return script

    except Exception as exc:
        logger.error("Script generation failed: %s — using fallback", exc)
        return generate_fallback_script(story)


def script_to_json(script: VideoScript) -> dict[str, Any]:
    """Convert VideoScript to a JSON-serializable dict."""
    return asdict(script)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate video script from news story")
    parser.add_argument(
        "--story", type=str, required=True,
        help="Path to news stories JSON file",
    )
    parser.add_argument(
        "--index", type=int, default=0,
        help="Index of story to use from the JSON array",
    )
    parser.add_argument(
        "--output", type=str, default=None,
        help="Output JSON file path (default: stdout)",
    )
    parser.add_argument(
        "--fallback", action="store_true",
        help="Use template-based fallback instead of LLM",
    )
    parser.add_argument(
        "--config", type=str, default=None,
        help="Optional config file override",
    )
    args = parser.parse_args()

    config = load_config(args.config)
    setup_logging(config)

    # Load story
    story_path = Path(args.story)
    if not story_path.is_absolute():
        story_path = PROJECT_ROOT / story_path
    stories = json.loads(story_path.read_text(encoding="utf-8"))

    if isinstance(stories, list):
        if args.index >= len(stories):
            logger.error("Story index %d out of range (have %d)", args.index, len(stories))
            sys.exit(1)
        story = stories[args.index]
    else:
        story = stories

    # Generate script
    script = asyncio.run(generate_script(story, config, use_fallback=args.fallback))
    output = json.dumps(script_to_json(script), indent=2, ensure_ascii=False)

    if args.output:
        out_path = Path(args.output)
        if not out_path.is_absolute():
            out_path = PROJECT_ROOT / out_path
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(output, encoding="utf-8")
        logger.info("Wrote script to %s", out_path)
    else:
        print(output)


if __name__ == "__main__":
    main()

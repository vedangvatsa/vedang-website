"""
capture_screenshots.py — Screenshot Capture Tool

Captures screenshots of websites and tweets using Puppeteer via Node.js subprocess.
Produces mobile-viewport PNGs optimized for vertical video composition.

Standalone:
    python -m scripts.capture_screenshots --urls "https://example.com" "https://x.com/..."
    python -m scripts.capture_screenshots --script output/script.json

As module:
    from scripts.capture_screenshots import capture_screenshots
    paths = await capture_screenshots(urls, config)
"""

from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
import logging
import shutil
import sys
from pathlib import Path
from typing import Any

from scripts.config_loader import PROJECT_ROOT, load_config, setup_logging

logger = logging.getLogger(__name__)

# Path to the companion Node.js screenshot script
SCREENSHOT_JS = PROJECT_ROOT / "scripts" / "screenshot.js"


# ---------------------------------------------------------------------------
# Screenshot Engine
# ---------------------------------------------------------------------------


async def _ensure_node() -> str:
    """Check that Node.js and the screenshot script are available."""
    node = shutil.which("node")
    if not node:
        raise RuntimeError(
            "Node.js not found. Install it: brew install node"
        )

    if not SCREENSHOT_JS.exists():
        raise FileNotFoundError(
            f"Screenshot script not found: {SCREENSHOT_JS}\n"
            "Run the setup or create it manually."
        )

    return node


async def _capture_single(
    url: str,
    output_path: Path,
    config: dict[str, Any],
    highlight_text: str | None = None,
) -> Path | None:
    """Capture a single screenshot via the Node.js Puppeteer script."""
    node = await _ensure_node()
    ss_cfg = config.get("screenshots", {})

    cmd = [
        node, str(SCREENSHOT_JS),
        "--url", url,
        "--output", str(output_path),
        "--width", str(ss_cfg.get("viewport_width", 375)),
        "--height", str(ss_cfg.get("viewport_height", 812)),
        "--scale", str(ss_cfg.get("device_scale_factor", 2)),
        "--wait", str(ss_cfg.get("wait_ms", 3000)),
    ]

    if highlight_text:
        cmd.extend(["--highlight", highlight_text])

    logger.info("Capturing screenshot: %s → %s", url, output_path.name)

    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=str(PROJECT_ROOT),
        )
        stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=30)

        if proc.returncode != 0:
            err_msg = stderr.decode().strip() if stderr else "Unknown error"
            logger.error("Screenshot failed for %s: %s", url, err_msg)
            return None

        if stdout:
            logger.debug("Screenshot stdout: %s", stdout.decode().strip())

        if output_path.exists():
            logger.info("  ✓ Saved: %s (%.1f KB)", output_path.name, output_path.stat().st_size / 1024)
            return output_path
        else:
            logger.error("Screenshot file not created for %s", url)
            return None

    except asyncio.TimeoutError:
        logger.error("Screenshot timed out for %s", url)
        return None
    except Exception as exc:
        logger.error("Screenshot error for %s: %s", url, exc)
        return None


def _url_to_filename(url: str) -> str:
    """Generate a safe filename from a URL."""
    url_hash = hashlib.sha256(url.encode()).hexdigest()[:10]
    # Extract domain for readability
    from urllib.parse import urlparse
    parsed = urlparse(url)
    domain = parsed.netloc.replace("www.", "").replace(".", "_")
    return f"screenshot_{domain}_{url_hash}.png"


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


async def capture_screenshots(
    urls: list[str],
    config: dict[str, Any],
    output_dir: Path | str | None = None,
    highlight_texts: dict[str, str] | None = None,
) -> list[dict[str, Any]]:
    """Capture screenshots for a list of URLs.

    Args:
        urls: List of URLs to capture.
        config: Full pipeline configuration.
        output_dir: Where to save screenshots. Auto from config if None.
        highlight_texts: Optional mapping of URL → text to highlight.

    Returns:
        List of dicts with url, path, success keys.
    """
    if output_dir is None:
        output_dir = PROJECT_ROOT / config.get("pipeline", {}).get("output_dir", "output") / "screenshots"
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    max_screenshots = config.get("screenshots", {}).get("max_screenshots", 10)
    urls_to_capture = urls[:max_screenshots]

    results: list[dict[str, Any]] = []

    # Capture screenshots with controlled concurrency (max 3 at a time)
    semaphore = asyncio.Semaphore(3)

    async def _capture_with_semaphore(url: str) -> dict[str, Any]:
        async with semaphore:
            filename = _url_to_filename(url)
            output_path = output_dir / filename
            highlight = (highlight_texts or {}).get(url)
            path = await _capture_single(url, output_path, config, highlight)
            return {
                "url": url,
                "path": str(path) if path else None,
                "success": path is not None,
            }

    tasks = [_capture_with_semaphore(url) for url in urls_to_capture]
    results = await asyncio.gather(*tasks)

    success_count = sum(1 for r in results if r["success"])
    logger.info(
        "Screenshots: %d/%d successful",
        success_count, len(urls_to_capture),
    )

    return list(results)


async def capture_script_screenshots(
    script_data: dict[str, Any],
    config: dict[str, Any],
    output_dir: Path | str | None = None,
) -> list[dict[str, Any]]:
    """Extract URLs from a script and capture screenshots.

    Looks at screenshot_url and source_url fields in segments.
    """
    urls: list[str] = []
    seen: set[str] = set()

    for segment in script_data.get("segments", []):
        for key in ("screenshot_url", "source_url"):
            url = segment.get(key, "")
            if url and url not in seen and url.startswith("http"):
                urls.append(url)
                seen.add(url)

    # Also capture the main source URL
    source_url = script_data.get("source_url", "")
    if source_url and source_url not in seen and source_url.startswith("http"):
        urls.append(source_url)

    if not urls:
        logger.info("No URLs found in script for screenshots")
        return []

    return await capture_screenshots(urls, config, output_dir)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(description="Capture website/tweet screenshots")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "--urls", nargs="+", type=str,
        help="URLs to capture",
    )
    group.add_argument(
        "--script", type=str,
        help="Path to script JSON (extracts URLs from segments)",
    )
    parser.add_argument(
        "--output-dir", type=str, default=None,
        help="Directory to save screenshots",
    )
    parser.add_argument(
        "--config", type=str, default=None,
        help="Optional config file override",
    )
    args = parser.parse_args()

    config = load_config(args.config)
    setup_logging(config)

    if args.script:
        script_path = Path(args.script)
        if not script_path.is_absolute():
            script_path = PROJECT_ROOT / script_path
        script_data = json.loads(script_path.read_text(encoding="utf-8"))
        results = asyncio.run(capture_script_screenshots(script_data, config, args.output_dir))
    else:
        results = asyncio.run(capture_screenshots(args.urls, config, args.output_dir))

    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()

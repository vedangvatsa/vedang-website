"""
generate_timestamps.py — Word-Level Timestamp Generator

Produces per-word timestamps from narration audio, enabling
synchronized captions and animations in the Remotion video.

Engines (tried in order):
  1. stable-ts   — Stabilized Whisper timestamps (good CPU perf)
  2. faster-whisper — CTranslate2-based Whisper (fast on CPU)

Standalone:
    python -m scripts.generate_timestamps --audio output/narration.wav
    python -m scripts.generate_timestamps --audio output/narration.wav --engine stable-ts

As module:
    from scripts.generate_timestamps import generate_timestamps
    result = await generate_timestamps(audio_path, config)
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

from scripts.config_loader import PROJECT_ROOT, load_config, setup_logging

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Data Model
# ---------------------------------------------------------------------------


@dataclass
class WordTimestamp:
    """A single word with start/end times in seconds."""
    word: str
    start: float
    end: float
    confidence: float = 1.0


@dataclass
class TimestampResult:
    """Complete timestamp output for a narration."""
    words: list[WordTimestamp]
    duration: float  # Total audio duration in seconds
    engine: str  # Which engine produced these

    def to_dict(self) -> dict[str, Any]:
        return {
            "words": [asdict(w) for w in self.words],
            "duration": self.duration,
            "engine": self.engine,
        }


# ---------------------------------------------------------------------------
# Engine: stable-ts
# ---------------------------------------------------------------------------


async def _run_stable_ts(
    audio_path: Path,
    config: dict[str, Any],
) -> TimestampResult:
    """Generate word-level timestamps using stable-ts."""
    try:
        import stable_whisper
    except ImportError:
        raise ImportError("stable-ts not installed. Run: pip install stable-ts")

    ts_cfg = config.get("timestamps", {})
    model_size = ts_cfg.get("model_size", "base")
    device = ts_cfg.get("device", "cpu")
    language = ts_cfg.get("language", "en")

    logger.info("Loading stable-ts model=%s device=%s", model_size, device)

    loop = asyncio.get_event_loop()

    def _transcribe() -> Any:
        model = stable_whisper.load_model(model_size, device=device)
        result = model.transcribe(
            str(audio_path),
            language=language,
            word_timestamps=True,
        )
        return result

    result = await loop.run_in_executor(None, _transcribe)

    words: list[WordTimestamp] = []
    duration = 0.0

    # stable-ts returns segments with word-level data
    for segment in result.segments:
        for word_data in segment.words:
            w = WordTimestamp(
                word=word_data.word.strip(),
                start=round(word_data.start, 3),
                end=round(word_data.end, 3),
                confidence=round(getattr(word_data, "probability", 1.0), 3),
            )
            if w.word:  # Skip empty
                words.append(w)
                duration = max(duration, w.end)

    logger.info("stable-ts: extracted %d words, duration=%.2fs", len(words), duration)
    return TimestampResult(words=words, duration=duration, engine="stable-ts")


# ---------------------------------------------------------------------------
# Engine: faster-whisper
# ---------------------------------------------------------------------------


async def _run_faster_whisper(
    audio_path: Path,
    config: dict[str, Any],
) -> TimestampResult:
    """Generate word-level timestamps using faster-whisper."""
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        raise ImportError(
            "faster-whisper not installed. Run: pip install faster-whisper"
        )

    ts_cfg = config.get("timestamps", {})
    model_size = ts_cfg.get("model_size", "base")
    device = ts_cfg.get("device", "cpu")
    language = ts_cfg.get("language", "en")

    # faster-whisper uses "cpu" or "cuda" (no MPS support currently)
    compute_type = "int8" if device == "cpu" else "float16"
    fw_device = "cpu"  # Force CPU for Apple Silicon compatibility

    logger.info(
        "Loading faster-whisper model=%s device=%s compute=%s",
        model_size, fw_device, compute_type,
    )

    loop = asyncio.get_event_loop()

    def _transcribe() -> tuple[Any, Any]:
        model = WhisperModel(model_size, device=fw_device, compute_type=compute_type)
        segments, info = model.transcribe(
            str(audio_path),
            language=language,
            word_timestamps=True,
            vad_filter=True,
        )
        return list(segments), info

    segments, info = await loop.run_in_executor(None, _transcribe)

    words: list[WordTimestamp] = []
    duration = 0.0

    for segment in segments:
        if segment.words:
            for word_data in segment.words:
                w = WordTimestamp(
                    word=word_data.word.strip(),
                    start=round(word_data.start, 3),
                    end=round(word_data.end, 3),
                    confidence=round(word_data.probability, 3),
                )
                if w.word:
                    words.append(w)
                    duration = max(duration, w.end)

    logger.info("faster-whisper: extracted %d words, duration=%.2fs", len(words), duration)
    return TimestampResult(words=words, duration=duration, engine="faster-whisper")


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

ENGINE_DISPATCH = {
    "stable-ts": _run_stable_ts,
    "faster-whisper": _run_faster_whisper,
}


async def generate_timestamps(
    audio_path: Path | str,
    config: dict[str, Any],
    engine_name: str | None = None,
) -> TimestampResult:
    """Generate word-level timestamps from an audio file.

    Tries the configured engine first, then falls back to alternatives.

    Args:
        audio_path: Path to the WAV audio file.
        config: Full pipeline configuration.
        engine_name: Override which engine to use.

    Returns:
        TimestampResult with per-word timestamps.
    """
    audio_path = Path(audio_path)
    if not audio_path.is_absolute():
        audio_path = PROJECT_ROOT / audio_path

    if not audio_path.exists():
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    primary = engine_name or config.get("timestamps", {}).get("engine", "stable-ts")
    engines_to_try = [primary] + [e for e in ENGINE_DISPATCH if e != primary]

    for eng_name in engines_to_try:
        fn = ENGINE_DISPATCH.get(eng_name)
        if fn is None:
            continue
        try:
            result = await fn(audio_path, config)
            return result
        except ImportError as exc:
            logger.warning("Engine '%s' not available: %s", eng_name, exc)
            continue
        except Exception as exc:
            logger.warning("Engine '%s' failed: %s", eng_name, exc)
            continue

    raise RuntimeError(
        "All timestamp engines failed. Install at least one: "
        "pip install stable-ts  OR  pip install faster-whisper"
    )


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate word-level timestamps from audio")
    parser.add_argument(
        "--audio", type=str, required=True,
        help="Path to the audio WAV file",
    )
    parser.add_argument(
        "--output", type=str, default=None,
        help="Output JSON file path (default: stdout)",
    )
    parser.add_argument(
        "--engine", type=str, default=None,
        choices=list(ENGINE_DISPATCH.keys()),
        help="Timestamp engine to use",
    )
    parser.add_argument(
        "--config", type=str, default=None,
        help="Optional config file override",
    )
    args = parser.parse_args()

    config = load_config(args.config)
    setup_logging(config)

    result = asyncio.run(generate_timestamps(args.audio, config, args.engine))
    output = json.dumps(result.to_dict(), indent=2, ensure_ascii=False)

    if args.output:
        out_path = Path(args.output)
        if not out_path.is_absolute():
            out_path = PROJECT_ROOT / out_path
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(output, encoding="utf-8")
        logger.info("Wrote %d word timestamps to %s", len(result.words), out_path)
    else:
        print(output)


if __name__ == "__main__":
    main()

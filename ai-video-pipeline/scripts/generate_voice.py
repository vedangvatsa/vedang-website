"""
generate_voice.py — TTS Voice Generation Module

Generates narration audio using multiple TTS engines with fallback chain:
  1. Chatterbox TTS (voice cloning, best quality)
  2. F5-TTS with MLX (Apple Silicon optimized)
  3. Edge-TTS (Microsoft, no GPU, fast, always available)

Standalone:
    python -m scripts.generate_voice --text "Hello world" --output output/narration.wav
    python -m scripts.generate_voice --script output/script.json --engine edge-tts

As module:
    from scripts.generate_voice import generate_voice
    audio_path = await generate_voice(text, config)
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import shutil
import sys
import tempfile
from pathlib import Path
from typing import Any

import numpy as np
import soundfile as sf

from scripts.config_loader import PROJECT_ROOT, load_config, setup_logging

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Engine: Chatterbox TTS (Voice Cloning)
# ---------------------------------------------------------------------------


class ChatterboxEngine:
    """Chatterbox TTS — high-quality voice cloning.

    Requires: pip install chatterbox-tts torch torchaudio
    Works on CPU or MPS (Apple Silicon).
    """

    def __init__(self, config: dict[str, Any]) -> None:
        self.voice_cfg = config.get("voice", {})
        self.cb_cfg = self.voice_cfg.get("chatterbox", {})
        self.device = self.cb_cfg.get("device", "cpu")
        self.exaggeration = self.cb_cfg.get("exaggeration", 0.5)
        self.cfg_weight = self.cb_cfg.get("cfg_weight", 0.5)
        self.reference_audio = self.voice_cfg.get("reference_audio", "")
        self._model = None

    def _load_model(self) -> Any:
        """Lazy-load the Chatterbox model."""
        if self._model is not None:
            return self._model

        try:
            import torch
            import torchaudio  # noqa: F401
            from chatterbox.tts import ChatterboxTTS

            # Check MPS availability on Apple Silicon
            if self.device == "mps" and not torch.backends.mps.is_available():
                logger.warning("MPS requested but not available, falling back to CPU")
                self.device = "cpu"

            logger.info("Loading Chatterbox model on device=%s", self.device)
            self._model = ChatterboxTTS.from_pretrained(device=self.device)
            return self._model

        except ImportError as exc:
            raise ImportError(
                "Chatterbox TTS not installed. Run: pip install chatterbox-tts torch torchaudio"
            ) from exc

    async def generate(self, text: str, output_path: Path) -> Path:
        """Generate audio with voice cloning."""
        import torch

        model = self._load_model()

        ref_audio = self.reference_audio
        if ref_audio:
            ref_path = Path(ref_audio)
            if not ref_path.is_absolute():
                ref_path = PROJECT_ROOT / ref_path
            if not ref_path.exists():
                logger.warning("Reference audio not found: %s — using default voice", ref_path)
                ref_audio = ""

        logger.info("Generating voice with Chatterbox (%.0f chars)", len(text))

        # Run in thread pool since model inference is blocking
        loop = asyncio.get_event_loop()
        wav = await loop.run_in_executor(
            None,
            lambda: model.generate(
                text,
                audio_prompt_path=str(ref_path) if ref_audio else None,
                exaggeration=self.exaggeration,
                cfg_weight=self.cfg_weight,
            ),
        )

        # wav is a torch tensor, save to file
        import torchaudio
        torchaudio.save(str(output_path), wav.cpu(), model.sr)
        logger.info("Saved Chatterbox audio to %s", output_path)
        return output_path


# ---------------------------------------------------------------------------
# Engine: F5-TTS with MLX (Apple Silicon)
# ---------------------------------------------------------------------------


class F5TTSEngine:
    """F5-TTS with MLX backend — optimized for Apple Silicon.

    Requires: pip install f5-tts-mlx
    """

    def __init__(self, config: dict[str, Any]) -> None:
        self.voice_cfg = config.get("voice", {})
        self.f5_cfg = self.voice_cfg.get("f5tts", {})
        self.reference_audio = self.voice_cfg.get("reference_audio", "")
        self.use_mlx = self.f5_cfg.get("use_mlx", True)

    async def generate(self, text: str, output_path: Path) -> Path:
        """Generate audio with F5-TTS."""
        try:
            from f5_tts_mlx.generate import generate as f5_generate
        except ImportError:
            raise ImportError(
                "F5-TTS MLX not installed. Run: pip install f5-tts-mlx"
            )

        ref_audio = self.reference_audio
        ref_path = None
        if ref_audio:
            ref_path = Path(ref_audio)
            if not ref_path.is_absolute():
                ref_path = PROJECT_ROOT / ref_path
            if not ref_path.exists():
                logger.warning("Reference audio not found: %s", ref_path)
                ref_path = None

        logger.info("Generating voice with F5-TTS MLX (%.0f chars)", len(text))

        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            lambda: f5_generate(
                generation_text=text,
                ref_audio_path=str(ref_path) if ref_path else None,
                output_path=str(output_path),
            ),
        )

        logger.info("Saved F5-TTS audio to %s", output_path)
        return output_path


# ---------------------------------------------------------------------------
# Engine: Edge-TTS (Microsoft — always available, no GPU)
# ---------------------------------------------------------------------------


class EdgeTTSEngine:
    """Edge-TTS — uses Microsoft's online TTS. Fast, free, reliable fallback.

    Requires: pip install edge-tts (no GPU, no large models)
    """

    def __init__(self, config: dict[str, Any]) -> None:
        self.voice_cfg = config.get("voice", {})
        self.voice_name = self.voice_cfg.get("edge_voice", "en-US-GuyNeural")

    async def generate(self, text: str, output_path: Path) -> Path:
        """Generate audio with Edge-TTS."""
        try:
            import edge_tts
        except ImportError:
            raise ImportError("edge-tts not installed. Run: pip install edge-tts")

        logger.info(
            "Generating voice with Edge-TTS (voice=%s, %.0f chars)",
            self.voice_name, len(text),
        )

        communicate = edge_tts.Communicate(text, self.voice_name)

        # Edge-TTS outputs mp3 by default; save then convert to wav
        mp3_path = output_path.with_suffix(".mp3")
        await communicate.save(str(mp3_path))

        # Convert MP3 to WAV using soundfile + numpy
        await _convert_mp3_to_wav(mp3_path, output_path)

        # Clean up mp3
        mp3_path.unlink(missing_ok=True)

        logger.info("Saved Edge-TTS audio to %s", output_path)
        return output_path


async def _convert_mp3_to_wav(mp3_path: Path, wav_path: Path) -> None:
    """Convert MP3 to WAV. Uses ffmpeg if available, otherwise pydub."""
    ffmpeg = shutil.which("ffmpeg")
    if ffmpeg:
        proc = await asyncio.create_subprocess_exec(
            ffmpeg, "-i", str(mp3_path), "-ar", "24000", "-ac", "1",
            str(wav_path), "-y",
            stdout=asyncio.subprocess.DEVNULL,
            stderr=asyncio.subprocess.DEVNULL,
        )
        await proc.wait()
        if proc.returncode == 0:
            return

    # Fallback: try with soundfile (needs libsndfile)
    try:
        data, sr = sf.read(str(mp3_path))
        sf.write(str(wav_path), data, sr, subtype="PCM_16")
        return
    except Exception:
        pass

    # Last resort: just copy the mp3 as-is (Whisper can handle mp3)
    logger.warning("Could not convert MP3→WAV, copying as-is")
    shutil.copy2(mp3_path, wav_path)


# ---------------------------------------------------------------------------
# Engine Factory
# ---------------------------------------------------------------------------

ENGINE_MAP = {
    "chatterbox": ChatterboxEngine,
    "f5tts": F5TTSEngine,
    "edge-tts": EdgeTTSEngine,
}

FALLBACK_ORDER = ["chatterbox", "f5tts", "edge-tts"]


def _create_engine(engine_name: str, config: dict[str, Any]) -> Any:
    """Create a TTS engine by name."""
    cls = ENGINE_MAP.get(engine_name)
    if cls is None:
        raise ValueError(f"Unknown TTS engine: {engine_name}. Options: {list(ENGINE_MAP.keys())}")
    return cls(config)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


async def generate_voice(
    text: str,
    config: dict[str, Any],
    output_path: Path | str | None = None,
    engine_name: str | None = None,
) -> Path:
    """Generate voice narration from text.

    Tries the requested engine first, then falls back through the chain.

    Args:
        text: The narration text to speak.
        config: Full pipeline configuration.
        output_path: Where to save the WAV file. Auto-generated if None.
        engine_name: Override which engine to use.

    Returns:
        Path to the generated WAV file.
    """
    if not text.strip():
        raise ValueError("Cannot generate voice from empty text")

    # Determine output path
    if output_path is None:
        out_dir = PROJECT_ROOT / config.get("pipeline", {}).get("output_dir", "output")
        out_dir.mkdir(parents=True, exist_ok=True)
        output_path = out_dir / "narration.wav"
    else:
        output_path = Path(output_path)
        if not output_path.is_absolute():
            output_path = PROJECT_ROOT / output_path

    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Determine engine order
    primary = engine_name or config.get("voice", {}).get("engine", "edge-tts")
    engines_to_try = [primary] + [e for e in FALLBACK_ORDER if e != primary]

    for eng_name in engines_to_try:
        try:
            engine = _create_engine(eng_name, config)
            result = await engine.generate(text, output_path)
            return result
        except ImportError as exc:
            logger.warning("Engine '%s' not available: %s", eng_name, exc)
            continue
        except Exception as exc:
            logger.warning("Engine '%s' failed: %s", eng_name, exc)
            continue

    raise RuntimeError(
        "All TTS engines failed. Install at least edge-tts: pip install edge-tts"
    )


async def generate_voice_segments(
    segments: list[dict[str, Any]],
    config: dict[str, Any],
    output_dir: Path | str | None = None,
) -> list[dict[str, Any]]:
    """Generate individual audio files for each script segment.

    Returns the segments list with added 'audio_path' keys.
    """
    if output_dir is None:
        output_dir = PROJECT_ROOT / config.get("pipeline", {}).get("output_dir", "output")
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    results = []
    for i, seg in enumerate(segments):
        narration = seg.get("narration", "")
        if not narration.strip():
            seg["audio_path"] = ""
            results.append(seg)
            continue

        audio_path = output_dir / f"segment_{i:02d}_{seg.get('type', 'unknown')}.wav"
        try:
            await generate_voice(narration, config, audio_path)
            seg["audio_path"] = str(audio_path)
        except Exception as exc:
            logger.error("Failed to generate audio for segment %d: %s", i, exc)
            seg["audio_path"] = ""

        results.append(seg)

    return results


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate TTS voice narration")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "--text", type=str,
        help="Text to convert to speech",
    )
    group.add_argument(
        "--script", type=str,
        help="Path to script JSON (uses full_narration field)",
    )
    parser.add_argument(
        "--output", type=str, default="output/narration.wav",
        help="Output WAV file path",
    )
    parser.add_argument(
        "--engine", type=str, default=None,
        choices=list(ENGINE_MAP.keys()),
        help="TTS engine to use",
    )
    parser.add_argument(
        "--config", type=str, default=None,
        help="Optional config file override",
    )
    args = parser.parse_args()

    config = load_config(args.config)
    setup_logging(config)

    # Get text
    if args.script:
        script_path = Path(args.script)
        if not script_path.is_absolute():
            script_path = PROJECT_ROOT / script_path
        script_data = json.loads(script_path.read_text(encoding="utf-8"))
        text = script_data.get("full_narration", "")
        if not text:
            text = " ".join(
                seg.get("narration", "") for seg in script_data.get("segments", [])
            )
    else:
        text = args.text

    if not text:
        logger.error("No text provided")
        sys.exit(1)

    result = asyncio.run(generate_voice(text, config, args.output, args.engine))
    logger.info("Generated: %s", result)


if __name__ == "__main__":
    main()

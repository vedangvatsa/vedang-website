"""
generate_avatar.py — Avatar Video Generator

Manages avatar generation with multiple strategy options:
  - static:      Use a static image (no GPU, for testing)
  - musetalk:    Re-lip-sync a base video (needs CUDA GPU)
  - liveportrait: Animate a photo with LivePortrait + MuseTalk (needs CUDA GPU)
  - echomimic:   EchoMimic V2 semi-body with gestures (needs CUDA GPU)

For strategies requiring CUDA, this module can:
  1. Run locally if CUDA is available
  2. Offload to RunPod serverless GPU
  3. Fall back to static image for testing

Standalone:
    python -m scripts.generate_avatar --audio output/narration.wav --strategy static
    python -m scripts.generate_avatar --audio output/narration.wav --strategy musetalk --cloud

As module:
    from scripts.generate_avatar import generate_avatar
    result = await generate_avatar(audio_path, config)
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import shutil
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

from scripts.config_loader import PROJECT_ROOT, load_config, setup_logging

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Data Models
# ---------------------------------------------------------------------------


@dataclass
class AvatarResult:
    """Result from avatar generation."""
    strategy: str
    video_path: str | None  # Path to generated video, None if static
    image_path: str | None  # Path to static image (for static strategy)
    duration: float  # Duration in seconds
    is_placeholder: bool  # True if using static/placeholder
    cloud_job_id: str | None = None  # RunPod job ID if cloud-generated

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


# ---------------------------------------------------------------------------
# GPU Detection
# ---------------------------------------------------------------------------


def _check_gpu() -> dict[str, Any]:
    """Check GPU availability for avatar generation."""
    result = {
        "cuda_available": False,
        "mps_available": False,
        "gpu_name": None,
        "recommendation": "static",
    }

    try:
        import torch
        result["cuda_available"] = torch.cuda.is_available()
        result["mps_available"] = torch.backends.mps.is_available()

        if result["cuda_available"]:
            result["gpu_name"] = torch.cuda.get_device_name(0)
            result["recommendation"] = "local_gpu"
        elif result["mps_available"]:
            result["gpu_name"] = "Apple Silicon (MPS)"
            result["recommendation"] = "mps_limited"
    except ImportError:
        pass

    return result


# ---------------------------------------------------------------------------
# Strategy: Static Image (No GPU)
# ---------------------------------------------------------------------------


async def _strategy_static(
    audio_path: Path,
    config: dict[str, Any],
    output_dir: Path,
) -> AvatarResult:
    """Use a static avatar image — no animation, no GPU needed.

    This is the fallback for testing the full pipeline without GPU.
    The Remotion composition will handle any zoom/pan effects on the static image.
    """
    avatar_cfg = config.get("avatar", {})
    photo_path = avatar_cfg.get("photo_path", "assets/avatar_photo.png")

    src = Path(photo_path)
    if not src.is_absolute():
        src = PROJECT_ROOT / src

    if not src.exists():
        # Create a placeholder image
        logger.warning("Avatar photo not found: %s — creating placeholder", src)
        src = output_dir / "avatar_placeholder.png"
        await _create_placeholder_image(src)

    # Copy to output
    dest = output_dir / "avatar_static.png"
    shutil.copy2(src, dest)

    # Estimate duration from audio
    duration = await _get_audio_duration(audio_path)

    logger.info("Static avatar: %s (duration=%.2fs)", dest, duration)

    return AvatarResult(
        strategy="static",
        video_path=None,
        image_path=str(dest),
        duration=duration,
        is_placeholder=True,
    )


async def _create_placeholder_image(path: Path) -> None:
    """Create a simple placeholder avatar image using numpy."""
    try:
        import numpy as np
        from PIL import Image

        # Create a simple gradient avatar placeholder
        img = np.zeros((512, 512, 3), dtype=np.uint8)
        # Gradient background
        for y in range(512):
            for x in range(512):
                img[y, x] = [30 + y // 4, 40 + x // 4, 80 + (x + y) // 8]
        # Simple circle for face
        cy, cx = 200, 256
        for y in range(512):
            for x in range(512):
                if (x - cx) ** 2 + (y - cy) ** 2 < 100 ** 2:
                    img[y, x] = [220, 200, 180]

        Image.fromarray(img).save(str(path))
    except ImportError:
        # Fallback: create 1x1 pixel PNG
        import struct
        import zlib

        def _minimal_png(width: int = 64, height: int = 64) -> bytes:
            """Create a minimal solid-color PNG."""
            raw_data = b""
            for _ in range(height):
                raw_data += b"\x00" + b"\x50\x50\x80" * width  # Filter byte + RGB
            compressed = zlib.compress(raw_data)

            def chunk(chunk_type: bytes, data: bytes) -> bytes:
                c = chunk_type + data
                return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

            ihdr = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
            return (
                b"\x89PNG\r\n\x1a\n"
                + chunk(b"IHDR", ihdr)
                + chunk(b"IDAT", compressed)
                + chunk(b"IEND", b"")
            )

        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(_minimal_png())


async def _get_audio_duration(audio_path: Path) -> float:
    """Get audio duration in seconds."""
    try:
        import soundfile as sf
        info = sf.info(str(audio_path))
        return info.duration
    except Exception:
        logger.warning("Could not read audio duration, defaulting to 25s")
        return 25.0


# ---------------------------------------------------------------------------
# Strategy: MuseTalk (CUDA GPU required)
# ---------------------------------------------------------------------------


async def _strategy_musetalk(
    audio_path: Path,
    config: dict[str, Any],
    output_dir: Path,
    use_cloud: bool = False,
) -> AvatarResult:
    """Re-lip-sync a base video using MuseTalk.

    Requires CUDA GPU. Can offload to RunPod if use_cloud=True.
    """
    gpu_info = _check_gpu()

    if gpu_info["cuda_available"] and not use_cloud:
        return await _musetalk_local(audio_path, config, output_dir)
    elif use_cloud:
        return await _avatar_cloud(audio_path, config, output_dir, "musetalk")
    else:
        logger.warning(
            "MuseTalk requires CUDA GPU (found: %s). "
            "Use --cloud flag for RunPod, or falling back to static.",
            gpu_info.get("gpu_name", "none"),
        )
        return await _strategy_static(audio_path, config, output_dir)


async def _musetalk_local(
    audio_path: Path,
    config: dict[str, Any],
    output_dir: Path,
) -> AvatarResult:
    """Run MuseTalk locally with CUDA."""
    avatar_cfg = config.get("avatar", {})
    base_video = avatar_cfg.get("base_video_path", "")

    if not base_video:
        raise ValueError("MuseTalk requires avatar.base_video_path in config")

    base_path = Path(base_video)
    if not base_path.is_absolute():
        base_path = PROJECT_ROOT / base_path

    if not base_path.exists():
        raise FileNotFoundError(f"Base video not found: {base_path}")

    # MuseTalk integration point
    # In production, this would call the MuseTalk pipeline:
    #   1. Extract video frames
    #   2. Run face detection
    #   3. Generate lip-synced frames
    #   4. Reconstruct video

    output_video = output_dir / "avatar_musetalk.mp4"

    logger.info("MuseTalk: base=%s audio=%s → %s", base_path, audio_path, output_video)

    # TODO: Integrate actual MuseTalk inference here
    raise NotImplementedError(
        "MuseTalk local inference not yet integrated. "
        "Use --cloud flag for RunPod serverless execution, "
        "or --strategy static for testing."
    )


# ---------------------------------------------------------------------------
# Strategy: LivePortrait (CUDA GPU required)
# ---------------------------------------------------------------------------


async def _strategy_liveportrait(
    audio_path: Path,
    config: dict[str, Any],
    output_dir: Path,
    use_cloud: bool = False,
) -> AvatarResult:
    """Animate a photo using LivePortrait + MuseTalk.

    Requires CUDA GPU. Can offload to RunPod.
    """
    gpu_info = _check_gpu()

    if gpu_info["cuda_available"] and not use_cloud:
        # TODO: Local LivePortrait inference
        logger.warning("LivePortrait local not yet implemented, falling back to static")
        return await _strategy_static(audio_path, config, output_dir)
    elif use_cloud:
        return await _avatar_cloud(audio_path, config, output_dir, "liveportrait")
    else:
        logger.warning(
            "LivePortrait requires CUDA GPU. Use --cloud or --strategy static."
        )
        return await _strategy_static(audio_path, config, output_dir)


# ---------------------------------------------------------------------------
# Strategy: EchoMimic V2 (CUDA GPU required)
# ---------------------------------------------------------------------------


async def _strategy_echomimic(
    audio_path: Path,
    config: dict[str, Any],
    output_dir: Path,
    use_cloud: bool = False,
) -> AvatarResult:
    """Generate semi-body avatar with gestures using EchoMimic V2.

    Requires CUDA GPU. Can offload to RunPod.
    """
    gpu_info = _check_gpu()

    if gpu_info["cuda_available"] and not use_cloud:
        # TODO: Local EchoMimic inference
        logger.warning("EchoMimic local not yet implemented, falling back to static")
        return await _strategy_static(audio_path, config, output_dir)
    elif use_cloud:
        return await _avatar_cloud(audio_path, config, output_dir, "echomimic")
    else:
        logger.warning(
            "EchoMimic requires CUDA GPU. Use --cloud or --strategy static."
        )
        return await _strategy_static(audio_path, config, output_dir)


# ---------------------------------------------------------------------------
# Cloud GPU Execution (RunPod)
# ---------------------------------------------------------------------------


async def _avatar_cloud(
    audio_path: Path,
    config: dict[str, Any],
    output_dir: Path,
    model_name: str,
) -> AvatarResult:
    """Offload avatar generation to RunPod serverless GPU.

    This uploads the audio and reference image/video to RunPod,
    runs the model, and downloads the result.
    """
    import httpx
    import os
    import base64

    avatar_cfg = config.get("avatar", {})
    cloud_cfg = avatar_cfg.get("cloud", {})

    api_key = cloud_cfg.get("api_key", "") or os.environ.get("RUNPOD_API_KEY", "")
    if not api_key:
        logger.error(
            "RunPod API key not set. Set RUNPOD_API_KEY environment variable "
            "or avatar.cloud.api_key in config."
        )
        logger.info("Falling back to static avatar")
        return await _strategy_static(audio_path, config, output_dir)

    # Prepare payload
    audio_b64 = base64.b64encode(audio_path.read_bytes()).decode()

    # Get reference image/video
    ref_path = None
    if model_name == "musetalk":
        ref_file = avatar_cfg.get("base_video_path", "")
    else:
        ref_file = avatar_cfg.get("photo_path", "")

    if ref_file:
        ref_path = Path(ref_file)
        if not ref_path.is_absolute():
            ref_path = PROJECT_ROOT / ref_path

    ref_b64 = ""
    if ref_path and ref_path.exists():
        ref_b64 = base64.b64encode(ref_path.read_bytes()).decode()

    payload = {
        "input": {
            "model": model_name,
            "audio_b64": audio_b64,
            "reference_b64": ref_b64,
            "reference_type": "video" if model_name == "musetalk" else "image",
        }
    }

    # Submit job to RunPod
    endpoint_id = cloud_cfg.get("endpoint_id", "")
    if not endpoint_id:
        logger.error("RunPod endpoint_id not configured")
        return await _strategy_static(audio_path, config, output_dir)

    base_url = f"https://api.runpod.ai/v2/{endpoint_id}"

    async with httpx.AsyncClient(timeout=300) as client:
        # Submit
        resp = await client.post(
            f"{base_url}/run",
            json=payload,
            headers={"Authorization": f"Bearer {api_key}"},
        )
        resp.raise_for_status()
        job = resp.json()
        job_id = job["id"]
        logger.info("RunPod job submitted: %s (model=%s)", job_id, model_name)

        # Poll for completion
        for attempt in range(60):  # Max 5 minutes
            await asyncio.sleep(5)
            status_resp = await client.get(
                f"{base_url}/status/{job_id}",
                headers={"Authorization": f"Bearer {api_key}"},
            )
            status_resp.raise_for_status()
            status_data = status_resp.json()
            status = status_data.get("status")

            if status == "COMPLETED":
                # Download result
                output_b64 = status_data.get("output", {}).get("video_b64", "")
                if output_b64:
                    output_video = output_dir / f"avatar_{model_name}.mp4"
                    output_video.write_bytes(base64.b64decode(output_b64))
                    duration = await _get_audio_duration(audio_path)
                    logger.info("Cloud avatar downloaded: %s", output_video)
                    return AvatarResult(
                        strategy=model_name,
                        video_path=str(output_video),
                        image_path=None,
                        duration=duration,
                        is_placeholder=False,
                        cloud_job_id=job_id,
                    )
                else:
                    logger.error("RunPod job completed but no video output")
                    break

            elif status == "FAILED":
                error = status_data.get("error", "Unknown error")
                logger.error("RunPod job failed: %s", error)
                break

            logger.debug("RunPod job %s: status=%s (attempt %d)", job_id, status, attempt)

    logger.warning("Cloud avatar generation failed, falling back to static")
    return await _strategy_static(audio_path, config, output_dir)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

STRATEGY_MAP = {
    "static": _strategy_static,
    "musetalk": _strategy_musetalk,
    "liveportrait": _strategy_liveportrait,
    "echomimic": _strategy_echomimic,
}


async def generate_avatar(
    audio_path: Path | str,
    config: dict[str, Any],
    strategy: str | None = None,
    use_cloud: bool = False,
    output_dir: Path | str | None = None,
) -> AvatarResult:
    """Generate avatar video/image from narration audio.

    Args:
        audio_path: Path to narration WAV.
        config: Full pipeline configuration.
        strategy: Override avatar strategy.
        use_cloud: Force cloud GPU execution.
        output_dir: Where to save avatar output.

    Returns:
        AvatarResult with paths to generated assets.
    """
    audio_path = Path(audio_path)
    if not audio_path.is_absolute():
        audio_path = PROJECT_ROOT / audio_path

    if not audio_path.exists():
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    if output_dir is None:
        output_dir = PROJECT_ROOT / config.get("pipeline", {}).get("output_dir", "output")
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    strategy_name = strategy or config.get("avatar", {}).get("strategy", "static")
    strategy_fn = STRATEGY_MAP.get(strategy_name)

    if strategy_fn is None:
        logger.error("Unknown avatar strategy: %s. Using 'static'.", strategy_name)
        strategy_fn = _strategy_static

    # Check GPU and log info
    gpu_info = _check_gpu()
    logger.info(
        "Avatar generation: strategy=%s, GPU=%s, cloud=%s",
        strategy_name,
        gpu_info.get("gpu_name", "none"),
        use_cloud,
    )

    # Strategies that need GPU accept use_cloud parameter
    if strategy_name in ("musetalk", "liveportrait", "echomimic"):
        return await strategy_fn(audio_path, config, output_dir, use_cloud)
    else:
        return await strategy_fn(audio_path, config, output_dir)


def get_gpu_info() -> dict[str, Any]:
    """Get GPU information for display/debugging."""
    info = _check_gpu()
    info["strategies_available"] = []

    if info["cuda_available"]:
        info["strategies_available"] = ["static", "musetalk", "liveportrait", "echomimic"]
    elif info["mps_available"]:
        info["strategies_available"] = ["static"]
        info["note"] = (
            "Apple Silicon MPS detected. Avatar lip-sync models require CUDA GPU. "
            "Use --cloud flag to offload to RunPod, or use 'static' strategy for testing."
        )
    else:
        info["strategies_available"] = ["static"]
        info["note"] = "No GPU detected. Use 'static' strategy or --cloud flag."

    return info


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate avatar video from narration audio")
    parser.add_argument(
        "--audio", type=str, required=True,
        help="Path to narration WAV file",
    )
    parser.add_argument(
        "--strategy", type=str, default=None,
        choices=list(STRATEGY_MAP.keys()),
        help="Avatar generation strategy",
    )
    parser.add_argument(
        "--cloud", action="store_true",
        help="Use cloud GPU (RunPod) for generation",
    )
    parser.add_argument(
        "--output-dir", type=str, default=None,
        help="Output directory for avatar assets",
    )
    parser.add_argument(
        "--gpu-info", action="store_true",
        help="Print GPU info and available strategies, then exit",
    )
    parser.add_argument(
        "--config", type=str, default=None,
        help="Optional config file override",
    )
    args = parser.parse_args()

    config = load_config(args.config)
    setup_logging(config)

    if args.gpu_info:
        info = get_gpu_info()
        print(json.dumps(info, indent=2))
        return

    result = asyncio.run(
        generate_avatar(args.audio, config, args.strategy, args.cloud, args.output_dir)
    )
    print(json.dumps(result.to_dict(), indent=2))


if __name__ == "__main__":
    main()

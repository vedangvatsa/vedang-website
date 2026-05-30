"""
avatar_cloud.py — RunPod Serverless Template for Avatar Generation

This module provides:
  1. A handler function for RunPod serverless workers
  2. A Dockerfile template for building the worker image
  3. Helper code to manage RunPod endpoints

This file is meant to run ON the RunPod worker (CUDA GPU), not locally.

Local usage (for managing endpoints):
    python -m scripts.avatar_cloud --action create-endpoint
    python -m scripts.avatar_cloud --action list-endpoints
"""

from __future__ import annotations

import argparse
import base64
import json
import logging
import os
import sys
import tempfile
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)


# ============================================================================
# RunPod Serverless Handler
# ============================================================================
# This handler runs on the RunPod GPU worker.
# It receives base64-encoded audio + reference, runs the model, returns video.
# ============================================================================

RUNPOD_HANDLER = '''
"""RunPod Serverless Handler for Avatar Generation."""

import base64
import os
import tempfile
import runpod

def handler(event):
    """
    RunPod serverless handler.

    Input:
        event["input"]["model"]: "musetalk" | "liveportrait" | "echomimic"
        event["input"]["audio_b64"]: base64 encoded audio WAV
        event["input"]["reference_b64"]: base64 encoded reference image/video
        event["input"]["reference_type"]: "image" | "video"

    Output:
        {"video_b64": base64 encoded output video}
    """
    input_data = event["input"]
    model_name = input_data.get("model", "musetalk")
    audio_b64 = input_data["audio_b64"]
    reference_b64 = input_data.get("reference_b64", "")
    reference_type = input_data.get("reference_type", "image")

    with tempfile.TemporaryDirectory() as tmpdir:
        # Save audio
        audio_path = os.path.join(tmpdir, "audio.wav")
        with open(audio_path, "wb") as f:
            f.write(base64.b64decode(audio_b64))

        # Save reference
        ref_ext = ".mp4" if reference_type == "video" else ".png"
        ref_path = os.path.join(tmpdir, f"reference{ref_ext}")
        if reference_b64:
            with open(ref_path, "wb") as f:
                f.write(base64.b64decode(reference_b64))

        # Output path
        output_path = os.path.join(tmpdir, "output.mp4")

        # Run model
        if model_name == "musetalk":
            _run_musetalk(audio_path, ref_path, output_path)
        elif model_name == "liveportrait":
            _run_liveportrait(audio_path, ref_path, output_path)
        elif model_name == "echomimic":
            _run_echomimic(audio_path, ref_path, output_path)
        else:
            return {"error": f"Unknown model: {model_name}"}

        # Read output and encode
        if os.path.exists(output_path):
            with open(output_path, "rb") as f:
                video_b64 = base64.b64encode(f.read()).decode()
            return {"video_b64": video_b64}
        else:
            return {"error": "Output video not generated"}


def _run_musetalk(audio_path, ref_path, output_path):
    """Run MuseTalk inference."""
    # MuseTalk integration:
    # https://github.com/TMElyralab/MuseTalk
    #
    # Steps:
    # 1. Extract frames from reference video
    # 2. Run face parsing
    # 3. Generate audio features
    # 4. Run lip-sync inference
    # 5. Reconstruct video
    import subprocess
    subprocess.run([
        "python", "-m", "musetalk.inference",
        "--audio", audio_path,
        "--video", ref_path,
        "--output", output_path,
    ], check=True)


def _run_liveportrait(audio_path, ref_path, output_path):
    """Run LivePortrait + MuseTalk pipeline."""
    # LivePortrait: https://github.com/KwaiVGI/LivePortrait
    #
    # Steps:
    # 1. Generate motion from audio using LivePortrait
    # 2. Apply motion to reference photo
    # 3. Run MuseTalk for lip sync on generated video
    import subprocess
    # Step 1: LivePortrait animation
    animated = output_path.replace(".mp4", "_animated.mp4")
    subprocess.run([
        "python", "-m", "liveportrait.inference",
        "--source", ref_path,
        "--audio", audio_path,
        "--output", animated,
    ], check=True)
    # Step 2: MuseTalk lip sync
    subprocess.run([
        "python", "-m", "musetalk.inference",
        "--audio", audio_path,
        "--video", animated,
        "--output", output_path,
    ], check=True)


def _run_echomimic(audio_path, ref_path, output_path):
    """Run EchoMimic V2 inference."""
    # EchoMimic V2: https://github.com/antgroup/echomimic_v2
    #
    # Generates semi-body avatar with hand gestures
    import subprocess
    subprocess.run([
        "python", "-m", "echomimic_v2.inference",
        "--audio", audio_path,
        "--reference", ref_path,
        "--output", output_path,
    ], check=True)


runpod.serverless.start({"handler": handler})
'''

# ============================================================================
# Dockerfile Template
# ============================================================================

DOCKERFILE_TEMPLATE = '''# RunPod Serverless Worker for Avatar Generation
# Build: docker build -t vedang/avatar-pipeline:latest .
# Push:  docker push vedang/avatar-pipeline:latest

FROM runpod/pytorch:2.1.0-py3.10-cuda12.1.0-devel-ubuntu22.04

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y \\
    ffmpeg \\
    libgl1-mesa-glx \\
    libglib2.0-0 \\
    git \\
    && rm -rf /var/lib/apt/lists/*

# Python dependencies
COPY requirements-cloud.txt .
RUN pip install --no-cache-dir -r requirements-cloud.txt

# Install avatar models
# Uncomment the model(s) you want to support:

# MuseTalk
# RUN git clone https://github.com/TMElyralab/MuseTalk.git /app/musetalk && \\
#     cd /app/musetalk && pip install -r requirements.txt

# LivePortrait
# RUN git clone https://github.com/KwaiVGI/LivePortrait.git /app/liveportrait && \\
#     cd /app/liveportrait && pip install -r requirements.txt

# EchoMimic V2
# RUN git clone https://github.com/antgroup/echomimic_v2.git /app/echomimic_v2 && \\
#     cd /app/echomimic_v2 && pip install -r requirements.txt

# Copy handler
COPY handler.py .

# Download model weights (do this in build to avoid cold start)
# RUN python -c "from musetalk import download_models; download_models()"

CMD ["python", "handler.py"]
'''

REQUIREMENTS_CLOUD = """# Cloud worker requirements
runpod>=1.6.0
torch>=2.1.0
torchaudio>=2.1.0
torchvision>=0.16.0
numpy>=1.24.0
opencv-python>=4.8.0
ffmpeg-python>=0.2.0
Pillow>=10.0.0
scipy>=1.11.0
"""


# ============================================================================
# Local Management (create/manage RunPod endpoints)
# ============================================================================


async def create_endpoint(config: dict[str, Any]) -> dict[str, Any]:
    """Create a RunPod serverless endpoint."""
    import httpx

    api_key = os.environ.get("RUNPOD_API_KEY", "")
    if not api_key:
        raise ValueError("RUNPOD_API_KEY environment variable not set")

    cloud_cfg = config.get("avatar", {}).get("cloud", {})
    docker_image = cloud_cfg.get("docker_image", "vedang/avatar-pipeline:latest")
    gpu_type = cloud_cfg.get("gpu_type", "NVIDIA RTX A5000")

    payload = {
        "name": "ai-avatar-pipeline",
        "dockerImage": docker_image,
        "gpuType": gpu_type,
        "minWorkers": 0,
        "maxWorkers": 1,
        "idleTimeout": 300,
        "scalerType": "QUEUE_DELAY",
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.runpod.ai/v2/endpoints",
            json=payload,
            headers={"Authorization": f"Bearer {api_key}"},
        )
        resp.raise_for_status()
        return resp.json()


def generate_cloud_files(output_dir: Path) -> None:
    """Generate the RunPod worker files (Dockerfile, handler, requirements)."""
    output_dir.mkdir(parents=True, exist_ok=True)

    (output_dir / "handler.py").write_text(RUNPOD_HANDLER)
    (output_dir / "Dockerfile").write_text(DOCKERFILE_TEMPLATE)
    (output_dir / "requirements-cloud.txt").write_text(REQUIREMENTS_CLOUD)

    logger.info("Generated RunPod worker files in %s", output_dir)
    logger.info("  → handler.py")
    logger.info("  → Dockerfile")
    logger.info("  → requirements-cloud.txt")
    logger.info("")
    logger.info("Next steps:")
    logger.info("  1. cd %s", output_dir)
    logger.info("  2. Uncomment the model(s) you want in Dockerfile")
    logger.info("  3. docker build -t vedang/avatar-pipeline:latest .")
    logger.info("  4. docker push vedang/avatar-pipeline:latest")
    logger.info("  5. Create RunPod endpoint: python -m scripts.avatar_cloud --action create-endpoint")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(description="RunPod cloud avatar management")
    parser.add_argument(
        "--action", type=str, required=True,
        choices=["generate-files", "create-endpoint", "gpu-info"],
        help="Action to perform",
    )
    parser.add_argument(
        "--output-dir", type=str, default="cloud",
        help="Directory for generated cloud worker files",
    )
    parser.add_argument(
        "--config", type=str, default=None,
        help="Optional config file override",
    )
    args = parser.parse_args()

    from scripts.config_loader import load_config, setup_logging, PROJECT_ROOT

    config = load_config(args.config)
    setup_logging(config)

    if args.action == "generate-files":
        output_dir = Path(args.output_dir)
        if not output_dir.is_absolute():
            output_dir = PROJECT_ROOT / output_dir
        generate_cloud_files(output_dir)

    elif args.action == "create-endpoint":
        import asyncio
        result = asyncio.run(create_endpoint(config))
        print(json.dumps(result, indent=2))

    elif args.action == "gpu-info":
        from scripts.generate_avatar import get_gpu_info
        info = get_gpu_info()
        print(json.dumps(info, indent=2))


if __name__ == "__main__":
    main()

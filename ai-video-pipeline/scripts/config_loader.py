"""
Configuration loader — merges default.yaml with optional local.yaml overrides.

Usage:
    from scripts.config_loader import load_config
    cfg = load_config()
    print(cfg["llm"]["model"])
"""

from __future__ import annotations

import copy
import logging
import os
from pathlib import Path
from typing import Any

import yaml

logger = logging.getLogger(__name__)

# Project root is one level above scripts/
PROJECT_ROOT = Path(__file__).resolve().parent.parent
CONFIG_DIR = PROJECT_ROOT / "config"


def _deep_merge(base: dict[str, Any], override: dict[str, Any]) -> dict[str, Any]:
    """Recursively merge *override* into *base*, returning a new dict."""
    merged = copy.deepcopy(base)
    for key, value in override.items():
        if key in merged and isinstance(merged[key], dict) and isinstance(value, dict):
            merged[key] = _deep_merge(merged[key], value)
        else:
            merged[key] = copy.deepcopy(value)
    return merged


def load_config(config_path: str | Path | None = None) -> dict[str, Any]:
    """Load pipeline configuration.

    Resolution order:
        1. config/default.yaml  (always loaded)
        2. config/local.yaml    (merged on top if it exists)
        3. *config_path*        (merged on top if provided)
        4. Environment variable overrides (AI_PIPELINE_*)

    Returns:
        Fully-merged configuration dictionary.
    """
    # 1. Load defaults
    default_file = CONFIG_DIR / "default.yaml"
    if not default_file.exists():
        raise FileNotFoundError(f"Default config not found: {default_file}")

    with open(default_file) as f:
        config = yaml.safe_load(f) or {}

    logger.debug("Loaded default config from %s", default_file)

    # 2. Merge local overrides
    local_file = CONFIG_DIR / "local.yaml"
    if local_file.exists():
        with open(local_file) as f:
            local_cfg = yaml.safe_load(f) or {}
        config = _deep_merge(config, local_cfg)
        logger.debug("Merged local config from %s", local_file)

    # 3. Merge explicit config path
    if config_path:
        config_path = Path(config_path)
        if config_path.exists():
            with open(config_path) as f:
                extra_cfg = yaml.safe_load(f) or {}
            config = _deep_merge(config, extra_cfg)
            logger.debug("Merged extra config from %s", config_path)
        else:
            logger.warning("Provided config path does not exist: %s", config_path)

    # 4. Environment variable overrides
    env_overrides: dict[str, tuple[list[str], str]] = {
        "AI_PIPELINE_LLM_MODEL": (["llm", "model"], ""),
        "AI_PIPELINE_VOICE_ENGINE": (["voice", "engine"], ""),
        "AI_PIPELINE_AVATAR_STRATEGY": (["avatar", "strategy"], ""),
        "AI_PIPELINE_LOG_LEVEL": (["pipeline", "log_level"], ""),
        "RUNPOD_API_KEY": (["avatar", "cloud", "api_key"], ""),
    }
    for env_var, (key_path, _default) in env_overrides.items():
        value = os.environ.get(env_var)
        if value:
            # Walk into nested config and set value
            d = config
            for k in key_path[:-1]:
                d = d.setdefault(k, {})
            d[key_path[-1]] = value
            logger.debug("Applied env override %s → %s", env_var, ".".join(key_path))

    return config


def resolve_path(config: dict[str, Any], key: str) -> Path:
    """Resolve a config path value relative to PROJECT_ROOT."""
    value = config
    for part in key.split("."):
        value = value[part]
    p = Path(str(value))
    if not p.is_absolute():
        p = PROJECT_ROOT / p
    return p


def setup_logging(config: dict[str, Any]) -> None:
    """Configure logging from pipeline settings."""
    level_str = config.get("pipeline", {}).get("log_level", "INFO")
    level = getattr(logging, level_str.upper(), logging.INFO)

    logging.basicConfig(
        level=level,
        format="%(asctime)s │ %(name)-24s │ %(levelname)-7s │ %(message)s",
        datefmt="%H:%M:%S",
    )
    # Quiet noisy libraries
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)


# --- Quick self-test ---
if __name__ == "__main__":
    cfg = load_config()
    setup_logging(cfg)
    logger.info("Config loaded successfully")
    import json
    print(json.dumps(cfg, indent=2, default=str))

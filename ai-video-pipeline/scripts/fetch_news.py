"""
fetch_news.py — News Aggregation Module

Fetches and ranks tech news from multiple RSS feeds.
Works standalone via CLI or as an importable module.

Standalone:
    python -m scripts.fetch_news --max-stories 5 --output output/news.json

As module:
    from scripts.fetch_news import fetch_news
    stories = await fetch_news(config)
"""

from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
import logging
import re
import sys
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import feedparser
import httpx
from bs4 import BeautifulSoup

from scripts.config_loader import PROJECT_ROOT, load_config, setup_logging

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Data Models
# ---------------------------------------------------------------------------


@dataclass
class NewsStory:
    """A single news story extracted from an RSS feed."""

    title: str
    summary: str
    url: str
    source: str
    category: str
    published: str  # ISO-8601
    image_url: str = ""
    score: float = 0.0
    story_id: str = ""

    def __post_init__(self) -> None:
        if not self.story_id:
            self.story_id = hashlib.sha256(self.url.encode()).hexdigest()[:12]


# ---------------------------------------------------------------------------
# Feed Parsing
# ---------------------------------------------------------------------------


def _extract_image(entry: Any) -> str:
    """Best-effort extraction of a hero image from a feed entry."""
    # 1. media:content or media:thumbnail
    for media in getattr(entry, "media_content", []):
        url = media.get("url", "")
        if url:
            return url

    media_thumb = getattr(entry, "media_thumbnail", None)
    if media_thumb and isinstance(media_thumb, list):
        return media_thumb[0].get("url", "")

    # 2. Enclosures (podcasts / image attachments)
    for enc in getattr(entry, "enclosures", []):
        if enc.get("type", "").startswith("image/"):
            return enc.get("href", "")

    # 3. Parse <img> from summary HTML
    summary_html = getattr(entry, "summary", "")
    if summary_html:
        soup = BeautifulSoup(summary_html, "html.parser")
        img = soup.find("img")
        if img and img.get("src"):
            return img["src"]

    return ""


def _clean_html(html: str) -> str:
    """Strip HTML tags and collapse whitespace."""
    text = BeautifulSoup(html, "html.parser").get_text(separator=" ")
    return re.sub(r"\s+", " ", text).strip()


def _parse_published(entry: Any) -> datetime:
    """Parse published date from a feed entry, fallback to now."""
    published_parsed = getattr(entry, "published_parsed", None)
    if published_parsed:
        try:
            from time import mktime
            return datetime.fromtimestamp(mktime(published_parsed), tz=timezone.utc)
        except (OverflowError, ValueError, OSError):
            pass

    updated_parsed = getattr(entry, "updated_parsed", None)
    if updated_parsed:
        try:
            from time import mktime
            return datetime.fromtimestamp(mktime(updated_parsed), tz=timezone.utc)
        except (OverflowError, ValueError, OSError):
            pass

    return datetime.now(tz=timezone.utc)


async def _fetch_feed(
    client: httpx.AsyncClient,
    feed_cfg: dict[str, Any],
) -> list[NewsStory]:
    """Fetch and parse a single RSS feed."""
    url = feed_cfg["url"]
    source = feed_cfg["name"]
    category = feed_cfg.get("category", "general")
    priority = feed_cfg.get("priority", 5)

    logger.info("Fetching feed: %s (%s)", source, url)

    try:
        resp = await client.get(url, follow_redirects=True, timeout=15.0)
        resp.raise_for_status()
    except httpx.HTTPError as exc:
        logger.warning("Failed to fetch %s: %s", source, exc)
        return []

    feed = feedparser.parse(resp.text)
    stories: list[NewsStory] = []

    for entry in feed.entries[:15]:  # Cap per-feed to avoid domination
        published_dt = _parse_published(entry)

        # Compute recency score (higher = more recent)
        age_hours = (datetime.now(tz=timezone.utc) - published_dt).total_seconds() / 3600
        recency_score = max(0, 100 - age_hours * 2)  # Decays over ~50 hours

        # Priority bonus (lower priority number = higher bonus)
        priority_bonus = (5 - priority) * 10

        raw_summary = getattr(entry, "summary", "") or getattr(entry, "description", "")

        story = NewsStory(
            title=entry.get("title", "Untitled"),
            summary=_clean_html(raw_summary)[:500],
            url=entry.get("link", ""),
            source=source,
            category=category,
            published=published_dt.isoformat(),
            image_url=_extract_image(entry),
            score=recency_score + priority_bonus,
        )
        stories.append(story)

    logger.info("  → Got %d stories from %s", len(stories), source)
    return stories


# ---------------------------------------------------------------------------
# Ranking
# ---------------------------------------------------------------------------

# Keywords that boost relevance for tech/AI news reels
_BOOST_KEYWORDS = [
    "ai", "artificial intelligence", "chatgpt", "openai", "google", "apple",
    "microsoft", "meta", "nvidia", "startup", "funding", "launch", "release",
    "breakthrough", "open source", "llm", "gpt", "model", "robot",
    "autonomous", "crypto", "bitcoin", "security", "hack", "data",
]


def _score_relevance(story: NewsStory) -> float:
    """Add keyword-based relevance score to the base recency score."""
    text = f"{story.title} {story.summary}".lower()
    keyword_hits = sum(1 for kw in _BOOST_KEYWORDS if kw in text)
    keyword_bonus = min(keyword_hits * 5, 30)  # Cap at 30 bonus points
    return story.score + keyword_bonus


def rank_stories(stories: list[NewsStory], max_stories: int = 5) -> list[NewsStory]:
    """Deduplicate, re-score, and return top stories."""
    # Deduplicate by URL
    seen_urls: set[str] = set()
    unique: list[NewsStory] = []
    for s in stories:
        if s.url not in seen_urls:
            seen_urls.add(s.url)
            s.score = _score_relevance(s)
            unique.append(s)

    # Sort by score descending
    unique.sort(key=lambda s: s.score, reverse=True)

    logger.info("Ranked %d unique stories, returning top %d", len(unique), max_stories)
    return unique[:max_stories]


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


async def fetch_news(config: dict[str, Any]) -> list[NewsStory]:
    """Fetch news from all configured RSS feeds.

    Args:
        config: Full pipeline configuration dict.

    Returns:
        Ranked list of NewsStory objects.
    """
    feeds = config.get("feeds", [])
    if not feeds:
        logger.error("No feeds configured")
        return []

    max_stories = config.get("pipeline", {}).get("max_stories", 5)

    async with httpx.AsyncClient(
        headers={"User-Agent": "AI-Video-Pipeline/0.1 (RSS Reader)"},
    ) as client:
        tasks = [_fetch_feed(client, feed_cfg) for feed_cfg in feeds]
        results = await asyncio.gather(*tasks, return_exceptions=True)

    all_stories: list[NewsStory] = []
    for result in results:
        if isinstance(result, Exception):
            logger.warning("Feed task failed: %s", result)
        elif isinstance(result, list):
            all_stories.extend(result)

    return rank_stories(all_stories, max_stories)


def stories_to_json(stories: list[NewsStory]) -> list[dict[str, Any]]:
    """Convert stories to JSON-serializable dicts."""
    return [asdict(s) for s in stories]


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch and rank tech news from RSS feeds")
    parser.add_argument(
        "--max-stories", type=int, default=None,
        help="Override max stories to return",
    )
    parser.add_argument(
        "--output", type=str, default=None,
        help="Output JSON file path (default: stdout)",
    )
    parser.add_argument(
        "--config", type=str, default=None,
        help="Optional config file override",
    )
    args = parser.parse_args()

    config = load_config(args.config)
    setup_logging(config)

    if args.max_stories:
        config.setdefault("pipeline", {})["max_stories"] = args.max_stories

    stories = asyncio.run(fetch_news(config))
    output = json.dumps(stories_to_json(stories), indent=2, ensure_ascii=False)

    if args.output:
        out_path = Path(args.output)
        if not out_path.is_absolute():
            out_path = PROJECT_ROOT / out_path
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(output, encoding="utf-8")
        logger.info("Wrote %d stories to %s", len(stories), out_path)
    else:
        print(output)


if __name__ == "__main__":
    main()

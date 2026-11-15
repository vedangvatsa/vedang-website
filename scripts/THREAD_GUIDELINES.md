# X (Twitter) Thread Production Guidelines & Architecture Rules

This document defines the strict, non-negotiable rules for drafting, validating, rendering, and queuing X threads for @vedangvatsa. Every future thread must comply 100% before being committed to `scripts/x-posts.json`.

---

## 1. Copywriting & Tone Rules

1. **Zero AI Fluff & No Buzzwords:**
   - Do NOT use: "dive in", "game-changer", "unleash", "delve", "paradigm shift", "plethora", "harnessing", "testament", "revolutionize".
   - Plain, direct, factual English only. State what the tool or concept does plainly.

2. **Tweet 1 (The Hook): Exactly 2 Lines**
   - Line 1: Strong factual statement / core problem (no hype).
   - Line 2: Empty line.
   - Line 3: Numbered list intro ending strictly with `🧵👇`.
   - *Example:*
     ```text
     1/ Software agents cannot open bank accounts, so crypto rails give them balance sheets.

     8 tools powering AI agents with wallets 🧵👇
     ```

3. **Tweets 2–9 (The Body / Tool Tweets):**
   - Heading line: `[Number]/ [Tool Name]`
   - Empty line.
   - 1-line plain definition.
   - Empty line.
   - Exactly 3 bullet points (`• `), concise and technical (under 50 chars each).
   - Empty line.
   - Clean, verified direct URL (must return HTTP 200).

4. **Character Limits:**
   - Strictly $\le 235$ weighted Twitter characters per tweet (accounting for 23 chars for all t.co URLs).

---

## 2. Media & Image Rules

1. **Tweet 1 Cover Image:**
   - Format: $2400 \times 1350$ px high-DPI canvas (`RGB`).
   - Style: Structured table matrix matching earlier threads.
   - Elements:
     - Title in `#0F172A` (64px bold).
     - Subtitle in `#475569` (32px regular).
     - 4-column structured table: `#`, `Tool / Project`, `Category / Layer` (in purple `#4F46E5`), and `Key Technical Capability` (in dark slate `#334155`).
     - Header border `#E2E8F0`, row borders `#F1F5F9`.

2. **Tweets 2–9 (Tool Screenshots):**
   - **Real, live browser screenshots only.**
   - Never use text template graphics for tool tweets.
   - Captured via headless Chromium at 1200x675 (2x deviceScaleFactor = 2400x1350).
   - Pre-flight check: URL must return HTTP 200 before capturing. Never capture 404, 403, or dead pages.

3. **Cross-Links & Quote Tweets (Tweets 10–12):**
   - **Strictly text-only (`image: null`).**
   - Never attach an image to a tweet that contains an X status link, so X displays the clean native quote preview card.

4. **Ending Tweet (Courses / Community):**
   - Must use the official, battle-tested assets:
     - Courses: `public/images/thread/common/courses_v2.png`
     - Web3 Channels: `public/images/thread/common/web3_channels.png`

---

## 3. Link Verification & Pre-Flight Checklist

Before adding any thread to `x-posts.json`:
1. Every URL must be tested via automated `HEAD`/`GET` request. Any URL returning 400+ must be replaced immediately.
2. Every image path in `x-posts.json` must be a valid GitHub raw URL pointing to an existing file in `public/images/thread/`.
3. Total thread structure:
   - Tweets 1–9: Cover + 8 tools (with screenshots)
   - Tweets 10–12: 1–3 relevant cross-links to past threads (text-only)
   - Tweet 13/14: Telegram community (text-only) + Free Courses announcement (with courses card)

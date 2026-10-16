# Visualization batch 2 publishing

Prepared 16 October 2026 following approval to commit the publishing assets and
queue updates and resume the existing posting schedule.

## Active batch

- 88 videos prepared for each of YouTube, Instagram, TikTok, LinkedIn, Facebook,
  Bluesky, Tumblr, Mastodon, Farcaster, X and Threads.
- YouTube, Instagram, TikTok and LinkedIn started publishing first. The batch is
  now extended to the remaining destinations with platform-specific captions.
- First video is Coffee, followed by an interleaved mix of the other topics.
- Posting slots remain 09:00, 14:00 and 20:00 Asia/Kolkata.
- The first entry is due in the current slot. Later entries run through
  14 November 2026. Delayed GitHub runs use the existing catch-up rules.
- Earlier 50-video queue entries and their publication receipts are preserved.

The ATM and secure-server videos remain outside the active queues. The ATM series
needs independent corroboration of its sharp discontinuities. The secure-server
video needs clearer on-screen wording for its certificate-count definition.
Both holds appear in `scripts/viz-batch2-assets/manifest.json`.

## Account reconnection holds

The 16 October account checks accepted Facebook, Bluesky, Tumblr, Mastodon and
Farcaster. X returned HTTP 401. Threads returned OAuth error 190 for a token that
expired on 14 October. Both blocked platforms have their 88 batch entries queued
with `paused: true`; no submission is attempted with the expired credentials.

The older unposted X and Threads entries are also explicitly paused, preserving
their original status and error evidence. This prevents the earlier campaign
from replaying when credentials are repaired. Paused entries never get marked
as published, and a used slot still blocks additional attempts in that slot.

To resume a blocked platform, update its credentials in GitHub Actions secrets,
run the read-only account preflight, then remove the pause only from its
`batchId: 2026-10-16` entries and remove that platform from the manifest's
`blockedPlatforms`. Keep the older campaign backlog paused.

## Assets and attribution

Videos and previews live in `scripts/viz-batch2-assets/`. File checksums match the
finished, frame-checked delivery. Source definitions, coverage notes, provider
caveats and music credits are in `public/viz-notes/51.txt` through `140.txt`,
excluding the held entries.

The `licensed-v2` captions keep data-source links and the required Scott Buckley
CC BY 4.0 credits. The existing concise caption format remains supported for the
earlier campaign. The second batch uses the same publication transports and
one-post-per-slot duplicate protection.

`licensed-short-v2` adapts the copy to the 280/300/500/1024-character limits.
Every short caption includes the data provider, a public link to the full source
and track notes, Scott Buckley attribution, his website and the CC BY 4.0 license
link. Full track titles remain in the linked notes when inline space is limited.

LinkedIn interprets commentary as little-text markup. The `licensed-v2` transport
escapes its reserved characters, including parentheses and URL fragments, so
captions retain their definitions and credits. The manual caption-repair workflow
updates an already published batch-2 post in place without creating another post
or changing its video.

## Publication evidence

The `viz-youtube-posts.json`, `viz-instagram-posts.json`, `viz-tiktok-posts.json`
and `viz-linkedin-posts.json` queues record attempted slots, remote post IDs,
publication times and status. An accepted Buffer request becomes posted only
after Buffer reports `sent`. Failed or ambiguous submissions block automatic
retries until reconciled.

Credential preflight run 38899452713 confirmed all four requested accounts.
The same diagnostic run found expired credentials for unrelated X and Threads
integrations, so its overall failure badge does not describe the four requested
accounts.

## Checks

- Publishing tests validate both caption formats, the 88-entry schedule, media
  hashes, held topics and three-digit notes URLs.
- Production website build and TypeScript checks passed.
- SVG validation passed; the essay dash scan found existing matches in unchanged
  essays. This publishing change does not modify essay content.

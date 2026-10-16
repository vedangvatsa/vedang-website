# Visualization batch 2 publishing

Prepared 16 October 2026 following approval to commit the publishing assets and
queue updates and resume the existing posting schedule.

## Active batch

- 88 videos added to each of YouTube, Instagram, TikTok and LinkedIn.
- First video is Coffee, followed by an interleaved mix of the other topics.
- Posting slots remain 09:00, 14:00 and 20:00 Asia/Kolkata.
- The first entry is due in the current slot. Later entries run through
  14 November 2026. Delayed GitHub runs use the existing catch-up rules.
- Earlier 50-video queue entries and their publication receipts are preserved.

The ATM and secure-server videos remain outside the active queues. The ATM series
needs independent corroboration of its sharp discontinuities. The secure-server
video needs clearer on-screen wording for its certificate-count definition.
Both holds appear in `scripts/viz-batch2-assets/manifest.json`.

## Assets and attribution

Videos and previews live in `scripts/viz-batch2-assets/`. File checksums match the
finished, frame-checked delivery. Source definitions, coverage notes, provider
caveats and music credits are in `public/viz-notes/51.txt` through `140.txt`,
excluding the held entries.

The `licensed-v2` captions keep data-source links and the required Scott Buckley
CC BY 4.0 credits. The existing concise caption format remains supported for the
earlier campaign. The second batch uses the same publication transports and
one-post-per-slot duplicate protection.

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

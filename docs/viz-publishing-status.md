# Viz publishing status

Checked September 24, 2026. Launch configuration starts Instagram, YouTube and TikTok via Buffer at the September 25, 09:00 IST slot. The direct-platform step is opt-in through workflow dispatch (`include_direct`); scheduled runs use only Buffer.

## Account evidence

| Destination | Evidence | Remaining check |
|---|---|---|
| YouTube, Instagram, TikTok through Buffer | Live account query confirms connected, unlocked channels. Live GraphQL validation accepts the exact `shareNow` inputs and response fields using `@skip`, so no post was created. Buffer key stored in GitHub Actions secrets. | Public media hosting and actual publication/status/link verification. |
| LinkedIn direct | Local identity request returned 401. Existing GitHub run reports `EXPIRED_ACCESS_TOKEN`. | Renew token in GitHub and local environment. |
| X direct | Existing GitHub run reports HTTP 401, Twitter error 89 (invalid or expired token). | Renew credentials with write/media permissions. |
| Threads direct | Existing GitHub run fails at Catbox, before account posting. New viz path uses configured HTTPS media and processing polling. | Check token and publish with accessible media. |
| Bluesky, Facebook, Tumblr, Mastodon, Farcaster direct | Secret names exist in GitHub. Recent run had no posts due, so it did not test their credentials. | Run preflight within Actions, then verify live video publication. |

Existing run inspected: https://github.com/vedangvatsa/vedang-website/actions/runs/35976898823 . Its successful job conclusion hid platform failures.

## Content and media

- Eleven queues contain 50 captions each. Each topic has eleven distinct versions; length checks use X URL weighting, Bluesky graphemes and Farcaster UTF-8 bytes.
- All captions use the video's actual date range. Definitions distinguish subscriptions from users, labour force from workers, current dollars from real growth, and shares from absolute totals. No inferred unique winner when source values tie.
- Fifty linked text notes preserve source definitions, coverage, interpolation details and music source links. These local `public/viz-notes/` files must be deployed before the links work.
- Repaired the missing music in video 32 (container ports). Its MP3 chapter metadata had produced an unwanted MP4 data stream. The mixer now removes chapter/data metadata and updates the archive receipt and CSV hash.
- All 50 videos pass H.264 1080x1920, 30-second, stereo AAC and non-silence checks. This does not identify each soundtrack acoustically or prove music licensing.
- **First soundtrack corrected:** “An Epic Story” required CC BY-SA 3.0, so video 1 now uses “Ascension” by Scott Buckley. CC BY 4.0 and the required attribution were checked on the composer's own page. The replacement is distinct from the other catalog tracks; captions, video and archive receipt were updated. The rest of the catalog still needs track-by-track license verification. Evidence and effective overrides are in `scripts/viz-assets/music-license-review.json`.

## Validation commands

```sh
npx tsx --test scripts/viz-publishing.test.ts
DRY_RUN=1 npx tsx scripts/buffer-viz-scheduled-executor.ts
DRY_RUN=1 npx tsx scripts/native-viz-scheduled-executor.ts
npx tsx scripts/viz-platform-preflight.ts
python3 scripts/check-viz-media.py
```

The preflight makes identity/read requests and uses a skipped Buffer mutation solely for schema validation. It cannot prove upload/write capability. Most direct credentials are only available within GitHub Actions; GitHub does not provide a secret-value read API.

`VIZ_MEDIA_BASE_URL` is configured in GitHub to the public repository's raw `main` URL, with repository-relative paths. MP4s and source notes ship with the launch commit. Buffer-side read-only checks pass for the three connected channels; actual publication and resulting links must be checked after the scheduled run. No test posts were published by the preflight.

LinkedIn and X credential renewal and the other direct-platform checks remain separate from this Buffer-only launch.

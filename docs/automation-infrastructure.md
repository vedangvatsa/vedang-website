# Automation Infrastructure Reference

## Platform Pipeline Overview

| Platform | Executor Script | Posts JSON | Workflow | Frequency | Secrets Required |
|----------|----------------|------------|----------|-----------|-----------------|
| LinkedIn | `scripts/linkedin-scheduled-executor.ts` | `scripts/linkedin-posts.json` | `linkedin-scheduler.yml` | Every 30 min | `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_PERSON_URN` |
| X (Twitter) | `scripts/x-scheduled-executor.ts` | `scripts/x-posts.json` | `x-scheduler.yml` | Every 30 min | `X_API_KEY`, `X_API_KEY_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET` |
| Bluesky | `scripts/bluesky-scheduled-executor.ts` | `scripts/bluesky-posts.json` | `bluesky-scheduler.yml` | Every 30 min | `BLUESKY_HANDLE`, `BLUESKY_APP_PASSWORD` |
| Facebook Page | `scripts/facebook-scheduled-executor.ts` | `scripts/facebook-posts.json` | `facebook-scheduler.yml` | Every 30 min | `FACEBOOK_PAGE_ID`, `FACEBOOK_PAGE_TOKEN` |
| Tumblr | `scripts/tumblr-scheduled-executor.ts` | `scripts/tumblr-posts.json` | `tumblr-scheduler.yml` | Every 30 min | `TUMBLR_CONSUMER_KEY`, `TUMBLR_CONSUMER_SECRET`, `TUMBLR_ACCESS_TOKEN`, `TUMBLR_ACCESS_SECRET`, `TUMBLR_BLOG_NAME` |
| Dev.to | `scripts/devto-scheduled-executor.ts` | `scripts/devto-posts.json` | `devto-scheduler.yml` | Daily 6AM UTC | `DEVTO_API_KEY` |
| Hashnode | `scripts/hashnode-scheduled-executor.ts` | `scripts/hashnode-posts.json` | `hashnode-scheduler.yml` | Daily 8AM UTC | `HASHNODE_TOKEN`, `HASHNODE_PUBLICATION_ID` |
| YouTube Shorts + IG Reels + TikTok (viz via Buffer) | `scripts/buffer-viz-scheduled-executor.ts` | `scripts/viz-{youtube,instagram,tiktok}-posts.json` | `viz-scheduler.yml` | 09:00/14:00/20:00 IST, `shareNow` when due | `BUFFER_API_KEY`; optional explicit channel IDs |
| LinkedIn, X, Bluesky, Facebook, Threads, Tumblr, Mastodon, Farcaster (viz direct) | `scripts/native-viz-scheduled-executor.ts` reuses platform upload functions | `scripts/viz-{platform}-posts.json` | `viz-scheduler.yml` | One video per platform per due slot | Existing platform secrets; public MP4 hosting for Threads and Farcaster |

## Token Expiration & Renewal

| Platform | Token Type | Expiration | Renewal Method |
|----------|-----------|------------|----------------|
| LinkedIn | OAuth 2.0 | 60 days | Re-authorize via LinkedIn OAuth flow |
| X (Twitter) | OAuth 1.0a | Never | Permanent unless revoked |
| Bluesky | App Password | Never | Permanent unless revoked |
| Facebook Page | Page Token | **Never** | Derived from long-lived user token; permanent |
| Google (YouTube) | OAuth 2.0 refresh token | Non-expiring | Re-authorize via `scripts/youtube-oauth.mjs` if revoked |
| TikTok | OAuth access token | ~24h | Auto-refreshed per run from `TIKTOK_REFRESH_TOKEN` (manual rotation if TikTok rotates it) |
| Buffer | API key | Non-expiring | Regenerate in Buffer dashboard if revoked. Free plan: 10 queued posts/channel (rolling); Essentials ~$5–6/mo per channel lifts caps |
| Tumblr | OAuth 1.0a | Never | Permanent unless revoked |
| Dev.to | API Key | Never | Permanent unless regenerated |
| Hashnode | PAT | Never | Permanent unless regenerated |

Tokens can expire or be revoked, and account permissions can change. A stored secret or a green scheduler run does not establish that publishing works. Use the read-only preflight and inspect returned post IDs/statuses.

### Viz video queues (eleven platforms)

- 50 data-viz videos with individual soundtracks, 11 queues, 550 distinct platform captions.
- Our workflow owns the timing. At a due slot Buffer receives `mode: shareNow` and `schedulingType: automatic`, **without `dueAt`**. It never receives `addToQueue` or `customScheduled` from the viz executors.
- Slots are 09:00/14:00/20:00 IST. GitHub Actions and platform video processing can delay publication; these are target times, not an exact-time guarantee.
- `VIZ_MEDIA_BASE_URL` must serve repository-relative MP4 paths over public HTTPS. There is no Catbox fallback in the viz path. Deploy `public/viz-notes/` too, since short captions link to those source and music notes.
- Buffer entries are marked posted only when its API reports `sent`. Accepted/processing posts retain their Buffer IDs for reconciliation. Uncertain outcomes stop that platform's queue rather than sending duplicates.
- Direct adapters use video upload/processing flows; Farcaster uses a public MP4 embed. Client playback still needs an end-to-end check.
- Queue generation preserves attempted/submitted/published entries. Regenerate with `node scripts/generate-viz-queues.mjs --manifest … --chart-dir … --start … --slots 09:00,14:00,20:00`.
- `scripts/viz-caption-copy.json` holds topic-specific editorial copy. `scripts/viz-captions.mjs` adapts it to each platform and rejects overlong captions and banned wording. Short captions link to full attribution instead of truncating it.
- Workflow dispatch defaults to `preflight`, which checks Buffer credentials without publishing. `dry-run` checks local media and every caption with no network calls or queue writes. Scheduled runs send due entries to YouTube, Instagram and TikTok through Buffer. Direct integrations run only when a manual dispatch explicitly sets `include_direct`.
- Failures make the new workflow fail visibly, while queue receipts are retained as artifacts and committed for recovery. Check receipts before rerunning a job interrupted during publishing or before queue persistence; GitHub filesystem state alone cannot guarantee exactly-once delivery after a runner crash.
- YouTube OAuth (fallback path only): run `npx tsx scripts/youtube-oauth.mjs` once, store the refresh token.
  TikTok OAuth (fallback path only): existing `scripts/tiktok-oauth.ts`.
- Buffer uses its connected integrations, but account restrictions, disconnections and media-processing errors can still prevent publication. Channel access and schema checks are not a successful publish test.
- GitHub Secrets cannot be read back into `.env.local`. Run checks inside Actions to use those credentials without exposing them. `BUFFER_API_KEY` was added to GitHub Secrets on 2026-09-24.
- Current evidence and activation blockers are in [viz-publishing-status.md](viz-publishing-status.md).

## Post JSON Structure

All `*-posts.json` files follow this structure:

```json
{
  "id": "unique-post-id",
  "text": "Post content",
  "image": "scripts/thread-assets/image.png",   // optional, relative path
  "scheduleDate": "2026-03-26",                  // IST date
  "scheduleTime": "09:27",                       // IST time (short-form only)
  "posted": false,                               // flipped to true after posting
  "postedAt": null,                              // ISO timestamp when posted
  "postId": null,                                // platform-specific post ID
  "error": null                                  // error message if failed
}
```

**Dev.to and Hashnode** have additional fields: `slug`, `title`, `tags`.

## How Scheduling Works

1. GitHub Actions cron triggers the workflow
2. Executor reads the JSON file
3. Compares current IST time against `scheduleDate` + `scheduleTime`
4. Posts all due (unposted) entries
5. Updates `posted`, `postedAt`, `postId` fields
6. Auto-commits the updated JSON back to the repo

**Timezone**: All times are IST (UTC+5:30). The executors add 5.5 hours to UTC.

## Adding New Posts

### Short-form (LinkedIn, X, Bluesky, Facebook, Tumblr)
1. Edit the platform's `*-posts.json`
2. Add a new entry with `"posted": false`
3. Set `scheduleDate` and `scheduleTime` in IST
4. If image: place file in `scripts/thread-assets/` and use relative path
5. Commit and push — GitHub Actions handles the rest

### Long-form (Dev.to, Hashnode)
1. Write the essay in `src/content/essays/{slug}.mdx`
2. Add entry to `devto-posts.json` / `hashnode-posts.json` with the `slug`
3. The executor extracts content from the MDX, strips components, and publishes
4. `canonical_url` automatically points to `veda.ng/essays/{slug}`

## API Endpoints Quick Reference

| Platform | Base URL | Auth Method |
|----------|----------|-------------|
| LinkedIn | `api.linkedin.com/v2/` | Bearer token |
| X | `api.twitter.com/2/` | OAuth 1.0a HMAC-SHA1 |
| Bluesky | `bsky.social/xrpc/` | Bearer JWT (session-based) |
| Facebook | `graph.facebook.com/v19.0/` | Access token in URL/body |
| Tumblr | `api.tumblr.com/v2/` | OAuth 1.0a |
| Dev.to | `dev.to/api/` | `api-key` header |
| Hashnode | `gql.hashnode.com` | `Authorization` header (GraphQL) |

## Account URLs

| Platform | Profile URL |
|----------|------------|
| LinkedIn | linkedin.com/in/vedangvatsa |
| X | x.com/vedangvatsa |
| Bluesky | bsky.app/profile/vedangvatsa.bsky.social |
| Facebook Page | facebook.com/VatsVedang (ID: 1785048661795414) |
| Tumblr | vedangvatsa.tumblr.com |
| Dev.to | dev.to/vedangvatsa |
| Hashnode | vedangvatsa.hashnode.dev |

## Troubleshooting

### Post not publishing
1. Check GitHub Actions logs: `Actions → [platform]-scheduler → Latest run`
2. Verify `scheduleDate` and `scheduleTime` are in the past (IST)
3. Verify `posted` is `false`
4. Check if there's an `error` field in the JSON

### Token expired (LinkedIn only)
1. Go to LinkedIn OAuth flow and re-authorize
2. Update `LINKEDIN_ACCESS_TOKEN` in both GitHub Secrets and `.env.local`

### Image upload failing
1. Verify the image file exists at the specified path
2. Check file size (Bluesky: 1MB limit, others: 5MB)
3. Ensure the image is PNG or JPEG

### Rate limiting
- LinkedIn: 100 posts/day
- X: 50 tweets/day (free tier), 300 tweets/day (basic)
- Bluesky: ~1700 actions/day
- Facebook: 200 posts/day
- Tumblr: 250 posts/day, 1000 requests/hour
- Dev.to: 30 articles/day
- Hashnode: No published limit

### Runner failures
- All workflows use `ubuntu-latest` with Node.js 20
- Dependencies installed via `npm ci`
- Scripts run via `npx tsx`
- Auto-commit via `stefanzweifel/git-auto-commit-action@v5`

## Local Development

```bash
# Test any executor locally
npx tsx scripts/[platform]-scheduled-executor.ts

# Credentials loaded from .env.local automatically
# Posts will actually publish — use with care

# Quick slop check across essays
grep -rni "explore\|tapestry\|\|model shift" src/content/essays/
```

## Future Upgrades

- [ ] Upgrade GitHub Actions from Node.js 20 to Node.js 24 (before June 2026)
- [ ] Add Instagram via Meta Graph API (requires Business/Creator account)
- [ ] Add Threads via Meta Threads API
- [ ] Add Mastodon (open API, simple token auth)
- [ ] Add Medium (integration token, essay cross-posting)
- [ ] LinkedIn token auto-renewal via refresh token flow

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

## Token Expiration & Renewal

| Platform | Token Type | Expiration | Renewal Method |
|----------|-----------|------------|----------------|
| LinkedIn | OAuth 2.0 | 60 days | Re-authorize via LinkedIn OAuth flow |
| X (Twitter) | OAuth 1.0a | Never | Permanent unless revoked |
| Bluesky | App Password | Never | Permanent unless revoked |
| Facebook Page | Page Token | **Never** | Derived from long-lived user token; permanent |
| Tumblr | OAuth 1.0a | Never | Permanent unless revoked |
| Dev.to | API Key | Never | Permanent unless regenerated |
| Hashnode | PAT | Never | Permanent unless regenerated |

⚠️ **LinkedIn is the only token that expires.** Set a calendar reminder for ~55 days to renew.

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
grep -rni "delve\|tapestry\|at its core\|paradigm shift" src/content/essays/
```

## Future Upgrades

- [ ] Upgrade GitHub Actions from Node.js 20 to Node.js 24 (before June 2026)
- [ ] Add Instagram via Meta Graph API (requires Business/Creator account)
- [ ] Add Threads via Meta Threads API
- [ ] Add Mastodon (open API, simple token auth)
- [ ] Add Medium (integration token, essay cross-posting)
- [ ] LinkedIn token auto-renewal via refresh token flow

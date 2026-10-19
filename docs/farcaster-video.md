# Farcaster video delivery

## Failure reproduced on 18 October 2026

The cotton cast at <https://farcaster.xyz/vedangvatsa/0xcf7d6ddf> displayed
"No preview found for shared link". Its public cast response had an empty
`embeds.videos` array and put the GitHub Raw MP4 in `embeds.unknowns`.
The source file returned HTTP 200, but its content type was
`application/octet-stream`, with `X-Content-Type-Options: nosniff`.
A successful cast submission therefore did not establish video playback.

## Delivery path

- `/api/social-video/<repository-relative-path>` streams approved MP4 assets
  from the public repository as `video/mp4` with inline disposition and CORS.
- GET, HEAD and single byte ranges are supported. The endpoint preserves
  partial responses, lengths and unsatisfiable-range responses.
- Paths are restricted to the existing visualization video directories and
  the two legacy video directories. It cannot fetch an arbitrary URL or file.
- An optional `ref` accepts `main` or a full Git commit SHA.
- GitHub Raw URLs for these assets are converted to the first-party endpoint.
  Existing HTTPS URLs on proper media hosts remain supported.
- `FARCASTER_MEDIA_PROXY_BASE_URL` can override the first-party base when a
  separate deployment serves the same endpoint. The default is
  `https://veda.ng/api/social-video`.

Before publishing, the scheduler checks the actual video MIME type and uses
[Neynar's embed metadata API](https://docs.neynar.com/reference/fetch-embedded-url-metadata)
to require resolved video metadata, a duration, and video dimensions. An
unready or invalid embed fails before a visualization queue slot is claimed.
The outgoing URL is retained as `videoEmbedUrl` in the publication receipt.
The legacy Farcaster scheduler also uses this path for MP4s and cannot silently
fall back to a text-only cast when video delivery fails.

## Rollout

Production runs on Cloudflare Workers. `veda-social-video` serves the two
`/api/social-video/*` routes configured in `workers/social-video/wrangler.jsonc`.
These more-specific routes take precedence over the main `veda-ng` website
routes. Both the Worker and the Next.js route use `src/lib/social-video.ts`.

A Git push alone does not deploy this Worker. Authenticate to the account in
the configuration, then validate and deploy from the repository root:

```sh
npx wrangler@4.151.1 whoami
npx wrangler@4.151.1 deploy --config workers/social-video/wrangler.jsonc --dry-run
npx wrangler@4.151.1 deploy --config workers/social-video/wrangler.jsonc --keep-vars
```

Deploy the media Worker before running the updated publisher. HEAD and a ranged
GET of the following URL must succeed as MP4 responses:

```
https://veda.ng/api/social-video/scripts/viz-batch2-assets/no-attribution/74-cotton-lint-2000-2023.mp4
```

In an environment with `NEYNAR_API_KEY`, this check validates delivery and
metadata without publishing a cast:

```sh
npx tsx -e "import { prepareVideoEmbed } from './scripts/farcaster-scheduled-executor.ts'; prepareVideoEmbed('https://raw.githubusercontent.com/vedangvatsa/vedang-website/main/scripts/viz-batch2-assets/no-attribution/74-cotton-lint-2000-2023.mp4').then(console.log).catch(error => { console.error(error.message); process.exitCode = 1; });"
```

When credentials are held in GitHub Secrets, run the **Farcaster Video Check
(read-only)** workflow. It checks the live media and Neynar metadata using only
`NEYNAR_API_KEY`. The check has no signer credential or queue-writing step.

```sh
gh workflow run farcaster-video-check.yml --ref main
```

Casts created before this change embedded their original GitHub Raw URLs.
Deploying the publisher does not rewrite those immutable embeds. Preserve
their queue receipts; do not mark them unposted or replay the queue.
The confirmed broken casts were removed separately on 19 October 2026.
Replacing an old cast is a separate publication decision, with a new cast hash
and separate engagement.

## Focused checks

```sh
npx tsx --test tests/social-video.test.ts scripts/farcaster-video.test.ts
npm run typecheck -- --incremental false
```

The scheduler's CI also runs these regressions with the existing visualization
suite. That broader suite requires its checked-out video assets and the
automation dependencies from `scripts/package.json`.

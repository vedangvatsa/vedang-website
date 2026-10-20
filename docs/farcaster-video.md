# Farcaster video delivery

## Failure reproduced on 18 October 2026

The cotton cast at <https://farcaster.xyz/vedangvatsa/0xcf7d6ddf> displayed
"No preview found for shared link". Its public cast response had an empty
`embeds.videos` array and put the GitHub Raw MP4 in `embeds.unknowns`.
The source file returned HTTP 200, but its content type was
`application/octet-stream`, with `X-Content-Type-Options: nosniff`.
A successful cast submission therefore did not establish video playback.

## Client failure confirmed on 20 October 2026

The wine, beer, banana, and pineapple casts published after the MIME fix still
had empty `embeds.videos` arrays in Farcaster's own cast responses. Neynar
recognized those MP4s and browsers played them, but Farcaster classified the
URLs as `unknown`. Its embed debugger reproduced this with a fresh URL too.
The same debugger classifies `.m3u8` URLs on `veda.ng` as video embeds.

Farcaster publishing therefore requires HLS. A valid MP4 MIME type and Neynar
metadata alone do not establish Farcaster client compatibility.

## Delivery path

- `/api/social-video/<repository-relative-path>` streams approved media from
  the public repository with inline disposition and CORS. MP4 files use
  `video/mp4`; HLS playlists use `application/vnd.apple.mpegurl`.
- HLS packages live in an `hls/` directory beside their original MP4s. A
  `.m3u8` playlist refers to byte ranges in a same-named fragmented `.mp4`.
- GET, HEAD and single byte ranges are supported. The endpoint preserves
  partial responses, lengths and unsatisfiable-range responses.
- Paths are restricted to the existing visualization video directories and
  the two legacy video directories. It cannot fetch an arbitrary URL or file.
- HLS URLs can include a full Git commit SHA before `scripts/`, which also
  pins relative media references to that revision. Original MP4 URLs continue
  to accept the `ref` query parameter.
- GitHub Raw MP4 URLs are converted to their packaged first-party HLS URLs.
  Existing HTTPS HLS URLs on media hosts remain supported.
- `FARCASTER_MEDIA_PROXY_BASE_URL` can override the first-party base when a
  separate deployment serves the same endpoint. The default is
  `https://veda.ng/api/social-video`.

Before publishing, the scheduler requires a `.m3u8` URL, the HLS MIME type,
and a valid playlist of at most 64 KiB. It then uses
[Neynar's embed metadata API](https://docs.neynar.com/reference/fetch-embedded-url-metadata)
to require resolved video metadata, a duration, and video dimensions. An
unready or invalid embed fails before a visualization queue slot is claimed.
The outgoing URL is retained as `videoEmbedUrl` in the publication receipt.
The legacy Farcaster scheduler also uses this path for MP4s and cannot silently
fall back to a text-only cast when video delivery fails.

## Package media

With FFmpeg and ffprobe installed, package the batch before deploying it:

```sh
npx tsx scripts/package-farcaster-hls.ts --batch=2026-10-16
```

Use `--only=viz-b2-farcaster-78` to package one entry. The command stream-copies
the video and audio into fragmented MP4 HLS, checks the resulting playlist with
ffprobe, and compares packet hashes before and after packaging. It records
source and output checksums in `scripts/farcaster-hls-assets.json`. It does not
alter queue publication state. Commit the playlists, media files, and receipts
together. The publishing tests verify that pending Farcaster entries have
complete packages matching their sources.

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

Deploy the media Worker before running the updated publisher. The playlist
must return HLS MIME, and byte-range requests for its relative MP4 must succeed:

```
https://veda.ng/api/social-video/scripts/viz-batch2-assets/no-attribution/hls/74-cotton-lint-2000-2023.m3u8
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

Also check the HLS URL in [Farcaster's embed debugger](https://farcaster.xyz/~/developers/embeds)
and verify a video player in the Farcaster composer or cast. Playback and
seeking must work there; a successful upload, HTTP response, or Neynar lookup
alone is insufficient.

Earlier casts embedded GitHub Raw or direct MP4 URLs.
Deploying the publisher does not rewrite those immutable embeds. Preserve
their queue receipts; do not mark them unposted or replay the queue.
The historical GitHub Raw and text-only casts were removed separately on
19 October 2026. The four direct-MP4 casts from 19 and 20 October require
separate replacement; changing delivery does not change their stored embeds.
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

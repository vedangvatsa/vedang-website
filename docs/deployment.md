# Website deployment

The website runs on the Cloudflare Worker `veda-ng`, using OpenNext.

- Account: `98dc3d9d6a9efe3231032ff064ac0a01`
- Zone: `164a5fbc833a7aaddc7341db48860954`
- Routes: `veda.ng/*` and `www.veda.ng/*`
- Configuration: `wrangler.jsonc` and `open-next.config.ts`

The narrower `/api/social-video/*` routes belong to `veda-social-video`. Its configuration and deployment are separate; see `docs/farcaster-video.md`.

## Before building

Fetch the current `main` and include any newer site changes before publishing. Commit and push approved edits so a later deployment does not restore an old page or old wording.

Run `npx wrangler whoami` and confirm access to the account above. Environment variables such as `CLOUDFLARE_API_KEY`, `CLOUDFLARE_EMAIL`, and `CLOUDFLARE_ACCOUNT_ID` may select a different account. Clear conflicting values for the deployment command. Keep credentials out of tracked files.

For multiple accounts, use a directory-scoped Wrangler profile:

```sh
npx wrangler auth create veda-website
npx wrangler auth activate veda-website
npx wrangler whoami
```

## Build and check

```sh
npm ci
npm run build:worker
npm run cf-typegen
npm run typecheck
npm run typecheck:worker
npm run preview:worker
```

The build runs the content generators and Next.js before packaging the Worker. Prerendered pages use the read-only Static Assets cache. Check the edited pages in the Workers preview before deploying.

`public/.assetsignore` excludes the two full research-corpus JSON files, which exceed the Workers asset limit. The smaller default report files remain available.

The OG generator skips existing images. After changing a post's title or preview text, regenerate its image and check it before deploying.

## Deploy and verify

Record the current version with `npx wrangler deployments list --name veda-ng`, then run:

```sh
npm run deploy:worker
```

This deploys the built output and preserves dashboard-managed variables and secrets. Verify the changed URLs, canonical tags, images, and mobile layout on `https://veda.ng`. For a deleted page, check for 404 with redirects disabled and confirm that discovery files no longer list it.

If a rollout fails verification, `npx wrangler rollback <VERSION_ID> --name veda-ng` restores the recorded version.

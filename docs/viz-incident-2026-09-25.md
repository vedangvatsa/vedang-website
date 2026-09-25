# Missed 09:00 IST video run, 25 September 2026

## Observed cause

At 05:04 UTC (10:34 IST), GitHub reported the viz workflow as active, with the correct `30 3,8,14 * * *` cron on `main`, but no scheduled run for the 03:30 UTC slot. Its only runs were the two previous manual preflights. Buffer had no posts created since 24 September for the three target channels. The absence of a workflow trigger prevented the 09:00 publication. GitHub did not expose a reason for the missing trigger; delay versus dropped execution cannot be distinguished from these logs.

A successful preflight verified credentials, schemas and media access, not future cron delivery. GitHub documents scheduled workflows as best-effort and potentially delayed or dropped.

## Recovery

Manually dispatched `viz-scheduler.yml` with `mode=publish`, `include_direct=false` after checking Buffer for duplicates. Run https://github.com/vedangvatsa/vedang-website/actions/runs/36097137498 published the population video on all three platforms. Independent post queries confirmed `status=sent`, `shareMode=shareNow`, and `schedulingType=automatic`.

| Platform | Sent at (IST) | Post |
|---|---|---|
| YouTube | 10:36:59 | https://www.youtube.com/watch?v=mv-wbdAb8C8 |
| Instagram | 10:37:54 | https://www.instagram.com/reel/Ddsq8wkiWLl/ |
| TikTok | 10:38:41 | https://tiktok.com/@vedangvatsa/video/7689335017843068180 |

Posting receipts were pushed in commit `055ba02b`. The job then failed in its redundant second Git operation, not in publishing: `skip_push` is not a supported input of `git-auto-commit-action@v5`, so the action had already committed and pushed. The following `git pull --rebase` failed because npm installation modified tracked files under `scripts/node_modules`. The video must not be reposted to correct that failed job.

## Changes

- Keep the three target posting slots and add catch-up checks at minutes 7, 17, 27, 37, 47 and 57 each hour.
- Share the same due-slot selection between a dependency-free workflow gate and the publisher. Skip dependency installation, video downloads and Buffer calls when no publication/reconciliation is due.
- Retain one attempted publication per platform per slot; repeated triggers do not drain the queue or duplicate a sent post.
- Remove the unsupported `skip_push` input and redundant rebase/push step. Queue artifacts remain available for recovery if persistence itself fails.

These catch-up checks reduce dependence on one cron event. They still use GitHub's scheduler and are not an exact-time guarantee.

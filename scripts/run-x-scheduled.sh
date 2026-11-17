#!/usr/bin/env bash
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
cd /Users/vedang/ZCodeProject/vedang-website || exit 1
git pull --rebase origin main >> /tmp/x-scheduler-cron.log 2>&1
/usr/local/bin/npx tsx scripts/x-scheduled-executor.ts >> /tmp/x-scheduler-cron.log 2>&1
git add scripts/x-posts.json >> /tmp/x-scheduler-cron.log 2>&1
if ! git diff --cached --quiet; then
  git commit -m "Automated: X post receipt update [skip ci]" >> /tmp/x-scheduler-cron.log 2>&1
  git push origin main >> /tmp/x-scheduler-cron.log 2>&1
fi

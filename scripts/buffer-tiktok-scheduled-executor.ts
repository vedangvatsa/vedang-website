#!/usr/bin/env node
// Compatibility entrypoint. Uses the same due-time shareNow path and state tracking.
import { channels, PLATFORMS, runPlatform } from './buffer-viz-scheduled-executor.js';
const dryRun = process.env.DRY_RUN === '1';
async function main() {
  await runPlatform(PLATFORMS[2], dryRun ? [] : await channels(), dryRun);
}
main().catch(err => {
  console.error(err.message);
  process.exitCode = 1;
});

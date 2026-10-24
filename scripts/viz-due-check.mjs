#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { needsBufferWork } from './viz-queue-time.mjs';
import { BUFFER_PLATFORMS, configuredDirectPlatforms } from './viz-platforms.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));
let needed = process.env.VIZ_FORCE_CHECKS === '1';
for (const platform of [...BUFFER_PLATFORMS, ...configuredDirectPlatforms()]) {
  const posts = JSON.parse(fs.readFileSync(path.join(directory, `viz-${platform}-posts.json`), 'utf8'));
  try {
    const due = needsBufferWork(posts);
    console.log(`${platform}: ${due ? 'publication or reconciliation due' : 'nothing due'}`);
    needed ||= due;
  } catch (err) {
    console.error(`${platform}: ${err.message}`);
    const staleBlocked = posts.find(p => !p.posted && ['publishing', 'uncertain', 'failed', 'submitted'].includes(p.state || ''));
    const isRecent = staleBlocked?.attemptedAt && (Date.now() - Date.parse(staleBlocked.attemptedAt)) < 2 * 3600000;
    if (isRecent || process.env.VIZ_FORCE_CHECKS === '1') {
      needed = true;
    }
  }
}
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `run=${needed}\n`);
console.log(`Run publishing checks: ${needed}`);

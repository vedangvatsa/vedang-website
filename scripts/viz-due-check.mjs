#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { needsBufferWork } from './viz-queue-time.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));
let needed = process.env.VIZ_FORCE_CHECKS === '1';
for (const platform of ['youtube', 'instagram', 'tiktok']) {
  const posts = JSON.parse(fs.readFileSync(path.join(directory, `viz-${platform}-posts.json`), 'utf8'));
  try {
    const due = needsBufferWork(posts);
    console.log(`${platform}: ${due ? 'publication or reconciliation due' : 'nothing due'}`);
    needed ||= due;
  } catch (err) {
    // Let the publisher surface an unresolved state as a failed job, never as success.
    console.error(`${platform}: ${err.message}`);
    needed = true;
  }
}
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `run=${needed}\n`);
console.log(`Run publishing checks: ${needed}`);

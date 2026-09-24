#!/usr/bin/env node
/** Read-only launch checks. Does not upload media, create posts, or edit queues. */
import path from 'node:path';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { ROOT, readQueue, localVideo, publicVideoUrl, checkPublicVideo, isMain } from './viz-publishing.js';
import { PLATFORMS, buildInput, channels, chooseChannel } from './buffer-viz-scheduled-executor.js';

export async function main() {
  const available = await channels();
  const checkedMedia = new Set<string>();
  const checkedNotes = new Set<string>();
  const all = process.argv.includes('--all');
  for (const platform of PLATFORMS) {
    const channel = chooseChannel(platform.service, platform.channelEnv, available);
    const queue = readQueue(path.join(ROOT, 'scripts', `viz-${platform.service}-posts.json`));
    const remaining = queue.filter(p => !p.posted);
    if (!remaining.length) { console.log(`${platform.service}: campaign complete`); continue; }
    for (const entry of all ? remaining : remaining.slice(0, 1)) {
      if (entry.state && entry.state !== 'sent') throw new Error(`${entry.id} needs reconciliation (${entry.state})`);
      const local = localVideo(entry);
      const url = publicVideoUrl(entry);
      if (!checkedMedia.has(url)) {
        await checkPublicVideo(url);
        // Confirm the next video's public bytes match the local launch asset.
        if (entry === remaining[0]) {
          const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
          if (!response.ok) throw new Error(`Public video GET HTTP ${response.status}`);
          const actual = createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex');
          const expected = createHash('sha256').update(fs.readFileSync(local)).digest('hex');
          if (actual !== expected) throw new Error(`${entry.id}: public video differs from local asset`);
          console.log(`PASS next video SHA-256 ${actual}`);
        }
        checkedMedia.add(url);
      }
      const input = buildInput(platform.service, entry, channel.id, url);
      const notes = input.text.match(/https:\/\/\S+\/viz-notes\/\d{2}\.txt/)?.[0];
      if (!notes) throw new Error(`${entry.id}: missing source/credit URL`);
      if (!checkedNotes.has(notes)) {
        const response = await fetch(notes, { signal: AbortSignal.timeout(30000) });
        if (!response.ok) throw new Error(`Source/credit notes HTTP ${response.status}`);
        const text = await response.text();
        if (!text.includes('World Bank') || !text.includes('Music\n')) throw new Error('Notes URL does not serve source/music credits');
        checkedNotes.add(notes);
      }
    }
    const first = remaining[0];
    console.log(`PASS ${platform.service}: ${channel.name}; next ${first.id}, ${first.scheduleDate} ${first.scheduleTime} IST; shareNow`);
  }
  console.log(`PASS ${checkedMedia.size} public MP4 URLs and ${checkedNotes.size} credit/source notes. No posts created.`);
}

if (isMain(import.meta.url)) main().catch(err => { console.error(err.message); process.exitCode = 1; });

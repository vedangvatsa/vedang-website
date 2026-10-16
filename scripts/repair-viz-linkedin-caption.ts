#!/usr/bin/env node
// Correct an existing batch-2 caption in place. Never create or delete a post.
import dotenv from 'dotenv';
import path from 'node:path';
import { ROOT, readQueue, saveQueue } from './viz-publishing.js';
import { validateCaption } from './viz-captions.mjs';
import { encodeLinkedInPlainText } from './linkedin-plain-text.mjs';

dotenv.config({ path: path.join(ROOT, '.env.local'), quiet: true });

async function main() {
  const id = process.argv.find(a => a.startsWith('--id='))?.slice(5);
  if (!id || !/^viz-b2-linkedin-\d{2,3}$/.test(id)) throw new Error('Supply an explicit batch-2 LinkedIn queue ID');
  if (!process.env.LINKEDIN_ACCESS_TOKEN || !process.env.LINKEDIN_PERSON_URN) throw new Error('LinkedIn credentials missing');
  const file = path.join(ROOT, 'scripts/viz-linkedin-posts.json');
  const posts = readQueue(file);
  const post = posts.find(p => p.id === id);
  if (!post || post.batchId !== '2026-10-16' || !post.posted || post.state !== 'sent' || post.captionStyle !== 'licensed-v2') {
    throw new Error('Only a confirmed, published batch-2 post can be repaired');
  }
  const urn = String(post.platformPostId || '');
  if (!/^urn:li:(ugcPost|share):\d+$/.test(urn)) throw new Error('Published LinkedIn post ID is missing');
  if (post.commentaryEncoding === 'little-text-v1' && post.captionRepairedAt) {
    console.log(`${id}: caption already repaired`);
    return;
  }
  validateCaption('linkedin', post.text);
  const commentary = encodeLinkedInPlainText(post.text);
  const url = `https://api.linkedin.com/rest/posts/${encodeURIComponent(urn)}`;
  const headers = {
    Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'LinkedIn-Version': '202604',
    'X-Restli-Protocol-Version': '2.0.0',
  };
  const before = await fetch(`${url}?viewContext=AUTHOR`, { headers, signal: AbortSignal.timeout(30000) });
  if (before.ok) {
    const current = await before.json() as any;
    if (current.author !== process.env.LINKEDIN_PERSON_URN) throw new Error('Post owner differs from configured LinkedIn identity');
  } else if (before.status !== 403) {
    throw new Error(`Post lookup failed with HTTP ${before.status}`);
  }
  const response = await fetch(url, {
    method: 'POST', signal: AbortSignal.timeout(60000),
    headers: { ...headers, 'X-RestLi-Method': 'PARTIAL_UPDATE' },
    body: JSON.stringify({ patch: { $set: { commentary } } }),
  });
  if (response.status !== 204) throw new Error(`Caption update failed: HTTP ${response.status} ${(await response.text()).slice(0, 400)}`);
  post.commentaryEncoding = 'little-text-v1';
  post.captionRepairedAt = new Date().toISOString();
  post.captionRepairHttpStatus = response.status;
  post.publishedText = post.text;
  post.postUrl = `https://www.linkedin.com/feed/update/${urn}/`;
  saveQueue(file, posts);
  console.log(`${id}: existing post caption updated in place (${urn}); no additional post created`);
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });

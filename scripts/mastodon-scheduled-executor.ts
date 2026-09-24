#!/usr/bin/env node
/**
 * Mastodon Scheduled Executor
 * Posts text + image content to Mastodon via its REST API.
 * Simple token auth — no OAuth dance needed.
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { isMain, sleep } from './viz-publishing.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const MASTODON_INSTANCE = process.env.MASTODON_INSTANCE!;
const MASTODON_TOKEN = process.env.MASTODON_ACCESS_TOKEN!;
const TIMEZONE_OFFSET_HOURS = 5.5;
const POSTS_FILE = path.resolve(__dirname, 'mastodon-posts.json');

interface MastodonPost {
  id: string;
  text: string;
  image?: string;
  scheduleDate: string;
  scheduleTime: string;
  posted: boolean;
  postedAt?: string;
  mastodonId?: string;
  error?: string;
}

export async function uploadMedia(imagePath: string, altText: string): Promise<string | null> {
  const absPath = path.isAbsolute(imagePath) ? imagePath : path.resolve(REPO_ROOT, imagePath);
  
  if (!fs.existsSync(absPath)) {
    console.warn(`  ⚠️ Image not found: ${absPath}`);
    return null;
  }

  const form = new FormData();
  const type = /\.mp4$/i.test(absPath) ? 'video/mp4' : /\.png$/i.test(absPath) ? 'image/png' : 'image/jpeg';
  form.append('file', new Blob([fs.readFileSync(absPath)], { type }), path.basename(absPath));
  form.append('description', altText.substring(0, 100).replace(/\n/g, ' ').trim());

  const res = await fetch(`${MASTODON_INSTANCE}/api/v2/media`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MASTODON_TOKEN}`,
    },
    body: form as any,
  });

  if (!res.ok) {
    console.warn(`  ⚠️ Media upload failed: ${res.status}`);
    return null;
  }

  const data = await res.json() as any;
  if (!data.id) throw new Error('Mastodon returned no media ID');
  if (data.url) return data.id;
  for (let attempt = 0; attempt < 60; attempt++) {
    await sleep(5000);
    const poll = await fetch(`${MASTODON_INSTANCE}/api/v1/media/${data.id}`, {
      headers: { Authorization: `Bearer ${MASTODON_TOKEN}` },
    });
    if (poll.status === 206) continue;
    if (!poll.ok) throw new Error(`Mastodon media processing HTTP ${poll.status}`);
    if ((await poll.json() as any).url) return data.id;
  }
  throw new Error('Mastodon media processing timed out');
}

export async function postStatus(text: string, mediaId?: string | null, idempotencyKey?: string): Promise<string> {
  const body: any = { status: text };
  if (mediaId) body.media_ids = [mediaId];

  const res = await fetch(`${MASTODON_INSTANCE}/api/v1/statuses`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MASTODON_TOKEN}`,
      'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Post failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json() as any;
  return data.id;
}

async function main() {
  if (!MASTODON_INSTANCE || !MASTODON_TOKEN) {
    console.log('⏭️ Mastodon credentials not set (MASTODON_INSTANCE, MASTODON_ACCESS_TOKEN)');
    return;
  }

  if (!fs.existsSync(POSTS_FILE)) {
    console.log('⏭️ No mastodon-posts.json found');
    return;
  }

  const posts: MastodonPost[] = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
  const now = new Date();
  const istNow = new Date(now.getTime() + TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000);
  const todayIST = istNow.toISOString().slice(0, 10);
  const currentTimeIST = istNow.toISOString().slice(11, 16);

  console.log(`🐘 Mastodon scheduler running at ${todayIST} ${currentTimeIST} IST`);
  console.log(`📋 Total posts: ${posts.length}, Posted: ${posts.filter(p => p.posted).length}`);

  const COOLDOWN_HOURS = Number(process.env.MA_COOLDOWN_HOURS || '7');
  const recentlyPosted = posts.some(p => {
    if (!p.posted || !p.postedAt) return false;
    return (Date.now() - new Date(p.postedAt).getTime()) < COOLDOWN_HOURS * 60 * 60 * 1000;
  });
  if (recentlyPosted) {
    console.log('⏸️ Posted within last 8h — skipping');
    return;
  }

  const due = posts.filter(p =>
    !p.posted &&
    (p.scheduleDate < todayIST || (p.scheduleDate === todayIST && p.scheduleTime <= currentTimeIST))
  );

  if (due.length === 0) {
    console.log('✅ No posts due');
    return;
  }

  console.log(`📤 ${due.length} post(s) due`);

  for (const post of due) {
    try {
      console.log(`\n📝 Posting: ${post.id}`);

      let mediaId: string | null = null;
      if (post.image) {
        console.log('  📤 Uploading media...');
        mediaId = await uploadMedia(post.image, post.text);
        if (!mediaId) {
          throw new Error(`Media failed: ${post.image} — skipped`);
        }
      }

      const statusId = await postStatus(post.text, mediaId);
      post.posted = true;
      post.postedAt = new Date().toISOString();
      post.mastodonId = statusId;
      console.log(`  ✅ Posted: ${statusId}`);
      console.log(`  🔗 ${MASTODON_INSTANCE}/@vedangvatsa/${statusId}`);
      break; // Only 1 successful post per run
    } catch (err: any) {
      post.error = err.message;
      console.error(`  ❌ Failed: ${err.message}`);
      break;
    }
  }

  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  console.log('\n💾 Updated mastodon-posts.json');
}

if (isMain(import.meta.url)) main().catch(console.error);

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

async function uploadMedia(imagePath: string): Promise<string | null> {
  const absPath = path.isAbsolute(imagePath) ? imagePath : path.resolve(REPO_ROOT, imagePath);
  
  if (!fs.existsSync(absPath)) {
    console.warn(`  ⚠️ Image not found: ${absPath}`);
    return null;
  }

  const FormData = (await import('form-data')).default;
  const form = new FormData();
  form.append('file', fs.createReadStream(absPath));

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
  return data.id;
}

async function postStatus(text: string, mediaId?: string | null): Promise<string> {
  const body: any = { status: text };
  if (mediaId) body.media_ids = [mediaId];

  const res = await fetch(`${MASTODON_INSTANCE}/api/v1/statuses`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MASTODON_TOKEN}`,
      'Content-Type': 'application/json',
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

  const COOLDOWN_HOURS = 7;
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

  console.log(`📤 ${due.length} post(s) due — will post 1`);
  const post = due[0];

  try {
    console.log(`\n📝 Posting: ${post.id}`);
    
    let mediaId: string | null = null;
    if (post.image) {
      console.log('  📤 Uploading media...');
      mediaId = await uploadMedia(post.image);
      if (!mediaId) {
        throw new Error(`Media upload failed for: ${post.image} — aborting (will not post text-only)`);
      }
    }

    const statusId = await postStatus(post.text, mediaId);
    post.posted = true;
    post.postedAt = new Date().toISOString();
    post.mastodonId = statusId;
    console.log(`  ✅ Posted: ${statusId}`);
    console.log(`  🔗 ${MASTODON_INSTANCE}/@vedangvatsa/${statusId}`);
  } catch (err: any) {
    post.error = err.message;
    console.error(`  ❌ Failed: ${err.message}`);
  }

  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  console.log('\n💾 Updated mastodon-posts.json');
}

main().catch(console.error);

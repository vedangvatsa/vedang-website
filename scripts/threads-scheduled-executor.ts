#!/usr/bin/env node
/**
 * Threads Scheduled Executor
 * Posts text content to Threads via the Threads Graph API.
 * Uses two-step container publishing flow.
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const THREADS_TOKEN = process.env.THREADS_ACCESS_TOKEN!;
const THREADS_USER_ID = process.env.THREADS_USER_ID!;
const TIMEZONE_OFFSET_HOURS = 5.5;
const POSTS_FILE = path.resolve(__dirname, 'threads-posts.json');

interface ThreadsPost {
  id: string;
  text: string;
  image?: string;
  imageUrl?: string;
  scheduleDate: string;
  scheduleTime: string;
  posted: boolean;
  postedAt?: string;
  threadsMediaId?: string;
  error?: string;
}

async function createTextContainer(text: string): Promise<string> {
  const params = new URLSearchParams({
    media_type: 'TEXT',
    text,
    access_token: THREADS_TOKEN,
  });

  const res = await fetch(
    `https://graph.threads.net/v1.0/${THREADS_USER_ID}/threads?${params}`,
    { method: 'POST' }
  );

  if (!res.ok) throw new Error(`Container failed: ${res.status} ${await res.text()}`);
  const data = await res.json() as any;
  return data.id;
}

async function createImageContainer(text: string, imageUrl: string): Promise<string> {
  const params = new URLSearchParams({
    media_type: 'IMAGE',
    text,
    image_url: imageUrl,
    access_token: THREADS_TOKEN,
  });

  const res = await fetch(
    `https://graph.threads.net/v1.0/${THREADS_USER_ID}/threads?${params}`,
    { method: 'POST' }
  );

  if (!res.ok) throw new Error(`Container failed: ${res.status} ${await res.text()}`);
  const data = await res.json() as any;
  return data.id;
}

async function publishContainer(containerId: string): Promise<string> {
  // Wait for server to process the container
  await new Promise(r => setTimeout(r, 15000));

  const params = new URLSearchParams({
    creation_id: containerId,
    access_token: THREADS_TOKEN,
  });

  const res = await fetch(
    `https://graph.threads.net/v1.0/${THREADS_USER_ID}/threads_publish?${params}`,
    { method: 'POST' }
  );

  if (!res.ok) throw new Error(`Publish failed: ${res.status} ${await res.text()}`);
  const data = await res.json() as any;
  return data.id;
}

async function main() {
  if (!THREADS_TOKEN || !THREADS_USER_ID) {
    console.log('⏭️ Threads credentials not set (THREADS_ACCESS_TOKEN, THREADS_USER_ID)');
    return;
  }

  if (!fs.existsSync(POSTS_FILE)) {
    console.log('⏭️ No threads-posts.json found');
    return;
  }

  const posts: ThreadsPost[] = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
  const now = new Date();
  const istNow = new Date(now.getTime() + TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000);
  const todayIST = istNow.toISOString().slice(0, 10);
  const currentTimeIST = istNow.toISOString().slice(11, 16);

  console.log(`🧵 Threads scheduler running at ${todayIST} ${currentTimeIST} IST`);
  console.log(`📋 Total posts: ${posts.length}, Posted: ${posts.filter(p => p.posted).length}`);

  // Cooldown
  const COOLDOWN_HOURS = 8;
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
    let containerId: string;

    if (post.imageUrl) {
      console.log('  📦 Creating image container...');
      containerId = await createImageContainer(post.text, post.imageUrl);
    } else {
      console.log('  📦 Creating text container...');
      containerId = await createTextContainer(post.text);
    }

    console.log(`  📦 Container: ${containerId}`);
    console.log('  ⏳ Publishing (15s processing wait)...');
    const mediaId = await publishContainer(containerId);

    post.posted = true;
    post.postedAt = new Date().toISOString();
    post.threadsMediaId = mediaId;
    console.log(`  ✅ Published: ${mediaId}`);
  } catch (err: any) {
    post.error = err.message;
    console.error(`  ❌ Failed: ${err.message}`);
  }

  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  console.log('\n💾 Updated threads-posts.json');
}

main().catch(console.error);

#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import FormData from 'form-data';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const PAGE_ID = process.env.FACEBOOK_PAGE_ID!;
const PAGE_TOKEN = process.env.FACEBOOK_PAGE_TOKEN!;
const TIMEZONE_OFFSET_HOURS = 5.5;
const POSTS_FILE = path.resolve(__dirname, 'facebook-posts.json');

interface FacebookPost {
  id: string;
  text: string;
  image?: string;
  scheduleDate: string;
  scheduleTime: string;
  posted: boolean;
  postedAt?: string;
  fbPostId?: string;
  error?: string;
}

async function uploadPhoto(imagePath: string, message: string): Promise<string> {
  const absPath = path.isAbsolute(imagePath)
    ? imagePath
    : path.resolve(REPO_ROOT, imagePath);

  if (!fs.existsSync(absPath)) {
    console.warn(`  ⚠️ Image not found: ${absPath}`);
    return await postText(message);
  }

  const form = new FormData();
  form.append('source', fs.createReadStream(absPath));
  form.append('message', message);
  form.append('access_token', PAGE_TOKEN);

  const res = await fetch(`https://graph.facebook.com/v19.0/${PAGE_ID}/photos`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Photo upload failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json() as any;
  return data.post_id || data.id;
}

async function postText(message: string): Promise<string> {
  const res = await fetch(`https://graph.facebook.com/v19.0/${PAGE_ID}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      access_token: PAGE_TOKEN,
    }),
  });

  if (!res.ok) {
    throw new Error(`Post failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json() as any;
  return data.id;
}

async function main() {
  if (!PAGE_ID || !PAGE_TOKEN) {
    console.log('⏭️ Facebook credentials not set, skipping');
    return;
  }

  if (!fs.existsSync(POSTS_FILE)) {
    console.log('⏭️ No facebook-posts.json found');
    return;
  }

  let posts: FacebookPost[] = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
  
  // Deduplicate by ID and text content
  const seenIds = new Set<string>();
  const seenText = new Set<string>();
  posts = posts.filter(p => {
    if (seenIds.has(p.id)) return false;
    seenIds.add(p.id);
    const textKey = p.text.trim().substring(0, 100);
    if (seenText.has(textKey)) return false;
    seenText.add(textKey);
    return true;
  });

  const now = new Date();
  const istNow = new Date(now.getTime() + TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000);
  const todayIST = istNow.toISOString().slice(0, 10);
  const currentTimeIST = istNow.toISOString().slice(11, 16);

  console.log(`📘 Facebook scheduler running at ${todayIST} ${currentTimeIST} IST`);
  console.log(`📋 Total posts: ${posts.length} (after dedup), Posted: ${posts.filter(p => p.posted).length}`);

  // COOLDOWN: max 3 posts/day with 8h gap between each.
  const COOLDOWN_HOURS = 8;
  const recentlyPosted = posts.some(p => {
    if (!p.posted || !p.postedAt) return false;
    return (Date.now() - new Date(p.postedAt).getTime()) < COOLDOWN_HOURS * 60 * 60 * 1000;
  });
  if (recentlyPosted) {
    console.log('⏸️ Posted within last 8h — skipping (max 3 posts/day)');
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

  const post = due[0]; // Only take the first due post
  try {
    console.log(`\n📝 Posting: ${post.id}`);
    let postId: string;
    if (post.image) {
      postId = await uploadPhoto(post.image, post.text);
    } else {
      postId = await postText(post.text);
    }
    post.posted = true;
    post.postedAt = new Date().toISOString();
    post.fbPostId = postId;
    console.log(`  ✅ Posted: ${postId}`);
  } catch (err: any) {
    post.error = err.message;
    console.error(`  ❌ Failed: ${err.message}`);
  }

  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  console.log('\n💾 Updated facebook-posts.json');
}

main().catch(console.error);

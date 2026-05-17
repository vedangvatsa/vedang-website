#!/usr/bin/env node
/**
 * Threads Scheduled Executor
 * Posts text/image/video content to Threads.
 * 
 * Strategy:
 *   1. Try Threads Graph API (requires THREADS_ACCESS_TOKEN from OAuth)
 *   2. Fallback to threads-post.py (uses IG session cookies + Barcelona UA)
 * 
 * Env vars:
 *   THREADS_ACCESS_TOKEN, THREADS_USER_ID - for Graph API
 *   ~/.ig_session.json - for Python fallback (auto-detected)
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { triggerBoost } from './smm-boost-trigger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const THREADS_TOKEN = process.env.THREADS_ACCESS_TOKEN || '';
const THREADS_USER_ID = process.env.THREADS_USER_ID || '';
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
  postUri?: string;
  error?: string;
}

// ─── Graph API methods (requires OAuth token) ───

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

async function createVideoContainer(text: string, videoUrl: string): Promise<string> {
  const params = new URLSearchParams({
    media_type: 'VIDEO',
    text,
    video_url: videoUrl,
    access_token: THREADS_TOKEN,
  });

  const res = await fetch(
    `https://graph.threads.net/v1.0/${THREADS_USER_ID}/threads?${params}`,
    { method: 'POST' }
  );

  if (!res.ok) throw new Error(`Video container failed: ${res.status} ${await res.text()}`);
  const data = await res.json() as any;
  return data.id;
}

async function publishContainer(containerId: string, isVideoPost: boolean = false): Promise<string> {
  const waitTime = isVideoPost ? 30000 : 15000;
  await new Promise(r => setTimeout(r, waitTime));

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

// ─── Graph API posting ───

async function postViaGraphAPI(text: string, mediaPath?: string): Promise<string> {
  let containerId: string;
  let isVideoPost = false;

  if (mediaPath && isVideo(mediaPath)) {
    const videoUrl = mediaPath.startsWith('http') ? mediaPath : getPublicUrl(mediaPath);
    console.log(`  🎬 Graph API: Video container: ${videoUrl}`);
    containerId = await createVideoContainer(text, videoUrl);
    isVideoPost = true;
  } else if (mediaPath) {
    const imgUrl = mediaPath.startsWith('http') ? mediaPath : getPublicUrl(mediaPath);
    console.log(`  📷 Graph API: Image container: ${imgUrl}`);
    containerId = await createImageContainer(text, imgUrl);
  } else {
    console.log('  📦 Graph API: Text container...');
    containerId = await createTextContainer(text);
  }

  const waitLabel = isVideoPost ? '30s' : '15s';
  console.log(`  ⏳ Publishing (${waitLabel} wait)...`);
  return await publishContainer(containerId, isVideoPost);
}

// ─── Python fallback (uses IG session cookies + Barcelona UA) ───

async function downloadFile(url: string, dest: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buffer);
}

async function postViaPython(text: string, mediaPath?: string): Promise<string> {
  console.log('  🐍 Fallback: Using threads-post.py (Barcelona private API)...');

  const scriptPath = path.resolve(__dirname, 'threads-post.py');
  const escapedText = text.replace(/'/g, "'\\''");

  let cmd = `python3 "${scriptPath}" --text '${escapedText}'`;

  if (mediaPath) {
    let localFile = mediaPath;
    if (mediaPath.startsWith('http')) {
      const ext = isVideo(mediaPath) ? '.mp4' : '.jpg';
      localFile = path.resolve(__dirname, `_threads_temp${ext}`);
      console.log('  📥 Downloading media...');
      await downloadFile(mediaPath, localFile);
    } else if (!path.isAbsolute(mediaPath)) {
      localFile = path.resolve(REPO_ROOT, mediaPath);
    }
    cmd += ` --image "${localFile}"`;
  }

  try {
    const output = execSync(cmd, { timeout: 120000, encoding: 'utf-8' });
    const result = JSON.parse(output.trim());

    if (result.error || result.status === 'fail') {
      throw new Error(result.error || 'Unknown error');
    }

    // Clean up temp files
    const tempFile = path.resolve(__dirname, '_threads_temp.jpg');
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);

    console.log(`  ✅ Posted: ${result.url || result.media_id}`);
    return result.media_id || result.code || '';
  } catch (err: any) {
    // Clean up temp files
    for (const ext of ['.jpg', '.mp4']) {
      const tmp = path.resolve(__dirname, `_threads_temp${ext}`);
      if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    }
    throw new Error(`Python fallback failed: ${err.message}`);
  }
}

function getPublicUrl(localPath: string): string {
  const relative = localPath.replace(/^\.?\//, '');
  return `https://raw.githubusercontent.com/vedangvatsa/vedang-website/main/${relative}`;
}

function isVideo(filePath: string): boolean {
  return /\.(mp4|mov|webm)$/i.test(filePath);
}

async function main() {
  const hasGraphAPI = !!(THREADS_TOKEN && THREADS_USER_ID);
  const hasSessionFile = fs.existsSync(path.join(process.env.HOME || '', '.ig_session.json'));
  const hasPythonFallback = hasSessionFile;

  if (!hasGraphAPI && !hasPythonFallback) {
    console.log('⏭️ Threads: No credentials. Need THREADS_ACCESS_TOKEN+THREADS_USER_ID or ~/.ig_session.json');
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
  console.log(`🔧 Graph API: ${hasGraphAPI ? '✅' : '❌'} | Python: ${hasPythonFallback ? '✅' : '❌'}`);

  // Cooldown
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
    const mediaPath = post.imageUrl || post.image;
    let mediaId = '';

    // Strategy: Try Graph API first, fallback to Python
    if (hasGraphAPI) {
      try {
        mediaId = await postViaGraphAPI(post.text, mediaPath);
      } catch (graphErr: any) {
        console.log(`  ⚠️ Graph API failed: ${graphErr.message}`);
        if (hasPythonFallback) {
          mediaId = await postViaPython(post.text, mediaPath);
        } else {
          throw graphErr;
        }
      }
    } else {
      mediaId = await postViaPython(post.text, mediaPath);
    }

    post.posted = true;
    post.postedAt = new Date().toISOString();
    post.threadsMediaId = mediaId;
    console.log(`  ✅ Published: ${mediaId}`);
  } catch (err: any) {
    post.error = err.message;
    console.error(`  ❌ Failed: ${err.message}`);
  }

  try { triggerBoost('threads', post.postUri || `https://threads.net/`); } catch(e) {}
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  console.log('\n💾 Updated threads-posts.json');
}

main().catch(console.error);


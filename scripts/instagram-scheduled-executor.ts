#!/usr/bin/env node
/**
 * Instagram Scheduled Executor
 * Posts images/videos to Instagram.
 * 
 * Strategy:
 *   1. Try Graph API (requires Business/Creator account + instagram_content_publish)
 *   2. Fallback to instagrapi Python script (works with any account type)
 * 
 * Env vars:
 *   FACEBOOK_PAGE_TOKEN, INSTAGRAM_ACCOUNT_ID - for Graph API
 *   IG_USERNAME, IG_PASSWORD - for instagrapi fallback
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

const PAGE_TOKEN = process.env.FACEBOOK_PAGE_TOKEN || '';
const PAGE_ID = process.env.FACEBOOK_PAGE_ID || '';
const IG_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID || '';
const IG_USERNAME = process.env.IG_USERNAME || '';
const IG_PASSWORD = process.env.IG_PASSWORD || '';
const TIMEZONE_OFFSET_HOURS = 5.5;
const POSTS_FILE = path.resolve(__dirname, 'instagram-posts.json');
const API_VERSION = 'v21.0';

interface InstaPost {
  id: string;
  text: string;
  image?: string;
  imageUrl?: string;
  scheduleDate: string;
  scheduleTime: string;
  posted: boolean;
  postedAt?: string;
  igMediaId?: string;
  error?: string;
}

// ─── Graph API methods (Business/Creator accounts) ───

async function getPublicImageUrl(localPath: string): Promise<string> {
  const absPath = path.isAbsolute(localPath) ? localPath : path.resolve(REPO_ROOT, localPath);
  if (!fs.existsSync(absPath)) throw new Error(`Image not found: ${absPath}`);

  const FormData = (await import('form-data')).default;
  const form = new FormData();
  form.append('source', fs.createReadStream(absPath));
  form.append('published', 'false');
  form.append('access_token', PAGE_TOKEN);

  const res = await fetch(`https://graph.facebook.com/${API_VERSION}/${PAGE_ID}/photos`, {
    method: 'POST',
    body: form as any,
  });
  if (!res.ok) throw new Error(`Photo upload failed: ${res.status} ${await res.text()}`);
  const data = await res.json() as any;

  const photoRes = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${data.id}?fields=images&access_token=${PAGE_TOKEN}`
  );
  const photoData = await photoRes.json() as any;
  return photoData.images?.[0]?.source || '';
}

async function createMediaContainer(imageUrl: string, caption: string): Promise<string> {
  const params = new URLSearchParams({ image_url: imageUrl, caption, access_token: PAGE_TOKEN });
  const res = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${IG_ACCOUNT_ID}/media?${params}`,
    { method: 'POST' }
  );
  if (!res.ok) throw new Error(`Container creation failed: ${res.status} ${await res.text()}`);
  const data = await res.json() as any;
  return data.id;
}

async function createReelsContainer(videoUrl: string, caption: string): Promise<string> {
  const params = new URLSearchParams({ media_type: 'REELS', video_url: videoUrl, caption, access_token: PAGE_TOKEN });
  const res = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${IG_ACCOUNT_ID}/media?${params}`,
    { method: 'POST' }
  );
  if (!res.ok) throw new Error(`Reels container failed: ${res.status} ${await res.text()}`);
  const data = await res.json() as any;
  return data.id;
}

async function publishContainer(containerId: string, isReels: boolean = false): Promise<string> {
  const waitTime = isReels ? 30000 : 10000;
  await new Promise(r => setTimeout(r, waitTime));
  const res = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${IG_ACCOUNT_ID}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: containerId, access_token: PAGE_TOKEN }),
    }
  );
  if (!res.ok) throw new Error(`Publish failed: ${res.status} ${await res.text()}`);
  const data = await res.json() as any;
  return data.id;
}

// ─── Graph API posting (tries official API first) ───

async function postViaGraphAPI(mediaPath: string, caption: string, isVid: boolean): Promise<string> {
  let containerId: string;
  let isReels = false;

  if (isVid) {
    const videoUrl = mediaPath.startsWith('http') ? mediaPath : getGitHubUrl(mediaPath);
    console.log(`  🎬 Graph API: Reels container: ${videoUrl}`);
    containerId = await createReelsContainer(videoUrl, caption);
    isReels = true;
  } else {
    let imageUrl = mediaPath.startsWith('http') ? mediaPath : '';
    if (!imageUrl) {
      imageUrl = await getPublicImageUrl(mediaPath);
    }
    if (!imageUrl) throw new Error('No media available');
    console.log('  📦 Graph API: Creating media container...');
    containerId = await createMediaContainer(imageUrl, caption);
  }

  const waitLabel = isReels ? '30s' : '10s';
  console.log(`  ⏳ Publishing (${waitLabel} wait)...`);
  return await publishContainer(containerId, isReels);
}

// ─── Instagrapi fallback (works with any account) ───

async function downloadFile(url: string, dest: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buffer);
}

async function postViaInstagrapi(mediaPath: string, caption: string, isVid: boolean): Promise<string> {
  console.log('  🐍 Fallback: Using instagrapi (private API)...');

  // Resolve media to a local file
  let localFile = mediaPath;
  if (mediaPath.startsWith('http')) {
    const ext = isVid ? '.mp4' : '.jpg';
    localFile = path.resolve(__dirname, `_ig_temp${ext}`);
    console.log(`  📥 Downloading media...`);
    await downloadFile(mediaPath, localFile);
  } else if (!path.isAbsolute(mediaPath)) {
    localFile = path.resolve(REPO_ROOT, mediaPath);
  }

  if (!fs.existsSync(localFile)) {
    throw new Error(`Media file not found: ${localFile}`);
  }

  const mediaFlag = isVid ? '--video' : '--image';
  const scriptPath = path.resolve(__dirname, 'ig-post.py');
  
  // Escape caption for shell
  const escapedCaption = caption.replace(/'/g, "'\\''");

  // Build command — ig-post.py uses saved session from ~/.ig_session.json
  // Only pass username/password if explicitly set
  let authArgs = '';
  if (IG_USERNAME && IG_PASSWORD) {
    authArgs = `--username "${IG_USERNAME}" --password "${IG_PASSWORD}"`;
  }
  const cmd = `python3 "${scriptPath}" ${authArgs} ${mediaFlag} "${localFile}" --caption '${escapedCaption}'`;
  
  try {
    const output = execSync(cmd, { timeout: 120000, encoding: 'utf-8' });
    const result = JSON.parse(output.trim());
    
    if (result.error) {
      throw new Error(result.error);
    }

    // Clean up temp file
    if (mediaPath.startsWith('http') && fs.existsSync(localFile)) {
      fs.unlinkSync(localFile);
    }

    console.log(`  ✅ Posted: ${result.url}`);
    return result.media_id || result.media_pk;
  } catch (err: any) {
    // Clean up temp file on error
    const tempFile = path.resolve(__dirname, isVid ? '_ig_temp.mp4' : '_ig_temp.jpg');
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    throw new Error(`Instagrapi failed: ${err.message}`);
  }
}

function getGitHubUrl(localPath: string): string {
  const relative = localPath.replace(/^\.?\//, '');
  return `https://raw.githubusercontent.com/vedangvatsa/vedang-website/main/${relative}`;
}

function isVideo(filePath: string): boolean {
  return /\.(mp4|mov|webm)$/i.test(filePath);
}

async function main() {
  const hasGraphAPI = !!(PAGE_TOKEN && IG_ACCOUNT_ID);
  const hasSessionFile = fs.existsSync(path.join(process.env.HOME || '', '.ig_session.json'));
  const hasPrivateAPI = !!(IG_USERNAME && IG_PASSWORD) || hasSessionFile;

  if (!hasGraphAPI && !hasPrivateAPI) {
    console.log('⏭️ Instagram: No credentials. Need FACEBOOK_PAGE_TOKEN+INSTAGRAM_ACCOUNT_ID, IG_USERNAME+IG_PASSWORD, or ~/.ig_session.json');
    return;
  }

  if (!fs.existsSync(POSTS_FILE)) {
    console.log('⏭️ No instagram-posts.json found');
    return;
  }

  const posts: InstaPost[] = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
  const now = new Date();
  const istNow = new Date(now.getTime() + TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000);
  const todayIST = istNow.toISOString().slice(0, 10);
  const currentTimeIST = istNow.toISOString().slice(11, 16);

  console.log(`📸 Instagram scheduler running at ${todayIST} ${currentTimeIST} IST`);
  console.log(`📋 Total posts: ${posts.length}, Posted: ${posts.filter(p => p.posted).length}`);
  console.log(`🔧 Graph API: ${hasGraphAPI ? '✅' : '❌'} | Private API: ${hasPrivateAPI ? '✅' : '❌'}${hasSessionFile ? ' (session)' : ''}`);

  // Cooldown: max 3 posts/day
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
    
    const mediaPath = post.imageUrl || post.image || '';
    if (!mediaPath) throw new Error('No media available — Instagram requires an image or video');

    const isVid = isVideo(mediaPath);
    let mediaId = '';

    // Strategy: Try Graph API first, fallback to instagrapi
    if (hasGraphAPI) {
      try {
        mediaId = await postViaGraphAPI(mediaPath, post.text, isVid);
      } catch (graphErr: any) {
        console.log(`  ⚠️ Graph API failed: ${graphErr.message}`);
        if (hasPrivateAPI) {
          mediaId = await postViaInstagrapi(mediaPath, post.text, isVid);
        } else {
          throw graphErr;
        }
      }
    } else {
      mediaId = await postViaInstagrapi(mediaPath, post.text, isVid);
    }

    post.posted = true;
    post.postedAt = new Date().toISOString();
    post.igMediaId = mediaId;
    console.log(`  ✅ Published: ${mediaId}`);
  } catch (err: any) {
    post.error = err.message;
    console.error(`  ❌ Failed: ${err.message}`);
  }

  try { triggerBoost('instagram', post.postUri || `https://instagram.com/`); } catch(e) {}
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  console.log('\n💾 Updated instagram-posts.json');
}

main().catch(console.error);

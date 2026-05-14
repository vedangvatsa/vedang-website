#!/usr/bin/env node
/**
 * Instagram Scheduled Executor
 * Posts images with captions to Instagram via Graph API.
 * Requires: Instagram Business Account linked to Facebook Page.
 * Uses the Facebook Page Token with instagram_content_publish permission.
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { triggerBoost } from './smm-boost-trigger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const PAGE_TOKEN = process.env.FACEBOOK_PAGE_TOKEN!;
const PAGE_ID = process.env.FACEBOOK_PAGE_ID!;
const IG_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID!;
const TIMEZONE_OFFSET_HOURS = 5.5;
const POSTS_FILE = path.resolve(__dirname, 'instagram-posts.json');
const API_VERSION = 'v21.0';

interface InstaPost {
  id: string;
  text: string;
  image?: string;
  imageUrl?: string; // Public URL for Instagram (required)
  scheduleDate: string;
  scheduleTime: string;
  posted: boolean;
  postedAt?: string;
  igMediaId?: string;
  error?: string;
}

// Instagram requires a publicly accessible image URL.
// If we only have a local file, we upload to Facebook first to get a URL.
async function getPublicImageUrl(localPath: string): Promise<string> {
  const absPath = path.isAbsolute(localPath) ? localPath : path.resolve(REPO_ROOT, localPath);
  
  if (!fs.existsSync(absPath)) {
    throw new Error(`Image not found: ${absPath}`);
  }

  // Upload to Facebook Page as unpublished photo to get URL
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
  
  // Get the image URL from the uploaded photo
  const photoRes = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${data.id}?fields=images&access_token=${PAGE_TOKEN}`
  );
  const photoData = await photoRes.json() as any;
  
  return photoData.images?.[0]?.source || '';
}

async function createMediaContainer(imageUrl: string, caption: string): Promise<string> {
  const params = new URLSearchParams({
    image_url: imageUrl,
    caption,
    access_token: PAGE_TOKEN,
  });

  const res = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${IG_ACCOUNT_ID}/media?${params}`,
    { method: 'POST' }
  );

  if (!res.ok) throw new Error(`Container creation failed: ${res.status} ${await res.text()}`);
  
  const data = await res.json() as any;
  return data.id;
}

async function createReelsContainer(videoUrl: string, caption: string): Promise<string> {
  const params = new URLSearchParams({
    media_type: 'REELS',
    video_url: videoUrl,
    caption,
    access_token: PAGE_TOKEN,
  });

  const res = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${IG_ACCOUNT_ID}/media?${params}`,
    { method: 'POST' }
  );

  if (!res.ok) throw new Error(`Reels container failed: ${res.status} ${await res.text()}`);
  
  const data = await res.json() as any;
  return data.id;
}

function getGitHubUrl(localPath: string): string {
  const relative = localPath.replace(/^\.?\//, '');
  return `https://raw.githubusercontent.com/vedangvatsa/vedang-website/main/${relative}`;
}

function isVideo(filePath: string): boolean {
  return /\.(mp4|mov|webm)$/i.test(filePath);
}

async function publishContainer(containerId: string, isReels: boolean = false): Promise<string> {
  // Reels need longer processing (30s vs 10s for images)
  const waitTime = isReels ? 30000 : 10000;
  await new Promise(r => setTimeout(r, waitTime));

  const res = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${IG_ACCOUNT_ID}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: PAGE_TOKEN,
      }),
    }
  );

  if (!res.ok) throw new Error(`Publish failed: ${res.status} ${await res.text()}`);
  
  const data = await res.json() as any;
  return data.id;
}

async function postTextOnly(caption: string): Promise<string> {
  // Instagram doesn't support text-only posts via API
  // Fall back to skip
  throw new Error('Instagram requires an image for every post');
}

async function main() {
  if (!PAGE_TOKEN || !IG_ACCOUNT_ID) {
    console.log('⏭️ Instagram credentials not set (FACEBOOK_PAGE_TOKEN, INSTAGRAM_ACCOUNT_ID)');
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

  // Cooldown: max 3 posts/day
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
    
    const mediaPath = post.imageUrl || post.image || '';
    let containerId: string;
    let isReels = false;

    if (mediaPath && isVideo(mediaPath)) {
      // Video post -> Instagram Reels
      const videoUrl = mediaPath.startsWith('http') ? mediaPath : getGitHubUrl(mediaPath);
      console.log(`  🎬 Creating Reels container: ${videoUrl}`);
      containerId = await createReelsContainer(videoUrl, post.text);
      isReels = true;
    } else {
      // Image post
      let imageUrl = post.imageUrl || '';
      if (!imageUrl && post.image) {
        console.log('  📤 Uploading image...');
        imageUrl = await getPublicImageUrl(post.image);
      }
      if (!imageUrl) {
        throw new Error('No media available');
      }
      console.log('  📦 Creating media container...');
      containerId = await createMediaContainer(imageUrl, post.text);
    }

    const waitLabel = isReels ? '30s' : '10s';
    console.log(`  📦 Container: ${containerId}`);
    console.log(`  ⏳ Publishing (${waitLabel} processing wait)...`);
    const mediaId = await publishContainer(containerId, isReels);
    
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

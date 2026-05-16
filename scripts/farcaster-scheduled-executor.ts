#!/usr/bin/env node
/**
 * Farcaster Scheduled Executor
 * Posts text + image content to Farcaster via Neynar API.
 * Reads from farcaster-posts.json (same format as linkedin-posts.json).
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY!;
const SIGNER_UUID = process.env.NEYNAR_SIGNER_UUID!;
const TIMEZONE_OFFSET_HOURS = 5.5;
const POSTS_FILE = path.resolve(__dirname, 'farcaster-posts.json');
const MAX_CAST_LENGTH = 1024; // Farcaster limit

interface FarcasterPost {
  id: string;
  text: string;
  image?: string;
  scheduleDate: string;
  scheduleTime: string;
  posted: boolean;
  postedAt?: string;
  castHash?: string;
  error?: string;
}

function isVideo(filePath: string): boolean {
  return /\.(mp4|mov|webm)$/i.test(filePath);
}

async function uploadToNeynarStorage(filePath: string): Promise<string | null> {
  const absPath = path.isAbsolute(filePath) ? filePath : path.resolve(REPO_ROOT, filePath);
  if (!fs.existsSync(absPath)) {
    console.warn(`  Warning: File not found: ${absPath}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(absPath);
  const ext = path.extname(absPath).toLowerCase();
  const mimeMap: Record<string, string> = {
    '.mp4': 'video/mp4', '.mov': 'video/quicktime', '.webm': 'video/webm',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  };
  const mimeType = mimeMap[ext] || 'application/octet-stream';
  const fileName = path.basename(absPath);

  // Neynar storage upload endpoint
  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer], { type: mimeType }), fileName);

  const res = await fetch('https://api.neynar.com/v2/farcaster/storage/upload', {
    method: 'POST',
    headers: { 'x-api-key': NEYNAR_API_KEY },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.warn(`  Warning: Neynar upload failed (${res.status}): ${errText.substring(0, 150)}`);
    return null;
  }

  const data = await res.json() as any;
  const url = data?.url || data?.urls?.[0] || null;
  if (url) console.log(`  📤 Uploaded to Neynar CDN: ${url}`);
  return url;
}

function getImageUrl(imagePath: string): string | null {
  const absPath = path.isAbsolute(imagePath) ? imagePath : path.resolve(REPO_ROOT, imagePath);
  if (!fs.existsSync(absPath)) {
    console.warn(`  Warning: Image not found: ${absPath}`);
    return null;
  }

  // Convert local path to GitHub raw URL (works for images, not for video)
  const relPath = path.relative(REPO_ROOT, absPath);
  const rawUrl = `https://raw.githubusercontent.com/vedangvatsa/vedang-website/main/${relPath}`;
  console.log(`  Image URL: ${rawUrl}`);
  return rawUrl;
}

function truncateForFarcaster(text: string): string {
  if (text.length <= MAX_CAST_LENGTH) return text;
  return text.substring(0, MAX_CAST_LENGTH - 3) + '...';
}

async function postCast(text: string, imageUrl?: string | null): Promise<{ success: boolean; hash?: string; error?: string }> {
  const castText = truncateForFarcaster(text);

  const body: Record<string, unknown> = {
    signer_uuid: SIGNER_UUID,
    text: castText,
  };

  if (imageUrl) {
    body.embeds = [{ url: imageUrl }];
  }

  const res = await fetch('https://api.neynar.com/v2/farcaster/cast', {
    method: 'POST',
    headers: {
      'x-api-key': NEYNAR_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    return { success: false, error: `${res.status}: ${err.substring(0, 150)}` };
  }

  const data = await res.json() as any;
  return { success: true, hash: data.cast?.hash };
}

async function main() {
  if (!NEYNAR_API_KEY || !SIGNER_UUID) {
    console.log('⏭️ Farcaster credentials not set (NEYNAR_API_KEY, NEYNAR_SIGNER_UUID)');
    return;
  }

  if (!fs.existsSync(POSTS_FILE)) {
    console.log('⏭️ No farcaster-posts.json found');
    return;
  }

  const posts: FarcasterPost[] = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
  const now = new Date();
  const istNow = new Date(now.getTime() + TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000);
  const todayIST = istNow.toISOString().slice(0, 10);
  const currentTimeIST = istNow.toISOString().slice(11, 16);

  console.log(`🟪 Farcaster scheduler running at ${todayIST} ${currentTimeIST} IST`);
  console.log(`📋 Total posts: ${posts.length}, Posted: ${posts.filter(p => p.posted).length}`);

  const COOLDOWN_HOURS = 7;
  const recentlyPosted = posts.some(p => {
    if (!p.posted || !p.postedAt || !p.castHash) return false; // Only count posts actually cast on Farcaster
    return (Date.now() - new Date(p.postedAt).getTime()) < COOLDOWN_HOURS * 60 * 60 * 1000;
  });
  if (recentlyPosted) {
    console.log('⏸️ Posted to Farcaster within last 8h — skipping');
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
    console.log(`\n Posting: ${post.id}`);
    console.log(`   Text: ${post.text.substring(0, 80)}...`);

    let imageUrl: string | null = null;
    if (post.image) {
      // Try Neynar CDN first (required for video, preferred for images)
      const mediaType = isVideo(post.image) ? '🎬 video' : '📷 image';
      console.log(`  ${mediaType}: Uploading via Neynar storage...`);
      imageUrl = await uploadToNeynarStorage(post.image);
      
      // Fallback: use GitHub raw URL for images if CDN upload failed (e.g. free plan 402)
      if (!imageUrl && !isVideo(post.image)) {
        console.log(`  📷 CDN failed, falling back to GitHub raw URL...`);
        imageUrl = getImageUrl(post.image);
      }
    }

    const result = await postCast(post.text, imageUrl);
    if (result.success) {
      post.posted = true;
      post.postedAt = new Date().toISOString();
      post.castHash = result.hash;
      console.log(`  Posted: ${result.hash}`);
    } else {
      post.error = result.error;
      console.error(`  Failed: ${result.error}`);
    }
  } catch (err: any) {
    post.error = err.message;
    console.error(`  ❌ Failed: ${err.message}`);
  }

  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  console.log('\n💾 Updated farcaster-posts.json');
}

main().catch(console.error);

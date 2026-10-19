#!/usr/bin/env node
/**
 * Farcaster Scheduled Executor
 * Posts text with validated image or video embeds via Neynar API.
 * Reads from farcaster-posts.json (same format as linkedin-posts.json).
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { isMain } from './viz-publishing.js';
import { farcasterVideoUrl, socialVideoSource } from '../src/lib/social-video.js';

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

type VideoStreamMetadata = { width_px?: number; height_px?: number };
type VideoMetadata = {
  _status?: string;
  content_type?: string;
  // The live API returns streams; its OpenAPI schema also documents stream.
  video?: { duration_s?: number; streams?: VideoStreamMetadata[]; stream?: VideoStreamMetadata[] };
};

export async function prepareVideoEmbed(source: string, request: typeof fetch = fetch, wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))): Promise<string> {
  const apiKey = process.env.NEYNAR_API_KEY;
  if (!apiKey) throw new Error('NEYNAR_API_KEY is required to verify the video embed');
  const url = farcasterVideoUrl(source, process.env.FARCASTER_MEDIA_PROXY_BASE_URL || undefined);
  const head = await request(url, { method: 'HEAD', signal: AbortSignal.timeout(30000) });
  if (!head.ok) throw new Error(`Farcaster video returned HTTP ${head.status}; deploy the media endpoint before publishing`);
  if (!/^video\/mp4(?:;|$)/i.test(head.headers.get('content-type') || '')) {
    throw new Error('Farcaster video must be served as video/mp4, not a binary download');
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await request(`https://api.neynar.com/v2/farcaster/cast/embed/crawl/?url=${encodeURIComponent(url)}`, {
      headers: { 'x-api-key': apiKey }, signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`Farcaster video metadata check returned HTTP ${response.status}`);
    const { metadata } = await response.json() as { metadata?: VideoMetadata };
    if (metadata?._status?.toUpperCase() === 'RESOLVED' &&
        /^video\/mp4(?:;|$)/i.test(metadata?.content_type || '') &&
        (metadata?.video?.duration_s || 0) > 0 &&
        (metadata?.video?.streams ?? metadata?.video?.stream)?.some(stream => (stream.width_px || 0) > 0 && (stream.height_px || 0) > 0)) {
      return url;
    }
    if (['RESOLVED', 'ERROR', 'FAILED'].includes(metadata?._status?.toUpperCase() || '')) break;
    if (attempt < 2) await wait(5000);
  }
  throw new Error('Farcaster could not recognise the embed as a playable video; no cast was sent');
}

export async function postCast(text: string, imageUrl?: string | null): Promise<{ success: boolean; hash?: string; url?: string; error?: string }> {
  const apiKey = process.env.NEYNAR_API_KEY;
  const signerUuid = process.env.NEYNAR_SIGNER_UUID;
  if (!apiKey || !signerUuid) return { success: false, error: 'Farcaster credentials are missing' };
  const castText = truncateForFarcaster(text);

  const body: Record<string, unknown> = {
    signer_uuid: signerUuid,
    text: castText,
  };

  if (imageUrl) {
    body.embeds = [{ url: imageUrl }];
  }

  const res = await fetch('https://api.neynar.com/v2/farcaster/cast', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    return { success: false, error: `${res.status}: ${err.substring(0, 150)}` };
  }

  const data = await res.json() as any;
  const hash = data.cast?.hash;
  const username = data.cast?.author?.username;
  const url = typeof hash === 'string' && /^0x[0-9a-f]{40}$/i.test(hash) && typeof username === 'string'
    ? `https://farcaster.xyz/${encodeURIComponent(username)}/${hash.slice(0, 10)}` : undefined;
  return { success: true, hash, ...(url ? { url } : {}) };
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

  const COOLDOWN_HOURS = Number(process.env.FC_COOLDOWN_HOURS || '7');
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
    if (post.image && isVideo(post.image)) {
      const absolute = path.resolve(REPO_ROOT, post.image);
      if (!fs.existsSync(absolute)) throw new Error('Farcaster video file is missing');
      const relative = path.relative(REPO_ROOT, absolute).split(path.sep).join('/');
      imageUrl = await prepareVideoEmbed(socialVideoSource(relative));
    } else if (post.image) {
      console.log('  Uploading image via Neynar storage...');
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
      process.exitCode = 1;
      console.error(`  Failed: ${result.error}`);
    }
  } catch (err: any) {
    post.error = err.message;
    process.exitCode = 1;
    console.error(`  ❌ Failed: ${err.message}`);
  }

  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  console.log('\n💾 Updated farcaster-posts.json');
}

if (isMain(import.meta.url)) main().catch(err => { console.error(err); process.exitCode = 1; });

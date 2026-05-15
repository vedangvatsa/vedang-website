#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { triggerBoost } from './smm-boost-trigger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const BLUESKY_HANDLE = process.env.BLUESKY_HANDLE!;
const BLUESKY_APP_PASSWORD = process.env.BLUESKY_APP_PASSWORD!;
const BLUESKY_SERVICE = 'https://bsky.social';

const TIMEZONE_OFFSET_HOURS = 5.5; // IST
const POSTS_FILE = path.resolve(__dirname, 'bluesky-posts.json');

interface BlueskyPost {
  id: string;
  text: string;
  image?: string;
  scheduleDate: string;
  scheduleTime: string;
  posted: boolean;
  postedAt?: string;
  postUri?: string;
  error?: string;
}

interface Session {
  did: string;
  accessJwt: string;
}

async function createSession(): Promise<Session> {
  const res = await fetch(`${BLUESKY_SERVICE}/xrpc/com.atproto.server.createSession`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: BLUESKY_HANDLE,
      password: BLUESKY_APP_PASSWORD,
    }),
  });

  if (!res.ok) {
    throw new Error(`Auth failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json() as any;
  return { did: data.did, accessJwt: data.accessJwt };
}

function isVideo(filePath: string): boolean {
  return /\.(mp4|mov|webm)$/i.test(filePath);
}

async function compressImage(absPath: string): Promise<{ buffer: Buffer; mimeType: string }> {
  const sharp = (await import('sharp')).default;
  const MAX_BYTES = 900_000; // 900KB — safe margin under Bluesky's 1MB blob limit
  const ext = path.extname(absPath).toLowerCase();

  // GIFs: extract first frame and convert to JPEG
  if (ext === '.gif') {
    console.log(`  🔄 Converting GIF → JPEG (first frame)`);
    let buf = await sharp(absPath, { animated: false, pages: 1 })
      .jpeg({ quality: 80 })
      .toBuffer();
    if (buf.length > MAX_BYTES) {
      buf = await sharp(buf).resize({ width: 1200, withoutEnlargement: true }).jpeg({ quality: 70 }).toBuffer();
    }
    return { buffer: buf, mimeType: 'image/jpeg' };
  }

  let buf = fs.readFileSync(absPath);
  if (buf.length <= MAX_BYTES) {
    const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
    return { buffer: buf, mimeType };
  }

  // Oversized: progressively resize as JPEG until under limit
  console.log(`  🔄 Compressing ${(buf.length / 1024 / 1024).toFixed(1)}MB → <900KB`);
  let quality = 80;
  let width = 1600;
  while (buf.length > MAX_BYTES && quality >= 40) {
    buf = await sharp(absPath).resize({ width, withoutEnlargement: true }).jpeg({ quality }).toBuffer();
    quality -= 10;
    width -= 200;
  }
  console.log(`  ✅ Compressed to ${(buf.length / 1024).toFixed(0)}KB`);
  return { buffer: buf, mimeType: 'image/jpeg' };
}

async function uploadImage(session: Session, imagePath: string): Promise<any | null> {
  const absPath = path.isAbsolute(imagePath)
    ? imagePath
    : path.resolve(REPO_ROOT, imagePath);

  if (!fs.existsSync(absPath)) {
    console.warn(`  ⚠️ Image not found: ${absPath}`);
    return null;
  }

  // AT Protocol doesn't support video uploads — skip video files
  if (isVideo(absPath)) {
    console.warn(`  ⚠️ Bluesky doesn't support video uploads, posting text-only`);
    return null;
  }

  const { buffer, mimeType } = await compressImage(absPath);

  const res = await fetch(`${BLUESKY_SERVICE}/xrpc/com.atproto.repo.uploadBlob`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessJwt}`,
      'Content-Type': mimeType,
    },
    body: buffer,
  });

  if (!res.ok) {
    console.error(`  ❌ Image upload failed: ${await res.text()}`);
    return null;
  }

  const data = await res.json() as any;
  return data.blob;
}

function detectFacets(text: string): any[] {
  const facets: any[] = [];

  // Detect URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[1];
    const byteStart = Buffer.byteLength(text.substring(0, match.index), 'utf8');
    const byteEnd = byteStart + Buffer.byteLength(url, 'utf8');
    facets.push({
      index: { byteStart, byteEnd },
      features: [{ $type: 'app.bsky.richtext.facet#link', uri: url }],
    });
  }

  // Detect bare domain links like veda.ng/lit
  const bareUrlRegex = /(?<!\w)(veda\.ng\/[^\s,.)]+)/g;
  while ((match = bareUrlRegex.exec(text)) !== null) {
    const domain = match[1];
    const byteStart = Buffer.byteLength(text.substring(0, match.index), 'utf8');
    const byteEnd = byteStart + Buffer.byteLength(domain, 'utf8');
    // Check if already covered by a URL facet
    const alreadyCovered = facets.some(f => f.index.byteStart <= byteStart && f.index.byteEnd >= byteEnd);
    if (!alreadyCovered) {
      facets.push({
        index: { byteStart, byteEnd },
        features: [{ $type: 'app.bsky.richtext.facet#link', uri: `https://${domain}` }],
      });
    }
  }

  return facets;
}

async function createPost(session: Session, post: BlueskyPost): Promise<string> {
  // Enforce 300 grapheme limit for Bluesky
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  const segments = Array.from(segmenter.segment(post.text));
  
  let finalContent = post.text;
  if (segments.length > 300) {
    // Truncate to 298 to leave room for the ellipsis
    finalContent = segments.slice(0, 298).map(s => s.segment).join('') + '…';
    console.log(`  ✂️ Text truncated from ${segments.length} to 300 graphemes`);
  }

  const record: any = {
    $type: 'app.bsky.feed.post',
    text: finalContent,
    createdAt: new Date().toISOString(),
    langs: ['en'],
  };

  // Add facets for links
  const facets = detectFacets(finalContent);
  if (facets.length > 0) {
    record.facets = facets;
  }

  // Upload and attach image if present (skip video — AT Protocol doesn't support it)
  if (post.image && !isVideo(post.image)) {
    const blob = await uploadImage(session, post.image);
    if (!blob) {
      throw new Error(`Media failed: ${post.image} — skipped`);
    }
    record.embed = {
      $type: 'app.bsky.embed.images',
      images: [{
        alt: post.id,
        image: blob,
      }],
    };
  }

  const res = await fetch(`${BLUESKY_SERVICE}/xrpc/com.atproto.repo.createRecord`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessJwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      repo: session.did,
      collection: 'app.bsky.feed.post',
      record,
    }),
  });

  if (!res.ok) {
    throw new Error(`Post failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json() as any;
  return data.uri;
}

async function main() {
  if (!BLUESKY_HANDLE || !BLUESKY_APP_PASSWORD) {
    console.log('⏭️ Bluesky credentials not set, skipping');
    return;
  }

  if (!fs.existsSync(POSTS_FILE)) {
    console.log('⏭️ No bluesky-posts.json found');
    return;
  }

  const posts: BlueskyPost[] = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
  const now = new Date();
  const istNow = new Date(now.getTime() + TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000);
  const todayIST = istNow.toISOString().slice(0, 10);
  const currentTimeIST = istNow.toISOString().slice(11, 16);

  console.log(`🦋 Bluesky scheduler running at ${todayIST} ${currentTimeIST} IST`);
  console.log(`📋 Total posts: ${posts.length}, Posted: ${posts.filter(p => p.posted).length}`);

  // COOLDOWN: max 3 posts/day with 8h gap between each.
  const COOLDOWN_HOURS = 7;
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

  console.log(`📤 ${due.length} post(s) due`);

  const session = await createSession();
  console.log(`🔑 Authenticated as ${session.did}`);

  let posted = false;
  for (const post of due) {
    try {
      console.log(`\n📝 Posting: ${post.id}`);
      const uri = await createPost(session, post);
      post.posted = true;
      post.postedAt = new Date().toISOString();
      post.postUri = uri;
      console.log(`  ✅ Posted: ${uri}`);
      try { triggerBoost('bluesky', uri); } catch(e) { console.warn('⚠️ Boost failed:', e); }
      posted = true;
      break; // Only 1 successful post per run
    } catch (err: any) {
      if (err.message?.includes('skipped')) {
        console.warn(`  ⏭️ ${err.message}`);
        post.posted = true;
        post.error = err.message;
        continue; // Try next post
      }
      post.error = err.message;
      console.error(`  ❌ Failed: ${err.message}`);
      break; // Stop on real failure
    }
  }

  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  console.log('\n💾 Updated bluesky-posts.json');
}

main().catch(console.error);

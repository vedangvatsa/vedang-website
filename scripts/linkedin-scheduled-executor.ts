#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import FormData from 'form-data';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN!;
const PERSON_URN = process.env.LINKEDIN_PERSON_URN!; // e.g. urn:li:person:XXXXXXXX

const TIMEZONE_OFFSET_HOURS = 5.5; // IST
const POSTS_FILE = path.resolve(__dirname, 'linkedin-posts.json');

interface LinkedInPost {
  id: string;
  text: string;
  image?: string;
  scheduleDate: string;
  scheduleTime: string;
  posted: boolean;
  postedAt?: string;
  postId?: string;
  error?: string;
}
const VIDEO_EXTS = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
const LINKEDIN_HEADERS = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
  'LinkedIn-Version': '202604',
  'X-Restli-Protocol-Version': '2.0.0',
};

async function uploadImage(absPath: string): Promise<string | null> {
  // Step 1: Initialize
  const initRes = await fetch('https://api.linkedin.com/rest/images?action=initializeUpload', {
    method: 'POST',
    headers: LINKEDIN_HEADERS,
    body: JSON.stringify({ initializeUploadRequest: { owner: PERSON_URN } }),
  });

  if (!initRes.ok) {
    console.error(`  ❌ Image init failed: ${await initRes.text()}`);
    return null;
  }

  const initData = await initRes.json() as any;
  const uploadUrl: string = initData.value.uploadUrl;
  const imageUrn: string = initData.value.image;

  // Step 2: Upload binary
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/octet-stream' },
    body: fs.readFileSync(absPath),
  });

  if (!uploadRes.ok) {
    console.error(`  ❌ Image upload failed: ${await uploadRes.text()}`);
    return null;
  }

  console.log(`  📷 Image uploaded: ${imageUrn}`);
  return imageUrn;
}

async function uploadVideo(absPath: string): Promise<string | null> {
  const fileSizeBytes = fs.statSync(absPath).size;
  console.log(`  🎬 Video size: ${(fileSizeBytes / 1024 / 1024).toFixed(1)}MB`);

  // Step 1: Initialize video upload
  const initRes = await fetch('https://api.linkedin.com/rest/videos?action=initializeUpload', {
    method: 'POST',
    headers: LINKEDIN_HEADERS,
    body: JSON.stringify({
      initializeUploadRequest: {
        owner: PERSON_URN,
        fileSizeBytes,
        uploadCaptions: false,
        uploadThumbnail: false,
      },
    }),
  });

  if (!initRes.ok) {
    console.error(`  ❌ Video init failed: ${await initRes.text()}`);
    return null;
  }

  const initData = await initRes.json() as any;
  const videoUrn: string = initData.value.video;
  const uploadInstructions = initData.value.uploadInstructions;
  const uploadToken: string = initData.value.uploadToken;

  console.log(`  📤 Uploading ${uploadInstructions.length} chunk(s)...`);

  // Step 2: Upload binary chunk(s)
  const fileBuffer = fs.readFileSync(absPath);
  for (const instruction of uploadInstructions) {
    const { uploadUrl, firstByte, lastByte } = instruction;
    const chunk = fileBuffer.slice(firstByte, lastByte + 1);

    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/octet-stream',
      },
      body: chunk,
    });

    if (!uploadRes.ok) {
      console.error(`  ❌ Video chunk upload failed: ${await uploadRes.text()}`);
      return null;
    }
  }

  // Step 3: Finalize video upload
  const finalRes = await fetch('https://api.linkedin.com/rest/videos?action=finalizeUpload', {
    method: 'POST',
    headers: LINKEDIN_HEADERS,
    body: JSON.stringify({
      finalizeUploadRequest: {
        video: videoUrn,
        uploadToken,
      },
    }),
  });

  if (!finalRes.ok) {
    console.error(`  ❌ Video finalize failed: ${await finalRes.text()}`);
    return null;
  }

  console.log(`  🎬 Video uploaded: ${videoUrn}`);
  return videoUrn;
}

async function uploadMedia(mediaPath: string): Promise<{ urn: string; type: 'image' | 'video' } | null> {
  const absPath = path.isAbsolute(mediaPath)
    ? mediaPath
    : path.resolve(REPO_ROOT, mediaPath);

  if (!fs.existsSync(absPath)) {
    console.warn(`  ⚠️ Media not found: ${absPath}`);
    return null;
  }

  const ext = path.extname(absPath).toLowerCase();
  const isVideo = VIDEO_EXTS.includes(ext);

  if (isVideo) {
    const urn = await uploadVideo(absPath);
    return urn ? { urn, type: 'video' } : null;
  } else {
    const urn = await uploadImage(absPath);
    return urn ? { urn, type: 'image' } : null;
  }
}

async function postToLinkedIn(
  text: string,
  mediaPath?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  let media: { urn: string; type: 'image' | 'video' } | null = null;

  if (mediaPath) {
    media = await uploadMedia(mediaPath);
    if (!media) {
      return { success: false, error: `Media upload failed for: ${mediaPath} — aborting post (will not post text-only)` };
    }
  }

  const body: any = {
    author: PERSON_URN,
    commentary: text,
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: 'PUBLISHED',
  };

  if (media) {
    body.content = {
      media: {
        id: media.urn,
      },
    };
  }

  const res = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: LINKEDIN_HEADERS,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    return { success: false, error: errText };
  }

  const postUrn = res.headers.get('x-restli-id') ?? 'unknown';
  return { success: true, id: postUrn };
}


async function main() {
  if (!ACCESS_TOKEN || !PERSON_URN) {
    console.error('❌ Missing LINKEDIN_ACCESS_TOKEN or LINKEDIN_PERSON_URN');
    process.exit(1);
  }

  if (!fs.existsSync(POSTS_FILE)) {
    console.log('⚠️  No linkedin-posts.json found');
    return;
  }

  const posts: LinkedInPost[] = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));

  const now = new Date();
  const localNow = new Date(now.getTime() + TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000);
  const currentDate = localNow.toISOString().split('T')[0];
  const currentTime = localNow.toISOString().split('T')[1].substring(0, 5);

  console.log(`🕒 Current Time (IST): ${currentDate} ${currentTime}`);

  let modified = false;

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

  for (const post of posts) {
    if (post.posted) continue;

    const isDue =
      post.scheduleDate < currentDate ||
      (post.scheduleDate === currentDate && post.scheduleTime <= currentTime);

    if (!isDue) continue;

    console.log(`🚀 Posting to LinkedIn: "${post.id}"`);

    const result = await postToLinkedIn(post.text, post.image);

    if (result.success) {
      console.log(`✅ Posted! ID: ${result.id}`);
      post.posted = true;
      post.postedAt = new Date().toISOString();
      post.postId = result.id;
      delete post.error;
      modified = true;
      break; // Only 1 post per run
    } else {
      console.error(`❌ Failed: ${result.error}`);
      post.error = result.error;
      modified = true;
      break; // Stop on failure too
    }
  }

  if (modified) {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
    console.log('📝 Updated linkedin-posts.json');
    console.log('::set-output name=modified::true');
  } else {
    console.log('😴 No LinkedIn posts due at this time');
  }
}

main().catch(console.error);

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

async function uploadImage(imagePath: string): Promise<string | null> {
  const absPath = path.isAbsolute(imagePath)
    ? imagePath
    : path.resolve(REPO_ROOT, imagePath);

  if (!fs.existsSync(absPath)) {
    console.warn(`  ⚠️ Image not found: ${absPath}`);
    return null;
  }

  // Step 1: Register upload
  const registerRes = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
        owner: PERSON_URN,
        serviceRelationships: [
          { relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' },
        ],
      },
    }),
  });

  if (!registerRes.ok) {
    console.error(`  ❌ Image register failed: ${await registerRes.text()}`);
    return null;
  }

  const registerData = await registerRes.json() as any;
  const uploadUrl: string = registerData.value.uploadMechanism[
    'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
  ].uploadUrl;
  const asset: string = registerData.value.asset;

  // Step 2: Upload binary
  const imageBuffer = fs.readFileSync(absPath);
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'image/png',
    },
    body: imageBuffer,
  });

  if (!uploadRes.ok) {
    console.error(`  ❌ Image upload failed: ${await uploadRes.text()}`);
    return null;
  }

  console.log(`  📷 Image uploaded: ${asset}`);
  return asset;
}

async function postToLinkedIn(
  text: string,
  imagePath?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  let asset: string | null = null;

  if (imagePath) {
    asset = await uploadImage(imagePath);
  }

  const body: any = {
    author: PERSON_URN,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        shareMediaCategory: asset ? 'IMAGE' : 'NONE',
        ...(asset && {
          media: [
            {
              status: 'READY',
              description: { text: '' },
              media: asset,
              title: { text: '' },
            },
          ],
        }),
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    return { success: false, error: errText };
  }

  const postId = res.headers.get('x-restli-id') ?? 'unknown';
  return { success: true, id: postId };
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
  let postsPublished = 0;

  // Limit to 1 post per run to avoid batch-posting when catching up on
  // past-due posts (e.g. after a scheduler outage or timezone drift).
  // The cron runs frequently enough that queued posts will drip out naturally.
  const MAX_POSTS_PER_RUN = 1;

  for (const post of posts) {
    if (post.posted) continue;
    if (postsPublished >= MAX_POSTS_PER_RUN) break;

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
      postsPublished++;
    } else {
      console.error(`❌ Failed: ${result.error}`);
      post.error = result.error;
    }

    modified = true;
    await new Promise(r => setTimeout(r, 3000));
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

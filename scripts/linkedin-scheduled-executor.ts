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

async function uploadMedia(mediaPath: string): Promise<{ asset: string; type: 'IMAGE' | 'VIDEO' } | null> {
  const absPath = path.isAbsolute(mediaPath)
    ? mediaPath
    : path.resolve(REPO_ROOT, mediaPath);

  if (!fs.existsSync(absPath)) {
    console.warn(`  ⚠️ Media not found: ${absPath}`);
    return null;
  }

  const isVideo = absPath.toLowerCase().endsWith('.mp4') || absPath.toLowerCase().endsWith('.mov');
  const recipe = isVideo ? 'urn:li:digitalmediaRecipe:feedshare-video' : 'urn:li:digitalmediaRecipe:feedshare-image';
  const mimeType = isVideo ? 'video/mp4' : 'image/png';

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
        recipes: [recipe],
        owner: PERSON_URN,
        serviceRelationships: [
          { relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' },
        ],
      },
    }),
  });

  if (!registerRes.ok) {
    console.error(`  ❌ Media register failed: ${await registerRes.text()}`);
    return null;
  }

  const registerData = await registerRes.json() as any;
  const uploadUrl: string = registerData.value.uploadMechanism[
    'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
  ].uploadUrl;
  const asset: string = registerData.value.asset;

  // Step 2: Upload binary
  const mediaBuffer = fs.readFileSync(absPath);
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': mimeType,
    },
    body: mediaBuffer,
  });

  if (!uploadRes.ok) {
    console.error(`  ❌ Media upload failed: ${await uploadRes.text()}`);
    return null;
  }

  if (isVideo) {
    console.log(`  ⏳ Waiting for video processing for asset: ${asset}`);
    let ready = false;
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 5000)); // Wait 5s between checks
      
      const statusRes = await fetch(`https://api.linkedin.com/v2/assets/${asset}`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });

      if (statusRes.ok) {
        const statusData = await statusRes.json() as any;
        const recipes = statusData.recipes || [];
        const recipeStatus = recipes.length > 0 ? recipes[0].status : null;
        
        if (recipeStatus === 'AVAILABLE') {
          ready = true;
          break;
        } else if (recipeStatus === 'PROCESSING_FAILED') {
          console.error(`  ❌ Video processing failed: ${JSON.stringify(statusData)}`);
          return null;
        }
      }
    }

    if (!ready) {
      console.warn(`  ⚠️ Video processing timed out after 100 seconds. Continuing anyway...`);
    }
  }

  console.log(`  📸 Media uploaded and ready: ${asset} (${isVideo ? 'VIDEO' : 'IMAGE'})`);
  return { asset, type: isVideo ? 'VIDEO' : 'IMAGE' };
}

async function postToLinkedIn(
  text: string,
  mediaPath?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  let mediaObj: { asset: string; type: 'IMAGE' | 'VIDEO' } | null = null;

  if (mediaPath) {
    mediaObj = await uploadMedia(mediaPath);
  }

  const body: any = {
    author: PERSON_URN,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        shareMediaCategory: mediaObj ? mediaObj.type : 'NONE',
        ...(mediaObj && {
          media: [
            {
              status: 'READY',
              description: { text: '' },
              media: mediaObj.asset,
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

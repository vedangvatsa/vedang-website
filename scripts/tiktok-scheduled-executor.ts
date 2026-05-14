#!/usr/bin/env node
/**
 * TikTok Scheduled Executor
 * Reads from tiktok-posts.json, uploads video via Content Posting API,
 * and triggers SMM boost immediately after publishing.
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN!;
const OPEN_ID = process.env.TIKTOK_OPEN_ID!;
const POSTS_FILE = path.resolve(__dirname, 'tiktok-posts.json');

interface TikTokPost {
  id: string;
  videoPath: string;
  title: string;
  posted: boolean;
  postedAt?: string;
  publishId?: string;
  error?: string;
}

async function main() {
  if (!ACCESS_TOKEN || !OPEN_ID) {
    console.error('❌ Missing TIKTOK_ACCESS_TOKEN or TIKTOK_OPEN_ID. Cannot post.');
    process.exit(1);
  }

  if (!fs.existsSync(POSTS_FILE)) {
    fs.writeFileSync(POSTS_FILE, JSON.stringify([], null, 2));
    console.log('✅ Created empty tiktok-posts.json queue');
    return;
  }

  const posts: TikTokPost[] = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
  const pendingPost = posts.find(p => !p.posted);

  if (!pendingPost) {
    console.log('✅ No pending TikTok posts in the queue.');
    return;
  }

  console.log(`\n⏳ Found pending post: [${pendingPost.id}] ${pendingPost.title}`);

  const videoAbsPath = path.isAbsolute(pendingPost.videoPath) 
    ? pendingPost.videoPath 
    : path.resolve(REPO_ROOT, pendingPost.videoPath);

  if (!fs.existsSync(videoAbsPath)) {
    console.error(`❌ Video file not found: ${videoAbsPath}`);
    pendingPost.error = 'Video file not found';
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
    process.exit(1);
  }

  const videoSize = fs.statSync(videoAbsPath).size;

  try {
    // Step 1: Initialize Video Upload
    console.log('📡 Initializing TikTok video upload...');
    const initRes = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post_info: {
          title: pendingPost.title,
          privacy_level: 'PUBLIC_TO_EVERYONE',
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 1000
        },
        source_info: {
          source: 'FILE_UPLOAD',
          video_size: videoSize,
          chunk_size: videoSize,
          total_chunk_count: 1
        }
      })
    });

    const initData = await initRes.json() as any;

    if (initData.error?.code !== 'ok') {
      throw new Error(`Init failed: ${JSON.stringify(initData)}`);
    }

    const publishId = initData.data.publish_id;
    const uploadUrl = initData.data.upload_url;

    // Step 2: Upload Video Bytes
    console.log(`📤 Uploading video file (${(videoSize / 1024 / 1024).toFixed(2)} MB)...`);
    const videoStream = fs.readFileSync(videoAbsPath);
    
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Range': `bytes 0-${videoSize - 1}/${videoSize}`,
        'Content-Type': 'video/mp4'
      },
      body: videoStream
    });

    if (!uploadRes.ok) {
      throw new Error(`Upload failed with status ${uploadRes.status}`);
    }

    console.log('✅ Video uploaded successfully to TikTok.');
    
    // Mark as posted
    pendingPost.posted = true;
    pendingPost.postedAt = new Date().toISOString();
    pendingPost.publishId = publishId;
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
    
    console.log('✅ Queue updated.');

    // Step 3: Trigger SMM Boost
    // For TikTok, we usually boost the profile link or the video ID directly
    console.log('\n🚀 Triggering SMM Boost for TikTok...');
    try {
      // NOTE: Because TikTok processes the video async, the actual public URL might not be available instantly.
      // Usually, SMM panels accept the profile URL to auto-boost the latest post, 
      // or we can pass a dummy marker that SMM handles internally.
      const smmCmd = `npx tsx scripts/smm-boost.ts --platform tiktok --url "https://www.tiktok.com/@vedang.vatsa/video/${publishId}"`;
      execSync(smmCmd, { stdio: 'inherit' });
    } catch (e) {
      console.warn('⚠️ SMM Boost failed to trigger, but post was uploaded successfully.');
    }

  } catch (err: any) {
    console.error('\n❌ TikTok Publish Error:', err.message);
    pendingPost.error = err.message;
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  }
}

main().catch(console.error);

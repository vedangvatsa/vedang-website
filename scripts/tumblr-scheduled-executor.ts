#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import OAuth from 'oauth';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const CONSUMER_KEY = process.env.TUMBLR_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.TUMBLR_CONSUMER_SECRET!;
const ACCESS_TOKEN = process.env.TUMBLR_ACCESS_TOKEN!;
const ACCESS_SECRET = process.env.TUMBLR_ACCESS_SECRET!;
const BLOG_NAME = process.env.TUMBLR_BLOG_NAME!;

const TIMEZONE_OFFSET_HOURS = 5.5;
const POSTS_FILE = path.resolve(__dirname, 'tumblr-posts.json');

interface TumblrPost {
  id: string;
  text: string;
  tags: string[];
  image?: string;
  scheduleDate: string;
  scheduleTime: string;
  posted: boolean;
  postedAt?: string;
  tumblrId?: string;
  error?: string;
}

function createOAuth() {
  return new OAuth.OAuth(
    'https://www.tumblr.com/oauth/request_token',
    'https://www.tumblr.com/oauth/access_token',
    CONSUMER_KEY,
    CONSUMER_SECRET,
    '1.0A',
    null,
    'HMAC-SHA1'
  );
}

function oauthPostRaw(url: string, body: Record<string, any>): Promise<string> {
  const oa = createOAuth();
  return new Promise((resolve, reject) => {
    oa.post(
      url,
      ACCESS_TOKEN,
      ACCESS_SECRET,
      body,
      'application/x-www-form-urlencoded',
      (err: any, data: any) => {
        if (err) return reject(new Error(`Tumblr API error: ${JSON.stringify(err)}`));
        resolve(data as string);
      }
    );
  });
}

async function publishPost(post: TumblrPost): Promise<string> {
  const url = `https://api.tumblr.com/v2/blog/${BLOG_NAME}/post`;

  const body: Record<string, any> = {
    type: 'text',
    title: post.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    body: post.text.replace(/\n/g, '<br>'),
    tags: post.tags.join(','),
    format: 'html',
  };

  // If there's an image, make it a photo post
  if (post.image) {
    const absPath = path.isAbsolute(post.image) ? post.image : path.resolve(REPO_ROOT, post.image);
    if (fs.existsSync(absPath)) {
      // For photo posts with local files, use data64
      const imgBuffer = fs.readFileSync(absPath);
      body.type = 'photo';
      body.data64 = imgBuffer.toString('base64');
      body.caption = post.text.replace(/\n/g, '<br>');
      delete body.title;
      delete body.body;
    }
  }

  const raw = await oauthPostRaw(url, body);
  // Extract ID as string from raw JSON to avoid JS number precision loss
  // Tumblr IDs exceed Number.MAX_SAFE_INTEGER
  const idMatch = raw.match(/"id"\s*:\s*(\d+)/);
  return idMatch ? idMatch[1] : 'posted';
}

async function main() {
  if (!CONSUMER_KEY || !ACCESS_TOKEN || !BLOG_NAME) {
    console.log('⏭️ Tumblr credentials not set, skipping');
    return;
  }

  if (!fs.existsSync(POSTS_FILE)) {
    console.log('⏭️ No tumblr-posts.json found');
    return;
  }

  const posts: TumblrPost[] = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
  const now = new Date();
  const istNow = new Date(now.getTime() + TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000);
  const todayIST = istNow.toISOString().slice(0, 10);
  const currentTimeIST = istNow.toISOString().slice(11, 16);

  console.log(`🟦 Tumblr scheduler running at ${todayIST} ${currentTimeIST} IST`);
  console.log(`📋 Total posts: ${posts.length}, Posted: ${posts.filter(p => p.posted).length}`);

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

  const due = posts.filter(p =>
    !p.posted &&
    (p.scheduleDate < todayIST || (p.scheduleDate === todayIST && p.scheduleTime <= currentTimeIST))
  );

  if (due.length === 0) {
    console.log('✅ No posts due');
    return;
  }

  console.log(`📤 ${due.length} post(s) due — will post 1`);

  const post = due[0]; // Only take the first due post
  try {
    console.log(`\n📝 Posting: ${post.id}`);
    const postId = await publishPost(post);
    post.posted = true;
    post.postedAt = new Date().toISOString();
    post.tumblrId = postId;
    console.log(`  ✅ Posted: ${postId}`);
  } catch (err: any) {
    post.error = err.message;
    console.error(`  ❌ Failed: ${err.message}`);
  }

  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  console.log('\n💾 Updated tumblr-posts.json');
}

main().catch(console.error);

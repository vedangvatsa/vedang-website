#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { TwitterApi } from 'twitter-api-v2';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const client = new TwitterApi({
  appKey: process.env.X_API_KEY!,
  appSecret: process.env.X_API_KEY_SECRET!,
  accessToken: process.env.X_ACCESS_TOKEN!,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
});

const TIMEZONE_OFFSET_HOURS = 5.5; // IST
const POSTS_FILE = path.resolve(__dirname, 'x-posts.json');

interface TweetItem {
  text: string;
  image?: string;
}

interface XPost {
  id: string;
  type?: 'single' | 'thread';
  text?: string;           // single tweet
  image?: string;          // image for single tweet
  tweets?: TweetItem[];    // thread tweets
  scheduleDate: string;
  scheduleTime: string;
  posted: boolean;
  postedAt?: string;
  tweetId?: string;
  error?: string;
}

async function postSingleTweet(text: string, image?: string): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const params: Record<string, unknown> = { text };

    if (image) {
      const absImage = path.isAbsolute(image) ? image : path.resolve(REPO_ROOT, image);
      if (fs.existsSync(absImage)) {
        const mediaId = await client.v1.uploadMedia(absImage, { mimeType: 'image/png' });
        params.media = { media_ids: [mediaId] };
      } else {
        console.warn(`  ⚠️ Image not found: ${absImage}`);
      }
    }

    const { data } = await client.v2.tweet(params as Parameters<typeof client.v2.tweet>[0]);
    return { success: true, id: data.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

async function postThread(tweets: TweetItem[]): Promise<{ success: boolean; id?: string; error?: string }> {
  let previousId: string | undefined;
  let firstId: string | undefined;

  for (let i = 0; i < tweets.length; i++) {
    const { text, image } = tweets[i];
    try {
      const params: Record<string, unknown> = { text };

      if (image) {
        const absImage = path.isAbsolute(image) ? image : path.resolve(REPO_ROOT, image);
        if (fs.existsSync(absImage)) {
          const mediaId = await client.v1.uploadMedia(absImage, { mimeType: 'image/png' });
          params.media = { media_ids: [mediaId] };
        } else {
          console.warn(`  ⚠️ Image not found: ${absImage}`);
        }
      }

      if (previousId) {
        params.reply = { in_reply_to_tweet_id: previousId };
      }

      const { data } = await client.v2.tweet(params as Parameters<typeof client.v2.tweet>[0]);
      previousId = data.id;
      if (!firstId) firstId = data.id;

      console.log(`  ✅ Tweet ${i + 1}/${tweets.length} posted (ID: ${data.id})`);
      if (i < tweets.length - 1) await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  return { success: true, id: firstId };
}

async function main() {
  if (!fs.existsSync(POSTS_FILE)) {
    console.log('⚠️  No posts file found');
    return;
  }

  const posts: XPost[] = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));

  const now = new Date();
  const localNow = new Date(now.getTime() + TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000);
  const currentDate = localNow.toISOString().split('T')[0];
  const currentTime = localNow.toISOString().split('T')[1].substring(0, 5);

  console.log(`🕒 Current Time (IST): ${currentDate} ${currentTime}`);

  let modified = false;
  let postsPublished = 0;

  // Limit to 1 post per run to avoid batch-posting when catching up
  const MAX_POSTS_PER_RUN = 1;

  for (const post of posts) {
    if (post.posted) continue;
    if (postsPublished >= MAX_POSTS_PER_RUN) break;

    const isDue =
      post.scheduleDate < currentDate ||
      (post.scheduleDate === currentDate && post.scheduleTime <= currentTime);

    if (!isDue) continue;

    const isThread = post.type === 'thread' && post.tweets;
    console.log(`🚀 Posting ${isThread ? 'thread' : 'tweet'}: "${post.id}"`);

    const result = isThread
      ? await postThread(post.tweets!)
      : await postSingleTweet(post.text!, post.image);

    if (result.success) {
      console.log(`✅ Posted! First ID: ${result.id}`);
      post.posted = true;
      post.postedAt = new Date().toISOString();
      post.tweetId = result.id;
      delete post.error;
      postsPublished++;
    } else {
      console.error(`❌ Failed: ${result.error}`);
      post.error = result.error;
    }

    modified = true;
    await new Promise(r => setTimeout(r, 2000));
  }

  if (modified) {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
    console.log('📝 Updated posts file');
    console.log('::set-output name=modified::true');
  } else {
    console.log('😴 No posts due at this time');
  }
}

main().catch(console.error);

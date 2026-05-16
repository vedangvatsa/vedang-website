#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { TwitterApi } from 'twitter-api-v2';
import { triggerBoost } from './smm-boost-trigger.js';

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
const QUOTE_POSTS_FILE = path.resolve(__dirname, 'x-quote-posts.json');
const REPLY_POSTS_FILE = path.resolve(__dirname, 'x-reply-posts.json');

interface TweetItem {
  text: string;
  image?: string;
}

interface XPost {
  id: string;
  type?: 'single' | 'thread' | 'quote' | 'reply';
  text?: string;
  image?: string;
  tweets?: TweetItem[];
  quote_tweet_id?: string;
  reply_to_tweet_id?: string;
  original_author?: string;
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
      if (!fs.existsSync(absImage)) {
        return { success: false, error: `Image not found: ${absImage} — aborting (will not post text-only)` };
      }
      const mimeType = absImage.endsWith('.mp4') ? 'video/mp4' : absImage.endsWith('.gif') ? 'image/gif' : 'image/png';
      const mediaId = await client.v1.uploadMedia(absImage, { mimeType });
      params.media = { media_ids: [mediaId] };
    }

    const { data } = await client.v2.tweet(params as Parameters<typeof client.v2.tweet>[0]);
    return { success: true, id: data.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

async function postQuoteTweet(text: string, quoteTweetId: string, authorHandle?: string): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // Use URL embedding because X API restricts quote_tweet_id for non-mentioned users
    const handle = (authorHandle || '').replace('@', '');
    const tweetUrl = `https://x.com/${handle}/status/${quoteTweetId}`;
    const fullText = `${text}\n\n${tweetUrl}`;
    const { data } = await client.v2.tweet({ text: fullText });
    return { success: true, id: data.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

async function postReply(text: string, replyToId: string, authorHandle?: string): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // X API blocks direct replies. Instead, post a standalone tweet
    // with @mention + embedded URL for notification + visibility.
    const handle = (authorHandle || '').replace('@', '');
    const tweetUrl = `https://x.com/${handle}/status/${replyToId}`;
    const fullText = `${text}\n\n${tweetUrl}`;
    const { data } = await client.v2.tweet({ text: fullText });
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
        if (!fs.existsSync(absImage)) {
          return { success: false, error: `Image not found: ${absImage} — aborting thread (will not post text-only)` };
        }
        const mimeType = absImage.endsWith('.mp4') ? 'video/mp4' : absImage.endsWith('.gif') ? 'image/gif' : 'image/png';
        const mediaId = await client.v1.uploadMedia(absImage, { mimeType });
        params.media = { media_ids: [mediaId] };
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
  // Load from both post files
  let posts: XPost[] = [];
  let postsSource = '';

  if (fs.existsSync(POSTS_FILE)) {
    const regular = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8')) as XPost[];
    posts.push(...regular);
  }
  if (fs.existsSync(QUOTE_POSTS_FILE)) {
    const quotes = JSON.parse(fs.readFileSync(QUOTE_POSTS_FILE, 'utf-8')) as XPost[];
    posts.push(...quotes);
  }
  if (fs.existsSync(REPLY_POSTS_FILE)) {
    const replies = JSON.parse(fs.readFileSync(REPLY_POSTS_FILE, 'utf-8')) as XPost[];
    posts.push(...replies);
  }

  if (posts.length === 0) {
    console.log('⚠️  No posts files found');
    return;
  }

  // Deduplicate by post ID and text content
  const seenIds = new Set<string>();
  const seenText = new Set<string>();
  posts = posts.filter(p => {
    if (seenIds.has(p.id)) return false;
    seenIds.add(p.id);
    const textKey = (p.text || p.tweets?.map(t => t.text).join('') || '').trim();
    if (textKey && seenText.has(textKey)) return false;
    if (textKey) seenText.add(textKey);
    return true;
  });
  console.log(`📋 ${posts.length} unique posts after dedup`);

  const now = new Date();
  const localNow = new Date(now.getTime() + TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000);
  const currentDate = localNow.toISOString().split('T')[0];
  const currentTime = localNow.toISOString().split('T')[1].substring(0, 5);

  console.log(`🕒 Current Time (IST): ${currentDate} ${currentTime}`);

  let modified = false;

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

  for (const post of posts) {
    if (post.posted) continue;

    const isDue =
      post.scheduleDate < currentDate ||
      (post.scheduleDate === currentDate && post.scheduleTime <= currentTime);

    if (!isDue) continue;

    const isThread = post.type === 'thread' && post.tweets;
    const isQuote = post.type === 'quote' && post.quote_tweet_id;
    const isReply = post.type === 'reply' && post.reply_to_tweet_id;
    console.log(`🚀 Posting ${isReply ? 'reply' : isQuote ? 'quote' : isThread ? 'thread' : 'tweet'}: "${post.id}"`);

    let result;
    if (isReply) {
      result = await postReply(post.text!, post.reply_to_tweet_id!, post.original_author);
    } else if (isQuote) {
      result = await postQuoteTweet(post.text!, post.quote_tweet_id!, post.original_author);
    } else if (isThread) {
      result = await postThread(post.tweets!);
    } else {
      result = await postSingleTweet(post.text!, post.image);
    }

    if (result.success) {
      console.log(`✅ Posted! First ID: ${result.id}`);
      post.posted = true;
      post.postedAt = new Date().toISOString();
      post.tweetId = result.id;
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
    // Write back to the correct files
    if (fs.existsSync(POSTS_FILE)) {
      const regular = posts.filter(p => p.type !== 'quote' && p.type !== 'reply');
      
    try { triggerBoost('twitter', `https://twitter.com/vedangvatsa/status/${post.postUri}`); } catch(e) {}
    fs.writeFileSync(POSTS_FILE, JSON.stringify(regular, null, 2));
    }
    if (fs.existsSync(QUOTE_POSTS_FILE)) {
      const quotes = posts.filter(p => p.type === 'quote');
      fs.writeFileSync(QUOTE_POSTS_FILE, JSON.stringify(quotes, null, 2));
    }
    if (fs.existsSync(REPLY_POSTS_FILE)) {
      const replies = posts.filter(p => p.type === 'reply');
      fs.writeFileSync(REPLY_POSTS_FILE, JSON.stringify(replies, null, 2));
    }
    console.log('📝 Updated posts files');
    console.log('::set-output name=modified::true');
  } else {
    console.log('😴 No posts due at this time');
  }
}

main().catch(console.error);

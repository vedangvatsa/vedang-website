#!/usr/bin/env node
/**
 * Post all pending X quote tweets.
 * Uses URL embedding instead of quote_tweet_id (API restriction workaround).
 * X auto-renders a tweet URL at the end as a visual quote.
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { TwitterApi } from 'twitter-api-v2';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const client = new TwitterApi({
  appKey: process.env.X_API_KEY!,
  appSecret: process.env.X_API_KEY_SECRET!,
  accessToken: process.env.X_ACCESS_TOKEN!,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
});

const QUOTE_FILE = path.resolve(__dirname, 'x-quote-posts.json');

async function main() {
  const posts = JSON.parse(fs.readFileSync(QUOTE_FILE, 'utf-8'));
  const pending = posts.filter((p: any) => !p.posted && p.type === 'quote');

  console.log(`📋 Pending: ${pending.length}\n`);

  let posted = 0;
  for (const post of pending) {
    try {
      // Build the tweet URL from the author handle and tweet ID
      const authorHandle = (post.original_author || '').replace('@', '');
      const tweetUrl = `https://x.com/${authorHandle}/status/${post.quote_tweet_id}`;

      // Combine our commentary + the tweet URL (X auto-renders it as quote)
      const fullText = `${post.text}\n\n${tweetUrl}`;

      console.log(`🚀 [${posted + 1}/${pending.length}] Quoting ${post.original_author}...`);
      console.log(`   💬 "${post.text.substring(0, 80)}..."`);

      const { data } = await client.v2.tweet({ text: fullText });

      post.posted = true;
      post.postedAt = new Date().toISOString();
      post.tweetId = data.id;
      delete post.error;
      posted++;

      console.log(`   ✅ Posted! ID: ${data.id}`);
      fs.writeFileSync(QUOTE_FILE, JSON.stringify(posts, null, 2));

      // Wait 2 minutes between posts
      if (posted < pending.length) {
        console.log(`   ⏳ Waiting 2 min...\n`);
        await new Promise(r => setTimeout(r, 2 * 60 * 1000));
      }
    } catch (err: any) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.log(`   ❌ Failed: ${errMsg}`);
      if (err.data) console.log(`   Data: ${JSON.stringify(err.data)}`);
      post.error = errMsg;
      fs.writeFileSync(QUOTE_FILE, JSON.stringify(posts, null, 2));

      if (errMsg.includes('429') || errMsg.includes('Rate')) {
        console.log('🛑 Rate limited. Stopping.');
        break;
      }
    }
  }

  console.log(`\n📊 Posted ${posted}/${pending.length}`);
}

main();

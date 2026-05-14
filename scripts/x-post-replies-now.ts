#!/usr/bin/env node
/**
 * Post all pending X reply-style posts.
 * 
 * Since X API blocks direct replies for non-mentioned users,
 * we post standalone tweets that @mention the original author
 * and embed their tweet URL. This actually gets MORE visibility
 * than a reply because it appears in your followers' feeds.
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

const REPLY_FILE = path.resolve(__dirname, 'x-reply-posts.json');

async function main() {
  const posts = JSON.parse(fs.readFileSync(REPLY_FILE, 'utf-8'));
  const pending = posts.filter((p: any) => !p.posted);

  console.log(`📋 Pending: ${pending.length}\n`);

  let posted = 0;
  for (const post of pending) {
    try {
      const handle = (post.original_author || '').replace('@', '');
      const tweetUrl = `https://x.com/${handle}/status/${post.reply_to_tweet_id}`;

      // Format: thought + mention + embedded URL
      const fullText = `${post.text}\n\n${tweetUrl}`;

      console.log(`💬 [${posted + 1}/${pending.length}] → ${post.original_author}`);
      console.log(`   "${post.text.substring(0, 80)}..."`);

      const { data } = await client.v2.tweet({ text: fullText });

      post.posted = true;
      post.postedAt = new Date().toISOString();
      post.tweetId = data.id;
      delete post.error;
      posted++;

      console.log(`   ✅ ID: ${data.id}`);
      fs.writeFileSync(REPLY_FILE, JSON.stringify(posts, null, 2));

      if (posted < pending.length) {
        console.log(`   ⏳ 2 min...\n`);
        await new Promise(r => setTimeout(r, 2 * 60 * 1000));
      }
    } catch (err: any) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.log(`   ❌ ${errMsg}`);
      if (err.data) console.log(`   ${JSON.stringify(err.data)}`);
      post.error = errMsg;
      fs.writeFileSync(REPLY_FILE, JSON.stringify(posts, null, 2));

      if (errMsg.includes('429') || errMsg.includes('Rate')) {
        console.log('🛑 Rate limited. Stopping.');
        break;
      }
    }
  }

  console.log(`\n📊 Posted ${posted}/${pending.length}`);
}

main();

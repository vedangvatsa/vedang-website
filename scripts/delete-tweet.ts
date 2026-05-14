#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
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

async function main() {
  const tweetId = process.argv[2];
  if (!tweetId) { console.log('Usage: npx tsx delete-tweet.ts <tweetId>'); return; }
  await client.v2.deleteTweet(tweetId);
  console.log(`✅ Deleted tweet ${tweetId}`);
}
main().catch(console.error);

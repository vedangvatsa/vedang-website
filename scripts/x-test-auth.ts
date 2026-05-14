#!/usr/bin/env node
/**
 * Creative reply approaches:
 * 1. Raw HTTP request bypassing library abstractions
 * 2. Reply + quote_tweet_id combo
 * 3. Reply to a REPLY on the thread (not the root tweet)
 * 4. Use conversation_id in the payload
 * 5. Use the OAuth2 token with raw fetch
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { TwitterApi } from 'twitter-api-v2';
import crypto from 'crypto';
import https from 'https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const client = new TwitterApi({
  appKey: process.env.X_API_KEY!,
  appSecret: process.env.X_API_KEY_SECRET!,
  accessToken: process.env.X_ACCESS_TOKEN!,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
});

// Load OAuth2 token if available
const TOKEN_FILE = path.resolve(__dirname, '.x-oauth2-token.json');
let oauth2Token: string | null = null;
if (fs.existsSync(TOKEN_FILE)) {
  oauth2Token = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8')).accessToken;
}

const testTweetId = '2052301649905905810'; // @ecommerceshares

async function main() {
  console.log('=== Creative Reply Workarounds ===\n');

  // 1. Find a reply IN the thread and reply to that instead
  console.log('--- 1: Reply to a REPLY in the thread (not root tweet) ---');
  try {
    // Get conversation replies
    const conv = await client.v2.search(
      `conversation_id:${testTweetId}`,
      { max_results: 10, 'tweet.fields': ['author_id', 'in_reply_to_user_id'], expansions: ['author_id'], 'user.fields': ['username'] }
    );
    
    if (conv.data?.data?.length) {
      const reply = conv.data.data[0];
      const users = new Map<string, string>();
      if (conv.includes?.users) {
        for (const u of conv.includes.users) users.set(u.id, u.username);
      }
      const replyAuthor = users.get(reply.author_id!) || '?';
      console.log(`Found reply by @${replyAuthor}: "${reply.text.substring(0, 50)}..."`);
      console.log('Trying to reply to this reply...');
      
      const { data } = await client.v2.tweet({
        text: 'Good point.',
        reply: { in_reply_to_tweet_id: reply.id },
      } as any);
      console.log(`✅ REPLY TO REPLY WORKS! ID: ${data.id}`);
      await client.v2.deleteTweet(data.id);
      console.log('Cleaned up\n');
    } else {
      console.log('No replies found in conversation\n');
    }
  } catch (err: any) {
    console.log(`❌ ${err.data?.detail || err.message}\n`);
  }

  // 2. Reply with quote_tweet_id combo
  console.log('--- 2: Reply + quote_tweet_id combo ---');
  try {
    const { data } = await client.v2.tweet({
      text: 'Interesting take.',
      reply: { in_reply_to_tweet_id: testTweetId },
      quote_tweet_id: testTweetId,
    } as any);
    console.log(`✅ Combo works! ID: ${data.id}`);
    await client.v2.deleteTweet(data.id);
  } catch (err: any) {
    console.log(`❌ ${err.data?.detail || err.message}\n`);
  }

  // 3. Raw fetch with OAuth2 token
  if (oauth2Token) {
    console.log('--- 3: Raw fetch with OAuth2 bearer ---');
    try {
      const body = JSON.stringify({
        text: 'Great point on the AI landscape.',
        reply: { in_reply_to_tweet_id: testTweetId },
      });

      const res = await fetch('https://api.x.com/2/tweets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${oauth2Token}`,
          'Content-Type': 'application/json',
        },
        body,
      });
      const json = await res.json();
      if (res.ok) {
        console.log(`✅ Raw fetch reply works! ID: ${json.data?.id}`);
        // cleanup
        await fetch(`https://api.x.com/2/tweets/${json.data.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${oauth2Token}` },
        });
      } else {
        console.log(`❌ ${res.status}: ${json.detail || JSON.stringify(json)}`);
      }
    } catch (err: any) {
      console.log(`❌ ${err.message}\n`);
    }
  }

  // 4. Reply to OUR OWN quote tweet (we're in that conversation)
  console.log('\n--- 4: Reply to our own quote tweet (self-thread with context) ---');
  try {
    // Post a quote-style tweet first
    const tweetUrl = `https://x.com/ecommerceshares/status/${testTweetId}`;
    const { data: qt } = await client.v2.tweet({
      text: `Interesting perspective on Europe and AI.\n\n${tweetUrl}`,
    });
    console.log(`Posted quote: ${qt.id}`);
    
    // Now reply to OUR OWN tweet (this works - creates a thread)
    const { data: reply } = await client.v2.tweet({
      text: 'The gap between EU and US on AI investment is widening every quarter.',
      reply: { in_reply_to_tweet_id: qt.id },
    } as any);
    console.log(`✅ Self-thread reply works! ID: ${reply.id}`);
    console.log('This creates: [quote embed] → [our follow-up thought]');
    
    // Cleanup
    await client.v2.deleteTweet(reply.id);
    await client.v2.deleteTweet(qt.id);
    console.log('Cleaned up');
  } catch (err: any) {
    console.log(`❌ ${err.data?.detail || err.message}`);
  }
}

main();

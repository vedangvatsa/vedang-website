import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { TwitterApi } from 'twitter-api-v2';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = '/Users/vedang/vedang-website';
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const client = new TwitterApi({
  appKey: process.env.X_API_KEY!,
  appSecret: process.env.X_API_KEY_SECRET!,
  accessToken: process.env.X_ACCESS_TOKEN!,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
});

const posts = JSON.parse(fs.readFileSync(path.resolve(REPO_ROOT, 'scripts/x-posts.json'), 'utf-8'));

const postedTweets = posts.filter((p: any) => p.posted && p.tweetId);
const tweetIds = postedTweets.map((p: any) => p.tweetId);

async function main() {
  console.log(`Fetching metrics for ${tweetIds.length} tweets...\n`);
  
  try {
    const result = await client.v2.tweets(tweetIds, {
      'tweet.fields': ['public_metrics', 'created_at', 'text'],
    });
    
    const metrics: any[] = [];
    
    for (const tweet of result.data) {
      const post = postedTweets.find((p: any) => p.tweetId === tweet.id);
      const m = tweet.public_metrics;
      metrics.push({
        id: post?.id || 'unknown',
        text: tweet.text.substring(0, 80) + '...',
        views: m?.impression_count || 0,
        likes: m?.like_count || 0,
        retweets: m?.retweet_count || 0,
        replies: m?.reply_count || 0,
        quotes: m?.quote_count || 0,
        bookmarks: m?.bookmark_count || 0,
      });
    }
    
    // Sort by views descending
    metrics.sort((a, b) => b.views - a.views);
    
    console.log('=== X POST PERFORMANCE (sorted by views) ===\n');
    for (const m of metrics) {
      console.log(`📊 ${m.id}`);
      console.log(`   "${m.text}"`);
      console.log(`   Views: ${m.views.toLocaleString()} | Likes: ${m.likes} | RTs: ${m.retweets} | Replies: ${m.replies} | Bookmarks: ${m.bookmarks}`);
      console.log(`   Engagement rate: ${((m.likes + m.retweets + m.replies) / Math.max(m.views, 1) * 100).toFixed(2)}%`);
      console.log('');
    }
  } catch (err) {
    console.error('Error fetching tweets:', err);
  }
}

main();

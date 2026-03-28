import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const posts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'bluesky-posts.json'), 'utf-8'));
const postedPosts = posts.filter((p: any) => p.posted && p.postUri);

async function main() {
  console.log(`Fetching Bluesky metrics for ${postedPosts.length} posts...\n`);
  
  const uris = postedPosts.map((p: any) => p.postUri);
  
  // Bluesky public API - getPosts
  const params = uris.map((u: string) => `uris=${encodeURIComponent(u)}`).join('&');
  const res = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getPosts?${params}`);
  
  if (!res.ok) {
    console.error(`Error: ${res.status} ${await res.text()}`);
    return;
  }
  
  const data = await res.json() as any;
  
  const metrics: any[] = [];
  
  for (const post of data.posts) {
    const matched = postedPosts.find((p: any) => p.postUri === post.uri);
    metrics.push({
      id: matched?.id || 'unknown',
      text: post.record?.text?.substring(0, 80) + '...',
      likes: post.likeCount || 0,
      reposts: post.repostCount || 0,
      replies: post.replyCount || 0,
      quotes: post.quoteCount || 0,
    });
  }
  
  metrics.sort((a, b) => (b.likes + b.reposts + b.replies) - (a.likes + a.reposts + a.replies));
  
  console.log('=== BLUESKY POST PERFORMANCE (sorted by total engagement) ===\n');
  for (const m of metrics) {
    const total = m.likes + m.reposts + m.replies + m.quotes;
    console.log(`📊 ${m.id}`);
    console.log(`   "${m.text}"`);
    console.log(`   Likes: ${m.likes} | Reposts: ${m.reposts} | Replies: ${m.replies} | Quotes: ${m.quotes} | Total: ${total}`);
    console.log('');
  }
}

main().catch(console.error);

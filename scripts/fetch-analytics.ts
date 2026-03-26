#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { TwitterApi } from 'twitter-api-v2';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

// ─── Types ───────────────────────────────────────────────────────
interface PostMetrics {
  platform: string;
  postId: string;
  contentId: string;
  postedAt: string;
  impressions?: number;
  likes?: number;
  reposts?: number;
  replies?: number;
  comments?: number;
  clicks?: number;
  views?: number;
  shares?: number;
  notes?: number;
  reactions?: number;
  error?: string;
}

// ─── X (Twitter) ────────────────────────────────────────────────
async function fetchXMetrics(): Promise<PostMetrics[]> {
  const client = new TwitterApi({
    appKey: process.env.X_API_KEY!,
    appSecret: process.env.X_API_KEY_SECRET!,
    accessToken: process.env.X_ACCESS_TOKEN!,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
  });

  const posts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'x-posts.json'), 'utf-8'));
  const posted = posts.filter((p: any) => p.posted && p.tweetId);
  const results: PostMetrics[] = [];

  for (const post of posted) {
    try {
      const { data } = await client.v2.singleTweet(post.tweetId, {
        'tweet.fields': ['public_metrics', 'created_at'],
      });
      const m = data.public_metrics;
      results.push({
        platform: 'X',
        postId: post.tweetId,
        contentId: post.id,
        postedAt: post.postedAt,
        impressions: m?.impression_count,
        likes: m?.like_count,
        reposts: m?.retweet_count,
        replies: m?.reply_count,
      });
    } catch (err: any) {
      results.push({
        platform: 'X',
        postId: post.tweetId,
        contentId: post.id,
        postedAt: post.postedAt,
        error: err.message,
      });
    }
  }
  return results;
}

// ─── LinkedIn ───────────────────────────────────────────────────
// LinkedIn's personal API does not expose engagement metrics (likes, comments,
// impressions) without r_organization_social scope. We record posts as confirmed.
async function fetchLinkedInMetrics(): Promise<PostMetrics[]> {
  const posts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'linkedin-posts.json'), 'utf-8'));
  const posted = posts.filter((p: any) => p.posted && p.postId);
  return posted.map((post: any) => ({
    platform: 'LinkedIn',
    postId: post.postId,
    contentId: post.id,
    postedAt: post.postedAt,
    // Engagement metrics unavailable via personal API
  }));
}


// ─── Bluesky ────────────────────────────────────────────────────
async function fetchBlueskyMetrics(): Promise<PostMetrics[]> {
  const posts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'bluesky-posts.json'), 'utf-8'));
  const posted = posts.filter((p: any) => p.posted && p.postUri);
  const results: PostMetrics[] = [];

  // Authenticate
  const authRes = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: process.env.BLUESKY_HANDLE!,
      password: process.env.BLUESKY_APP_PASSWORD!,
    }),
  });
  const session = await authRes.json() as any;

  for (const post of posted) {
    try {
      const res = await fetch(
        `https://bsky.social/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(post.postUri)}&depth=0`,
        { headers: { Authorization: `Bearer ${session.accessJwt}` } }
      );
      const data = await res.json() as any;
      const thread = data.thread?.post;
      results.push({
        platform: 'Bluesky',
        postId: post.postUri,
        contentId: post.id,
        postedAt: post.postedAt,
        likes: thread?.likeCount,
        reposts: thread?.repostCount,
        replies: thread?.replyCount,
      });
    } catch (err: any) {
      results.push({
        platform: 'Bluesky',
        postId: post.postUri,
        contentId: post.id,
        postedAt: post.postedAt,
        error: err.message,
      });
    }
  }
  return results;
}

// ─── Facebook ───────────────────────────────────────────────────
async function fetchFacebookMetrics(): Promise<PostMetrics[]> {
  const token = process.env.FACEBOOK_PAGE_TOKEN!;
  const posts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'facebook-posts.json'), 'utf-8'));
  const posted = posts.filter((p: any) => p.posted && p.fbPostId);
  const results: PostMetrics[] = [];

  for (const post of posted) {
    try {
      const res = await fetch(
        `https://graph.facebook.com/v19.0/${post.fbPostId}?fields=likes.summary(true),comments.summary(true),shares&access_token=${token}`
      );
      if (!res.ok) throw new Error(`FB API ${res.status}: ${await res.text()}`);
      const data = await res.json() as any;

      results.push({
        platform: 'Facebook',
        postId: post.fbPostId,
        contentId: post.id,
        postedAt: post.postedAt,
        likes: data.likes?.summary?.total_count,
        comments: data.comments?.summary?.total_count,
        shares: data.shares?.count,
      });
    } catch (err: any) {
      results.push({
        platform: 'Facebook',
        postId: post.fbPostId,
        contentId: post.id,
        postedAt: post.postedAt,
        error: err.message,
      });
    }
  }
  return results;
}

// ─── Tumblr ─────────────────────────────────────────────────────
async function fetchTumblrMetrics(): Promise<PostMetrics[]> {
  const blogName = process.env.TUMBLR_BLOG_NAME!;
  const apiKey = process.env.TUMBLR_CONSUMER_KEY!;
  const posts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'tumblr-posts.json'), 'utf-8'));
  const posted = posts.filter((p: any) => p.posted && p.tumblrId);
  const results: PostMetrics[] = [];

  for (const post of posted) {
    try {
      const res = await fetch(
        `https://api.tumblr.com/v2/blog/${blogName}/posts?id=${post.tumblrId}&api_key=${apiKey}`
      );
      const data = await res.json() as any;
      const tumblrPost = data.response?.posts?.[0];
      results.push({
        platform: 'Tumblr',
        postId: post.tumblrId,
        contentId: post.id,
        postedAt: post.postedAt,
        notes: tumblrPost?.note_count,
      });
    } catch (err: any) {
      results.push({
        platform: 'Tumblr',
        postId: post.tumblrId,
        contentId: post.id,
        postedAt: post.postedAt,
        error: err.message,
      });
    }
  }
  return results;
}

// ─── Dev.to ─────────────────────────────────────────────────────
async function fetchDevToMetrics(): Promise<PostMetrics[]> {
  const apiKey = process.env.DEVTO_API_KEY!;
  const posts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'devto-posts.json'), 'utf-8'));
  const posted = posts.filter((p: any) => p.posted && p.devtoUrl);
  const results: PostMetrics[] = [];

  if (posted.length === 0) return results;

  try {
    // Fetch all user articles
    const res = await fetch('https://dev.to/api/articles/me/published?per_page=100', {
      headers: { 'api-key': apiKey },
    });
    const articles = await res.json() as any[];

    for (const post of posted) {
      const article = articles.find((a: any) => a.url === post.devtoUrl || a.canonical_url?.includes(post.slug));
      if (article) {
        results.push({
          platform: 'Dev.to',
          postId: String(article.id),
          contentId: post.id,
          postedAt: post.postedAt,
          views: article.page_views_count,
          reactions: article.positive_reactions_count,
          comments: article.comments_count,
        });
      }
    }
  } catch (err: any) {
    results.push({
      platform: 'Dev.to',
      postId: 'all',
      contentId: 'all',
      postedAt: '',
      error: err.message,
    });
  }
  return results;
}

// ─── Hashnode ───────────────────────────────────────────────────
async function fetchHashnodeMetrics(): Promise<PostMetrics[]> {
  const token = process.env.HASHNODE_TOKEN!;
  const pubId = process.env.HASHNODE_PUBLICATION_ID!;
  const posts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'hashnode-posts.json'), 'utf-8'));
  const posted = posts.filter((p: any) => p.posted && p.hashnodeUrl);
  const results: PostMetrics[] = [];

  if (posted.length === 0) return results;

  try {
    const query = `
      query GetPosts($pubId: ObjectId!) {
        publication(id: $pubId) {
          posts(first: 50) {
            edges {
              node {
                id
                slug
                title
                views
                reactionCount
                replyCount
                url
              }
            }
          }
        }
      }
    `;

    const res = await fetch('https://gql.hashnode.com', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { pubId } }),
    });

    const data = await res.json() as any;
    const articles = data.data?.publication?.posts?.edges?.map((e: any) => e.node) || [];

    for (const post of posted) {
      const article = articles.find((a: any) => post.hashnodeUrl?.includes(a.slug));
      if (article) {
        results.push({
          platform: 'Hashnode',
          postId: article.id,
          contentId: post.id,
          postedAt: post.postedAt,
          views: article.views,
          reactions: article.reactionCount,
          replies: article.replyCount,
        });
      }
    }
  } catch (err: any) {
    results.push({
      platform: 'Hashnode',
      postId: 'all',
      contentId: 'all',
      postedAt: '',
      error: err.message,
    });
  }
  return results;
}

// ─── Main ───────────────────────────────────────────────────────
async function main() {
  console.log('📊 Fetching analytics from all platforms...\n');

  const allMetrics: PostMetrics[] = [];

  const fetchers = [
    { name: 'X', fn: fetchXMetrics, check: () => !!process.env.X_API_KEY },
    { name: 'LinkedIn', fn: fetchLinkedInMetrics, check: () => !!process.env.LINKEDIN_ACCESS_TOKEN },
    { name: 'Bluesky', fn: fetchBlueskyMetrics, check: () => !!process.env.BLUESKY_HANDLE },
    { name: 'Facebook', fn: fetchFacebookMetrics, check: () => !!process.env.FACEBOOK_PAGE_TOKEN },
    { name: 'Tumblr', fn: fetchTumblrMetrics, check: () => !!process.env.TUMBLR_CONSUMER_KEY },
    { name: 'Dev.to', fn: fetchDevToMetrics, check: () => !!process.env.DEVTO_API_KEY },
    { name: 'Hashnode', fn: fetchHashnodeMetrics, check: () => !!process.env.HASHNODE_TOKEN },
  ];

  for (const { name, fn, check } of fetchers) {
    if (!check()) {
      console.log(`⏭️  ${name}: credentials not set, skipping`);
      continue;
    }
    try {
      console.log(`📡 Fetching ${name}...`);
      const metrics = await fn();
      allMetrics.push(...metrics);
      console.log(`   ✅ ${metrics.length} posts fetched`);
    } catch (err: any) {
      console.error(`   ❌ ${name} failed: ${err.message}`);
    }
  }

  // ─── Report ─────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(80));
  console.log('📊 ANALYTICS REPORT — ' + new Date().toISOString().split('T')[0]);
  console.log('═'.repeat(80));

  // Group by content ID across platforms
  const contentMap = new Map<string, PostMetrics[]>();
  for (const m of allMetrics) {
    const key = m.contentId;
    if (!contentMap.has(key)) contentMap.set(key, []);
    contentMap.get(key)!.push(m);
  }

  // Platform summary
  const platformSummary = new Map<string, { posts: number; totalLikes: number; totalImpressions: number; totalViews: number }>();
  for (const m of allMetrics) {
    if (!platformSummary.has(m.platform)) {
      platformSummary.set(m.platform, { posts: 0, totalLikes: 0, totalImpressions: 0, totalViews: 0 });
    }
    const s = platformSummary.get(m.platform)!;
    s.posts++;
    s.totalLikes += (m.likes ?? 0) + (m.reactions ?? 0);
    s.totalImpressions += m.impressions ?? 0;
    s.totalViews += m.views ?? 0;
  }

  console.log('\n📈 PLATFORM SUMMARY');
  console.log('─'.repeat(80));
  console.log(
    'Platform'.padEnd(12) +
    'Posts'.padStart(6) +
    'Likes'.padStart(8) +
    'Impressions'.padStart(14) +
    'Views'.padStart(8) +
    'Comments'.padStart(10) +
    'Reposts'.padStart(9)
  );
  console.log('─'.repeat(80));

  for (const [platform, s] of platformSummary) {
    const platformMetrics = allMetrics.filter(m => m.platform === platform);
    const totalComments = platformMetrics.reduce((a, m) => a + (m.comments ?? m.replies ?? 0), 0);
    const totalReposts = platformMetrics.reduce((a, m) => a + (m.reposts ?? m.shares ?? 0), 0);

    console.log(
      platform.padEnd(12) +
      String(s.posts).padStart(6) +
      String(s.totalLikes || '-').padStart(8) +
      String(s.totalImpressions || '-').padStart(14) +
      String(s.totalViews || '-').padStart(8) +
      String(totalComments || '-').padStart(10) +
      String(totalReposts || '-').padStart(9)
    );
  }

  console.log('\n📝 POST DETAILS');
  console.log('─'.repeat(80));

  for (const [contentId, metrics] of contentMap) {
    console.log(`\n🔹 ${contentId} (posted: ${metrics[0].postedAt?.split('T')[0] ?? '?'})`);
    for (const m of metrics) {
      if (m.error) {
        console.log(`   ${m.platform.padEnd(10)} ❌ ${m.error.substring(0, 60)}`);
        continue;
      }
      const parts: string[] = [];
      if (m.impressions !== undefined) parts.push(`👁 ${m.impressions}`);
      if (m.views !== undefined) parts.push(`👁 ${m.views}`);
      if (m.likes !== undefined) parts.push(`❤️ ${m.likes}`);
      if (m.reactions !== undefined) parts.push(`❤️ ${m.reactions}`);
      if (m.reposts !== undefined) parts.push(`🔁 ${m.reposts}`);
      if (m.shares !== undefined) parts.push(`🔁 ${m.shares}`);
      if (m.comments !== undefined) parts.push(`💬 ${m.comments}`);
      if (m.replies !== undefined) parts.push(`💬 ${m.replies}`);
      if (m.notes !== undefined) parts.push(`📝 ${m.notes} notes`);
      console.log(`   ${m.platform.padEnd(10)} ${parts.join('  ')}`);
    }
  }

  // ─── Save to JSON ──────────────────────────────────────────
  const reportPath = path.resolve(__dirname, 'analytics-report.json');
  const report = {
    generatedAt: new Date().toISOString(),
    summary: Object.fromEntries(platformSummary),
    posts: allMetrics,
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n💾 Full report saved to scripts/analytics-report.json`);
}

main().catch(console.error);

#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const TOKEN = process.env.HASHNODE_TOKEN!;
const PUB_ID = process.env.HASHNODE_PUBLICATION_ID!;
const GQL_URL = 'https://gql.hashnode.com';

const TIMEZONE_OFFSET_HOURS = 5.5;
const POSTS_FILE = path.resolve(__dirname, 'hashnode-posts.json');
const ESSAYS_DIR = path.resolve(REPO_ROOT, 'src/content/essays');

interface HashnodePost {
  id: string;
  slug: string;
  title: string;
  tags: string[];
  scheduleDate: string;
  scheduleTime?: string;
  posted: boolean;
  postedAt?: string;
  hashnodeUrl?: string;
  error?: string;
}

function extractEssayContent(slug: string): { title: string; body: string } | null {
  const filePath = path.resolve(ESSAYS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;

  const fm = fmMatch[1];
  const titleMatch = fm.match(/title:\s*['"]?(.+?)['"]?\n/);
  const title = titleMatch ? titleMatch[1].trim().replace(/^['"]|['"]$/g, '') : slug;

  let body = raw.replace(/^---\n[\s\S]*?\n---\n*/, '');
  body = body.replace(/^import\s+.*$/gm, '');
  
  // Extract <Figure> and <Image> to standard markdown images
  body = body.replace(/<(?:Figure|Image)\s+([^>]+)\/?>/g, (match, props) => {
    const srcMatch = props.match(/src=["']([^"']+)["']/);
    const altMatch = props.match(/alt=["']([^"']*)["']/);
    let src = srcMatch ? srcMatch[1] : '';
    const alt = altMatch ? altMatch[1] : '';
    if (!src) return '';
    
    // Dev.to/Hashnode fail on SVGs, convert them to their .webp equivalents
    if (src.includes('.svg')) {
      src = src.replace(/\.svg(\?.*)?$/, '.webp');
    }
    
    const absoluteSrc = src.startsWith('/') ? `https://veda.ng${src}` : src;
    return `\n![${alt}](${absoluteSrc})\n`;
  });

  // Convert MDX components to markdown equivalents
  body = body.replace(/<SectionLabel[^>]*label=["']([^"']*)["'][^>]*\/?>/g, '\n## $1\n');
  body = body.replace(/<PullQuote[^>]*quote=["']([^"']*)["'][^>]*\/?>/g, '\n> $1\n');
  body = body.replace(/<Callout[^>]*text=["']([^"']*)["'][^>]*\/?>/g, '\n> 💡 $1\n');
  body = body.replace(/<KeyTakeaway[^>]*text=["']([^"']*)["'][^>]*\/?>/g, '\n> ✅ $1\n');
  
  // Cleanly strip any remaining Next.js/React component tags (starting with Capital letter)
  // but preserve the text inside them so we don't lose content!
  body = body.replace(/<\/?([A-Z][A-Za-z0-9]*)[^>]*>/g, '');

  body = body.trim();

  return { title, body };
}

async function gql(query: string, variables: Record<string, any> = {}): Promise<any> {
  const res = await fetch(GQL_URL, {
    method: 'POST',
    headers: {
      Authorization: TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  const data = await res.json() as any;
  if (data.errors) {
    throw new Error(data.errors.map((e: any) => e.message).join('; '));
  }
  return data.data;
}

async function publishArticle(post: HashnodePost): Promise<string> {
  const essay = extractEssayContent(post.slug);
  if (!essay) throw new Error(`Essay not found: ${post.slug}`);

  const canonicalUrl = `https://veda.ng/essays/${post.slug}`;

  const mutation = `
    mutation PublishPost($input: PublishPostInput!) {
      publishPost(input: $input) {
        post {
          id
          url
          title
        }
      }
    }
  `;

  const input = {
    publicationId: PUB_ID,
    title: essay.title,
    contentMarkdown: essay.body + `\n\n---\n*This essay was originally published on [veda.ng](${canonicalUrl}).*`,
    slug: post.slug,
    originalArticleURL: canonicalUrl,
    tags: post.tags.map(t => ({ slug: t, name: t })),
  };

  const data = await gql(mutation, { input });
  return data.publishPost.post.url;
}

async function main() {
  if (!TOKEN || !PUB_ID) {
    console.log('⏭️ Hashnode credentials not set, skipping');
    return;
  }

  if (!fs.existsSync(POSTS_FILE)) {
    console.log('⏭️ No hashnode-posts.json found');
    return;
  }

  const posts: HashnodePost[] = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
  const now = new Date();
  const istNow = new Date(now.getTime() + TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000);
  const todayIST = istNow.toISOString().slice(0, 10);
  const timeIST = istNow.toISOString().slice(11, 16); // HH:MM

  console.log(`📝 Hashnode scheduler running at ${todayIST} ${timeIST} IST`);
  console.log(`📋 Total articles: ${posts.length}, Posted: ${posts.filter(p => p.posted).length}`);

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

  const due = posts.filter(p => {
    if (p.posted) return false;
    if (p.scheduleDate > todayIST) return false;
    if (p.scheduleDate < todayIST) return true;
    // Same day — check time if present
    if (p.scheduleTime && p.scheduleTime > timeIST) return false;
    return true;
  });

  if (due.length === 0) {
    console.log('✅ No articles due');
    return;
  }

  console.log(`📤 ${due.length} article(s) due — will post 1`);

  const post = due[0]; // Only take the first due article
  try {
    console.log(`\n📝 Publishing: ${post.title} (${post.slug})`);
    const url = await publishArticle(post);
    post.posted = true;
    post.postedAt = new Date().toISOString();
    post.hashnodeUrl = url;
    console.log(`  ✅ Published: ${url}`);
  } catch (err: any) {
    post.error = err.message;
    console.error(`  ❌ Failed: ${err.message}`);
  }

  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  console.log('\n💾 Updated hashnode-posts.json');
}

main().catch(console.error);

#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const API_KEY = process.env.DEVTO_API_KEY!;
const TIMEZONE_OFFSET_HOURS = 5.5; // IST
const POSTS_FILE = path.resolve(__dirname, 'devto-posts.json');
const ESSAYS_DIR = path.resolve(REPO_ROOT, 'src/content/essays');

interface DevToPost {
  id: string;
  slug: string;
  title: string;
  tags: string[];
  scheduleDate: string;
  scheduleTime?: string;
  posted: boolean;
  postedAt?: string;
  devtoUrl?: string;
  error?: string;
}

function extractEssayContent(slug: string): { title: string; body: string; description: string } | null {
  const filePath = path.resolve(ESSAYS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');

  // Extract frontmatter
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;

  const fm = fmMatch[1];
  const titleMatch = fm.match(/title:\s*['"]?(.+?)['"]?\n/);
  const descMatch = fm.match(/description:\s*['"]?(.+?)['"]?\n/);
  const title = titleMatch ? titleMatch[1].trim().replace(/^['"]|['"]$/g, '') : slug;
  const description = descMatch ? descMatch[1].trim().replace(/^['"]|['"]$/g, '') : '';

  // Get body after frontmatter, strip MDX components
  let body = raw.replace(/^---\n[\s\S]*?\n---\n*/, '');

  // Remove MDX imports
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

}

async function publishArticle(post: DevToPost): Promise<string> {
  const essay = extractEssayContent(post.slug);
  if (!essay) throw new Error(`Essay not found: ${post.slug}`);

  const canonicalUrl = `https://veda.ng/essays/${post.slug}`;

  const article = {
    article: {
      title: essay.title,
      body_markdown: essay.body + `\n\n---\n*This essay was originally published on [veda.ng](${canonicalUrl}).*`,
      published: true,
      tags: post.tags.slice(0, 4), // Dev.to allows max 4 tags
      canonical_url: canonicalUrl,
      description: essay.description,
    },
  };

  const res = await fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(article),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Dev.to API error: ${res.status} ${errText}`);
  }

  const data = await res.json() as any;
  return data.url;
}

async function main() {
  if (!API_KEY) {
    console.log('⏭️ Dev.to API key not set, skipping');
    return;
  }

  if (!fs.existsSync(POSTS_FILE)) {
    console.log('⏭️ No devto-posts.json found');
    return;
  }

  const posts: DevToPost[] = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
  const now = new Date();
  const istNow = new Date(now.getTime() + TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000);
  const todayIST = istNow.toISOString().slice(0, 10);
  const timeIST = istNow.toISOString().slice(11, 16); // HH:MM

  console.log(`📝 Dev.to scheduler running at ${todayIST} ${timeIST} IST`);
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
    post.devtoUrl = url;
    console.log(`  ✅ Published: ${url}`);
  } catch (err: any) {
    post.error = err.message;
    console.error(`  ❌ Failed: ${err.message}`);
  }

  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  console.log('\n💾 Updated devto-posts.json');
}

main().catch(console.error);

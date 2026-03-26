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

  // Convert MDX components to markdown equivalents
  body = body.replace(/<SectionLabel[^>]*label="([^"]*)"[^/]*\/>/g, '\n## $1\n');
  body = body.replace(/<PullQuote[^>]*quote="([^"]*)"[^/]*\/>/g, '\n> $1\n');
  body = body.replace(/<Callout[^>]*text="([^"]*)"[^/]*\/>/g, '\n> 💡 $1\n');
  body = body.replace(/<KeyTakeaway[^>]*text="([^"]*)"[^/]*\/>/g, '\n> ✅ $1\n');
  body = body.replace(/<[A-Z][^>]*\/>/g, ''); // Remove remaining self-closing components
  body = body.replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, ''); // Remove remaining component blocks

  body = body.trim();

  return { title, body, description };
}

async function publishArticle(post: DevToPost): Promise<string> {
  const essay = extractEssayContent(post.slug);
  if (!essay) throw new Error(`Essay not found: ${post.slug}`);

  const canonicalUrl = `https://veda.ng/essays/${post.slug}`;

  const article = {
    article: {
      title: essay.title,
      body_markdown: essay.body,
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

  // Post all due articles
  for (const post of due) {
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
  }

  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
  console.log('\n💾 Updated devto-posts.json');
}

main().catch(console.error);

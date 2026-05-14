#!/usr/bin/env node
/**
 * Telegraph Essay Publisher
 * 
 * Publishes all unique social media posts as expanded essay-length Telegraph articles
 * with images and backlinks to LinkedIn, X, and the website.
 * 
 * Takes the longest text version from across platforms and creates
 * properly formatted Telegraph articles with images uploaded via axios.
 * 
 * Usage: npx tsx scripts/telegraph-publisher.ts [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import FormData from 'form-data';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const TELEGRAPH_URLS_FILE = path.resolve(REPO_ROOT, 'telegraph-urls.json');
const POSTS_FILES = {
  x: path.resolve(__dirname, 'x-posts.json'),
  linkedin: path.resolve(__dirname, 'linkedin-posts.json'),
  facebook: path.resolve(__dirname, 'facebook-posts.json'),
  tumblr: path.resolve(__dirname, 'tumblr-posts.json'),
  bluesky: path.resolve(__dirname, 'bluesky-posts.json'),
};

const AUTHOR_NAME = 'Vedang Vatsa';
const AUTHOR_URL = 'https://veda.ng';
const LINKEDIN_URL = 'https://linkedin.com/in/vedangvatsa';
const X_URL = 'https://x.com/vedangvatsa';
const WEBSITE_URL = 'https://veda.ng';

const DELAY_MS = 3500;

interface SocialPost {
  id: string;
  text: string;
  image?: string;
  tags?: string[];
}

interface TelegraphData {
  _token: string;
  [key: string]: any;
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Upload an image to Telegraph using axios + form-data (reliable multipart)
 */
async function uploadImage(imagePath: string): Promise<string | null> {
  const absPath = path.isAbsolute(imagePath) ? imagePath : path.resolve(REPO_ROOT, imagePath);
  if (!fs.existsSync(absPath)) {
    console.log(`  ⚠️ Image not found: ${absPath}`);
    return null;
  }

  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(absPath));

    const resp = await axios.post('https://telegra.ph/upload', form, {
      headers: form.getHeaders(),
      maxContentLength: 50 * 1024 * 1024,
      timeout: 5000,
    });

    if (resp.data && resp.data[0] && resp.data[0].src) {
      return `https://telegra.ph${resp.data[0].src}`;
    }
    console.log(`  ⚠️ Unexpected upload response:`, resp.data);
    return null;
  } catch (err: any) {
    console.log(`  ⚠️ Image upload failed: ${err.message}`);
    return null;
  }
}

/**
 * Generate a readable title from post text
 */
function generateTitle(post: SocialPost): string {
  const firstLine = (post.text || '').split('\n')[0].trim();
  if (firstLine.length <= 80 && firstLine.length > 10) {
    return firstLine;
  }
  return post.id
    .replace(/-\d+$/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Build expanded essay-length Telegraph content from a social media post
 */
function buildContent(post: SocialPost, imageUrl: string | null): object[] {
  const content: object[] = [];

  // Image at the top
  if (imageUrl) {
    content.push({
      tag: 'figure',
      children: [
        { tag: 'img', attrs: { src: imageUrl } },
      ],
    });
  }

  // Author attribution
  content.push({
    tag: 'p',
    children: [
      { tag: 'em', children: [`By ${AUTHOR_NAME} · `] },
      { tag: 'a', attrs: { href: WEBSITE_URL }, children: ['veda.ng'] },
    ],
  });

  // Process the text into paragraphs
  const paragraphs = post.text.split('\n\n').filter(p => p.trim());
  
  // Use first paragraph as a bold lede
  if (paragraphs.length > 0) {
    const firstPara = paragraphs[0];
    if (!firstPara.startsWith('veda.ng')) {
      content.push({
        tag: 'p',
        children: [{ tag: 'strong', children: [firstPara] }],
      });
    }
  }

  // Body paragraphs
  for (let i = 1; i < paragraphs.length; i++) {
    const para = paragraphs[i].trim();

    // Check if it's a veda.ng link
    if (para.startsWith('veda.ng/') || para.startsWith('https://veda.ng/')) {
      const url = para.startsWith('https://') ? para : `https://${para}`;
      content.push({ tag: 'hr' });
      content.push({
        tag: 'p',
        children: [
          { tag: 'strong', children: ['📖 '] },
          { tag: 'a', attrs: { href: url }, children: ['Read the full essay on veda.ng →'] },
        ],
      });
      continue;
    }

    // Handle line breaks within paragraphs
    const lines = para.split('\n');
    const children: (string | object)[] = [];
    for (let j = 0; j < lines.length; j++) {
      if (j > 0) children.push({ tag: 'br' });
      children.push(lines[j]);
    }
    content.push({ tag: 'p', children });
  }

  // Separator before backlinks
  content.push({ tag: 'hr' });

  // Backlink section
  content.push({
    tag: 'h4',
    children: ['About the author'],
  });
  content.push({
    tag: 'p',
    children: [
      'Vedang Vatsa writes about AI, technology, economics, and the psychology of modern systems at ',
      { tag: 'a', attrs: { href: WEBSITE_URL }, children: ['veda.ng'] },
      '.',
    ],
  });
  content.push({
    tag: 'p',
    children: [
      '🌐 Website: ',
      { tag: 'a', attrs: { href: WEBSITE_URL }, children: ['veda.ng'] },
      { tag: 'br' },
      '🐦 X (Twitter): ',
      { tag: 'a', attrs: { href: X_URL }, children: ['@vedangvatsa'] },
      { tag: 'br' },
      '💼 LinkedIn: ',
      { tag: 'a', attrs: { href: LINKEDIN_URL }, children: ['Vedang Vatsa'] },
    ],
  });

  return content;
}

/**
 * Create a Telegraph page via API
 */
async function createPage(
  token: string,
  title: string,
  content: object[],
): Promise<string> {
  const resp = await axios.post('https://api.telegra.ph/createPage', {
    access_token: token,
    title,
    author_name: AUTHOR_NAME,
    author_url: AUTHOR_URL,
    content: JSON.stringify(content),
    return_content: false,
  });

  if (!resp.data.ok || !resp.data.result) {
    throw new Error(`Telegraph API error: ${resp.data.error || JSON.stringify(resp.data)}`);
  }
  return resp.data.result.url;
}

async function main() {
  const isDryRun = process.argv.includes('--dry-run');

  // Load Telegraph data
  const telegraphData: TelegraphData = JSON.parse(fs.readFileSync(TELEGRAPH_URLS_FILE, 'utf-8'));
  const token = process.env.TELEGRAPH_TOKEN || telegraphData._token;

  if (!token) {
    console.error('❌ No Telegraph token found');
    process.exit(1);
  }

  // Collect all unique posts across platforms, preferring longest text
  const allPosts = new Map<string, SocialPost>();
  for (const [platform, file] of Object.entries(POSTS_FILES)) {
    if (!fs.existsSync(file)) continue;
    const posts: SocialPost[] = JSON.parse(fs.readFileSync(file, 'utf-8'));
    for (const post of posts) {
      if (!post.text) continue;
      if (/-(1|2|3|4|5)$/.test(post.id)) continue;
      if (post.id.startsWith('lit-x-') || post.id.startsWith('swarm-x-')) continue;

      const existing = allPosts.get(post.id);
      if (!existing || post.text.length > existing.text.length) {
        allPosts.set(post.id, {
          id: post.id,
          text: post.text,
          image: post.image || existing?.image,
          tags: (post as any).tags || existing?.tags,
        });
      }
    }
  }

  console.log(`📊 Found ${allPosts.size} unique posts`);

  // Filter already published
  const existingIds = new Set(Object.keys(telegraphData).filter(k => k !== '_token'));
  const newPosts = [...allPosts.values()].filter(p => !existingIds.has(p.id));

  console.log(`📋 Already on Telegraph: ${existingIds.size}`);
  console.log(`📤 New essays to publish: ${newPosts.length}`);

  if (isDryRun) {
    console.log('\n🔍 DRY RUN:');
    for (const post of newPosts) {
      const title = generateTitle(post);
      console.log(`  📝 ${post.id}: "${title}" ${post.image ? '📷' : '⚠️ no image'} [${post.text.length} chars]`);
    }
    return;
  }

  if (newPosts.length === 0) {
    console.log('✅ All posts already published!');
    return;
  }

  let published = 0;
  let failed = 0;

  for (const post of newPosts) {
    try {
      const title = generateTitle(post);
      console.log(`\n📝 [${published + failed + 1}/${newPosts.length}] "${title}"`);

      // Upload image
      let imageUrl: string | null = null;
      if (post.image) {
        imageUrl = await uploadImage(post.image);
        if (imageUrl) console.log(`  📷 Image: ${imageUrl}`);
        await sleep(1000);
      }

      // Build essay content and create page
      const content = buildContent(post, imageUrl);
      const url = await createPage(token, title, content);
      console.log(`  ✅ ${url}`);

      // Save
      telegraphData[post.id] = {
        url,
        title,
        category: 'Social',
      };

      published++;
      await sleep(DELAY_MS);
    } catch (err: any) {
      console.error(`  ❌ Failed: ${err.message}`);
      failed++;
      await sleep(DELAY_MS);
    }

    // Save progress periodically
    if ((published + failed) % 10 === 0) {
      fs.writeFileSync(TELEGRAPH_URLS_FILE, JSON.stringify(telegraphData, null, 2));
      console.log(`\n💾 Progress saved (${published} published, ${failed} failed)`);
    }
  }

  // Final save
  fs.writeFileSync(TELEGRAPH_URLS_FILE, JSON.stringify(telegraphData, null, 2));
  console.log(`\n💾 Saved telegraph-urls.json`);
  console.log(`📊 Results: ${published} published, ${failed} failed`);
}

main().catch(console.error);

#!/usr/bin/env node
/**
 * Paragraph.com Blog Rebuilder
 * 
 * Phase 1: Delete all existing posts
 * Phase 2: Upload images to catbox.moe (use cache)
 * Phase 3: Create 700+ word blog articles via REST API POST with imageUrl for cover
 * Phase 4: Publish all via PUT with status: "published"
 * 
 * Usage: npx tsx scripts/paragraph-rebuilder.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import FormData from 'form-data';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const THREAD_ASSETS = path.resolve(__dirname, 'thread-assets');
const PARAGRAPH_URLS_FILE = path.resolve(REPO_ROOT, 'paragraph-urls.json');
const IMAGE_CACHE_FILE = path.resolve(REPO_ROOT, 'catbox-urls.json');
const TEMP_DIR = '/tmp/paragraph-posts';

const API_BASE = 'https://public.api.paragraph.com/api/v1';
const TOKEN = process.env.PARAGRAPH_API_KEY || '';
const HEADERS = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

const LINKEDIN_URL = 'https://linkedin.com/in/vedangvatsa';
const X_URL = 'https://x.com/vedangvatsa';
const WEBSITE_URL = 'https://veda.ng';

const POSTS_FILES = {
  x: path.resolve(__dirname, 'x-posts.json'),
  linkedin: path.resolve(__dirname, 'linkedin-posts.json'),
  facebook: path.resolve(__dirname, 'facebook-posts.json'),
  tumblr: path.resolve(__dirname, 'tumblr-posts.json'),
  bluesky: path.resolve(__dirname, 'bluesky-posts.json'),
};

const DELAY_MS = 2000;

interface SocialPost { id: string; text: string; image?: string; tags?: string[]; }

function sleep(ms: number): Promise<void> { return new Promise(r => setTimeout(r, ms)); }

function generateTitle(post: SocialPost): string {
  const firstLine = (post.text || '').split('\n')[0].trim();
  if (firstLine.length <= 80 && firstLine.length > 10) return firstLine;
  return post.id.replace(/-\d+$/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function getImageFile(post: SocialPost): string | null {
  if (!post.image) return null;
  const imgPath = path.isAbsolute(post.image) ? post.image : path.resolve(REPO_ROOT, post.image);
  return path.basename(imgPath);
}

// =====================================================
// PHASE 1: DELETE ALL EXISTING POSTS
// =====================================================
async function deleteAllPosts() {
  let paragraphData: Record<string, any> = {};
  if (fs.existsSync(PARAGRAPH_URLS_FILE)) {
    paragraphData = JSON.parse(fs.readFileSync(PARAGRAPH_URLS_FILE, 'utf-8'));
  }

  const postIds = Object.values(paragraphData).map((v: any) => v.postId).filter(Boolean);
  console.log(`🗑️  Deleting ${postIds.length} existing posts...`);

  for (let i = 0; i < postIds.length; i++) {
    try {
      await axios.delete(`${API_BASE}/posts/${postIds[i]}`, { headers: HEADERS, timeout: 15000 });
      console.log(`  ✅ Deleted ${i + 1}/${postIds.length}: ${postIds[i]}`);
    } catch (err: any) {
      const msg = err.response?.data?.msg || err.message;
      console.log(`  ⚠️ ${postIds[i]}: ${msg}`);
    }
    await sleep(500);
  }

  fs.writeFileSync(PARAGRAPH_URLS_FILE, JSON.stringify({}, null, 2));
  console.log(`🗑️  Done. Cleared paragraph-urls.json`);
}

// =====================================================
// PHASE 2: LOAD/UPLOAD IMAGES
// =====================================================
async function ensureImages(): Promise<Record<string, string>> {
  let cache: Record<string, string> = {};
  if (fs.existsSync(IMAGE_CACHE_FILE)) {
    cache = JSON.parse(fs.readFileSync(IMAGE_CACHE_FILE, 'utf-8'));
  }

  const pngFiles = fs.readdirSync(THREAD_ASSETS).filter(f => f.endsWith('.png'));
  const missing = pngFiles.filter(f => !cache[f]);
  console.log(`📷 ${Object.keys(cache).length} images cached, ${missing.length} to upload`);

  for (const file of missing) {
    try {
      const form = new FormData();
      form.append('reqtype', 'fileupload');
      form.append('fileToUpload', fs.createReadStream(path.join(THREAD_ASSETS, file)));
      const resp = await axios.post('https://catbox.moe/user/api.php', form, {
        headers: form.getHeaders(), timeout: 30000
      });
      const url = resp.data?.trim();
      if (url?.startsWith('https://files.catbox.moe/')) {
        cache[file] = url;
        console.log(`  ✅ ${file} → ${url}`);
      }
      await sleep(1500);
    } catch (err: any) {
      console.error(`  ❌ ${file}: ${err.message}`);
    }
  }

  fs.writeFileSync(IMAGE_CACHE_FILE, JSON.stringify(cache, null, 2));
  return cache;
}

// =====================================================
// PHASE 3: BUILD BLOG ARTICLE (no filler)
// =====================================================
function buildLongEssay(post: SocialPost, imageUrl: string | null): string {
  const paragraphs = post.text.split('\n\n').filter(p => p.trim());
  const lines: string[] = [];

  // Extract essay link if present
  let essayLinkUrl: string | null = null;
  const contentParagraphs: string[] = [];
  
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (trimmed.startsWith('veda.ng/') || trimmed.startsWith('https://veda.ng/')) {
      essayLinkUrl = trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`;
    } else if (trimmed.startsWith('Try it: veda.ng/') || trimmed.startsWith('Try it: https://veda.ng/')) {
      essayLinkUrl = trimmed.replace('Try it: ', '');
      if (!essayLinkUrl.startsWith('https://')) essayLinkUrl = `https://${essayLinkUrl}`;
    } else {
      contentParagraphs.push(trimmed);
    }
  }

  // Hook — bold the first paragraph
  if (contentParagraphs.length > 0) {
    lines.push(`**${contentParagraphs[0]}**`);
    lines.push('');
  }

  // Body — render remaining paragraphs as-is (no filler, no padding)
  for (let i = 1; i < contentParagraphs.length; i++) {
    const p = contentParagraphs[i];
    
    // Highlight data points as blockquotes
    if (p.match(/\d+%|\$\d+|\d+B|\d+ billion|\d+ million|\d+ trillion/)) {
      lines.push(`> ${p}`);
    } else {
      lines.push(p);
    }
    lines.push('');
  }

  // Read more link
  if (essayLinkUrl) {
    lines.push('---');
    lines.push('');
    lines.push('## Read the Full Essay');
    lines.push('');
    lines.push(`This article is adapted from a longer essay. **[Read the full essay on veda.ng →](${essayLinkUrl})**`);
    lines.push('');
  }

  // Author bio + backlinks
  lines.push('---');
  lines.push('');
  lines.push('## About the Author');
  lines.push('');
  lines.push('Vedang Vatsa writes about AI, technology, behavioral economics, and the hidden psychology of modern systems.');
  lines.push('');
  lines.push(`🌐 **Website:** [veda.ng](${WEBSITE_URL})`);
  lines.push(`🐦 **X (Twitter):** [@vedangvatsa](${X_URL})`);
  lines.push(`💼 **LinkedIn:** [Vedang Vatsa](${LINKEDIN_URL})`);

  return lines.join('\n');
}

// =====================================================
// PHASE 4: CREATE + PUBLISH VIA REST API
// =====================================================
async function createPost(title: string, markdown: string, imageUrl: string | null, tags: string[]): Promise<string> {
  const body: any = {
    title,
    markdown,
    categories: tags,
  };
  if (imageUrl) body.imageUrl = imageUrl;

  const resp = await axios.post(`${API_BASE}/posts`, body, { headers: HEADERS, timeout: 30000 });
  
  // Response might contain the post ID directly
  const data = resp.data;
  const postId = data?.id || data?.postId || data?.post?.id;
  if (!postId) throw new Error(`No post ID in response: ${JSON.stringify(data).slice(0, 200)}`);
  return postId;
}

async function publishPost(postId: string): Promise<void> {
  await axios.put(`${API_BASE}/posts/${postId}`, { status: 'published' }, { headers: HEADERS, timeout: 15000 });
}

// =====================================================
// MAIN
// =====================================================
async function main() {
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

  // Phase 1: Delete all existing posts
  console.log('\n=== PHASE 1: Delete Existing Posts ===\n');
  await deleteAllPosts();

  // Phase 2: Ensure images are uploaded
  console.log('\n=== PHASE 2: Image Upload ===\n');
  const imageCache = await ensureImages();

  // Phase 3+4: Collect posts, generate content, create + publish
  console.log('\n=== PHASE 3: Create Blog Articles ===\n');

  const allPosts = new Map<string, SocialPost>();
  for (const [, file] of Object.entries(POSTS_FILES)) {
    if (!fs.existsSync(file)) continue;
    const posts: SocialPost[] = JSON.parse(fs.readFileSync(file, 'utf-8'));
    for (const post of posts) {
      if (!post.text) continue;
      if (/-(1|2|3|4|5)$/.test(post.id)) continue;
      if (post.id.startsWith('lit-x-') || post.id.startsWith('swarm-x-')) continue;
      const existing = allPosts.get(post.id);
      if (!existing || post.text.length > existing.text.length) {
        allPosts.set(post.id, {
          id: post.id, text: post.text,
          image: post.image || existing?.image,
          tags: (post as any).tags || existing?.tags,
        });
      }
    }
  }

  console.log(`📊 ${allPosts.size} posts to create + publish`);

  let paragraphData: Record<string, any> = {};
  let done = 0, failed = 0;

  for (const post of allPosts.values()) {
    try {
      const title = generateTitle(post);
      const imageFile = getImageFile(post);
      const imageUrl = imageFile ? imageCache[imageFile] || null : null;
      const tags = post.tags || ['ai', 'technology', 'future'];

      console.log(`\n📝 [${done + failed + 1}/${allPosts.size}] "${title.slice(0, 60)}..." ${imageUrl ? '📷' : '⚠️'}`);

      // Build 700+ word essay
      const markdown = buildLongEssay(post, imageUrl);
      const wordCount = markdown.split(/\s+/).length;
      console.log(`  📄 ${wordCount} words, ${markdown.length} chars`);

      // Save to temp file for reference
      fs.writeFileSync(path.join(TEMP_DIR, `${post.id}.md`), markdown);

      // Create via REST API POST (with imageUrl for cover)
      console.log(`  📤 Creating (with cover image)...`);
      const postId = await createPost(title, markdown, imageUrl, tags);
      console.log(`  ✅ Created: ${postId}`);

      // Publish
      console.log(`  🚀 Publishing...`);
      await publishPost(postId);
      console.log(`  ✅ Published!`);

      paragraphData[post.id] = { postId, title, publishedAt: new Date().toISOString() };
      done++;
      await sleep(DELAY_MS);
    } catch (err: any) {
      console.error(`  ❌ ${err.message?.slice(0, 300)}`);
      failed++;
      await sleep(DELAY_MS);
    }

    if ((done + failed) % 10 === 0) {
      fs.writeFileSync(PARAGRAPH_URLS_FILE, JSON.stringify(paragraphData, null, 2));
      console.log(`\n💾 Progress saved (${done} done, ${failed} failed)`);
    }
  }

  fs.writeFileSync(PARAGRAPH_URLS_FILE, JSON.stringify(paragraphData, null, 2));
  console.log(`\n💾 Saved paragraph-urls.json`);
  console.log(`📊 Final: ${done} published, ${failed} failed`);
}

main().catch(console.error);

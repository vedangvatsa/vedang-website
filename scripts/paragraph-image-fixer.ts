#!/usr/bin/env node
/**
 * Upload all thread-assets images to catbox.moe and set them as Paragraph cover images.
 * Also updates existing posts and creates + publishes remaining posts with proper blog content.
 * 
 * Usage: npx tsx scripts/paragraph-image-fixer.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import axios from 'axios';
import FormData from 'form-data';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const THREAD_ASSETS = path.resolve(__dirname, 'thread-assets');
const PARAGRAPH_URLS_FILE = path.resolve(REPO_ROOT, 'paragraph-urls.json');
const IMAGE_CACHE_FILE = path.resolve(REPO_ROOT, 'catbox-urls.json');

const PARAGRAPH_API = 'https://public.api.paragraph.com/api/v1';
const PARAGRAPH_TOKEN = '***REDACTED_PARAGRAPH_KEY***';
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

interface SocialPost {
  id: string;
  text: string;
  image?: string;
  tags?: string[];
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Upload a single image to catbox.moe
 */
async function uploadToCatbox(filePath: string): Promise<string> {
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', fs.createReadStream(filePath));

  const resp = await axios.post('https://catbox.moe/user/api.php', form, {
    headers: form.getHeaders(),
    timeout: 30000,
  });

  const url = resp.data?.trim();
  if (!url || !url.startsWith('https://files.catbox.moe/')) {
    throw new Error(`Unexpected catbox response: ${resp.data}`);
  }
  return url;
}

/**
 * Upload all thread-asset images, caching results
 */
async function uploadAllImages(): Promise<Record<string, string>> {
  let cache: Record<string, string> = {};
  if (fs.existsSync(IMAGE_CACHE_FILE)) {
    cache = JSON.parse(fs.readFileSync(IMAGE_CACHE_FILE, 'utf-8'));
  }

  const pngFiles = fs.readdirSync(THREAD_ASSETS).filter(f => f.endsWith('.png'));
  console.log(`📷 Found ${pngFiles.length} images, ${Object.keys(cache).length} already uploaded`);

  let uploaded = 0;
  for (const file of pngFiles) {
    if (cache[file]) continue;

    try {
      const filePath = path.join(THREAD_ASSETS, file);
      console.log(`  📤 Uploading ${file}...`);
      const url = await uploadToCatbox(filePath);
      cache[file] = url;
      console.log(`  ✅ ${url}`);
      uploaded++;

      // Save every 5 uploads
      if (uploaded % 5 === 0) {
        fs.writeFileSync(IMAGE_CACHE_FILE, JSON.stringify(cache, null, 2));
      }
      await sleep(1500);
    } catch (err: any) {
      console.error(`  ❌ ${file}: ${err.message}`);
    }
  }

  fs.writeFileSync(IMAGE_CACHE_FILE, JSON.stringify(cache, null, 2));
  console.log(`📷 Uploaded ${uploaded} new images (${Object.keys(cache).length} total cached)`);
  return cache;
}

function generateTitle(post: SocialPost): string {
  const firstLine = (post.text || '').split('\n')[0].trim();
  if (firstLine.length <= 80 && firstLine.length > 10) return firstLine;
  return post.id.replace(/-\d+$/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Build essay-length blog markdown with image
 */
function buildBlogMarkdown(post: SocialPost, imageUrl: string | null): string {
  const lines: string[] = [];

  if (imageUrl) {
    lines.push(`![${generateTitle(post)}](${imageUrl})`);
    lines.push('');
  }

  const paragraphs = post.text.split('\n\n').filter(p => p.trim());
  let essayLinkUrl: string | null = null;

  if (paragraphs.length > 0) {
    const hook = paragraphs[0].trim();
    if (!hook.startsWith('veda.ng') && !hook.startsWith('Try it:')) {
      lines.push(`**${hook}**`);
      lines.push('');
    }
  }

  for (let i = 1; i < paragraphs.length; i++) {
    const para = paragraphs[i].trim();
    if (para.startsWith('veda.ng/') || para.startsWith('https://veda.ng/')) {
      essayLinkUrl = para.startsWith('https://') ? para : `https://${para}`;
      continue;
    }
    if (para.startsWith('Try it:')) {
      const urlPart = para.replace('Try it: ', '');
      essayLinkUrl = urlPart.startsWith('https://') ? urlPart : `https://${urlPart}`;
      lines.push(`🔗 **[Try it yourself →](${essayLinkUrl})**`);
      lines.push('');
      continue;
    }
    if (para.match(/\d+%|\$\d+|\d+B|\d+ billion|\d+ million/)) {
      lines.push(`> ${para}`);
    } else {
      lines.push(para);
    }
    lines.push('');
  }

  if (essayLinkUrl) {
    lines.push('---');
    lines.push('');
    lines.push('## Read the full essay');
    lines.push('');
    lines.push(`This article is adapted from a longer essay. **[Read the full essay on veda.ng →](${essayLinkUrl})**`);
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('## About the author');
  lines.push('');
  lines.push('Vedang Vatsa writes about AI, technology, economics, and the hidden psychology of modern systems.');
  lines.push('');
  lines.push(`🌐 **Website:** [veda.ng](${WEBSITE_URL})  `);
  lines.push(`🐦 **X (Twitter):** [@vedangvatsa](${X_URL})  `);
  lines.push(`💼 **LinkedIn:** [Vedang Vatsa](${LINKEDIN_URL})`);

  return lines.join('\n');
}

function runCLI(args: string): string {
  try {
    const result = execSync(`PARAGRAPH_API_KEY=${PARAGRAPH_TOKEN} NODE_NO_WARNINGS=1 paragraph ${args} 2>&1`, {
      cwd: REPO_ROOT,
      timeout: 30000,
      encoding: 'utf-8',
      env: { ...process.env, PARAGRAPH_API_KEY: PARAGRAPH_TOKEN, NODE_NO_WARNINGS: '1' },
    });
    return result.trim();
  } catch (err: any) {
    throw new Error((err.stdout || '') + (err.stderr || '') || err.message);
  }
}

/**
 * Set cover image via direct API call
 */
async function setCoverImage(postId: string, imageUrl: string): Promise<boolean> {
  try {
    const resp = await axios.put(`${PARAGRAPH_API}/posts/${postId}`, { imageUrl }, {
      headers: {
        'Authorization': `Bearer ${PARAGRAPH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });
    return resp.data?.success === true;
  } catch (err: any) {
    console.log(`  ⚠️ Cover image API error: ${err.message}`);
    return false;
  }
}

/**
 * Get the image filename for a post ID
 */
function getImageFile(post: SocialPost): string | null {
  if (!post.image) return null;
  const imgPath = path.isAbsolute(post.image) ? post.image : path.resolve(REPO_ROOT, post.image);
  return path.basename(imgPath);
}

async function main() {
  const TEMP_DIR = '/tmp/paragraph-posts';
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

  // Step 1: Upload all images to catbox
  console.log('=== PHASE 1: Upload Images to Catbox ===\n');
  const imageCache = await uploadAllImages();

  // Step 2: Collect all posts
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

  // Step 3: Load tracking
  let paragraphData: Record<string, any> = {};
  if (fs.existsSync(PARAGRAPH_URLS_FILE)) {
    paragraphData = JSON.parse(fs.readFileSync(PARAGRAPH_URLS_FILE, 'utf-8'));
  }

  console.log(`\n=== PHASE 2: Update/Create Paragraph Posts ===\n`);
  console.log(`📊 ${allPosts.size} unique posts, ${Object.keys(paragraphData).length} tracked`);

  let done = 0, failed = 0;

  for (const post of allPosts.values()) {
    try {
      const title = generateTitle(post);
      const imageFile = getImageFile(post);
      const imageUrl = imageFile ? imageCache[imageFile] || null : null;
      const tags = post.tags?.join(',') || 'ai,technology,future';

      const existing = paragraphData[post.id];
      const hasPostId = existing?.postId;

      console.log(`\n[${done + failed + 1}/${allPosts.size}] ${hasPostId ? '🔄' : '📝'} "${title.slice(0, 60)}..." ${imageUrl ? '📷' : '⚠️'}`);

      // Build markdown
      const markdown = buildBlogMarkdown(post, imageUrl);
      const tempFile = path.join(TEMP_DIR, `${post.id}.md`);
      fs.writeFileSync(tempFile, markdown);

      if (hasPostId) {
        // Update existing post content
        const updateArgs = `update --id ${existing.postId} --file "${tempFile}" --tags "${tags}"`;
        runCLI(updateArgs);
        console.log(`  ✅ Content updated`);

        // Set cover image via API
        if (imageUrl) {
          const ok = await setCoverImage(existing.postId, imageUrl);
          console.log(`  ${ok ? '✅' : '⚠️'} Cover image ${ok ? 'set' : 'failed'}`);
        }
      } else {
        // Create + publish new post
        const createArgs = `post create --title "${title.replace(/"/g, '\\"').replace(/'/g, "'")}" --file "${tempFile}" --tags "${tags}"`;
        const createResult = runCLI(createArgs);
        const idMatch = createResult.match(/ID:\s*(\S+)/);
        if (!idMatch) throw new Error(`No ID in: ${createResult}`);
        const postId = idMatch[1];

        const publishResult = runCLI(`post publish --id ${postId}`);
        console.log(`  ✅ Published (${postId})`);

        // Set cover image
        if (imageUrl) {
          const ok = await setCoverImage(postId, imageUrl);
          console.log(`  ${ok ? '✅' : '⚠️'} Cover image ${ok ? 'set' : 'failed'}`);
        }

        paragraphData[post.id] = { postId, title, publishedAt: new Date().toISOString() };
      }

      done++;
      await sleep(DELAY_MS);
    } catch (err: any) {
      console.error(`  ❌ ${err.message?.slice(0, 200)}`);
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
  console.log(`📊 Results: ${done} done, ${failed} failed`);
}

main().catch(console.error);

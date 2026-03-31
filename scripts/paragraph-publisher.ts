#!/usr/bin/env node
/**
 * Paragraph.com Blog Publisher
 * 
 * Publishes and updates all social media posts as proper blog-length articles
 * on Paragraph.com with images and backlinks to LinkedIn, X, and website.
 * 
 * For each social media post, this script:
 * 1. Expands the short post text into a proper blog article format
 * 2. Embeds the corresponding infographic image
 * 3. Adds backlinks to LinkedIn, X, and the website
 * 
 * Usage: PARAGRAPH_API_KEY=para_xxx npx tsx scripts/paragraph-publisher.ts [--dry-run] [--update-existing]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const POSTS_FILES = {
  x: path.resolve(__dirname, 'x-posts.json'),
  linkedin: path.resolve(__dirname, 'linkedin-posts.json'),
  facebook: path.resolve(__dirname, 'facebook-posts.json'),
  tumblr: path.resolve(__dirname, 'tumblr-posts.json'),
  bluesky: path.resolve(__dirname, 'bluesky-posts.json'),
};

const PARAGRAPH_URLS_FILE = path.resolve(REPO_ROOT, 'paragraph-urls.json');
const TEMP_DIR = path.resolve('/tmp', 'paragraph-posts');
const IMAGE_BASE_URL = 'https://veda.ng';

const LINKEDIN_URL = 'https://linkedin.com/in/vedangvatsa';
const X_URL = 'https://x.com/vedangvatsa';
const WEBSITE_URL = 'https://veda.ng';

const DELAY_MS = 3000;

interface SocialPost {
  id: string;
  text: string;
  image?: string;
  tags?: string[];
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

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
 * Get the public URL for an image
 */
function getImageUrl(imagePath: string): string | null {
  if (!imagePath) return null;
  // Convert local path to public URL
  // e.g. "scripts/thread-assets/ai_economy.png" -> "https://veda.ng/scripts/thread-assets/ai_economy.png"
  const relPath = imagePath.startsWith('/') ? imagePath : imagePath;
  return `${IMAGE_BASE_URL}/${relPath}`;
}

/**
 * Convert a social media post into a rich, essay-length markdown blog article
 */
function buildBlogMarkdown(post: SocialPost): string {
  const lines: string[] = [];
  const imageUrl = post.image ? getImageUrl(post.image) : null;

  // Hero image at top
  if (imageUrl) {
    lines.push(`![${generateTitle(post)}](${imageUrl})`);
    lines.push('');
  }

  // Process the social post text into expanded essay paragraphs
  const paragraphs = post.text.split('\n\n').filter(p => p.trim());
  
  // Build the essay from the social post's core arguments
  // First paragraph is the hook / bold thesis
  if (paragraphs.length > 0) {
    const hook = paragraphs[0].trim();
    if (!hook.startsWith('veda.ng') && !hook.startsWith('Try it:')) {
      lines.push(`**${hook}**`);
      lines.push('');
    }
  }

  // Body paragraphs — each one becomes an expanded section
  let essayLinkUrl: string | null = null;
  
  for (let i = 1; i < paragraphs.length; i++) {
    const para = paragraphs[i].trim();

    // Capture the essay link for later
    if (para.startsWith('veda.ng/') || para.startsWith('https://veda.ng/')) {
      essayLinkUrl = para.startsWith('https://') ? para : `https://${para}`;
      continue;
    }

    if (para.startsWith('Try it: veda.ng/') || para.startsWith('Try it: https://veda.ng/')) {
      const urlPart = para.replace('Try it: ', '');
      essayLinkUrl = urlPart.startsWith('https://') ? urlPart : `https://${urlPart}`;
      lines.push(`🔗 **[Try it yourself →](${essayLinkUrl})**`);
      lines.push('');
      continue;
    }

    // Check if it looks like a data point or statistic — make it stand out
    if (para.match(/\d+%|\$\d+|\d+B|\d+ billion|\d+ million/)) {
      lines.push(`> ${para}`);
      lines.push('');
    } else {
      lines.push(para);
      lines.push('');
    }
  }

  // Add a "Read More" section if we have an essay link
  if (essayLinkUrl) {
    lines.push('---');
    lines.push('');
    lines.push('## Read the full essay');
    lines.push('');
    lines.push(`This article is adapted from a longer essay that dives deeper into the research, data, and implications. **[Read the full essay on veda.ng →](${essayLinkUrl})**`);
    lines.push('');
  }

  // Add author section with backlinks
  lines.push('---');
  lines.push('');
  lines.push('## About the author');
  lines.push('');
  lines.push('Vedang Vatsa writes about AI, technology, economics, and the hidden psychology of modern systems. His work challenges conventional thinking with data-driven analysis and first-principles reasoning.');
  lines.push('');
  lines.push(`🌐 **Website:** [veda.ng](${WEBSITE_URL})`);
  lines.push('');
  lines.push(`🐦 **X (Twitter):** [@vedangvatsa](${X_URL})`);
  lines.push('');
  lines.push(`💼 **LinkedIn:** [Vedang Vatsa](${LINKEDIN_URL})`);
  lines.push('');

  return lines.join('\n');
}

function runCLI(args: string): string {
  try {
    const result = execSync(`PARAGRAPH_API_KEY=***REDACTED_PARAGRAPH_KEY*** NODE_NO_WARNINGS=1 paragraph ${args} 2>&1`, {
      cwd: REPO_ROOT,
      timeout: 30000,
      encoding: 'utf-8',
      env: {
        ...process.env,
        PARAGRAPH_API_KEY: '***REDACTED_PARAGRAPH_KEY***',
        NODE_NO_WARNINGS: '1',
      },
    });
    return result.trim();
  } catch (err: any) {
    const output = (err.stdout || '') + (err.stderr || '');
    throw new Error(output || err.message);
  }
}

async function main() {
  const isDryRun = process.argv.includes('--dry-run');
  const updateExisting = process.argv.includes('--update-existing');

  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

  // Load tracking data
  let paragraphData: Record<string, any> = {};
  if (fs.existsSync(PARAGRAPH_URLS_FILE)) {
    paragraphData = JSON.parse(fs.readFileSync(PARAGRAPH_URLS_FILE, 'utf-8'));
  }

  // Collect all unique posts
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

  // Determine what to process
  const existingIds = new Set(Object.keys(paragraphData));
  let postsToProcess: { post: SocialPost; action: 'create' | 'update' }[] = [];

  if (updateExisting) {
    // Update ALL posts (existing get updated, new get created)
    for (const post of allPosts.values()) {
      if (existingIds.has(post.id) && paragraphData[post.id].postId) {
        postsToProcess.push({ post, action: 'update' });
      } else {
        postsToProcess.push({ post, action: 'create' });
      }
    }
  } else {
    // Only create new posts
    for (const post of allPosts.values()) {
      if (!existingIds.has(post.id)) {
        postsToProcess.push({ post, action: 'create' });
      }
    }
  }

  const toCreate = postsToProcess.filter(p => p.action === 'create').length;
  const toUpdate = postsToProcess.filter(p => p.action === 'update').length;
  console.log(`📋 Already on Paragraph: ${existingIds.size}`);
  console.log(`📤 To create: ${toCreate}, To update: ${toUpdate}`);

  if (isDryRun) {
    console.log('\n🔍 DRY RUN:');
    for (const { post, action } of postsToProcess) {
      const md = buildBlogMarkdown(post);
      console.log(`  ${action === 'update' ? '🔄' : '📝'} ${post.id}: "${generateTitle(post)}" [${md.length} chars] ${post.image ? '📷' : '⚠️'}`);
    }
    return;
  }

  if (postsToProcess.length === 0) {
    console.log('✅ Nothing to process!');
    return;
  }

  let published = 0;
  let failed = 0;

  for (const { post, action } of postsToProcess) {
    try {
      const title = generateTitle(post);
      const tags = post.tags?.join(',') || 'ai,technology,future';
      console.log(`\n${action === 'update' ? '🔄' : '📝'} [${published + failed + 1}/${postsToProcess.length}] "${title}"`);

      // Write blog-length markdown
      const markdown = buildBlogMarkdown(post);
      const tempFile = path.join(TEMP_DIR, `${post.id}.md`);
      fs.writeFileSync(tempFile, markdown);
      console.log(`  📄 Essay: ${markdown.length} chars`);

      if (action === 'update') {
        // Update existing post
        const postId = paragraphData[post.id].postId;
        const updateArgs = `update --id ${postId} --file "${tempFile}" --tags "${tags}"`;
        console.log(`  🔄 Updating (ID: ${postId})...`);
        const result = runCLI(updateArgs);
        console.log(`  ✅ Updated: ${result.split('\n')[0]}`);
      } else {
        // Create + publish new post
        const createArgs = `post create --title "${title.replace(/"/g, '\\"').replace(/'/g, "'")}" --file "${tempFile}" --tags "${tags}"`;
        console.log(`  📄 Creating draft...`);
        const createResult = runCLI(createArgs);
        console.log(`  📄 ${createResult.split('\n')[0]}`);

        const idMatch = createResult.match(/ID:\s*(\S+)/);
        if (!idMatch) {
          throw new Error(`Could not parse post ID from: ${createResult}`);
        }
        const postId = idMatch[1];

        console.log(`  🚀 Publishing (ID: ${postId})...`);
        const publishResult = runCLI(`post publish --id ${postId}`);
        console.log(`  ✅ Published: ${publishResult.split('\n')[0]}`);

        paragraphData[post.id] = {
          postId,
          title,
          publishedAt: new Date().toISOString(),
        };
      }

      published++;
      await sleep(DELAY_MS);
    } catch (err: any) {
      console.error(`  ❌ Failed: ${err.message?.slice(0, 200)}`);
      failed++;
      await sleep(DELAY_MS);
    }

    if ((published + failed) % 10 === 0) {
      fs.writeFileSync(PARAGRAPH_URLS_FILE, JSON.stringify(paragraphData, null, 2));
      console.log(`\n💾 Progress saved (${published} done, ${failed} failed)`);
    }
  }

  fs.writeFileSync(PARAGRAPH_URLS_FILE, JSON.stringify(paragraphData, null, 2));
  console.log(`\n💾 Saved paragraph-urls.json`);
  console.log(`📊 Results: ${published} done, ${failed} failed`);
}

main().catch(console.error);

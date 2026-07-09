#!/usr/bin/env node
/**
 * prepare-platform-posts.ts
 *
 * Reads x-posts.json (master source) and generates platform-specific rewrites
 * for Bluesky, Threads, Facebook, and LinkedIn using Claude.
 *
 * Rules enforced on every rewrite (from docs/social-media-persona.md and
 * docs/ai-slop-avoidance.md):
 *   - Direct and honest voice — no corporate fluff
 *   - Data-driven — specific numbers and examples, not vague generalities
 *   - Short punchy sentences, paragraphs ≤ 3 lines
 *   - Ends with a sharp observation, not a motivational platitude
 *   - NEVER: "explore", "landscape", "tapestry", "empower", "leverage",
 *     "unlock", "streamline", "holistic", "paradigm shift", "synergy",
 *     "in the realm of", "it's notable that", "in today's world",
 *     "major shift", "at the end of the day", "only time will tell"
 *   - NEVER: "I'm excited/thrilled/humbled", hype language, hashtag spam
 *   - MAX 2 hashtags per post
 *   - NEVER post same text verbatim across platforms — adapt tone
 *   - NEVER start with "In today's..." or "In an era..."
 *   - NEVER end with "only time will tell" or "remains to be seen"
 *   - ≤ 200 words for short-form platforms (X, Bluesky, Threads)
 *
 * Character / grapheme limits:
 *   X        : 280 chars  (already in x-posts.json — kept unchanged)
 *   Bluesky  : 300 graphemes
 *   Threads  : 500 chars
 *   Facebook : 10 000 chars (sanity cap; no native limit)
 *   LinkedIn : 3 000 chars
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

// ─── Config ────────────────────────────────────────────────────────────────

const DRY = process.argv.includes('--dry');
const FORCE = process.argv.includes('--force'); // rewrite even already-posted

const X_POSTS_FILE          = path.resolve(__dirname, 'x-posts.json');
const BLUESKY_POSTS_FILE    = path.resolve(__dirname, 'bluesky-posts.json');
const THREADS_POSTS_FILE    = path.resolve(__dirname, 'threads-posts.json');
const FACEBOOK_POSTS_FILE   = path.resolve(__dirname, 'facebook-posts.json');
const LINKEDIN_POSTS_FILE   = path.resolve(__dirname, 'linkedin-posts.json');

const LIMITS = {
  bluesky:  { chars: 300,   label: '300 graphemes',  short: true  },
  threads:  { chars: 500,   label: '500 characters', short: true  },
  facebook: { chars: 10000, label: '10 000 characters (sanity cap)', short: false },
  linkedin: { chars: 3000,  label: '3 000 characters', short: false },
} as const;

type Platform = keyof typeof LIMITS;

// ─── Anthropic client ──────────────────────────────────────────────────────

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// ─── Types ─────────────────────────────────────────────────────────────────

interface TweetItem {
  text: string;
  image?: string;
}

interface XPost {
  id: string;
  type?: 'single' | 'thread' | 'quote' | 'reply';
  text?: string;
  tweets?: TweetItem[];
  image?: string;
  imageUrl?: string;
  scheduleDate: string;
  scheduleTime: string;
  posted: boolean;
  postedAt?: string;
  tweetId?: string;
  error?: string;
  [key: string]: unknown;
}

interface PlatformPost {
  id: string;
  text: string;
  image?: string;
  imageUrl?: string;
  scheduleDate: string;
  scheduleTime: string;
  posted: boolean;
  postedAt?: string;
  error?: string;
  [key: string]: unknown;
}

// ─── Grapheme counter (accurate for Bluesky) ──────────────────────────────

function countGraphemes(text: string): number {
  // Segmenter is available in Node 16+ (used by the project's Node version)
  if (typeof (Intl as any).Segmenter !== 'undefined') {
    const seg = new (Intl as any).Segmenter();
    return [...seg.segment(text)].length;
  }
  // Fallback: character count (safe approximation)
  return text.length;
}

function checkLimit(platform: Platform, text: string): boolean {
  if (platform === 'bluesky') return countGraphemes(text) <= LIMITS[platform].chars;
  return text.length <= LIMITS[platform].chars;
}

// ─── Persona system prompt ─────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are writing social media posts on behalf of Vedang Vatsa, founder of Hashtag Web3 (100k community), MTech+MBA, IIT Kanpur alumnus, Fellow of the Royal Society of Arts.

VOICE — mandatory:
- Direct and honest. Says what is meant. No corporate fluff.
- Data-driven: specific numbers, named companies, concrete examples — never vague generalities.
- Contrarian: challenges conventional wisdom, finds the counter-narrative.
- Accessible expertise: complex topics explained without condescension.
- Understated confidence: the work speaks, no self-congratulatory language.
- Short, punchy sentences. Paragraphs rarely exceed 3 lines.
- Ends with a sharp observation or implication, never a motivational platitude.

BANNED WORDS / PATTERNS (never use these):
explore, landscape, tapestry, in the realm of, it's notable that, it's important to note,
in today's world, in today's rapidly evolving, major shift, model shift, at the end of the day,
food for thought, only time will tell, the question remains, a double-edged sword,
leverage (as verb), empower, streamline, holistic, unlock (as metaphor), paradigm shift,
synergy, disruptive, democratize, reshape, redefine, foster, facilitate.

BANNED SENTENCE PATTERNS:
- "I'm excited/thrilled/humbled to..."
- "This is a major shift!"
- "Follow me for more tips!"
- Hedged non-statements ("while there are challenges, the potential benefits...")
- False balance ("on one hand... on the other hand... truth lies somewhere between")
- Grandiose openers ("In an era of unprecedented...", "In today's...")
- Vague conclusions ("it will be interesting to see how this unfolds...")

HASHTAG RULE: max 2 hashtags per post. Include only if naturally relevant.`;

// ─── Rewrite with Claude ────────────────────────────────────────────────────

async function rewrite(
  sourceText: string,
  platform: Platform,
  attempt = 1,
): Promise<string> {
  const limit = LIMITS[platform];
  const shortForm = limit.short;

  const platformGuidance: Record<Platform, string> = {
    bluesky: `X/Bluesky: Short, sharp takes. One idea per post. Links at the end. No thread. Under 200 words. The rewrite must be ≤ ${limit.chars} graphemes total.`,
    threads: `Threads: Same energy as X — short and sharp. Under 200 words. Max ${limit.chars} characters. One central idea, clear ending.`,
    facebook: `Facebook: Same tone as LinkedIn — slightly more structured, line breaks for readability, can lean into professional context when relevant. Still avoids all corporate-speak. Max ${limit.chars} characters. Images work well here.`,
    linkedin: `LinkedIn: Slightly more structured than X. Use line breaks for readability. Can reference professional context (KPMG, IIT, RSA Fellowship) when genuinely relevant — not as name-dropping. Still avoids ALL corporate-speak. Max ${limit.chars} characters.`,
  };

  const wordsGuidance = shortForm
    ? 'Keep it under 200 words. One central idea. Nothing wasted.'
    : 'Can be longer but must stay under the character limit. Every sentence must earn its place.';

  const prompt = `Rewrite the following social media post for ${platform.toUpperCase()}.

Platform rules: ${platformGuidance[platform]}

${wordsGuidance}

The rewrite must:
1. Convey the same core idea and preserve key data points / examples from the original.
2. Fit completely within the ${limit.label} limit — count carefully.
3. Sound like Vedang Vatsa: direct, specific, contrarian where warranted.
4. NOT be a truncation. Restructure and distill the idea so it is complete and coherent at the shorter length.
5. NOT start with "I'm excited", "In today's", "In an era", or any banned pattern.
6. NOT end with a platitude, "only time will tell", or an engagement-bait question.
7. Include any URL from the original at the end (URLs count toward character limit).
8. Include at most 2 hashtags, only if they naturally fit.
${attempt > 1 ? `\nIMPORTANT: Previous attempt was too long. This is attempt ${attempt}. Be significantly more concise. Cut aggressively while keeping the core idea intact.` : ''}

ORIGINAL POST:
${sourceText}

Return ONLY the rewritten post text. No preamble, no explanation, no quotes around it.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  const block = response.content[0];
  if (block.type !== 'text') throw new Error('Unexpected response type from Claude');
  return block.text.trim();
}

// ─── Source text extraction ────────────────────────────────────────────────

function extractSourceText(post: XPost): string | null {
  if (post.text) return post.text;
  // Thread: join all tweet texts
  if (post.tweets && post.tweets.length > 0) {
    return post.tweets.map(t => t.text).join('\n\n');
  }
  return null;
}

// ─── Load / save helpers ───────────────────────────────────────────────────

function loadPosts<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T[];
}

function savePosts<T>(filePath: string, posts: T[]): void {
  if (DRY) {
    console.log(`  [DRY] Would write ${posts.length} posts to ${path.basename(filePath)}`);
    return;
  }
  fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
}

// ─── Slop detector (automated check from docs/ai-slop-avoidance.md) ────────

const SLOP_PATTERNS = [
  /\bexplore\b/i,
  /\blandscape\b/i,
  /\btapestry\b/i,
  /in the realm of/i,
  /it's notable that/i,
  /in today's world/i,
  /in today's rapidly evolving/i,
  /\breshape\b/i,
  /\bredefine\b/i,
  /\bfoster\b/i,
  /\bfacilitate\b/i,
  /\bempower\b/i,
  /\bstreamline\b/i,
  /paradigm shift/i,
  /\bsynergy\b/i,
  /\bdemocratize\b/i,
  /only time will tell/i,
  /the question remains/i,
  /I'm (excited|thrilled|humbled)/i,
  /major shift/i,
  /at the end of the day/i,
  /food for thought/i,
  /--/,  // em-dash check (repo bans em-dashes)
];

function detectSlop(text: string): string[] {
  return SLOP_PATTERNS
    .filter(p => p.test(text))
    .map(p => p.source);
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not set');
    process.exit(1);
  }

  if (!fs.existsSync(X_POSTS_FILE)) {
    console.error('❌ x-posts.json not found');
    process.exit(1);
  }

  const xPosts = loadPosts<XPost>(X_POSTS_FILE);

  // Load existing platform posts (preserve already-posted records)
  const existing: Record<Platform, Map<string, PlatformPost>> = {
    bluesky:  new Map(loadPosts<PlatformPost>(BLUESKY_POSTS_FILE).map(p => [p.id, p])),
    threads:  new Map(loadPosts<PlatformPost>(THREADS_POSTS_FILE).map(p => [p.id, p])),
    facebook: new Map(loadPosts<PlatformPost>(FACEBOOK_POSTS_FILE).map(p => [p.id, p])),
    linkedin: new Map(loadPosts<PlatformPost>(LINKEDIN_POSTS_FILE).map(p => [p.id, p])),
  };

  const results: Record<Platform, PlatformPost[]> = {
    bluesky:  [],
    threads:  [],
    facebook: [],
    linkedin: [],
  };

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const xPost of xPosts) {
    // Skip threads (multi-tweet) — they need custom handling per-platform
    if (xPost.type === 'thread') {
      console.log(`⏭️  Skipping thread: ${xPost.id}`);
      skipped++;
      continue;
    }

    const sourceText = extractSourceText(xPost);
    if (!sourceText) {
      console.log(`⏭️  Skipping (no text): ${xPost.id}`);
      skipped++;
      continue;
    }

    console.log(`\n📝 Processing: ${xPost.id} (${xPost.scheduleDate})`);

    for (const platform of Object.keys(LIMITS) as Platform[]) {
      const existingPost = existing[platform].get(xPost.id);

      // Skip already-posted unless --force
      if (existingPost?.posted && !FORCE) {
        results[platform].push(existingPost);
        console.log(`  ✅ ${platform}: already posted, keeping`);
        continue;
      }

      // Check if existing unposted post text already fits — if so, keep it
      if (existingPost && !existingPost.posted && !FORCE) {
        if (checkLimit(platform, existingPost.text)) {
          const slopFound = detectSlop(existingPost.text);
          if (slopFound.length === 0) {
            results[platform].push(existingPost);
            console.log(`  ✅ ${platform}: existing text OK, keeping`);
            continue;
          }
          console.log(`  ⚠️  ${platform}: existing text has slop patterns [${slopFound.join(', ')}] — rewriting`);
        } else {
          console.log(`  ⚠️  ${platform}: existing text too long — rewriting`);
        }
      }

      // Rewrite with retries
      let rewritten = '';
      let success = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          rewritten = await rewrite(sourceText, platform, attempt);

          if (!checkLimit(platform, rewritten)) {
            const len = platform === 'bluesky' ? countGraphemes(rewritten) : rewritten.length;
            console.log(`  ⚠️  ${platform} attempt ${attempt}: too long (${len}/${LIMITS[platform].chars})`);
            continue;
          }

          const slopFound = detectSlop(rewritten);
          if (slopFound.length > 0) {
            console.log(`  ⚠️  ${platform} attempt ${attempt}: slop detected [${slopFound.join(', ')}]`);
            continue;
          }

          success = true;
          break;
        } catch (err) {
          console.error(`  ❌ ${platform} attempt ${attempt} error:`, err);
        }
      }

      if (!success) {
        console.error(`  ❌ ${platform}: failed after 3 attempts — keeping original if available`);
        errors++;
        if (existingPost) {
          results[platform].push(existingPost);
        }
        continue;
      }

      const len = platform === 'bluesky' ? countGraphemes(rewritten) : rewritten.length;
      console.log(`  ✍️  ${platform}: ${len}/${LIMITS[platform].chars} chars`);
      if (DRY) console.log(`     "${rewritten.substring(0, 120)}${rewritten.length > 120 ? '...' : ''}"`);

      const platformPost: PlatformPost = {
        id: xPost.id,
        text: rewritten,
        scheduleDate: xPost.scheduleDate,
        scheduleTime: xPost.scheduleTime,
        posted: existingPost?.posted ?? false,
        ...(existingPost?.posted && { postedAt: existingPost.postedAt }),
        ...(xPost.image && { image: xPost.image }),
        ...(xPost.imageUrl && { imageUrl: xPost.imageUrl }),
      };

      // Preserve any platform-specific fields from existing entry
      if (existingPost) {
        const preservedKeys = ['postId', 'postUri', 'fbPostId', 'threadsMediaId', 'error'];
        for (const key of preservedKeys) {
          if (existingPost[key] !== undefined) {
            platformPost[key] = existingPost[key];
          }
        }
      }

      results[platform].push(platformPost);
      processed++;
    }
  }

  // Write outputs
  console.log('\n💾 Writing platform post files...');
  savePosts(BLUESKY_POSTS_FILE,  results.bluesky);
  savePosts(THREADS_POSTS_FILE,  results.threads);
  savePosts(FACEBOOK_POSTS_FILE, results.facebook);
  savePosts(LINKEDIN_POSTS_FILE, results.linkedin);

  console.log(`\n✅ Done.`);
  console.log(`   Processed : ${processed} rewrites`);
  console.log(`   Skipped   : ${skipped}`);
  console.log(`   Errors    : ${errors}`);

  if (DRY) console.log('\n[DRY RUN — no files were written]');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});

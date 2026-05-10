#!/usr/bin/env node
/**
 * X Quote-Tweet Discovery Engine
 * 
 * Finds high-comment tech posts via X API, filters spam,
 * generates thoughtful quote text, schedules 10/day.
 * 
 * Uses API search only (no browser). Filters by reply count
 * because comments indicate real engagement.
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { TwitterApi } from 'twitter-api-v2';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const OUTPUT_FILE = path.resolve(__dirname, 'x-quote-posts.json');

// ============================================================
// SEARCH QUERIES (rotated daily, filtered by replies)
// ============================================================
const SEARCH_QUERIES = [
  '(AI OR LLM OR GPT) min_replies:50 -is:retweet lang:en',
  '(startup OR founder OR "venture capital") min_replies:50 -is:retweet lang:en',
  '(web3 OR crypto OR blockchain) min_replies:30 -is:retweet lang:en',
  '(programming OR developer OR "software engineer") min_replies:50 -is:retweet lang:en',
  '(hiring OR "job market" OR layoffs OR "remote work") min_replies:30 -is:retweet lang:en',
  '("open source" OR github OR rust OR typescript) min_replies:30 -is:retweet lang:en',
];

// ============================================================
// SPAM FILTERS
// ============================================================
const REJECT_PATTERNS = [
  /\bdm\s*me\b/i, /\blink\s*in\s*bio\b/i, /\bgiveaway\b/i,
  /\bfollow\s*(me|back|for)\b/i, /\bretweet\s*(to|and|&)\s*(win|enter)\b/i,
  /\b(buy|sell)\s*(now|today)\b/i, /\bairdrop\b/i, /\bmint\s*(now|live)\b/i,
  /\b100[x×]\b/i, /\bsign\s*up\b/i, /\bcoupon\b/i, /\bdiscount\b/i,
  /🧵\s*(thread|a thread)/i, /\bwhitelist\b/i, /\baffiliate\b/i,
  /\b(pump|moon|ape)\s*(it|in)\b/i, /\benroll\s*now\b/i,
];

const OFFENSIVE_PATTERNS = [
  /\b(fuck|shit|bitch)\b/i,
  /\b(libtard|snowflake|woke\s*mob)\b/i,
  /\b(MAGA|trump|biden)\b/i,
];

// ============================================================
// TYPES
// ============================================================
interface TweetCandidate {
  id: string;
  text: string;
  authorHandle: string;
  authorName: string;
  likes: number;
  retweets: number;
  replies: number;
}

interface QuotePost {
  id: string;
  type: 'quote';
  text: string;
  quote_tweet_id: string;
  original_author: string;
  original_text_preview: string;
  scheduleDate: string;
  scheduleTime: string;
  posted: boolean;
  postedAt?: string;
  tweetId?: string;
  error?: string;
}

// ============================================================
// DISCOVERY VIA X API
// ============================================================
async function discoverPosts(): Promise<TweetCandidate[]> {
  const client = new TwitterApi({
    appKey: process.env.X_API_KEY!,
    appSecret: process.env.X_API_KEY_SECRET!,
    accessToken: process.env.X_ACCESS_TOKEN!,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
  });

  const dayIndex = new Date().getDay();
  const candidates: TweetCandidate[] = [];

  // Run 2 queries per day for variety
  const queries = [
    SEARCH_QUERIES[dayIndex % SEARCH_QUERIES.length],
    SEARCH_QUERIES[(dayIndex + 3) % SEARCH_QUERIES.length],
  ];

  for (const query of queries) {
    try {
      console.log(`🔍 Searching: ${query.substring(0, 60)}...`);

      const result = await client.v2.search(query, {
        max_results: 30,
        'tweet.fields': ['public_metrics', 'created_at', 'author_id'],
        'user.fields': ['username', 'name'],
        expansions: ['author_id'],
        sort_order: 'relevancy',
      });

      const users = new Map<string, { username: string; name: string }>();
      if (result.includes?.users) {
        for (const u of result.includes.users) {
          users.set(u.id, { username: u.username, name: u.name });
        }
      }

      for (const tweet of result.data?.data || []) {
        const m = tweet.public_metrics!;
        const user = users.get(tweet.author_id!) || { username: '', name: '' };
        candidates.push({
          id: tweet.id,
          text: tweet.text,
          authorHandle: user.username,
          authorName: user.name,
          likes: m.like_count,
          retweets: m.retweet_count,
          replies: m.reply_count,
        });
      }

      console.log(`  Found ${result.data?.data?.length || 0} tweets`);
    } catch (err) {
      console.error(`  ❌ Search failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return candidates;
}

// ============================================================
// FILTERING
// ============================================================
function filterCandidates(candidates: TweetCandidate[]): TweetCandidate[] {
  return candidates
    .filter(c => !REJECT_PATTERNS.some(p => p.test(c.text)))
    .filter(c => !OFFENSIVE_PATTERNS.some(p => p.test(c.text)))
    .filter(c => c.text.length > 40)
    .filter(c => !c.text.startsWith('RT @'))
    // Reject suspicious engagement (high likes, near-zero replies = botted)
    .filter(c => !(c.likes > 1000 && c.replies < 5))
    // Sort by replies (real engagement), then likes as tiebreaker
    .sort((a, b) => (b.replies * 3 + b.likes) - (a.replies * 3 + a.likes))
    .slice(0, 15);
}

// ============================================================
// QUOTE TEXT GENERATION
//
// Voice: Vedang Vatsa
// - Plain, short sentences. No buzzwords.
// - Observational. Thinks out loud.
// - Uses "can" and "may" instead of "will" and "should"
// - Never uses emdashes, colons, or AI-sounding words
// - No CTAs, no selling, no links
// - 2-3 lines that add a genuine thought
// ============================================================

// Topic-keyed thought banks. Each is a genuine observation,
// not a template with slots. Written in Vedang's actual voice.
const THOUGHTS: Record<string, string[]> = {
  ai: [
    'People keep asking if AI can replace them. Better question might be whether the job was mostly pattern matching all along.',
    'We are maybe two years from not using AI at work feeling like not using email in 2005.',
    'The companies getting real value from AI are not the loud ones. They are the ones quietly shipping 3x faster.',
    'Every new AI tool promises to save hours. The ones that actually do are the boring ones nobody posts about.',
    'We may look back and realize the biggest impact wasn\'t automation. It was raising the floor of what everyone could produce.',
    'Most people at companies using AI wouldn\'t fight to keep it. That tells you where adoption actually is.',
    'The shift from "can AI do this" to "how do we live with AI doing this" happened in about 18 months. That\'s fast.',
    'Average work is getting worse and great work is getting better. The middle is disappearing.',
    'The overnight AI success stories are mostly noise. Real value comes from people who use it badly at first and figure it out over months.',
    'Nobody checks anymore whether AI can\'t do something. They just assume it can. That assumption is doing a lot of work right now.',
  ],
  startup: [
    'Most startup advice is survivor bias dressed up as strategy. The people who failed had the same playbook.',
    'Hardest part of building a company isn\'t the building. It\'s continuing when nothing works and you have no signal either way.',
    'Startups that grow fast often break fast too. The ones that last are usually boring for the first three years.',
    'Every founder I know who raised too early regrets it. Every one who waited too long also regrets it.',
    'Ideas travel free. The gap between a great idea and a working business is almost entirely execution and timing.',
    'People romanticize the early days. Those days are mostly confusion, bad coffee, and wondering if you made a terrible mistake.',
    'If a startup needs a deck to explain what it does, that\'s usually not a great sign.',
    'Smartest person in the room is rarely the best founder. Persistence matters more.',
  ],
  web3: [
    'The teams still building through the quiet part of the cycle are probably the ones worth watching when it picks up.',
    'Web3 keeps solving problems most people don\'t know they have. That may change or it may not.',
    'Infrastructure work in web3 right now is not fun to talk about. Usually a good sign.',
    'Crypto does this "it\'s dead" and "it\'s the future" cycle every 18 months. The truth is probably quieter than both.',
    'The people building useful things in web3 are not the ones posting about it the most.',
  ],
  career: [
    'The skills that got you here may not be the ones that keep you here. Nobody wants to hear that but it\'s probably true.',
    'Remote work didn\'t kill offices. It showed how many meetings could have been emails and how many offices were just expensive habits.',
    'Best career moves I\'ve seen people make were lateral ones that looked like steps backward at the time.',
    'Nobody talks about how much of career success is just staying in the room long enough for something to happen.',
    'People who do well in uncertain job markets tend to be the ones who kept learning when they didn\'t need to.',
    'Companies reject great people for bad reasons and hire average people for worse ones. Hiring is still mostly broken.',
  ],
  engineering: [
    'You can tell when code was written by someone who expected to maintain it for years. You feel it in the structure.',
    'Most engineering debates are preferences disguised as principles. The stuff that actually matters isn\'t usually debated.',
    'Good engineers ask "what happens when this breaks" before "how do I make this work." That habit matters a lot.',
    'Gap between junior and senior isn\'t code quality. It\'s knowing which problems deserve careful work and which ones just need to get done.',
    'Open source works because enough people care about the same problem at the same time. That alignment is rarer than it looks.',
  ],
  general: [
    'Most takes on here are reactions to other takes. This one actually started from somewhere real.',
    'Best ideas tend to sound obvious after someone says them. Before that they sound weird or unnecessary.',
    'How much of success in anything is just consistently showing up when it\'s not convenient. Probably more than people think.',
    'The right answer in tech and in life is usually "it depends." People who are certain are usually wrong about something important.',
    'Slow ideas travel further. The things that age well are almost never the things that went viral.',
    'Worth sitting with this one before reacting. First take is probably not the right one.',
  ],
};

function detectTopic(text: string): string {
  const t = text.toLowerCase();
  if (t.match(/\b(ai|llm|gpt|artificial intelligence|machine learning|chatgpt|openai|claude|gemini)\b/)) return 'ai';
  if (t.match(/\b(startup|founder|fundrais|vc|venture|yc|seed round|series [abc])\b/)) return 'startup';
  if (t.match(/\b(web3|crypto|blockchain|ethereum|bitcoin|defi|nft|solana)\b/)) return 'web3';
  if (t.match(/\b(hiring|layoff|job market|remote work|career|resume|interview|recruiter)\b/)) return 'career';
  if (t.match(/\b(code|programming|developer|engineer|software|github|open source|rust|typescript|python)\b/)) return 'engineering';
  return 'general';
}

function generateQuoteText(tweet: TweetCandidate, usedIndices: Map<string, Set<number>>): string {
  const topic = detectTopic(tweet.text);
  const pool = THOUGHTS[topic] || THOUGHTS.general;

  // Track which thoughts we already used per topic to avoid repeats
  if (!usedIndices.has(topic)) usedIndices.set(topic, new Set());
  const used = usedIndices.get(topic)!;

  // Pick an unused thought
  let idx = Math.floor(Math.random() * pool.length);
  let attempts = 0;
  while (used.has(idx) && attempts < pool.length) {
    idx = (idx + 1) % pool.length;
    attempts++;
  }
  used.add(idx);

  return pool[idx];
}

// ============================================================
// SCHEDULING
// ============================================================
function generateSchedule(count: number): { date: string; time: string }[] {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const today = ist.toISOString().split('T')[0];

  const slots = ['07:00', '08:30', '10:00', '12:00', '14:00', '15:30', '17:00', '19:00', '21:00', '23:00'];
  return slots.slice(0, count).map(time => ({ date: today, time }));
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  console.log('🔎 X Quote-Tweet Discovery Engine');
  console.log(`📅 ${new Date().toISOString()}\n`);

  // Step 1: Discover
  const raw = await discoverPosts();
  if (raw.length === 0) {
    console.log('❌ No posts found. Check API access.');
    process.exit(0);
  }
  console.log(`\n📊 Raw candidates: ${raw.length}`);

  // Step 2: Filter
  const filtered = filterCandidates(raw);
  console.log(`🔬 After filtering: ${filtered.length}`);

  // Step 3: Check for duplicates
  let existing: QuotePost[] = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
  }
  const alreadyQuoted = new Set(existing.map(p => p.quote_tweet_id));

  // Step 4: Generate
  const schedule = generateSchedule(10);
  const usedIndices = new Map<string, Set<number>>();
  const newPosts: QuotePost[] = [];

  for (const tweet of filtered) {
    if (newPosts.length >= 10) break;
    if (alreadyQuoted.has(tweet.id)) continue;

    const text = generateQuoteText(tweet, usedIndices);
    const slot = schedule[newPosts.length];

    newPosts.push({
      id: `quote-${tweet.id}`,
      type: 'quote',
      text,
      quote_tweet_id: tweet.id,
      original_author: `@${tweet.authorHandle}`,
      original_text_preview: tweet.text.substring(0, 120),
      scheduleDate: slot.date,
      scheduleTime: slot.time,
      posted: false,
    });
  }

  console.log(`\n✨ Generated ${newPosts.length} quote tweets:\n`);
  for (const p of newPosts) {
    console.log(`  ${p.scheduleTime} "${p.text.substring(0, 70)}..."`);
    console.log(`         → ${p.original_author}\n`);
  }

  // Step 5: Save (keep history, append new)
  const all = [...existing, ...newPosts];
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(all, null, 2));
  console.log(`📝 Saved ${all.length} total (${newPosts.length} new)`);
}

main().catch(console.error);

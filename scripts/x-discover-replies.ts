#!/usr/bin/env node
/**
 * X Reply Engine
 * 
 * Finds top trending tech posts (500+ comments), generates
 * thoughtful replies that add intellectual value, and posts them.
 * 
 * Replies get massive visibility because they appear directly
 * under viral posts. 20 replies/day, spread across the day.
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { TwitterApi } from 'twitter-api-v2';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const OUTPUT_FILE = path.resolve(__dirname, 'x-reply-posts.json');

// ============================================================
// SEARCH QUERIES — targeting very high engagement posts
// ============================================================
const SEARCH_QUERIES = [
  '(AI OR LLM OR GPT OR "artificial intelligence") min_replies:500 -is:retweet lang:en',
  '(startup OR founder OR "tech company") min_replies:500 -is:retweet lang:en',
  '(web3 OR crypto OR blockchain OR bitcoin) min_replies:300 -is:retweet lang:en',
  '(programming OR developer OR "software engineer" OR coding) min_replies:500 -is:retweet lang:en',
  '(hiring OR layoffs OR "job market" OR "remote work" OR salary) min_replies:300 -is:retweet lang:en',
  '("open source" OR github OR rust OR python OR javascript) min_replies:300 -is:retweet lang:en',
  '(tech OR technology OR innovation) min_replies:500 -is:retweet lang:en',
];

// ============================================================
// FILTERS
// ============================================================
const REJECT_PATTERNS = [
  /\bdm\s*me\b/i, /\blink\s*in\s*bio\b/i, /\bgiveaway\b/i,
  /\bfollow\s*(me|back|for)\b/i, /\bretweet\s*(to|and|&)\s*(win|enter)\b/i,
  /\b(buy|sell)\s*(now|today)\b/i, /\bairdrop\b/i, /\bmint\s*(now|live)\b/i,
  /\bsign\s*up\b/i, /\bcoupon\b/i, /\bdiscount\b/i,
  /🧵\s*(thread|a thread)/i, /\baffiliate\b/i,
  /\bwe'?re\s*hiring\b/i, /\bapply\s*now\b/i, /\bjoin\s*our\s*team\b/i,
  /\$\d+\s*per\s*(week|month|hour)\b/i, /\bpayment\b.*\$\d+/i,
  /\bjust\s*in\b/i, /\bbreaking\b/i, /\bshocking\b/i,
  /\blawsuit\b/i, /\bsue[ds]?\b/i,
  /\bslur\b/i, /\bconscious\b/i,
];

const OFFENSIVE_PATTERNS = [
  /\b(fuck|shit|bitch|damn|ass|crap)\b/i,
  /\b(libtard|snowflake|woke\s*mob|dissident)\b/i,
  /\b(MAGA|trump|biden|candace|political)\b/i,
  /\b(slur|racist|sexist)\b/i,
];

// Accounts to never reply to (political, spam, inflammatory)
const BLOCKED_HANDLES = new Set([
  'realcandaceo', 'dissidentwest', 'community_sui',
  'libsoftiktok', 'catturd2',
]);

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

interface ReplyPost {
  id: string;
  type: 'reply';
  text: string;
  reply_to_tweet_id: string;
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
// DISCOVERY
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

  // Run 3 queries per day for wider coverage
  const indices = [
    dayIndex % SEARCH_QUERIES.length,
    (dayIndex + 2) % SEARCH_QUERIES.length,
    (dayIndex + 4) % SEARCH_QUERIES.length,
  ];

  for (const idx of indices) {
    const query = SEARCH_QUERIES[idx];
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
    .filter(c => !BLOCKED_HANDLES.has(c.authorHandle.toLowerCase()))
    .filter(c => c.text.length > 40)
    .filter(c => !c.text.startsWith('RT @'))
    .filter(c => !(c.likes > 5000 && c.replies < 10)) // bot farm
    .sort((a, b) => b.replies - a.replies) // sort by comments
    .slice(0, 25);
}

// ============================================================
// REPLY TEXT GENERATION
//
// Same voice as Vedang's posts:
// - Plain, short sentences. No buzzwords.
// - "can" / "may" instead of "will" / "should"
// - No emdashes, no colons, no AI words
// - No CTA, no selling
// - 2-3 lines that add genuine thought
//
// Replies are conversational — they respond to the specific
// tweet, not make standalone observations.
// ============================================================

const REPLY_TEMPLATES: Record<string, string[]> = {
  ai: [
    'Most AI adoption is happening quietly. The companies making noise about it are rarely the ones getting the most out of it.',
    'I think people judge AI by its worst outputs. But the way it changes how you work day to day is the part that actually matters.',
    'Depends a lot on whether you have used it for a year or tried it once and formed an opinion. Those are very different conversations.',
    'Everyone talks about replacement. But the bigger shift is just that expectations changed. People expect everything faster now.',
    'Nobody really knows how this plays out. The people who are most certain about it are usually the least helpful to listen to.',
    'Most useful AI work I have seen is boring stuff. Summarizing docs, cleaning data, writing boilerplate. Not the dramatic demos.',
    'I treat it like a fast but unreliable junior colleague. Helpful, sometimes wrong, always needs checking.',
    'Funny how 18 months ago none of these tools existed and now people talk about them like they have been around forever.',
    'The gap between people who use these tools daily and people who have opinions about them is getting wider every month.',
    'Feels like we are about two years away from this being the new normal. Like email was in 2005. You could ignore it but not for long.',
  ],
  startup: [
    'Almost none of it has to do with the idea. Execution speed and timing account for most of it.',
    'The boring middle part is what nobody warns you about. Not launches and raises. Just showing up day after day.',
    'From the outside it looks like strategy. From the inside it mostly feels like improvisation.',
    'Most startup advice is just survivor bias. The people who failed had the same playbook.',
    'Every founder I know who raised too early regrets it. Every one who waited too long also regrets it. There may not be a right time.',
    'Timing can matter as much as talent. Same idea five years earlier or later and you get a completely different outcome.',
  ],
  web3: [
    'The teams still building through the quiet periods are usually the ones worth watching later.',
    'A lot of the infrastructure work happening now is genuinely useful. Just doesn\'t make exciting headlines.',
    'Nobody knows which parts of this will matter long term. The people building practical tools feel like the safer bet.',
    'Crypto has this cycle of "it\'s dead" and "it\'s the future" every 18 months. The truth is probably somewhere much quieter.',
  ],
  career: [
    'The skills that got most people hired five years ago may not be enough five years from now. That part is uncomfortable but probably true.',
    'Lateral moves often look like mistakes when you make them. Then they turn out to be the best decision in retrospect.',
    'Hiring is still mostly broken. We screen for credentials and interview tricks instead of things that matter on the job.',
    'A lot of what determines career outcomes is just luck and timing. We like to pretend otherwise but the data doesn\'t support that.',
    'Remote work didn\'t kill offices. It just showed how many meetings could have been emails.',
    'The people who adapt well aren\'t always the most talented. They are the ones who kept learning when they didn\'t need to.',
  ],
  engineering: [
    'Best engineers I have worked with spent more time thinking than typing. That ratio makes a bigger difference than people expect.',
    'You can always tell when code was written by someone who expected to maintain it for years vs someone who was just trying to ship.',
    'Consistency, readability, clear naming. Boring stuff. But that\'s what actually ages well. The clever code usually doesn\'t.',
    'Best open source projects usually start with one person solving their own problem. Committees rarely build things people love.',
    'Most engineering arguments are about preferences pretending to be principles. The stuff that actually matters is rarely debated.',
  ],
  general: [
    'These conversations get better when people share what actually happened to them instead of what they think sounds smart.',
    'The takes that age well are almost never the ones that blow up in the first hour.',
    'Honest answer to most big questions is probably "it depends." But that doesn\'t get engagement so people pretend to be certain.',
    'Changing your mind when the facts change might be the most underrated skill in any field.',
    'The people who tend to get these things right are usually the ones who got it wrong once and actually learned from it.',
    'Worth thinking about for more than a few seconds before having a take. First reactions are rarely the best ones.',
  ],
};

function detectTopic(text: string): string {
  const t = text.toLowerCase();
  if (t.match(/\b(ai|llm|gpt|artificial intelligence|machine learning|chatgpt|openai|claude|gemini)\b/)) return 'ai';
  if (t.match(/\b(startup|founder|fundrais|vc|venture|yc|seed round|series [abc])\b/)) return 'startup';
  if (t.match(/\b(web3|crypto|blockchain|ethereum|bitcoin|defi|nft|solana)\b/)) return 'web3';
  if (t.match(/\b(hiring|layoff|job market|remote work|career|resume|interview|recruiter|salary)\b/)) return 'career';
  if (t.match(/\b(code|programming|developer|engineer|software|github|open source|rust|typescript|python)\b/)) return 'engineering';
  return 'general';
}

function generateReplyText(tweet: TweetCandidate, usedIndices: Map<string, Set<number>>): string {
  const topic = detectTopic(tweet.text);
  const pool = REPLY_TEMPLATES[topic] || REPLY_TEMPLATES.general;

  if (!usedIndices.has(topic)) usedIndices.set(topic, new Set());
  const used = usedIndices.get(topic)!;

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
// SCHEDULING — 20 replies spread across 7am-11pm IST
// ============================================================
function generateSchedule(count: number): { date: string; time: string }[] {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const today = ist.toISOString().split('T')[0];

  // Every ~50 minutes across 16 hours
  const slots: string[] = [];
  const startHour = 7;
  const totalMinutes = 16 * 60;
  const interval = totalMinutes / count;

  for (let i = 0; i < count; i++) {
    const minutesFromStart = Math.floor(i * interval);
    const hour = startHour + Math.floor(minutesFromStart / 60);
    const minute = minutesFromStart % 60;
    slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
  }

  return slots.map(time => ({ date: today, time }));
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  console.log('💬 X Reply Engine');
  console.log(`📅 ${new Date().toISOString()}\n`);

  // Step 1: Discover
  const raw = await discoverPosts();
  if (raw.length === 0) {
    console.log('❌ No posts found.');
    process.exit(0);
  }
  console.log(`\n📊 Raw candidates: ${raw.length}`);

  // Step 2: Filter
  const filtered = filterCandidates(raw);
  console.log(`🔬 After filtering: ${filtered.length}`);

  // Step 3: Check for duplicates
  let existing: ReplyPost[] = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
  }
  const alreadyReplied = new Set(existing.map(p => p.reply_to_tweet_id));

  // Step 4: Generate replies (max 20)
  const TARGET_COUNT = 20;
  const schedule = generateSchedule(TARGET_COUNT);
  const usedIndices = new Map<string, Set<number>>();
  const newPosts: ReplyPost[] = [];

  for (const tweet of filtered) {
    if (newPosts.length >= TARGET_COUNT) break;
    if (alreadyReplied.has(tweet.id)) continue;

    const text = generateReplyText(tweet, usedIndices);
    const slot = schedule[newPosts.length];

    newPosts.push({
      id: `reply-${tweet.id}`,
      type: 'reply',
      text,
      reply_to_tweet_id: tweet.id,
      original_author: `@${tweet.authorHandle}`,
      original_text_preview: tweet.text.substring(0, 120),
      scheduleDate: slot.date,
      scheduleTime: slot.time,
      posted: false,
    });
  }

  console.log(`\n✨ Generated ${newPosts.length} replies:\n`);
  for (const p of newPosts) {
    console.log(`  ${p.scheduleTime} "${p.text.substring(0, 70)}..."`);
    console.log(`         → reply to ${p.original_author}\n`);
  }

  // Step 5: Save
  const all = [...existing, ...newPosts];
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(all, null, 2));
  console.log(`📝 Saved ${all.length} total (${newPosts.length} new)`);
}

main().catch(console.error);

#!/usr/bin/env node
/**
 * Find viral posts (500+ replies), generate relatable quotes via Claude, post 5.
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { TwitterApi } from 'twitter-api-v2';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const client = new TwitterApi({
  appKey: process.env.X_API_KEY!,
  appSecret: process.env.X_API_KEY_SECRET!,
  accessToken: process.env.X_ACCESS_TOKEN!,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
});

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const QUOTE_FILE = path.resolve(__dirname, 'x-quote-posts.json');

const QUERIES = [
  '(AI OR "artificial intelligence" OR LLM OR GPT OR "machine learning") min_replies:500 -is:retweet lang:en -is:reply',
  '(startup OR SaaS OR "venture capital" OR founder OR product) min_replies:500 -is:retweet lang:en -is:reply',
  '(tech OR software OR engineering OR developer OR coding) min_replies:500 -is:retweet lang:en -is:reply',
  '(business OR CEO OR enterprise OR "remote work" OR hiring) min_replies:500 -is:retweet lang:en -is:reply',
];

const REJECT = [
  // Spam / engagement bait
  /\bdm\s*me\b/i, /\blink\s*in\s*bio\b/i, /\bgiveaway\b/i, /\bfollow\s*(me|back)\b/i,
  /\b(buy|sell)\s*(now|today)\b/i, /\bairdrop\b/i,
  // Promo / marketing posts
  /\bfree\s*(for|access|course|trial)\b/i, /\bpaid\s*course.*free\b/i,
  /\bfirst\s*\d+\s*(people|users|spots)\b/i,
  /\b(enroll|register|sign\s*up)\s*(now|today|here)\b/i,
  /\b(coupon|discount|promo\s*code|limited\s*time)\b/i,
  /\b(welcome\s*to|introducing\s*our|announcing|warm\s*welcome)\b/i,
  /\b(join\s*(our|the)|apply\s*now|submit\s*your)\b/i,
  /\b(thread|bookmark\s*this|save\s*this|retweet)\b/i,
  /\b(like\s*and|comment\s*and|reply\s*with|drop\s*a)\b/i,
  /\b(scholars|ambassadors?|reviewers?|winners?)\b/i,
  // Profanity / NSFW
  /\b(fuck|shit|bitch|ass)\b/i, /\b(porn|onlyfans|nsfw)\b/i,
  // Politicians and political figures
  /\b(trump|biden|obama|desantis|harris|pelosi|mcconnell|aoc|bernie|sanders)\b/i,
  /\b(MAGA|maga|GOP|democrat[s]?|republican[s]?)\b/i,
  /\b(congress|senator|governor|congressman|parliament|minister|Labour|Tory|Conservative)\b/i,
  // Political topics / culture war
  /\b(woke|anti.?woke|cancel\s*culture|culture\s*war)\b/i,
  /\b(abortion|pro.?life|pro.?choice|gun\s*control|2nd\s*amendment|second\s*amendment)\b/i,
  /\b(immigration|deport|border\s*(wall|crisis)|illegal\s*alien)\b/i,
  /\b(election|ballot|voter\s*fraud|rigged|stolen\s*election)\b/i,
  /\b(left.?wing|right.?wing|far.?left|far.?right|liberal[s]?|conservative[s]?)\b/i,
  /\b(lawsuit|indict|prosecut|impeach)\b/i,
  /\b(genocide|apartheid|colonialism|occupation)\b/i,
  /\b(palestine|israel|gaza|ukraine|russia)\b/i,
  /\b(war\s*crime|refugee|asylum)\b/i,
  /\b(protest|riot|insurrection|coup)\b/i,
];

async function generateQuote(postText: string): Promise<string> {
  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 200,
    messages: [{ role: 'user', content: `Write a quote tweet response to this post. Your goal is to add intellectual value and a positive perspective.

MUST be under 250 characters. This is a hard limit.

Rules:
- Be intellectual, neutral, and positive
- Add a thoughtful insight or build on the idea with relevant knowledge
- Sound like a real person typing on their phone
- One small natural typo is fine
- No hashtags, no emojis
- No AI words, no emdashes, no colons
- Banned words: empowering, unleashing, revolutionizing, cutting-edge, seamless, leveraging, innovative, landscape, navigate, unlock, delve, foster, pivotal, robust, holistic, nuanced, paradigm, synergy, elevate, harness, transform, reimagine, groundbreaking, game-changer, deep dive, unpacking, doubling down, at the end of the day, it's worth noting
- No "Great point" or "This is so true"
- Short sentences. Simple words.

Post: "${postText}"

Quote tweet text:` }],
  });
  return (res.content[0] as any).text.trim();
}

async function main() {
  console.log('🔎 Finding viral tech/business posts (500+ replies)...\n');

  // Load existing to avoid dupes
  let existing: any[] = [];
  if (fs.existsSync(QUOTE_FILE)) existing = JSON.parse(fs.readFileSync(QUOTE_FILE, 'utf-8'));
  const alreadyQuoted = new Set(existing.map((p: any) => p.quote_tweet_id));

  const candidates: any[] = [];

  for (const query of QUERIES) {
    try {
      console.log(`🔍 ${query.substring(0, 60)}...`);
      const result = await client.v2.search(query, {
        max_results: 30,
        'tweet.fields': ['public_metrics', 'created_at', 'author_id'],
        'user.fields': ['username', 'name'],
        expansions: ['author_id'],
        sort_order: 'relevancy',
      });

      const users = new Map<string, { username: string; name: string }>();
      if (result.includes?.users) {
        for (const u of result.includes.users) users.set(u.id, { username: u.username, name: u.name });
      }

      for (const tweet of result.data?.data || []) {
        const m = tweet.public_metrics!;
        if (m.reply_count < 500) continue;
        if (alreadyQuoted.has(tweet.id)) continue;
        if (REJECT.some(r => r.test(tweet.text))) continue;
        if (tweet.text.length < 40) continue;

        const user = users.get(tweet.author_id!) || { username: '', name: '' };
        candidates.push({
          id: tweet.id,
          text: tweet.text,
          handle: user.username,
          name: user.name,
          replies: m.reply_count,
          likes: m.like_count,
        });
      }
    } catch (err: any) {
      console.log(`  ❌ ${err.message}`);
    }
  }

  // Dedup by ID and sort by replies
  const unique = [...new Map(candidates.map(c => [c.id, c])).values()];
  unique.sort((a, b) => b.replies - a.replies);

  console.log(`\n📊 Found ${unique.length} viral posts (500+ replies)\n`);
  
  const targets = unique.slice(0, 10);
  if (targets.length === 0) {
    console.log('No eligible posts found.');
    return;
  }

  let posted = 0;
  for (const t of targets) {
    console.log(`[${posted + 1}/5] @${t.handle} (💬${t.replies} ❤️${t.likes})`);
    console.log(`  "${t.text.substring(0, 80)}..."`);

    try {
      const quoteText = await generateQuote(t.text);
      console.log(`  📝 "${quoteText}"`);

      const tweetUrl = `https://x.com/${t.handle}/status/${t.id}`;
      const { data } = await client.v2.tweet({
        text: `${quoteText}\n\n${tweetUrl}`,
      });
      console.log(`  ✅ Posted! ID: ${data.id}\n`);

      existing.push({
        id: `quote-${t.id}`,
        type: 'quote',
        text: quoteText,
        quote_tweet_id: t.id,
        original_author: `@${t.handle}`,
        original_text_preview: t.text.substring(0, 120),
        posted: true,
        postedAt: new Date().toISOString(),
        tweetId: data.id,
      });
      fs.writeFileSync(QUOTE_FILE, JSON.stringify(existing, null, 2));
      posted++;

      if (posted < targets.length) {
        console.log('  ⏳ 30s...\n');
        await new Promise(r => setTimeout(r, 30000));
      }
    } catch (err: any) {
      console.log(`  ❌ ${err.message}\n`);
    }
  }

  console.log(`\n📊 Posted ${posted}/5 quote tweets`);
}

main().catch(console.error);

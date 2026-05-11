#!/usr/bin/env node
/**
 * Bluesky Engagement Engine
 * - Searches for viral posts across tech, business, policy
 * - Uses Claude to generate contextual replies to each post
 * - Dedup log prevents double-commenting
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const HANDLE = process.env.BLUESKY_HANDLE!;
const APP_PASSWORD = process.env.BLUESKY_APP_PASSWORD!;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY!;
const LOG_FILE = path.resolve(__dirname, 'bluesky-comment-log.json');
const MAX_COMMENTS = 20;
const COOLDOWN_MS = 30000;
const PDS = 'https://bsky.social';

const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

// ─── Claude comment generation ───
async function generateReply(postText: string): Promise<string> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{ role: 'user', content: `Write a concise response to this post. MUST be under 250 characters.

Rules:
- Be intellectual, neutral, and positive
- Add a thoughtful observation or insight that builds on the original idea
- Share relevant experience or data that enriches the conversation
- Add one small typo (like "teh" or "becuase" or a missing letter)
- Only write completely relevant content. No fillers. No questions.
- Must sound like a real human typed it fast on their phone
- No AI words: empowering, unleashing, revolutionizing, cutting-edge, seamless, leveraging, innovative, landscape, navigate, unlock, delve, foster, pivotal, robust, holistic, nuanced, paradigm, synergy, elevate, harness, transform, reimagine, groundbreaking, game-changer, deep dive, unpacking, doubling down, at the end of the day, it's worth noting
- No emdashes or colons
- No hashtags or emojis
- No "Great point" or "This is so true" or "Interesting take"
- Simple words. Short sentences. Under 250 characters total.

Post: "${postText}"

Response:` }],
    });
    const text = (res.content[0] as any).text.trim();
    if (text.length <= 300) return text;
    console.log(`   ⚠️ Too long (${text.length}), retrying...`);
  }
  return 'Seeing this play out in real time. The companies that move first on this are going to have a serious head start.';
}

// ─── Dedup ───
interface LogEntry { uri: string; author: string; commentCid: string; postedAt: string; }

function loadLog(): LogEntry[] {
  if (!fs.existsSync(LOG_FILE)) return [];
  return JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
}
function saveLog(log: LogEntry[]) {
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
}

// ─── Bluesky API ───
let session: { did: string; accessJwt: string } | null = null;

async function login(): Promise<void> {
  const res = await fetch(`${PDS}/xrpc/com.atproto.server.createSession`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: HANDLE, password: APP_PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`);
  const data = await res.json() as any;
  session = { did: data.did, accessJwt: data.accessJwt };
}

async function searchPosts(query: string, limit = 25): Promise<any[]> {
  const params = new URLSearchParams({ q: query, limit: String(limit), sort: 'top' });
  const res = await fetch(`${PDS}/xrpc/app.bsky.feed.searchPosts?${params}`, {
    headers: { Authorization: `Bearer ${session!.accessJwt}` },
  });
  if (!res.ok) return [];
  const data = await res.json() as any;
  return data.posts || [];
}

async function reply(post: any, text: string): Promise<{ uri: string; cid: string }> {
  const record = {
    $type: 'app.bsky.feed.post',
    text,
    reply: {
      root: { uri: post.uri, cid: post.cid },
      parent: { uri: post.uri, cid: post.cid },
    },
    createdAt: new Date().toISOString(),
  };

  const res = await fetch(`${PDS}/xrpc/com.atproto.repo.createRecord`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session!.accessJwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      repo: session!.did,
      collection: 'app.bsky.feed.post',
      record,
    }),
  });

  if (!res.ok) throw new Error(`Reply failed: ${res.status} ${await res.text()}`);
  return await res.json() as any;
}

async function main() {
  if (!HANDLE || !APP_PASSWORD) {
    console.log('⏭️ Bluesky credentials not set');
    return;
  }
  if (!ANTHROPIC_KEY) {
    console.log('⏭️ ANTHROPIC_API_KEY not set');
    return;
  }

  console.log(`🦋 Bluesky engagement engine (Claude-powered)`);
  console.log(`   Handle: ${HANDLE}\n`);

  await login();
  console.log(`✅ Logged in as ${session!.did}\n`);

  const log = loadLog();
  const commentedUris = new Set(log.map(l => l.uri));

  // Search for viral posts across topics
  const QUERIES = [
    'AI agents', 'agentic AI', 'SaaS AI', 'enterprise AI', 'LLM production',
    'AI startup', 'future of work AI', 'AI automation',
    'tech policy', 'AI regulation', 'digital transformation',
    'startup funding', 'venture capital AI', 'business automation',
    'remote work', 'future of SaaS', 'enterprise software',
    'economic policy technology', 'digital public infrastructure',
  ];
  
  const candidates: any[] = [];

  for (const q of QUERIES) {
    console.log(`🔍 Searching: "${q}"`);
    const posts = await searchPosts(q);
    
    for (const p of posts) {
      if (commentedUris.has(p.uri)) continue;
      if (p.author.handle === HANDLE) continue;
      
      const likes = p.likeCount || 0;
      const replies = p.replyCount || 0;
      const postText = p.record?.text || '';
      
      // Skip very short posts or posts without substance
      if (postText.length < 30) continue;
      
      if (likes >= 5 || replies >= 3) {
        candidates.push(p);
        commentedUris.add(p.uri);
      }
    }
    
    await new Promise(r => setTimeout(r, 1000));
  }

  // Sort by engagement
  candidates.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
  const targets = candidates.slice(0, MAX_COMMENTS);

  console.log(`\n📋 Found ${candidates.length} candidates, commenting on ${targets.length}\n`);

  let posted = 0;

  for (let i = 0; i < targets.length; i++) {
    const post = targets[i];
    const postText = post.record?.text || '';

    console.log(`[${i + 1}/${targets.length}] @${post.author.handle} (❤️${post.likeCount || 0})`);
    console.log(`   "${postText.substring(0, 60)}..."`);

    try {
      // Generate contextual reply using Claude
      const comment = await generateReply(postText);
      console.log(`   💬 "${comment.substring(0, 60)}..."`);
      
      const result = await reply(post, comment);
      console.log(`   ✅ Posted`);
      log.push({ uri: post.uri, author: post.author.handle, commentCid: result.cid, postedAt: new Date().toISOString() });
      saveLog(log);
      posted++;
    } catch (err: any) {
      console.log(`   ❌ ${err.message.substring(0, 100)}`);
    }

    if (i < targets.length - 1) {
      console.log(`   ⏳ ${COOLDOWN_MS / 1000}s...\n`);
      await new Promise(r => setTimeout(r, COOLDOWN_MS));
    }
  }

  console.log(`\n📊 ${posted}/${targets.length} replies posted`);
}

main().catch(console.error);

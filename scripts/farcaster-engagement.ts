#!/usr/bin/env node
/**
 * Farcaster Engagement Engine (Free Tier)
 * - Discovers popular casts via Neynar Snapchain Hub (free)
 * - Uses Claude to generate contextual replies
 * - Posts replies via Neynar publish API (free with signer)
 * - Dedup log prevents double-commenting
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY!;
const SIGNER_UUID = process.env.NEYNAR_SIGNER_UUID!;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY!;
const HUB_URL = 'https://snapchain-api.neynar.com';
const LOG_FILE = path.resolve(__dirname, 'farcaster-comment-log.json');
const MAX_COMMENTS = 10;
const COOLDOWN_MS = 30000;

// ─── Claude reply generation ───
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

async function generateReply(postText: string): Promise<string> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{ role: 'user', content: `Write a concise response to this Farcaster cast. MUST be under 280 characters.

Rules:
- Share a genuine, informed perspective that adds value
- Be direct and opinionated but respectful
- Add one small typo (like "teh" or "becuase" or a missing letter)
- Must sound like a real human typed it fast on their phone
- No AI words: empowering, unleashing, revolutionizing, cutting-edge, seamless, leveraging, innovative, landscape, navigate, unlock, delve, foster, pivotal, robust, holistic, nuanced, paradigm, synergy, elevate, harness, transform, reimagine, groundbreaking, game-changer, deep dive, unpacking, doubling down, at the end of the day, it's worth noting
- No emdashes or colons
- No hashtags or emojis
- No "Great point" or "This is so true" or "Interesting take"
- Simple words. Short sentences. Under 280 characters total.

Cast: "${postText}"

Response:` }],
    });
    const text = (res.content[0] as any).text.trim();
    if (text.length <= 320) return text;
    console.log(`   ⚠️ Too long (${text.length}), retrying...`);
  }
  return 'The data tells a different story if you actually look at it closely.';
}

// ─── Dedup log ───
interface CommentLog {
  castHash: string;
  author: string;
  replyHash: string;
  replyText: string;
  postedAt: string;
}

function loadLog(): CommentLog[] {
  if (!fs.existsSync(LOG_FILE)) return [];
  return JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
}

function saveLog(log: CommentLog[]) {
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
}

// ─── Content filters ───
const REJECT = [
  /\b(porn|nsfw|onlyfans)\b/i,
  /\b(trump|biden|MAGA|democrat|republican)\b/i,
  /\b(giveaway|airdrop|free\s*mint)\b/i,
  /\b(dm\s*me|link\s*in\s*bio)\b/i,
  /\b(genocide|apartheid|insurrection)\b/i,
];

// ─── Popular FIDs to pull casts from (tech/crypto thought leaders) ───
const POPULAR_FIDS = [
  3,       // dwr (Dan Romero, Farcaster founder)
  2,       // v (Varun, Farcaster co-founder)
  239,     // balajis
  680,     // jesse pollak (Base)
  99,      // defi llama
  1317,    // linda xie
  5650,    // brian armstrong
  4085,    // cassie
  7143,    // 0xdesigner
  12142,   // ted
  194,     // ccarella
  6596,    // woj
  2433,    // horsefacts
  602,     // chriscoins
  616,     // ace
  4407,    // nonlinear
  3621,    // adrienne
  1325,    // greg
  8685,    // vitalik
  5,       // haardik
];

interface CastCandidate {
  hash: string;
  text: string;
  author: string;
  authorFid: number;
  timestamp: number;
}

async function discoverCasts(): Promise<CastCandidate[]> {
  const candidates: CastCandidate[] = [];
  const seenHashes = new Set<string>();

  console.log(`🔍 Scanning ${POPULAR_FIDS.length} popular accounts...\n`);

  for (const fid of POPULAR_FIDS) {
    try {
      const res = await fetch(`${HUB_URL}/v1/castsByFid?fid=${fid}&pageSize=5&reverse=true`, {
        headers: { 'x-api-key': NEYNAR_API_KEY },
      });

      if (!res.ok) {
        console.log(`   ⚠️ FID ${fid}: ${res.status}`);
        continue;
      }

      const data = await res.json() as any;
      const messages = data.messages || [];

      for (const msg of messages) {
        const body = msg.data?.castAddBody;
        if (!body?.text || body.text.length < 30) continue;
        // Skip replies (we want top-level casts)
        if (body.parentCastId) continue;

        const hash = msg.hash;
        if (seenHashes.has(hash)) continue;
        if (REJECT.some(r => r.test(body.text))) continue;

        seenHashes.add(hash);
        candidates.push({
          hash,
          text: body.text,
          author: `fid:${fid}`,
          authorFid: fid,
          timestamp: msg.data?.timestamp || 0,
        });
      }
    } catch (err: any) {
      console.log(`   ❌ FID ${fid}: ${err.message}`);
    }
  }

  // Enrich with usernames via Neynar bulk lookup
  const fids = [...new Set(candidates.map(c => c.authorFid))];
  if (fids.length > 0) {
    try {
      const res = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids.join(',')}`, {
        headers: { 'x-api-key': NEYNAR_API_KEY },
      });
      if (res.ok) {
        const data = await res.json() as any;
        const userMap = new Map<number, string>();
        for (const u of data.users || []) {
          userMap.set(u.fid, u.username);
        }
        for (const c of candidates) {
          c.author = userMap.get(c.authorFid) || c.author;
        }
      }
    } catch {}
  }

  // Sort by recency (higher timestamp = more recent)
  candidates.sort((a, b) => b.timestamp - a.timestamp);
  return candidates;
}

async function postReply(parentHash: string, parentFid: number, text: string): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const response = await fetch('https://api.neynar.com/v2/farcaster/cast', {
      method: 'POST',
      headers: {
        'x-api-key': NEYNAR_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        signer_uuid: SIGNER_UUID,
        text,
        parent: parentHash,
        parent_author_fid: parentFid,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return { success: false, error: `${response.status}: ${err.substring(0, 150)}` };
    }

    const data = await response.json() as any;
    return { success: true, hash: data.cast?.hash };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

async function main() {
  console.log('🟪 Farcaster Engagement Engine (Free Tier)\n');

  if (!NEYNAR_API_KEY || !SIGNER_UUID || !ANTHROPIC_KEY) {
    console.log('❌ Missing env vars: NEYNAR_API_KEY, NEYNAR_SIGNER_UUID, ANTHROPIC_API_KEY');
    return;
  }

  const log = loadLog();
  const commented = new Set(log.map(l => l.castHash));

  const candidates = await discoverCasts();
  const fresh = candidates.filter(c => !commented.has(c.hash));
  const targets = fresh.slice(0, MAX_COMMENTS);

  console.log(`📋 ${candidates.length} casts found, ${fresh.length} fresh, commenting on ${targets.length}\n`);

  if (targets.length === 0) {
    console.log('✅ No fresh targets.');
    return;
  }

  let posted = 0;

  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];
    console.log(`[${i + 1}/${targets.length}] @${t.author}`);
    console.log(`   "${t.text.substring(0, 80)}..."`);

    try {
      const reply = await generateReply(t.text);
      console.log(`   💬 "${reply.substring(0, 60)}..."`);

      const result = await postReply(t.hash, t.authorFid, reply);
      if (result.success) {
        console.log(`   ✅ Posted (${result.hash})`);
        log.push({
          castHash: t.hash,
          author: t.author,
          replyHash: result.hash!,
          replyText: reply,
          postedAt: new Date().toISOString(),
        });
        saveLog(log);
        posted++;
      } else {
        console.log(`   ❌ ${result.error}`);
      }
    } catch (err: any) {
      console.log(`   ❌ ${err.message}`);
    }

    if (i < targets.length - 1) {
      console.log(`   ⏳ ${COOLDOWN_MS / 1000}s...\n`);
      await new Promise(r => setTimeout(r, COOLDOWN_MS));
    }
  }

  console.log(`\n📊 ${posted}/${targets.length} replies posted`);
}

main().catch(console.error);

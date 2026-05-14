#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const API_KEY = process.env.NEYNAR_API_KEY!;

interface CastData {
  text: string;
  likes: number;
  recasts: number;
  replies: number;
  author: string;
  score: number;
}

// Top tech/business Farcaster accounts
const ACCOUNTS = [
  'dwr.eth',        // Dan Romero (Farcaster CEO)
  'vitalik.eth',    // Vitalik Buterin
  'balajis.eth',    // Balaji Srinivasan
  'cdixon.eth',     // Chris Dixon (a16z)
  'jessepollak',    // Jesse Pollak (Base)
  'linda',          // Linda Xie
  'ace',            // Ace (tech)
  'pm',             // Paul McKellar
  'samantha',       // Samantha
  'v',              // Varun Srinivasan
  'derek',          // Derek (tech)
  'july',           // July
  'ted',            // Ted
  'mac',            // Mac Budkowski
  'yb',             // YB
];

async function getUserFid(username: string): Promise<number | null> {
  const res = await fetch(
    `https://api.neynar.com/v2/farcaster/user/by_username?username=${username}`,
    { headers: { 'x-api-key': API_KEY } }
  );
  if (!res.ok) return null;
  const data = await res.json() as any;
  return data.user?.fid || null;
}

async function getUserCasts(fid: number): Promise<CastData[]> {
  const res = await fetch(
    `https://api.neynar.com/v2/farcaster/feed?feed_type=filter&filter_type=fids&fids=${fid}&limit=50`,
    { headers: { 'x-api-key': API_KEY } }
  );
  if (!res.ok) {
    // Try casts endpoint
    const res2 = await fetch(
      `https://api.neynar.com/v2/farcaster/casts?fid=${fid}&limit=50`,
      { headers: { 'x-api-key': API_KEY } }
    );
    if (!res2.ok) return [];
    const data2 = await res2.json() as any;
    return parseCasts(data2.casts || [], fid.toString());
  }
  const data = await res.json() as any;
  return parseCasts(data.casts || [], fid.toString());
}

function parseCasts(casts: any[], fidStr: string): CastData[] {
  return casts.map((c: any) => {
    const likes = c.reactions?.likes_count || 0;
    const recasts = c.reactions?.recasts_count || 0;
    const replies = c.replies?.count || 0;
    return {
      text: c.text || '',
      likes,
      recasts,
      replies,
      author: c.author?.username || fidStr,
      score: likes + recasts * 2 + replies * 3,
    };
  });
}

async function main() {
  console.log('🔍 Fetching casts from top tech/business Farcaster accounts...\n');

  const all: CastData[] = [];

  for (const username of ACCOUNTS) {
    const fid = await getUserFid(username);
    if (!fid) {
      console.log(`  ❌ ${username}: not found`);
      continue;
    }
    
    const casts = await getUserCasts(fid);
    // Only keep substantive casts
    const good = casts.filter(c => 
      c.text.length > 80 && 
      c.score > 5 &&
      !/giveaway|airdrop|follow me|rt to win/i.test(c.text)
    );
    all.push(...good);
    console.log(`  ✅ @${username} (fid:${fid}): ${good.length}/${casts.length} quality casts`);
    await new Promise(r => setTimeout(r, 300));
  }

  // Sort by engagement
  all.sort((a, b) => b.score - a.score);

  // Dedup
  const seen = new Set<string>();
  const unique = all.filter(r => {
    const key = r.text.substring(0, 50).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`\n📊 ${unique.length} unique quality casts\n`);
  console.log('=== TOP 15 CASTS ===\n');

  const top = unique.slice(0, 15);
  for (let i = 0; i < top.length; i++) {
    const r = top[i];
    console.log(`[${i + 1}] @${r.author} | ❤️${r.likes} 🔁${r.recasts} 💬${r.replies} (score: ${r.score})`);
    console.log(`    "${r.text.substring(0, 280)}"`);
    console.log();
  }

  fs.writeFileSync(
    path.resolve(__dirname, 'farcaster-top-casts.json'),
    JSON.stringify(top, null, 2)
  );
  console.log('💾 Saved to farcaster-top-casts.json');
}

main().catch(console.error);

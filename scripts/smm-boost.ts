#!/usr/bin/env node
/**
 * smm-boost.ts — Ratio-driven post-publish engagement seeding
 *
 * ALL quantities are derived from a single "seed" number using
 * platform-specific natural ratios. This ensures the engagement
 * mix looks organic to both algorithms and humans.
 *
 * Usage:
 *   npx tsx scripts/smm-boost.ts --platform twitter --url "..." [--context "post text snippet"]
 *
 * Environment:
 *   PAYTOSMM_API_KEY, PEAKERR_API_KEY, JAP_API_KEY
 *   SMM_BOOST_ENABLED=true  (dry-run by default)
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

// ─── Panels ──────────────────────────────────────────────────────
interface Panel { name: string; url: string; key: string }
const PANELS: Record<string, Panel> = {
  paytosmm: { name: 'PaytoSMM', url: 'https://paytosmm.com/api/v2', key: process.env.PAYTOSMM_API_KEY || '' },
  peakerr:  { name: 'Peakerr',  url: 'https://peakerr.com/api/v2',  key: process.env.PEAKERR_API_KEY || '' },
  jap:      { name: 'JAP',      url: 'https://justanotherpanel.com/api/v2', key: process.env.JAP_API_KEY || '' },
};

// ─── Natural Engagement Ratios ───────────────────────────────────
// These ratios are derived from empirical observation of viral posts.
// ALL quantities flow from a single "likeSeed" (the base like count).
//
// Example: Twitter with likeSeed=60
//   views = 60 * 8 = 480, retweets = 60 * 0.15 = 9, bookmarks = 60 * 0.05 = 3

interface PlatformRatio {
  viewsPerLike: number;       // views = likes * this
  sharesPerLike: number;      // shares/retweets = likes * this
  commentsPerLike: number;    // comments = likes * this
  savesPerLike: number;       // saves/bookmarks = likes * this
  extraReactionsPerLike: number; // non-like reactions = likes * this
}

const RATIOS: Record<string, PlatformRatio> = {
  twitter:   { viewsPerLike: 8,   sharesPerLike: 0.15, commentsPerLike: 0.05, savesPerLike: 0.05, extraReactionsPerLike: 0 },
  linkedin:  { viewsPerLike: 10,  sharesPerLike: 0.04, commentsPerLike: 0.10, savesPerLike: 0,    extraReactionsPerLike: 0.40 },
  facebook:  { viewsPerLike: 5,   sharesPerLike: 0.08, commentsPerLike: 0.10, savesPerLike: 0,    extraReactionsPerLike: 0.30 },
  instagram: { viewsPerLike: 10,  sharesPerLike: 0.02, commentsPerLike: 0.04, savesPerLike: 0.06, extraReactionsPerLike: 0 },
  telegram:  { viewsPerLike: 15,  sharesPerLike: 0,    commentsPerLike: 0.05, savesPerLike: 0,    extraReactionsPerLike: 0 },
  threads:   { viewsPerLike: 5,   sharesPerLike: 0.08, commentsPerLike: 0.08, savesPerLike: 0,    extraReactionsPerLike: 0 },
  bluesky:   { viewsPerLike: 0,   sharesPerLike: 0.12, commentsPerLike: 0,    savesPerLike: 0,    extraReactionsPerLike: 0 },
  tumblr:    { viewsPerLike: 0,   sharesPerLike: 0.20, commentsPerLike: 0,    savesPerLike: 0,    extraReactionsPerLike: 0 },
  reddit:    { viewsPerLike: 0,   sharesPerLike: 0,    commentsPerLike: 0,    savesPerLike: 0,    extraReactionsPerLike: 0 },
  // TikTok algo: saves > shares > views > likes. Saves signal "worth revisiting".
  tiktok:    { viewsPerLike: 12,  sharesPerLike: 0.08, commentsPerLike: 0,    savesPerLike: 0.10, extraReactionsPerLike: 0 },
};

// Seed ranges per platform (how many "likes" to target)
const SEED_RANGES: Record<string, [number, number]> = {
  twitter:   [30, 80],
  linkedin:  [25, 60],
  facebook:  [40, 120],
  instagram: [50, 120],
  telegram:  [20, 60],
  threads:   [15, 40],
  bluesky:   [15, 40],
  tumblr:    [15, 35],
  reddit:    [5, 12],
  tiktok:    [50, 150],
};

// ─── Service IDs per platform per action ─────────────────────────
interface ServiceChoice { panel: string; serviceId: number }

const SERVICES: Record<string, Record<string, ServiceChoice>> = {
  twitter: {
    views:     { panel: 'peakerr', serviceId: 15430 },  // $0.0017/1k, instant
    likes:     { panel: 'jap',     serviceId: 9531 },   // $1.41/1k, 10K/day, R30
    shares:    { panel: 'jap',     serviceId: 8860 },   // $0.125/1k retweets, 15K/day, instant
    saves:     { panel: 'jap',     serviceId: 2174 },   // $0.975/1k bookmarks, 1K/day
  },
  linkedin: {
    views:       { panel: 'jap',      serviceId: 6227 },  // $7.50/1k, 0-8h start
    likes:       { panel: 'jap',      serviceId: 2062 },  // $9.35/1k, R90
    insightful:  { panel: 'paytosmm', serviceId: 3543 },  // $11.88/1k
    celebrate:   { panel: 'paytosmm', serviceId: 3539 },  // $11.88/1k
    comments:    { panel: 'paytosmm', serviceId: 3538 },  // $31.25/1k
    shares:      { panel: 'paytosmm', serviceId: 3537 },  // $16.25/1k
  },
  facebook: {
    views:       { panel: 'jap',      serviceId: 9572 },  // $0.006/1k, cheapest
    likes:       { panel: 'paytosmm', serviceId: 4036 },  // $0.30/1k HQ
    loveReact:   { panel: 'paytosmm', serviceId: 4114 },  // $0.012/1k
    wowReact:    { panel: 'paytosmm', serviceId: 4115 },  // $0.012/1k
    shares:      { panel: 'paytosmm', serviceId: 3537 },  // $16.25/1k
  },
  instagram: {
    views:    { panel: 'jap',      serviceId: 5994 },   // $0.0007/1k, cheapest
    likes:    { panel: 'paytosmm', serviceId: 4261 },   // $0.086/1k real accounts
    saves:    { panel: 'peakerr',  serviceId: 30763 },  // $1.84/1k
    shares:   { panel: 'paytosmm', serviceId: 4152 },   // $0.113/1k + reach
  },
  telegram: {
    views:     { panel: 'peakerr',  serviceId: 31146 },  // $0.002/1k, cheapest
    reactions: { panel: 'paytosmm', serviceId: 2711 },   // $0.118/1k mix positive
  },
  threads: {
    likes:  { panel: 'jap', serviceId: 2133 },  // $1.20/1k
    shares: { panel: 'jap', serviceId: 2135 },  // $4.00/1k
  },
  bluesky: {
    likes:  { panel: 'jap',     serviceId: 9531 },   // $1.41/1k R30
    boosts: { panel: 'peakerr', serviceId: 31698 },  // $4.90/1k R60
  },
  tumblr: {
    likes:   { panel: 'peakerr', serviceId: 31635 },  // $4.90/1k R60
    reblogs: { panel: 'peakerr', serviceId: 31636 },  // $12.60/1k R60
  },
  reddit: {
    upvotes: { panel: 'jap', serviceId: 3471 },  // $4.38/1k, min 2
  },
  tiktok: {
    saves:   { panel: 'jap', serviceId: 10257 },  // $0.006/1k, cheapest, instant
    views:   { panel: 'jap', serviceId: 10266 },  // $0.02/1k auto views, 5M/day
    likes:   { panel: 'jap', serviceId: 10061 },  // $0.015/1k, instant
    shares:  { panel: 'jap', serviceId: 10260 },  // $0.025/1k, instant
  },
};

// ─── Human-Sounding Comment Bank ─────────────────────────────────
// Rules: No emojis at start. No "Great post!". No AI slop.
// Short, varied, sounds like someone who actually read it.
// Categorized by post topic for contextual matching.

const COMMENT_BANKS: Record<string, string[]> = {
  tech: [
    'been thinking about this exact problem at work lately',
    'the part about coordination costs is underrated',
    'interesting framing. hadnt considered it from that angle',
    'this mirrors what I saw at my last company',
    'solid breakdown. saving this for reference',
    'the data point about efficiency gains is telling',
    'makes sense when you look at how the industry has shifted',
    'worth noting that adoption curves tend to compress over time',
    'this is the kind of analysis thats missing from most discussions',
    'agreed on the core thesis but the timeline might be optimistic',
    'the comparison to infrastructure cycles is apt',
    'curious how this plays out in regulated industries',
    'real talk. most people skip the implementation details',
    'been saying something similar but you laid it out better',
    'the gap between perception and reality here is massive',
  ],
  career: [
    'needed to hear this today',
    'the interview process is so broken and nobody talks about it',
    'this is exactly what I tell junior devs',
    'underrated perspective on how hiring actually works',
    'the skills gap conversation needs more of this nuance',
    'worked in web3 for 2 years, can confirm all of this',
    'the part about side projects mattering more than credentials rings true',
    'wish more hiring managers understood this',
    'shared this with my team. important context',
    'the market is weird right now and this helps explain why',
  ],
  general: [
    'well said',
    'interesting take',
    'this resonates',
    'bookmarked',
    'worth the read',
    'hadnt thought of it this way before',
    'clear and direct. appreciate the no-bs approach',
    'the simplicity of this framing is what makes it land',
    'strong point about the underlying incentives',
    'this deserves more visibility',
    'sharing this around. people need to see this',
    'concise and on point',
    'the data backs this up too',
    'been waiting for someone to articulate this properly',
    'this is the kind of content I follow you for',
  ],
};

function pickComments(count: number, context?: string): string[] {
  // Detect topic from context
  let pool: string[] = [...COMMENT_BANKS.general];
  if (context) {
    const lower = context.toLowerCase();
    if (lower.match(/ai|model|agent|code|engineer|deploy|api|infrastructure|data/)) {
      pool = [...pool, ...COMMENT_BANKS.tech];
    }
    if (lower.match(/job|hire|career|interview|salary|remote|work|resume|skill/)) {
      pool = [...pool, ...COMMENT_BANKS.career];
    }
  }

  // Shuffle and pick unique comments
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ─── Jitter: Add ±20% randomness to any number ──────────────────
function jitter(n: number, pct = 0.20): number {
  const variance = n * pct;
  const result = Math.round(n + (Math.random() * 2 - 1) * variance);
  return Math.max(1, result);
}

// ─── Derive all quantities from a single seed ────────────────────
interface DerivedQuantities {
  likes: number;
  views: number;
  shares: number;
  comments: number;
  saves: number;
  extraReactions: number;
}

function deriveQuantities(platform: string): DerivedQuantities {
  const [minSeed, maxSeed] = SEED_RANGES[platform] || [20, 50];
  const baseLikes = Math.floor(Math.random() * (maxSeed - minSeed + 1)) + minSeed;
  const ratio = RATIOS[platform];

  return {
    likes:           jitter(baseLikes),
    views:           jitter(Math.round(baseLikes * ratio.viewsPerLike)),
    shares:          jitter(Math.max(1, Math.round(baseLikes * ratio.sharesPerLike))),
    comments:        jitter(Math.max(0, Math.round(baseLikes * ratio.commentsPerLike))),
    saves:           jitter(Math.max(0, Math.round(baseLikes * ratio.savesPerLike))),
    extraReactions:  jitter(Math.max(0, Math.round(baseLikes * ratio.extraReactionsPerLike))),
  };
}

// ─── Order Sequencing ────────────────────────────────────────────
// Platform-specific order sequences with proper timing.
// Each returns an array of {action, panel, serviceId, qty, delayMin, dripRuns?, dripInterval?}

interface QueuedOrder {
  action: string;
  panel: string;
  serviceId: number;
  qty: number;
  delayMin: number;
  dripRuns?: number;
  dripInterval?: number;
  comments?: string[];
}

function buildOrderQueue(platform: string, context?: string): QueuedOrder[] {
  const q = deriveQuantities(platform);
  const svc = SERVICES[platform];
  if (!svc) return [];

  const queue: QueuedOrder[] = [];

  switch (platform) {
    case 'twitter':
      // Algo: impression-to-engagement ratio. Views first, then engagement.
      if (q.views > 0) queue.push({ action: 'Views', ...svc.views, qty: q.views, delayMin: 0, dripRuns: 3, dripInterval: 20 });
      queue.push({ action: 'Likes', ...svc.likes, qty: q.likes, delayMin: 2, dripRuns: 4, dripInterval: 15 });
      if (q.shares > 0) queue.push({ action: 'Retweets', ...svc.shares, qty: q.shares, delayMin: 6 });
      if (q.saves > 0) queue.push({ action: 'Bookmarks', ...svc.saves, qty: q.saves, delayMin: 1 });
      break;

    case 'linkedin':
      // Algo: comments > reactions > shares. Reaction variety matters.
      if (q.views > 0) queue.push({ action: 'Views', ...svc.views, qty: q.views, delayMin: 0 });
      queue.push({ action: 'Likes', ...svc.likes, qty: q.likes, delayMin: 2, dripRuns: 3, dripInterval: 20 });
      // Split extra reactions into Insightful (60%) and Celebrate (40%)
      if (q.extraReactions > 0) {
        const insightful = Math.round(q.extraReactions * 0.6);
        const celebrate = q.extraReactions - insightful;
        queue.push({ action: 'Insightful 💡', ...svc.insightful, qty: insightful, delayMin: 2 });
        if (celebrate > 0) queue.push({ action: 'Celebrate 👏', ...svc.celebrate, qty: celebrate, delayMin: 4 });
      }
      if (q.comments > 0) {
        const commentTexts = pickComments(q.comments, context);
        queue.push({ action: 'Comments', ...svc.comments, qty: q.comments, delayMin: 7, comments: commentTexts });
      }
      if (q.shares > 0) queue.push({ action: 'Shares', ...svc.shares, qty: q.shares, delayMin: 10 });
      break;

    case 'facebook':
      // Algo: shares > reactions > comments > watch time
      if (q.views > 0) queue.push({ action: 'Views', ...svc.views, qty: q.views, delayMin: 0 });
      queue.push({ action: 'Likes 👍', ...svc.likes, qty: q.likes, delayMin: 1 });
      if (q.extraReactions > 0) {
        const love = Math.round(q.extraReactions * 0.6);
        const wow = q.extraReactions - love;
        queue.push({ action: 'Love ❤️', ...svc.loveReact, qty: love, delayMin: 1 });
        if (wow > 0) queue.push({ action: 'Wow 😲', ...svc.wowReact, qty: wow, delayMin: 4 });
      }
      if (q.shares > 0) queue.push({ action: 'Shares', ...svc.shares, qty: q.shares, delayMin: 2 });
      break;

    case 'instagram':
      // Algo: saves > shares > likes. Saves are the secret weapon.
      if (q.saves > 0) queue.push({ action: 'Saves', ...svc.saves, qty: q.saves, delayMin: 0 });
      if (q.views > 0) queue.push({ action: 'Views', ...svc.views, qty: q.views, delayMin: 2 });
      queue.push({ action: 'Likes', ...svc.likes, qty: q.likes, delayMin: 2, dripRuns: 4, dripInterval: 30 });
      if (q.shares > 0) queue.push({ action: 'Shares', ...svc.shares, qty: q.shares, delayMin: 2 });
      break;

    case 'telegram':
      if (q.views > 0) queue.push({ action: 'Views', ...svc.views, qty: q.views, delayMin: 0 });
      queue.push({ action: 'Reactions', ...svc.reactions, qty: q.likes, delayMin: 2 });
      break;

    case 'threads':
      queue.push({ action: 'Likes', ...svc.likes, qty: q.likes, delayMin: 0, dripRuns: 3, dripInterval: 10 });
      if (q.shares > 0) queue.push({ action: 'Shares', ...svc.shares, qty: q.shares, delayMin: 4 });
      break;

    case 'bluesky':
      queue.push({ action: 'Likes', ...svc.likes, qty: q.likes, delayMin: 0, dripRuns: 3, dripInterval: 15 });
      if (q.shares > 0) queue.push({ action: 'Boosts', ...svc.boosts, qty: q.shares, delayMin: 4 });
      break;

    case 'tumblr':
      queue.push({ action: 'Likes', ...svc.likes, qty: q.likes, delayMin: 0 });
      if (q.shares > 0) queue.push({ action: 'Reblogs', ...svc.reblogs, qty: q.shares, delayMin: 4 });
      break;

    case 'reddit':
      // Reddit is HIGH RISK. Keep quantities tiny, drip very slowly.
      queue.push({ action: 'Upvotes', ...svc.upvotes, qty: q.likes, delayMin: 2, dripRuns: 3, dripInterval: 30 });
      break;

    case 'tiktok':
      // TikTok algo: saves + shares drive "For You" page placement.
      // Saves signal "worth revisiting" — strongest algo weight.
      // Views create the base. Likes confirm quality.
      if (q.saves > 0) queue.push({ action: 'Saves', ...svc.saves, qty: q.saves, delayMin: 0 });
      if (q.views > 0) queue.push({ action: 'Views', ...svc.views, qty: q.views, delayMin: 2 });
      queue.push({ action: 'Likes', ...svc.likes, qty: q.likes, delayMin: 1, dripRuns: 3, dripInterval: 20 });
      if (q.shares > 0) queue.push({ action: 'Shares', ...svc.shares, qty: q.shares, delayMin: 4 });
      break;
  }

  // Apply minimum enforcement per service
  return queue.filter(o => o.qty >= 1).map(o => ({
    ...o,
    qty: Math.max(o.qty, getMinQty(o.panel, o.serviceId)),
  }));
}

function getMinQty(panel: string, serviceId: number): number {
  const mins: Record<string, Record<number, number>> = {
    peakerr: { 15430: 100, 30763: 10, 31146: 10, 31635: 20, 31636: 20, 31698: 20 },
    jap:     { 9531: 10, 5994: 100, 6227: 500, 2062: 20, 2133: 10, 2135: 10, 3471: 2, 9572: 100,
              8860: 10, 2174: 100, 10257: 100, 10266: 100, 10061: 10, 10260: 100 },
    paytosmm: { 3537: 50, 3538: 10, 3539: 50, 3543: 50, 4036: 10,
                4113: 100, 4114: 100, 4115: 100, 4152: 10, 4261: 10, 2711: 50 },
  };
  return mins[panel]?.[serviceId] || 10;
}

// ─── API ─────────────────────────────────────────────────────────
async function placeOrder(panel: Panel, serviceId: number, link: string, quantity: number,
  dripRuns?: number, dripInterval?: number, comments?: string[]): Promise<{ orderId?: number; error?: string }> {
  const params = new URLSearchParams();
  params.append('key', panel.key);
  params.append('action', 'add');
  params.append('service', String(serviceId));
  params.append('link', link);
  params.append('quantity', String(quantity));
  if (dripRuns && dripInterval) {
    params.append('runs', String(dripRuns));
    params.append('interval', String(dripInterval));
  }
  if (comments?.length) {
    params.append('comments', comments.join('\n'));
  }
  try {
    const res = await fetch(panel.url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString() });
    const data = await res.json() as Record<string, unknown>;
    return data.order ? { orderId: Number(data.order) } : { error: JSON.stringify(data) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

// ─── Logging ─────────────────────────────────────────────────────
const LOG_FILE = path.resolve(__dirname, 'smm-boost-log.json');
interface LogEntry { timestamp: string; platform: string; postUrl: string; seed: object; orders: object[] }
function loadLog(): LogEntry[] { try { return JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8')); } catch { return []; } }
function saveLog(log: LogEntry[]) { fs.writeFileSync(LOG_FILE, JSON.stringify(log.slice(-200), null, 2)); }

// ─── Anti-Pattern: Skip 1 in 4 posts randomly ───────────────────
function shouldSkipForNaturalness(): boolean {
  // Don't boost every single post — let ~25% perform organically
  return Math.random() < 0.25;
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const platformIdx = args.indexOf('--platform');
  const urlIdx = args.indexOf('--url');
  const ctxIdx = args.indexOf('--context');
  const forceFlag = args.includes('--force');
  const dryRun = process.env.SMM_BOOST_ENABLED !== 'true';

  if (platformIdx === -1 || urlIdx === -1) {
    console.log('Usage: npx tsx scripts/smm-boost.ts --platform <platform> --url <url> [--context "post text"] [--force]');
    console.log('\nPlatforms:', Object.keys(SERVICES).join(', '));
    console.log('\nSet SMM_BOOST_ENABLED=true for live orders (dry-run by default)');
    return;
  }

  const platform = args[platformIdx + 1];
  const postUrl = args[urlIdx + 1];
  const context = ctxIdx !== -1 ? args[ctxIdx + 1] : undefined;

  if (!SERVICES[platform]) { console.error(`Unknown platform: ${platform}`); return; }

  // Dedup
  const log = loadLog();
  if (log.some(e => e.postUrl === postUrl)) { console.log(`Already boosted: ${postUrl}`); return; }

  // Natural skip (unless --force)
  if (!forceFlag && shouldSkipForNaturalness()) {
    console.log(`🎲 Randomly skipping this post for naturalness (use --force to override)`);
    return;
  }

  // Build ratio-driven order queue
  const queue = buildOrderQueue(platform, context);

  console.log(`\n🎯 ${platform.toUpperCase()} | ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`📎 ${postUrl}`);
  console.log(`📊 ${queue.length} orders (ratio-derived)\n`);

  const logEntry: LogEntry = { timestamp: new Date().toISOString(), platform, postUrl, seed: deriveQuantities(platform), orders: [] };

  for (const order of queue) {
    const dripStr = order.dripRuns ? `, drip ${order.dripRuns}x/${order.dripInterval}min` : '';
    const commentStr = order.comments ? ` [${order.comments.length} comments]` : '';
    console.log(`  📋 T+${String(order.delayMin).padStart(2)}min | ${order.action.padEnd(16)} | ${String(order.qty).padStart(4)} via ${order.panel}${dripStr}${commentStr}`);

    if (order.comments) {
      order.comments.forEach(c => console.log(`       💬 "${c}"`));
    }

    if (!dryRun) {
      const panel = PANELS[order.panel];
      if (!panel?.key) { console.log(`       ⚠️ No key for ${order.panel}`); continue; }
      // Delay execution
      await new Promise(r => setTimeout(r, order.delayMin * 60 * 1000));
      const result = await placeOrder(panel, order.serviceId, postUrl, order.qty, order.dripRuns, order.dripInterval, order.comments);
      const status = result.orderId ? `✅ #${result.orderId}` : `❌ ${result.error}`;
      console.log(`       ${status}`);
      (logEntry.orders as any[]).push({ ...order, ...result });
    } else {
      (logEntry.orders as any[]).push({ ...order, status: 'DRY_RUN' });
    }
  }

  log.push(logEntry);
  saveLog(log);
  console.log(`\n📝 Logged to smm-boost-log.json`);
}

main().catch(console.error);

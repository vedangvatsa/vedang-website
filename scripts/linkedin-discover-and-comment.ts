#!/usr/bin/env node
/**
 * LinkedIn Engagement Engine
 * - Discovers viral AI/tech/startup posts via Google
 * - Writes human comments with essay links (no AI slop)
 * - Posts comments via LinkedIn v2 API
 * - Tracks commented posts to prevent duplicates
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const TOKEN = process.env.LINKEDIN_ACCESS_TOKEN!;
const PERSON_URN = process.env.LINKEDIN_PERSON_URN!;
const LOG_FILE = path.resolve(__dirname, 'linkedin-comment-log.json');
const MAX_COMMENTS = 10;
const COOLDOWN_MS = 45000; // 45s between comments

// ─── Essay bank (topic → URL) ───
const ESSAYS: Record<string, { url: string; desc: string }> = {
  'stepwise': { url: 'https://veda.ng/stepwise-ai', desc: 'starting with narrow high-frequency tasks' },
  'playbook': { url: 'https://veda.ng/ai-implementation-playbook', desc: 'step by step AI implementation' },
  'saas': { url: 'https://veda.ng/agents-eating-saas', desc: 'agents breaking per-seat pricing' },
  'state': { url: 'https://veda.ng/agentic-state', desc: 'governments deploying AI at scale' },
  'textui': { url: 'https://veda.ng/universal-text-ui', desc: 'text field replacing dashboards' },
  'agenticweb': { url: 'https://veda.ng/towards-the-agentic-web', desc: 'internet shifting to agent-friendly' },
  'commerce': { url: 'https://veda.ng/agentic-commerce', desc: 'algorithms shopping on our behalf' },
  'postscarcity': { url: 'https://veda.ng/post-scarcity-technology', desc: 'marginal cost of intelligence trending to zero' },
  'yc': { url: 'https://veda.ng/yc-landscape', desc: 'YC portfolio structural shifts' },
  'postinterface': { url: 'https://veda.ng/post-interface-internet', desc: 'GUI was a 40 year hack' },
};

// ─── Thought templates (human, no slop, with line breaks) ───
const THOUGHTS: string[] = [
  `The bottleneck is rarely compute.\n\nIt is institutional inertia. Organizations spend millions on infrastructure, yet refuse to redesign the underlying workflows that made them slow in the first place.\n\nYou cannot automate a broken process and expect velocity.\n{url}`,

  `Accountability remains the unresolved tension here.\n\nWhen a system executes a decision autonomously, the liability does not disappear—it just shifts.\n\nWe are building the technical capacity faster than the legal frameworks required to govern it.\n{url}`,

  `A structural reality most overlook:\n\nSaaS economics rely heavily on human constraints—per-seat pricing assumes human operators. When the operator is a script running continuously, the pricing model collapses.\n\nThe vendors who recognize this early will survive the transition.\n{url}`,

  `The obsession with general-purpose systems is a distraction.\n\nReal economic value is being captured by teams building narrow, highly deterministic tools for specific vertical problems.\n\nPrecision scales better than general competence.\n{url}`,

  `We built the internet for human consumption.\n\nNow we are forcing machine-readable systems to parse human-centric interfaces. The next foundational shift is not better parsing—it is native infrastructure built exclusively for algorithmic access.\n\n{url}`,

  `The dashboard was always a compromise.\n\nIt was a way to compress complex database structures into something a human eye could scan. As natural language becomes the default query mechanism, the dashboard becomes obsolete.\n\nThe text field is the new canvas.\n{url}`,

  `Implementation is fundamentally an operations problem, not an engineering one.\n\nIf you do not map the entire organizational logic before deploying the system, you are just moving the friction from one department to another.\n\n{url}`,

  `Governments have a surprising advantage here.\n\nThose that invested early in robust digital identity primitives—like Estonia or Singapore—can deploy these autonomous systems with immediate cryptographic trust.\n\nIdentity is the prerequisite for autonomy.\n{url}`,

  `The true cost of these systems is rarely in the deployment.\n\nIt is in the maintenance of the orchestration layer. Edge cases compound exponentially when systems interact with the physical world.\n\nRobust error handling is where the actual engineering happens.\n{url}`,

  `We are approaching a point where the marginal cost of intelligence trends toward zero.\n\nThe implications for software engineering are obvious. The implications for macroeconomic structure and labor markets are barely being discussed.\n\n{url}`
];

// ─── Topic detection ───
function detectTopic(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('saas') || lower.includes('per-seat') || lower.includes('pricing model') || lower.includes('subscription'))
    return 'saas';
  if (lower.includes('government') || lower.includes('public sector') || lower.includes('estonia') || lower.includes('singapore'))
    return 'state';
  if (lower.includes('dashboard') || lower.includes('interface') || lower.includes('ui') || lower.includes('text field'))
    return 'textui';
  if (lower.includes('commerce') || lower.includes('shopping') || lower.includes('e-commerce'))
    return 'commerce';
  if (lower.includes('scarcity') || lower.includes('marginal cost') || lower.includes('zero cost'))
    return 'postscarcity';
  if (lower.includes('yc') || lower.includes('y combinator') || lower.includes('portfolio'))
    return 'yc';
  if (lower.includes('gui') || lower.includes('post-interface') || lower.includes('no interface'))
    return 'postinterface';
  if (lower.includes('api') || lower.includes('internet') || lower.includes('web') || lower.includes('machine-readable'))
    return 'agenticweb';
  if (lower.includes('playbook') || lower.includes('implementation') || lower.includes('deploy') || lower.includes('production'))
    return 'playbook';
  // Default
  return 'stepwise';
}

function pickThought(topic: string, usedIndices: Set<number>): string {
  const essay = ESSAYS[topic] || ESSAYS['stepwise'];
  let idx: number;
  do {
    idx = Math.floor(Math.random() * THOUGHTS.length);
  } while (usedIndices.has(idx) && usedIndices.size < THOUGHTS.length);
  usedIndices.add(idx);
  return THOUGHTS[idx].replace('{url}', essay.url);
}

// ─── Dedup log ───
interface CommentLog {
  activityId: string;
  author: string;
  commentId: string;
  commentText: string;
  postedAt: string;
}

function loadLog(): CommentLog[] {
  if (!fs.existsSync(LOG_FILE)) return [];
  return JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
}

function saveLog(log: CommentLog[]) {
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
}

function hasCommented(activityId: string, log: CommentLog[]): boolean {
  return log.some(l => l.activityId === activityId);
}

// ─── LinkedIn API ───
async function resolveUrn(activityId: string): Promise<string | null> {
  const activityUrn = `urn:li:activity:${activityId}`;
  const url = `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(activityUrn)}/comments`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      actor: PERSON_URN,
      object: activityUrn,
      message: { text: '__resolve__' },
    }),
  });

  if (res.status === 201) {
    // Worked with activity URN — delete probe comment
    const data = await res.json();
    try {
      await fetch(`${url}/${data.id}?actor=${encodeURIComponent(PERSON_URN)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${TOKEN}`, 'X-Restli-Protocol-Version': '2.0.0' },
      });
    } catch {}
    return activityUrn;
  }

  const body = await res.text();
  const ugcMatch = body.match(/urn:li:ugcPost:\d+/);
  if (ugcMatch) return ugcMatch[0];
  const shareMatch = body.match(/urn:li:share:\d+/);
  if (shareMatch) return shareMatch[0];
  return null;
}

async function postComment(urn: string, text: string): Promise<{ success: boolean; id?: string; error?: string }> {
  const url = `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(urn)}/comments`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      actor: PERSON_URN,
      object: urn,
      message: { text },
    }),
  });

  if (res.status === 201) {
    const data = await res.json();
    return { success: true, id: data.id };
  }
  const err = await res.text();
  return { success: false, error: `${res.status}: ${err.substring(0, 150)}` };
}

// ─── Discovery via provided targets or stdin ───
interface Target {
  activityId: string;
  author: string;
  topic: string;
}

// For now, read targets from a JSON file that can be updated by cron/manual
const TARGETS_FILE = path.resolve(__dirname, 'linkedin-targets.json');

async function main() {
  if (!fs.existsSync(TARGETS_FILE)) {
    console.log('❌ No targets file found. Create scripts/linkedin-targets.json with:');
    console.log('[{"activityId":"123","author":"Name","topic":"topic text"}]');
    process.exit(1);
  }

  const allTargets: Target[] = JSON.parse(fs.readFileSync(TARGETS_FILE, 'utf-8'));
  const log = loadLog();
  const usedIndices = new Set<number>();

  // Filter out already commented
  const fresh = allTargets.filter(t => !hasCommented(t.activityId, log));
  const targets = fresh.slice(0, MAX_COMMENTS);

  console.log(`👤 ${PERSON_URN}`);
  console.log(`📋 ${allTargets.length} total targets, ${fresh.length} fresh, posting ${targets.length}\n`);

  if (targets.length === 0) {
    console.log('✅ Nothing new to comment on. All targets already covered.');
    return;
  }

  let posted = 0;

  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];
    console.log(`[${i + 1}/${targets.length}] ${t.author} — ${t.topic.substring(0, 50)}`);

    // Resolve URN
    const urn = await resolveUrn(t.activityId);
    if (!urn) {
      console.log('   ❌ Could not resolve post URN (deleted?)\n');
      continue;
    }

    // Generate comment
    const topic = detectTopic(t.topic);
    const comment = pickThought(topic, usedIndices);
    console.log(`   Topic: ${topic} → ${ESSAYS[topic]?.url}`);

    // Post
    const result = await postComment(urn, comment);
    if (result.success) {
      console.log(`   ✅ Posted (${result.id})`);
      log.push({
        activityId: t.activityId,
        author: t.author,
        commentId: result.id!,
        commentText: comment,
        postedAt: new Date().toISOString(),
      });
      saveLog(log);
      posted++;
    } else {
      console.log(`   ❌ ${result.error}`);
    }

    if (i < targets.length - 1) {
      console.log(`   ⏳ ${COOLDOWN_MS / 1000}s...\n`);
      await new Promise(r => setTimeout(r, COOLDOWN_MS));
    }
  }

  console.log(`\n📊 ${posted}/${targets.length} comments posted`);
}

main();

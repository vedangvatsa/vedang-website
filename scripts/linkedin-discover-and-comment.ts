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
  `Talked to three CTOs last month who tried this.\n\nTwo failed because they gave the agent five jobs at once. The third picked invoice reconciliation, nothing else, and saved 40 hours a week.\n\nNarrow wins. Wrote more on it here.\n{url}`,

  `Nobody wants to admit this part.\n\nThe hard work is not picking a model. It is sitting down with ops people and understanding why the current process has 11 steps when it should have 3.\n\nThat is where the real savings come from.\n{url}`,

  `Seen this play out a dozen times now.\n\nThe demo works perfectly. Everyone claps. Then it hits production and chokes on a PDF that has a table formatted slightly differently.\n\nRobustness is boring but it is everything.\n{url}`,

  `Something people miss in these conversations.\n\nThe companies winning are not spending the most on compute. They are the ones that figured out which 20% of work actually needs a human.\n\n{url}`,

  `Worth noting that accountability is where most of these projects quietly die.\n\nNobody got fired for launching a pilot. But nobody got promoted for a pilot that went nowhere either.\n\nThe bar is shifting from "did it launch" to "did it move a number."\n{url}`,

  `One underrated angle here.\n\nWhen the agent can pull the answer from three different databases in 2 seconds, nobody needs a dashboard anymore. A text box and a good prompt does more.\n\nThat feels like where things are heading.\n{url}`,

  `Every SaaS company charges per seat.\n\nAgents do not need seats. They do not take lunch breaks. They do not go on PTO.\n\nThe pricing models we all grew up with are not built for this. That reckoning is coming fast.\n{url}`,

  `The models keep getting better but the real problem has not changed.\n\nMost company data lives in messy spreadsheets, random Notion pages, and someone's Slack DMs. No model fixes that.\n\nThe plumbing matters more than the brain.\n{url}`,

  `Refreshing to see someone say this out loud.\n\nHalf the "AI transformations" I see announced on this platform are a chatbot wrapper on GPT-4 with a new logo. That is not transformation, that is a weekend project.\n\nActual production deployment is a different sport.\n{url}`,

  `Governments that built digital identity infrastructure years ago are going to have a massive head start here.\n\nEstonia and Singapore did not build that stuff for agents. But it turns out the same infrastructure works perfectly.\n\nFunny how that happens.\n{url}`,

  `18 months of watching companies try this and the pattern is always the same.\n\nStart too broad, get mediocre results, blame the technology. Start too narrow, get great results, then scale.\n\nEveryone wants to skip step one.\n{url}`,

  `Here is what nobody wants to hear.\n\nMost enterprise software exists because humans are slow at moving data between systems. When that bottleneck disappears, a lot of $50M ARR companies are going to have an existential quarter.\n{url}`,

  `The founders I respect most right now are building for problems that look boring.\n\nInsurance claims processing. Freight logistics. Compliance checks.\n\nNone of that trends on Twitter but all of it prints money when you get it right.\n{url}`,

  `The liability question is going to define the next wave of regulation.\n\nIf an agent sends a wrong invoice to a customer, who pays? The company, the vendor, or the person who set up the prompt?\n\nNobody has a good answer yet.\n{url}`,

  `We built the entire internet around the assumption that a human would be reading the page.\n\nThat assumption is breaking. Agents need APIs, not pretty UIs. Machine-readable data, not marketing copy.\n\nThe shift is structural.\n{url}`,

  `Real question that nobody seems to ask.\n\nIf your AI implementation needs a 30-page strategy document, is it really saving time? Or did you just move the complexity from one place to another?\n\nSimple wins. Always has.\n{url}`,

  `Spoke at a conference last month and asked the room who had an agent in production. Three hands out of two hundred.\n\nThen asked who had an agent in a slide deck. Every hand went up.\n\nThat gap tells you everything.\n{url}`,

  `The YC batch data from this year is telling.\n\nHalf the B2B companies are building what used to be a feature inside Salesforce or HubSpot. But they are building it agent-first, which changes everything about the architecture.\n{url}`,
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

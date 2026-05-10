#!/usr/bin/env node
/**
 * Bluesky Engagement Engine
 * - Searches for viral AI/tech posts via Bluesky search API
 * - Posts thoughtful replies with essay links
 * - Dedup log prevents double-commenting
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const HANDLE = process.env.BLUESKY_HANDLE!;
const APP_PASSWORD = process.env.BLUESKY_APP_PASSWORD!;
const LOG_FILE = path.resolve(__dirname, 'bluesky-comment-log.json');
const MAX_COMMENTS = 50;
const COOLDOWN_MS = 15000;
const PDS = 'https://bsky.social';

// ─── Essays ───
const ESSAYS: Record<string, string> = {
  stepwise: 'https://veda.ng/stepwise-ai',
  playbook: 'https://veda.ng/ai-implementation-playbook',
  saas: 'https://veda.ng/agents-eating-saas',
  state: 'https://veda.ng/agentic-state',
  textui: 'https://veda.ng/universal-text-ui',
  agenticweb: 'https://veda.ng/towards-the-agentic-web',
  commerce: 'https://veda.ng/agentic-commerce',
  postscarcity: 'https://veda.ng/post-scarcity-technology',
  yc: 'https://veda.ng/yc-landscape',
  postinterface: 'https://veda.ng/post-interface-internet',
};

// ─── Human comment templates ───
const THOUGHTS: string[] = [
  `Toyota never automated entire assembly lines at once. They automated the single most error-prone step, measured the delta, then moved to the next.

Every AI project should answer: which single step first, and what does the before/after look like?`,

  `The cost of intelligence is collapsing but the cost of judgment is not.

Knowing what to do with the output still requires someone who understands the business context. That is the actual moat right now.`,

  `Automation replaces a task. Augmentation changes how a person does it.

Most of what gets called AI automation is actually augmentation. The distinction matters because the ROI math is completely different.`,

  `When you automate data entry, you do not just save time. You eliminate the 48-hour lag between when information exists and when it reaches the decision maker.

That lag reduction is worth 10x the labor savings.`,

  `The teams shipping fastest are not the ones with the best engineers.

They are the ones where the domain expert and the engineer sit in the same room and iterate daily. The model is easy. Understanding the output is hard.`,

  `Phase 1: "Let's build a chatbot."
Phase 2: "The chatbot is not very good."
Phase 3: "Let's build a workflow that does the thing instead of talking about it."

Phase 3 is where the actual value shows up.`,

  `If your agent needs to pull from 4 different systems to complete one task, you do not have an AI problem.

You have an integration problem wearing an AI costume. Fix the plumbing first.`,

  `Buyers are not evaluating AI based on model quality anymore. They evaluate time-to-first-value.

If your product takes 6 months to deploy, the budget holder will have moved on by then.`,

  `A junior analyst costs $70K/year and processes 200 docs per day. A tuned pipeline does 200 per hour at $500/month.

But the pipeline does not catch the edge case that smells wrong. That is still worth $70K.`,

  `Five years ago companies competed on features. Then data. Now the ones pulling ahead are competing on workflow design.

Who best understands how work actually flows through their org? That team wins.`,

  `Most AI discourse focuses on capability.

The actual bottleneck in every deployment I have seen is trust calibration. How does the human know when to trust the output versus double-check it?

Get that wrong and adoption collapses.`,

  `Yes the marginal cost of running a model is low.

But the cost of building the pipeline, maintaining it, handling drift, and retraining when the world changes is not low at all.

Total cost of ownership matters. Not inference cost.`,

  `Goodhart's Law is playing out in AI right now.

When the metric is "AI initiatives launched," every team launches one. When it shifts to "revenue impact," most get quietly shelved.

We are between those two phases.`,

  `Before automating anything, ask: if this task disappeared entirely, would anyone notice within 24 hours?

If yes, automate carefully with oversight.
If no, maybe just stop doing it altogether.

The answer is "no" more often than you think.`,

  `Companies paying premium for "AI engineers" who are prompt engineers with Python skills.

Meanwhile the people who understand the business processes being automated are the lowest paid in the room.

The value chain is inverted.`,

  `The best AI products do not look like AI products.

They look like the existing workflow but faster and with fewer errors. The moment you make users think about the AI, you added cognitive load instead of removing it.`,

  `Companies with strong internal documentation adopt AI tools 3-4x faster.

Not because models are better but because there is actually something coherent to retrieve from. Documentation is the new competitive advantage.`,

  `Regulation will not kill AI adoption. It will create a moat for companies that can demonstrate auditability.

The ones treating compliance as a feature rather than a constraint will own their markets in 3 years.`,

  `In robotics it took 20 years to go from "can sort objects" to "can sort objects reliably."

In LLMs we went from "coherent paragraph" to "working code" in 18 months. The planning horizon for any strategy just got much shorter.`,

  `The median failure mode in production AI is not the model being wrong.

It is the input data being formatted differently than expected. Garbage in, garbage out has not changed in 50 years.`,
];

// ─── Topic detection ───
function detectTopic(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('saas') || t.includes('pricing') || t.includes('per-seat') || t.includes('subscription')) return 'saas';
  if (t.includes('government') || t.includes('public sector') || t.includes('estonia')) return 'state';
  if (t.includes('dashboard') || t.includes('interface') || t.includes('text field')) return 'textui';
  if (t.includes('commerce') || t.includes('shopping')) return 'commerce';
  if (t.includes('scarcity') || t.includes('marginal cost')) return 'postscarcity';
  if (t.includes('yc') || t.includes('y combinator')) return 'yc';
  if (t.includes('api') || t.includes('web') || t.includes('machine-readable')) return 'agenticweb';
  if (t.includes('playbook') || t.includes('implementation') || t.includes('deploy') || t.includes('production')) return 'playbook';
  return 'stepwise';
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

  console.log(`🦋 Bluesky engagement engine`);
  console.log(`   Handle: ${HANDLE}\n`);

  await login();
  console.log(`✅ Logged in as ${session!.did}\n`);

  const log = loadLog();
  const commentedUris = new Set(log.map(l => l.uri));
  const usedThoughts = new Set<number>();

  // Search for viral posts
  const QUERIES = ['AI agents', 'agentic AI', 'SaaS AI', 'enterprise AI', 'LLM production', 'AI startup', 'future of work AI', 'AI automation'];
  
  const candidates: any[] = [];

  for (const q of QUERIES) {
    console.log(`🔍 Searching: "${q}"`);
    const posts = await searchPosts(q);
    
    for (const p of posts) {
      if (commentedUris.has(p.uri)) continue;
      if (p.author.handle === HANDLE) continue; // skip own posts
      
      const likes = p.likeCount || 0;
      const replies = p.replyCount || 0;
      
      if (likes >= 5 || replies >= 3) {
        candidates.push(p);
        commentedUris.add(p.uri); // prevent dupes within this run
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
    const topic = detectTopic(postText);
    const essayUrl = ESSAYS[topic] || ESSAYS.stepwise;

    let idx: number;
    do { idx = Math.floor(Math.random() * THOUGHTS.length); } while (usedThoughts.has(idx) && usedThoughts.size < THOUGHTS.length);
    usedThoughts.add(idx);
    const comment = THOUGHTS[idx];

    console.log(`[${i + 1}/${targets.length}] @${post.author.handle} (❤️${post.likeCount || 0})`);
    console.log(`   "${postText.substring(0, 60)}..."`);

    try {
      const result = await reply(post, comment);
      console.log(`   ✅ Replied`);
      log.push({ uri: post.uri, author: post.author.handle, commentCid: result.cid, postedAt: new Date().toISOString() });
      saveLog(log);
      posted++;
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

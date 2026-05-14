#!/usr/bin/env node
/**
 * Post 10 thoughtful comments on viral LinkedIn posts.
 * Uses v2 endpoint (not REST) — works with w_member_social scope.
 * Resolves activity IDs to ugcPost URNs automatically.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const TOKEN = process.env.LINKEDIN_ACCESS_TOKEN!;
const PERSON_URN = process.env.LINKEDIN_PERSON_URN!;

interface CommentTarget {
  activityId: string;
  author: string;
  topic: string;
  comment: string;
}

const TARGETS: CommentTarget[] = [
  {
    activityId: '7458489647980150784',
    author: 'Liam Darmody',
    topic: 'Managing 9 AI agents',
    comment: `Most teams I talk to are running into the same thing. The agents that work are the ones given one narrow job with clear inputs. The ones that fail try to do too much at once. Wrote about this exact pattern and why starting small matters more than people think. veda.ng/stepwise-ai`,
  },
  {
    activityId: '7457435944548364288',
    author: 'Steven Joshua Taylor',
    topic: 'Building AI agents for business',
    comment: `This is the part nobody talks about publicly. Running a business function with an agent is not a tech problem, it is an ops problem. You have to rethink what the workflow even is before you automate it. We mapped this out step by step here veda.ng/ai-implementation-playbook`,
  },
  {
    activityId: '7457616381404995584',
    author: 'Parth Kapadia',
    topic: 'Production AI agent workflows',
    comment: `The gap between demo agents and production agents is still huge. Most fail not because the model is bad but because the orchestration layer has no fallback logic. Getting the first use case right matters way more than trying to build a general purpose system. veda.ng/stepwise-ai`,
  },
  {
    activityId: '7457245780190601216',
    author: 'Stephanie Barnett',
    topic: 'Identity and governance in agentic enterprise',
    comment: `This is going to be one of the defining questions of the next few years. When agents can act on behalf of a government or a company, the identity layer becomes the most important infrastructure. Some countries are already ahead on this. veda.ng/agentic-state`,
  },
  {
    activityId: '7442103902570881024',
    author: 'Steven Yurisich',
    topic: '2026 pivotal year for enterprise AI',
    comment: `The accountability point is underrated. Most enterprise AI projects still get evaluated on whether they launched, not whether they delivered measurable value. That is starting to change and the companies figuring it out are pulling ahead fast. veda.ng/stepwise-ai`,
  },
  {
    activityId: '7411098122866745344',
    author: 'Josh Bersin',
    topic: '2026 the year of enterprise AI',
    comment: `Interesting framing. What I have seen is that the companies making real progress are not the ones with the biggest AI budgets. They are the ones that picked one painful workflow and made it disappear. The playbook for that is surprisingly simple. veda.ng/ai-implementation-playbook`,
  },
  {
    activityId: '7457285317642076161',
    author: 'Pavan Belagatti',
    topic: 'Agentic AI architecture',
    comment: `Good breakdown. One thing worth adding is that the interface layer matters more than most people realize. When agents can handle the work, the traditional dashboard becomes unnecessary. The text field becomes the new control surface. veda.ng/universal-text-ui`,
  },
  {
    activityId: '7458494968199041024',
    author: 'Sutherland Global',
    topic: 'Road to the agentic enterprise',
    comment: `The per-seat pricing model that most enterprise software runs on was designed for humans. Agents do not sit in seats and they can run 24 hours a day. That one structural fact is going to change the economics of every SaaS company out there. veda.ng/agents-eating-saas`,
  },
  {
    activityId: '7457431782536372225',
    author: 'Alexander Whedon',
    topic: 'SubQ breakthrough in LLMs',
    comment: `The model improvements are impressive but the real bottleneck is not intelligence anymore. It is getting agents to reliably interact with the messy real world of APIs, permissions, and legacy systems. The internet itself needs to become agent-friendly. veda.ng/towards-the-agentic-web`,
  },
  {
    activityId: '7458168801424199680',
    author: 'Ankur Bhatt',
    topic: 'AI agents impressive but fragile',
    comment: `This is the honest take that most people skip over. The agents that look magical in demos often break on edge cases that a human would handle without thinking. Getting them robust enough for production is an engineering discipline, not a prompt trick. veda.ng/ai-implementation-playbook`,
  },
];

// Resolve activity ID to ugcPost URN by trying the comment and parsing error
async function resolveUgcPostUrn(activityId: string): Promise<string | null> {
  const activityUrn = `urn:li:activity:${activityId}`;
  const url = `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(activityUrn)}/comments`;
  
  // Try posting with activity URN — LinkedIn returns the correct ugcPost URN in the error
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
      message: { text: 'resolving' },
    }),
  });

  if (res.status === 201) {
    // It worked with activity URN directly — unlikely but handle it
    const data = await res.json();
    // Delete the accidental comment
    try {
      await fetch(`${url}/${data.id}?actor=${encodeURIComponent(PERSON_URN)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${TOKEN}`, 'X-Restli-Protocol-Version': '2.0.0' },
      });
    } catch {}
    return activityUrn;
  }

  const body = await res.text();
  // Extract ugcPost URN from error: "actual threadUrn: urn:li:ugcPost:XXXXX"
  const match = body.match(/urn:li:ugcPost:\d+/);
  if (match) return match[0];

  // Try share URN format
  const shareMatch = body.match(/urn:li:share:\d+/);
  if (shareMatch) return shareMatch[0];

  return null;
}

async function postComment(ugcPostUrn: string, comment: string): Promise<{ success: boolean; commentId?: string; error?: string }> {
  const url = `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(ugcPostUrn)}/comments`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      actor: PERSON_URN,
      object: ugcPostUrn,
      message: { text: comment },
    }),
  });

  if (res.status === 201) {
    const data = await res.json();
    return { success: true, commentId: data.id };
  } else {
    const err = await res.text();
    return { success: false, error: `${res.status}: ${err.substring(0, 150)}` };
  }
}

async function main() {
  console.log(`👤 ${PERSON_URN}`);
  console.log(`📝 Posting ${TARGETS.length} comments...\n`);

  let posted = 0;

  for (let i = 0; i < TARGETS.length; i++) {
    const t = TARGETS[i];
    console.log(`[${i + 1}/${TARGETS.length}] ${t.author} — ${t.topic}`);

    // Step 1: Resolve URN
    const ugcUrn = await resolveUgcPostUrn(t.activityId);
    if (!ugcUrn) {
      console.log(`   ❌ Could not resolve URN\n`);
      continue;
    }
    console.log(`   URN: ${ugcUrn}`);

    // Step 2: Post comment
    const result = await postComment(ugcUrn, t.comment);
    if (result.success) {
      console.log(`   ✅ Posted! (${result.commentId})`);
      posted++;
    } else {
      console.log(`   ❌ ${result.error}`);
    }

    if (i < TARGETS.length - 1) {
      console.log(`   ⏳ 30s...\n`);
      await new Promise(r => setTimeout(r, 30000));
    }
  }

  console.log(`\n📊 ${posted}/${TARGETS.length} comments posted`);
}

main();

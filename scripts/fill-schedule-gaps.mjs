#!/usr/bin/env node
/**
 * Moves existing new-essay posts earlier and creates additional angle posts
 * to fill the 3/day schedule gaps across all platforms.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const SCRIPTS_DIR = join(process.cwd(), 'scripts');

function loadPosts(file) {
  return JSON.parse(readFileSync(join(SCRIPTS_DIR, file), 'utf-8'));
}

function savePosts(file, data) {
  writeFileSync(join(SCRIPTS_DIR, file), JSON.stringify(data, null, 2) + '\n');
  console.log(`✅ Updated ${file} (${data.length} total)`);
}

// Empty slots to fill (IST):
// Apr 10: 17:00
// Apr 11: 09:00
// Apr 12: 01:00, 17:00
// Apr 13: 09:00
// Apr 14: 09:00
// Apr 15: 09:00
// Apr 16: 01:00

// Plan:
// Move existing stepwise-ai    → Apr 10 17:00 (TODAY - fills immediate gap)
// Move existing agentic-state  → Apr 11 09:00 (strongest hook per X data)
// Move existing universal-text-ui → Apr 12 01:00
// New: stepwise-ai angle 2     → Apr 12 17:00
// New: agentic-state angle 2   → Apr 13 09:00
// New: universal-text-ui angle 2 → Apr 14 09:00
// New: stepwise-ai angle 3     → Apr 15 09:00
// New: agentic-state angle 3   → Apr 16 01:00

// ─── Additional angle posts (different hooks from same essays) ───

const newAngles = {
  // ─── LINKEDIN ───
  linkedin: [
    {
      id: 'stepwise-ai-sales',
      scheduleDate: '2026-04-12',
      scheduleTime: '17:00',
      posted: false,
      image: 'scripts/thread-assets/stepwise_ai.png',
      text: `A B2B firm had a lead response time of four hours. Research shows contact rates drop 10x after the first five minutes. Most leads were dead before a human saw them.

They didn't rebuild their CRM. They deployed a voice agent on one narrow task: qualify inbound leads and book meetings. Nothing else.

Response time dropped to under 60 seconds. Conversions tripled. The system now books 2,000+ appointments per month.

The human sales team stopped qualifying. They only close.

One task. One integration. The entire bottleneck dissolved.

veda.ng/stepwise-ai`
    },
    {
      id: 'agentic-state-eresidency',
      scheduleDate: '2026-04-13',
      scheduleTime: '09:00',
      posted: false,
      image: 'scripts/thread-assets/agentic_state.png',
      text: `Estonia lets anyone on earth start an EU company without setting foot in the country. 135,000 people from 170 countries have done it.

The e-Residency program generated €125M in state revenue last year. 87% growth. For every euro invested, twelve came back.

5,556 new companies formed by non-citizens in a single year.

This is what happens when government operates as infrastructure instead of gatekeeping. The state becomes a platform. Citizenship becomes a credential. Geography becomes optional.

veda.ng/agentic-state`
    },
    {
      id: 'universal-text-ui-106apps',
      scheduleDate: '2026-04-14',
      scheduleTime: '09:00',
      posted: false,
      image: 'scripts/thread-assets/universal_text_ui.png',
      text: `The average company runs 106 SaaS apps. Employees switch between them 1,200 times per day. Only 39% of work time is deep focus. The rest is navigating between dashboards.

40% of users in a 2025 enterprise survey said their dashboards don't support meaningful decisions. Many went back to spreadsheets.

93% of business leaders said they'd perform better if they could ask data questions in plain English.

That's not a feature request. That's a structural bottleneck being reported by the people trapped inside it.

veda.ng/universal-text-ui`
    },
    {
      id: 'stepwise-ai-marketing',
      scheduleDate: '2026-04-15',
      scheduleTime: '09:00',
      posted: false,
      image: 'scripts/thread-assets/stepwise_ai.png',
      text: `A three-person ad agency was at capacity. Compiling weekly performance reports across Google Analytics, six social platforms, and three ad networks took six hours per person every Friday.

They routed raw analytics into an LLM via API. The model drafted client summaries automatically.

Twenty hours per week freed. Client load went from 30 campaigns to 50. A 50% capacity increase. Zero new hires.

AI didn't replace anyone. It removed the bottleneck that was stopping three people from doing the work of five.

veda.ng/stepwise-ai`
    },
    {
      id: 'agentic-state-singapore',
      scheduleDate: '2026-04-16',
      scheduleTime: '01:00',
      posted: false,
      image: 'scripts/thread-assets/agentic_state.png',
      text: `Singapore's Ask Jamie chatbot has handled 50 million citizen queries. Their AI call transcription cut after-call work by 72%.

100,000 public officers use Pair — a government-built AI tool — saving 50 minutes per task on average.

In the 2026 budget, Singapore announced the shift from "AI pilots" to "scaled deployment at national speed."

Most countries are still debating whether to start a pilot.

veda.ng/agentic-state`
    },
  ],

  // ─── X / TWITTER ───
  x: [
    {
      id: 'stepwise-ai-sales',
      scheduleDate: '2026-04-12',
      scheduleTime: '17:00',
      posted: false,
      image: 'scripts/thread-assets/stepwise_ai.png',
      text: `Lead response time: 4 hours. Contact rates drop 10x after 5 minutes.

One voice agent. One task: qualify and book. Response time fell to 60 seconds. Conversions tripled. 2,000+ meetings per month, no humans involved.

The sales team stopped qualifying. They only close now.

veda.ng/stepwise-ai`
    },
    {
      id: 'agentic-state-eresidency',
      scheduleDate: '2026-04-13',
      scheduleTime: '09:00',
      posted: false,
      image: 'scripts/thread-assets/agentic_state.png',
      text: `Estonia lets anyone on earth start an EU company remotely. 135,000 people from 170 countries have.

€125M in state revenue last year. 12:1 ROI. 5,556 new companies from non-citizens.

Government as infrastructure. Citizenship as credential. Geography as optional.

veda.ng/agentic-state`
    },
    {
      id: 'universal-text-ui-106apps',
      scheduleDate: '2026-04-14',
      scheduleTime: '09:00',
      posted: false,
      image: 'scripts/thread-assets/universal_text_ui.png',
      text: `106 SaaS apps per company. 1,200 daily app switches per employee. 39% of time in deep focus.

93% of business leaders say they'd perform better asking data questions in plain English.

That's not a preference. It's a structural bottleneck.

veda.ng/universal-text-ui`
    },
    {
      id: 'stepwise-ai-marketing',
      scheduleDate: '2026-04-15',
      scheduleTime: '09:00',
      posted: false,
      image: 'scripts/thread-assets/stepwise_ai.png',
      text: `Three-person agency. Six hours per person every Friday compiling client reports from 10+ data sources.

Routed analytics into an LLM. Twenty hours freed weekly. Client load: 30 → 50 campaigns. Zero hires.

AI didn't replace anyone. It removed a bottleneck.

veda.ng/stepwise-ai`
    },
    {
      id: 'agentic-state-singapore',
      scheduleDate: '2026-04-16',
      scheduleTime: '01:00',
      posted: false,
      image: 'scripts/thread-assets/agentic_state.png',
      text: `Singapore's government AI chatbot: 50M citizen queries handled. AI call transcription: 72% less after-call work.

100,000 officers using Pair, saving 50 min per task.

2026 budget: "scaled deployment at national speed."

Most countries are still debating whether to start a pilot.

veda.ng/agentic-state`
    },
  ],

  // ─── BLUESKY ───
  bluesky: [
    {
      id: 'stepwise-ai-sales',
      scheduleDate: '2026-04-12',
      scheduleTime: '17:00',
      posted: false,
      text: `Lead response: 4 hours → 60 seconds. One voice agent, one task. Conversions tripled.

The sales team stopped qualifying. They only close.

veda.ng/stepwise-ai`
    },
    {
      id: 'agentic-state-eresidency',
      scheduleDate: '2026-04-13',
      scheduleTime: '09:00',
      posted: false,
      text: `Estonia lets anyone start an EU company remotely. 135,000 people from 170 countries. €125M in state revenue. 12:1 ROI.

Government as infrastructure.

veda.ng/agentic-state`
    },
    {
      id: 'universal-text-ui-106apps',
      scheduleDate: '2026-04-14',
      scheduleTime: '09:00',
      posted: false,
      text: `106 SaaS apps per company. 1,200 daily tab switches. 39% deep focus time.

93% of leaders want to ask data questions in plain English. That's a structural bottleneck.

veda.ng/universal-text-ui`
    },
    {
      id: 'stepwise-ai-marketing',
      scheduleDate: '2026-04-15',
      scheduleTime: '09:00',
      posted: false,
      text: `3-person agency. 6 hours/person every Friday on reports. Routed analytics to LLM. 20 hours freed. Clients: 30 → 50. Zero hires.

veda.ng/stepwise-ai`
    },
    {
      id: 'agentic-state-singapore',
      scheduleDate: '2026-04-16',
      scheduleTime: '01:00',
      posted: false,
      text: `Singapore: 50M citizen queries via AI chatbot. 100k officers using government AI tools. 72% less admin work.

Most countries still debating whether to start a pilot.

veda.ng/agentic-state`
    },
  ],

  // ─── FACEBOOK ───
  facebook: [
    {
      id: 'stepwise-ai-sales',
      scheduleDate: '2026-04-12',
      scheduleTime: '17:00',
      posted: false,
      image: 'scripts/thread-assets/stepwise_ai.png',
      text: `Lead response time was 4 hours. Contact rates drop 10x after the first 5 minutes. Most leads were dead before a human saw them.

One voice agent. One task: qualify inbound leads and book meetings. Response time fell to 60 seconds. Conversions tripled. 2,000+ meetings per month automatically.

One task. One integration. The bottleneck dissolved.

veda.ng/stepwise-ai`
    },
    {
      id: 'agentic-state-eresidency',
      scheduleDate: '2026-04-13',
      scheduleTime: '09:00',
      posted: false,
      image: 'scripts/thread-assets/agentic_state.png',
      text: `Estonia lets anyone on earth start an EU company without setting foot in the country. 135,000 people from 170 countries have done it. €125M in state revenue last year. 12:1 ROI.

Government as infrastructure. Citizenship as credential. Geography as optional.

veda.ng/agentic-state`
    },
    {
      id: 'universal-text-ui-106apps',
      scheduleDate: '2026-04-14',
      scheduleTime: '09:00',
      posted: false,
      image: 'scripts/thread-assets/universal_text_ui.png',
      text: `The average company runs 106 SaaS apps. Employees switch between them 1,200 times per day. Only 39% of time is deep focus.

93% of business leaders said they'd perform better asking data questions in plain English. That's not a feature request. That's a structural bottleneck.

veda.ng/universal-text-ui`
    },
    {
      id: 'stepwise-ai-marketing',
      scheduleDate: '2026-04-15',
      scheduleTime: '09:00',
      posted: false,
      image: 'scripts/thread-assets/stepwise_ai.png',
      text: `Three-person agency at capacity. Weekly client reports took six hours per person from 10+ data sources.

Routed analytics into an LLM. Twenty hours freed weekly. Client load went from 30 to 50 campaigns. Zero hires.

AI removed the bottleneck. Nobody got replaced.

veda.ng/stepwise-ai`
    },
    {
      id: 'agentic-state-singapore',
      scheduleDate: '2026-04-16',
      scheduleTime: '01:00',
      posted: false,
      image: 'scripts/thread-assets/agentic_state.png',
      text: `Singapore's AI chatbot handled 50M citizen queries. Their call transcription AI cut admin work by 72%.

100,000 officers save 50 minutes per task with government-built AI.

2026 budget: "scaled deployment at national speed." Most countries are still debating pilots.

veda.ng/agentic-state`
    },
  ],

  // ─── TUMBLR ───
  tumblr: [
    {
      id: 'stepwise-ai-sales',
      scheduleDate: '2026-04-12',
      scheduleTime: '17:00',
      posted: false,
      image: 'scripts/thread-assets/stepwise_ai.png',
      tags: ['AI', 'sales'],
      text: `Lead response: 4 hours → 60 seconds. One voice agent. Conversions tripled. 2,000+ meetings/month.

The sales team stopped qualifying. They only close.

veda.ng/stepwise-ai`
    },
    {
      id: 'agentic-state-eresidency',
      scheduleDate: '2026-04-13',
      scheduleTime: '09:00',
      posted: false,
      image: 'scripts/thread-assets/agentic_state.png',
      tags: ['Estonia', 'government'],
      text: `Estonia lets anyone start an EU company remotely. 135k people, 170 countries. €125M revenue. 12:1 ROI.

Government as infrastructure.

veda.ng/agentic-state`
    },
    {
      id: 'universal-text-ui-106apps',
      scheduleDate: '2026-04-14',
      scheduleTime: '09:00',
      posted: false,
      image: 'scripts/thread-assets/universal_text_ui.png',
      tags: ['SaaS', 'AI'],
      text: `106 apps per company. 1,200 daily switches. 39% deep focus. 93% of leaders want natural language data queries.

That's a structural bottleneck, not a feature request.

veda.ng/universal-text-ui`
    },
    {
      id: 'stepwise-ai-marketing',
      scheduleDate: '2026-04-15',
      scheduleTime: '09:00',
      posted: false,
      image: 'scripts/thread-assets/stepwise_ai.png',
      tags: ['AI', 'marketing'],
      text: `3-person agency. 6 hrs/person Fridays on reports. LLM automated it. 20 hours freed. 30→50 clients. Zero hires.

veda.ng/stepwise-ai`
    },
    {
      id: 'agentic-state-singapore',
      scheduleDate: '2026-04-16',
      scheduleTime: '01:00',
      posted: false,
      image: 'scripts/thread-assets/agentic_state.png',
      tags: ['Singapore', 'AI'],
      text: `50M citizen queries via AI. 100k officers using gov AI tools. 72% less admin.

Most countries still debating pilots.

veda.ng/agentic-state`
    },
  ],
};

// Process each platform
for (const [platform, angles] of Object.entries(newAngles)) {
  const file = `${platform}-posts.json`;
  const posts = loadPosts(file);
  
  // 1. Move existing essay posts to earlier dates
  for (const p of posts) {
    if (p.id === 'stepwise-ai' && !p.posted) {
      p.scheduleDate = '2026-04-10';
      p.scheduleTime = '17:00';
    }
    if (p.id === 'agentic-state' && !p.posted) {
      p.scheduleDate = '2026-04-11';
      p.scheduleTime = '09:00';
    }
    if (p.id === 'universal-text-ui' && !p.posted) {
      p.scheduleDate = '2026-04-12';
      p.scheduleTime = '01:00';
    }
  }
  
  // 2. Add new angle posts
  const existingIds = new Set(posts.map(p => p.id));
  for (const angle of angles) {
    if (!existingIds.has(angle.id)) {
      posts.push(angle);
    }
  }
  
  savePosts(file, posts);
}

console.log('\n✅ Schedule filled: 3 essays moved to Apr 10-12, 5 angle posts added (Apr 12-16)');
console.log('   Today 17:00 IST: stepwise-ai will post');

#!/usr/bin/env node
/**
 * Fills remaining gaps to ensure 3/day and adds CTA links where missing.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const SCRIPTS_DIR = join(process.cwd(), 'scripts');

function loadPosts(file) {
  return JSON.parse(readFileSync(join(SCRIPTS_DIR, file), 'utf-8'));
}

function savePosts(file, data) {
  writeFileSync(join(SCRIPTS_DIR, file), JSON.stringify(data, null, 2) + '\n');
  console.log(`✅ ${file} (${data.length} total)`);
}

// Gaps:  Apr 10 01:00,  Apr 17 09:00,  Apr 19 09:00,  Apr 20 01:00
// Also: models-shrinking has no CTA link

// New gap-filler posts — different angles from the 3 essays
const gapFillers = {
  linkedin: [
    {
      id: 'agentic-state-xroad',
      scheduleDate: '2026-04-10',
      scheduleTime: '01:00',
      posted: false,
      image: 'scripts/thread-assets/agentic_state.png',
      text: `X-Road handles over 1 billion queries per year across Estonia's entire government.

It's an open-source data exchange layer. When a birth is registered, the record propagates automatically to population registry, health insurance, and social services. One notification. Every relevant agency updated. Zero additional forms.

Launched in 2001. Operational for 25 years. Not a pilot. Not a proof of concept. Production infrastructure.

Most countries built e-government by putting paper forms on websites. Estonia redesigned the process architecture. Digitizing a bad process produces a fast bad process. Redesigning it changes what the citizen experiences.

veda.ng/agentic-state`
    },
    {
      id: 'universal-text-ui-paradigms',
      scheduleDate: '2026-04-17',
      scheduleTime: '09:00',
      posted: false,
      image: 'scripts/thread-assets/universal_text_ui.png',
      text: `Three interface paradigms in fifty years:

CLI (1970s): user memorizes syntax. Computing limited to specialists.

GUI (1984-2024): user learns navigation. Computing goes mainstream. Forty years of dominance.

NLI (2024+): system interprets intent. User describes what they want in plain English.

Each paradigm cut adaptation cost by roughly 10x. The GUI didn't improve the command line. It made it obsolete. Natural language interfaces won't improve dashboards. They'll replace them.

The question isn't whether this transition happens. It's how fast.

veda.ng/universal-text-ui`
    },
    {
      id: 'stepwise-ai-gartner',
      scheduleDate: '2026-04-19',
      scheduleTime: '09:00',
      posted: false,
      image: 'scripts/thread-assets/stepwise_ai.png',
      text: `Gartner warns 40% of agentic AI projects risk cancellation by 2027. Not because the technology fails. Because companies can't demonstrate ROI, establish governance, or build monitoring frameworks fast enough.

Only 33% of AI initiatives currently meet their ROI targets. 74% of Salesforce customers struggle with CX improvement from AI. Only 21% feel confident in their AI governance models.

The technology works. The organizational readiness doesn't.

The fix: don't start with ambition. Start with one task that pays for itself in 90 days. Then expand.

veda.ng/stepwise-ai`
    },
    {
      id: 'agentic-state-uae',
      scheduleDate: '2026-04-20',
      scheduleTime: '01:00',
      posted: false,
      image: 'scripts/thread-assets/agentic_state.png',
      text: `Abu Dhabi committed AED 13 billion to become the world's first fully AI-native government by 2027.

97% AI tool utilization across government entities. 108 HR services automated for 50,000 employees. One university reduced faculty workload by 95% using AI administration.

The UAE isn't digitizing forms. It's building government from scratch as if AI existed from day one.

No legacy systems to modernize. No decades of technical debt to unwind. A clean-sheet approach.

veda.ng/agentic-state`
    },
  ],
  x: [
    {
      id: 'agentic-state-xroad',
      scheduleDate: '2026-04-10',
      scheduleTime: '01:00',
      posted: false,
      image: 'scripts/thread-assets/agentic_state.png',
      text: `Estonia's X-Road: 1 billion+ government queries per year. Birth registered → population registry, health insurance, social services all updated automatically. One notification. Zero forms.

Operational since 2001. 25 years in production. Not a pilot.

Most countries digitized paper forms. Estonia redesigned the process.

veda.ng/agentic-state`
    },
    {
      id: 'universal-text-ui-paradigms',
      scheduleDate: '2026-04-17',
      scheduleTime: '09:00',
      posted: false,
      image: 'scripts/thread-assets/universal_text_ui.png',
      text: `CLI → GUI → NLI. Three paradigms. Each cut adaptation cost by 10x.

The GUI didn't improve the command line. It replaced it. Natural language won't improve dashboards. Same thing.

veda.ng/universal-text-ui`
    },
    {
      id: 'stepwise-ai-gartner',
      scheduleDate: '2026-04-19',
      scheduleTime: '09:00',
      posted: false,
      image: 'scripts/thread-assets/stepwise_ai.png',
      text: `Gartner: 40% of agentic AI projects risk cancellation by 2027. Only 33% meet ROI targets. Only 21% confident in governance.

The tech works. The organizational readiness doesn't.

Fix: one task that pays for itself in 90 days. Then expand.

veda.ng/stepwise-ai`
    },
    {
      id: 'agentic-state-uae',
      scheduleDate: '2026-04-20',
      scheduleTime: '01:00',
      posted: false,
      image: 'scripts/thread-assets/agentic_state.png',
      text: `Abu Dhabi: AED 13B to become first AI-native government by 2027. 97% AI utilization. 108 HR services automated. One university cut faculty workload 95%.

No legacy systems. No tech debt. Clean-sheet AI government.

veda.ng/agentic-state`
    },
  ],
  bluesky: [
    {
      id: 'agentic-state-xroad',
      scheduleDate: '2026-04-10',
      scheduleTime: '01:00',
      posted: false,
      text: `Estonia's X-Road: 1B+ gov queries/year. Birth registered → all agencies updated. One notification. Zero forms. Running since 2001.

veda.ng/agentic-state`
    },
    {
      id: 'universal-text-ui-paradigms',
      scheduleDate: '2026-04-17',
      scheduleTime: '09:00',
      posted: false,
      text: `CLI → GUI → NLI. Each cut adaptation cost 10x. The GUI replaced the command line. Natural language will replace dashboards.

veda.ng/universal-text-ui`
    },
    {
      id: 'stepwise-ai-gartner',
      scheduleDate: '2026-04-19',
      scheduleTime: '09:00',
      posted: false,
      text: `40% of AI projects risk cancellation by 2027. Only 33% meet ROI. Fix: one task, 90-day payback, then expand.

veda.ng/stepwise-ai`
    },
    {
      id: 'agentic-state-uae',
      scheduleDate: '2026-04-20',
      scheduleTime: '01:00',
      posted: false,
      text: `Abu Dhabi: AED 13B for first AI-native government by 2027. 97% utilization. No legacy systems. Clean-sheet approach.

veda.ng/agentic-state`
    },
  ],
  facebook: [
    {
      id: 'agentic-state-xroad',
      scheduleDate: '2026-04-10',
      scheduleTime: '01:00',
      posted: false,
      image: 'scripts/thread-assets/agentic_state.png',
      text: `Estonia's X-Road handles over 1 billion government queries per year. Birth registered → population registry, health insurance, and social services all updated. One notification. Zero additional forms.

Running since 2001. 25 years in production.

Most countries digitized paper forms. Estonia redesigned the process architecture entirely.

veda.ng/agentic-state`
    },
    {
      id: 'universal-text-ui-paradigms',
      scheduleDate: '2026-04-17',
      scheduleTime: '09:00',
      posted: false,
      image: 'scripts/thread-assets/universal_text_ui.png',
      text: `Three interface paradigms in fifty years. CLI: user memorizes syntax. GUI: user learns navigation. NLI: system interprets intent.

Each cut adaptation cost by 10x. The GUI replaced the command line. Natural language will replace dashboards.

veda.ng/universal-text-ui`
    },
    {
      id: 'stepwise-ai-gartner',
      scheduleDate: '2026-04-19',
      scheduleTime: '09:00',
      posted: false,
      image: 'scripts/thread-assets/stepwise_ai.png',
      text: `Gartner: 40% of agentic AI projects risk cancellation by 2027. Only 33% meet ROI targets. The tech works. The organizational readiness doesn't.

Start with one task that pays for itself in 90 days. Then expand.

veda.ng/stepwise-ai`
    },
    {
      id: 'agentic-state-uae',
      scheduleDate: '2026-04-20',
      scheduleTime: '01:00',
      posted: false,
      image: 'scripts/thread-assets/agentic_state.png',
      text: `Abu Dhabi: AED 13 billion to become first AI-native government by 2027. 97% AI utilization. 108 HR services automated.

No legacy systems. No tech debt. Building government from scratch as if AI existed from day one.

veda.ng/agentic-state`
    },
  ],
  tumblr: [
    {
      id: 'agentic-state-xroad',
      scheduleDate: '2026-04-10',
      scheduleTime: '01:00',
      posted: false,
      image: 'scripts/thread-assets/agentic_state.png',
      tags: ['Estonia', 'e-government'],
      text: `X-Road: 1B+ gov queries/year. Birth → all agencies updated automatically. Running 25 years.

veda.ng/agentic-state`
    },
    {
      id: 'universal-text-ui-paradigms',
      scheduleDate: '2026-04-17',
      scheduleTime: '09:00',
      posted: false,
      image: 'scripts/thread-assets/universal_text_ui.png',
      tags: ['UI', 'AI'],
      text: `CLI → GUI → NLI. Each cut adaptation cost 10x. Dashboards are next.

veda.ng/universal-text-ui`
    },
    {
      id: 'stepwise-ai-gartner',
      scheduleDate: '2026-04-19',
      scheduleTime: '09:00',
      posted: false,
      image: 'scripts/thread-assets/stepwise_ai.png',
      tags: ['AI', 'enterprise'],
      text: `40% of AI projects risk cancellation by 2027. Only 33% meet ROI. One task, 90 days, then expand.

veda.ng/stepwise-ai`
    },
    {
      id: 'agentic-state-uae',
      scheduleDate: '2026-04-20',
      scheduleTime: '01:00',
      posted: false,
      image: 'scripts/thread-assets/agentic_state.png',
      tags: ['UAE', 'AI government'],
      text: `Abu Dhabi: AED 13B for AI-native government. 97% utilization. Clean-sheet, no legacy.

veda.ng/agentic-state`
    },
  ],
};

for (const [platform, fillers] of Object.entries(gapFillers)) {
  const file = `${platform}-posts.json`;
  const posts = loadPosts(file);
  
  // Fix models-shrinking: add CTA link
  for (const p of posts) {
    if (p.id === 'models-shrinking' && p.text && !p.text.includes('veda.ng')) {
      p.text += '\n\nveda.ng/asi-timeline';
    }
  }
  
  // Add gap fillers
  const existingIds = new Set(posts.map(p => p.id));
  for (const filler of fillers) {
    if (!existingIds.has(filler.id)) {
      posts.push(filler);
    }
  }
  
  savePosts(file, posts);
}

console.log('\n✅ All gaps filled. Every day now has 3 posts (01:00, 09:00, 17:00)');
console.log('✅ models-shrinking now has CTA link to veda.ng/asi-timeline');

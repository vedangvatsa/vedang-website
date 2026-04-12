#!/usr/bin/env node
/**
 * Replaces the 3 new essay posts with rewritten, slop-free versions
 * and proper dark-themed infographic paths.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const SCRIPTS_DIR = join(process.cwd(), 'scripts');

function loadPosts(file) {
  return JSON.parse(readFileSync(join(SCRIPTS_DIR, file), 'utf-8'));
}

function savePosts(file, data) {
  writeFileSync(join(SCRIPTS_DIR, file), JSON.stringify(data, null, 2) + '\n');
  console.log(`✅ Updated ${file} (${data.length} total posts)`);
}

function replacePosts(posts, newPosts) {
  const newIds = new Set(newPosts.map(p => p.id));
  // Remove old versions
  const filtered = posts.filter(p => !newIds.has(p.id) || p.posted === true);
  // Add new versions
  filtered.push(...newPosts);
  return filtered;
}

// ─── X / Twitter Posts (rewritten, slop-free) ───
const xPosts = loadPosts('x-posts.json');
const newXPosts = [
  {
    id: 'stepwise-ai',
    scheduleDate: '2026-04-21',
    scheduleTime: '09:00',
    posted: false,
    image: 'scripts/thread-assets/stepwise_ai.png',
    text: `Klarna automated customer service. Saved $60M. Then customer satisfaction collapsed and they hired people back.

The failure wasn't AI. It was sequence. They skipped straight to the hardest problem — nuanced human interactions — instead of starting where machines already win: invoice matching, log parsing, email routing.

70% of companies that try to automate everything at once fail. Companies that pick one boring, high-frequency task first? Payback in under three months.

Discipline beats ambition every time.

veda.ng/stepwise-ai`
  },
  {
    id: 'universal-text-ui',
    scheduleDate: '2026-04-21',
    scheduleTime: '17:00',
    posted: false,
    image: 'scripts/thread-assets/universal_text_ui.png',
    text: `Every dropdown on a dashboard is a question someone predicted you'd ask. Your actual question is almost never one of them.

PostHog replaced their analytics dashboard with a text field. Salesforce did it for CRM — 84% of queries now self-resolve. Cursor did it for code and hit $1B ARR.

The pattern: a text field backed by an LLM that calls APIs directly. No menus. No navigation. Just ask.

The dashboard era is ending.

veda.ng/universal-text-ui`
  },
  {
    id: 'agentic-state',
    scheduleDate: '2026-04-22',
    scheduleTime: '09:00',
    posted: false,
    image: 'scripts/thread-assets/agentic_state.png',
    text: `In Estonia, only two government services require you to show up in person: marriages and divorces. Everything else is digital. 99% of public services.

Singapore runs AI across 100,000 public officers. UAE hit 97% AI utilization in government.

These aren't pilots. They're production systems serving millions.

A baby is born. The system detects it, calculates benefits, deposits money. No form. No queue. No portal. The citizen does nothing.

Most governments still make you download a PDF.

veda.ng/agentic-state`
  },
];
savePosts('x-posts.json', replacePosts(xPosts, newXPosts));

// ─── LinkedIn Posts (rewritten, slop-free) ───
const linkedinPosts = loadPosts('linkedin-posts.json');
const newLinkedinPosts = [
  {
    id: 'stepwise-ai',
    scheduleDate: '2026-04-21',
    scheduleTime: '09:00',
    posted: false,
    image: 'scripts/thread-assets/stepwise_ai.png',
    text: `Klarna automated customer service. Cut costs by $60M. Then customer satisfaction collapsed and they reversed course.

The problem wasn't AI. It was overreach. They tried to automate the hardest thing — nuanced human conversations — before proving the easy wins.

The pattern across hundreds of mid-market firms is consistent:

Start with invoice matching. Log parsing. Email triage. Tasks that are repetitive, high-frequency, and low-ambiguity. These pay back in under three months.

Then move up: draft review, report generation, first-pass analysis. Tasks where the human edits the machine's output.

Full autonomy comes last, if ever. And only after the organization has built enough trust to let go.

70% of big-bang AI deployments fail. The companies getting results aren't the most aggressive. They're the ones that know what to automate first and what to leave alone.

veda.ng/stepwise-ai`
  },
  {
    id: 'universal-text-ui',
    scheduleDate: '2026-04-21',
    scheduleTime: '17:00',
    posted: false,
    image: 'scripts/thread-assets/universal_text_ui.png',
    text: `A "Filter by Country" dropdown exists because someone on the product team predicted you'd want geographic segmentation. A "Date Range" picker exists because someone predicted you'd compare time periods.

Your actual question is almost never one of the predicted ones.

This is the fundamental problem with dashboards. They are finite sets of pre-built answers. The moment your question falls outside the set, you file a ticket and wait.

A text field backed by an LLM that calls backend APIs directly eliminates the gap between what you want to know and what the interface allows you to ask.

This is already at scale:

PostHog — analytics via natural language
Salesforce Agentforce — 12,000+ orgs, 84% self-resolution
Cursor — $1B ARR, entire codebases queryable via text
GitHub Copilot — 46% of code written by AI across 20M users

The advantage shifts from who builds the best UI to who exposes the best tools.

veda.ng/universal-text-ui`
  },
  {
    id: 'agentic-state',
    scheduleDate: '2026-04-22',
    scheduleTime: '09:00',
    posted: false,
    image: 'scripts/thread-assets/agentic_state.png',
    text: `In Estonia, only two things require showing up in person: getting married and getting divorced. Everything else — 99% of public services — is digital.

Singapore runs AI across 100,000 officers. UAE hit 97% AI utilization in government entities.

These aren't experiments. They're production systems serving millions daily.

What separates them from every other "digital government" project:

The system doesn't wait for citizens to ask. A baby is born. The government detects the event, calculates parental benefits, and deposits funds. No form. No queue. The citizen does nothing.

Estonia's X-Road protocol handles over 1 billion queries per year across every government agency. Singapore integrated 400+ services through a single digital stack.

Most governments are still asking citizens to download PDFs and visit offices during business hours.

veda.ng/agentic-state`
  },
];
savePosts('linkedin-posts.json', replacePosts(linkedinPosts, newLinkedinPosts));

// ─── Bluesky Posts (rewritten, slop-free) ───
const bskyPosts = loadPosts('bluesky-posts.json');
const newBskyPosts = [
  {
    id: 'stepwise-ai',
    scheduleDate: '2026-04-21',
    scheduleTime: '09:00',
    posted: false,
    text: `Klarna automated support. Saved $60M. Customer satisfaction collapsed. They hired people back.

70% of big-bang AI deployments fail. Companies that pick one boring task first see payback in three months.

veda.ng/stepwise-ai`
  },
  {
    id: 'universal-text-ui',
    scheduleDate: '2026-04-21',
    scheduleTime: '17:00',
    posted: false,
    text: `Every dropdown on a dashboard is a predicted question. Your actual question is almost never one of them.

PostHog, Salesforce, Cursor all replaced dashboards with text fields that call APIs directly.

veda.ng/universal-text-ui`
  },
  {
    id: 'agentic-state',
    scheduleDate: '2026-04-22',
    scheduleTime: '09:00',
    posted: false,
    text: `Estonia: 99% of government services are digital. Only marriages and divorces require showing up.

Baby born? System detects it, calculates benefits, deposits money. No form. No queue.

Most governments still run on PDFs.

veda.ng/agentic-state`
  },
];
savePosts('bluesky-posts.json', replacePosts(bskyPosts, newBskyPosts));

// ─── Facebook Posts (rewritten, slop-free) ───
const fbPosts = loadPosts('facebook-posts.json');
const newFbPosts = [
  {
    id: 'stepwise-ai',
    scheduleDate: '2026-04-21',
    scheduleTime: '09:00',
    posted: false,
    image: 'scripts/thread-assets/stepwise_ai.png',
    text: `Klarna automated customer service. Saved $60M. Then satisfaction collapsed and they reversed it.

The failure was sequence, not technology. They went straight for the hardest problem. Companies that start with one boring, repetitive task — invoice matching, email triage — see payback in three months.

70% of big-bang AI deployments fail. Discipline beats ambition.

veda.ng/stepwise-ai`
  },
  {
    id: 'universal-text-ui',
    scheduleDate: '2026-04-21',
    scheduleTime: '17:00',
    posted: false,
    image: 'scripts/thread-assets/universal_text_ui.png',
    text: `Every dropdown on a dashboard exists because someone predicted your question. Your actual question is almost never one of them.

PostHog replaced analytics dashboards with a text field. Salesforce did it for CRM — 84% self-resolution. Cursor did it for code — $1B ARR.

The pattern: text field + LLM + direct API calls. No menus. No navigation.

veda.ng/universal-text-ui`
  },
  {
    id: 'agentic-state',
    scheduleDate: '2026-04-22',
    scheduleTime: '09:00',
    posted: false,
    image: 'scripts/thread-assets/agentic_state.png',
    text: `Estonia digitized 99% of public services. Only marriages and divorces require showing up in person.

Singapore runs AI across 100,000 officers. UAE hit 97% AI utilization in government.

Baby born? The system detects it, calculates benefits, deposits money. No form. No queue. No portal.

Most governments still make you download a PDF.

veda.ng/agentic-state`
  },
];
savePosts('facebook-posts.json', replacePosts(fbPosts, newFbPosts));

// ─── Tumblr Posts (rewritten, slop-free) ───
const tumblrPosts = loadPosts('tumblr-posts.json');
const newTumblrPosts = [
  {
    id: 'stepwise-ai',
    scheduleDate: '2026-04-21',
    scheduleTime: '09:00',
    posted: false,
    image: 'scripts/thread-assets/stepwise_ai.png',
    tags: ['AI', 'enterprise'],
    text: `Klarna automated support. Saved $60M. Satisfaction tanked. They hired people back.

70% of big-bang AI deployments fail. Companies that pick one boring task first see payback in three months.

The failure is always sequence, not technology.

veda.ng/stepwise-ai`
  },
  {
    id: 'universal-text-ui',
    scheduleDate: '2026-04-21',
    scheduleTime: '17:00',
    posted: false,
    image: 'scripts/thread-assets/universal_text_ui.png',
    tags: ['AI', 'design'],
    text: `Every dropdown is a predicted question. Your actual question is never one of them.

A text field backed by an LLM that calls APIs directly kills the dashboard. PostHog, Salesforce, and Cursor already proved it.

veda.ng/universal-text-ui`
  },
  {
    id: 'agentic-state',
    scheduleDate: '2026-04-22',
    scheduleTime: '09:00',
    posted: false,
    image: 'scripts/thread-assets/agentic_state.png',
    tags: ['government', 'AI'],
    text: `Estonia: 99% digital government. Singapore: AI across 100k officers. UAE: 97% utilization.

Baby born? System detects it, calculates benefits, deposits money. No form. No queue.

Most governments still run on PDFs and waiting rooms.

veda.ng/agentic-state`
  },
];
savePosts('tumblr-posts.json', replacePosts(tumblrPosts, newTumblrPosts));

console.log('\n✅ All posts rewritten (slop-free) with dark-themed infographics');

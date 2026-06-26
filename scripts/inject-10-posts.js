#!/usr/bin/env node
/**
 * inject-10-posts.js
 *
 * Injects the 10 LinkedIn draft posts into all 5 platform JSON files.
 * Text is adapted per platform's character limit.
 *
 * Platform limits:
 *   X        : 280 chars
 *   Bluesky  : 300 graphemes
 *   Threads  : 500 chars
 *   Facebook : no hard limit (full LinkedIn text used)
 *   LinkedIn : 3000 chars (full draft text)
 *
 * Run: node scripts/inject-10-posts.js
 */

const fs = require('fs');
const path = require('path');

const SCRIPTS_DIR = path.resolve(__dirname);

// ─── Image mappings ────────────────────────────────────────────────────────
// Paths relative to repo root (as used by other posts in the JSON files)
const IMAGES = {
  'li-draft-1':  'scripts/linkedin-assets/clean/draft1_micromanagers_v2_1782464292325.jpg',
  'li-draft-2':  'scripts/linkedin-assets/clean/draft2_ageism_v2_1782464310753.jpg',
  'li-draft-3':  'scripts/linkedin-assets/clean/draft3_grit_1782464279318.jpg',
  'li-draft-4':  'scripts/linkedin-assets/clean/draft4_resumegaps_1782464328098.jpg',
  'li-draft-5':  'scripts/linkedin-assets/clean/draft5_toxic_culture.jpg',
  'li-draft-6':  'scripts/linkedin-assets/clean/draft6_micromanagertax_1782464343920.jpg',
  'li-draft-7':  'scripts/linkedin-assets/clean/draft7_jobtitles_1782464359677.jpg',
  'li-draft-8':  'scripts/linkedin-assets/clean/draft8_cdrom.jpg',
  'li-draft-9':  'scripts/linkedin-assets/clean/draft9_ceo_expectations.jpg',
  'li-draft-10': 'scripts/linkedin-assets/clean/draft10_salarybackfire_1782464377011.jpg',
};

// ─── Schedule ──────────────────────────────────────────────────────────────
// 10 posts scheduled starting from tomorrow, 3 per day with an 8-hour gap (09:00, 17:00, 01:00)
const SCHEDULE = [
  { id: 'li-draft-1',  scheduleDate: '2026-06-27', scheduleTime: '09:00' },
  { id: 'li-draft-2',  scheduleDate: '2026-06-27', scheduleTime: '17:00' },
  { id: 'li-draft-3',  scheduleDate: '2026-06-28', scheduleTime: '01:00' },
  { id: 'li-draft-4',  scheduleDate: '2026-06-28', scheduleTime: '09:00' },
  { id: 'li-draft-5',  scheduleDate: '2026-06-28', scheduleTime: '17:00' },
  { id: 'li-draft-6',  scheduleDate: '2026-06-29', scheduleTime: '01:00' },
  { id: 'li-draft-7',  scheduleDate: '2026-06-29', scheduleTime: '09:00' },
  { id: 'li-draft-8',  scheduleDate: '2026-06-29', scheduleTime: '17:00' },
  { id: 'li-draft-9',  scheduleDate: '2026-06-30', scheduleTime: '01:00' },
  { id: 'li-draft-10', scheduleDate: '2026-06-30', scheduleTime: '09:00' },
];

// ─── Post text per platform ────────────────────────────────────────────────
// linkedin / facebook: full draft text (no limit concerns)
// threads: full draft text (all fit within 500 chars)
// bluesky: ≤300 graphemes — distilled core idea, same voice
// x: ≤280 chars — tightest distillation, same voice

const POSTS = {

  'li-draft-1': {
    linkedin: `Micromanagers buy physical presence. Leaders buy outcomes.

If your team has to explain why they are late for a doctor's appointment or why they need to work from home, you have infantilized your workplace.

If they deliver results and keep clients happy, their physical location or exact hours shouldn't matter.

We are dealing with adults. Stop watching the clock. Focus on output.`,

    facebook: `Micromanagers buy physical presence. Leaders buy outcomes.

If your team has to explain why they are late for a doctor's appointment or why they need to work from home, you have infantilized your workplace.

If they deliver results and keep clients happy, their physical location or exact hours shouldn't matter.

We are dealing with adults. Stop watching the clock. Focus on output.`,

    threads: `Micromanagers buy physical presence. Leaders buy outcomes.

If your team has to explain why they are late for a doctor's appointment or why they need to work from home, you have infantilized your workplace.

If they deliver results and keep clients happy, their physical location or exact hours shouldn't matter.

We are dealing with adults. Stop watching the clock. Focus on output.`,

    // 221c — fits Bluesky
    bluesky: `Micromanagers buy physical presence. Leaders buy outcomes.

If your team delivers results and keeps clients happy, their exact hours or location shouldn't matter.

We are dealing with adults. Stop watching the clock. Focus on output.`,

    // 200c — fits X
    x: `Micromanagers buy physical presence. Leaders buy outcomes.

Results and client satisfaction matter. Location doesn't.

Stop watching the clock.`,
  },

  'li-draft-2': {
    linkedin: `Ageism in tech is a massive arbitrage opportunity.

Companies filter out applicants over 50 using "culture fit" or "overqualified" as excuses to cut costs. In doing so, they lose decades of actual troubleshooting experience.

You can't Google institutional knowledge or crisis management.

If you want top-tier talent, stop screening for youth. Look for capability and experience.`,

    facebook: `Ageism in tech is a massive arbitrage opportunity.

Companies filter out applicants over 50 using "culture fit" or "overqualified" as excuses to cut costs. In doing so, they lose decades of actual troubleshooting experience.

You can't Google institutional knowledge or crisis management.

If you want top-tier talent, stop screening for youth. Look for capability and experience.`,

    threads: `Ageism in tech is a massive arbitrage opportunity.

Companies filter out applicants over 50 using "culture fit" or "overqualified" as excuses to cut costs. In doing so, they lose decades of actual troubleshooting experience.

You can't Google institutional knowledge or crisis management.

If you want top-tier talent, stop screening for youth. Look for capability and experience.`,

    // 281c — fits Bluesky
    bluesky: `Ageism in tech is an arbitrage opportunity.

Companies screen out applicants over 50 using "culture fit" as cover. In doing so, they lose decades of troubleshooting experience.

You can't Google institutional knowledge. Look for capability, not youth.`,

    // 200c — fits X
    x: `Ageism in tech is a hiring mistake.

"Overqualified" is usually code for "we want to underpay." In doing so, you lose decades of experience.

You can't Google institutional knowledge.`,
  },

  'li-draft-3': {
    linkedin: `Recruiting pipelines optimize for compliance and call it professionalism.

But the best hires are rarely perfect on paper. They have drive, resilience, and grit, which standard HR checklists fail to measure.

If a candidate shows extreme effort and hunger to deliver, that outweighs a minor schedule slip or a messy resume.

If you want top performers, stop looking for perfection. Focus on potential.`,

    facebook: `Recruiting pipelines optimize for compliance and call it professionalism.

But the best hires are rarely perfect on paper. They have drive, resilience, and grit, which standard HR checklists fail to measure.

If a candidate shows extreme effort and hunger to deliver, that outweighs a minor schedule slip or a messy resume.

If you want top performers, stop looking for perfection. Focus on potential.`,

    threads: `Recruiting pipelines optimize for compliance and call it professionalism.

But the best hires are rarely perfect on paper. They have drive, resilience, and grit, which standard HR checklists fail to measure.

If a candidate shows extreme effort and hunger to deliver, that outweighs a minor schedule slip or a messy resume.

If you want top performers, stop looking for perfection. Focus on potential.`,

    // 275c — fits Bluesky
    bluesky: `Recruiting pipelines optimize for compliance and call it professionalism.

The best hires are rarely perfect on paper. Drive and grit don't show up on HR checklists.

If a candidate shows real hunger to deliver, that beats a spotless resume every time.`,

    // 241c — fits X
    x: `Recruiting pipelines optimize for compliance and call it professionalism.

The best hires are rarely perfect on paper. Drive and grit don't show up on checklists.

Stop optimizing for perfection.`,
  },

  'li-draft-4': {
    linkedin: `A resume gap is not a competence gap. Life happens.

Most automated recruiting tools filter out excellent candidates because of arbitrary career breaks. But resumes don't perform work. People do.

If someone has the technical skills and the right drive, their timeline doesn't matter.

Focus on the candidate, not the gap.`,

    facebook: `A resume gap is not a competence gap. Life happens.

Most automated recruiting tools filter out excellent candidates because of arbitrary career breaks. But resumes don't perform work. People do.

If someone has the technical skills and the right drive, their timeline doesn't matter.

Focus on the candidate, not the gap.`,

    threads: `A resume gap is not a competence gap. Life happens.

Most automated recruiting tools filter out excellent candidates because of arbitrary career breaks. But resumes don't perform work. People do.

If someone has the technical skills and the right drive, their timeline doesn't matter.

Focus on the candidate, not the gap.`,

    // 285c — fits Bluesky
    bluesky: `A resume gap is not a competence gap. Life happens.

Automated tools filter out qualified candidates over arbitrary career breaks. Resumes don't do work. People do.

If the skills are there, the timeline doesn't matter.`,

    // 216c — fits X
    x: `A resume gap is not a competence gap. Life happens.

Automated tools filter out qualified candidates for arbitrary breaks.

If the skills and drive are there, the timeline doesn't matter.`,
  },

  'li-draft-5': {
    linkedin: `Abuse is not the price of high performance.

Toxic cultures promote toxic people because they hit short-term numbers. But healthy cultures understand that undermining others is a net negative.

If your "top performer" destroys team cohesion, they are actually costing the business money.

True performance is built on mutual trust, not fear.`,

    facebook: `Abuse is not the price of high performance.

Toxic cultures promote toxic people because they hit short-term numbers. But healthy cultures understand that undermining others is a net negative.

If your "top performer" destroys team cohesion, they are actually costing the business money.

True performance is built on mutual trust, not fear.`,

    threads: `Abuse is not the price of high performance.

Toxic cultures promote toxic people because they hit short-term numbers. But healthy cultures understand that undermining others is a net negative.

If your "top performer" destroys team cohesion, they are actually costing the business money.

True performance is built on mutual trust, not fear.`,

    // 283c — fits Bluesky
    bluesky: `Abuse is not the price of high performance.

Toxic cultures promote toxic people because they hit short-term numbers. If your "top performer" destroys team cohesion, they are costing the business money.

Performance is built on trust, not fear.`,

    // 251c — fits X
    x: `Abuse is not the price of high performance.

If your "top performer" destroys team cohesion, they are costing the business money.

Performance is built on trust, not fear.`,
  },

  'li-draft-6': {
    linkedin: `Counting minutes destroys discretionary effort.

If a manager writes up an employee for arriving 10 minutes late, they shouldn't expect that employee to stay late when a project is failing.

You cannot command loyalty. If you treat work as a strict transaction, your team will do the same.`,

    facebook: `Counting minutes destroys discretionary effort.

If a manager writes up an employee for arriving 10 minutes late, they shouldn't expect that employee to stay late when a project is failing.

You cannot command loyalty. If you treat work as a strict transaction, your team will do the same.`,

    threads: `Counting minutes destroys discretionary effort.

If a manager writes up an employee for arriving 10 minutes late, they shouldn't expect that employee to stay late when a project is failing.

You cannot command loyalty. If you treat work as a strict transaction, your team will do the same.`,

    // 242c — fits Bluesky
    bluesky: `Counting minutes destroys discretionary effort.

Write someone up for arriving 10 minutes late, and don't be surprised when they leave exactly on time during a project crisis.

Loyalty cannot be commanded.`,

    // 202c — fits X
    x: `Counting minutes destroys discretionary effort.

Write someone up for arriving 10 minutes late. Don't be surprised they leave on time when a project is failing.

You cannot command loyalty.`,
  },

  'li-draft-7': {
    linkedin: `Net worth and job titles are lagging indicators of privilege, not leading indicators of intelligence or work ethic.

The systems keeping our society running are built by people who rarely get equity or high-paying titles.

Never confuse a prestige title with actual systemic utility. Honest work is honest.`,

    facebook: `Net worth and job titles are lagging indicators of privilege, not leading indicators of intelligence or work ethic.

The systems keeping our society running are built by people who rarely get equity or high-paying titles.

Never confuse a prestige title with actual systemic utility. Honest work is honest.`,

    threads: `Net worth and job titles are lagging indicators of privilege, not leading indicators of intelligence or work ethic.

The systems keeping our society running are built by people who rarely get equity or high-paying titles.

Never confuse a prestige title with actual systemic utility. Honest work is honest.`,

    // 281c — fits Bluesky
    bluesky: `Net worth and job titles are lagging indicators of privilege, not leading indicators of intelligence or work ethic.

The systems that keep society running are built by people who rarely get the titles or equity.

Don't confuse prestige with systemic utility.`,

    // 240c — fits X
    x: `Net worth and job titles are lagging indicators of privilege, not leading indicators of intelligence.

The systems that keep society running are built by people who rarely get the titles.

Don't confuse prestige with utility.`,
  },

  'li-draft-8': {
    linkedin: `In 1994, Bill Gates sat on 330,000 sheets of paper to demonstrate a single CD-ROM's storage capacity.

Today, a 2-million token context window holds the equivalent of four of those CD-ROMs in active LLM memory.

We went from physical distribution constraints to real-time cognitive synthesis in 30 years.

The scale of intelligence is outpacing the scale of data.`,

    facebook: `In 1994, Bill Gates sat on 330,000 sheets of paper to demonstrate a single CD-ROM's storage capacity.

Today, a 2-million token context window holds the equivalent of four of those CD-ROMs in active LLM memory.

We went from physical distribution constraints to real-time cognitive synthesis in 30 years.

The scale of intelligence is outpacing the scale of data.`,

    threads: `In 1994, Bill Gates sat on 330,000 sheets of paper to demonstrate a single CD-ROM's storage capacity.

Today, a 2-million token context window holds the equivalent of four of those CD-ROMs in active LLM memory.

We went from physical distribution constraints to real-time cognitive synthesis in 30 years.

The scale of intelligence is outpacing the scale of data.`,

    // 283c — fits Bluesky
    bluesky: `In 1994, Bill Gates sat on 330,000 sheets of paper to demonstrate a single CD-ROM's storage.

Today, a 2-million token context window holds four CD-ROMs worth of active LLM memory.

30 years. From physical constraints to real-time cognition.`,

    // 265c — fits X
    x: `In 1994, Bill Gates sat on 330,000 sheets of paper to show a CD-ROM's capacity.

Today's 2M token context window holds four of those CD-ROMs in active LLM memory.

30 years. From storage constraints to cognitive synthesis.`,
  },

  'li-draft-9': {
    linkedin: `Expecting employees to work with the passion of a founder is a delusion.

They don't have your equity. They don't have your upside. It is your business, not theirs.

Pay people fairly, trust them, and align incentives. Don't expect founder effort for salary compensation.`,

    facebook: `Expecting employees to work with the passion of a founder is a delusion.

They don't have your equity. They don't have your upside. It is your business, not theirs.

Pay people fairly, trust them, and align incentives. Don't expect founder effort for salary compensation.`,

    threads: `Expecting employees to work with the passion of a founder is a delusion.

They don't have your equity. They don't have your upside. It is your business, not theirs.

Pay people fairly, trust them, and align incentives. Don't expect founder effort for salary compensation.`,

    // 271c — fits Bluesky (same as full, it's 271c)
    bluesky: `Expecting employees to work with the passion of a founder is a delusion.

They don't have your equity. They don't have your upside. It is your business, not theirs.

Pay people fairly, trust them, and align incentives. Don't expect founder effort for salary compensation.`,

    // 271c — fits X too (same text, it's 271c)
    x: `Expecting employees to work with the passion of a founder is a delusion.

They don't have your equity. They don't have your upside. It is your business, not theirs.

Pay people fairly, trust them, and align incentives. Don't expect founder effort for salary compensation.`,
  },

  'li-draft-10': {
    linkedin: `Lowballing candidates in salary negotiations is a net-negative strategy.

Squeezing a hire below their market worth might look like a cost-saving win on HR's spreadsheet.

But they will leave the moment they see the pay disparity. The rehiring, training, and performance gap costs will dwarf the initial savings.

If you want to retain top talent, pay them what they are worth.`,

    facebook: `Lowballing candidates in salary negotiations is a net-negative strategy.

Squeezing a hire below their market worth might look like a cost-saving win on HR's spreadsheet.

But they will leave the moment they see the pay disparity. The rehiring, training, and performance gap costs will dwarf the initial savings.

If you want to retain top talent, pay them what they are worth.`,

    threads: `Lowballing candidates in salary negotiations is a net-negative strategy.

Squeezing a hire below their market worth might look like a cost-saving win on HR's spreadsheet.

But they will leave the moment they see the pay disparity. The rehiring, training, and performance gap costs will dwarf the initial savings.

If you want to retain top talent, pay them what they are worth.`,

    // 298c — fits Bluesky
    bluesky: `Lowballing candidates in salary negotiations is a net-negative strategy.

Squeezing a hire below market might look like a win on HR's spreadsheet.

They will leave the moment they see the disparity. Rehiring costs will dwarf the initial savings.`,

    // 266c — fits X
    x: `Lowballing candidates in salary negotiations is a net-negative strategy.

They will leave the moment they see the pay disparity. Rehiring and training costs will dwarf the initial savings.

Pay what the role is worth.`,
  },
};

// ─── Character verification ────────────────────────────────────────────────
let hasErrors = false;
for (const [id, variants] of Object.entries(POSTS)) {
  const xLen = variants.x.length;
  const bsLen = variants.bluesky.length;
  const thLen = variants.threads.length;
  if (xLen > 280)  { console.error(`❌ ${id} X too long: ${xLen}/280`);    hasErrors = true; }
  if (bsLen > 300) { console.error(`❌ ${id} Bluesky too long: ${bsLen}/300`); hasErrors = true; }
  if (thLen > 500) { console.error(`❌ ${id} Threads too long: ${thLen}/500`); hasErrors = true; }
}
if (hasErrors) { console.error('Fix character overruns above before continuing.'); process.exit(1); }
console.log('✅ All character limits verified.');

// ─── Load existing platform files ─────────────────────────────────────────
function loadFile(name) {
  const filePath = path.join(SCRIPTS_DIR, name);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function saveFile(name, data) {
  const filePath = path.join(SCRIPTS_DIR, name);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`  Saved ${name} (${data.length} entries)`);
}

// Remove existing li-draft-* entries then append fresh ones
function upsert(existing, newEntries) {
  const withoutDrafts = existing.filter(p => !p.id.startsWith('li-draft-'));
  return [...withoutDrafts, ...newEntries];
}

// ─── Build platform-specific post arrays ──────────────────────────────────
const platform = {
  x:        [],
  bluesky:  [],
  threads:  [],
  facebook: [],
  linkedin: [],
};

for (const { id, scheduleDate, scheduleTime } of SCHEDULE) {
  const variants = POSTS[id];
  const image = IMAGES[id] || undefined;
  const base = { id, scheduleDate, scheduleTime, posted: false };

  platform.x.push({        ...base, text: variants.x,        ...(image && { image }) });
  platform.bluesky.push({  ...base, text: variants.bluesky,  ...(image && { image }) });
  platform.threads.push({  ...base, text: variants.threads,  ...(image && { image }) });
  platform.facebook.push({ ...base, text: variants.facebook, ...(image && { image }) });
  platform.linkedin.push({ ...base, text: variants.linkedin, ...(image && { image }) });
}

// ─── Inject into platform files ───────────────────────────────────────────
console.log('\n💾 Writing platform files...');

saveFile('x-posts.json',        upsert(loadFile('x-posts.json'),        platform.x));
saveFile('bluesky-posts.json',  upsert(loadFile('bluesky-posts.json'),  platform.bluesky));
saveFile('threads-posts.json',  upsert(loadFile('threads-posts.json'),  platform.threads));
saveFile('facebook-posts.json', upsert(loadFile('facebook-posts.json'), platform.facebook));
saveFile('linkedin-posts.json', upsert(loadFile('linkedin-posts.json'), platform.linkedin));

console.log('\n✅ Done. 10 posts injected into all 5 platforms.');
console.log('   X        : ≤280 chars (distilled)');
console.log('   Bluesky  : ≤300 graphemes (distilled)');
console.log('   Threads  : ≤500 chars (full draft)');
console.log('   Facebook : full draft');
console.log('   LinkedIn : full draft');

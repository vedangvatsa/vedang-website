'use client';

import React from 'react';

/* ─── Hero Comparison Card ─── */
export function PlaybookHeroCard() {
  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-0.5 text-center text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">THE AI IMPLEMENTATION PLAYBOOK</h3>
        <p className="text-xs text-muted-foreground mb-8 uppercase tracking-widest font-semibold text-center">From scattered tools to autonomous operations in 90 days</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Before */}
          <div className="rounded-[3px] border-2 border-red-200 dark:border-red-900/40 p-4">
            <div className="text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-wider mb-3">Before: Tool Adoption</div>
            {[
              ['Team members', '20 people, 20 different AI tools'],
              ['Consistency', 'Zero brand coherence'],
              ['Automation', 'Copy-paste between tabs'],
              ['Discovery', 'SEO only (if that)'],
              ['Outreach', 'Manual email, one at a time'],
              ['Intelligence', 'Check competitors monthly'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-[#e3e3e0]/40 dark:border-zinc-800/40 last:border-0">
                <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
                <span className="text-[11px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium text-right">{value}</span>
              </div>
            ))}
          </div>

          {/* After */}
          <div className="rounded-[3px] border-2 border-blue-300 dark:border-blue-800/60 p-4">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">After: Agent-Native Ops</div>
            {[
              ['Team members', '1 operator + agent fleet'],
              ['Consistency', 'brand-guidelines.md everywhere'],
              ['Automation', 'End-to-end pipelines, zero tabs'],
              ['Discovery', 'SEO + AEO + GEO + agents.json'],
              ['Outreach', 'AI-personalized at 50+/day'],
              ['Intelligence', 'Continuous, automated, 24/7'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-[#e3e3e0]/40 dark:border-zinc-800/40 last:border-0">
                <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: '14', label: 'implementation steps' },
            { value: '40+', label: 'use cases covered' },
            { value: '20+', label: 'open-source tools' },
            { value: '90 days', label: 'to full automation' },
          ].map((s) => (
            <div key={s.label} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3 text-center">
              <div className="text-xl md:text-2xl font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{s.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Agent Tools Ecosystem Map ─── */
export function AgentToolsMap() {
  const categories = [
    {
      name: 'Agent Browsers',
      color: 'hsl(210 90% 40%)',
      tools: [
        { name: 'Browser Use', detail: '78k stars', url: 'https://github.com/browser-use/browser-use' },
        { name: 'Stagehand', detail: '21k stars', url: 'https://github.com/browserbase/stagehand' },
        { name: 'Playwright MCP', detail: '29k stars', url: 'https://github.com/microsoft/playwright-mcp' },
      ],
    },
    {
      name: 'Orchestration',
      color: 'hsl(30 80% 50%)',
      tools: [
        { name: 'LangGraph', detail: 'Production std', url: 'https://github.com/langchain-ai/langgraph' },
        { name: 'CrewAI', detail: 'Role-based', url: 'https://github.com/crewAIInc/crewAI' },
        { name: 'smolagents', detail: 'HuggingFace', url: 'https://github.com/huggingface/smolagents' },
      ],
    },
    {
      name: 'Agent Email',
      color: 'hsl(280 60% 45%)',
      tools: [
        { name: 'Inbox Zero', detail: 'AI inbox mgmt', url: 'https://github.com/elie222/inbox-zero' },
        { name: 'AgenticMail', detail: 'Agent identity', url: 'https://github.com/topics/agentic-mail' },
        { name: 'Resend / SES', detail: 'Delivery infra', url: 'https://resend.com' },
      ],
    },
    {
      name: 'Video Generation',
      color: 'hsl(350 70% 45%)',
      tools: [
        { name: 'Wan2.1', detail: 'Alibaba', url: 'https://github.com/Wan-Video/Wan2.1' },
        { name: 'CogVideo', detail: 'Tsinghua', url: 'https://github.com/THUDM/CogVideo' },
        { name: 'Manim', detail: 'Animations', url: 'https://github.com/3b1b/manim' },
      ],
    },
    {
      name: 'Voice and Audio',
      color: 'hsl(160 80% 35%)',
      tools: [
        { name: 'Kokoro', detail: 'TTS', url: 'https://github.com/hexgrad/kokoro' },
        { name: 'F5-TTS', detail: 'Voice cloning', url: 'https://github.com/SWivid/F5-TTS' },
        { name: 'Whisper', detail: 'Transcription', url: 'https://github.com/openai/whisper' },
      ],
    },
    {
      name: 'Data Extraction',
      color: 'hsl(200 70% 45%)',
      tools: [
        { name: 'Firecrawl', detail: 'Web → Markdown', url: 'https://github.com/mendableai/firecrawl' },
        { name: 'Crawl4AI', detail: 'AI web crawler', url: 'https://github.com/unclecode/crawl4ai' },
        { name: 'Docling', detail: 'Doc parser', url: 'https://github.com/DS4SD/docling' },
      ],
    },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Open-Source Agent Ecosystem</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Every building block you need to automate your startup</p>

        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.name} className="rounded-[3px] overflow-hidden border-l-[3px]" style={{ borderLeftColor: cat.color, borderTop: '1px solid', borderRight: '1px solid', borderBottom: '1px solid', borderTopColor: '#e3e3e0', borderRightColor: '#e3e3e0', borderBottomColor: '#e3e3e0' }}>
              <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: cat.color + '08' }}>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: cat.color }}>{cat.name}</span>
                <span className="text-[10px] text-muted-foreground">{cat.tools.length} tools</span>
              </div>
              <div className="px-4 py-2.5 flex flex-wrap gap-2">
                {cat.tools.map((t) => (
                  <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium px-2.5 py-1.5 rounded-md bg-[#f7f6f3] dark:bg-zinc-800/40 text-[#37352f] dark:text-[rgba(255,255,255,0.81)] border border-[#e3e3e0]/50 dark:border-zinc-700/30 hover:border-[#37352f]/30 dark:hover:border-zinc-500 transition-colors no-underline">
                    {t.name} <span className="text-muted-foreground/60 ml-1">{t.detail}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          GitHub star counts as of May 2026. All tools listed are open source. Links go directly to GitHub repositories.
        </p>
      </div>
    </figure>
  );
}

/* ─── Automation ROI Chart ─── */
export function AutomationROIChart() {
  const tasks = [
    { task: 'B2B outreach (50 leads)', manual: '40 hrs/wk', automated: '2 hrs/wk', savings: '95%' },
    { task: 'Content creation (4 posts)', manual: '16 hrs/wk', automated: '3 hrs/wk', savings: '81%' },
    { task: 'Social media posting', manual: '10 hrs/wk', automated: '1 hr/wk', savings: '90%' },
    { task: 'Competitive monitoring', manual: '8 hrs/wk', automated: '0 hrs/wk', savings: '100%' },
    { task: 'Customer support triage', manual: '20 hrs/wk', automated: '4 hrs/wk', savings: '80%' },
    { task: 'Report generation', manual: '24 hrs/report', automated: '4 hrs/report', savings: '83%' },
    { task: 'Email nurture sequences', manual: '6 hrs/wk', automated: '0 hrs/wk', savings: '100%' },
    { task: 'SEO and AEO optimization', manual: '12 hrs/wk', automated: '2 hrs/wk', savings: '83%' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Time Savings Per Function</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Manual effort vs agent-automated effort (weekly)</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[480px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Task</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Manual</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Automated</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Saved</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.task} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{t.task}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{t.manual}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{t.automated}</td>
                  <td className="py-2.5 px-2"><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400">{t.savings}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Estimates based on single-operator implementation using the tools referenced in this playbook. &quot;Automated&quot; time includes human review and quality checks.
        </p>
      </div>
    </figure>
  );
}

/* ─── Content Pipeline Flow ─── */
export function ContentPipelineFlow() {
  const stages = [
    {
      stage: '1. Ideation',
      tools: 'Google Sheets, Perplexity',
      input: 'Keyword research + topic gaps',
      output: 'Content calendar entry',
      time: '15 min',
    },
    {
      stage: '2. Research',
      tools: 'Firecrawl, web search',
      input: 'Topic brief from calendar',
      output: 'Research notes + sources',
      time: '10 min (agent)',
    },
    {
      stage: '3. Draft',
      tools: 'Claude Code / Antigravity',
      input: 'Research + brand-guidelines.md',
      output: 'Full article draft',
      time: '5 min (agent)',
    },
    {
      stage: '4. Edit',
      tools: 'Human review',
      input: 'Agent draft',
      output: 'Final article',
      time: '30 min',
    },
    {
      stage: '5. Publish',
      tools: 'Git + Vercel',
      input: 'Final MDX file',
      output: 'Live page + sitemap update',
      time: '2 min',
    },
    {
      stage: '6. Distribute',
      tools: 'Social agents',
      input: 'Published URL',
      output: 'Platform-specific posts',
      time: '3 min (agent)',
    },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Content Pipeline</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">From idea to published and distributed in under 1 hour</p>

        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-[#e3e3e0] dark:bg-zinc-800" />
          <div className="space-y-3">
            {stages.map((s, i) => (
              <div key={s.stage} className="grid grid-cols-[36px_1fr] gap-3 items-start">
                <div className="relative flex items-center justify-center pt-1">
                  <div className="w-[9px] h-[9px] rounded-full border-2 border-primary bg-primary" />
                </div>
                <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{s.stage}</span>
                    <span className="text-[10px] font-mono text-muted-foreground/60">{s.time}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div>
                      <span className="text-muted-foreground/60 uppercase font-semibold">Tools</span>
                      <p className="text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)] mt-0.5">{s.tools}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground/60 uppercase font-semibold">Input</span>
                      <p className="text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)] mt-0.5">{s.input}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground/60 uppercase font-semibold">Output</span>
                      <p className="text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)] mt-0.5">{s.output}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-[3px] bg-[#f7f6f3] dark:bg-zinc-800/40 px-4 py-2.5 text-center">
          <span className="text-xs font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Total human time: ~45 minutes</span>
          <span className="text-[10px] text-muted-foreground ml-2">Agent handles research, drafting, and distribution</span>
        </div>
      </div>
    </figure>
  );
}

export function OutreachPipeline() {
  const steps = [
    { num: '1', label: 'Lead Import', desc: 'CSV from Apollo, LinkedIn Sales Nav, or manual research', color: '#f59e0b' },
    { num: '2', label: 'AI Enrichment', desc: 'Company data, tech stack, recent news, funding stage', color: '#f97316' },
    { num: '3', label: 'Personalization', desc: 'AI writes context-aware email using prospect intel', color: '#ef4444' },
    { num: '4', label: 'Sequences', desc: '4-email drip over 14 days: intro, value, proof, breakup', color: '#a855f7' },
    { num: '5', label: 'Tracking', desc: 'Opens, clicks, replies tracked per lead per email', color: '#3b82f6' },
    { num: '6', label: 'CRM Sync', desc: 'All activity logged to Google Sheets or Postgres', color: '#10b981' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Outreach Pipeline Architecture</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Six stages from raw leads to closed conversations</p>
        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-[#e3e3e0] dark:bg-zinc-800" />
          <div className="space-y-2.5">
            {steps.map((s) => (
              <div key={s.num} className="grid grid-cols-[36px_1fr] gap-3 items-start">
                <div className="relative flex items-center justify-center pt-1">
                  <div className="w-[9px] h-[9px] rounded-full" style={{ backgroundColor: s.color }} />
                </div>
                <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold" style={{ color: s.color }}>Step {s.num}: {s.label}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

export function AIMaturityLevels() {
  const levels = [
    { level: 'Level 0', title: 'No AI', description: 'Everything manual. Spreadsheets, copy-paste, human in every loop.', color: '#64748b', pct: 10 },
    { level: 'Level 1', title: 'Tool Adoption', description: 'Individual team members using ChatGPT, Copilot, Midjourney. No coordination.', color: '#f59e0b', pct: 25 },
    { level: 'Level 2', title: 'Pipeline Automation', description: 'End-to-end workflows automated. Content, outreach, and reporting run on agents.', color: '#3b82f6', pct: 55 },
    { level: 'Level 3', title: 'Agent-Native', description: 'Agents run the business. Humans review output and make strategic decisions.', color: '#10b981', pct: 85 },
    { level: 'Level 4', title: 'Autonomous Operations', description: 'Self-improving systems. Agents optimize their own pipelines based on performance data.', color: '#8b5cf6', pct: 100 },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">AI Maturity Assessment</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Five levels from manual operations to autonomous systems</p>
        <div className="space-y-3">
          {levels.map((l) => (
            <div key={l.level} className="grid grid-cols-[55px_1fr] gap-3 items-center">
              <span className="text-xs font-mono font-bold" style={{ color: l.color }}>{l.level}</span>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{l.title}</span>
                </div>
                <div className="w-full h-5 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                  <div className="h-full rounded-md flex items-center pl-2" style={{ width: `${l.pct}%`, backgroundColor: l.color }}>
                    <span className="text-[9px] font-bold text-white/90">{l.pct}%</span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{l.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

export function ImplementationTimeline() {
  const phases = [
    { period: 'Week 1', title: 'Foundation', items: ['Brand guidelines', 'Agent setup', 'AI discovery files'], color: '#f59e0b' },
    { period: 'Week 2', title: 'Infrastructure', items: ['Email setup (Resend/SES)', 'Email capture', 'Nurture sequences'], color: '#f97316' },
    { period: 'Week 3', title: 'Outreach', items: ['B2B pipeline', 'Lead import', 'Campaign launch'], color: '#ef4444' },
    { period: 'Week 4', title: 'Content', items: ['Content pipeline', 'Social automation', 'Dashboard'], color: '#a855f7' },
    { period: 'Month 2', title: 'Authority', items: ['First consulting report', 'AEO/GEO optimization', 'Scale outreach'], color: '#3b82f6' },
    { period: 'Month 3', title: 'Autonomous', items: ['Full agent ops', 'Review and iterate', 'Strategic focus'], color: '#10b981' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Implementation Timeline</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">From zero to autonomous operations in 90 days</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {phases.map((p) => (
            <div key={p.period} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderTopWidth: '3px', borderTopColor: p.color }}>
              <div className="p-3">
                <span className="text-[10px] font-mono font-bold" style={{ color: p.color }}>{p.period}</span>
                <div className="text-xs font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] mt-1 mb-2">{p.title}</div>
                {p.items.map((item) => (
                  <div key={item} className="text-[10px] text-muted-foreground py-0.5 border-b border-[#e3e3e0]/30 dark:border-zinc-800/30 last:border-0">{item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

export function NurtureSequence() {
  const steps = [
    { day: 'Day 0', type: 'Welcome', desc: 'What they signed up for, one best-content link', color: '#10b981' },
    { day: 'Day 3', type: 'Value', desc: 'Genuinely useful guide or framework', color: '#3b82f6' },
    { day: 'Day 7', type: 'Authority', desc: 'Case study or data-backed result', color: '#a855f7' },
    { day: 'Day 14', type: 'Soft CTA', desc: 'Book a call or reply with a challenge', color: '#f59e0b' },
    { day: 'Day 21+', type: 'Newsletter', desc: 'Ongoing weekly or biweekly value', color: '#ef4444' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Email Nurture Sequence</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Five-touch sequence from signup to conversion</p>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[400px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Timing</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Type</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Content</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((s) => (
                <tr key={s.day} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 font-mono font-bold" style={{ color: s.color }}>{s.day}</td>
                  <td className="py-2.5 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{s.type}</td>
                  <td className="py-2.5 px-2 text-muted-foreground">{s.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

export function ImplementationChecklist() {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('playbook-checklist');
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
  }, []);

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem('playbook-checklist', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const weeks = [
    {
      week: 'Week 1',
      title: 'Foundation',
      color: '#f59e0b',
      days: [
        {
          day: 'Day 1',
          tasks: [
            { id: 'w1d1t1', task: 'Write brand-guidelines.md', detail: 'Voice, tone, formatting rules, anti-patterns, visual identity (hex codes, fonts)', time: '2-3 hrs' },
            { id: 'w1d1t2', task: 'Place guidelines in agent config', detail: 'Copy to .gemini/style.md (Antigravity), CLAUDE.md (Claude Code), or .cursorrules (Cursor)', time: '15 min' },
          ],
        },
        {
          day: 'Day 2',
          tasks: [
            { id: 'w1d2t1', task: 'Install and configure your coding agent', detail: 'Antigravity, Claude Code, or Cursor. Connect to your GitHub repos.', time: '30 min' },
            { id: 'w1d2t2', task: 'Set up MCP servers', detail: 'Google Sheets MCP, Postgres MCP, filesystem access. Test each connection.', time: '1 hr' },
          ],
        },
        {
          day: 'Day 3-4',
          tasks: [
            { id: 'w1d3t1', task: 'Deploy AI discovery files', detail: 'Run: npx github:vedangvatsa/ai-discovery-standards', time: '30 min' },
            { id: 'w1d3t2', task: 'Add JSON-LD structured data to key pages', detail: 'Organization, Person, Article, FAQ schemas. Use schema.org validator.', time: '2 hrs' },
            { id: 'w1d3t3', task: 'Write llms.txt', detail: 'Markdown summary of your site for AI systems. See llmstxt.org for format.', time: '1 hr' },
          ],
        },
        {
          day: 'Day 5',
          tasks: [
            { id: 'w1d5t1', task: 'Audit robots.txt for AI crawlers', detail: 'Allow search bots (OAI-SearchBot, PerplexityBot). Block training bots if desired.', time: '30 min' },
            { id: 'w1d5t2', task: 'Submit sitemap to Google Search Console', detail: 'Verify ownership, submit XML sitemap, check for indexing errors.', time: '30 min' },
          ],
        },
      ],
    },
    {
      week: 'Week 2',
      title: 'Email Infrastructure',
      color: '#f97316',
      days: [
        {
          day: 'Day 8',
          tasks: [
            { id: 'w2d1t1', task: 'Set up Resend or AWS SES', detail: 'Create account. Verify sending domain. Add SPF, DKIM, DMARC DNS records.', time: '1 hr' },
            { id: 'w2d1t2', task: 'Test email delivery', detail: 'Send test emails. Check spam score with mail-tester.com. Fix any issues.', time: '30 min' },
          ],
        },
        {
          day: 'Day 9-10',
          tasks: [
            { id: 'w2d2t1', task: 'Build email capture forms', detail: 'Add contextual forms to top 3 highest-traffic pages. Connect to database or email platform.', time: '2 hrs' },
            { id: 'w2d2t2', task: 'Set up subscriber storage', detail: 'Supabase table, Postgres, or directly in Resend audiences. Tag by source page.', time: '1 hr' },
          ],
        },
        {
          day: 'Day 11-12',
          tasks: [
            { id: 'w2d3t1', task: 'Write 5-email nurture sequence', detail: 'Day 0 welcome, Day 3 value, Day 7 authority, Day 14 soft CTA, Day 21+ newsletter.', time: '3 hrs' },
            { id: 'w2d3t2', task: 'Build send automation', detail: 'Cron job or GitHub Action that checks subscriber ages and sends appropriate email.', time: '2 hrs' },
          ],
        },
      ],
    },
    {
      week: 'Week 3',
      title: 'Outreach Pipeline',
      color: '#ef4444',
      days: [
        {
          day: 'Day 15-16',
          tasks: [
            { id: 'w3d1t1', task: 'Clone and configure b2b-outreach', detail: 'git clone vedangvatsa/b2b-outreach. Set up .env with API keys.', time: '1 hr' },
            { id: 'w3d1t2', task: 'Define your ICP in config/icp.yaml', detail: 'Industries, company sizes, funding stages, target titles, geographies.', time: '1 hr' },
            { id: 'w3d1t3', task: 'Write email sequence templates', detail: 'Cold intro, value-add, social proof, breakup. 4 emails over 14 days.', time: '2 hrs' },
          ],
        },
        {
          day: 'Day 17-18',
          tasks: [
            { id: 'w3d2t1', task: 'Import first lead list (50-100 leads)', detail: 'CSV from LinkedIn Sales Navigator, Apollo, or manual research.', time: '1 hr' },
            { id: 'w3d2t2', task: 'Run enrichment and personalization', detail: 'outreach enrich && outreach personalize. Review AI-generated messages.', time: '2 hrs' },
          ],
        },
        {
          day: 'Day 19',
          tasks: [
            { id: 'w3d3t1', task: 'Dry-run first campaign', detail: 'outreach campaign run --sequence cold_outreach --dry-run. Check output quality.', time: '1 hr' },
            { id: 'w3d3t2', task: 'Launch campaign', detail: 'Remove --dry-run flag. Start with 10-20 sends/day. Monitor deliverability.', time: '30 min' },
            { id: 'w3d3t3', task: 'Set up Google Sheets CRM sync', detail: 'Connect tracking sheet. Verify leads, messages, and statuses sync correctly.', time: '30 min' },
          ],
        },
      ],
    },
    {
      week: 'Week 4',
      title: 'Content and Social',
      color: '#a855f7',
      days: [
        {
          day: 'Day 22-23',
          tasks: [
            { id: 'w4d1t1', task: 'Create content calendar in Google Sheets', detail: 'Columns: topic, keyword, audience, publish date, status, social variants.', time: '1 hr' },
            { id: 'w4d1t2', task: 'Write first 2 blog posts using agent', detail: 'Provide topic and keyword. Agent researches, drafts following brand-guidelines.md. You edit.', time: '3 hrs' },
          ],
        },
        {
          day: 'Day 24-25',
          tasks: [
            { id: 'w4d2t1', task: 'Set up social media automation', detail: 'Create posting scripts for Twitter API, LinkedIn API, Telegram Bot API.', time: '3 hrs' },
            { id: 'w4d2t2', task: 'Build social listening alerts', detail: 'Script that monitors brand mentions on Twitter/Reddit/HN. Posts to Slack on match.', time: '2 hrs' },
          ],
        },
        {
          day: 'Day 26',
          tasks: [
            { id: 'w4d3t1', task: 'Build management dashboard', detail: 'Google Sheets with tabs: SEO metrics, outreach stats, content calendar, pipeline.', time: '2 hrs' },
            { id: 'w4d3t2', task: 'Connect all pipelines to dashboard', detail: 'Each script writes completion metrics to the tracking sheet.', time: '1 hr' },
          ],
        },
      ],
    },
    {
      week: 'Month 2',
      title: 'Scale and Authority',
      color: '#3b82f6',
      days: [
        {
          day: 'Week 5-6',
          tasks: [
            { id: 'm2w1t1', task: 'Publish first consulting-grade report', detail: 'Clone consulting-report-framework. Pick topic. Agent drafts 12 sections. Generate charts. Compile PDF.', time: '8-10 hrs' },
            { id: 'm2w1t2', task: 'Deploy competitive intelligence scripts', detail: 'Pricing page monitor, careers page scraper, changelog reader. Schedule daily via cron.', time: '4 hrs' },
          ],
        },
        {
          day: 'Week 7-8',
          tasks: [
            { id: 'm2w2t1', task: 'Deploy customer support automation', detail: 'Connect inbox to AI triage. Build Tier 0 auto-responses. Set up draft queue for Tier 1.', time: '6 hrs' },
            { id: 'm2w2t2', task: 'Scale outreach to 50+ sends/day', detail: 'Warm up domain. Add second sending domain if needed. Expand lead lists.', time: '2 hrs' },
            { id: 'm2w2t3', task: 'Optimize for AEO/GEO', detail: 'Restructure top 10 pages with question-format H2s. Add FAQ schema. Publish llms-full.txt.', time: '4 hrs' },
          ],
        },
      ],
    },
    {
      week: 'Month 3',
      title: 'Full Automation',
      color: '#10b981',
      days: [
        {
          day: 'Week 9-10',
          tasks: [
            { id: 'm3w1t1', task: 'Build internal knowledge base', detail: 'Index Google Docs, Slack channels, meeting transcripts. Deploy query interface.', time: '6 hrs' },
            { id: 'm3w1t2', task: 'Set up meeting transcription pipeline', detail: 'Whisper for transcription. Agent extracts action items. Posts to Slack.', time: '3 hrs' },
          ],
        },
        {
          day: 'Week 11-12',
          tasks: [
            { id: 'm3w2t1', task: 'Build proposal generation pipeline', detail: 'Form input -> agent assembles case studies + pricing + scope -> PDF output.', time: '4 hrs' },
            { id: 'm3w2t2', task: 'Audit and iterate all pipelines', detail: 'Review metrics. Kill underperforming automations. Double down on what works.', time: '4 hrs' },
            { id: 'm3w2t3', task: 'Document all systems', detail: 'Write runbooks for each pipeline. Ensure any team member can maintain them.', time: '3 hrs' },
          ],
        },
      ],
    },
  ];

  const totalTasks = weeks.flatMap(w => w.days.flatMap(d => d.tasks)).length;
  const completedTasks = Object.values(checked).filter(Boolean).length;

  return (
    <div className="not-prose my-8 first:mt-0 last:mb-0">
      <div className="rounded-lg border border-border/50 bg-secondary/20 p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary/70">90-Day Implementation Checklist</div>
          <div className="text-xs text-muted-foreground">
            {completedTasks}/{totalTasks} tasks
          </div>
        </div>
        <div className="w-full bg-secondary/60 rounded-full h-2 mb-6">
          <div
            className="h-2 rounded-full transition-all duration-500 bg-green-500"
            style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
          />
        </div>
        <div className="space-y-6">
          {weeks.map((week) => (
            <details key={week.week} className="group">
              <summary className="cursor-pointer flex items-center gap-3 py-2 select-none">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: week.color }} />
                <span className="text-sm font-semibold text-foreground">{week.week}</span>
                <span className="text-xs text-muted-foreground">{week.title}</span>
                <svg className="w-4 h-4 text-muted-foreground/50 ml-auto transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </summary>
              <div className="pl-5 space-y-4 mt-2">
                {week.days.map((day) => (
                  <div key={day.day}>
                    <div className="text-xs font-mono font-semibold text-muted-foreground mb-2">{day.day}</div>
                    <div className="space-y-2">
                      {day.tasks.map((task) => (
                        <label
                          key={task.id}
                          className="flex items-start gap-3 rounded-md bg-background/50 border border-border/30 px-3 py-2.5 cursor-pointer hover:bg-background/80 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={!!checked[task.id]}
                            onChange={() => toggle(task.id)}
                            className="mt-0.5 rounded border-border"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-sm font-medium ${checked[task.id] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {task.task}
                              </span>
                              <span className="text-[10px] font-mono text-muted-foreground/60 flex-shrink-0">{task.time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{task.detail}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Social Listening + Competitive Intel Map ─── */
export function SocialListeningMap() {
  const channels = [
    { source: 'Twitter/X', what: 'Brand mentions, competitor launches, industry keywords', frequency: 'Real-time', color: '#3b82f6' },
    { source: 'Reddit + HN', what: 'Product discussions, feature requests, sentiment', frequency: 'Hourly', color: '#f59e0b' },
    { source: 'LinkedIn', what: 'Competitor content, key hires, thought leadership', frequency: 'Daily', color: '#0077b5' },
    { source: 'Competitor sites', what: 'Pricing changes, changelog updates, job postings', frequency: 'Daily', color: '#ef4444' },
    { source: 'App store reviews', what: 'User complaints, feature gaps, satisfaction trends', frequency: 'Weekly', color: '#10b981' },
    { source: 'Patent filings', what: 'Technical direction changes, IP strategy shifts', frequency: 'Monthly', color: '#8b5cf6' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Intelligence Collection Matrix</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">What to monitor, where, and how often</p>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[480px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Source</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">What to track</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Frequency</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((c) => (
                <tr key={c.source} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 font-bold" style={{ color: c.color }}>{c.source}</td>
                  <td className="py-2.5 px-2 text-muted-foreground">{c.what}</td>
                  <td className="py-2.5 px-2"><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#f7f6f3] dark:bg-zinc-800/40 text-[#37352f] dark:text-[rgba(255,255,255,0.65)]">{c.frequency}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

/* ─── Support Tiers ─── */
export function SupportTierChart() {
  const tiers = [
    { tier: 'Tier 0', name: 'Fully Automated', desc: 'FAQ-style questions with documented answers', volume: '40-50%', human: 'None', color: '#10b981' },
    { tier: 'Tier 1', name: 'Draft + Review', desc: 'Known patterns, agent drafts response', volume: '30-40%', human: 'Review only', color: '#3b82f6' },
    { tier: 'Tier 2', name: 'Human + Context', desc: 'Complex issues requiring judgment calls', volume: '10-20%', human: 'Full response', color: '#f59e0b' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Customer Support Automation Tiers</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Progressive automation from full AI to human-led</p>
        <div className="space-y-3">
          {tiers.map((t) => {
            const pct = t.tier === 'Tier 0' ? 90 : t.tier === 'Tier 1' ? 60 : 30;
            return (
              <div key={t.tier} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderLeftWidth: '3px', borderLeftColor: t.color }}>
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-xs font-bold" style={{ color: t.color }}>{t.tier}: {t.name}</span>
                      <span className="text-[10px] text-muted-foreground ml-2">{t.desc}</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground/60">{t.volume} of tickets</span>
                  </div>
                  <div className="w-full h-4 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden mt-1">
                    <div className="h-full rounded-md flex items-center pl-2" style={{ width: `${pct}%`, backgroundColor: t.color, opacity: 0.7 }}>
                      <span className="text-[9px] font-bold text-white/90">AI: {pct}%</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">Human involvement: {t.human}</div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Target: 40-60% of tickets resolved without human involvement within 3 months of deployment.
        </p>
      </div>
    </figure>
  );
}

/* ─── Dashboard Metrics ─── */
export function DashboardMetricsMap() {
  const categories = [
    { name: 'Content', metrics: ['Posts published', 'Impressions', 'Engagement rate'], color: '#a855f7' },
    { name: 'SEO', metrics: ['Search impressions', 'Clicks', 'Avg. position'], color: '#3b82f6' },
    { name: 'Outreach', metrics: ['Emails sent', 'Open rate', 'Reply rate'], color: '#ef4444' },
    { name: 'Pipeline', metrics: ['Leads captured', 'Nurture stage', 'Conversion rate'], color: '#f59e0b' },
    { name: 'Support', metrics: ['Tickets received', 'Deflection rate', 'Avg. resolution time'], color: '#10b981' },
    { name: 'Infrastructure', metrics: ['Agent uptime', 'Pipeline success rate', 'API costs'], color: '#6b7280' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Management Dashboard Blueprint</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Six categories of metrics to track across all pipelines</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((c) => (
            <div key={c.name} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderTopWidth: '3px', borderTopColor: c.color }}>
              <div className="p-3">
                <span className="text-xs font-bold" style={{ color: c.color }}>{c.name}</span>
                <div className="mt-2">
                  {c.metrics.map((m) => (
                    <div key={m} className="text-[10px] text-muted-foreground py-0.5 border-b border-[#e3e3e0]/30 dark:border-zinc-800/30 last:border-0">{m}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Use Case Catalog ─── */
export function UseCaseCatalog() {
  const departments = [
    { dept: 'Hiring', cases: 4, examples: 'Resume screening, candidate sourcing, interview scheduling', color: '#3b82f6' },
    { dept: 'Finance', cases: 4, examples: 'Invoice processing, expense categorization, investor updates', color: '#10b981' },
    { dept: 'Legal', cases: 3, examples: 'Contract review, compliance monitoring, policy updates', color: '#8b5cf6' },
    { dept: 'Product/Eng', cases: 5, examples: 'Code review, test generation, bug triage, documentation', color: '#ef4444' },
    { dept: 'Localization', cases: 2, examples: 'Multi-language content, market-specific adaptation', color: '#f59e0b' },
    { dept: 'Ads', cases: 3, examples: 'Copy generation, budget optimization, landing pages', color: '#f97316' },
    { dept: 'Podcast/Video', cases: 3, examples: 'Transcripts, clip generation, multi-platform distribution', color: '#a855f7' },
    { dept: 'Customer Success', cases: 3, examples: 'Usage monitoring, churn prevention, NPS analysis', color: '#0ea5e9' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">AI Use Case Catalog</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">27+ additional automations organized by department</p>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[420px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Department</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Use cases</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Examples</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((d) => (
                <tr key={d.dept} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 font-bold" style={{ color: d.color }}>{d.dept}</td>
                  <td className="py-2.5 px-2 text-center"><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#f7f6f3] dark:bg-zinc-800/40 text-[#37352f] dark:text-[rgba(255,255,255,0.65)]">{d.cases}</span></td>
                  <td className="py-2.5 px-2 text-muted-foreground">{d.examples}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-[3px] bg-[#f7f6f3] dark:bg-zinc-800/40 px-4 py-2.5 text-center">
          <span className="text-xs font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Total: {departments.reduce((acc, d) => acc + d.cases, 0)} use cases</span>
          <span className="text-[10px] text-muted-foreground ml-2">Every one follows the same pattern: identify, define inputs/outputs, automate 80%, route 20% to humans</span>
        </div>
      </div>
    </figure>
  );
}

'use client';

import React from 'react';

/* ─── UI Complexity Comparison ─── */
export function UIComplexityComparison() {
  const data = [
    { task: 'Find user drop-off by country', old: '7 clicks, 3 nested menus, SQL knowledge', new: '1 natural language prompt', timeOld: 180, timeNew: 10 },
    { task: 'Refactor auth module + run tests', old: 'Navigate 12 files, manual terminal, review diffs', new: '1 text instruction to agent', timeOld: 3600, timeNew: 300 },
    { task: 'Draft 50 personalized sales emails', old: 'Export CRM → spreadsheet → mail merge → review', new: '1 prompt with CRM context', timeOld: 2400, timeNew: 120 },
    { task: 'Generate quarterly board report', old: 'Request from analyst → 3-day wait → iterate', new: '1 prompt across connected APIs', timeOld: 14400, timeNew: 180 },
    { task: 'Screen 200 job applications', old: 'Manual review per resume, 2-3 min each', new: 'Automated RAG ranking + summary', timeOld: 36000, timeNew: 1800 },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Dashboard Interface vs Text Interface</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Task friction comparison across five common enterprise workflows</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Task</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Traditional UI</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Text + Agent</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Reduction</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.task} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{d.task}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{d.old}</td>
                  <td className="py-2.5 px-2 font-bold text-primary">{d.new}</td>
                  <td className="py-2.5 px-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400">
                      ~{Math.round(((d.timeOld - d.timeNew) / d.timeOld) * 100)}% faster
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: GitHub (2025), Salesforce Agentforce metrics (2026), PostHog internal benchmarks. Time estimates based on published case studies.
        </p>
      </div>
    </figure>
  );
}

/* ─── API Abstraction Stack ─── */
export function APIAbstractionLayer() {
  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The New Control Stack</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">How natural language replaces navigation logic</p>

        <div className="flex flex-col gap-2">
          <div className="rounded border border-primary bg-primary/10 p-3 text-center font-bold text-primary text-sm">
            Intent Layer (Natural Language Text Field)
          </div>
          <div className="mx-auto h-4 border-l-2 border-dashed border-[#e3e3e0] dark:border-zinc-700"></div>
          <div className="rounded border border-[#e3e3e0] dark:border-zinc-700 bg-[#f7f6f3] dark:bg-zinc-800/40 p-3 text-center text-xs font-semibold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">
            AI Agent / LLM Translation Layer (MCP, Tool Use, Function Calling)
          </div>
          <div className="mx-auto h-4 border-l-2 border-dashed border-[#e3e3e0] dark:border-zinc-700"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="rounded border border-[#e3e3e0] dark:border-zinc-700 p-2 text-center text-[10px] font-medium font-mono text-muted-foreground">Analytics DB<br/><span className="text-primary">PostHog / Amplitude</span></div>
            <div className="rounded border border-[#e3e3e0] dark:border-zinc-700 p-2 text-center text-[10px] font-medium font-mono text-muted-foreground">CRM System<br/><span className="text-primary">Salesforce / HubSpot</span></div>
            <div className="rounded border border-[#e3e3e0] dark:border-zinc-700 p-2 text-center text-[10px] font-medium font-mono text-muted-foreground">Financial Data<br/><span className="text-primary">Stripe / QuickBooks</span></div>
            <div className="rounded border border-[#e3e3e0] dark:border-zinc-700 p-2 text-center text-[10px] font-medium font-mono text-muted-foreground">Codebase<br/><span className="text-primary">GitHub / IDE Agents</span></div>
          </div>
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          The user expresses intent once. The translation layer decomposes the request into multiple API calls, executes them, and synthesizes the result. No menu navigation required.
        </p>
      </div>
    </figure>
  );
}

/* ─── Enterprise Adoption of Text-First Interfaces ─── */
export function TextUIAdoption() {
  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Text-First Interface Adoption</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Enterprise platforms shipping natural language as primary control, 2024-2026</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4">
            <div className="text-2xl font-bold text-primary">90%</div>
            <div className="text-[10px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1 uppercase">Fortune 100 on Copilot</div>
            <div className="text-[10px] text-muted-foreground mt-2">GitHub, Jul 2025</div>
          </div>
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4">
            <div className="text-2xl font-bold text-primary">12,000+</div>
            <div className="text-[10px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1 uppercase">Agentforce Orgs</div>
            <div className="text-[10px] text-muted-foreground mt-2">Salesforce, Q1 2026</div>
          </div>
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4">
            <div className="text-2xl font-bold text-primary">93%</div>
            <div className="text-[10px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1 uppercase">Want NL Data Queries</div>
            <div className="text-[10px] text-muted-foreground mt-2">Salesforce survey</div>
          </div>
          <div className="rounded-[3px] border border-primary/30 bg-primary/5 p-4">
            <div className="text-2xl font-bold text-primary">46%</div>
            <div className="text-[10px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1 uppercase">Code Written by Copilot</div>
            <div className="text-[10px] text-muted-foreground mt-2">GitHub avg across users</div>
          </div>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: GitHub Copilot (2025), Salesforce Agentforce (2026), Salesforce executive survey.
        </p>
      </div>
    </figure>
  );
}

/* ─── Platform Shift Timeline ─── */
export function PlatformShiftTimeline() {
  const events = [
    { date: 'Nov 2022', title: 'ChatGPT launches', desc: 'Proves natural language can replace search and form-filling for information retrieval.' },
    { date: 'Mar 2023', title: 'GitHub Copilot Chat', desc: 'Developers begin asking questions about code instead of reading documentation manually.' },
    { date: 'Nov 2024', title: 'MCP by Anthropic', desc: 'Standardizes how LLMs connect to external tools. The text field gains access to live APIs.' },
    { date: 'Sep 2025', title: 'Salesforce Agentforce GA', desc: '12,000+ orgs adopt agentic CRM. 380,000 conversations handled with 84% self-resolution.' },
    { date: 'Jan 2026', title: 'PostHog AI ships', desc: 'Product analytics moves from click-to-query to type-to-query. HogQL generated from English.' },
    { date: 'Mar 2026', title: 'Antigravity IDE', desc: 'Google ships agent-first IDE. Developers orchestrate parallel agents from a text interface.' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Text Field Takeover</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Key moments in the shift from navigation to natural language, 2022-2026</p>

        <div className="relative pl-6 border-l-2 border-[#e3e3e0] dark:border-zinc-700">
          {events.map((e, i) => (
            <div key={i} className="mb-5 last:mb-0 relative">
              <div className="absolute -left-[1.6rem] top-1 w-3 h-3 rounded-full bg-primary border-2 border-white dark:border-zinc-900" />
              <div className="text-[10px] font-bold text-primary uppercase tracking-wider">{e.date}</div>
              <div className="text-xs font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] mt-0.5">{e.title}</div>
              <div className="text-xs text-[#37352f]/70 dark:text-[rgba(255,255,255,0.55)] mt-0.5 leading-relaxed">{e.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

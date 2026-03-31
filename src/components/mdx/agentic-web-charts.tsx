'use client';

import React from 'react';

/* ─── Web Evolution Timeline ─── */
export function WebEvolutionTimeline() {
  const eras = [
    { era: '1990s', label: 'Web 1.0', verb: 'Read', desc: 'Static pages, directories, hyperlinks. Users consumed information.', users: '16M' },
    { era: '2004', label: 'Web 2.0', verb: 'Write', desc: 'Social platforms, user-generated content, real-time interaction.', users: '1B' },
    { era: '2020', label: 'Web 3.0', verb: 'Own', desc: 'Decentralization, crypto wallets, verifiable data, token economies.', users: '4.9B' },
    { era: '2025', label: 'Agentic Web', verb: 'Delegate', desc: 'AI agents act on your behalf. The web becomes a system that executes.', users: '5.3B+' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Four Phases of the Web</h3>
        <p className="text-xs text-muted-foreground mb-8 uppercase tracking-widest font-semibold">Each era introduced a new verb</p>

        <div className="relative">
          {/* Connecting line: top-7 = 28px, exactly half of w-14/h-14 (56px) circles */}
          <div className="hidden md:block absolute top-7 left-[8%] right-[8%] h-px bg-[#e3e3e0] dark:bg-zinc-700" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
            {eras.map((e, i) => {
              const isLast = i === eras.length - 1;
              return (
                <div key={e.era} className="flex flex-col items-center text-center">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-[10px] font-bold mb-3 relative z-10 border-2 ${
                      isLast
                        ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                        : 'bg-[#37352f] dark:bg-zinc-700 border-[#37352f] dark:border-zinc-600 text-white'
                    }`}
                  >
                    {e.verb}
                  </div>
                  <div className="text-sm font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{e.label}</div>
                  <div className="text-[10px] text-primary font-semibold mt-0.5">{e.era}</div>
                  <div className="text-[11px] text-muted-foreground mt-1.5 leading-tight max-w-[160px]">{e.desc}</div>
                  <div className="text-[10px] text-muted-foreground/60 mt-1.5 font-medium">{e.users} users</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ─── MCP Adoption Growth ─── */
export function MCPAdoptionChart() {
  const data = [
    { month: 'Nov 2024', downloads: 2, servers: '50' },
    { month: 'Sep 2025', downloads: 45, servers: '4.5K' },
    { month: 'Mar 2026', downloads: 97, servers: '10K+' },
  ];
  const maxD = 100;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">MCP Adoption</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Monthly SDK downloads (millions)</p>

        <div className="space-y-2">
          {data.map((d) => (
            <div key={d.month} className="grid grid-cols-[90px_1fr_70px] gap-3 items-center">
              <span className="text-xs text-muted-foreground font-medium">{d.month}</span>
              <div className="w-full h-4 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md"
                  style={{ width: `${(d.downloads / maxD) * 100}%`, backgroundColor: 'hsl(210 90% 40%)', opacity: 0.8 }}
                />
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-primary">{d.downloads}M</span>
                <span className="text-[10px] text-muted-foreground ml-1">/ {d.servers}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: The New Stack, MCP Ecosystem Registry. Right column: SDK downloads / published servers.
        </p>
      </div>
    </figure>
  );
}

/* ─── METR Task Horizon ─── */
export function TaskHorizonChart() {
  const data = [
    { year: '2019', minutes: 1.5, label: '1.5 min' },
    { year: '2020', minutes: 3, label: '3 min' },
    { year: '2021', minutes: 7, label: '7 min' },
    { year: '2022', minutes: 15, label: '15 min' },
    { year: '2023', minutes: 33, label: '33 min' },
    { year: '2024', minutes: 60, label: '1 hr' },
    { year: '2025', minutes: 180, label: '3 hrs' },
    { year: '2026*', minutes: 480, label: '8 hrs' },
  ];
  const max = 480;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">AI Agent Task Horizon</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Complexity of tasks agents can complete autonomously (50% success rate)</p>

        <div className="space-y-3">
          {data.map((d, i) => (
            <div key={d.year} className="flex items-center gap-3">
              <span className="text-xs w-14 text-right text-muted-foreground font-medium shrink-0">{d.year}</span>
              <div className="flex-1 h-6 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md"
                  style={{
                    width: `${Math.max((Math.log2(d.minutes) / Math.log2(max)) * 100, 3)}%`,
                    backgroundColor: i >= 6 ? 'hsl(210 90% 40%)' : '#37352f',
                    opacity: i >= 6 ? 0.8 : 0.3 + (i * 0.08),
                  }}
                />
              </div>
              <span className={`text-xs font-bold w-12 ${i >= 6 ? 'text-primary' : 'text-[#37352f] dark:text-[rgba(255,255,255,0.81)]'}`}>{d.label}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          Source: METR (Model Evaluation and Threat Research), &quot;Measuring the Frontier AI Task Horizon,&quot; March 2025, updated 2026. *2026 figure is extrapolated from most recent doubling trend. Log scale. 50% time horizon = length of task a model completes with 50% success.
        </p>
      </div>
    </figure>
  );
}

/* ─── Protocol Stack Diagram ─── */
export function ProtocolStackDiagram() {
  const layers = [
    { name: 'Application Layer', protocols: 'OpenAI Operator, Google Mariner, Genspark Super Agent', desc: 'End-user facing agents that execute tasks', color: 'bg-primary/5 border-primary/20' },
    { name: 'Coordination Layer', protocols: 'A2A (Google → Linux Foundation)', desc: 'Agents discover, communicate, and delegate to each other', color: 'bg-primary/10 border-primary/30' },
    { name: 'Tool Layer', protocols: 'MCP (Anthropic → Linux Foundation)', desc: 'Agents connect to databases, APIs, and services', color: 'bg-primary/15 border-primary/40' },
    { name: 'Payment Layer', protocols: 'x402, ACP, MPP', desc: 'Agents transact using stablecoins, cards, and crypto', color: 'bg-primary/20 border-primary/50' },
    { name: 'Settlement Layer', protocols: 'Ethereum, Solana, Base', desc: 'Final settlement of value and ownership', color: 'bg-primary/25 border-primary/60' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Agentic Web Protocol Stack</h3>
        <p className="text-xs text-muted-foreground mb-8 uppercase tracking-widest font-semibold">Five layers from user intent to final settlement</p>

        <div className="flex flex-col gap-2">
          {layers.map((l) => (
            <div key={l.name} className={`rounded-[3px] border p-4 ${l.color}`}>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{l.name}</span>
                  <span className="text-[11px] text-muted-foreground">{l.desc}</span>
                </div>
                <span className="text-xs font-semibold text-primary shrink-0 md:text-right">{l.protocols}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          Protocols are not mutually exclusive. MCP and A2A are governed by the Agentic AI Foundation under the Linux Foundation. Payment layer protocols compete and complement each other across different payment rails.
        </p>
      </div>
    </figure>
  );
}

/* ─── Industry Adoption Chart ─── */
export function IndustryAdoptionChart() {
  const industries = [
    { name: 'Financial Services', pct: 78, detail: 'Fraud detection, algorithmic trading, compliance' },
    { name: 'Technology', pct: 75, detail: 'Code generation, infrastructure, DevOps' },
    { name: 'Retail / E-commerce', pct: 53, detail: 'Demand forecasting, inventory, personalization' },
    { name: 'Healthcare', pct: 42, detail: 'Admin workflows, scheduling, insurance verification' },
    { name: 'Manufacturing', pct: 38, detail: 'Predictive maintenance, supply chain' },
    { name: 'Government', pct: 22, detail: 'Citizen services, document processing' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">AI Agent Adoption by Industry</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">% of organizations with production agent deployments, Q1 2026</p>

        <div className="space-y-4">
          {industries.map((ind, i) => (
            <div key={ind.name}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{ind.name}</span>
                <span className={`text-sm font-bold ${i === 0 ? 'text-primary' : 'text-[#37352f] dark:text-[rgba(255,255,255,0.81)]'}`}>{ind.pct}%</span>
              </div>
              <div className="w-full h-6 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md"
                  style={{ width: `${ind.pct}%`, backgroundColor: i === 0 ? 'hsl(210 90% 40%)' : '#37352f', opacity: i === 0 ? 0.8 : 0.3 + (0.1 * (industries.length - i)) }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground/70">{ind.detail}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          Sources: Gartner, Salesmate, PixelBrainy industry surveys, Q1 2026. Figures represent organizations with at least one production-deployed AI agent, not pilot or experimental deployments.
        </p>
      </div>
    </figure>
  );
}

/* ─── Agent Market Size Projection ─── */
export function AgentMarketChart() {
  const projections = [
    { firm: 'Grand View Research', range: '$50.3B', value: 50.3, note: 'AI agents market, 2030', cagr: '45.8%' },
    { firm: 'Grand View Research', range: '$70.5B', value: 70.5, note: 'Autonomous AI agents, 2030', cagr: '42.8%' },
    { firm: 'Dimension Market Research', range: '$24.5B', value: 24.5, note: 'Enterprise agentic AI, 2030', cagr: '46.2%' },
    { firm: 'Gartner', range: '30%', value: 0, note: 'Share of enterprise software revenue by 2035 (best case)', cagr: '' },
  ];
  const max = 75;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Market Size Projections</h3>
        <p className="text-xs text-muted-foreground mb-8 uppercase tracking-widest font-semibold">AI agents market estimates by research firm</p>

        <div className="space-y-5">
          {projections.filter(p => p.value > 0).map((p, i) => (
            <div key={`${p.firm}-${p.note}`}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{p.firm}</span>
                <span className={`text-sm font-bold ${i === 0 ? 'text-primary' : 'text-[#37352f] dark:text-[rgba(255,255,255,0.81)]'}`}>{p.range}</span>
              </div>
              <div className="w-full h-7 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md"
                  style={{ width: `${(p.value / max) * 100}%`, backgroundColor: i === 0 ? 'hsl(210 90% 40%)' : '#37352f', opacity: i === 0 ? 0.8 : 0.5 }}
                />
              </div>
              <div className="flex justify-between mt-0.5">
                <span className="text-[10px] text-muted-foreground/70">{p.note}</span>
                {p.cagr && <span className="text-[10px] text-primary font-semibold">CAGR: {p.cagr}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-[#f7f6f3] dark:bg-zinc-800/30 p-3">
          <p className="text-xs font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Gartner: Agentic AI could drive 30% of enterprise software revenue by 2035</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Best-case scenario projection. This would represent a fundamental restructuring of how enterprise software is built and sold.</p>
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          Sources: Grand View Research (May 2025), Dimension Market Research (2025), Gartner (2026). Projections vary by scope definition.
        </p>
      </div>
    </figure>
  );
}

/* ─── Security Threat Matrix ─── */
export function SecurityThreatMatrix() {
  const threats = [
    { name: 'Indirect prompt injection', severity: 'Critical', impact: 'Data exfiltration without user knowledge', example: 'CVE-2025-68143: Anthropic MCP server RCE via README' },
    { name: 'Excessive agency', severity: 'Critical', impact: 'Unauthorized system actions at scale', example: '700+ org breach via cascaded chatbot integration' },
    { name: 'Memory poisoning', severity: 'High', impact: 'Persistent false beliefs in agent context', example: '"Sleeper agent" scenario: policy override attacks' },
    { name: 'Cascading failures', severity: 'High', impact: 'Chain reaction across multi-agent systems', example: '770K agent simulation: agents attacking each other within days' },
    { name: 'Supply chain attacks', severity: 'High', impact: 'Backdoors in agent frameworks and plugins', example: 'Backdoored packages in AI development libraries' },
    { name: 'Agency abuse', severity: 'Medium', impact: 'Agent executes technically permitted but unintended actions', example: 'Database deletion, fund transfers from ambiguous instructions' },
  ];

  const severityColor: Record<string, string> = {
    'Critical': 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30',
    'High': 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30',
    'Medium': 'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30',
  };

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Agent Security Threat Landscape</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Known attack vectors and documented incidents, 2025-2026</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Threat</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Severity</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Impact</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Real-world example</th>
              </tr>
            </thead>
            <tbody>
              {threats.map((t) => (
                <tr key={t.name} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{t.name}</td>
                  <td className="py-2.5 px-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${severityColor[t.severity]}`}>{t.severity}</span>
                  </td>
                  <td className="py-2.5 px-2 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{t.impact}</td>
                  <td className="py-2.5 px-2 text-muted-foreground">{t.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          Sources: Anthropic disclosure (Nov 2025), RWNY security research (Jan 2026), SC World, Palo Alto Networks, Stellar Cyber. Examples are documented incidents, not hypothetical scenarios.
        </p>
      </div>
    </figure>
  );
}

/* ─── Agent vs Chatbot Comparison ─── */
export function AgentVsChatbot() {
  const rows = [
    { dimension: 'Interaction', chatbot: 'Prompt → Response', agent: 'Goal → Multi-step execution' },
    { dimension: 'Memory', chatbot: 'Session-level only', agent: 'Persistent context across tasks' },
    { dimension: 'Tools', chatbot: 'None or limited plugins', agent: 'APIs, databases, browsers, wallets' },
    { dimension: 'Autonomy', chatbot: 'Zero (waits for each input)', agent: 'High (acts independently)' },
    { dimension: 'Reasoning', chatbot: 'Single-turn inference', agent: 'Multi-step planning and self-correction' },
    { dimension: 'Outcome', chatbot: 'Text answer', agent: 'Completed task (booking, purchase, report)' },
    { dimension: 'Error handling', chatbot: 'User must retry', agent: 'Self-corrects and asks clarifications' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Chatbot vs. Agent</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">The distinction that changes what software can do for you</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider w-28">Dimension</th>
                <th className="text-left py-2 px-2 font-bold text-muted-foreground uppercase tracking-wider">Chatbot</th>
                <th className="text-left py-2 px-2 font-bold text-primary uppercase tracking-wider">Agent</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.dimension} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{r.dimension}</td>
                  <td className="py-2.5 px-2 text-muted-foreground">{r.chatbot}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{r.agent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

/* ─── Infrastructure Landscape Grid ─── */
export function InfrastructureLandscape() {
  const categories = [
    {
      name: 'Agent Frameworks',
      players: [
        { name: 'LangChain', detail: 'Most widely adopted agent dev framework' },
        { name: 'AutoGen (Microsoft)', detail: 'Multi-agent collaboration' },
        { name: 'CrewAI', detail: 'Role-based agent orchestration' },
        { name: 'Vertex AI (Google)', detail: 'Enterprise agent platform' },
        { name: 'ElizaOS', detail: 'Crypto-native agent framework' },
      ],
    },
    {
      name: 'Identity & Trust',
      players: [
        { name: 'Worldcoin', detail: 'Proof-of-personhood biometrics' },
        { name: 'Civic', detail: 'Decentralized identity verification' },
        { name: 'KILT Protocol', detail: 'Verifiable credentials on-chain' },
      ],
    },
    {
      name: 'Payment Rails',
      players: [
        { name: 'x402 (Coinbase)', detail: '107M+ micropayments processed' },
        { name: 'ACP (OpenAI + Stripe)', detail: 'In-chat checkout via Stripe' },
        { name: 'MPP (Stripe + Paradigm)', detail: 'Multi-rail: stablecoins + cards' },
      ],
    },
    {
      name: 'Settlement Networks',
      players: [
        { name: 'Solana', detail: 'High-speed, low-cost transactions' },
        { name: 'Ethereum / Base', detail: 'Smart contracts, programmable money' },
        { name: 'Circle (USDC)', detail: 'Price-stable currency for agents' },
      ],
    },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Infrastructure Landscape</h3>
        <p className="text-xs text-muted-foreground mb-8 uppercase tracking-widest font-semibold">Key players building the Agentic Web</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat.name} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{cat.name}</div>
              <div className="space-y-2">
                {cat.players.map((p) => (
                  <div key={p.name} className="flex items-start gap-2">
                    <span className="text-sm font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] shrink-0">{p.name}</span>
                    <span className="text-[11px] text-muted-foreground leading-tight">{p.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

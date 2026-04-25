'use client';

import React from 'react';

/* ─── API Traffic vs Human Traffic ─── */
export function ApiTrafficChart() {
  const data = [
    { year: '2019', human: 63, machine: 37 },
    { year: '2021', human: 58, machine: 42 },
    { year: '2023', human: 52, machine: 48 },
    { year: '2024', human: 49, machine: 51 },
    { year: '2025', human: 45, machine: 55 },
    { year: '2028E', human: 35, machine: 65 },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Global Internet Traffic Composition</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Human browser traffic vs machine-to-machine API traffic</p>

        <div className="space-y-3">
          {data.map((d) => (
            <div key={d.year} className="grid grid-cols-[55px_1fr] gap-3 items-center">
              <span className="text-xs text-muted-foreground font-medium">{d.year}</span>
              <div className="w-full h-6 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden flex">
                <div
                  className="h-full rounded-l-md flex items-center justify-end pr-1.5"
                  style={{ width: `${d.human}%`, backgroundColor: 'hsl(210 90% 40%)', opacity: 0.35 }}
                >
                  <span className="text-[9px] font-bold text-white/80">{d.human}%</span>
                </div>
                <div
                  className="h-full rounded-r-md flex items-center pl-1.5"
                  style={{ width: `${d.machine}%`, backgroundColor: 'hsl(210 90% 40%)' }}
                >
                  <span className="text-[9px] font-bold text-white">{d.machine}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(210 90% 40%)', opacity: 0.35 }} />
            <span className="text-[10px] text-muted-foreground font-medium">Human (browser)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'hsl(210 90% 40%)' }} />
            <span className="text-[10px] text-muted-foreground font-medium">Machine (API/M2M)</span>
          </div>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: Imperva Bad Bot Report (2025): 51% automated traffic in 2024. Thales/Imperva historical data (2019-2023). 2028E is author projection.
        </p>
      </div>
    </figure>
  );
}

/* ─── Zero-UI Market Map ─── */
export function ZeroUIMarketMap() {
  const layers = [
    {
      name: 'Protocol Layer',
      desc: 'Standards for agent-to-service and agent-to-agent communication',
      color: 'hsl(210 90% 40%)',
      companies: ['Anthropic (MCP)', 'Google (A2A)', 'Google (UCP)', 'OpenAI (ACP)', 'Coinbase (x402)', 'Stripe (MPP)', 'LangChain (LangGraph)', 'CrewAI', 'Microsoft (AutoGen)'],
    },
    {
      name: 'Headless Commerce Engines',
      desc: 'API-first platforms exposing 100% functionality without a frontend',
      color: 'hsl(160 80% 35%)',
      companies: ['Commercetools', 'Fabric', 'Shopify (Storefront API)', 'BigCommerce', 'Medusa', 'Saleor', 'Elastic Path', 'Spryker'],
    },
    {
      name: 'AEO & Semantic Analytics',
      desc: 'Optimizing brand data for LLM ingestion instead of human SEO',
      color: 'hsl(280 60% 45%)',
      companies: ['Yext', 'Schema App', 'Botify', 'seoClarity', 'BrightEdge', 'Profound (AI search analytics)', 'Perplexity Pages', 'Vectorize'],
    },
    {
      name: 'Identity & Execution',
      desc: 'Agentic wallets, ZKP attestation, and machine-native payments',
      color: 'hsl(30 80% 50%)',
      companies: ['Coinbase (Agentic Wallets)', 'Skyfire (KYAPay)', 'Privy', 'Dynamic', 'Crossmint', 'Circle (USDC rails)', 'Worldcoin (World ID)', 'Lit Protocol'],
    },
    {
      name: 'Edge Hardware & Ambient Sensors',
      desc: 'Post-smartphone form factors optimized for context, not screens',
      color: 'hsl(350 70% 45%)',
      companies: ['Apple (Secure Enclave)', 'Limitless', 'Humane', 'Oura', 'CTRL-labs (Meta)', 'Rabbit r1', 'Frame (AR glasses)', 'Qualcomm (on-device LLM)'],
    },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Zero-UI Market Map</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Five infrastructure layers powering the post-interface internet</p>

        <div className="space-y-4">
          {layers.map((layer) => (
            <div key={layer.name} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden">
              <div className="px-4 py-2 border-b border-[#e3e3e0] dark:border-zinc-800" style={{ backgroundColor: layer.color + '10' }}>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: layer.color }}>{layer.name}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">{layer.desc}</p>
              </div>
              <div className="px-4 py-3 flex flex-wrap gap-2">
                {layer.companies.map((c) => (
                  <span key={c} className="text-[11px] font-medium px-2 py-1 rounded-sm bg-[#f7f6f3] dark:bg-zinc-800/40 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Market map compiled from Artemis Analytics, Crunchbase, and public product announcements (Q1 2026).
        </p>
      </div>
    </figure>
  );
}

/* ─── SaaS Pricing Model Shift ─── */
export function SaaSPricingShift() {
  const models = [
    { model: 'Per-seat license', legacy: 'High', agentic: 'Collapses', reason: 'Agents reduce user count to 1' },
    { model: 'Freemium + upsell', legacy: 'Medium', agentic: 'Irrelevant', reason: 'No visual interface to upsell through' },
    { model: 'Usage-based (API calls)', legacy: 'Low', agentic: 'Dominant', reason: 'Agents transact via metered API endpoints' },
    { model: 'Execution-based (% of value)', legacy: 'Rare', agentic: 'Emerging', reason: 'Revenue tied to economic outcome generated' },
    { model: 'Data licensing (royalties)', legacy: 'Niche', agentic: 'Growing', reason: 'Creators monetize algorithmic influence' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">SaaS Pricing Model Transition</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">How software monetization shifts in the post-interface era</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Pricing model</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Legacy web</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Agent web</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Why</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m) => (
                <tr key={m.model} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{m.model}</td>
                  <td className="py-2.5 px-2"><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#f7f6f3] dark:bg-zinc-800/40 text-[#37352f] dark:text-[rgba(255,255,255,0.65)]">{m.legacy}</span></td>
                  <td className="py-2.5 px-2"><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${m.agentic === 'Dominant' || m.agentic === 'Emerging' || m.agentic === 'Growing' ? 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'}`}>{m.agentic}</span></td>
                  <td className="py-2.5 px-2 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{m.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Analysis based on OpenView Partners SaaS Benchmarks (2026), a16z infrastructure reports, and Y Combinator batch data.
        </p>
      </div>
    </figure>
  );
}

/* ─── Attention Economy Collapse ─── */
export function AttentionCollapseChart() {
  const metrics = [
    { metric: 'Display Ad CPM', before: '$12.50', after: '$0.80', decline: '-94%' },
    { metric: 'Organic CTR (Position 1)', before: '31.7%', after: '2.1%', decline: '-93%' },
    { metric: 'Email Open Rate (Marketing)', before: '21.5%', after: '4.2%', decline: '-80%' },
    { metric: 'Retargeting ROAS', before: '4.2x', after: '0.6x', decline: '-86%' },
    { metric: 'Avg. Product Page Views per Purchase', before: '8.3', after: '0', decline: '-100%' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Attention Economy Collapse</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Legacy marketing metrics in a Zero-UI world (projected)</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[460px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Metric</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Visual web</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Agent web</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => (
                <tr key={m.metric} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{m.metric}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{m.before}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{m.after}</td>
                  <td className="py-2.5 px-2"><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">{m.decline}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Projections based on Gartner zero-click search analysis (2026), eMarketer ad spend data, and Rand Fishkin/SparkToro click-stream research.
        </p>
      </div>
    </figure>
  );
}

/* ─── GUI Timeline ─── */
export function GUITimeline() {
  const eras = [
    { year: '1973', event: 'Xerox Alto', desc: 'First GUI: windows, icons, menus', type: 'gui' },
    { year: '1984', event: 'Macintosh', desc: 'GUI goes mass market via Apple', type: 'gui' },
    { year: '1993', event: 'Mosaic Browser', desc: 'HTML rendered visually for the first time', type: 'gui' },
    { year: '2007', event: 'iPhone', desc: 'Touch interface, the GUI goes mobile', type: 'gui' },
    { year: '2022', event: 'ChatGPT', desc: 'Text replaces clicks for complex tasks', type: 'transition' },
    { year: '2024', event: 'Bots > Humans', desc: 'Automated traffic hits 51% of all web traffic (Imperva)', type: 'agent' },
    { year: '2025', event: 'MCP / A2A launched', desc: 'Structured agent protocols replace HTML scraping', type: 'agent' },
    { year: '2028E', event: '33% enterprise software agentic', desc: 'Gartner: 33% of enterprise apps include agentic AI', type: 'agent' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Interface Arc: 1973–2028</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">From the first GUI to Zero-UI</p>

        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-[#e3e3e0] dark:bg-zinc-800" />
          <div className="space-y-4">
            {eras.map((e) => (
              <div key={e.year} className="grid grid-cols-[36px_1fr] gap-3 items-start">
                <div className="relative flex items-center justify-center">
                  <div className={`w-[9px] h-[9px] rounded-full border-2 ${e.type === 'agent' ? 'border-primary bg-primary' : e.type === 'transition' ? 'border-amber-500 bg-amber-500' : 'border-[#37352f] dark:border-zinc-400 bg-transparent'}`} />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-xs font-bold ${e.type === 'agent' ? 'text-primary' : 'text-[#37352f] dark:text-[rgba(255,255,255,0.81)]'}`}>{e.year}</span>
                    <span className="text-xs font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{e.event}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-[#37352f] dark:border-zinc-400" />
            <span className="text-[10px] text-muted-foreground font-medium">GUI era</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[10px] text-muted-foreground font-medium">Transition</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-[10px] text-muted-foreground font-medium">Agent era</span>
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ─── Frontend Investment Decline ─── */
export function FrontendDeclineChart() {
  const data = [
    { category: 'Frontend engineers', y2024: 100, y2026: 62, trend: '↓ 38%' },
    { category: 'UI/UX designers', y2024: 100, y2026: 71, trend: '↓ 29%' },
    { category: 'API / data engineers', y2024: 100, y2026: 185, trend: '↑ 85%' },
    { category: 'Agent protocol engineers', y2024: 100, y2026: 340, trend: '↑ 240%' },
    { category: 'A/B testing budget', y2024: 100, y2026: 45, trend: '↓ 55%' },
  ];
  const max = 340;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Capital Reallocation</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">YC-backed startup hiring trends, indexed to 2024 baseline = 100</p>

        <div className="space-y-2">
          {data.map((d) => {
            const isGrowing = d.y2026 > 100;
            return (
              <div key={d.category} className="grid grid-cols-[160px_1fr_55px] gap-3 items-center">
                <span className="text-xs text-muted-foreground font-medium truncate">{d.category}</span>
                <div className="w-full h-4 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                  <div
                    className="h-full rounded-md"
                    style={{
                      width: `${(d.y2026 / max) * 100}%`,
                      backgroundColor: isGrowing ? 'hsl(160 80% 35%)' : 'hsl(0 70% 50%)',
                      opacity: isGrowing ? 0.7 : 0.5,
                    }}
                  />
                </div>
                <span className={`text-xs font-bold text-right ${isGrowing ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{d.trend}</span>
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: Y Combinator batch analysis (W24-W26), Levels.fyi hiring data, a16z infrastructure hiring reports.
        </p>
      </div>
    </figure>
  );
}

/* ─── Hardware Pivot Comparison ─── */
export function HardwarePivotGrid() {
  const items = [
    { label: 'Primary Input', legacy: '6" OLED touch screen', zeroUI: 'Voice + ambient sensors' },
    { label: 'Primary Output', legacy: 'Visual pixels (60-120Hz)', zeroUI: 'Audio (bone conduction) + haptics' },
    { label: 'Processing', legacy: 'Cloud-rendered HTML/CSS', zeroUI: 'Edge LLM + cloud API routing' },
    { label: 'Identity', legacy: 'Passwords + CAPTCHA', zeroUI: 'ZKP + cryptographic attestation' },
    { label: 'Form Factor', legacy: 'Glass slab ($1,200)', zeroUI: 'Ring / earbuds / glasses ($200-400)' },
    { label: 'Always-on Context', legacy: 'No (screen must be active)', zeroUI: 'Yes (persistent biometric + audio)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Hardware Pivot</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Smartphone era vs Ambient computation era</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item) => (
            <div key={item.label} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3">
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-2">{item.label}</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[9px] font-bold text-red-500 dark:text-red-400 uppercase">Legacy</span>
                  <p className="text-[11px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-0.5">{item.legacy}</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-green-600 dark:text-green-400 uppercase">Zero-UI</span>
                  <p className="text-[11px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-0.5">{item.zeroUI}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: Apple product roadmap analysis (Bloomberg), Oura Gen 4 specs, Humane Ai Pin teardown (iFixit).
        </p>
      </div>
    </figure>
  );
}

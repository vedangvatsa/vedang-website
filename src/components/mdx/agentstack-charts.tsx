'use client';

import React from 'react';

/* ─── Funding by Infrastructure Layer (horizontal bar chart) ─── */
export function InfraFundingByLayer() {
  const data = [
    { layer: 'Compute & Inference', value: 4000, label: '$4B+', color: '#18181b' },
    { layer: 'Orchestration', value: 709, label: '$709M', color: '#18181b' },
    { layer: 'Vector / RAG', value: 312, label: '$312M', color: '#18181b' },
    { layer: 'Evaluation', value: 256, label: '$256M', color: '#18181b' },
    { layer: 'Security', value: 182, label: '$182M', color: '#18181b' },
    { layer: 'Perception', value: 87, label: '$87M', color: '#18181b' },
    { layer: 'Memory & State', value: 36, label: '$36M', color: '#18181b' },
    { layer: 'Sandboxed Execution', value: 32, label: '$32M', color: '#374151' },
  ];
  const max = 4200;

  return (
    <figure className="not-prose chart-card">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">Venture Capital by Infrastructure Layer</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Combined funding into agent infrastructure companies, as of mid-2026</p>

        <div className="space-y-3">
          {data.map((d) => (
            <div key={d.layer} className="grid grid-cols-[160px_1fr_70px] gap-3 items-center">
              <span className="text-xs text-[#37352f] font-medium truncate">{d.layer}</span>
              <div className="w-full h-5 bg-[#f7f6f3] rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md transition-all"
                  style={{ width: `${Math.max((d.value / max) * 100, 2)}%`, backgroundColor: d.color, opacity: 0.75 }}
                />
              </div>
              <span className="text-xs font-bold text-right text-[#37352f]">{d.label}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          Sources: Tracxn, PitchBook, company announcements (verified through mid-2026). Compute includes Together AI, Modal, Fireworks AI, Groq, Cerebras pre-IPO rounds.
        </p>
      </div>
    </figure>
  );
}

/* ─── Security Consolidation Timeline ─── */
export function SecurityConsolidation() {
  const events = [
    { date: 'Oct 2024', company: 'Robust Intelligence', acquirer: 'Cisco', amount: '~$400M est.', funding: '$44M raised' },
    { date: 'Sep 2025', company: 'Lakera', acquirer: 'Check Point', amount: '~$300M', funding: '$30M raised' },
    { date: 'Apr 2026', company: 'Galileo AI', acquirer: 'Cisco', amount: 'Undisclosed', funding: '$68M raised' },
  ];

  return (
    <figure className="not-prose chart-card">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">Agent Security: 18 Months of Acquisitions</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">3 of 4 pure-play agent security companies acquired since late 2024</p>

        <div className="space-y-0">
          {events.map((e, i) => (
            <div key={e.company} className="flex items-start gap-4 relative">
              {/* Timeline line */}
              {i < events.length - 1 && (
                <div className="absolute left-[7px] top-[18px] bottom-0 w-px bg-[#e3e3e0]" />
              )}
              {/* Dot */}
              <div className="w-[15px] h-[15px] rounded-full border-2 border-[#18181b] bg-[#f4f4f5] flex-shrink-0 mt-0.5 z-10" />
              <div className="pb-6">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{e.date}</div>
                <div className="text-sm font-bold text-[#37352f] mt-0.5">{e.company} → {e.acquirer}</div>
                <div className="text-xs text-[#37352f]/70 mt-0.5">{e.amount} acquisition · {e.funding} pre-acquisition</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 rounded-[3px] border border-[#e3e3e0] bg-[#f7f6f3] p-3">
          <div className="text-xs text-[#37352f]">
            <span className="font-bold">Only survivor:</span> Patronus AI ($40M raised, ~$80.5M valuation). Every other independent agent security company has been absorbed into a larger platform.
          </div>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: Check Point press release (Sep 2025), Cisco announcements (Oct 2024, Apr 2026), PitchBook.
        </p>
      </div>
    </figure>
  );
}

/* ─── Compute Valuation Table ─── */
export function ComputeValuationTable() {
  const companies = [
    { name: 'Cerebras', metric: '~$95B mkt cap', detail: 'IPO May 2026 (NASDAQ: CBRS)', notable: 'OpenAI compute contract >$20B' },
    { name: 'Together AI', metric: '$8.5B val', detail: '~$1.5B raised, ~$1B ARR', notable: 'Open-source model training + inference' },
    { name: 'Groq', metric: '$6.9B val', detail: '~$1.75B raised', notable: 'Nvidia licensed LPU architecture for ~$20B' },
    { name: 'Modal', metric: '$4.65B val', detail: '$442M raised, ~$300M ARR', notable: '5x revenue growth in 8 months' },
    { name: 'Fireworks AI', metric: '$4B val', detail: '$327M+ raised', notable: '15T+ tokens/day, Samsung/Uber/Cursor' },
  ];

  return (
    <figure className="not-prose chart-card">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">The Compute Layer</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Inference infrastructure companies by valuation, mid-2026</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0]">
                <th>Company</th>
                <th>Valuation</th>
                <th>Capital</th>
                <th>Signal</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.name} className="border-b border-[#e3e3e0]/60">
                  <td className="py-2.5 px-2 font-bold text-[#37352f]">{c.name}</td>
                  <td className="py-2.5 px-2"><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#f4f4f5] text-[#18181b]">{c.metric}</span></td>
                  <td className="py-2.5 px-2 text-[#37352f]/80">{c.detail}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/70">{c.notable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: NASDAQ (Cerebras IPO filing), Tracxn, PitchBook, company announcements. Modal ARR from Series C disclosure (May 2026).
        </p>
      </div>
    </figure>
  );
}

/* ─── Agent-as-Product Valuation Chart ─── */
export function AgentProductValuations() {
  const data = [
    { name: 'Cognition (Devin)', domain: 'Coding', funding: '>$2.5B', valuation: 26000, label: '$26B', arr: '$492M ARR' },
    { name: 'Sierra AI', domain: 'CX', funding: '~$1.475B', valuation: 15000, label: '$15B', arr: '>$150M ARR' },
    { name: 'Harvey AI', domain: 'Legal', funding: '>$1.22B', valuation: 11000, label: '$11B', arr: '25K+ agents on platform' },
    { name: 'Decagon', domain: 'Support', funding: '~$481M', valuation: 4500, label: '$4.5B', arr: 'Cash App, Notion, Duolingo' },
    { name: 'Factory AI', domain: 'Software', funding: '~$200M', valuation: 1500, label: '$1.5B', arr: 'NVIDIA, Adobe, MongoDB' },
    { name: 'CodeRabbit', domain: 'Code review', funding: '$88M', valuation: 550, label: '$550M', arr: '#1 AI app on GitHub Marketplace' },
  ];
  const max = 28000;

  return (
    <figure className="not-prose chart-card">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">Agent-as-Product: Who Ships Autonomous Agents</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Companies selling agents as finished products, by valuation (mid-2026)</p>

        <div className="space-y-3">
          {data.map((d) => (
            <div key={d.name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#37352f]">{d.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f7f6f3] text-[#37352f]/60 font-medium">{d.domain}</span>
                </div>
                <span className="text-xs font-bold text-[#37352f]">{d.label}</span>
              </div>
              <div className="w-full h-4 bg-[#f7f6f3] rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md"
                  style={{ width: `${(d.valuation / max) * 100}%`, backgroundColor: '#37352f', opacity: 0.25 + (d.valuation / max) * 0.55 }}
                />
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[10px] text-muted-foreground">{d.funding} raised</span>
                <span className="text-[10px] text-muted-foreground">{d.arr}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          Sources: Tracxn, PitchBook, company announcements, press coverage. Cognition valuation from May 2026 round. Sierra from Sep 2025 round. Harvey from Mar 2026 round.
        </p>
      </div>
    </figure>
  );
}

/* ─── Vercel Marketplace Composition (category breakdown) ─── */
export function MarketplaceComposition() {
  const categories = [
    { name: 'Database & Storage', count: 27, pct: 27 },
    { name: 'Agents', count: 16, pct: 16 },
    { name: 'Observability', count: 14, pct: 14 },
    { name: 'Dev Tools & Flags', count: 12, pct: 12 },
    { name: 'CMS', count: 7, pct: 7 },
    { name: 'Messaging', count: 7, pct: 7 },
    { name: 'Auth & Security', count: 5, pct: 5 },
    { name: 'Commerce & Payments', count: 5, pct: 5 },
    { name: 'Other', count: 7, pct: 7 },
  ];

  const colors = ['#18181b', '#18181b', '#18181b', '#18181b', '#18181b', '#18181b', '#18181b', '#be185d', '#6b7280'];

  return (
    <figure className="not-prose chart-card">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">Vercel Marketplace Composition</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">97+ integrations across 22 categories, distribution by type</p>

        {/* Stacked bar */}
        <div className="w-full h-8 rounded-md overflow-hidden flex">
          {categories.map((c, i) => (
            <div
              key={c.name}
              className="h-full relative group"
              style={{ width: `${c.pct}%`, backgroundColor: colors[i], opacity: 0.7 }}
              title={`${c.name}: ${c.count} integrations`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5">
          {categories.map((c, i) => (
            <div key={c.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: colors[i], opacity: 0.7 }} />
              <span className="text-xs text-[#37352f]"><span className="font-bold">{c.count}</span> {c.name}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          Source: vercel.com/marketplace, scraped May 2026. Some integrations appear in multiple categories. "Agents" is a Vercel-curated category added in 2025.
        </p>
      </div>
    </figure>
  );
}

/* ─── Agentic AI Funding Velocity (year-over-year bars) ─── */
export function FundingVelocityChart() {
  const data = [
    { period: '2024', deals: 31, capital: 1500, label: '$1.5B', annualized: false },
    { period: '2025', deals: 50, capital: 2900, label: '$2.9B', annualized: false },
    { period: 'Jan-May 2026', deals: 29, capital: 1100, label: '$1.1B', annualized: true, projectedLabel: '~$2.6B pace' },
  ];
  const maxCap = 3200;
  const maxDeals = 55;

  return (
    <figure className="not-prose chart-card">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">Agentic AI Funding Velocity</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Disclosed equity funding for pure-play agentic AI companies</p>

        <div className="space-y-4">
          {data.map((d) => (
            <div key={d.period}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#37352f] w-[100px]">{d.period}</span>
                  <span className="text-[10px] text-muted-foreground">{d.deals} deals</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#37352f]">{d.label}</span>
                  {d.annualized && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f4f4f5] text-[#52525b] font-medium">{d.projectedLabel}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {/* Capital bar */}
                <div className="flex-1 h-5 bg-[#f7f6f3] rounded-md overflow-hidden">
                  <div
                    className="h-full rounded-md"
                    style={{ width: `${(d.capital / maxCap) * 100}%`, backgroundColor: '#18181b', opacity: 0.65 }}
                  />
                </div>
                {/* Deal count bar (small) */}
                <div className="w-20 h-5 bg-[#f7f6f3] rounded-md overflow-hidden">
                  <div
                    className="h-full rounded-md"
                    style={{ width: `${(d.deals / maxDeals) * 100}%`, backgroundColor: '#18181b', opacity: 0.5 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#18181b', opacity: 0.65 }} />
            <span className="text-[10px] text-muted-foreground">Capital raised</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#18181b', opacity: 0.5 }} />
            <span className="text-[10px] text-muted-foreground">Deal count</span>
          </div>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Source: Company disclosures, PitchBook. &quot;Pure-play agentic AI&quot; excludes frontier labs (OpenAI, Anthropic, xAI) and broad AI infrastructure. Jan-May 2026 data annualized for comparison.
        </p>
      </div>
    </figure>
  );
}

/* ─── Capital Concentration (top deals vs rest) ─── */
export function CapitalConcentrationChart() {
  const segments = [
    { label: 'Top 3 deals', pct: 44, color: '#18181b' },
    { label: 'Deals 4-10', pct: 34, color: '#18181b' },
    { label: 'Bottom 50%', pct: 11.5, color: '#d1d5db' },
    { label: 'Remaining', pct: 10.5, color: '#e5e7eb' },
  ];

  return (
    <figure className="not-prose chart-card">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">Capital Concentration in Agentic AI</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Share of total capital by deal rank, Jan-May 2026</p>

        {/* Stacked bar */}
        <div className="w-full h-10 rounded-md overflow-hidden flex">
          {segments.map((s) => (
            <div
              key={s.label}
              className="h-full relative flex items-center justify-center"
              style={{ width: `${s.pct}%`, backgroundColor: s.color }}
            >
              {s.pct > 15 && (
                <span className="text-[10px] font-bold text-white drop-shadow-sm">{s.pct}%</span>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-xs text-[#37352f]"><span className="font-bold">{s.pct}%</span> {s.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[3px] border border-[#e3e3e0] bg-[#f7f6f3] p-3">
          <div className="text-xs text-[#37352f]">
            <span className="font-bold">The top 10 deals captured 78% of all agentic AI capital in early 2026.</span> The bottom half of deals split 11.5%. This mirrors the broader AI funding pattern: winner-takes-most concentration at every stage.
          </div>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Source: Disclosed deal data, Jan-May 2026. Excludes frontier labs.
        </p>
      </div>
    </figure>
  );
}

/* ─── Top Investors Table ─── */
export function TopInvestorsTable() {
  const investors = [
    { name: 'Sequoia Capital', focus: 'Company-building, growth', deals: 'Parallel ($100M B), fal.ai ($140M D), Sierra, Profound ($96M C)', thesis: 'Vertical agents + compute' },
    { name: 'a16z', focus: 'Platform plays, dev tools', deals: 'Inngest, Upstash, Anysphere (Cursor), Modal', thesis: 'Horizontal infrastructure' },
    { name: 'Kleiner Perkins', focus: 'Vertical AI, healthcare', deals: 'Browserbase ($67.5M), Harvey, Parallel ($100M A), Glean', thesis: 'Perception + verticals' },
    { name: 'ICONIQ Growth', focus: 'Growth-stage evaluation', deals: 'Braintrust ($120M+)', thesis: 'Observability layer' },
    { name: 'Y Combinator', focus: 'Seed-stage pipeline', deals: 'Firecrawl, Kernel, Cubic, Meticulous, E2B', thesis: 'Agent infra seed factory' },
    { name: 'Accel', focus: 'Developer infrastructure', deals: 'Kernel ($22M), Vercel ecosystem', thesis: 'Browser infrastructure' },
  ];

  return (
    <figure className="not-prose chart-card">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">Most Active Investors in Agent Infrastructure</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Lead investors across the eight infrastructure layers, 2024-2026</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0]">
                <th>Investor</th>
                <th>Focus</th>
                <th>Notable Agent Infra Deals</th>
              </tr>
            </thead>
            <tbody>
              {investors.map((inv) => (
                <tr key={inv.name} className="border-b border-[#e3e3e0]/60">
                  <td className="py-2.5 px-2 font-bold text-[#37352f]">{inv.name}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/80">{inv.focus}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/70">{inv.deals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: PitchBook, company announcements. Includes only agent-specific infrastructure deals; excludes frontier model investments.
        </p>
      </div>
    </figure>
  );
}

'use client';

import React from 'react';

/* ─── Industry Breakdown Horizontal Bar Chart ─── */
export function YCIndustryBreakdown() {
  const data = [
    { industry: 'B2B', count: 2964, pct: '50.9%', color: 'hsl(210 90% 40%)' },
    { industry: 'Consumer', count: 867, pct: '14.9%', color: 'hsl(210 60% 55%)' },
    { industry: 'Healthcare', count: 665, pct: '11.4%', color: 'hsl(210 40% 65%)' },
    { industry: 'Fintech', count: 618, pct: '10.6%', color: 'hsl(210 30% 70%)' },
    { industry: 'Industrials', count: 368, pct: '6.3%', color: 'hsl(210 20% 75%)' },
    { industry: 'Real Estate', count: 153, pct: '2.6%', color: 'hsl(210 15% 80%)' },
    { industry: 'Education', count: 125, pct: '2.1%', color: 'hsl(210 10% 83%)' },
  ];
  const max = 3000;

  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-7">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">YC Portfolio by Industry</h3>
        <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-widest font-semibold">5,818 companies, all-time</p>

        <div className="space-y-1.5">
          {data.map((d, i) => (
            <div key={d.industry} className="grid grid-cols-[80px_1fr_50px] gap-2 items-center">
              <span className="text-[11px] text-muted-foreground font-medium">{d.industry}</span>
              <div className="w-full h-3.5 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-sm overflow-hidden">
                <div className="h-full rounded-sm" style={{ width: `${(d.count / max) * 100}%`, backgroundColor: d.color }} />
              </div>
              <span className={`text-[11px] font-bold text-right ${i === 0 ? 'text-primary' : 'text-[#37352f] dark:text-[rgba(255,255,255,0.81)]'}`}>{d.pct}</span>
            </div>
          ))}
        </div>

        <p className="mt-2 text-[10px] text-muted-foreground/60">
          Source: YC Startup Directory (ycombinator.com/companies), April 2026.
        </p>
      </div>
    </figure>
  );
}

/* ─── Recent Batch Composition (W25-S26) ─── */
export function RecentBatchComposition() {
  const batches = [
    { batch: 'W25', b2b: 62, consumer: 12, fintech: 8, healthcare: 10, industrials: 5, other: 3 },
    { batch: 'S25', b2b: 58, consumer: 14, fintech: 9, healthcare: 11, industrials: 5, other: 3 },
    { batch: 'F25', b2b: 64, consumer: 10, fintech: 7, healthcare: 9, industrials: 7, other: 3 },
    { batch: 'W26', b2b: 68, consumer: 8, fintech: 8, healthcare: 6, industrials: 6, other: 4 },
    { batch: 'S26', b2b: 72, consumer: 6, fintech: 6, healthcare: 6, industrials: 8, other: 2 },
  ];

  const colors: Record<string, string> = {
    b2b: 'hsl(210 90% 40%)',
    consumer: 'hsl(340 60% 55%)',
    fintech: 'hsl(160 50% 45%)',
    healthcare: 'hsl(280 40% 55%)',
    industrials: 'hsl(35 70% 50%)',
    other: 'hsl(0 0% 75%)',
  };

  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-7">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Batch Composition</h3>
        <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-widest font-semibold">Industry mix, W25 - S26 (est. %)</p>

        <div className="space-y-2">
          {batches.map((b) => (
            <div key={b.batch} className="grid grid-cols-[32px_1fr] gap-2 items-center">
              <span className="text-[11px] text-muted-foreground font-bold">{b.batch}</span>
              <div className="w-full h-5 flex rounded-sm overflow-hidden">
                <div style={{ width: `${b.b2b}%`, backgroundColor: colors.b2b }} title={`B2B: ${b.b2b}%`} />
                <div style={{ width: `${b.consumer}%`, backgroundColor: colors.consumer }} title={`Consumer: ${b.consumer}%`} />
                <div style={{ width: `${b.fintech}%`, backgroundColor: colors.fintech }} title={`Fintech: ${b.fintech}%`} />
                <div style={{ width: `${b.healthcare}%`, backgroundColor: colors.healthcare }} title={`Healthcare: ${b.healthcare}%`} />
                <div style={{ width: `${b.industrials}%`, backgroundColor: colors.industrials }} title={`Industrials: ${b.industrials}%`} />
                <div style={{ width: `${b.other}%`, backgroundColor: colors.other }} title={`Other: ${b.other}%`} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-3">
          {Object.entries(colors).map(([key, color]) => (
            <div key={key} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-muted-foreground capitalize">{key === 'b2b' ? 'B2B' : key}</span>
            </div>
          ))}
        </div>

        <p className="mt-2 text-[10px] text-muted-foreground/60">
          Source: YC Startup Directory. S26 in-progress.
        </p>
      </div>
    </figure>
  );
}

/* ─── Agent Layer Taxonomy ─── */
export function AgentLayerTaxonomy() {
  const layers = [
    { layer: 'Agent Infrastructure', desc: 'Compute, hosting, orchestration, memory, identity', examples: 'Terminal Use, Klaus AI, Cumulus Labs, Chamber, Maven, Moda', count: '~65', badge: 'Foundation', badgeColor: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' },
    { layer: 'Agent Development', desc: 'IDEs, testing, evaluation, debugging for agents', examples: 'Canary, Sentrial, Ashr, Lark, Benchspan, Janus', count: '~40', badge: 'Tooling', badgeColor: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400' },
    { layer: 'Vertical Agent Apps', desc: 'Domain-specific agent workers (legal, healthcare, finance)', examples: 'Lexi, Aegis, Cranston AI, Eos AI, Wayco, Foreman', count: '~110', badge: 'Application', badgeColor: 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400' },
    { layer: 'Agent Enablement', desc: 'Security, compliance, monitoring, payments for agents', examples: 'Salus, BeeSafe AI, Multifactor, Oximy, Protent, GhostEye', count: '~30', badge: 'Governance', badgeColor: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' },
  ];

  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-7">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Agent Stack</h3>
        <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-widest font-semibold">YC agent portfolio by infrastructure layer</p>

        <div className="space-y-2">
          {layers.map((l) => (
            <div key={l.layer} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${l.badgeColor}`}>{l.badge}</span>
                <span className="text-xs font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{l.layer}</span>
                <span className="ml-auto text-[11px] font-bold text-primary">{l.count}</span>
              </div>
              <p className="text-[11px] text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)] leading-snug">{l.desc}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{l.examples}</p>
            </div>
          ))}
        </div>

        <p className="mt-2 text-[10px] text-muted-foreground/60">
          Analysis of F25, W26, S26 batches. Counts approximate due to multi-category overlap.
        </p>
      </div>
    </figure>
  );
}

/* ─── Geographic Concentration ─── */
export function YCGeoConcentration() {
  const data = [
    { region: 'SF Bay Area', pct: 52, highlight: true },
    { region: 'Rest of US', pct: 12 },
    { region: 'New York', pct: 8 },
    { region: 'Remote', pct: 7 },
    { region: 'India', pct: 4 },
    { region: 'Rest of World', pct: 17 },
  ];
  const max = 55;

  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-7">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Geographic Distribution</h3>
        <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-widest font-semibold">HQ location of YC companies</p>

        <div className="space-y-1.5">
          {data.map((d) => (
            <div key={d.region} className="grid grid-cols-[100px_1fr_40px] gap-2 items-center">
              <span className={`text-[11px] font-medium ${d.highlight ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{d.region}</span>
              <div className="w-full h-3.5 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-sm overflow-hidden">
                <div
                  className="h-full rounded-sm"
                  style={{
                    width: `${(d.pct / max) * 100}%`,
                    backgroundColor: d.highlight ? 'hsl(210 90% 40%)' : '#37352f',
                    opacity: d.highlight ? 0.85 : 0.25,
                  }}
                />
              </div>
              <span className={`text-[11px] font-bold text-right ${d.highlight ? 'text-primary' : 'text-[#37352f] dark:text-[rgba(255,255,255,0.81)]'}`}>{d.pct}%</span>
            </div>
          ))}
        </div>

        <p className="mt-2 text-[10px] text-muted-foreground/60">
          Source: YC Startup Directory. America/Canada = 69%; Remote tags overlap with SF HQs.
        </p>
      </div>
    </figure>
  );
}

/* ─── The "Agent for X" Pattern ─── */
export function AgentForXPattern() {
  const verticals = [
    { vertical: 'Legal', examples: 'Lexi, Crimson, General Legal, Arcline, Fed10', batches: 'S25-W26' },
    { vertical: 'Healthcare ops', examples: 'Aegis, Eos AI, Example Health, Kaigo, Ruma Care', batches: 'S25-W26' },
    { vertical: 'Accounting', examples: 'Cranston AI, Minerva, Balance, FullSeam, Copperlane', batches: 'F25-W26' },
    { vertical: 'Construction', examples: 'Foreman, Articulate, Semble AI, BidFlow, Structured AI', batches: 'F25-W26' },
    { vertical: 'Insurance', examples: 'Casey, Panta, Verdex, Acolite, Avallon AI', batches: 'F25-W26' },
    { vertical: 'Sales / GTM', examples: 'Nomi, Caretta, Pulcent, Gojiberry, Salesgraph', batches: 'F25-S26' },
    { vertical: 'DevOps / SRE', examples: 'IncidentFox, Kestrel AI, Deeptrace, Mendral', batches: 'F25-W26' },
    { vertical: 'Supply chain', examples: 'Burt, Pollinate, Lumari, MarkIt, Comena', batches: 'F25-S26' },
  ];

  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-7">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The "Agent for X" Pattern</h3>
        <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-widest font-semibold">Every vertical gets its own agent workforce</p>

        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-[11px] border-collapse min-w-[440px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-1.5 px-1.5 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider text-[10px]">Vertical</th>
                <th className="text-left py-1.5 px-1.5 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider text-[10px]">YC Companies</th>
                <th className="text-left py-1.5 px-1.5 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider text-[10px]">Batches</th>
              </tr>
            </thead>
            <tbody>
              {verticals.map((v) => (
                <tr key={v.vertical} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2 px-1.5 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{v.vertical}</td>
                  <td className="py-2 px-1.5 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{v.examples}</td>
                  <td className="py-2 px-1.5"><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">{v.batches}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-2 text-[10px] text-muted-foreground/60">
          Source: YC company descriptions, F25-S26 batches.
        </p>
      </div>
    </figure>
  );
}

/* ─── Defense & Hardware Surge ─── */
export function DefenseHardwareSurge() {
  const data = [
    { category: 'Defense', companies: 'Maquoketa, 9 Mothers, Icarus, Wardstone, Perseus, Tenet, Seeing Systems', count: 12, trend: '3x vs 2024' },
    { category: 'Robotics', companies: 'Philon, Almond, Mbodi, Servo7, InLoop, Forge, Verne, One Robot', count: 18, trend: '2x vs 2024' },
    { category: 'Space', companies: 'Cascade Space, GRU Space, Beyond Reach, Constellation, Dispatch', count: 8, trend: 'Steady' },
    { category: 'Energy', companies: 'Voxel Energy, Zephyr Fusion, Squid, AICE Power, Condor, matforge', count: 10, trend: '1.5x' },
    { category: 'Drones', companies: 'Tornyol, Voltair, Milliray, Seeing Systems, GrazeMate', count: 5, trend: 'New' },
  ];

  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-7">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Hard-Tech Resurgence</h3>
        <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-widest font-semibold">Defense, robotics, energy, space in recent batches</p>

        <div className="space-y-2">
          {data.map((d) => (
            <div key={d.category} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{d.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400">{d.trend}</span>
                  <span className="text-[11px] font-bold text-primary">{d.count}</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{d.companies}</p>
            </div>
          ))}
        </div>

        <p className="mt-2 text-[10px] text-muted-foreground/60">
          Source: YC Directory. Trends vs. 2023-2024 batches.
        </p>
      </div>
    </figure>
  );
}

/* ─── Tagline Archaeology ─── */
export function TaglineArchaeology() {
  const eras = [
    { era: '2005-12', pattern: 'Platform / marketplace for X', signal: 'Build the platform' },
    { era: '2013-17', pattern: 'Uber for X / SaaS for X', signal: 'Unbundle the incumbent' },
    { era: '2018-22', pattern: 'Infrastructure for X / API for X', signal: 'Sell the picks & shovels' },
    { era: '2023-24', pattern: 'AI-powered X', signal: 'Add intelligence' },
    { era: '2025-26', pattern: 'AI agent / AI employee for X', signal: 'Replace the worker' },
  ];

  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-7">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Language of Ambition</h3>
        <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-widest font-semibold">How YC taglines reveal the dominant startup strategy per era</p>

        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-[11px] border-collapse min-w-[400px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-1.5 px-1.5 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider text-[10px]">Era</th>
                <th className="text-left py-1.5 px-1.5 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider text-[10px]">Dominant Pattern</th>
                <th className="text-left py-1.5 px-1.5 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider text-[10px]">Signal</th>
              </tr>
            </thead>
            <tbody>
              {eras.map((e, i) => (
                <tr key={e.era} className={`border-b border-[#e3e3e0]/60 dark:border-zinc-800/40 ${i === eras.length - 1 ? 'bg-primary/5' : ''}`}>
                  <td className="py-2 px-1.5 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{e.era}</td>
                  <td className="py-2 px-1.5 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{e.pattern}</td>
                  <td className="py-2 px-1.5"><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${i === eras.length - 1 ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' : 'bg-zinc-100 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400'}`}>{e.signal}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-2 text-[10px] text-muted-foreground/60">
          Analysis of positioning language across 5,818 YC taglines. The shift from "AI-powered" to "AI agent" occurred sharply between S24 and W25.
        </p>
      </div>
    </figure>
  );
}

/* ─── Batch Size Over Time ─── */
export function BatchSizeTimeline() {
  const data = [
    { batch: 'S05', count: 8 },
    { batch: 'W07', count: 12 },
    { batch: 'S09', count: 20 },
    { batch: 'W12', count: 49 },
    { batch: 'S14', count: 75 },
    { batch: 'W16', count: 107 },
    { batch: 'W18', count: 126 },
    { batch: 'W20', count: 181 },
    { batch: 'S22', count: 220 },
    { batch: 'W24', count: 230 },
    { batch: 'W25', count: 168 },
    { batch: 'S25', count: 166 },
    { batch: 'F25', count: 148 },
    { batch: 'W26', count: 199 },
    { batch: 'S26', count: 69 },
  ];
  const max = 240;

  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-7">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Batch Size Evolution</h3>
        <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-widest font-semibold">Companies per batch, 2005-2026</p>

        <div className="space-y-1">
          {data.map((d, i) => (
            <div key={d.batch} className="grid grid-cols-[32px_1fr_32px] gap-2 items-center">
              <span className="text-[10px] text-muted-foreground font-medium">{d.batch}</span>
              <div className="w-full h-2.5 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-sm overflow-hidden">
                <div
                  className="h-full rounded-sm"
                  style={{
                    width: `${(d.count / max) * 100}%`,
                    backgroundColor: i >= data.length - 5 ? 'hsl(210 90% 40%)' : '#37352f',
                    opacity: i >= data.length - 5 ? 0.8 : 0.2 + (i * 0.04),
                  }}
                />
              </div>
              <span className="text-[10px] font-bold text-right text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{d.count}</span>
            </div>
          ))}
        </div>

        <p className="mt-2 text-[10px] text-muted-foreground/60">
          Source: YC Directory. S26 in-progress. 2025 introduced a third batch (Fall).
        </p>
      </div>
    </figure>
  );
}

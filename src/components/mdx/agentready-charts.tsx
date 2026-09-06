'use client';

import React from 'react';

/* ─── Headline adoption across 50,000 domains ─── */
const ADOPTION = [
  { label: 'robots.txt AI policy', value: 43.76 },
  { label: 'Both bot identities served', value: 37.82 },
  { label: 'JSON-LD structured data', value: 21.37 },
  { label: 'Author E-E-A-T signals', value: 13.82 },
  { label: 'llms.txt catalog', value: 6.62 },
  { label: 'security.txt', value: 4.58 },
  { label: 'Markdown negotiation', value: 2.95 },
  { label: 'Live MCP server', value: 1.82 },
  { label: 'OpenAPI spec', value: 0.16 },
  { label: 'Machine payments', value: 0.33 },
];

export function CensusAdoptionBars() {
  const max = 50;
  return (
    <figure className="not-prose chart-card">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">What 50,000 websites publish for machines</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Share of domains passing each check, Sep 2026 census</p>
        <div className="space-y-2">
          {ADOPTION.map((d) => (
            <div key={d.label} className="grid grid-cols-[150px_1fr_52px] gap-3 items-center">
              <span className="text-xs text-muted-foreground font-medium truncate">{d.label}</span>
              <div className="w-full h-4 bg-[#f7f6f3] rounded-md overflow-hidden">
                <div className="h-full rounded-md bg-[#4f6fb5]" style={{ width: `${Math.max(1.5, (d.value / max) * 100)}%` }} />
              </div>
              <span className="text-xs font-bold text-right text-[#37352f] tabular-nums">{d.value.toFixed(2)}%</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Source: 50,000-domain Tranco + CrUX census, 61-check instrument. Full table in the research paper.
        </p>
      </div>
    </figure>
  );
}

/* ─── Tier means vs refusal ─── */
const TIERS = [
  { label: 'Ranks 1-10k', mean: 26.1, refused: 56.2 },
  { label: 'Ranks 10k-100k', mean: 25.2, refused: 55.6 },
  { label: 'Ranks 100k-1M', mean: 25.9, refused: 52.2 },
];

export function CensusTierBars() {
  return (
    <figure className="not-prose chart-card">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">Prominence buys no readiness</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Mean score and bot-refusal rate by rank tier</p>
        <div className="space-y-4">
          {TIERS.map((t) => (
            <div key={t.label}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs text-muted-foreground font-medium">{t.label}</span>
                <span className="text-xs font-bold text-[#37352f] tabular-nums">{t.mean} / 100 · {t.refused}% refused</span>
              </div>
              <div className="w-full h-4 bg-[#f7f6f3] rounded-md overflow-hidden">
                <div className="h-full rounded-md bg-[#5da86f]" style={{ width: `${t.mean}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Source: 50,000-domain census. Tier means sit within one point; refusal falls slightly toward the tail.
        </p>
      </div>
    </figure>
  );
}

/* ─── Policy vs behavior ─── */
const POLICY = [
  { label: 'Robots allows, HTTP serves', value: 67.2 },
  { label: 'Robots allows, HTTP partial', value: 11.7 },
  { label: 'Robots allows, HTTP refuses', value: 21.1 },
];

export function CensusPolicyBars() {
  return (
    <figure className="not-prose chart-card">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">One site in five says yes and means no</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">HTTP behavior among 21,881 domains whose robots.txt permits AI crawlers</p>
        <div className="space-y-2">
          {POLICY.map((d, i) => (
            <div key={d.label} className="grid grid-cols-[190px_1fr_52px] gap-3 items-center">
              <span className="text-xs text-muted-foreground font-medium truncate">{d.label}</span>
              <div className="w-full h-4 bg-[#f7f6f3] rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md"
                  style={{ width: `${d.value}%`, backgroundColor: i === 2 ? '#c0392b' : i === 0 ? '#5da86f' : '#d98a3d' }}
                />
              </div>
              <span className="text-xs font-bold text-right text-[#37352f] tabular-nums">{d.value}%</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Source: 50,000-domain census. Policy-behavior gap needs no new standard to fix.
        </p>
      </div>
    </figure>
  );
}

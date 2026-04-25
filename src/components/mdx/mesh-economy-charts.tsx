'use client';

import React from 'react';

/* ─── Transaction Cost Reduction Chart ─── */
export function MeshTransactionCostChart() {
  const costs = [
    { category: 'Search', traditional: 'Days-weeks', protocol: 'Milliseconds', reduction: '99.9%', color: 'hsl(210 90% 40%)' },
    { category: 'Negotiation', traditional: 'Hours-days', protocol: 'Zero (accept/reject)', reduction: '100%', color: 'hsl(160 80% 35%)' },
    { category: 'Contract writing', traditional: '$5,000-50,000', protocol: 'Deploy once, reuse', reduction: '~100%', color: 'hsl(280 60% 45%)' },
    { category: 'Monitoring', traditional: 'Continuous staff', protocol: 'On-chain verifiable', reduction: '100%', color: 'hsl(30 80% 50%)' },
    { category: 'Enforcement', traditional: 'Legal system', protocol: 'Self-executing', reduction: '100%', color: 'hsl(350 70% 45%)' },
    { category: 'Dispute resolution', traditional: 'Courts/arbitration', protocol: 'Kleros/deterministic', reduction: '~95%', color: 'hsl(190 70% 40%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Transaction Cost Collapse</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">How protocols eliminate each category of Coasean friction</p>

        <div className="space-y-2">
          {costs.map((c) => (
            <div key={c.category} className="grid grid-cols-[110px_1fr_1fr_60px] gap-2 items-center text-[11px]">
              <span className="font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{c.category}</span>
              <span className="text-muted-foreground bg-[#f7f6f3] dark:bg-zinc-800/40 px-2 py-1.5 rounded-md text-center">{c.traditional}</span>
              <span className="px-2 py-1.5 rounded-md text-center font-medium" style={{ backgroundColor: c.color + '10', color: c.color }}>{c.protocol}</span>
              <span className="font-bold text-right" style={{ color: c.color }}>↓{c.reduction}</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Coase, R. (1937). "The Nature of the Firm." Economica. Protocol-era cost estimates based on DeFi operational analysis.
        </p>
      </div>
    </figure>
  );
}

/* ─── DAO Treasury Distribution ─── */
export function DAOTreasuryChart() {
  const data = [
    { name: 'Uniswap DAO', value: 3.2, color: 'hsl(330 70% 50%)' },
    { name: 'Optimism', value: 2.8, color: 'hsl(0 70% 50%)' },
    { name: 'Arbitrum', value: 2.1, color: 'hsl(210 90% 40%)' },
    { name: 'Mantle', value: 1.5, color: 'hsl(160 80% 35%)' },
    { name: 'ENS', value: 1.0, color: 'hsl(280 60% 45%)' },
    { name: 'All others (~1,000+ DAOs)', value: 3.0, color: 'hsl(0 0% 65%)' },
  ];
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">DAO Treasury Concentration</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">~$13.6B in total DAO treasuries, heavily concentrated (late 2025)</p>

        {/* Stacked horizontal bar */}
        <div className="w-full h-10 rounded-md overflow-hidden flex mb-4">
          {data.map((d) => (
            <div
              key={d.name}
              className="h-full flex items-center justify-center"
              style={{ width: `${(d.value / total) * 100}%`, backgroundColor: d.color, opacity: 0.65 }}
            >
              {d.value >= 1.5 && <span className="text-[9px] font-bold text-white truncate px-1">{d.name.split(' ')[0]}</span>}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: d.color, opacity: 0.65 }} />
              <span className="text-[11px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">
                {d.name} <span className="text-muted-foreground">(${d.value}B)</span>
              </span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Source: DeepDAO (late 2025 snapshot). Treasury values include liquid assets; native token holdings are market-dependent. Top 5 DAOs hold ~60% of total.
        </p>
      </div>
    </figure>
  );
}

/* ─── Mesh vs Centralized Organization Comparison ─── */
export function MeshOrgComparison() {
  const dimensions = [
    { dim: 'Coordination', firm: 'Management hierarchy', platform: 'Algorithm + platform', mesh: 'Protocol (smart contracts)' },
    { dim: 'Take rate', firm: 'Salary overhead (30-50%)', platform: 'Platform fee (20-30%)', mesh: 'Protocol fee (0-3%)' },
    { dim: 'Governance', firm: 'Board/executives', platform: 'Platform policy team', mesh: 'Token-weighted voting' },
    { dim: 'Data ownership', firm: 'Firm owns data', platform: 'Platform owns data', mesh: 'User owns data' },
    { dim: 'Exit cost', firm: 'High (employment lock-in)', platform: 'Medium (reputation locked)', mesh: 'Low (portable)' },
    { dim: 'Capital efficiency', firm: 'Low (overhead)', platform: 'Medium', mesh: 'High (automated)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Three Models of Economic Organization</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Firm → Platform → Mesh: the Coasean progression</p>

        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            {/* Header */}
            <div className="grid grid-cols-[100px_1fr_1fr_1fr] gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Dimension</span>
              <span className="text-[10px] font-bold uppercase text-muted-foreground text-center">Centralized Firm</span>
              <span className="text-[10px] font-bold uppercase text-center" style={{ color: 'hsl(30 80% 50%)' }}>Platform</span>
              <span className="text-[10px] font-bold uppercase text-center" style={{ color: 'hsl(160 80% 35%)' }}>Mesh Protocol</span>
            </div>
            {/* Rows */}
            {dimensions.map((d) => (
              <div key={d.dim} className="grid grid-cols-[100px_1fr_1fr_1fr] gap-2 border-t border-[#e3e3e0] dark:border-zinc-800 py-2">
                <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{d.dim}</span>
                <span className="text-[11px] text-muted-foreground text-center bg-[#f7f6f3] dark:bg-zinc-800/40 px-2 py-1 rounded-md">{d.firm}</span>
                <span className="text-[11px] text-center px-2 py-1 rounded-md" style={{ backgroundColor: 'hsl(30 80% 50% / 0.08)' }}>{d.platform}</span>
                <span className="text-[11px] text-center px-2 py-1 rounded-md font-medium" style={{ backgroundColor: 'hsl(160 80% 35% / 0.08)', color: 'hsl(160 80% 35%)' }}>{d.mesh}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Framework adapted from Coase (1937) and Williamson (1985). Protocol-era data from DeFi protocol documentation and on-chain analysis.
        </p>
      </div>
    </figure>
  );
}

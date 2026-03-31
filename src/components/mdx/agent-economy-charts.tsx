'use client';

import React from 'react';

/* ─── Agent Market Growth ─── */
export function AgentMarketGrowth() {
  const data = [
    { year: '2025', value: 7.5, label: '$7.5B' },
    { year: '2026', value: 11, label: '$11B' },
    { year: '2030', value: 50, label: '$50B' },
  ];
  const max = 55;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">AI Agent Market Size</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Projected market value, 2025-2030 (33-46% CAGR)</p>

        <div className="space-y-2">
          {data.map((d, i) => (
            <div key={d.year} className="grid grid-cols-[50px_1fr_55px] gap-3 items-center">
              <span className="text-xs text-muted-foreground font-medium">{d.year}</span>
              <div className="w-full h-4 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md"
                  style={{ width: `${(d.value / max) * 100}%`, backgroundColor: i === data.length - 1 ? 'hsl(210 90% 40%)' : '#37352f', opacity: i === data.length - 1 ? 0.8 : 0.3 + (0.15 * (data.length - i)) }}
                />
              </div>
              <span className={`text-xs font-bold text-right ${i === data.length - 1 ? 'text-primary' : 'text-[#37352f] dark:text-[rgba(255,255,255,0.81)]'}`}>{d.label}</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: MarketsandMarkets, BCC Research, PixelBrainy (2025-2026 estimates). Some projections reach $250B+ by mid-2030s.
        </p>
      </div>
    </figure>
  );
}

/* ─── Enterprise Adoption ─── */
export function EnterpriseAdoption() {
  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Enterprise AI Agent Adoption</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Key metrics, 2025-2026</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4">
            <div className="text-2xl font-bold text-primary">79%</div>
            <div className="text-xs text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1">Enterprises adopting agents</div>
          </div>
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4">
            <div className="text-2xl font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">40%</div>
            <div className="text-xs text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1">Apps embedding agents by 2026</div>
          </div>
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4">
            <div className="text-2xl font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">88%</div>
            <div className="text-xs text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1">Executives increasing AI budgets</div>
          </div>
          <div className="rounded-[3px] border border-primary/30 bg-primary/5 p-4">
            <div className="text-2xl font-bold text-primary">66%</div>
            <div className="text-xs text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1">Report measurable productivity gains</div>
          </div>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: Gartner (2025-2026), Accelirate enterprise survey. "Apps embedding agents" = Gartner forecast for enterprise applications with task-specific AI by 2026.
        </p>
      </div>
    </figure>
  );
}

/* ─── Coase Disruption ─── */
export function CoaseDisruption() {
  const old = [
    { function: 'Supplier discovery', cost: 'High', agent: 'Near zero', mechanism: 'Agents search, vet, compare across markets' },
    { function: 'Contract negotiation', cost: 'Medium-High', agent: 'Low', mechanism: 'Agent-to-agent negotiation (A2A)' },
    { function: 'Quality monitoring', cost: 'High', agent: 'Low', mechanism: 'Continuous automated verification' },
    { function: 'Market research', cost: 'Medium', agent: 'Near zero', mechanism: 'Real-time data synthesis across sources' },
    { function: 'Coordination', cost: 'High', agent: 'Low', mechanism: 'Multi-agent orchestration frameworks' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Coasean Shift</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">How AI agents reduce the transaction costs that justify the firm</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Function</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Legacy cost</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">With agents</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Mechanism</th>
              </tr>
            </thead>
            <tbody>
              {old.map((o) => (
                <tr key={o.function} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{o.function}</td>
                  <td className="py-2.5 px-2"><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">{o.cost}</span></td>
                  <td className="py-2.5 px-2"><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400">{o.agent}</span></td>
                  <td className="py-2.5 px-2 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{o.mechanism}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Framework: Coase (1937). Application to AI agents: Berkeley Haas (2025), NBER working papers (2025-2026).
        </p>
      </div>
    </figure>
  );
}

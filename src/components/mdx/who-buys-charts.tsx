'use client';

import React from 'react';

export function WhoBuysExposureChart() {
  const data = [
    { label: 'Global jobs exposed (IMF)', value: '40%', note: 'Augmentation plus replacement' },
    { label: 'Advanced-economy exposure', value: '60%', note: 'Half of that is low complementarity' },
    { label: 'US occupations, ≥10% tasks', value: '80%', note: 'Eloundou et al., exposure not loss' },
    { label: 'US occupations, ≥50% tasks', value: '19%', note: 'Same paper, LLM-plus-software' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">Exposure is not displacement</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Share of work that could be affected, not jobs already gone</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.map((d) => (
            <div key={d.label} className="rounded-[3px] border border-[#e3e3e0] p-4">
              <div className="text-2xl font-bold text-[#18181b]">{d.value}</div>
              <div className="text-xs font-medium text-[#37352f] mt-1">{d.label}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{d.note}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: IMF SDN/2024/001; Eloundou, Manning, Mishkin, Rock, Science (2024) and OpenAI working paper (2023).
        </p>
      </div>
    </figure>
  );
}

export function WhoBuysLaborFacts() {
  const rows = [
    { k: 'No economy-wide wipeout', v: 'Stanford/ADP through June 2026' },
    { k: 'Ages 22–25, exposed occupations', v: '19% below less-exposed peers' },
    { k: 'Channel', v: 'Less hiring, not mainly more firing' },
    { k: 'Where AI substitutes', v: 'Employment down' },
    { k: 'Where AI complements', v: 'Flat or up, especially seniors' },
    { k: 'Authors’ label', v: 'Descriptive canaries, not causal' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">What payroll data shows so far</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Brynjolfsson, Chandar, Chen, August 2026 revision</p>
        <div className="divide-y divide-[#e3e3e0] border border-[#e3e3e0] rounded-[3px]">
          {rows.map((r) => (
            <div key={r.k} className="grid grid-cols-1 sm:grid-cols-[1fr_1.2fr] gap-1 sm:gap-4 px-4 py-3">
              <span className="text-xs font-semibold text-[#18181b]">{r.k}</span>
              <span className="text-xs text-[#3f3f46]">{r.v}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Source: Stanford Digital Economy Lab, Canaries in the Coal Mine, revised August 2026. ADP sample through June 2026.
        </p>
      </div>
    </figure>
  );
}

export function WhoBuysDemandChart() {
  const items = [
    { label: 'Personal saving rate, June 2026', value: '2.7%', src: 'BEA' },
    { label: 'Real GDP, Q2 2026 annualized', value: '1.5%', src: 'BEA' },
    { label: 'Final sales to private domestic purchasers, Q2', value: '3.9%', src: 'BEA' },
    { label: 'AI cited in 2026 YTD US job-cut notices', value: '24%', src: 'Challenger' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">Demand is not a rumor. It is also not a collapse.</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Verified official and announcement data, mid-2026</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((d) => (
            <div key={d.label} className="rounded-[3px] border border-[#e3e3e0] p-4">
              <div className="text-2xl font-bold text-[#18181b]">{d.value}</div>
              <div className="text-[11px] text-[#37352f] mt-2 leading-snug">{d.label}</div>
              <div className="text-[10px] text-muted-foreground mt-2">{d.src}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: BEA Personal Income and Outlays, June 2026; BEA GDP advance, Q2 2026; Challenger, Gray &amp; Christmas, July 2026 report.
        </p>
      </div>
    </figure>
  );
}

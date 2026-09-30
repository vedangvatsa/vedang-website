'use client';

import React from 'react';

export function ReceiptsExposureChart() {
  const data = [
    { label: 'Global jobs exposed (IMF)', value: '40%', note: 'Task exposure, not displacement' },
    { label: 'Advanced economies', value: '60%', note: 'About half is low complementarity' },
    { label: 'US occupations, ≥10% tasks', value: '80%', note: 'Eloundou et al., exposure not loss' },
    { label: 'US occupations, ≥50% tasks', value: '19%', note: 'LLM plus software assumptions' },
  ];

  return (
    <figure className="not-prose chart-card">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">Task exposure versus job loss</h3>
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
          Sources: <a href="https://www.imf.org/-/media/files/publications/sdn/2024/english/sdnea2024001.pdf" className="hover:underline">IMF SDN/2024/001</a>; <a href="https://openai.com/research/gpts-are-gpts" className="hover:underline">Eloundou et al. (2023-2024)</a>.
        </p>
      </div>
    </figure>
  );
}

export function ReceiptsLaborFacts() {
  const rows = [
    { k: 'Economy-wide job destruction', v: 'No evidence through June 2026' },
    { k: 'Ages 22-25, exposed occupations', v: '19% below less-exposed peers' },
    { k: 'Experienced workers in same occupations', v: 'No comparable gap' },
    { k: 'Primary channel', v: 'Reduced hiring, not separations' },
    { k: 'Where AI substitutes', v: 'Employment down' },
    { k: 'Where AI complements', v: 'Flat or rising, especially for seniors' },
  ];

  return (
    <figure className="not-prose chart-card">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">Six facts from payroll microdata</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Stanford ADP study, revised August 2026</p>
        <div className="divide-y divide-[#e3e3e0] border border-[#e3e3e0] rounded-[3px]">
          {rows.map((r) => (
            <div key={r.k} className="grid grid-cols-1 sm:grid-cols-[1fr_1.2fr] gap-1 sm:gap-4 px-4 py-3">
              <span className="text-xs font-semibold text-[#18181b]">{r.k}</span>
              <span className="text-xs text-[#3f3f46]">{r.v}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Source: <a href="https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/" className="hover:underline">Brynjolfsson, Chandar, Chen (2026)</a>. ADP payroll data through June 2026.
        </p>
      </div>
    </figure>
  );
}

export function ReceiptsDemandChart() {
  const items = [
    { label: 'Personal saving rate, June 2026', value: '2.7%', src: 'BEA' },
    { label: 'Real GDP, Q2 2026 annualized', value: '1.5%', src: 'BEA' },
    { label: 'Final sales to private domestic purchasers, Q2', value: '3.9%', src: 'BEA' },
    { label: 'AI cited in 2026 YTD US job-cut notices', value: '24%', src: 'Challenger' },
  ];

  return (
    <figure className="not-prose chart-card">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">Households are still spending, and saving little</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Official data, mid-2026</p>
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
          Sources: <a href="https://www.bea.gov/news/2026/personal-income-and-outlays-june-2026" className="hover:underline">BEA Personal Income and Outlays, June 2026</a>; <a href="https://www.bea.gov/news/2026/gdp-advance-estimate-2nd-quarter-2026" className="hover:underline">BEA GDP advance, Q2 2026</a>; <a href="https://www.challengergray.com/wp-content/uploads/2026/08/Challenger-Report-July-2026.pdf" className="hover:underline">Challenger July 2026 report</a>.
        </p>
      </div>
    </figure>
  );
}

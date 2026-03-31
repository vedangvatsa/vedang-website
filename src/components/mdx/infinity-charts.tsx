'use client';

import React from 'react';

/* ─── Scarcity vs Abundance Spectrum ─── */
export function ScarcitySpectrum() {
  const items = [
    { name: 'Digital information', position: 95, label: 'Near-zero marginal cost', category: 'abundance' },
    { name: 'Cognitive labor (AI)', position: 78, label: 'Falling rapidly', category: 'abundance' },
    { name: 'Solar energy (levelized)', position: 65, label: '$0.03/kWh, down 90% since 2010', category: 'transition' },
    { name: 'Food production', position: 45, label: 'Gains offset by climate + population', category: 'transition' },
    { name: 'Fresh water', position: 25, label: '2.2B lack safe access (UN 2024)', category: 'scarce' },
    { name: 'Rare earth elements', position: 15, label: 'Neodymium demand +70% by 2030', category: 'scarce' },
    { name: 'Arable land', position: 10, label: 'Net loss annually', category: 'scarce' },
  ];

  const colorMap: Record<string, string> = {
    'abundance': 'text-primary',
    'transition': 'text-[#37352f] dark:text-[rgba(255,255,255,0.81)]',
    'scarce': 'text-red-600 dark:text-red-400',
  };

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Scarcity Spectrum</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Where different resources sit between scarcity and abundance</p>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.name}>
              <div className="flex justify-between mb-1">
                <span className={`text-sm font-medium ${colorMap[item.category]}`}>{item.name}</span>
              </div>
              <div className="w-full h-3 bg-gradient-to-r from-red-100 via-[#f7f6f3] to-blue-100 dark:from-red-950/30 dark:via-zinc-800/40 dark:to-blue-950/30 rounded-md overflow-hidden relative">
                <div
                  className="absolute top-0 h-full w-1.5 rounded-full bg-[#37352f] dark:bg-white"
                  style={{ left: `${item.position}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground/70">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4 text-[10px] text-muted-foreground font-medium">
          <span>Scarce</span>
          <span>Abundant</span>
        </div>
      </div>
    </figure>
  );
}

/* ─── Data Center Energy Chart ─── */
export function DataCenterEnergyChart() {
  const data = [
    { year: '2020', twh: 240 },
    { year: '2022', twh: 340 },
    { year: '2024', twh: 415 },
    { year: '2026*', twh: 590 },
    { year: '2028*', twh: 760 },
    { year: '2030*', twh: 945 },
  ];
  const max = 1000;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Data Center Electricity Consumption</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Global TWh/year (IEA base case)</p>

        <div className="space-y-2">
          {data.map((d, i) => (
            <div key={d.year} className="grid grid-cols-[60px_1fr_60px] gap-3 items-center">
              <span className="text-xs text-muted-foreground font-medium">{d.year}</span>
              <div className="w-full h-4 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md"
                  style={{
                    width: `${(d.twh / max) * 100}%`,
                    backgroundColor: i >= 3 ? 'hsl(210 90% 40%)' : '#37352f',
                    opacity: i >= 3 ? 0.8 : 0.4 + (i * 0.1),
                  }}
                />
              </div>
              <span className={`text-xs font-bold text-right ${i >= 3 ? 'text-primary' : 'text-[#37352f] dark:text-[rgba(255,255,255,0.81)]'}`}>{d.twh}</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Source: IEA Electricity 2025 report. *Projected. US and China account for nearly 80% of growth. At 945 TWh, data centers would consume ~3% of global electricity.
        </p>
      </div>
    </figure>
  );
}

/* ─── AI Training Cost Escalation ─── */
export function TrainingCostChart() {
  const models = [
    { name: 'GPT-3', year: '2020', cost: 12, unit: '$12M' },
    { name: 'GPT-4', year: '2023', cost: 100, unit: '$100M' },
    { name: 'Gemini Ultra', year: '2023', cost: 191, unit: '$191M' },
    { name: 'Llama 3.1 405B', year: '2025', cost: 170, unit: '$170M' },
    { name: 'Next-gen frontier*', year: '2026-27', cost: 1000, unit: '$1B+' },
  ];
  const max = 1100;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Frontier Model Training Costs</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Estimated cost per training run (USD)</p>

        <div className="space-y-3">
          {models.map((m, i) => (
            <div key={m.name}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{m.name} <span className="text-[10px] text-muted-foreground">({m.year})</span></span>
                <span className={`text-sm font-bold ${i === models.length - 1 ? 'text-primary' : 'text-[#37352f] dark:text-[rgba(255,255,255,0.81)]'}`}>{m.unit}</span>
              </div>
              <div className="w-full h-4 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md"
                  style={{
                    width: `${Math.max((m.cost / max) * 100, 2)}%`,
                    backgroundColor: i === models.length - 1 ? 'hsl(210 90% 40%)' : '#37352f',
                    opacity: i === models.length - 1 ? 0.8 : 0.3 + (i * 0.12),
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: Galileo AI, Local AI Master, Time, About Chromebooks. *Industry consensus projection. Costs growing 2-3x per year. Compute/hardware is 47-67% of total cost.
        </p>
      </div>
    </figure>
  );
}

/* ─── Material Constraints Table ─── */
export function MaterialConstraints() {
  const resources = [
    { resource: 'Rare earths (neodymium)', demand: '+70% by 2030', supply: 'China controls 60% of mining, 90% of processing', risk: 'Critical' },
    { resource: 'Lithium', demand: '+300% by 2030', supply: 'Surplus in 2023-24, deficit expected by 2026', risk: 'High' },
    { resource: 'Water (data centers)', demand: '66B liters/yr (US alone, 2023)', supply: 'Competing with agriculture, drinking water', risk: 'High' },
    { resource: 'Copper', demand: '+25% by 2030', supply: 'Grade decline at existing mines', risk: 'Medium' },
    { resource: 'Semiconductors', demand: '+15% CAGR', supply: 'Concentrated in Taiwan (TSMC)', risk: 'Critical' },
  ];

  const riskColor: Record<string, string> = {
    'Critical': 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30',
    'High': 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30',
    'Medium': 'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30',
  };

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Material Constraints on Digital Abundance</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Physical inputs the "dematerialized" economy depends on</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Resource</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Demand trend</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Supply constraint</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Risk</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.resource} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{r.resource}</td>
                  <td className="py-2.5 px-2 text-primary font-semibold">{r.demand}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{r.supply}</td>
                  <td className="py-2.5 px-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${riskColor[r.risk]}`}>{r.risk}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: IEA Global Critical Minerals Outlook 2025, S&P Global Commodity Insights, IEA Electricity 2025.
        </p>
      </div>
    </figure>
  );
}

/* ─── Platform Concentration Chart ─── */
export function PlatformConcentration() {
  const companies = [
    { name: 'Nvidia', cap: 4.4, revenue: 130 },
    { name: 'Apple', cap: 3.8, revenue: 391 },
    { name: 'Alphabet', cap: 3.5, revenue: 350 },
    { name: 'Microsoft', cap: 2.8, revenue: 245 },
    { name: 'Amazon', cap: 2.2, revenue: 710 },
    { name: 'Meta', cap: 1.8, revenue: 165 },
  ];
  const maxCap = 5;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Platform Concentration</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Market cap ($T) of companies controlling AI infrastructure, Mar 2026</p>

        <div className="space-y-2">
          {companies.map((c, i) => (
            <div key={c.name} className="grid grid-cols-[80px_1fr_50px] gap-3 items-center">
              <span className="text-xs font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{c.name}</span>
              <div className="w-full h-4 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md"
                  style={{ width: `${(c.cap / maxCap) * 100}%`, backgroundColor: i === 0 ? 'hsl(210 90% 40%)' : '#37352f', opacity: i === 0 ? 0.8 : 0.3 + (0.08 * (companies.length - i)) }}
                />
              </div>
              <span className={`text-xs font-bold text-right ${i === 0 ? 'text-primary' : 'text-[#37352f] dark:text-[rgba(255,255,255,0.81)]'}`}>${c.cap}T</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-[#f7f6f3] dark:bg-zinc-800/30 p-3">
          <p className="text-xs text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium">Combined revenue: $2.15T (2025). 53% of S&P 500 returns from these firms.</p>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: Visual Capitalist, Forbes, The Street. Market caps approximate as of March 2026.
        </p>
      </div>
    </figure>
  );
}

/* ─── Empirical Reality Check Grid ─── */
export function RealityCheckGrid() {
  const facts = [
    { stat: '673M', label: 'People undernourished (2024)', source: 'FAO SOFI 2025' },
    { stat: '2.2B', label: 'Without safe drinking water', source: 'UN Water 2025' },
    { stat: '2.6B', label: 'Cannot afford a healthy diet', source: 'FAO/UNICEF 2025' },
    { stat: '8.2%', label: 'Global undernourishment rate', source: 'FAO SOFI 2025' },
    { stat: '512M', label: 'Projected hungry by 2030', source: 'WHO/FAO projection' },
    { stat: '-7%', label: 'Renewable water per capita (decade)', source: 'UN AQUASTAT' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Empirical Reality Check</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Global scarcity in 2024, by the numbers</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {facts.map((f) => (
            <div key={f.label} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4">
              <div className="text-2xl font-bold text-primary">{f.stat}</div>
              <div className="text-xs text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1">{f.label}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{f.source}</div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Dual Economy Framework ─── */
export function DualEconomyFramework() {
  const abundance = [
    'Digital information (zero marginal cost)',
    'Cognitive labor (LLM-generated)',
    'Software development',
    'Media, music, text, images',
    'Financial modeling and analysis',
  ];
  const scarcity = [
    'Rare earth elements',
    'Fresh water, arable land',
    'Energy (generation + transmission)',
    'Semiconductor fabrication',
    'Physical logistics and housing',
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-center text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Dual Economy</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold text-center">Modern economies run on both logics simultaneously</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-[#f7f6f3] dark:bg-zinc-800/30 p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Abundance dynamics</div>
            <ul className="space-y-2">
              {abundance.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">
                  <span className="text-primary mt-0.5 shrink-0">&#x2713;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-[#f7f6f3] dark:bg-zinc-800/30 p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-[#37352f]/60 dark:text-zinc-400 mb-3">Scarcity dynamics</div>
            <ul className="space-y-2">
              {scarcity.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">
                  <span className="text-[#37352f]/40 dark:text-zinc-500 mt-0.5 shrink-0">&#x2715;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </figure>
  );
}

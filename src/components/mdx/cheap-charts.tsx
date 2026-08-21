'use client';

import React from 'react';

/* ─── Perception Arc Timeline ─── */
export function PerceptionArcTimeline() {
  const countries = [
    { name: 'Japan', start: 1960, onset: 1975, premium: 1995, gdpAtOnset: '$9.3K', gdpAtPremium: '$38.5K', anchor: 'Automobiles' },
    { name: 'South Korea', start: 1970, onset: 1990, premium: 2010, gdpAtOnset: '$6.5K', gdpAtPremium: '$22K', anchor: 'Smartphones' },
    { name: 'China', start: 2000, onset: 2018, premium: '2030s*', gdpAtOnset: '$10K', gdpAtPremium: 'Projected', anchor: 'EVs, drones' },
    { name: 'India', start: 2020, onset: '2030-35*', premium: '2040s*', gdpAtOnset: '$5K*', gdpAtPremium: 'Projected', anchor: 'Consumer tech' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">The Perception Arc</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">How long it takes for quality recognition to follow income growth</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0]">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider">Country</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider">Quality onset</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider">GDP at onset</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider">Premium era</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider">Anchor sector</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((c, i) => (
                <tr key={c.name} className={`border-b border-[#e3e3e0]/60 ${i === countries.length - 1 ? 'bg-[#f4f4f5]' : ''}`}>
                  <td className={`py-2.5 px-2 font-bold ${i === countries.length - 1 ? 'text-[#18181b]' : 'text-[#37352f]'}`}>{c.name}</td>
                  <td className="py-2.5 px-2 text-[#18181b] font-semibold">{c.onset}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/80">{c.gdpAtOnset}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/80">{c.premium}</td>
                  <td className="py-2.5 px-2 text-muted-foreground">{c.anchor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: World Bank, IMF WEO, Interbrand. *Projected based on IMF growth estimates. Quality onset = $5K-10K GDP/capita. Premium = $15K-25K.
        </p>
      </div>
    </figure>
  );
}

/* ─── India Sector Bifurcation ─── */
export function IndiaSectorBifurcation() {
  const completed = [
    { sector: 'IT / Software services', exports: '$224B (FY25)', status: 'Completed', signal: 'TCS, Infosys compete on quality' },
    { sector: 'Pharmaceuticals', exports: '$30.5B (FY25)', status: 'Completed', signal: '20% of global generics, FDA approved' },
  ];
  const inProgress = [
    { sector: 'Smartphone assembly', exports: '55M iPhones (2025)', status: 'In progress', signal: '25% of Apple global output' },
    { sector: 'Automotive components', exports: '$20B+ (FY25)', status: 'In progress', signal: 'Growing Tier-1 supplier base' },
    { sector: 'Specialty chemicals', exports: '$12B+ (FY25)', status: 'Early stage', signal: 'China+1 diversification' },
  ];

  const statusColor: Record<string, string> = {
    'Completed': 'text-[#18181b] bg-[#f4f4f5]',
    'In progress': 'text-[#18181b] bg-[#f4f4f5]',
    'Early stage': 'text-yellow-700 bg-yellow-50',
  };

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">India's Perception Cycle by Sector</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Some sectors have completed the transition, others are mid-cycle</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0]">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider">Sector</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider">Scale</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider">Status</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider">Quality signal</th>
              </tr>
            </thead>
            <tbody>
              {[...completed, ...inProgress].map((s) => (
                <tr key={s.sector} className="border-b border-[#e3e3e0]/60">
                  <td className="py-2.5 px-2 font-bold text-[#37352f]">{s.sector}</td>
                  <td className="py-2.5 px-2 text-[#18181b] font-semibold">{s.exports}</td>
                  <td className="py-2.5 px-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${statusColor[s.status]} whitespace-nowrap`}>{s.status}</span>
                  </td>
                  <td className="py-2.5 px-2 text-[#37352f]/80">{s.signal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: NASSCOM (FY25), Pharmexcil, India Times, IBEF. iPhone figure: 55M units assembled in 2025 (53% YoY increase).
        </p>
      </div>
    </figure>
  );
}

/* ─── Income Threshold Chart ─── */
export function IncomeThresholdChart() {
  const countries = [
    { name: 'Japan', gdp: 38500, year: '2000', note: 'Premium recognition achieved' },
    { name: 'South Korea', gdp: 22087, year: '2010', note: 'Premium recognition achieved' },
    { name: 'China', gdp: 12720, year: '2022', note: 'Approaching premium zone' },
    { name: 'India', gdp: 2695, year: '2024', note: 'Pre-onset, projected $5K by ~2030' },
  ];
  const max = 42000;

  // Zone positions as percentages
  const onsetStart = (5000 / max) * 100;
  const onsetEnd = (10000 / max) * 100;
  const premiumStart = (15000 / max) * 100;
  const premiumEnd = (25000 / max) * 100;
  const indiaProjected = (5000 / max) * 100; // India's ~2030 projected position

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">GDP Per Capita at Premium Recognition</h3>
        <p className="text-xs text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Where each country was when perception shifted</p>

        {/* Zone legend */}
        <div className="mb-4 flex flex-wrap gap-3 text-[10px] font-medium">
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-[#f4f4f5] border border-[#d4d4d8]" /> Onset zone ($5-10K)</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-[#f4f4f5] border border-[#d4d4d8]" /> Premium zone ($15-25K)</span>
        </div>

        <div className="space-y-4">
          {countries.map((c, i) => {
            const barWidth = Math.max((c.gdp / max) * 100, 4);
            const isIndia = i === countries.length - 1;

            return (
              <div key={c.name}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className={`text-xs font-bold ${isIndia ? 'text-[#18181b]' : 'text-[#37352f]'}`}>
                    {c.name} ({c.year})
                  </span>
                  <span className={`text-xs font-bold ${isIndia ? 'text-[#18181b]' : 'text-[#37352f]'}`}>
                    ${(c.gdp / 1000).toFixed(1)}K
                  </span>
                </div>
                <div className="w-full h-5 bg-[#f7f6f3] rounded-md overflow-hidden relative">
                  {/* Zone overlays */}
                  <div className="absolute h-full rounded-sm bg-[#f4f4f5]/50" style={{ left: `${onsetStart}%`, width: `${onsetEnd - onsetStart}%` }} />
                  <div className="absolute h-full rounded-sm bg-[#f4f4f5]" style={{ left: `${premiumStart}%`, width: `${premiumEnd - premiumStart}%` }} />

                  {/* Actual bar */}
                  <div
                    className="h-full rounded-md relative z-10"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: isIndia ? '#18181b' : '#37352f',
                      opacity: isIndia ? 0.8 : 0.3 + (0.15 * (countries.length - i)),
                    }}
                  />

                  {/* India's 2030 projected marker */}
                  {isIndia && (
                    <div
                      className="absolute top-0 h-full border-l-2 border-dashed border-[#18181b]/50 z-20"
                      style={{ left: `${indiaProjected}%` }}
                    >
                      <span className="absolute -top-4 left-1 text-[9px] font-medium text-[#18181b] whitespace-nowrap">~2030</span>
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{c.note}</div>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          Sources: World Bank, IMF WEO projections. Japan and Korea figures at point of full premium recognition. India projected via IMF growth trajectory.
        </p>
      </div>
    </figure>
  );
}

/* ─── COO Effect Size ─── */
export function COOEffectSize() {
  const studies = [
    { study: 'Schooler (1965)', finding: 'Identical products rated differently by label', effect: 'Significant', n: 'Central American consumers' },
    { study: 'Bilkey & Nes (1982)', finding: 'COO effect robust across 48 studies', effect: 'd = 0.39-0.80', n: '48 studies synthesized' },
    { study: 'Han (1989)', finding: 'Halo model confirmed for unfamiliar origins', effect: 'Significant', n: 'US consumers, Japan/Korea' },
    { study: 'Verlegh & Steenkamp (1999)', finding: 'Meta-analysis: medium-to-large effect', effect: 'd = 0.60', n: '41 studies, 19,626 obs.' },
    { study: 'Pappu et al. (2007)', finding: 'COO affects entire brand portfolios', effect: 'Significant', n: 'Multi-brand analysis' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">Country-of-Origin Effect: The Evidence</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Six decades of research on how national origin shapes product evaluation</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0]">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider">Study</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider">Finding</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider">Effect</th>
              </tr>
            </thead>
            <tbody>
              {studies.map((s) => (
                <tr key={s.study} className="border-b border-[#e3e3e0]/60">
                  <td className="py-2.5 px-2 font-bold text-[#37352f]">{s.study}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/80">{s.finding}</td>
                  <td className="py-2.5 px-2 text-[#18181b] font-semibold">{s.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

'use client';

import React, { useState } from 'react';

// Data from src/lib/global-funding-thesis-raw.json
const stageData = {
  PreSeed: [
    { year: 2015, rounds: 1004, raised: 0.28, median: 0.12 },
    { year: 2018, rounds: 3496, raised: 1.16, median: 0.12 },
    { year: 2021, rounds: 7142, raised: 4.01, median: 0.23 },
    { year: 2024, rounds: 5515, raised: 3.84, median: 0.30 },
    { year: 2025, rounds: 4472, raised: 3.82, median: 0.47 },
    { year: 2026, rounds: 1110, raised: 1.22, median: 0.50 }
  ],
  Seed: [
    { year: 2015, rounds: 8821, raised: 8.28, median: 0.44 },
    { year: 2018, rounds: 9092, raised: 13.92, median: 0.75 },
    { year: 2021, rounds: 12469, raised: 34.06, median: 1.50 },
    { year: 2024, rounds: 8817, raised: 30.75, median: 1.80 },
    { year: 2025, rounds: 7665, raised: 34.97, median: 2.20 },
    { year: 2026, rounds: 2402, raised: 16.69, median: 2.80 }
  ],
  SeriesA: [
    { year: 2015, rounds: 3473, raised: 28.82, median: 3.80 },
    { year: 2018, rounds: 4253, raised: 48.92, median: 5.00 },
    { year: 2021, rounds: 5248, raised: 103.18, median: 10.00 },
    { year: 2024, rounds: 3303, raised: 55.93, median: 10.00 },
    { year: 2025, rounds: 3260, raised: 58.61, median: 11.00 },
    { year: 2026, rounds: 1064, raised: 29.80, median: 14.50 }
  ],
  SeriesB: [
    { year: 2015, rounds: 1425, raised: 29.01, median: 12.00 },
    { year: 2018, rounds: 2062, raised: 51.01, median: 14.00 },
    { year: 2021, rounds: 2651, raised: 122.32, median: 27.50 },
    { year: 2024, rounds: 1430, raised: 57.45, median: 20.00 },
    { year: 2025, rounds: 1401, raised: 59.37, median: 25.00 },
    { year: 2026, rounds: 482, raised: 29.41, median: 30.00 }
  ]
};

const cohortData = [
  { year: 2015, seeds: 12757, converted: 2266, pct: 17.76, medianMonths: 21.9 },
  { year: 2018, seeds: 14449, converted: 2227, pct: 15.41, medianMonths: 23.5 },
  { year: 2020, seeds: 14487, converted: 2302, pct: 15.89, medianMonths: 19.0 },
  { year: 2021, seeds: 18565, converted: 2367, pct: 12.75, medianMonths: 17.2 },
  { year: 2022, seeds: 18167, converted: 1643, pct: 9.04, medianMonths: 21.4 },
  { year: 2023, seeds: 14942, converted: 1170, pct: 7.83, medianMonths: 17.1 },
  { year: 2024, seeds: 13099, converted: 837, pct: 6.39, medianMonths: 13.0 },
  { year: 2025, seeds: 11217, converted: 282, pct: 2.51, medianMonths: 7.1 }
];

const globalGini = [
  { year: 2015, total: 311.48, median: 0.97, gini: 0.882 },
  { year: 2018, total: 783.66, median: 1.50, gini: 0.911 },
  { year: 2021, total: 1416.81, median: 2.00, gini: 0.886 },
  { year: 2023, total: 1751.45, median: 1.30, gini: 0.931 },
  { year: 2024, total: 2840.38, median: 2.00, gini: 0.924 },
  { year: 2025, total: 4231.41, median: 3.00, gini: 0.913 },
  { year: 2026, total: 1839.85, median: 5.00, gini: 0.916 }
];

/* ─── 1. VC Valuation Expansion Chart ─── */
export function VCValuationExpansionChart() {
  const [activeStage, setActiveStage] = useState<'PreSeed' | 'Seed' | 'SeriesA' | 'SeriesB'>('Seed');

  const stageKeys = {
    PreSeed: 'Pre-Seed',
    Seed: 'Seed',
    SeriesA: 'Series A',
    SeriesB: 'Series B'
  };

  const currentData = stageData[activeStage];
  const maxVal = Math.max(...currentData.map(d => d.median));

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden shadow-sm">
      <div className="p-6 md:p-10">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-bold tracking-tight text-[#37352f] mb-1">Check Size Expansion Index</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Median transaction sizes by funding stage (USD millions)</p>
          </div>
          {/* Stage selector tabs */}
          <div className="flex flex-wrap gap-1 bg-[#f7f6f3] p-1 rounded-md border border-[#e3e3e0]">
            {(Object.keys(stageKeys) as Array<keyof typeof stageKeys>).map(key => (
              <button
                key={key}
                onClick={() => setActiveStage(key)}
                className={`px-3 py-1 text-xs font-semibold rounded-sm transition-all ${activeStage === key ? 'bg-white text-[#37352f] shadow-sm border border-[#e3e3e0]' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {stageKeys[key]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {currentData.map(d => {
            const pct = maxVal > 0 ? (d.median / maxVal) * 100 : 0;
            return (
              <div key={d.year} className="flex flex-col gap-1">
                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#37352f]">{d.year}</span>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                      {d.rounds.toLocaleString()} rounds completed · Total raised: ${(d.raised).toFixed(2)}B
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-[#18181b]">
                    ${d.median >= 1 ? `${d.median.toFixed(2)}M` : `${(d.median * 1000).toFixed(0)}K`}
                  </span>
                </div>
                <div className="w-full h-3 bg-[#f7f6f3] rounded-sm overflow-hidden relative border border-[#e3e3e0]/30 mt-1.5">
                  <div
                    className="h-full rounded-sm bg-[#18181b]/80 transition-all duration-500 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-[10px] text-muted-foreground/60 leading-relaxed">
          Source: Curated global transaction corpus tracking early-stage financing rounds. Median check values represent actual cash inlays before conversion or debt adjustment mechanisms.
        </p>
      </div>
    </figure>
  );
}

/* ─── 2. VCGiniConcentrationChart ─── */
export function VCGiniConcentrationChart() {
  const maxRaised = Math.max(...globalGini.map(d => d.total));

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden shadow-sm">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight text-[#37352f] mb-1">Gini Concentration & Capital Inflows</h3>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-8">Global capital inflows vs. structural concentration index</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Total Dollars Raised */}
          <div className="flex flex-col gap-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">Annual Global Capital Inflows (USD Billions)</h4>
            <div className="flex flex-col gap-4">
              {globalGini.map(d => {
                const pct = (d.total / maxRaised) * 100;
                return (
                  <div key={d.year} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#37352f] w-10 shrink-0">{d.year}</span>
                    <div className="flex-1 h-4 bg-[#f7f6f3] rounded-sm overflow-hidden border border-[#e3e3e0]/30">
                      <div
                        className="h-full bg-[#18181b]/80 transition-all duration-500 ease-out"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#18181b] w-16 text-right">${(d.total).toFixed(0)}B</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Gini Index */}
          <div className="flex flex-col gap-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">The Gini Capital Concentration Moat</h4>
            <div className="flex flex-col gap-4">
              {globalGini.map(d => {
                const pct = d.gini * 100;
                return (
                  <div key={d.year} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#37352f] w-10 shrink-0">{d.year}</span>
                    <div className="flex-1 h-4 bg-[#f7f6f3] rounded-sm overflow-hidden border border-[#e3e3e0]/30">
                      <div
                        className="h-full bg-[#18181b]/40 transition-all duration-500 ease-out"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#37352f] w-16 text-right">{d.gini.toFixed(3)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-sm bg-[#f7f6f3] border border-[#e3e3e0] p-4 text-xs text-muted-foreground leading-relaxed">
          <strong>Strategic Takeaway:</strong> The Gini index measures how unevenly venture dollars are distributed. A score of 0.0 represents perfect equality, while 1.0 represents absolute inequality. The sustained Gini index above <strong>0.91</strong> from 2023 onward signifies that over 90% of all capital is concentrated in a tiny barbell of late-stage mega-rounds (often AI foundation models or hardware infrastructures), starving mid-market software and secondary ecosystems.
        </div>
      </div>
    </figure>
  );
}

/* ─── 3. VCDeathValleyTimeline ─── */
export function VCDeathValleyTimeline() {
  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden shadow-sm">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight text-[#37352f] mb-1">Seed-to-Series A "Death Valley" Timeline</h3>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-8">Longitudinal conversion rates and median time gaps by cohort year</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0]">
                <th className="text-left py-3 px-2 font-bold text-[#37352f] uppercase tracking-wider">Cohort Year</th>
                <th className="text-left py-3 px-2 font-bold text-[#37352f] uppercase tracking-wider">Total Seed Cohort</th>
                <th className="text-left py-3 px-2 font-bold text-[#37352f] uppercase tracking-wider">Converted Companies</th>
                <th className="text-left py-3 px-2 font-bold text-[#37352f] uppercase tracking-wider">Conversion Rate (%)</th>
                <th className="text-left py-3 px-2 font-bold text-[#37352f] uppercase tracking-wider">Median Gap (Months)</th>
                <th className="text-left py-3 px-2 font-bold text-[#37352f] uppercase tracking-wider">System State</th>
              </tr>
            </thead>
            <tbody>
              {cohortData.map((d) => {
                let statusColor = 'text-muted-foreground';
                let statusLabel = 'Complete';
                
                if (d.year === 2021) {
                  statusColor = 'text-[#18181b] font-bold';
                  statusLabel = 'ZIRP Outlier (Fast Track)';
                } else if (d.year === 2022) {
                  statusColor = 'text-[#18181b] font-bold';
                  statusLabel = 'Transition Shock';
                } else if (d.year >= 2023) {
                  statusColor = 'text-[#18181b] font-bold';
                  statusLabel = 'Severe Friction (Active)';
                }

                return (
                  <tr key={d.year} className="border-b border-[#e3e3e0]/60 hover:bg-[#f7f6f3]/40 transition-colors">
                    <td className="py-3 px-2 font-bold text-[#37352f]">{d.year}</td>
                    <td className="py-3 px-2 text-[#37352f]/80">{d.seeds.toLocaleString()}</td>
                    <td className="py-3 px-2 text-[#37352f]/80">{d.converted.toLocaleString()}</td>
                    <td className="py-3 px-2 font-extrabold text-[#37352f]">
                      <div className="flex items-center gap-2">
                        <span className="w-10 text-right">{d.pct.toFixed(2)}%</span>
                        <div className="w-16 h-2 bg-[#f7f6f3] border border-[#e3e3e0]/30 rounded-sm overflow-hidden">
                          <div
                            className={`h-full ${d.pct > 15 ? 'bg-[#18181b]' : d.pct > 10 ? 'bg-[#18181b]' : 'bg-[#18181b]'}`}
                            style={{ width: `${(d.pct / 18) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-semibold text-[#18181b]">{d.medianMonths.toFixed(1)} mos</td>
                    <td className={`py-3 px-2 ${statusColor}`}>{statusLabel}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-[10px] text-muted-foreground/60 leading-relaxed">
          Note: Conversion rates measure companies that successfully raised a documented Series A strictly after their first Seed financing. Cohorts from 2023 onward are actively transacting, meaning their final conversion percentages will expand slightly as the timelines mature, though they are tracking significantly below historical baselines at similar maturity milestones.
        </p>
      </div>
    </figure>
  );
}

/* ─── 4. VCSectorSemanticAnalysis ─── */
export function VCSectorSemanticAnalysis() {
  const semanticSectorData = [
    { theme: 'GenAI & LLMs', rounds: 7878, medianSize: 1.40, valuation: 6.55, investors: 3.0, hubs: 'San Francisco, New York, London', seed: 2.0, seriesA: 10.0, seriesB: 30.0, color: '#18181b' },
    { theme: 'Enterprise SaaS', rounds: 90715, medianSize: 1.60, valuation: 5.00, investors: 2.5, hubs: 'San Francisco, New York, London', seed: 1.0, seriesA: 6.0, seriesB: 13.9, color: '#18181b' },
    { theme: 'Climate & GreenTech', rounds: 35772, medianSize: 2.60, valuation: 10.00, investors: 2.1, hubs: 'London, San Francisco, New York', seed: 1.1, seriesA: 7.85, seriesB: 17.65, color: '#18181b' },
    { theme: 'Web3 & Ledger', rounds: 27479, medianSize: 1.90, valuation: 10.00, investors: 3.8, hubs: 'Singapore, San Francisco, New York', seed: 2.0, seriesA: 8.3, seriesB: 20.0, color: '#18181b' },
    { theme: 'DeepTech & Hardware', rounds: 24911, medianSize: 3.20, valuation: 25.00, investors: 2.6, hubs: 'San Francisco, Shenzhen, Shanghai', seed: 1.6, seriesA: 9.2, seriesB: 15.45, color: '#18181b' },
    { theme: 'Consumer & Marketplace', rounds: 75200, medianSize: 1.20, valuation: 5.00, investors: 2.4, hubs: 'New York, London, San Francisco', seed: 0.66, seriesA: 5.0, seriesB: 13.5, color: '#18181b' }
  ];

  const maxVal = Math.max(...semanticSectorData.map(d => d.valuation));

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden shadow-sm">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight text-[#37352f] mb-1">Sector Semantic Analysis</h3>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-8">Financing structures, syndication density, and primary global hubs by company description theme</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {semanticSectorData.map((d) => {
            const valPct = (d.valuation / maxVal) * 100;
            return (
              <div key={d.theme} className="rounded-[3px] border border-[#e3e3e0] p-5 flex flex-col bg-[#f7f6f3]/30 hover:bg-[#f7f6f3]/60 transition-colors">
                <span className="text-sm font-extrabold text-[#37352f] mb-1">{d.theme}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-3">{d.rounds.toLocaleString()} total rounds</span>
                
                {/* Median Valuation Bar */}
                <div className="flex flex-col gap-1 mb-4">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Median Valuation</span>
                    <span style={{ color: d.color }}>${d.valuation.toFixed(2)}M</span>
                  </div>
                  <div className="w-full h-2 bg-[#e3e3e0]/40 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${valPct}%`, backgroundColor: d.color }} />
                  </div>
                </div>

                {/* Stage Check Sizes Grid */}
                <div className="grid grid-cols-3 gap-2 text-center bg-white p-2.5 rounded-sm border border-[#e3e3e0] mb-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Seed</span>
                    <span className="text-xs font-extrabold text-[#37352f]">${d.seed.toFixed(2)}M</span>
                  </div>
                  <div className="flex flex-col border-x border-[#e3e3e0]/50">
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Series A</span>
                    <span className="text-xs font-extrabold text-[#37352f]">${d.seriesA.toFixed(1)}M</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Series B</span>
                    <span className="text-xs font-extrabold text-[#37352f]">${d.seriesB.toFixed(1)}M</span>
                  </div>
                </div>

                {/* Syndication Density */}
                <div className="flex justify-between items-center text-xs font-semibold mb-3">
                  <span className="text-muted-foreground">Syndication Density</span>
                  <span className="text-[#37352f]">{d.investors.toFixed(1)} investors / round</span>
                </div>

                {/* Hubs */}
                <div className="mt-auto border-t border-[#e3e3e0]/50 pt-3">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold block mb-1">Primary Global Hubs</span>
                  <span className="text-[11px] font-semibold text-[#37352f] leading-tight block">{d.hubs}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </figure>
  );
}

/* ─── 5. VCStrategicFrameworkDiagram: McKinsey SCR Flowchart ─── */
export function VCStrategicFrameworkDiagram() {
  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden shadow-sm">
      <div className="p-6 md:p-10 flex flex-col items-center">
        <h3 className="text-lg md:text-xl font-bold tracking-tight text-[#37352f] mb-1 text-center">The Venture Capital Strategic Realignment Framework</h3>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-8 text-center">McKinsey SCR structure for private technology markets</p>

        <div className="w-full max-w-4xl flex flex-col md:flex-row items-stretch justify-between gap-6 relative">
          {/* Situation Box */}
          <div className="flex-1 rounded-[3px] border border-[#e3e3e0] bg-[#f7f6f3] p-5 flex flex-col">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">1. The Situation</div>
            <div className="text-sm font-bold text-[#37352f] mb-3">ZIRP Peak Capital Overflow</div>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">
              Zero-interest-rate policies flooded private markets with cheap capital. Underwriting standards collapsed, driving valuation multiples over 100x ARR and funding capital-inefficient portfolios.
            </p>
          </div>

          {/* Arrow 1 */}
          <div className="hidden md:flex items-center justify-center shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/60">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>

          {/* Complication Box */}
          <div className="flex-1 rounded-[3px] border border-[#e4e4e7] bg-[#f4f4f5] p-5 flex flex-col">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#18181b] mb-2">2. The Complication</div>
            <div className="text-sm font-bold text-[#37352f] mb-3">The Structural Barbell & Gini Moat</div>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">
              Macro reset and cost-of-capital increases hollowed out the software mid-market. Capital polarized into a barbell system: extreme concentration (0.916 Gini) in mega-rounds vs. lean early stages.
            </p>
          </div>

          {/* Arrow 2 */}
          <div className="hidden md:flex items-center justify-center shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/60">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>

          {/* Resolution Box */}
          <div className="flex-1 rounded-[3px] border border-[#e4e4e7] bg-[#f4f4f5] p-5 flex flex-col">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#18181b] mb-2">3. The Resolution</div>
            <div className="text-sm font-bold text-[#18181b] mb-3">Metric-Driven Underwriting Moats</div>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">
              Transitioning portfolios from option-buying to core underwriting. Founders prioritize the Capital Efficiency Index (CEI &gt; 1.5x), expand runways to 36 months, and re-anchor valuation expectations.
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ─── 6. VCEquationBoxSVG: Capital Efficiency Index equation ─── */
export function VCEquationBoxSVG() {
  return (
    <div className="not-prose my-8 w-full flex justify-center">
      <div className="w-full max-w-xl bg-[#f7f6f3] border border-[#e3e3e0] rounded-sm p-6 flex flex-col items-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 block">The Capital Efficiency Index (CEI) Equation</span>
        
        {/* Beautiful SVG Equation */}
        <svg width="100%" height="80" viewBox="0 0 500 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-[420px]">
          {/* CEI Label */}
          <text x="10" y="46" fill="#37352f" fontSize="16" fontFamily="var(--font-mono), monospace" fontWeight="bold">CEI =</text>
          
          {/* Fraction Line */}
          <line x1="80" y1="40" x2="480" y2="40" stroke="#a3a3a0" strokeWidth="2" />
          
          {/* Numerator */}
          <text x="280" y="28" fill="#37352f" fontSize="14" fontFamily="var(--font-mono), monospace" fontWeight="bold" textAnchor="middle">Net New ARR Generated</text>
          
          {/* Denominator */}
          <text x="280" y="58" fill="#18181b" fontSize="14" fontFamily="var(--font-mono), monospace" fontWeight="bold" textAnchor="middle">Net Capital Burned</text>
        </svg>

        <span className="text-[10px] text-muted-foreground/70 text-center mt-3 leading-relaxed">
          Standard: Net new ARR divided by total net capital burned. A ratio exceeding 1.5x indicates institutional-grade efficiency.
        </span>
      </div>
    </div>
  );
}

/* ─── 7. VCBarbellSystemVisual ─── */
export function VCBarbellSystemVisual() {
  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden shadow-sm">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight text-[#37352f] mb-1 text-center">
          The Venture Capital Barbell Allocation Model
        </h3>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-8 text-center">
          Structural divergence of private technology markets in 2026
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: The Low Pole */}
          <div className="rounded-[3px] border border-[#18181b]/20 bg-[#f4f4f5] p-6 flex flex-col transition-all duration-300 hover:shadow-md">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#18181b] mb-3">
              The Low-Capital Pole
            </div>
            <h4 className="text-base font-bold text-[#37352f] mb-4">Capital-Lean (Modular)</h4>
            <ul className="text-xs text-muted-foreground leading-relaxed flex-1 flex flex-col gap-3">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#18181b] shrink-0 mt-1.5" />
                <span><strong>Pre-Seed and Seed check focus</strong> (median $0.50M - $2.80M)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#18181b] shrink-0 mt-1.5" />
                <span><strong>Small, highly targeted cash injections</strong> for operational traction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#18181b] shrink-0 mt-1.5" />
                <span><strong>Extremely lean development budgets</strong> leveraging open-source and SaaS tooling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#18181b] shrink-0 mt-1.5" />
                <span><strong>Absolute prioritization of cash sustainability</strong> over narrative-driven vanity metrics</span>
              </li>
            </ul>
          </div>

          {/* Card 2: The Hollowed-Out Middle */}
          <div className="rounded-[3px] border border-destructive/20 bg-destructive/[0.02] p-6 flex flex-col transition-all duration-300 hover:shadow-md relative overflow-hidden">
            {/* Structural Hollow Divider Accent */}
            <div className="absolute top-0 right-0 left-0 h-1 bg-destructive/30" />
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-destructive mb-3">
              The Hollowed-Out Middle
            </div>
            <h4 className="text-base font-bold text-[#37352f] mb-4">Metric-Friction (Traditional)</h4>
            <ul className="text-xs text-muted-foreground leading-relaxed flex-1 flex flex-col gap-3">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0 mt-1.5" />
                <span><strong>Traditional B2B SaaS and mid-market software</strong> applications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0 mt-1.5" />
                <span><strong>Hardest hit by the growth-equity freeze</strong> and capital retreats</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0 mt-1.5" />
                <span><strong>Severe multiple compression</strong> (returning to historical 10x - 15x ARR boundaries)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0 mt-1.5" />
                <span><strong>Forced consolidation, down-rounds, or recapitalizations</strong> for survival</span>
              </li>
            </ul>
          </div>

          {/* Card 3: The High Pole */}
          <div className="rounded-[3px] border border-[#e4e4e7] bg-[#f4f4f5] p-6 flex flex-col transition-all duration-300 hover:shadow-md relative overflow-hidden">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#18181b] mb-3">
              The High-Capital Pole
            </div>
            <h4 className="text-base font-bold text-[#37352f] mb-4">Capital-Heavy (Moated)</h4>
            <ul className="text-xs text-muted-foreground leading-relaxed flex-1 flex flex-col gap-3">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#18181b] shrink-0 mt-1.5" />
                <span><strong>Mega-rounds of $100M+</strong> concentrated into undisputed market leaders</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#18181b] shrink-0 mt-1.5" />
                <span><strong>Generative AI foundation models and neural compute networks</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#18181b] shrink-0 mt-1.5" />
                <span><strong>Silicon chip designs, quantum computing, and physical deep technology</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#18181b] shrink-0 mt-1.5" />
                <span><strong>Massive capital-moat structures</strong> backed by top-tier institutional allocators</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ─── 8. VCBarbellVectorDiagram ─── */
export function VCBarbellVectorDiagram() {
  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden shadow-sm">
      <div className="p-6 md:p-10 flex flex-col items-center">
        <h3 className="text-lg md:text-xl font-bold tracking-tight text-[#37352f] mb-1 text-center">
          Barbell Allocation Map
        </h3>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-8 text-center">
          Hand-coded vector schema of venture capital polarization in 2026
        </p>

        <div className="w-full overflow-x-auto flex justify-center py-4">
          <svg width="100%" height="220" viewBox="0 0 740 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="min-w-[640px] max-w-[700px]">
            {/* Barbell Shaft Left segment */}
            <line x1="120" y1="110" x2="330" y2="110" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
            
            {/* Barbell Shaft Right segment */}
            <line x1="410" y1="110" x2="620" y2="110" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />

            {/* Hollowed Middle segment (Red, Dotted line) */}
            <line x1="330" y1="110" x2="410" y2="110" stroke="#18181b" strokeWidth="6" strokeDasharray="6 4" strokeLinecap="round" />

            {/* Left Node: Low-Capital Pole */}
            <circle cx="120" cy="110" r="30" fill="#eff6ff" stroke="#18181b" strokeWidth="4" />
            <circle cx="120" cy="110" r="8" fill="#18181b" />
            
            {/* Middle Node: Hollowed Out */}
            <circle cx="370" cy="110" r="22" fill="#fff5f5" stroke="#18181b" strokeWidth="3" strokeDasharray="4 3" />
            <line x1="362" y1="102" x2="378" y2="118" stroke="#18181b" strokeWidth="2.5" />
            <line x1="378" y1="102" x2="362" y2="118" stroke="#18181b" strokeWidth="2.5" />

            {/* Right Node: High-Capital Pole */}
            <circle cx="620" cy="110" r="55" fill="#ecfdf5" stroke="#18181b" strokeWidth="5" />
            {/* Inner dense circles representing concentrated capital layers */}
            <circle cx="620" cy="110" r="38" fill="none" stroke="#18181b" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="620" cy="110" r="22" fill="#18181b" fillOpacity="0.15" stroke="#18181b" strokeWidth="2.5" />
            <circle cx="620" cy="110" r="6" fill="#18181b" />

            {/* Labels: Low-Capital Pole */}
            <text x="120" y="45" fill="#18181b" fontSize="11" fontFamily="var(--font-sans), sans-serif" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">THE LOW POLE</text>
            <text x="120" y="62" fill="#37352f" fontSize="13" fontFamily="var(--font-sans), sans-serif" fontWeight="bold" textAnchor="middle">Capital-Lean Startups</text>
            <text x="120" y="165" fill="#64748b" fontSize="10" fontFamily="var(--font-sans), sans-serif" textAnchor="middle">Modular Operations</text>
            <text x="120" y="180" fill="#64748b" fontSize="10" fontFamily="var(--font-sans), sans-serif" textAnchor="middle">Pre-Seed and Seed Checks</text>

            {/* Labels: Hollowed Out Middle */}
            <text x="370" y="45" fill="#18181b" fontSize="11" fontFamily="var(--font-sans), sans-serif" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">THE HOLLOW MIDDLE</text>
            <text x="370" y="62" fill="#37352f" fontSize="13" fontFamily="var(--font-sans), sans-serif" fontWeight="bold" textAnchor="middle">Traditional Mid-Market SaaS</text>
            <text x="370" y="165" fill="#94a3b8" fontSize="10" fontFamily="var(--font-sans), sans-serif" textAnchor="middle">Liquidity Contraction</text>
            <text x="370" y="180" fill="#94a3b8" fontSize="10" fontFamily="var(--font-sans), sans-serif" textAnchor="middle">Valuation Compression</text>

            {/* Labels: High-Capital Pole */}
            <text x="620" y="25" fill="#18181b" fontSize="11" fontFamily="var(--font-sans), sans-serif" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">THE HIGH POLE</text>
            <text x="620" y="42" fill="#37352f" fontSize="13" fontFamily="var(--font-sans), sans-serif" fontWeight="bold" textAnchor="middle">Capital-Heavy Mega-Rounds</text>
            <text x="620" y="185" fill="#64748b" fontSize="10" fontFamily="var(--font-sans), sans-serif" textAnchor="middle">Foundation Models and Infrastructure</text>
            <text x="620" y="200" fill="#64748b" fontSize="10" fontFamily="var(--font-sans), sans-serif" textAnchor="middle">Massive Gini Concentration Moats</text>
          </svg>
        </div>
      </div>
    </figure>
  );
}



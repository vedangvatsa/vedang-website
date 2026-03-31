'use client';

import React from 'react';

/* ─── GDP Growth Timeline ─── */
export function GDPGrowthTimeline() {
  const data = [
    { year: '1965', gdp: 500, label: '$500' },
    { year: '1985', gdp: 6500, label: '$6.5K' },
    { year: '2005', gdp: 29000, label: '$29K' },
    { year: '2024', gdp: 90674, label: '$90.7K' },
  ];
  const max = 95000;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">GDP Per Capita Growth</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Singapore, current USD, 1965-2024</p>

        <div className="space-y-2">
          {data.map((d, i) => (
            <div key={d.year} className="grid grid-cols-[50px_1fr_55px] gap-3 items-center">
              <span className="text-xs text-muted-foreground font-medium">{d.year}</span>
              <div className="w-full h-4 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md"
                  style={{
                    width: `${(d.gdp / max) * 100}%`,
                    backgroundColor: i === data.length - 1 ? 'hsl(210 90% 40%)' : '#37352f',
                    opacity: i === data.length - 1 ? 0.8 : 0.25 + (i * 0.09),
                  }}
                />
              </div>
              <span className={`text-xs font-bold text-right ${i === data.length - 1 ? 'text-primary' : 'text-[#37352f] dark:text-[rgba(255,255,255,0.81)]'}`}>{d.label}</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Source: World Bank, Department of Statistics Singapore. Current USD, not adjusted for inflation.
        </p>
      </div>
    </figure>
  );
}

/* ─── Governance Scorecard ─── */
export function GovernanceScorecard() {
  const metrics = [
    { index: 'Corruption Perceptions Index', rank: '3rd', score: '84/100', source: 'Transparency International (2024)' },
    { index: 'Chandler Good Government Index', rank: '1st', score: 'Top in 3/7 pillars', source: 'Chandler Institute (2024)' },
    { index: 'PISA Education (all 3 domains)', rank: '1st', score: 'Math, Science, Reading', source: 'OECD (2022)' },
    { index: 'Global Container Port Ranking', rank: '1st', score: '40.9M TEUs', source: 'Straits Times (2024)' },
    { index: 'Ease of Doing Business', rank: 'Top 5', score: 'Consistently', source: 'World Bank (historical)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Singapore's Global Rankings</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Performance across major international indices</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[450px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Index</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Rank</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Detail</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Source</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => (
                <tr key={m.index} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{m.index}</td>
                  <td className="py-2.5 px-2 text-primary font-bold">{m.rank}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{m.score}</td>
                  <td className="py-2.5 px-2 text-muted-foreground">{m.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

/* ─── Industrial Evolution ─── */
export function IndustrialEvolution() {
  const eras = [
    { decade: '1960s', focus: 'Labor-intensive manufacturing', detail: 'Garments, toys, simple assembly', driver: 'Job creation' },
    { decade: '1970s', focus: 'Skill-intensive industry', detail: 'Precision engineering, petrochemicals', driver: 'Rising wages' },
    { decade: '1980s', focus: 'Capital-intensive tech', detail: 'Electronics, aviation, semiconductors', driver: 'Labor scarcity' },
    { decade: '1990s', focus: 'Knowledge economy', detail: 'Biotech, financial services, R&D', driver: 'Global competition' },
    { decade: '2000s', focus: 'Innovation hub', detail: 'IP creation, design, integrated services', driver: 'Value capture' },
    { decade: '2020s', focus: 'AI and digital economy', detail: '18.6% GDP from digital, 62.5% AI adoption', driver: 'Next frontier' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Industrial Policy Evolution</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Six decades of deliberate value-chain migration</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Era</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Focus</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Key sectors</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Driver</th>
              </tr>
            </thead>
            <tbody>
              {eras.map((e, i) => (
                <tr key={e.decade} className={`border-b border-[#e3e3e0]/60 dark:border-zinc-800/40 ${i === eras.length - 1 ? 'bg-primary/5' : ''}`}>
                  <td className={`py-2.5 px-2 font-bold ${i === eras.length - 1 ? 'text-primary' : 'text-[#37352f] dark:text-[rgba(255,255,255,0.81)]'}`}>{e.decade}</td>
                  <td className="py-2.5 px-2 font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{e.focus}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{e.detail}</td>
                  <td className="py-2.5 px-2 text-muted-foreground">{e.driver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: EDB history, SG101, IMF country reports. AI adoption figure: Business Times Singapore (2024). Digital economy share: IMDA (2024).
        </p>
      </div>
    </figure>
  );
}

/* ─── Healthcare Comparison ─── */
export function HealthcareComparison() {
  const countries = [
    { name: 'Singapore', spending: 4.9, lifeExp: 83.5, efficiency: 'Highest' },
    { name: 'Japan', spending: 10.9, lifeExp: 84.3, efficiency: 'High' },
    { name: 'Switzerland', spending: 11.3, lifeExp: 83.4, efficiency: 'Moderate' },
    { name: 'United Kingdom', spending: 11.3, lifeExp: 80.7, efficiency: 'Moderate' },
    { name: 'United States', spending: 17.3, lifeExp: 77.5, efficiency: 'Low' },
  ];

  const effColor: Record<string, string> = {
    'Highest': 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30',
    'High': 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
    'Moderate': 'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30',
    'Low': 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30',
  };

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Healthcare Efficiency</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Health spending (% GDP) vs. life expectancy (years)</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[400px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Country</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Spending</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Life exp.</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((c) => (
                <tr key={c.name} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{c.name}</td>
                  <td className="py-2.5 px-2 text-primary font-semibold">{c.spending}%</td>
                  <td className="py-2.5 px-2 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{c.lifeExp} yrs</td>
                  <td className="py-2.5 px-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${effColor[c.efficiency]}`}>{c.efficiency}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: World Bank, WHO, SingStat. Singapore spending ~4.9% of GDP (2024). US figure from CMS. Efficiency = life expectancy relative to spending.
        </p>
      </div>
    </figure>
  );
}

/* ─── Inequality Snapshot ─── */
export function InequalitySnapshot() {
  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Inequality in Singapore</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Income vs. wealth distribution, 2024</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4 text-center">
            <div className="text-2xl font-bold text-primary">0.435</div>
            <div className="text-xs font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)] mt-1">Gini (before transfers)</div>
          </div>
          <div className="rounded-[3px] border border-primary/30 bg-primary/5 p-4 text-center">
            <div className="text-2xl font-bold text-primary">0.364</div>
            <div className="text-xs font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)] mt-1">Gini (after transfers)</div>
            <div className="text-[10px] text-muted-foreground">Lowest since 2000</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium">Top 1% share of household wealth</span>
            <span className="font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">14%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium">Top 5% share of household wealth</span>
            <span className="font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">33%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium">Wealth Gini coefficient</span>
            <span className="font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">0.55</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium">Home ownership rate</span>
            <span className="font-bold text-primary">90.8%</span>
          </div>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: SingStat Key Household Income Trends 2024, Ministry of Finance (2026), CNA. Wealth Gini described by government as "broadly comparable" to UK, Japan, Germany.
        </p>
      </div>
    </figure>
  );
}

/* ─── Transferable vs Non-transferable ─── */
export function TransferabilityGrid() {
  const transferable = [
    'Competitive government salaries tied to private sector benchmarks',
    'Public housing structured to create a property-owning citizenry',
    'Adaptive industrial policy that moves up the value chain as wages rise',
    'Mandatory savings systems funding healthcare and retirement',
    'Active ethnic integration policies in housing and military',
  ];
  const nonTransferable = [
    'City-state size enabling centralized coordination',
    'Survival urgency from decolonization context',
    'Single dominant party providing decades of policy continuity',
    'No agricultural sector or hinterland to manage',
    'Strategic geographic position on global shipping routes',
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-center text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">What Can Be Transferred</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold text-center">Policy lessons from Singapore's development model</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-[#f7f6f3] dark:bg-zinc-800/30 p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Transferable</div>
            <ul className="space-y-2">
              {transferable.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">
                  <span className="text-primary mt-0.5 shrink-0">&#x2713;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-[#f7f6f3] dark:bg-zinc-800/30 p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-[#37352f]/60 dark:text-zinc-400 mb-3">Context-specific</div>
            <ul className="space-y-2">
              {nonTransferable.map((item) => (
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

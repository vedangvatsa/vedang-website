'use client';

import React from 'react';

/* ─── Regulatory Friction Comparison ─── */
export function RegulatoryFriction() {
  const data = [
    { country: 'Estonia', metric: 'Business registration', time: 'Hours', digital: true, note: 'e-Residency, fully online' },
    { country: 'UAE (Dubai)', metric: 'Free zone license', time: '1-3 days', digital: true, note: 'Digital portals, 100% foreign ownership' },
    { country: 'Singapore', metric: 'Company incorporation', time: '1-2 days', digital: true, note: 'BizFile+, automated compliance' },
    { country: 'United Kingdom', metric: 'Company registration', time: '24-48 hours', digital: true, note: 'Companies House online' },
    { country: 'United States', metric: 'LLC formation', time: '1-6 weeks', digital: false, note: 'Varies by state, often paper-based' },
    { country: 'India', metric: 'Company registration', time: '7-15 days', digital: false, note: 'MCA portal, improving but multi-step' },
    { country: 'Brazil', metric: 'Company registration', time: '20-30 days', digital: false, note: 'Multiple agencies, notarization required' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Business Registration Speed</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Time to legally incorporate, selected jurisdictions (2025-2026)</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[520px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Jurisdiction</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Time</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Digital-first</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.country} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{d.country}</td>
                  <td className="py-2.5 px-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${d.digital ? 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400' : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'}`}>
                      {d.time}
                    </span>
                  </td>
                  <td className="py-2.5 px-2">{d.digital ? <span className="text-green-600 dark:text-green-400 text-[10px] font-bold">Yes</span> : <span className="text-amber-600 dark:text-amber-400 text-[10px] font-bold">Partial</span>}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/70 dark:text-[rgba(255,255,255,0.55)]">{d.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: World Bank B-READY (2025), e-Residency.gov.ee, Dubai DED, BizFile+ Singapore, Companies House UK. Timelines are approximate and vary by entity type.
        </p>
      </div>
    </figure>
  );
}

/* ─── Cost of Bureaucratic Friction ─── */
export function BureaucracyCostChart() {
  const sectors = [
    { sector: 'Pharmaceuticals', metric: 'New drug approval', cost: '$2.6B average', time: '10-15 years', source: 'Tufts CSDD' },
    { sector: 'Construction', metric: 'Building permit (US avg)', cost: 'Varies widely', time: '2-12 months', source: 'NAHB estimates' },
    { sector: 'Banking', metric: 'Bank charter approval (US)', cost: '$10-30M compliance', time: '12-24 months', source: 'OCC / FDIC' },
    { sector: 'Immigration', metric: 'H-1B processing (US)', cost: '$5-10K fees', time: '3-12 months', source: 'USCIS' },
    { sector: 'Energy', metric: 'Power plant permit (US)', cost: 'Multi-million', time: '3-7 years', source: 'EIA / FERC' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Friction Tax by Sector</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Regulatory approval cost and time across industries</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[520px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Sector</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Process</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Approx. cost</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Timeline</th>
              </tr>
            </thead>
            <tbody>
              {sectors.map((s) => (
                <tr key={s.sector} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{s.sector}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{s.metric}</td>
                  <td className="py-2.5 px-2"><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">{s.cost}</span></td>
                  <td className="py-2.5 px-2"><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400">{s.time}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: Tufts CSDD ($2.6B capitalized drug dev cost), NAHB, OCC, USCIS, EIA. Costs and timelines are approximate ranges; actual figures vary by jurisdiction and project complexity.
        </p>
      </div>
    </figure>
  );
}

/* ─── E-Governance Maturity ─── */
export function EGovernanceMaturity() {
  const countries = [
    { country: 'Estonia', score: 95, services: '99% of public services online', highlight: 'X-Road backbone, e-Residency (110K+ users from 170+ countries)' },
    { country: 'Singapore', score: 90, services: 'SingPass, CorpPass, BizFile+', highlight: 'Smart Nation initiative, API-first government' },
    { country: 'Denmark', score: 88, services: 'Digital-first mandate since 2014', highlight: 'MitID, NemID successor, 95%+ citizen adoption' },
    { country: 'UAE', score: 85, services: 'Smart Dubai, UAEPASS', highlight: 'Paperless government initiative (100% by 2021)' },
    { country: 'South Korea', score: 83, services: 'Digital government act (2020)', highlight: 'AI-powered public services, MyData initiative' },
  ];

  const max = 100;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Digital Governance Leaders</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">E-governance maturity, selected countries (UN EGDI-adjacent scoring)</p>

        <div className="space-y-3">
          {countries.map((c, i) => (
            <div key={c.country} className="grid grid-cols-[100px_1fr] gap-3 items-start">
              <div>
                <div className="text-xs font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{c.country}</div>
                <div className="text-[10px] text-muted-foreground">{c.services}</div>
              </div>
              <div>
                <div className="w-full h-3 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden mb-1">
                  <div
                    className="h-full rounded-md"
                    style={{
                      width: `${(c.score / max) * 100}%`,
                      backgroundColor: i === 0 ? 'hsl(210 90% 40%)' : '#37352f',
                      opacity: i === 0 ? 0.8 : 0.25 + (0.12 * (countries.length - i)),
                    }}
                  />
                </div>
                <div className="text-[10px] text-[#37352f]/60 dark:text-[rgba(255,255,255,0.45)]">{c.highlight}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: UN E-Government Development Index (2024), e-Estonia.com, Smart Nation Singapore, Smart Dubai. Scores are illustrative composites based on UN EGDI rankings and e-service coverage.
        </p>
      </div>
    </figure>
  );
}

'use client';

import React from 'react';

/* ─── Digital Government Maturity ─── */
export function DigitalGovMaturity() {
  const countries = [
    { name: 'Estonia', digital: 100, ai: 'Eesti.ai (2026)', score: 95, highlight: true },
    { name: 'Singapore', digital: 97, ai: 'Smart Nation 2.0', score: 93, highlight: false },
    { name: 'UAE', digital: 95, ai: 'AI-native gov by 2027', score: 91, highlight: false },
    { name: 'Denmark', digital: 93, ai: 'MitID (95% adoption)', score: 90, highlight: false },
    { name: 'South Korea', digital: 88, ai: 'Digital Platform Gov', score: 85, highlight: false },
    { name: 'United States', digital: 72, ai: 'Fragmented, state-level', score: 65, highlight: false },
    { name: 'India', digital: 68, ai: 'IndiaAI Mission', score: 60, highlight: false },
  ];
  const max = 100;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Digital Government Maturity Index</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Service digitization rate and AI readiness, 2026</p>

        <div className="space-y-1.5">
          {countries.map((c) => (
            <div key={c.name} className="grid grid-cols-[90px_1fr_75px] gap-2 items-center">
              <span className={`text-xs truncate ${c.highlight ? 'text-primary font-bold' : 'text-muted-foreground font-medium'}`}>{c.name}</span>
              <div className="w-full h-3.5 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md"
                  style={{ width: `${(c.digital / max) * 100}%`, backgroundColor: c.highlight ? 'hsl(210 90% 40%)' : '#37352f', opacity: c.highlight ? 0.8 : 0.25 + (c.digital / max) * 0.4 }}
                />
              </div>
              <span className={`text-[10px] font-bold text-right ${c.highlight ? 'text-primary' : 'text-[#37352f] dark:text-[rgba(255,255,255,0.81)]'}`}>{c.digital}%</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: UN E-Government Survey (2024), e-Estonia (2026), GovTech Singapore (2025), UAE Digital Government Authority (2025).
        </p>
      </div>
    </figure>
  );
}

/* ─── E-Residency Impact ─── */
export function EResidencyImpact() {
  const data = [
    { year: '2020', companies: 2100, revenue: 20, residents: 7500 },
    { year: '2021', companies: 2800, revenue: 31, residents: 8200 },
    { year: '2022', companies: 3600, revenue: 42, residents: 9100 },
    { year: '2023', companies: 4200, revenue: 55, residents: 10500 },
    { year: '2024', companies: 4830, revenue: 67, residents: 11500 },
    { year: '2025', companies: 5556, revenue: 124.9, residents: 13828 },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Estonia e-Residency Growth</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Annual company formations, state revenue, and new e-residents, 2020-2025</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Year</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">New Companies</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">State Revenue (€M)</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">New e-Residents</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={d.year} className={`border-b border-[#e3e3e0]/60 dark:border-zinc-800/40 ${i === data.length - 1 ? 'font-bold' : ''}`}>
                  <td className="py-2.5 px-2 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{d.year}</td>
                  <td className="py-2.5 px-2 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{d.companies.toLocaleString()}</td>
                  <td className="py-2.5 px-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${i === data.length - 1 ? 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400' : 'text-[#37352f] dark:text-[rgba(255,255,255,0.81)]'}`}>
                      €{d.revenue}M
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{d.residents.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: e-Residency program annual reports (2020-2025), Estonian Ministry of Economic Affairs. 2025 revenue represents an 87% YoY increase.
        </p>
      </div>
    </figure>
  );
}

/* ─── Agentic State Architecture ─── */
export function AgenticStateArchitecture() {
  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Agentic State Architecture</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">How AI transforms digital government from reactive services to proactive agents</p>

        <div className="flex flex-col gap-2">
          <div className="rounded border border-primary bg-primary/10 p-3 text-center font-bold text-primary text-sm">
            Citizen Intent (Natural Language / Life Event Trigger)
          </div>
          <div className="mx-auto h-4 border-l-2 border-dashed border-[#e3e3e0] dark:border-zinc-700"></div>
          <div className="rounded border border-[#e3e3e0] dark:border-zinc-700 bg-[#f7f6f3] dark:bg-zinc-800/40 p-3 text-center text-xs font-semibold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">
            Government AI Agent Layer (LLM + Interoperability Backbone)
          </div>
          <div className="mx-auto h-4 border-l-2 border-dashed border-[#e3e3e0] dark:border-zinc-700"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="rounded border border-[#e3e3e0] dark:border-zinc-700 p-2 text-center text-[10px] font-medium font-mono text-muted-foreground">Population Registry<br/><span className="text-primary">X-Road / SingPass</span></div>
            <div className="rounded border border-[#e3e3e0] dark:border-zinc-700 p-2 text-center text-[10px] font-medium font-mono text-muted-foreground">Tax Authority<br/><span className="text-primary">Auto-assessment</span></div>
            <div className="rounded border border-[#e3e3e0] dark:border-zinc-700 p-2 text-center text-[10px] font-medium font-mono text-muted-foreground">Health Insurance<br/><span className="text-primary">Auto-enrollment</span></div>
            <div className="rounded border border-[#e3e3e0] dark:border-zinc-700 p-2 text-center text-[10px] font-medium font-mono text-muted-foreground">Business Registry<br/><span className="text-primary">Instant formation</span></div>
          </div>
          <div className="mx-auto h-4 border-l-2 border-dashed border-[#e3e3e0] dark:border-zinc-700"></div>
          <div className="rounded border border-[#e3e3e0] dark:border-zinc-700 bg-[#f7f6f3] dark:bg-zinc-800/40 p-3 text-center text-[10px] font-semibold text-muted-foreground">
            Cryptographic Identity Layer (Digital ID + Verifiable Credentials)
          </div>
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          In the current model, citizens navigate to specific agencies. In the agentic model, a life event (birth, marriage, business formation) triggers an autonomous agent that propagates data across all relevant systems without additional citizen input.
        </p>
      </div>
    </figure>
  );
}

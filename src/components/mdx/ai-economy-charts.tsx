'use client';

import React from 'react';

/* ─── AI Job Exposure Chart ─── */
export function AIJobExposure() {
  const data = [
    { label: 'Advanced economies', pct: 60, source: 'IMF (2024)' },
    { label: 'Emerging markets', pct: 40, source: 'IMF (2024)' },
    { label: 'Low-income countries', pct: 26, source: 'IMF (2024)' },
    { label: 'Global average', pct: 40, source: 'IMF (2024)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">AI Employment Exposure</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Share of jobs exposed to AI, by economy type</p>

        <div className="space-y-2">
          {data.map((d, i) => (
            <div key={d.label} className="grid grid-cols-[140px_1fr_40px] gap-3 items-center">
              <span className="text-xs font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{d.label}</span>
              <div className="w-full h-4 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md"
                  style={{ width: `${d.pct}%`, backgroundColor: i === 0 ? 'hsl(210 90% 40%)' : '#37352f', opacity: i === 0 ? 0.8 : 0.3 + (0.1 * (data.length - i)) }}
                />
              </div>
              <span className={`text-xs font-bold text-right ${i === 0 ? 'text-primary' : 'text-[#37352f] dark:text-[rgba(255,255,255,0.81)]'}`}>{d.pct}%</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Source: IMF Staff Discussion Note, January 2024. "Exposure" includes both augmentation and automation risk.
        </p>
      </div>
    </figure>
  );
}

/* ─── WEF Job Churn ─── */
export function JobChurnChart() {
  const created = 170;
  const displaced = 92;
  const net = 78;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Labor Market Churn by 2030</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">WEF Future of Jobs Report 2025 (millions of jobs)</p>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4">
            <div className="text-2xl font-bold text-primary">+{created}M</div>
            <div className="text-xs text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1">Created</div>
          </div>
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">-{displaced}M</div>
            <div className="text-xs text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1">Displaced</div>
          </div>
          <div className="rounded-[3px] border border-primary/30 bg-primary/5 p-4">
            <div className="text-2xl font-bold text-primary">+{net}M</div>
            <div className="text-xs text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1">Net gain</div>
          </div>
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          <span className="font-medium">22% total workforce churn.</span> Fastest-growing: AI/data, cybersecurity, sustainability. Fastest-declining: clerical, administrative, data entry.
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Source: WEF Future of Jobs Report 2025, surveying 1,000+ employers across 55 economies.
        </p>
      </div>
    </figure>
  );
}

/* ─── Early Career Impact ─── */
export function EarlyCareerImpact() {
  const roles = [
    { role: 'Software development', decline: 20, period: 'Peak to Jul 2025' },
    { role: 'Customer service', decline: 16, period: 'Since late 2022' },
    { role: 'Data entry / admin', decline: 14, period: 'Since late 2022' },
    { role: 'Financial analysis', decline: 11, period: 'Since late 2022' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Early-Career Employment Decline</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Relative decline for ages 22-25 in AI-exposed roles</p>

        <div className="space-y-2">
          {roles.map((r, i) => (
            <div key={r.role} className="grid grid-cols-[150px_1fr_40px] gap-3 items-center">
              <span className="text-xs font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{r.role}</span>
              <div className="w-full h-4 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md"
                  style={{ width: `${(r.decline / 25) * 100}%`, backgroundColor: i === 0 ? 'hsl(210 90% 40%)' : '#37352f', opacity: i === 0 ? 0.8 : 0.4 + (0.1 * (roles.length - i)) }}
                />
              </div>
              <span className="text-xs font-bold text-right text-red-600 dark:text-red-400">-{r.decline}%</span>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-[#f7f6f3] dark:bg-zinc-800/30 p-3">
          <p className="text-xs text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Employment for workers age 30+ in the same roles remained stable or grew. The impact is concentrated in entry-level hiring, not wages.</p>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Source: Stanford Digital Economy Lab / ADP payroll data (2025-2026). Controlled for firm-level hiring shocks.
        </p>
      </div>
    </figure>
  );
}

/* ─── Productivity Paradox Chart ─── */
export function ProductivityParadox() {
  const views = [
    { source: 'Acemoglu (MIT)', estimate: '1.1-1.6%', timeframe: 'GDP gain over 10 yrs', stance: 'conservative' },
    { source: 'Goldman Sachs', estimate: '7%', timeframe: 'GDP gain over 10 yrs', stance: 'optimistic' },
    { source: 'IMF', estimate: '40%', timeframe: 'Jobs exposed globally', stance: 'neutral' },
    { source: 'Task-level studies', estimate: '~30%', timeframe: 'Median productivity gain', stance: 'measured' },
    { source: 'Aggregate data', estimate: '~0%', timeframe: 'Macro productivity signal', stance: 'paradox' },
  ];

  const stanceColor: Record<string, string> = {
    'conservative': 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400',
    'optimistic': 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
    'neutral': 'bg-[#f7f6f3] dark:bg-zinc-800/30 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]',
    'measured': 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400',
    'paradox': 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400',
  };

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The AI Productivity Paradox</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Where different analyses land on AI's economic impact</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[450px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Source</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Estimate</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Timeframe</th>
              </tr>
            </thead>
            <tbody>
              {views.map((v) => (
                <tr key={v.source} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{v.source}</td>
                  <td className="py-2.5 px-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${stanceColor[v.stance]}`}>{v.estimate}</span>
                  </td>
                  <td className="py-2.5 px-2 text-muted-foreground">{v.timeframe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: Acemoglu (MIT, 2024), Goldman Sachs (2024-2026), IMF (2024), various firm-level productivity studies. The Solow Paradox: task-level gains are real but have not yet appeared in aggregate national productivity data.
        </p>
      </div>
    </figure>
  );
}

/* ─── Gender Impact Chart ─── */
export function GenderImpact() {
  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">AI Automation Risk by Gender</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">US workers in occupations at high risk of AI automation</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-5">
            <div className="text-3xl font-bold text-primary">79%</div>
            <div className="text-sm font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)] mt-1">Women</div>
            <div className="w-full h-3 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden mt-3">
              <div className="h-full rounded-md bg-primary/80" style={{ width: '79%' }} />
            </div>
          </div>
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-5">
            <div className="text-3xl font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">58%</div>
            <div className="text-sm font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)] mt-1">Men</div>
            <div className="w-full h-3 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden mt-3">
              <div className="h-full rounded-md bg-[#37352f]/50 dark:bg-zinc-400/50" style={{ width: '58%' }} />
            </div>
          </div>
        </div>

        <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-[#f7f6f3] dark:bg-zinc-800/30 p-3">
          <p className="text-xs text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">
            In high-income OECD countries, vulnerable jobs make up <span className="font-bold text-primary">9.6%</span> of female employment vs. <span className="font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">3.2%</span> of male employment (nearly 3x the proportion).
          </p>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: OECD analysis (2024), DemandSage compilation.
        </p>
      </div>
    </figure>
  );
}

/* ─── UBI Pilot Results ─── */
export function UBIPilotResults() {
  const pilots = [
    { name: 'OpenResearch (Altman)', amount: '$1,000/mo, 3 yrs', finding: '2% reduction in work (~15 min/day less)', outcome: 'minimal' },
    { name: 'Stockton SEED', amount: '$500/mo, 2 yrs', finding: 'Full-time employment increased vs. control', outcome: 'positive' },
    { name: 'Finland experiment', amount: '\u20AC560/mo, 2 yrs', finding: 'Increased trust in government, well-being', outcome: 'positive' },
    { name: 'Canada Mincome (1970s)', amount: 'Guaranteed income', finding: '8.5% reduction in hospitalizations', outcome: 'positive' },
  ];

  const outcomeColor: Record<string, string> = {
    'positive': 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30',
    'minimal': 'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30',
  };

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">UBI Pilot Results</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Evidence from 160+ pilots across four decades</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Pilot</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Amount</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Finding</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Work impact</th>
              </tr>
            </thead>
            <tbody>
              {pilots.map((p) => (
                <tr key={p.name} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{p.name}</td>
                  <td className="py-2.5 px-2 text-primary font-semibold">{p.amount}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{p.finding}</td>
                  <td className="py-2.5 px-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${outcomeColor[p.outcome]}`}>
                      {p.outcome === 'positive' ? 'Positive' : 'Minimal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: Stanford Basic Income Lab, OpenResearch, City of Stockton SEED program, Finnish Social Insurance Institution.
        </p>
      </div>
    </figure>
  );
}

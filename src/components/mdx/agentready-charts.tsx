'use client';

import React from 'react';
import { ChartCard } from './chart-card';
import { LeaderboardSection } from '@/components/scan/leaderboard';

/* ─── Hero Summary Card ─── */
export function AgentreadyHeroCard() {
  return (
    <div className="not-prose my-8 rounded-xl border border-border bg-card p-6 md:p-8 shadow-xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            50,000-Domain Web Census
          </span>
          <p className="text-sm text-muted-foreground leading-relaxed pt-1">
            Empirical measurement of 50,000 domains sampled from the Tranco top-1M ranking, evaluated across 61 machine-readability checks.
          </p>
        </div>
        
        <div className="flex flex-wrap md:flex-nowrap items-center gap-4 w-full md:w-auto">
          <div className="p-4 rounded-xl border border-border bg-muted/20 flex-1 md:flex-initial text-center min-w-[120px]">
            <div className="text-2xl md:text-3xl font-extrabold text-foreground tabular-nums">25.7</div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Mean Score / 100</div>
          </div>
          <div className="p-4 rounded-xl border border-border bg-muted/20 flex-1 md:flex-initial text-center min-w-[120px]">
            <div className="text-2xl md:text-3xl font-extrabold text-primary tabular-nums">6.62%</div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">llms.txt Rate</div>
          </div>
          <div className="p-4 rounded-xl border border-border bg-muted/20 flex-1 md:flex-initial text-center min-w-[120px]">
            <div className="text-2xl md:text-3xl font-extrabold text-amber-600 tabular-nums">21.1%</div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">WAF Refusal Gap</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Headline Check Adoption Chart ─── */
export function AgentreadyAdoptionChart() {
  const checks = [
    { label: 'robots.txt AI policy', share: 43.76 },
    { label: 'Both bot identities served', share: 37.82 },
    { label: 'JSON-LD structured data', share: 21.37 },
    { label: 'Author E-E-A-T signals', share: 13.82 },
    { label: 'llms.txt catalog', share: 6.62 },
    { label: 'security.txt', share: 4.58 },
    { label: 'Markdown negotiation', share: 2.95 },
    { label: 'Live MCP server', share: 1.82 },
    { label: 'Machine payments', share: 0.33 },
    { label: 'OpenAPI spec', share: 0.16 },
  ];

  const maxVal = 50;

  return (
    <ChartCard
      title="Adoption Across 10 Headline Machine Checks"
      subtitle="Share of 50,000 audited domains passing each check (%)"
    >
      <div className="space-y-3">
        {checks.map((c) => {
          const widthPct = (c.share / maxVal) * 100;
          return (
            <div key={c.label} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-foreground">{c.label}</span>
                <span className="font-semibold text-muted-foreground tabular-nums">{c.share.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-muted/40 h-3.5 rounded-full overflow-hidden flex">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(widthPct, 1)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}

/* ─── Rank Tiers Comparison Chart ─── */
export function AgentreadyTiersChart() {
  const tiers = [
    { name: 'Ranks 1–10k', meanScore: 26.1, refusalRate: 56.2 },
    { name: 'Ranks 10k–100k', meanScore: 25.2, refusalRate: 55.6 },
    { name: 'Ranks 100k–1M', meanScore: 25.9, refusalRate: 52.2 },
  ];

  return (
    <ChartCard
      title="Mean Score & Bot Refusal Rate by Tranco Rank Tier"
      subtitle="Famous sites score no better than tail domains"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((t) => (
          <div key={t.name} className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
            <div className="text-xs font-bold text-foreground">{t.name}</div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                  <span>Mean Score</span>
                  <span className="font-semibold text-foreground">{t.meanScore} / 100</span>
                </div>
                <div className="w-full bg-muted/40 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${t.meanScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                  <span>Both-Bot Refusal</span>
                  <span className="font-semibold text-amber-600">{t.refusalRate}%</span>
                </div>
                <div className="w-full bg-muted/40 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${t.refusalRate}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

/* ─── Robots.txt Policy vs HTTP Behavior Chart ─── */
export function AgentreadyPolicyChart() {
  const groups = [
    { policy: 'Policy Allows AI Bots', serves: 67.2, partial: 11.7, refuses: 21.1 },
    { policy: 'Policy Partially Restricts', serves: 28.4, partial: 5.8, refuses: 65.8 },
    { policy: 'No AI Policy Declared', serves: 13.0, partial: 4.6, refuses: 82.4 },
  ];

  return (
    <ChartCard
      title="HTTP Behavior Grouped by robots.txt Policy"
      subtitle="21.1% of sites declaring allow policies still block crawlers over HTTP"
    >
      <div className="space-y-6">
        {groups.map((g) => (
          <div key={g.policy} className="space-y-2">
            <div className="text-xs font-semibold text-foreground">{g.policy}</div>
            <div className="w-full bg-muted/30 h-7 rounded-lg overflow-hidden flex text-[11px] font-bold text-white">
              <div
                className="bg-emerald-600 flex items-center justify-center transition-all"
                style={{ width: `${g.serves}%` }}
                title={`Serves: ${g.serves}%`}
              >
                {g.serves > 15 ? `${g.serves}%` : ''}
              </div>
              <div
                className="bg-amber-500 flex items-center justify-center transition-all"
                style={{ width: `${g.partial}%` }}
                title={`Partial: ${g.partial}%`}
              >
                {g.partial > 10 ? `${g.partial}%` : ''}
              </div>
              <div
                className="bg-red-500 flex items-center justify-center transition-all"
                style={{ width: `${g.refuses}%` }}
                title={`Refuses: ${g.refuses}%`}
              >
                {g.refuses > 15 ? `${g.refuses}%` : ''}
              </div>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground pt-0.5">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> Serves ({g.serves}%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Partial ({g.partial}%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Refuses ({g.refuses}%)</span>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

/* ─── Embedded Leaderboard Section ─── */
export function AgentreadyLeaderboard() {
  return (
    <div className="not-prose my-8">
      <LeaderboardSection />
    </div>
  );
}

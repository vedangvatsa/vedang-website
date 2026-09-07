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
        
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
          <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex-1 md:flex-initial text-center min-w-[110px]">
            <div className="text-2xl md:text-3xl font-extrabold text-foreground tabular-nums">25.7</div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Mean Score</div>
          </div>
          <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex-1 md:flex-initial text-center min-w-[110px]">
            <div className="text-2xl md:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">6.62%</div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">llms.txt Rate</div>
          </div>
          <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex-1 md:flex-initial text-center min-w-[110px]">
            <div className="text-2xl md:text-3xl font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">21.1%</div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">WAF Refusal Gap</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Headline Check Adoption Chart ─── */
export function AgentreadyAdoptionChart() {
  const checks = [
    { label: 'robots.txt AI policy', share: 43.76, tier: 'high' },
    { label: 'Both bot identities served', share: 37.82, tier: 'high' },
    { label: 'JSON-LD structured data', share: 21.37, tier: 'medium' },
    { label: 'Author E-E-A-T signals', share: 13.82, tier: 'medium' },
    { label: 'llms.txt catalog', share: 6.62, tier: 'low' },
    { label: 'security.txt', share: 4.58, tier: 'low' },
    { label: 'Markdown negotiation', share: 2.95, tier: 'critical' },
    { label: 'Live MCP server', share: 1.82, tier: 'critical' },
    { label: 'Machine payments', share: 0.33, tier: 'critical' },
    { label: 'OpenAPI spec', share: 0.16, tier: 'critical' },
  ];

  const maxVal = 50;

  const barColor = (tier: string) => {
    switch (tier) {
      case 'high': return 'bg-emerald-600 dark:bg-emerald-500';
      case 'medium': return 'bg-teal-600 dark:bg-teal-500';
      case 'low': return 'bg-amber-500';
      default: return 'bg-rose-500';
    }
  };

  return (
    <ChartCard
      title="Adoption Across 10 Headline Machine Checks"
      subtitle="Share of 50,000 audited domains passing each check (%)"
    >
      <div className="space-y-3.5">
        {checks.map((c) => {
          const widthPct = (c.share / maxVal) * 100;
          return (
            <div key={c.label} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-foreground">{c.label}</span>
                <span className="font-semibold text-muted-foreground tabular-nums">{c.share.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-muted/40 h-3 rounded-full overflow-hidden flex">
                <div
                  className={`${barColor(c.tier)} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${Math.max(widthPct, 1.5)}%` }}
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
          <div key={t.name} className="p-4 rounded-xl border border-border bg-card space-y-3">
            <div className="text-xs font-bold text-foreground uppercase tracking-wider">{t.name}</div>
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Mean Score</span>
                  <span className="font-semibold text-foreground tabular-nums">{t.meanScore} / 100</span>
                </div>
                <div className="w-full bg-muted/40 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${t.meanScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Both-Bot Refusal</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400 tabular-nums">{t.refusalRate}%</span>
                </div>
                <div className="w-full bg-muted/40 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${t.refusalRate}%` }} />
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
            <div className="w-full bg-muted/30 h-6 rounded-lg overflow-hidden flex">
              <div
                className="bg-emerald-600 transition-all"
                style={{ width: `${g.serves}%` }}
                title={`Serves: ${g.serves}%`}
              />
              <div
                className="bg-amber-500 transition-all"
                style={{ width: `${g.partial}%` }}
                title={`Partial: ${g.partial}%`}
              />
              <div
                className="bg-rose-600 transition-all"
                style={{ width: `${g.refuses}%` }}
                title={`Refuses: ${g.refuses}%`}
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground pt-0.5">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                <span>Serves: <strong className="text-foreground font-semibold">{g.serves}%</strong></span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span>Partial: <strong className="text-foreground font-semibold">{g.partial}%</strong></span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0" />
                <span>Refuses: <strong className="text-foreground font-semibold">{g.refuses}%</strong></span>
              </span>
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

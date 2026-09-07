'use client';

import React from 'react';
import { ChartCard } from './chart-card';
import { LeaderboardSection } from '@/components/scan/leaderboard';

/* ─── Hero Summary Card (Strict Greyscale) ─── */
export function AgentreadyHeroCard() {
  return (
    <div className="not-prose my-8 rounded-xl border border-border bg-card p-5 md:p-6 shadow-xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-foreground border border-border">
            50,000-Domain Web Census
          </span>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            Empirical census measuring machine readiness across 50,000 origins from the Tranco top-1M ranking using 61 deterministic probes.
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="p-3 rounded-lg border border-border bg-muted/20 text-center min-w-[100px]">
            <div className="text-xl md:text-2xl font-bold text-foreground tabular-nums">25.7</div>
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">Mean Score</div>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/20 text-center min-w-[100px]">
            <div className="text-xl md:text-2xl font-bold text-foreground tabular-nums">6.62%</div>
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">llms.txt Rate</div>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/20 text-center min-w-[100px]">
            <div className="text-xl md:text-2xl font-bold text-foreground tabular-nums">21.1%</div>
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">WAF Gap</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Headline Check Adoption Table / Chart (Greyscale) ─── */
export function AgentreadyAdoptionChart() {
  const checks = [
    { label: 'robots.txt AI policy', count: 21880, share: 43.76 },
    { label: 'Both bot identities served', count: 18910, share: 37.82 },
    { label: 'JSON-LD structured data', count: 10685, share: 21.37 },
    { label: 'Author E-E-A-T signals', count: 6910, share: 13.82 },
    { label: 'llms.txt catalog', count: 3310, share: 6.62 },
    { label: 'security.txt (RFC 9116)', count: 2290, share: 4.58 },
    { label: 'Markdown content negotiation', count: 1475, share: 2.95 },
    { label: 'Live MCP server (JSON-RPC)', count: 910, share: 1.82 },
    { label: 'Machine micropayments (L402)', count: 165, share: 0.33 },
    { label: 'OpenAPI 3.1 spec', count: 80, share: 0.16 },
  ];

  const maxVal = 50;

  return (
    <ChartCard
      title="Adoption Rates Across 10 Headline Machine Checks"
      subtitle="Passing origins out of 50,000 audited domains (Tranco sample)"
    >
      <div className="space-y-3">
        {checks.map((c) => {
          const widthPct = (c.share / maxVal) * 100;
          return (
            <div key={c.label} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-foreground">{c.label}</span>
                <div className="flex items-center gap-2 text-muted-foreground tabular-nums">
                  <span className="text-[11px]">{c.count.toLocaleString()} / 50k</span>
                  <span className="font-semibold text-foreground w-12 text-right">{c.share.toFixed(2)}%</span>
                </div>
              </div>
              <div className="w-full bg-muted/40 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-zinc-900 dark:bg-zinc-100 h-full rounded-full transition-all duration-300"
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

/* ─── Rank Tiers Comparison Matrix (Greyscale) ─── */
export function AgentreadyTiersChart() {
  const tiers = [
    { name: 'Ranks 1–10k (Top Tier)', count: 10000, meanScore: 26.1, medianScore: 25.0, refusalRate: 56.2 },
    { name: 'Ranks 10k–100k (Mid Tier)', count: 20000, meanScore: 25.2, medianScore: 24.0, refusalRate: 55.6 },
    { name: 'Ranks 100k–1M (Tail Tier)', count: 20000, meanScore: 25.9, medianScore: 25.0, refusalRate: 52.2 },
  ];

  return (
    <ChartCard
      title="Machine Readiness by Tranco Rank Tier"
      subtitle="Sample size: 50,000 domains stratified across three rank bands"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tiers.map((t) => (
          <div key={t.name} className="p-4 rounded-lg border border-border bg-card space-y-3">
            <div className="text-xs font-bold text-foreground border-b border-border pb-2">{t.name}</div>
            
            <div className="space-y-2.5 pt-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Mean Score</span>
                <span className="font-semibold text-foreground tabular-nums">{t.meanScore} / 100</span>
              </div>
              <div className="w-full bg-muted/40 h-1.5 rounded-full overflow-hidden">
                <div className="bg-zinc-900 dark:bg-zinc-100 h-full rounded-full" style={{ width: `${t.meanScore}%` }} />
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-muted-foreground">Median Score</span>
                <span className="font-semibold text-foreground tabular-nums">{t.medianScore} / 100</span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-muted-foreground">Both-Bot Edge Refusal</span>
                <span className="font-semibold text-foreground tabular-nums">{t.refusalRate}%</span>
              </div>
              <div className="w-full bg-muted/40 h-1.5 rounded-full overflow-hidden">
                <div className="bg-zinc-600 dark:bg-zinc-400 h-full rounded-full" style={{ width: `${t.refusalRate}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

/* ─── Robots.txt Policy vs HTTP Behavior Matrix (Greyscale) ─── */
export function AgentreadyPolicyChart() {
  const groups = [
    { policy: 'Policy Explicitly Allows AI Bots', n: 21881, serves: 67.2, partial: 11.7, refuses: 21.1 },
    { policy: 'Policy Restricts AI Bots', n: 7420, serves: 28.4, partial: 5.8, refuses: 65.8 },
    { policy: 'No AI Policy Declared in robots.txt', n: 20699, serves: 13.0, partial: 4.6, refuses: 82.4 },
  ];

  return (
    <ChartCard
      title="robots.txt Crawler Directives vs Edge WAF HTTP Response"
      subtitle="21.1% of origins declaring allow policies still block crawlers over HTTP"
    >
      <div className="space-y-5">
        {groups.map((g) => (
          <div key={g.policy} className="space-y-2">
            <div className="flex justify-between items-baseline text-xs">
              <span className="font-semibold text-foreground">{g.policy}</span>
              <span className="text-[11px] text-muted-foreground tabular-nums">N = {g.n.toLocaleString()}</span>
            </div>
            
            <div className="w-full bg-muted/40 h-4 rounded overflow-hidden flex">
              <div className="bg-zinc-900 dark:bg-zinc-100 transition-all" style={{ width: `${g.serves}%` }} title={`Serves 200 OK: ${g.serves}%`} />
              <div className="bg-zinc-500 transition-all" style={{ width: `${g.partial}%` }} title={`Partial / Rate limited: ${g.partial}%`} />
              <div className="bg-zinc-300 dark:bg-zinc-700 transition-all" style={{ width: `${g.refuses}%` }} title={`Refused (403/429/503): ${g.refuses}%`} />
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] text-muted-foreground pt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100 shrink-0" />
                <span>Serves 200: <strong className="text-foreground font-semibold">{g.serves}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-500 shrink-0" />
                <span>Throttled: <strong className="text-foreground font-semibold">{g.partial}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0" />
                <span>Refused: <strong className="text-foreground font-semibold">{g.refuses}%</strong></span>
              </div>
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

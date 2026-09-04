'use client';

import { useEffect, useRef, useState } from 'react';
import { SectionHeader } from '@/components/ui/section-header';
import { cn } from '@/lib/utils';

interface TopEntry {
  rank: number;
  domain: string;
  score: number;
  grade: string;
  layers: Record<string, number>;
  scannedAt: string;
  tier: number;
}

interface Summary {
  snapshotEnd: string | null;
  domainsAttempted: number;
  domainsScored: number;
  meanScore: number;
  medianScore: number;
  adoption: Record<string, { pass: number; n: number; share: number }>;
}

const TARGET_N = 50000;

function gradeClass(grade: string): string {
  if (grade === 'A+' || grade === 'A') return 'text-emerald-600';
  if (grade === 'B') return 'text-teal-600';
  if (grade === 'C') return 'text-amber-600';
  return 'text-red-500';
}

function DomainIcon({ domain }: { domain: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-muted text-[10px] font-semibold text-muted-foreground shrink-0">
        {domain.charAt(0).toUpperCase()}
      </span>
    );
  }
  return (
    <img
      src={`/data/leaderboard/favicons/${domain}.ico`}
      alt=""
      width={16}
      height={16}
      loading="lazy"
      onError={() => setFailed(true)}
      className="w-4 h-4 rounded-sm shrink-0"
    />
  );
}

export function LeaderboardSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [top, setTop] = useState<TopEntry[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<number>(0);
  const [index, setIndex] = useState<[string, number, string, number, string][] | null>(null);
  const [indexLoading, setIndexLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/data/leaderboard/summary.json').then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
      fetch('/data/leaderboard/top500.json').then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
    ])
      .then(([s, t]) => { setSummary(s); setTop(t); })
      .catch(() => setFailed(true));
  }, []);

  function onSearch(q: string) {
    setQuery(q);
    if (!index && !indexLoading && q.trim().length >= 2) {
      setIndexLoading(true);
      fetch('/data/leaderboard/index.json')
        .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
        .then((d) => setIndex(d))
        .catch(() => setFailed(true))
        .finally(() => setIndexLoading(false));
    }
  }

  const results = query.trim().length >= 2 && index
    ? index.filter(([d, , , t]) => d.includes(query.trim().toLowerCase()) && (tierFilter === 0 || t === tierFilter)).slice(0, 50)
    : null;
  const visible = (tierFilter === 0 ? top : top.filter((e) => e.tier === tierFilter)).slice(0, expanded ? 500 : 100);
  const visibleTotal = tierFilter === 0 ? top.length : top.filter((e) => e.tier === tierFilter).length;
  const partial = summary && summary.domainsScored < TARGET_N;

  return (
    <div ref={ref} className="p-4 rounded-lg border border-border bg-card text-xs space-y-4">
      <SectionHeader
        title="50,000-Domain Leaderboard"
        subtitle="Ranked agentic-readiness scores from the Tranco + CrUX crawl."
      />
      {failed && (
        <p className="text-xs text-muted-foreground">Leaderboard data is not published yet. Check back after the crawl completes.</p>
      )}
      {summary && (
        <>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2 py-1 rounded-full border border-border text-muted-foreground tabular-nums">
              {summary.domainsScored.toLocaleString()} domains scored
            </span>
            <span className="px-2 py-1 rounded-full border border-border text-muted-foreground tabular-nums">
              mean {summary.meanScore} · median {summary.medianScore}
            </span>
            {partial && (
              <span className="px-2 py-1 rounded-full border border-amber-500/40 text-amber-600">
                crawl in progress, numbers will move
              </span>
            )}
            {summary.snapshotEnd && (
              <span className="text-muted-foreground">snapshot {summary.snapshotEnd.slice(0, 10)}</span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'llms.txt', key: 'llms-txt' },
              { label: 'Markdown negotiation', key: 'markdown-negotiation' },
              { label: 'Live MCP server', key: 'mcp-server-live' },
              { label: 'OpenAPI spec', key: 'openapi-spec' },
            ].map((s) => {
              const a = summary.adoption[s.key];
              if (!a) return null;
              return (
                <div key={s.key} className="px-3 py-2 rounded-lg border border-border bg-muted/10">
                  <div className="text-[11px] text-muted-foreground">{s.label}</div>
                  <div className="text-sm font-semibold tabular-nums">{(a.share * 100).toFixed(2)}%</div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {top.length > 0 && !results && (
        <>
          <div className="flex flex-wrap gap-1.5">
            {[
              { key: 0, label: 'All tiers' },
              { key: 1, label: 'Ranks 1-10k' },
              { key: 2, label: 'Ranks 10-100k' },
              { key: 3, label: 'Ranks 100k-1M' },
            ].map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setTierFilter(f.key)}
                className={cn(
                  'px-2.5 py-1 rounded-full border text-xs transition',
                  tierFilter === f.key
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="px-3 py-2 font-medium w-12">#</th>
                <th className="px-3 py-2 font-medium">Domain</th>
                <th className="px-3 py-2 font-medium w-20 text-right">Score</th>
                <th className="px-3 py-2 font-medium w-16 text-right">Grade</th>
                <th className="px-3 py-2 font-medium w-24 text-right">Scanned</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((e) => (
                <tr key={e.domain} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                  <td className="px-3 py-1.5 tabular-nums text-muted-foreground">{e.rank}</td>
                  <td className="px-3 py-1.5 font-medium truncate max-w-45">
                    <a href={`/scan?url=${encodeURIComponent(e.domain)}`} className="hover:text-primary hover:underline inline-flex items-center gap-1.5" title="Run a fresh scan">
                      <DomainIcon domain={e.domain} />
                      {e.domain}
                    </a>
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{e.score}</td>
                  <td className={cn('px-3 py-1.5 text-right font-semibold', gradeClass(e.grade))}>{e.grade}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">{(e.scannedAt ?? '').slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
      {visibleTotal > 100 && !results && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-primary hover:underline text-xs font-medium"
        >
          {expanded ? 'Show top 100' : 'Show all 500'}
        </button>
      )}
      <div className="space-y-2">
        <input
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search all scored domains (min 2 chars)"
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary/50"
          type="search"
        />
        {indexLoading && <p className="text-muted-foreground">Loading domain index…</p>}
        {results && (
          <p className="text-muted-foreground">
            {results.length === 0 ? 'No matches.' : `Top ${results.length} matches:`}
          </p>
        )}
        {results && results.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-xs">
              <tbody>
                {results.map(([d, s, g, , dt]) => (
                  <tr key={d} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                    <td className="px-3 py-1.5 font-medium truncate max-w-45">
                      <a href={`/scan?url=${encodeURIComponent(d)}`} className="hover:text-primary hover:underline inline-flex items-center gap-1.5" title="Run a fresh scan">
                        <DomainIcon domain={d} />
                        {d}
                      </a>
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums w-20">{s}</td>
                    <td className={cn('px-3 py-1.5 text-right font-semibold w-16', gradeClass(g))}>{g}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground w-24">{dt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground">
        Single network vantage point, homepage plus well-known paths, 4,500ms probe timeout.
        Scores describe the snapshot date, not a live verdict. Run a fresh scan above for any domain.
      </p>
    </div>
  );
}

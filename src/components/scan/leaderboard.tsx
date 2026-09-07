'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface TopEntry {
  rank: number;
  domain: string;
  score: number;
  grade: string;
  layers: Record<string, number>;
  scannedAt: string;
  tier: number;
  icon: string | null;
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

function DomainIcon({ domain, file }: { domain: string; file: string | null }) {
  const [stage, setStage] = useState<'file' | 'google' | 'letter'>(file ? 'file' : 'google');

  if (stage === 'letter') {
    return (
      <span className="w-4 h-4 min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px] rounded bg-muted text-[10px] font-semibold text-muted-foreground shrink-0 select-none flex items-center justify-center">
        {domain.charAt(0).toUpperCase()}
      </span>
    );
  }

  const src = stage === 'file' && file
    ? `/data/leaderboard/favicons/${file}`
    : `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`;

  return (
    <div className="w-4 h-4 min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px] rounded-sm shrink-0 overflow-hidden flex items-center justify-center bg-muted/20">
      <img
        src={src}
        alt=""
        width={16}
        height={16}
        loading="lazy"
        onError={() => {
          if (stage === 'file') setStage('google');
          else setStage('letter');
        }}
        className="w-full h-full object-contain max-w-full max-h-full block"
      />
    </div>
  );
}

export function LeaderboardSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [top, setTop] = useState<TopEntry[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<number>(0);
  const [index, setIndex] = useState<[string, number, string, number, string, string | null][] | null>(null);
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
    <div ref={ref} className="text-xs space-y-4 pt-4 border-t border-border">
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
        Leaderboard
      </h3>
      {failed && (
        <p className="text-xs text-muted-foreground">Leaderboard data is not published yet.</p>
      )}
      {summary && (
        <>
          <p className="text-xs text-muted-foreground tabular-nums">
            {summary.domainsScored.toLocaleString()} domains scored
            <span className="mx-2 text-border">·</span>
            mean {summary.meanScore} · median {summary.medianScore}
            {partial && (
              <span className="text-amber-600">
                <span className="mx-2 text-border">·</span>
                crawl in progress, numbers will move
              </span>
            )}
            {summary.snapshotEnd && (
              <span>
                <span className="mx-2 text-border">·</span>
                snapshot {summary.snapshotEnd.slice(0, 10)}
              </span>
            )}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'llms.txt', key: 'llms-txt' },
              { label: 'Markdown negotiation', key: 'markdown-negotiation' },
              { label: 'Live MCP server', key: 'mcp-server-live' },
              { label: 'OpenAPI spec', key: 'openapi-spec' },
            ].map((s) => {
              const a = summary.adoption[s.key];
              if (!a) return null;
              return (
                <div key={s.key} className="py-2 border-b border-border/40">
                  <div className="text-[11px] text-muted-foreground">{s.label}</div>
                  <div className="text-sm font-semibold tabular-nums">{a ? (a.share * 100).toFixed(2) : 0}%</div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <div className="space-y-2">
        <input
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search scored domains (min 2 chars)"
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs outline-none focus:border-foreground"
          type="search"
        />
        {indexLoading && <p className="text-muted-foreground">Loading domain index…</p>}
        {results && (
          <p className="text-muted-foreground">
            {results.length === 0 ? 'No matches' : `${results.length} matches:`}
          </p>
        )}
        {results && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {results.map(([d, s, g, , , ic]) => (
              <div
                key={d}
                className="flex items-center justify-between gap-2 py-2 px-1 border-b border-border/40 hover:bg-muted/20 transition-colors"
              >
                <a
                  href={`/scan?url=${encodeURIComponent(d)}`}
                  className="hover:text-primary hover:underline inline-flex items-center gap-1.5 min-w-0 font-medium truncate"
                  title={`Scan ${d}`}
                >
                  <DomainIcon domain={d} file={ic} />
                  <span className="truncate">{d}</span>
                </a>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="tabular-nums font-medium text-foreground">{s}</span>
                  <span className={cn('font-bold text-xs w-6 text-center rounded px-1 py-0.5 bg-muted/40', gradeClass(g))}>
                    {g}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {top.length > 0 && !results && (
        <>
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 border-b border-border/40">
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
                  'py-1 text-xs transition border-b-2 -mb-px',
                  tierFilter === f.key
                    ? 'border-foreground text-foreground font-semibold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-0.5 pt-1">
            {visible.map((e) => (
              <div
                key={e.domain}
                className="flex items-center justify-between gap-2 py-2 px-1 border-b border-border/40 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[11px] tabular-nums text-muted-foreground w-6 shrink-0 text-right font-medium">
                    #{e.rank}
                  </span>
                  <a
                    href={`/scan?url=${encodeURIComponent(e.domain)}`}
                    className="hover:text-primary hover:underline inline-flex items-center gap-1.5 min-w-0 font-medium truncate"
                    title={`Scan ${e.domain}`}
                  >
                    <DomainIcon domain={e.domain} file={e.icon ?? null} />
                    <span className="truncate">{e.domain}</span>
                  </a>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="tabular-nums font-medium text-foreground">{e.score}</span>
                  <span className={cn('font-bold text-xs w-6 text-center rounded px-1 py-0.5 bg-muted/40', gradeClass(e.grade))}>
                    {e.grade}
                  </span>
                </div>
              </div>
            ))}
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
    </div>
  );
}

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { MoveUpRight, Database, Loader2 } from 'lucide-react';

interface ReportEntry {
  title: string;
  url: string;
}

const CHUNK = 200;

export function InfiniteReportList({ items }: { items: ReportEntry[] }) {
  const [visible, setVisible] = useState(CHUNK);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    setVisible((v) => Math.min(v + CHUNK, items.length));
  }, [items.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '400px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  // Reset when items change (e.g. new search)
  useEffect(() => {
    setVisible(CHUNK);
  }, [items]);

  const shown = items.slice(0, visible);

  return (
    <>
      <div className="columns-1 md:columns-2 xl:columns-3 gap-6 bg-card border border-border/60 rounded-xl p-4 md:p-6">
        {shown.map((report, i) => (
          <Link
            key={i}
            href={report.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-baseline gap-2 py-1 group break-inside-avoid hover:bg-secondary/50 rounded px-1.5 -mx-1.5 transition-colors"
          >
            <span className="text-[10px] text-muted-foreground/40 font-mono shrink-0 w-6 text-right tabular-nums">
              {i + 1}
            </span>
            <span className="text-sm leading-snug group-hover:text-primary transition-colors flex-1">
              {report.title}
            </span>
            <MoveUpRight className="h-2.5 w-2.5 text-muted-foreground/20 group-hover:text-primary shrink-0 transition-colors" />
          </Link>
        ))}
        {shown.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            <Database className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No reports found matching your criteria.</p>
          </div>
        )}
      </div>

      {visible < items.length && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/50" />
          <span className="ml-2 text-sm text-muted-foreground/50">
            Loading more ({visible.toLocaleString()} of {items.length.toLocaleString()})
          </span>
        </div>
      )}

      {visible >= items.length && items.length > 0 && (
        <p className="text-center text-sm text-muted-foreground/40 py-6">
          All {items.length.toLocaleString()} entries loaded
        </p>
      )}
    </>
  );
}

'use client';

import React from 'react';

/* ─── Two-column layout: text + image side by side ─── */
export function Columns({ children, reverse = false }: { children: React.ReactNode; reverse?: boolean }) {
  return (
    <div className={`not-prose my-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
      {children}
    </div>
  );
}

export function Column({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3">{children}</div>;
}

/* ─── Figure with caption and source ─── */
export function Figure({ src, alt, caption, source, sourceUrl, wide = false }: {
  src: string;
  alt: string;
  caption?: string;
  source?: string;
  sourceUrl?: string;
  wide?: boolean;
}) {
  return (
    <figure className={`not-prose my-8 ${wide ? '' : 'max-w-xl mx-auto'}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full rounded-lg border border-border/40 shadow-sm"
      />
      {(caption || source) && (
        <figcaption className="mt-2 text-xs text-muted-foreground text-center">
          {caption && <span>{caption}</span>}
          {caption && source && <span> · </span>}
          {source && (
            sourceUrl ? <a href={sourceUrl} className="underline hover:text-foreground" target="_blank" rel="noopener noreferrer">{source}</a> : <span>{source}</span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

/* ─── Stat cards row ─── */
export function StatRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-8 grid grid-cols-2 md:grid-cols-4 gap-4">
      {children}
    </div>
  );
}

export function Stat({ value, label, source }: { value: string; label: string; source?: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card p-4 text-center">
      <div className="text-2xl md:text-3xl font-bold text-primary tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground leading-tight">{label}</div>
      {source && <div className="mt-2 text-[10px] text-muted-foreground/60">{source}</div>}
    </div>
  );
}

/* ─── Callout / highlight box ─── */
export function Callout({ children, type = 'info', title }: { children: React.ReactNode; type?: 'info' | 'warning' | 'insight'; title?: string }) {
  const styles = {
    info: 'border-primary/30 bg-primary/5',
    warning: 'border-destructive/30 bg-destructive/5',
    insight: 'border-accent/40 bg-accent/10',
  };
  const icons = {
    info: '💡',
    warning: '⚠️',
    insight: '🔍',
  };
  return (
    <div className={`not-prose my-6 rounded-lg border-l-4 ${styles[type]} p-4 md:p-5`}>
      {title && <div className="font-semibold text-sm mb-2">{icons[type]} {title}</div>}
      <div className="text-sm text-muted-foreground leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0">{children}</div>
    </div>
  );
}

/* ─── Pull quote ─── */
export function PullQuote({ children, author }: { children: React.ReactNode; author?: string }) {
  return (
    <div className="not-prose my-8 border-l-4 border-primary/40 pl-6 py-2">
      <blockquote className="text-lg md:text-xl font-medium italic text-foreground/80 leading-relaxed">
        {children}
      </blockquote>
      {author && <cite className="mt-2 block text-sm text-muted-foreground not-italic">— {author}</cite>}
    </div>
  );
}

/* ─── Timeline ─── */
export function Timeline({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-8 relative pl-6 border-l-2 border-border">
      {children}
    </div>
  );
}

export function TimelineItem({ date, title, children }: { date: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 last:mb-0 relative">
      <div className="absolute -left-[1.6rem] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
      <div className="text-xs font-medium text-primary mb-0.5">{date}</div>
      <div className="text-sm font-semibold text-foreground">{title}</div>
      {children && <div className="mt-1 text-sm text-muted-foreground leading-relaxed">{children}</div>}
    </div>
  );
}

/* ─── Section label / overline for visual hierarchy ─── */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose mt-12 mb-4">
      <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">{children}</span>
    </div>
  );
}

/* ─── Key takeaway box at end of sections ─── */
export function KeyTakeaway({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-6 rounded-lg bg-secondary/40 border border-border/50 p-4 md:p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">Key Takeaway</div>
      <div className="text-sm text-foreground leading-relaxed">{children}</div>
    </div>
  );
}

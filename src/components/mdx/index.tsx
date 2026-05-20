import React from 'react';

/* ─── Two-column layout: text + image side by side ─── */
export function Columns({ children, reverse = false }: { children: React.ReactNode; reverse?: boolean }) {
  return (
    <div className={`not-prose my-8 first:mt-0 last:mb-0 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
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
    <figure className={`not-prose my-8 first:mt-0 last:mb-0 ${wide ? '' : 'max-w-xl mx-auto'}`}>
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
    <div className="not-prose my-8 first:mt-0 last:mb-0 flex flex-wrap justify-center gap-4 [&>*]:min-w-[140px] [&>*]:flex-1 [&>*]:max-w-[250px]">
      {children}
    </div>
  );
}

export function Stat({ value, label, source, sourceUrl }: { value: string; label: string; source?: string; sourceUrl?: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card p-4 text-center">
      <div className="text-2xl md:text-3xl font-bold text-primary tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground leading-tight">{label}</div>
      {source && (
        <div className="mt-2 text-[10px] text-muted-foreground/60">
          {sourceUrl ? (
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary underline underline-offset-2 transition-colors">
              {source}
            </a>
          ) : (
            source
          )}
        </div>
      )}
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
  return (
    <div className={`not-prose my-6 first:mt-0 last:mb-0 rounded-lg border-l-4 ${styles[type]} p-4 md:p-5`}>
      {title && <div className="font-semibold text-sm mb-2">{title}</div>}
      <div className="text-sm text-muted-foreground leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0">{children}</div>
    </div>
  );
}

/* ─── Pull quote ─── */
export function PullQuote({ children, author }: { children: React.ReactNode; author?: string }) {
  return (
    <div className="not-prose my-8 first:mt-0 last:mb-0 border-l-4 border-primary/40 pl-6 py-2">
      <blockquote className="text-lg md:text-xl font-medium italic text-foreground/80 leading-relaxed">
        {children}
      </blockquote>
      {author && <cite className="mt-2 block text-sm text-muted-foreground not-italic"> - {author}</cite>}
    </div>
  );
}

/* ─── Timeline ─── */
export function Timeline({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-8 first:mt-0 last:mb-0 relative pl-6 border-l-2 border-border">
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
    <div className="not-prose my-6 first:mt-0 last:mb-0 rounded-lg bg-secondary/40 border border-border/50 p-4 md:p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">Key Takeaway</div>
      <div className="text-sm text-foreground leading-relaxed">{children}</div>
    </div>
  );
}

/* ─── Custom Essay Diagrams ─── */
export function EcosystemDiagram() {
  return (
    <figure className="not-prose my-10 w-full overflow-hidden rounded-xl border border-border shadow-sm">
      <div className="bg-card p-6 md:p-10 flex flex-col items-center">
        <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-1 text-center text-foreground uppercase">Agentic Commerce Ecosystem</h3>
        <p className="text-xs md:text-sm font-semibold text-muted-foreground tracking-widest text-center mb-10 uppercase">
          The Five-Layer Stack Powering Machine-to-Machine Retail
        </p>

        <div className="w-full max-w-3xl flex flex-col gap-4 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-[50%] top-4 bottom-4 w-px border-l-2 border-dashed border-border -z-10 hidden md:block" />
          
          <div className="flex flex-col md:flex-row items-center justify-between p-5 rounded-xl border border-primary/30 bg-primary/5">
            <div className="font-bold text-lg md:text-base md:w-1/3 text-primary tracking-tight">1. AI PLATFORMS</div>
            <div className="md:w-2/3 text-sm text-foreground/90 md:text-right mt-2 md:mt-0 font-medium">OpenAI (ChatGPT) • Google (Gemini) • Anthropic (Claude) • Microsoft</div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between p-5 rounded-xl border border-blue-500/30 bg-blue-500/5">
            <div className="font-bold text-lg md:text-base md:w-1/3 text-blue-500 dark:text-blue-400 tracking-tight">2. COMMERCE PROTOCOLS</div>
            <div className="md:w-2/3 text-sm text-foreground/90 md:text-right mt-2 md:mt-0 font-medium">UCP • ACP • MCP • A2A • x402 V2 • MPP (Stripe)</div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
            <div className="font-bold text-lg md:text-base md:w-1/3 text-emerald-600 dark:text-emerald-400 tracking-tight">3. PAYMENT RAILS</div>
            <div className="md:w-2/3 text-sm text-foreground/90 md:text-right mt-2 md:mt-0 flex flex-col items-center md:items-end gap-1 font-medium">
              <span><span className="opacity-70">Traditional:</span> Visa, Mastercard, PayPal</span>
              <span><span className="opacity-70">Crypto-Native:</span> Coinbase, Tempo, Solana</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between p-5 rounded-xl border border-orange-500/30 bg-orange-500/5">
            <div className="font-bold text-lg md:text-base md:w-1/3 text-orange-600 dark:text-orange-400 tracking-tight">4. RETAIL PLATFORMS</div>
            <div className="md:w-2/3 text-sm text-foreground/90 md:text-right mt-2 md:mt-0 font-medium">Shopify • Commercetools • Walmart • Target</div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between p-5 rounded-xl border border-border bg-secondary/20">
            <div className="font-bold text-lg md:text-base md:w-1/3 text-foreground tracking-tight">5. AGENT STARTUPS</div>
            <div className="md:w-2/3 text-sm text-foreground/90 md:text-right mt-2 md:mt-0 font-medium">Wildcard • Sierra • Skyfire • Cloudflare • Openx402</div>
          </div>
        </div>
      </div>
    </figure>
  );
}

export * from './universal-charts';
export * from './stepwise-charts';
export * from './agentic-state-charts';
export * from './post-interface-charts';
export * from './explainer';
export { KnowledgeCheck } from './knowledge-check';
export { ToolboxExplainer } from './toolbox-explainer';
export { PromptTechniques } from './prompt-techniques';
export { LabWorkflow } from './lab-workflow';
export { ProductPillars } from './product-pillars';
export * from '../courses/vibe-coding-visuals';
export * from '../courses/pe-visuals';
export * from '../courses/automation-visuals';
export * from '../courses/mcp-visuals';
export * from '../courses/agentic-visuals';
export * from '../courses/web3-visuals';
export * from './playbook-charts';

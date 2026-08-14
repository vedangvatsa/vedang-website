import { ZoomableImage } from '@/components/zoomable-image';

/* ─── Markdown tables: keep cells on one line, scroll sideways on phones ─── */
export function Table(props: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="table-wrapper">
      <table {...props} />
    </div>
  );
}

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
export function Figure({ src, alt, caption, source, sourceUrl, wide = false, width, height }: {
  src: string;
  alt: string;
  caption?: string;
  source?: string;
  sourceUrl?: string;
  wide?: boolean;
  width?: number;
  height?: number;
}) {
  return (
    <figure className={`not-prose my-8 first:mt-0 last:mb-0 ${wide ? 'w-full max-w-none' : 'max-w-sm mx-auto'}`}>
      <ZoomableImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="border border-[#e4e4e7]"
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
    <div className="border border-[#e4e4e7] bg-white p-4 text-center">
      <div className="text-2xl md:text-3xl font-bold text-[#18181b] tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-[#52525b] leading-tight">{label}</div>
      {source && (
        <div className="mt-2 text-[10px] text-[#71717a]">
          {sourceUrl ? (
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#18181b]">
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
  void type;
  return (
    <div className="not-prose my-6 first:mt-0 last:mb-0 border border-[#e4e4e7] border-l-[#18181b] border-l-2 bg-[#fafafa] p-4 md:p-5">
      {title && <div className="font-semibold text-sm mb-2 text-[#18181b]">{title}</div>}
      <div className="text-sm text-[#52525b] leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 min-w-0 overflow-x-auto">{children}</div>
    </div>
  );
}

/* ─── Pull quote ─── */
export function PullQuote({ children, author, role }: { children: React.ReactNode; author?: string; role?: string }) {
  return (
    <div className="not-prose my-8 first:mt-0 last:mb-0 border-l-2 border-[#18181b] pl-6 py-2">
      <blockquote className="text-lg md:text-xl font-medium italic text-foreground/80 leading-relaxed !border-none !pl-0">
        {children}
      </blockquote>
      {author && <cite className="mt-2 block text-sm text-muted-foreground not-italic"> - {author}{role ? `, ${role}` : ''}</cite>}
    </div>
  );
}

/* ─── Timeline ─── */
export function Timeline({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-8 first:mt-0 last:mb-0 relative pl-6 border-l border-[#d4d4d8]">
      {children}
    </div>
  );
}

export function TimelineItem({ date, title, children }: { date: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 last:mb-0 relative">
      <div className="absolute -left-[1.55rem] top-1.5 w-2 h-2 rounded-full bg-[#18181b]" />
      <div className="text-xs font-medium text-[#52525b] mb-0.5">{date}</div>
      <div className="text-sm font-semibold text-foreground">{title}</div>
      {children && <div className="mt-1 text-sm text-muted-foreground leading-relaxed">{children}</div>}
    </div>
  );
}

/* ─── Section label / overline for visual hierarchy ─── */
export function SectionLabel({ label, children }: { label?: string; children?: React.ReactNode }) {
  return (
    <div className="not-prose mt-12 mb-4">
      <span className="text-xs font-semibold text-[#52525b]">{label || children}</span>
    </div>
  );
}

/* ─── Key takeaway box at end of sections ─── */
export function KeyTakeaway({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-6 first:mt-0 last:mb-0 border border-[#e4e4e7] border-l-[#18181b] border-l-2 bg-[#fafafa] p-4 md:p-5">
      <div className="text-sm text-[#18181b] leading-relaxed">{children}</div>
    </div>
  );
}

export * from './universal-charts';
export * from './stepwise-charts';
export * from './stateagents-charts';
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
export * from '../courses/bootcamp-visuals';
export * from './playbook-charts';
export * from './funding-charts';
export { ResearchPaper } from './research-paper';


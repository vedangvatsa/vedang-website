import { FileText, ExternalLink, BookOpen } from 'lucide-react';

/* ─── Published Research Paper Preview Card ─── */
export function ResearchPaper({
  title,
  authors,
  date,
  venue,
  doi,
  abstract,
}: {
  title: string;
  authors: string;
  date: string;
  venue: string;
  doi: string;
  abstract?: string;
}) {
  const url = doi.startsWith('http') ? doi : `https://doi.org/${doi}`;

  return (
    <div className="not-prose my-10 first:mt-0 last:mb-0">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/[0.04] to-primary/[0.08] hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
      >
        <div className="p-6 md:p-8">
          {/* Header row */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary mb-1.5">
                Published Research Paper
              </div>
              <h4 className="text-base md:text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                {title}
              </h4>
            </div>
          </div>

          {/* Meta */}
          <div className="mt-4 ml-[3.75rem] flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground font-medium">
            <span>{authors}</span>
            <span className="text-border/80">|</span>
            <span>{venue}</span>
            <span className="text-border/80">|</span>
            <span>{date}</span>
          </div>

          {/* Abstract preview */}
          {abstract && (
            <p className="mt-3 ml-[3.75rem] text-[13px] text-muted-foreground/90 leading-relaxed line-clamp-3">
              {abstract}
            </p>
          )}

          {/* CTA */}
          <div className="mt-4 ml-[3.75rem] inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:underline underline-offset-2">
            Read the full paper
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </div>
      </a>
    </div>
  );
}

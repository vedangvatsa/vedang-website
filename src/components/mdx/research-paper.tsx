import { ExternalLink } from 'lucide-react';

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
    <div className="not-prose my-8 first:mt-0 last:mb-0">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
        className="group block rounded-lg border border-border/60 bg-card p-5 md:p-6 hover:border-border/100 hover:shadow-sm transition-all duration-200 !no-underline hover:!no-underline"
      >
        <div className="flex items-start gap-3 md:gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="text-base md:text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
              {title}
            </h4>
            
            <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground font-medium">
              <span>{authors}</span>
              <span className="text-border">·</span>
              <span>{venue}</span>
              <span className="text-border">·</span>
              <span>{date}</span>
            </div>

            {abstract && (
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {abstract}
              </p>
            )}

            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary group-hover:underline underline-offset-2">
              Read the full paper
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}


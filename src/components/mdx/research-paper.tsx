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
        className="group block border border-[#e4e4e7] bg-white p-5 md:p-6 !no-underline hover:!no-underline"
      >
        <div className="flex items-start gap-3 md:gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="text-base md:text-lg font-bold text-[#18181b] leading-tight">
              {title}
            </h4>
            
            <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#52525b] font-medium">
              <span>{authors}</span>
              <span className="text-[#d4d4d8]">·</span>
              <span>{venue}</span>
              <span className="text-[#d4d4d8]">·</span>
              <span>{date}</span>
            </div>

            {abstract && (
              <p className="mt-3 text-sm text-[#52525b] leading-relaxed line-clamp-3">
                {abstract}
              </p>
            )}

            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#18181b] underline underline-offset-2">
              Read the full paper
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}


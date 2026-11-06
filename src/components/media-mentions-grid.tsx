import Link from 'next/link';
import { MoveUpRight } from 'lucide-react';
import { mediaMentions, sourceLogos, type MediaMention } from '@/lib/media-data';

function getSourceInitials(source: string): string {
  const clean = source.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.slice(0, 3).map((w) => w[0]).join('').toUpperCase();
}

interface MediaMentionsGridProps {
  mentions?: MediaMention[];
  className?: string;
}

export function MediaMentionsGrid({
  mentions = mediaMentions,
  className = '',
}: MediaMentionsGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {mentions.map((mention, index) => {
        const logo = sourceLogos[mention.source];

        return (
          <Link
            key={index}
            href={mention.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border bg-card text-card-foreground p-3.5 transition-all duration-200 hover:shadow-md hover:border-primary/40 hover:bg-muted/30 flex items-start gap-3"
          >
            <div className="shrink-0 w-10 h-10 rounded-lg border border-transparent flex items-center justify-center overflow-hidden">
              {logo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={logo}
                  alt={`${mention.source} icon`}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-md object-contain"
                />
              ) : (
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center line-clamp-1">
                  {getSourceInitials(mention.source)}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1.5">
                <span className="font-semibold text-sm md:text-base text-foreground group-hover:text-primary transition-colors truncate">
                  {mention.source}
                </span>
                <MoveUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-snug group-hover:text-foreground/90 transition-colors">
                {mention.title}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

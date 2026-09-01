import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ResourceCardProps {
  title: string;
  description: string;
  href: string;
  tag?: string;
  format?: string;
  method?: string;
  isExternal?: boolean;
  className?: string;
}

export function ResourceCard({
  title,
  description,
  href,
  tag,
  format,
  method,
  isExternal = false,
  className,
}: ResourceCardProps) {
  const content = (
    <div
      className={cn(
        'rounded-lg border border-border bg-card p-4 sm:p-5 flex flex-col justify-between gap-3 hover:border-primary/40 transition-colors h-full',
        className
      )}
    >
      <div className="space-y-1.5 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-sm text-foreground truncate">{title}</span>
          {method && (
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border shrink-0">
              {method}
            </span>
          )}
          {tag && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border shrink-0">
              {tag}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{description}</p>
      </div>

      <div className="pt-2.5 border-t border-border/60 flex items-center justify-between gap-2 text-xs">
        <span
          className="font-mono text-xs text-primary underline underline-offset-4 hover:text-primary/80 font-medium truncate"
          title={href}
        >
          {href}
        </span>
        {format && (
          <span className="text-[11px] font-medium text-muted-foreground shrink-0">{format}</span>
        )}
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full group">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className="block h-full group">
      {content}
    </Link>
  );
}

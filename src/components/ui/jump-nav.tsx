import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface JumpNavItem {
  name: string;
  href: string;
  count?: number | string;
}

interface JumpNavProps {
  items: JumpNavItem[];
  className?: string;
  ariaLabel?: string;
}

export function JumpNav({ items, className, ariaLabel = 'Section Navigation' }: JumpNavProps) {
  return (
    <nav aria-label={ariaLabel} className={cn('flex flex-wrap items-center justify-center gap-1.5', className)}>
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="px-3 py-1 text-xs font-medium rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors inline-flex items-center gap-1.5"
        >
          <span>{item.name}</span>
          {item.count !== undefined && (
            <span className="text-[10px] text-muted-foreground/80 font-normal">
              ({item.count})
            </span>
          )}
        </a>
      ))}
    </nav>
  );
}

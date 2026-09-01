import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  id?: string;
  title: string;
  subtitle?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function SectionHeader({ id, title, subtitle, className, children }: SectionHeaderProps) {
  return (
    <div id={id} className={cn('space-y-1 scroll-mt-20', className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {children}
      </div>
      {subtitle && (
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

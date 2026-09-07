import React from 'react';
import { cn } from '@/lib/utils';

export type StatusPillType =
  | 'pass'
  | 'warning'
  | 'warn'
  | 'fail'
  | 'na'
  | 'required'
  | 'recommended'
  | 'optional'
  | 'avoid'
  | 'critical'
  | 'important'
  | 'start_here'
  | 'when_applies';

interface StatusPillProps {
  status: StatusPillType | string;
  label?: string;
  className?: string;
  size?: 'sm' | 'default';
}

const STATUS_CONFIG: Record<string, { label: string; style: string }> = {
  // Audit Scanner
  pass: { label: 'Pass', style: 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 border-transparent font-medium' },
  warning: { label: 'Warn', style: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 font-medium' },
  warn: { label: 'Warn', style: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 font-medium' },
  fail: { label: 'Fail', style: 'border border-foreground/80 text-foreground bg-transparent font-medium' },
  na: { label: 'N/A', style: 'bg-muted/40 text-muted-foreground/60 border-border/40' },

  // Priorities & Specs
  required: { label: 'Required', style: 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 border-transparent font-medium' },
  critical: { label: 'Critical', style: 'border border-foreground/80 text-foreground bg-transparent font-medium' },
  important: { label: 'Important', style: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 font-medium' },
  recommended: { label: 'Recommended', style: 'bg-muted text-muted-foreground border-border' },
  start_here: { label: 'Start here', style: 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 border-transparent font-medium' },
  when_applies: { label: 'When it applies', style: 'bg-muted text-muted-foreground border-border' },
  optional: { label: 'Optional', style: 'bg-muted/40 text-muted-foreground/60 border-border/40' },
  avoid: { label: 'Avoid', style: 'border border-foreground/80 text-foreground bg-transparent font-medium' },
};

export function StatusPill({ status, label, className, size = 'default' }: StatusPillProps) {
  const normalizedKey = status.toLowerCase().replace(/\s+/g, '_');
  const config = STATUS_CONFIG[normalizedKey] || { label: status, style: 'bg-muted text-muted-foreground border-border' };
  const displayLabel = label || config.label;

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors shrink-0',
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5',
        config.style,
        className
      )}
    >
      {displayLabel}
    </span>
  );
}

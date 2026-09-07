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
  pass: { label: 'Pass', style: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25' },
  warning: { label: 'Warn', style: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25' },
  warn: { label: 'Warn', style: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25' },
  fail: { label: 'Fail', style: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25' },
  na: { label: 'N/A', style: 'bg-muted text-muted-foreground border-border' },

  // Priorities & Specs
  required: { label: 'Required', style: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25' },
  critical: { label: 'Critical', style: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25' },
  important: { label: 'Important', style: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25' },
  recommended: { label: 'Recommended', style: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25' },
  start_here: { label: 'Start here', style: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25' },
  when_applies: { label: 'When it applies', style: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25' },
  optional: { label: 'Optional', style: 'bg-muted text-muted-foreground border-border' },
  avoid: { label: 'Avoid', style: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25' },
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

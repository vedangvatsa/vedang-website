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
  pass: { label: 'PASS', style: 'text-emerald-600 dark:text-emerald-400 font-semibold' },
  warning: { label: 'WARN', style: 'text-amber-600 dark:text-amber-400 font-semibold' },
  warn: { label: 'WARN', style: 'text-amber-600 dark:text-amber-400 font-semibold' },
  fail: { label: 'FAIL', style: 'text-rose-600 dark:text-rose-400 font-semibold' },
  na: { label: 'N/A', style: 'text-muted-foreground font-medium' },

  // Priorities & Specs
  required: { label: 'REQUIRED', style: 'text-rose-600 dark:text-rose-400 font-semibold' },
  critical: { label: 'CRITICAL', style: 'text-rose-600 dark:text-rose-400 font-semibold' },
  important: { label: 'IMPORTANT', style: 'text-amber-600 dark:text-amber-400 font-semibold' },
  recommended: { label: 'RECOMMENDED', style: 'text-foreground font-semibold' },
  start_here: { label: 'START HERE', style: 'text-emerald-600 dark:text-emerald-400 font-semibold' },
  when_applies: { label: 'WHEN APPLIES', style: 'text-amber-600 dark:text-amber-400 font-semibold' },
  optional: { label: 'OPTIONAL', style: 'text-muted-foreground font-medium' },
  avoid: { label: 'AVOID', style: 'text-rose-600 dark:text-rose-400 font-semibold' },
};

export function StatusPill({ status, label, className, size = 'default' }: StatusPillProps) {
  const normalizedKey = status.toLowerCase().replace(/\s+/g, '_');
  const config = STATUS_CONFIG[normalizedKey] || { label: status, style: 'text-muted-foreground font-medium' };
  const displayLabel = label || config.label;

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono shrink-0 select-none',
        size === 'sm' ? 'text-[10px]' : 'text-[11px]',
        config.style,
        className
      )}
    >
      {displayLabel}
    </span>
  );
}

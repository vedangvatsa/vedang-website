import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ChartCardProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** my-8 instead of my-10 */
  compact?: boolean;
  shadow?: boolean;
  className?: string;
  bodyClassName?: string;
  subtitleClassName?: string;
};

/**
 * Shared shell for essay/course data visuals.
 * Styles live on `.chart-card` in globals.css (border, table wrap, badge nowrap).
 */
export function ChartCard({
  title,
  subtitle,
  children,
  footer,
  compact = false,
  shadow = false,
  className,
  bodyClassName,
  subtitleClassName,
}: ChartCardProps) {
  return (
    <figure
      className={cn(
        'not-prose chart-card',
        compact && 'chart-card--sm',
        shadow && 'chart-card--shadow',
        className,
      )}
    >
      <div className={cn(compact ? 'p-5 md:p-8' : 'p-6 md:p-10', bodyClassName)}>
        {title ? (
          <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">{title}</h3>
        ) : null}
        {subtitle ? (
          <p
            className={cn(
              'text-xs text-muted-foreground uppercase tracking-widest font-semibold',
              title ? 'mb-6' : 'mb-5',
              subtitleClassName,
            )}
          >
            {subtitle}
          </p>
        ) : null}
        {children}
        {footer}
      </div>
    </figure>
  );
}

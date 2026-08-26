import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface WeekModule {
  href: string;
  title: string;
  description: string;
  isNew?: boolean;
}

interface WeekCardProps {
  weekNumber: number;
  theme: string;
  target: string;
  dateRange: string;
  modules: WeekModule[];
  accentColor?: string;
}

import { Badge } from '@/components/ui/badge';

export function WeekCard({ weekNumber, theme, target, modules }: WeekCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs font-mono font-medium">
            Week {weekNumber}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">{modules.length} modules</span>
        </div>
        <h3 className="text-xl font-bold tracking-tight">{theme}</h3>
        <p className="text-sm text-muted-foreground mt-1">Ship target: {target}</p>
      </div>
      <div className="border-t">
        {modules.map((mod, i) => (
          <Link
            key={mod.href}
            href={mod.href}
            className={`flex items-center justify-between px-6 py-3.5 hover:bg-muted/50 transition-colors ${i < modules.length - 1 ? 'border-b' : ''}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="min-w-0">
                <span className="font-medium text-sm block truncate">{mod.title}</span>
                <span className="text-xs text-muted-foreground block truncate">{mod.description}</span>
              </div>
              {mod.isNew && (
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">new</span>
              )}
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
          </Link>
        ))}
      </div>
    </div>
  );
}

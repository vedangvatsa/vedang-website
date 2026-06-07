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

const accentMap: Record<string, string> = {
  indigo: 'border-l-indigo-500 dark:border-l-indigo-400',
  emerald: 'border-l-emerald-500 dark:border-l-emerald-400',
  amber: 'border-l-amber-500 dark:border-l-amber-400',
  rose: 'border-l-rose-500 dark:border-l-rose-400',
};

const badgeMap: Record<string, string> = {
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

export function WeekCard({ weekNumber, theme, target, modules, accentColor = 'indigo' }: WeekCardProps) {
  return (
    <div className={`rounded-lg border bg-card border-l-4 ${accentMap[accentColor] || accentMap.indigo} overflow-hidden`}>
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-xs font-mono font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${badgeMap[accentColor] || badgeMap.indigo}`}>
            Week {weekNumber}
          </span>
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

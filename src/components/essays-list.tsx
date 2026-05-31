
import Link from 'next/link';
import { Separator } from './ui/separator';
import { MoveUpRight } from 'lucide-react';
import { essays } from '@/lib/essays';

export function EssaysList({ limit, variant = 'list' }: { limit?: number; variant?: 'list' | 'grid' }) {
  const essaysToShow = limit ? essays.slice(0, limit) : essays;

  if (variant === 'grid') {
    return (
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {essaysToShow.map((essay) => (
          <Link href={essay.url} key={essay.slug} className="group">
            <div className="flex h-full flex-col justify-between overflow-hidden rounded-lg border bg-card p-4 transition-colors duration-200 hover:border-primary/50">
              <div>
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {essay.title}
                </p>
                {essay.date && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(essay.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        {essaysToShow.map((essay, index) => (
          <div key={essay.slug}>
            <Link href={essay.url} className="group grid grid-cols-1 md:grid-cols-4 md:gap-6">
              <div className="md:col-span-3">
                <h3 className="text-lg font-medium text-foreground transition-colors group-hover:text-primary">
                  {essay.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{essay.summary}</p>
              </div>
              {essay.date && (
                <p className="text-sm text-muted-foreground mt-2 md:mt-0 md:text-right md:col-span-1">
                  {new Date(essay.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
            </Link>
            {index < essaysToShow.length - 1 && <Separator className="mt-6" />}
          </div>
        ))}
      </div>
    </div>
  );
}

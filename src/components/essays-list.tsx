
import Link from 'next/link';
import { Separator } from './ui/separator';
import { essays } from '@/lib/essays';

export function EssaysList({ limit }: { limit?: number }) {
  const essaysToShow = limit ? essays.slice(0, limit) : essays;

  return (
    <div className="mx-auto max-w-6xl">
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

'use client';

import { Check, ArrowRight } from 'lucide-react';
import { useCourseProgress } from '@/hooks/use-course-progress';
import Link from 'next/link';

interface MarkCompleteProps {
  courseId: string;
  moduleSlug: string;
  nextModule?: { slug: string; title: string } | null;
  basePath: string;
}

export function MarkComplete({ courseId, moduleSlug, nextModule, basePath }: MarkCompleteProps) {
  const { isComplete, markComplete, loaded } = useCourseProgress(courseId);
  const completed = loaded && isComplete(moduleSlug);

  if (!loaded) return null;

  return (
    <div className="mt-12 pt-8 border-t">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => markComplete(moduleSlug)}
          disabled={completed}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            completed
              ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30 cursor-default'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
          }`}
        >
          <Check className={`h-4 w-4 ${completed ? '' : 'opacity-70'}`} />
          {completed ? 'Module Complete' : 'Mark as Complete'}
        </button>

        {nextModule && (
          <Link 
            href={`${basePath}/${nextModule.slug}`}
            onClick={() => markComplete(moduleSlug)}
            className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          >
            Next: {nextModule.title}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
        {!nextModule && (
          <Link 
            href={basePath}
            className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          >
            Back to Overview
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

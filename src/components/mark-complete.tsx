'use client';

import { Check, ArrowRight, ArrowLeft, GraduationCap } from 'lucide-react';
import { useCourseProgress } from '@/hooks/use-course-progress';
import { courseConfigs, CourseId } from '@/lib/course-config';
import Link from 'next/link';

interface MarkCompleteProps {
  courseId: string;
  moduleSlug: string;
  prevModule?: { slug: string; title: string } | null;
  nextModule?: { slug: string; title: string } | null;
  basePath: string;
}

export function MarkComplete({ courseId, moduleSlug, prevModule, nextModule, basePath }: MarkCompleteProps) {
  const { isComplete, markComplete, completedCount, loaded } = useCourseProgress(courseId);
  const completed = loaded && isComplete(moduleSlug);

  if (!loaded) return null;

  const config = courseConfigs[courseId as CourseId];
  const totalModules = config?.modules.length ?? 0;
  const willBeAllComplete = (completedCount >= totalModules) || (completedCount === totalModules - 1 && !completed);
  const isLastModule = !nextModule;

  return (
    <div className="mt-12 pt-8 border-t">
      {/* Navigation row: Previous | Mark Complete | Next */}
      <div className="flex items-center justify-between gap-4">
        {/* Previous */}
        <div className="flex-1 flex justify-start">
          {prevModule ? (
            <Link 
              href={`${basePath}/${prevModule.slug}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{prevModule.title}</span>
              <span className="sm:hidden">Previous</span>
            </Link>
          ) : <div />}
        </div>

        {/* Mark Complete */}
        <button
          onClick={() => markComplete(moduleSlug)}
          disabled={completed}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0 ${
            completed
              ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30 cursor-default'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
          }`}
        >
          <Check className={`h-4 w-4 ${completed ? '' : 'opacity-70'}`} />
          {completed ? 'Complete' : 'Mark Complete'}
        </button>

        {/* Next */}
        <div className="flex-1 flex justify-end">
          {nextModule ? (
            <Link 
              href={`${basePath}/${nextModule.slug}`}
              onClick={() => markComplete(moduleSlug)}
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <span className="hidden sm:inline">{nextModule.title}</span>
              <span className="sm:hidden">Next</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : isLastModule && completed && willBeAllComplete ? (
            <Link 
              href={`${basePath}/final-exam`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-600 hover:to-yellow-600 transition-all"
            >
              <GraduationCap className="h-4 w-4" />
              Final Exam
            </Link>
          ) : (
            <Link 
              href={basePath}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Overview
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Check, GraduationCap, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useCourseProgress } from '@/hooks/use-course-progress';

interface ModuleLink {
  slug: string;
  title: string;
}

interface CourseSidebarProps {
  courseId: string;
  courseTitle: string;
  basePath: string;
  modules: ModuleLink[];
}

export function CourseSidebar({ courseId, courseTitle, basePath, modules }: CourseSidebarProps) {
  const pathname = usePathname();
  const { isComplete, isExamPassed, completedCount, loaded } = useCourseProgress(courseId);
  const totalModules = modules.length;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
  const allComplete = loaded && completedCount >= totalModules;
  const examPassed = loaded && isExamPassed();
  const examHref = `${basePath}/final-exam`;
  const examActive = pathname === examHref;

  return (
    <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0">
      <div className="sticky top-1/3 space-y-6">
        <Card className="shadow-sm bg-muted/30 border-muted">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
              <BookOpen className="h-5 w-5" />
              <h4 className="font-semibold text-sm uppercase tracking-wider">{courseTitle}</h4>
            </div>

            {/* Progress bar */}
            {loaded && completedCount > 0 && (
              <div className="mb-5">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>{completedCount}/{totalModules} complete</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            <nav className="space-y-1">
              <Link 
                href={basePath} 
                className={`block text-sm font-medium py-1.5 transition-colors ${pathname === basePath ? 'text-primary' : 'hover:text-primary'}`}
              >
                Course Overview
              </Link>
              {modules.map((mod) => {
                const href = `${basePath}/${mod.slug}`;
                const isActive = pathname === href;
                const completed = loaded && isComplete(mod.slug);

                return (
                  <Link 
                    key={mod.slug} 
                    href={href} 
                    className={`flex items-center gap-2 text-sm py-1.5 transition-colors ${
                      isActive 
                        ? 'text-primary font-medium' 
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    {completed ? (
                      <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    ) : (
                      <span className="w-3.5 shrink-0" />
                    )}
                    {mod.title}
                  </Link>
                );
              })}

              {/* Final Exam link */}
              <Link 
                href={examHref}
                className={`flex items-center gap-2 text-sm py-1.5 mt-2 pt-2 border-t border-muted transition-colors ${
                  examActive
                    ? 'text-amber-500 font-medium'
                    : 'text-muted-foreground hover:text-amber-500'
                }`}
              >
                {examPassed ? (
                  <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                ) : !allComplete ? (
                  <Lock className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                )}
                Final Exam
              </Link>
            </nav>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}


import { ReactNode } from 'react';
import { PageLayout } from '@/components/page-layout';
import { CourseSidebar } from '@/components/course-sidebar';
import { courseConfigs, CourseId } from '@/lib/course-config';

interface SharedCourseLayoutProps {
  courseId: CourseId;
  children: ReactNode;
}

export function SharedCourseLayout({ courseId, children }: SharedCourseLayoutProps) {
  const config = courseConfigs[courseId];
  return (
    <PageLayout>
      <div className="py-12 flex flex-col md:flex-row gap-12">
        <CourseSidebar {...config} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </PageLayout>
  );
}

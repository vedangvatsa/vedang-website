import { ReactNode } from 'react';
import { PageLayout } from '@/components/page-layout';
import { CourseId } from '@/lib/course-config';

interface SharedCourseLayoutProps {
  courseId: CourseId;
  children: ReactNode;
}

export function SharedCourseLayout({ children }: SharedCourseLayoutProps) {
  return (
    <PageLayout>
      <div className="py-12">
        {children}
      </div>
    </PageLayout>
  );
}


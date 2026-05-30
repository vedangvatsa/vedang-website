import { ReactNode } from 'react';
import { SharedCourseLayout } from '@/components/shared-course-layout';

export default function Layout({ children }: { children: ReactNode }) {
  return <SharedCourseLayout courseId="agentic-web">{children}</SharedCourseLayout>;
}

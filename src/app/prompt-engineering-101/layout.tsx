import { ReactNode } from 'react';
import { SharedCourseLayout } from '@/components/shared-course-layout';

export default function Layout({ children }: { children: ReactNode }) {
  return <SharedCourseLayout courseId="prompt-engineering-101">{children}</SharedCourseLayout>;
}

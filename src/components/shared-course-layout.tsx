import { ReactNode } from 'react';
import { PageLayout } from '@/components/page-layout';

interface SharedCourseLayoutProps {
  children: ReactNode;
}

export function SharedCourseLayout({ children }: SharedCourseLayoutProps) {
  return (
    <PageLayout>
      <div>
        {children}
      </div>
    </PageLayout>
  );
}

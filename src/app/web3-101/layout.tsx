import { ReactNode } from "react";
import { PageLayout } from '@/components/page-layout';
import { CourseSidebar } from '@/components/course-sidebar';
import { courseConfigs } from '@/lib/course-config';
import { Metadata } from 'next';
import { pageMetadata, generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.web3101.title,
  description: pageMetadata.web3101.description,
  url: pageMetadata.web3101.url,
  ogImageAlt: 'Web3 Fundamentals Course - Learn Blockchain & Decentralization',
});

const config = courseConfigs['web3-101'];

export default function Web3CourseLayout({ children }: { children: ReactNode }) {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 md:px-6 max-w-7xl py-12 flex flex-col md:flex-row gap-12">
         <CourseSidebar {...config} />
         <main className="flex-1 min-w-0">
            {children}
         </main>
      </div>
    </PageLayout>
  );
}

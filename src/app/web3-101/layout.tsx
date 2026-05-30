import { ReactNode } from 'react';
import { Metadata } from 'next';
import { pageMetadata, generateMetadata } from '@/lib/metadata';
import { SharedCourseLayout } from '@/components/shared-course-layout';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.web3101.title,
  description: pageMetadata.web3101.description,
  url: pageMetadata.web3101.url,
  ogImageAlt: 'Web3 Fundamentals Course - Learn Blockchain & Decentralization',
});

export default function Web3CourseLayout({ children }: { children: ReactNode }) {
  return <SharedCourseLayout courseId="web3-101">{children}</SharedCourseLayout>;
}

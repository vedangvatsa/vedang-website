import { Metadata } from 'next';
import { pageMetadata, generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.aiReports.title,
  description: pageMetadata.aiReports.description,
  url: pageMetadata.aiReports.url,
});

export default function AIReportsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

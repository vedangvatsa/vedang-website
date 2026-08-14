import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'Job Board Comparison Dashboard | Vedang Vatsa',
  description: 'Comparative analytics dashboard comparing active jobs, talent demographics, reach, and automation pipelines of Hashtag Web3 and CV in Bio.',
  url: '/job-boards',
});

export default function JobBoardsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

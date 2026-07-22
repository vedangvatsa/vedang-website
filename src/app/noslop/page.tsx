import { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { AuthorByline } from '@/components/author-byline';
import { NoSlopClient } from './noslop-client';

export const metadata: Metadata = {
  title: 'NoSlop',
  description: 'A browser-based tool to detect and remove AI-generated slop from prose.',
  openGraph: {
    title: 'NoSlop',
    description: 'A browser-based tool to detect and remove AI-generated slop from prose.',
    url: 'https://veda.ng/noslop',
    type: 'website',
  },
};

export default function NoSlopPage() {
  return (
    <PageLayout>
      <PageHero
        title='NoSlop'
        subtitle='A browser-based tool to detect and remove AI-generated slop from prose.'
      />
      <AuthorByline />
      <NoSlopClient />
    </PageLayout>
  );
}

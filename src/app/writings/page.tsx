
import { EssaysList } from '@/components/essays-list';
import { Metadata } from 'next';
import { pageMetadata, generateMetadata } from '@/lib/metadata';
import { PageLayout } from '@/components/page-layout';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { RecentPapers } from '@/components/recent-papers';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.writings.title,
  description: pageMetadata.writings.description,
  url: pageMetadata.writings.url,
  ogImageAlt: 'Essays & Research Papers - Vedang Vatsa',
});

export default function WritingsPage() {
  return (
    <PageLayout>
      <BreadcrumbSchema items={[{ name: "Writings", url: "https://veda.ng/writings" }]} />

      <div className="container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-center mb-12">Writings</h1>

        <RecentPapers />

        <section id="essays" className="py-12 mt-8">
          <h2 className="mb-8 text-center text-2xl md:text-3xl font-semibold tracking-tight">Essays</h2>
          <EssaysList />
        </section>
      </div>
    </PageLayout>
  );
}

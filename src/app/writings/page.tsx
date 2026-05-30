
import { EssaysList } from '@/components/essays-list';
import { Metadata } from 'next';
import { pageMetadata, generateMetadata } from '@/lib/metadata';
import { PageLayout } from '@/components/page-layout';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { CardGrid } from '@/components/card-grid';
import { recentPapers } from '@/components/recent-papers';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.writings.title,
  description: pageMetadata.writings.description,
  url: pageMetadata.writings.url,
  ogImageAlt: 'Essays & Research Papers - Vedang Vatsa',
});

export default function WritingsPage() {
  return (
    <PageLayout wide={true}>
      <BreadcrumbSchema items={[{ name: "Writings", url: "https://veda.ng/writings" }]} />

      <CardGrid
        id="papers"
        title="Recent Papers"
        items={recentPapers.map(p => ({ ...p, external: true }))}
        cta={{ label: 'More on Google Scholar', url: 'https://scholar.google.com/citations?user=aW2dd0IAAAAJ&hl=en', external: true }}
      />

      <section id="essays" className="py-12">
        <div>
          <h1 className="mb-8 text-center text-2xl md:text-3xl font-semibold tracking-tight">Essays</h1>
          <EssaysList />
        </div>
      </section>
    </PageLayout>
  );
}

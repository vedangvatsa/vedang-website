
import { EssaysList } from '@/components/essays-list';
import { Metadata } from 'next';
import { pageMetadata, generateMetadata } from '@/lib/metadata';
import { PageLayout } from '@/components/page-layout';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { CardGrid } from '@/components/card-grid';
import { recentPapers } from '@/components/recent-papers';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.essays.title,
  description: pageMetadata.essays.description,
  url: pageMetadata.essays.url,
  ogImageAlt: 'Essays & Research Papers - Vedang Vatsa',
});

const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Essays on AI & Web3',
  url: 'https://veda.ng/essays',
  description: 'Essays and research papers on AI agents, blockchain systems, stablecoins, and decentralized economies by Vedang Vatsa.',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Vedang Vatsa',
    url: 'https://veda.ng',
  },
  about: {
    '@type': 'Person',
    name: 'Vedang Vatsa',
    url: 'https://veda.ng',
  },
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1'],
  },
};

export default function EssaysPage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <BreadcrumbSchema items={[{ name: "Essays", url: "https://veda.ng/essays" }]} />

      <CardGrid
        id="papers"
        title="Recent Papers"
        items={recentPapers.map(p => ({ ...p, external: true }))}
        cta={{ label: 'More on Google Scholar', url: 'https://scholar.google.com/citations?user=aW2dd0IAAAAJ&hl=en', external: true }}
      />

      <section id="essays" className="py-8">
        <div>
          <h1 className="mb-5 text-center text-2xl md:text-3xl font-semibold tracking-tight">Essays</h1>
          <EssaysList />
        </div>
      </section>
    </PageLayout>
  );
}

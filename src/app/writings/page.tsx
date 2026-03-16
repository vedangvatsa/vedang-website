
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
      <div className="container mx-auto max-w-3xl px-4 md:px-6 py-12">
        <h1 className="text-4xl font-semibold tracking-tight">Writings</h1>
        <p className="mt-2 text-muted-foreground">Essays and research on AI, Web3, and emerging technology</p>

        <div className="mt-12">
          <RecentPapers />
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Essays</h2>
          <div className="mt-6">
            <EssaysList />
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

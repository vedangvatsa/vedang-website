import { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/page-layout';
import { AuthorByline } from '@/components/author-byline';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { CATEGORIES } from '@/lib/ai-reports-data';
import { ReportLibrary } from '@/components/report-library';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'AI Reports Library',
  description: 'Search 250M+ academic papers via OpenAlex and browse 133,000+ curated reports, including consulting, industry, and research reports.',
  url: '/ai-reports',
});

export default function AIReportsPage() {
  return (
    <PageLayout>
      <BreadcrumbSchema items={[{ name: "AI Reports", url: "https://veda.ng/ai-reports" }]} />

      <section className="text-center pt-8 md:pt-12 pb-6 border-b border-border/30">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
            AI Reports Library
          </h1>
          <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Search 250M+ academic papers via OpenAlex and browse 133,000+ curated reports, including consulting, industry, and research reports.
          </p>
          <AuthorByline />
          <p className="mt-4 text-sm text-muted-foreground">
            Read the full synthesis: <Link href="/stateofai" className="text-primary hover:underline font-medium">The State of AI →</Link>
          </p>
        </div>
      </section>

      <ReportLibrary
        dataUrl="/ai-reports-data.json"
        categories={CATEGORIES}
        corpus="ai"
      />
    </PageLayout>
  );
}

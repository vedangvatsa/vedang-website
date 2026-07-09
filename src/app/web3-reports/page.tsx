import { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/page-layout';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { CATEGORIES } from '@/lib/web3-reports-data';
import { ReportLibrary } from '@/components/report-library';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'Web3 Reports Library',
  description: 'Search 250M+ academic papers via OpenAlex and browse 100,000+ curated blockchain and Web3 reports.',
  url: '/web3-reports',
});

export default function Web3ReportsPage() {
  return (
    <PageLayout>
      <BreadcrumbSchema items={[{ name: "Web3 Reports", url: "https://veda.ng/web3-reports" }]} />

      <section className="text-center pt-8 md:pt-12 pb-6 border-b border-border/30">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
            Web3 Reports Library
          </h1>
          <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Search 250M+ academic papers via OpenAlex and browse 100,000+ curated blockchain and Web3 reports.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Read the full synthesis: <Link href="/stateofweb3" className="text-primary hover:underline font-medium">The State of Web3 →</Link>
          </p>
        </div>
      </section>

      <ReportLibrary
        dataUrl="/web3-reports-data.json"
        categories={CATEGORIES}
        corpus="web3"
      />
    </PageLayout>
  );
}

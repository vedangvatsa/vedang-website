import { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/page-layout';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { CATEGORIES } from '@/lib/web3-reports-data';
import { ReportLibrary } from '@/components/report-library';

export const metadata: Metadata = {
  title: 'Web3 Reports Library | Vedang Vatsa',
  description: 'A searchable database of 100,000+ Web3 research papers, white papers, and regulatory frameworks from a 128,000-paper OpenAlex corpus.',
};

export default function Web3ReportsPage() {
  return (
    <PageLayout>
      <BreadcrumbSchema items={[{ name: "Web3 Reports", url: "https://veda.ng/web3-reports" }]} />

      <section className="text-center pt-16 pb-12 border-b border-border/30">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">
            Web3 Reports Library
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground">
            100,000+ research papers, institutional reports, and on-chain analyses from a 128,000-paper OpenAlex corpus. Each entry links directly to a verified DOI or academic repository.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Read the full synthesis: <Link href="/stateofweb3" className="text-primary hover:underline font-medium">The State of Web3 →</Link>
          </p>
        </div>
      </section>

      <ReportLibrary
        dataUrl="/web3-reports-data.json"
        categories={CATEGORIES}
      />
    </PageLayout>
  );
}

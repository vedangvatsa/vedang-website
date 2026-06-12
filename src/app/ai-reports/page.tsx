import { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/page-layout';
import { AuthorByline } from '@/components/author-byline';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { CATEGORIES } from '@/lib/ai-reports-data';
import { ReportLibrary } from '@/components/report-library';

export const metadata: Metadata = {
  title: 'AI Reports Library | Vedang Vatsa',
  description: 'A searchable database of 133,000+ AI research papers and industry analyses, drawn from a 5-million-paper OpenAlex corpus.',
};

export default function AIReportsPage() {
  return (
    <PageLayout>
      <BreadcrumbSchema items={[{ name: "AI Reports", url: "https://veda.ng/ai-reports" }]} />

      <section className="text-center pt-12 md:pt-20 pb-8 border-b border-border/30">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            AI Reports Library
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            133,000+ research papers, institutional reports, and industry analyses drawn from a 5-million-paper OpenAlex corpus. Each entry links directly to a verified DOI or academic repository.
          </p>
          <AuthorByline />
          <p className="mt-6 text-sm text-muted-foreground">
            Read the full synthesis: <Link href="/stateofai" className="text-primary hover:underline font-medium">The State of AI →</Link>
          </p>
        </div>
      </section>

      <ReportLibrary
        dataUrl="/ai-reports-data.json"
        categories={CATEGORIES}
      />
    </PageLayout>
  );
}

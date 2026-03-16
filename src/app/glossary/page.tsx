import { Metadata } from 'next';
import { pageMetadata, generateMetadata } from '@/lib/metadata';
import { getAllTermsSorted } from '@/lib/glossary';
import { GlossaryFilter } from '@/components/glossary-filter';
import { PageLayout } from '@/components/page-layout';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.glossary.title,
  description: pageMetadata.glossary.description,
  url: pageMetadata.glossary.url,
});

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, '') + '...';
}

export default function GlossaryPage() {
  const terms = getAllTermsSorted();
  const categoryOrder = ["AI", "Web3", "Tech", "Other"];
  const categories = [...new Set(terms.map((t) => t.category || "Other"))].sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );
  const lightTerms = terms.map((t) => ({
    term: t.term, slug: t.slug, category: t.category,
    definition: truncate(t.definition.replace(/\n/g, ' '), 100),
  }));

  const glossarySchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": "https://veda.ng/glossary",
    "name": "Glossary - AI, Web3 & Tech Terms",
    "description": "Definitions of AI, Web3, and technical terms.",
    "url": "https://veda.ng/glossary",
    "hasDefinedTerm": terms.map((term) => ({
      "@type": "DefinedTerm", "name": term.term, "url": `https://veda.ng/glossary/${term.slug}`
    }))
  };

  return (
    <PageLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(glossarySchema) }} />
      <BreadcrumbSchema items={[{ name: "Glossary", url: "https://veda.ng/glossary" }]} />
      <div className="container mx-auto max-w-3xl px-4 md:px-6 py-12">
        <h1 className="text-4xl font-semibold tracking-tight">Glossary</h1>
        <p className="mt-2 text-muted-foreground">Deep dives into the terminology shaping AI, Web3, and deep tech.</p>
      </div>
      <div className="container mx-auto px-4 md:px-6 max-w-7xl pb-16">
        <GlossaryFilter terms={lightTerms} categories={categories} />
      </div>
    </PageLayout>
  );
}

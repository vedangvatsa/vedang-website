import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getTermBySlug, glossaryTerms } from '@/lib/glossary';
import { notFound } from 'next/navigation';
import { PageLayout } from '@/components/page-layout';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { RelatedEssaysForTerm } from '@/lib/cross-links';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return glossaryTerms.map((term) => ({
    slug: term.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = getTermBySlug(slug);
  
  if (!term) {
    return { title: 'Term Not Found' };
  }

  const truncatedDescription = term.definition.length > 160 
    ? term.definition.substring(0, 157) + '...' 
    : term.definition;

  // Shorten title if it would exceed 70 chars (template adds " | Vedang Vatsa")
  // Max: 70 - " | Glossary | Vedang Vatsa".length(26) = 44 chars for name
  let titleName = term.term;
  if (`${titleName} | Glossary | Vedang Vatsa`.length > 70) {
    const abbrevMatch = titleName.match(/\(([A-Za-z0-9/\-]+)\)/);
    if (abbrevMatch) {
      titleName = abbrevMatch[1]; // Just use "RLHF", "DePIN", "CI/CD"
    } else {
      titleName = titleName.substring(0, 44); // Truncate as last resort
    }
  }

  return {
    title: `${titleName} | Glossary`,
    description: truncatedDescription,
    alternates: { canonical: `/glossary/${slug}` },
    openGraph: {
      title: `${term.term} | Glossary`,
      description: truncatedDescription,
      url: `/glossary/${term.slug}`,
      type: 'article',
      images: [
        {
          url: `/images/glossary/${slug}.svg`,
          width: 800,
          height: 400,
          alt: `${term.term} infographic`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${term.term} | Glossary`,
      description: truncatedDescription,
      images: [`/images/glossary/${slug}.svg`],
    },
  };
}

export default async function GlossaryTermPage({ params }: PageProps) {
  const { slug } = await params;
  const term = getTermBySlug(slug);

  if (!term) {
    notFound();
  }

  const relatedTermObjects = term.relatedTerms
    ? term.relatedTerms.map(slug => getTermBySlug(slug)).filter(Boolean)
    : [];

  const definitionSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "name": term.term,
    "description": term.definition,
    "inDefinedTermSet": "https://veda.ng/glossary",
    "url": `https://veda.ng/glossary/${term.slug}`,
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definitionSchema) }}
      />
      <BreadcrumbSchema items={[
        { name: "Glossary", url: "https://veda.ng/glossary" },
        { name: term.term, url: `https://veda.ng/glossary/${term.slug}` },
      ]} />

      <section className="text-center pt-12 pb-8 border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <Link 
            href="/glossary" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Glossary
          </Link>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            {term.term}
          </h1>
          <div className="mt-6 mx-auto max-w-2xl">
            <Image
              src={`/images/glossary/${term.slug}.svg?v=4`}
              alt={`${term.term} infographic`}
              width={800}
              height={400}
              className="w-full h-auto rounded-lg"
              unoptimized
              priority
            />
          </div>
        </div>
      </section>

      <article className="container mx-auto px-4 md:px-6 max-w-3xl py-16">
        <div className="space-y-6 mb-12">
          {(() => {
            // Split on explicit paragraph breaks first
            const paragraphs = term.definition.split('\n\n').filter(Boolean);
            
            // If definition is one long paragraph, break it into chunks of ~3 sentences
            const formatted = paragraphs.flatMap(p => {
              const trimmed = p.trim();
              if (trimmed.length < 400) return [trimmed];
              
              // Split on sentence boundaries (period followed by space and uppercase)
              const sentences = trimmed.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [trimmed];
              const chunks: string[] = [];
              let current = '';
              
              for (const s of sentences) {
                if (current && (current + s).length > 400) {
                  chunks.push(current.trim());
                  current = s;
                } else {
                  current += s;
                }
              }
              if (current.trim()) chunks.push(current.trim());
              return chunks;
            });
            
            return formatted.map((paragraph, i) => (
              <p key={i} className="text-lg text-foreground leading-relaxed">
                {paragraph}
              </p>
            ));
          })()}
        </div>

        {relatedTermObjects.length > 0 && (
          <div className="border-t border-border/50 pt-12">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-6">Related Terms</h2>
            <div className="flex flex-wrap gap-3">
              {relatedTermObjects.map((relatedTerm) => (
                <Link 
                  key={relatedTerm!.slug} 
                  href={`/glossary/${relatedTerm!.slug}`}
                  className="inline-flex px-3 py-2 text-sm font-medium border border-border/50 rounded-md hover:border-primary hover:text-primary transition-colors"
                >
                  {relatedTerm!.term}
                </Link>
              ))}
            </div>
          </div>
        )}

        <RelatedEssaysForTerm termSlug={slug} />
      </article>
    </PageLayout>
  );
}

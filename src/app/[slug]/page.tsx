
import { essays } from '@/lib/essays';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { PageLayout } from '@/components/page-layout';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Metadata } from 'next';
import { RelatedEssays } from '@/components/related-essays';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { RelatedGlossaryTerms } from '@/lib/cross-links';
import { glossaryTerms } from '@/lib/glossary';

type Props = {
  params: { slug: string };
};

const essaysDirectory = path.join(process.cwd(), 'src', 'content', 'essays');

// Maps essay slugs to relevant glossary term slugs for internal linking
const ESSAY_GLOSSARY_LINKS: Record<string, string[]> = {
  'ai-superintelligence-timeline': ['agi', 'llm', 'alignment', 'transformer'],
  'artificial-intuition': ['llm', 'embeddings', 'rlhf', 'agent'],
  'are-we-in-a-simulation': ['agi', 'llm'],
  'the-ai-agent-economy': ['agent', 'llm', 'defi', 'dao'],
  'computational-constitutions': ['smart-contract', 'dao', 'zero-knowledge-proof'],
  'api-states': ['api', 'smart-contract', 'blockchain', 'dao'],
  'computational-social-science-at-scale': ['llm', 'agent', 'rag'],
  'governance-in-the-age-of-agi': ['agi', 'dao', 'alignment', 'constitutional-ai'],
  'programmable-trust': ['zero-knowledge-proof', 'smart-contract', 'blockchain', 'oracle'],
  'rationality-in-ai': ['alignment', 'rlhf', 'constitutional-ai', 'llm'],
  'ambient-intelligence': ['agent', 'multimodal-ai', 'embeddings'],
  'synthetic-empathy': ['llm', 'rlhf', 'multimodal-ai'],
  'the-attention-refinery': ['agent', 'llm'],
  'the-cognitive-load-crisis': ['llm', 'rag'],
  'digital-monasticism': ['agent', 'llm'],
  'the-dark-forest-internet': ['zero-knowledge-proof', 'blockchain', 'ipfs'],
  'an-internet-of-lies': ['zero-knowledge-proof', 'blockchain', 'merkle-tree'],
  'pseudonymous-agency': ['zero-knowledge-proof', 'wallet', 'blockchain'],
  'the-god-protocol': ['agi', 'alignment', 'constitutional-ai'],
  'the-plurality-trap': ['agi', 'multimodal-ai', 'embeddings'],
  'sacred-algorithms': ['alignment', 'constitutional-ai', 'rlhf'],
  'the-substrate-shift': ['ipfs', 'webassembly', 'edge-computing'],
  'the-mesh-economy': ['defi', 'dao', 'ipfs', 'blockchain'],
  'the-simulation-layer': ['agent', 'llm', 'rag'],
  'the-singularity-paradox': ['agi', 'llm', 'alignment'],
  'what-is-the-singularity': ['agi', 'llm', 'transformer'],
  'the-intuitive-singularity': ['agi', 'llm', 'embeddings'],
  'tracing-blockchains-journey': ['blockchain', 'smart-contract', 'defi', 'consensus-mechanism'],
  'the-twilight-economy': ['agent', 'llm', 'dao'],
  'the-sensory-internet': ['multimodal-ai', 'agent', 'embeddings'],
  'the-in-between-state': ['agi', 'alignment'],
  'hustle-culture-is-a-cage': ['agent', 'dao'],
};

const GLOSSARY_LABELS: Record<string, string> = {
  'agi': 'AGI', 'llm': 'LLM', 'alignment': 'AI Alignment', 'transformer': 'Transformer',
  'embeddings': 'Embeddings', 'rlhf': 'RLHF', 'agent': 'AI Agent', 'rag': 'RAG',
  'constitutional-ai': 'Constitutional AI', 'smart-contract': 'Smart Contract',
  'dao': 'DAO', 'zero-knowledge-proof': 'Zero-Knowledge Proof', 'api': 'API',
  'blockchain': 'Blockchain', 'oracle': 'Oracle', 'multimodal-ai': 'Multimodal AI',
  'defi': 'DeFi', 'ipfs': 'IPFS', 'merkle-tree': 'Merkle Tree', 'wallet': 'Wallet',
  'webassembly': 'WebAssembly', 'edge-computing': 'Edge Computing',
  'consensus-mechanism': 'Consensus Mechanism',
};

export function generateStaticParams() {
  if (!fs.existsSync(essaysDirectory)) {
    return [];
  }
  const files = fs.readdirSync(essaysDirectory);
  return files.map(file => ({
    slug: file.replace('.mdx', ''),
  }));
}

function getEssay(slug: string) {
  const filePath = path.join(essaysDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const markdown = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(markdown);
  return {
    frontmatter,
    content,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const essay = getEssay(params.slug);

  if (!essay) {
    notFound();
  }

  const siteUrl = 'https://veda.ng';
  const essayUrl = `${siteUrl}/${params.slug}`;
  const imageUrl = `${siteUrl}/images/icon.png`;

  const publishedTime = essay.frontmatter.date ? new Date(essay.frontmatter.date).toISOString() : new Date().toISOString();

  return {
    title: essay.frontmatter.title,
    description: essay.frontmatter.summary,
    alternates: {
      canonical: `/${params.slug}`,
    },
    openGraph: {
      title: essay.frontmatter.title,
      description: essay.frontmatter.summary,
      url: essayUrl,
      type: 'article',
      publishedTime: publishedTime,
      images: [
        {
          url: imageUrl,
          width: 256,
          height: 256,
          alt: essay.frontmatter.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: essay.frontmatter.title,
      description: essay.frontmatter.summary,
      images: [imageUrl],
    },
  };
}

export default function EssayPage({ params }: { params: { slug: string } }) {
  const essay = getEssay(params.slug);

  if (!essay) {
    notFound();
  }

  const datePublished = essay.frontmatter.date ? new Date(essay.frontmatter.date).toISOString() : new Date().toISOString();
  const dateModified = essay.frontmatter.updated ? new Date(essay.frontmatter.updated).toISOString() : datePublished;

  // Calculate word count from content
  const wordCount = essay.content.split(/\s+/).length;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: essay.frontmatter.title,
    author: {
      '@type': 'Person',
      name: essay.frontmatter.author || 'Vedang Vatsa',
      url: 'https://veda.ng',
      image: 'https://veda.ng/images/icon.png',
    },
    description: essay.frontmatter.summary,
    image: 'https://veda.ng/images/icon.png',
    publisher: {
      '@type': 'Organization',
      name: 'Vedang Vatsa',
      logo: {
        '@type': 'ImageObject',
        url: 'https://veda.ng/images/icon.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://veda.ng/${params.slug}`,
    },
    datePublished: datePublished,
    dateModified: dateModified,
    wordCount: wordCount,
    ...(essay.frontmatter.keywords && { keywords: essay.frontmatter.keywords }),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://veda.ng' },
      { '@type': 'ListItem', position: 2, name: 'Writings', item: 'https://veda.ng/writings' },
      { '@type': 'ListItem', position: 3, name: essay.frontmatter.title, item: `https://veda.ng/${params.slug}` },
    ],
  };

  return (
    <PageLayout>
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BreadcrumbSchema items={[
        { name: "Writings", url: "https://veda.ng/writings" },
        { name: essay.frontmatter.title, url: `https://veda.ng/${params.slug}` },
      ]} />

      <div className="py-8">
        <article className="prose dark:prose-invert mx-auto px-4 md:px-6">
          <h1>{essay.frontmatter.title}</h1>
          <p className="text-sm text-muted-foreground">
            By <a href="/profile" className="hover:underline">Vedang Vatsa</a>
            {essay.frontmatter.date && <> &middot; Published: {new Date(essay.frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</>}
            {essay.frontmatter.updated && <> &middot; Updated: {new Date(essay.frontmatter.updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</>}
          </p>
          <MDXRemote source={essay.content} />
        </article>

        <div className="mx-auto max-w-4xl px-4 md:px-6 mt-12">
            <RelatedGlossaryTerms
              essaySlug={params.slug}
              terms={glossaryTerms.map(t => ({ slug: t.slug, term: t.term }))}
            />
            <Separator className="my-8" />
            <RelatedEssays currentSlug={params.slug} />
        </div>
      </div>
    </PageLayout>
  );
}

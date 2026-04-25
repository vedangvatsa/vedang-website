
import { essays } from '@/lib/essays';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
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
import { Columns, Column, Figure, StatRow, Stat, Callout, PullQuote, Timeline, TimelineItem, SectionLabel, KeyTakeaway, EcosystemDiagram } from '@/components/mdx';
import { MarketProjectionChart, TrustGapChart, ConsumerConcernsChart, ValueShiftGrid, InteractionModelsVisual, TransactionFlowDiagram, CommerceEvolutionTimeline, ProtocolComparisonTable, CompetitiveLandscape } from '@/components/mdx/charts';
import { WebEvolutionTimeline, MCPAdoptionChart, TaskHorizonChart, ProtocolStackDiagram, IndustryAdoptionChart, AgentMarketChart, SecurityThreatMatrix, AgentVsChatbot, InfrastructureLandscape } from '@/components/mdx/agentic-web-charts';
import { ScarcitySpectrum, DataCenterEnergyChart, TrainingCostChart, MaterialConstraints, PlatformConcentration, RealityCheckGrid, DualEconomyFramework } from '@/components/mdx/infinity-charts';
import { AIJobExposure, JobChurnChart, EarlyCareerImpact, ProductivityParadox, GenderImpact, UBIPilotResults } from '@/components/mdx/ai-economy-charts';
import { GDPGrowthTimeline, GovernanceScorecard, IndustrialEvolution, HealthcareComparison, InequalitySnapshot, TransferabilityGrid } from '@/components/mdx/singapore-charts';
import { PerceptionArcTimeline, IndiaSectorBifurcation, IncomeThresholdChart, COOEffectSize } from '@/components/mdx/cheap-charts';
import { AgentMarketGrowth, EnterpriseAdoption, CoaseDisruption } from '@/components/mdx/agent-economy-charts';
import { BlockchainSnapshot, BlockchainPhases, L2ScalingLandscape, StablecoinRegulatory } from '@/components/mdx/blockchain-charts';
import { RegulatoryFriction, BureaucracyCostChart, EGovernanceMaturity, RegulatoryGrowth } from '@/components/mdx/bureaucracy-charts';
import { YCIndustryBreakdown, RecentBatchComposition, AgentLayerTaxonomy, YCGeoConcentration, AgentForXPattern, DefenseHardwareSurge, TaglineArchaeology, BatchSizeTimeline } from '@/components/mdx/yc-landscape-charts';
import { UIComplexityComparison, APIAbstractionLayer, TextUIAdoption, PlatformShiftTimeline } from '@/components/mdx/universal-charts';
import { StepwiseMaturityModel, ROIImpactStats } from '@/components/mdx/stepwise-charts';
import { DigitalGovMaturity, EResidencyImpact, AgenticStateArchitecture } from '@/components/mdx/agentic-state-charts';
import { ApiTrafficChart, ZeroUIMarketMap, SaaSPricingShift, AttentionCollapseChart, GUITimeline, FrontendDeclineChart, HardwarePivotGrid } from '@/components/mdx/post-interface-charts';

type Props = {
  params: Promise<{ slug: string }>;
};

const essaysDirectory = path.join(process.cwd(), 'src', 'content', 'essays');

// Maps essay slugs to relevant glossary term slugs for internal linking
const ESSAY_GLOSSARY_LINKS: Record<string, string[]> = {
  'asi-timeline': ['agi', 'llm', 'alignment', 'transformer'],
  'artificial-intuition': ['llm', 'embeddings', 'rlhf', 'agent'],
  'simulation-hypothesis': ['agi', 'llm'],
  'ai-agent-economy': ['agent', 'llm', 'defi', 'dao'],
  'computational-constitutions': ['smart-contract', 'dao', 'zero-knowledge-proof'],
  'api-states': ['api', 'smart-contract', 'blockchain', 'dao'],
  'computational-social-science': ['llm', 'agent', 'rag'],
  'agi-governance': ['agi', 'dao', 'alignment', 'constitutional-ai'],
  'programmable-trust': ['zero-knowledge-proof', 'smart-contract', 'blockchain', 'oracle'],
  'rationality-in-ai': ['alignment', 'rlhf', 'constitutional-ai', 'llm'],
  'ambient-intelligence': ['agent', 'multimodal-ai', 'embeddings'],
  'synthetic-empathy': ['llm', 'rlhf', 'multimodal-ai'],
  'attention-refinery': ['agent', 'llm'],
  'cognitive-load': ['llm', 'rag'],
  'digital-monasticism': ['agent', 'llm'],
  'dark-forest-internet': ['zero-knowledge-proof', 'blockchain', 'ipfs'],
  'internet-of-lies': ['zero-knowledge-proof', 'blockchain', 'merkle-tree'],
  'pseudonymous-agency': ['zero-knowledge-proof', 'wallet', 'blockchain'],
  'god-protocol': ['agi', 'alignment', 'constitutional-ai'],
  'plurality-trap': ['agi', 'multimodal-ai', 'embeddings'],
  'sacred-algorithms': ['alignment', 'constitutional-ai', 'rlhf'],
  'substrate-shift': ['ipfs', 'webassembly', 'edge-computing'],
  'mesh-economy': ['defi', 'dao', 'ipfs', 'blockchain'],
  'simulation-layer': ['agent', 'llm', 'rag'],
  'singularity-paradox': ['agi', 'llm', 'alignment'],
  'singularity': ['agi', 'llm', 'transformer'],
  'intuitive-singularity': ['agi', 'llm', 'embeddings'],
  'blockchain-journey': ['blockchain', 'smart-contract', 'defi', 'consensus-mechanism'],
  'twilight-economy': ['agent', 'llm', 'dao'],
  'sensory-internet': ['multimodal-ai', 'agent', 'embeddings'],
  'in-between-state': ['agi', 'alignment'],
  'hustle-culture': ['agent', 'dao'],
  'agentic-commerce': ['agent', 'llm', 'api'],
  'towards-the-agentic-web': ['agent', 'llm', 'rag', 'api'],
  'yc-landscape': ['agent', 'llm', 'api'],
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
  const { slug } = await params;
  const essay = getEssay(slug);

  if (!essay) {
    notFound();
  }

  const siteUrl = 'https://veda.ng';
  const essayUrl = `${siteUrl}/${slug}`;

  const publishedTime = essay.frontmatter.date ? new Date(essay.frontmatter.date).toISOString() : new Date().toISOString();

  // Note: OG image is generated dynamically by the co-located opengraph-image.tsx route
  return {
    title: essay.frontmatter.title,
    description: essay.frontmatter.summary,
    keywords: essay.frontmatter.keywords,
    alternates: {
      canonical: `/${slug}`,
    },
    openGraph: {
      title: essay.frontmatter.title,
      description: essay.frontmatter.summary,
      url: essayUrl,
      type: 'article',
      publishedTime: publishedTime,
    },
    twitter: {
      card: 'summary_large_image',
      title: essay.frontmatter.title,
      description: essay.frontmatter.summary,
    },
  };
}

export default async function EssayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const essay = getEssay(slug);

  if (!essay) {
    notFound();
  }

  const datePublished = essay.frontmatter.date ? new Date(essay.frontmatter.date).toISOString() : new Date().toISOString();
  const dateModified = essay.frontmatter.updated ? new Date(essay.frontmatter.updated).toISOString() : datePublished;

  // Calculate word count from content (strip MDX/JSX tags for accurate reading time)
  const plainText = essay.content
    .replace(/<[^>]+>/g, '')      // strip HTML/JSX tags
    .replace(/\{[^}]+\}/g, '')    // strip JSX expressions
    .replace(/^---[\s\S]*?---/m, '') // strip frontmatter
    .replace(/!\[.*?\]\(.*?\)/g, '') // strip image markdown
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1'); // keep link text
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;

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
      '@id': `https://veda.ng/${slug}`,
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
      { '@type': 'ListItem', position: 3, name: essay.frontmatter.title, item: `https://veda.ng/${slug}` },
    ],
  };

  const readingTime = Math.ceil(wordCount / 250);

  return (
    <PageLayout>
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BreadcrumbSchema items={[
        { name: "Writings", url: "https://veda.ng/writings" },
        { name: essay.frontmatter.title, url: `https://veda.ng/${slug}` },
      ]} />

      {/* ─── Report Hero ─── */}
      <header className="border-b border-border/40 bg-secondary/20">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-10 md:py-16">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Link href="/writings" className="hover:text-foreground transition-colors">Essays</Link>
            <span>/</span>
            <span className="text-foreground">{essay.frontmatter.title}</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            {essay.frontmatter.title}
          </h1>
          {essay.frontmatter.summary && (
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
              {essay.frontmatter.summary}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-muted-foreground">
            <Link href="/profile" className="font-medium text-foreground hover:text-primary transition-colors">Vedang Vatsa</Link>
            <span>·</span>
            {essay.frontmatter.date && (
              <><span>{new Date(essay.frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span><span>·</span></>
            )}
            <span>{readingTime} min read</span>
          </div>
        </div>
      </header>

      {/* ─── Report Body ─── */}
      <div className="py-10 md:py-14">
        <article className="report-article prose prose-neutral dark:prose-invert prose-img:rounded-lg prose-table:w-full prose-headings:tracking-tight prose-headings:font-semibold prose-p:leading-relaxed prose-p:text-[#37352f] dark:prose-p:text-[rgba(255,255,255,0.81)] prose-li:text-[#37352f] dark:prose-li:text-[rgba(255,255,255,0.81)] prose-a:text-[#37352f] dark:prose-a:text-[rgba(255,255,255,0.81)] prose-strong:text-[#37352f] dark:prose-strong:text-[rgba(255,255,255,0.81)] max-w-6xl mx-auto px-4 md:px-6">
          <MDXRemote
            source={essay.content}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            components={{
              Columns,
              Column,
              Figure,
              StatRow,
              Stat,
              Callout,
              PullQuote,
              Timeline,
              TimelineItem,
              SectionLabel,
              KeyTakeaway,
              EcosystemDiagram,
              MarketProjectionChart,
              TrustGapChart,
              ConsumerConcernsChart,
              ValueShiftGrid,
              InteractionModelsVisual,
              TransactionFlowDiagram,
              CommerceEvolutionTimeline,
              ProtocolComparisonTable,
              CompetitiveLandscape,
              WebEvolutionTimeline,
              MCPAdoptionChart,
              TaskHorizonChart,
              ProtocolStackDiagram,
              IndustryAdoptionChart,
              AgentMarketChart,
              SecurityThreatMatrix,
              AgentVsChatbot,
              InfrastructureLandscape,
              ScarcitySpectrum,
              DataCenterEnergyChart,
              TrainingCostChart,
              MaterialConstraints,
              PlatformConcentration,
              RealityCheckGrid,
              DualEconomyFramework,
              AIJobExposure,
              JobChurnChart,
              EarlyCareerImpact,
              ProductivityParadox,
              GenderImpact,
              UBIPilotResults,
              GDPGrowthTimeline,
              GovernanceScorecard,
              IndustrialEvolution,
              HealthcareComparison,
              InequalitySnapshot,
              TransferabilityGrid,
              PerceptionArcTimeline,
              IndiaSectorBifurcation,
              IncomeThresholdChart,
              COOEffectSize,
              AgentMarketGrowth,
              EnterpriseAdoption,
              CoaseDisruption,
              BlockchainSnapshot,
              BlockchainPhases,
              L2ScalingLandscape,
              StablecoinRegulatory,
              RegulatoryFriction,
              BureaucracyCostChart,
              EGovernanceMaturity,
              RegulatoryGrowth,
              YCIndustryBreakdown,
              RecentBatchComposition,
              AgentLayerTaxonomy,
              YCGeoConcentration,
              AgentForXPattern,
              DefenseHardwareSurge,
              TaglineArchaeology,
              BatchSizeTimeline,
              UIComplexityComparison,
              APIAbstractionLayer,
              TextUIAdoption,
              PlatformShiftTimeline,
              StepwiseMaturityModel,
              ROIImpactStats,
              DigitalGovMaturity,
              EResidencyImpact,
              AgenticStateArchitecture,
              ApiTrafficChart,
              ZeroUIMarketMap,
              SaaSPricingShift,
              AttentionCollapseChart,
              GUITimeline,
              FrontendDeclineChart,
              HardwarePivotGrid,
              img: (props: any) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  {...props}
                  alt={props.alt || ''}
                  className="rounded-lg shadow-sm border border-border/30"
                  style={{
                    maxWidth: '640px',
                    width: '100%',
                    height: 'auto',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    display: 'block',
                    ...props.style,
                  }}
                />
              ),
            }}
          />
        </article>

        <div className="mx-auto max-w-6xl px-4 md:px-6 mt-16">
            <RelatedGlossaryTerms
              essaySlug={slug}
              terms={glossaryTerms.map(t => ({ slug: t.slug, term: t.term }))}
            />
            <Separator className="my-8" />
            <RelatedEssays currentSlug={slug} />
        </div>
      </div>
    </PageLayout>
  );
}

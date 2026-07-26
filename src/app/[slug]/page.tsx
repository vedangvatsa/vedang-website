
import { essays } from '@/lib/essays';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { PageLayout } from '@/components/page-layout';
import { ZoomableImage } from '@/components/zoomable-image';
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
import { Columns, Column, Figure, StatRow, Stat, Callout, PullQuote, Timeline, TimelineItem, SectionLabel, KeyTakeaway, EcosystemDiagram, ResearchPaper } from '@/components/mdx';
import { MarketProjectionChart, TrustGapChart, ConsumerConcernsChart, ValueShiftGrid, InteractionModelsVisual, TransactionFlowDiagram, CommerceEvolutionTimeline, ProtocolComparisonTable, CompetitiveField } from '@/components/mdx/charts';
import { VCValuationExpansionChart, VCGiniConcentrationChart, VCDeathValleyTimeline, VCSectorSemanticAnalysis, VCStrategicFrameworkDiagram, VCEquationBoxSVG, VCBarbellSystemVisual, VCBarbellVectorDiagram } from '@/components/mdx/funding-charts';
import { WebEvolutionTimeline, ProtocolStackDiagram, SecurityThreatMatrix, AgentVsChatbot, InfrastructureOverview } from '@/components/mdx/agentic-web-charts';
import { ScarcitySpectrum, MaterialConstraints, PlatformConcentration, RealityCheckGrid, DualEconomyFramework } from '@/components/mdx/infinity-charts';
import { AIJobExposure, EarlyCareerImpact, ProductivityParadox, GenderImpact, UBIPilotResults } from '@/components/mdx/aieconomy-charts';
import { GDPGrowthTimeline, GovernanceScorecard, IndustrialEvolution, HealthcareComparison, InequalitySnapshot, TransferabilityGrid } from '@/components/mdx/singapore-charts';
import { PerceptionArcTimeline, IndiaSectorBifurcation, IncomeThresholdChart, COOEffectSize } from '@/components/mdx/cheap-charts';
import { EnterpriseAdoption, CoaseDisruption } from '@/components/mdx/agent-economy-charts';
import { BlockchainSnapshot, BlockchainPhases, L2ScalingOverview, StablecoinRegulatory } from '@/components/mdx/blockchain-charts';
import { RegulatoryFriction, EGovernanceMaturity, RegulatoryGrowth } from '@/components/mdx/bureaucracy-charts';
import { RecentBatchComposition, AgentLayerTaxonomy, YCGeoConcentration, AgentForXPattern, DefenseHardwareSurge, TaglineArchaeology } from '@/components/mdx/yc-charts';
import { UIComplexityComparison, APIAbstractionLayer, TextUIAdoption, PlatformShiftTimeline } from '@/components/mdx/universal-charts';
import { StepwiseMaturityModel, ROIImpactStats } from '@/components/mdx/stepwise-charts';
import { DigitalGovMaturity, EResidencyImpact, AgenticStateArchitecture } from '@/components/mdx/stateagents-charts';
import { ZeroUIMarketMap, SaaSPricingShift, GUITimeline, HardwarePivotGrid } from '@/components/mdx/post-interface-charts';
import { CurationFactorsChart } from '@/components/mdx/plurality-charts';
import { MeshOrgComparison, EnergyMeshComparison } from '@/components/mdx/mesh-charts';
import { SimulationDomainChart, SimCostComparison, SimulationGapChart } from '@/components/mdx/simulayer-charts';
import { SensoryBandwidthChart, HapticGenerationsChart, SpatialComputingAdoption, BCIMarketChart, SensoryStackTimeline, PresenceThresholdChart, SensoryStackTable } from '@/components/mdx/sensory-charts';
import { GodProtocolComparison, TTPEvolutionTimeline, PrivacyTechStack, TTPMarketScale, DistributedArchitectureChart, AlignmentFrameworkChart } from '@/components/mdx/godprotocol-charts';
import { TrustPrimitivesComparison, DeFiSecurityChart, TrustStackArchitecture, TrustComparisonChart, DigitalIdentityTimeline, TrustApplicationDomains } from '@/components/mdx/trust-charts';
import { IdentitySpectrumChart, PseudonymousSuccessCases, ReputationInfraChart, ParticipationExpansionChart, DecentralizedIdentityMarket } from '@/components/mdx/pseudonymity-charts';
import { GovernanceEffectivenessChart, DAOVoterParticipation, VotingMechanismChart, GovernanceStackChart } from '@/components/mdx/constitutions-charts';
import { DataSourceDisruption, MethodologicalEvolution, PolarizationFindings, ObserverEffectChart } from '@/components/mdx/socialscience-charts';
import { MonasteryPrincipleChart, AttentionSpanDecline, InterruptionCostChart, RetreatMovementsTimeline, SilenceEconomyChart } from '@/components/mdx/monasticism-charts';
import { PlaybookHeroCard, AgentToolsMap, AutomationROIChart, ContentPipelineFlow, OutreachPipeline, AIMaturityLevels, ImplementationTimeline, NurtureSequence, ImplementationChecklist, SocialListeningMap, SupportTierChart, DashboardMetricsMap, UseCaseCatalog } from '@/components/mdx/playbook-charts';
import { StateOfAiKeywordsChart, StateOfAiBigramsChart, StateOfAiTimeline, StateOfAiNgramAnalyzer, StateOfAiMomentum, StateOfAiGeography, StateOfAiCitations } from '@/components/mdx/stateofai-charts';
import { StateOfWeb3KeywordsChart, StateOfWeb3BigramsChart, StateOfWeb3Timeline, StateOfWeb3NgramAnalyzer, StateOfWeb3ConvergenceMatrix, StateOfWeb3Momentum, StateOfWeb3Citations } from '@/components/mdx/stateofweb3-charts';
import { SecurityConsolidation, ComputeValuationTable, AgentProductValuations, MarketplaceComposition, TopInvestorsTable } from '@/components/mdx/agentstack-charts';
import { AIDetectorFeatureComparison } from '@/components/mdx/ai-detector-charts';

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

const essaysDirectory = path.join(process.cwd(), 'src', 'content', 'essays');

// Maps essay slugs to relevant glossary term slugs for internal linking
const ESSAY_GLOSSARY_LINKS: Record<string, string[]> = {
  'asi': ['agi', 'llm', 'alignment', 'transformer'],
  'intuition': ['llm', 'embeddings', 'rlhf', 'agent'],
  'simulation': ['agi', 'llm'],
  'agenteconomy': ['agent', 'llm', 'defi', 'dao'],
  'constitutions': ['smart-contract', 'dao', 'zero-knowledge-proof'],
  'apis': ['api', 'smart-contract', 'blockchain', 'dao'],
  'socialscience': ['llm', 'agent', 'rag'],
  'governance': ['agi', 'dao', 'alignment', 'constitutional-ai'],
  'trust': ['zero-knowledge-proof', 'smart-contract', 'blockchain', 'oracle'],
  'rationality': ['alignment', 'rlhf', 'constitutional-ai', 'llm'],
  'ambient': ['agent', 'multimodal-ai', 'embeddings'],
  'empathy': ['llm', 'rlhf', 'multimodal-ai'],
  'attention': ['agent', 'llm'],
  'cognition': ['llm', 'rag'],
  'monasticism': ['agent', 'llm'],
  'darkforest': ['zero-knowledge-proof', 'blockchain', 'ipfs'],
  'lies': ['zero-knowledge-proof', 'blockchain', 'merkle-tree'],
  'pseudonymity': ['zero-knowledge-proof', 'wallet', 'blockchain'],
  'godprotocol': ['agi', 'alignment', 'constitutional-ai'],
  'plurality': ['agi', 'multimodal-ai', 'embeddings'],
  'algorithms': ['alignment', 'constitutional-ai', 'rlhf'],
  'substrate': ['ipfs', 'webassembly', 'edge-computing'],
  'mesh': ['defi', 'dao', 'ipfs', 'blockchain'],
  'simulayer': ['agent', 'llm', 'rag'],
  'paradox': ['agi', 'llm', 'alignment'],
  'singularity': ['agi', 'llm', 'transformer'],
  'instinct': ['agi', 'llm', 'embeddings'],
  'blockchain': ['blockchain', 'smart-contract', 'defi', 'consensus-mechanism'],
  'twilight': ['agent', 'llm', 'dao'],
  'sensory': ['multimodal-ai', 'agent', 'embeddings'],
  'liminal': ['agi', 'alignment'],
  'hustle': ['agent', 'dao'],
  'agentcommerce': ['agent', 'llm', 'api'],
  'agenticweb': ['agent', 'llm', 'rag', 'api'],
  'yc': ['agent', 'llm', 'api'],
  'agentstack': ['agent', 'llm', 'api', 'edge-computing'],
  'ai-detector': ['llm', 'fine-tuning', 'transformer', 'hallucination'],
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
  const files = fs.readdirSync(essaysDirectory).filter(file => file.endsWith('.mdx'));
  return files.map(file => ({
    slug: file.replace(/\.mdx$/, ''),
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
      authors: ['https://veda.ng'],
      section: 'Technology',
      ...(essay.frontmatter.keywords && { tags: essay.frontmatter.keywords }),
      images: [{ url: `/${slug}/opengraph-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: essay.frontmatter.title,
      description: essay.frontmatter.summary,
      images: [`/${slug}/opengraph-image.png`],
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
      { '@type': 'ListItem', position: 2, name: 'Essays', item: 'https://veda.ng/essays' },
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
        { name: "Essays", url: "https://veda.ng/essays" },
        { name: essay.frontmatter.title, url: `https://veda.ng/${slug}` },
      ]} />

      {/* ─── Essay Header ─── */}
      <header className="pt-12 md:pt-20 pb-12 md:pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            {essay.frontmatter.title}
          </h1>
          {essay.frontmatter.summary && (
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {essay.frontmatter.summary}
            </p>
          )}
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/profile">
              <img
                src="/images/ved.png"
                alt="Vedang Vatsa"
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
            <div className="flex items-center gap-0 text-sm">
              <Link href="/profile" className="font-medium text-foreground hover:text-primary transition-colors">Vedang Vatsa</Link>
              <div className="flex items-center text-muted-foreground ml-3">
                {essay.frontmatter.date && (
                  <span>{new Date(essay.frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                )}
                <span className="mx-2">|</span>
                <span>{readingTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Essay Body ─── */}
      <div className="pb-10 md:pb-14">
        <article className="notion-article prose prose-lg prose-neutral max-w-4xl mx-auto">
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
              CompetitiveField,
              WebEvolutionTimeline,
              ProtocolStackDiagram,
              SecurityThreatMatrix,
              AgentVsChatbot,
              InfrastructureOverview,
              ScarcitySpectrum,
              MaterialConstraints,
              PlatformConcentration,
              RealityCheckGrid,
              DualEconomyFramework,
              AIJobExposure,
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
              EnterpriseAdoption,
              CoaseDisruption,
              BlockchainSnapshot,
              BlockchainPhases,
              L2ScalingOverview,
              StablecoinRegulatory,
              RegulatoryFriction,
              EGovernanceMaturity,
              RegulatoryGrowth,
              RecentBatchComposition,
              AgentLayerTaxonomy,
              YCGeoConcentration,
              AgentForXPattern,
              DefenseHardwareSurge,
              TaglineArchaeology,
              UIComplexityComparison,
              APIAbstractionLayer,
              TextUIAdoption,
              PlatformShiftTimeline,
              StepwiseMaturityModel,
              ROIImpactStats,
              DigitalGovMaturity,
              EResidencyImpact,
              AgenticStateArchitecture,
              ZeroUIMarketMap,
              SaaSPricingShift,
              GUITimeline,
              HardwarePivotGrid,
              CurationFactorsChart,
              MeshOrgComparison,
              EnergyMeshComparison,
              SimulationDomainChart,
              SimCostComparison,
              SimulationGapChart,
              SensoryBandwidthChart,
              HapticGenerationsChart,
              SpatialComputingAdoption,
              BCIMarketChart,
              SensoryStackTimeline,
              PresenceThresholdChart,
              SensoryStackTable,
              GodProtocolComparison,
              TTPEvolutionTimeline,
              PrivacyTechStack,
              TTPMarketScale,
              DistributedArchitectureChart,
              AlignmentFrameworkChart,
              TrustPrimitivesComparison,
              DeFiSecurityChart,
              TrustStackArchitecture,
              TrustComparisonChart,
              DigitalIdentityTimeline,
              TrustApplicationDomains,
              IdentitySpectrumChart,
              PseudonymousSuccessCases,
              ReputationInfraChart,
              ParticipationExpansionChart,
              DecentralizedIdentityMarket,
              GovernanceEffectivenessChart,
              DAOVoterParticipation,
              VotingMechanismChart,
              GovernanceStackChart,
              DataSourceDisruption,
              MethodologicalEvolution,
              PolarizationFindings,
              ObserverEffectChart,
              MonasteryPrincipleChart,
              AttentionSpanDecline,
              InterruptionCostChart,
              RetreatMovementsTimeline,
              SilenceEconomyChart,
              PlaybookHeroCard,
              AgentToolsMap,
              AutomationROIChart,
              ContentPipelineFlow,
              OutreachPipeline,
              AIMaturityLevels,
              ImplementationTimeline,
              NurtureSequence,
              ImplementationChecklist,
              SocialListeningMap,
              SupportTierChart,
              DashboardMetricsMap,
              UseCaseCatalog,
              StateOfAiKeywordsChart,
              StateOfAiBigramsChart,
              StateOfAiTimeline,
              StateOfAiNgramAnalyzer,
              StateOfAiMomentum,
              StateOfAiGeography,
              StateOfAiCitations,
              StateOfWeb3KeywordsChart,
              StateOfWeb3BigramsChart,
              StateOfWeb3Timeline,
              StateOfWeb3NgramAnalyzer,
              StateOfWeb3ConvergenceMatrix,
              StateOfWeb3Momentum,
              StateOfWeb3Citations,
              VCValuationExpansionChart,
              VCGiniConcentrationChart,
              VCDeathValleyTimeline,
              VCSectorSemanticAnalysis,
              VCStrategicFrameworkDiagram,
              VCEquationBoxSVG,
              VCBarbellSystemVisual,
              VCBarbellVectorDiagram,
              SecurityConsolidation,
              ComputeValuationTable,
              AgentProductValuations,
              MarketplaceComposition,
              TopInvestorsTable,
              AIDetectorFeatureComparison,
              ResearchPaper,
              img: (props: any) => (
                <ZoomableImage
                  src={props.src}
                  alt={props.alt || 'Blog post illustration'}
                  className="rounded-lg shadow-sm border border-border/30 mx-auto block"
                />
              ),
            }}
          />
        </article>

        <div className="mt-16">
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

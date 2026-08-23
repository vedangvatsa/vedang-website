

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AsSeenIn } from '@/components/as-seen-in';
import { Metadata } from 'next';
import { pageMetadata, generateMetadata } from '@/lib/metadata';
import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { CardGrid } from '@/components/card-grid';
import { recentPapers } from '@/components/recent-papers';
import { essays } from '@/lib/essays';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.home.title,
  description: pageMetadata.home.description,
  url: pageMetadata.home.url,
  ogImageAlt: 'Vedang Vatsa - AI & Web3 Innovator, Community Founder',
});

const resources = [
  { title: 'Learn Web3', url: '/web3' },
  { title: 'Learn Agentic Web', url: '/agentic' },
  { title: 'Learn Prompt Engineering', url: '/prompt' },
  { title: 'Learn Vibe Coding', url: '/vibecoding' },
  { title: 'Learn MCP Development', url: '/mcp' },
  { title: 'Learn AI Automation', url: '/automation' },
  { title: 'LinkedIn Translator', url: '/lit' },
  { title: 'Swarm Prediction', url: '/swarm-prediction' },
  { title: 'AI Discovery Standards', url: '/aistandards' },
  { title: 'Website Checklist', url: '/sitecheck' },
  { title: 'AI Reports Library', url: '/ailib' },
  { title: 'Web3 Reports Library', url: '/web3lib' },
  { title: 'Web3 & AI Glossary', url: '/glossary' },
  { title: 'Health Protocols', url: '/health-protocols' },
];


export default function Home() {
  const recentEssays = essays.slice(0, 12).map(e => ({
    title: e.title,
    url: e.url,
    date: e.date,
  }));

  return (
    <PageLayout>
      <PageHero
        title="Vedang Vatsa FRSA"
        showAvatar
        subtitle={
          <>
            Founder: <Link href="https://hashtagweb3.com?utm_source=veda.ng&utm_medium=website&utm_campaign=homepage" className="underline hover:text-foreground">Hashtag Web3</Link> and <Link href="https://cvin.bio?utm_source=veda.ng&utm_medium=website&utm_campaign=homepage" className="underline hover:text-foreground">CVinBio</Link>
            <span className="mx-2 text-muted-foreground">|</span>
            <Link href="/about" className="text-primary hover:text-primary/80 transition-colors">Profile →</Link>
          </>
        }
      />

      <CardGrid
        id="papers"
        title="Recent Papers"
        items={recentPapers.map(p => ({ ...p, external: true }))}
        cta={{ label: 'More on Google Scholar', url: 'https://scholar.google.com/citations?user=aW2dd0IAAAAJ&hl=en', external: true }}
      />

      <CardGrid
        id="essays"
        title="Recent Essays"
        items={recentEssays}
        cta={{ label: 'View all essays', url: '/essays' }}
      />

      <AsSeenIn />

      <section className="py-8 text-center">
        <div className="flex justify-center">
          <Button variant="outline" asChild size="lg" className="w-full md:max-w-sm">
            <Link href="/media">Speaking Engagements & Media Mentions</Link>
          </Button>
        </div>
      </section>

      {/* Semantic server-rendered content for crawlers & AI agents (invisible in visual UI) */}
      <section className="sr-only" aria-label="About Vedang Vatsa and Hashtag Web3 Research Hub">
        <h2>Hashtag Web3 Research and Publications Overview</h2>
        <p>
          veda.ng is the official research hub and personal publication platform of Vedang Vatsa (FRSA), founder of Hashtag Web3, a global network of over 120,000 Web3 and AI professionals, and CVinBio.
        </p>
        
        <h3>Artificial Intelligence, LLMs, and Autonomous Agent Systems</h3>
        <p>
          Explore in-depth technical essays on autonomous AI agents, Model Context Protocol (MCP), agent-to-agent negotiation, prompt engineering patterns, vibe coding, and AI governance frameworks.
        </p>
        
        <h3>Web3 Infrastructure and Decentralized Protocols</h3>
        <p>
          Comprehensive analysis of blockchain scalability, cryptographic primitives, smart contract design, decentralized finance mechanisms, and token engineering systems.
        </p>

        <h3>Veda Developer Resources, APIs, and Machine Interfaces</h3>
        <p>
          Programmatic access is open and keyless. Integrate with our developer tools:
        </p>
        <ul>
          <li><Link href="/developers">Veda Developer Resources & Documentation</Link></li>
          <li><Link href="/docs">Veda API Documentation (/docs)</Link></li>
          <li><Link href="/openapi.json">Veda OpenAPI Specification (/openapi.json)</Link></li>
          <li><Link href="/.well-known/mcp">Veda MCP Server (Model Context Protocol over Streamable HTTP)</Link></li>
          <li><a href="https://pypi.org/project/vedang-cli/" rel="package sdk">Veda Python SDK & CLI: vedang-cli on PyPI</a></li>
          <li><Link href="/auth.md">Veda Authentication & Security Specification</Link></li>
          <li><Link href="/developers#webhooks">Veda Webhooks & Event Streaming</Link></li>
          <li><Link href="/api">Veda Public REST API Directory (/api)</Link></li>
          <li><Link href="/api/v1/reports/search">Veda Public REST API v1 (Search 233k+ papers)</Link></li>
          <li><Link href="/api/v1/essays">Veda Essays Catalog REST API</Link></li>
          <li><Link href="/api/v1/glossary">Veda Glossary REST API</Link></li>
          <li><Link href="/llms.txt">Veda LLMs Structured Content Index</Link></li>
        </ul>

        {/* WebMCP In-Page Tools (W3C Draft Standard) */}
        <form
          {...({
            toolname: 'search_reports',
            tooldescription: 'Search 233,000+ indexed academic papers in AI and Web3 on veda.ng',
          } as Record<string, string>)}
          action="/api/v1/reports/search"
          method="GET"
        >
          <input name="q" placeholder="Keywords" />
          <button type="submit">Search Papers</button>
        </form>
        <form
          {...({
            toolname: 'search_essays',
            tooldescription: 'Search 50+ long-form research essays by keyword or tag on veda.ng',
          } as Record<string, string>)}
          action="/api/v1/essays"
          method="GET"
        >
          <input name="tag" placeholder="Topic Tag" />
          <button type="submit">Search Essays</button>
        </form>
      </section>

      <CardGrid
        id="learn"
        title="Resources"
        items={resources}
      />
    </PageLayout>
  );
}

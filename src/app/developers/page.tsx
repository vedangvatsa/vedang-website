import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { Metadata } from 'next';
import Link from 'next/link';
import { CommandBlock } from '@/app/noslop/command-block';
import { generateMetadata } from '@/lib/metadata';
import { developersSummaryLines } from '@/lib/agent-md';

export const metadata: Metadata = generateMetadata({
  title: 'Vedang Developer Resources, API Documentation & MCP Server | Vedang Vatsa (veda.ng)',
  description:
    'Official developer resources, API documentation, Model Context Protocol (MCP) server, Python SDK (vedang-cli), NPM SDK (vedang), and OpenAPI 3.1 specification for Vedang Vatsa (veda.ng).',
  url: '/developers',
  keywords: [
    'Vedang developer resources',
    'Vedang Vatsa developer resources',
    'Vedang API',
    'Vedang Vatsa API',
    'Vedang API documentation',
    'Vedang Vatsa API documentation',
    'Vedang MCP server',
    'Vedang Vatsa MCP server',
    'Vedang developer docs',
    'Vedang Vatsa developer portal',
    'Vedang OpenAPI specification',
    'Vedang Vatsa OpenAPI',
    'Vedang webhooks',
    'Vedang authentication',
    'Vedang SDK',
    'Vedang Vatsa SDK',
    'veda.ng API',
    'veda.ng MCP server',
    'veda.ng developer docs',
    'Hashtag Web3 developer resources',
    'AI research API',
    'OpenAlex search API',
  ],
});

const developersSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Vedang Developer Resources, API Documentation & MCP Server',
  name: 'Vedang Developer Resources',
  alternateName: [
    'Vedang Vatsa Developer Resources',
    'Vedang Vatsa API Documentation',
    'Vedang Vatsa Developer Portal',
    'Vedang Vatsa MCP Server',
    'Vedang API Documentation',
    'Vedang Developer Portal',
    'Vedang MCP Server',
    'Vedang OpenAPI Specification',
    'veda.ng Developer Resources',
    'Vedang SDK Packages',
  ],
  url: 'https://veda.ng/developers',
  description:
    'Official developer and machine interfaces for Vedang Vatsa (veda.ng): public report search API, MCP server over Streamable HTTP, OpenAPI specification, Python SDK (vedang-cli), NPM SDK (vedang), RSS feed, sitemap, and agent discovery files.',
  inLanguage: 'en-US',
  author: {
    '@type': 'Person',
    name: 'Vedang Vatsa',
    url: 'https://veda.ng/about',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Vedang Vatsa',
    alternateName: ['veda.ng', 'Vedang', 'CVinBio', 'Hashtag Web3'],
    url: 'https://veda.ng',
    sameAs: [
      'https://cvin.bio',
      'https://hashtagweb3.com',
      'https://github.com/vedangvatsa/vedang-website',
      'https://pypi.org/project/vedang-cli/',
      'https://www.npmjs.com/package/vedang',
    ],
  },
};

const mcpExample = `curl -X POST https://veda.ng/.well-known/mcp \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize",
       "params":{"protocolVersion":"2025-06-18","capabilities":{},
                 "clientInfo":{"name":"my-client","version":"1.0"}}}'`;

const markdownExample = `curl -H "Accept: text/markdown" https://veda.ng/agentstack`;

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-muted px-4 py-3 text-xs font-mono leading-relaxed">
      {children}
    </pre>
  );
}

import { BreadcrumbSchema } from '@/components/breadcrumb-schema';

export default function DevelopersPage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(developersSchema) }}
      />
      <BreadcrumbSchema items={[{ name: "Developers", url: "https://veda.ng/developers" }]} />

      {/* Semantic definition block for AI engines */}
      <div className="sr-only">
        <h2>What are Vedang Developer Resources?</h2>
        <p>
          Vedang Developer Resources provide keyless, open-access machine interfaces, REST endpoints, Model Context Protocol (MCP) servers, and OpenAPI specifications to programmatically query 233,000+ academic papers, essays, and glossary definitions on veda.ng by Vedang Vatsa.
        </p>
      </div>

      <PageHero
        title="Vedang Developer Resources"
        subtitle="Official machine and developer interfaces for Vedang Vatsa (veda.ng): public research search API, Model Context Protocol (MCP) server, OpenAPI 3.1 specification, Python SDK, syndication feeds, and agent discovery manifests. Keyless and open-access."
      />

      <article className="pb-16 text-sm md:text-base">
        <Section title="Vedang Quick Index & Predictable Endpoints">
          <ul className="space-y-1.5 text-muted-foreground">
            {developersSummaryLines().map((line) => (
              <li key={line} className="break-words">{line}</li>
            ))}
          </ul>
        </Section>

        <Section id="api" title="Vedang Report Search API & REST Endpoints">
          <p className="text-muted-foreground mb-3">
            Search 233,000+ indexed academic papers across the AI and Web3 corpora, backed by OpenAlex and sorted by
            citations. Results are cached for one hour.
          </p>
          <Code>{`GET /api/reports/search?q=stablecoin+regulation&corpus=ai&page=1&per_page=20`}</Code>
          <p className="text-muted-foreground mt-3 mb-3">
            Parameters: <code className="font-mono text-xs">q</code> (required, min 2 chars),{' '}
            <code className="font-mono text-xs">corpus</code> (<code className="font-mono text-xs">ai</code> or{' '}
            <code className="font-mono text-xs">web3</code>), <code className="font-mono text-xs">page</code>,{' '}
            <code className="font-mono text-xs">per_page</code> (max 200), <code className="font-mono text-xs">cursor</code> (for cursor pagination). The full schema lives in the{' '}
            <Link href="/openapi.json" className="underline underline-offset-4 hover:text-foreground">Vedang OpenAPI 3.1 Specification</Link>.
          </p>
        </Section>

        <Section id="mcp" title="Vedang Model Context Protocol (MCP) Servers">
          <p className="text-muted-foreground mb-3">
            Vedang runs dual, production-ready MCP servers over Streamable HTTP (JSON-RPC 2.0) with zero authentication required:
          </p>
          <div className="space-y-4 mb-4">
            <div className="rounded-lg border border-border p-4 bg-card">
              <h3 className="font-semibold text-sm mb-1">1. Vedang Product MCP Server (Action & Research)</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Endpoint: <code className="font-mono text-xs text-foreground">https://veda.ng/.well-known/mcp</code> (also reachable at <code className="font-mono text-xs">/api/mcp</code>)
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground list-disc list-inside">
                <li><code className="font-mono">search_reports</code> - Query 233,000+ indexed academic papers via OpenAlex</li>
                <li><code className="font-mono">search_essays</code> - Find long-form technical research essays</li>
                <li><code className="font-mono">get_essay</code> - Fetch full Markdown text of any essay</li>
                <li><code className="font-mono">search_glossary</code> - Search 100+ AI and Web3 glossary terms</li>
                <li><code className="font-mono">get_glossary_term</code> - Fetch definition for any glossary term</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border p-4 bg-card">
              <h3 className="font-semibold text-sm mb-1">2. Vedang Documentation MCP Server (Knowledge & Courses)</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Endpoint: <code className="font-mono text-xs text-foreground">https://veda.ng/.well-known/mcp/docs</code> (also reachable at <code className="font-mono text-xs">/api/mcp/docs</code>)
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground list-disc list-inside">
                <li><code className="font-mono">get_api_documentation</code> - Fetch complete developer documentation</li>
                <li><code className="font-mono">get_openapi_specification</code> - Fetch full OpenAPI 3.1 specification</li>
                <li><code className="font-mono">get_auth_guide</code> - Keyless access and security guidelines</li>
                <li><code className="font-mono">search_documentation</code> - Search developer docs, guides, and courses</li>
                <li><code className="font-mono">get_course_curriculum</code> - Full curricula for Prompt Engineering, Web3, MCP, Vibe Coding, and Agentic Web</li>
              </ul>
            </div>
          </div>
          <CommandBlock command={mcpExample} />
        </Section>

        <Section id="openapi" title="Vedang OpenAPI 3.1 Specification">
          <p className="text-muted-foreground mb-3">
            The machine-readable OpenAPI specification is published at{' '}
            <Link href="/openapi.json" className="underline underline-offset-4 hover:text-foreground">/openapi.json</Link>{' '}
            (with predictable aliases at <code className="font-mono text-xs">/openapi</code>, <code className="font-mono text-xs">/swagger.json</code>, and <code className="font-mono text-xs">/docs.json</code>).
            It documents 100% typed response schemas, RFC rate-limit headers, cursor pagination, batch execution, and async polling.
          </p>
        </Section>

        <Section id="sdk" title="Vedang Multi-Language SDK Packages & Tooling">
          <p className="text-muted-foreground mb-3">
            Programmatic SDK packages and CLI tools for Python, TypeScript/JavaScript, and Go:
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Python (PyPI)</p>
              <CommandBlock command="pip install vedang-cli" />
              <p className="text-xs text-muted-foreground mt-1.5">
                PyPI:{' '}
                <a
                  href="https://pypi.org/project/vedang-cli/"
                  target="_blank"
                  rel="package noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground font-medium"
                >
                  pypi.org/project/vedang-cli (vedang-cli)
                </a>
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">TypeScript / JavaScript (NPM)</p>
              <CommandBlock command="npm install vedang" />
              <p className="text-xs text-muted-foreground mt-1.5">
                NPM:{' '}
                <a
                  href="https://www.npmjs.com/package/vedang"
                  target="_blank"
                  rel="package noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground font-medium"
                >
                  npmjs.com/package/vedang (vedang)
                </a>
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">OpenAPI SDK Generator (Any Language)</p>
              <CommandBlock command="npx @openapitools/openapi-generator-cli generate -i https://veda.ng/openapi.json -g typescript-fetch -o ./sdk" />
            </div>
          </div>
          <p className="text-muted-foreground mt-4 text-xs">
            Open-source repository:{' '}
            <a
              href="https://github.com/vedangvatsa/vedang-website"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              github.com/vedangvatsa/vedang-website
            </a>
          </p>
        </Section>

        <Section id="auth" title="Vedang Authentication & Security Guide">
          <p className="text-muted-foreground mb-3">
            All public reading and search APIs on veda.ng are keyless and require no API token. The complete WorkOS-format authentication specification is documented at{' '}
            <Link href="/auth.md" className="underline underline-offset-4 hover:text-foreground">/auth.md</Link>.
          </p>
        </Section>

        <Section id="webhooks" title="Vedang Webhooks & Event Streaming">
          <p className="text-muted-foreground mb-3">
            Live updates and event subscriptions:
          </p>
          <ul className="space-y-1.5 text-muted-foreground mb-3">
            <li><strong>RSS Syndication:</strong> Instant updates on new publications via <Link href="/feed.xml" className="underline underline-offset-4 hover:text-foreground">/feed.xml</Link>.</li>
            <li><strong>SSE Live Streaming:</strong> Real-time streaming search responses supported on <code className="font-mono text-xs">POST /ask</code> with <code className="font-mono text-xs">prefer.streaming: true</code>.</li>
            <li><strong>Agent Updates:</strong> Changes to tool capabilities are broadcast in <Link href="/.well-known/agents.json" className="underline underline-offset-4 hover:text-foreground">/.well-known/agents.json</Link>.</li>
          </ul>
        </Section>

        <Section title="Vedang Markdown Content Negotiation">
          <p className="text-muted-foreground mb-3">
            Every essay, every glossary term, and key pages serve Markdown to machines. Send an Accept header instead of
            parsing HTML:
          </p>
          <CommandBlock command={markdownExample} />
        </Section>

        <Section title="Vedang Discovery Feeds & Machine Manifests">
          <ul className="space-y-1.5 text-muted-foreground">
            <li><Link href="/feed.xml" className="underline underline-offset-4 hover:text-foreground">feed.xml</Link> - RSS feed of new essays</li>
            <li><Link href="/sitemap.xml" className="underline underline-offset-4 hover:text-foreground">sitemap.xml</Link> - every public URL</li>
            <li><Link href="/llms.txt" className="underline underline-offset-4 hover:text-foreground">llms.txt</Link> - structured index for LLMs (<Link href="/llms-full.txt" className="underline underline-offset-4 hover:text-foreground">full-text version</Link>)</li>
            <li><Link href="/.well-known/agents.json" className="underline underline-offset-4 hover:text-foreground">agents.json</Link> - when-to-use guidance and capabilities</li>
            <li><Link href="/.well-known/ai-catalog.json" className="underline underline-offset-4 hover:text-foreground">ai-catalog.json</Link> - AI catalog manifest</li>
            <li><Link href="/ai.txt" className="underline underline-offset-4 hover:text-foreground">ai.txt</Link> - training, indexing, and citation permissions (allowed)</li>
          </ul>
        </Section>
      </article>
    </PageLayout>
  );
}

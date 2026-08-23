import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { Metadata } from 'next';
import Link from 'next/link';
import { CommandBlock } from '@/app/noslop/command-block';
import { generateMetadata } from '@/lib/metadata';
import { developersSummaryLines } from '@/lib/agent-md';

export const metadata: Metadata = generateMetadata({
  title: 'Veda Developer Resources, API Documentation & MCP Server | veda.ng',
  description:
    'Official Veda developer resources and AI agent interfaces: public REST API, Model Context Protocol (MCP) server, Python SDK (vedang-cli), OpenAPI 3.1 specification, and WorkOS auth spec.',
  url: '/developers',
  keywords: [
    'Veda developer resources',
    'Veda API',
    'Veda API documentation',
    'Veda MCP server',
    'Veda developer docs',
    'Veda OpenAPI specification',
    'Veda webhooks',
    'Veda authentication',
    'Veda SDK',
    'veda.ng API',
    'veda.ng MCP server',
    'veda.ng developer docs',
    'Vedang Vatsa API',
    'Hashtag Web3 developer resources',
    'AI research API',
    'OpenAlex search API',
  ],
});

const developersSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Veda Developer Resources, API Documentation & MCP Server',
  name: 'Veda Developer Resources',
  alternateName: [
    'Veda API Documentation',
    'Veda Developer Portal',
    'Veda MCP Server',
    'Veda OpenAPI Specification',
    'veda.ng Developer Resources',
  ],
  url: 'https://veda.ng/developers',
  description:
    'Official developer and machine interfaces for Veda (veda.ng): public report search API, MCP server over Streamable HTTP, OpenAPI specification, Python SDK, RSS feed, sitemap, and agent discovery files.',
  inLanguage: 'en-US',
  author: {
    '@type': 'Person',
    name: 'Vedang Vatsa',
    url: 'https://veda.ng/about',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Hashtag Web3',
    url: 'https://hashtagweb3.com',
    sameAs: [
      'https://linkedin.com/company/hashtagweb3',
      'https://www.linkedin.com/company/hashtagweb3',
      'https://hashtagweb3.com',
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

export default function DevelopersPage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(developersSchema) }}
      />
      <PageHero
        title="Veda Developer Resources"
        subtitle="Official machine and developer interfaces for Veda (veda.ng): public research search API, Model Context Protocol (MCP) server, OpenAPI 3.1 specification, Python SDK, syndication feeds, and agent discovery manifests. Keyless and open-access."
      />

      <article className="pb-16 text-sm md:text-base">
        <Section title="Veda Quick Index & Predictable Endpoints">
          <ul className="space-y-1.5 text-muted-foreground">
            {developersSummaryLines().map((line) => (
              <li key={line} className="break-words">{line}</li>
            ))}
          </ul>
        </Section>

        <Section id="api" title="Veda Report Search API & REST Endpoints">
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
            <Link href="/openapi.json" className="underline underline-offset-4 hover:text-foreground">Veda OpenAPI 3.1 Specification</Link>.
          </p>
        </Section>

        <Section id="mcp" title="Veda MCP Server (Model Context Protocol)">
          <p className="text-muted-foreground mb-3">
            A first-party MCP server runs at <code className="font-mono text-xs">/.well-known/mcp</code> using the
            Streamable HTTP transport with JSON-RPC 2.0. It is stateless, needs no auth, and supports protocol versions
            2025-06-18, 2025-03-26, and 2024-11-05.
          </p>
          <p className="text-muted-foreground mb-3">Exposed tools:</p>
          <ul className="mb-3 space-y-1 text-muted-foreground">
            <li><code className="font-mono text-xs">search_essays</code> - find essays by keyword</li>
            <li><code className="font-mono text-xs">get_essay</code> - full Markdown text of one essay</li>
            <li><code className="font-mono text-xs">search_glossary</code> - search 100+ term glossary</li>
            <li><code className="font-mono text-xs">get_glossary_term</code> - full definition of one term</li>
            <li><code className="font-mono text-xs">search_reports</code> - cited academic literature via OpenAlex</li>
          </ul>
          <CommandBlock command={mcpExample} />
        </Section>

        <Section id="openapi" title="Veda OpenAPI 3.1 Specification">
          <p className="text-muted-foreground mb-3">
            The machine-readable OpenAPI specification is published at{' '}
            <Link href="/openapi.json" className="underline underline-offset-4 hover:text-foreground">/openapi.json</Link>{' '}
            (with predictable aliases at <code className="font-mono text-xs">/swagger.json</code> and <code className="font-mono text-xs">/docs.json</code>).
            It documents 100% typed response schemas, RFC rate-limit headers, cursor pagination, batch execution, and async polling.
          </p>
        </Section>

        <Section id="sdk" title="Veda Multi-Language SDK Packages & Tooling">
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
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  pypi.org/project/vedang-cli
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
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  npmjs.com/package/vedang
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

        <Section id="auth" title="Veda Authentication & Security Guide">
          <p className="text-muted-foreground mb-3">
            All public reading and search APIs on veda.ng are keyless and require no API token. The complete WorkOS-format authentication specification is documented at{' '}
            <Link href="/auth.md" className="underline underline-offset-4 hover:text-foreground">/auth.md</Link>.
          </p>
        </Section>

        <Section id="webhooks" title="Veda Webhooks & Event Streaming">
          <p className="text-muted-foreground mb-3">
            Live updates and event subscriptions:
          </p>
          <ul className="space-y-1.5 text-muted-foreground mb-3">
            <li><strong>RSS Syndication:</strong> Instant updates on new publications via <Link href="/feed.xml" className="underline underline-offset-4 hover:text-foreground">/feed.xml</Link>.</li>
            <li><strong>SSE Live Streaming:</strong> Real-time streaming search responses supported on <code className="font-mono text-xs">POST /ask</code> with <code className="font-mono text-xs">prefer.streaming: true</code>.</li>
            <li><strong>Agent Updates:</strong> Changes to tool capabilities are broadcast in <Link href="/.well-known/agents.json" className="underline underline-offset-4 hover:text-foreground">/.well-known/agents.json</Link>.</li>
          </ul>
        </Section>

        <Section title="Veda Markdown Content Negotiation">
          <p className="text-muted-foreground mb-3">
            Every essay, every glossary term, and key pages serve Markdown to machines. Send an Accept header instead of
            parsing HTML:
          </p>
          <CommandBlock command={markdownExample} />
        </Section>

        <Section title="Veda Discovery Feeds & Machine Manifests">
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

import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { Metadata } from 'next';
import Link from 'next/link';
import { CommandBlock } from '@/app/noslop/command-block';
import { generateMetadata } from '@/lib/metadata';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';

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

interface QuickEndpoint {
  title: string;
  url: string;
  method: string;
  format: string;
  description: string;
}

const QUICK_ENDPOINTS: QuickEndpoint[] = [
  {
    title: 'Public Report Search API',
    url: '/api/reports/search?q=agents&corpus=ai',
    method: 'GET',
    format: 'JSON',
    description: 'Query 233,000+ indexed academic papers via OpenAlex with cursor pagination.',
  },
  {
    title: 'OpenAPI 3.1 Specification',
    url: '/openapi.json',
    method: 'GET',
    format: 'OpenAPI 3.1',
    description: '100% typed response schemas, RFC rate limits, and parameter docs.',
  },
  {
    title: 'Product MCP Server (JSON-RPC 2.0)',
    url: '/.well-known/mcp',
    method: 'POST',
    format: 'Streamable HTTP',
    description: 'Direct AI agent tools for research papers, essays, glossary, and scanner.',
  },
  {
    title: 'Documentation MCP Server',
    url: '/.well-known/mcp/docs',
    method: 'POST',
    format: 'Streamable HTTP',
    description: 'Agent tools to retrieve documentation, OpenAPI specs, and course curricula.',
  },
  {
    title: 'Agentic Readiness Scanner API',
    url: '/api/v1/scan',
    method: 'POST / GET',
    format: 'JSON',
    description: 'Audit any domain for 61 AI search, MCP, SEO, and agent protocol standards.',
  },
  {
    title: 'IETF API Catalog (RFC 9727)',
    url: '/.well-known/api-catalog',
    method: 'GET',
    format: 'JSON',
    description: 'Standardized machine discovery catalog for all public API endpoints.',
  },
  {
    title: 'RSS Syndication Feed',
    url: '/feed.xml',
    method: 'GET',
    format: 'RSS 2.0 / Atom',
    description: 'Instant notification stream of new research essays and publications.',
  },
  {
    title: 'XML Sitemap',
    url: '/sitemap.xml',
    method: 'GET',
    format: 'XML',
    description: 'Index of all 490+ canonical public URLs with modification timestamps.',
  },
  {
    title: 'LLM Digest Index (llms.txt)',
    url: '/llms.txt',
    method: 'GET',
    format: 'Markdown',
    description: 'Structured index for AI crawlers with links to full-text digest.',
  },
  {
    title: 'Agent Capabilities Manifest',
    url: '/.well-known/agents.json',
    method: 'GET',
    format: 'JSON',
    description: 'Machine-readable agent guidance, tools, and operational boundaries.',
  },
  {
    title: 'Authentication Specification',
    url: '/auth.md',
    method: 'GET',
    format: 'Markdown',
    description: 'Keyless access guidelines and security verification standards.',
  },
];

interface RestRoute {
  method: 'GET' | 'POST';
  path: string;
  href: string;
  summary: string;
  tag: string;
}

const REST_ROUTES: RestRoute[] = [
  { method: 'GET', path: '/api', href: '/api', summary: 'API root directory & service discovery manifest', tag: 'Discovery' },
  { method: 'GET', path: '/api/v1', href: '/api/v1', summary: 'Pinned version 1 stable API root directory', tag: 'Discovery' },
  { method: 'GET', path: '/api/v1/reports/search', href: '/api/v1/reports/search?q=agents&corpus=ai', summary: 'Search 233k+ academic papers with cursor pagination', tag: 'Search' },
  { method: 'GET', path: '/api/v1/essays', href: '/api/v1/essays', summary: 'List all published long-form research essays', tag: 'Essays' },
  { method: 'GET', path: '/api/v1/glossary', href: '/api/v1/glossary', summary: 'List 100+ AI and Web3 glossary definitions', tag: 'Glossary' },
  { method: 'POST', path: '/api/v1/batch', href: '/api/v1/batch', summary: 'Execute up to 20 sub-requests atomically in bulk', tag: 'Batch' },
  { method: 'POST', path: '/api/v1/scan', href: '/api/v1/scan', summary: 'Audit websites across 61 machine-readiness checks', tag: 'Scanner' },
  { method: 'GET', path: '/api/v1/jobs/{jobId}', href: '/api/v1', summary: 'Poll lifecycle and results for async background tasks', tag: 'Jobs' },
];

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-12 scroll-mt-20">
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-muted px-4 py-3 text-xs font-mono leading-relaxed border border-border">
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

      <article className="pb-16 text-sm md:text-base space-y-2">
        {/* ── Section 1: Quick Index & Predictable Endpoints ── */}
        <Section id="quick-index" title="Vedang Quick Index & Predictable Endpoints">
          <p className="text-muted-foreground mb-4 text-xs md:text-sm">
            All endpoints are keyless, unauthenticated, and return structured payloads with standard RFC rate limit headers:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {QUICK_ENDPOINTS.map((ep) => (
              <div
                key={ep.url}
                className="rounded-lg border border-border bg-card p-4 flex flex-col justify-between gap-2 hover:border-foreground/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs text-foreground">{ep.title}</span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                      {ep.method}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{ep.description}</p>
                </div>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                  <Link
                    href={ep.url}
                    className="font-mono text-xs text-primary underline underline-offset-4 hover:text-primary/80 font-medium truncate max-w-[80%]"
                    title={`Open ${ep.url}`}
                  >
                    {ep.url}
                  </Link>
                  <span className="text-[11px] font-mono text-muted-foreground">{ep.format}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg border border-border bg-muted/20 text-xs text-muted-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span>
              Tip: Send an HTTP header <code className="font-mono text-foreground font-semibold">Accept: text/markdown</code> on any page to fetch its clean Markdown twin.
            </span>
            <Link
              href="mailto:vatsvedang@gmail.com"
              className="text-primary underline underline-offset-4 hover:text-foreground font-medium shrink-0"
            >
              Developer Support →
            </Link>
          </div>
        </Section>

        {/* ── Section 2: Report Search API & REST Endpoints ── */}
        <Section id="api" title="Vedang Report Search API & REST Endpoints">
          <p className="text-muted-foreground mb-3">
            Search 233,000+ indexed academic papers across the AI and Web3 corpora, backed by OpenAlex and sorted by
            citations. Results are cached for one hour.
          </p>
          <div className="space-y-2 mb-3">
            <Code>{`GET /api/reports/search?q=stablecoin+regulation&corpus=ai&page=1&per_page=20`}</Code>
            <div className="text-right">
              <Link
                href="/api/reports/search?q=stablecoin+regulation&corpus=ai&page=1&per_page=20"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary underline underline-offset-4 hover:text-foreground font-medium"
              >
                Run query in browser ↗
              </Link>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            Parameters: <code className="font-mono text-xs">q</code> (required, min 2 chars),{' '}
            <code className="font-mono text-xs">corpus</code> (<code className="font-mono text-xs">ai</code> or{' '}
            <code className="font-mono text-xs">web3</code>), <code className="font-mono text-xs">page</code>,{' '}
            <code className="font-mono text-xs">per_page</code> (max 200), <code className="font-mono text-xs">cursor</code> (for cursor pagination). The full schema lives in the{' '}
            <Link href="/openapi.json" className="text-primary underline underline-offset-4 hover:text-foreground font-medium">
              Vedang OpenAPI 3.1 Specification
            </Link>.
          </p>

          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <div className="px-4 py-2.5 bg-muted/40 border-b border-border text-xs font-semibold font-mono uppercase tracking-wider text-muted-foreground">
              Core REST Endpoints
            </div>
            <div className="divide-y divide-border text-xs">
              {REST_ROUTES.map((route) => (
                <div key={route.path} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-muted/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-foreground border border-border">
                      {route.method}
                    </span>
                    <Link
                      href={route.href}
                      className="font-mono text-xs text-primary underline underline-offset-4 hover:text-primary/80 font-medium"
                    >
                      {route.path}
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="text-[11px] truncate">{route.summary}</span>
                    <span className="hidden sm:inline-block font-mono text-[10px] uppercase text-muted-foreground px-1.5 py-0.5 rounded bg-muted/60">
                      {route.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Section 3: Model Context Protocol (MCP) Servers ── */}
        <Section id="mcp" title="Vedang Model Context Protocol (MCP) Servers">
          <p className="text-muted-foreground mb-4">
            Vedang runs dual, production-ready MCP servers over Streamable HTTP (JSON-RPC 2.0) with zero authentication required:
          </p>
          <div className="space-y-4 mb-4">
            <div className="rounded-lg border border-border p-4 bg-card space-y-3">
              <div>
                <h3 className="font-semibold text-sm mb-1">1. Vedang Product MCP Server (Action & Research)</h3>
                <p className="text-xs text-muted-foreground">
                  Endpoint:{' '}
                  <Link href="/.well-known/mcp" className="font-mono text-xs text-primary underline underline-offset-4 hover:text-foreground font-medium">
                    https://veda.ng/.well-known/mcp
                  </Link>{' '}
                  (also reachable at{' '}
                  <Link href="/api/mcp" className="font-mono text-xs text-primary underline underline-offset-4 hover:text-foreground">
                    /api/mcp
                  </Link>)
                </p>
              </div>
              <ul className="text-xs space-y-1.5 text-muted-foreground">
                <li className="flex items-start gap-1.5">
                  <code className="font-mono text-foreground font-semibold">search_reports</code>
                  <span>— Query 233,000+ indexed academic papers via <Link href="/api/v1/reports/search" className="underline underline-offset-4 hover:text-foreground">OpenAlex Search</Link></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <code className="font-mono text-foreground font-semibold">search_essays</code>
                  <span>— Find long-form technical research in the <Link href="/essays" className="underline underline-offset-4 hover:text-foreground">Essays Library</Link></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <code className="font-mono text-foreground font-semibold">get_essay</code>
                  <span>— Fetch full Markdown text of any published essay</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <code className="font-mono text-foreground font-semibold">search_glossary</code>
                  <span>— Search 100+ AI and Web3 terms in the <Link href="/glossary" className="underline underline-offset-4 hover:text-foreground">Glossary Index</Link></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <code className="font-mono text-foreground font-semibold">get_glossary_term</code>
                  <span>— Fetch comprehensive definition and category metadata for any term</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <code className="font-mono text-foreground font-semibold">scan_agent_readiness</code>
                  <span>— Audit external websites on the <Link href="/scan" className="underline underline-offset-4 hover:text-foreground">Agentic Readiness Scanner</Link></span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-border p-4 bg-card space-y-3">
              <div>
                <h3 className="font-semibold text-sm mb-1">2. Vedang Documentation MCP Server (Knowledge & Courses)</h3>
                <p className="text-xs text-muted-foreground">
                  Endpoint:{' '}
                  <Link href="/.well-known/mcp/docs" className="font-mono text-xs text-primary underline underline-offset-4 hover:text-foreground font-medium">
                    https://veda.ng/.well-known/mcp/docs
                  </Link>{' '}
                  (also reachable at{' '}
                  <Link href="/api/mcp/docs" className="font-mono text-xs text-primary underline underline-offset-4 hover:text-foreground">
                    /api/mcp/docs
                  </Link>) • Multi-server manifest:{' '}
                  <Link href="/.well-known/mcp.json" className="font-mono text-xs text-primary underline underline-offset-4 hover:text-foreground">
                    /.well-known/mcp.json
                  </Link>
                </p>
              </div>
              <ul className="text-xs space-y-1.5 text-muted-foreground">
                <li className="flex items-start gap-1.5">
                  <code className="font-mono text-foreground font-semibold">get_api_documentation</code>
                  <span>— Fetch complete developer documentation (<Link href="/developers" className="underline underline-offset-4 hover:text-foreground">/developers</Link> & <Link href="/docs" className="underline underline-offset-4 hover:text-foreground">/docs</Link>)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <code className="font-mono text-foreground font-semibold">get_openapi_specification</code>
                  <span>— Fetch full OpenAPI 3.1 schema (<Link href="/openapi.json" className="underline underline-offset-4 hover:text-foreground">/openapi.json</Link>)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <code className="font-mono text-foreground font-semibold">get_auth_guide</code>
                  <span>— Keyless access guidelines (<Link href="/auth.md" className="underline underline-offset-4 hover:text-foreground">/auth.md</Link>)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <code className="font-mono text-foreground font-semibold">get_course_curriculum</code>
                  <span>
                    — Full curricula for{' '}
                    <Link href="/prompt" className="underline underline-offset-4 hover:text-foreground">Prompt Engineering</Link>,{' '}
                    <Link href="/web3" className="underline underline-offset-4 hover:text-foreground">Web3</Link>,{' '}
                    <Link href="/mcp" className="underline underline-offset-4 hover:text-foreground">MCP</Link>,{' '}
                    <Link href="/vibecoding" className="underline underline-offset-4 hover:text-foreground">Vibe Coding</Link>,{' '}
                    <Link href="/agentic" className="underline underline-offset-4 hover:text-foreground">Agentic Web</Link>, and{' '}
                    <Link href="/automation" className="underline underline-offset-4 hover:text-foreground">AI Automation</Link>
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <CommandBlock command={mcpExample} />
        </Section>

        {/* ── Section 4: OpenAPI 3.1 Specification ── */}
        <Section id="openapi" title="Vedang OpenAPI 3.1 Specification">
          <p className="text-muted-foreground mb-3">
            The machine-readable OpenAPI specification documents 100% typed response schemas, RFC rate-limit headers, cursor pagination, batch execution, and async polling. It is accessible across multiple predictable URLs:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs font-mono">
            {[
              { label: 'Canonical Spec', href: '/openapi.json' },
              { label: 'Alias /openapi', href: '/openapi' },
              { label: 'Alias /api-docs', href: '/api-docs' },
              { label: 'Alias /swagger.json', href: '/swagger.json' },
              { label: 'Alias /docs.json', href: '/docs.json' },
            ].map((spec) => (
              <Link
                key={spec.href}
                href={spec.href}
                className="p-2.5 rounded border border-border bg-card text-center text-primary underline underline-offset-4 hover:border-foreground/30 font-medium transition-colors truncate"
              >
                {spec.href}
              </Link>
            ))}
          </div>
        </Section>

        {/* ── Section 5: Multi-Language SDK Packages & Tooling ── */}
        <Section id="sdk" title="Vedang Multi-Language SDK Packages & Tooling">
          <p className="text-muted-foreground mb-4">
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
                  className="text-primary underline underline-offset-4 hover:text-foreground font-medium"
                >
                  pypi.org/project/vedang-cli (vedang-cli) ↗
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
                  className="text-primary underline underline-offset-4 hover:text-foreground font-medium"
                >
                  npmjs.com/package/vedang (vedang) ↗
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
              className="text-primary underline underline-offset-4 hover:text-foreground font-medium"
            >
              github.com/vedangvatsa/vedang-website ↗
            </a>
          </p>
        </Section>

        {/* ── Section 6: Authentication & Security Guide ── */}
        <Section id="auth" title="Vedang Authentication & Security Guide">
          <p className="text-muted-foreground mb-3">
            All public reading and search APIs on veda.ng are keyless and require no API token. The complete WorkOS-format authentication specification is documented at{' '}
            <Link href="/auth.md" className="text-primary underline underline-offset-4 hover:text-foreground font-medium">
              /auth.md
            </Link>{' '}
            (interactive page at{' '}
            <Link href="/auth" className="text-primary underline underline-offset-4 hover:text-foreground">
              /auth
            </Link>). Security vulnerability disclosure instructions are published at{' '}
            <Link href="/.well-known/security.txt" className="text-primary underline underline-offset-4 hover:text-foreground font-mono">
              /.well-known/security.txt
            </Link>.
          </p>
        </Section>

        {/* ── Section 7: Webhooks & Event Streaming ── */}
        <Section id="webhooks" title="Vedang Webhooks & Event Streaming">
          <p className="text-muted-foreground mb-3">
            Live updates and event subscriptions:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-3 text-xs md:text-sm">
            <li className="flex items-start gap-2">
              <span className="font-semibold text-foreground shrink-0">RSS Syndication:</span>
              <span>Instant updates on new publications via <Link href="/feed.xml" className="text-primary underline underline-offset-4 hover:text-foreground font-mono">/feed.xml</Link>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-foreground shrink-0">SSE Live Streaming:</span>
              <span>Real-time streaming search responses supported on <Link href="/ask" className="text-primary underline underline-offset-4 hover:text-foreground font-mono">POST /ask</Link> with <code className="font-mono text-xs">prefer.streaming: true</code>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-foreground shrink-0">Agent Updates:</span>
              <span>Changes to tool capabilities are broadcast in <Link href="/.well-known/agents.json" className="text-primary underline underline-offset-4 hover:text-foreground font-mono">/.well-known/agents.json</Link>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-foreground shrink-0">Webhooks Directory:</span>
              <span>Full event subscription catalog available at <Link href="/webhooks" className="text-primary underline underline-offset-4 hover:text-foreground font-mono">/webhooks</Link>.</span>
            </li>
          </ul>
        </Section>

        {/* ── Section 8: Markdown Content Negotiation ── */}
        <Section id="markdown" title="Vedang Markdown Content Negotiation">
          <p className="text-muted-foreground mb-3">
            Every essay, every glossary term, and key pages serve clean Markdown twins to autonomous machines. Send an <code className="font-mono text-xs">Accept: text/markdown</code> header instead of parsing heavy HTML:
          </p>
          <CommandBlock command={markdownExample} />
          <p className="text-xs text-muted-foreground mt-3">
            Explore live Markdown twin endpoints:{' '}
            <Link href="/agentstack" className="text-primary underline underline-offset-4 hover:text-foreground font-mono">
              /agentstack
            </Link>{' '}
            (<Link href="/md/agentstack" className="text-muted-foreground underline underline-offset-4 hover:text-foreground font-mono">.md</Link>),{' '}
            <Link href="/about" className="text-primary underline underline-offset-4 hover:text-foreground font-mono">
              /about
            </Link>{' '}
            (<Link href="/about.md" className="text-muted-foreground underline underline-offset-4 hover:text-foreground font-mono">.md</Link>),{' '}
            <Link href="/glossary/mcp" className="text-primary underline underline-offset-4 hover:text-foreground font-mono">
              /glossary/mcp
            </Link>{' '}
            (<Link href="/glossary/mcp.md" className="text-muted-foreground underline underline-offset-4 hover:text-foreground font-mono">.md</Link>), and{' '}
            <Link href="/developers" className="text-primary underline underline-offset-4 hover:text-foreground font-mono">
              /developers
            </Link>{' '}
            (<Link href="/developers.md" className="text-muted-foreground underline underline-offset-4 hover:text-foreground font-mono">.md</Link>).
          </p>
        </Section>

        {/* ── Section 9: Discovery Feeds & Machine Manifests ── */}
        <Section id="manifests" title="Vedang Discovery Feeds & Machine Manifests">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
            {[
              { name: 'feed.xml', href: '/feed.xml', desc: 'RSS feed of new essays' },
              { name: 'sitemap.xml', href: '/sitemap.xml', desc: 'Index of all canonical URLs' },
              { name: 'llms.txt', href: '/llms.txt', desc: 'Structured index for LLM crawlers' },
              { name: 'llms-full.txt', href: '/llms-full.txt', desc: 'Full-text single file documentation digest' },
              { name: 'agents.json', href: '/.well-known/agents.json', desc: 'Agent capabilities & guidance manifest' },
              { name: 'ai-catalog.json', href: '/.well-known/ai-catalog.json', desc: 'AI catalog discovery manifest' },
              { name: 'api-catalog', href: '/.well-known/api-catalog', desc: 'IETF RFC 9727 API Catalog' },
              { name: 'ard.json', href: '/.well-known/ard.json', desc: 'Agent Readiness Directory v0.91' },
              { name: 'mcp.json', href: '/.well-known/mcp.json', desc: 'Multi-server MCP manifest' },
              { name: 'security.txt', href: '/.well-known/security.txt', desc: 'RFC 9116 security contacts' },
              { name: 'ai.txt', href: '/ai.txt', desc: 'AI crawler & citation permissions' },
              { name: 'ai.json', href: '/ai.json', desc: 'Structured AI indexing configuration' },
            ].map((manifest) => (
              <Link
                key={manifest.name}
                href={manifest.href}
                className="p-3 rounded-lg border border-border bg-card hover:border-foreground/30 transition-colors flex flex-col justify-between gap-1"
              >
                <div className="font-mono font-semibold text-primary underline underline-offset-4 hover:text-primary/80">
                  {manifest.name}
                </div>
                <div className="text-muted-foreground text-[11px] leading-snug">
                  {manifest.desc}
                </div>
              </Link>
            ))}
          </div>
        </Section>
      </article>
    </PageLayout>
  );
}

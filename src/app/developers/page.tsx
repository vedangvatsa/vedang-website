import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { Metadata } from 'next';
import Link from 'next/link';
import { CommandBlock } from '@/app/noslop/command-block';
import { generateMetadata } from '@/lib/metadata';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { SectionHeader } from '@/components/ui/section-header';
import { JumpNav } from '@/components/ui/jump-nav';
import { ResourceCard } from '@/components/ui/resource-card';

export const metadata: Metadata = generateMetadata({
  title: 'Developer Resources, API Documentation & MCP Server | Vedang Vatsa (veda.ng)',
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
  headline: 'Developer Resources, API Documentation & MCP Server',
  name: 'Developer Resources',
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

const QUICK_ENDPOINTS = [
  {
    title: 'Public Report Search API',
    method: 'GET',
    url: '/api/reports/search?q=agents&corpus=ai',
    format: 'JSON',
    description: 'Query 233,000+ indexed academic papers via OpenAlex with cursor pagination.',
  },
  {
    title: 'OpenAPI 3.1 Specification',
    method: 'GET',
    url: '/openapi.json',
    format: 'OpenAPI 3.1',
    description: '100% typed response schemas, RFC rate limit headers, and parameter documentation.',
  },
  {
    title: 'Product MCP Server (JSON-RPC 2.0)',
    method: 'POST',
    url: '/.well-known/mcp',
    format: 'Streamable HTTP',
    description: 'Direct AI agent tools for research papers, essays, glossary, and scanner.',
  },
  {
    title: 'Documentation MCP Server',
    method: 'POST',
    url: '/.well-known/mcp/docs',
    format: 'Streamable HTTP',
    description: 'Agent tools to retrieve documentation, OpenAPI specs, and course curricula.',
  },
  {
    title: 'Agentic Readiness Scanner API',
    method: 'POST / GET',
    url: '/api/v1/scan',
    format: 'JSON',
    description: 'Audit any domain across 61 machine discovery, MCP, and security checks.',
  },
  {
    title: 'IETF API Catalog (RFC 9727)',
    method: 'GET',
    url: '/.well-known/api-catalog',
    format: 'JSON',
    description: 'Standardized machine discovery catalog for all public API endpoints.',
  },
  {
    title: 'RSS Syndication Feed',
    method: 'GET',
    url: '/feed.xml',
    format: 'RSS 2.0 / Atom',
    description: 'Instant notification stream of new research essays and publications.',
  },
  {
    title: 'XML Sitemap',
    method: 'GET',
    url: '/sitemap.xml',
    format: 'XML',
    description: 'Index of all 490+ canonical public URLs with modification timestamps.',
  },
  {
    title: 'LLM Digest Index (llms.txt)',
    method: 'GET',
    url: '/llms.txt',
    format: 'Markdown',
    description: 'Structured index for AI crawlers with links to full-text digest.',
  },
  {
    title: 'Agent Capabilities Manifest',
    method: 'GET',
    url: '/.well-known/agents.json',
    format: 'JSON',
    description: 'Machine-readable agent guidance, tools, and operational boundaries.',
  },
  {
    title: 'Authentication Specification',
    method: 'GET',
    url: '/auth.md',
    format: 'Markdown',
    description: 'Keyless access guidelines and security verification standards.',
  },
  {
    title: 'Security Vulnerability Disclosure',
    method: 'GET',
    url: '/.well-known/security.txt',
    format: 'RFC 9116',
    description: 'Cryptographic security contacts and vulnerability disclosure policy.',
  },
];

const REST_ROUTES = [
  { method: 'GET', path: '/api', href: '/api', summary: 'API root directory & service discovery manifest', tag: 'Discovery' },
  { method: 'GET', path: '/api/v1', href: '/api/v1', summary: 'Pinned version 1 stable API root directory', tag: 'Discovery' },
  { method: 'GET', path: '/api/v1/reports/search', href: '/api/v1/reports/search?q=agents&corpus=ai', summary: 'Search 233k+ academic papers with cursor pagination', tag: 'Search' },
  { method: 'GET', path: '/api/v1/essays', href: '/api/v1/essays', summary: 'List all published long-form research essays', tag: 'Essays' },
  { method: 'GET', path: '/api/v1/glossary', href: '/api/v1/glossary', summary: 'List 100+ AI and Web3 glossary definitions', tag: 'Glossary' },
  { method: 'POST', path: '/api/v1/batch', href: '/api/v1/batch', summary: 'Execute up to 20 sub-requests atomically in bulk', tag: 'Batch' },
  { method: 'POST', path: '/api/v1/scan', href: '/api/v1/scan', summary: 'Audit websites across 61 machine-readiness checks', tag: 'Scanner' },
  { method: 'GET', path: '/api/v1/jobs/{jobId}', href: '/api/v1', summary: 'Poll lifecycle and results for async background tasks', tag: 'Jobs' },
];

const NAV_SECTIONS = [
  { name: 'Quick Index', href: '#quick-index' },
  { name: 'REST APIs', href: '#api' },
  { name: 'MCP Servers', href: '#mcp' },
  { name: 'OpenAPI Spec', href: '#openapi' },
  { name: 'SDK Packages', href: '#sdk' },
  { name: 'Authentication', href: '#auth' },
  { name: 'Markdown Twins', href: '#markdown' },
  { name: 'Manifests', href: '#manifests' },
];

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-muted/60 p-4 text-xs font-mono leading-relaxed border border-border text-foreground">
      <code>{children}</code>
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
          Developer Resources provide keyless, open-access machine interfaces, REST endpoints, Model Context Protocol (MCP) servers, and OpenAPI specifications to programmatically query 233,000+ academic papers, essays, and glossary definitions on veda.ng by Vedang Vatsa.
        </p>
      </div>

      <div className="w-full space-y-12 sm:space-y-16 pb-20">
        <header>
          <PageHero
            title="Developer Resources"
            subtitle="Official machine and developer interfaces for Vedang Vatsa (veda.ng): public research search API, Model Context Protocol (MCP) server, OpenAPI 3.1 specification, Python SDK, syndication feeds, and agent discovery manifests. Keyless and open-access."
          />

          <div className="pt-2">
            <JumpNav items={NAV_SECTIONS} />
          </div>
        </header>

        <article className="space-y-12 sm:space-y-14">
          {/* ── Section 1: Quick Index & Predictable Endpoints ── */}
          <section id="quick-index" className="space-y-4 scroll-mt-20">
            <SectionHeader
              title="Quick Index & Predictable Endpoints"
              subtitle="All endpoints are keyless, unauthenticated, and return structured payloads with standard RFC rate limit headers:"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {QUICK_ENDPOINTS.map((ep) => (
                <ResourceCard
                  key={ep.url}
                  title={ep.title}
                  description={ep.description}
                  href={ep.url}
                  method={ep.method}
                  format={ep.format}
                />
              ))}
            </div>

            <div className="p-3.5 sm:p-4 rounded-lg border border-border bg-muted/20 text-xs text-muted-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span>
                Tip: Send an HTTP header <code className="font-mono text-foreground font-semibold px-1 py-0.5 rounded bg-muted">Accept: text/markdown</code> on any page to fetch its clean Markdown twin.
              </span>
              <Link
                href="mailto:vatsvedang@gmail.com"
                className="text-primary underline underline-offset-4 hover:text-foreground font-medium shrink-0"
              >
                Developer Support →
              </Link>
            </div>
          </section>

          {/* ── Section 2: Report Search API & REST Endpoints ── */}
          <section id="api" className="space-y-4 scroll-mt-20">
            <SectionHeader
              title="Report Search API & REST Endpoints"
              subtitle="Search 233,000+ indexed academic papers across the AI and Web3 corpora, backed by OpenAlex and sorted by citations. Results are cached for one hour."
            />

            <div className="space-y-2">
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

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Parameters: <code className="font-mono text-xs px-1 py-0.5 rounded bg-muted text-foreground">q</code> (required, min 2 chars),{' '}
              <code className="font-mono text-xs px-1 py-0.5 rounded bg-muted text-foreground">corpus</code> (<code className="font-mono text-xs">ai</code> or{' '}
              <code className="font-mono text-xs">web3</code>), <code className="font-mono text-xs px-1 py-0.5 rounded bg-muted text-foreground">page</code>,{' '}
              <code className="font-mono text-xs px-1 py-0.5 rounded bg-muted text-foreground">per_page</code> (max 200), <code className="font-mono text-xs px-1 py-0.5 rounded bg-muted text-foreground">cursor</code> (for cursor pagination). Full schema lives in the{' '}
              <Link href="/openapi.json" className="text-primary underline underline-offset-4 hover:text-foreground font-medium">
                OpenAPI 3.1 Specification
              </Link>.
            </p>

            <div className="border border-border rounded-lg overflow-hidden bg-card">
              <div className="px-4 py-3 bg-muted/40 border-b border-border text-xs font-semibold text-foreground">
                Core REST Endpoints
              </div>
              <div className="divide-y divide-border text-xs">
                {REST_ROUTES.map((route) => (
                  <div key={route.path} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-foreground border border-border shrink-0">
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
                      <span className="text-xs truncate">{route.summary}</span>
                      <span className="hidden sm:inline-block text-[10px] font-medium text-muted-foreground px-2 py-0.5 rounded-full bg-muted border border-border shrink-0">
                        {route.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Section 3: Model Context Protocol (MCP) Servers ── */}
          <section id="mcp" className="space-y-4 scroll-mt-20">
            <SectionHeader
              title="Model Context Protocol (MCP) Servers"
              subtitle="Vedang runs dual, production-ready MCP servers over Streamable HTTP (JSON-RPC 2.0) with zero authentication required:"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border p-4 sm:p-5 bg-card space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-foreground">1. Product MCP Server (Action & Research)</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Endpoint:{' '}
                    <Link href="/.well-known/mcp" className="font-mono text-xs text-primary underline underline-offset-4 hover:text-foreground font-medium">
                      https://veda.ng/.well-known/mcp
                    </Link>{' '}
                    (also at{' '}
                    <Link href="/api/mcp" className="font-mono text-xs text-primary underline underline-offset-4 hover:text-foreground">
                      /api/mcp
                    </Link>)
                  </p>
                </div>
                <ul className="text-xs space-y-2 text-muted-foreground border-t border-border/60 pt-3">
                  <li className="flex items-start gap-2">
                    <code className="font-mono text-foreground font-semibold px-1 py-0.5 rounded bg-muted text-[11px]">search_reports</code>
                    <span className="text-xs">— Query 233k+ papers via <Link href="/api/v1/reports/search" className="underline underline-offset-4 hover:text-foreground">OpenAlex</Link></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <code className="font-mono text-foreground font-semibold px-1 py-0.5 rounded bg-muted text-[11px]">search_essays</code>
                    <span className="text-xs">— Find technical essays in <Link href="/essays" className="underline underline-offset-4 hover:text-foreground">Essays Library</Link></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <code className="font-mono text-foreground font-semibold px-1 py-0.5 rounded bg-muted text-[11px]">get_essay</code>
                    <span className="text-xs">— Fetch full Markdown text of any essay</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <code className="font-mono text-foreground font-semibold px-1 py-0.5 rounded bg-muted text-[11px]">search_glossary</code>
                    <span className="text-xs">— Search 100+ terms in <Link href="/glossary" className="underline underline-offset-4 hover:text-foreground">Glossary Index</Link></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <code className="font-mono text-foreground font-semibold px-1 py-0.5 rounded bg-muted text-[11px]">scan_agent_readiness</code>
                    <span className="text-xs">— Audit websites on <Link href="/scan" className="underline underline-offset-4 hover:text-foreground">Agentic Scanner</Link></span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-border p-4 sm:p-5 bg-card space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-foreground">2. Documentation MCP Server (Knowledge & Docs)</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Endpoint:{' '}
                    <Link href="/.well-known/mcp/docs" className="font-mono text-xs text-primary underline underline-offset-4 hover:text-foreground font-medium">
                      https://veda.ng/.well-known/mcp/docs
                    </Link>{' '}
                    (multi-server manifest:{' '}
                    <Link href="/.well-known/mcp.json" className="font-mono text-xs text-primary underline underline-offset-4 hover:text-foreground">
                      /mcp.json
                    </Link>)
                  </p>
                </div>
                <ul className="text-xs space-y-2 text-muted-foreground border-t border-border/60 pt-3">
                  <li className="flex items-start gap-2">
                    <code className="font-mono text-foreground font-semibold px-1 py-0.5 rounded bg-muted text-[11px]">get_api_docs</code>
                    <span className="text-xs">— Fetch developer documentation (<Link href="/developers" className="underline underline-offset-4 hover:text-foreground">/developers</Link> & <Link href="/docs" className="underline underline-offset-4 hover:text-foreground">/docs</Link>)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <code className="font-mono text-foreground font-semibold px-1 py-0.5 rounded bg-muted text-[11px]">get_openapi_spec</code>
                    <span className="text-xs">— Fetch full OpenAPI schema (<Link href="/openapi.json" className="underline underline-offset-4 hover:text-foreground">/openapi.json</Link>)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <code className="font-mono text-foreground font-semibold px-1 py-0.5 rounded bg-muted text-[11px]">get_auth_guide</code>
                    <span className="text-xs">— Keyless access guidelines (<Link href="/auth.md" className="underline underline-offset-4 hover:text-foreground">/auth.md</Link>)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <code className="font-mono text-foreground font-semibold px-1 py-0.5 rounded bg-muted text-[11px]">get_course_data</code>
                    <span className="text-xs">— Full curricula for <Link href="/prompt" className="underline underline-offset-4 hover:text-foreground">Prompt</Link>, <Link href="/web3" className="underline underline-offset-4 hover:text-foreground">Web3</Link>, <Link href="/mcp" className="underline underline-offset-4 hover:text-foreground">MCP</Link>, <Link href="/agentic" className="underline underline-offset-4 hover:text-foreground">Agentic</Link></span>
                  </li>
                </ul>
              </div>
            </div>

            <CommandBlock command={mcpExample} />
          </section>

          {/* ── Section 4: OpenAPI 3.1 Specification ── */}
          <section id="openapi" className="space-y-4 scroll-mt-20">
            <SectionHeader
              title="OpenAPI 3.1 Specification"
              subtitle="The machine-readable OpenAPI specification documents 100% typed response schemas, RFC rate-limit headers, cursor pagination, batch execution, and async polling:"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 text-xs">
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
                  className="p-3 rounded-lg border border-border bg-card text-center text-primary font-mono text-xs underline underline-offset-4 hover:border-primary/50 transition-colors truncate font-medium"
                >
                  {spec.href}
                </Link>
              ))}
            </div>
          </section>

          {/* ── Section 5: Multi-Language SDK Packages & Tooling ── */}
          <section id="sdk" className="space-y-4 scroll-mt-20">
            <SectionHeader
              title="Multi-Language SDK Packages & Tooling"
              subtitle="Programmatic SDK packages and CLI tools for Python, TypeScript/JavaScript, and Go:"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border p-4 sm:p-5 bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-foreground">Python (PyPI)</span>
                  <a
                    href="https://pypi.org/project/vedang-cli/"
                    target="_blank"
                    rel="package noopener noreferrer"
                    className="text-xs text-primary underline underline-offset-4 hover:text-foreground font-medium"
                  >
                    vedang-cli ↗
                  </a>
                </div>
                <CommandBlock command="pip install vedang-cli" />
              </div>

              <div className="rounded-lg border border-border p-4 sm:p-5 bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-foreground">TypeScript / Node (NPM)</span>
                  <a
                    href="https://www.npmjs.com/package/vedang"
                    target="_blank"
                    rel="package noopener noreferrer"
                    className="text-xs text-primary underline underline-offset-4 hover:text-foreground font-medium"
                  >
                    vedang ↗
                  </a>
                </div>
                <CommandBlock command="npm install vedang" />
              </div>
            </div>

            <div className="rounded-lg border border-border p-4 sm:p-5 bg-card space-y-2">
              <div className="font-semibold text-sm text-foreground">Generate Client SDK (Any Language)</div>
              <p className="text-xs text-muted-foreground">Generate typed API clients for Go, Rust, Java, Swift, or Ruby using the OpenAPI specification:</p>
              <CommandBlock command="npx @openapitools/openapi-generator-cli generate -i https://veda.ng/openapi.json -g typescript-fetch -o ./sdk" />
            </div>
          </section>

          {/* ── Section 6: Authentication & Security Guide ── */}
          <section id="auth" className="space-y-4 scroll-mt-20">
            <SectionHeader
              title="Authentication & Security Protocols"
              subtitle={
                <>
                  All public reading and search APIs on veda.ng are keyless and require no API token. The complete WorkOS-format authentication specification is documented at{' '}
                  <Link href="/auth.md" className="text-primary underline underline-offset-4 hover:text-foreground font-medium">
                    /auth.md
                  </Link>{' '}
                  (interactive page at{' '}
                  <Link href="/auth" className="text-primary underline underline-offset-4 hover:text-foreground font-medium">
                    /auth
                  </Link>). Security vulnerability disclosure instructions are published at{' '}
                  <Link href="/.well-known/security.txt" className="text-primary underline underline-offset-4 hover:text-foreground font-mono">
                    /.well-known/security.txt
                  </Link>.
                </>
              }
            />
          </section>

          {/* ── Section 7: Markdown Content Negotiation ── */}
          <section id="markdown" className="space-y-4 scroll-mt-20">
            <SectionHeader
              title="Markdown Content Negotiation"
              subtitle={
                <>
                  Every essay, every glossary term, and key pages serve clean Markdown twins to autonomous machines. Send an <code className="font-mono text-xs px-1 py-0.5 rounded bg-muted text-foreground">Accept: text/markdown</code> header instead of parsing heavy HTML:
                </>
              }
            />

            <CommandBlock command={markdownExample} />

            <p className="text-xs text-muted-foreground leading-relaxed">
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
          </section>

          {/* ── Section 8: Discovery Feeds & Machine Manifests ── */}
          <section id="manifests" className="space-y-4 scroll-mt-20">
            <SectionHeader
              title="Discovery Feeds & Machine Manifests"
              subtitle="Standardized machine endpoints and discovery catalogs for autonomous agents and web spiders:"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
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
                  className="p-3.5 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors flex flex-col justify-between gap-1.5"
                >
                  <div className="font-mono font-medium text-xs text-primary underline underline-offset-4 hover:text-primary/80">
                    {manifest.name}
                  </div>
                  <div className="text-muted-foreground text-xs leading-relaxed">
                    {manifest.desc}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </div>
    </PageLayout>
  );
}

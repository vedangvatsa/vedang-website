import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { Metadata } from 'next';
import Link from 'next/link';
import { CommandBlock } from '@/app/noslop/command-block';
import { generateMetadata } from '@/lib/metadata';
import { developersSummaryLines } from '@/lib/agent-md';

export const metadata: Metadata = generateMetadata({
  title: 'veda.ng Developer Resources - API, MCP Server, Feeds',
  description:
    'Developer and AI agent interfaces for veda.ng: public research search API, MCP server over Streamable HTTP, OpenAPI spec, RSS feed, sitemap, llms.txt index, and Markdown content negotiation.',
  url: '/developers',
  keywords: [
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
  '@type': 'WebPage',
  name: 'veda.ng Developer Resources',
  url: 'https://veda.ng/developers',
  description:
    'Machine interfaces for veda.ng: public report search API, MCP server over Streamable HTTP, OpenAPI specification, RSS feed, sitemap, and agent discovery files.',
  inLanguage: 'en-US',
};

const mcpExample = `curl -X POST https://veda.ng/.well-known/mcp \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize",
       "params":{"protocolVersion":"2025-06-18","capabilities":{},
                 "clientInfo":{"name":"my-client","version":"1.0"}}}'`;

const markdownExample = `curl -H "Accept: text/markdown" https://veda.ng/agentstack`;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
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
        title="Developer Resources"
        subtitle="Machine interfaces for veda.ng: a public research search API, an MCP server for AI agents, syndication feeds, and agent discovery files. No authentication required for any read endpoint."
      />

      <article className="pb-16 text-sm md:text-base">
        <Section title="Quick index">
          <ul className="space-y-1.5 text-muted-foreground">
            {developersSummaryLines().map((line) => (
              <li key={line} className="break-words">{line}</li>
            ))}
          </ul>
        </Section>

        <Section title="Report search API">
          <p className="text-muted-foreground mb-3">
            Search 233,000+ indexed academic papers across the AI and Web3 corpora, backed by OpenAlex and sorted by
            citations. Results are cached for one hour.
          </p>
          <Code>{`GET /api/reports/search?q=stablecoin+regulation&corpus=ai&page=1&per_page=20`}</Code>
          <p className="text-muted-foreground mt-3 mb-3">
            Parameters: <code className="font-mono text-xs">q</code> (required, min 2 chars),{' '}
            <code className="font-mono text-xs">corpus</code> (<code className="font-mono text-xs">ai</code> or{' '}
            <code className="font-mono text-xs">web3</code>), <code className="font-mono text-xs">page</code>,{' '}
            <code className="font-mono text-xs">per_page</code> (max 200). The full contract lives in the{' '}
            <Link href="/openapi.json" className="underline underline-offset-4 hover:text-foreground">OpenAPI 3.1 spec</Link>.
          </p>
        </Section>

        <Section title="MCP server (Model Context Protocol)">
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

        <Section title="Markdown content negotiation">
          <p className="text-muted-foreground mb-3">
            Every essay, every glossary term, and key pages serve Markdown to machines. Send an Accept header instead of
            parsing HTML:
          </p>
          <CommandBlock command={markdownExample} />
        </Section>

        <Section title="Feeds & discovery files">
          <ul className="space-y-1.5 text-muted-foreground">
            <li><Link href="/feed.xml" className="underline underline-offset-4 hover:text-foreground">feed.xml</Link> - RSS feed of new essays</li>
            <li><Link href="/sitemap.xml" className="underline underline-offset-4 hover:text-foreground">sitemap.xml</Link> - every public URL</li>
            <li><Link href="/llms.txt" className="underline underline-offset-4 hover:text-foreground">llms.txt</Link> - structured index for LLMs (<Link href="/llms-full.txt" className="underline underline-offset-4 hover:text-foreground">full-text version</Link>)</li>
            <li><Link href="/.well-known/agents.json" className="underline underline-offset-4 hover:text-foreground">agents.json</Link> - when-to-use guidance and capabilities</li>
            <li><Link href="/ai.txt" className="underline underline-offset-4 hover:text-foreground">ai.txt</Link> - training, indexing, and citation permissions (allowed)</li>
          </ul>
        </Section>
      </article>
    </PageLayout>
  );
}

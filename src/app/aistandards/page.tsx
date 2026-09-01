import Link from 'next/link';
import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { AuthorByline } from '@/components/author-byline';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusPill } from '@/components/ui/status-pill';
import { JumpNav } from '@/components/ui/jump-nav';

// Landing page for https://github.com/vedangvatsa/aistandards
// Voice: third person. No first-person plural. Follows AGENTS.md / ai-slop rules.

type Priority = 'Start here' | 'When it applies' | 'Optional';

interface DiscoveryFile {
  name: string;
  path: string;
  what: string;
  why: string;
  category: string;
  priority: Priority;
  spec: string;
  specUrl?: string;
}

const DISCOVERY_FILES: DiscoveryFile[] = [
  {
    name: 'robots.txt',
    path: '/robots.txt',
    what: 'A text file at the site root that requests which paths automated bots may crawl.',
    why: 'Often the main practical crawl control when bots honor it. Training and search bots can be set differently. Some chat-time fetches may ignore robots.txt.',
    category: 'Crawl control',
    priority: 'Start here',
    spec: 'RFC 9309',
    specUrl: 'https://www.rfc-editor.org/rfc/rfc9309',
  },
  {
    name: 'sitemap.xml',
    path: '/sitemap.xml',
    what: 'A list of important site URLs, often with last-modified dates.',
    why: 'Can help crawlers that use sitemaps find URLs without guessing the full graph. Does not guarantee indexing or citations.',
    category: 'Content discovery',
    priority: 'Start here',
    spec: 'sitemaps.org',
    specUrl: 'https://www.sitemaps.org/protocol.html',
  },
  {
    name: 'llms.txt',
    path: '/llms.txt',
    what: 'A short Markdown summary of the site, with identity plus links to the most important pages.',
    why: 'Can give agents a cleaner map when they look for it. Not a proven ranking factor; Google has said it is not required for its generative search features.',
    category: 'Content discovery',
    priority: 'Start here',
    spec: 'llmstxt.org',
    specUrl: 'https://llmstxt.org',
  },
  {
    name: 'JSON-LD (schema)',
    path: 'Inside HTML pages',
    what: 'Structured labels that declare entities such as Organization, Article, or FAQ on a page.',
    why: 'May help machines extract typed facts more reliably than prose alone. Not a documented citation guarantee from major chat products.',
    category: 'Content structure',
    priority: 'Start here',
    spec: 'Schema.org',
    specUrl: 'https://schema.org',
  },
  {
    name: 'security.txt',
    path: '/.well-known/security.txt',
    what: 'Contact details for reporting security issues.',
    why: 'Operational contact file. Not AI-specific and not an AI ranking lever.',
    category: 'Operations',
    priority: 'Optional',
    spec: 'RFC 9116',
    specUrl: 'https://www.rfc-editor.org/rfc/rfc9116',
  },
  {
    name: 'llms-full.txt',
    path: '/llms-full.txt',
    what: 'Markdown with fuller text of key pages, not only links.',
    why: 'May reduce follow-up fetches for docs-heavy sites if something actually reads it. Same evidence limits as llms.txt.',
    category: 'Content discovery',
    priority: 'When it applies',
    spec: 'llmstxt.org',
    specUrl: 'https://llmstxt.org',
  },
  {
    name: 'tdmrep.json',
    path: '/.well-known/tdmrep.json',
    what: 'Machine-readable notice that mining rights are reserved or not, under EU text-and-data-mining rules.',
    why: 'May help signal mining preferences in an EU context. Complements robots.txt; effect depends on whether miners honor it. Not legal advice.',
    category: 'Crawl control',
    priority: 'When it applies',
    spec: 'W3C TDMRep',
    specUrl: 'https://www.w3.org/community/tdmrep/',
  },
  {
    name: 'agents.txt',
    path: '/agents.txt',
    what: 'Plain text that can announce agent protocols the site supports (MCP, A2A card URLs, skills, payments).',
    why: 'Most relevant when the site actually exposes tools or agent endpoints, not only articles. Early community convention.',
    category: 'Agent products',
    priority: 'When it applies',
    spec: 'agents-txt.com',
    specUrl: 'https://agents-txt.com',
  },
  {
    name: 'agents.json',
    path: '/agents.json or /.well-known/agents.json',
    what: 'Structured manifest declaring task suitability (when_to_use), tool endpoints, SDKs, and runtime guidance for AI agents.',
    why: 'Richer machine fields for autonomous agent discovery. Distinct from /.well-known/agent-card.json (A2A).',
    category: 'Agent products',
    priority: 'When it applies',
    spec: 'agents-txt.com',
    specUrl: 'https://agents-txt.com',
  },
  {
    name: 'MCP Streamable HTTP',
    path: '/.well-known/mcp',
    what: 'First-party Model Context Protocol server exposing tool capabilities over Streamable HTTP with JSON-RPC 2.0.',
    why: 'Enables external LLM agents (Claude, ChatGPT, IDE agents) to discover and execute tools programmatically via HTTP POST.',
    category: 'Agent products',
    priority: 'When it applies',
    spec: 'Model Context Protocol',
    specUrl: 'https://modelcontextprotocol.io',
  },
  {
    name: 'api-catalog (RFC 9727)',
    path: '/.well-known/api-catalog',
    what: 'A standard discovery document listing API entry points, documentation, and OpenAPI specification URLs.',
    why: 'Published IETF standard (RFC 9727) allowing autonomous agents to locate API endpoints without guessing paths.',
    category: 'Agent products',
    priority: 'When it applies',
    spec: 'RFC 9727',
    specUrl: 'https://www.rfc-editor.org/rfc/rfc9727',
  },
  {
    name: 'agent-card.json',
    path: '/.well-known/agent-card.json',
    what: 'A2A Protocol agent card with identity, skills, transports, and security.',
    why: 'Only worth publishing when a real A2A agent is running. Fake cards can mislead other agents.',
    category: 'Agent products',
    priority: 'When it applies',
    spec: 'A2A Protocol',
    specUrl: 'https://a2a-protocol.org/latest/specification/',
  },
  {
    name: 'openapi.json / openapi.yaml',
    path: '/openapi.json or /openapi.yaml',
    what: 'Machine contract for an HTTP API, covering paths, typed parameters, cursor pagination, and response schemas.',
    why: 'Essential when clients or agents should call the product over HTTP without relying only on human docs.',
    category: 'Agent products',
    priority: 'When it applies',
    spec: 'OpenAPI 3.1',
    specUrl: 'https://spec.openapis.org/oas/v3.1.0',
  },
  {
    name: 'OAuth Protected Resource (RFC 9728)',
    path: '/.well-known/oauth-protected-resource',
    what: 'Metadata describing authorization servers, supported scopes, and token requirements for API access.',
    why: 'Published IETF standard (RFC 9728) enabling automated clients to discover authentication flows before sending requests.',
    category: 'Operations',
    priority: 'When it applies',
    spec: 'RFC 9728',
    specUrl: 'https://www.rfc-editor.org/rfc/rfc9728',
  },
  {
    name: 'Agent Auth Spec (auth.md / auth.json)',
    path: '/auth.md or /auth.json',
    what: 'Machine-readable authentication guide defining keyless access, registration endpoints, and token usage for agents.',
    why: 'Provides autonomous agents with clear instructions on handling 401 challenges, registration, or anonymous requests.',
    category: 'Agent products',
    priority: 'When it applies',
    spec: 'WorkOS Agent Auth',
    specUrl: 'https://workos.com/blog/agent-auth-pattern',
  },
  {
    name: 'webhooks.json',
    path: '/webhooks.json',
    what: 'Catalog of event notifications, webhook triggers, and real-time streaming channels (SSE / RSS).',
    why: 'Allows agents to subscribe to real-time events and data updates without continuous polling.',
    category: 'Agent products',
    priority: 'When it applies',
    spec: 'OpenAPI Webhooks',
    specUrl: 'https://spec.openapis.org/oas/v3.1.0#oasWebhooks',
  },
  {
    name: 'ai-catalog.json (AIR)',
    path: '/.well-known/ai-catalog.json',
    what: 'AI Resource (AIR) catalog listing verified capabilities, machine datasets, and trust manifests.',
    why: 'Provides structured trust assertions, licenses, and capability registry entries for AI agent ecosystems.',
    category: 'Agent products',
    priority: 'When it applies',
    spec: 'AI Resource (AIR)',
    specUrl: 'https://github.com/microsoft/ai-resources',
  },
  {
    name: 'L402 Machine Payments',
    path: 'HTTP 402 Authorization: L402',
    what: 'Protocol standard using HTTP 402 and Lightning Network macaroons for machine-to-machine API payments.',
    why: 'Enables autonomous agents to pay for metered API access, premium tools, and compute without human credit cards.',
    category: 'Agent products',
    priority: 'When it applies',
    spec: 'L402 Protocol',
    specUrl: 'https://docs.lightning.engineering/the-lightning-network/l402',
  },
  {
    name: 'MCP Server Card',
    path: '/.well-known/mcp/server-card.json',
    what: 'Draft discovery document for Model Context Protocol servers.',
    why: 'Only when an MCP server is actually operated. Path and schema may still change across proposals.',
    category: 'Agent products',
    priority: 'When it applies',
    spec: 'MCP',
    specUrl: 'https://modelcontextprotocol.io',
  },
  {
    name: 'Content-Signal',
    path: 'Inside robots.txt',
    what: 'Optional preference line for search, AI input, and training after content is accessed.',
    why: 'Emerging way to express finer usage preferences (AIPREF / Content Signals). Support is still limited and evolving.',
    category: 'Crawl control',
    priority: 'When it applies',
    spec: 'AIPREF / Content Signals',
    specUrl: 'https://datatracker.ietf.org/wg/aipref/about/',
  },
  {
    name: 'feed.xml / feed.json',
    path: '/feed.xml or /feed.json',
    what: 'RSS, Atom, or JSON Feed of new or updated posts.',
    why: 'Can help readers and some systems notice updates on regularly published sites. Not AI-specific.',
    category: 'Content discovery',
    priority: 'When it applies',
    spec: 'RSS / JSON Feed',
    specUrl: 'https://jsonfeed.org/version/1.1',
  },
  {
    name: 'ai.txt / ai.json',
    path: '/ai.txt and /ai.json',
    what: 'Informal permissions summary and content map in text or JSON.',
    why: 'Optional documentation. Major providers do not document these the way they document robots.txt tokens.',
    category: 'Optional',
    priority: 'Optional',
    spec: 'Community',
  },
  {
    name: 'brand.txt',
    path: '/brand.txt',
    what: 'Preferred spelling, product names, and tone for brand description.',
    why: 'May help agents under operator control. Little public evidence that major consumer chatbots load it by default.',
    category: 'Optional',
    priority: 'Optional',
    spec: 'Community',
  },
];

const AI_CRAWLERS: { company: string; bots: string[] }[] = [
  {
    company: 'OpenAI',
    bots: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'OAI-AdsBot'],
  },
  {
    company: 'Anthropic',
    bots: ['ClaudeBot', 'Claude-SearchBot', 'Claude-User'],
  },
  {
    company: 'Google',
    bots: ['Googlebot', 'Google-Extended', 'GoogleOther'],
  },
  {
    company: 'Perplexity',
    bots: ['PerplexityBot', 'Perplexity-User'],
  },
  {
    company: 'Others',
    bots: ['Applebot', 'Amazonbot', 'meta-externalagent', 'CCBot', 'Bytespider', 'Bingbot'],
  },
];

const CATEGORIES = [...new Set(DISCOVERY_FILES.map((f) => f.category))];

const PRIORITY_STYLES: Record<Priority, string> = {
  'Start here': 'bg-gray-900 text-white border-gray-900',
  'When it applies': 'bg-gray-100 text-gray-800 border-gray-200',
  Optional: 'bg-gray-50 text-gray-600 border-gray-200',
};

export default function AiDiscoveryStandardsPage() {
  const navItems = [
    { name: 'Install', href: '#install' },
    { name: 'Why it exists', href: '#basics' },
    { name: 'Training vs search', href: '#training-vs-search' },
    { name: 'Catalog', href: '#registry' },
    { name: 'Content techniques', href: '#content-techniques' },
    { name: 'Agent files', href: '#developer-agent-files' },
    { name: 'Standards', href: '#standards-progress' },
    { name: 'Crawlers', href: '#crawlers' },
    { name: 'Verify', href: '#verify' },
  ];

  return (
    <PageLayout>
      <div className="w-full space-y-12 sm:space-y-16 pb-20">
        <header>
          <PageHero
            title="AI Discovery Standards"
            subtitle="Reference files and an installer for declaring identity, content maps, and crawl preferences that AI systems may use. Outcomes vary by product and are not guaranteed."
          />
          <div className="-mt-3">
            <AuthorByline
              links={[{ label: 'GitHub', href: 'https://github.com/vedangvatsa/aistandards' }]}
            />
          </div>

          <div className="pt-4">
            <JumpNav items={navItems} />
          </div>

          {/* Semantic definition block for AI engines */}
          <div className="sr-only">
            <h2>What are AI Discovery Standards?</h2>
            <p>
              AI Discovery Standards are machine-readable file formats (llms.txt, brand.txt, agents.json, ai-catalog.json, RFC 9727 api-catalog, RFC 9728 oauth-protected-resource) and HTTP content negotiation protocols that enable search engines, LLM answer engines, and autonomous agents to index, authenticate, and interact with web resources.
            </p>
          </div>
        </header>

      <div className="py-8 sm:py-10 md:py-14 min-w-0">
        <article className="notion-article prose prose-neutral max-w-5xl w-full min-w-0 mx-auto">
          <div className="space-y-12 sm:space-y-14 not-prose min-w-0">

            <section id="install" className="min-w-0 scroll-mt-20">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-3">Install</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Run from the website project root. Pass the live production URL.
              </p>
              <div className="terminal-chrome rounded-lg overflow-hidden border mb-3 max-w-full min-w-0">
                <div className="terminal-chrome-bar px-3 sm:px-4 py-2 flex items-center gap-2 min-w-0">
                  <span className="text-xs font-medium truncate">Terminal</span>
                </div>
                <pre className="p-3 sm:p-4 overflow-x-auto max-w-full text-[11px] sm:text-[12px] leading-relaxed overscroll-x-contain">
                  <code className="!whitespace-pre">{`# Full auto
npx --yes github:vedangvatsa/aistandards --yes --scan \\
  --url=https://your-domain.com

# Block training crawlers
npx --yes github:vedangvatsa/aistandards --yes --scan \\
  --url=https://your-domain.com --deny-training`}</code>
                </pre>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed break-words">
                Tries to write files into{' '}
                <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded break-all">public/</code> or{' '}
                <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded break-all">static/</code>, wire head tags when a
                safe injection point exists, and leave existing files unless{' '}
                <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded break-all">--force</code>. Review{' '}
                <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded break-all">llms.txt</code> and confirm the host
                serves them at the domain root. Does not invent A2A, MCP, or payment endpoints.
              </p>
            </section>

            <section id="basics" className="min-w-0 scroll-mt-20">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-3">Why these standards exist</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Websites were built for people who read. AI systems find content differently. Crawlers follow links,
                fetch pages, and parse HTML. Autonomous agents look for machine-readable files that describe what a site offers
                and how to use it.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                In modern Agent Experience (AX) frameworks, interactions move across four distinct layers:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg border bg-card p-3 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">1. Discovery</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Can search engines and answer engines find your brand, API docs, and developer portals by name without disambiguation errors?
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">2. Access</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Can crawlers land on the site, bypass JS-rendering bottlenecks, and extract facts via Markdown negotiation and JSON-LD?
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">3. Usability</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Can agents authenticate, execute tools over MCP, page with cursor tokens, and safely retry write operations via Idempotency-Key headers?
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">4. Payments & Action</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Can agents autonomously purchase metered access or pay for tool calls via machine payment protocols like L402?
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                A few files carry most of the value. robots.txt is a set of rules for bots. It says which paths they
                may visit and which they should leave alone. sitemap.xml is a plain list of the pages that exist.
                llms.txt is a short markdown reading list. It names who runs the site and which pages matter.
                agents.txt, agents.json, and Model Context Protocol (MCP) servers tell agent software what a site offers and how to reach it. Everything
                else in the catalog is optional polish.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Start with the pieces that are free and stable, like clear HTML, a sitemap, and robots.txt. Add
                llms.txt as a concise reading list. Only add agent files, API contracts, or an agent card when the
                site actually operates the service they describe. None of these files guarantees ranking, citation,
                or inclusion in any AI product. They reduce friction for systems that choose to look.
              </p>
            </section>

            <section id="training-vs-search" className="min-w-0 scroll-mt-20">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-3">Training vs search</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 break-words">
                Many vendors publish separate bot names for different jobs. Prefer setting them separately in{' '}
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded break-all">robots.txt</code>. OpenAI documents{' '}
                <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded break-all">GPTBot</code> (training-related) and{' '}
                <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded break-all">OAI-SearchBot</code> (search) as
                independent choices. Some chat-time fetches may not fully honor robots.txt.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                The split matters in practice. A site can let the search bots in while telling the training bots to
                stay out, or the reverse. The two columns below are the common names for each kind.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1.5">Training-related</p>
                  <p className="text-xs text-muted-foreground mb-2 leading-snug">
                    Often associated with model training. Citations from this path alone are uncommon.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {['GPTBot', 'ClaudeBot', 'CCBot', 'Google-Extended'].map((bot) => (
                      <code key={bot} className="text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded break-all">{bot}</code>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1.5">Search and answers</p>
                  <p className="text-xs text-muted-foreground mb-2 leading-snug">
                    Often used for indexing or retrieval that may cite or link to a source.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {['OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot'].map((bot) => (
                      <code key={bot} className="text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded break-all">{bot}</code>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section id="registry" className="min-w-0 scroll-mt-20">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-3">Catalog</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                This catalog lists every file used in AI discovery, grouped by the job it does. The priority labels
                show a practical order. <strong>Start here</strong> items are stable, widely honored, and useful on
                almost any site.{' '}
                <strong>When it applies</strong> items help only when the site matches the condition. <strong>Optional</strong>{' '}
                items are extras with limited evidence. Open any card for what the file is, where it lives, and the
                spec that defines it.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {CATEGORIES.map((category) => {
                  const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  return (
                    <a
                      key={category}
                      href={`#${slug}`}
                      className="rounded-md border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                    >
                      {category}
                    </a>
                  );
                })}
              </div>

              {CATEGORIES.map((category) => {
                const items = DISCOVERY_FILES.filter((f) => f.category === category);
                const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return (
                  <div key={category} id={slug} className="mb-8 last:mb-0 min-w-0 scroll-mt-20">
                    <h3 className="text-base font-semibold tracking-tight mb-2.5 text-foreground break-words">{category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 min-w-0">
                      {items.map((file) => (
                        <details
                          key={file.name}
                          className="rounded-lg border bg-card group open:ring-1 open:ring-border min-w-0"
                        >
                          <summary className="p-3 cursor-pointer select-none hover:bg-muted/40 transition-colors list-none [&::-webkit-details-marker]:hidden min-w-0">
                            <div className="flex flex-wrap items-center gap-1 mb-1.5">
                              <StatusPill status={file.priority} size="sm" />
                            </div>
                            <p className="text-sm font-medium text-foreground leading-snug break-words">{file.name}</p>
                            <p className="text-[11px] font-mono text-muted-foreground truncate mt-0.5" title={file.path}>{file.path}</p>
                            <p className="text-xs text-muted-foreground leading-snug mt-1.5 line-clamp-2 group-open:line-clamp-none break-words">
                              {file.what}
                            </p>
                          </summary>
                          <div className="px-3 pb-3 pt-0 space-y-1.5 border-t border-border/60 min-w-0">
                            <p className="text-xs text-muted-foreground leading-snug pt-2 break-words">{file.why}</p>
                            {file.specUrl ? (
                              <Link
                                href={file.specUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block max-w-full text-[11px] text-muted-foreground hover:text-primary transition-colors break-all"
                              >
                                {file.spec}
                              </Link>
                            ) : null}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>

            <section id="content-techniques" className="min-w-0 scroll-mt-20">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-3">Content & API techniques</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Files alone are not enough. How content and API responses are shaped affects whether AI agents and answer engines can extract facts and execute operations cleanly.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1.5">Markdown content negotiation</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Serve raw Markdown on standard URLs when requests include Accept: text/markdown. Saves agent inference tokens by stripping visual HTML chrome.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1.5">Actionable error contracts</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Return structured JSON errors with explicit resolution hints so autonomous LLM agents can self-correct parameters and retry without failing.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1.5">Idempotency-Key support</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Declare Idempotency-Key headers on write operations so agents retrying on network drops never duplicate transactions or records.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1.5">RateLimit & Sunset headers</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Expose standard RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, and RFC 8594 Sunset headers so agents budget API calls cleanly.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1.5">Cursor-based pagination</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Expose opaque cursor tokens and limit counts rather than offset/page numbers to prevent index drift during automated crawls.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1.5">Async 202 job polling</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Return 202 Accepted with a Location header and Retry-After interval for long-running operations so agents can track background work.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1.5">Batch execution endpoints</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Accept arrays of sub-requests in a single POST /batch call to minimize round-trip latency and conserve agent context windows.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1.5">Answer-first writing</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Lead each section with a concise direct answer. Put context after. This matches how people ask and how extractors pull snippets.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1.5">Question-shaped headings</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Match how people actually ask. &quot;How do I block AI training bots&quot; works better than &quot;Bot configuration overview&quot;.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1.5">Factual density</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Prefer dates, numbers, and named entities over vague claims. Specifics get picked up. Generalities get skipped.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1.5">FAQ and HowTo schema</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Schema helps machines map questions to answers. Rich result eligibility is separate and not guaranteed.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1.5">Person and Organization schema</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Link to authoritative profiles with sameAs. Helps verify identity across sources.
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground/70 leading-relaxed mt-3">
                These are industry heuristics, not guarantees from any model vendor.
              </p>
            </section>

            <section id="developer-agent-files" className="min-w-0 scroll-mt-20">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-3">Developer agent files</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                These are not public web discovery files. They live in your code repository and tell coding agents
                about your project.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Keep them short on purpose. A coding agent reads the whole file, so bloat gets ignored and the
                useful rules drown. AGENTS.md is the shared source of truth; tool-specific files for Cursor or
                Claude point back to it instead of repeating it.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1">AGENTS.md</p>
                  <p className="text-[11px] font-mono text-muted-foreground mb-1.5">/AGENTS.md</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Repository-level instructions for coding agents. Keep it short. Prefer facts agents cannot infer from the file tree.
                  </p>
                  <Link href="https://agents.md" target="_blank" rel="noopener noreferrer" className="inline-block text-[11px] text-muted-foreground hover:text-primary transition-colors mt-1.5">
                    agents.md
                  </Link>
                </div>
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1">.cursorrules</p>
                  <p className="text-[11px] font-mono text-muted-foreground mb-1.5">/.cursor/rules/*.mdc</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Cursor-specific rules. Use AGENTS.md as the source of truth and symlink or include from tool-specific files to avoid drift.
                  </p>
                </div>
              </div>
            </section>

            <section id="standards-progress" className="min-w-0 scroll-mt-20">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-3">Standards in progress</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Several IETF drafts and W3C proposals are establishing the standard ways AI systems discover sites and invoke tools. Each adds a protocol, header, or file that agents can rely on.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1">AI Endpoint Discovery</p>
                  <p className="text-[11px] font-mono text-muted-foreground mb-1.5">/.well-known/ai</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Published 2026-03-23. One of several competing IETF discovery ideas.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1">Agent Discovery Protocol</p>
                  <p className="text-[11px] font-mono text-muted-foreground mb-1.5">draft-pro-adp-agent-discovery</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Proposes a protocol-level approach to agent discovery.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1">IETF Idempotency-Key Header</p>
                  <p className="text-[11px] font-mono text-muted-foreground mb-1.5">draft-ietf-httpapi-idempotency-key-header</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Defines standard Idempotency-Key header mechanics for preventing duplicate executions on retry.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1">IETF RateLimit Fields</p>
                  <p className="text-[11px] font-mono text-muted-foreground mb-1.5">draft-ietf-httpapi-ratelimit-headers</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Standardizes RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, and RateLimit-Policy HTTP headers.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1">W3C WebMCP (In-Page Tools)</p>
                  <p className="text-[11px] font-mono text-muted-foreground mb-1.5">Draft W3C WebMCP Standard</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Enables web pages to declare agent-callable tools directly in semantic HTML form elements.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1">DNS-AID</p>
                  <p className="text-[11px] font-mono text-muted-foreground mb-1.5">draft-mozleywilliams-dnsop-dnsaid</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    DNS-based approach to agent identity and discovery.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1">MCP Discovery URI</p>
                  <p className="text-[11px] font-mono text-muted-foreground mb-1.5">draft-serra-mcp-discovery-uri</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Proposes mcp:// URIs for discovering MCP servers.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-3 sm:p-3.5 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1">AI Preferences (AIPREF)</p>
                  <p className="text-[11px] font-mono text-muted-foreground mb-1.5">draft-ietf-aipref-vocab / -attach</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Standards-track vocabulary for expressing AI usage preferences. May become the preferred web attachment path over time.
                  </p>
                </div>
              </div>
              <Link
                href="https://datatracker.ietf.org/doc/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[11px] text-muted-foreground hover:text-primary transition-colors mt-3"
              >
                IETF Datatracker
              </Link>
            </section>

            <section id="crawlers" className="min-w-0 scroll-mt-20">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-3">Crawler names</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Common tokens that may appear in logs and robots.txt. Roles can change; check each vendor&apos;s docs
                when the stakes are high.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 min-w-0">
                {AI_CRAWLERS.map((group) => (
                  <div key={group.company} className="rounded-lg border bg-card p-3 min-w-0">
                    <p className="text-sm font-medium text-foreground mb-1.5 break-words">{group.company}</p>
                    <div className="flex flex-wrap gap-1">
                      {group.bots.map((bot) => (
                        <code key={bot} className="text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded break-all">
                          {bot}
                        </code>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="verify" className="min-w-0 scroll-mt-20">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-3">Check after deploy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                After deploy, these paths usually need to return 200 at the domain root if the host is serving the
                static directory correctly.
              </p>
              <div className="terminal-chrome rounded-lg overflow-hidden border max-w-full min-w-0">
                <div className="terminal-chrome-bar px-3 sm:px-4 py-2 flex items-center gap-2">
                  <span className="text-xs font-medium">Terminal</span>
                </div>
                <pre className="p-3 sm:p-4 overflow-x-auto max-w-full text-[11px] sm:text-[12px] leading-relaxed overscroll-x-contain">
                  <code className="!whitespace-pre">{`curl -sI https://your-domain.com/robots.txt | head -1
curl -sI https://your-domain.com/llms.txt | head -1
curl -sI https://your-domain.com/sitemap.xml | head -1
curl -sI https://your-domain.com/agents.txt | head -1
curl -sI https://your-domain.com/.well-known/agents.json | head -1
curl -sI https://your-domain.com/.well-known/api-catalog | head -1
curl -sI https://your-domain.com/.well-known/mcp | head -1
curl -sI https://your-domain.com/.well-known/security.txt | head -1`}</code>
                </pre>
              </div>
            </section>

            <section className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-3">Prompt for a coding agent</h2>
              <div className="terminal-chrome rounded-lg overflow-hidden border max-w-full min-w-0">
                <div className="terminal-chrome-bar px-3 sm:px-4 py-2">
                  <span className="text-xs font-medium">Prompt</span>
                </div>
                <pre className="p-3 sm:p-4 overflow-x-auto max-w-full text-[11px] sm:text-[12px] leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere] overscroll-x-contain">
                  <code className="!whitespace-pre-wrap !break-words [overflow-wrap:anywhere]">{`Set up AI discovery for this project with https://github.com/vedangvatsa/aistandards. Then run npx --yes github:vedangvatsa/aistandards --yes --scan --url=https://YOUR_DOMAIN. Review llms.txt, confirm training allow/deny, and do not advertise fake A2A or MCP endpoints.`}</code>
                </pre>
              </div>
            </section>

            <section className="min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <Link
                  href="/sitecheck"
                  className="underline hover:text-primary"
                >
                  Site Checklist
                </Link>
                <Link
                  href="https://github.com/vedangvatsa/aistandards"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  GitHub
                </Link>
                <Link
                  href="https://github.com/vedangvatsa/aistandards/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  Issues
                </Link>
                <span className="text-xs text-muted-foreground/60">MIT · Updated 2026</span>
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  </PageLayout>
  );
}

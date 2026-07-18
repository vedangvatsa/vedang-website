import Link from 'next/link';
import { AuthorByline } from '@/components/author-byline';

// Landing page for https://github.com/vedangvatsa/aistandards
// Voice: third person. No first-person plural. Follows AGENTS.md / ai-slop rules.

type Maturity = 'Standard' | 'Adopted' | 'Emerging' | 'Proposed' | 'Legacy';
type Priority = 'Start here' | 'When it applies' | 'Optional';

interface DiscoveryFile {
  name: string;
  path: string;
  what: string;
  why: string;
  category: string;
  priority: Priority;
  maturity: Maturity;
  spec: string;
  specUrl?: string;
}

const DISCOVERY_FILES: DiscoveryFile[] = [
  {
    name: 'robots.txt',
    path: '/robots.txt',
    what: 'A text file at the site root that tells automated bots which paths they may crawl.',
    why: 'Primary practical control for AI companies that honor robots.txt. Search bots and training bots can be allowed or blocked independently. Some vendors say a one-off page fetch during chat may not fully apply robots.txt.',
    category: 'Crawl control',
    priority: 'Start here',
    maturity: 'Standard',
    spec: 'RFC 9309',
    specUrl: 'https://www.rfc-editor.org/rfc/rfc9309',
  },
  {
    name: 'sitemap.xml',
    path: '/sitemap.xml',
    what: 'A list of important site URLs, often with last-modified dates.',
    why: 'Helps search engines and many AI retrieval crawlers find pages without guessing the URL graph.',
    category: 'Content discovery',
    priority: 'Start here',
    maturity: 'Standard',
    spec: 'sitemaps.org',
    specUrl: 'https://www.sitemaps.org/protocol.html',
  },
  {
    name: 'llms.txt',
    path: '/llms.txt',
    what: 'A short Markdown summary of the site: identity plus links to the most important pages.',
    why: 'Gives language models a clean map instead of noisy HTML. Useful when an agent lands on the domain and needs orientation. Google has said llms.txt is not required for its generative search features.',
    category: 'Content discovery',
    priority: 'Start here',
    maturity: 'Adopted',
    spec: 'llmstxt.org',
    specUrl: 'https://llmstxt.org',
  },
  {
    name: 'JSON-LD (schema)',
    path: 'Inside HTML pages',
    what: 'Structured labels that declare entities such as Organization, Article, or FAQ on a page.',
    why: 'Machines extract facts more reliably from typed data than from prose alone.',
    category: 'Content structure',
    priority: 'Start here',
    maturity: 'Standard',
    spec: 'Schema.org',
    specUrl: 'https://schema.org',
  },
  {
    name: 'security.txt',
    path: '/.well-known/security.txt',
    what: 'Contact details for reporting security issues.',
    why: 'Operational hygiene. Not AI-specific; signals that the property is maintained.',
    category: 'Operations',
    priority: 'Start here',
    maturity: 'Standard',
    spec: 'RFC 9116',
    specUrl: 'https://www.rfc-editor.org/rfc/rfc9116',
  },
  {
    name: 'llms-full.txt',
    path: '/llms-full.txt',
    what: 'Markdown with fuller text of key pages, not only links.',
    why: 'Useful for documentation and reference sites that want fewer follow-up fetches.',
    category: 'Content discovery',
    priority: 'When it applies',
    maturity: 'Adopted',
    spec: 'llmstxt.org',
    specUrl: 'https://llmstxt.org',
  },
  {
    name: 'tdmrep.json',
    path: '/.well-known/tdmrep.json',
    what: 'Machine-readable notice that mining rights are reserved or not, under EU text-and-data-mining rules.',
    why: 'Relevant for formal opt-out signaling around mining and training, especially in EU copyright context. Complements robots.txt. Not legal advice.',
    category: 'Crawl control',
    priority: 'When it applies',
    maturity: 'Adopted',
    spec: 'W3C TDMRep',
    specUrl: 'https://www.w3.org/community/tdmrep/',
  },
  {
    name: 'agents.txt',
    path: '/agents.txt',
    what: 'Plain text that announces agent protocols the site supports (MCP, A2A card URLs, skills, payments).',
    why: 'Relevant when the site exposes tools or agent endpoints, not only articles.',
    category: 'Agent products',
    priority: 'When it applies',
    maturity: 'Emerging',
    spec: 'agents-txt.com',
    specUrl: 'https://agents-txt.com',
  },
  {
    name: 'agents.json',
    path: '/agents.json',
    what: 'Structured companion to agents.txt at the site root (not the A2A card path).',
    why: 'Same role as agents.txt with richer machine fields. Do not confuse with /.well-known/agent-card.json (A2A).',
    category: 'Agent products',
    priority: 'When it applies',
    maturity: 'Emerging',
    spec: 'agents-txt.com',
    specUrl: 'https://agents-txt.com',
  },
  {
    name: 'agent-card.json',
    path: '/.well-known/agent-card.json',
    what: 'A2A Protocol agent card: identity, skills, transports, security.',
    why: 'Only publish when a real A2A agent is running. Fake cards mislead other agents.',
    category: 'Agent products',
    priority: 'When it applies',
    maturity: 'Adopted',
    spec: 'A2A Protocol',
    specUrl: 'https://a2a-protocol.org/latest/specification/',
  },
  {
    name: 'openapi.json / openapi.yaml',
    path: '/openapi.json or /openapi.yaml',
    what: 'Machine contract for an HTTP API: paths, parameters, responses.',
    why: 'Required when agents should call the product over HTTP without human documentation.',
    category: 'Agent products',
    priority: 'When it applies',
    maturity: 'Standard',
    spec: 'OpenAPI 3.1',
    specUrl: 'https://spec.openapis.org/oas/v3.1.0',
  },
  {
    name: 'MCP Server Card',
    path: '/.well-known/mcp/server-card.json',
    what: 'Draft discovery document for Model Context Protocol servers.',
    why: 'Only when an MCP server is operated. Path and schema remain in flux across proposals.',
    category: 'Agent products',
    priority: 'When it applies',
    maturity: 'Proposed',
    spec: 'MCP',
    specUrl: 'https://modelcontextprotocol.io',
  },
  {
    name: 'Content-Signal',
    path: 'Inside robots.txt',
    what: 'Optional preference line for search, AI input, and training after content is accessed.',
    why: 'Complement to Allow/Disallow when finer usage policy is needed. Track AIPREF and Content Signals.',
    category: 'Crawl control',
    priority: 'When it applies',
    maturity: 'Proposed',
    spec: 'AIPREF / Content Signals',
    specUrl: 'https://datatracker.ietf.org/wg/aipref/about/',
  },
  {
    name: 'feed.xml / feed.json',
    path: '/feed.xml or /feed.json',
    what: 'RSS, Atom, or JSON Feed of new or updated posts.',
    why: 'Useful for regularly published content and freshness signals.',
    category: 'Content discovery',
    priority: 'When it applies',
    maturity: 'Standard',
    spec: 'RSS / JSON Feed',
    specUrl: 'https://jsonfeed.org/version/1.1',
  },
  {
    name: 'manifest.json',
    path: '/manifest.json',
    what: 'PWA metadata: name, icons, theme, display mode.',
    why: 'Browser install behavior. Not AI citation.',
    category: 'Operations',
    priority: 'When it applies',
    maturity: 'Standard',
    spec: 'W3C Web App Manifest',
    specUrl: 'https://www.w3.org/TR/appmanifest/',
  },
  {
    name: 'ads.txt',
    path: '/ads.txt',
    what: 'Public list of authorized digital ad sellers for the domain.',
    why: 'Ad fraud prevention when inventory is sold or to discourage unauthorized claims.',
    category: 'Operations',
    priority: 'When it applies',
    maturity: 'Standard',
    spec: 'IAB Tech Lab',
    specUrl: 'https://iabtechlab.com/ads-txt/',
  },
  {
    name: 'ai.txt / ai.json',
    path: '/ai.txt and /ai.json',
    what: 'Informal permissions summary and content map in text or JSON.',
    why: 'Optional documentation. Major model providers do not uniformly document honor of these files the way they document robots.txt tokens.',
    category: 'Optional',
    priority: 'Optional',
    maturity: 'Emerging',
    spec: 'Community',
  },
  {
    name: 'brand.txt',
    path: '/brand.txt',
    what: 'Preferred spelling, product names, and tone for brand description.',
    why: 'Useful for agents under operator control. Not a reliable control for consumer chatbots by default.',
    category: 'Optional',
    priority: 'Optional',
    maturity: 'Emerging',
    spec: 'Community',
  },
  {
    name: 'carbon.txt',
    path: '/carbon.txt',
    what: 'TOML links to sustainability disclosures (carbontxt.org format).',
    why: 'Environmental transparency reporting.',
    category: 'Optional',
    priority: 'Optional',
    maturity: 'Adopted',
    spec: 'carbontxt.org',
    specUrl: 'https://carbontxt.org',
  },
  {
    name: 'humans.txt',
    path: '/humans.txt',
    what: 'Credits for people and tools behind the site.',
    why: 'Human-readable provenance. Low machine criticality.',
    category: 'Optional',
    priority: 'Optional',
    maturity: 'Adopted',
    spec: 'humanstxt.org',
    specUrl: 'https://humanstxt.org',
  },
  {
    name: 'ai-plugin.json',
    path: '/.well-known/ai-plugin.json',
    what: 'Historical ChatGPT plugin manifest format.',
    why: 'Legacy. Prefer OpenAPI plus current tool integrations (MCP and current app patterns).',
    category: 'Optional',
    priority: 'Optional',
    maturity: 'Legacy',
    spec: 'OpenAI (legacy)',
  },
  {
    name: 'browserconfig.xml',
    path: '/browserconfig.xml',
    what: 'Windows tile config for pinned sites.',
    why: 'Legacy browser chrome. Not AI discovery.',
    category: 'Optional',
    priority: 'Optional',
    maturity: 'Legacy',
    spec: 'Microsoft',
  },
  {
    name: 'dnt-policy.txt',
    path: '/.well-known/dnt-policy.txt',
    what: 'EFF Do Not Track policy file.',
    why: 'Browser DNT is effectively obsolete. Keep only for a specific compliance reason.',
    category: 'Optional',
    priority: 'Optional',
    maturity: 'Legacy',
    spec: 'EFF DNT',
  },
  {
    name: '/.well-known/ai',
    path: '/.well-known/ai',
    what: 'IETF draft for a single JSON AI discovery document.',
    why: 'Watch-list until an RFC exists. Not required for ordinary sites today.',
    category: 'Optional',
    priority: 'Optional',
    maturity: 'Proposed',
    spec: 'IETF draft',
    specUrl: 'https://www.ietf.org/archive/id/draft-aiendpoint-ai-discovery-00.html',
  },
  {
    name: 'AGENTS.md / CLAUDE.md / Cursor rules',
    path: 'Inside a code repository',
    what: 'Instructions for coding assistants working on the codebase.',
    why: 'Developer tooling, not public web discovery.',
    category: 'Software repositories',
    priority: 'When it applies',
    maturity: 'Adopted',
    spec: 'Tool-specific',
  },
];

const AI_CRAWLERS: { company: string; bots: string[]; plain: string }[] = [
  {
    company: 'OpenAI',
    bots: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'OAI-AdsBot'],
    plain: 'GPTBot: training-related crawl. OAI-SearchBot: ChatGPT search indexing. ChatGPT-User: fetch when a person asks. OAI-AdsBot: ad landing-page checks.',
  },
  {
    company: 'Anthropic',
    bots: ['ClaudeBot', 'Claude-SearchBot', 'Claude-User'],
    plain: 'Training, search indexing, and user-triggered fetches. Anthropic documents that these honor robots.txt.',
  },
  {
    company: 'Google',
    bots: ['Googlebot', 'Google-Extended', 'GoogleOther'],
    plain: 'Googlebot powers Search (including surfaces that may appear in AI Overviews). Google-Extended is a control token for Gemini training and grounding, not always a separate crawler UA in logs.',
  },
  {
    company: 'Perplexity',
    bots: ['PerplexityBot', 'Perplexity-User'],
    plain: 'PerplexityBot builds the search index. Perplexity-User fetches when a person asks and generally ignores robots.txt.',
  },
  {
    company: 'Others',
    bots: ['Applebot', 'Amazonbot', 'meta-externalagent', 'CCBot', 'Bytespider', 'Bingbot'],
    plain: 'Apple, Amazon, Meta, Common Crawl, ByteDance, and Microsoft each run crawlers with distinct purposes. Prefer each vendor documentation and IP lists when certainty matters.',
  },
];

const CATEGORIES = [...new Set(DISCOVERY_FILES.map((f) => f.category))];

const MATURITY_STYLES: Record<Maturity, string> = {
  Standard: 'bg-gray-100 text-gray-800 border-gray-200',
  Adopted: 'bg-gray-100 text-gray-800 border-gray-200',
  Emerging: 'bg-gray-50 text-gray-600 border-gray-200',
  Proposed: 'bg-gray-50 text-gray-600 border-gray-200',
  Legacy: 'bg-gray-50 text-gray-500 border-gray-200',
};

const PRIORITY_STYLES: Record<Priority, string> = {
  'Start here': 'bg-gray-900 text-white border-gray-900',
  'When it applies': 'bg-gray-100 text-gray-800 border-gray-200',
  Optional: 'bg-gray-50 text-gray-600 border-gray-200',
};

export default function AiDiscoveryStandardsPage() {
  const startHere = DISCOVERY_FILES.filter((f) => f.priority === 'Start here');

  return (
    <>
      <header className="pt-12 md:pt-20 pb-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            AI Discovery Standards
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Reference and installer for the small website files that declare identity, content maps,
            and crawl policy to AI systems.
          </p>
          <AuthorByline
            links={[{ label: 'GitHub', href: 'https://github.com/vedangvatsa/aistandards' }]}
          />
          <nav
            aria-label="On this page"
            className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground"
          >
            <a href="#install" className="hover:text-primary transition-colors">
              Install
            </a>
            <a href="#first-five" className="hover:text-primary transition-colors">
              First five files
            </a>
            <a href="#training-vs-search" className="hover:text-primary transition-colors">
              Training vs search
            </a>
            <a href="#registry" className="hover:text-primary transition-colors">
              Catalog
            </a>
            <a href="#verify" className="hover:text-primary transition-colors">
              Verify
            </a>
          </nav>
        </div>
      </header>

      <div className="py-10 md:py-14">
        <article className="notion-article prose prose-lg prose-neutral max-w-5xl mx-auto">
          <div className="space-y-14 not-prose">

            <section id="install">
              <h2 className="text-2xl font-semibold tracking-tight mb-3">Install</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Run from the website project root. Pass the live production URL.
              </p>
              <div className="terminal-chrome rounded-lg overflow-hidden border mb-3">
                <div className="terminal-chrome-bar px-4 py-2 flex items-center gap-2">
                  <span className="inline-flex gap-1" aria-hidden>
                    <span className="h-2 w-2 rounded-full bg-zinc-600" />
                    <span className="h-2 w-2 rounded-full bg-zinc-600" />
                    <span className="h-2 w-2 rounded-full bg-zinc-600" />
                  </span>
                  <span className="text-xs font-medium">Terminal</span>
                </div>
                <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed">
                  <code>{`# Full auto
npx --yes github:vedangvatsa/aistandards --yes --scan --url=https://your-domain.com

# Block training crawlers
npx --yes github:vedangvatsa/aistandards --yes --scan --url=https://your-domain.com --deny-training`}</code>
                </pre>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Writes files to{' '}
                <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">public/</code> or{' '}
                <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">static/</code>, wires head tags when
                safe, leaves existing files unless{' '}
                <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">--force</code>. Review{' '}
                <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">llms.txt</code> and deploy to the domain
                root. Does not invent A2A, MCP, or payment endpoints.
              </p>
            </section>

            <section id="training-vs-search">
              <h2 className="text-2xl font-semibold tracking-tight mb-3">Training vs search</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Set bots separately in{' '}
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">robots.txt</code>. OpenAI treats{' '}
                <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">GPTBot</code> (training) and{' '}
                <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">OAI-SearchBot</code> (search) as
                independent. Some chat fetches may ignore robots.txt.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-lg border bg-card p-3.5">
                  <p className="text-sm font-medium text-foreground mb-1.5">Training</p>
                  <p className="text-xs text-muted-foreground mb-2 leading-snug">
                    Model training. Citations uncommon from this path alone.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {['GPTBot', 'ClaudeBot', 'CCBot', 'Google-Extended'].map((bot) => (
                      <code key={bot} className="text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded">{bot}</code>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-3.5">
                  <p className="text-sm font-medium text-foreground mb-1.5">Search and answers</p>
                  <p className="text-xs text-muted-foreground mb-2 leading-snug">
                    Indexing and retrieval that can cite and link to the site.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {['OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot'].map((bot) => (
                      <code key={bot} className="text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded">{bot}</code>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section id="first-five">
              <h2 className="text-2xl font-semibold tracking-tight mb-3">Five files most content sites need</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {startHere.map((file, i) => (
                  <div key={file.name} className="rounded-lg border bg-card p-3.5 flex flex-col min-h-0">
                    <div className="flex items-start gap-2 mb-1.5">
                      <span className="text-xs font-medium text-muted-foreground tabular-nums shrink-0 mt-0.5">
                        {i + 1}.
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground leading-snug">{file.name}</p>
                        <p className="text-[11px] font-mono text-muted-foreground truncate">{file.path}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug line-clamp-3">{file.what}</p>
                    <p className="text-xs text-muted-foreground leading-snug mt-1.5 line-clamp-2">{file.why}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="registry">
              <h2 className="text-2xl font-semibold tracking-tight mb-2">Catalog</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Expand a card for more detail and the official source when one exists.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-6">
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
                  <div key={category} id={slug} className="mb-8 last:mb-0">
                    <h3 className="text-base font-semibold tracking-tight mb-2.5 text-foreground">{category}</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {items.map((file) => (
                        <details
                          key={file.name}
                          className="rounded-lg border bg-card group open:ring-1 open:ring-border"
                        >
                          <summary className="p-3 cursor-pointer select-none hover:bg-muted/40 transition-colors list-none [&::-webkit-details-marker]:hidden">
                            <div className="flex flex-wrap items-center gap-1 mb-1.5">
                              <span className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border ${PRIORITY_STYLES[file.priority]}`}>
                                {file.priority}
                              </span>
                              <span className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border ${MATURITY_STYLES[file.maturity]}`}>
                                {file.maturity}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-foreground leading-snug">{file.name}</p>
                            <p className="text-[11px] font-mono text-muted-foreground truncate mt-0.5">{file.path}</p>
                            <p className="text-xs text-muted-foreground leading-snug mt-1.5 line-clamp-2 group-open:line-clamp-none">
                              {file.what}
                            </p>
                            <p className="text-[10px] text-muted-foreground/70 mt-1.5 group-open:hidden">
                              Expand for details
                            </p>
                          </summary>
                          <div className="px-3 pb-3 pt-0 space-y-1.5 border-t border-border/60">
                            <p className="text-xs text-muted-foreground leading-snug pt-2">{file.why}</p>
                            {file.specUrl ? (
                              <Link
                                href={file.specUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-[11px] text-muted-foreground hover:text-primary transition-colors"
                              >
                                {file.spec}
                              </Link>
                            ) : (
                              <span className="text-[11px] text-muted-foreground/60">{file.spec}</span>
                            )}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-3">Crawler names by company</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {AI_CRAWLERS.map((group) => (
                  <div key={group.company} className="rounded-lg border bg-card p-3.5">
                    <p className="text-sm font-medium text-foreground mb-1.5">{group.company}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {group.bots.map((bot) => (
                        <code key={bot} className="text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded">
                          {bot}
                        </code>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug line-clamp-3">{group.plain}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="verify">
              <h2 className="text-2xl font-semibold tracking-tight mb-3">Check after deploy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Confirm the files respond at the live domain root. Look for 200; a 404 usually means static files are
                not served at the root.
              </p>
              <div className="terminal-chrome rounded-lg overflow-hidden border">
                <div className="terminal-chrome-bar px-4 py-2 flex items-center gap-2">
                  <span className="text-xs font-medium">Terminal</span>
                </div>
                <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed">
                  <code>{`curl -sI https://your-domain.com/robots.txt | head -1
curl -sI https://your-domain.com/llms.txt | head -1
curl -sI https://your-domain.com/sitemap.xml | head -1
curl -sI https://your-domain.com/agents.txt | head -1
curl -sI https://your-domain.com/.well-known/security.txt | head -1`}</code>
                </pre>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-3">Prompt for a coding agent</h2>
              <div className="terminal-chrome rounded-lg overflow-hidden border">
                <div className="terminal-chrome-bar px-4 py-2">
                  <span className="text-xs font-medium">Prompt</span>
                </div>
                <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed whitespace-pre-wrap">
                  <code>{`Set up AI discovery for this project using:
https://github.com/vedangvatsa/aistandards

Run:
npx --yes github:vedangvatsa/aistandards --yes --scan --url=https://YOUR_DOMAIN

Review llms.txt, confirm training allow/deny, and do not advertise fake A2A or MCP endpoints.`}</code>
                </pre>
              </div>
            </section>

            <section>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
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
                <span className="text-xs text-muted-foreground/60">MIT · July 2026</span>
              </div>
            </section>
          </div>
        </article>
      </div>
    </>
  );
}

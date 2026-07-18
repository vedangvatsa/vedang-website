import Link from 'next/link';
import { AuthorByline } from '@/components/author-byline';

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
    what: 'A short Markdown summary of the site: identity plus links to the most important pages.',
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
    path: '/agents.json',
    what: 'Structured companion to agents.txt at the site root (not the A2A card path).',
    why: 'Richer machine fields for the agents.txt convention. Distinct from /.well-known/agent-card.json (A2A).',
    category: 'Agent products',
    priority: 'When it applies',
    spec: 'agents-txt.com',
    specUrl: 'https://agents-txt.com',
  },
  {
    name: 'agent-card.json',
    path: '/.well-known/agent-card.json',
    what: 'A2A Protocol agent card: identity, skills, transports, security.',
    why: 'Only worth publishing when a real A2A agent is running. Fake cards can mislead other agents.',
    category: 'Agent products',
    priority: 'When it applies',
    spec: 'A2A Protocol',
    specUrl: 'https://a2a-protocol.org/latest/specification/',
  },
  {
    name: 'openapi.json / openapi.yaml',
    path: '/openapi.json or /openapi.yaml',
    what: 'Machine contract for an HTTP API: paths, parameters, responses.',
    why: 'Useful when clients or agents should call the product over HTTP without relying only on human docs.',
    category: 'Agent products',
    priority: 'When it applies',
    spec: 'OpenAPI 3.1',
    specUrl: 'https://spec.openapis.org/oas/v3.1.0',
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
  return (
    <>
      <header className="pt-10 sm:pt-12 md:pt-20 pb-6 sm:pb-8">
        <div className="text-center min-w-0 px-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] break-words">
            AI Discovery Standards
          </h1>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-0">
            Reference files and an installer for declaring identity, content maps, and crawl preferences that AI systems
            may use. Outcomes vary by product and are not guaranteed.
          </p>
          <AuthorByline
            links={[{ label: 'GitHub', href: 'https://github.com/vedangvatsa/aistandards' }]}
          />
          <nav
            aria-label="On this page"
            className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground"
          >
            <a href="#install" className="hover:text-primary transition-colors">
              Install
            </a>
            <a href="#training-vs-search" className="hover:text-primary transition-colors">
              Training vs search
            </a>
            <a href="#registry" className="hover:text-primary transition-colors">
              Catalog
            </a>
            <a href="#crawlers" className="hover:text-primary transition-colors">
              Crawlers
            </a>
            <a href="#verify" className="hover:text-primary transition-colors">
              Verify
            </a>
          </nav>
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
                  <span className="inline-flex gap-1 shrink-0" aria-hidden>
                    <span className="h-2 w-2 rounded-full bg-zinc-600" />
                    <span className="h-2 w-2 rounded-full bg-zinc-600" />
                    <span className="h-2 w-2 rounded-full bg-zinc-600" />
                  </span>
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

            <section id="training-vs-search" className="min-w-0 scroll-mt-20">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-3">Training vs search</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 break-words">
                Many vendors publish separate bot names for different jobs. Prefer setting them separately in{' '}
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded break-all">robots.txt</code>. OpenAI documents{' '}
                <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded break-all">GPTBot</code> (training-related) and{' '}
                <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded break-all">OAI-SearchBot</code> (search) as
                independent choices. Some chat-time fetches may not fully honor robots.txt.
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
                              <span className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border ${PRIORITY_STYLES[file.priority]}`}>
                                {file.priority}
                              </span>
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
                  <code className="!whitespace-pre-wrap !break-words [overflow-wrap:anywhere]">{`Set up AI discovery for this project using:
https://github.com/vedangvatsa/aistandards

Run:
npx --yes github:vedangvatsa/aistandards --yes --scan --url=https://YOUR_DOMAIN

Review llms.txt, confirm training allow/deny, and do not advertise fake A2A or MCP endpoints.`}</code>
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
                <span className="text-xs text-muted-foreground/60">MIT · July 2026</span>
              </div>
            </section>
          </div>
        </article>
      </div>
    </>
  );
}

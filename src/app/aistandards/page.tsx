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
  basis: string;
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
    why: 'Primary practical control for AI companies that honor robots.txt. Search bots and training bots can be allowed or blocked independently.',
    basis: 'OpenAI, Anthropic, Google, and Perplexity publish bot names and document robots.txt behavior. Strongest for automatic crawlers; weaker for some user-triggered fetches.',
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
    basis: 'Long-standing crawl discovery protocol used across search engines. Improves URL discoverability; does not guarantee AI citations by itself.',
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
    why: 'Gives language models a clean map instead of noisy HTML. Useful when an agent lands on the domain and needs orientation.',
    basis: 'Widely adopted in tech; token-efficient site map. Not a proven ranking factor. Google states llms.txt is not required for its generative search features.',
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
    basis: 'Schema.org is standard for machine-readable page meaning and supports many search features. For AI answers, clearer structure helps; it is not a documented citation guarantee from major chat products.',
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
    basis: 'RFC 9116. Included for production completeness, not AI ranking.',
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
    basis: 'Extension of the llms.txt convention. Same evidence limits: helpful when read, not a universal ranking lever.',
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
    basis: 'Documented technical response to EU CDSM Art. 4. A rights signal, not a technical lock. Effect depends on whether miners respect machine-readable reservations.',
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
    basis: 'Community discovery format for agent capabilities. Valuable when agents look for it; low value for pure content sites.',
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
    why: 'Same role as agents.txt with richer machine fields.',
    basis: 'Paired with agents.txt. Same early-adoption caveat. Must not be confused with /.well-known/agent-card.json.',
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
    basis: 'A2A v1 defines this well-known path. Value is interoperability with A2A clients, not search ranking.',
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
    basis: 'Default industry contract for HTTP APIs. Any OpenAPI-capable client can use it. Engineering standard, not an AI-marketing claim.',
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
    basis: 'MCP is widely used for tool access; server cards are the proposed discovery layer. Draft maturity; list carefully.',
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
    basis: 'Direction of travel for preference vocabularies beyond crawl allow/deny. Not a replacement for vendor robots tokens today.',
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
    basis: 'Proven change-notification pattern for readers and aggregators. Not AI-specific.',
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
    basis: 'Common root web file the installer can emit. Not selected for AI answer impact.',
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
    basis: 'IAB Tech Lab standard. Unrelated to AI training or citations.',
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
    basis: 'Map completeness and custom-agent convenience. Weak evidence that large public chatbots systematically load them.',
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
    basis: 'Optional brand guidance. No strong public evidence that major consumer models fetch /brand.txt on every mention.',
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
    basis: 'Documented carbontxt.org convention. Not an AI discovery mechanism.',
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
    basis: 'Long-running web convention for credits. Negligible AI crawl effect.',
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
    basis: 'Documented so broken plugin setups are not reinvented. Not recommended for new work.',
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
    basis: 'Sometimes emitted with other root assets. No AI relevance.',
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
    basis: 'Map completeness. Not used for AI crawl control.',
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
    basis: 'Draft existence only. No RFC; not a deployment requirement.',
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
    basis: 'Coding agents load these files by product design. Separate problem from public AI search.',
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
        <article className="notion-article prose prose-lg prose-neutral max-w-4xl mx-auto">
          <div className="space-y-20 not-prose">

            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">
                Search traffic and training traffic are different
              </h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                <p>
                  ChatGPT, Claude, Perplexity, Gemini, and similar products pull from the public web.
                  Some crawlers support{' '}
                  <strong className="text-foreground font-medium">search and answers</strong>
                  , where a site can be cited. Others support{' '}
                  <strong className="text-foreground font-medium">model training</strong>
                  , where text may be absorbed with no link back.
                </p>
                <p>
                  Treating every AI bot as one switch is usually wrong. Allowing a search bot while blocking a training
                  bot (or the reverse) is a deliberate policy choice.
                </p>
                <p>
                  Agents that call APIs and tools need different discovery files than sites that only publish HTML.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Catalog and installer</h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                <p>
                  The catalog lists discovery files and crawler tokens with purpose, priority, maturity, and how strong
                  the evidence is. The installer scans a codebase, writes the practical file set into the static output
                  directory, and wires layout head tags when a safe injection point exists.
                </p>
                <p>
                  Neither guarantees rankings or citations. Both cut down wrong paths, mixed-up standards, and
                  half-finished setups.
                </p>
              </div>
            </section>

            <section id="install">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Install</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                Run from the website project root. Pass the public production URL so generated links resolve correctly.
              </p>
              <div className="terminal-chrome rounded-lg overflow-hidden border mb-4">
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
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  The tool detects project type, reads package.json when present, scans routes and content, writes
                  discovery files into{' '}
                  <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">public/</code> or{' '}
                  <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">static/</code>, and injects discovery
                  link tags plus Organization JSON-LD into the root layout when safe.
                </p>
                <p>
                  It does not invent live A2A endpoints, MCP servers, or payment rails. Existing files stay unless{' '}
                  <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">--force</code> is passed.
                </p>
                <p>
                  After it finishes, review{' '}
                  <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">llms.txt</code> for raw slug titles,
                  confirm training policy, deploy so root paths resolve on the live domain, and add FAQ or Article schema
                  on content pages where those types fit.
                </p>
                <p>
                  Source and flags on{' '}
                  <Link
                    href="https://github.com/vedangvatsa/aistandards"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    github.com/vedangvatsa/aistandards
                  </Link>
                  .
                </p>
              </div>
            </section>

            <section id="first-five">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Five files most content sites need</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                On a typical public content site, these five cover most crawl control and machine-readable identity.
              </p>
              <div className="space-y-px rounded-lg overflow-hidden border">
                {startHere.map((file, i) => (
                  <div key={file.name} className="bg-card p-4 sm:p-5">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-sm font-medium text-muted-foreground tabular-nums w-6 shrink-0">{i + 1}.</span>
                      <p className="text-base font-medium text-foreground min-w-0">
                        {file.name}{' '}
                        <span className="font-mono text-xs font-normal text-muted-foreground">{file.path}</span>
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed sm:pl-9">{file.what}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2 sm:pl-9">{file.why}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2 sm:pl-9">{file.basis}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">What makes the catalog</h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                <p>
                  A file lands in the catalog when there is a primary source (vendor docs, RFC, W3C report, or public
                  community spec), a clear technical role (OpenAPI as an HTTP API contract is a good example), or it is a
                  common root-site asset people already ship, so optional and legacy items can stay labeled honestly.
                </p>
                <p>
                  Vendor-published bot names and robots rules that show up in logs are the strongest evidence. Informal
                  files that major chat products have not promised to fetch are weaker. The installer leans on the strong
                  and medium cases and leaves weak ones optional.
                </p>
                <p>
                  No file here guarantees citations, traffic, or model behavior. These surfaces reduce ambiguity and
                  document controls. Content quality and crawl access still drive most outcomes.
                </p>
              </div>
            </section>

            <section id="training-vs-search">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Training vs search</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                Many AI companies publish different bot names for different jobs. Set them separately in{' '}
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">robots.txt</code>.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="rounded-lg border bg-card p-5">
                  <p className="text-base font-medium text-foreground mb-2">Training-related bots</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Collect text that may improve future models. Citation or click-through is uncommon from this path alone.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['GPTBot', 'ClaudeBot', 'CCBot', 'Google-Extended'].map((bot) => (
                      <code key={bot} className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{bot}</code>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-5">
                  <p className="text-base font-medium text-foreground mb-2">Search and answer bots</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Build indexes or fetch pages so a product can answer a question and sometimes link to the source.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot'].map((bot) => (
                      <code key={bot} className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{bot}</code>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-5 text-sm text-muted-foreground leading-relaxed space-y-2">
                <p>
                  On OpenAI, disallowing{' '}
                  <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">GPTBot</code> signals that crawled
                  content should not feed foundation-model training. Disallowing{' '}
                  <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">OAI-SearchBot</code> affects ChatGPT
                  search indexing. The company documents these as independent choices.
                </p>
                <p>
                  When a person is chatting and the product fetches one page for that request, some vendors say robots.txt
                  may not fully apply.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Priority and maturity tags</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                Each catalog row has two tags. They describe the file, not a score for any particular site.
              </p>

              <h3 className="text-lg font-semibold tracking-tight mb-3">Priority</h3>
              <div className="space-y-px rounded-lg overflow-hidden border mb-8">
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Start here</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Relevant for almost any public site that wants sane AI crawl behavior and basic machine-readable identity.
                    The installer emphasizes these first.
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">When it applies</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Relevant only in specific situations such as heavy publishing, EU mining opt-out, public APIs or agents,
                    or advertising inventory.
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Optional</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Documentation, legacy browser assets, or experiments. Safe to skip unless there is a specific reason.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold tracking-tight mb-3">Maturity</h3>
              <div className="space-y-px rounded-lg overflow-hidden border">
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Standard</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Formal standard (RFC or W3C Recommendation). Includes robots.txt, security.txt, and OpenAPI.
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Adopted</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Written and used in practice without a formal internet standard. Includes llms.txt and A2A agent cards.
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Emerging</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Community convention with uneven support. Includes agents.txt and brand.txt.
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Proposed</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Active draft. Spec or path may change. Includes some MCP discovery cards.
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Legacy</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Superseded or low impact. Includes old plugin manifests and browser DNT policy files.
                  </p>
                </div>
              </div>
            </section>

            <section id="registry">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Full catalog</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                Grouped by purpose. Expand a row for evidence notes and the official source when one exists.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {CATEGORIES.map((category) => {
                  const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  return (
                    <a
                      key={category}
                      href={`#${slug}`}
                      className="rounded-md border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
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
                  <div key={category} id={slug} className="mb-12 last:mb-0">
                    <h3 className="text-xl font-semibold tracking-tight mb-4">{category}</h3>
                    <div className="space-y-px rounded-lg overflow-hidden border">
                      {items.map((file) => (
                        <details key={file.name} className="bg-card group">
                          <summary className="p-4 sm:p-5 cursor-pointer select-none hover:bg-muted/30 transition-colors list-none [&::-webkit-details-marker]:hidden">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[file.priority]}`}>
                                {file.priority}
                              </span>
                              <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border ${MATURITY_STYLES[file.maturity]}`}>
                                {file.maturity}
                              </span>
                            </div>
                            <p className="text-base font-medium text-foreground">{file.name}</p>
                            <p className="text-xs font-mono text-muted-foreground mt-0.5">{file.path}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed mt-2">{file.what}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed mt-2">{file.why}</p>
                          </summary>
                          <div className="px-4 sm:px-5 pb-4 pt-0 space-y-2">
                            <p className="text-sm text-muted-foreground leading-relaxed">{file.basis}</p>
                            {file.specUrl ? (
                              <Link
                                href={file.specUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-xs text-muted-foreground hover:text-primary transition-colors"
                              >
                                Official specification ({file.spec})
                              </Link>
                            ) : (
                              <span className="text-xs text-muted-foreground/60">{file.spec}</span>
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
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Common crawler names</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                These show up in server logs and robots.txt. Check each company&apos;s own docs when the stakes are high.
              </p>
              <div className="space-y-px rounded-lg overflow-hidden border">
                {AI_CRAWLERS.map((group) => (
                  <div key={group.company} className="bg-card p-4 sm:p-5">
                    <p className="text-sm font-medium text-foreground mb-2">{group.company}</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {group.bots.map((bot) => (
                        <code key={bot} className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                          {bot}
                        </code>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{group.plain}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="verify">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Check after deploy</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                Local files only help if they are reachable at the live domain root. Swap in the domain and check status
                codes.
              </p>
              <div className="terminal-chrome rounded-lg overflow-hidden border mb-4">
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
              <p className="text-sm text-muted-foreground leading-relaxed">
                Expect <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">HTTP/2 200</code> (or 200 on HTTP/1.1).
                A 404 after a successful local install almost always means the host is not serving the static directory
                at the domain root.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Prompt for a coding agent</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                Paste this so the agent runs the installer instead of inventing formats.
              </p>
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
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Contribute</h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                <p>
                  The GitHub repo is public. Open issues or pull requests. Only maintainers with write access merge to
                  main.
                </p>
                <p>
                  Prefer contributions that cite a primary source (vendor docs, RFC, or published specification).
                </p>
                <p>
                  <Link
                    href="https://github.com/vedangvatsa/aistandards"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    Repository
                  </Link>
                  {' · '}
                  <Link
                    href="https://github.com/vedangvatsa/aistandards/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    Issues
                  </Link>
                  {' · '}
                  <Link
                    href="https://github.com/vedangvatsa/aistandards/pulls"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    Pull requests
                  </Link>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Also useful</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/sitecheck"
                  className="rounded-lg border bg-card p-5 hover:border-primary/50 transition-colors block"
                >
                  <span className="font-medium text-sm text-foreground">Site Checklist</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Production checklist covering security, accessibility, SEO, and agent readiness.
                  </p>
                </Link>
                <Link
                  href="https://github.com/vedangvatsa/aistandards"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border bg-card p-5 hover:border-primary/50 transition-colors block"
                >
                  <span className="font-medium text-sm text-foreground">Source on GitHub</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    CLI, templates, and longer technical notes.
                  </p>
                </Link>
              </div>
            </section>

            <p className="text-xs text-muted-foreground/60 text-center">
              MIT license. Last updated July 2026.
            </p>
          </div>
        </article>
      </div>
    </>
  );
}

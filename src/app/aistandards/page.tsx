import Link from 'next/link';
import { AuthorByline } from '@/components/author-byline';

// Landing page for https://github.com/vedangvatsa/ai-discovery-standards
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
            and crawl policy to AI systems. Maintained by Vedang Vatsa.
          </p>
          <AuthorByline
            links={[{ label: 'GitHub', href: 'https://github.com/vedangvatsa/ai-discovery-standards' }]}
          />
        </div>
      </header>

      <div className="py-10 md:py-14">
        <article className="notion-article prose prose-lg prose-neutral max-w-4xl mx-auto">
          <div className="space-y-20 not-prose">

            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">The problem</h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                <p>
                  Products such as ChatGPT, Claude, Perplexity, and Gemini pull information from the public web.
                  Automated crawlers and fetchers request pages. Some traffic supports{' '}
                  <strong className="text-foreground font-medium">search and answers</strong>
                  {' '}(where a site may be cited). Other traffic supports{' '}
                  <strong className="text-foreground font-medium">model training</strong>
                  {' '}(where text may be absorbed without a link back).
                </p>
                <p>
                  Those outcomes differ. Treating &quot;AI bots&quot; as a single switch is usually wrong.
                  Allowing a search bot while blocking a training bot (or the reverse) is a policy decision.
                </p>
                <p>
                  A second shift: software increasingly acts as an{' '}
                  <strong className="text-foreground font-medium">agent</strong>, calling APIs and tools rather than only reading HTML.
                  Content sites and tool-exposing products need different discovery files.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">What the project provides</h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground font-medium">AI Discovery Standards</strong> is an open-source
                  project by Vedang Vatsa with two parts:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong className="text-foreground font-medium">A catalog</strong>
                    {' '}of discovery files and crawler tokens: purpose, priority, maturity, and evidence strength.
                  </li>
                  <li>
                    <strong className="text-foreground font-medium">A command-line installer</strong>
                    {' '}that scans a codebase, writes the practical file set into the static output directory, and wires
                    layout head tags when a safe injection point exists.
                  </li>
                </ol>
                <p>
                  The project does not guarantee rankings or citations. It reduces wrong paths, mixed-up standards,
                  and half-finished setups.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Five files that cover most content sites</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                For a typical public content site, these five items address the majority of crawl-control and
                machine-readable identity needs.
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
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2 sm:pl-9">
                      <span className="text-foreground font-medium">Why it matters: </span>
                      {file.why}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2 sm:pl-9">
                      <span className="text-foreground font-medium">Evidence: </span>
                      {file.basis}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">How entries are chosen</h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                <p>An entry appears in the catalog when at least one of the following holds:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>A primary source exists (vendor documentation, RFC, W3C report, or public community specification).</li>
                  <li>A clear technical role exists (for example OpenAPI as an HTTP API contract).</li>
                  <li>The file is a common root-site asset people already emit, so optional and legacy items stay labeled honestly.</li>
                </ol>
                <p>
                  Evidence is strongest when a vendor publishes bot names and robots rules that can be verified in logs.
                  Evidence is weaker for informal files that major chat products have not promised to fetch.
                  The installer focuses on strong and medium cases; weak cases stay optional.
                </p>
                <p>
                  The catalog does not claim that adding any file guarantees citations, traffic, or model behavior.
                  These files reduce ambiguity and enable documented controls. Content quality and crawl access still
                  drive most outcomes.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Training is not the same as search</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                Many AI companies publish different bot names for different jobs. Configure them separately in{' '}
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
                  <strong className="text-foreground font-medium">Example (OpenAI):</strong> Disallowing{' '}
                  <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">GPTBot</code> signals that crawled
                  content should not feed foundation-model training. Disallowing{' '}
                  <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">OAI-SearchBot</code> affects ChatGPT
                  search indexing. OpenAI documents these as independent choices.
                </p>
                <p>
                  <strong className="text-foreground font-medium">Caveat:</strong> When a person is chatting and the product
                  fetches one page for that request, some vendors state that robots.txt may not fully apply.
                </p>
              </div>
            </section>

            <section id="install">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Installer</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                Run from the website project root (the folder that already holds the application code). Pass the public
                production URL so generated links resolve correctly.
              </p>
              <div className="rounded-lg overflow-hidden border mb-4">
                <div className="bg-muted px-4 py-2 border-b">
                  <span className="text-xs font-medium text-muted-foreground">Full auto</span>
                </div>
                <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed bg-card text-foreground">
                  <code>{`npx --yes github:vedangvatsa/ai-discovery-standards --yes --scan --url=https://your-domain.com`}</code>
                </pre>
              </div>
              <div className="rounded-lg overflow-hidden border mb-6">
                <div className="bg-muted px-4 py-2 border-b">
                  <span className="text-xs font-medium text-muted-foreground">Block training crawlers</span>
                </div>
                <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed bg-card text-foreground">
                  <code>{`npx --yes github:vedangvatsa/ai-discovery-standards --yes --scan --url=https://your-domain.com --deny-training`}</code>
                </pre>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground font-medium">Behavior:</strong> detects project type; reads package.json
                  when present; scans routes and content files; writes discovery files into{' '}
                  <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">public/</code> or{' '}
                  <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">static/</code>; injects discovery link tags
                  and Organization JSON-LD into the root layout when safe.
                </p>
                <p>
                  <strong className="text-foreground font-medium">Does not invent:</strong> live A2A endpoints, MCP servers,
                  or payment rails. Existing files are left alone unless{' '}
                  <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">--force</code> is passed.
                </p>
                <p>
                  <strong className="text-foreground font-medium">After the run:</strong> review{' '}
                  <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">llms.txt</code> for raw slug titles,
                  confirm the training policy, deploy so root paths resolve on the live domain, and add FAQ or Article
                  schema on individual content pages where appropriate.
                </p>
                <p>
                  Source and flags:{' '}
                  <Link
                    href="https://github.com/vedangvatsa/ai-discovery-standards"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    github.com/vedangvatsa/ai-discovery-standards
                  </Link>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Label meanings</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                Each catalog row carries two tags. They describe the file type, not a score for any particular site,
                and not a ranking of the open web.
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
                    Relevant only in specific situations: heavy publishing, EU mining opt-out needs, public APIs or agents,
                    advertising inventory, and similar cases.
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Optional</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Documentation, legacy browser assets, or experiments. Safe to skip for AI visibility unless a specific
                    reason exists.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold tracking-tight mb-3">Maturity</h3>
              <div className="space-y-px rounded-lg overflow-hidden border">
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Standard</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Formal standard (RFC or W3C Recommendation). Example: robots.txt, security.txt, OpenAPI.
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Adopted</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Written and used in practice without necessarily being a formal internet standard. Example: llms.txt,
                    A2A agent cards.
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Emerging</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Community convention with uneven support. Example: agents.txt, brand.txt.
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Proposed</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Active draft. Spec or path may change. Example: some MCP discovery cards.
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Legacy</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Superseded or low impact. Example: old plugin manifests, browser DNT policy files.
                  </p>
                </div>
              </div>
            </section>

            <section id="registry">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Catalog</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                Grouped by purpose. Expand a row for evidence notes and the official source when one exists.
              </p>

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
                            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                              <span className="text-foreground font-medium">Why: </span>
                              {file.why}
                            </p>
                          </summary>
                          <div className="px-4 sm:px-5 pb-4 pt-0 space-y-2">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              <span className="text-foreground font-medium">Evidence: </span>
                              {file.basis}
                            </p>
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
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Major crawler tokens</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                Names appear in server logs and in robots.txt. Prefer each company documentation when stakes are high.
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

            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Coding-agent setup prompt</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                Sample instruction for a coding agent so it runs the installer instead of inventing formats:
              </p>
              <div className="rounded-lg overflow-hidden border">
                <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed bg-card text-foreground whitespace-pre-wrap">
                  <code>{`Set up AI discovery for this project using:
https://github.com/vedangvatsa/ai-discovery-standards

Run:
npx --yes github:vedangvatsa/ai-discovery-standards --yes --scan --url=https://YOUR_DOMAIN

Review llms.txt, confirm training allow/deny, and do not advertise fake A2A or MCP endpoints.`}</code>
                </pre>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Repository and contributions</h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                <p>
                  The GitHub repository is public. External contributors open issues or pull requests. Changes reach
                  the main branch only when a maintainer with write access merges them. Outside accounts cannot push
                  directly to main.
                </p>
                <p>
                  Prefer contributions that cite a primary source (vendor docs, RFC, or published specification).
                </p>
                <p>
                  <Link
                    href="https://github.com/vedangvatsa/ai-discovery-standards"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    Repository
                  </Link>
                  {' · '}
                  <Link
                    href="https://github.com/vedangvatsa/ai-discovery-standards/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary"
                  >
                    Issues
                  </Link>
                  {' · '}
                  <Link
                    href="https://github.com/vedangvatsa/ai-discovery-standards/pulls"
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
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Related</h2>
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
                  href="https://github.com/vedangvatsa/ai-discovery-standards"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border bg-card p-5 hover:border-primary/50 transition-colors block"
                >
                  <span className="font-medium text-sm text-foreground">Source on GitHub</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    CLI, templates, and long technical reference.
                  </p>
                </Link>
              </div>
            </section>

            <p className="text-xs text-muted-foreground/60 text-center">
              MIT license. Maintained by Vedang Vatsa. Last updated July 2026.
            </p>
          </div>
        </article>
      </div>
    </>
  );
}

import Link from 'next/link';
import { AuthorByline } from '@/components/author-byline';

// Landing page for https://github.com/vedangvatsa/ai-discovery-standards
// Written for mixed audiences: site owners, marketers, and engineers.

type Maturity = 'Standard' | 'Adopted' | 'Emerging' | 'Proposed' | 'Legacy';
type Priority = 'Start here' | 'When it applies' | 'Optional';

interface DiscoveryFile {
  name: string;
  path: string;
  /** Plain-language purpose */
  what: string;
  /** Why a site owner might care */
  why: string;
  /**
   * Why we include it + what evidence exists that it matters.
   * Honest: not every file is proven to change AI answers.
   */
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
    what: 'A small text file at the root of your site that tells automated bots which pages they may crawl.',
    why: 'This is the main practical switch for AI companies that honor robots.txt. You can allow search bots and block training bots separately.',
    basis: 'Included because OpenAI, Anthropic, Google, and Perplexity publish official bot names and document robots.txt behavior. Evidence is strongest for automatic crawlers; weaker for some user-triggered fetches.',
    category: 'Control who may crawl you',
    priority: 'Start here',
    maturity: 'Standard',
    spec: 'RFC 9309',
    specUrl: 'https://www.rfc-editor.org/rfc/rfc9309',
  },
  {
    name: 'sitemap.xml',
    path: '/sitemap.xml',
    what: 'A list of the important URLs on your site, often with last-updated dates.',
    why: 'Helps search engines and many AI search crawlers find your pages without guessing.',
    basis: 'Included because sitemaps are a long-standing crawl discovery mechanism used across search engines. They improve discoverability of URLs; they do not by themselves guarantee AI citations.',
    category: 'Help machines find your pages',
    priority: 'Start here',
    maturity: 'Standard',
    spec: 'sitemaps.org',
    specUrl: 'https://www.sitemaps.org/protocol.html',
  },
  {
    name: 'llms.txt',
    path: '/llms.txt',
    what: 'A short Markdown summary of your site: who you are and links to the pages that matter most.',
    why: 'Gives language models a clean map instead of forcing them to parse every HTML page. Useful when an agent or researcher lands on your domain.',
    basis: 'Included because the format is widely adopted in tech and the logic (less HTML noise, clearer site map) is sound for agents. Not a proven ranking factor: Google has said you do not need llms.txt for its generative search features.',
    category: 'Help machines find your pages',
    priority: 'Start here',
    maturity: 'Adopted',
    spec: 'llmstxt.org',
    specUrl: 'https://llmstxt.org',
  },
  {
    name: 'JSON-LD (schema)',
    path: 'Inside your HTML pages',
    what: 'Structured labels in the page that say “this is an Organization,” “this is an Article,” “this is a FAQ,” and so on.',
    why: 'Search engines and many AI systems extract facts more reliably from structured data than from free-form prose alone.',
    basis: 'Included because Schema.org is standard for machine-readable page meaning and powers many search features. For AI answers, treat it as clearer structure, not a documented citation guarantee from ChatGPT or Claude.',
    category: 'Help machines understand your content',
    priority: 'Start here',
    maturity: 'Standard',
    spec: 'Schema.org',
    specUrl: 'https://schema.org',
  },
  {
    name: 'security.txt',
    path: '/.well-known/security.txt',
    what: 'Contact details for people who find security issues on your site.',
    why: 'Not AI-specific. Signals that the site is maintained professionally.',
    basis: 'Included as operational hygiene (RFC 9116), not because it changes AI crawl or citation behavior.',
    category: 'Trust and operations',
    priority: 'Start here',
    maturity: 'Standard',
    spec: 'RFC 9116',
    specUrl: 'https://www.rfc-editor.org/rfc/rfc9116',
  },
  {
    name: 'llms-full.txt',
    path: '/llms-full.txt',
    what: 'A longer Markdown file with fuller text of key pages, not just links.',
    why: 'Useful for documentation and reference sites that want agents to ingest core content in fewer requests.',
    basis: 'Included as an extension of the llms.txt convention for content-heavy sites. Same evidence limits as llms.txt: helpful when read, not proven as a universal ranking lever.',
    category: 'Help machines find your pages',
    priority: 'When it applies',
    maturity: 'Adopted',
    spec: 'llmstxt.org',
    specUrl: 'https://llmstxt.org',
  },
  {
    name: 'tdmrep.json',
    path: '/.well-known/tdmrep.json',
    what: 'A machine-readable notice that you reserve (or do not reserve) rights for text and data mining under EU rules.',
    why: 'Relevant if you need a formal opt-out signal for mining and training, especially for EU copyright context. Complements robots.txt; it is not a substitute for legal advice.',
    basis: 'Included because it is a documented technical response to EU CDSM Art. 4 opt-outs. It is a rights signal, not a technical lock: effect depends on whether miners respect machine-readable reservations.',
    category: 'Control who may crawl you',
    priority: 'When it applies',
    maturity: 'Adopted',
    spec: 'W3C TDMRep',
    specUrl: 'https://www.w3.org/community/tdmrep/',
  },
  {
    name: 'agents.txt',
    path: '/agents.txt',
    what: 'A plain-text file that announces what agent protocols your site supports (for example MCP tools or an A2A agent card).',
    why: 'Useful only if your site can do something for agents, not only publish articles. Empty or commented files are fine until you have real endpoints.',
    basis: 'Included for agent-to-site capability discovery (MCP, A2A pointers, skills). Early community spec; works when agents look for it, not when you only publish articles.',
    category: 'If your site is a product agents can use',
    priority: 'When it applies',
    maturity: 'Emerging',
    spec: 'agents-txt.com',
    specUrl: 'https://agents-txt.com',
  },
  {
    name: 'agents.json',
    path: '/agents.json',
    what: 'The structured companion to agents.txt (same idea, richer machine-readable detail). Lives at the site root.',
    why: 'Same as agents.txt. Do not confuse this with the A2A Agent Card path below.',
    basis: 'Included with agents.txt as the machine-readable twin. Same early-adoption caveat.',
    category: 'If your site is a product agents can use',
    priority: 'When it applies',
    maturity: 'Emerging',
    spec: 'agents-txt.com',
    specUrl: 'https://agents-txt.com',
  },
  {
    name: 'agent-card.json',
    path: '/.well-known/agent-card.json',
    what: 'A business card for an autonomous agent under the A2A protocol: name, skills, how to talk to it.',
    why: 'Only publish this if you actually run an A2A-compatible agent. Advertising a fake card misleads other agents.',
    basis: 'Included because A2A v1 defines this well-known path for agent discovery. Evidence of value is interoperability with A2A clients, not better search rankings.',
    category: 'If your site is a product agents can use',
    priority: 'When it applies',
    maturity: 'Adopted',
    spec: 'A2A Protocol',
    specUrl: 'https://a2a-protocol.org/latest/specification/',
  },
  {
    name: 'openapi.json / openapi.yaml',
    path: '/openapi.json or /openapi.yaml',
    what: 'A precise description of your HTTP API: endpoints, parameters, responses.',
    why: 'If agents should call your product over HTTP, this is the contract they can follow without human docs.',
    basis: 'Included because OpenAPI is the default machine contract for HTTP APIs. Any agent or SDK that can read OpenAPI can use it; this is engineering reality, not AI marketing.',
    category: 'If your site is a product agents can use',
    priority: 'When it applies',
    maturity: 'Standard',
    spec: 'OpenAPI 3.1',
    specUrl: 'https://spec.openapis.org/oas/v3.1.0',
  },
  {
    name: 'MCP Server Card',
    path: '/.well-known/mcp/server-card.json',
    what: 'A draft discovery document for Model Context Protocol servers (tools an AI host can connect to).',
    why: 'Only if you operate an MCP server. The exact path and format are still settling across proposals.',
    basis: 'Included because MCP is widely used for tool access and server cards are the proposed discovery layer. Path and schema are still draft-level, so list it carefully.',
    category: 'If your site is a product agents can use',
    priority: 'When it applies',
    maturity: 'Proposed',
    spec: 'MCP',
    specUrl: 'https://modelcontextprotocol.io',
  },
  {
    name: 'Content-Signal',
    path: 'Inside robots.txt',
    what: 'An optional line that states preferences for search, AI input, and training after content is accessed.',
    why: 'Emerging complement to Allow/Disallow. Track IETF AIPREF and Cloudflare Content Signals if you need finer policy language.',
    basis: 'Included as the direction of travel for preference vocabularies beyond crawl allow/deny. Still maturing; not a replacement for vendor-specific robots tokens today.',
    category: 'Control who may crawl you',
    priority: 'When it applies',
    maturity: 'Proposed',
    spec: 'AIPREF / Content Signals',
    specUrl: 'https://datatracker.ietf.org/wg/aipref/about/',
  },
  {
    name: 'feed.xml / feed.json',
    path: '/feed.xml or /feed.json',
    what: 'A feed of new or updated posts in RSS, Atom, or JSON Feed form.',
    why: 'Good if you publish regularly and want updates discoverable without full-site crawls.',
    basis: 'Included because feeds are a proven change-notification pattern for readers and aggregators. Helpful for freshness; not AI-specific.',
    category: 'Help machines find your pages',
    priority: 'When it applies',
    maturity: 'Standard',
    spec: 'RSS / JSON Feed',
    specUrl: 'https://jsonfeed.org/version/1.1',
  },
  {
    name: 'manifest.json',
    path: '/manifest.json',
    what: 'App name, icons, and theme for installable web apps (PWA).',
    why: 'Browser and mobile install behavior, not AI citation. Still part of a complete site package.',
    basis: 'Included for completeness of common root web files the auto-tool can emit. Not selected for AI answer impact.',
    category: 'Trust and operations',
    priority: 'When it applies',
    maturity: 'Standard',
    spec: 'W3C Web App Manifest',
    specUrl: 'https://www.w3.org/TR/appmanifest/',
  },
  {
    name: 'ads.txt',
    path: '/ads.txt',
    what: 'Public list of who is allowed to sell ads on your domain.',
    why: 'Ad fraud prevention. Include a declarative file even if you do not sell ads if you want to discourage unauthorized inventory claims.',
    basis: 'Included as IAB standard site hygiene when ads matter. Unrelated to AI training or citations.',
    category: 'Trust and operations',
    priority: 'When it applies',
    maturity: 'Standard',
    spec: 'IAB Tech Lab',
    specUrl: 'https://iabtechlab.com/ads-txt/',
  },
  {
    name: 'ai.txt / ai.json',
    path: '/ai.txt and /ai.json',
    what: 'Informal files that restate AI permissions and a content map in plain text or JSON.',
    why: 'Optional documentation. Major model providers do not uniformly promise to honor these the way they document robots.txt tokens.',
    basis: 'Included so the map is complete and agents you control can read a single permissions summary. Weak evidence that large public models systematically load these files.',
    category: 'Optional conventions',
    priority: 'Optional',
    maturity: 'Emerging',
    spec: 'Community',
  },
  {
    name: 'brand.txt',
    path: '/brand.txt',
    what: 'Preferred spelling, product names, and tone for how you want to be described.',
    why: 'Helpful for agents you control. Do not assume ChatGPT or Claude automatically load this file on every brand mention.',
    basis: 'Included as optional brand guidance. Logic is sound for custom agents; no strong public evidence that major consumer chatbots fetch /brand.txt by default.',
    category: 'Optional conventions',
    priority: 'Optional',
    maturity: 'Emerging',
    spec: 'Community',
  },
  {
    name: 'carbon.txt',
    path: '/carbon.txt',
    what: 'A TOML file with links to sustainability disclosures (carbontxt.org format).',
    why: 'Transparency for environmental reporting, not AI ranking.',
    basis: 'Included as a documented Green Web / carbontxt.org convention. Not an AI discovery mechanism.',
    category: 'Optional conventions',
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
    basis: 'Included as a long-running web convention for credits. Negligible AI crawl effect.',
    category: 'Optional conventions',
    priority: 'Optional',
    maturity: 'Adopted',
    spec: 'humanstxt.org',
    specUrl: 'https://humanstxt.org',
  },
  {
    name: 'ai-plugin.json',
    path: '/.well-known/ai-plugin.json',
    what: 'Old ChatGPT plugin manifest format.',
    why: 'Legacy. Prefer a real OpenAPI document and modern tool integrations (MCP / current OpenAI app patterns).',
    basis: 'Included only so people recognize the historical path and do not reinvent broken plugin setups. Not recommended for new work.',
    category: 'Optional conventions',
    priority: 'Optional',
    maturity: 'Legacy',
    spec: 'OpenAI (legacy)',
  },
  {
    name: 'browserconfig.xml',
    path: '/browserconfig.xml',
    what: 'Windows tile images for pinned sites.',
    why: 'Legacy browser chrome. Not related to AI discovery.',
    basis: 'Included only because site generators often emit it with other root assets. No AI relevance.',
    category: 'Optional conventions',
    priority: 'Optional',
    maturity: 'Legacy',
    spec: 'Microsoft',
  },
  {
    name: 'dnt-policy.txt',
    path: '/.well-known/dnt-policy.txt',
    what: 'EFF Do Not Track policy file.',
    why: 'Browser DNT is effectively obsolete. Keep only if you have a specific compliance reason.',
    basis: 'Included for map completeness. Browser DNT is effectively dead; not used for AI crawl control.',
    category: 'Optional conventions',
    priority: 'Optional',
    maturity: 'Legacy',
    spec: 'EFF DNT',
  },
  {
    name: '/.well-known/ai',
    path: '/.well-known/ai',
    what: 'Draft IETF idea for a single JSON discovery document for AI agents.',
    why: 'Watch-list only until it becomes an RFC. Not required for normal sites today.',
    basis: 'Included so implementers know the draft exists. No RFC yet; not a deployment requirement.',
    category: 'Optional conventions',
    priority: 'Optional',
    maturity: 'Proposed',
    spec: 'IETF draft',
    specUrl: 'https://www.ietf.org/archive/id/draft-aiendpoint-ai-discovery-00.html',
  },
  {
    name: 'AGENTS.md / CLAUDE.md / Cursor rules',
    path: 'Inside your code repository',
    what: 'Instructions for coding assistants working on your codebase.',
    why: 'Developer tooling, not public web discovery. Useful if you ship software, not for ranking in ChatGPT.',
    basis: 'Included because coding agents actually load these repo files by product design. Different problem from public web AI search.',
    category: 'For software repositories',
    priority: 'When it applies',
    maturity: 'Adopted',
    spec: 'Tool-specific',
  },
];

const AI_CRAWLERS: { company: string; bots: string[]; plain: string }[] = [
  {
    company: 'OpenAI',
    bots: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'OAI-AdsBot'],
    plain: 'GPTBot is about training data. OAI-SearchBot is about ChatGPT search. ChatGPT-User fetches a page when a person asks. OAI-AdsBot checks ad landing pages.',
  },
  {
    company: 'Anthropic',
    bots: ['ClaudeBot', 'Claude-SearchBot', 'Claude-User'],
    plain: 'Same split as OpenAI: training, search indexing, and user-triggered fetches. Anthropic documents that these honor robots.txt.',
  },
  {
    company: 'Google',
    bots: ['Googlebot', 'Google-Extended', 'GoogleOther'],
    plain: 'Googlebot powers Search (including features that may appear in AI Overviews). Google-Extended is a control token for Gemini training and grounding, not a separate crawler you will always see in logs.',
  },
  {
    company: 'Perplexity',
    bots: ['PerplexityBot', 'Perplexity-User'],
    plain: 'PerplexityBot builds their search index. Perplexity-User fetches when a person asks and generally ignores robots.txt.',
  },
  {
    company: 'Others',
    bots: ['Applebot', 'Amazonbot', 'meta-externalagent', 'CCBot', 'Bytespider', 'Bingbot'],
    plain: 'Apple, Amazon, Meta, Common Crawl, ByteDance, and Microsoft each run crawlers with their own purposes. Prefer each vendor’s documentation and IP lists when you need certainty.',
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
            A practical guide to the small files on your website that tell AI systems who you are,
            what you publish, and whether they may crawl or train on it, plus a free tool that adds
            them for you.
          </p>
          <AuthorByline
            links={[{ label: 'GitHub', href: 'https://github.com/vedangvatsa/ai-discovery-standards' }]}
          />
        </div>
      </header>

      <div className="py-10 md:py-14">
        <article className="notion-article prose prose-lg prose-neutral max-w-4xl mx-auto">
          <div className="space-y-20 not-prose">

            {/* The situation */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">The situation in plain terms</h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                <p>
                  When people use ChatGPT, Claude, Perplexity, Gemini, or similar tools, those systems often need
                  fresh information from the public web. They send automated programs (crawlers and fetchers) to
                  read pages. Some of that activity is for <strong className="text-foreground font-medium">search and answers</strong>
                  {' '}(where your site might be cited). Some of it is for <strong className="text-foreground font-medium">model training</strong>
                  {' '}(where your words may be absorbed without a link back to you).
                </p>
                <p>
                  Those are different outcomes. Blocking “AI” as if it were one switch usually is not accurate.
                  Allowing a search bot and blocking a training bot (or the reverse) is a business and policy choice,
                  not a technical accident.
                </p>
                <p>
                  Separately, more software is starting to act as an <strong className="text-foreground font-medium">agent</strong>:
                  not only reading your pages, but calling your APIs or tools. That needs different files than a blog needs.
                  This project separates “publish content for humans and AI readers” from “expose tools for agents.”
                </p>
              </div>
            </section>

            {/* What this project is */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">What this project is</h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground font-medium">AI Discovery Standards</strong> is an open-source
                  project with two jobs:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong className="text-foreground font-medium">Explain the map</strong> — which files exist,
                    what each one is for, how reliable the underlying rule is, and which ones most sites should care about first.
                  </li>
                  <li>
                    <strong className="text-foreground font-medium">Implement the practical set</strong> — a command-line
                    tool that scans your project and writes the common files into the right folders, then hooks them into
                    your site layout when it safely can.
                  </li>
                </ol>
                <p>
                  It does not make your content “rank” by magic. It reduces confusion, wrong paths, and half-finished
                  setups when people (or coding agents) try to make a site ready for AI crawlers and tools.
                </p>
              </div>
            </section>

            {/* What to do first */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">What most sites should do first</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                If you only do five things, do these. They cover the majority of real-world AI crawl and citation behavior
                for content sites.
              </p>
              <div className="space-y-px rounded-lg overflow-hidden border">
                {startHere.map((file, i) => (
                  <div key={file.name} className="bg-card p-4 sm:p-5">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-sm font-medium text-muted-foreground tabular-nums w-6 shrink-0">{i + 1}.</span>
                      <div className="min-w-0">
                        <p className="text-base font-medium text-foreground">
                          {file.name}{' '}
                          <span className="font-mono text-xs font-normal text-muted-foreground">{file.path}</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed sm:pl-9">{file.what}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2 sm:pl-9">
                      <span className="text-foreground font-medium">Why it matters: </span>
                      {file.why}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2 sm:pl-9">
                      <span className="text-foreground font-medium">Basis: </span>
                      {file.basis}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Inclusion logic */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Why these files are on the list</h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                <p>
                  We do not claim every file “works” the same way. Inclusion follows a simple filter:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong className="text-foreground font-medium">Primary source exists</strong>
                    {' '}(vendor docs, RFC, W3C report, or a public community spec), or
                  </li>
                  <li>
                    <strong className="text-foreground font-medium">Clear technical role</strong>
                    {' '}(for example OpenAPI as an API contract), or
                  </li>
                  <li>
                    <strong className="text-foreground font-medium">Common root-site file</strong>
                    {' '}people already emit, so the map stays honest about optional and legacy items.
                  </li>
                </ol>
                <p>
                  Evidence is strongest when a company publishes bot names and robots.txt rules you can test in logs.
                  Evidence is weaker for informal files that major chat products have not promised to fetch.
                  The auto-tool focuses on the strong and medium cases; weak cases stay optional.
                </p>
                <p>
                  What we do <strong className="text-foreground font-medium">not</strong> claim: that adding any of these
                  files guarantees citations, traffic, or model behavior. They reduce ambiguity and enable documented controls.
                  Content quality and crawl access still do most of the work.
                </p>
              </div>
            </section>

            {/* Training vs search */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Training is not the same as search</h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed mb-6">
                <p>
                  Many AI companies publish different bot names for different jobs. You configure them separately in{' '}
                  <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">robots.txt</code>.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="rounded-lg border bg-card p-5">
                  <p className="text-base font-medium text-foreground mb-2">Training-related bots</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Collect text that may improve future models. You usually will not get a citation or click from this
                    activity alone.
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
                    Build indexes or fetch pages so the product can answer a user’s question and sometimes link to you.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot'].map((bot) => (
                      <code key={bot} className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{bot}</code>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-5 text-sm text-muted-foreground leading-relaxed">
                <p className="mb-2">
                  <strong className="text-foreground font-medium">Example (OpenAI):</strong> Disallowing{' '}
                  <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">GPTBot</code> signals that crawled
                  content should not be used for foundation-model training. Disallowing{' '}
                  <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">OAI-SearchBot</code> affects whether
                  you appear in ChatGPT search results. OpenAI documents these as independent choices.
                </p>
                <p>
                  <strong className="text-foreground font-medium">Caveat:</strong> When a human is actively chatting and
                  the product fetches one page for that person (user-triggered fetchers), some vendors say robots.txt
                  may not fully apply. Treat those cases as imperfect control.
                </p>
              </div>
            </section>

            {/* How to run the tool */}
            <section id="install">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">How to add the files automatically</h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed mb-6">
                <p>
                  From the root of your website project (the folder that already has your code), run one command.
                  Prefer your real public URL so generated links are correct.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden border mb-4">
                <div className="bg-muted px-4 py-2 border-b">
                  <span className="text-xs font-medium text-muted-foreground">Recommended</span>
                </div>
                <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed bg-card text-foreground">
                  <code>{`npx --yes github:vedangvatsa/ai-discovery-standards --yes --scan --url=https://your-domain.com`}</code>
                </pre>
              </div>
              <div className="rounded-lg overflow-hidden border mb-6">
                <div className="bg-muted px-4 py-2 border-b">
                  <span className="text-xs font-medium text-muted-foreground">If you want to block training crawlers</span>
                </div>
                <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed bg-card text-foreground">
                  <code>{`npx --yes github:vedangvatsa/ai-discovery-standards --yes --scan --url=https://your-domain.com --deny-training`}</code>
                </pre>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground font-medium">What the tool does:</strong> it looks at your project
                  type, reads basic metadata from package.json when present, scans pages and content files, writes
                  discovery files into <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">public/</code> or{' '}
                  <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">static/</code>, and when possible
                  adds link tags and Organization structured data to your root layout.
                </p>
                <p>
                  <strong className="text-foreground font-medium">What it will not invent:</strong> a live agent API,
                  an MCP server, or payment flows. It will not overwrite files you already have unless you pass{' '}
                  <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">--force</code>.
                </p>
                <p>
                  <strong className="text-foreground font-medium">After it runs:</strong> open{' '}
                  <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">llms.txt</code> and fix titles that
                  look like raw folder names, confirm the training policy, deploy so files are reachable at your domain
                  root, and add FAQ or Article schema on individual content pages where that fits.
                </p>
                <p>
                  Full source and flags:{' '}
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

            {/* Maturity explained without fake scoreboard */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">What the small labels on each file mean</h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed mb-6">
                <p>
                  In the list below, every file has two kinds of tags. They are <strong className="text-foreground font-medium">not scores</strong>,
                  and the numbers of files in each bucket are not rankings of the internet. They only describe how we
                  classify the files documented in this project.
                </p>
              </div>

              <h3 className="text-lg font-semibold tracking-tight mb-3">Priority: should you bother?</h3>
              <div className="space-y-px rounded-lg overflow-hidden border mb-8">
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Start here</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Worth doing for almost any public site that wants sane AI crawl behavior and basic machine-readable identity.
                    The automated tool focuses on these first.
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">When it applies</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Important only in certain situations: you publish a lot, you need EU mining opt-out signaling,
                    you expose an API or agent, you run ads, and so on. Skip if that situation is not yours.
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Optional</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Nice documentation, legacy browser files, or experiments. Safe to ignore for AI visibility unless you
                    have a specific reason.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold tracking-tight mb-3">Maturity: how solid is the underlying rule?</h3>
              <div className="space-y-px rounded-lg overflow-hidden border">
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Standard</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Formal standard from a standards body (for example an RFC or W3C Recommendation). Example: robots.txt,
                    security.txt, OpenAPI. Expect clear documentation and broad tooling support.
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Adopted</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Written down and used in the wild, but not necessarily a formal internet standard. Example: llms.txt,
                    A2A agent cards, TDMRep community report. Real, but still evolving.
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Emerging</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Community convention with incomplete or uneven support. Example: agents.txt, brand.txt.
                    Fine to use; do not treat as guaranteed compliance.
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Proposed</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Active draft. Spec or path may change. Example: some MCP discovery cards, IETF AI discovery endpoint.
                    Watch, do not bet a legal strategy on the draft alone.
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium text-foreground mb-1">Legacy</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Superseded, low impact, or historical. Example: old ChatGPT plugin manifests, browser DNT policy files.
                    Usually skip for new work.
                  </p>
                </div>
              </div>
            </section>

            {/* Full catalog by category */}
            <section id="registry">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Full catalog</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                Grouped by purpose. Expand a row for the official source when one exists.
              </p>

              {CATEGORIES.map((category) => {
                const items = DISCOVERY_FILES.filter((f) => f.category === category);
                const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return (
                  <div key={category} id={slug} className="mb-12 last:mb-0">
                    <h3 className="text-xl font-semibold tracking-tight mb-2">{category}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </p>
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
                            <p className="text-base font-medium text-foreground">
                              {file.name}
                            </p>
                            <p className="text-xs font-mono text-muted-foreground mt-0.5">{file.path}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed mt-2">{file.what}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                              <span className="text-foreground font-medium">Why: </span>
                              {file.why}
                            </p>
                          </summary>
                          <div className="px-4 sm:px-5 pb-4 pt-0 space-y-2">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              <span className="text-foreground font-medium">Basis: </span>
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

            {/* Crawlers */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Who the major bots are</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                Bot names appear in your server logs and in robots.txt. Prefer each company’s own documentation
                when the stakes are high.
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

            {/* Agent prompt */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">If you hand this to a coding agent</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                Paste something like this so the agent runs the tool instead of inventing file formats:
              </p>
              <div className="rounded-lg overflow-hidden border">
                <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed bg-card text-foreground whitespace-pre-wrap">
                  <code>{`Set up AI discovery for this project using:
https://github.com/vedangvatsa/ai-discovery-standards

Run:
npx --yes github:vedangvatsa/ai-discovery-standards --yes --scan --url=https://YOUR_DOMAIN

Then review llms.txt, confirm training allow/deny, and do not advertise fake A2A or MCP endpoints.`}</code>
                </pre>
              </div>
            </section>

            {/* Contribute */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Contributing and control of the repo</h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                <p>
                  The repository is public. Anyone can open an issue or a pull request. Changes only land on the main
                  branch if a maintainer with write access merges them. Strangers cannot push code into the project
                  without that merge step.
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

            {/* Related */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Related</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/sitecheck"
                  className="rounded-lg border bg-card p-5 hover:border-primary/50 transition-colors block"
                >
                  <span className="font-medium text-sm text-foreground">Site Checklist</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Broader production checklist: security, accessibility, SEO, and agent readiness.
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
                    CLI, templates, and the long technical reference.
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

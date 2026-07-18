import Link from 'next/link';
import { AuthorByline } from '@/components/author-byline';
import { PageHero } from '@/components/page-hero';

// Keep aligned with https://github.com/vedangvatsa/ai-discovery-standards (verified Q3 2026)

type Status = 'Standard' | 'Adopted' | 'Emerging' | 'Proposed' | 'Legacy';

interface DiscoveryFile {
  name: string;
  path: string;
  desc: string;
  category: string;
  spec: string;
  specUrl?: string;
  status: Status;
}

const DISCOVERY_FILES: DiscoveryFile[] = [
  // Access Control
  { name: 'robots.txt', path: '/robots.txt', desc: 'Crawler access control (RFC 9309). Primary practical lever for AI bots. Training tokens (GPTBot, ClaudeBot) are independent from search tokens (OAI-SearchBot, PerplexityBot, Claude-SearchBot).', category: 'Access Control', spec: 'RFC 9309', specUrl: 'https://www.rfc-editor.org/rfc/rfc9309', status: 'Standard' },
  { name: 'Content-Signal', path: '/robots.txt (directive)', desc: 'Optional usage preferences for search vs AI input vs training (Cloudflare Content Signals; related IETF AIPREF work). Complements robots Allow/Disallow.', category: 'Access Control', spec: 'AIPREF / Content Signals', specUrl: 'https://datatracker.ietf.org/wg/aipref/about/', status: 'Proposed' },
  { name: 'ai.txt', path: '/ai.txt', desc: 'Informal AI usage preferences (training, citation, indexing, summarization). Not a formal standard; does not replace robots.txt, TDMRep, or AIPREF.', category: 'Access Control', spec: 'Community', status: 'Emerging' },
  { name: 'tdmrep.json', path: '/.well-known/tdmrep.json', desc: 'W3C TDMRep site file: JSON array of location rules with tdm-reservation and optional tdm-policy. EU CDSM Art. 4 opt-out signal. Also supports HTTP headers and HTML meta.', category: 'Access Control', spec: 'W3C TDMRep CG', specUrl: 'https://www.w3.org/community/tdmrep/', status: 'Adopted' },

  // Content Discovery
  { name: 'llms.txt', path: '/llms.txt', desc: 'Community Markdown summary for LLMs: H1, blockquote blurb, curated links. Not IETF/W3C. Created by Jeremy Howard (Answer.AI), 2024.', category: 'Content Discovery', spec: 'llmstxt.org', specUrl: 'https://llmstxt.org', status: 'Adopted' },
  { name: 'llms-full.txt', path: '/llms-full.txt', desc: 'Optional full-text companion to llms.txt for deep ingestion of key pages.', category: 'Content Discovery', spec: 'llmstxt.org', specUrl: 'https://llmstxt.org', status: 'Adopted' },
  { name: 'sitemap.xml', path: '/sitemap.xml', desc: 'URL inventory with lastmod and related hints. Used by search engines and many AI retrieval crawlers.', category: 'Content Discovery', spec: 'sitemaps.org', specUrl: 'https://www.sitemaps.org/protocol.html', status: 'Standard' },
  { name: 'feed.xml', path: '/feed.xml', desc: 'RSS/Atom syndication feed for chronological updates.', category: 'Content Discovery', spec: 'RSS 2.0 / Atom', status: 'Standard' },
  { name: 'feed.json', path: '/feed.json', desc: 'JSON Feed 1.1, a machine-friendly alternative to RSS/Atom.', category: 'Content Discovery', spec: 'JSON Feed 1.1', specUrl: 'https://jsonfeed.org/version/1.1', status: 'Adopted' },

  // Agent Discovery
  { name: 'agents.txt', path: '/agents.txt', desc: 'agents-txt.com capability announcement: MCP, A2A card URLs, skills, payments, auth, UCP, WebMCP. Plain-text, robots-like syntax.', category: 'Agent Discovery', spec: 'agents-txt.com', specUrl: 'https://agents-txt.com', status: 'Emerging' },
  { name: 'agents.json', path: '/agents.json', desc: 'agents-txt.com JSON companion at site root (not A2A). Structured catalog of MCP/A2A/skills/payments metadata.', category: 'Agent Discovery', spec: 'agents-txt.com', specUrl: 'https://agents-txt.com', status: 'Emerging' },
  { name: 'agent-card.json', path: '/.well-known/agent-card.json', desc: 'A2A Protocol Agent Card (Linux Foundation). Canonical path is agent-card.json, not agents.json. Identity, transports, skills, security.', category: 'Agent Discovery', spec: 'A2A Protocol', specUrl: 'https://a2a-protocol.org/latest/specification/', status: 'Adopted' },
  { name: 'ai-plugin.json', path: '/.well-known/ai-plugin.json', desc: 'Legacy OpenAI ChatGPT plugin manifest. Prefer OpenAPI + MCP / Apps SDK for new integrations. api.url must be OpenAPI, never sitemap.xml.', category: 'Agent Discovery', spec: 'OpenAI (legacy)', specUrl: 'https://developers.openai.com/api/docs/bots', status: 'Legacy' },
  { name: 'MCP Server Card', path: '/.well-known/mcp/server-card.json', desc: 'Draft MCP Server Card (SEP-2127 family). Pre-connection transport/capability metadata. Path still in flux across SEPs.', category: 'Agent Discovery', spec: 'MCP (draft)', specUrl: 'https://modelcontextprotocol.io', status: 'Proposed' },
  { name: 'openapi.json', path: '/openapi.json or /openapi.yaml', desc: 'OpenAPI 3.x HTTP API contract. Foundation for agent tool use when you expose endpoints.', category: 'Agent Discovery', spec: 'OpenAPI 3.1', specUrl: 'https://spec.openapis.org/oas/v3.1.0', status: 'Standard' },
  { name: '/.well-known/ai', path: '/.well-known/ai', desc: 'IETF draft AI Discovery Endpoint (draft-aiendpoint-ai-discovery-00). Structured service/capability JSON for agents. Not an RFC yet.', category: 'Agent Discovery', spec: 'IETF draft', specUrl: 'https://www.ietf.org/archive/id/draft-aiendpoint-ai-discovery-00.html', status: 'Proposed' },

  // Structured Data
  { name: 'JSON-LD', path: 'Embedded in HTML <head>', desc: 'Schema.org JSON-LD (Organization, Person, Article, FAQPage, HowTo, WebSite). Strong structure for machines; citation lift is best-effort, not a vendor guarantee.', category: 'Structured Data', spec: 'Schema.org', specUrl: 'https://schema.org', status: 'Standard' },

  // Brand & Identity
  { name: 'brand.txt', path: '/brand.txt', desc: 'Informal brand naming/tone guidance for agents. Optional; major models do not uniformly load /brand.txt on every mention.', category: 'Brand & Identity', spec: 'Community', status: 'Emerging' },
  { name: 'ai.json', path: '/ai.json', desc: 'Informal structured content map and permission hints. Community convention only.', category: 'Brand & Identity', spec: 'Community', status: 'Emerging' },

  // Trust & Security
  { name: 'security.txt', path: '/.well-known/security.txt', desc: 'Vulnerability reporting contacts per RFC 9116. Not AI-specific.', category: 'Trust & Security', spec: 'RFC 9116', specUrl: 'https://www.rfc-editor.org/rfc/rfc9116', status: 'Standard' },
  { name: 'humans.txt', path: '/humans.txt', desc: 'Team credits and tech stack (humanstxt.org). Optional provenance.', category: 'Trust & Security', spec: 'humanstxt.org', specUrl: 'https://humanstxt.org', status: 'Adopted' },
  { name: 'dnt-policy.txt', path: '/.well-known/dnt-policy.txt', desc: 'EFF Do Not Track policy file. Low practical impact in 2026; browser DNT is effectively deprecated.', category: 'Trust & Security', spec: 'EFF DNT', specUrl: 'https://www.eff.org/dnt-policy', status: 'Legacy' },

  // Sustainability
  { name: 'carbon.txt', path: '/carbon.txt', desc: 'TOML sustainability disclosures (carbontxt.org v0.5+): version, org.disclosures with doc_type and url. Not freeform key-value text.', category: 'Sustainability', spec: 'carbontxt.org', specUrl: 'https://carbontxt.org', status: 'Adopted' },

  // Platform
  { name: 'manifest.json', path: '/manifest.json', desc: 'W3C Web App Manifest: name, icons, theme, display mode for PWAs.', category: 'Platform', spec: 'W3C Web App Manifest', specUrl: 'https://www.w3.org/TR/appmanifest/', status: 'Standard' },
  { name: 'browserconfig.xml', path: '/browserconfig.xml', desc: 'Legacy Microsoft tile config for pinned sites. Not AI-relevant.', category: 'Platform', spec: 'Microsoft', status: 'Legacy' },
  { name: 'ads.txt', path: '/ads.txt', desc: 'IAB Authorized Digital Sellers list for ad inventory authorization.', category: 'Platform', spec: 'IAB Tech Lab', specUrl: 'https://iabtechlab.com/ads-txt/', status: 'Standard' },

  // Developer Agent Context
  { name: 'AGENTS.md', path: 'Repository root', desc: 'Cross-tool project context for coding agents (build, conventions, architecture).', category: 'Developer Agent', spec: 'agents.md', specUrl: 'https://agents.md', status: 'Emerging' },
  { name: 'CLAUDE.md', path: 'Repository root', desc: 'Claude Code project instructions (Anthropic).', category: 'Developer Agent', spec: 'Anthropic', status: 'Adopted' },
  { name: '.cursorrules', path: 'Repository root / .cursor/rules/', desc: 'Cursor IDE rules; often modular .mdc files under .cursor/rules/.', category: 'Developer Agent', spec: 'Cursor', status: 'Adopted' },
];

const AI_CRAWLERS: { company: string; bots: string[]; note?: string }[] = [
  { company: 'OpenAI', bots: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'OAI-AdsBot'], note: 'Vendor-documented. ChatGPT-User may ignore robots.txt.' },
  { company: 'Anthropic', bots: ['ClaudeBot', 'Claude-SearchBot', 'Claude-User'], note: 'Vendor-documented; honors robots.txt including Claude-User.' },
  { company: 'Google', bots: ['Googlebot', 'Google-Extended', 'GoogleOther', 'Gemini-Deep-Research', 'Google-NotebookLM'], note: 'Google-Extended is a control token (Gemini train/ground), not a separate crawler UA.' },
  { company: 'Perplexity', bots: ['PerplexityBot', 'Perplexity-User'], note: 'Perplexity-User generally ignores robots.txt.' },
  { company: 'Meta', bots: ['meta-externalagent', 'meta-externalfetcher'] },
  { company: 'Apple', bots: ['Applebot', 'Applebot-Extended'] },
  { company: 'Amazon', bots: ['Amazonbot'] },
  { company: 'ByteDance', bots: ['Bytespider'] },
  { company: 'xAI', bots: ['(no official UA)'], note: 'No official crawler docs; third-party tokens like GrokBot are unverified.' },
  { company: 'Mistral', bots: ['MistralAI-User'] },
  { company: 'Microsoft', bots: ['Bingbot'] },
  { company: 'Others', bots: ['CCBot', 'cohere-ai', 'YouBot', 'Diffbot', 'DuckDuckBot'], note: 'Directory-listed bots need operator docs before relying on the token.' },
];

const CATEGORIES = [...new Set(DISCOVERY_FILES.map((f) => f.category))];

const STATUS_BADGE: Record<Status, string> = {
  Standard: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300',
  Adopted: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300',
  Emerging: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300',
  Proposed: 'border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-900/40 dark:bg-purple-950/30 dark:text-purple-300',
  Legacy: 'border-border bg-muted text-muted-foreground',
};

const statusCounts = (Object.keys(STATUS_BADGE) as Status[]).reduce(
  (acc, status) => {
    acc[status] = DISCOVERY_FILES.filter((f) => f.status === status).length;
    return acc;
  },
  {} as Record<Status, number>
);

export default function AiDiscoveryStandardsPage() {
  return (
    <>
      <PageHero
        title="AI Discovery Standards"
        subtitle={`${DISCOVERY_FILES.length} files across ${CATEGORIES.length} categories: the files, protocols, and crawler tokens that affect whether AI systems can find, understand, and cite your site.`}
      >
        <AuthorByline
          links={[{ label: 'GitHub', href: 'https://github.com/vedangvatsa/ai-discovery-standards' }]}
        />
      </PageHero>

      <div className="pb-12 md:pb-16">
        <article className="notion-article prose prose-lg prose-neutral max-w-none">
          <div className="space-y-16 not-prose">

            {/* ── What this page covers (clear inventory, not mystery stats) ── */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">What this page covers</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Counts for this reference only. They describe the catalog on this page, not the whole web.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-lg border bg-card p-5">
                  <p className="text-3xl font-semibold tracking-tight">{DISCOVERY_FILES.length}</p>
                  <p className="text-sm font-medium mt-1">Discovery files</p>
                  <p className="text-xs text-muted-foreground mt-1">Listed below with path and maturity</p>
                </div>
                <div className="rounded-lg border bg-card p-5">
                  <p className="text-3xl font-semibold tracking-tight">{CATEGORIES.length}</p>
                  <p className="text-sm font-medium mt-1">Categories</p>
                  <p className="text-xs text-muted-foreground mt-1">Access, content, agents, trust, and more</p>
                </div>
                <div className="rounded-lg border bg-card p-5">
                  <p className="text-3xl font-semibold tracking-tight">{AI_CRAWLERS.length}</p>
                  <p className="text-sm font-medium mt-1">Operator groups</p>
                  <p className="text-xs text-muted-foreground mt-1">Vendor-documented crawler tokens</p>
                </div>
                <div className="rounded-lg border bg-card p-5">
                  <p className="text-3xl font-semibold tracking-tight">{statusCounts.Standard + statusCounts.Adopted}</p>
                  <p className="text-sm font-medium mt-1">Stable entries</p>
                  <p className="text-xs text-muted-foreground mt-1">Standard or Adopted maturity</p>
                </div>
              </div>
            </section>

            {/* ── Training vs retrieval ── */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">Training vs search is a separate decision</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Many vendors expose different robots.txt tokens for model training and for search/retrieval.
                Blocking training does not automatically remove you from AI search results, and allowing search
                does not mean you consented to training.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="rounded-lg border bg-card p-5">
                  <p className="text-sm font-medium mb-2">Training crawlers</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Fetch content that may be used to train or improve models. Usually little or no citation back to your site.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['GPTBot', 'ClaudeBot', 'CCBot', 'Google-Extended'].map((bot) => (
                      <code key={bot} className="text-xs font-mono bg-muted/60 px-2 py-0.5 rounded">{bot}</code>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-5">
                  <p className="text-sm font-medium mb-2">Search and retrieval crawlers</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Index content for AI search answers. More likely to cite or link your pages when relevant.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot'].map((bot) => (
                      <code key={bot} className="text-xs font-mono bg-muted/60 px-2 py-0.5 rounded">{bot}</code>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Example: disallowing <code className="text-xs font-mono bg-muted/60 px-1 py-0.5 rounded">GPTBot</code> signals
                  OpenAI not to use crawled content for foundation-model training. Disallowing{' '}
                  <code className="text-xs font-mono bg-muted/60 px-1 py-0.5 rounded">OAI-SearchBot</code> affects ChatGPT search
                  indexing. Those are independent choices in OpenAI&apos;s docs.
                </p>
              </div>
            </section>

            {/* ── Field context (sourced, full sentences) ── */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">Field context (with sources)</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Earlier versions of this page showed bare percentages without saying who was measured.
                Below are the claims that can be stated carefully. Each line includes the population and source.
              </p>
              <div className="space-y-px rounded-lg overflow-hidden border">
                <div className="bg-card p-4">
                  <p className="text-sm font-medium">About 14% of top domains with a robots.txt file name AI bots explicitly</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Cloudflare Radar (June 2025): of about 3,800 domains in the top 10,000 that had a parseable robots.txt,
                    roughly 546 had allow or disallow rules aimed at AI bots. That is not &quot;28% of the whole web.&quot;
                  </p>
                  <Link
                    href="https://blog.cloudflare.com/from-googlebot-to-gptbot-whos-crawling-your-site-in-2025/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Cloudflare blog, July 2025 ↗
                  </Link>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium">News publishers block training bots more often than the average site</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Industry summaries report that on the order of three-quarters of major news publishers block at least
                    one AI training crawler, while only about half block Google-Extended (because Google ties search and
                    Gemini controls differently). Treat this as a news-publisher pattern, not &quot;79% of all publishers.&quot;
                  </p>
                  <Link
                    href="https://www.digitalapplied.com/blog/ai-crawler-bot-traffic-statistics-2026-data-reference"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Secondary synthesis of Cloudflare and related data, 2026 ↗
                  </Link>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium">llms.txt is still uncommon, and it is not a ranking switch</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    One 2026 survey of roughly 300,000 domains put llms.txt adoption near 10%. That means about one in ten
                    surveyed sites publish the file, not that 10% of AI traffic uses it. Google has also stated you do not
                    need llms.txt for Google&apos;s generative search features; the file is a convenience map for agents, not a SERP boost.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <Link
                      href="https://www.digitalapplied.com/blog/ai-crawler-bot-traffic-statistics-2026-data-reference"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      Adoption figure cited in 2026 industry write-ups ↗
                    </Link>
                    <Link
                      href="https://developers.google.com/search/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      Google Search Central docs ↗
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Maturity legend ── */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">Maturity labels</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Same vocabulary as the GitHub reference. Status describes the file type, not your site&apos;s score.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {(Object.keys(STATUS_BADGE) as Status[]).map((status) => (
                  <div key={status} className="rounded-lg border bg-card p-4">
                    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border ${STATUS_BADGE[status]}`}>
                      {status}
                    </span>
                    <p className="text-2xl font-semibold tracking-tight mt-3">{statusCounts[status]}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {status === 'Standard' && 'RFC or W3C Recommendation'}
                      {status === 'Adopted' && 'Published spec or CG report, real use'}
                      {status === 'Emerging' && 'Community convention'}
                      {status === 'Proposed' && 'Active draft'}
                      {status === 'Legacy' && 'Superseded or low impact'}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Category nav ── */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">File registry</h2>
              <p className="text-sm text-muted-foreground mb-6">
                {CATEGORIES.length} categories. Jump to a group, or read top to bottom.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => {
                  const count = DISCOVERY_FILES.filter((f) => f.category === cat).length;
                  const slug = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  return (
                    <a
                      key={cat}
                      href={`#${slug}`}
                      className="rounded-lg border bg-card p-3 hover:border-primary/50 transition-colors text-center"
                    >
                      <span className="text-sm font-medium">{cat}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">{count} files</span>
                    </a>
                  );
                })}
              </div>
            </section>

            {/* ── Files by category (sitecheck-style rows) ── */}
            {CATEGORIES.map((category) => {
              const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              const items = DISCOVERY_FILES.filter((f) => f.category === category);
              return (
                <section key={category} id={slug}>
                  <h2 className="text-2xl font-semibold tracking-tight mb-6">{category}</h2>
                  <div className="space-y-px rounded-lg overflow-hidden border">
                    {items.map((file) => (
                      <details key={file.name} className="bg-card group">
                        <summary className="flex items-start gap-4 p-4 cursor-pointer select-none hover:bg-muted/30 transition-colors list-none [&::-webkit-details-marker]:hidden">
                          <div className="shrink-0 mt-0.5">
                            <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border ${STATUS_BADGE[file.status]}`}>
                              {file.status}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-sm">{file.name}</span>
                            <p className="text-xs font-mono text-muted-foreground mt-0.5">{file.path}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed mt-1">{file.desc}</p>
                          </div>
                          <svg
                            className="w-4 h-4 shrink-0 mt-1 text-muted-foreground/40 transition-transform group-open:rotate-90"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </summary>
                        <div className="px-4 pb-4 pt-0 sm:pl-[6.5rem]">
                          {file.specUrl ? (
                            <Link
                              href={file.specUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-muted-foreground hover:text-primary transition-colors"
                            >
                              {file.spec} ↗
                            </Link>
                          ) : (
                            <span className="text-xs text-muted-foreground/60">{file.spec}</span>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              );
            })}

            {/* ── Crawlers ── */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">AI crawler tokens</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Prefer vendor documentation and published IP lists. User-triggered fetchers may ignore robots.txt.
                Tokens without official docs are marked.
              </p>
              <div className="space-y-px rounded-lg overflow-hidden border">
                {AI_CRAWLERS.map((group) => (
                  <div key={group.company} className="bg-card p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                      <span className="font-medium text-sm shrink-0 sm:w-28">{group.company}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap gap-1.5">
                          {group.bots.map((bot) => (
                            <code key={bot} className="text-xs font-mono bg-muted/60 px-2 py-0.5 rounded">
                              {bot}
                            </code>
                          ))}
                        </div>
                        {group.note ? (
                          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{group.note}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Setup ── */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">Setup</h2>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Generate common discovery files for a project. Existing files are never overwritten.
              </p>
              <div className="rounded-lg overflow-hidden border">
                <div className="bg-muted px-4 py-2 border-b">
                  <span className="text-xs font-medium text-muted-foreground">Terminal</span>
                </div>
                <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed bg-card">
                  <code>{`# If published on npm:
npx ai-discovery-standards

# GitHub fallback:
npx github:vedangvatsa/ai-discovery-standards`}</code>
                </pre>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Works with Next.js, React, Vue, Hugo, Gatsby, and static sites.{' '}
                <Link
                  href="https://github.com/vedangvatsa/ai-discovery-standards"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  Full documentation on GitHub
                </Link>
              </p>
            </section>

            {/* ── Related ── */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Related</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/sitecheck"
                  className="rounded-lg border bg-card p-5 hover:border-primary/50 transition-colors block"
                >
                  <span className="font-medium text-sm">Site Checklist</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Foundations, SEO, accessibility, security, and agent readiness in one checklist.
                  </p>
                </Link>
                <Link
                  href="https://github.com/vedangvatsa/ai-discovery-standards"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border bg-card p-5 hover:border-primary/50 transition-colors block"
                >
                  <span className="font-medium text-sm">GitHub repository</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Templates, CLI, and the long-form reference for every file above.
                  </p>
                </Link>
              </div>
            </section>

            <p className="text-xs text-muted-foreground/60 text-center pb-4">
              Last verified July 2026. A2A lives at <code className="font-mono">/.well-known/agent-card.json</code>;
              root <code className="font-mono">/agents.json</code> is the agents-txt.com companion.
              File an issue on GitHub if something is missing or outdated.
            </p>
          </div>
        </article>
      </div>
    </>
  );
}

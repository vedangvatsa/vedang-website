import Link from 'next/link';
import { ExternalLink, ArrowRight, Database, Search, Eye, EyeOff, FileText, Brain, Link2, AlertTriangle } from 'lucide-react';
import { AuthorByline } from '@/components/author-byline';

// ─── Complete Discovery File Registry ───
// Keep aligned with https://github.com/vedangvatsa/ai-discovery-standards (verified Q3 2026)
const DISCOVERY_FILES: {
  name: string;
  path: string;
  desc: string;
  category: string;
  spec: string;
  specUrl?: string;
  status: 'Standard' | 'Adopted' | 'Emerging' | 'Proposed' | 'Legacy';
}[] = [
  // Access Control
  { name: 'robots.txt', path: '/robots.txt', desc: 'Crawler access control (RFC 9309). Primary practical lever for AI bots. Training tokens (GPTBot, ClaudeBot) are independent from search tokens (OAI-SearchBot, PerplexityBot, Claude-SearchBot).', category: 'Access Control', spec: 'RFC 9309', specUrl: 'https://www.rfc-editor.org/rfc/rfc9309', status: 'Standard' },
  { name: 'Content-Signal', path: '/robots.txt (directive)', desc: 'Optional usage preferences for search vs AI input vs training (Cloudflare Content Signals; related IETF AIPREF work). Complements robots Allow/Disallow.', category: 'Access Control', spec: 'AIPREF / Content Signals', specUrl: 'https://datatracker.ietf.org/wg/aipref/about/', status: 'Proposed' },
  { name: 'ai.txt', path: '/ai.txt', desc: 'Informal AI usage preferences (training, citation, indexing, summarization). Not a formal standard; does not replace robots.txt, TDMRep, or AIPREF.', category: 'Access Control', spec: 'Community', status: 'Emerging' },
  { name: 'tdmrep.json', path: '/.well-known/tdmrep.json', desc: 'W3C TDMRep site file: JSON array of {location, tdm-reservation, tdm-policy?}. EU CDSM Art. 4 opt-out signal. Also supports HTTP headers and HTML meta.', category: 'Access Control', spec: 'W3C TDMRep CG', specUrl: 'https://www.w3.org/community/tdmrep/', status: 'Adopted' },

  // Content Discovery
  { name: 'llms.txt', path: '/llms.txt', desc: 'Community Markdown summary for LLMs: H1, blockquote blurb, curated links. Not IETF/W3C. Created by Jeremy Howard (Answer.AI), 2024.', category: 'Content Discovery', spec: 'llmstxt.org', specUrl: 'https://llmstxt.org', status: 'Adopted' },
  { name: 'llms-full.txt', path: '/llms-full.txt', desc: 'Optional full-text companion to llms.txt for deep ingestion of key pages.', category: 'Content Discovery', spec: 'llmstxt.org', specUrl: 'https://llmstxt.org', status: 'Adopted' },
  { name: 'sitemap.xml', path: '/sitemap.xml', desc: 'URL inventory with lastmod and related hints. Used by search engines and many AI retrieval crawlers.', category: 'Content Discovery', spec: 'sitemaps.org', specUrl: 'https://www.sitemaps.org/protocol.html', status: 'Standard' },
  { name: 'feed.xml', path: '/feed.xml', desc: 'RSS/Atom syndication feed for chronological updates.', category: 'Content Discovery', spec: 'RSS 2.0 / Atom', status: 'Standard' },
  { name: 'feed.json', path: '/feed.json', desc: 'JSON Feed 1.1 — machine-friendly alternative to RSS/Atom.', category: 'Content Discovery', spec: 'JSON Feed 1.1', specUrl: 'https://jsonfeed.org/version/1.1', status: 'Adopted' },

  // Agent Discovery
  { name: 'agents.txt', path: '/agents.txt', desc: 'agents-txt.com capability announcement: MCP, A2A card URLs, skills, payments, auth, UCP, WebMCP. Plain-text, robots-like syntax.', category: 'Agent Discovery', spec: 'agents-txt.com', specUrl: 'https://agents-txt.com', status: 'Emerging' },
  { name: 'agents.json', path: '/agents.json', desc: 'agents-txt.com JSON companion at site root (not A2A). Structured catalog of MCP/A2A/skills/payments metadata.', category: 'Agent Discovery', spec: 'agents-txt.com', specUrl: 'https://agents-txt.com', status: 'Emerging' },
  { name: 'agent-card.json', path: '/.well-known/agent-card.json', desc: 'A2A Protocol Agent Card (Linux Foundation). Canonical path is agent-card.json — not agents.json. Identity, transports, skills, security.', category: 'Agent Discovery', spec: 'A2A Protocol', specUrl: 'https://a2a-protocol.org/latest/specification/', status: 'Adopted' },
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
  { name: 'carbon.txt', path: '/carbon.txt', desc: 'TOML sustainability disclosures (carbontxt.org v0.5+): version, org.disclosures[{doc_type, url}]. Not freeform key-value text.', category: 'Sustainability', spec: 'carbontxt.org', specUrl: 'https://carbontxt.org', status: 'Adopted' },

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
  { company: 'Others', bots: ['CCBot', 'cohere-ai', 'YouBot', 'Diffbot', 'DuckDuckBot'], note: 'Directory-listed bots (TavilyBot, KagiBot, etc.) need operator docs before relying on the token.' },
];

const CATEGORIES = [...new Set(DISCOVERY_FILES.map(f => f.category))];

const STATUS_STYLES: Record<string, string> = {
  Standard: 'text-emerald-700 dark:text-emerald-400',
  Adopted: 'text-blue-700 dark:text-blue-400',
  Emerging: 'text-amber-700 dark:text-amber-400',
  Proposed: 'text-purple-700 dark:text-purple-400',
  Legacy: 'text-muted-foreground',
};

function Src({ href, children }: { href: string; children?: React.ReactNode }) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-muted-foreground/70 hover:text-primary transition-colors">
      {children || 'spec'} <ExternalLink className="h-2.5 w-2.5" />
    </Link>
  );
}

export default function AiDiscoveryStandardsPage() {
  return (
    <>
      {/* ── Header ── */}
      <header className="pt-12 md:pt-16 pb-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            AI Discovery Standards
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {DISCOVERY_FILES.length} files across {CATEGORIES.length} categories. Every file, protocol, and crawler that determines whether AI systems can find, understand, and cite your website.
          </p>
          <AuthorByline links={[{ label: 'GitHub', href: 'https://github.com/vedangvatsa/ai-discovery-standards' }]} />
        </div>

        {/* Inline stats */}
        <div className="max-w-4xl mx-auto mt-8 grid grid-cols-3 gap-3 md:gap-6">
          <div className="rounded-lg border bg-card p-3 md:p-5 text-center">
            <p className="text-2xl md:text-3xl font-semibold tracking-tight">~28%</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">block at least one AI crawler</p>
          </div>
          <div className="rounded-lg border bg-card p-3 md:p-5 text-center">
            <p className="text-2xl md:text-3xl font-semibold tracking-tight">79%</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">of publishers block training bots</p>
          </div>
          <div className="rounded-lg border bg-card p-3 md:p-5 text-center">
            <p className="text-2xl md:text-3xl font-semibold tracking-tight">~10%</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">have adopted llms.txt</p>
          </div>
        </div>
      </header>

      <div className="py-6 md:py-10">
        <article className="notion-article prose prose-lg prose-neutral max-w-4xl mx-auto">

      <div className="space-y-16 not-prose">

        {/* ── The Training vs Retrieval Split ── */}
        <section className="not-prose max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight !mb-4">The Training vs. Retrieval Split</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            The most important distinction in AI discoverability is between <strong className="text-foreground">training crawlers</strong> and{' '}
            <strong className="text-foreground">retrieval crawlers</strong>. They look similar in your access logs,
            but they do fundamentally different things with your content.
          </p>

          {/* Two-path diagram */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Training path */}
            <div className="rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/10 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <Database className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="font-medium text-sm">Training Crawlers</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5 shrink-0" />
                  <span>Your content</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ArrowRight className="h-3.5 w-3.5" />
                  <code className="text-[11px] font-mono bg-muted/60 px-1.5 py-0.5 rounded">GPTBot</code>
                  <code className="text-[11px] font-mono bg-muted/60 px-1.5 py-0.5 rounded">ClaudeBot</code>
                  <code className="text-[11px] font-mono bg-muted/60 px-1.5 py-0.5 rounded">CCBot</code>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ArrowRight className="h-3.5 w-3.5" />
                  <Brain className="h-3.5 w-3.5 shrink-0" />
                  <span>Absorbed into model weights</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-900/30 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <EyeOff className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  <span>No citation</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <EyeOff className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  <span>No referral traffic</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <EyeOff className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  <span>No attribution</span>
                </div>
              </div>
            </div>

            {/* Retrieval path */}
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/10 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <Search className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="font-medium text-sm">Retrieval Crawlers</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5 shrink-0" />
                  <span>Your content</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ArrowRight className="h-3.5 w-3.5" />
                  <code className="text-[11px] font-mono bg-muted/60 px-1.5 py-0.5 rounded">OAI-SearchBot</code>
                  <code className="text-[11px] font-mono bg-muted/60 px-1.5 py-0.5 rounded">PerplexityBot</code>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ArrowRight className="h-3.5 w-3.5" />
                  <Link2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Cited in AI-generated answers</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-900/30 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Eye className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Citation with link</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Eye className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Possible referral traffic</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Eye className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Attribution preserved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Strategy callout */}
          <div className="rounded-lg border bg-card p-4 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Blocking a training bot (e.g., <code className="text-xs font-mono bg-muted/60 px-1 py-0.5 rounded">GPTBot</code>) does not affect
              your visibility in AI search results. Blocking a search bot (e.g., <code className="text-xs font-mono bg-muted/60 px-1 py-0.5 rounded">OAI-SearchBot</code>)
              removes you from that AI&apos;s search entirely. These are separate decisions.
            </p>
          </div>
        </section>

        {/* ── File Registry ── */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">File Registry</h2>
          <p className="text-sm text-muted-foreground mb-6">
            <span className={STATUS_STYLES.Standard}>Standard</span> = RFC or W3C Recommendation.{' '}
            <span className={STATUS_STYLES.Adopted}>Adopted</span> = widely used with a published spec or CG report.{' '}
            <span className={STATUS_STYLES.Emerging}>Emerging</span> = community convention, incomplete compliance.{' '}
            <span className={STATUS_STYLES.Proposed}>Proposed</span> = active draft.{' '}
            <span className={STATUS_STYLES.Legacy}>Legacy</span> = superseded or low practical impact.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DISCOVERY_FILES.map((file) => (
              <div key={file.name} className="rounded-lg border bg-card p-3.5 flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-sm leading-tight">{file.name}</span>
                  <span className={`text-[10px] font-medium shrink-0 ${STATUS_STYLES[file.status]}`}>{file.status}</span>
                </div>
                <div className="text-[11px] text-muted-foreground font-mono leading-tight">{file.path}</div>
                <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-2">{file.desc}</p>
                <div className="mt-auto pt-1">
                  {file.specUrl ? <Src href={file.specUrl}>{file.spec}</Src> : <span className="text-[10px] text-muted-foreground/50">{file.spec}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── AI Crawler Registry ── */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">AI Crawler Registry</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Vendor-documented and commonly observed AI-related robots tokens as of Q3 2026. Prefer official docs and published IP lists over third-party directories. User-triggered fetchers may ignore robots.txt.
          </p>
          <div className="space-y-px rounded-lg overflow-hidden border">
            {AI_CRAWLERS.map((group) => (
              <div key={group.company} className="bg-card p-3 space-y-1.5">
                <div className="flex items-start gap-4">
                  <span className="font-medium text-sm shrink-0 w-24 pt-0.5">{group.company}</span>
                  <div className="flex flex-wrap gap-1.5 min-w-0">
                    {group.bots.map((bot) => (
                      <code key={bot} className="text-xs font-mono bg-muted/60 px-2 py-0.5 rounded">
                        {bot}
                      </code>
                    ))}
                  </div>
                </div>
                {group.note ? (
                  <p className="text-[11px] text-muted-foreground/80 pl-28 leading-relaxed">{group.note}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* ── Setup ── */}
        <section>
          <div className="rounded-lg border bg-card p-6 text-center">
            <h2 className="text-xl font-semibold tracking-tight mb-2">Setup</h2>
            <p className="text-sm text-muted-foreground mb-4">
              One command generates discovery files (robots, llms.txt, agents.txt, agent-card stub, TDMRep, and more). Existing files are never overwritten.
            </p>
            <div className="inline-flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-md border bg-muted/50 px-4 py-2 font-mono text-sm">
                <span className="text-muted-foreground">$</span> npx ai-discovery-standards
              </div>
              <div className="inline-flex items-center gap-2 rounded-md border bg-muted/50 px-4 py-2 font-mono text-xs text-muted-foreground">
                <span>$</span> npx github:vedangvatsa/ai-discovery-standards
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Works with Next.js, React, Vue, Hugo, Gatsby, and any static site.{' '}
              <Link href="https://github.com/vedangvatsa/ai-discovery-standards" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                Full documentation on GitHub
              </Link>
            </p>
          </div>
        </section>

        {/* ── Disclaimer ── */}
        <p className="text-xs text-muted-foreground/60 text-center pb-4">
          Standards evolve. Last verified July 2026 against vendor docs and primary specs. A2A lives at <code className="font-mono">/.well-known/agent-card.json</code>; root <code className="font-mono">/agents.json</code> is the agents-txt.com companion. File an issue on GitHub if something is missing or outdated.
        </p>

      </div>
        </article>
      </div>
    </>
  );
}

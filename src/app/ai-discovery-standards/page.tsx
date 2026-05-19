import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

// ─── Complete Discovery File Registry ───
const DISCOVERY_FILES: {
  name: string;
  path: string;
  desc: string;
  category: string;
  spec: string;
  specUrl?: string;
  status: 'Standard' | 'Adopted' | 'Emerging' | 'Proposed';
}[] = [
  // Access Control
  { name: 'robots.txt', path: '/robots.txt', desc: 'Crawler access directives for 25+ AI bots. Separates training bots (GPTBot, ClaudeBot) from search bots (OAI-SearchBot, PerplexityBot).', category: 'Access Control', spec: 'RFC 9309', specUrl: 'https://www.rfc-editor.org/rfc/rfc9309', status: 'Standard' },
  { name: 'ai.txt', path: '/ai.txt', desc: 'AI-specific usage permissions: training, citation, indexing, summarization. Granular control beyond robots.txt.', category: 'Access Control', spec: 'Community', status: 'Emerging' },
  { name: 'tdmrep.json', path: '/.well-known/tdmrep.json', desc: 'Text and Data Mining reservation. EU CDSM Directive Article 4 compliance. Machine-readable opt-out for AI training.', category: 'Access Control', spec: 'W3C TDMRep', specUrl: 'https://www.w3.org/community/tdmrep/', status: 'Standard' },

  // Content Discovery
  { name: 'llms.txt', path: '/llms.txt', desc: 'Structured Markdown summary for LLMs. Title, description, and organized links to key pages. Created by Jeremy Howard (Answer.AI), 2024.', category: 'Content Discovery', spec: 'llmstxt.org', specUrl: 'https://llmstxt.org', status: 'Adopted' },
  { name: 'llms-full.txt', path: '/llms-full.txt', desc: 'Full-text content export for deep AI ingestion. Extended version of llms.txt with complete page content.', category: 'Content Discovery', spec: 'llmstxt.org', specUrl: 'https://llmstxt.org', status: 'Adopted' },
  { name: 'sitemap.xml', path: '/sitemap.xml', desc: 'URL index with lastmod, changefreq, and priority metadata. Used by Google, Bing, and AI crawlers.', category: 'Content Discovery', spec: 'sitemaps.org', specUrl: 'https://www.sitemaps.org/protocol.html', status: 'Standard' },
  { name: 'feed.xml', path: '/feed.xml', desc: 'RSS/Atom feed for syndication. Chronological content updates consumed by readers and aggregators.', category: 'Content Discovery', spec: 'RSS 2.0 / Atom', status: 'Standard' },
  { name: 'feed.json', path: '/feed.json', desc: 'JSON Feed (jsonfeed.org). Machine-readable alternative to RSS/Atom. Easier for AI agents to parse.', category: 'Content Discovery', spec: 'JSON Feed 1.1', specUrl: 'https://jsonfeed.org/version/1.1', status: 'Adopted' },

  // Agent Discovery
  { name: 'ai-plugin.json', path: '/ai-plugin.json', desc: 'ChatGPT plugin manifest. Declares site capabilities, API endpoints, and authentication for OpenAI agents.', category: 'Agent Discovery', spec: 'OpenAI Plugin', specUrl: 'https://platform.openai.com/docs/plugins', status: 'Adopted' },
  { name: 'agents.json', path: '/agents.json', desc: 'Agent-to-Agent (A2A) capability advertisement. Declares skills, I/O modes, and authentication for autonomous agents.', category: 'Agent Discovery', spec: 'A2A Protocol', status: 'Emerging' },
  { name: 'MCP Server Card', path: '/.well-known/mcp/server-card.json', desc: 'MCP Server Card (SEP-1649). Exposes transport config, capabilities, and auth requirements for MCP clients.', category: 'Agent Discovery', spec: 'MCP / AAIF', specUrl: 'https://modelcontextprotocol.io', status: 'Proposed' },
  { name: 'openapi.json', path: '/api/openapi.json', desc: 'OpenAPI 3.x specification. Machine-readable API contract. Foundation for agent tool discovery.', category: 'Agent Discovery', spec: 'OpenAPI 3.1', specUrl: 'https://spec.openapis.org/oas/v3.1.0', status: 'Standard' },

  // Structured Data
  { name: 'JSON-LD', path: 'Embedded in HTML <head>', desc: 'Schema.org structured data (Organization, Article, FAQPage, WebSite with SearchAction). Primary signal for AI entity recognition.', category: 'Structured Data', spec: 'Schema.org', specUrl: 'https://schema.org', status: 'Standard' },

  // Brand & Identity
  { name: 'brand.txt', path: '/brand.txt', desc: 'Brand governance for AI systems: name capitalization, preferred terminology, prohibited terms, tone, competitor disambiguation.', category: 'Brand & Identity', spec: 'Community', status: 'Emerging' },
  { name: 'ai.json', path: '/ai.json', desc: 'Structured content map for AI agents. JSON metadata declaring site sections, topics, and content types.', category: 'Brand & Identity', spec: 'Community', status: 'Emerging' },

  // Trust & Security
  { name: 'security.txt', path: '/.well-known/security.txt', desc: 'Vulnerability reporting policy. Contact, encryption key, and disclosure timeline per RFC 9116.', category: 'Trust & Security', spec: 'RFC 9116', specUrl: 'https://www.rfc-editor.org/rfc/rfc9116', status: 'Standard' },
  { name: 'humans.txt', path: '/humans.txt', desc: 'Team credits, technologies used, and acknowledgments. Human-readable provenance signal.', category: 'Trust & Security', spec: 'humanstxt.org', specUrl: 'https://humanstxt.org', status: 'Adopted' },
  { name: 'dnt-policy.txt', path: '/.well-known/dnt-policy.txt', desc: 'Do Not Track compliance declaration. EFF standard format. Privacy-respecting signal for browsers and extensions.', category: 'Trust & Security', spec: 'EFF DNT', specUrl: 'https://www.eff.org/dnt-policy', status: 'Adopted' },

  // Sustainability
  { name: 'carbon.txt', path: '/carbon.txt', desc: 'Sustainability disclosure: hosting provider, energy sources, carbon offsets. Green Web Foundation standard.', category: 'Sustainability', spec: 'carbontxt.org', specUrl: 'https://carbontxt.org', status: 'Adopted' },

  // Platform
  { name: 'manifest.json', path: '/manifest.json', desc: 'PWA metadata: app name, icons, theme colors, display mode. Required for installable web apps.', category: 'Platform', spec: 'W3C Web App Manifest', specUrl: 'https://www.w3.org/TR/appmanifest/', status: 'Standard' },
  { name: 'browserconfig.xml', path: '/browserconfig.xml', desc: 'Windows tile configuration for pinned sites. Tile images and background colors.', category: 'Platform', spec: 'Microsoft', status: 'Standard' },
  { name: 'ads.txt', path: '/ads.txt', desc: 'Authorized Digital Sellers. Declares which ad networks are authorized to sell inventory on your domain.', category: 'Platform', spec: 'IAB Tech Lab', specUrl: 'https://iabtechlab.com/ads-txt/', status: 'Standard' },

  // Developer Agent Context
  { name: 'AGENTS.md', path: 'Repository root', desc: 'Cross-tool project context for coding agents. Build commands, architecture, conventions. Emerging universal standard.', category: 'Developer Agent', spec: 'agents.md', specUrl: 'https://agents.md', status: 'Emerging' },
  { name: 'CLAUDE.md', path: 'Repository root', desc: 'Claude Code project context. Architecture, workflows, and coding conventions for Anthropic agents.', category: 'Developer Agent', spec: 'Anthropic', status: 'Adopted' },
  { name: '.cursorrules', path: 'Repository root', desc: 'Cursor IDE agent rules. Modular .mdc files in .cursor/rules/ for context-aware coding assistance.', category: 'Developer Agent', spec: 'Cursor', status: 'Adopted' },
];

const AI_CRAWLERS = [
  { company: 'OpenAI', bots: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User'] },
  { company: 'Anthropic', bots: ['ClaudeBot', 'Claude-SearchBot', 'Claude-User'] },
  { company: 'Google', bots: ['Googlebot', 'Google-Extended', 'GoogleOther'] },
  { company: 'Perplexity', bots: ['PerplexityBot', 'Perplexity-User'] },
  { company: 'Meta', bots: ['meta-externalagent', 'meta-externalfetcher'] },
  { company: 'Apple', bots: ['Applebot', 'Applebot-Extended'] },
  { company: 'Amazon', bots: ['Amazonbot'] },
  { company: 'ByteDance', bots: ['Bytespider', 'TikTokSpider'] },
  { company: 'Microsoft', bots: ['bingbot', 'CopilotBot'] },
  { company: 'Others', bots: ['CCBot', 'cohere-ai', 'YouBot', 'Diffbot', 'SemrushBot', 'AhrefsBot'] },
];

const CATEGORIES = [...new Set(DISCOVERY_FILES.map(f => f.category))];

const STATUS_STYLES: Record<string, string> = {
  Standard: 'text-emerald-700 dark:text-emerald-400',
  Adopted: 'text-blue-700 dark:text-blue-400',
  Emerging: 'text-amber-700 dark:text-amber-400',
  Proposed: 'text-purple-700 dark:text-purple-400',
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
      {/* ── Hero ── */}
      <section className="text-center pt-16 pb-12 border-b border-border/30">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">
            AI Discovery Standards
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground">
            {DISCOVERY_FILES.length} files across {CATEGORIES.length} categories. Every protocol and metadata
            standard used to make websites discoverable by AI systems, search engines, and autonomous agents.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            By Vedang Vatsa ·{' '}
            <Link href="https://github.com/vedangvatsa/ai-discovery-standards" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary font-medium">
              GitHub →
            </Link>
            {' · '}
            <code className="text-sm">npx ai-discovery-standards</code>
          </p>
        </div>
      </section>

      <div className="space-y-24">

        {/* ── The Problem ── */}
        <section className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight !mb-4">The Visibility Problem</h2>
          <p className="text-muted-foreground leading-relaxed">
            Search changed. In 2025, nearly 60% of queries ended without a click — the user got their answer
            directly from an AI summary. Google AI Overviews, ChatGPT Search, Perplexity, and Copilot now
            synthesize answers from multiple sources and present them as a single response. The &quot;ten blue links&quot;
            page is fading. If your content isn&apos;t structured for extraction and citation by these systems,
            you&apos;re invisible to a growing share of your audience.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            This page documents every file, protocol, and technique that determines whether AI systems can find,
            understand, and cite your website. It&apos;s the result of building and testing these standards across
            production sites — not theory.
          </p>
        </section>

        {/* ── What the Data Shows ── */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">What the Data Shows</h2>
          <p className="text-sm text-muted-foreground mb-8">Numbers from 2025–2026 industry research on AI crawler behavior, blocking rates, and adoption.</p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-xl border bg-card p-6">
              <p className="text-3xl font-semibold tracking-tight">~28%</p>
              <p className="text-sm text-muted-foreground mt-2">of websites now block at least one major AI crawler via robots.txt, CDN, or WAF rules.</p>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <p className="text-3xl font-semibold tracking-tight">79%</p>
              <p className="text-sm text-muted-foreground mt-2">of top news publishers block AI training bots. GPTBot is the most blocked crawler (17–62% depending on dataset).</p>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <p className="text-3xl font-semibold tracking-tight">~10%</p>
              <p className="text-sm text-muted-foreground mt-2">of domains have adopted llms.txt. Among the top 1,000 sites, it drops to 0.3%. No major AI provider officially uses it as a ranking signal.</p>
            </div>
          </div>

          <div className="mt-8 prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              The blocking numbers reveal a market that hasn&apos;t settled on a strategy. Most publishers are
              reacting to AI crawlers the same way they reacted to early search engines in the 2000s — with blanket
              blocks. The problem: blocking search bots (OAI-SearchBot, Claude-SearchBot) removes you from AI-generated
              answers entirely. Blocking training bots (GPTBot, ClaudeBot) stops your content from being absorbed
              into model weights without attribution. These are different decisions with different consequences,
              and most sites are treating them as the same thing.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The llms.txt adoption curve is interesting for what it reveals about the standard&apos;s actual utility.
              No major AI provider — Google, OpenAI, Anthropic, Meta — has committed to using it as a retrieval
              signal. Its real value has shifted toward B2A (Business-to-Agent) communication: giving coding
              assistants, IDE agents, and documentation crawlers a structured entry point into your site. That&apos;s
              a narrower use case than the original pitch, but it&apos;s a real one.
            </p>
          </div>
        </section>

        {/* ── The Training vs Retrieval Split ── */}
        <section className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight !mb-4">The Training vs. Retrieval Split</h2>
          <p className="text-muted-foreground leading-relaxed">
            The most important distinction in AI discoverability is between <strong className="text-foreground">training crawlers</strong> and{' '}
            <strong className="text-foreground">retrieval crawlers</strong>. They look similar in your access logs,
            but they do fundamentally different things with your content.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot) ingest your content into model weights.
            Once absorbed, your words become part of the model&apos;s knowledge but are never attributed back to you.
            There is no referral traffic. No citation. Your content improves someone else&apos;s product.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Retrieval crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot) fetch your content at query time
            to include in AI-generated answers. These crawlers <em>do</em> cite you. They <em>do</em> send traffic.
            AI-referred visitors convert at roughly 14% versus 3% for traditional organic — five times higher —
            because they arrive with specific intent already formed by the AI summary.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The strategic play: allow all retrieval bots, selectively manage training bots. The robots.txt
            strategy section below shows exactly how to do this.
          </p>
        </section>

        {/* ── New Metrics ── */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Measuring AI Visibility</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Traditional SEO metrics (clicks, impressions, keyword rankings) don&apos;t capture AI performance. These are the metrics that matter now.
          </p>
          <div className="space-y-px rounded-xl overflow-hidden border">
            {[
              { metric: 'Citation Frequency', what: 'How often AI systems cite your domain when answering questions in your topic area.', status: 'Primary' },
              { metric: 'Share of AI Voice', what: 'Your brand\'s presence as a percentage of all citations in AI-generated answers for core queries.', status: 'Primary' },
              { metric: 'AI Referral Traffic', what: 'Visits from ChatGPT, Perplexity, Claude, and Copilot. Track via UTM params or referrer headers.', status: 'Measurable' },
              { metric: 'AI Conversion Rate', what: 'Conversion rate of AI-referred visitors vs. organic. Industry benchmarks: ~14% vs. ~3%.', status: 'Measurable' },
              { metric: 'Brand Mention Accuracy', what: 'Whether AI systems correctly describe your brand, products, and positioning. Reduced by brand.txt.', status: 'Qualitative' },
              { metric: 'Answer Selection Rate', what: 'How often your content is chosen as the direct answer (not just cited) in AI Overviews and snippets.', status: 'AEO-specific' },
            ].map((row) => (
              <div key={row.metric} className="bg-card flex items-start gap-4 p-4">
                <div className="shrink-0 w-48">
                  <span className="font-medium text-sm">{row.metric}</span>
                  <div className="text-[11px] text-muted-foreground/60 mt-0.5">{row.status}</div>
                </div>
                <p className="flex-1 text-sm text-muted-foreground leading-relaxed min-w-0">{row.what}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── File Registry ── */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">File Registry</h2>
          <p className="text-sm text-muted-foreground mb-8">
            <span className={STATUS_STYLES.Standard}>Standard</span> = ratified RFC or W3C spec.{' '}
            <span className={STATUS_STYLES.Adopted}>Adopted</span> = widely used convention.{' '}
            <span className={STATUS_STYLES.Emerging}>Emerging</span> = growing adoption, no formal spec.{' '}
            <span className={STATUS_STYLES.Proposed}>Proposed</span> = draft or specification proposal.
          </p>

          <div className="space-y-12">
            {CATEGORIES.map((category) => {
              const files = DISCOVERY_FILES.filter(f => f.category === category);
              return (
                <div key={category}>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">{category}</p>
                  <div className="space-y-px rounded-xl overflow-hidden border">
                    {files.map((file) => (
                      <div key={file.name} className="bg-card flex gap-4 p-4">
                        <div className="shrink-0 w-40">
                          <span className="font-medium text-sm">{file.name}</span>
                          <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{file.path}</div>
                        </div>
                        <p className="flex-1 text-sm text-muted-foreground leading-relaxed min-w-0">{file.desc}</p>
                        <div className="shrink-0 flex flex-col items-end gap-1">
                          <span className={`text-[11px] font-medium ${STATUS_STYLES[file.status]}`}>{file.status}</span>
                          {file.specUrl ? <Src href={file.specUrl}>{file.spec}</Src> : <span className="text-[11px] text-muted-foreground/50">{file.spec}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── AI Crawler Registry ── */}
        <section>
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <h2 className="text-2xl font-semibold tracking-tight">AI Crawler Registry</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-8">
            All known AI crawler user-agent strings as of Q2 2026. Separate <strong className="text-foreground">training bots</strong> (content absorbed into model weights, no attribution) from <strong className="text-foreground">search bots</strong> (content cited in AI-generated answers).
          </p>
          <div className="space-y-px rounded-xl overflow-hidden border">
            {AI_CRAWLERS.map((group) => (
              <div key={group.company} className="bg-card flex items-start gap-4 p-4">
                <span className="font-medium text-sm shrink-0 w-28">{group.company}</span>
                <div className="flex flex-wrap gap-1.5">
                  {group.bots.map((bot) => (
                    <code key={bot} className="text-xs font-mono bg-muted/60 px-2 py-0.5 rounded">
                      {bot}
                    </code>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── AEO vs GEO ── */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">AEO vs GEO</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Answer Engine Optimization targets direct answer selection. Generative Engine Optimization targets citation frequency across AI platforms. You need both.
          </p>
          <div className="space-y-px rounded-xl overflow-hidden border">
            {[
              { label: 'Goal', aeo: 'Be selected as the direct answer', geo: 'Be cited as a source across AI platforms' },
              { label: 'Targets', aeo: 'Perplexity, ChatGPT Search, Google AI Overviews', geo: 'Claude, ChatGPT, Gemini recommendations' },
              { label: 'Content pattern', aeo: 'H2 headings as literal questions, 2-3 sentence answer below', geo: 'Consistent terminology, clear authorship, JSON-LD, llms.txt' },
              { label: 'Key schema', aeo: 'FAQPage, HowTo', geo: 'Organization, Person, WebSite + SearchAction, sameAs' },
              { label: 'Metric', aeo: 'Answer selection rate', geo: 'Share of AI Voice (citation frequency)' },
            ].map((row) => (
              <div key={row.label} className="bg-card grid grid-cols-[120px_1fr_1fr] gap-4 p-4">
                <span className="font-medium text-sm">{row.label}</span>
                <span className="text-sm text-muted-foreground">{row.aeo}</span>
                <span className="text-sm text-muted-foreground">{row.geo}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Content Strategy ── */}
        <section className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight !mb-4">Content That Gets Cited</h2>
          <p className="text-muted-foreground leading-relaxed">
            AI systems don&apos;t rank content. They extract it. The difference matters. A page that ranks #1 on Google
            can be completely ignored by ChatGPT if it&apos;s structured poorly. What LLMs actually favor:
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Answer-first formatting.</strong> Put the answer in the first 2–3 sentences
            after a heading, then explain. AI systems extract the answer block and move on. If your answer is
            buried in paragraph four, it won&apos;t be found.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Evidence density.</strong> Research shows that LLMs are biased toward
            content that reads as &quot;evidentiary&quot; — numbers, citations, specific claims with sources.
            Pages with original data, named experts, and precise figures get cited at significantly higher
            rates than opinion pieces or generic overviews.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Entity consistency.</strong> AI models work with entities, not keywords.
            If you call your product &quot;DataSync&quot; on one page and &quot;Data Sync Platform&quot; on another,
            the model can&apos;t confidently attribute information to you. Use the same terminology everywhere.
            brand.txt exists to enforce this at the AI layer.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Structured data as ground truth.</strong> JSON-LD schema (Organization,
            Person, Article, FAQPage) gives AI systems a machine-readable source of truth about who you are and
            what your content is about. It&apos;s the most underrated signal in AI discoverability — most sites
            either skip it or implement it incorrectly.
          </p>
        </section>

        {/* ── robots.txt Strategy ── */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">robots.txt Strategy</h2>
          <p className="text-sm text-muted-foreground mb-8">Separate training bots from search bots. Allow what you want cited, block what you want protected.</p>

          <div className="space-y-px rounded-xl overflow-hidden border">
            <div className="bg-card p-4">
              <span className="font-medium text-sm">Search bots</span>
              <span className="text-xs text-muted-foreground ml-2">(OAI-SearchBot, Claude-SearchBot, PerplexityBot)</span>
              <p className="text-sm text-muted-foreground mt-1">Crawl your site to include content in AI-generated answers. Blocking them removes you from AI search results entirely.</p>
            </div>
            <div className="bg-card p-4">
              <span className="font-medium text-sm">Training bots</span>
              <span className="text-xs text-muted-foreground ml-2">(GPTBot, ClaudeBot, Google-Extended)</span>
              <p className="text-sm text-muted-foreground mt-1">Ingest content into model weights. Your content becomes part of the model but is not attributed to you.</p>
            </div>
            <div className="bg-card p-4">
              <span className="font-medium text-sm">Recommended strategy</span>
              <p className="text-sm text-muted-foreground mt-1">Allow all search bots (you want citations). Selectively allow or block training bots. Always allow Googlebot. For EU sites, add /.well-known/tdmrep.json for CDSM Directive Article 4 compliance.</p>
            </div>
          </div>
        </section>

        {/* ── Setup ── */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Setup</h2>
          <p className="text-sm text-muted-foreground mb-6">One command generates all discovery files. Auto-detects public/ or static/ directories. Existing files are never overwritten.</p>
          <div className="rounded-lg border bg-card p-4 font-mono text-sm max-w-lg">
            <span className="text-muted-foreground">$</span> npx ai-discovery-standards
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Works with Next.js, React, Vue, Hugo, Gatsby, and any static site.{' '}
            <Link href="https://github.com/vedangvatsa/ai-discovery-standards" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
              Full documentation on GitHub
            </Link>
          </p>
        </section>

        {/* ── Disclaimer ── */}
        <p className="text-xs text-muted-foreground/60 text-center pb-4">
          Standards evolve. Last updated May 2026. File an issue on GitHub if something is missing or outdated.
        </p>

      </div>
    </>
  );
}

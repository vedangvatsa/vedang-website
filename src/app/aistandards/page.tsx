import Link from 'next/link';
import { AuthorByline } from '@/components/author-byline';

// Landing page for https://github.com/vedangvatsa/ai-discovery-standards

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
  { name: 'robots.txt', path: '/robots.txt', desc: 'Crawler access control (RFC 9309). Training tokens are independent from search tokens.', category: 'Access Control', spec: 'RFC 9309', specUrl: 'https://www.rfc-editor.org/rfc/rfc9309', status: 'Standard' },
  { name: 'Content-Signal', path: '/robots.txt (directive)', desc: 'Optional search vs AI-input vs training preferences (Cloudflare Content Signals; IETF AIPREF).', category: 'Access Control', spec: 'AIPREF', specUrl: 'https://datatracker.ietf.org/wg/aipref/about/', status: 'Proposed' },
  { name: 'ai.txt', path: '/ai.txt', desc: 'Informal AI usage preferences. Not a formal standard.', category: 'Access Control', spec: 'Community', status: 'Emerging' },
  { name: 'tdmrep.json', path: '/.well-known/tdmrep.json', desc: 'W3C TDMRep: JSON array of location rules for EU CDSM Art. 4 opt-out.', category: 'Access Control', spec: 'W3C TDMRep CG', specUrl: 'https://www.w3.org/community/tdmrep/', status: 'Adopted' },
  { name: 'llms.txt', path: '/llms.txt', desc: 'Markdown site map for LLMs (llmstxt.org). Not IETF/W3C.', category: 'Content Discovery', spec: 'llmstxt.org', specUrl: 'https://llmstxt.org', status: 'Adopted' },
  { name: 'llms-full.txt', path: '/llms-full.txt', desc: 'Full-text companion to llms.txt when you want bulk content in one file.', category: 'Content Discovery', spec: 'llmstxt.org', specUrl: 'https://llmstxt.org', status: 'Adopted' },
  { name: 'sitemap.xml', path: '/sitemap.xml', desc: 'URL inventory for search and retrieval crawlers.', category: 'Content Discovery', spec: 'sitemaps.org', specUrl: 'https://www.sitemaps.org/protocol.html', status: 'Standard' },
  { name: 'feed.xml', path: '/feed.xml', desc: 'RSS/Atom feed for chronological updates.', category: 'Content Discovery', spec: 'RSS 2.0 / Atom', status: 'Standard' },
  { name: 'feed.json', path: '/feed.json', desc: 'JSON Feed 1.1 alternative to RSS/Atom.', category: 'Content Discovery', spec: 'JSON Feed 1.1', specUrl: 'https://jsonfeed.org/version/1.1', status: 'Adopted' },
  { name: 'agents.txt', path: '/agents.txt', desc: 'agents-txt.com capability announcement (MCP, A2A URLs, skills, payments).', category: 'Agent Discovery', spec: 'agents-txt.com', specUrl: 'https://agents-txt.com', status: 'Emerging' },
  { name: 'agents.json', path: '/agents.json', desc: 'agents-txt.com JSON companion at site root. Not the A2A Agent Card.', category: 'Agent Discovery', spec: 'agents-txt.com', specUrl: 'https://agents-txt.com', status: 'Emerging' },
  { name: 'agent-card.json', path: '/.well-known/agent-card.json', desc: 'A2A Protocol Agent Card. Only if you run an A2A agent.', category: 'Agent Discovery', spec: 'A2A Protocol', specUrl: 'https://a2a-protocol.org/latest/specification/', status: 'Adopted' },
  { name: 'ai-plugin.json', path: '/.well-known/ai-plugin.json', desc: 'Legacy OpenAI plugin manifest. Prefer OpenAPI + MCP for new work.', category: 'Agent Discovery', spec: 'OpenAI (legacy)', status: 'Legacy' },
  { name: 'MCP Server Card', path: '/.well-known/mcp/server-card.json', desc: 'Draft MCP pre-connection metadata (path still in flux).', category: 'Agent Discovery', spec: 'MCP (draft)', specUrl: 'https://modelcontextprotocol.io', status: 'Proposed' },
  { name: 'openapi.json', path: '/openapi.json or /openapi.yaml', desc: 'HTTP API contract for agent tool use.', category: 'Agent Discovery', spec: 'OpenAPI 3.1', specUrl: 'https://spec.openapis.org/oas/v3.1.0', status: 'Standard' },
  { name: '/.well-known/ai', path: '/.well-known/ai', desc: 'IETF draft AI Discovery Endpoint. Not an RFC yet.', category: 'Agent Discovery', spec: 'IETF draft', specUrl: 'https://www.ietf.org/archive/id/draft-aiendpoint-ai-discovery-00.html', status: 'Proposed' },
  { name: 'JSON-LD', path: 'HTML head', desc: 'Schema.org typed facts (Organization, Person, Article, FAQPage).', category: 'Structured Data', spec: 'Schema.org', specUrl: 'https://schema.org', status: 'Standard' },
  { name: 'brand.txt', path: '/brand.txt', desc: 'Informal brand naming guidance. Optional.', category: 'Brand & Identity', spec: 'Community', status: 'Emerging' },
  { name: 'ai.json', path: '/ai.json', desc: 'Informal structured content map. Optional.', category: 'Brand & Identity', spec: 'Community', status: 'Emerging' },
  { name: 'security.txt', path: '/.well-known/security.txt', desc: 'Vulnerability reporting contacts (RFC 9116).', category: 'Trust & Security', spec: 'RFC 9116', specUrl: 'https://www.rfc-editor.org/rfc/rfc9116', status: 'Standard' },
  { name: 'humans.txt', path: '/humans.txt', desc: 'Team credits (humanstxt.org).', category: 'Trust & Security', spec: 'humanstxt.org', specUrl: 'https://humanstxt.org', status: 'Adopted' },
  { name: 'dnt-policy.txt', path: '/.well-known/dnt-policy.txt', desc: 'EFF DNT policy. Low practical impact in 2026.', category: 'Trust & Security', spec: 'EFF DNT', status: 'Legacy' },
  { name: 'carbon.txt', path: '/carbon.txt', desc: 'TOML sustainability disclosures (carbontxt.org v0.5+).', category: 'Sustainability', spec: 'carbontxt.org', specUrl: 'https://carbontxt.org', status: 'Adopted' },
  { name: 'manifest.json', path: '/manifest.json', desc: 'W3C Web App Manifest.', category: 'Platform', spec: 'W3C', specUrl: 'https://www.w3.org/TR/appmanifest/', status: 'Standard' },
  { name: 'browserconfig.xml', path: '/browserconfig.xml', desc: 'Legacy Microsoft tile config.', category: 'Platform', spec: 'Microsoft', status: 'Legacy' },
  { name: 'ads.txt', path: '/ads.txt', desc: 'IAB authorized ad sellers.', category: 'Platform', spec: 'IAB Tech Lab', specUrl: 'https://iabtechlab.com/ads-txt/', status: 'Standard' },
  { name: 'AGENTS.md', path: 'Repo root', desc: 'Cross-tool project context for coding agents.', category: 'Developer Agent', spec: 'agents.md', specUrl: 'https://agents.md', status: 'Emerging' },
  { name: 'CLAUDE.md', path: 'Repo root', desc: 'Claude Code project instructions.', category: 'Developer Agent', spec: 'Anthropic', status: 'Adopted' },
  { name: '.cursorrules', path: 'Repo root / .cursor/rules/', desc: 'Cursor IDE rules.', category: 'Developer Agent', spec: 'Cursor', status: 'Adopted' },
];

const AI_CRAWLERS: { company: string; bots: string[]; note?: string }[] = [
  { company: 'OpenAI', bots: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'OAI-AdsBot'], note: 'ChatGPT-User may ignore robots.txt.' },
  { company: 'Anthropic', bots: ['ClaudeBot', 'Claude-SearchBot', 'Claude-User'], note: 'Honors robots.txt including Claude-User.' },
  { company: 'Google', bots: ['Googlebot', 'Google-Extended', 'GoogleOther', 'Gemini-Deep-Research', 'Google-NotebookLM'], note: 'Google-Extended is a control token, not a separate crawler UA.' },
  { company: 'Perplexity', bots: ['PerplexityBot', 'Perplexity-User'], note: 'Perplexity-User generally ignores robots.txt.' },
  { company: 'Meta', bots: ['meta-externalagent', 'meta-externalfetcher'] },
  { company: 'Apple', bots: ['Applebot', 'Applebot-Extended'] },
  { company: 'Amazon', bots: ['Amazonbot'] },
  { company: 'ByteDance', bots: ['Bytespider'] },
  { company: 'xAI', bots: ['(no official UA)'], note: 'No official crawler docs; third-party tokens are unverified.' },
  { company: 'Mistral', bots: ['MistralAI-User'] },
  { company: 'Microsoft', bots: ['Bingbot'] },
  { company: 'Others', bots: ['CCBot', 'cohere-ai', 'YouBot', 'Diffbot', 'DuckDuckBot'] },
];

const CATEGORIES = [...new Set(DISCOVERY_FILES.map((f) => f.category))];

const STATUS_STYLES: Record<Status, string> = {
  Standard: 'bg-gray-100 text-gray-800 border-gray-200',
  Adopted: 'bg-gray-100 text-gray-800 border-gray-200',
  Emerging: 'bg-gray-50 text-gray-600 border-gray-200',
  Proposed: 'bg-gray-50 text-gray-600 border-gray-200',
  Legacy: 'bg-gray-50 text-gray-500 border-gray-200',
};

const STATUS_DOT: Record<Status, string> = {
  Standard: 'bg-gray-800',
  Adopted: 'bg-gray-700',
  Emerging: 'bg-gray-400',
  Proposed: 'bg-gray-400',
  Legacy: 'bg-gray-300',
};

const STATUS_ORDER: Status[] = ['Standard', 'Adopted', 'Emerging', 'Proposed', 'Legacy'];

const AUTO_IMPL = [
  { title: 'Detect', body: 'Framework and static output dir (public/, static/, …).' },
  { title: 'Read', body: 'package.json for name, description, author, homepage.' },
  { title: 'Scan', body: 'App routes, pages router, and MD/MDX content for llms.txt (and llms-full when sources exist).' },
  { title: 'Write', body: 'robots.txt, agents files, TDMRep, security.txt, manifest, carbon.txt, ai.txt/json, brand.txt, schema-org.json, sitemap when needed.' },
  { title: 'Wire', body: 'Discovery link tags and Organization JSON-LD into layout.tsx or index.html when a safe injection point exists.' },
  { title: 'Avoid fakes', body: 'No A2A card unless --with-a2a. No plugin unless OpenAPI is found or --with-plugin.' },
];

const NOT_AUTO = [
  'Correct production domain if package homepage is wrong',
  'Training allow/deny for legal or business reasons',
  'Real MCP or A2A endpoints (do not invent live capabilities)',
  'Per-page FAQ/Article schema and content quality',
  'Host or CDN so files are served at the domain root',
];

export default function AiDiscoveryStandardsPage() {
  const statusCounts = STATUS_ORDER.reduce(
    (acc, status) => {
      acc[status] = DISCOVERY_FILES.filter((f) => f.status === status).length;
      return acc;
    },
    {} as Record<Status, number>
  );

  return (
    <>
      <header className="pt-12 md:pt-20 pb-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            AI Discovery Standards
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Open-source reference and auto-implementer for files that make a site readable to AI crawlers and agents.
            {DISCOVERY_FILES.length} documented surfaces. One command to wire a project.
          </p>
          <AuthorByline
            links={[
              { label: 'GitHub', href: 'https://github.com/vedangvatsa/ai-discovery-standards' },
            ]}
          />
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="https://github.com/vedangvatsa/ai-discovery-standards"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border bg-card px-4 py-2 text-sm font-medium hover:border-primary/50 transition-colors"
            >
              Repository
            </Link>
            <Link
              href="#install"
              className="inline-flex items-center rounded-md border bg-card px-4 py-2 text-sm font-medium hover:border-primary/50 transition-colors"
            >
              Install
            </Link>
            <Link
              href="#registry"
              className="inline-flex items-center rounded-md border bg-card px-4 py-2 text-sm font-medium hover:border-primary/50 transition-colors"
            >
              File registry
            </Link>
          </div>
        </div>
      </header>

      <div className="py-10 md:py-14">
        <article className="notion-article prose prose-lg prose-neutral max-w-4xl mx-auto">
          <div className="space-y-20 not-prose">

            {/* What */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">What this is</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                A single place that documents the discovery files, crawler tokens, and agent protocols that matter for AI visibility,
                plus a CLI that applies the practical subset to a codebase.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-lg border bg-card p-5">
                  <p className="text-sm font-medium mb-1">Reference</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Paths, formats, maturity, and primary sources for robots.txt, llms.txt, agents.txt, A2A agent-card, TDMRep, schema, and related files.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-5">
                  <p className="text-sm font-medium mb-1">Auto-implementer</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">npx</code> scans a project, writes discovery files, and wires layout head tags when safe.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-5">
                  <p className="text-sm font-medium mb-1">Agent skill</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Claude Code command that runs the same full-auto procedure so coding agents do not invent wrong paths.
                  </p>
                </div>
              </div>
            </section>

            {/* Why */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">Why it exists</h2>
              <div className="space-y-px rounded-lg overflow-hidden border">
                <div className="bg-card p-4">
                  <p className="text-sm font-medium">Training and search are different decisions</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Blocking <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">GPTBot</code> does not remove you from ChatGPT search.
                    Blocking <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">OAI-SearchBot</code> does.
                    Most sites still treat AI bots as one switch.
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium">Paths and names collide</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Root <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">/agents.json</code> is the agents-txt.com catalog.
                    A2A lives at <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">/.well-known/agent-card.json</code>.
                    Mixing them breaks interoperability.
                  </p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm font-medium">Not every file is a standard</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    RFCs, community conventions, and drafts are labeled separately so you do not treat brand.txt like robots.txt.
                  </p>
                </div>
              </div>
            </section>

            {/* How install */}
            <section id="install">
              <h2 className="text-2xl font-semibold tracking-tight mb-2">How to install</h2>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Run from your website project root (not from a random folder). Pass your real domain.
              </p>
              <div className="rounded-lg overflow-hidden border mb-4">
                <div className="bg-muted px-4 py-2 border-b">
                  <span className="text-xs font-medium text-muted-foreground">Full auto (agents and CI)</span>
                </div>
                <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed bg-card">
                  <code>{`npx --yes github:vedangvatsa/ai-discovery-standards --yes --scan --url=https://your-domain.com

# Deny AI training crawlers:
npx --yes github:vedangvatsa/ai-discovery-standards --yes --scan --url=https://your-domain.com --deny-training

# Dry run:
npx --yes github:vedangvatsa/ai-discovery-standards --yes --scan --url=https://your-domain.com --dry-run`}</code>
                </pre>
              </div>
              <div className="rounded-lg overflow-hidden border mb-4">
                <div className="bg-muted px-4 py-2 border-b">
                  <span className="text-xs font-medium text-muted-foreground">Interactive</span>
                </div>
                <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed bg-card">
                  <code>{`npx github:vedangvatsa/ai-discovery-standards`}</code>
                </pre>
              </div>
              <div className="rounded-lg overflow-hidden border">
                <div className="bg-muted px-4 py-2 border-b">
                  <span className="text-xs font-medium text-muted-foreground">Claude Code skill</span>
                </div>
                <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed bg-card">
                  <code>{`mkdir -p .claude/commands
curl -o .claude/commands/setup-ai-discovery.md \\
  https://raw.githubusercontent.com/vedangvatsa/ai-discovery-standards/main/.claude/commands/setup-ai-discovery.md

# Then: /setup-ai-discovery`}</code>
                </pre>
              </div>
            </section>

            {/* What auto does */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">What full auto does</h2>
              <div className="space-y-px rounded-lg overflow-hidden border mb-6">
                {AUTO_IMPL.map((step) => (
                  <div key={step.title} className="bg-card p-4 flex gap-4">
                    <span className="text-sm font-medium shrink-0 w-24">{step.title}</span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                  </div>
                ))}
              </div>
              <h3 className="text-lg font-semibold tracking-tight mb-2">Still needs your judgment</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {NOT_AUTO.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Flags */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">CLI flags</h2>
              <div className="rounded-lg overflow-hidden border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40 text-left">
                      <th className="p-3 font-medium">Flag</th>
                      <th className="p-3 font-medium">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['--yes / -y', 'Non-interactive'],
                      ['--scan', 'Scan routes and content (default with --yes)'],
                      ['--url=https://…', 'Canonical site URL'],
                      ['--name --email --owner', 'Identity overrides'],
                      ['--deny-training / --allow-training', 'Training crawler policy'],
                      ['--with-a2a', 'Emit A2A agent-card stub'],
                      ['--with-plugin', 'Force legacy ai-plugin.json'],
                      ['--force', 'Overwrite existing files'],
                      ['--dry-run', 'Print actions only'],
                      ['--out=public', 'Force output directory'],
                    ].map(([flag, purpose]) => (
                      <tr key={flag} className="border-b last:border-0 bg-card">
                        <td className="p-3 font-mono text-xs whitespace-nowrap">{flag}</td>
                        <td className="p-3 text-muted-foreground">{purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Training vs search */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">Training vs search</h2>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Configure these separately in robots.txt. User-triggered fetchers may ignore robots.txt.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-lg border bg-card p-5">
                  <p className="text-sm font-medium mb-2">Training</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Content may train or improve models. Little or no citation.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['GPTBot', 'ClaudeBot', 'CCBot', 'Google-Extended'].map((bot) => (
                      <code key={bot} className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{bot}</code>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-5">
                  <p className="text-sm font-medium mb-2">Search and retrieval</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Content may appear in AI search answers and citations.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot'].map((bot) => (
                      <code key={bot} className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{bot}</code>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Maturity counts */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">Maturity of documented files</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Counts for this registry only.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {STATUS_ORDER.map((status) => (
                  <div key={status} className="rounded-lg border bg-card p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[status]}`} />
                      <span className="text-sm font-medium">{status}</span>
                    </div>
                    <p className="text-3xl font-semibold tracking-tight">{statusCounts[status]}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {status === 'Standard' && 'RFC or W3C Recommendation'}
                      {status === 'Adopted' && 'Published spec, real use'}
                      {status === 'Emerging' && 'Community convention'}
                      {status === 'Proposed' && 'Active draft'}
                      {status === 'Legacy' && 'Low impact or superseded'}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Registry nav */}
            <section id="registry">
              <h2 className="text-2xl font-semibold tracking-tight mb-2">File registry</h2>
              <p className="text-sm text-muted-foreground mb-6">
                {DISCOVERY_FILES.length} files in {CATEGORIES.length} categories.
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
                            <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[file.status]}`}>
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
                              Official specification
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

            {/* Crawlers */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">AI crawler tokens</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Prefer vendor docs and published IP lists over third-party directories.
              </p>
              <div className="space-y-px rounded-lg overflow-hidden border">
                {AI_CRAWLERS.map((group) => (
                  <div key={group.company} className="bg-card p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                      <span className="font-medium text-sm shrink-0 sm:w-28">{group.company}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap gap-1.5">
                          {group.bots.map((bot) => (
                            <code key={bot} className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
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

            {/* Contribute */}
            <section>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">Contribute</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                The project is public on GitHub. External contributors open pull requests.
                Merges require a maintainer with write access. Random users cannot push to{' '}
                <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">main</code>.
              </p>
              <div className="rounded-lg border bg-card p-5 text-sm text-muted-foreground leading-relaxed space-y-2">
                <p>
                  Prefer PRs with a primary source link (vendor docs, RFC, or published spec).
                  Directory-only crawler claims are not enough.
                </p>
                <p>
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
                  <span className="font-medium text-sm">Site Checklist</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Foundations, SEO, accessibility, security, and agent readiness.
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
                    CLI source, templates, and long-form reference.
                  </p>
                </Link>
              </div>
            </section>

            <p className="text-xs text-muted-foreground/60 text-center">
              MIT license. Last verified July 2026. A2A:{' '}
              <code className="font-mono">/.well-known/agent-card.json</code>. agents-txt companion:{' '}
              <code className="font-mono">/agents.json</code>.
            </p>
          </div>
        </article>
      </div>
    </>
  );
}

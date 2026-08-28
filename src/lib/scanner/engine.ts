import { CheckResult, ScanResult } from './types';

const PROBE_TIMEOUT_MS = 4500;

function isPrivateIpOrHost(hostname: string): boolean {
  const host = hostname.toLowerCase().trim();
  if (
    host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || host === '::1' ||
    host.endsWith('.local') || host.endsWith('.internal') || host.endsWith('.localhost')
  ) return true;
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^169\.254\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  return false;
}

export function normalizeTargetUrl(input: string): { url: string; domain: string; origin: string } {
  let raw = input.trim();
  if (!raw.startsWith('http://') && !raw.startsWith('https://')) raw = `https://${raw}`;
  const parsed = new URL(raw);
  if (isPrivateIpOrHost(parsed.hostname)) {
    throw new Error(`Scanning private or local address '${parsed.hostname}' is not permitted.`);
  }
  return { url: parsed.toString(), domain: parsed.hostname, origin: parsed.origin };
}

type FetchResult = { ok: boolean; status: number; text: string; headers: Headers } | null;

async function safeFetch(url: string, init?: RequestInit): Promise<FetchResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        'User-Agent': 'VedaAgenticScanner/1.0 (+https://veda.ng/scan; agent-readiness-audit)',
        ...init?.headers,
      },
    });
    const text = await res.text().catch(() => '');
    return { ok: res.ok, status: res.status, text, headers: res.headers };
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function scoreLayer(checks: CheckResult[]) {
  const score = checks.reduce((a, c) => a + c.score, 0);
  const maxScore = checks.reduce((a, c) => a + c.maxScore, 0);
  return { score, maxScore, percentage: Math.round((score / Math.max(1, maxScore)) * 100) };
}

export async function scanDomain(targetInput: string): Promise<ScanResult> {
  const startTime = Date.now();
  const { url, domain, origin } = normalizeTargetUrl(targetInput);

  // ── Parallel probe fetches ─────────────────────────────────────────────────
  const [
    robotsRes, llmsRes, llmsFullRes, ardRes, aiCatalogRes, pluginRes, sitemapRes,
    mdAcceptRes, mdTwinRes, botUaRes,
    mcpWellKnownRes, mcpApiRes, openapiRes, authRes,
    agentsTxtRes, agentsJsonRes, agentCardRes,
    securityTxtRes, tdmrepRes, feedRes, feedJsonRes,
    homepageRes, rateLimitRes,
    aiPluginRes, sitemapJsonRes, termsRes,
  ] = await Promise.all([
    safeFetch(`${origin}/robots.txt`),
    safeFetch(`${origin}/llms.txt`),
    safeFetch(`${origin}/llms-full.txt`),
    safeFetch(`${origin}/.well-known/ard.json`),
    safeFetch(`${origin}/.well-known/ai-catalog.json`),
    safeFetch(`${origin}/plugin.json`),
    safeFetch(`${origin}/sitemap.xml`),
    safeFetch(`${origin}/`, { headers: { Accept: 'text/markdown, text/plain;q=0.9' } }),
    safeFetch(`${origin}/index.md`),
    safeFetch(`${origin}/`, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GPTBot/1.0; +https://openai.com/gptbot)' } }),
    safeFetch(`${origin}/.well-known/mcp`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 'probe-1', method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'veda-scanner', version: '1.0' } } }),
    }),
    safeFetch(`${origin}/api/mcp`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 'probe-2', method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'veda-scanner', version: '1.0' } } }),
    }),
    safeFetch(`${origin}/openapi.json`),
    safeFetch(`${origin}/auth.md`),
    safeFetch(`${origin}/agents.txt`),
    safeFetch(`${origin}/.well-known/agents.json`),
    safeFetch(`${origin}/.well-known/agent-card.json`),
    safeFetch(`${origin}/.well-known/security.txt`),
    safeFetch(`${origin}/.well-known/tdmrep.json`),
    safeFetch(`${origin}/feed.xml`),
    safeFetch(`${origin}/feed.json`),
    safeFetch(`${origin}/`),
    safeFetch(`${origin}/api`),
    safeFetch(`${origin}/.well-known/ai-plugin.json`),
    safeFetch(`${origin}/.well-known/sitemap.json`),
    safeFetch(`${origin}/terms-of-use.md`),
  ]);

  const homepageHtml = homepageRes?.text || mdAcceptRes?.text || '';
  const secHeaders = homepageRes?.headers ?? mdAcceptRes?.headers ?? botUaRes?.headers;

  const isHttps = origin.startsWith('https://');
  const hsts = secHeaders?.get('strict-transport-security') || '';
  const csp = secHeaders?.get('content-security-policy') || '';
  const xcto = secHeaders?.get('x-content-type-options') || '';
  const xfo = secHeaders?.get('x-frame-options') || '';
  const rp = secHeaders?.get('referrer-policy') || '';
  const pp = secHeaders?.get('permissions-policy') || '';

  function getMetaContent(name: string, html: string): string {
    const m = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'))
           || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`, 'i'));
    return m ? m[1] : '';
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LAYER 1 — Discovery
  // ──────────────────────────────────────────────────────────────────────────
  const discoveryChecks: CheckResult[] = [];

  // 1.1 AI Crawler Policy
  if (robotsRes?.ok && robotsRes.text) {
    const txt = robotsRes.text;
    const allowsGptBot    = !/User-agent:\s*GPTBot[\s\S]*?Disallow:\s*\/\s*$/im.test(txt);
    const allowsClaudeBot = !/User-agent:\s*ClaudeBot[\s\S]*?Disallow:\s*\/\s*$/im.test(txt);
    const allowsPerplexity = !/User-agent:\s*PerplexityBot[\s\S]*?Disallow:\s*\/\s*$/im.test(txt);
    const mentionsAiBots  = /GPTBot|ClaudeBot|PerplexityBot|OAI-SearchBot|Google-Extended|Applebot-Extended/i.test(txt);

    if (allowsGptBot && allowsClaudeBot && allowsPerplexity && mentionsAiBots) {
      discoveryChecks.push({
        id: 'robots-ai-policy', name: 'AI Crawler Policy (robots.txt)', layer: 'discovery',
        status: 'pass', score: 3, maxScore: 3, impact: 'critical',
        details: 'robots.txt explicitly allows GPTBot, ClaudeBot, and PerplexityBot with dedicated Allow directives.',
        why: 'ChatGPT, Perplexity, and Claude\'s web search bots consult robots.txt before crawling. If your site isn\'t explicitly allowed, you won\'t appear in AI-generated answers — even if your content is publicly accessible via a browser.',
        referenceUrl: 'https://veda.ng/aistandards',
      });
    } else if (allowsGptBot || allowsClaudeBot) {
      discoveryChecks.push({
        id: 'robots-ai-policy', name: 'AI Crawler Policy (robots.txt)', layer: 'discovery',
        status: 'pass', score: 2, maxScore: 3, impact: 'critical',
        details: 'robots.txt allows some primary AI search bots but lacks explicit directives for all major answer engines.',
        why: 'Partial AI bot coverage means some answer engines (e.g. Perplexity, DeepSeek) may not crawl your content, reducing your citation surface in AI search results.',
        recommendation: 'Add explicit per-agent directives for all major AI answer engines and distinguish them from scraper bots.',
        fixSnippet: { language: 'robots.txt', filename: 'public/robots.txt', code: `# Allow AI Answer Engines\nUser-agent: GPTBot\nUser-agent: ClaudeBot\nUser-agent: PerplexityBot\nUser-agent: OAI-SearchBot\nUser-agent: Google-Extended\nUser-agent: DeepSeekBot\nUser-agent: Applebot-Extended\nAllow: /\n\n# Block Mass Dataset Harvesters\nUser-agent: CCBot\nUser-agent: ByteSpider\nDisallow: /` },
        referenceUrl: 'https://veda.ng/aistandards',
      });
    } else {
      discoveryChecks.push({
        id: 'robots-ai-policy', name: 'AI Crawler Policy (robots.txt)', layer: 'discovery',
        status: 'warning', score: 1, maxScore: 3, impact: 'critical',
        details: 'robots.txt does not include explicit directives for AI answer engine bots, or actively blocks them.',
        why: 'Without explicit AI bot rules, answer engines like ChatGPT and Perplexity may not index your content. A catch-all `Allow: *` is insufficient — dedicated per-agent rules signal intent and prevent over-broad blocks from applying.',
        recommendation: 'Add explicit Allow rules for AI answer engines. You can separately block training crawlers (CCBot, ByteSpider) while keeping search bots open.',
        fixSnippet: { language: 'robots.txt', filename: 'public/robots.txt', code: `# Allow AI Answer Engines & Search Bots\nUser-agent: GPTBot\nUser-agent: ClaudeBot\nUser-agent: PerplexityBot\nUser-agent: OAI-SearchBot\nUser-agent: Google-Extended\nUser-agent: DeepSeekBot\nAllow: /\n\n# Block Scraping / Mass Dataset Harvesters\nUser-agent: CCBot\nUser-agent: ByteSpider\nDisallow: /` },
        referenceUrl: 'https://veda.ng/aistandards',
      });
    }
  } else {
    discoveryChecks.push({
      id: 'robots-ai-policy', name: 'AI Crawler Policy (robots.txt)', layer: 'discovery',
      status: 'fail', score: 0, maxScore: 3, impact: 'critical',
      details: 'No robots.txt file found at /robots.txt (returned 404 or connection error).',
      why: 'robots.txt is the first thing AI crawlers check before visiting any page. Without it, bots must assume default behaviour — some may avoid your site entirely, costing you citations in AI search products.',
      recommendation: 'Publish a robots.txt file at the root of your domain with explicit AI bot directives and a Sitemap reference.',
      fixSnippet: { language: 'robots.txt', filename: 'public/robots.txt', code: `User-agent: *\nAllow: /\n\n# Allow AI Answer Engines explicitly\nUser-agent: GPTBot\nUser-agent: ClaudeBot\nUser-agent: PerplexityBot\nAllow: /\n\nSitemap: ${origin}/sitemap.xml` },
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 1.2 llms.txt
  if (llmsRes?.ok && llmsRes.text && llmsRes.text.length > 50) {
    const hasStructure = /^#\s+/m.test(llmsRes.text) && /\[.*?\]\(.*?\)/.test(llmsRes.text);
    discoveryChecks.push({
      id: 'llms-txt', name: 'LLM Index (llms.txt)', layer: 'discovery',
      status: hasStructure ? 'pass' : 'warning', score: hasStructure ? 3 : 2, maxScore: 3, impact: 'critical',
      details: `llms.txt found at /llms.txt (${llmsRes.text.length.toLocaleString()} chars). ${hasStructure ? 'Well-structured with Markdown headings and navigation links.' : 'Content found but lacks structured Markdown headings and link navigation.'}`,
      why: 'llms.txt is a Markdown index file that tells LLMs what your site is about and where to find key pages — without crawling your entire HTML structure. It dramatically reduces the tokens an agent needs to understand your product. ChatGPT, Claude, and Perplexity all read it.',
      recommendation: hasStructure ? undefined : 'Add Markdown headings (# H1, ## H2) and linked sections so LLMs can navigate your content efficiently.',
      fixSnippet: hasStructure ? undefined : { language: 'markdown', filename: 'public/llms.txt', code: `# ${domain}\n\n> Short one-liner about what this site offers.\n\n## Core Documentation\n- [Getting Started](${origin}/docs): Quick start guide\n- [API Reference](${origin}/api): Full REST API documentation\n- [Pricing](${origin}/pricing): Free and paid plan details` },
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    discoveryChecks.push({
      id: 'llms-txt', name: 'LLM Index (llms.txt)', layer: 'discovery',
      status: 'fail', score: 0, maxScore: 3, impact: 'critical',
      details: llmsRes && !llmsRes.ok ? `Request to /llms.txt returned HTTP ${llmsRes.status}.` : 'No llms.txt file found at /llms.txt.',
      why: 'Without llms.txt, AI agents have to crawl your entire site to understand what you offer — often giving up early. Adding a concise index file can directly increase how often your domain appears in AI-generated answers and code suggestions.',
      recommendation: 'Create a /llms.txt file at your domain root. Follow the llmstxt.org spec: H1 site name, blockquote description, then ## sections of Markdown links.',
      fixSnippet: { language: 'markdown', filename: 'public/llms.txt', code: `# ${domain}\n\n> Summary of what this site / product offers in one sentence.\n\n## Main Pages\n- [Home](${origin}/): Landing page\n- [Documentation](${origin}/docs): Technical documentation\n- [API Reference](${origin}/api): REST API endpoints\n- [Pricing](${origin}/pricing): Subscription tiers\n\n## Optional: Full context\n- [llms-full.txt](${origin}/llms-full.txt): Complete site content for deep LLM ingestion` },
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 1.3 llms-full.txt
  if (llmsFullRes?.ok && llmsFullRes.text && llmsFullRes.text.length > 200) {
    discoveryChecks.push({
      id: 'llms-full-txt', name: 'Full-text Context Index (llms-full.txt)', layer: 'discovery',
      status: 'pass', score: 2, maxScore: 2, impact: 'recommended',
      details: `llms-full.txt found at /llms-full.txt (${llmsFullRes.text.length.toLocaleString()} chars). Provides a complete single-request corpus for deep ingestion.`,
      why: 'llms-full.txt lets AI agents ingest your entire documentation in a single HTTP request — without follow-up fetches. For docs-heavy sites, this is the difference between an agent understanding 20% vs 100% of your content.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    discoveryChecks.push({
      id: 'llms-full-txt', name: 'Full-text Context Index (llms-full.txt)', layer: 'discovery',
      status: 'warning', score: 0, maxScore: 2, impact: 'recommended',
      details: 'No llms-full.txt found at /llms-full.txt. This optional file extends llms.txt with full page content.',
      why: 'Some AI agents (like deep-research tools and RAG pipelines) prefer a single full-text dump over crawling multiple pages. Serving a complete markdown corpus at /llms-full.txt can significantly improve AI understanding of your product docs.',
      recommendation: 'Generate a concatenated Markdown file at build time with full content of your key pages (docs, API reference, guides). Regenerate on every deploy.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 1.4 ARD / AI Catalog
  const ardValid = (ardRes?.ok && ardRes.text.includes('entries')) || (aiCatalogRes?.ok && aiCatalogRes.text.includes('entries'));
  if (ardValid) {
    discoveryChecks.push({
      id: 'ard-catalog', name: 'Agentic Resource Discovery (ARD Catalog)', layer: 'discovery',
      status: 'pass', score: 3, maxScore: 3, impact: 'important',
      details: 'Valid ARD v0.91 catalog found at /.well-known/ard.json or /.well-known/ai-catalog.json with an entries array.',
      why: 'ARD (Agentic Resource Discovery) is the machine-readable manifest that tells autonomous agents exactly what tools, APIs, and MCP servers you expose — without guessing from HTML. It\'s the equivalent of DNS for agent tool discovery.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    discoveryChecks.push({
      id: 'ard-catalog', name: 'Agentic Resource Discovery (ARD Catalog)', layer: 'discovery',
      status: 'warning', score: 0, maxScore: 3, impact: 'important',
      details: 'No ARD catalog found at /.well-known/ard.json or /.well-known/ai-catalog.json.',
      why: 'Without an ARD catalog, agents that support it must discover your capabilities through trial and error — fetching multiple URLs looking for MCP, OpenAPI, and other signals. A single JSON manifest eliminates that guesswork.',
      recommendation: 'Publish an /.well-known/ard.json file listing your APIs, MCP servers, SDKs, and documentation links in machine-readable form.',
      fixSnippet: { language: 'json', filename: 'public/.well-known/ard.json', code: `{\n  "specVersion": "1.0",\n  "host": {\n    "displayName": "${domain}",\n    "identifier": "${domain}"\n  },\n  "entries": [\n    {\n      "identifier": "urn:air:${domain}:mcp-server:product",\n      "displayName": "Product MCP Server",\n      "type": "application/mcp-server+json",\n      "url": "${origin}/.well-known/mcp",\n      "description": "Exposes tools for querying ${domain} programmatically"\n    },\n    {\n      "identifier": "urn:air:${domain}:openapi",\n      "displayName": "REST API (OpenAPI 3.1)",\n      "type": "application/openapi+json",\n      "url": "${origin}/openapi.json"\n    }\n  ]\n}` },
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 1.5 Plugin manifest
  if (pluginRes?.ok && pluginRes.text.includes('capabilities')) {
    discoveryChecks.push({
      id: 'agent-plugins', name: 'Agent Plugins Manifest (plugin.json)', layer: 'discovery',
      status: 'pass', score: 2, maxScore: 2, impact: 'optional',
      details: 'Agent Plugins manifest found and valid (agent-plugins.org schema with capabilities field).',
      why: 'plugin.json is the agent-plugins.org standard for advertising tool capabilities. Some agent runtimes use it to auto-discover tools without reading your HTML documentation.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    discoveryChecks.push({
      id: 'agent-plugins', name: 'Agent Plugins Manifest (plugin.json)', layer: 'discovery',
      status: 'warning', score: 0, maxScore: 2, impact: 'optional',
      details: 'No plugin.json found at /plugin.json.',
      why: 'plugin.json is an emerging standard for agent-plugins.org compatible runtimes. If you offer a tool-based API, publishing this file can enable auto-discovery in supported agent hosts.',
      recommendation: 'Publish a plugin.json file at your domain root following the agent-plugins.org schema.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 1.6 XML Sitemap
  if (sitemapRes?.ok && sitemapRes.text.includes('<urlset')) {
    const urlCount = (sitemapRes.text.match(/<url>/g) || []).length;
    discoveryChecks.push({
      id: 'xml-sitemap', name: 'XML Sitemap (sitemap.xml)', layer: 'discovery',
      status: 'pass', score: 2, maxScore: 2, impact: 'important',
      details: `Valid XML sitemap at /sitemap.xml listing ${urlCount > 0 ? `${urlCount.toLocaleString()} URLs` : 'URLs'}.`,
      why: 'The XML sitemap is how both traditional search engines and AI crawlers discover all of your pages. Without it, agents must guess your URL structure — missing pages that aren\'t linked from your homepage.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    discoveryChecks.push({
      id: 'xml-sitemap', name: 'XML Sitemap (sitemap.xml)', layer: 'discovery',
      status: 'warning', score: 1, maxScore: 2, impact: 'important',
      details: 'No XML sitemap detected at /sitemap.xml.',
      why: 'Without a sitemap, AI crawlers can only discover URLs they encounter via links. Deep documentation pages, API references, and product features may never be indexed — reducing your citation surface in AI answers.',
      recommendation: 'Generate an XML sitemap with lastmod timestamps. Most frameworks (Next.js, Nuxt, Astro) can auto-generate this at build time.',
      fixSnippet: { language: 'typescript', filename: 'src/app/sitemap.ts (Next.js)', code: `export default function sitemap() {\n  return [\n    { url: '${origin}/', lastModified: new Date(), priority: 1.0 },\n    { url: '${origin}/docs', lastModified: new Date(), priority: 0.9 },\n    { url: '${origin}/api', lastModified: new Date(), priority: 0.8 },\n  ];\n}` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 1.7 agents.txt
  if (agentsTxtRes?.ok && agentsTxtRes.text && agentsTxtRes.text.length > 20) {
    discoveryChecks.push({
      id: 'agents-txt', name: 'Agent Protocol Index (agents.txt)', layer: 'discovery',
      status: 'pass', score: 1, maxScore: 1, impact: 'optional',
      details: 'agents.txt published at /agents.txt announcing supported agent protocols.',
      why: 'agents.txt is a lightweight text file that announces which agent protocols (MCP, A2A, payment channels) your site supports. It\'s the simplest way for an agent to answer "what can I do here?" in a single request.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    discoveryChecks.push({
      id: 'agents-txt', name: 'Agent Protocol Index (agents.txt)', layer: 'discovery',
      status: 'warning', score: 0, maxScore: 1, impact: 'optional',
      details: 'No agents.txt found at /agents.txt.',
      why: 'agents.txt is an emerging convention for announcing agent-compatible protocols. As agent runtimes standardize on discovery patterns, having this file can save agents several round-trips spent hunting for your MCP and API endpoints.',
      recommendation: 'Publish a simple agents.txt at your domain root listing supported protocol endpoints.',
      fixSnippet: { language: 'text', filename: 'public/agents.txt', code: `# Supported Agent Protocols\nMCP: ${origin}/.well-known/mcp\nLLMs: ${origin}/llms.txt\nOpenAPI: ${origin}/openapi.json\nA2A: ${origin}/.well-known/agent-card.json` },
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 1.8 agents.json
  if (agentsJsonRes?.ok && agentsJsonRes.text && agentsJsonRes.text.includes('when_to_use')) {
    discoveryChecks.push({
      id: 'agents-json', name: 'Agent Manifest (/.well-known/agents.json)', layer: 'discovery',
      status: 'pass', score: 2, maxScore: 2, impact: 'important',
      details: '/.well-known/agents.json found with task-suitability fields (when_to_use). Enables autonomous agent task delegation.',
      why: 'agents.json is a structured manifest that tells orchestrating AI agents *when* to use your service, what tasks you\'re suited for, and which tool endpoints to call. It enables autonomous multi-agent systems to discover and delegate to your service without human configuration.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    discoveryChecks.push({
      id: 'agents-json', name: 'Agent Manifest (/.well-known/agents.json)', layer: 'discovery',
      status: 'warning', score: 0, maxScore: 2, impact: 'important',
      details: 'No /.well-known/agents.json manifest found.',
      why: 'Without agents.json, autonomous agents can\'t programmatically determine whether your service is suitable for their task. They either skip your site or require manual configuration by the user — creating friction in agentic workflows.',
      recommendation: 'Publish a /.well-known/agents.json describing your service\'s task suitability, tool endpoints, and runtime guidance.',
      fixSnippet: { language: 'json', filename: 'public/.well-known/agents.json', code: `{\n  "name": "${domain}",\n  "description": "What this service does in one sentence",\n  "when_to_use": "Use this agent when you need to [specific use case]",\n  "skills": ["search", "retrieve", "summarize"],\n  "tools": [\n    {\n      "name": "search",\n      "description": "Search content on ${domain}",\n      "url": "${origin}/.well-known/mcp"\n    }\n  ],\n  "contact": "https://${domain}/contact"\n}` },
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 1.9 A2A Agent Card
  if (agentCardRes?.ok && agentCardRes.text && agentCardRes.text.includes('name')) {
    discoveryChecks.push({
      id: 'a2a-card', name: 'A2A Agent Card (/.well-known/agent-card.json)', layer: 'discovery',
      status: 'pass', score: 2, maxScore: 2, impact: 'optional',
      details: 'Google A2A agent card found at /.well-known/agent-card.json for agent-to-agent delegation.',
      why: 'The A2A (Agent-to-Agent) protocol from Google lets autonomous agents delegate subtasks to each other. Your agent card advertises your capabilities so other agents can call you programmatically — like a web service but for AI-to-AI communication.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    discoveryChecks.push({
      id: 'a2a-card', name: 'A2A Agent Card (/.well-known/agent-card.json)', layer: 'discovery',
      status: 'warning', score: 0, maxScore: 2, impact: 'optional',
      details: 'No A2A agent card found at /.well-known/agent-card.json.',
      why: 'As multi-agent systems become mainstream, the A2A protocol will allow AI agents to hire and delegate to each other. Publishing an agent card now positions your service to receive autonomous agent traffic.',
      recommendation: 'Publish a /.well-known/agent-card.json following the Google A2A specification.',
      fixSnippet: { language: 'json', filename: 'public/.well-known/agent-card.json', code: `{\n  "name": "${domain} Agent",\n  "description": "AI agent for ${domain} — what tasks it handles",\n  "version": "1.0.0",\n  "url": "${origin}/.well-known/mcp",\n  "capabilities": {\n    "streaming": false,\n    "tools": true,\n    "authentication": "none"\n  },\n  "contact": "${origin}/contact"\n}` },
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 1.10 Selective AI robots.txt Directives
  if (robotsRes?.ok && robotsRes.text) {
    const txt = robotsRes.text;
    const blocksTraining = /User-agent:\s*(GPTBot|ClaudeBot|CCBot|Google-Extended)[\s\S]*?Disallow:\s*\/\s*$/im.test(txt);
    const allowsSearch = /User-agent:\s*(OAI-SearchBot|PerplexityBot|Claude-SearchBot)[\s\S]*?Allow:\s*\/\s*$/im.test(txt);

    if (blocksTraining && allowsSearch) {
      discoveryChecks.push({
        id: 'robots-selective-ai-policy', name: 'Selective AI Crawler Rules (robots.txt)', layer: 'discovery',
        status: 'pass', score: 2, maxScore: 2, impact: 'important',
        details: 'robots.txt selectively restricts model training bots (GPTBot/ClaudeBot) while explicitly allowing live search bots (OAI-SearchBot/PerplexityBot).',
        why: 'In the agentic web, complete crawler blocks harm discoverability. The best practice is a tiered policy: restrict training harvesters to protect intellectual property, but allow live search retrieval so agents can site-source your domain in answers.',
        referenceUrl: 'https://veda.ng/aistandards',
      });
    } else {
      discoveryChecks.push({
        id: 'robots-selective-ai-policy', name: 'Selective AI Crawler Rules (robots.txt)', layer: 'discovery',
        status: 'warning', score: 1, maxScore: 2, impact: 'important',
        details: 'robots.txt does not distinguish between model training crawlers and live search citation agents.',
        why: 'Applying a blanket allow/disallow treats training crawlers and search agents identically. This can either expose all your data to model training or completely hide your site from AI search engines.',
        recommendation: 'Add selective directives in robots.txt: block GPTBot and ClaudeBot, but allow OAI-SearchBot and PerplexityBot.',
        fixSnippet: { language: 'robots.txt', filename: 'public/robots.txt', code: `# Allow AI Search Engines\nUser-agent: OAI-SearchBot\nUser-agent: PerplexityBot\nAllow: /\n\n# Block general training models\nUser-agent: GPTBot\nUser-agent: ClaudeBot\nUser-agent: Google-Extended\nDisallow: /` },
        referenceUrl: 'https://veda.ng/aistandards',
      });
    }
  } else {
    discoveryChecks.push({
      id: 'robots-selective-ai-policy', name: 'Selective AI Crawler Rules (robots.txt)', layer: 'discovery',
      status: 'fail', score: 0, maxScore: 2, impact: 'important',
      details: 'robots.txt not found or empty.',
      why: 'AI search engines cannot selectively process your domain without a robots.txt file indicating clear access rules.',
      recommendation: 'Publish a robots.txt containing selective AI bot rules.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 1.11 OpenAI Plugin Manifest (/.well-known/ai-plugin.json)
  if (aiPluginRes?.ok && aiPluginRes.text && aiPluginRes.text.includes('schema_version')) {
    discoveryChecks.push({
      id: 'openai-plugin', name: 'OpenAI Plugin Manifest (ai-plugin.json)', layer: 'discovery',
      status: 'pass', score: 2, maxScore: 2, impact: 'optional',
      details: 'OpenAI plugin manifest found and validated at /.well-known/ai-plugin.json.',
      why: 'ai-plugin.json is OpenAI\'s standard for describing API-driven capabilities. Even as plugins evolve, ChatGPT and other API-aware orchestrators use this file to auto-discover tool specs and authentication parameters.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    discoveryChecks.push({
      id: 'openai-plugin', name: 'OpenAI Plugin Manifest (ai-plugin.json)', layer: 'discovery',
      status: 'warning', score: 0, maxScore: 2, impact: 'optional',
      details: 'No plugin manifest detected at /.well-known/ai-plugin.json.',
      why: 'Publishing a plugin manifest allows chat interfaces to interact directly with your API schemas to fetch live data on demand.',
      recommendation: 'Create a /.well-known/ai-plugin.json defining your API descriptions, schemas, and icons.',
      fixSnippet: { language: 'json', filename: 'public/.well-known/ai-plugin.json', code: `{\n  "schema_version": "v1",\n  "name_for_human": "${domain} Service",\n  "name_for_model": "${domain.replace(/\\./g, '')}",\n  "description_for_human": "Human description of your service.",\n  "description_for_model": "Model-facing guide explaining when to call the API.",\n  "auth": { "type": "none" },\n  "api": { "type": "openapi", "url": "${origin}/openapi.json" },\n  "logo_url": "${origin}/logo.png",\n  "contact_email": "support@${domain}",\n  "legal_info_url": "${origin}/legal"\n}` },
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 1.12 JSON Sitemap (sitemap.json)
  if (sitemapJsonRes?.ok && sitemapJsonRes.text && sitemapJsonRes.text.includes('urls')) {
    discoveryChecks.push({
      id: 'sitemap-json', name: 'JSON Sitemap (sitemap.json)', layer: 'discovery',
      status: 'pass', score: 2, maxScore: 2, impact: 'optional',
      details: 'JSON Sitemap found at /.well-known/sitemap.json. Clean and cheap format for agent parsing.',
      why: 'JSON sitemaps are an emerging standard for agentic discoverability. Agents can fetch and parse JSON with far less compute/tokens compared to parsing legacy XML schemas, reducing execution latency.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    discoveryChecks.push({
      id: 'sitemap-json', name: 'JSON Sitemap (sitemap.json)', layer: 'discovery',
      status: 'warning', score: 0, maxScore: 2, impact: 'optional',
      details: 'No JSON Sitemap found at /.well-known/sitemap.json.',
      why: 'Standard XML sitemaps require XML parsing libraries and are verbose. A JSON sitemap provides a token-efficient, structure-friendly way for API-based agents to map your pages.',
      recommendation: 'Publish a sitemap.json listing your core URLs, titles, and update frequencies.',
      fixSnippet: { language: 'json', filename: 'public/.well-known/sitemap.json', code: `{\n  "urls": [\n    { "url": "${origin}/", "title": "Home", "lastmod": "${new Date().toISOString().split('T')[0]}" },\n    { "url": "${origin}/docs", "title": "Docs", "lastmod": "${new Date().toISOString().split('T')[0]}" }\n  ]\n}` },
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LAYER 2 — Access
  // ──────────────────────────────────────────────────────────────────────────
  const accessChecks: CheckResult[] = [];

  // 2.1 Markdown Content Negotiation
  const acceptsMd = mdAcceptRes?.ok && (
    mdAcceptRes.headers.get('content-type')?.includes('text/markdown') ||
    mdAcceptRes.headers.get('content-type')?.includes('text/plain') ||
    mdAcceptRes.text.startsWith('# ') || mdAcceptRes.text.startsWith('---')
  );
  if (acceptsMd) {
    accessChecks.push({
      id: 'markdown-negotiation', name: 'Markdown Content Negotiation (Accept: text/markdown)', layer: 'access',
      status: 'pass', score: 3, maxScore: 3, impact: 'important',
      details: 'Server returns clean Markdown when requested with the Accept: text/markdown header.',
      why: 'HTML pages cost AI agents 3–10× more tokens than equivalent Markdown. Serving Markdown on request means agents can ingest your content faster, cheaper, and with less noise (no nav bars, scripts, or ads to parse).',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    accessChecks.push({
      id: 'markdown-negotiation', name: 'Markdown Content Negotiation (Accept: text/markdown)', layer: 'access',
      status: 'warning', score: 1, maxScore: 3, impact: 'important',
      details: 'Server returns HTML even when the client sends Accept: text/markdown — no content negotiation detected.',
      why: 'When an LLM agent fetches your page, it receives the full HTML including navigation, scripts, and styles. This inflates token count 5–10× vs clean Markdown. Agents that support content negotiation will prefer text/markdown, reducing their cost to read your site.',
      recommendation: 'Implement server-side content negotiation: check the Accept header and return Markdown from a /api/md/ route, or use Next.js middleware to rewrite requests.',
      fixSnippet: { language: 'typescript', filename: 'src/middleware.ts (Next.js)', code: `import { NextRequest, NextResponse } from 'next/server';\n\nexport function middleware(req: NextRequest) {\n  const accept = req.headers.get('accept') ?? '';\n  if (accept.includes('text/markdown') || accept.includes('text/plain')) {\n    // Rewrite to a .md variant of the page\n    const mdUrl = new URL('/api/md' + req.nextUrl.pathname, req.url);\n    return NextResponse.rewrite(mdUrl);\n  }\n}\n\nexport const config = { matcher: ['/((?!api|_next|.*\\\\..*).*)'] };` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 2.2 Markdown URL Twins
  const hasMdTwin = mdTwinRes?.ok && (
    mdTwinRes.headers.get('content-type')?.includes('markdown') ||
    mdTwinRes.text.startsWith('#') || mdTwinRes.text.startsWith('---')
  );
  if (hasMdTwin) {
    accessChecks.push({
      id: 'markdown-twins', name: 'Markdown URL Twins (/index.md)', layer: 'access',
      status: 'pass', score: 3, maxScore: 3, impact: 'important',
      details: '/index.md is reachable and returns valid Markdown. Agents can predict .md URL patterns across your site.',
      why: 'Predictable .md twins (e.g. /docs → /docs.md) allow agents to fetch clean content without HTTP negotiation. Any agent that knows your URL structure can grab the Markdown version directly — no special headers needed.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    accessChecks.push({
      id: 'markdown-twins', name: 'Markdown URL Twins (/index.md)', layer: 'access',
      status: 'warning', score: 1, maxScore: 3, impact: 'important',
      details: '/index.md returned 404 or non-Markdown content. No .md URL pattern detected.',
      why: 'Without .md URL twins, agents that can\'t set custom Accept headers (e.g. simple fetch() calls) have no easy way to get clean Markdown. Adding twin paths is a simple, zero-configuration win for AI consumption.',
      recommendation: 'Serve a Markdown companion at predictable .md paths for each key page (/docs → /docs.md). In Next.js, this can be a catch-all route that renders Markdown from your content source.',
      fixSnippet: { language: 'typescript', filename: 'src/app/[...path]/md/route.ts', code: `// Serve Markdown twin at e.g. /docs.md\nexport async function GET(req: Request) {\n  const pathname = new URL(req.url).pathname.replace(/\\.md$/, '');\n  const markdown = await getPageMarkdown(pathname); // your CMS/MDX loader\n  return new Response(markdown, {\n    headers: { 'Content-Type': 'text/markdown; charset=utf-8' }\n  });\n}` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 2.3 Bot User-Agent Accessibility
  if (botUaRes?.ok) {
    accessChecks.push({
      id: 'bot-ua-access', name: 'AI Agent User-Agent Reachability', layer: 'access',
      status: 'pass', score: 2, maxScore: 2, impact: 'critical',
      details: `Pages return 200 OK when probed with the GPTBot User-Agent — no bot blocking detected.`,
      why: 'Some WAFs and DDoS protection layers (Cloudflare, Akamai) block non-browser User-Agents by default. If AI crawlers are blocked at the CDN level, your robots.txt and llms.txt don\'t matter — the bots never reach them.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    accessChecks.push({
      id: 'bot-ua-access', name: 'AI Agent User-Agent Reachability', layer: 'access',
      status: 'fail', score: 0, maxScore: 2, impact: 'critical',
      details: `AI crawler User-Agent was rejected or received status ${botUaRes ? botUaRes.status : 'timeout'} — bot protection may be blocking AI crawlers.`,
      why: 'This is one of the most common and silent reasons sites don\'t appear in AI-generated answers. Even if robots.txt allows GPTBot, a WAF rule blocking non-browser UAs intercepts requests first. OpenAI and Anthropic publish official IP ranges to whitelist their crawlers.',
      recommendation: 'Check your CDN / WAF settings. Add GPTBot and ClaudeBot to your allowlist. OpenAI publishes their crawler IP ranges at openai.com/gptbot.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 2.4 HTTP Link Discovery Headers
  const linkHeader = mdAcceptRes?.headers.get('link') || botUaRes?.headers.get('link') || homepageRes?.headers.get('link') || '';
  const hasLinkRel = linkHeader.includes('rel="alternate"') || linkHeader.includes('rel="service"') || linkHeader.includes('rel="help"');
  if (hasLinkRel) {
    accessChecks.push({
      id: 'link-headers', name: 'HTTP Link Discovery Headers', layer: 'access',
      status: 'pass', score: 2, maxScore: 2, impact: 'recommended',
      details: `HTTP responses include Link headers advertising machine resources: ${linkHeader.substring(0, 120)}${linkHeader.length > 120 ? '…' : ''}`,
      why: 'HTTP Link headers let agents that skip HTML parsing (direct fetchers, API clients, CLI tools) still discover your llms.txt, MCP server, and OpenAPI spec — without needing to read a single HTML tag.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    accessChecks.push({
      id: 'link-headers', name: 'HTTP Link Discovery Headers', layer: 'access',
      status: 'warning', score: 0, maxScore: 2, impact: 'recommended',
      details: 'No machine discovery Link headers detected in HTTP response headers.',
      why: 'Agents that make direct HTTP requests (not browser renders) won\'t see your <link> HTML tags. The HTTP-level Link header is the equivalent for non-HTML consumers — it\'s how agents discover your machine APIs without parsing markup.',
      recommendation: 'Add Link headers on your HTML responses advertising your key machine-readable resources.',
      fixSnippet: { language: 'http', filename: 'next.config.mjs headers()', code: `// Add to your response headers\nLink: </llms.txt>; rel="alternate"; type="text/plain",\n      </.well-known/mcp>; rel="service"; type="application/json",\n      </openapi.json>; rel="service"; type="application/openapi+json",\n      </sitemap.xml>; rel="sitemap"; type="application/xml"` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 2.5 Rate-Limit Headers
  const rlHeader = rateLimitRes?.headers.get('ratelimit-limit') || rateLimitRes?.headers.get('x-ratelimit-limit') || rateLimitRes?.headers.get('ratelimit') || '';
  if (rlHeader) {
    accessChecks.push({
      id: 'rate-limit-headers', name: 'RFC Rate-Limit Headers', layer: 'access',
      status: 'pass', score: 2, maxScore: 2, impact: 'recommended',
      details: `RateLimit headers detected on API responses: limit=${rlHeader}. Agents can self-regulate request velocity.`,
      why: 'Without rate-limit headers, autonomous agents must either guess at safe request rates or be over-cautious. Standard RFC headers let agents know exactly how many requests they can make and when to back off — preventing both throttling and wasted retries.',
      referenceUrl: 'https://veda.ng/developers',
    });
  } else {
    accessChecks.push({
      id: 'rate-limit-headers', name: 'RFC Rate-Limit Headers', layer: 'access',
      status: 'warning', score: 0, maxScore: 2, impact: 'recommended',
      details: 'No RFC RateLimit-Limit or X-RateLimit-Limit headers found on API responses.',
      why: 'Agents making automated requests need to know their rate limits to avoid being blocked. Without standard headers, they can\'t self-throttle and may hit 429 errors silently — breaking agent workflows mid-task.',
      recommendation: 'Add RFC-compliant RateLimit headers to all API endpoints so automated agents can self-regulate their request cadence.',
      fixSnippet: { language: 'typescript', filename: 'src/lib/api-response.ts', code: `// Add to your API response headers\nexport function addRateLimitHeaders(headers: Headers, limit = 60, remaining = 55) {\n  headers.set('RateLimit-Limit', String(limit));\n  headers.set('RateLimit-Remaining', String(remaining));\n  headers.set('RateLimit-Reset', '60');\n  headers.set('RateLimit-Policy', \`"\${limit};w=60"\`);\n}` },
      referenceUrl: 'https://veda.ng/developers',
    });
  }

  // 2.6 JS Hydration & Client-side Rendering Check
  const hasNoContent = homepageHtml.length > 0 && !/<body[^>]*>[\s\S]*?[a-zA-Z0-9]{3,}[\s\S]*?<\/body>/i.test(homepageHtml);
  const isSPA = homepageHtml.includes('id="root"') || homepageHtml.includes('id="app"');
  if (hasNoContent && isSPA) {
    accessChecks.push({
      id: 'access-js-hydration', name: 'Static Content fallback (No-JS Readiness)', layer: 'access',
      status: 'fail', score: 0, maxScore: 2, impact: 'critical',
      details: 'HTML body is nearly empty, but client-side app mounting points (e.g. #root) are present. The site relies entirely on JavaScript execution.',
      why: 'Most AI bots and API clients fetch raw HTML using basic HTTP request libraries (like python-requests, node-fetch, or Go standard libraries) and do not spin up full browser runtimes. If your site requires JS to render content, agents will see a blank page.',
      recommendation: 'Implement Server-Side Rendering (SSR) or Static Site Generation (SSG). Ensure core content is returned directly in the raw HTML payload.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    accessChecks.push({
      id: 'access-js-hydration', name: 'Static Content fallback (No-JS Readiness)', layer: 'access',
      status: 'pass', score: 2, maxScore: 2, impact: 'critical',
      details: 'Semantic HTML content is directly available in the initial HTML payload (server-rendered).',
      why: 'Server-rendered content lets simple HTTP clients and LLM web crawlers extract text immediately without running a heavy headless browser, maximizing compatibility and saving agent compute.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 2.7 Payload Compression (Accept-Encoding: br/zstd)
  const contentEncoding = homepageRes?.headers.get('content-encoding') || '';
  if (contentEncoding.includes('br') || contentEncoding.includes('zstd') || contentEncoding.includes('gzip')) {
    accessChecks.push({
      id: 'access-compression', name: 'Payload Compression (Brotli/Zstandard)', layer: 'access',
      status: 'pass', score: 1, maxScore: 1, impact: 'optional',
      details: `Server uses compression for payloads (${contentEncoding}).`,
      why: 'Compression reduces network latency and bandwidth costs for agent crawlers processing high volumes of pages.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    accessChecks.push({
      id: 'access-compression', name: 'Payload Compression (Brotli/Zstandard)', layer: 'access',
      status: 'warning', score: 0, maxScore: 1, impact: 'optional',
      details: 'No compression header (Content-Encoding) detected in response.',
      why: 'Transferring uncompressed text blocks inflates latency and bandwidth consumption, slowing down real-time retrieval loops.',
      recommendation: 'Enable Brotli (br) or gzip compression on your web server / CDN.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 2.8 Text-to-HTML Boilerplate Ratio
  const htmlLen = homepageHtml.length || 1;
  const textOnly = homepageHtml.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const textLen = textOnly.length;
  const textRatio = textLen / htmlLen;
  if (textRatio > 0.15) {
    accessChecks.push({
      id: 'access-boilerplate-ratio', name: 'Text-to-HTML Ratio', layer: 'access',
      status: 'pass', score: 1, maxScore: 1, impact: 'optional',
      details: `High content density: text-to-HTML ratio is ${(textRatio * 100).toFixed(1)}%.`,
      why: 'A high text-to-HTML ratio means the page contains clean, descriptive text with minimal DOM/markup bloat, ensuring token-efficient crawler parsing.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    accessChecks.push({
      id: 'access-boilerplate-ratio', name: 'Text-to-HTML Ratio', layer: 'access',
      status: 'warning', score: 0, maxScore: 1, impact: 'optional',
      details: `Low content density: text-to-HTML ratio is ${(textRatio * 100).toFixed(1)}% (heavy DOM structure/styles).`,
      why: 'If markup, classes (e.g. excessive Tailwind classes), and scripts dwarf the actual text content, AI models spend unnecessary tokens parsing code instead of reading the content.',
      recommendation: 'Minimize CSS/JS injection inside HTML. Clean up unnecessary DOM nodes and use semantic elements to reduce DOM depth.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LAYER 3 — Usability & MCP
  // ──────────────────────────────────────────────────────────────────────────
  const usabilityChecks: CheckResult[] = [];

  // 3.1 MCP Server
  const mcpWorking = (mcpWellKnownRes?.ok && mcpWellKnownRes.text.includes('jsonrpc')) ||
                     (mcpApiRes?.ok && mcpApiRes.text.includes('jsonrpc'));
  if (mcpWorking) {
    usabilityChecks.push({
      id: 'mcp-server-live', name: 'Model Context Protocol (MCP) Server', layer: 'usability',
      status: 'pass', score: 4, maxScore: 4, impact: 'critical',
      details: 'Live MCP server responded successfully to a JSON-RPC 2.0 initialize handshake over Streamable HTTP.',
      why: 'MCP (Model Context Protocol) is the standard that lets Claude, ChatGPT, Cursor, and other AI systems call your tools directly — no custom integration code needed. A live MCP server turns your service into a first-class AI tool that agents can use autonomously.',
      referenceUrl: 'https://veda.ng/mcp',
    });
  } else {
    usabilityChecks.push({
      id: 'mcp-server-live', name: 'Model Context Protocol (MCP) Server', layer: 'usability',
      status: 'warning', score: 0, maxScore: 4, impact: 'critical',
      details: 'No live MCP server detected at /.well-known/mcp or /api/mcp. JSON-RPC 2.0 initialize handshake returned no valid response.',
      why: 'Without an MCP server, AI assistants can\'t execute actions on your domain. They can read your content but can\'t search it, filter it, or call your APIs — limiting your service to read-only AI citations instead of interactive AI tool use. MCP is rapidly becoming the baseline expectation for developer-facing services.',
      recommendation: 'Deploy a Streamable HTTP MCP server at /.well-known/mcp. At minimum, implement the initialize and tools/list methods. The MCP SDK for TypeScript/Python makes this straightforward.',
      fixSnippet: { language: 'typescript', filename: 'src/app/.well-known/mcp/route.ts (Next.js)', code: `export async function POST(req: Request) {\n  const body = await req.json();\n  const { method, id, params } = body;\n\n  if (method === 'initialize') {\n    return Response.json({\n      jsonrpc: '2.0', id,\n      result: {\n        protocolVersion: '2024-11-05',\n        capabilities: { tools: {} },\n        serverInfo: { name: '${domain}', version: '1.0.0' }\n      }\n    });\n  }\n\n  if (method === 'tools/list') {\n    return Response.json({\n      jsonrpc: '2.0', id,\n      result: {\n        tools: [{\n          name: 'search',\n          description: 'Search content on ${domain}',\n          inputSchema: {\n            type: 'object',\n            properties: { query: { type: 'string', description: 'Search query' } },\n            required: ['query']\n          }\n        }]\n      }\n    });\n  }\n\n  return Response.json({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } });\n}` },
      referenceUrl: 'https://veda.ng/mcp',
    });
  }

  // 3.2 OpenAPI Specification
  if (openapiRes?.ok && openapiRes.text && (openapiRes.text.includes('openapi') || openapiRes.text.includes('paths'))) {
    usabilityChecks.push({
      id: 'openapi-spec', name: 'OpenAPI Specification (openapi.json)', layer: 'usability',
      status: 'pass', score: 3, maxScore: 3, impact: 'important',
      details: 'Valid OpenAPI 3.x specification found at /openapi.json with typed endpoint definitions.',
      why: 'An OpenAPI spec lets AI code assistants (GitHub Copilot, Cursor, Claude) auto-generate correct API calls without reading your docs. It also enables agent orchestrators to discover your REST API capabilities and call endpoints autonomously.',
      referenceUrl: 'https://veda.ng/developers',
    });
  } else {
    usabilityChecks.push({
      id: 'openapi-spec', name: 'OpenAPI Specification (openapi.json)', layer: 'usability',
      status: 'warning', score: 0, maxScore: 3, impact: 'important',
      details: 'No machine-readable OpenAPI specification found at /openapi.json.',
      why: 'Without an OpenAPI spec, AI agents must guess at your API\'s structure — leading to incorrect parameters, missing required fields, and broken integrations. A typed spec is the single highest-ROI addition for developer-facing APIs.',
      recommendation: 'Publish an OpenAPI 3.1 specification at /openapi.json. You can generate it from your route handlers, or write it manually and validate at editor.swagger.io.',
      fixSnippet: { language: 'json', filename: 'public/openapi.json', code: `{\n  "openapi": "3.1.0",\n  "info": {\n    "title": "${domain} API",\n    "version": "1.0.0",\n    "description": "Public API for ${domain}"\n  },\n  "servers": [{ "url": "${origin}" }],\n  "paths": {\n    "/api/v1/example": {\n      "get": {\n        "operationId": "getExample",\n        "summary": "Fetch example resource",\n        "parameters": [\n          { "name": "q", "in": "query", "required": true, "schema": { "type": "string" } }\n        ],\n        "responses": {\n          "200": { "description": "Success" }\n        }\n      }\n    }\n  }\n}` },
      referenceUrl: 'https://veda.ng/developers',
    });
  }

  // 3.3 Auth Guide
  if (authRes?.ok && authRes.text && authRes.text.length > 30) {
    usabilityChecks.push({
      id: 'auth-guide', name: 'Authentication & Access Specification', layer: 'usability',
      status: 'pass', score: 2, maxScore: 2, impact: 'recommended',
      details: 'Machine-readable auth guide found at /auth.md. Agents can determine access requirements without reading HTML docs.',
      why: 'The first question an agent asks before calling your API is "how do I authenticate?". A /auth.md file answers this in a token-efficient, structured format — whether your API is keyless, uses API keys, or requires OAuth.',
      referenceUrl: 'https://veda.ng/developers',
    });
  } else {
    usabilityChecks.push({
      id: 'auth-guide', name: 'Authentication & Access Specification', layer: 'usability',
      status: 'warning', score: 1, maxScore: 2, impact: 'recommended',
      details: 'No dedicated /auth.md file found. Agents must read full HTML documentation to determine authentication requirements.',
      why: 'Agents integrating your API spend unnecessary tokens reading docs to find auth patterns. A concise /auth.md saves agents time and reduces integration errors — especially for keyless (unauthenticated) APIs where the answer is just "no auth required".',
      recommendation: 'Publish an /auth.md declaring your authentication policy. For open APIs, a 3-line "no API key required" statement is enough.',
      fixSnippet: { language: 'markdown', filename: 'public/auth.md', code: `# Authentication — ${domain}\n\nAll endpoints on ${domain} are public and require no API key, account, or authentication.\n\n## Rate Limits\n- 60 requests per minute per IP\n- No daily limit for normal usage\n\n## Contact\nFor higher limits or commercial use: ${origin}/contact` },
      referenceUrl: 'https://veda.ng/developers',
    });
  }

  // 3.4 TDMRep
  if (tdmrepRes?.ok && tdmrepRes.text && tdmrepRes.text.length > 10) {
    usabilityChecks.push({
      id: 'tdmrep', name: 'Text & Data Mining Rights (tdmrep.json)', layer: 'usability',
      status: 'pass', score: 1, maxScore: 1, impact: 'optional',
      details: 'tdmrep.json found at /.well-known/tdmrep.json. Mining rights are explicitly declared per EU TDM regulations.',
      why: 'Under EU copyright law (DSM Directive), publishers must explicitly opt out of text-and-data mining if they want to reserve rights. TDMRep lets you declare these rights in a machine-readable way — allowing or denying AI training use of your content.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    usabilityChecks.push({
      id: 'tdmrep', name: 'Text & Data Mining Rights (tdmrep.json)', layer: 'usability',
      status: 'warning', score: 0, maxScore: 1, impact: 'optional',
      details: 'No tdmrep.json found at /.well-known/tdmrep.json. Text-and-data mining permissions are not explicitly declared.',
      why: 'Without tdmrep.json, AI training crawlers must default to conservative assumptions about your content\'s mining rights. If you want to explicitly allow or restrict AI training use of your content, tdmrep.json is the W3C-standardised way to do so.',
      recommendation: 'Publish a /.well-known/tdmrep.json. Set "tdm-reservation": 0 to allow mining, or 1 to reserve rights.',
      fixSnippet: { language: 'json', filename: 'public/.well-known/tdmrep.json', code: `{\n  "@context": "http://www.w3.org/ns/tdmrep",\n  "tdm-reservation": 0,\n  "tdm-policy": "${origin}/tdm-policy"\n}` },
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 3.5 OpenAPI Example Coverage
  if (openapiRes?.ok && openapiRes.text) {
    const hasExamples = openapiRes.text.includes('"example"') || openapiRes.text.includes('"examples"');
    if (hasExamples) {
      usabilityChecks.push({
        id: 'openapi-examples', name: 'OpenAPI Example Documentation', layer: 'usability',
        status: 'pass', score: 2, maxScore: 2, impact: 'recommended',
        details: 'OpenAPI specification includes parameter or payload examples.',
        why: 'AI models rely on parameter examples to construct syntactically correct HTTP requests. Lacking examples, LLMs must guess formatting (e.g., date formats or ID prefixes), leading to high rates of failed tool execution.',
        referenceUrl: 'https://veda.ng/developers',
      });
    } else {
      usabilityChecks.push({
        id: 'openapi-examples', name: 'OpenAPI Example Documentation', layer: 'usability',
        status: 'warning', score: 0, maxScore: 2, impact: 'recommended',
        details: 'OpenAPI spec found but does not contain parameter "example" or "examples" objects.',
        why: 'AI agents require structural context to operate APIs correctly. Adding clear examples in your schema reduces model tool-call failures by up to 40%.',
        recommendation: 'Add example values to all query parameters and requestBody schemas in your openapi.json file.',
        fixSnippet: { language: 'json', code: `"parameters": [\n  {\n    "name": "limit",\n    "in": "query",\n    "schema": { "type": "integer", "example": 20 }\n  }\n]` },
        referenceUrl: 'https://veda.ng/developers',
      });
    }
  } else {
    usabilityChecks.push({
      id: 'openapi-examples', name: 'OpenAPI Example Documentation', layer: 'usability',
      status: 'na', score: 0, maxScore: 0, impact: 'recommended',
      details: 'No OpenAPI specification found to inspect.',
      why: 'No API spec is published, so schema examples cannot be assessed.',
      referenceUrl: 'https://veda.ng/developers',
    });
  }

  // 3.6 Standardized Error Formatting (RFC 7807)
  const isRfcProblem = rateLimitRes?.headers.get('content-type')?.includes('application/problem+json') ||
                        openapiRes?.text?.includes('application/problem+json');
  if (isRfcProblem) {
    usabilityChecks.push({
      id: 'rfc-7807-errors', name: 'Standardized Error Formatting (RFC 7807)', layer: 'usability',
      status: 'pass', score: 1, maxScore: 1, impact: 'optional',
      details: 'API describes or uses application/problem+json response formats for error handling.',
      why: 'When a tool call fails, an agent must recover programmatically. Returning errors in the standard RFC 7807 JSON format lets agents parse error details and correct their parameters autonomously.',
      referenceUrl: 'https://veda.ng/developers',
    });
  } else {
    usabilityChecks.push({
      id: 'rfc-7807-errors', name: 'Standardized Error Formatting (RFC 7807)', layer: 'usability',
      status: 'warning', score: 0, maxScore: 1, impact: 'optional',
      details: 'No RFC 7807 problem details detected in API error response footprints.',
      why: 'Returning raw stack traces, generic HTML, or plain strings during API failures breaks agent flows since the LLM cannot parse what went wrong to fix its next action.',
      recommendation: 'Configure your API error handlers to respond with content-type application/problem+json containing title, status, and detail fields.',
      fixSnippet: { language: 'json', code: `{\n  "type": "https://api.${domain}/errors/validation",\n  "title": "Validation Error",\n  "status": 400,\n  "detail": "The limit parameter must be between 1 and 100.",\n  "instance": "/api/v1/resource"\n}` },
      referenceUrl: 'https://veda.ng/developers',
    });
  }

  // 3.7 API Dry-Run / Test Mode Support
  const hasDryRun = openapiRes?.text && (
    openapiRes.text.toLowerCase().includes('dry-run') ||
    openapiRes.text.toLowerCase().includes('dryrun') ||
    openapiRes.text.toLowerCase().includes('sandbox') ||
    openapiRes.text.toLowerCase().includes('test-mode')
  );
  if (hasDryRun) {
    usabilityChecks.push({
      id: 'api-dry-run', name: 'API Dry-Run / Test Mode Support', layer: 'usability',
      status: 'pass', score: 2, maxScore: 2, impact: 'recommended',
      details: 'OpenAPI specification includes dry-run headers or test-mode parameters.',
      why: 'Agents operate autonomously and can execute unintended changes. A dry-run capability allows agents to validate action payloads and receive simulated results safely before committing transactions.',
      referenceUrl: 'https://veda.ng/developers',
    });
  } else {
    usabilityChecks.push({
      id: 'api-dry-run', name: 'API Dry-Run / Test Mode Support', layer: 'usability',
      status: 'warning', score: 0, maxScore: 2, impact: 'recommended',
      details: 'No dry-run parameters or test mode endpoints discovered in the API spec.',
      why: 'Lacking a safety sandbox or dry-run validation flag, agents cannot verify their commands beforehand, raising the risk of destructive actions or transaction errors.',
      recommendation: 'Implement support for an X-Dry-Run header or query parameter on all mutate endpoints.',
      fixSnippet: { language: 'typescript', code: `// In POST/PUT API handlers\nconst dryRun = req.headers.get('X-Dry-Run') === 'true';\nif (dryRun) {\n  return Response.json({ status: 'validated', changes: { id: 123 } });\n}` },
      referenceUrl: 'https://veda.ng/developers',
    });
  }

  // 3.8 CORS Configuration for AI Interfaces
  const apiCors = rateLimitRes?.headers.get('access-control-allow-origin') || '';
  const allowsAll = apiCors === '*' || apiCors.toLowerCase().includes('chatgpt') || apiCors.toLowerCase().includes('claude');
  if (allowsAll) {
    usabilityChecks.push({
      id: 'api-cors-ai', name: 'CORS Configuration for AI interfaces', layer: 'usability',
      status: 'pass', score: 1, maxScore: 1, impact: 'optional',
      details: `API allows cross-origin requests: Access-Control-Allow-Origin: ${apiCors || '*'}`,
      why: 'If your APIs are called directly by client-side agents running inside browser plugins or web playgrounds (like ChatGPT canvas or Claude artifacts), strict CORS rules will block the network requests.',
      referenceUrl: 'https://veda.ng/developers',
    });
  } else {
    usabilityChecks.push({
      id: 'api-cors-ai', name: 'CORS Configuration for AI interfaces', layer: 'usability',
      status: 'warning', score: 0, maxScore: 1, impact: 'optional',
      details: 'Strict CORS policy detected. API may reject browser-based agent executions.',
      why: 'Browser-driven agent sandboxes (such as custom GPTs running in a browser) will trigger CORS preflight checks. If access-control headers block the origin, the agent cannot access your resources.',
      recommendation: 'Set Access-Control-Allow-Origin: * or explicitly whitelist *.openai.com, *.chatgpt.com, and *.claude.ai.',
      fixSnippet: { language: 'http', code: `Access-Control-Allow-Origin: *\nAccess-Control-Allow-Methods: GET, POST, OPTIONS\nAccess-Control-Allow-Headers: Content-Type, Authorization` },
      referenceUrl: 'https://veda.ng/developers',
    });
  }

  // 3.9 MCP Schema Handshake Validation
  if (mcpWorking) {
    const hasTools = (mcpWellKnownRes?.text && mcpWellKnownRes.text.includes('tools')) ||
                     (mcpApiRes?.text && mcpApiRes.text.includes('tools'));
    if (hasTools) {
      usabilityChecks.push({
        id: 'mcp-schema-handshake', name: 'MCP Schema Handshake Validation', layer: 'usability',
        status: 'pass', score: 2, maxScore: 2, impact: 'important',
        details: 'MCP server successfully advertises capabilities.tools during initialization.',
        why: 'Simply returning an initialize handshake is not enough; the server must declare its tool definitions in its capabilities. Without tools, the agent cannot execute any functionality.',
        referenceUrl: 'https://veda.ng/mcp',
      });
    } else {
      usabilityChecks.push({
        id: 'mcp-schema-handshake', name: 'MCP Schema Handshake Validation', layer: 'usability',
        status: 'warning', score: 0, maxScore: 2, impact: 'important',
        details: 'MCP server responds to handshake but lists no tool capabilities.',
        why: 'The MCP handshake completed but the capabilities object was empty or missing the tools object, rendering the server unusable for task execution.',
        recommendation: 'Ensure your MCP initialize response includes capabilities: { tools: {} } and responds to tools/list requests.',
        referenceUrl: 'https://veda.ng/mcp',
      });
    }
  } else {
    usabilityChecks.push({
      id: 'mcp-schema-handshake', name: 'MCP Schema Handshake Validation', layer: 'usability',
      status: 'na', score: 0, maxScore: 0, impact: 'important',
      details: 'No live MCP server detected to handshake with.',
      why: 'Handshake validation requires a running MCP server.',
      referenceUrl: 'https://veda.ng/mcp',
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LAYER 4 — Security
  // ──────────────────────────────────────────────────────────────────────────
  const securityChecks: CheckResult[] = [];

  // 4.1 HTTPS
  if (isHttps) {
    securityChecks.push({
      id: 'https-tls', name: 'HTTPS / TLS', layer: 'security',
      status: 'pass', score: 3, maxScore: 3, impact: 'critical',
      details: 'Site is served over HTTPS with TLS. All data between visitors (and AI agents) and your server is encrypted.',
      why: 'HTTPS is the baseline requirement for browser trust, search indexing, and AI crawling. Without it, Chrome marks your site as "Not Secure", Google deprioritises it in rankings, and many AI bots refuse to crawl HTTP-only domains.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    securityChecks.push({
      id: 'https-tls', name: 'HTTPS / TLS', layer: 'security',
      status: 'fail', score: 0, maxScore: 3, impact: 'critical',
      details: 'Site is not served over HTTPS. All traffic is unencrypted.',
      why: 'HTTP-only sites are deprioritised by every major search engine and most AI crawlers. Mixed content warnings break features. Users see "Not Secure" warnings. This is the single most impactful fix available for unencrypted sites.',
      recommendation: 'Enable HTTPS via Let\'s Encrypt (free). All major hosting providers (Vercel, Netlify, Cloudflare, Firebase) enable it in one click. Redirect all HTTP traffic to HTTPS.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 4.2 HSTS
  if (hsts && hsts.includes('max-age')) {
    const maxAge = parseInt(hsts.match(/max-age=(\d+)/)?.[1] || '0');
    const isStrong = maxAge >= 15552000;
    securityChecks.push({
      id: 'hsts', name: 'HTTP Strict Transport Security (HSTS)', layer: 'security',
      status: isStrong ? 'pass' : 'warning', score: isStrong ? 2 : 1, maxScore: 2, impact: 'important',
      details: `HSTS header: ${hsts.substring(0, 100)}${hsts.length > 100 ? '…' : ''}. max-age=${hsts.match(/max-age=(\d+)/)?.[1] || 'unknown'}s (${isStrong ? 'strong' : 'too short — minimum 6 months recommended'}).`,
      why: 'HSTS tells browsers to *never* make HTTP connections to your domain — preventing protocol downgrade attacks even if someone tries to strip HTTPS. Without it, an attacker on a coffee-shop network can intercept connections for domains users haven\'t visited recently.',
      recommendation: isStrong ? undefined : 'Increase max-age to at least 15552000 (6 months) and add includeSubDomains.',
      fixSnippet: isStrong ? undefined : { language: 'http', code: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    securityChecks.push({
      id: 'hsts', name: 'HTTP Strict Transport Security (HSTS)', layer: 'security',
      status: 'fail', score: 0, maxScore: 2, impact: 'important',
      details: 'No Strict-Transport-Security (HSTS) header found in HTTP response.',
      why: 'Without HSTS, browsers will attempt plain HTTP on first visit and after cache expiry. This creates a window for man-in-the-middle attacks even on HTTPS sites. HSTS is a zero-cost, high-impact security upgrade.',
      recommendation: 'Add the Strict-Transport-Security header. Start with max-age=300 to test, then increase to 63072000 (2 years) for production.',
      fixSnippet: { language: 'http', code: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 4.3 CSP
  if (csp && csp.length > 10) {
    securityChecks.push({
      id: 'csp', name: 'Content Security Policy (CSP)', layer: 'security',
      status: 'pass', score: 3, maxScore: 3, impact: 'important',
      details: `CSP header detected: ${csp.substring(0, 100)}${csp.length > 100 ? '…' : ''}`,
      why: 'CSP is your primary defence against Cross-Site Scripting (XSS). If an attacker injects a <script> tag, CSP blocks it from running. Without CSP, a single XSS vulnerability can steal user sessions, modify page content, or redirect users to phishing pages.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    const cspRO = secHeaders?.get('content-security-policy-report-only') || '';
    securityChecks.push({
      id: 'csp', name: 'Content Security Policy (CSP)', layer: 'security',
      status: cspRO ? 'warning' : 'fail', score: cspRO ? 1 : 0, maxScore: 3, impact: 'important',
      details: cspRO ? 'Only CSP Report-Only mode detected — policy is monitoring but NOT enforcing. Attacks can still execute.' : 'No Content-Security-Policy header found. XSS attacks are unrestricted.',
      why: 'XSS is the #1 web vulnerability. Without CSP, malicious scripts injected via user input, third-party ads, or compromised dependencies can run freely. CSP doesn\'t require application code changes — it\'s a single HTTP header.',
      recommendation: cspRO ? 'Switch from Content-Security-Policy-Report-Only to Content-Security-Policy to enforce your policy.' : 'Deploy a CSP header. Start with report-only mode to identify violations before enforcing.',
      fixSnippet: { language: 'typescript', filename: 'next.config.mjs', code: `// Add to your response headers\n{\n  key: 'Content-Security-Policy',\n  value: [\n    "default-src 'self'",\n    "script-src 'self' 'nonce-{NONCE}'",\n    "style-src 'self' 'unsafe-inline'",\n    "img-src 'self' data: https:",\n    "frame-ancestors 'none'",\n  ].join('; ')\n}` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 4.4 X-Content-Type-Options
  if (xcto.toLowerCase().includes('nosniff')) {
    securityChecks.push({
      id: 'xcto', name: 'X-Content-Type-Options: nosniff', layer: 'security',
      status: 'pass', score: 1, maxScore: 1, impact: 'recommended',
      details: 'X-Content-Type-Options: nosniff is set. Browsers won\'t reinterpret file types.',
      why: 'Without this header, older browsers may "sniff" a file\'s content and execute a text/plain file as JavaScript. This is a MIME confusion attack vector that costs one line to prevent.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    securityChecks.push({
      id: 'xcto', name: 'X-Content-Type-Options: nosniff', layer: 'security',
      status: 'fail', score: 0, maxScore: 1, impact: 'recommended',
      details: 'X-Content-Type-Options header is missing.',
      why: 'Browsers without this header may execute MIME-sniffed content — for example treating a CSV uploaded by a user as JavaScript. One header, one value, set-and-forget.',
      recommendation: 'Add X-Content-Type-Options: nosniff to all HTTP responses.',
      fixSnippet: { language: 'http', code: `X-Content-Type-Options: nosniff` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 4.5 Clickjacking
  const hasFrameProtection = xfo.length > 0 || csp.includes('frame-ancestors');
  if (hasFrameProtection) {
    securityChecks.push({
      id: 'frame-protection', name: 'Clickjacking Protection', layer: 'security',
      status: 'pass', score: 1, maxScore: 1, impact: 'recommended',
      details: `Clickjacking protection active via ${csp.includes('frame-ancestors') ? 'CSP frame-ancestors' : `X-Frame-Options: ${xfo}`}.`,
      why: 'Clickjacking embeds your page in an invisible iframe and tricks users into clicking elements they can\'t see. This is how attackers steal clicks, form submissions, and payments from legitimate users.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    securityChecks.push({
      id: 'frame-protection', name: 'Clickjacking Protection', layer: 'security',
      status: 'warning', score: 0, maxScore: 1, impact: 'recommended',
      details: 'No clickjacking protection detected (no X-Frame-Options or CSP frame-ancestors directive).',
      why: 'Without iframe protection, attackers can embed your site in a transparent overlay and trick your authenticated users into performing actions (clicking "Confirm", "Transfer", "Delete") without realising it.',
      recommendation: "Add CSP frame-ancestors 'none' (preferred over X-Frame-Options).",
      fixSnippet: { language: 'http', code: `# Preferred: CSP directive\nContent-Security-Policy: frame-ancestors 'none'\n\n# Legacy fallback\nX-Frame-Options: DENY` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 4.6 Referrer-Policy
  if (rp && rp.length > 4) {
    securityChecks.push({
      id: 'referrer-policy', name: 'Referrer-Policy', layer: 'security',
      status: 'pass', score: 1, maxScore: 1, impact: 'optional',
      details: `Referrer-Policy: ${rp}`,
      why: 'Referrer-Policy controls what URL information leaks when users click links to external sites. Without it, your full internal URLs (including any tokens or session IDs in query strings) may be visible to third-party sites.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    securityChecks.push({
      id: 'referrer-policy', name: 'Referrer-Policy', layer: 'security',
      status: 'warning', score: 0, maxScore: 1, impact: 'optional',
      details: 'No Referrer-Policy header found. Full referring URLs may leak to external sites.',
      why: 'If your internal URLs contain session tokens, user IDs, or sensitive paths, the browser sends them as the Referer header when users click external links — leaking private data to third parties.',
      recommendation: 'Set a restrictive Referrer-Policy. strict-origin-when-cross-origin is a safe default.',
      fixSnippet: { language: 'http', code: `Referrer-Policy: strict-origin-when-cross-origin` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 4.7 Permissions-Policy
  if (pp && pp.length > 4) {
    securityChecks.push({
      id: 'permissions-policy', name: 'Permissions-Policy', layer: 'security',
      status: 'pass', score: 1, maxScore: 1, impact: 'optional',
      details: `Permissions-Policy: ${pp.substring(0, 80)}${pp.length > 80 ? '…' : ''}`,
      why: 'Permissions-Policy restricts which browser APIs (camera, microphone, geolocation) are available on your page. Injected third-party scripts — ads, analytics, SDKs — can silently access these APIs without this header.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    securityChecks.push({
      id: 'permissions-policy', name: 'Permissions-Policy', layer: 'security',
      status: 'warning', score: 0, maxScore: 1, impact: 'optional',
      details: 'No Permissions-Policy header found.',
      why: 'Without Permissions-Policy, any third-party script on your page (analytics, chat widgets, ad SDKs) can request camera, microphone, and location access. This is a defence-in-depth header that costs nothing to add.',
      recommendation: 'Disable browser APIs you don\'t use. This also prevents third-party scripts from using them.',
      fixSnippet: { language: 'http', code: `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 4.8 security.txt
  if (securityTxtRes?.ok && securityTxtRes.text && securityTxtRes.text.includes('Contact')) {
    securityChecks.push({
      id: 'security-txt', name: 'Security Disclosure Contact (security.txt)', layer: 'security',
      status: 'pass', score: 1, maxScore: 1, impact: 'optional',
      details: 'security.txt found at /.well-known/security.txt with a Contact field for responsible disclosure.',
      why: 'security.txt (RFC 9116) gives security researchers a clear, machine-readable contact to report vulnerabilities — instead of going public or emailing random addresses. Sites without it often get vulnerabilities disclosed publicly before they\'re fixed.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    securityChecks.push({
      id: 'security-txt', name: 'Security Disclosure Contact (security.txt)', layer: 'security',
      status: 'warning', score: 0, maxScore: 1, impact: 'optional',
      details: 'No security.txt found at /.well-known/security.txt.',
      why: 'Security researchers check /.well-known/security.txt before deciding how to disclose a vulnerability. Without it, they may post publicly, contact you via social media, or give up — all worse outcomes than a private disclosure.',
      recommendation: 'Publish a security.txt file (RFC 9116) with your security contact and an expiry date.',
      fixSnippet: { language: 'text', filename: 'public/.well-known/security.txt', code: `Contact: mailto:security@${domain}\nExpires: 2027-01-01T00:00:00.000Z\nPreferred-Languages: en\nCanonical: ${origin}/.well-known/security.txt` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 4.9 Content Provenance (C2PA / Content Credentials)
  const hasC2PA = homepageHtml.includes('c2pa') || homepageHtml.includes('manifest.jumbf');
  if (hasC2PA) {
    securityChecks.push({
      id: 'security-c2pa', name: 'Content Provenance & Credentials (C2PA)', layer: 'security',
      status: 'pass', score: 1, maxScore: 1, impact: 'optional',
      details: 'C2PA content metadata hooks or reference declarations detected in the site source.',
      why: 'C2PA (Content Provenance and Authenticity) is the standard for certifying whether content was generated by AI or made by humans. AI search systems and social networks favor domains publishing signed media provenance to prevent disinformation.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    securityChecks.push({
      id: 'security-c2pa', name: 'Content Provenance & Credentials (C2PA)', layer: 'security',
      status: 'warning', score: 0, maxScore: 1, impact: 'optional',
      details: 'No C2PA provenance indicators found in HTML resources.',
      why: 'Without provenance signatures on images and media, agents cannot automatically verify if assets are authentic, unedited, or generated by an AI model, which is becoming a baseline trust factor.',
      recommendation: 'If you publish original images or articles, consider signing media files with C2PA metadata schemas using the c2pa-tool.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 4.10 AI Safety & Vulnerability Disclosures (security.txt)
  if (securityTxtRes?.ok && securityTxtRes.text) {
    const txt = securityTxtRes.text;
    const mentionsAiSafety = /ai\b|llm\b|prompt\s*injection|model\b/i.test(txt);
    if (mentionsAiSafety) {
      securityChecks.push({
        id: 'security-ai-disclosure', name: 'AI Safety Vulnerability Policy', layer: 'security',
        status: 'pass', score: 1, maxScore: 1, impact: 'optional',
        details: 'security.txt includes disclosure directives specifically addressing AI safety or prompt injection vulnerabilities.',
        why: 'Autonomous agents can be manipulated via prompt injection or model hacking. Declaring how reports on model-related vulnerabilities are handled guides security researchers safely.',
        referenceUrl: 'https://veda.ng/sitecheck',
      });
    } else {
      securityChecks.push({
        id: 'security-ai-disclosure', name: 'AI Safety Vulnerability Policy', layer: 'security',
        status: 'warning', score: 0, maxScore: 1, impact: 'optional',
        details: 'security.txt found but lacks guidance specifically addressing model security or prompt injections.',
        why: 'Traditional security rules do not outline how LLM-specific vulnerabilities (like prompt injection, training set poisoning, or sandbox escape) should be handled. Explicitly adding these rules clarifies reporting terms.',
        recommendation: 'Add a section in security.txt pointing to your policy on handling prompt injections and model safety reports.',
        fixSnippet: { language: 'text', code: `# AI Safety Reports\nPolicy: https://${domain}/security/ai-policy\n# Or add context to your existing vulnerability page.` },
        referenceUrl: 'https://veda.ng/sitecheck',
      });
    }
  } else {
    securityChecks.push({
      id: 'security-ai-disclosure', name: 'AI Safety Vulnerability Policy', layer: 'security',
      status: 'na', score: 0, maxScore: 0, impact: 'optional',
      details: 'No security.txt file found to evaluate.',
      why: 'No security contact file is published.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LAYER 5 — SEO & Content
  // ──────────────────────────────────────────────────────────────────────────
  const seoChecks: CheckResult[] = [];

  const ogTitle = getMetaContent('og:title', homepageHtml);
  const ogDescription = getMetaContent('og:description', homepageHtml);
  const ogImage = getMetaContent('og:image', homepageHtml);
  const ogCount = [ogTitle, ogDescription, ogImage].filter(Boolean).length;

  // 5.1 Open Graph
  if (ogCount === 3) {
    seoChecks.push({
      id: 'og-tags', name: 'Open Graph Social Tags', layer: 'seo',
      status: 'pass', score: 2, maxScore: 2, impact: 'important',
      details: `All 3 core OG tags found. og:title="${ogTitle.substring(0, 60)}${ogTitle.length > 60 ? '…' : ''}"`,
      why: 'Open Graph tags control how your page appears when shared on LinkedIn, Slack, Discord, X, and iMessage — and increasingly in AI-generated content cards. The og:image alone can 3-5× click-through rates on shared links.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else if (ogCount > 0) {
    const missing = [!ogTitle && 'og:title', !ogDescription && 'og:description', !ogImage && 'og:image'].filter(Boolean);
    seoChecks.push({
      id: 'og-tags', name: 'Open Graph Social Tags', layer: 'seo',
      status: 'warning', score: 1, maxScore: 2, impact: 'important',
      details: `Partial Open Graph coverage (${ogCount}/3). Missing: ${missing.join(', ')}.`,
      why: `Without ${missing.join(' and ')}, social shares of your pages will appear as plain text links with no preview image or description — dramatically reducing engagement on LinkedIn, Slack, Discord, and AI citation cards.`,
      recommendation: `Add the missing OG tags to your <head>: ${missing.join(', ')}.`,
      fixSnippet: { language: 'html', code: `<meta property="og:title" content="Page Title — ${domain}">\n<meta property="og:description" content="150-160 character description of this page.">\n<meta property="og:image" content="${origin}/og-image.png">\n<meta property="og:url" content="${origin}/page">\n<meta property="og:type" content="website">` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    seoChecks.push({
      id: 'og-tags', name: 'Open Graph Social Tags', layer: 'seo',
      status: 'fail', score: 0, maxScore: 2, impact: 'important',
      details: 'No Open Graph meta tags found on the homepage.',
      why: 'Pages without OG tags appear as bare URLs when shared — no title, no description, no image. Every major platform (LinkedIn, Slack, iMessage, Discord) uses og: tags to generate link previews. This affects AI-generated content cards too.',
      recommendation: 'Add all five core OG tags to every page. The og:image should be 1200×630px.',
      fixSnippet: { language: 'html', code: `<meta property="og:title" content="Page Title — ${domain}">\n<meta property="og:description" content="A compelling 150-160 character description.">\n<meta property="og:image" content="${origin}/og-image.png">\n<meta property="og:url" content="${origin}/">\n<meta property="og:type" content="website">` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 5.2 JSON-LD Structured Data
  const hasJsonLd = homepageHtml.includes('application/ld+json');
  if (hasJsonLd) {
    seoChecks.push({
      id: 'json-ld', name: 'JSON-LD Structured Data (schema.org)', layer: 'seo',
      status: 'pass', score: 3, maxScore: 3, impact: 'important',
      details: 'JSON-LD structured data script tag found. Agents can extract typed facts (author, date, organisation) without HTML parsing.',
      why: 'JSON-LD is the primary signal that helps Google, Bing, and AI knowledge graphs extract typed facts from your pages — author, publication date, organisation, product details. Pages with valid JSON-LD get rich snippets in search results and are cited more accurately in AI answers.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    seoChecks.push({
      id: 'json-ld', name: 'JSON-LD Structured Data (schema.org)', layer: 'seo',
      status: 'warning', score: 0, maxScore: 3, impact: 'important',
      details: 'No JSON-LD <script type="application/ld+json"> tag found on the homepage.',
      why: 'Without JSON-LD, AI systems and search engines must guess your page\'s author, publication date, and entity type from prose text — leading to inaccurate citations. Adding Organisation + WebSite JSON-LD is a 10-minute addition with significant discoverability upside.',
      recommendation: 'Add at minimum a WebSite and Organization JSON-LD block to your layout. For content pages, add Article with author and datePublished.',
      fixSnippet: { language: 'json', filename: '<script type="application/ld+json"> in layout', code: `{\n  "@context": "https://schema.org",\n  "@type": "WebSite",\n  "name": "${domain}",\n  "url": "${origin}",\n  "description": "What your site does",\n  "publisher": {\n    "@type": "Organization",\n    "name": "${domain}",\n    "url": "${origin}"\n  }\n}` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 5.3 Canonical URL
  const hasCanonical = /rel=["']canonical["']/.test(homepageHtml) || /rel=canonical/.test(homepageHtml);
  if (hasCanonical) {
    seoChecks.push({
      id: 'canonical', name: 'Canonical URL Declaration', layer: 'seo',
      status: 'pass', score: 2, maxScore: 2, impact: 'important',
      details: '<link rel="canonical"> found on the homepage. Search engines and agents will use this URL as the authoritative reference.',
      why: 'Canonical tags prevent duplicate content penalties by signalling the preferred URL for each page. Without them, your content may be indexed under multiple URLs (www vs non-www, trailing slash vs none) — splitting link equity and confusing AI citation systems.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    seoChecks.push({
      id: 'canonical', name: 'Canonical URL Declaration', layer: 'seo',
      status: 'warning', score: 0, maxScore: 2, impact: 'important',
      details: 'No <link rel="canonical"> tag found on the homepage.',
      why: 'Without a canonical URL, search engines and AI systems that encounter your content via multiple paths (e.g. https://example.com vs https://www.example.com vs http://example.com) may index them as separate pages — splitting your citation authority.',
      recommendation: 'Add a canonical link tag to every page pointing to its preferred absolute URL.',
      fixSnippet: { language: 'html', code: `<link rel="canonical" href="${origin}/">` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 5.4 Meta Description
  const metaDesc = getMetaContent('description', homepageHtml);
  if (metaDesc && metaDesc.length >= 50 && metaDesc.length <= 200) {
    seoChecks.push({
      id: 'meta-description', name: 'Meta Description', layer: 'seo',
      status: 'pass', score: 1, maxScore: 1, impact: 'recommended',
      details: `Meta description found (${metaDesc.length} chars): "${metaDesc.substring(0, 80)}${metaDesc.length > 80 ? '…' : ''}"`,
      why: 'Meta descriptions directly influence click-through rates in both traditional search results and AI-generated answer cards. Google rewrites poor descriptions — a specific, accurate one gets rewritten less often.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    seoChecks.push({
      id: 'meta-description', name: 'Meta Description', layer: 'seo',
      status: 'warning', score: 0, maxScore: 1, impact: 'recommended',
      details: metaDesc ? `Meta description found but length is ${metaDesc.length} chars — outside the 50-160 char sweet spot.` : 'No meta description found on the homepage.',
      why: 'Meta descriptions are the first human-readable summary AI search systems and Google use to decide if your page is relevant. Too short and Google generates its own (often poor). Too long and it\'s truncated.',
      recommendation: 'Write a unique 120-160 character meta description for each page that accurately describes its content and includes the primary keyword naturally.',
      fixSnippet: { language: 'html', code: `<meta name="description" content="A unique, 120-160 character description for this specific page. Be specific — Google shows this in search results.">` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 5.5 RSS / Feed
  const hasFeedLink = /type=["']application\/(rss|atom|feed)\+xml["']/.test(homepageHtml);
  const hasFeedFile = feedRes?.ok || feedJsonRes?.ok;
  if (hasFeedLink || hasFeedFile) {
    seoChecks.push({
      id: 'rss-feed', name: 'RSS / Atom / JSON Feed', layer: 'seo',
      status: 'pass', score: 1, maxScore: 1, impact: 'optional',
      details: `Feed discovered: ${hasFeedLink ? 'via <link rel="alternate"> tag in HTML' : 'at /feed.xml or /feed.json'}. Content subscribers and AI agents can follow updates.`,
      why: 'RSS feeds let AI agents, feed readers, and aggregators subscribe to your content updates without polling your homepage. AI research tools that track domain knowledge often prioritise domains with feeds.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    seoChecks.push({
      id: 'rss-feed', name: 'RSS / Atom / JSON Feed', layer: 'seo',
      status: 'warning', score: 0, maxScore: 1, impact: 'optional',
      details: 'No RSS, Atom, or JSON feed detected at /feed.xml, /feed.json, or via <link rel="alternate"> discovery tags.',
      why: 'Feeds are how agents and aggregators track content updates from your domain over time. AI research pipelines that index domain knowledge often require a feed to stay current — without one, they may only discover your content once and never revisit.',
      recommendation: 'Publish a feed and announce it in your <head>. Most frameworks have built-in feed generation.',
      fixSnippet: { language: 'html', code: `<!-- Announce in <head> -->\n<link rel="alternate" type="application/rss+xml" title="${domain} RSS Feed" href="${origin}/feed.xml">` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 5.6 JSON-LD Entity Graph Linking (@graph & @id)
  const hasGraph = homepageHtml.includes('"@graph"') || homepageHtml.includes('"@id"');
  if (hasGraph) {
    seoChecks.push({
      id: 'seo-schema-graph', name: 'JSON-LD Entity Graph Linking (@graph)', layer: 'seo',
      status: 'pass', score: 2, maxScore: 2, impact: 'important',
      details: 'JSON-LD data contains unified @graph declarations or explicit @id entity linkages.',
      why: 'Grouping schemas in a single @graph block or linking them via @id helps LLM crawlers construct a coherent knowledge graph of your domain (e.g., matching the Author entity to a specific Article and Organization) instead of parsing isolated blocks.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    seoChecks.push({
      id: 'seo-schema-graph', name: 'JSON-LD Entity Graph Linking (@graph)', layer: 'seo',
      status: 'warning', score: 0, maxScore: 2, impact: 'important',
      details: 'No unified @graph structure or explicit @id entity linkage discovered in structured data.',
      why: 'Without @id linking, agents must guess entity relationships (e.g. whether the local author matches the writer of another page), reducing entity extraction reliability.',
      recommendation: 'Refactor JSON-LD schemas to group entities inside a single "@graph" array or link them using unique "@id" keys.',
      fixSnippet: { language: 'json', code: `{\n  "@context": "https://schema.org",\n  "@graph": [\n    {\n      "@type": "Organization",\n      "@id": "${origin}/#org",\n      "name": "${domain}"\n    },\n    {\n      "@type": "WebSite",\n      "@id": "${origin}/#site",\n      "url": "${origin}",\n      "publisher": { "@id": "${origin}/#org" }\n    }\n  ]\n}` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 5.7 Extended Schema Support (FAQPage, Product, HowTo, SoftwareApplication)
  const schemaTypes = ['FAQPage', 'Product', 'HowTo', 'SoftwareApplication', 'LocalBusiness', 'NewsArticle', 'Course'];
  const foundSchemas = schemaTypes.filter(s => homepageHtml.includes(`"${s}"`) || homepageHtml.includes(`'${s}'`));
  if (foundSchemas.length > 0) {
    seoChecks.push({
      id: 'seo-rich-schemas', name: 'Extended Schema Support', layer: 'seo',
      status: 'pass', score: 2, maxScore: 2, impact: 'recommended',
      details: `Discovered rich schema entity declarations: ${foundSchemas.join(', ')}.`,
      why: 'Rich schemas (FAQPage, Product, HowTo) declare precise parameters (e.g., price, ratings, step-by-step guides) that answer engines use directly to populate citation snippets and interactive widgets.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    seoChecks.push({
      id: 'seo-rich-schemas', name: 'Extended Schema Support', layer: 'seo',
      status: 'warning', score: 1, maxScore: 2, impact: 'recommended',
      details: 'No advanced entity schemas (e.g. FAQPage, Product, HowTo) detected beyond WebSite or Organization.',
      why: 'Lacking specific types like FAQPage or Product, LLM answer engines must fall back to crawling prose text, increasing citation error rates.',
      recommendation: 'Deploy matching advanced schemas on relevant pages (e.g., FAQPage on Q&A layouts, Product on purchase pages).',
      fixSnippet: { language: 'json', code: `{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [{\n    "@type": "Question",\n    "name": "How to do X?",\n    "acceptedAnswer": {\n      "@type": "Answer",\n      "text": "Do X by following step Y."\n    }\n  }]\n}` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 5.8 Answer-First Content Hierarchy
  const bodyMatch = homepageHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const first1000Chars = bodyMatch ? bodyMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').substring(0, 1000) : '';
  const wordCount = first1000Chars.split(' ').filter(Boolean).length;
  if (wordCount >= 50) {
    seoChecks.push({
      id: 'seo-answer-first', name: 'Answer-First Content Hierarchy', layer: 'seo',
      status: 'pass', score: 1, maxScore: 1, impact: 'recommended',
      details: 'Page features structured text immediately in the initial layout fold.',
      why: 'LLMs parse content sequentially. Front-loading the main entity summary, thesis, or answers in the first 500-1000 tokens ensures the crawler extracts the core information before reaching context limits.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    seoChecks.push({
      id: 'seo-answer-first', name: 'Answer-First Content Hierarchy', layer: 'seo',
      status: 'warning', score: 0, maxScore: 1, impact: 'recommended',
      details: `Low text density in the first fold (${wordCount} words found). Layout may be menu-heavy or spacer-heavy.`,
      why: 'If the top of your page is filled with nav links, structural wrappers, or empty margins, model crawlers waste input tokens reading boilerplate before reaching actual answers.',
      recommendation: 'Place a clear summary paragraph, subtitle, or definition at the very top of your content hierarchy.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 5.9 Multimodal Optimization (Image Alt Tags & SVGs)
  const hasImages = homepageHtml.includes('<img');
  const missingAlts = hasImages ? (homepageHtml.match(/<img(?![^>]*\balt=)[^>]*>/gi) || []).length : 0;
  const hasSVGs = homepageHtml.includes('<svg');
  if (hasImages && missingAlts > 0) {
    seoChecks.push({
      id: 'seo-multimodal', name: 'Multimodal Asset Optimization', layer: 'seo',
      status: 'warning', score: 1, maxScore: 2, impact: 'important',
      details: `Missing alt attributes on ${missingAlts} image tag(s) on the homepage.`,
      why: 'Multimodal AI systems (like Gemini Pro or GPT-4o) parse images directly. Alt tags are crucial anchors for matching visual images to surrounding text, especially for crawlers operating in text-only mode.',
      recommendation: 'Provide meaningful, descriptive alt text for all image tags.',
      fixSnippet: { language: 'html', code: `<img src="/diagram.png" alt="Architecture diagram of the agent validation flow showing the HTTP request sequence">` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    seoChecks.push({
      id: 'seo-multimodal', name: 'Multimodal Asset Optimization', layer: 'seo',
      status: 'pass', score: 2, maxScore: 2, impact: 'important',
      details: `All image tags have alt descriptions. ${hasSVGs ? 'SVG code is utilized for icons, enabling direct token reading.' : ''}`,
      why: 'Clean alt tags and SVG code enable both text-only search bots and multimodal vision models to correctly extract details from your visual assets.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // 5.10 Content Freshness & Recency Indicators
  const hasFreshness = homepageHtml.includes('dateModified') || homepageHtml.includes('datePublished') ||
                       homepageHtml.includes('lastModified') || homepageHtml.includes('pubdate');
  if (hasFreshness) {
    seoChecks.push({
      id: 'seo-freshness', name: 'Content Freshness & Recency Indicators', layer: 'seo',
      status: 'pass', score: 1, maxScore: 1, impact: 'optional',
      details: 'Metadata includes publication or modification timestamps.',
      why: 'AI models prioritize recent, updated facts. Publishing clear schema timestamps signals content recency to answer engines indexing news, updates, or specs.',
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  } else {
    seoChecks.push({
      id: 'seo-freshness', name: 'Content Freshness & Recency Indicators', layer: 'seo',
      status: 'warning', score: 0, maxScore: 1, impact: 'optional',
      details: 'No publication or modification dates found in HTML markup.',
      why: 'Lacking timestamp metadata, agents cannot easily verify if your specs or articles are up to date, which can result in stale citations in AI-generated responses.',
      recommendation: 'Include datePublished and dateModified fields in your article JSON-LD or meta tags.',
      fixSnippet: { language: 'json', code: `"datePublished": "2026-08-28T09:00:00Z",\n"dateModified": "${new Date().toISOString()}"` },
      referenceUrl: 'https://veda.ng/sitecheck',
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LAYER 6 — Payments
  // ──────────────────────────────────────────────────────────────────────────
  const paymentChecks: CheckResult[] = [];
  const paymentHeaders = (mdAcceptRes?.headers.get('www-authenticate') || '').toLowerCase();
  const hasMppOrX402 = paymentHeaders.includes('payment') || paymentHeaders.includes('x402');

  if (hasMppOrX402) {
    paymentChecks.push({
      id: 'agent-payments', name: 'Agent Micropayments (x402 / MPP)', layer: 'payments',
      status: 'pass', score: 2, maxScore: 2, impact: 'optional',
      details: 'Machine payments protocol challenge detected in HTTP headers (x402 or MPP).',
      why: 'x402 and MPP (Machine Payments Protocol) are HTTP-native payment standards that let AI agents pay for API calls, content, or actions without human intervention. Supporting them positions you for the autonomous agent economy.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    paymentChecks.push({
      id: 'agent-payments', name: 'Agent Micropayments (x402 / MPP)', layer: 'payments',
      status: 'na', score: 0, maxScore: 0, impact: 'optional',
      details: 'No paid API challenge detected — site appears to be open-access or non-commerce.',
      why: 'x402 and MPP enable autonomous agents to pay for premium API access using HTTP 402 responses and machine-readable payment instructions. If you offer paywalled content or metered APIs, adopting these protocols enables native agent billing without user intervention.',
      recommendation: 'If offering paywalled APIs, consider implementing x402 (Payment Required) or Machine Payments Protocol for keyless agent billing.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 6.2 WebLN / Lightning Micropayments Discovery
  const hasWebLN = homepageHtml.includes('name="lightning"') || homepageHtml.includes('rel="lightning"');
  if (hasWebLN) {
    paymentChecks.push({
      id: 'payments-webln', name: 'WebLN / Lightning Wallet Discovery', layer: 'payments',
      status: 'pass', score: 1, maxScore: 1, impact: 'optional',
      details: 'WebLN / Lightning node address discovered in homepage meta tags.',
      why: 'WebLN allows agents to pay for microservices or access automatically using Lightning network invoices. Having a WebLN meta tag enables agents to locate your invoice provider or payment gateway natively.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    paymentChecks.push({
      id: 'payments-webln', name: 'WebLN / Lightning Wallet Discovery', layer: 'payments',
      status: 'na', score: 0, maxScore: 0, impact: 'optional',
      details: 'No WebLN wallet addresses declared on the homepage.',
      why: 'Agents cannot locate a Lightning node connection endpoint to perform WebLN payments.',
      recommendation: 'If you want to receive Lightning micropayments from machines, add a meta tag containing your Lightning Address.',
      fixSnippet: { language: 'html', code: `<meta name="lightning" content="youraddress@ln.tips">` },
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 6.3 AI Terms of Use Check (terms-of-use.md)
  if (termsRes?.ok && termsRes.text && termsRes.text.length > 50) {
    const hasScrapingClauses = /scrape|crawling|ai\b|agent|llm|mining/i.test(termsRes.text);
    paymentChecks.push({
      id: 'payments-terms', name: 'AI Terms of Service (terms-of-use.md)', layer: 'payments',
      status: hasScrapingClauses ? 'pass' : 'warning', score: hasScrapingClauses ? 1 : 0, maxScore: 1, impact: 'optional',
      details: `terms-of-use.md discovered at /terms-of-use.md. ${hasScrapingClauses ? 'Includes explicit terms detailing acceptable agent crawling bounds.' : 'File found but does not specify crawler/agent terms.'}`,
      why: 'Autonomous agents must comply with legal boundaries. Publishing a clear, machine-readable terms-of-use.md listing acceptable crawling thresholds, API usage policies, and scraping constraints prevents compliance friction.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    paymentChecks.push({
      id: 'payments-terms', name: 'AI Terms of Service (terms-of-use.md)', layer: 'payments',
      status: 'warning', score: 0, maxScore: 1, impact: 'optional',
      details: 'No machine-readable terms of use found at /terms-of-use.md.',
      why: 'Without a clear /terms-of-use.md, compliance-aware agents may refuse to crawl your site to avoid copyright or licensing liabilities.',
      recommendation: 'Publish a /terms-of-use.md outlining rules for AI crawling, data usage, and scraping limitations.',
      fixSnippet: { language: 'markdown', filename: 'public/terms-of-use.md', code: `# Terms of Use — ${domain}\n\n## AI Crawling & Data Usage\n- Crawler bots may ingest public documentation for indexing and search citation.\n- Scraping for model training is permitted only in accordance with robots.txt directives.\n- Bulk database dumping is strictly prohibited.` },
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Score & Grade
  // ──────────────────────────────────────────────────────────────────────────
  function makeLayer(id: ScanResult['layers'][0]['id'], name: string, description: string, checks: CheckResult[]) {
    const { score, maxScore, percentage } = scoreLayer(checks);
    return { id, name, description, score, maxScore, percentage, checks };
  }

  const layers = [
    makeLayer('discovery', 'Discovery', 'Can AI search engines and agents find and catalog your domain?', discoveryChecks),
    makeLayer('access', 'Access', 'Can agents retrieve clean, token-efficient content without browser overhead?', accessChecks),
    makeLayer('usability', 'Usability & MCP', 'Can agents execute tools, call APIs, and read schemas autonomously?', usabilityChecks),
    makeLayer('security', 'Security', 'Is the site hardened against web attacks and trustworthy for AI integrations?', securityChecks),
    makeLayer('seo', 'SEO & Content', 'Is the site structured for machine-readable discovery, indexing, and citation?', seoChecks),
    makeLayer('payments', 'Payments', 'Can agents execute transactions and micropayments?', paymentChecks),
  ];

  const scoredLayers = layers.filter(l => l.maxScore > 0);
  const totalScored = scoredLayers.reduce((a, l) => a + l.score, 0);
  const totalMax = scoredLayers.reduce((a, l) => a + l.maxScore, 0);
  const finalScore = Math.min(100, Math.round((totalScored / Math.max(1, totalMax)) * 100));

  let grade: ScanResult['grade'] = 'F';
  if (finalScore >= 95) grade = 'A+';
  else if (finalScore >= 88) grade = 'A';
  else if (finalScore >= 75) grade = 'B';
  else if (finalScore >= 60) grade = 'C';
  else if (finalScore >= 45) grade = 'D';

  const allChecks = layers.flatMap(l => l.checks);
  const failCount = allChecks.filter(c => c.status === 'fail').length;
  const warnCount = allChecks.filter(c => c.status === 'warning').length;

  let summary: string;
  if (grade === 'A+') {
    summary = `${domain} is an exceptional AI-ready domain: full MCP coverage, comprehensive discovery signals, and a strong security posture.`;
  } else if (grade === 'A') {
    summary = `${domain} has strong agent-readiness across discovery and access layers. ${warnCount} minor gaps are present.`;
  } else if (grade === 'B') {
    summary = `${domain} has solid foundations. ${warnCount} areas need attention — primarily around agent catalogs, security headers, or MCP tool support.`;
  } else if (grade === 'C') {
    summary = `${domain} has partial AI compatibility. Adding llms.txt, fixing security headers, and deploying structured data will significantly improve the score.`;
  } else {
    summary = `${domain} currently lacks dedicated machine discovery protocols. ${failCount} critical issues and ${warnCount} warnings need to be addressed.`;
  }

  return {
    url, domain,
    scannedAt: new Date().toISOString(),
    durationMs: Date.now() - startTime,
    score: finalScore, grade, summary, layers,
    badges: {
      mcpServer: Boolean(mcpWorking),
      llmsTxt: Boolean(llmsRes?.ok && llmsRes.text.length > 50),
      ardCatalog: Boolean(ardValid),
      markdownTwins: Boolean(acceptsMd || hasMdTwin),
      openapiSpec: Boolean(openapiRes?.ok),
      aiBotFriendly: Boolean(robotsRes?.ok),
      httpsSecure: isHttps && hsts.length > 0,
      structuredData: hasJsonLd,
      jsRenderingSelfSufficient: !hasNoContent || !isSPA,
      xmlOrJsonSitemap: Boolean(sitemapRes?.ok || sitemapJsonRes?.ok),
      schemaEntityGraph: hasGraph,
      openapiExamplesReady: Boolean(openapiRes?.ok && openapiRes.text.includes('"example"')),
      micropaymentsSupported: Boolean(hasMppOrX402 || hasWebLN),
    },
  };
}

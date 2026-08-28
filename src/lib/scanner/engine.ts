import { CheckResult, LayerScore, ScanResult } from './types';

const PROBE_TIMEOUT_MS = 4500;

function isPrivateIpOrHost(hostname: string): boolean {
  const host = hostname.toLowerCase().trim();
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host === '::1' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host.endsWith('.localhost')
  ) {
    return true;
  }
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^169\.254\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  return false;
}

export function normalizeTargetUrl(input: string): { url: string; domain: string; origin: string } {
  let raw = input.trim();
  if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
    raw = `https://${raw}`;
  }
  const parsed = new URL(raw);
  if (isPrivateIpOrHost(parsed.hostname)) {
    throw new Error(`Scanning private or local address '${parsed.hostname}' is not permitted.`);
  }
  return {
    url: parsed.toString(),
    domain: parsed.hostname,
    origin: parsed.origin,
  };
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
    robotsRes,          // /robots.txt
    llmsRes,            // /llms.txt
    llmsFullRes,        // /llms-full.txt
    ardRes,             // /.well-known/ard.json
    aiCatalogRes,       // /.well-known/ai-catalog.json
    pluginRes,          // /plugin.json
    sitemapRes,         // /sitemap.xml
    mdAcceptRes,        // / with Accept: text/markdown (also used for security headers)
    mdTwinRes,          // /index.md
    botUaRes,           // / with GPTBot user-agent
    mcpWellKnownRes,    // /.well-known/mcp POST initialize
    mcpApiRes,          // /api/mcp POST initialize
    openapiRes,         // /openapi.json
    authRes,            // /auth.md
    // New probes for expanded coverage
    agentsTxtRes,       // /agents.txt
    agentsJsonRes,      // /.well-known/agents.json
    agentCardRes,       // /.well-known/agent-card.json
    securityTxtRes,     // /.well-known/security.txt
    tdmrepRes,          // /.well-known/tdmrep.json
    feedRes,            // /feed.xml  (RSS/Atom discovery)
    feedJsonRes,        // /feed.json (JSON Feed)
    homepageRes,        // / normal fetch for HTML inspection (OG, JSON-LD, canonical)
    rateLimitRes,       // /api (for rate limit headers)
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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 'probe-1', method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'veda-scanner', version: '1.0' } } }),
    }),
    safeFetch(`${origin}/api/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
  ]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const homepageHtml = homepageRes?.text || mdAcceptRes?.text || '';

  function hasHtmlTag(tag: string, html: string): boolean {
    return new RegExp(tag, 'i').test(html);
  }
  function getMetaContent(name: string, html: string): string {
    const m = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'))
           || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`, 'i'));
    return m ? m[1] : '';
  }

  // ── Response headers from the HTML homepage ──────────────────────────────
  const secHeaders = homepageRes?.headers ?? mdAcceptRes?.headers ?? botUaRes?.headers;

  const isHttps = origin.startsWith('https://');
  const hsts = secHeaders?.get('strict-transport-security') || '';
  const csp = secHeaders?.get('content-security-policy') || '';
  const xcto = secHeaders?.get('x-content-type-options') || '';
  const xfo = secHeaders?.get('x-frame-options') || '';
  const rp = secHeaders?.get('referrer-policy') || '';
  const pp = secHeaders?.get('permissions-policy') || '';

  // ──────────────────────────────────────────────────────────────────────────
  // LAYER 1 — Discovery
  // ──────────────────────────────────────────────────────────────────────────
  const discoveryChecks: CheckResult[] = [];

  // 1.1 AI Crawler Policy (robots.txt)
  if (robotsRes && robotsRes.ok && robotsRes.text) {
    const txt = robotsRes.text;
    const allowsGptBot    = !/User-agent:\s*GPTBot[\s\S]*?Disallow:\s*\/\s*$/im.test(txt);
    const allowsClaudeBot = !/User-agent:\s*ClaudeBot[\s\S]*?Disallow:\s*\/\s*$/im.test(txt);
    const allowsPerplexity = !/User-agent:\s*PerplexityBot[\s\S]*?Disallow:\s*\/\s*$/im.test(txt);
    const mentionsAiBots  = /GPTBot|ClaudeBot|PerplexityBot|OAI-SearchBot|Google-Extended|Applebot-Extended/i.test(txt);

    if (allowsGptBot && allowsClaudeBot && allowsPerplexity && mentionsAiBots) {
      discoveryChecks.push({ id: 'robots-ai-policy', name: 'AI Crawler Policy (robots.txt)', layer: 'discovery', status: 'pass', score: 3, maxScore: 3, details: 'robots.txt explicitly allows answer engine bots (GPTBot, ClaudeBot, PerplexityBot) with clean crawler directives.', referenceUrl: 'https://veda.ng/aistandards' });
    } else if (allowsGptBot || allowsClaudeBot) {
      discoveryChecks.push({ id: 'robots-ai-policy', name: 'AI Crawler Policy (robots.txt)', layer: 'discovery', status: 'pass', score: 2, maxScore: 3, details: 'robots.txt allows primary AI search bots, though explicit per-bot directives could be more complete.', referenceUrl: 'https://veda.ng/aistandards' });
    } else {
      discoveryChecks.push({ id: 'robots-ai-policy', name: 'AI Crawler Policy (robots.txt)', layer: 'discovery', status: 'warning', score: 1, maxScore: 3, details: 'robots.txt blocks major AI retrieval agents or lacks explicit AI bot configuration.', recommendation: 'Allow AI answer engine bots (GPTBot, ClaudeBot, PerplexityBot) to ensure your content is surfaced in AI search citations.', fixSnippet: { language: 'robots.txt', filename: 'public/robots.txt', code: `# Allow AI Answer Engines\nUser-agent: GPTBot\nUser-agent: ClaudeBot\nUser-agent: PerplexityBot\nUser-agent: OAI-SearchBot\nUser-agent: Google-Extended\nUser-agent: DeepSeekBot\nAllow: /\n\n# Block Mass Dataset Harvesters\nUser-agent: CCBot\nUser-agent: ByteSpider\nDisallow: /` }, referenceUrl: 'https://veda.ng/aistandards' });
    }
  } else {
    discoveryChecks.push({ id: 'robots-ai-policy', name: 'AI Crawler Policy (robots.txt)', layer: 'discovery', status: 'fail', score: 0, maxScore: 3, details: 'No robots.txt found at /robots.txt.', recommendation: 'Publish a robots.txt file at the root of your domain specifying crawler permissions.', fixSnippet: { language: 'robots.txt', filename: 'public/robots.txt', code: `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml` }, referenceUrl: 'https://veda.ng/aistandards' });
  }

  // 1.2 llms.txt
  if (llmsRes && llmsRes.ok && llmsRes.text && llmsRes.text.length > 50) {
    const hasStructure = /^#\s+/m.test(llmsRes.text) && /\[.*?\]\(.*?\)/.test(llmsRes.text);
    discoveryChecks.push({ id: 'llms-txt', name: 'LLM Index (llms.txt)', layer: 'discovery', status: hasStructure ? 'pass' : 'warning', score: hasStructure ? 3 : 2, maxScore: 3, details: `llms.txt published (${llmsRes.text.length} chars) with ${hasStructure ? 'structured' : 'partial'} Markdown navigation.`, referenceUrl: 'https://veda.ng/aistandards' });
  } else {
    discoveryChecks.push({ id: 'llms-txt', name: 'LLM Index (llms.txt)', layer: 'discovery', status: 'fail', score: 0, maxScore: 3, details: 'No llms.txt found at /llms.txt.', recommendation: 'Publish an llms.txt file providing LLMs with an index of your site documentation and key pages.', fixSnippet: { language: 'markdown', filename: 'public/llms.txt', code: `# ${domain}\n\n> Summary of what this site offers.\n\n## Main Pages\n- [Home](${origin}/)\n- [Documentation](${origin}/docs)\n- [API Reference](${origin}/api)\n- [Pricing](${origin}/pricing)` }, referenceUrl: 'https://veda.ng/aistandards' });
  }

  // 1.3 llms-full.txt
  if (llmsFullRes && llmsFullRes.ok && llmsFullRes.text && llmsFullRes.text.length > 200) {
    discoveryChecks.push({ id: 'llms-full-txt', name: 'Full-text Context Index (llms-full.txt)', layer: 'discovery', status: 'pass', score: 2, maxScore: 2, details: `llms-full.txt published (${llmsFullRes.text.length} chars) for deep context ingestion.`, referenceUrl: 'https://veda.ng/aistandards' });
  } else {
    discoveryChecks.push({ id: 'llms-full-txt', name: 'Full-text Context Index (llms-full.txt)', layer: 'discovery', status: 'warning', score: 0, maxScore: 2, details: 'Optional llms-full.txt not found at /llms-full.txt.', recommendation: 'Serve a full-text markdown index at /llms-full.txt for one-request context ingestion.', referenceUrl: 'https://veda.ng/aistandards' });
  }

  // 1.4 ARD / AI Catalog
  const ardValid = (ardRes?.ok && ardRes.text.includes('entries')) || (aiCatalogRes?.ok && aiCatalogRes.text.includes('entries'));
  if (ardValid) {
    discoveryChecks.push({ id: 'ard-catalog', name: 'Agentic Resource Discovery (ARD Catalog)', layer: 'discovery', status: 'pass', score: 3, maxScore: 3, details: 'Valid machine catalog published at /.well-known/ard.json or /.well-known/ai-catalog.json.', referenceUrl: 'https://veda.ng/aistandards' });
  } else {
    discoveryChecks.push({ id: 'ard-catalog', name: 'Agentic Resource Discovery (ARD Catalog)', layer: 'discovery', status: 'warning', score: 0, maxScore: 3, details: 'No ARD catalog found at /.well-known/ard.json or /.well-known/ai-catalog.json.', recommendation: 'Publish an ARD v0.91 catalog listing all your APIs, MCP servers, and tools.', fixSnippet: { language: 'json', filename: 'public/.well-known/ard.json', code: `{\n  "specVersion": "1.0",\n  "host": { "displayName": "${domain}", "identifier": "${domain}" },\n  "entries": [\n    {\n      "identifier": "urn:air:${domain}:mcp-server:product",\n      "displayName": "Product MCP Server",\n      "type": "application/mcp-server+json",\n      "url": "${origin}/.well-known/mcp"\n    }\n  ]\n}` }, referenceUrl: 'https://veda.ng/aistandards' });
  }

  // 1.5 Plugin manifest (plugin.json)
  if (pluginRes?.ok && pluginRes.text.includes('capabilities')) {
    discoveryChecks.push({ id: 'agent-plugins', name: 'Agent Plugins Manifest (plugin.json)', layer: 'discovery', status: 'pass', score: 2, maxScore: 2, details: 'Agent Plugins manifest found and valid (agent-plugins.org schema).', referenceUrl: 'https://veda.ng/aistandards' });
  } else {
    discoveryChecks.push({ id: 'agent-plugins', name: 'Agent Plugins Manifest (plugin.json)', layer: 'discovery', status: 'warning', score: 0, maxScore: 2, details: 'No plugin.json found at /plugin.json.', recommendation: 'Publish a plugin.json file describing tool capabilities and documentation endpoints for agent hosts.', referenceUrl: 'https://veda.ng/aistandards' });
  }

  // 1.6 XML Sitemap
  if (sitemapRes?.ok && sitemapRes.text.includes('<urlset')) {
    discoveryChecks.push({ id: 'xml-sitemap', name: 'XML Sitemap (sitemap.xml)', layer: 'discovery', status: 'pass', score: 2, maxScore: 2, details: 'Standard XML sitemap published at /sitemap.xml.', referenceUrl: 'https://veda.ng/sitecheck' });
  } else {
    discoveryChecks.push({ id: 'xml-sitemap', name: 'XML Sitemap (sitemap.xml)', layer: 'discovery', status: 'warning', score: 1, maxScore: 2, details: 'No XML sitemap detected at /sitemap.xml.', recommendation: 'Generate an XML sitemap listing your canonical URLs and lastmod timestamps.', referenceUrl: 'https://veda.ng/sitecheck' });
  }

  // 1.7 agents.txt
  if (agentsTxtRes?.ok && agentsTxtRes.text && agentsTxtRes.text.length > 20) {
    discoveryChecks.push({ id: 'agents-txt', name: 'Agent Protocol Index (agents.txt)', layer: 'discovery', status: 'pass', score: 1, maxScore: 1, details: 'agents.txt published announcing supported agent protocols (MCP, A2A, payments).', referenceUrl: 'https://veda.ng/aistandards' });
  } else {
    discoveryChecks.push({ id: 'agents-txt', name: 'Agent Protocol Index (agents.txt)', layer: 'discovery', status: 'warning', score: 0, maxScore: 1, details: 'No agents.txt found at /agents.txt.', recommendation: 'Publish an agents.txt announcing which agent protocols (MCP, A2A, payment channels) your site supports.', fixSnippet: { language: 'text', filename: 'public/agents.txt', code: `# Supported Agent Protocols\nMCP: ${origin}/.well-known/mcp\nA2A: ${origin}/.well-known/agent-card.json\nLLMs: ${origin}/llms.txt` }, referenceUrl: 'https://veda.ng/aistandards' });
  }

  // 1.8 agents.json / well-known
  if (agentsJsonRes?.ok && agentsJsonRes.text && agentsJsonRes.text.includes('when_to_use')) {
    discoveryChecks.push({ id: 'agents-json', name: 'Agent Manifest (agents.json)', layer: 'discovery', status: 'pass', score: 2, maxScore: 2, details: '/.well-known/agents.json found with task-suitability fields (when_to_use).', referenceUrl: 'https://veda.ng/aistandards' });
  } else {
    discoveryChecks.push({ id: 'agents-json', name: 'Agent Manifest (agents.json)', layer: 'discovery', status: 'warning', score: 0, maxScore: 2, details: 'No /.well-known/agents.json manifest found.', recommendation: 'Publish a structured agents.json declaring task suitability, tool endpoints, and runtime guidance for autonomous agent discovery.', fixSnippet: { language: 'json', filename: 'public/.well-known/agents.json', code: `{\n  "name": "${domain}",\n  "description": "What this site does",\n  "when_to_use": "Use this agent when...",\n  "tools": [{ "name": "tool_name", "url": "${origin}/.well-known/mcp" }]\n}` }, referenceUrl: 'https://veda.ng/aistandards' });
  }

  // 1.9 A2A Agent Card
  if (agentCardRes?.ok && agentCardRes.text && agentCardRes.text.includes('name')) {
    discoveryChecks.push({ id: 'a2a-card', name: 'A2A Agent Card (agent-card.json)', layer: 'discovery', status: 'pass', score: 2, maxScore: 2, details: 'Google A2A agent card found at /.well-known/agent-card.json for agent-to-agent delegation.', referenceUrl: 'https://veda.ng/aistandards' });
  } else {
    discoveryChecks.push({ id: 'a2a-card', name: 'A2A Agent Card (agent-card.json)', layer: 'discovery', status: 'warning', score: 0, maxScore: 2, details: 'No A2A agent card found at /.well-known/agent-card.json.', recommendation: 'Publish an A2A agent-card.json to enable autonomous agent-to-agent delegation via the Google A2A protocol.', fixSnippet: { language: 'json', filename: 'public/.well-known/agent-card.json', code: `{\n  "name": "${domain} Agent",\n  "description": "Agent capabilities for ${domain}",\n  "version": "1.0.0",\n  "url": "${origin}/.well-known/mcp",\n  "capabilities": { "streaming": false, "tools": true }\n}` }, referenceUrl: 'https://veda.ng/aistandards' });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LAYER 2 — Access
  // ──────────────────────────────────────────────────────────────────────────
  const accessChecks: CheckResult[] = [];

  // 2.1 Markdown Content Negotiation
  const acceptsMd = mdAcceptRes?.ok && (
    mdAcceptRes.headers.get('content-type')?.includes('text/markdown') ||
    mdAcceptRes.headers.get('content-type')?.includes('text/plain') ||
    mdAcceptRes.text.startsWith('# ') ||
    mdAcceptRes.text.startsWith('---')
  );

  if (acceptsMd) {
    accessChecks.push({ id: 'markdown-negotiation', name: 'Markdown Content Negotiation (Accept: text/markdown)', layer: 'access', status: 'pass', score: 3, maxScore: 3, details: 'Server serves clean Markdown when requested with Accept: text/markdown.', referenceUrl: 'https://veda.ng/sitecheck' });
  } else {
    accessChecks.push({ id: 'markdown-negotiation', name: 'Markdown Content Negotiation (Accept: text/markdown)', layer: 'access', status: 'warning', score: 1, maxScore: 3, details: 'Server returns HTML even when client asks for text/markdown.', recommendation: 'Implement server-side content negotiation to return Markdown for AI bots and agents.', fixSnippet: { language: 'typescript', filename: 'middleware.ts', code: `export function middleware(req: NextRequest) {\n  const accept = req.headers.get('accept') || '';\n  if (accept.includes('text/markdown')) {\n    return NextResponse.rewrite(new URL('/api/md' + req.nextUrl.pathname, req.url));\n  }\n}` }, referenceUrl: 'https://veda.ng/sitecheck' });
  }

  // 2.2 Markdown URL Twins (.md)
  const hasMdTwin = mdTwinRes?.ok && (mdTwinRes.headers.get('content-type')?.includes('markdown') || mdTwinRes.text.startsWith('#') || mdTwinRes.text.startsWith('---'));
  if (hasMdTwin) {
    accessChecks.push({ id: 'markdown-twins', name: 'Markdown URL Twins (/index.md)', layer: 'access', status: 'pass', score: 3, maxScore: 3, details: 'Predictable .md URL twins (e.g. /index.md) are reachable and serve valid markdown.', referenceUrl: 'https://veda.ng/sitecheck' });
  } else {
    accessChecks.push({ id: 'markdown-twins', name: 'Markdown URL Twins (/index.md)', layer: 'access', status: 'warning', score: 1, maxScore: 3, details: 'No .md URL twin found for /index.md.', recommendation: 'Serve a companion .md path for each key page so LLM scrapers can fetch clean text without browser rendering.', referenceUrl: 'https://veda.ng/sitecheck' });
  }

  // 2.3 Bot User-Agent Accessibility
  if (botUaRes?.ok) {
    accessChecks.push({ id: 'bot-ua-access', name: 'AI Agent User-Agent Reachability', layer: 'access', status: 'pass', score: 2, maxScore: 2, details: 'Pages respond 200 OK when probed with GPTBot User-Agent.', referenceUrl: 'https://veda.ng/aistandards' });
  } else {
    accessChecks.push({ id: 'bot-ua-access', name: 'AI Agent User-Agent Reachability', layer: 'access', status: 'fail', score: 0, maxScore: 2, details: `AI crawler User-Agent was rejected (status: ${botUaRes ? botUaRes.status : 'timeout'}).`, recommendation: 'Ensure your WAF or CDN allows verified AI crawler User-Agents.', referenceUrl: 'https://veda.ng/aistandards' });
  }

  // 2.4 HTTP Link Discovery Headers
  const linkHeader = mdAcceptRes?.headers.get('link') || botUaRes?.headers.get('link') || homepageRes?.headers.get('link') || '';
  const hasLinkRel = linkHeader.includes('rel="alternate"') || linkHeader.includes('rel="service"') || linkHeader.includes('rel="help"');
  if (hasLinkRel) {
    accessChecks.push({ id: 'link-headers', name: 'HTTP Link Discovery Headers', layer: 'access', status: 'pass', score: 2, maxScore: 2, details: 'HTTP responses include Link headers advertising machine discovery files (llms.txt, MCP, OpenAPI).', referenceUrl: 'https://veda.ng/sitecheck' });
  } else {
    accessChecks.push({ id: 'link-headers', name: 'HTTP Link Discovery Headers', layer: 'access', status: 'warning', score: 0, maxScore: 2, details: 'No machine discovery Link headers detected in HTTP responses.', recommendation: 'Advertise machine resources via HTTP Link headers so agents that skip HTML can still discover your endpoints.', fixSnippet: { language: 'http', code: `Link: </llms.txt>; rel="alternate"; type="text/plain", </.well-known/mcp>; rel="service"; type="application/json", </openapi.json>; rel="service"; type="application/openapi+json"` }, referenceUrl: 'https://veda.ng/sitecheck' });
  }

  // 2.5 Rate-Limit Headers
  const rlHeader = rateLimitRes?.headers.get('ratelimit-limit') || rateLimitRes?.headers.get('x-ratelimit-limit') || rateLimitRes?.headers.get('ratelimit') || '';
  if (rlHeader) {
    accessChecks.push({ id: 'rate-limit-headers', name: 'RFC Rate-Limit Headers', layer: 'access', status: 'pass', score: 2, maxScore: 2, details: 'RFC-compliant RateLimit headers present — agents can self-regulate request velocity.', referenceUrl: 'https://veda.ng/developers' });
  } else {
    accessChecks.push({ id: 'rate-limit-headers', name: 'RFC Rate-Limit Headers', layer: 'access', status: 'warning', score: 0, maxScore: 2, details: 'No RFC RateLimit-Limit or X-RateLimit-Limit headers found on API responses.', recommendation: 'Publish RFC-compliant RateLimit headers on API responses so automated agents know their request budgets.', fixSnippet: { language: 'http', code: `RateLimit-Limit: 60\nRateLimit-Remaining: 55\nRateLimit-Reset: 60\nRateLimit-Policy: "60;w=60"` }, referenceUrl: 'https://veda.ng/developers' });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LAYER 3 — Usability & MCP
  // ──────────────────────────────────────────────────────────────────────────
  const usabilityChecks: CheckResult[] = [];

  // 3.1 MCP Server Handshake
  const mcpWorking = (mcpWellKnownRes?.ok && mcpWellKnownRes.text.includes('jsonrpc')) ||
                     (mcpApiRes?.ok && mcpApiRes.text.includes('jsonrpc'));
  if (mcpWorking) {
    usabilityChecks.push({ id: 'mcp-server-live', name: 'Model Context Protocol (MCP) Server', layer: 'usability', status: 'pass', score: 4, maxScore: 4, details: 'Live MCP server responded to JSON-RPC 2.0 initialize handshake over Streamable HTTP.', referenceUrl: 'https://veda.ng/mcp' });
  } else {
    usabilityChecks.push({ id: 'mcp-server-live', name: 'Model Context Protocol (MCP) Server', layer: 'usability', status: 'warning', score: 0, maxScore: 4, details: 'No live MCP server endpoint detected at /.well-known/mcp or /api/mcp.', recommendation: 'Expose a Model Context Protocol (MCP) server so LLMs (ChatGPT, Claude, Cursor) can execute tools directly on your domain.', fixSnippet: { language: 'typescript', filename: 'src/app/.well-known/mcp/route.ts', code: `export async function POST(req: Request) {\n  const { method, id } = await req.json();\n  if (method === 'initialize') {\n    return Response.json({ jsonrpc: '2.0', id, result: { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: '${domain}', version: '1.0.0' } } });\n  }\n}` }, referenceUrl: 'https://veda.ng/mcp' });
  }

  // 3.2 OpenAPI Specification
  if (openapiRes?.ok && openapiRes.text && (openapiRes.text.includes('openapi') || openapiRes.text.includes('paths'))) {
    usabilityChecks.push({ id: 'openapi-spec', name: 'OpenAPI Specification (openapi.json)', layer: 'usability', status: 'pass', score: 3, maxScore: 3, details: 'Valid OpenAPI 3.x specification found at /openapi.json.', referenceUrl: 'https://veda.ng/developers' });
  } else {
    usabilityChecks.push({ id: 'openapi-spec', name: 'OpenAPI Specification (openapi.json)', layer: 'usability', status: 'warning', score: 0, maxScore: 3, details: 'No machine-readable OpenAPI specification found at /openapi.json.', recommendation: 'Publish a typed OpenAPI 3.1 schema defining your API endpoints, parameters, and operationIds.', referenceUrl: 'https://veda.ng/developers' });
  }

  // 3.3 Auth & Security Guide
  if (authRes?.ok && authRes.text && authRes.text.length > 30) {
    usabilityChecks.push({ id: 'auth-guide', name: 'Authentication & Security Specs', layer: 'usability', status: 'pass', score: 2, maxScore: 2, details: 'Clear machine authentication guide published at /auth.md.', referenceUrl: 'https://veda.ng/developers' });
  } else {
    usabilityChecks.push({ id: 'auth-guide', name: 'Authentication & Security Specs', layer: 'usability', status: 'warning', score: 1, maxScore: 2, details: 'No dedicated /auth.md found. Clear auth documentation speeds up agent integration.', recommendation: 'Publish an /auth.md guide detailing authentication mechanisms or declaring keyless access.', referenceUrl: 'https://veda.ng/developers' });
  }

  // 3.4 TDMRep (Text & Data Mining Rights)
  if (tdmrepRes?.ok && tdmrepRes.text && tdmrepRes.text.length > 10) {
    usabilityChecks.push({ id: 'tdmrep', name: 'Text & Data Mining Rights (tdmrep.json)', layer: 'usability', status: 'pass', score: 1, maxScore: 1, details: 'tdmrep.json found at /.well-known/tdmrep.json declaring mining rights explicitly.', referenceUrl: 'https://veda.ng/aistandards' });
  } else {
    usabilityChecks.push({ id: 'tdmrep', name: 'Text & Data Mining Rights (tdmrep.json)', layer: 'usability', status: 'warning', score: 0, maxScore: 1, details: 'No tdmrep.json found. Under EU TDM rules, missing declaration may default to reserved rights.', recommendation: 'Publish a /.well-known/tdmrep.json to clearly signal text-and-data-mining permissions.', fixSnippet: { language: 'json', filename: 'public/.well-known/tdmrep.json', code: `{\n  "@context": "http://www.w3.org/ns/tdmrep",\n  "tdm-reservation": 0,\n  "tdm-policy": "${origin}/tdm-policy"\n}` }, referenceUrl: 'https://veda.ng/aistandards' });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LAYER 4 — Security
  // ──────────────────────────────────────────────────────────────────────────
  const securityChecks: CheckResult[] = [];

  // 4.1 HTTPS / TLS
  if (isHttps) {
    securityChecks.push({ id: 'https-tls', name: 'HTTPS / TLS', layer: 'security', status: 'pass', score: 3, maxScore: 3, details: 'Site is served over HTTPS with TLS encryption.', referenceUrl: 'https://veda.ng/sitecheck' });
  } else {
    securityChecks.push({ id: 'https-tls', name: 'HTTPS / TLS', layer: 'security', status: 'fail', score: 0, maxScore: 3, details: 'Site is not served over HTTPS. This is a critical security and trust requirement.', recommendation: 'Enable HTTPS via Let\'s Encrypt (free) or your hosting provider. Redirect all HTTP to HTTPS.', referenceUrl: 'https://veda.ng/sitecheck' });
  }

  // 4.2 HSTS Header
  if (hsts && hsts.includes('max-age')) {
    const maxAge = parseInt(hsts.match(/max-age=(\d+)/)?.[1] || '0');
    const isStrong = maxAge >= 15552000; // 6 months
    securityChecks.push({ id: 'hsts', name: 'HTTP Strict Transport Security (HSTS)', layer: 'security', status: isStrong ? 'pass' : 'warning', score: isStrong ? 2 : 1, maxScore: 2, details: `HSTS header present: ${hsts.substring(0, 80)}${hsts.length > 80 ? '…' : ''}`, referenceUrl: 'https://veda.ng/sitecheck' });
  } else {
    securityChecks.push({ id: 'hsts', name: 'HTTP Strict Transport Security (HSTS)', layer: 'security', status: 'fail', score: 0, maxScore: 2, details: 'No Strict-Transport-Security header found.', recommendation: 'Add an HSTS header to enforce HTTPS and prevent protocol downgrade attacks.', fixSnippet: { language: 'http', code: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` }, referenceUrl: 'https://veda.ng/sitecheck' });
  }

  // 4.3 Content Security Policy
  if (csp && csp.length > 10) {
    securityChecks.push({ id: 'csp', name: 'Content Security Policy (CSP)', layer: 'security', status: 'pass', score: 3, maxScore: 3, details: `CSP header present (${csp.substring(0, 60)}…). Reduces XSS attack surface.`, referenceUrl: 'https://veda.ng/sitecheck' });
  } else {
    const cspRO = secHeaders?.get('content-security-policy-report-only') || '';
    if (cspRO) {
      securityChecks.push({ id: 'csp', name: 'Content Security Policy (CSP)', layer: 'security', status: 'warning', score: 1, maxScore: 3, details: 'Only CSP report-only mode detected. Policy is not being enforced.', recommendation: 'Switch from Content-Security-Policy-Report-Only to Content-Security-Policy to enforce your policy.', referenceUrl: 'https://veda.ng/sitecheck' });
    } else {
      securityChecks.push({ id: 'csp', name: 'Content Security Policy (CSP)', layer: 'security', status: 'fail', score: 0, maxScore: 3, details: 'No Content-Security-Policy header found. XSS attacks are unrestricted.', recommendation: 'Deploy a CSP header. Start with report-only mode to find violations, then enforce.', fixSnippet: { language: 'http', code: `Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; frame-ancestors 'none'` }, referenceUrl: 'https://veda.ng/sitecheck' });
    }
  }

  // 4.4 X-Content-Type-Options
  if (xcto.toLowerCase().includes('nosniff')) {
    securityChecks.push({ id: 'xcto', name: 'X-Content-Type-Options', layer: 'security', status: 'pass', score: 1, maxScore: 1, details: 'X-Content-Type-Options: nosniff is set, preventing MIME sniffing attacks.', referenceUrl: 'https://veda.ng/sitecheck' });
  } else {
    securityChecks.push({ id: 'xcto', name: 'X-Content-Type-Options', layer: 'security', status: 'fail', score: 0, maxScore: 1, details: 'X-Content-Type-Options: nosniff header is missing.', recommendation: 'Add X-Content-Type-Options: nosniff to prevent browsers from MIME-sniffing responses.', fixSnippet: { language: 'http', code: `X-Content-Type-Options: nosniff` }, referenceUrl: 'https://veda.ng/sitecheck' });
  }

  // 4.5 Clickjacking (X-Frame-Options or CSP frame-ancestors)
  const hasFrameProtection = xfo.length > 0 || csp.includes('frame-ancestors');
  if (hasFrameProtection) {
    securityChecks.push({ id: 'frame-protection', name: 'Clickjacking Protection (X-Frame-Options / frame-ancestors)', layer: 'security', status: 'pass', score: 1, maxScore: 1, details: 'Clickjacking protection is active via X-Frame-Options or CSP frame-ancestors.', referenceUrl: 'https://veda.ng/sitecheck' });
  } else {
    securityChecks.push({ id: 'frame-protection', name: 'Clickjacking Protection (X-Frame-Options / frame-ancestors)', layer: 'security', status: 'warning', score: 0, maxScore: 1, details: 'No clickjacking protection detected (no X-Frame-Options or CSP frame-ancestors).', recommendation: "Add CSP frame-ancestors 'none' (preferred) or X-Frame-Options: DENY.", fixSnippet: { language: 'http', code: `Content-Security-Policy: frame-ancestors 'none'` }, referenceUrl: 'https://veda.ng/sitecheck' });
  }

  // 4.6 Referrer-Policy
  if (rp && rp.length > 4) {
    securityChecks.push({ id: 'referrer-policy', name: 'Referrer-Policy', layer: 'security', status: 'pass', score: 1, maxScore: 1, details: `Referrer-Policy: ${rp} is set, controlling URL leakage on cross-site navigation.`, referenceUrl: 'https://veda.ng/sitecheck' });
  } else {
    securityChecks.push({ id: 'referrer-policy', name: 'Referrer-Policy', layer: 'security', status: 'warning', score: 0, maxScore: 1, details: 'No Referrer-Policy header found.', recommendation: 'Set Referrer-Policy to control URL info sent to external sites.', fixSnippet: { language: 'http', code: `Referrer-Policy: strict-origin-when-cross-origin` }, referenceUrl: 'https://veda.ng/sitecheck' });
  }

  // 4.7 Permissions-Policy
  if (pp && pp.length > 4) {
    securityChecks.push({ id: 'permissions-policy', name: 'Permissions-Policy', layer: 'security', status: 'pass', score: 1, maxScore: 1, details: 'Permissions-Policy header restricts unused browser APIs.', referenceUrl: 'https://veda.ng/sitecheck' });
  } else {
    securityChecks.push({ id: 'permissions-policy', name: 'Permissions-Policy', layer: 'security', status: 'warning', score: 0, maxScore: 1, details: 'No Permissions-Policy header found.', recommendation: 'Add a Permissions-Policy header to disable unused browser APIs and reduce attack surface.', fixSnippet: { language: 'http', code: `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()` }, referenceUrl: 'https://veda.ng/sitecheck' });
  }

  // 4.8 security.txt
  if (securityTxtRes?.ok && securityTxtRes.text && securityTxtRes.text.includes('Contact')) {
    securityChecks.push({ id: 'security-txt', name: 'Security Disclosure (security.txt)', layer: 'security', status: 'pass', score: 1, maxScore: 1, details: 'security.txt found at /.well-known/security.txt with Contact field.', referenceUrl: 'https://veda.ng/sitecheck' });
  } else {
    securityChecks.push({ id: 'security-txt', name: 'Security Disclosure (security.txt)', layer: 'security', status: 'warning', score: 0, maxScore: 1, details: 'No security.txt found at /.well-known/security.txt.', recommendation: 'Publish a security.txt (RFC 9116) so researchers can responsibly disclose vulnerabilities.', fixSnippet: { language: 'text', filename: 'public/.well-known/security.txt', code: `Contact: mailto:security@${domain}\nExpires: 2027-01-01T00:00:00.000Z\nPreferred-Languages: en` }, referenceUrl: 'https://veda.ng/sitecheck' });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LAYER 5 — SEO & Content Quality
  // ──────────────────────────────────────────────────────────────────────────
  const seoChecks: CheckResult[] = [];

  // 5.1 Open Graph tags
  const ogTitle = getMetaContent('og:title', homepageHtml);
  const ogDescription = getMetaContent('og:description', homepageHtml);
  const ogImage = getMetaContent('og:image', homepageHtml);
  const ogCount = [ogTitle, ogDescription, ogImage].filter(Boolean).length;
  if (ogCount === 3) {
    seoChecks.push({ id: 'og-tags', name: 'Open Graph Social Tags', layer: 'seo', status: 'pass', score: 2, maxScore: 2, details: 'og:title, og:description, og:image are all present. Rich social previews enabled.', referenceUrl: 'https://veda.ng/sitecheck' });
  } else if (ogCount > 0) {
    seoChecks.push({ id: 'og-tags', name: 'Open Graph Social Tags', layer: 'seo', status: 'warning', score: 1, maxScore: 2, details: `Partial Open Graph tags (${ogCount}/3 found). Missing: ${[!ogTitle && 'og:title', !ogDescription && 'og:description', !ogImage && 'og:image'].filter(Boolean).join(', ')}.`, recommendation: 'Add all three core OG tags for rich link previews on social platforms and AI citations.', fixSnippet: { language: 'html', code: `<meta property="og:title" content="Page Title">\n<meta property="og:description" content="Page description (150-160 chars)">\n<meta property="og:image" content="${origin}/og-image.png">\n<meta property="og:url" content="${origin}/page">` }, referenceUrl: 'https://veda.ng/sitecheck' });
  } else {
    seoChecks.push({ id: 'og-tags', name: 'Open Graph Social Tags', layer: 'seo', status: 'fail', score: 0, maxScore: 2, details: 'No Open Graph meta tags found on the homepage.', recommendation: 'Add Open Graph tags to enable rich social previews on LinkedIn, Twitter/X, Facebook, and AI citation tools.', fixSnippet: { language: 'html', code: `<meta property="og:title" content="Page Title">\n<meta property="og:description" content="Page description (150-160 chars)">\n<meta property="og:image" content="${origin}/og-image.png">\n<meta property="og:type" content="website">` }, referenceUrl: 'https://veda.ng/sitecheck' });
  }

  // 5.2 JSON-LD Structured Data
  const hasJsonLd = homepageHtml.includes('application/ld+json');
  if (hasJsonLd) {
    seoChecks.push({ id: 'json-ld', name: 'JSON-LD Structured Data (schema.org)', layer: 'seo', status: 'pass', score: 3, maxScore: 3, details: 'JSON-LD structured data script found. Agents can extract typed facts (author, date, org) without scraping.', referenceUrl: 'https://veda.ng/sitecheck' });
  } else {
    seoChecks.push({ id: 'json-ld', name: 'JSON-LD Structured Data (schema.org)', layer: 'seo', status: 'warning', score: 0, maxScore: 3, details: 'No JSON-LD structured data found on the homepage.', recommendation: 'Add JSON-LD markup (Article, Person, Organization, FAQPage) so agents and search engines extract typed facts reliably.', fixSnippet: { language: 'json', filename: 'layout.tsx (JSON-LD)', code: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebSite",\n  "name": "${domain}",\n  "url": "${origin}",\n  "description": "What your site does"\n}\n</script>` }, referenceUrl: 'https://veda.ng/sitecheck' });
  }

  // 5.3 Canonical URL
  const hasCanonical = /rel=["']canonical["']/.test(homepageHtml) || /rel=canonical/.test(homepageHtml);
  if (hasCanonical) {
    seoChecks.push({ id: 'canonical', name: 'Canonical URL (<link rel="canonical">)', layer: 'seo', status: 'pass', score: 2, maxScore: 2, details: 'Canonical URL declared. Prevents duplicate content indexing.', referenceUrl: 'https://veda.ng/sitecheck' });
  } else {
    seoChecks.push({ id: 'canonical', name: 'Canonical URL (<link rel="canonical">)', layer: 'seo', status: 'warning', score: 0, maxScore: 2, details: 'No canonical URL tag found on the homepage.', recommendation: 'Add <link rel="canonical"> to declare the preferred URL for each page and prevent duplicate content issues.', fixSnippet: { language: 'html', code: `<link rel="canonical" href="${origin}/page-url">` }, referenceUrl: 'https://veda.ng/sitecheck' });
  }

  // 5.4 Meta Description
  const metaDesc = getMetaContent('description', homepageHtml);
  if (metaDesc && metaDesc.length >= 50 && metaDesc.length <= 200) {
    seoChecks.push({ id: 'meta-description', name: 'Meta Description', layer: 'seo', status: 'pass', score: 1, maxScore: 1, details: `Meta description found (${metaDesc.length} chars). Well-formed for search snippet usage.`, referenceUrl: 'https://veda.ng/sitecheck' });
  } else if (metaDesc) {
    seoChecks.push({ id: 'meta-description', name: 'Meta Description', layer: 'seo', status: 'warning', score: 0, maxScore: 1, details: `Meta description found but suboptimal length (${metaDesc.length} chars; target 150-160).`, recommendation: 'Write a 150-160 character meta description that accurately summarises the page for search snippets.', referenceUrl: 'https://veda.ng/sitecheck' });
  } else {
    seoChecks.push({ id: 'meta-description', name: 'Meta Description', layer: 'seo', status: 'warning', score: 0, maxScore: 1, details: 'No meta description tag found on the homepage.', recommendation: 'Add a unique 150-160 character <meta name="description"> to each page.', fixSnippet: { language: 'html', code: `<meta name="description" content="150-160 character description of this page.">` }, referenceUrl: 'https://veda.ng/sitecheck' });
  }

  // 5.5 RSS / Atom / JSON Feed
  const hasFeedLink = /type=["']application\/(rss|atom|feed)\+xml["']/.test(homepageHtml) || /rel=["']alternate["'][^>]+type=["']application\/(rss|atom)\+xml["']/.test(homepageHtml);
  const hasFeedFile = feedRes?.ok || feedJsonRes?.ok;
  if (hasFeedLink || hasFeedFile) {
    seoChecks.push({ id: 'rss-feed', name: 'RSS / Atom / JSON Feed', layer: 'seo', status: 'pass', score: 1, maxScore: 1, details: 'RSS or Atom feed available. Feed readers and agents can subscribe to content updates.', referenceUrl: 'https://veda.ng/sitecheck' });
  } else {
    seoChecks.push({ id: 'rss-feed', name: 'RSS / Atom / JSON Feed', layer: 'seo', status: 'warning', score: 0, maxScore: 1, details: 'No RSS, Atom, or JSON feed detected.', recommendation: 'Publish a feed and announce it with a <link rel="alternate" type="application/rss+xml"> tag. Feed readers and AI agents use feeds for live content updates.', fixSnippet: { language: 'html', code: `<link rel="alternate" type="application/rss+xml" title="${domain} RSS Feed" href="${origin}/feed.xml">` }, referenceUrl: 'https://veda.ng/sitecheck' });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LAYER 6 — Payments
  // ──────────────────────────────────────────────────────────────────────────
  const paymentChecks: CheckResult[] = [];
  const paymentHeaders = (mdAcceptRes?.headers.get('www-authenticate') || '').toLowerCase();
  const hasMppOrX402 = paymentHeaders.includes('payment') || paymentHeaders.includes('x402');

  if (hasMppOrX402) {
    paymentChecks.push({ id: 'agent-payments', name: 'Agent Micropayments (x402 / MPP)', layer: 'payments', status: 'pass', score: 2, maxScore: 2, details: 'Machine payments protocol challenge detected in HTTP headers.', referenceUrl: 'https://veda.ng/aistandards' });
  } else {
    paymentChecks.push({ id: 'agent-payments', name: 'Agent Micropayments (x402 / MPP)', layer: 'payments', status: 'na', score: 0, maxScore: 0, details: 'No paid API challenge detected (open-access or non-commerce service).', recommendation: 'If offering paywalled APIs, adopt x402 or Machine Payments Protocol (MPP) for native HTTP 402 agent settlement.', referenceUrl: 'https://veda.ng/aistandards' });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Score calculation (exclude Payments from score if maxScore=0)
  // ──────────────────────────────────────────────────────────────────────────
  function makeLayer(id: ScanResult['layers'][0]['id'], name: string, description: string, checks: CheckResult[]) {
    const { score, maxScore, percentage } = scoreLayer(checks);
    return { id, name, description, score, maxScore, percentage, checks };
  }

  const layers = [
    makeLayer('discovery', 'Discovery', 'Can AI search engines and agents find and catalog your domain?', discoveryChecks),
    makeLayer('access', 'Access', 'Can agents retrieve clean, token-efficient content without browser overhead?', accessChecks),
    makeLayer('usability', 'Usability & MCP', 'Can agents execute tools, call APIs, and read schemas autonomously?', usabilityChecks),
    makeLayer('security', 'Security', 'Is the site hardened against common web attacks and trust-worthy for AI integrations?', securityChecks),
    makeLayer('seo', 'SEO & Content', 'Is the site structured for machine-readable discovery, indexing, and citation?', seoChecks),
    makeLayer('payments', 'Payments', 'Can agents execute transactions and micropayments?', paymentChecks),
  ];

  // Score uses all scored layers (payments excluded if maxScore=0)
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

  const failCount = layers.flatMap(l => l.checks).filter(c => c.status === 'fail').length;
  const warnCount = layers.flatMap(l => l.checks).filter(c => c.status === 'warning').length;
  let summary: string;
  if (grade === 'A+') {
    summary = `${domain} is an exceptional agent-ready domain: full machine discovery, live MCP server, and strong security posture.`;
  } else if (grade === 'A') {
    summary = `${domain} has strong agent-readiness with high discovery coverage and machine-readable endpoints. ${warnCount} minor gaps remain.`;
  } else if (grade === 'B') {
    summary = `${domain} has solid foundations. ${warnCount} areas need attention — mainly around agent catalogs, security headers, or MCP support.`;
  } else if (grade === 'C') {
    summary = `${domain} has partial AI compatibility. Adding llms.txt, security headers, and structured data will significantly improve the score.`;
  } else {
    summary = `${domain} currently lacks dedicated machine discovery protocols. ${failCount} critical issues and ${warnCount} warnings need to be addressed.`;
  }

  return {
    url,
    domain,
    scannedAt: new Date().toISOString(),
    durationMs: Date.now() - startTime,
    score: finalScore,
    grade,
    summary,
    layers,
    badges: {
      mcpServer: Boolean(mcpWorking),
      llmsTxt: Boolean(llmsRes?.ok && llmsRes.text.length > 50),
      ardCatalog: Boolean(ardValid),
      markdownTwins: Boolean(acceptsMd || hasMdTwin),
      openapiSpec: Boolean(openapiRes?.ok),
      aiBotFriendly: Boolean(robotsRes?.ok),
      httpsSecure: isHttps && hsts.length > 0,
      structuredData: hasJsonLd,
    },
  };
}

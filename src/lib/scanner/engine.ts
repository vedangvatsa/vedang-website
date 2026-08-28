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
    robotsRes, llmsRes, llmsFullRes, llmsSmallRes,
    ardRes, aiCatalogRes, apiCatalogRes, pluginRes, sitemapRes,
    mdAcceptRes, mdTwinRes, botUaRes, perplexityUaRes,
    mcpWellKnownRes, mcpApiRes, openapiRes, openapiWellKnownRes, authRes,
    oauthAuthServerRes, oauthProtectedRes, httpSignaturesRes,
    agentsTxtRes, agentsJsonRes, agentCardRes,
    securityTxtRes, tdmrepRes, feedRes, feedJsonRes,
    homepageRes, apiRootRes,
    aiPluginRes, sitemapJsonRes, termsRes, faviconRes,
  ] = await Promise.all([
    safeFetch(`${origin}/robots.txt`),
    safeFetch(`${origin}/llms.txt`),
    safeFetch(`${origin}/llms-full.txt`),
    safeFetch(`${origin}/llms-small.txt`),
    safeFetch(`${origin}/.well-known/ard.json`),
    safeFetch(`${origin}/.well-known/ai-catalog.json`),
    safeFetch(`${origin}/.well-known/api-catalog`),
    safeFetch(`${origin}/plugin.json`),
    safeFetch(`${origin}/sitemap.xml`),
    safeFetch(`${origin}/`, { headers: { Accept: 'text/markdown, text/plain;q=0.9' } }),
    safeFetch(`${origin}/index.md`),
    safeFetch(`${origin}/`, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GPTBot/1.0; +https://openai.com/gptbot)' } }),
    safeFetch(`${origin}/`, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)' } }),
    safeFetch(`${origin}/.well-known/mcp`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 'probe-1', method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'veda-scanner', version: '1.0' } } }),
    }),
    safeFetch(`${origin}/api/mcp`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 'probe-2', method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'veda-scanner', version: '1.0' } } }),
    }),
    safeFetch(`${origin}/openapi.json`),
    safeFetch(`${origin}/.well-known/openapi.json`),
    safeFetch(`${origin}/auth.md`),
    safeFetch(`${origin}/.well-known/oauth-authorization-server`),
    safeFetch(`${origin}/.well-known/oauth-protected-resource`),
    safeFetch(`${origin}/.well-known/http-message-signatures-directory`),
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
    safeFetch(`${origin}/favicon.ico`),
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
  const xRobotsTag = secHeaders?.get('x-robots-tag') || '';

  function getMetaContent(name: string, html: string): string {
    const m = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'))
           || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`, 'i'));
    return m ? m[1] : '';
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LAYER 1 — Discovery (13 checks)
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
      status: hasStructure ? 'pass' : 'warning',
      score: hasStructure ? 3 : 2, maxScore: 3, impact: 'critical',
      details: hasStructure
        ? `Valid llms.txt found (${(llmsRes.text.length / 1024).toFixed(1)} KB) with structured markdown links.`
        : 'llms.txt exists but lacks standard markdown structure (# title and [link](url) syntax).',
      why: 'llms.txt is the emerging standard (llmstxt.org) for feeding clean, condensed context to LLMs, IDE agents (Cursor, Windsurf), and autonomous models without HTML boilerplate.',
      referenceUrl: 'https://llmstxt.org',
    });
  } else {
    discoveryChecks.push({
      id: 'llms-txt', name: 'LLM Index (llms.txt)', layer: 'discovery',
      status: 'fail', score: 0, maxScore: 3, impact: 'critical',
      details: 'No /llms.txt found at domain root (returned 404).',
      why: 'When AI agents research your site, an llms.txt file gives them a structured index of your core pages, dramatically improving the accuracy of agent-generated responses.',
      recommendation: 'Create a plain-markdown /llms.txt index with links to your documentation and key resources.',
      fixSnippet: { language: 'markdown', filename: 'public/llms.txt', code: `# ${domain}\n\n> Concise summary of what ${domain} does and who it is for.\n\n## Core Resources\n- [Documentation](${origin}/docs): Complete guides and API reference.\n- [About](${origin}/about): Overview and architecture.\n- [Pricing](${origin}/pricing): Access tiers and pricing models.` },
      referenceUrl: 'https://llmstxt.org',
    });
  }

  // 1.3 llms-full.txt or llms-small.txt
  if (llmsFullRes?.ok && llmsFullRes.text && llmsFullRes.text.length > 100) {
    discoveryChecks.push({
      id: 'llms-full', name: 'Full LLM Digest (llms-full.txt)', layer: 'discovery',
      status: 'pass', score: 2, maxScore: 2, impact: 'recommended',
      details: `Full-text llms-full.txt detected (${(llmsFullRes.text.length / 1024).toFixed(1)} KB) for comprehensive context windows.`,
      why: 'llms-full.txt concatenates all essential documentation into a single file, allowing AI agents to ingest your entire site in one single prompt without crawling hundreds of individual URLs.',
      referenceUrl: 'https://llmstxt.org',
    });
  } else if (llmsSmallRes?.ok && llmsSmallRes.text) {
    discoveryChecks.push({
      id: 'llms-full', name: 'Full LLM Digest (llms-full.txt / llms-small.txt)', layer: 'discovery',
      status: 'pass', score: 2, maxScore: 2, impact: 'recommended',
      details: `Token-optimized llms-small.txt detected (${(llmsSmallRes.text.length / 1024).toFixed(1)} KB).`,
      why: 'Provides lightweight documentation for context-constrained LLM agents.',
      referenceUrl: 'https://llmstxt.org',
    });
  } else {
    discoveryChecks.push({
      id: 'llms-full', name: 'Full LLM Digest (llms-full.txt)', layer: 'discovery',
      status: 'warning', score: 0, maxScore: 2, impact: 'recommended',
      details: 'No llms-full.txt found at /llms-full.txt.',
      why: 'Large context models (Gemini 1.5, Claude 3.5, GPT-4o) prefer reading one comprehensive file instead of orchestrating multi-hop web requests.',
      recommendation: 'Generate an llms-full.txt aggregating your main Markdown documentation into a single file.',
      fixSnippet: { language: 'bash', filename: 'scripts/generate-llms-full.sh', code: `# Generate llms-full.txt by concatenating your markdown docs\ncat docs/*.md > public/llms-full.txt` },
      referenceUrl: 'https://llmstxt.org',
    });
  }

  // 1.4 ARD Catalog (Agent Readiness Directory)
  if (ardRes?.ok && ardRes.text) {
    let isValidJson = false;
    try { JSON.parse(ardRes.text); isValidJson = true; } catch { /* ignore */ }
    discoveryChecks.push({
      id: 'ard-catalog', name: 'Agent Readiness Directory (ard.json)', layer: 'discovery',
      status: isValidJson ? 'pass' : 'warning',
      score: isValidJson ? 2 : 1, maxScore: 2, impact: 'recommended',
      details: isValidJson ? 'Valid ARD catalog found at /.well-known/ard.json.' : 'ard.json exists but contains invalid JSON.',
      why: 'The ARD specification provides a machine-readable directory of agent interfaces, MCP endpoints, and OpenAPI schemas at a standardized .well-known location.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    discoveryChecks.push({
      id: 'ard-catalog', name: 'Agent Readiness Directory (ard.json)', layer: 'discovery',
      status: 'fail', score: 0, maxScore: 2, impact: 'recommended',
      details: 'No ARD catalog found at /.well-known/ard.json.',
      why: 'Autonomous agents check /.well-known/ard.json to discover MCP endpoints, OpenAPI specs, and authentication requirements in one standardized call.',
      recommendation: 'Publish an ard.json catalog at /.well-known/ard.json describing your machine interfaces.',
      fixSnippet: { language: 'json', filename: 'public/.well-known/ard.json', code: `{\n  "version": "0.91",\n  "name": "${domain}",\n  "description": "Agent interface directory for ${domain}",\n  "mcp": { "endpoint": "${origin}/.well-known/mcp", "transport": "streamable-http" },\n  "openapi": "${origin}/openapi.json",\n  "llmstxt": "${origin}/llms.txt"\n}` },
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 1.5 AI Service Catalog
  if (aiCatalogRes?.ok) {
    discoveryChecks.push({
      id: 'ai-catalog', name: 'AI Service Catalog (ai-catalog.json)', layer: 'discovery',
      status: 'pass', score: 1, maxScore: 1, impact: 'optional',
      details: 'AI catalog found at /.well-known/ai-catalog.json.',
      why: 'Discloses available AI services, models, and integrations to discovery engines.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    discoveryChecks.push({
      id: 'ai-catalog', name: 'AI Service Catalog (ai-catalog.json)', layer: 'discovery',
      status: 'warning', score: 0, maxScore: 1, impact: 'optional',
      details: 'No AI catalog found at /.well-known/ai-catalog.json.',
      why: 'An AI catalog helps aggregators index the machine interfaces and models your platform supports.',
      recommendation: 'Add /.well-known/ai-catalog.json if your site exposes AI tools or APIs.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 1.6 RFC 9727 API Catalog
  if (apiCatalogRes?.ok && apiCatalogRes.text) {
    discoveryChecks.push({
      id: 'api-catalog-rfc9727', name: 'IETF API Catalog (RFC 9727)', layer: 'discovery',
      status: 'pass', score: 2, maxScore: 2, impact: 'recommended',
      details: 'RFC 9727 API Catalog found at /.well-known/api-catalog.',
      why: 'IETF RFC 9727 standardizes how APIs, OpenAPI definitions, and documentation are discovered by automated machines and agents.',
      referenceUrl: 'https://datatracker.ietf.org/doc/rfc9727/',
    });
  } else {
    discoveryChecks.push({
      id: 'api-catalog-rfc9727', name: 'IETF API Catalog (RFC 9727)', layer: 'discovery',
      status: 'warning', score: 0, maxScore: 2, impact: 'recommended',
      details: 'No RFC 9727 API Catalog found at /.well-known/api-catalog.',
      why: 'The RFC 9727 standard enables standard machine discovery of APIs, eliminating guesswork for autonomous AI agents.',
      recommendation: 'Add /.well-known/api-catalog pointing to your OpenAPI specification.',
      fixSnippet: { language: 'json', filename: 'public/.well-known/api-catalog', code: `{\n  "link-template": [\n    {\n      "href": "${origin}/openapi.json",\n      "rel": "service-desc",\n      "type": "application/json"\n    }\n  ]\n}` },
      referenceUrl: 'https://datatracker.ietf.org/doc/rfc9727/',
    });
  }

  // 1.7 XML Sitemap
  if (sitemapRes?.ok && sitemapRes.text && sitemapRes.text.includes('<urlset') || sitemapRes?.text.includes('<sitemapindex')) {
    const isLinkedFromRobots = Boolean(robotsRes?.text && /Sitemap:\s*https?:\/\//i.test(robotsRes.text));
    discoveryChecks.push({
      id: 'sitemap-xml', name: 'XML Sitemap (sitemap.xml)', layer: 'discovery',
      status: isLinkedFromRobots ? 'pass' : 'warning',
      score: isLinkedFromRobots ? 2 : 1, maxScore: 2, impact: 'critical',
      details: isLinkedFromRobots
        ? 'Valid sitemap.xml found and referenced in robots.txt.'
        : 'sitemap.xml found, but not referenced in robots.txt.',
      why: 'Search bots and AI indexers use sitemaps to discover all canonical URLs on your domain without needing to brute-force crawl every internal link.',
      recommendation: isLinkedFromRobots ? undefined : 'Add a Sitemap directive to your robots.txt file so crawlers can discover it automatically.',
      fixSnippet: isLinkedFromRobots ? undefined : { language: 'robots.txt', filename: 'public/robots.txt', code: `Sitemap: ${origin}/sitemap.xml` },
      referenceUrl: 'https://sitemaps.org',
    });
  } else {
    discoveryChecks.push({
      id: 'sitemap-xml', name: 'XML Sitemap (sitemap.xml)', layer: 'discovery',
      status: 'fail', score: 0, maxScore: 2, impact: 'critical',
      details: 'No valid XML sitemap found at /sitemap.xml.',
      why: 'Without a sitemap, new pages may take weeks to be discovered by AI search bots (Perplexity, SearchGPT, Google).',
      recommendation: 'Generate and serve a standard sitemap.xml and reference it in your robots.txt.',
      fixSnippet: { language: 'xml', filename: 'public/sitemap.xml', code: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${origin}</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>` },
      referenceUrl: 'https://sitemaps.org',
    });
  }

  // 1.8 agents.txt
  if (agentsTxtRes?.ok && agentsTxtRes.text && agentsTxtRes.text.length > 20) {
    discoveryChecks.push({
      id: 'agents-txt', name: 'Agent Permissions (agents.txt)', layer: 'discovery',
      status: 'pass', score: 1, maxScore: 1, impact: 'recommended',
      details: 'agents.txt found at domain root specifying machine interaction boundaries.',
      why: 'agents.txt lets you declare what autonomous agents are permitted to do on your site (e.g. read-only, transactions permitted, tool usage boundaries).',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    discoveryChecks.push({
      id: 'agents-txt', name: 'Agent Permissions (agents.txt)', layer: 'discovery',
      status: 'warning', score: 0, maxScore: 1, impact: 'recommended',
      details: 'No /agents.txt file found.',
      why: 'Declares operational permissions and boundaries specifically for autonomous agents.',
      recommendation: 'Create an /agents.txt file defining agent permissions.',
      fixSnippet: { language: 'text', filename: 'public/agents.txt', code: `User-agent: *\nAllow-action: read\nAllow-action: search\nDisallow-action: write\nContact: ${origin}/contact` },
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 1.9 agents.json
  if (agentsJsonRes?.ok) {
    discoveryChecks.push({
      id: 'agents-json', name: 'Agent Manifest (.well-known/agents.json)', layer: 'discovery',
      status: 'pass', score: 1, maxScore: 1, impact: 'optional',
      details: 'agents.json found at /.well-known/agents.json.',
      why: 'Provides a structured machine-readable manifest of available agents and tools.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    discoveryChecks.push({
      id: 'agents-json', name: 'Agent Manifest (.well-known/agents.json)', layer: 'discovery',
      status: 'warning', score: 0, maxScore: 1, impact: 'optional',
      details: 'No /.well-known/agents.json found.',
      why: 'Structured agent manifests allow automated agent registries to index your capabilities.',
      recommendation: 'Add /.well-known/agents.json if your site exposes autonomous agents.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 1.10 agent-card.json (A2A Protocol)
  if (agentCardRes?.ok) {
    discoveryChecks.push({
      id: 'agent-card', name: 'A2A Agent Card (.well-known/agent-card.json)', layer: 'discovery',
      status: 'pass', score: 1, maxScore: 1, impact: 'optional',
      details: 'A2A Agent Card found at /.well-known/agent-card.json.',
      why: 'The Agent-to-Agent (A2A) protocol uses agent cards for agent identity and capability negotiation.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    discoveryChecks.push({
      id: 'agent-card', name: 'A2A Agent Card (.well-known/agent-card.json)', layer: 'discovery',
      status: 'warning', score: 0, maxScore: 1, impact: 'optional',
      details: 'No /.well-known/agent-card.json found.',
      why: 'Enables autonomous agent-to-agent capability discovery.',
      recommendation: 'Add /.well-known/agent-card.json if your platform supports A2A interactions.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 1.11 Selective AI Crawler Rules
  if (robotsRes?.ok && robotsRes.text) {
    const txt = robotsRes.text;
    const hasSearchBots = /GPTBot|ClaudeBot|PerplexityBot|OAI-SearchBot/i.test(txt);
    const hasScraperDistinction = /CCBot|ByteSpider|cohere-ai|Diffbot/i.test(txt);
    if (hasSearchBots && hasScraperDistinction) {
      discoveryChecks.push({
        id: 'robots-selective-ai-policy', name: 'Selective AI Crawler Policy', layer: 'discovery',
        status: 'pass', score: 2, maxScore: 2, impact: 'important',
        details: 'robots.txt clearly distinguishes search bots from mass dataset training scrapers.',
        why: 'Allows your content to be cited in real-time AI search answers (ChatGPT, Perplexity) while protecting against unpaid bulk training scrapers.',
        referenceUrl: 'https://veda.ng/aistandards',
      });
    } else {
      discoveryChecks.push({
        id: 'robots-selective-ai-policy', name: 'Selective AI Crawler Policy', layer: 'discovery',
        status: 'warning', score: 1, maxScore: 2, impact: 'important',
        details: 'robots.txt does not distinguish between search answer bots and training dataset scrapers.',
        why: 'Without granular rules, blanket blocks unintentionally remove you from AI citations.',
        recommendation: 'Allow OAI-SearchBot and PerplexityBot while disallowing CCBot and ByteSpider.',
        fixSnippet: { language: 'robots.txt', filename: 'public/robots.txt', code: `# Allow real-time search & citation bots\nUser-agent: OAI-SearchBot\nUser-agent: PerplexityBot\nAllow: /\n\n# Disallow mass training scrapers\nUser-agent: CCBot\nUser-agent: ByteSpider\nDisallow: /` },
        referenceUrl: 'https://veda.ng/aistandards',
      });
    }
  } else {
    discoveryChecks.push({
      id: 'robots-selective-ai-policy', name: 'Selective AI Crawler Policy', layer: 'discovery',
      status: 'fail', score: 0, maxScore: 2, impact: 'important',
      details: 'No robots.txt available to evaluate selective crawler policies.',
      why: 'Granular crawler rules ensure maximum visibility in AI search.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 1.12 OpenAI / Anthropic Plugin Manifest
  if (aiPluginRes?.ok || pluginRes?.ok) {
    discoveryChecks.push({
      id: 'openai-plugin', name: 'OpenAI Plugin Manifest (ai-plugin.json)', layer: 'discovery',
      status: 'pass', score: 1, maxScore: 1, impact: 'optional',
      details: 'AI plugin manifest detected at standard location.',
      why: 'Standardizes tool schemas for ChatGPT and assistant extensions.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    discoveryChecks.push({
      id: 'openai-plugin', name: 'OpenAI Plugin Manifest (ai-plugin.json)', layer: 'discovery',
      status: 'warning', score: 0, maxScore: 1, impact: 'optional',
      details: 'No plugin manifest found at /.well-known/ai-plugin.json.',
      why: 'Enables ChatGPT and other assistant platforms to discover APIs as interactive plugins.',
      recommendation: 'Provide an ai-plugin.json manifest if exposing assistant tools.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 1.13 Machine JSON Sitemap
  if (sitemapJsonRes?.ok && sitemapJsonRes.text && sitemapJsonRes.text.includes('{')) {
    discoveryChecks.push({
      id: 'sitemap-json', name: 'JSON Sitemap (.well-known/sitemap.json)', layer: 'discovery',
      status: 'pass', score: 1, maxScore: 1, impact: 'optional',
      details: 'Machine-optimized JSON sitemap detected.',
      why: 'JSON sitemaps are faster for LLMs to parse than XML representations.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    discoveryChecks.push({
      id: 'sitemap-json', name: 'JSON Sitemap (.well-known/sitemap.json)', layer: 'discovery',
      status: 'warning', score: 0, maxScore: 1, impact: 'optional',
      details: 'No machine-readable JSON sitemap found at /.well-known/sitemap.json.',
      why: 'JSON sitemaps reduce parsing tokens for autonomous agents.',
      recommendation: 'Generate a lightweight JSON sitemap alongside your XML sitemap.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LAYER 2 — Access & Bot Ingestion (9 checks)
  // ──────────────────────────────────────────────────────────────────────────
  const accessChecks: CheckResult[] = [];

  // 2.1 Markdown Content Negotiation
  const isMdContentType = (mdAcceptRes?.headers.get('content-type') || '').includes('text/markdown');
  const hasMdResponse = mdAcceptRes?.ok && (isMdContentType || (mdAcceptRes?.text && /^---\s*[\r\n]|^#\s+/m.test(mdAcceptRes.text)));
  if (hasMdResponse) {
    accessChecks.push({
      id: 'markdown-negotiation', name: 'Markdown Content Negotiation (Accept: text/markdown)', layer: 'access',
      status: 'pass', score: 3, maxScore: 3, impact: 'critical',
      details: 'Server respects Accept: text/markdown and returns clean markdown.',
      why: 'Serving Markdown to LLMs saves 70–90% of token context, eliminates HTML parsing hallucinations, and guarantees clean citation extraction.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    accessChecks.push({
      id: 'markdown-negotiation', name: 'Markdown Content Negotiation (Accept: text/markdown)', layer: 'access',
      status: 'fail', score: 0, maxScore: 3, impact: 'critical',
      details: 'Server returned HTML instead of Markdown when requested with Accept: text/markdown.',
      why: 'AI agents (like Cloudflare\'s Markdown for Agents, LangChain, and Claude) request text/markdown to avoid noisy HTML tags, scripts, and layout elements.',
      recommendation: 'Implement middleware to detect Accept: text/markdown and serve a clean Markdown representation of your content.',
      fixSnippet: { language: 'typescript', filename: 'middleware.ts', code: `export function middleware(req: Request) {\n  const accept = req.headers.get('accept') || '';\n  if (accept.includes('text/markdown')) {\n    // rewrite or return markdown twin\n    return NextResponse.rewrite(new URL('/md' + new URL(req.url).pathname, req.url));\n  }\n}` },
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 2.2 Markdown URL Twins
  if (mdTwinRes?.ok && mdTwinRes.text && mdTwinRes.text.length > 50) {
    accessChecks.push({
      id: 'markdown-twins', name: 'Markdown URL Twins (/index.md)', layer: 'access',
      status: 'pass', score: 2, maxScore: 2, impact: 'important',
      details: 'Direct markdown URL twins detected (e.g. /index.md).',
      why: 'Provides static, deterministic URLs that AI agents can directly fetch and cache.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    accessChecks.push({
      id: 'markdown-twins', name: 'Markdown URL Twins (/index.md)', layer: 'access',
      status: 'warning', score: 0, maxScore: 2, impact: 'important',
      details: 'No direct .md URL twin served at /index.md.',
      why: 'Many LLM developer tools look for direct .md mirrors of documentation pages.',
      recommendation: 'Serve direct .md file mirrors alongside your HTML pages.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 2.3 Bot User-Agent Reachability
  const botUaOk = botUaRes?.ok && botUaRes.status === 200;
  const perplexityOk = perplexityUaRes?.ok && perplexityUaRes.status === 200;
  if (botUaOk && perplexityOk) {
    accessChecks.push({
      id: 'bot-ua-access', name: 'AI Agent User-Agent Reachability', layer: 'access',
      status: 'pass', score: 3, maxScore: 3, impact: 'critical',
      details: 'Server responded 200 OK to GPTBot and PerplexityBot User-Agents without WAF challenges.',
      why: 'Cloudflare and other WAFs often inadvertently block AI User-Agents with 403 Forbidden or JS CAPTCHAs, preventing real-time citations.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else if (botUaOk || perplexityOk) {
    accessChecks.push({
      id: 'bot-ua-access', name: 'AI Agent User-Agent Reachability', layer: 'access',
      status: 'warning', score: 1, maxScore: 3, impact: 'critical',
      details: 'Partial reachability: one or more AI User-Agents were blocked or challenged.',
      why: 'Inconsistent WAF rules can prevent specific answer engines from indexing your site.',
      recommendation: 'Check your WAF rules and allow verified AI bot User-Agents.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    accessChecks.push({
      id: 'bot-ua-access', name: 'AI Agent User-Agent Reachability', layer: 'access',
      status: 'fail', score: 0, maxScore: 3, impact: 'critical',
      details: `Server returned ${botUaRes?.status || 'error'} when accessed with AI bot User-Agents.`,
      why: 'A WAF or security rule is blocking legitimate AI crawlers from accessing your content.',
      recommendation: 'Whitelist GPTBot, ClaudeBot, and PerplexityBot in your CDN/WAF security settings.',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 2.4 Robots Meta & X-Robots-Tag AI Directives
  const metaRobots = getMetaContent('robots', homepageHtml).toLowerCase();
  const metaGooglebot = getMetaContent('googlebot', homepageHtml).toLowerCase();
  const fullRobotsDirectives = `${xRobotsTag} ${metaRobots} ${metaGooglebot}`;
  const isNoIndex = /noindex/i.test(fullRobotsDirectives);
  const isNoSnippet = /nosnippet/i.test(fullRobotsDirectives);
  const hasMaxSnippet = /max-snippet:-1|max-snippet:[1-9]\d{2,}/i.test(fullRobotsDirectives);
  const hasMaxImage = /max-image-preview:large/i.test(fullRobotsDirectives);

  if (!isNoIndex && !isNoSnippet && (hasMaxSnippet || hasMaxImage)) {
    accessChecks.push({
      id: 'robots-meta-ai', name: 'Robots Meta AI Citation Directives', layer: 'access',
      status: 'pass', score: 2, maxScore: 2, impact: 'critical',
      details: 'Robots meta directives include max-snippet and max-image-preview:large for rich AI citations.',
      why: 'Search engines and AI answer engines require max-snippet:-1 and max-image-preview:large to quote full answers and display rich visual preview cards.',
      referenceUrl: 'https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag',
    });
  } else if (!isNoIndex && !isNoSnippet) {
    accessChecks.push({
      id: 'robots-meta-ai', name: 'Robots Meta AI Citation Directives', layer: 'access',
      status: 'pass', score: 1, maxScore: 2, impact: 'important',
      details: 'Content is indexable, but explicit max-snippet:-1 and max-image-preview:large are missing.',
      why: 'Adding max-snippet:-1 gives explicit permission to AI search engines to quote full paragraphs.',
      recommendation: 'Add max-snippet:-1 and max-image-preview:large to your robots meta tag.',
      fixSnippet: { language: 'html', filename: 'index.html', code: `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">` },
      referenceUrl: 'https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag',
    });
  } else {
    accessChecks.push({
      id: 'robots-meta-ai', name: 'Robots Meta AI Citation Directives', layer: 'access',
      status: 'fail', score: 0, maxScore: 2, impact: 'critical',
      details: `Restricted robots directive detected: ${fullRobotsDirectives.trim()}`,
      why: 'noindex or nosnippet directives completely block AI search engines from summarizing or citing your site.',
      recommendation: 'Remove noindex/nosnippet from your public production pages.',
      referenceUrl: 'https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag',
    });
  }

  // 2.5 Link Discovery Headers
  const linkHeader = secHeaders?.get('link') || '';
  if (linkHeader.includes('rel="describedby"') || linkHeader.includes('rel="service-desc"') || linkHeader.includes('rel="alternate"')) {
    accessChecks.push({
      id: 'link-headers', name: 'HTTP Link Discovery Headers (RFC 8288)', layer: 'access',
      status: 'pass', score: 2, maxScore: 2, impact: 'recommended',
      details: 'HTTP Link headers found pointing to machine descriptions or OpenAPI specs.',
      why: 'RFC 8288 Link headers allow AI agents to discover OpenAPI specs and schemas from any HTTP response.',
      referenceUrl: 'https://datatracker.ietf.org/doc/html/rfc8288',
    });
  } else {
    accessChecks.push({
      id: 'link-headers', name: 'HTTP Link Discovery Headers (RFC 8288)', layer: 'access',
      status: 'warning', score: 0, maxScore: 2, impact: 'recommended',
      details: 'No machine-readable Link headers found in HTTP response.',
      why: 'Link headers allow agents to find your OpenAPI spec or MCP endpoint on every single page request.',
      recommendation: 'Add a Link header pointing to your OpenAPI spec or ard.json.',
      fixSnippet: { language: 'http', filename: 'HTTP Header', code: `Link: <${origin}/openapi.json>; rel="service-desc", <${origin}/llms.txt>; rel="alternate"; type="text/markdown"` },
      referenceUrl: 'https://datatracker.ietf.org/doc/html/rfc8288',
    });
  }

  // 2.6 RFC Rate-Limit Headers
  const hasRateLimit = Boolean(
    secHeaders?.get('ratelimit-limit') ||
    secHeaders?.get('x-ratelimit-limit') ||
    secHeaders?.get('ratelimit-remaining') ||
    secHeaders?.get('retry-after')
  );
  if (hasRateLimit) {
    accessChecks.push({
      id: 'rate-limit-headers', name: 'RFC Rate-Limit Headers', layer: 'access',
      status: 'pass', score: 2, maxScore: 2, impact: 'important',
      details: 'Rate-limit headers detected (RateLimit-Limit, Remaining, or Retry-After).',
      why: 'Rate-limit headers allow autonomous agents to dynamically pace requests and avoid triggering hard HTTP 429 lockouts.',
      referenceUrl: 'https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers',
    });
  } else {
    accessChecks.push({
      id: 'rate-limit-headers', name: 'RFC Rate-Limit Headers', layer: 'access',
      status: 'warning', score: 0, maxScore: 2, impact: 'important',
      details: 'No standard RateLimit-* or Retry-After headers detected.',
      why: 'Without rate-limit headers, agents cannot estimate request budgets and may trigger automated bans.',
      recommendation: 'Include standard RFC RateLimit headers in your HTTP responses.',
      fixSnippet: { language: 'http', filename: 'HTTP Header', code: `RateLimit-Limit: 60\nRateLimit-Remaining: 59\nRateLimit-Reset: 60` },
      referenceUrl: 'https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers',
    });
  }

  // 2.7 Static Content / SSR Fallback (No-JS)
  const textContentLength = homepageHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                                       .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                                       .replace(/<[^>]+>/g, ' ')
                                       .replace(/\s+/g, ' ').trim().length;
  if (textContentLength > 300) {
    accessChecks.push({
      id: 'access-js-hydration', name: 'SSR Content (No-JS Readiness)', layer: 'access',
      status: 'pass', score: 2, maxScore: 2, impact: 'critical',
      details: `Rich static content found in initial HTML (${textContentLength} text characters).`,
      why: 'Most AI search crawlers do not execute JavaScript. If your content requires client-side React/Vue hydration to render, AI bots will index an empty page.',
      referenceUrl: 'https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics',
    });
  } else {
    accessChecks.push({
      id: 'access-js-hydration', name: 'SSR Content (No-JS Readiness)', layer: 'access',
      status: 'fail', score: 0, maxScore: 2, impact: 'critical',
      details: 'Initial HTML contains very little static text (<300 characters) — likely requires client-side JS.',
      why: 'AI crawlers and agents do not execute JavaScript. Client-only Single Page Apps (SPAs) appear completely blank to LLM search engines.',
      recommendation: 'Enable Server-Side Rendering (SSR) or Static Site Generation (SSG) so your content is present in the initial HTML response.',
      referenceUrl: 'https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics',
    });
  }

  // 2.8 Payload Compression
  const encoding = (secHeaders?.get('content-encoding') || '').toLowerCase();
  const hasModernCompression = encoding.includes('br') || encoding.includes('zstd') || encoding.includes('gzip');
  accessChecks.push({
    id: 'access-compression', name: 'Payload Compression (Brotli/Zstandard/Gzip)', layer: 'access',
    status: hasModernCompression ? 'pass' : 'warning',
    score: hasModernCompression ? 1 : 0, maxScore: 1, impact: 'recommended',
    details: hasModernCompression
      ? `Payload compression active (${encoding || 'compressed'}).`
      : 'No standard compression header (br/gzip) returned in response.',
    why: 'Compressed payloads transfer faster, reducing network latency and latency-induced timeouts during agent tool calls.',
  });

  // 2.9 Text-to-HTML Content Density
  const rawHtmlLength = homepageHtml.length || 1;
  const ratio = Math.round((textContentLength / rawHtmlLength) * 100);
  accessChecks.push({
    id: 'access-boilerplate-ratio', name: 'Text-to-HTML Ratio', layer: 'access',
    status: ratio >= 10 ? 'pass' : 'warning',
    score: ratio >= 10 ? 1 : 0, maxScore: 1, impact: 'recommended',
    details: `Content density ratio: ${ratio}% text (${textContentLength} chars text / ${rawHtmlLength} chars HTML).`,
    why: 'Higher content density means AI agents spend fewer tokens on boilerplate and more on your actual content.',
  });

  // ──────────────────────────────────────────────────────────────────────────
  // LAYER 3 — Usability & Agent Interfaces (10 checks)
  // ──────────────────────────────────────────────────────────────────────────
  const usabilityChecks: CheckResult[] = [];

  // 3.1 Model Context Protocol (MCP) Server
  const mcpOk = Boolean(
    (mcpWellKnownRes?.ok && mcpWellKnownRes.text.includes('jsonrpc')) ||
    (mcpApiRes?.ok && mcpApiRes.text.includes('jsonrpc'))
  );
  if (mcpOk) {
    usabilityChecks.push({
      id: 'mcp-server-live', name: 'Model Context Protocol (MCP) Server', layer: 'usability',
      status: 'pass', score: 4, maxScore: 4, impact: 'critical',
      details: 'Live MCP Streamable HTTP server detected with valid JSON-RPC 2.0 initialize handshake.',
      why: 'MCP (Model Context Protocol) is the open standard backed by Anthropic and the AI ecosystem that allows Claude, Cursor, and autonomous agents to connect directly to your tools and data sources.',
      referenceUrl: 'https://spec.modelcontextprotocol.io',
    });
  } else {
    usabilityChecks.push({
      id: 'mcp-server-live', name: 'Model Context Protocol (MCP) Server', layer: 'usability',
      status: 'warning', score: 0, maxScore: 4, impact: 'critical',
      details: 'No live MCP server found at /.well-known/mcp or /api/mcp.',
      why: 'An MCP server allows AI agents (Claude, Cursor, Antigravity) to directly execute tools, query your databases, and read your resources through an open protocol.',
      recommendation: 'Deploy an MCP Streamable HTTP endpoint at /.well-known/mcp.',
      referenceUrl: 'https://spec.modelcontextprotocol.io',
    });
  }

  // 3.2 MCP Schema Handshake Validation
  if (mcpOk) {
    const rawMcpText = mcpWellKnownRes?.text || mcpApiRes?.text || '';
    let parsedMcp: { result?: { protocolVersion?: string; capabilities?: Record<string, unknown> } } = {};
    try { parsedMcp = JSON.parse(rawMcpText); } catch { /* ignore */ }
    const hasCapabilities = Boolean(parsedMcp?.result?.capabilities);
    usabilityChecks.push({
      id: 'mcp-schema-handshake', name: 'MCP Schema Handshake Validation', layer: 'usability',
      status: hasCapabilities ? 'pass' : 'warning',
      score: hasCapabilities ? 2 : 1, maxScore: 2, impact: 'important',
      details: hasCapabilities
        ? `MCP initialized successfully with protocol version: ${parsedMcp.result?.protocolVersion || '2024-11-05'}.`
        : 'MCP responded to JSON-RPC probe but omitted standard capabilities dictionary.',
      why: 'Valid schema handshake ensures AI clients (Claude Desktop, Cursor) can negotiate supported tools and resources.',
      referenceUrl: 'https://spec.modelcontextprotocol.io',
    });
  } else {
    usabilityChecks.push({
      id: 'mcp-schema-handshake', name: 'MCP Schema Handshake Validation', layer: 'usability',
      status: 'na', score: 0, maxScore: 2, impact: 'important',
      details: 'Skipped: No active MCP server endpoint detected.',
      why: 'Evaluates MCP server capability negotiation.',
      referenceUrl: 'https://spec.modelcontextprotocol.io',
    });
  }

  // 3.3 OpenAPI Specification
  const activeOpenApiRes = (openapiRes?.ok && openapiRes.text.length > 50) ? openapiRes :
                           (openapiWellKnownRes?.ok && openapiWellKnownRes.text.length > 50) ? openapiWellKnownRes : null;
  if (activeOpenApiRes) {
    let isValidJson = false;
    let title = '';
    try {
      const parsed = JSON.parse(activeOpenApiRes.text);
      isValidJson = Boolean(parsed.openapi || parsed.swagger);
      title = parsed.info?.title || '';
    } catch { /* ignore */ }
    usabilityChecks.push({
      id: 'openapi-spec', name: 'OpenAPI Specification (openapi.json)', layer: 'usability',
      status: isValidJson ? 'pass' : 'warning',
      score: isValidJson ? 3 : 2, maxScore: 3, impact: 'critical',
      details: isValidJson
        ? `Valid OpenAPI 3.x specification found${title ? ` (${title})` : ''} at /openapi.json.`
        : 'openapi.json exists but is not valid JSON or lacks openapi version field.',
      why: 'AI agents use OpenAPI schemas to automatically generate tool definitions, validate parameter types, and execute API calls without human coding.',
      referenceUrl: 'https://openapis.org',
    });
  } else {
    usabilityChecks.push({
      id: 'openapi-spec', name: 'OpenAPI Specification (openapi.json)', layer: 'usability',
      status: 'warning', score: 0, maxScore: 3, impact: 'critical',
      details: 'No OpenAPI specification found at /openapi.json.',
      why: 'Without an OpenAPI spec, AI agents cannot reliably discover endpoint parameters, authentication requirements, or response schemas.',
      recommendation: 'Publish an OpenAPI 3.1 specification at /openapi.json.',
      referenceUrl: 'https://openapis.org',
    });
  }

  // 3.4 OpenAPI Parameter & Response Examples
  if (activeOpenApiRes) {
    const hasExamples = /"example":|"examples":/i.test(activeOpenApiRes.text);
    usabilityChecks.push({
      id: 'openapi-examples', name: 'OpenAPI Example Documentation', layer: 'usability',
      status: hasExamples ? 'pass' : 'warning',
      score: hasExamples ? 2 : 1, maxScore: 2, impact: 'important',
      details: hasExamples
        ? 'OpenAPI schema includes concrete parameter and response examples.'
        : 'OpenAPI schema detected, but lacks parameter/response examples.',
      why: 'LLMs perform significantly better when tool definitions include realistic concrete examples alongside type definitions.',
      referenceUrl: 'https://openapis.org',
    });
  } else {
    usabilityChecks.push({
      id: 'openapi-examples', name: 'OpenAPI Example Documentation', layer: 'usability',
      status: 'na', score: 0, maxScore: 2, impact: 'important',
      details: 'Skipped: No OpenAPI spec detected to evaluate.',
      why: 'Example payloads prevent LLM parameter formatting errors during automated tool execution.',
      referenceUrl: 'https://openapis.org',
    });
  }

  // 3.5 Authentication & Access Specification
  if (authRes?.ok && authRes.text && authRes.text.length > 30) {
    usabilityChecks.push({
      id: 'auth-guide', name: 'Authentication & Access Guide (/auth.md)', layer: 'usability',
      status: 'pass', score: 2, maxScore: 2, impact: 'important',
      details: 'Machine-readable authentication guide found at /auth.md.',
      why: 'AI agents need clear, structured documentation on how to authenticate (API keys, OAuth2, keyless access, rate limits).',
      referenceUrl: 'https://veda.ng/aistandards',
    });
  } else {
    usabilityChecks.push({
      id: 'auth-guide', name: 'Authentication & Access Guide (/auth.md)', layer: 'usability',
      status: 'warning', score: 0, maxScore: 2, impact: 'important',
      details: 'No authentication guide found at /auth.md.',
      why: 'Clear authentication documentation prevents agent auth failures and keyless access confusion.',
      recommendation: 'Publish a concise /auth.md explaining how machines should authenticate or declaring keyless open access.',
      fixSnippet: { language: 'markdown', filename: 'public/auth.md', code: `# Authentication Guide\n\nAll public endpoints on ${domain} are keyless and open access.\nNo API key or registration is required.\n\n## Rate Limits\n- Standard: 60 requests per minute per IP\n- Headers: RFC standard RateLimit-* headers are returned with every response.` },
      referenceUrl: 'https://veda.ng/aistandards',
    });
  }

  // 3.6 OAuth 2.0 Agent Discovery
  if (oauthAuthServerRes?.ok || oauthProtectedRes?.ok) {
    usabilityChecks.push({
      id: 'oauth-agent-discovery', name: 'OAuth 2.0 Agent Discovery (RFC 8414)', layer: 'usability',
      status: 'pass', score: 2, maxScore: 2, impact: 'recommended',
      details: 'OAuth 2.0 Authorization Server / Protected Resource metadata detected.',
      why: 'Enables autonomous token negotiation and secure delegated agent authorization without hardcoded API keys.',
      referenceUrl: 'https://datatracker.ietf.org/doc/html/rfc8414',
    });
  } else {
    usabilityChecks.push({
      id: 'oauth-agent-discovery', name: 'OAuth 2.0 Agent Discovery (RFC 8414)', layer: 'usability',
      status: 'warning', score: 0, maxScore: 2, impact: 'recommended',
      details: 'No RFC 8414 OAuth 2.0 metadata found at /.well-known/oauth-authorization-server.',
      why: 'OAuth metadata discovery allows automated agent tool servers to negotiate scoped access.',
      recommendation: 'Provide RFC 8414 metadata if your API requires authenticated user authorization.',
      referenceUrl: 'https://datatracker.ietf.org/doc/html/rfc8414',
    });
  }

  // 3.7 Text and Data Mining Rights (TDMRep)
  if (tdmrepRes?.ok && tdmrepRes.text) {
    usabilityChecks.push({
      id: 'tdmrep', name: 'Text & Data Mining Rights (tdmrep.json)', layer: 'usability',
      status: 'pass', score: 1, maxScore: 1, impact: 'recommended',
      details: 'W3C TDMRep reservation detected at /.well-known/tdmrep.json.',
      why: 'The W3C TDM Reservation Protocol provides legal and technical clarity on AI text and data mining rights under EU and international copyright frameworks.',
      referenceUrl: 'https://www.w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20240214/',
    });
  } else {
    usabilityChecks.push({
      id: 'tdmrep', name: 'Text & Data Mining Rights (tdmrep.json)', layer: 'usability',
      status: 'warning', score: 0, maxScore: 1, impact: 'recommended',
      details: 'No TDMRep file found at /.well-known/tdmrep.json.',
      why: 'Declaring TDM rights provides explicit machine-readable copyright terms for AI training vs inference.',
      recommendation: 'Add a tdmrep.json file declaring your text and data mining policies.',
      referenceUrl: 'https://www.w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20240214/',
    });
  }

  // 3.8 Standardized Error Formatting (RFC 7807)
  const isProblemJson = Boolean(apiRootRes && (apiRootRes.headers.get('content-type') || '').includes('application/problem+json'));
  usabilityChecks.push({
    id: 'rfc-7807-errors', name: 'Standardized Error Formatting (RFC 7807)', layer: 'usability',
    status: isProblemJson ? 'pass' : 'warning',
    score: isProblemJson ? 1 : 0, maxScore: 1, impact: 'recommended',
    details: isProblemJson
      ? 'RFC 7807 problem+json error formatting detected.'
      : 'Standard application/problem+json headers not returned on API probes.',
    why: 'When AI tool calls fail, structured RFC 7807 error objects allow the agent to self-correct parameters rather than aborting the task.',
    referenceUrl: 'https://datatracker.ietf.org/doc/html/rfc7807',
  });

  // 3.9 API Dry-Run / Idempotency
  const supportsDryRun = Boolean(activeOpenApiRes && /"dry_run"|"dryRun"|"validate_only"|"idempotency_key"|"Idempotency-Key"/i.test(activeOpenApiRes.text));
  usabilityChecks.push({
    id: 'api-dry-run', name: 'API Dry-Run & Idempotency Support', layer: 'usability',
    status: supportsDryRun ? 'pass' : 'warning',
    score: supportsDryRun ? 1 : 0, maxScore: 1, impact: 'recommended',
    details: supportsDryRun
      ? 'OpenAPI schema specifies dry-run parameters or idempotency headers.'
      : 'No dry-run parameters or idempotency keys detected in API specifications.',
    why: 'Autonomous agents need dry-run and idempotency validation to safely simulate state changes before executing financial or mutating actions.',
    referenceUrl: 'https://veda.ng/aistandards',
  });

  // 3.10 CORS Configuration for AI Interfaces
  const acao = (homepageRes?.headers.get('access-control-allow-origin') ||
                apiRootRes?.headers.get('access-control-allow-origin') ||
                openapiRes?.headers.get('access-control-allow-origin') || '').trim();
  const corsOpen = acao === '*' || acao.length > 0;
  usabilityChecks.push({
    id: 'api-cors-ai', name: 'CORS Configuration for AI Interfaces', layer: 'usability',
    status: corsOpen ? 'pass' : 'warning',
    score: corsOpen ? 1 : 0, maxScore: 1, impact: 'recommended',
    details: corsOpen
      ? `CORS headers present: Access-Control-Allow-Origin: ${acao}`
      : 'No CORS headers detected on public endpoints.',
    why: 'Enables browser-based AI agents, web workers, and WebAssembly LLM runtimes to query your public endpoints directly.',
    referenceUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS',
  });

  // ──────────────────────────────────────────────────────────────────────────
  // LAYER 4 — Security & Integrity (11 checks)
  // ──────────────────────────────────────────────────────────────────────────
  const securityChecks: CheckResult[] = [];

  // 4.1 HTTPS / TLS
  securityChecks.push({
    id: 'https-tls', name: 'HTTPS & TLS Transport Security', layer: 'security',
    status: isHttps ? 'pass' : 'fail',
    score: isHttps ? 3 : 0, maxScore: 3, impact: 'critical',
    details: isHttps ? 'Domain serves traffic over secure HTTPS.' : 'Domain is not using HTTPS. Insecure HTTP is deprecated.',
    why: 'All modern AI agents and search crawlers reject insecure HTTP endpoints for tool execution and data exchange.',
  });

  // 4.2 HSTS
  const hasHsts = Boolean(hsts && hsts.includes('max-age'));
  const hstsPreload = Boolean(hsts && hsts.includes('preload'));
  securityChecks.push({
    id: 'hsts', name: 'HTTP Strict Transport Security (HSTS)', layer: 'security',
    status: hasHsts ? 'pass' : 'warning',
    score: hasHsts ? (hstsPreload ? 2 : 1) : 0, maxScore: 2, impact: 'important',
    details: hasHsts
      ? `HSTS enabled: ${hsts}${hstsPreload ? ' (preload ready)' : ''}.`
      : 'Strict-Transport-Security header is missing.',
    why: 'HSTS ensures that connections cannot be downgraded to insecure plaintext HTTP.',
    recommendation: hasHsts ? undefined : 'Add a Strict-Transport-Security header with at least 1 year max-age.',
    fixSnippet: hasHsts ? undefined : { language: 'http', filename: 'HTTP Header', code: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` },
  });

  // 4.3 Content Security Policy (CSP)
  const hasCsp = Boolean(csp && csp.length > 10);
  securityChecks.push({
    id: 'csp', name: 'Content Security Policy (CSP)', layer: 'security',
    status: hasCsp ? 'pass' : 'warning',
    score: hasCsp ? 2 : 0, maxScore: 2, impact: 'important',
    details: hasCsp ? 'Content-Security-Policy header is configured.' : 'No Content-Security-Policy header detected.',
    why: 'A CSP protects against XSS, data injection, and malicious script execution in agent webview environments.',
    recommendation: hasCsp ? undefined : 'Configure a Content-Security-Policy header restricting script and connect sources.',
  });

  // 4.4 X-Content-Type-Options
  const hasXcto = xcto.toLowerCase().includes('nosniff');
  securityChecks.push({
    id: 'xcto', name: 'MIME Sniffing Protection (X-Content-Type-Options)', layer: 'security',
    status: hasXcto ? 'pass' : 'warning',
    score: hasXcto ? 1 : 0, maxScore: 1, impact: 'recommended',
    details: hasXcto ? 'X-Content-Type-Options: nosniff is set.' : 'X-Content-Type-Options header is missing.',
    why: 'Prevents MIME-sniffing attacks from misinterpreting text payloads as executable code.',
    fixSnippet: hasXcto ? undefined : { language: 'http', filename: 'HTTP Header', code: `X-Content-Type-Options: nosniff` },
  });

  // 4.5 Clickjacking Protection
  const hasXfo = Boolean(xfo || (csp && csp.includes('frame-ancestors')));
  securityChecks.push({
    id: 'frame-protection', name: 'Clickjacking Protection (X-Frame-Options / frame-ancestors)', layer: 'security',
    status: hasXfo ? 'pass' : 'warning',
    score: hasXfo ? 1 : 0, maxScore: 1, impact: 'recommended',
    details: hasXfo ? 'Clickjacking protection is configured.' : 'No X-Frame-Options or frame-ancestors directive detected.',
    why: 'Prevents unauthorized embedding of your interface inside malicious iframes.',
  });

  // 4.6 Referrer-Policy
  const hasRp = Boolean(rp && rp.length > 0);
  securityChecks.push({
    id: 'referrer-policy', name: 'Referrer-Policy Header', layer: 'security',
    status: hasRp ? 'pass' : 'warning',
    score: hasRp ? 1 : 0, maxScore: 1, impact: 'recommended',
    details: hasRp ? `Referrer-Policy is set: ${rp}` : 'Referrer-Policy header is missing.',
    why: 'Controls how much referrer information is leaked to third-party endpoints during outbound requests.',
    fixSnippet: hasRp ? undefined : { language: 'http', filename: 'HTTP Header', code: `Referrer-Policy: strict-origin-when-cross-origin` },
  });

  // 4.7 Permissions-Policy
  const hasPp = Boolean(pp && pp.length > 0);
  securityChecks.push({
    id: 'permissions-policy', name: 'Permissions-Policy Header', layer: 'security',
    status: hasPp ? 'pass' : 'warning',
    score: hasPp ? 1 : 0, maxScore: 1, impact: 'recommended',
    details: hasPp ? 'Permissions-Policy is configured.' : 'Permissions-Policy header is missing.',
    why: 'Restricts access to browser APIs (camera, microphone, geolocation) in automated agent contexts.',
  });

  // 4.8 RFC 9116 security.txt
  if (securityTxtRes?.ok && securityTxtRes.text && securityTxtRes.text.includes('Contact:')) {
    securityChecks.push({
      id: 'security-txt', name: 'Security Vulnerability Contact (RFC 9116)', layer: 'security',
      status: 'pass', score: 2, maxScore: 2, impact: 'important',
      details: 'Valid RFC 9116 security.txt found at /.well-known/security.txt with Contact directive.',
      why: 'security.txt provides a standardized machine-readable way for security researchers to report vulnerabilities.',
      referenceUrl: 'https://securitytxt.org',
    });
  } else {
    securityChecks.push({
      id: 'security-txt', name: 'Security Vulnerability Contact (RFC 9116)', layer: 'security',
      status: 'warning', score: 0, maxScore: 2, impact: 'important',
      details: 'No valid security.txt found at /.well-known/security.txt.',
      why: 'RFC 9116 security.txt allows automated security scanners and AI safety auditors to route vulnerability disclosures securely.',
      recommendation: 'Publish an RFC 9116 security.txt file at /.well-known/security.txt.',
      fixSnippet: { language: 'text', filename: 'public/.well-known/security.txt', code: `Contact: mailto:security@${domain}\nExpires: ${new Date(Date.now() + 365*24*3600*1000).toISOString()}\nPreferred-Languages: en` },
      referenceUrl: 'https://securitytxt.org',
    });
  }

  // 4.9 Cryptographic HTTP Signatures Directory (RFC 9421)
  if (httpSignaturesRes?.ok) {
    securityChecks.push({
      id: 'security-signatures', name: 'HTTP Message Signatures Directory (RFC 9421)', layer: 'security',
      status: 'pass', score: 1, maxScore: 1, impact: 'optional',
      details: 'RFC 9421 HTTP Message Signatures directory detected.',
      why: 'Enables end-to-end cryptographic verification of agent-to-agent requests and responses.',
      referenceUrl: 'https://datatracker.ietf.org/doc/html/rfc9421',
    });
  } else {
    securityChecks.push({
      id: 'security-signatures', name: 'HTTP Message Signatures Directory (RFC 9421)', layer: 'security',
      status: 'warning', score: 0, maxScore: 1, impact: 'optional',
      details: 'No HTTP Message Signatures directory at /.well-known/http-message-signatures-directory.',
      why: 'RFC 9421 standardizes cryptographic non-repudiation for autonomous agents.',
      recommendation: 'Consider adding RFC 9421 signature keys if handling financial transactions.',
      referenceUrl: 'https://datatracker.ietf.org/doc/html/rfc9421',
    });
  }

  // 4.10 C2PA Content Credentials
  const hasC2pa = Boolean(homepageHtml && (homepageHtml.includes('application/c2pa') || homepageHtml.includes('c2pa.org')));
  securityChecks.push({
    id: 'security-c2pa', name: 'Content Provenance & Credentials (C2PA)', layer: 'security',
    status: hasC2pa ? 'pass' : 'warning',
    score: hasC2pa ? 1 : 0, maxScore: 1, impact: 'optional',
    details: hasC2pa ? 'C2PA content provenance metadata detected.' : 'No C2PA provenance manifest detected in HTML or media assets.',
    why: 'The Coalition for Content Provenance and Authenticity (C2PA) standard embeds cryptographic provenance into media.',
    referenceUrl: 'https://c2pa.org',
  });

  // 4.11 AI Safety & Vulnerability Policy
  const mentionsAiSafety = Boolean(
    (securityTxtRes?.text && /AI|LLM|Agent|Prompt-Injection/i.test(securityTxtRes.text)) ||
    (termsRes?.text && /AI|Safety|Model/i.test(termsRes.text))
  );
  securityChecks.push({
    id: 'security-ai-disclosure', name: 'AI Safety Vulnerability Policy', layer: 'security',
    status: mentionsAiSafety ? 'pass' : 'warning',
    score: mentionsAiSafety ? 1 : 0, maxScore: 1, impact: 'optional',
    details: mentionsAiSafety
      ? 'Security policy includes explicit guidance for AI safety, prompt injection, or automated agent vulnerabilities.'
      : 'Security disclosures do not explicitly address AI or prompt-injection vulnerability reporting.',
    why: 'Helps red-teamers and researchers report prompt injection, SSRF, or tool-calling security flaws responsibly.',
    referenceUrl: 'https://veda.ng/aistandards',
  });

  // ──────────────────────────────────────────────────────────────────────────
  // LAYER 5 — SEO, Google Search & AI Citations (15 checks)
  // ──────────────────────────────────────────────────────────────────────────
  const seoChecks: CheckResult[] = [];

  // 5.1 Title Tag
  const titleMatch = homepageHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
  const titleText = titleMatch ? titleMatch[1].trim() : '';
  if (titleText.length >= 10 && titleText.length <= 75) {
    seoChecks.push({
      id: 'title-tag', name: 'Document Title Tag Optimization', layer: 'seo',
      status: 'pass', score: 2, maxScore: 2, impact: 'critical',
      details: `Optimized title tag found (${titleText.length} characters): "${titleText}".`,
      why: 'The <title> tag is the primary anchor used by Google Search and AI answer engines to understand the primary topic of a page.',
      referenceUrl: 'https://developers.google.com/search/docs/appearance/title-link',
    });
  } else if (titleText.length > 0) {
    seoChecks.push({
      id: 'title-tag', name: 'Document Title Tag Optimization', layer: 'seo',
      status: 'warning', score: 1, maxScore: 2, impact: 'critical',
      details: `Title tag exists but has sub-optimal length (${titleText.length} characters): "${titleText}". Ideal length is 30–65 characters.`,
      why: 'Overly long titles are truncated in Google Search snippets and AI citation badges.',
      recommendation: 'Keep title tags between 30 and 65 characters with clear branding.',
      referenceUrl: 'https://developers.google.com/search/docs/appearance/title-link',
    });
  } else {
    seoChecks.push({
      id: 'title-tag', name: 'Document Title Tag Optimization', layer: 'seo',
      status: 'fail', score: 0, maxScore: 2, impact: 'critical',
      details: 'No <title> tag found in HTML document.',
      why: 'Pages without a title tag suffer severe ranking penalties in Google and are difficult for LLMs to categorize.',
      recommendation: 'Add a descriptive <title> tag to your HTML <head>.',
      fixSnippet: { language: 'html', filename: 'index.html', code: `<title>${domain} - AI & Web3 Platform</title>` },
      referenceUrl: 'https://developers.google.com/search/docs/appearance/title-link',
    });
  }

  // 5.2 Meta Description
  const metaDesc = getMetaContent('description', homepageHtml);
  if (metaDesc.length >= 50 && metaDesc.length <= 170) {
    seoChecks.push({
      id: 'meta-description', name: 'Meta Description Optimization', layer: 'seo',
      status: 'pass', score: 2, maxScore: 2, impact: 'critical',
      details: `Optimized meta description found (${metaDesc.length} characters): "${metaDesc.slice(0, 80)}...".`,
      why: 'Search engines and AI summary generators use the meta description as an authoritative passage for preliminary snippet generation.',
      referenceUrl: 'https://developers.google.com/search/docs/appearance/snippet',
    });
  } else if (metaDesc.length > 0) {
    seoChecks.push({
      id: 'meta-description', name: 'Meta Description Optimization', layer: 'seo',
      status: 'warning', score: 1, maxScore: 2, impact: 'critical',
      details: `Meta description found but length (${metaDesc.length} chars) is outside optimal 70–160 char range.`,
      why: 'Short descriptions lack sufficient context; long descriptions are truncated in search results.',
      recommendation: 'Tune meta descriptions to be between 70 and 160 characters.',
      referenceUrl: 'https://developers.google.com/search/docs/appearance/snippet',
    });
  } else {
    seoChecks.push({
      id: 'meta-description', name: 'Meta Description Optimization', layer: 'seo',
      status: 'fail', score: 0, maxScore: 2, impact: 'critical',
      details: 'No <meta name="description"> tag found in HTML.',
      why: 'Without a meta description, search engines must guess snippet text, often selecting irrelevant navigation elements.',
      recommendation: 'Add a concise meta description summarizing your site.',
      fixSnippet: { language: 'html', filename: 'index.html', code: `<meta name="description" content="Discover ${domain}'s platform for autonomous AI agents, technical standards, and research.">` },
      referenceUrl: 'https://developers.google.com/search/docs/appearance/snippet',
    });
  }

  // 5.3 Canonical URL Declaration
  const canonicalMatch = homepageHtml.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
                      || homepageHtml.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  const canonicalUrl = canonicalMatch ? canonicalMatch[1] : '';
  const hasValidCanonical = Boolean(canonicalUrl && (canonicalUrl.startsWith('http://') || canonicalUrl.startsWith('https://') || canonicalUrl.startsWith('/')));
  if (hasValidCanonical) {
    seoChecks.push({
      id: 'canonical', name: 'Canonical URL Declaration', layer: 'seo',
      status: 'pass', score: 2, maxScore: 2, impact: 'critical',
      details: `Valid canonical URL declared: ${canonicalUrl}`,
      why: 'Canonical URLs prevent duplicate content issues, consolidate search authority, and tell AI models which URL to cite.',
      referenceUrl: 'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls',
    });
  } else {
    seoChecks.push({
      id: 'canonical', name: 'Canonical URL Declaration', layer: 'seo',
      status: 'fail', score: 0, maxScore: 2, impact: 'critical',
      details: 'No <link rel="canonical"> tag found in HTML head.',
      why: 'Missing canonical tags can lead to split page rank and duplicate citation URLs across search engines.',
      recommendation: 'Add a self-referential canonical link tag to every page.',
      fixSnippet: { language: 'html', filename: 'index.html', code: `<link rel="canonical" href="${url}">` },
      referenceUrl: 'https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls',
    });
  }

  // 5.4 HTML Language Declaration (BCP 47)
  const langMatch = homepageHtml.match(/<html[^>]+lang=["']([^"']+)["']/i);
  const langCode = langMatch ? langMatch[1].trim() : '';
  if (langCode.length >= 2) {
    seoChecks.push({
      id: 'html-lang', name: 'HTML Language Tag (BCP 47)', layer: 'seo',
      status: 'pass', score: 1, maxScore: 1, impact: 'important',
      details: `HTML language attribute specified: lang="${langCode}".`,
      why: 'Language tags help AI crawlers and translation models process content in the correct linguistic context.',
      referenceUrl: 'https://www.w3.org/International/questions/qa-html-language-declarations',
    });
  } else {
    seoChecks.push({
      id: 'html-lang', name: 'HTML Language Tag (BCP 47)', layer: 'seo',
      status: 'warning', score: 0, maxScore: 1, impact: 'important',
      details: 'No lang attribute found on <html> element.',
      why: 'Missing language tags can cause AI models to misclassify page language during search indexing.',
      recommendation: 'Add lang="en" (or your primary language) to the <html> tag.',
      fixSnippet: { language: 'html', filename: 'index.html', code: `<html lang="en">` },
      referenceUrl: 'https://www.w3.org/International/questions/qa-html-language-declarations',
    });
  }

  // 5.5 Brand Favicon & Touch Icon
  const hasFavicon = Boolean(
    (faviconRes?.ok && faviconRes.status === 200) ||
    homepageHtml.match(/<link[^>]+rel=["'](?:shortcut )?icon["']/i) ||
    homepageHtml.match(/<link[^>]+rel=["']apple-touch-icon["']/i)
  );
  seoChecks.push({
    id: 'favicon-branding', name: 'Visual Brand Favicon & Citation Badges', layer: 'seo',
    status: hasFavicon ? 'pass' : 'warning',
    score: hasFavicon ? 1 : 0, maxScore: 1, impact: 'recommended',
    details: hasFavicon
      ? 'Brand icon / favicon detected for visual search badge attribution.'
      : 'No standard favicon.ico or <link rel="icon"> detected.',
    why: 'AI search engines (Perplexity, SearchGPT, Google AI Overviews, Arc Search) display your site favicon next to citations for brand trust.',
    referenceUrl: 'https://developers.google.com/search/docs/appearance/favicon-in-search',
  });

  // 5.6 Open Graph Social Tags
  const ogTitle = getMetaContent('og:title', homepageHtml);
  const ogDesc  = getMetaContent('og:description', homepageHtml);
  const ogImage = getMetaContent('og:image', homepageHtml);
  const hasOg = Boolean(ogTitle && (ogDesc || ogImage));
  if (hasOg) {
    seoChecks.push({
      id: 'og-tags', name: 'Open Graph Social Metadata', layer: 'seo',
      status: 'pass', score: 2, maxScore: 2, impact: 'important',
      details: `Complete Open Graph tags found (og:title: "${ogTitle.slice(0, 40)}...", og:image: ${ogImage ? 'present' : 'none'}).`,
      why: 'Open Graph tags control how your content appears when shared across social networks, messaging apps, and AI preview cards.',
      referenceUrl: 'https://ogp.me',
    });
  } else {
    seoChecks.push({
      id: 'og-tags', name: 'Open Graph Social Metadata', layer: 'seo',
      status: 'fail', score: 0, maxScore: 2, impact: 'important',
      details: 'Missing essential Open Graph tags (og:title, og:description, or og:image).',
      why: 'Without Open Graph tags, social platforms and AI search engines cannot generate rich link previews.',
      recommendation: 'Add og:title, og:description, og:image, and og:url to your HTML <head>.',
      fixSnippet: { language: 'html', filename: 'index.html', code: `<meta property="og:title" content="${titleText || domain}">\n<meta property="og:description" content="${metaDesc || 'Official website.'}">\n<meta property="og:url" content="${url}">\n<meta property="og:image" content="${origin}/og-image.png">\n<meta property="og:type" content="website">` },
      referenceUrl: 'https://ogp.me',
    });
  }

  // 5.7 Twitter / X Card Metadata
  const twitterCard = getMetaContent('twitter:card', homepageHtml);
  const twitterTitle = getMetaContent('twitter:title', homepageHtml);
  const hasTwitter = Boolean(twitterCard || twitterTitle);
  seoChecks.push({
    id: 'twitter-cards', name: 'Twitter / X Card Metadata', layer: 'seo',
    status: hasTwitter ? 'pass' : 'warning',
    score: hasTwitter ? 1 : 0, maxScore: 1, impact: 'recommended',
    details: hasTwitter
      ? `Twitter Card metadata configured: twitter:card="${twitterCard || 'summary_large_image'}".`
      : 'No twitter:card tags detected.',
    why: 'Ensures rich media previews when links are shared on X / Twitter and cited in AI chatbots.',
    fixSnippet: hasTwitter ? undefined : { language: 'html', filename: 'index.html', code: `<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${titleText || domain}">\n<meta name="twitter:description" content="${metaDesc || ''}">` },
  });

  // 5.8 JSON-LD Structured Data
  const jsonLdBlocks: unknown[] = [];
  const jsonLdMatches = homepageHtml.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const m of jsonLdMatches) {
    try { jsonLdBlocks.push(JSON.parse(m[1])); } catch { /* ignore */ }
  }
  const hasJsonLd = jsonLdBlocks.length > 0;
  if (hasJsonLd) {
    seoChecks.push({
      id: 'json-ld', name: 'JSON-LD Structured Data (schema.org)', layer: 'seo',
      status: 'pass', score: 3, maxScore: 3, impact: 'critical',
      details: `Valid JSON-LD schema found (${jsonLdBlocks.length} block(s)).`,
      why: 'JSON-LD provides unambiguous machine-readable entity definitions that Google Search and LLM Knowledge Graphs rely on for structured facts and rich answers.',
      referenceUrl: 'https://schema.org',
    });
  } else {
    seoChecks.push({
      id: 'json-ld', name: 'JSON-LD Structured Data (schema.org)', layer: 'seo',
      status: 'fail', score: 0, maxScore: 3, impact: 'critical',
      details: 'No JSON-LD structured data found in HTML document.',
      why: 'Without schema markup, AI systems must infer entities through statistical extraction, which is error-prone.',
      recommendation: 'Add a schema.org JSON-LD script defining your Organization or WebSite entity.',
      fixSnippet: { language: 'html', filename: 'index.html', code: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebSite",\n  "name": "${domain}",\n  "url": "${origin}",\n  "description": "${metaDesc || ''}"\n}\n</script>` },
      referenceUrl: 'https://schema.org',
    });
  }

  // 5.9 Schema Entity Graph Linking (@graph)
  const hasGraphLinking = Boolean(
    homepageHtml.includes('"@graph"') ||
    homepageHtml.includes('"isPartOf"') ||
    homepageHtml.includes('"mainEntity"') ||
    homepageHtml.includes('"author"')
  );
  seoChecks.push({
    id: 'seo-schema-graph', name: 'Entity Graph Linking (@graph / isPartOf)', layer: 'seo',
    status: hasGraphLinking ? 'pass' : 'warning',
    score: hasGraphLinking ? 2 : 0, maxScore: 2, impact: 'important',
    details: hasGraphLinking
      ? 'Structured data interconnects entities using @graph, isPartOf, or mainEntity.'
      : 'JSON-LD blocks do not interconnect related entities into a unified graph.',
    why: 'Connecting WebPage -> WebSite -> Organization/Person allows LLM knowledge graphs to resolve unambiguous corporate and author ownership.',
    referenceUrl: 'https://schema.org',
  });

  // 5.10 Extended Rich Schemas
  const rawSchemaText = homepageHtml;
  const hasRichSchemas = /"FAQPage"|"HowTo"|"Article"|"BlogPosting"|"SoftwareApplication"|"WebApplication"|"Course"|"DefinedTermSet"|"BreadcrumbList"/i.test(rawSchemaText);
  seoChecks.push({
    id: 'seo-rich-schemas', name: 'Extended Schema Types (FAQ, Article, Software)', layer: 'seo',
    status: hasRichSchemas ? 'pass' : 'warning',
    score: hasRichSchemas ? 2 : 0, maxScore: 2, impact: 'recommended',
    details: hasRichSchemas
      ? 'Rich domain-specific Schema.org types detected (FAQPage, Article, Software, Course, or BreadcrumbList).'
      : 'Only basic WebSite schemas detected; no specialized domain schemas found.',
    why: 'FAQPage, Article, and HowTo schemas enable Google Rich Snippets and give AI answer engines structured Q&A pairs for direct citation.',
    referenceUrl: 'https://developers.google.com/search/docs/appearance/structured-data/search-gallery',
  });

  // 5.11 Author Authority & E-E-A-T Signals (sameAs links)
  const hasEeat = Boolean(
    homepageHtml.includes('"sameAs"') ||
    homepageHtml.includes('wikidata.org') ||
    homepageHtml.includes('orcid.org') ||
    homepageHtml.includes('scholar.google.com') ||
    (homepageHtml.includes('"Person"') && homepageHtml.includes('"name"'))
  );
  seoChecks.push({
    id: 'seo-author-eeat', name: 'Author Authority & E-E-A-T Signals (sameAs)', layer: 'seo',
    status: hasEeat ? 'pass' : 'warning',
    score: hasEeat ? 2 : 0, maxScore: 2, impact: 'important',
    details: hasEeat
      ? 'Author/Entity profiles include E-E-A-T credentials and authoritative sameAs disambiguation links.'
      : 'No author sameAs entity links (Wikidata, Wikipedia, ORCID, Scholar) found in Schema.',
    why: 'AI search engines evaluate author Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T) using sameAs links to verify real-world knowledge graphs.',
    recommendation: 'Add sameAs links pointing to verified Wikipedia, Wikidata, LinkedIn, and Scholar profiles in your Person/Organization schema.',
    referenceUrl: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
  });

  // 5.12 Answer-First Inverted Pyramid Content Hierarchy
  const hasStructuredHeadings = Boolean(
    homepageHtml.match(/<h1[^>]*>/i) &&
    homepageHtml.match(/<h2[^>]*>/i)
  );
  seoChecks.push({
    id: 'seo-answer-first', name: 'Answer-First Heading Structure (H1 -> H2)', layer: 'seo',
    status: hasStructuredHeadings ? 'pass' : 'warning',
    score: hasStructuredHeadings ? 2 : 0, maxScore: 2, impact: 'important',
    details: hasStructuredHeadings
      ? 'Clear semantic heading hierarchy found (distinct <h1> and structured <h2> tags).'
      : 'Missing standard <h1> or <h2> heading tags in DOM structure.',
    why: 'AI answer engines extract answers paragraph by paragraph beneath structured heading anchors.',
    referenceUrl: 'https://developers.google.com/search/docs/appearance/visual-elements-gallery',
  });

  // 5.13 Multimodal Image Optimization
  const hasImgTags = homepageHtml.includes('<img');
  const hasAltAttributes = Boolean(homepageHtml.match(/<img[^>]+alt=["'][^"']+["']/i));
  if (!hasImgTags) {
    seoChecks.push({
      id: 'seo-multimodal', name: 'Multimodal Image Alt Optimization', layer: 'seo',
      status: 'pass', score: 1, maxScore: 1, impact: 'recommended',
      details: 'No image tags detected on homepage.',
      why: 'Ensures vision models and screen readers can understand graphical assets.',
    });
  } else if (hasAltAttributes) {
    seoChecks.push({
      id: 'seo-multimodal', name: 'Multimodal Image Alt Optimization', layer: 'seo',
      status: 'pass', score: 1, maxScore: 1, impact: 'recommended',
      details: 'Image tags include descriptive alt attributes for vision models and accessibility.',
      why: 'Multimodal AI models (GPT-4o, Gemini) use alt text to understand visual content and generate image-grounded answers.',
      referenceUrl: 'https://developers.google.com/search/docs/appearance/google-images',
    });
  } else {
    seoChecks.push({
      id: 'seo-multimodal', name: 'Multimodal Image Alt Optimization', layer: 'seo',
      status: 'warning', score: 0, maxScore: 1, impact: 'recommended',
      details: 'Images detected without descriptive alt attributes.',
      why: 'Missing alt attributes prevent multimodal search models from indexing your images.',
      recommendation: 'Add meaningful alt attributes describing image contents to all <img> tags.',
      referenceUrl: 'https://developers.google.com/search/docs/appearance/google-images',
    });
  }

  // 5.14 Content Freshness & Revision Indicators
  const hasFreshness = Boolean(
    homepageHtml.match(/"dateModified"\s*:\s*"[^"]+"/i) ||
    homepageHtml.match(/"datePublished"\s*:\s*"[^"]+"/i) ||
    homepageHtml.match(/last_updated|lastmod|published_time/i)
  );
  seoChecks.push({
    id: 'seo-freshness', name: 'Content Freshness & Revision Dates', layer: 'seo',
    status: hasFreshness ? 'pass' : 'warning',
    score: hasFreshness ? 1 : 0, maxScore: 1, impact: 'recommended',
    details: hasFreshness
      ? 'Explicit ISO 8601 dateModified or lastmod timestamps detected.'
      : 'No machine-readable publication or modification dates found in HTML.',
    why: 'Real-time AI search engines heavily prioritize fresh, recently updated content for topical queries.',
    referenceUrl: 'https://schema.org/dateModified',
  });

  // 5.15 RSS / Atom / JSON Syndication Feed
  const hasFeed = Boolean(
    (feedRes?.ok && feedRes.text.includes('<rss') || feedRes?.text.includes('<feed')) ||
    (feedJsonRes?.ok && feedJsonRes.text.includes('version')) ||
    homepageHtml.match(/<link[^>]+type=["']application\/(?:rss\+xml|atom\+xml|feed\+json)["']/i)
  );
  if (hasFeed) {
    seoChecks.push({
      id: 'rss-feed', name: 'Syndication Feeds (RSS / Atom / JSON)', layer: 'seo',
      status: 'pass', score: 2, maxScore: 2, impact: 'important',
      details: 'Active RSS/Atom/JSON syndication feed detected for continuous automated ingestion.',
      why: 'Continuous ingestion pipelines use RSS/Atom feeds to discover and index new articles within seconds of publication.',
      referenceUrl: 'https://cyber.harvard.edu/rss/rss.html',
    });
  } else {
    seoChecks.push({
      id: 'rss-feed', name: 'Syndication Feeds (RSS / Atom / JSON)', layer: 'seo',
      status: 'warning', score: 0, maxScore: 2, impact: 'important',
      details: 'No RSS or Atom syndication feed found at /feed.xml or /feed.json.',
      why: 'Without a feed, real-time AI aggregators must poll every page repeatedly rather than receiving instant update diffs.',
      recommendation: 'Publish an RSS or Atom feed at /feed.xml.',
      fixSnippet: { language: 'xml', filename: 'public/feed.xml', code: `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${domain}</title>\n    <link>${origin}</link>\n    <description>Latest research from ${domain}</description>\n  </channel>\n</rss>` },
      referenceUrl: 'https://cyber.harvard.edu/rss/rss.html',
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LAYER 6 — Micropayments & Machine Commerce (3 checks)
  // ──────────────────────────────────────────────────────────────────────────
  const paymentsChecks: CheckResult[] = [];

  // 6.1 Agent Micropayments (x402 / MPP)
  const has402Header = Boolean(
    secHeaders?.get('www-authenticate')?.includes('L402') ||
    secHeaders?.get('www-authenticate')?.includes('LSAT') ||
    secHeaders?.get('x-payment') ||
    homepageHtml.includes('x402') ||
    homepageHtml.includes('lightning:')
  );
  if (has402Header) {
    paymentsChecks.push({
      id: 'agent-payments', name: 'Agent Micropayments (x402 / L402)', layer: 'payments',
      status: 'pass', score: 3, maxScore: 3, impact: 'recommended',
      details: 'Autonomous micropayment headers detected (L402 / HTTP 402 macaroons).',
      why: 'Allows AI agents to pay per-query or per-API-call autonomously using cryptographic Lightning Network invoices without human subscription cards.',
      referenceUrl: 'https://l402.org',
    });
  } else {
    paymentsChecks.push({
      id: 'agent-payments', name: 'Agent Micropayments (x402 / L402)', layer: 'payments',
      status: 'warning', score: 0, maxScore: 3, impact: 'recommended',
      details: 'No autonomous micropayment headers (L402 / HTTP 402) detected.',
      why: 'Machine-to-machine commerce protocols allow agents to access paid premium resources programmatically.',
      recommendation: 'Implement L402 or x402 headers on monetization endpoints.',
      referenceUrl: 'https://l402.org',
    });
  }

  // 6.2 WebLN / Lightning Wallet Discovery
  const hasWebLn = Boolean(homepageHtml.includes('webln') || homepageHtml.includes('lightning:'));
  paymentsChecks.push({
    id: 'payments-webln', name: 'WebLN / Lightning Wallet Discovery', layer: 'payments',
    status: hasWebLn ? 'pass' : 'warning',
    score: hasWebLn ? 1 : 0, maxScore: 1, impact: 'optional',
    details: hasWebLn
      ? 'WebLN or Lightning address metadata detected in DOM.'
      : 'No WebLN or Lightning payment tags detected.',
    why: 'WebLN allows browser-based autonomous agents to trigger micro-transactions with zero friction.',
    referenceUrl: 'https://webln.guide',
  });

  // 6.3 Machine Terms of Service
  const hasTerms = Boolean(termsRes?.ok || homepageHtml.includes('terms-of-use.md') || homepageHtml.includes('ai-terms'));
  paymentsChecks.push({
    id: 'payments-terms', name: 'AI Terms of Service (terms-of-use.md)', layer: 'payments',
    status: hasTerms ? 'pass' : 'warning',
    score: hasTerms ? 1 : 0, maxScore: 1, impact: 'recommended',
    details: hasTerms
      ? 'Machine-readable terms of use detected (/terms-of-use.md).'
      : 'No machine-readable terms of use found at /terms-of-use.md.',
    why: 'Defines commercial usage terms, rate limits, and liability boundaries for autonomous agent transactions.',
    referenceUrl: 'https://veda.ng/aistandards',
  });

  // ──────────────────────────────────────────────────────────────────────────
  // SCORE AGGREGATION & BADGES
  // ──────────────────────────────────────────────────────────────────────────
  const discoveryScore = scoreLayer(discoveryChecks);
  const accessScore    = scoreLayer(accessChecks);
  const usabilityScore = scoreLayer(usabilityChecks);
  const securityScore  = scoreLayer(securityChecks);
  const seoScore       = scoreLayer(seoChecks);
  const paymentsScore  = scoreLayer(paymentsChecks);

  const totalRawScore = discoveryScore.score + accessScore.score + usabilityScore.score +
                        securityScore.score + seoScore.score + paymentsScore.score;
  const totalMaxScore = discoveryScore.maxScore + accessScore.maxScore + usabilityScore.maxScore +
                        securityScore.maxScore + seoScore.maxScore + paymentsScore.maxScore;

  const score = Math.min(100, Math.max(0, Math.round((totalRawScore / Math.max(1, totalMaxScore)) * 100)));

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  if (score >= 95) grade = 'A+';
  else if (score >= 85) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 55) grade = 'C';
  else if (score >= 40) grade = 'D';
  else grade = 'F';

  let summary = '';
  if (score >= 90) {
    summary = `${domain} demonstrates exceptional agentic readiness and AI search optimization with comprehensive MCP tooling, structured JSON-LD entity graphs, llms.txt catalogs, and keyless open discovery.`;
  } else if (score >= 75) {
    summary = `${domain} is well-positioned for AI answer engines and search crawlers, with strong metadata fundamentals and modern HTTPS security, but could improve MCP endpoint exposure and markdown content negotiation.`;
  } else if (score >= 50) {
    summary = `${domain} has baseline SEO and HTTPS in place, but lacks specialized AI agent discovery files (llms.txt, ard.json), MCP servers, and explicit crawler policy directives for top answer engines.`;
  } else {
    summary = `${domain} has significant gaps in machine discoverability and agentic standards. It lacks structured AI indexes, robots directives, and machine-readable API specifications.`;
  }

  const layers = [
    { id: 'discovery' as const, name: 'Discovery', description: 'robots.txt AI rules, llms.txt, ARD catalog, agents.txt, sitemaps', ...discoveryScore, checks: discoveryChecks },
    { id: 'access' as const, name: 'Access', description: 'Markdown twins, Accept: text/markdown, SSR content, bot reachability', ...accessScore, checks: accessChecks },
    { id: 'usability' as const, name: 'Usability & MCP', description: 'MCP Streamable servers, OpenAPI 3.1 schema, examples, auth guide', ...usabilityScore, checks: usabilityChecks },
    { id: 'security' as const, name: 'Security', description: 'HTTPS, HSTS preload, CSP, nosniff, RFC 9116 security.txt', ...securityScore, checks: securityChecks },
    { id: 'seo' as const, name: 'SEO & Structured Data', description: 'Title, Meta Description, JSON-LD @graph, E-E-A-T sameAs, RSS feeds', ...seoScore, checks: seoChecks },
    { id: 'payments' as const, name: 'Micropayments', description: 'x402 / L402 macaroons, WebLN, machine terms of use', ...paymentsScore, checks: paymentsChecks },
  ];

  const badges = {
    mcpServer: mcpOk,
    llmsTxt: Boolean(llmsRes?.ok && llmsRes.text && llmsRes.text.length > 50),
    ardCatalog: Boolean(ardRes?.ok),
    apiCatalog: Boolean(apiCatalogRes?.ok),
    markdownTwins: Boolean(mdTwinRes?.ok),
    openapiSpec: Boolean(activeOpenApiRes),
    aiBotFriendly: Boolean(robotsRes?.ok && !/User-agent:\s*GPTBot[\s\S]*?Disallow:\s*\/\s*$/im.test(robotsRes.text)),
    httpsSecure: isHttps && hasHsts,
    structuredData: hasJsonLd,
    authorEeat: hasEeat,
    robotsMetaAi: !isNoIndex && !isNoSnippet && (hasMaxSnippet || hasMaxImage),
    jsRenderingSelfSufficient: textContentLength > 300,
    xmlOrJsonSitemap: Boolean(sitemapRes?.ok || sitemapJsonRes?.ok),
    schemaEntityGraph: hasGraphLinking,
    openapiExamplesReady: Boolean(activeOpenApiRes && /"example":|"examples":/i.test(activeOpenApiRes.text)),
    micropaymentsSupported: has402Header || hasWebLn,
  };

  return {
    url,
    domain,
    scannedAt: new Date().toISOString(),
    durationMs: Date.now() - startTime,
    score,
    grade,
    summary,
    layers,
    badges,
  };
}

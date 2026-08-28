import manifest from '@/lib/agent-manifest.json';

export type AgentResolution =
  | { kind: 'markdown' }
  | { kind: 'not-found' }
  | { kind: 'passthrough' };

const AGENT_BOT_UA =
  /GPTBot|ClaudeBot|Claude-Web|anthropic-ai|ChatGPT-User|PerplexityBot|Google-Extended|Applebot-Extended|ora-agent|DeepSeekBot|Bytespider|CCBot|Amazonbot|Meta-ExternalAgent|cohere-ai|Diffbot|YouBot|DuckAssistBot|Timpibot|PetalBot/i;

export function wantsMarkdown(accept: string | null | undefined, userAgent?: string | null): boolean {
  if (userAgent && AGENT_BOT_UA.test(userAgent)) return true;
  if (!accept) return false;
  return accept.toLowerCase().includes('markdown');
}

const STATIC_MD_FILES = new Set(['/auth.md', '/noslop.md', '/SKILL.md']);

export function isMarkdownUrl(pathname: string): boolean {
  return /\.md$/i.test(pathname) && !STATIC_MD_FILES.has(normalizePath(pathname));
}

export function markdownUrlToPath(pathname: string): string {
  const stripped = pathname.replace(/\.md$/i, '');
  return stripped === '/index' || stripped === '' ? '/' : stripped;
}

export function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.replace(/\/+$/, '') || '/';
  }
  return pathname;
}

function lastSegmentHasExtension(pathname: string): boolean {
  const segments = pathname.split('/');
  const last = segments[segments.length - 1];
  return /\.[a-z0-9]+$/i.test(last);
}

export function shouldSkipNegotiation(
  pathname: string,
  method: string,
  rscHeader?: string | null,
  prefetchHeader?: string | null
): boolean {
  if (method !== 'GET' && method !== 'HEAD') return true;
  if (rscHeader || prefetchHeader) return true;

  const normalized = normalizePath(pathname);
  if (isMarkdownUrl(normalized)) return false;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/md/') ||
    pathname.startsWith('/.well-known/') ||
    pathname.startsWith('/agent/') ||
    pathname === '/md'
  ) {
    return true;
  }

  if (pathname.startsWith('/api/')) return true;

  return lastSegmentHasExtension(normalized);
}

export function resolveAgentRequest(
  pathnameRaw: string,
  accept: string | null | undefined,
  options?: { modeAgent?: boolean; userAgent?: string | null }
): AgentResolution {
  const pathname = normalizePath(pathnameRaw);

  if (isMarkdownUrl(pathname)) {
    const target = markdownUrlToPath(pathname);
    if (manifest.markdownPaths.includes(target)) return { kind: 'markdown' };
    return { kind: 'not-found' };
  }

  const forced = options?.modeAgent === true || wantsMarkdown(accept, options?.userAgent);
  if (!forced) return { kind: 'passthrough' };
  if (manifest.markdownPaths.includes(pathname)) return { kind: 'markdown' };
  if (!manifest.validPaths.includes(pathname)) return { kind: 'not-found' };
  return { kind: 'passthrough' };
}

export function buildLinkHeader(pathname: string): string | null {
  const normalized = normalizePath(pathname);
  const links: string[] = [];
  if (manifest.markdownPaths.includes(normalized)) {
    const mdHref = normalized === '/' ? '/index.md' : `${normalized}.md`;
    links.push(`<${mdHref}>; rel="alternate"; type="text/markdown"`);
  }
  links.push('</llms.txt>; rel="alternate"; type="text/plain"; title="LLM index"');
  links.push('</developers>; rel="help"; title="Developer Documentation"');
  links.push('</.well-known/mcp>; rel="service"; type="application/json"; title="Product MCP Server"');
  links.push('</.well-known/mcp/docs>; rel="service"; type="application/json"; title="Docs MCP Server"');
  links.push('</openapi.json>; rel="service"; type="application/openapi+json"; title="OpenAPI Specification"');
  links.push('</auth.md>; rel="help"; type="text/markdown"; title="Authentication Guide"');
  links.push('</feed.xml>; rel="alternate"; type="application/rss+xml"');
  return links.length > 0 ? links.join(', ') : null;
}

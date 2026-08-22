import manifest from '@/lib/agent-manifest.json';

export type AgentResolution =
  | { kind: 'markdown' }
  | { kind: 'not-found' }
  | { kind: 'passthrough' };

export function wantsMarkdown(accept: string | null | undefined): boolean {
  if (!accept) return false;
  return accept.toLowerCase().includes('markdown');
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
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/md/') ||
    pathname === '/md'
  ) {
    return true;
  }
  return lastSegmentHasExtension(normalizePath(pathname));
}

export function resolveAgentRequest(pathnameRaw: string, accept: string | null | undefined): AgentResolution {
  const pathname = normalizePath(pathnameRaw);
  if (!wantsMarkdown(accept)) return { kind: 'passthrough' };
  if (manifest.markdownPaths.includes(pathname)) return { kind: 'markdown' };
  if (!manifest.validPaths.includes(pathname)) return { kind: 'not-found' };
  return { kind: 'passthrough' };
}

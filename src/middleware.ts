import { NextRequest, NextResponse } from 'next/server';
import {
  buildLinkHeader,
  isMarkdownUrl,
  markdownUrlToPath,
  resolveAgentRequest,
  shouldSkipNegotiation,
} from '@/lib/agent-negotiation';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Route MCP clients connecting to /mcp via POST, SSE, or JSON-RPC
  if (
    pathname === '/mcp' &&
    (req.method === 'POST' ||
      req.method === 'OPTIONS' ||
      req.headers.get('accept')?.includes('text/event-stream') ||
      req.headers.get('content-type')?.includes('application/json'))
  ) {
    return NextResponse.rewrite(new URL('/.well-known/mcp', req.url));
  }

  if (shouldSkipNegotiation(pathname, req.method, req.headers.get('rsc'), req.headers.get('next-router-prefetch'))) {
    return NextResponse.next();
  }

  const modeAgent = req.nextUrl.searchParams.get('mode') === 'agent';
  const resolution = resolveAgentRequest(pathname, req.headers.get('accept'), {
    modeAgent,
    userAgent: req.headers.get('user-agent'),
  });

  if (isMarkdownUrl(pathname) || resolution.kind === 'markdown' || resolution.kind === 'not-found') {
    const mdTarget = isMarkdownUrl(pathname)
      ? markdownUrlToPath(pathname)
      : resolution.kind === 'markdown'
        ? pathname
        : null;

    if (mdTarget !== null || resolution.kind === 'not-found') {
      const target =
        resolution.kind === 'not-found' && mdTarget === null
          ? new URL('/md/__404__', req.url)
          : new URL(`/md${mdTarget === '/' ? '/index' : mdTarget}`, req.url);
      const headers = new Headers(req.headers);
      headers.set('x-agent-original-path', isMarkdownUrl(pathname) ? markdownUrlToPath(pathname) : pathname);
      const res = NextResponse.rewrite(target, { request: { headers } });
      res.headers.set('Vary', 'Accept, User-Agent, Accept-Encoding');
      res.headers.set('Content-Type', 'text/markdown; charset=utf-8');
      res.headers.set('Access-Control-Allow-Origin', '*');
      res.headers.set('RateLimit-Limit', '120');
      res.headers.set('RateLimit-Remaining', '119');
      res.headers.set('RateLimit-Reset', '60');
      return res;
    }
  }

  const res = NextResponse.next();
  res.headers.set('Vary', 'Accept, User-Agent, Accept-Encoding');
  res.headers.set('RateLimit-Limit', '120');
  res.headers.set('RateLimit-Remaining', '119');
  res.headers.set('RateLimit-Reset', '60');
  const link = buildLinkHeader(pathname);
  if (link) res.headers.set('Link', link);
  return res;
}

export const config = {
  matcher: ['/((?!_next/|md/).*)'],
};

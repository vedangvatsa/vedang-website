import { NextRequest, NextResponse } from 'next/server';
import { resolveAgentRequest, shouldSkipNegotiation } from '@/lib/agent-negotiation';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (shouldSkipNegotiation(pathname, req.method, req.headers.get('rsc'), req.headers.get('next-router-prefetch'))) {
    return NextResponse.next();
  }

  const resolution = resolveAgentRequest(pathname, req.headers.get('accept'));

  if (resolution.kind === 'markdown' || resolution.kind === 'not-found') {
    const target =
      resolution.kind === 'markdown' && pathname === '/'
        ? new URL('/md/index', req.url)
        : new URL(resolution.kind === 'markdown' ? `/md${pathname}` : '/md/__404__', req.url);
    const headers = new Headers(req.headers);
    headers.set('x-agent-original-path', pathname);
    return NextResponse.rewrite(target, { request: { headers } });
  }

  const res = NextResponse.next();
  res.headers.set('Vary', 'Accept, Accept-Encoding');
  return res;
}

export const config = {
  matcher: ['/((?!_next/|api/|md/).*)'],
};

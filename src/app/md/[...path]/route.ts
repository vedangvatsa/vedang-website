import { NextRequest } from 'next/server';
import { getAgentNotFoundMarkdown, getMarkdownForPath } from '@/lib/agent-md';

export const dynamic = 'force-dynamic';

const MARKDOWN_HEADERS: Record<string, string> = {
  'Content-Type': 'text/markdown; charset=utf-8',
  Vary: 'Accept, User-Agent, Accept-Encoding',
  'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
  'Access-Control-Allow-Origin': '*',
};

type RouteContext = { params: Promise<{ path?: string[] }> };

export async function GET(request: NextRequest, ctx: RouteContext) {
  const { path: segments = [] } = await ctx.params;
  const originalPath = request.headers.get('x-agent-original-path');
  const pathname =
    originalPath && originalPath.startsWith('/')
      ? originalPath
      : `/${segments.join('/')}`.replace(/\/+$/, '') || '/';

  if (segments.length === 1 && segments[0] === '__404__') {
    return new Response(getAgentNotFoundMarkdown(pathname), { status: 404, headers: MARKDOWN_HEADERS });
  }

  const markdown = getMarkdownForPath(pathname);
  if (markdown === null) {
    return new Response(getAgentNotFoundMarkdown(pathname), { status: 404, headers: MARKDOWN_HEADERS });
  }

  return new Response(markdown, { status: 200, headers: MARKDOWN_HEADERS });
}

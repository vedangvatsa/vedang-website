import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  const accept = request.headers.get('accept') || '';
  if (accept.includes('text/html')) {
    return NextResponse.redirect(new URL('/developers#webhooks', request.url), 308);
  }

  return NextResponse.json({
    name: 'Vedang Webhooks & Event Streaming',
    description: 'Event subscription and real-time streaming interfaces for Vedang Vatsa (veda.ng).',
    documentation: 'https://veda.ng/developers#webhooks',
    manifest: 'https://veda.ng/webhooks.json',
    channels: {
      rss: 'https://veda.ng/feed.xml',
      essays_api: 'https://veda.ng/api/v1/essays',
      glossary_api: 'https://veda.ng/api/v1/glossary',
      streaming_ask: 'https://veda.ng/ask',
      mcp_server: 'https://veda.ng/.well-known/mcp',
    },
  });
}

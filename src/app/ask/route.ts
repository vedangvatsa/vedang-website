import { NextRequest } from 'next/server';
import { searchEssays, searchGlossary } from '@/lib/agent-tools';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface AskResult {
  title: string;
  url: string;
  description: string;
  type: 'essay' | 'glossary_term';
}

async function buildResults(query: string): Promise<AskResult[]> {
  const results: AskResult[] = [];
  try {
    const essays = JSON.parse(searchEssays({ query }).content[0].text);
    for (const e of essays.results ?? []) {
      results.push({ title: e.title, url: e.url, description: e.summary ?? '', type: 'essay' });
    }
  } catch {
    /* essays optional */
  }
  try {
    const terms = JSON.parse(searchGlossary({ query, limit: 5 }).content[0].text);
    for (const t of terms.results ?? []) {
      results.push({ title: t.term, url: t.url, description: t.definition_preview ?? '', type: 'glossary_term' });
    }
  } catch {
    /* glossary optional */
  }
  return results;
}

function jsonPayload(results: AskResult[]) {
  return {
    _meta: {
      response_type: 'search_results',
      version: '0.1',
      source: 'veda.ng',
      count: results.length,
    },
    results,
  };
}

export async function POST(request: NextRequest) {
  let query = '';
  let streaming = false;
  try {
    const body = (await request.json()) as { query?: string; prefer?: { streaming?: boolean } };
    query = typeof body.query === 'string' ? body.query.trim() : '';
    streaming = body.prefer?.streaming === true;
  } catch {
    return NextResponse.json(
      { _meta: { response_type: 'error', version: '0.1' }, error: { code: 'invalid_body', message: 'Body must be JSON with a "query" field.' } },
      { status: 400 }
    );
  }

  if (!query) {
    return NextResponse.json(
      { _meta: { response_type: 'error', version: '0.1' }, error: { code: 'missing_query', message: 'Provide a non-empty "query" field.' } },
      { status: 400 }
    );
  }

  if (!streaming) {
    const results = await buildResults(query);
    return NextResponse.json(jsonPayload(results), {
      headers: { 'Cache-Control': 'public, max-age=600' },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };
      send('start', { _meta: { response_type: 'search_results', version: '0.1' }, query });
      const results = await buildResults(query);
      for (const r of results) {
        send('result', r);
      }
      send('complete', { _meta: { response_type: 'complete', version: '0.1' }, count: results.length });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q') ?? request.nextUrl.searchParams.get('query') ?? '';
  if (!query) {
    return NextResponse.json(
      { _meta: { response_type: 'error', version: '0.1' }, error: { code: 'missing_query', message: 'Provide ?q=<query>.' } },
      { status: 400 }
    );
  }
  const results = await buildResults(query);
  return NextResponse.json(jsonPayload(results), {
    headers: { 'Cache-Control': 'public, max-age=600' },
  });
}

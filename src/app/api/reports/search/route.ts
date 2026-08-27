import { NextRequest, NextResponse } from 'next/server';
import { getStandardApiHeaders, jsonError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

const CONCEPT_IDS: Record<string, string> = {
  ai: 'C154945302|C11413529|C119857082', // Artificial Intelligence | Machine Learning | Deep Learning
  web3: 'C2779687700|C180706569',         // Blockchain | Cryptocurrency
};

function mapType(type: string | null): string {
  switch (type) {
    case 'journal-article': return 'Paper';
    case 'proceedings-article': return 'Paper';
    case 'book-chapter': return 'Paper';
    case 'preprint': return 'Preprint';
    case 'review': return 'Review';
    case 'dissertation': return 'Thesis';
    case 'book': return 'Book';
    default: return 'Paper';
  }
}

function deriveCategory(concepts: { display_name: string; level: number; score: number }[], corpus: string): string {
  if (!concepts || concepts.length === 0) return corpus === 'ai' ? 'AI Research' : 'Blockchain Research';

  const names = concepts.map(c => c.display_name.toLowerCase());

  if (corpus === 'ai') {
    if (names.some(n => n.includes('health') || n.includes('medic') || n.includes('clinical'))) return 'Healthcare & Science';
    if (names.some(n => n.includes('security') || n.includes('privacy') || n.includes('cyber'))) return 'Security & Defense';
    if (names.some(n => n.includes('robot') || n.includes('hardware') || n.includes('sensor'))) return 'Robotics & Hardware';
    if (names.some(n => n.includes('natural language') || n.includes('language model'))) return 'AI Research';
    if (names.some(n => n.includes('ethic') || n.includes('fairness') || n.includes('bias'))) return 'Ethics & Policy';
    if (names.some(n => n.includes('financ') || n.includes('economic'))) return 'Finance & Investment';
    if (names.some(n => n.includes('energy') || n.includes('climate'))) return 'Climate & Energy';
    return 'AI Research';
  } else {
    if (names.some(n => n.includes('supply chain') || n.includes('logistics'))) return 'Supply Chain';
    if (names.some(n => n.includes('defi') || n.includes('decentralized finance'))) return 'DeFi & DEXs';
    if (names.some(n => n.includes('nft') || n.includes('non-fungible'))) return 'NFTs & Digital Assets';
    if (names.some(n => n.includes('security') || n.includes('privacy') || n.includes('zero knowledge'))) return 'Security & Privacy';
    if (names.some(n => n.includes('regulat') || n.includes('governance') || n.includes('compliance'))) return 'Regulation & Compliance';
    if (names.some(n => n.includes('iot') || n.includes('internet of things'))) return 'IoT & Infrastructure';
    if (names.some(n => n.includes('health') || n.includes('medic'))) return 'Healthcare';
    if (names.some(n => n.includes('smart contract'))) return 'Smart Contracts';
    return 'Blockchain Research';
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();
  const corpus = searchParams.get('corpus') || 'ai';
  const limit = Math.min(parseInt(searchParams.get('limit') || searchParams.get('per_page') || '50', 10), 200);
  const cursor = searchParams.get('cursor');
  const idempotencyKey = request.headers.get('Idempotency-Key');

  let page = 1;
  if (cursor) {
    const decodedPage = parseInt(Buffer.from(cursor, 'base64').toString('utf8'), 10);
    if (!isNaN(decodedPage) && decodedPage >= 1) {
      page = decodedPage;
    }
  } else if (searchParams.get('page')) {
    page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
  }

  if (!query || query.length < 2) {
    // No query — return schema/capability description so discovery probes get a 200
    return NextResponse.json(
      {
        endpoint: 'GET /api/v1/reports/search',
        description: 'Search 233,000+ indexed academic papers via OpenAlex in the AI or Web3 corpus.',
        parameters: {
          q: { type: 'string', required: true, description: 'Search query (min 2 chars). Example: agents' },
          corpus: { type: 'string', enum: ['ai', 'web3'], default: 'ai', description: 'Corpus to search.' },
          limit: { type: 'number', default: 50, max: 200, description: 'Results per page.' },
          page: { type: 'number', default: 1, description: 'Page number.' },
          cursor: { type: 'string', description: 'Opaque cursor for pagination (base64-encoded page number).' },
        },
        example: '/api/v1/reports/search?q=agents&corpus=ai&limit=10',
        docs: 'https://veda.ng/developers',
        openapi: 'https://veda.ng/openapi.json',
      },
      { headers: { 'Cache-Control': 'public, max-age=3600', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  const conceptFilter = CONCEPT_IDS[corpus] || CONCEPT_IDS.ai;

  const params = new URLSearchParams({
    search: query,
    filter: `concepts.id:${conceptFilter}`,
    sort: 'cited_by_count:desc',
    page: page.toString(),
    per_page: limit.toString(),
    select: 'id,title,type,publication_year,doi,cited_by_count,primary_location,concepts',
    mailto: 'vatsvedang@gmail.com',
  });

  const apiUrl = `https://api.openalex.org/works?${params.toString()}`;

  try {
    const res = await fetch(apiUrl, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return jsonError(
        'upstream_openalex_error',
        `OpenAlex API responded with status ${res.status}`,
        502,
        'Retry your request after 60 seconds.'
      );
    }

    const data = await res.json();
    const total = data.meta?.count || 0;
    const hasMore = page * limit < total;
    const nextCursor = hasMore ? Buffer.from(String(page + 1)).toString('base64') : null;

    const results = (data.results || []).map((work: any) => {
      const doi = work.doi;
      const primaryUrl = work.primary_location?.landing_page_url;
      const url = doi || primaryUrl || `https://openalex.org/works/${work.id?.replace('https://openalex.org/', '')}`;
      const source = work.primary_location?.source?.display_name || 'OpenAlex';

      return {
        title: work.title || 'Untitled',
        source,
        url,
        date: work.publication_year?.toString() || '',
        category: deriveCategory(work.concepts || [], corpus),
        type: mapType(work.type),
        citations: work.cited_by_count || 0,
      };
    });

    const headers = getStandardApiHeaders({ idempotencyKey, cacheSeconds: 3600 });

    return NextResponse.json(
      {
        total,
        limit,
        has_more: hasMore,
        next_cursor: nextCursor,
        pagination: {
          total,
          limit,
          has_more: hasMore,
          cursor: cursor || null,
          next_cursor: nextCursor,
        },
        results,
        corpus,
      },
      { headers }
    );
  } catch {
    return jsonError(
      'upstream_fetch_error',
      'Failed to fetch records from OpenAlex research database.',
      502,
      'Retry after 60 seconds.'
    );
  }
}

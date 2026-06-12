import { NextRequest, NextResponse } from 'next/server';

const CONCEPT_IDS: Record<string, string> = {
  ai: 'C154945302|C11413529|C119857082', // Artificial Intelligence | Machine Learning | Deep Learning
  web3: 'C2779687700|C180706569',         // Blockchain | Cryptocurrency
};

// Map OpenAlex work type to display type
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

// Derive a category from OpenAlex concepts
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
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = Math.min(parseInt(searchParams.get('per_page') || '50', 10), 200);

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], total: 0 });
  }

  const conceptFilter = CONCEPT_IDS[corpus] || CONCEPT_IDS.ai;

  // Build OpenAlex API URL
  // https://docs.openalex.org/api-entities/works
  const params = new URLSearchParams({
    search: query,
    filter: `concepts.id:${conceptFilter}`,
    sort: 'cited_by_count:desc',
    page: page.toString(),
    per_page: perPage.toString(),
    select: 'id,title,type,publication_year,doi,cited_by_count,primary_location,concepts',
    mailto: 'vedangvats@gmail.com', // polite pool for faster rate limits
  });

  const apiUrl = `https://api.openalex.org/works?${params.toString()}`;

  try {
    const res = await fetch(apiUrl, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'OpenAlex API error', status: res.status },
        { status: 502 }
      );
    }

    const data = await res.json();
    const total = data.meta?.count || 0;

    const results = (data.results || []).map((work: any) => {
      // Get the best URL: DOI > primary location > OpenAlex page
      const doi = work.doi;
      const primaryUrl = work.primary_location?.landing_page_url;
      const url = doi || primaryUrl || `https://openalex.org/works/${work.id?.replace('https://openalex.org/', '')}`;

      // Get source name
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

    return NextResponse.json({ results, total, page, perPage });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch from OpenAlex' },
      { status: 502 }
    );
  }
}

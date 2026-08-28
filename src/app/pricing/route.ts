import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  const accept = request.headers.get('accept') || '';
  const pricingMdPath = path.join(process.cwd(), 'public', 'pricing.md');
  const content = fs.existsSync(pricingMdPath) ? fs.readFileSync(pricingMdPath, 'utf8') : '# Pricing\n100% Free and Open-Access.';

  if (accept.includes('application/json')) {
    return NextResponse.json({
      name: 'Vedang Vatsa Pricing & Access',
      url: 'https://veda.ng/pricing',
      pricing_model: 'free',
      currency: 'USD',
      tiers: [
        {
          name: 'Free / Open Access',
          price: 0,
          billing: 'monthly',
          features: [
            '233,000+ academic paper search',
            'Full essays and research access',
            'All course curricula and glossaries',
            'Unauthenticated Model Context Protocol (MCP) servers',
            'Public REST API with 60 req/min rate limit',
          ],
        },
      ],
      documentation: 'https://veda.ng/developers',
    });
  }

  return new Response(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}

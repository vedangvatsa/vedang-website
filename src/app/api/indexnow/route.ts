import { NextResponse } from 'next/server';
import { courseConfigs } from '@/lib/course-config';

const INDEXNOW_KEY = '8e98e43851d7462c9c210ecd4321a7fc';
const SITE_HOST = 'veda.ng';

/**
 * IndexNow API Route
 * POST /api/indexnow — Submit URLs to Bing, Yandex, and other IndexNow-compatible engines
 * GET  /api/indexnow — Submit all important URLs at once
 *
 * Usage:
 *   curl -X GET https://veda.ng/api/indexnow           (submit all pages)
 *   curl -X POST https://veda.ng/api/indexnow -d '{"urls": ["/writings", "/glossary/llm"]}'
 */

async function submitToIndexNow(urls: string[]) {
  const fullUrls = urls.map(u => u.startsWith('http') ? u : `https://${SITE_HOST}${u}`);

  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`,
    urlList: fullUrls,
  };

  const engines = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
  ];

  const results = await Promise.allSettled(
    engines.map(async (engine) => {
      const res = await fetch(engine, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return { engine, status: res.status, ok: res.ok };
    })
  );

  return results.map((r, i) => {
    if (r.status === 'fulfilled') return r.value;
    return { engine: engines[i], status: 'error', error: String(r.reason) };
  });
}

function getAllUrls(): string[] {
  // Static pages
  const urls = [
    '/', '/writings', '/glossary', '/profile', '/media',
    '/community', '/seo', '/lit',
  ];

  // All course landing pages + individual module pages
  for (const config of Object.values(courseConfigs)) {
    urls.push(config.basePath);
    urls.push(`${config.basePath}/final-exam`);
    for (const mod of config.modules) {
      urls.push(`${config.basePath}/${mod.slug}`);
    }
  }

  return urls;
}

// GET: Submit all important pages
export async function GET() {
  const allUrls = getAllUrls();

  // IndexNow accepts max 10,000 URLs per request, batch if needed
  const batchSize = 500;
  const allResults = [];

  for (let i = 0; i < allUrls.length; i += batchSize) {
    const batch = allUrls.slice(i, i + batchSize);
    const results = await submitToIndexNow(batch);
    allResults.push(...results);
  }

  return NextResponse.json({
    submitted: allUrls.length,
    urls: allUrls,
    results: allResults,
  });
}

// POST: Submit specific URLs
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const urls: string[] = body.urls || [];

    if (!urls.length) {
      return NextResponse.json({ error: 'No URLs provided' }, { status: 400 });
    }

    const results = await submitToIndexNow(urls);

    return NextResponse.json({
      submitted: urls.length,
      urls,
      results,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

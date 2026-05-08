import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const ESSAYS_DIR = path.join(process.cwd(), 'src/content/essays');
  const files = fs.readdirSync(ESSAYS_DIR).filter(f => f.endsWith('.mdx'));

  let items = '';

  for (const file of files) {
    const raw = fs.readFileSync(path.join(ESSAYS_DIR, file), 'utf-8');
    const slug = file.replace('.mdx', '');
    
    const titleMatch = raw.match(/title:\s*['"]?(.+?)['"]?\n/);
    const dateMatch = raw.match(/date:\s*['"]?(.+?)['"]?\n/);
    const descMatch = raw.match(/description:\s*['"]?(.+?)['"]?\n/);
    
    const title = titleMatch ? titleMatch[1].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') : slug;
    const dateStr = dateMatch ? dateMatch[1] : new Date().toISOString();
    const desc = descMatch ? descMatch[1].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') : '';
    
    // Convert YYYY-MM-DD to RFC-822 date
    const pubDate = new Date(dateStr).toUTCString();

    items += `
    <item>
      <title>${title}</title>
      <link>https://veda.ng/essays/${slug}</link>
      <guid>https://veda.ng/essays/${slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${desc}</description>
    </item>`;
  }

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Vedang Vatsa | Essays</title>
    <link>https://veda.ng/essays</link>
    <description>Essays on AI, technology, and the future by Vedang Vatsa.</description>
    <language>en-us</language>
    <atom:link href="https://veda.ng/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

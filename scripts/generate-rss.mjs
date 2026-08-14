import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ESSAYS_DIR = path.resolve(REPO_ROOT, 'src/content/essays');
const PUBLIC_DIR = path.resolve(REPO_ROOT, 'public');

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateRSS() {
  const files = fs.readdirSync(ESSAYS_DIR).filter((f) => f.endsWith('.mdx'));
  const essays = files.map((file) => {
    const slug = file.replace(/\.mdx$/, '');
    const raw = fs.readFileSync(path.join(ESSAYS_DIR, file), 'utf-8');
    const { data } = matter(raw);
    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      summary: data.summary || data.description || '',
    };
  });

  essays.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const items = essays.map((essay) => `
    <item>
      <title>${escapeXml(essay.title)}</title>
      <link>https://veda.ng/${essay.slug}</link>
      <guid>https://veda.ng/${essay.slug}</guid>
      <pubDate>${new Date(essay.date).toUTCString()}</pubDate>
      <description>${escapeXml(essay.summary)}</description>
    </item>`).join('');

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

  fs.writeFileSync(path.join(PUBLIC_DIR, 'feed.xml'), xml);
  console.log(`✅ Generated public/feed.xml (${essays.length} essays)`);
}

generateRSS();

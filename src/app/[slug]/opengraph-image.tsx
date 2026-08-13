import { generateOgImage, ogSize } from '@/lib/og-image';
import { essays } from '@/lib/essays';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const runtime = 'nodejs';
export const alt = 'Essay by Vedang Vatsa';
export const size = ogSize;
export const contentType = 'image/png';

function flatten(text?: string) {
  if (!text) return '';
  return String(text).replace(/\s+/g, ' ').trim();
}

function getEssayMeta(slug: string) {
  const filePath = path.join(process.cwd(), 'src', 'content', 'essays', `${slug}.mdx`);
  if (fs.existsSync(filePath)) {
    const { data } = matter(fs.readFileSync(filePath, 'utf8'));
    return {
      title: flatten(data.title) || 'Vedang Vatsa',
      summary: flatten(data.summary),
    };
  }
  const essay = essays.find((item) => item.slug === slug);
  return {
    title: flatten(essay?.title) || 'Vedang Vatsa',
    summary: flatten(essay?.summary),
  };
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { title, summary } = getEssayMeta(slug);
  const subtitle = summary.length > 180 ? `${summary.slice(0, 177).trimEnd()}...` : summary;
  return generateOgImage(title, subtitle || undefined);
}

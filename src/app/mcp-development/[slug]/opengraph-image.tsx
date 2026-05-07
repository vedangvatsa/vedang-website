import { generateOgImage, ogSize } from '@/lib/og-image';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const runtime = 'nodejs';
export const alt = 'MCP Development 101 Module';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'src', 'content', 'courses', 'mcp-development', `${slug}.mdx`);
  let title = 'MCP Development 101';
  let subtitle = 'Build AI Tool Servers';
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(raw);
    title = data.title || title;
    subtitle = data.description || subtitle;
  } catch {}
  return generateOgImage(title, subtitle);
}

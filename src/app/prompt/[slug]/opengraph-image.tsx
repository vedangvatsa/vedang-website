import { buildCourseOgImage, ogSize } from '@/lib/og-image';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const runtime = 'nodejs';
export const alt = 'Prompt Engineering 101 Module';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'src', 'content', 'courses', 'prompt', `${slug}.mdx`);
  let subtitle = 'Module';
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(raw);
    subtitle = data.title || subtitle;
  } catch {}
  return buildCourseOgImage({
    title: 'Prompt Engineering 101',
    subtitle,
    url: `veda.ng/prompt/${slug}`,
  });
}

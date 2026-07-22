import { generateTerminalOgImage, ogSize } from '@/lib/og-image';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const runtime = 'nodejs';
export const alt = 'AI Automation 101 Module';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'src', 'content', 'courses', 'automation', `${slug}.mdx`);
  let title = 'AI Automation 101';
  try { const raw = fs.readFileSync(filePath, 'utf8'); const { data } = matter(raw); title = data.title || title; } catch {}
  return generateTerminalOgImage('AI', 'Automation 101', `veda.ng/automation/${slug}`, [{ text: title, color: 'success' }]);
}

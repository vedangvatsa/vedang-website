import { generateTerminalOgImage, ogSize } from '@/lib/og-image';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const runtime = 'nodejs';
export const alt = 'Vibe Coding 101 Module';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'src', 'content', 'courses', 'vibecoding', `${slug}.mdx`);
  let title = 'Vibe Coding 1  let title = 'Vibe Coding 1  let title = 'Vibe Coding 1  let title = 'Vibe Coding 1  let title = 'Vibe Coding 1  let title = 'Vibe Coding 1  let title = 'Vibe Coding 1  let title = 'Vibe Coding 1  let title = 'Vibe Coding 1  let title = 'Vibe Coding 1  let title = 'Vibe Coding 1  let title = 'Vibe Coding 1  let title = 'Vibe Coding 1  let title = 'Vibe Coding 1  let title = 'Vibe Coding  }   let title = 'Vibge';
export const runtime = 'nodejs';
export const alt = 'Final Exam | Vibe Coding 101';
export const size = ogSize;
export const contentType = 'image/png';
export default async function Image() {
  return generateTerminalOgImage('Final', 'Exam', 'veda.ng/vibecoding/final-exam', [{ text: 'Vibe Coding 101', color: 'success' }, { text: 'certificate ready', color: 'success' }]);
}

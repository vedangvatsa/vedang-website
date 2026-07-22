import { generateTerminalOgImage, ogSize } from '@/lib/og-image';
import { getTermBySlug } from '@/lib/glossary';

export const runtime = 'nodejs';
export const alt = 'Glossary Term';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = getTermBySlug(slug);
  const title = term?.term || 'Glossary';
  return generateTerminalOgImage('AI & Web3', 'Glossary', `veda.ng/glossary/${slug}`, [{ text: title, color: 'success' }]);
}

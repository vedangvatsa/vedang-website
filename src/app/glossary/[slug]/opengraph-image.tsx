import { generateOgImage, ogSize } from '@/lib/og-image';
import { getTermBySlug, glossaryTerms } from '@/lib/glossary';

export const runtime = 'nodejs';
export const alt = 'AI & Web3 Glossary Term';
export const size = ogSize;
export const contentType = 'image/png';

export async function generateStaticParams() {
  return glossaryTerms.map((term) => ({
    slug: term.slug,
  }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = getTermBySlug(slug);
  const title = term?.term || 'Glossary';
  return generateOgImage(title, 'AI & Web3 Glossary');
}

import { generateOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'AI & Web3 Glossary';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateOgImage('AI & Web3 Glossary', 'Comprehensive Terms & Definitions');
}

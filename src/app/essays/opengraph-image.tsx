import { generateOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Essays on AI & Web3';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateOgImage('Essays & Research', 'AI, Web3 & Digital Economies');
}

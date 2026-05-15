import { generateOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'AI Reports & Research Library — 21,000+ Papers';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateOgImage('AI Reports Archive', '21,000+ Research Papers & Industry Reports');
}

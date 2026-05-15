import { generateOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Web3 Reports & Research Archive — 23,000+ Papers';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateOgImage('Web3 Reports Archive', '23,000+ Research Papers & Industry Reports');
}

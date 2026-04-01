import { generateOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Growth Marketing & SEO';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateOgImage('Growth & SEO', 'Data-Driven Marketing Strategy');
}

import { generateOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Speaking Engagements & Media';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateOgImage('Speaking & Media', 'Engagements, Interviews & Mentions');
}

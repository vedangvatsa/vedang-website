import { generateOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Vibe Coding Bootcamp - From Zero to Shipped AI App in 7 Days';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateOgImage('Vibe Coding Bootcamp', 'Ship a Real AI App in 7 Days');
}

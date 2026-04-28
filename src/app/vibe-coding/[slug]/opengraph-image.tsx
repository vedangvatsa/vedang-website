import { generateOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Vibe Coding 101 Module';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateOgImage('Vibe Coding 101', 'Build Real Apps with AI');
}

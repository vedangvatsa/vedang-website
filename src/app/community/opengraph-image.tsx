import { generateOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Community Building & Content Strategy';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateOgImage('Content & Community', 'Building Engaged Networks');
}

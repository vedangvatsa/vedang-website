import { generateOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'AI Discovery Standards';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateOgImage('AI Discovery Standards', 'Files and installer for AI crawl and agent discovery');
}

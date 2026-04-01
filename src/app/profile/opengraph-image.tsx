import { generateOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Vedang Vatsa - Full Profile';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateOgImage('Vedang Vatsa FRSA', 'Founder, Researcher, Speaker');
}

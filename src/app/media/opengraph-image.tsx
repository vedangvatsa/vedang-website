import { buildMinimalistProfileOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Speaking Engagements & Media | Vedang Vatsa';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return buildMinimalistProfileOgImage({
    name: 'Vedang Vatsa FRSA',
    role: 'Speaking & Media',
    url: 'veda.ng/media',
  });
}

import { buildMinimalistProfileOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Essays by Vedang Vatsa | veda.ng';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return buildMinimalistProfileOgImage({
    name: 'Vedang Vatsa FRSA',
    role: 'Essays & Research',
    url: 'veda.ng/essays',
  });
}

import { buildMinimalistProfileOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Bryan Johnson Blueprint Protocol - Reference Guide | Vedang Vatsa';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return buildMinimalistProfileOgImage({
    name: 'Vedang Vatsa FRSA',
    role: 'Health Protocols Reference Guide',
    url: 'veda.ng/health-protocols',
  });
}

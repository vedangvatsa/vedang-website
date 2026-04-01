import { generateOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Swarm Prediction';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateOgImage('Swarm Prediction', 'Collective Intelligence Platform');
}

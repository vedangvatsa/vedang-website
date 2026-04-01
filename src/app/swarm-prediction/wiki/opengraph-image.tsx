import { generateOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'How Swarm Prediction Works';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateOgImage('How It Works', 'Swarm Intelligence Architecture');
}

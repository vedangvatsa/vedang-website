import { generateOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Prompt Engineering 101 - AI Course';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateOgImage('Prompt Engineering 101', 'A Free, Self-Paced AI Course');
}

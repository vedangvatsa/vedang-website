import { generateOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Evidence-Based Health Protocols';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateOgImage('Health Protocols', 'Evidence-Based Wellness & Performance');
}

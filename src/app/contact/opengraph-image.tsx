import { buildMeetingOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Book a meeting with Vedang Vatsa';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return buildMeetingOgImage();
}

import { buildCourseOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Vibe Coding Bootcamp - From Zero to Shipped AI App in 7 Days';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return buildCourseOgImage({
    title: 'Vibe Coding Bootcamp',
    subtitle: '7-Day Sprint to Launch',
    url: 'veda.ng/vibecoding/bootcamp',
  });
}

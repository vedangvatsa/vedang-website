import { buildCourseOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Vibe Coding 101 - AI Software Engineering Course';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return buildCourseOgImage({
    title: 'Vibe Coding 101',
    subtitle: 'AI Software Engineering Course',
    url: 'veda.ng/vibecoding',
  });
}

import { buildCourseOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Prompt Engineering 101 - AI Course';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return buildCourseOgImage({
    title: 'Prompt Engineering 101',
    subtitle: 'Free Comprehensive Course',
    url: 'veda.ng/prompt',
  });
}

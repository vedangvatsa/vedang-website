import { buildCourseOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Final Exam | Vibe Coding 101';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return buildCourseOgImage({
    title: 'Vibe Coding 101',
    subtitle: 'Final Certification Exam',
    url: 'veda.ng/vibecoding/final-exam',
  });
}

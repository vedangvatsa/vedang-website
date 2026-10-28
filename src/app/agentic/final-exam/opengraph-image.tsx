import { buildCourseOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Final Exam | The Agentic Web';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return buildCourseOgImage({
    title: 'The Agentic Web',
    subtitle: 'Final Certification Exam',
    url: 'veda.ng/agentic/final-exam',
  });
}

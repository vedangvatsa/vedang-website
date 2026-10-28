import { buildCourseOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'The Agentic Web - Autonomous AI Agents Course';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return buildCourseOgImage({
    title: 'The Agentic Web',
    subtitle: 'Autonomous AI Agents Course',
    url: 'veda.ng/agentic',
  });
}

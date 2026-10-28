import { buildCourseOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'AI Automation 101 - Autonomous Workflows & Agents';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return buildCourseOgImage({
    title: 'AI Automation 101',
    subtitle: 'Autonomous Workflows & Agents',
    url: 'veda.ng/automation',
  });
}

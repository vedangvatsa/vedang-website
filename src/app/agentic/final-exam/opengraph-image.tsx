import { generateOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Final Exam | The Agentic Web';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateOgImage('Final Exam', 'The Agentic Web Certificate');
}

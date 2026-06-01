import { generateOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'AI Automation 101';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateOgImage('AI Automation 101', 'Automate Anything with AI Agents');
}

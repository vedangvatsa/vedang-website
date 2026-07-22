import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'The Agentic Web - AI Agents Course';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'The Agentic',
    'Web',
    'veda.ng/agentic',
    [
      { text: 'mod 1: core idea', color: 'success' },
      { text: 'mod 2: components', color: 'success' },
      { text: 'mod 3: dimensions', color: 'success' },
      { text: 'mod 4: applications', color: 'success' },
      { text: 'mod 5: future', color: 'success' },
      { text: 'mod 6: protocols', color: 'success' },
    ],
  );
}

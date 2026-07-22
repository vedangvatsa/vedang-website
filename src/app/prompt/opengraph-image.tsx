import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Prompt Engineering 101 - AI Course';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'Prompt',
    'Engineering 101',
    'veda.ng/prompt',
    [
      { text: 'mod 1: core idea', color: 'success' },
      { text: 'mod 2: techniques', color: 'success' },
      { text: 'mod 3: reasoning', color: 'success' },
      { text: 'mod 4: code prompting', color: 'success' },
      { text: 'mod 5: best practices', color: 'success' },
      { text: 'mod 6: RAG & functions', color: 'success' },
    ],
  );
}

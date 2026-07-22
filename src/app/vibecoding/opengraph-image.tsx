import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Vibe Coding 101 - Build with AI';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'Vibe',
    'Coding 101',
    'veda.ng/vibecoding',
    [
      { text: 'mod 1: philosophy', color: 'success' },
      { text: 'mod 2: toolkit', color: 'success' },
      { text: 'mod 3: prompts', color: 'success' },
      { text: 'mod 4: lab', color: 'success' },
      { text: 'mod 5: product', color: 'success' },
      { text: 'mod 6: debugging', color: 'success' },
    ],
  );
}

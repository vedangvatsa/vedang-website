import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Essays on AI & Web3';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'Essays &',
    'Research',
    'veda.ng/essays',
    [
      { text: 'AI & Web3 analysis', color: 'success' },
      { text: 'digital economies', color: 'success' },
      { text: 'data-driven essays', color: 'success' },
    ],
  );
}

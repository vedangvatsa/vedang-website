import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Book a meeting with Vedang Vatsa';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'Book a',
    'Meeting',
    'veda.ng/meeting',
    [
      { text: '$ book 30 min', color: 'command' },
      { text: 'AI strategy', color: 'success' },
      { text: 'Web3 advisory', color: 'success' },
      { text: 'speaking', color: 'success' },
    ],
  );
}

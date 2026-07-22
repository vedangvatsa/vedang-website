import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Web3 101 - Blockchain Fundamentals Course';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'Web3',
    '101',
    'veda.ng/web3',
    [
      { text: 'mod 1: the vision', color: 'success' },
      { text: 'mod 2: blockchain', color: 'success' },
      { text: 'mod 3: contracts', color: 'success' },
      { text: 'mod 4: ecosystem', color: 'success' },
      { text: 'mod 5: getting started', color: 'success' },
      { text: 'mod 6: the future', color: 'success' },
    ],
  );
}

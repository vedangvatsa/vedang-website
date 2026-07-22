import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'How Swarm Prediction Works';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'How It',
    'Works',
    'veda.ng/swarm-prediction/wiki',
    [
      { text: 'agent architecture', color: 'success' },
      { text: 'debate protocol', color: 'success' },
      { text: 'consensus model', color: 'success' },
    ],
  );
}

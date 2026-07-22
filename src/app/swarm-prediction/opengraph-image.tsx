import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Swarm Prediction';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'Swarm',
    'Prediction',
    'veda.ng/swarm-prediction',
    [
      { text: '$ run prediction', color: 'command' },
      { text: '', color: 'success' },
      { text: 'agents debating...', color: 'success' },
      { text: 'consensus reached', color: 'success' },
      { text: 'forecast generated', color: 'success' },
    ],
  );
}

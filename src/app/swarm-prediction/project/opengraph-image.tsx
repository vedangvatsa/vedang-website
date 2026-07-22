import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Swarm Prediction Project';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'Swarm',
    'Prediction',
    'veda.ng/swarm-prediction',
    [
      { text: 'multi-agent debate', color: 'success' },
      { text: 'collective forecast', color: 'success' },
      { text: 'any data input', color: 'success' },
    ],
  );
}

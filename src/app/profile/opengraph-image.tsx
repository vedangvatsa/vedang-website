import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Vedang Vatsa - Full Profile';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'Vedang',
    'Vatsa FRSA',
    'veda.ng/profile',
    [
      { text: 'Computer Engineer', color: 'success' },
      { text: 'MBA, Chartered Eng', color: 'success' },
      { text: 'Founder, Researcher', color: 'success' },
      { text: 'Speaker, FRSA', color: 'success' },
    ],
  );
}

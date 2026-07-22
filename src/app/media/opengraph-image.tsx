import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Speaking Engagements & Media';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'Speaking',
    '& Media',
    'veda.ng/media',
    [
      { text: 'conference talks', color: 'success' },
      { text: 'interviews', color: 'success' },
      { text: 'media features', color: 'success' },
      { text: 'AI & Web3 topics', color: 'success' },
    ],
  );
}

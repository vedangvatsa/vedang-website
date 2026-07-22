import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'AI Reports & Research Library - 250M+ Papers';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'AI Reports',
    'Library',
    'veda.ng/ailib',
    [
      { text: 'searching...', color: 'command' },
      { text: '', color: 'success' },
      { text: '250M+ papers', color: 'success' },
      { text: '133K+ reports', color: 'success' },
      { text: 'OpenAlex indexed', color: 'success' },
    ],
  );
}

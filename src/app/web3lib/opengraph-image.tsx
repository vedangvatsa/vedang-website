import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Web3 Reports & Research Archive - 250M+ Papers';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'Web3',
    'Reports Library',
    'veda.ng/web3lib',
    [
      { text: 'searching...', color: 'command' },
      { text: '', color: 'success' },
      { text: '250M+ papers', color: 'success' },
      { text: '100K+ Web3 reports', color: 'success' },
      { text: 'OpenAlex indexed', color: 'success' },
    ],
  );
}

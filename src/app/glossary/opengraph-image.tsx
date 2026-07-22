import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'AI & Web3 Glossary';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'AI & Web3',
    'Glossary',
    'veda.ng/glossary',
    [
      { text: '$ search terms', color: 'command' },
      { text: '', color: 'success' },
      { text: 'AI terms     indexed', color: 'success' },
      { text: 'Web3 terms   indexed', color: 'success' },
      { text: 'definitions  ready', color: 'success' },
    ],
  );
}

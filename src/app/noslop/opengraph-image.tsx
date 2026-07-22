import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'NoSlop - Anti-slop agent prompt';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'No',
    'Slop',
    'veda.ng/noslop',
    [
      { text: '$ curl veda.ng/noslop.md', color: 'command' },
      { text: '', color: 'success' },
      { text: 'anti-slop prompt', color: 'success' },
      { text: 'installed to CLAUDE.md', color: 'success' },
    ],
  );
}

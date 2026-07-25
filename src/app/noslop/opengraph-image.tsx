import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'NoSlop: standing agent law against AI slop';
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
      { text: 'agent law: prose, UI, code', color: 'success' },
      { text: 'install into CLAUDE.md', color: 'success' },
    ],
  );
}

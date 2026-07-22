import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Vibe Coding Bootcamp - From Zero to Shipped AI App in 7 Days';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'Vibe Coding',
    'Bootcamp',
    'veda.ng/vibecoding/bootcamp',
    [
      { text: 'day 1: setup', color: 'success' },
      { text: 'day 3: first app', color: 'success' },
      { text: 'day 5: database', color: 'success' },
      { text: 'day 7: deployed', color: 'success' },
    ],
  );
}

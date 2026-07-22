import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Community Building & Content Strategy';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'Content &',
    'Community',
    'veda.ng/community',
    [
      { text: '100K+ members', color: 'success' },
      { text: '90M impressions/yr', color: 'success' },
      { text: 'content strategy', color: 'success' },
      { text: 'organic acquisition', color: 'success' },
    ],
  );
}

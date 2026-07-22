import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Evidence-Based Health Protocols';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'Health',
    'Protocols',
    'veda.ng/health-protocols',
    [
      { text: '327 protocols', color: 'success' },
      { text: '1,876 videos analyzed', color: 'success' },
      { text: 'timestamped sources', color: 'success' },
      { text: 'ranked by frequency', color: 'success' },
    ],
  );
}

import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Growth Marketing & SEO';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'Growth',
    '& SEO',
    'veda.ng/seo',
    [
      { text: '40x organic growth', color: 'success' },
      { text: '100K+ community', color: 'success' },
      { text: '90M impressions/yr', color: 'success' },
      { text: '8+ years experience', color: 'success' },
    ],
  );
}

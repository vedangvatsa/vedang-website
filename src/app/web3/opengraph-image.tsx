import { buildCourseOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Web3 101 - Blockchain Fundamentals Course';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return buildCourseOgImage({
    title: 'Web3 101',
    subtitle: 'Decentralized Systems & Blockchain',
    url: 'veda.ng/web3',
  });
}

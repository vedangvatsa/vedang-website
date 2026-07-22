import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Final Exam | Web3 101';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage('Final', 'Exam', 'veda.ng/web3/final-exam', [
    { text: 'Web3 101', color: 'success' },
    { text: 'certificate ready', color: 'success' },
  ]);
}

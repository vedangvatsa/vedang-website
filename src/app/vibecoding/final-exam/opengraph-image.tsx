import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Final Exam | Vibe Coding 101';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage('Final', 'Exam', 'veda.ng/vibecoding/final-exam', [
    { text: 'Vibe Coding 101', color: 'success' },
    { text: 'certificate ready', color: 'success' },
  ]);
}

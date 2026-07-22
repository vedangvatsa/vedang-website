import { generateTerminalOgImage, ogSize } from '@/lib/og-image';
export const runtime = 'nodejs';
export const alt = 'Final Exam | Prompt Engineering 101';
export const size = ogSize;
export const contentType = 'image/png';
export default async function Image() {
  return generateTerminalOgImage('Final', 'Exam', 'veda.ng/prompt/final-exam', [{ text: 'Prompt Engineering 101', color: 'success' }, { text: 'certificate ready', color: 'success' }]);
}

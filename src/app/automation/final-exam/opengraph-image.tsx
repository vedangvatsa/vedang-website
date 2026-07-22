import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Final Exam | AI Automation 101';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage('Final', 'Exam', 'veda.ng/automation/final-exam', [
    { text: 'AI Automation 101', color: 'success' },
    { text: 'certificate ready', color: 'success' },
  ]);
}

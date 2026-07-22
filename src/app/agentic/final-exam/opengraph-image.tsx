import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Final Exam | The Agentic Web';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage('Final', 'Exam', 'veda.ng/agentic/final-exam', [
    { text: 'The Agentic Web', color: 'success' },
    { text: 'certificate ready', color: 'success' },
  ]);
}

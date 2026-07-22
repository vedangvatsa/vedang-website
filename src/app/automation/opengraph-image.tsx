import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'AI Automation 101';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'AI',
    'Automation 101',
    'veda.ng/automation',
    [
      { text: 'mod 1: mindset', color: 'success' },
      { text: 'mod 2: APIs', color: 'success' },
      { text: 'mod 3: no-code', color: 'success' },
      { text: 'mod 4: AI agents', color: 'success' },
      { text: 'mod 5: MCP automation', color: 'success' },
      { text: 'mod 6: pipelines', color: 'success' },
    ],
  );
}

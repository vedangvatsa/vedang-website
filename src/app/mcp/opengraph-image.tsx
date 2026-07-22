import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'MCP Development 101';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'MCP',
    'Development 101',
    'veda.ng/mcp',
    [
      { text: '$ npx create-mcp', color: 'command' },
      { text: '', color: 'success' },
      { text: 'mod 1: what is MCP', color: 'success' },
      { text: 'mod 2: transports', color: 'success' },
      { text: 'mod 3: first server', color: 'success' },
      { text: 'mod 4: primitives', color: 'success' },
      { text: 'mod 5: clients', color: 'success' },
    ],
  );
}

import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'AI Discovery Standards';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'AI Discovery',
    'Standards',
    'github.com/vedangvatsa/aistandards',
    [
      { text: '$ npx aistandards', color: 'command' },
      { text: '', color: 'success' },
      { text: 'robots.txt   done', color: 'success' },
      { text: 'llms.txt     done', color: 'success' },
      { text: 'sitemap.xml  done', color: 'success' },
      { text: 'JSON-LD      done', color: 'success' },
    ],
  );
}

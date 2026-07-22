import { generateTerminalOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'The Site Checklist - HTML, Accessibility, Security, SEO, Agent Readiness';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateTerminalOgImage(
    'The Site',
    'Checklist',
    'veda.ng/sitecheck',
    [
      { text: '$ curl -sI your-site.com', color: 'command' },
      { text: '', color: 'success' },
      { text: 'robots.txt    200 OK', color: 'success' },
      { text: 'llms.txt      200 OK', color: 'success' },
      { text: 'sitemap.xml   200 OK', color: 'success' },
      { text: 'security.txt  200 OK', color: 'success' },
      { text: 'schema.org    200 OK', color: 'success' },
    ],
  );
}

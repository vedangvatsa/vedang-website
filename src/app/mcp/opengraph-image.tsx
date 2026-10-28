import { buildCourseOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Model Context Protocol (MCP) Development 101';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return buildCourseOgImage({
    title: 'Model Context Protocol (MCP)',
    subtitle: 'Free Developer Course',
    url: 'veda.ng/mcp',
  });
}

import { buildCourseOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'Final Exam | Model Context Protocol (MCP)';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return buildCourseOgImage({
    title: 'Model Context Protocol (MCP)',
    subtitle: 'Final Certification Exam',
    url: 'veda.ng/mcp/final-exam',
  });
}

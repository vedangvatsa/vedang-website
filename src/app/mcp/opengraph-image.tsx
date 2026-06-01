import { generateOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'MCP Development 101';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateOgImage('MCP Development 101', 'Build AI Tool Servers with the Model Context Protocol');
}

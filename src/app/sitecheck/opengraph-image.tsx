import { generateOgImage, ogSize } from '@/lib/og-image';

export const runtime = 'nodejs';
export const alt = 'The Site Checklist - HTML, Accessibility, Security, SEO, Agent Readiness';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return generateOgImage('The Site Checklist', 'HTML, Accessibility, Security, SEO, Agent Readiness');
}

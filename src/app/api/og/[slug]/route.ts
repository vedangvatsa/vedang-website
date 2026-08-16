import { buildPageOgImage } from '@/lib/og-image';

export const runtime = 'nodejs';
export const revalidate = 86400;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const image = buildPageOgImage(slug);
  if (!image) {
    return new Response('Not found', { status: 404 });
  }
  return image;
}

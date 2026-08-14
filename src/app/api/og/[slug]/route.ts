import { buildEssayOgImage } from '@/lib/og-image';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const image = buildEssayOgImage(slug);
  if (!image) {
    return new Response('Not found', { status: 404 });
  }
  return image;
}

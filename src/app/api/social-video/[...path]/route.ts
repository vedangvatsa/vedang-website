import { serveSocialVideo, socialVideoHeaders } from '@/lib/social-video';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ path: string[] }> };

export async function GET(request: Request, context: Context) {
  return serveSocialVideo(request, (await context.params).path);
}

export const HEAD = GET;

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: socialVideoHeaders() });
}

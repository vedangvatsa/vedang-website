import { serveSocialVideo, socialVideoHeaders } from '../../src/lib/social-video';

const PREFIX = '/api/social-video/';

export default {
  async fetch(request: Request): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (!pathname.startsWith(PREFIX)) {
      return new Response('Not found', { status: 404 });
    }
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: socialVideoHeaders() });
    }
    return serveSocialVideo(request, pathname.slice(PREFIX.length).split('/'));
  },
};

// Farcaster's client recognizes HLS playlists; MP4s remain available as media files.
export const SOCIAL_VIDEO_ORIGIN = 'https://raw.githubusercontent.com/vedangvatsa/vedang-website';
export const HLS_CONTENT_TYPE = 'application/vnd.apple.mpegurl';
export const HLS_CONTENT_TYPE_PATTERN = /^application\/(?:vnd\.apple\.mpegurl|x-mpegurl)(?:;|$)/i;
const VIDEO_PATH = /^scripts\/(?:viz-assets\/videos|viz-batch2-assets\/(?:videos|no-attribution)|thread-assets\/(?:linkedin-rewrites|ig-reels))\/(?:[a-zA-Z0-9_-]+\.mp4|hls\/[a-zA-Z0-9_-]+\.(?:m3u8|mp4))$/;
const VIDEO_REF = /^(?:main|[a-f0-9]{40})$/;
const COMMIT_REF = /^[a-f0-9]{40}$/;

export function socialVideoSource(asset: string, ref = 'main'): string {
  if (!VIDEO_PATH.test(asset) || !VIDEO_REF.test(ref)) throw new Error('Invalid social video path or revision');
  return `${SOCIAL_VIDEO_ORIGIN}/${ref}/${asset}`;
}

export function farcasterPlaylistAsset(asset: string): string {
  socialVideoSource(asset);
  if (asset.endsWith('.m3u8')) return asset;
  return asset.replace(/(?:\/hls)?\/([^/]+)\.mp4$/, '/hls/$1.m3u8');
}

export function farcasterVideoUrl(source: string, proxyBase = 'https://veda.ng/api/social-video'): string {
  const url = new URL(source);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Farcaster video must use public HTTPS');
  if (url.hostname !== 'raw.githubusercontent.com') return url.href;
  const match = /^\/vedangvatsa\/vedang-website\/(main|[a-f0-9]{40})\/(.+)$/.exec(url.pathname);
  if (!match) throw new Error('Unsupported GitHub Raw video URL');
  const [, ref, asset] = match;
  socialVideoSource(asset, ref);
  const base = new URL(proxyBase);
  if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash) {
    throw new Error('Farcaster media proxy must use public HTTPS without query parameters');
  }
  // A revision in the path also pins the playlist's relative media URLs.
  const result = new URL(`${base.href.replace(/\/$/, '')}/${ref === 'main' ? '' : `${ref}/`}${farcasterPlaylistAsset(asset)}`);
  return result.href;
}

export function socialVideoHeaders(): Headers {
  return new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Range, If-Range',
    'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges, ETag, Last-Modified',
    'X-Content-Type-Options': 'nosniff',
  });
}

export async function serveSocialVideo(request: Request, segments: string[], fetcher: typeof fetch = fetch): Promise<Response> {
  const headers = socialVideoHeaders();
  const fail = (status: number, message: string) => {
    headers.set('Cache-Control', 'no-store');
    return new Response(request.method === 'HEAD' ? null : message, { status, headers });
  };
  let source: string;
  let playlist = false;
  try {
    const pinned = COMMIT_REF.test(segments[0] || '');
    const asset = (pinned ? segments.slice(1) : segments).join('/');
    const queryRef = new URL(request.url).searchParams.get('ref');
    const ref = pinned ? segments[0] : queryRef || 'main';
    if (pinned && queryRef && queryRef !== ref) throw new Error('Conflicting revision');
    playlist = asset.endsWith('.m3u8');
    if (playlist && ref !== 'main' && !pinned) throw new Error('HLS revisions must use a path prefix');
    source = socialVideoSource(asset, ref);
  } catch { return fail(404, 'Video not found'); }
  if (!['GET', 'HEAD'].includes(request.method)) return fail(405, 'Method not allowed');
  const range = request.headers.get('range');
  if (range && !/^bytes=(?:\d+-\d*|-\d+)$/.test(range)) return fail(400, 'A single byte range is required');
  const upstreamHeaders = new Headers({ 'Accept-Encoding': 'identity' });
  if (range) upstreamHeaders.set('Range', range);
  if (request.headers.has('if-range')) upstreamHeaders.set('If-Range', request.headers.get('if-range')!);
  let upstream: Response;
  try {
    upstream = await fetcher(source, {
      method: request.method, headers: upstreamHeaders, redirect: 'manual',
      cache: 'no-store', signal: AbortSignal.timeout(30000),
    });
  } catch (error) {
    console.error(JSON.stringify({ event: 'social_video_origin_unavailable', message: error instanceof Error ? error.message : 'Fetch failed' }));
    return fail(502, 'Video origin unavailable');
  }
  if (upstream.status === 416) {
    if (upstream.headers.has('content-range')) headers.set('Content-Range', upstream.headers.get('content-range')!);
    await upstream.body?.cancel();
    return fail(416, 'Requested range not satisfiable');
  }
  if (![200, 206].includes(upstream.status)) {
    await upstream.body?.cancel();
    return fail(upstream.status === 404 ? 404 : 502, 'Video origin unavailable');
  }
  const type = upstream.headers.get('content-type') || '';
  const allowedType = playlist
    ? HLS_CONTENT_TYPE_PATTERN.test(type) || /^(?:text\/plain|application\/octet-stream)(?:;|$)/i.test(type)
    : /^(?:video\/mp4|application\/octet-stream)(?:;|$)/i.test(type);
  if (!allowedType) {
    await upstream.body?.cancel();
    return fail(502, 'Video origin did not return media');
  }
  for (const key of ['content-length', 'content-range', 'etag', 'last-modified']) {
    if (upstream.headers.has(key)) headers.set(key, upstream.headers.get(key)!);
  }
  headers.set('Content-Type', playlist ? HLS_CONTENT_TYPE : 'video/mp4');
  headers.set('Content-Disposition', 'inline');
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Cache-Control', 'public, max-age=300, s-maxage=3600');
  if (request.method === 'HEAD') await upstream.body?.cancel();
  return new Response(request.method === 'HEAD' ? null : upstream.body, { status: upstream.status, headers });
}

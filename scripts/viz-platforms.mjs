export const BUFFER_PLATFORMS = ['youtube', 'instagram', 'tiktok'];
export const DIRECT_PLATFORMS = ['linkedin', 'x', 'bluesky', 'facebook', 'threads', 'tumblr', 'mastodon', 'farcaster'];

export function configuredDirectPlatforms(value = process.env.VIZ_DIRECT_PLATFORMS || '') {
  if (!value.trim()) return [];
  const selected = value.trim() === 'all' ? [...DIRECT_PLATFORMS] : [...new Set(value.split(',').map(s => s.trim()).filter(Boolean))];
  for (const platform of selected) {
    if (!DIRECT_PLATFORMS.includes(platform)) throw new Error(`Unknown direct platform ${platform}`);
  }
  return selected;
}

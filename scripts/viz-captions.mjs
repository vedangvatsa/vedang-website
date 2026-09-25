// Caption prose is separate from platform transport and queue state.
export const LIMITS = { youtube: 5000, instagram: 2200, tiktok: 2200, linkedin: 3000, facebook: 2000, threads: 500, bluesky: 300, x: 280, tumblr: 2000, mastodon: 500, farcaster: 1024 };
export function captionLength(platform, text) {
  if (platform === 'x') {
    // All generated prose is Latin text. X counts each URL as 23 characters.
    return Array.from(text.replace(/https?:\/\/\S+/g, 'x'.repeat(23))).reduce((n, c) => n + (c.codePointAt(0) > 0x10ff ? 2 : 1), 0);
  }
  if (platform === 'bluesky') return [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(text)].length;
  if (platform === 'farcaster') return Buffer.byteLength(text, 'utf8');
  return Array.from(text).length;
}

export function validateCaption(platform, text) {
  if (!Object.hasOwn(LIMITS, platform) || typeof text !== 'string' || !text.trim()) throw new Error(`Missing ${platform} caption`);
  const count = captionLength(platform, text);
  if (count > LIMITS[platform]) throw new Error(`${platform} caption is ${count}/${LIMITS[platform]}`);
  const prose = text.split('\nMusic ')[0].replace(/https?:\/\/\S+/g, '');
  if (/\b(explore|landscape|tapestry|reshape|redefine|foster|facilitate|leverage|unlock|synergy|empower|streamline)\b|game.changer|thrilled|excited to|dive into|finishes on top|zero mismatches|every value cross.checked|follow me|agree\?/i.test(prose)) throw new Error(`${platform} caption contains banned wording`);
  // The user explicitly requested a short "Data source: ..." label.
  if (/[:—–]/.test(prose.replace(/Data source: [^\n]+\.$/g, ''))) throw new Error(`${platform} caption contains an unapproved colon or long dash`);
  if ((text.match(/#[\p{L}\p{N}]+/gu) || []).length > 2) throw new Error(`${platform} caption has more than two hashtags`);
  if (text.split(/\s+/).length > 200) throw new Error(`${platform} caption exceeds 200 words`);
  return count;
}

export function conciseBufferCaption(lead, description, startYear, endYear, sourceCredit) {
  if (!lead || !description || !sourceCredit) throw new Error('Missing concise caption copy or data source');
  return `${lead}\n\n${startYear}-${endYear}. ${description} Data source: ${sourceCredit}.`;
}

export function validateConciseBufferCaption(text) {
  if (/https?:|www\.|github|music|credits|attribution|coverage varies|animation|excerpt|loudness|#/i.test(text)) throw new Error('Concise caption contains links or extra notes');
  if (!/Data source: [^\n]+\.$/.test(text) || text.split('\n\n').length !== 2) throw new Error('Concise caption must have two paragraphs and a data source label');
  if (text.split(/\s+/).length > 60) throw new Error('Concise caption exceeds 60 words');
}

export function makeCaptions({ copy, chart, number, music, conciseDescription, sourceCredit }) {
  const [label, lead] = copy;
  const years = `${chart.startYear}-${chart.endYear}`;
  const notes = `https://veda.ng/viz-notes/${String(number).padStart(2, '0')}.txt`;
  const concise = conciseBufferCaption(lead, conciseDescription, chart.startYear, chart.endYear, sourceCredit);
  validateConciseBufferCaption(concise);
  const captions = Object.fromEntries(Object.keys(LIMITS).map(platform => [platform, concise]));
  for (const [platform, text] of Object.entries(captions)) validateCaption(platform, text);
  return { captions, title: `${label} | ${years}`, notes };
}

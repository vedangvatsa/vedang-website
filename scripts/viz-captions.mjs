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
  const [label, lead, context] = copy;
  const years = `${chart.startYear}-${chart.endYear}`;
  const notes = `https://veda.ng/viz-notes/${String(number).padStart(2, '0')}.txt`;
  const source = `https://data.worldbank.org/indicator/${chart.indicator}`;
  const shortNotes = `Data + music ${notes}`;
  const coverage = 'Ten highest reported values each year. Coverage varies.';
  const motion = 'Animation fills the gaps between annual figures.';
  const credit = music.attribution
    ? `Music ${music.attribution}\n${music.licenseUrl}\n30-second excerpt with fades and adjusted loudness.`
    : `Music ${music.title.replace(/[—–]/g, '-')} by ${music.artist}. ${music.page_url}`;
  const sourceLine = `World Bank data ${source}`;
  const concise = conciseBufferCaption(lead, conciseDescription, chart.startYear, chart.endYear, sourceCredit);
  validateConciseBufferCaption(concise);
  const captions = {
    youtube: concise,
    instagram: concise,
    tiktok: concise,
    linkedin: `${lead}\n\n${context}\n\n${years}. ${coverage} ${motion}\n\n${sourceLine}\n${credit}\nFull notes and credits ${notes}`,
    facebook: `${label} from ${chart.startYear} to ${chart.endYear}, in 30 seconds.\n\n${context}\n\n${coverage} ${motion}\n${sourceLine}\n${credit}\nNotes and credits ${notes}`,
    threads: `${lead}\n\n${context}\n\n${years}. World Bank data; coverage varies.\n${shortNotes}`,
    bluesky: `${label}, ${years}.\n${context}\n\nWorld Bank data.\n${shortNotes}`,
    x: `${lead}\n${years}. World Bank data.\n\n${shortNotes}`,
    tumblr: `${label} through ${years}.\n\n${context}\n${coverage} ${motion}\n\n${sourceLine}\n${credit}\nNotes and credits ${notes}`,
    mastodon: `${label} (${years}).\n\n${context}\n\nTen highest reported values. Coverage varies; motion interpolates annual data.\n${sourceLine}\n${shortNotes}`,
    farcaster: `${label}, ${years}, in 30 seconds.\n\n${context}\n\nWorld Bank data. ${coverage}\n${shortNotes}`,
  };
  for (const [platform, text] of Object.entries(captions)) validateCaption(platform, text);
  return { captions, title: `${label} | ${years}`, notes };
}

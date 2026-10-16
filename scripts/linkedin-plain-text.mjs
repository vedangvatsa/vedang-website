// LinkedIn's Posts API interprets commentary as little-text markup.
// https://learn.microsoft.com/linkedin/marketing/community-management/shares/little-text-format
const reserved = new Set('|{}@[]()<>#\\*_~');

export function encodeLinkedInPlainText(text) {
  if (typeof text !== 'string' || !text.trim()) throw new Error('LinkedIn caption is empty');
  const encoded = Array.from(text, char => reserved.has(char) ? `\\${char}` : char).join('');
  if (Array.from(encoded).length > 3000) throw new Error('Encoded LinkedIn caption exceeds 3000 characters');
  return encoded;
}

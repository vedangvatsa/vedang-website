import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { essays } from '@/lib/essays';

export const ogSize = { width: 1200, height: 630 };

export function loadOgAssets() {
  let avatarBase64 = '';
  try {
    const iconData = fs.readFileSync(path.join(process.cwd(), 'public/images/icon.png'));
    avatarBase64 = `data:image/png;base64,${iconData.toString('base64')}`;
  } catch (e) {
    console.error('Failed to load avatar', e);
  }

  let interBold, interRegular;
  try {
    interBold = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Inter-Bold.ttf'));
    interRegular = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Inter-Regular.ttf'));
  } catch (e) {
    console.error('Failed to load fonts', e);
  }

  return { avatarBase64, interBold, interRegular };
}

function stripOgPunctuation(text: string) {
  return String(text || '')
    .replace(/[—–]/g, '-')
    .replace(/:/g, ' -')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitTitleTwoLines(title: string): [string, string] {
  const words = stripOgPunctuation(title).split(' ').filter(Boolean);
  if (words.length <= 1) return [words[0] || title, ''];
  if (words.length === 2) return [words[0], words[1]];

  const total = words.join(' ').length;
  let best = 1;
  let bestScore = Infinity;
  for (let i = 1; i < words.length; i++) {
    const left = words.slice(0, i).join(' ');
    const right = words.slice(i).join(' ');
    const balance = Math.abs(left.length - right.length);
    const overflow = Math.max(0, left.length - 22) + Math.max(0, right.length - 22);
    const preferShortFirst = left.length <= 16 ? -4 : 0;
    const score = balance + overflow * 3 + preferShortFirst;
    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
    if (left.length > total * 0.7) break;
  }
  return [words.slice(0, best).join(' '), words.slice(best).join(' ')];
}

function wrapWords(text: string, maxChars: number, maxLines: number) {
  const words = stripOgPunctuation(text).split(' ').filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) {
        const rest = [word, ...words.slice(words.indexOf(word) + 1)].join(' ');
        current = rest.length > maxChars
          ? rest.slice(0, maxChars).replace(/\s+\S*$/, '').trim()
          : rest;
        break;
      }
    } else {
      current = next;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}

function titleFontSize(line1: string, line2: string) {
  const longest = Math.max(line1.length, line2.length);
  if (longest > 26) return 44;
  if (longest > 20) return 52;
  if (longest > 16) return 64;
  if (longest > 12) return 72;
  return 82;
}

export function generateOgImage(title: string, subtitle?: string, slug?: string) {
  const [line1, line2] = splitTitleTwoLines(title);
  const url = slug ? `veda.ng/${slug}` : 'veda.ng';
  const cardLines: TerminalLine[] = [
    { text: `$ ${slug || 'essay'}`, color: 'command' },
    { text: 'essay', color: 'success' },
    { text: 'veda.ng', color: 'success' },
  ];
  return generateTerminalOgImage(line1, line2, url, cardLines, subtitle);
}

export interface TerminalLine {
  text: string;
  color: 'command' | 'success';
}

export function generateTerminalOgImage(
  titleLine1: string,
  titleLine2: string,
  url: string,
  terminalLines: TerminalLine[],
  subtitle?: string,
) {
  const { interBold, interRegular } = loadOgAssets();

  const colorMap = {
    command: '#6366f1',
    success: '#16a34a',
  };

  const line1 = stripOgPunctuation(titleLine1);
  const line2 = stripOgPunctuation(titleLine2);
  const fontSize = titleFontSize(line1, line2);
  const maxTitleChars = fontSize >= 72 ? 16 : fontSize >= 64 ? 18 : fontSize >= 52 ? 22 : 26;
  const line1Rows = wrapWords(line1, maxTitleChars, 2);
  const line2Rows = line2 ? wrapWords(line2, maxTitleChars, 2) : [];
  const subtitleLines = subtitle ? wrapWords(subtitle, 36, 2) : [];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'Inter',
          padding: '60px 70px 60px 78px',
          background: '#f8fafc',
          color: '#0f172a',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 8,
          height: '100%',
          background: '#4f46e5',
          display: 'flex',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', width: 560 }}>
          {line1Rows.map((row) => (
            <div
              key={`t1-${row}`}
              style={{
                fontSize,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: '#0f172a',
                display: 'flex',
              }}
            >
              {row}
            </div>
          ))}
          {line2Rows.map((row) => (
            <div
              key={`t2-${row}`}
              style={{
                fontSize,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: '#6366f1',
                display: 'flex',
              }}
            >
              {row}
            </div>
          ))}
          {subtitleLines.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 24 }}>
              {subtitleLines.map((row) => (
                <div
                  key={row}
                  style={{
                    fontSize: 30,
                    color: '#64748b',
                    lineHeight: 1.3,
                    display: 'flex',
                  }}
                >
                  {row}
                </div>
              ))}
            </div>
          ) : null}
          <div style={{
            fontSize: 26,
            fontWeight: 700,
            color: '#6366f1',
            display: 'flex',
            marginTop: subtitleLines.length > 0 ? 36 : 60,
          }}>
            {url}
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: 440,
          height: 420,
          borderRadius: 16,
          background: '#f1f5f9',
          border: '2px solid #cbd5e1',
          padding: '24px 28px',
        }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: '#ff5f56', display: 'flex' }} />
            <div style={{ width: 16, height: 16, borderRadius: 8, background: '#ffbd2e', display: 'flex' }} />
            <div style={{ width: 16, height: 16, borderRadius: 8, background: '#27c93f', display: 'flex' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {terminalLines.map((line, i) => (
              <div key={i} style={{ fontSize: 24, color: colorMap[line.color], display: 'flex' }}>
                {line.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
      ...(interBold && interRegular ? {
        fonts: [
          { name: 'Inter', data: interRegular, weight: 400 as const, style: 'normal' as const },
          { name: 'Inter', data: interBold, weight: 700 as const, style: 'normal' as const }
        ]
      } : {})
    }
  );
}

function flattenOgText(text?: string) {
  if (!text) return '';
  return String(text).replace(/\s+/g, ' ').trim();
}

function firstOgSentence(text: string) {
  const clean = flattenOgText(text);
  if (!clean) return '';
  const match = clean.match(/^(.+?[.!?])(?:\s|$)/);
  return match ? match[1] : clean;
}

export function buildEssayOgImage(slug: string) {
  const cleanSlug = slug.replace(/\.png$/i, '');
  const filePath = path.join(process.cwd(), 'src', 'content', 'essays', `${cleanSlug}.mdx`);
  let title = 'Vedang Vatsa';
  let summary = '';
  if (fs.existsSync(filePath)) {
    const { data } = matter(fs.readFileSync(filePath, 'utf8'));
    title = flattenOgText(data.title) || title;
    summary = flattenOgText(data.summary);
  } else {
    const essay = essays.find((item) => item.slug === cleanSlug);
    if (!essay) return null;
    title = flattenOgText(essay.title) || title;
    summary = flattenOgText(essay.summary);
  }
  return generateOgImage(title, firstOgSentence(summary) || undefined, cleanSlug);
}

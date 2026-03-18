import { NextRequest, NextResponse } from 'next/server';

// Claude 3 Haiku + prompt caching + minimal tokens = cheapest possible.
// System prompt uses cache_control so after the first call, subsequent
// calls pay only 10% of the input cost for the system prompt tokens.
// max_tokens: 150 (keeps output short and cost low).

const SYSTEM_PROMPT_EN_TO_LI = [
  'Parody "English to LinkedIn" translator. Rewrite input as a sincere LinkedIn post.',
  'NO emojis ever. 2-3 short paragraphs. Under 80 words.',
  'NEVER use hashtags. NEVER use placeholder brackets like [industry] or [name].',
  'Preserve the original tense: if they say "I want to" keep it aspirational, do not pretend they already did it.',
  'Put a blank line between each paragraph.',
  'Write in a deadpan, earnest LinkedIn voice. No exclamation marks unless ironic.',
  '',
  'NEGATIVE input: Reframe as a positive with absurd corporate euphemisms. Never use the original negative words. The humor is the gap between reality and the euphemism.',
  '"arrested for fraud" ->',
  '"Thrilled to announce I\'m starting a new chapter.',
  '',
  'I\'ve been given a unique opportunity to reflect on my professional journey from a high-security environment. This pivot taught me so much about risk management and transparency."',
  '',
  'POSITIVE input: Amplify into an over-the-top LinkedIn celebration. Turn small wins into world-changing milestones.',
  '"i had coffee" ->',
  '"Invested in a premium cognitive performance accelerant this morning.',
  '',
  'The ROI was immediate. Sometimes the smallest rituals unlock the biggest breakthroughs."',
  '',
  'NEUTRAL input: Turn mundane activities into LinkedIn-worthy professional insights with corporate language.',
  '"i had lunch and sent an email" ->',
  '"Fueled a strategic midday reset, then executed a high-priority asynchronous communication.',
  '',
  'The compound effect of intentional nutrition and timely outreach cannot be overstated."',
  '',
  'NEVER include emojis. Write like a real LinkedIn power user who takes themselves too seriously.',
].join('\n');

const SYSTEM_PROMPT_LI_TO_EN = [
  'Parody "LinkedIn to English" translator. Translate the given over-the-top corporate LinkedIn speak back into what the person actually means in blunt, honest, everyday human English.',
  'Keep it under 15 words. Be direct, cynical, and ruthlessly honest. Strip away all corporate jargon.',
  'Example: "Thrilled to announce that I have made the tough decision to transition to a new chapter..." -> "I got fired."',
  'Example: "Delivering synergistic value adds to the onboarding process..." -> "I did basically nothing today."',
  'Example: "Building my personal brand through consistent value creation..." -> "I want to be an influencer."',
  'Example: "Extremely humbled to be recognized top 10% in the company..." -> "I am bragging."',
  'Example: "I am humbled to share that after an incredible journey, I am exploring new opportunities..." -> "I am unemployed."',
  'Write ONLY the translation. Never use emojis. No preamble. Make it sound like something someone would say to a close friend over a beer.'
].join('\n');

// --- Rate limiter: max 10 requests per IP per 60 seconds ---
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const ipHits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);

  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > MAX_REQUESTS) return true;
  return false;
}

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipHits) {
    if (now > entry.resetAt) ipHits.delete(ip);
  }
}, 5 * 60_000);

// Max input length (chars)
const MAX_INPUT_LENGTH = 500;

export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json({ useLocal: true });
    }

    const { text, direction = 'en-to-li' } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: 'No input text' }, { status: 400 });
    }

    // Cap input length to limit token cost
    const trimmedText = text.trim().slice(0, MAX_INPUT_LENGTH);

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const systemPrompt = direction === 'li-to-en' ? SYSTEM_PROMPT_LI_TO_EN : SYSTEM_PROMPT_EN_TO_LI;

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: direction === 'li-to-en' ? 50 : 150,
        temperature: 0.9,
        system: [
          {
            type: 'text',
            text: systemPrompt,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [{ role: 'user', content: trimmedText }],
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('Anthropic API error:', errText);
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 });
    }

    const data = await resp.json();
    const output = data.content?.[0]?.text || '';
    return NextResponse.json({ text: output });
  } catch (err: unknown) {
    console.error('LinkedIn translate error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

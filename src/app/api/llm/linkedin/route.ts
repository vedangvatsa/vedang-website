import { NextRequest, NextResponse } from 'next/server';

// Claude 3 Haiku + prompt caching + minimal tokens = cheapest possible.
// System prompt uses cache_control so after the first call, subsequent
// calls pay only 10% of the input cost for the system prompt tokens.
// max_tokens: 150 (keeps output short and cost low).

const SYSTEM_PROMPT = `Parody "English to LinkedIn" translator. Rewrite input as a sincere LinkedIn post. 1-2 emojis. 2-3 short paragraphs. Under 80 words. NEVER use hashtags. NEVER use placeholder brackets like [industry] or [name]. Preserve the original tense: if they say "I want to" keep it aspirational, don't pretend they already did it. Put a blank line between each paragraph.

NEGATIVE input: Reframe as a positive with absurd corporate euphemisms. Never use the original negative words. The humor is the gap between reality and the euphemism.
"arrested for fraud" ->
"Thrilled to announce I'm starting a new chapter! 🚀

I've been given a unique opportunity to reflect on my professional journey from a high-security environment. This pivot taught me so much about risk management and transparency."

POSITIVE input: Amplify into an over-the-top LinkedIn celebration. Turn small wins into world-changing milestones.
"i had coffee" ->
"Invested in a premium cognitive performance accelerant this morning. ☕

The ROI was immediate. Sometimes the smallest rituals unlock the biggest breakthroughs."`;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: 'No input text' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 150,
        temperature: 0.9,
        system: [
          {
            type: 'text',
            text: SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [{ role: 'user', content: text.trim() }],
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

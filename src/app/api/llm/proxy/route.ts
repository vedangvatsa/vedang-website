import { NextRequest, NextResponse } from 'next/server';

const PROVIDER_CONFIG: Record<string, { baseUrl: string; model: string }> = {
  anthropic: { baseUrl: 'https://api.anthropic.com', model: 'claude-sonnet-4-20250514' },
  openai: { baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  gemini: { baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/', model: 'gemini-2.0-flash' },
  groq: { baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.1-70b-versatile' },
  mistral: { baseUrl: 'https://api.mistral.ai/v1', model: 'mistral-large-latest' },
  together: { baseUrl: 'https://api.together.xyz/v1', model: 'meta-llama/Llama-3-70b-chat-hf' },
  openrouter: { baseUrl: 'https://openrouter.ai/api/v1', model: 'anthropic/claude-sonnet-4-20250514' },
  deepseek: { baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, apiKey, messages, temperature = 0.7, maxTokens = 4096 } = body;

    if (!apiKey || !messages) {
      return NextResponse.json({ error: 'Missing apiKey or messages' }, { status: 400 });
    }

    const providerKey = (provider || 'anthropic').toLowerCase();
    const cfg = PROVIDER_CONFIG[providerKey] || PROVIDER_CONFIG.anthropic;

    // Anthropic uses a different API format
    if (providerKey === 'anthropic') {
      return handleAnthropic(apiKey, cfg.model, messages, temperature, maxTokens);
    }

    // All others use OpenAI-compatible format
    return handleOpenAI(apiKey, cfg.baseUrl, cfg.model, messages, temperature, maxTokens);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

async function handleAnthropic(
  apiKey: string, model: string, messages: { role: string; content: string }[],
  temperature: number, maxTokens: number
) {
  let systemText = '';
  const chatMessages: { role: string; content: string }[] = [];

  for (const m of messages) {
    if (m.role === 'system') {
      systemText += m.content + '\n';
    } else {
      chatMessages.push({ role: m.role, content: m.content });
    }
  }

  if (!chatMessages.length || chatMessages[0].role !== 'user') {
    chatMessages.unshift({ role: 'user', content: 'Please respond.' });
  }

  const payload: Record<string, unknown> = {
    model,
    max_tokens: maxTokens,
    temperature,
    messages: chatMessages,
  };
  if (systemText.trim()) {
    payload.system = systemText.trim();
  }

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    return NextResponse.json({ error: errText }, { status: resp.status });
  }

  const data = await resp.json();
  const text = data.content?.[0]?.text || '';
  return NextResponse.json({ text });
}

async function handleOpenAI(
  apiKey: string, baseUrl: string, model: string,
  messages: { role: string; content: string }[],
  temperature: number, maxTokens: number
) {
  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    return NextResponse.json({ error: errText }, { status: resp.status });
  }

  const data = await resp.json();
  const text = data.choices?.[0]?.message?.content || '';
  return NextResponse.json({ text });
}

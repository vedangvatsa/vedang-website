import { NextRequest, NextResponse } from 'next/server';
import {
  forbidden,
  getClientIp,
  isAllowedOrigin,
  isRateLimited,
  tooManyRequests,
} from '@/lib/api-auth';

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

const MAX_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 50_000;
const MAX_TOTAL_CHARS = 120_000;
const MAX_TOKENS_CAP = 4096;
const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 60_000;

type ChatMessage = { role: string; content: string };

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req)) {
      return forbidden('Origin not allowed');
    }

    const ip = getClientIp(req);
    if (isRateLimited(`llm-proxy:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
      return tooManyRequests('Rate limit exceeded. Try again shortly.');
    }

    const body = await req.json();
    const { provider, apiKey, messages, temperature = 0.7, maxTokens = 4096 } = body;

    if (!apiKey || typeof apiKey !== 'string' || apiKey.length > 500) {
      return NextResponse.json({ error: 'Missing or invalid apiKey' }, { status: 400 });
    }

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const normalized: ChatMessage[] = [];
    let totalChars = 0;

    for (const m of messages) {
      if (!m || typeof m.role !== 'string' || typeof m.content !== 'string') {
        return NextResponse.json({ error: 'Invalid message format' }, { status: 400 });
      }
      if (!['system', 'user', 'assistant'].includes(m.role)) {
        return NextResponse.json({ error: 'Invalid message role' }, { status: 400 });
      }
      if (m.content.length > MAX_MESSAGE_CHARS) {
        return NextResponse.json({ error: 'Message too large' }, { status: 400 });
      }
      totalChars += m.content.length;
      if (totalChars > MAX_TOTAL_CHARS) {
        return NextResponse.json({ error: 'Payload too large' }, { status: 400 });
      }
      normalized.push({ role: m.role, content: m.content });
    }

    const providerKey = String(provider || 'anthropic').toLowerCase();
    if (!PROVIDER_CONFIG[providerKey]) {
      return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
    }

    const cfg = PROVIDER_CONFIG[providerKey];
    const safeTemp =
      typeof temperature === 'number' && temperature >= 0 && temperature <= 2
        ? temperature
        : 0.7;
    const safeMaxTokens = Math.min(
      Math.max(1, Number(maxTokens) || 1024),
      MAX_TOKENS_CAP
    );

    if (providerKey === 'anthropic') {
      return handleAnthropic(apiKey, cfg.model, normalized, safeTemp, safeMaxTokens);
    }

    return handleOpenAI(apiKey, cfg.baseUrl, cfg.model, normalized, safeTemp, safeMaxTokens);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

async function handleAnthropic(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  temperature: number,
  maxTokens: number
) {
  let systemText = '';
  const chatMessages: ChatMessage[] = [];

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
  apiKey: string,
  baseUrl: string,
  model: string,
  messages: ChatMessage[],
  temperature: number,
  maxTokens: number
) {
  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
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

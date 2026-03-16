/**
 * LLM Client - calls through the /api/llm/proxy route.
 * All LLM calls go: browser -> Next.js API route -> LLM provider.
 * The API key passes through and is never stored server-side.
 */

export interface LLMConfig {
  provider: string;
  apiKey: string;
}

export async function llmComplete(
  config: LLMConfig,
  messages: { role: string; content: string }[],
  opts: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
  const maxRetries = 4;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const resp = await fetch('/api/llm/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: config.provider,
          apiKey: config.apiKey,
          messages,
          temperature: opts.temperature ?? 0.7,
          maxTokens: opts.maxTokens ?? 4096,
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: resp.statusText }));
        const errMsg = errData.error || resp.statusText;

        // Rate limited - wait and retry
        if (resp.status === 429 || errMsg.toLowerCase().includes('rate')) {
          const wait = Math.min(15 * Math.pow(2, attempt), 60) * 1000;
          await delay(wait);
          lastError = new Error(errMsg);
          continue;
        }
        throw new Error(errMsg);
      }

      const data = await resp.json();
      let text = data.text || '';
      // Strip thinking tags
      text = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      return text;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const wait = Math.min(Math.pow(2, attempt) * 1000, 30000);
      await delay(wait);
    }
  }

  throw lastError || new Error('LLM call failed');
}

export async function llmCompleteJSON(
  config: LLMConfig,
  messages: { role: string; content: string }[],
  opts: { temperature?: number; maxTokens?: number } = {}
): Promise<Record<string, unknown> | unknown[]> {
  const raw = await llmComplete(config, messages, opts);
  return parseJSON(raw);
}

function parseJSON(raw: string): Record<string, unknown> | unknown[] {
  if (!raw || !raw.trim()) return {};
  let text = raw.trim();

  // Strip markdown fences
  text = text.replace(/^```(?:json)?\s*\n?/i, '');
  text = text.replace(/\n?```\s*$/, '').trim();

  // Try direct parse
  try { return JSON.parse(text); } catch { /* continue */ }

  // Find JSON object
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try { return JSON.parse(objMatch[0]); } catch { /* continue */ }
  }

  // Find JSON array
  const arrMatch = text.match(/\[[\s\S]*\]/);
  if (arrMatch) {
    try { return JSON.parse(arrMatch[0]); } catch { /* continue */ }
  }

  return {};
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

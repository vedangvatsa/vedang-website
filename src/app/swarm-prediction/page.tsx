'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ChevronDown } from 'lucide-react';

const PROVIDERS = [
  { key: 'anthropic', label: 'Anthropic' },
  { key: 'openai', label: 'OpenAI' },
  { key: 'gemini', label: 'Google Gemini' },
  { key: 'groq', label: 'Groq' },
  { key: 'mistral', label: 'Mistral AI' },
  { key: 'together', label: 'Together AI' },
  { key: 'openrouter', label: 'OpenRouter' },
  { key: 'deepseek', label: 'DeepSeek' },
];

const DEPTHS = [
  { value: 'quick', label: 'Quick', desc: '10 agents, 4 rounds, ~1 min' },
  { value: 'balanced', label: 'Balanced', desc: '30 agents, 8 rounds, ~3 min' },
  { value: 'deep', label: 'Deep', desc: '50 agents, 12 rounds, ~8 min' },
  { value: 'maximum', label: 'Maximum', desc: '100 agents, 16 rounds, ~15 min' },
];

export default function SwarmPredictionPage() {
  const router = useRouter();
  const [goal, setGoal] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [provider, setProvider] = useState('anthropic');
  const [apiKey, setApiKey] = useState('');
  const [depth, setDepth] = useState('balanced');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!goal.trim() || !apiKey.trim()) return;
    setLoading(true);

    // Store config in sessionStorage for the project page to pick up
    const runId = `run_${Date.now().toString(36)}`;
    sessionStorage.setItem(`swarm_${runId}`, JSON.stringify({
      goal: goal.trim(),
      sourceText: sourceText.trim(),
      provider,
      apiKey,
      depth,
    }));

    router.push(`/swarm-prediction/project/${runId}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-xl space-y-8">
          <div className="text-center space-y-3">
            <Image src="/images/swarm/swarm.png" alt="Swarm illustration" width={160} height={160} className="mx-auto" priority />
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight">
              Swarm Intelligence Prediction
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Multi-agent AI debate to forecast outcomes from any data
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Run a swarm intelligence prediction">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Prediction question
              </label>
              <input
                id="prediction-question"
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Will AI agents replace SaaS by 2027?"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Source material (optional)
              </label>
              <textarea
                id="source-material"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Paste articles, reports, or data to ground the prediction..."
                rows={4}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Advanced settings
              <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>

            {showAdvanced && (
              <div className="space-y-4 rounded-md border border-border p-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    LLM Provider
                  </label>
                  <select
                    id="llm-provider"
                    aria-label="Select LLM provider"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {PROVIDERS.map((p) => (
                      <option key={p.key} value={p.key}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Simulation depth
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {DEPTHS.map((d) => (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => setDepth(d.value)}
                        className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                          depth === d.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <span className="font-medium">{d.label}</span>
                        <span className="block text-xs text-muted-foreground mt-0.5">{d.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5">
                API Key
              </label>
              <input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Your API key (stored locally, never saved)"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Proxied through HTTPS, used once per LLM call, then discarded. Never logged.
              </p>
            </div>

            <button
              id="run-prediction-btn"
              type="submit"
              disabled={loading || !goal.trim() || !apiKey.trim()}
              className="w-full rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Starting...' : 'Run prediction'}
            </button>

            <div className="text-center">
              <Link
                href="/swarm-prediction/wiki"
                className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
              >
                How it works
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

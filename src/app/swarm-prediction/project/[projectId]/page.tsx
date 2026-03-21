'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { SwarmGraph } from '@/components/swarm-graph';
import { SwarmEngine, SwarmStatus } from '@/lib/swarm/engine';
import { marked } from 'marked';

const phases = [
  { key: 'ontology', label: 'Analysing document structure' },
  { key: 'graph', label: 'Extracting entities' },
  { key: 'agents', label: 'Creating agent profiles' },
  { key: 'simulation', label: 'Running simulation' },
  { key: 'report', label: 'Writing report' },
];

const phaseHints: Record<string, string[]> = {
  starting: ['Initialising prediction engine...', 'Preparing your data for analysis...'],
  ontology: ['Scanning document for domain structure...', 'Identifying key concepts and categories...', 'Mapping relationships between entities...'],
  graph: ['Extracting named entities from text...', 'Linking entities to form a knowledge network...', 'Constructing the knowledge graph...'],
  agents: ['Generating diverse cognitive profiles...', 'Assigning expertise domains to each agent...', 'Each agent gets a unique perspective on the data...'],
  simulation: ['Agents are reading the knowledge graph...', 'Round in progress, agents posting analyses...', "Agents challenging each other's reasoning...", 'Tracking stance shifts across the swarm...', 'Debate is heating up, positions crystallising...'],
  report: ['Analysing the full debate transcript...', 'Measuring consensus strength...', 'Calculating confidence intervals...'],
};

function phaseIndex(key: string) {
  return phases.findIndex((p) => p.key === key);
}

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();

  const [status, setStatus] = useState<SwarmStatus>({
    phase: 'starting', progress: 0, message: '', done: false, failed: false,
  });

  const [reportHtml, setReportHtml] = useState('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [thinking, setThinking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hintIndex, setHintIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'split' | 'graph' | 'report'>('report');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const chatRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<SwarmEngine | null>(null);
  const startedRef = useRef(false);

  const elapsed = `${Math.floor(elapsedSeconds / 60)}:${String(elapsedSeconds % 60).padStart(2, '0')}`;
  const phaseLabel = phases.find((p) => p.key === status.phase)?.label || 'Processing...';
  const hints = phaseHints[status.phase] || ['Processing...'];
  const activeHint = hints[hintIndex % hints.length];

  const handleStatus = useCallback((s: SwarmStatus) => {
    setStatus(s);
    if (s.done && s.reportMarkdown) {
      setReportHtml(marked(s.reportMarkdown) as string);
    }
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const raw = sessionStorage.getItem(`swarm_${projectId}`);
    if (!raw) {
      setStatus({ phase: 'failed', progress: 0, message: 'No run configuration found. Please start a new prediction.', done: false, failed: true });
      return;
    }

    const config = JSON.parse(raw);
    const engine = new SwarmEngine(
      { provider: config.provider, apiKey: config.apiKey },
      handleStatus
    );
    engineRef.current = engine;

    engine.run(config.sourceText || config.goal, config.goal, config.depth);

    // Clean up sessionStorage after reading
    sessionStorage.removeItem(`swarm_${projectId}`);

    return () => { engine.abort(); };
  }, [projectId, handleStatus]);

  useEffect(() => {
    if (status.done || status.failed) return;
    const tick = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    const hint = setInterval(() => setHintIndex((i) => i + 1), 4000);
    return () => { clearInterval(tick); clearInterval(hint); };
  }, [status.done, status.failed]);

  async function askQ(q: string) {
    q = (q || '').trim();
    if (!q || !engineRef.current) return;
    setMessages((m) => [...m, { role: 'user', content: q }]);
    setQuestion('');
    setThinking(true);
    try {
      const answer = await engineRef.current.chat(q, messages);
      setMessages((m) => [...m, { role: 'assistant', content: answer }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Something went wrong.' }]);
    } finally {
      setThinking(false);
      setTimeout(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, 100);
    }
  }

  // Processing
  if (!status.done && !status.failed) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="w-full max-w-lg space-y-6 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Running prediction</h2>
            <div className="rounded-lg border border-border p-5 space-y-3 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-medium text-sm">{phaseLabel}</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{elapsed}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${status.progress}%` }} />
              </div>
              <p className="text-sm text-muted-foreground min-h-[1.4em] transition-opacity">{activeHint}</p>
            </div>
            <div className="space-y-2 text-left">
              {phases.map((step) => (
                <div key={step.key} className="flex items-center gap-3">
                  <span className={`text-sm ${phaseIndex(step.key) <= phaseIndex(status.phase) ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {phaseIndex(step.key) < phaseIndex(status.phase) ? '\u2713' : phaseIndex(step.key) === phaseIndex(status.phase) ? '\u00B7' : ' '}
                  </span>
                  <span className={`text-sm ${phaseIndex(step.key) <= phaseIndex(status.phase) ? '' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Failed - parse error message
  if (status.failed) {
    let errorTitle = 'Something went wrong';
    let errorDesc = status.message || 'An unexpected error occurred.';
    const msg = status.message || '';

    if (msg.includes('authentication_error') || msg.includes('invalid') && msg.includes('api-key') || msg.includes('401') || msg.includes('Unauthorized')) {
      errorTitle = 'Invalid API key';
      errorDesc = 'The API key you provided was rejected by the LLM provider. Please double-check your key and try again.';
    } else if (msg.includes('rate_limit') || msg.includes('429') || msg.includes('Too Many Requests')) {
      errorTitle = 'Rate limit exceeded';
      errorDesc = 'Too many requests to the LLM provider. Wait a minute and try again, or switch to a different provider.';
    } else if (msg.includes('insufficient_quota') || msg.includes('billing')) {
      errorTitle = 'Insufficient quota';
      errorDesc = 'Your API account has run out of credits. Add billing to your provider account and try again.';
    } else if (msg.includes('NetworkError') || msg.includes('Failed to fetch') || msg.includes('ECONNREFUSED')) {
      errorTitle = 'Network error';
      errorDesc = 'Could not reach the LLM provider. Check your internet connection and try again.';
    } else if (msg.includes('model') && msg.includes('not found')) {
      errorTitle = 'Model not available';
      errorDesc = 'The selected LLM model is not available for your API key. Try a different provider.';
    }

    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-2xl font-semibold">{errorTitle}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{errorDesc}</p>
            <button onClick={() => router.push('/swarm-prediction')} className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm">
              Start over
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Results
  const posts = status.posts || [];
  const profiles = status.profiles || [];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow flex flex-col min-h-0">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/swarm-prediction')} className="text-sm text-muted-foreground hover:text-foreground">&larr; New</button>
          </div>
          <div className="flex gap-1">
            {(isMobile ? (['graph', 'report'] as const) : (['split', 'graph', 'report'] as const)).map((m) => (
              <button key={m} onClick={() => setViewMode(m)} className={`px-3 py-1 text-xs rounded-md ${viewMode === m ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                {m === 'split' ? 'Split' : m === 'graph' ? 'Graph' : 'Report'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <div className={`transition-all duration-300 ${viewMode === 'report' ? 'hidden' : viewMode === 'graph' ? 'w-full' : 'w-1/2'} border-r border-border`}>
            <SwarmGraph profiles={profiles} posts={posts} />
          </div>
          <div className={`transition-all duration-300 overflow-y-auto ${viewMode === 'graph' ? 'hidden' : viewMode === 'report' ? 'w-full' : 'w-1/2'}`}>
            <div className="p-4 sm:p-6 space-y-6">
              <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: reportHtml }} />
              <div className="border-t border-border pt-6">
                <h3 className="font-medium mb-3">Ask about the simulation</h3>
                <div ref={chatRef} className="space-y-3 max-h-60 sm:max-h-80 overflow-y-auto mb-3">
                  {messages.map((m, i) => (
                    <div key={i} className={`text-sm ${m.role === 'user' ? 'text-right' : ''}`}>
                      {m.role === 'assistant' ? (
                        <div className="prose dark:prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: marked(m.content) as string }} />
                      ) : (
                        <span className="inline-block rounded-lg bg-primary text-primary-foreground px-3 py-1.5">{m.content}</span>
                      )}
                    </div>
                  ))}
                  {thinking && <div className="text-sm text-muted-foreground animate-pulse">Thinking...</div>}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && askQ(question)}
                    placeholder="Ask a question..."
                    className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button onClick={() => askQ(question)} disabled={!question.trim() || thinking} className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm disabled:opacity-50">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

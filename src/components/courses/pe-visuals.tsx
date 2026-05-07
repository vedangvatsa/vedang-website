'use client';

/* ─── Module 1: Prediction Engine ─── */
export function PredictionEngine() {
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Weak vs Strong Prompts</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Constraints narrow the prediction space, producing better output</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-[3px] border-2 border-red-200 dark:border-red-900/40 p-4">
            <div className="text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-wider mb-2">Weak Prompt</div>
            <p className="text-[11px] text-muted-foreground italic mb-2">&quot;Write about marketing.&quot;</p>
            <p className="text-[10px] text-muted-foreground/60">Vague. The AI has no constraints to guide predictions. Output will be generic and unfocused.</p>
          </div>
          <div className="rounded-[3px] border-2 border-green-300 dark:border-green-800/60 p-4">
            <div className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">Strong Prompt</div>
            <p className="text-[11px] text-muted-foreground italic mb-2">&quot;Write a 200-word LinkedIn post about content marketing for B2B SaaS startups. Use a professional tone and include 3 actionable tips.&quot;</p>
            <p className="text-[10px] text-muted-foreground/60">Specific. Constraints on length, audience, platform, tone, and structure produce focused output.</p>
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 2: Core Techniques ─── */
export function CoreTechniques() {
  const techniques = [
    { title: 'Zero-Shot', desc: 'Direct instruction with no examples. Works for simple, well-defined tasks.', example: '"Translate this to French: Hello, how are you?"', color: '#3b82f6' },
    { title: 'Few-Shot', desc: 'Provide 2-3 examples of the desired output format before your request.', example: 'Show input→output pairs, then give the new input', color: '#8b5cf6' },
    { title: 'Role / Persona', desc: 'Assign the AI an expert identity to shift tone and depth of response.', example: '"You are a senior data scientist..."', color: '#f59e0b' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Core Prompting Techniques</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">The three foundational patterns for any AI interaction</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {techniques.map((t) => (
            <div key={t.title} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderTopWidth: '3px', borderTopColor: t.color }}>
              <div className="p-3">
                <span className="text-xs font-bold" style={{ color: t.color }}>{t.title}</span>
                <p className="text-[10px] text-muted-foreground mt-1 mb-2">{t.desc}</p>
                <p className="text-[10px] text-muted-foreground/60 italic">{t.example}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 3: Advanced Reasoning ─── */
export function AdvancedReasoning() {
  const methods = [
    { title: 'Chain of Thought', desc: 'Ask AI to think step-by-step. Forces planning before answering, reducing logic errors.', trigger: '"Think step by step before answering"', color: '#3b82f6' },
    { title: 'Self-Consistency', desc: 'Generate multiple answers and pick the most common. Reduces hallucination on factual tasks.', trigger: 'Generate 3 answers, then pick consensus', color: '#8b5cf6' },
    { title: 'Tree of Thought', desc: 'AI explores multiple reasoning branches in parallel, evaluates each, and picks the best path.', trigger: '"Consider 3 approaches, evaluate, choose best"', color: '#10b981' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Reasoning Strategies</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Force the AI to reason before it answers</p>

        <div className="space-y-2">
          {methods.map((m) => (
            <div key={m.title} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderLeftWidth: '3px', borderLeftColor: m.color }}>
              <div className="px-4 py-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold" style={{ color: m.color }}>{m.title}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mb-1">{m.desc}</p>
                <p className="text-[10px] text-muted-foreground/60 italic">Trigger: {m.trigger}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 4: Code Prompting ─── */
export function CodePrompting() {
  const patterns = [
    { title: "Describe, Don't Dictate", desc: 'Tell the AI what you need, not how to code it. Let it choose the implementation.', example: '"Build a function that validates email addresses" not "Write a regex for..."', color: '#10b981' },
    { title: 'Error-Paste Debugging', desc: 'Copy the full error trace into chat. Don\'t interpret it yourself.', example: '"Fix this error: [paste full stack trace]"', color: '#f59e0b' },
    { title: 'Refactor by Intent', desc: 'Give the AI the outcome you want, not the mechanics.', example: '"Make this function more readable" or "Split into smaller functions"', color: '#8b5cf6' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Code Prompting Patterns</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">How to get the best code output from AI</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {patterns.map((p) => (
            <div key={p.title} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderTopWidth: '3px', borderTopColor: p.color }}>
              <div className="p-3">
                <span className="text-xs font-bold" style={{ color: p.color }}>{p.title}</span>
                <p className="text-[10px] text-muted-foreground mt-1 mb-2">{p.desc}</p>
                <p className="text-[10px] text-muted-foreground/60 italic">{p.example}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 5: Best Practices ─── */
export function BestPractices() {
  const tips = [
    { title: 'Be Specific', desc: 'Include word counts, format, audience, and tone in every prompt.', anti: 'Never say "write something about X"' },
    { title: 'Iterate', desc: 'Treat prompting as a conversation. Refine based on each output.', anti: 'Never accept first output as final' },
    { title: 'Use Delimiters', desc: 'Wrap input text in triple quotes or XML tags to separate instructions from data.', anti: 'Never mix instructions with input data' },
    { title: 'Set Constraints', desc: 'Tell the AI what NOT to do. Anti-instructions prevent bloat and hallucination.', anti: 'Never leave the output format undefined' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Prompt Engineering Best Practices</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Rules that apply to every prompt, every time</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tips.map((t) => (
            <div key={t.title} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3">
              <span className="text-xs font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{t.title}</span>
              <p className="text-[10px] text-muted-foreground mt-1">{t.desc}</p>
              <p className="text-[10px] text-red-500 dark:text-red-400 mt-1">{t.anti}</p>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 6: RAG Pipeline ─── */
export function RAGPipeline() {
  const stages = [
    { num: '1', label: 'User Query', desc: 'The natural language question or request', color: '#3b82f6' },
    { num: '2', label: 'Embed', desc: 'Convert query to a vector embedding using an embedding model', color: '#8b5cf6' },
    { num: '3', label: 'Retrieve', desc: 'Search vector database for the most similar document chunks', color: '#10b981' },
    { num: '4', label: 'Augment', desc: 'Insert retrieved context into the prompt alongside the query', color: '#f59e0b' },
    { num: '5', label: 'Generate', desc: 'LLM generates answer grounded in the retrieved context', color: '#ef4444' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">RAG Pipeline</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Retrieval-Augmented Generation: ground AI answers in your data</p>

        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-[#e3e3e0] dark:bg-zinc-800" />
          <div className="space-y-2.5">
            {stages.map((s) => (
              <div key={s.num} className="grid grid-cols-[36px_1fr] gap-3 items-start">
                <div className="relative flex items-center justify-center pt-1">
                  <div className="w-[9px] h-[9px] rounded-full" style={{ backgroundColor: s.color }} />
                </div>
                <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3">
                  <span className="text-xs font-bold" style={{ color: s.color }}>Stage {s.num}: {s.label}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 7: Prompt Chaining ─── */
export function PromptChaining() {
  const chain = [
    { type: 'step', label: 'Step 1: Research', desc: 'Gather information, summarize sources, extract key facts', color: '#3b82f6' },
    { type: 'gate', label: 'Validate', desc: 'Check: are facts accurate? Is anything missing?', color: '#f59e0b' },
    { type: 'step', label: 'Step 2: Draft', desc: 'Write first draft using research output as context', color: '#8b5cf6' },
    { type: 'gate', label: 'Review', desc: 'Check: does it match requirements? Tone? Length?', color: '#f59e0b' },
    { type: 'step', label: 'Step 3: Polish', desc: 'Refine language, add formatting, finalize output', color: '#10b981' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Prompt Chaining</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Output of each step becomes input for the next</p>

        <div className="space-y-1.5">
          {chain.map((c, i) => (
            <div key={`${c.label}-${i}`} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={c.type === 'gate' ? { borderStyle: 'dashed' } : { borderLeftWidth: '3px', borderLeftColor: c.color }}>
              <div className="px-4 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: c.color }}>{c.label}</span>
                  {c.type === 'gate' && <span className="text-[9px] font-mono text-muted-foreground/60 uppercase">Quality gate</span>}
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[3px] bg-[#f7f6f3] dark:bg-zinc-800/40 px-4 py-2.5">
          <span className="text-[11px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)]"><strong>Key principle:</strong> Breaking a complex task into steps with quality gates between them produces dramatically better output than a single monolithic prompt.</span>
        </div>
      </div>
    </figure>
  );
}

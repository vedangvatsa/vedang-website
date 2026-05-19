

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

/* ─── Module 1 (B): Model Comparison ─── */
export function ModelComparison() {
  const models = [
    { name: 'Claude Sonnet 4', context: '200K', strengths: 'Coding, instruction following, safety', cost: '$3/$15 per M tokens', color: '#8b5cf6' },
    { name: 'GPT-4o', context: '128K', strengths: 'Multimodal, speed, tool calling', cost: '$2.50/$10 per M tokens', color: '#10b981' },
    { name: 'Gemini 2.5 Pro', context: '1M', strengths: 'Long context, multilingual', cost: '$1.25/$10 per M tokens', color: '#3b82f6' },
    { name: 'Llama 3.3 70B', context: '128K', strengths: 'Open source, self-hosted, free', cost: 'Free (local compute)', color: '#f59e0b' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Model Comparison</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Frontier models and their trade-offs for prompt engineering</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead><tr className="border-b border-[#e3e3e0] dark:border-zinc-800">
              {['Model', 'Context', 'Strengths', 'Cost'].map(h => (
                <th key={h} className="text-left px-2 py-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {models.map(m => (
                <tr key={m.name} className="border-b border-[#e3e3e0]/40 dark:border-zinc-800/40">
                  <td className="px-2 py-2 font-bold" style={{ color: m.color }}>{m.name}</td>
                  <td className="px-2 py-2 font-mono text-muted-foreground">{m.context}</td>
                  <td className="px-2 py-2 text-muted-foreground">{m.strengths}</td>
                  <td className="px-2 py-2 font-mono text-muted-foreground/60">{m.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 2 (B): Prompt Anatomy ─── */
export function PromptAnatomy() {
  const parts = [
    { name: 'System Prompt', desc: 'Defines role, constraints, and personality', example: '"You are a senior TypeScript engineer..."', color: '#8b5cf6' },
    { name: 'Context', desc: 'Background information the model needs', example: 'Codebase files, documentation, data', color: '#3b82f6' },
    { name: 'Task', desc: 'The specific action to perform', example: '"Refactor this function to use async/await"', color: '#10b981' },
    { name: 'Output Format', desc: 'How the response should be structured', example: '"Return JSON with keys: title, summary, tags"', color: '#f59e0b' },
    { name: 'Constraints', desc: 'Boundaries and restrictions', example: '"Do not modify the public API surface"', color: '#ef4444' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Anatomy of a High-Quality Prompt</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Five components that separate effective prompts from vague instructions</p>
        <div className="space-y-1.5">
          {parts.map(p => (
            <div key={p.name} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 px-4 py-2.5 flex flex-col md:flex-row md:items-center gap-1 md:gap-3" style={{ borderLeftWidth: '3px', borderLeftColor: p.color }}>
              <span className="text-xs font-bold min-w-[110px]" style={{ color: p.color }}>{p.name}</span>
              <span className="text-[10px] text-muted-foreground flex-1">{p.desc}</span>
              <span className="text-[10px] font-mono text-muted-foreground/60 hidden md:block">{p.example}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 3 (B): Reasoning Strategies ─── */
export function ReasoningStrategies() {
  const strategies = [
    { name: 'Chain-of-Thought', when: 'Math, logic, multi-step problems', trigger: '"Think step by step"', quality: 'High', color: '#8b5cf6' },
    { name: 'Few-Shot', when: 'Pattern matching, formatting', trigger: 'Provide 2-3 examples', quality: 'High', color: '#3b82f6' },
    { name: 'Tree-of-Thought', when: 'Complex decisions, exploration', trigger: '"Consider multiple approaches"', quality: 'Very High', color: '#10b981' },
    { name: 'Self-Reflection', when: 'Error correction, quality assurance', trigger: '"Review your answer and fix errors"', quality: 'High', color: '#f59e0b' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Reasoning Strategy Selection</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Which reasoning technique to use for different problem types</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead><tr className="border-b border-[#e3e3e0] dark:border-zinc-800">
              {['Strategy', 'Best For', 'Trigger Phrase', 'Quality'].map(h => (
                <th key={h} className="text-left px-2 py-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {strategies.map(s => (
                <tr key={s.name} className="border-b border-[#e3e3e0]/40 dark:border-zinc-800/40">
                  <td className="px-2 py-2 font-bold" style={{ color: s.color }}>{s.name}</td>
                  <td className="px-2 py-2 text-muted-foreground">{s.when}</td>
                  <td className="px-2 py-2 font-mono text-muted-foreground">{s.trigger}</td>
                  <td className="px-2 py-2"><span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: s.color + '15', color: s.color }}>{s.quality}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 4 (B): Code Prompt Patterns ─── */
export function CodePromptPatterns() {
  const patterns = [
    { pattern: 'Generate', example: '"Write a Node.js function that..."', output: 'New code from spec', color: '#3b82f6' },
    { pattern: 'Refactor', example: '"Refactor to use async/await"', output: 'Improved existing code', color: '#10b981' },
    { pattern: 'Debug', example: '"This throws TypeError, fix it"', output: 'Bug fix + explanation', color: '#ef4444' },
    { pattern: 'Test', example: '"Write Jest tests for this module"', output: 'Test suite', color: '#f59e0b' },
    { pattern: 'Document', example: '"Add JSDoc to every function"', output: 'Inline documentation', color: '#8b5cf6' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Code Prompt Patterns</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Five patterns for effective code generation and manipulation</p>
        <div className="space-y-1.5">
          {patterns.map(p => (
            <div key={p.pattern} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 px-4 py-2.5 flex items-center gap-3" style={{ borderLeftWidth: '3px', borderLeftColor: p.color }}>
              <span className="text-xs font-bold min-w-[80px]" style={{ color: p.color }}>{p.pattern}</span>
              <span className="text-[10px] font-mono text-muted-foreground flex-1">{p.example}</span>
              <span className="text-[10px] text-muted-foreground/60">{p.output}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 5 (B): Anti-Patterns ─── */
export function PromptAntiPatterns() {
  const antipatterns = [
    { bad: 'Vague instructions', example: '"Make it better"', fix: '"Reduce function length to under 20 lines and add error handling"', color: '#ef4444' },
    { bad: 'No output format', example: '"Summarize this"', fix: '"Summarize in 3 bullet points, each under 15 words"', color: '#f59e0b' },
    { bad: 'Context dump', example: 'Pasting 10,000 lines of code', fix: 'Include only the relevant function + its interface', color: '#3b82f6' },
    { bad: 'Multi-task prompt', example: '"Fix the bug, add tests, and refactor"', fix: 'Split into 3 separate prompts, chain the results', color: '#8b5cf6' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Prompt Anti-Patterns</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Common mistakes and their corrections</p>
        <div className="space-y-2">
          {antipatterns.map(a => (
            <div key={a.bad} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: a.color + '15', color: a.color }}>{a.bad}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-[10px] rounded-[3px] bg-red-50 dark:bg-red-900/10 px-2.5 py-1.5"><span className="font-bold text-red-600 dark:text-red-400">Bad: </span><span className="text-red-800/70 dark:text-red-300/70 font-mono">{a.example}</span></div>
                <div className="text-[10px] rounded-[3px] bg-green-50 dark:bg-green-900/10 px-2.5 py-1.5"><span className="font-bold text-green-600 dark:text-green-400">Fix: </span><span className="text-green-800/70 dark:text-green-300/70">{a.fix}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 6 (B): RAG Architecture ─── */
export function RAGArchitecture() {
  const steps = [
    { step: 'Ingest', desc: 'Split documents into chunks (500-1000 tokens each)', color: '#3b82f6' },
    { step: 'Embed', desc: 'Convert chunks to vectors using an embedding model', color: '#8b5cf6' },
    { step: 'Store', desc: 'Index vectors in a vector database (Pinecone, Weaviate)', color: '#10b981' },
    { step: 'Query', desc: 'Embed the user query, find nearest neighbors', color: '#f59e0b' },
    { step: 'Generate', desc: 'Pass retrieved chunks as context to the LLM', color: '#ef4444' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">RAG Pipeline Architecture</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Five-stage Retrieval-Augmented Generation flow</p>
        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-[#e3e3e0] dark:bg-zinc-800" />
          <div className="space-y-2">
            {steps.map((s, i) => (
              <div key={s.step} className="grid grid-cols-[36px_1fr] gap-3 items-start">
                <div className="relative flex items-center justify-center pt-2">
                  <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: s.color }}>{i + 1}</div>
                </div>
                <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-2.5">
                  <span className="text-xs font-bold" style={{ color: s.color }}>{s.step}</span>
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

/* ─── Module 7 (B): Chain Types ─── */
export function ChainTypes() {
  const chains = [
    { name: 'Sequential', desc: 'Output of prompt A feeds into prompt B', example: 'Draft email -> Review tone -> Format', complexity: 'Low', color: '#10b981' },
    { name: 'Parallel', desc: 'Run multiple prompts simultaneously, merge results', example: 'Analyze from 3 perspectives, combine', complexity: 'Medium', color: '#3b82f6' },
    { name: 'Conditional', desc: 'Route to different prompts based on classification', example: 'Classify intent -> route to specialist', complexity: 'Medium', color: '#f59e0b' },
    { name: 'Recursive', desc: 'Output triggers re-evaluation until quality threshold met', example: 'Write -> review -> rewrite loop', complexity: 'High', color: '#8b5cf6' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Prompt Chain Architectures</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Four patterns for chaining multiple LLM calls together</p>
        <div className="space-y-1.5">
          {chains.map(c => (
            <div key={c.name} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 px-4 py-2.5 flex flex-col md:flex-row md:items-center gap-1 md:gap-3" style={{ borderLeftWidth: '3px', borderLeftColor: c.color }}>
              <span className="text-xs font-bold min-w-[90px]" style={{ color: c.color }}>{c.name}</span>
              <span className="text-[10px] text-muted-foreground flex-1">{c.desc}</span>
              <span className="text-[9px] font-mono text-muted-foreground/60 hidden md:block">{c.example}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: c.color + '15', color: c.color }}>{c.complexity}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}


'use client';

import { Brain, Layers, Terminal, Lightbulb, Target } from 'lucide-react';

/* ─── Module 1: Prediction Engine ─── */
export function PredictionEngine() {
  return (
    <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-5 rounded-xl border bg-red-500/5 border-red-500/20">
        <div className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">Weak Prompt</div>
        <p className="text-sm italic text-muted-foreground">&quot;Write about marketing.&quot;</p>
        <p className="text-xs text-muted-foreground mt-2">Vague → generic output. The AI has no constraints to guide predictions.</p>
      </div>
      <div className="p-5 rounded-xl border bg-emerald-500/5 border-emerald-500/20">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">Strong Prompt</div>
        <p className="text-sm italic text-muted-foreground">&quot;Write a 200-word LinkedIn post about content marketing for B2B SaaS startups. Use a professional tone and include 3 actionable tips.&quot;</p>
        <p className="text-xs text-muted-foreground mt-2">Specific → focused, useful output. Constraints narrow the prediction space.</p>
      </div>
    </div>
  );
}

/* ─── Module 2: Core Techniques ─── */
export function CoreTechniques() {
  const techniques = [
    { icon: Target, title: 'Zero-Shot', desc: 'Direct instruction with no examples. Works for simple tasks.', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/5 border-blue-500/20', iconBg: 'bg-blue-500/10' },
    { icon: Layers, title: 'Few-Shot', desc: 'Provide 2-3 examples of the desired output format before your request.', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/5 border-violet-500/20', iconBg: 'bg-violet-500/10' },
    { icon: Brain, title: 'Role / Persona', desc: 'Assign the AI an expert identity to shift tone and depth of response.', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/5 border-amber-500/20', iconBg: 'bg-amber-500/10' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {techniques.map((t) => {
        const Icon = t.icon;
        return (
          <div key={t.title} className={`p-5 rounded-xl border ${t.bg}`}>
            <div className={`${t.iconBg} p-2 rounded-lg ${t.color} inline-block mb-3`}><Icon className="w-5 h-5" /></div>
            <h4 className="font-semibold text-sm mb-1">{t.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Module 3: Advanced Reasoning ─── */
export function AdvancedReasoning() {
  const methods = [
    { title: 'Chain of Thought', desc: 'Ask AI to think step-by-step. Forces planning before answering, reducing logic errors.', color: 'text-cyan-700 dark:text-cyan-400' },
    { title: 'Self-Consistency', desc: 'Generate multiple answers and pick the most common. Reduces hallucination on factual tasks.', color: 'text-cyan-700 dark:text-cyan-400' },
    { title: 'Tree of Thought', desc: 'AI explores multiple reasoning branches in parallel, evaluates each, and picks the best path.', color: 'text-cyan-700 dark:text-cyan-400' },
  ];
  return (
    <div className="not-prose my-6 p-6 bg-card border rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-cyan-500/10 p-2 rounded-lg text-cyan-600 dark:text-cyan-400"><Lightbulb className="w-5 h-5" /></div>
        <h4 className="font-semibold text-base">Reasoning Strategies</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {methods.map((m) => (
          <div key={m.title} className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
            <div className={`font-medium text-sm ${m.color} mb-1`}>{m.title}</div>
            <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Module 4: Code Prompting ─── */
export function CodePrompting() {
  const patterns = [
    { title: 'Describe, Don\'t Dictate', desc: 'Tell the AI what you need, not how to code it. Let it choose the implementation.', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500/5 border-green-500/20' },
    { title: 'Error-Paste Debugging', desc: 'Copy the full error trace into chat. Say: "Fix this error." Don\'t interpret it yourself.', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/5 border-orange-500/20' },
    { title: 'Refactor by Intent', desc: '"Make this function more readable" or "Split this into smaller functions" — intent-driven instructions.', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/5 border-indigo-500/20' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {patterns.map((p) => (
        <div key={p.title} className={`p-5 rounded-xl border ${p.bg}`}>
          <div className="flex items-center gap-2 mb-2">
            <Terminal className={`w-4 h-4 ${p.color}`} />
            <h4 className="font-semibold text-sm">{p.title}</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Module 5: Best Practices ─── */
export function BestPractices() {
  const tips = [
    { title: 'Be Specific', desc: 'Include word counts, format, audience, and tone in every prompt.' },
    { title: 'Iterate', desc: 'Treat prompting as a conversation. Refine based on each output.' },
    { title: 'Use Delimiters', desc: 'Wrap input text in triple quotes or XML tags to separate instructions from data.' },
    { title: 'Set Constraints', desc: 'Tell the AI what NOT to do. Anti-instructions prevent bloat and hallucination.' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {tips.map((t) => (
        <div key={t.title} className="p-4 rounded-xl border bg-card">
          <h4 className="font-semibold text-sm mb-1">{t.title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Module 6: RAG & Function Calling ─── */
export function RAGPipeline() {
  return (
    <div className="not-prose my-6">
      <svg viewBox="0 0 800 160" className="w-full h-auto" role="img" aria-label="RAG Pipeline: Query → Embed → Retrieve → Augment → Generate">
        {[
          { x: 10, label: 'User Query', color: '#3b82f6' },
          { x: 170, label: 'Embed', color: '#8b5cf6' },
          { x: 330, label: 'Retrieve', color: '#10b981' },
          { x: 490, label: 'Augment', color: '#f59e0b' },
          { x: 650, label: 'Generate', color: '#ef4444' },
        ].map((step, i) => (
          <g key={step.label}>
            <rect x={step.x} y={35} width={140} height={70} rx={12} fill={`${step.color}15`} stroke={step.color} strokeWidth={1.5} />
            <text x={step.x + 70} y={75} textAnchor="middle" fill={step.color} fontSize={13} fontWeight={700}>{step.label}</text>
            {i < 4 && (
              <path d={`M${step.x + 145} 70 L${step.x + 165} 70`} stroke="currentColor" strokeWidth={1.5} opacity={0.3} markerEnd="url(#rag-arrow)" />
            )}
          </g>
        ))}
        {/* Vector DB icon */}
        <rect x={370} y={115} width={80} height={30} rx={6} fill="#10b98115" stroke="#10b981" strokeWidth={1} />
        <text x={410} y={135} textAnchor="middle" fill="#10b981" fontSize={10} fontWeight={600}>Vector DB</text>
        <line x1={400} y1={105} x2={400} y2={115} stroke="#10b981" strokeWidth={1} strokeDasharray="3 2" />
        <defs>
          <marker id="rag-arrow" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
            <path d="M0 0 L8 3 L0 6 Z" fill="currentColor" opacity={0.4} />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

/* ─── Module 7: Prompt Chaining & Agents ─── */
export function PromptChaining() {
  return (
    <div className="not-prose my-6">
      <svg viewBox="0 0 800 180" className="w-full h-auto" role="img" aria-label="Prompt Chain: Step 1 feeds into Step 2 feeds into Step 3, with a gate between each">
        {[
          { x: 10, label: 'Step 1', desc: 'Research', color: '#3b82f6' },
          { x: 200, label: 'Gate', desc: 'Validate', color: '#f59e0b' },
          { x: 340, label: 'Step 2', desc: 'Draft', color: '#8b5cf6' },
          { x: 530, label: 'Gate', desc: 'Review', color: '#f59e0b' },
          { x: 660, label: 'Step 3', desc: 'Polish', color: '#10b981' },
        ].map((step, i) => {
          const isGate = step.label === 'Gate';
          const w = isGate ? 100 : 160;
          const h = isGate ? 50 : 80;
          const yOff = isGate ? 50 : 35;
          return (
            <g key={`${step.label}-${i}`}>
              <rect x={step.x} y={yOff} width={w} height={h} rx={isGate ? 25 : 12} fill={`${step.color}15`} stroke={step.color} strokeWidth={1.5} strokeDasharray={isGate ? "4 3" : "none"} />
              <text x={step.x + w/2} y={yOff + (isGate ? 22 : 35)} textAnchor="middle" fill={step.color} fontSize={isGate ? 11 : 14} fontWeight={700}>{isGate ? '' + step.desc : step.label}</text>
              {!isGate && <text x={step.x + w/2} y={yOff + 55} textAnchor="middle" fill="currentColor" fontSize={11} opacity={0.5}>{step.desc}</text>}
              {i < 4 && (
                <path d={`M${step.x + w + 5} 75 L${step.x + w + 25} 75`} stroke="currentColor" strokeWidth={1.2} opacity={0.3} markerEnd="url(#chain-arrow)" />
              )}
            </g>
          );
        })}
        <text x={400} y={160} textAnchor="middle" fill="currentColor" fontSize={11} opacity={0.4}>Output of each step becomes input for the next</text>
        <defs>
          <marker id="chain-arrow" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
            <path d="M0 0 L8 3 L0 6 Z" fill="currentColor" opacity={0.4} />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

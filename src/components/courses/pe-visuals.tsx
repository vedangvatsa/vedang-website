'use client';

import { Brain, Layers, Terminal, Lightbulb, Target } from 'lucide-react';

/* ─── Module 1: Prediction Engine ─── */
export function PredictionEngine() {
  return (
    <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-5 rounded-xl border bg-red-500/5 border-red-500/20">
        <div className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">❌ Weak Prompt</div>
        <p className="text-sm italic text-muted-foreground">&quot;Write about marketing.&quot;</p>
        <p className="text-xs text-muted-foreground mt-2">Vague → generic output. The AI has no constraints to guide predictions.</p>
      </div>
      <div className="p-5 rounded-xl border bg-emerald-500/5 border-emerald-500/20">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">✅ Strong Prompt</div>
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

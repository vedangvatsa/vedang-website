'use client';

import { ArrowRight } from 'lucide-react';

const options = [
  {
    title: 'Cursor / Windsurf',
    color: 'text-amber-600 dark:text-amber-400',
    borderColorStyle: '#d97706',
    borderClass: 'border-l-amber-500',
    steps: ['Create Next.js project', 'Paste PRD into chat', 'Use Composer for multi-file edits', 'Test locally', 'Deploy to Vercel'],
  },
  {
    title: 'Lovable.dev',
    color: 'text-pink-600 dark:text-pink-400',
    borderColorStyle: '#db2777',
    borderClass: 'border-l-pink-500',
    steps: ['Start new project', 'Design UI first', 'Add backend logic', 'Iterate on output', 'Publish'],
  },
  {
    title: 'Claude Code / Antigravity',
    color: 'text-blue-600 dark:text-blue-400',
    borderColorStyle: '#2563eb',
    borderClass: 'border-l-blue-500',
    steps: ['Open terminal agent', 'Describe full project', 'Agent creates all files', 'Debug autonomously', 'Deploy'],
  },
];

export function LabWorkflow() {
  return (
    <div className="not-prose my-10 p-6 md:p-8 bg-card border border-[#e3e3e0] dark:border-zinc-800 rounded-lg shadow-sm">
      <div className="text-center mb-6">
        <h3 className="text-lg md:text-xl font-bold tracking-tight text-[#37352f] dark:text-zinc-200 mb-1">Build Workflow: 3 Paths to Ship</h3>
        <p className="text-sm text-muted-foreground">Choose any tool. All three produce the same Startup Name Generator app.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {options.map((opt) => {
          return (
            <div 
              key={opt.title} 
              className="p-5 rounded-[4px] border border-[#e3e3e0] dark:border-zinc-800 bg-[#fafafa] dark:bg-zinc-900/10 flex flex-col transition-all duration-200 hover:shadow-sm"
              style={{ borderLeftWidth: '3px', borderLeftColor: opt.borderColorStyle }}
            >
              <h4 className="font-bold text-base text-[#37352f] dark:text-zinc-200 mb-3">{opt.title}</h4>
              <ol className="space-y-2 flex-1">
                {opt.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
                    <span className={`${opt.color} font-mono font-bold text-xs mt-0.5 shrink-0`}>{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
              <div className={`mt-4 pt-3 border-t border-border/60 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider ${opt.color}`}>
                Result: Live app <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

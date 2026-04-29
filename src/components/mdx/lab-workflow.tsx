'use client';

import { Palette, Terminal, Code2, ArrowRight } from 'lucide-react';

const options = [
  {
    icon: Terminal,
    title: 'Cursor / Windsurf',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/5 border-amber-500/20',
    iconBg: 'bg-amber-500/10',
    steps: ['Create Next.js project', 'Paste PRD into chat', 'Use Composer for multi-file edits', 'Test locally', 'Deploy to Vercel'],
  },
  {
    icon: Palette,
    title: 'Lovable.dev',
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-500/5 border-pink-500/20',
    iconBg: 'bg-pink-500/10',
    steps: ['Start new project', 'Design UI first', 'Add backend logic', 'Iterate on output', 'Publish'],
  },
  {
    icon: Code2,
    title: 'Claude Code / Antigravity',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/5 border-blue-500/20',
    iconBg: 'bg-blue-500/10',
    steps: ['Open terminal agent', 'Describe full project', 'Agent creates all files', 'Debug autonomously', 'Deploy'],
  },
];

export function LabWorkflow() {
  return (
    <div className="not-prose my-10 p-6 md:p-8 bg-card border rounded-2xl shadow-sm">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold tracking-tight mb-1">Build Workflow: 3 Paths to Ship</h3>
        <p className="text-sm text-muted-foreground">Choose any tool. All three produce the same Startup Name Generator app.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <div key={opt.title} className={`p-5 rounded-xl border ${opt.bg} flex flex-col`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`${opt.iconBg} p-2 rounded-lg ${opt.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-base">{opt.title}</h4>
              </div>
              <ol className="space-y-2 flex-1">
                {opt.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className={`${opt.color} font-bold text-xs mt-0.5 shrink-0`}>{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
              <div className={`mt-4 pt-3 border-t border-border flex items-center gap-1 text-xs font-medium ${opt.color}`}>
                Result: Live app on the internet <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

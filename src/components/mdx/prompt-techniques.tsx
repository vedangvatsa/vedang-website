'use client';

import { UserCircle, ListOrdered, Ban } from 'lucide-react';

const techniques = [
  {
    icon: UserCircle,
    title: 'Persona Prompting',
    description: 'Tell the AI to adopt a specific expert role. This changes the tone and quality of its output.',
    example: '"You are an expert cybersecurity engineer. Review this code for vulnerabilities."',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-500/5 border-violet-500/20',
    iconBg: 'bg-violet-500/10',
  },
  {
    icon: ListOrdered,
    title: 'Chain of Thought',
    description: 'Tell the AI to "think step-by-step." This forces it to plan before coding, which reduces logic errors.',
    example: '"I need to connect a payment system. Think step-by-step about what database changes we need before writing the code."',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/5 border-blue-500/20',
    iconBg: 'bg-blue-500/10',
  },
  {
    icon: Ban,
    title: 'Negative Prompts',
    description: 'Tell the AI exactly what to avoid. This prevents it from falling back to generic patterns.',
    example: '"Generate a list of startup names for a coffee brand. Do not use words like bean, roast, or cup."',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/5 border-amber-500/20',
    iconBg: 'bg-amber-500/10',
  },
];

export function PromptTechniques() {
  return (
    <div className="not-prose my-10 grid grid-cols-1 md:grid-cols-3 gap-5">
      {techniques.map((t) => {
        const Icon = t.icon;
        return (
          <div key={t.title} className={`p-5 rounded-xl border ${t.bg} flex flex-col`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`${t.iconBg} p-2 rounded-lg ${t.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-base">{t.title}</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4 flex-1">{t.description}</p>
            <div className="bg-background rounded-lg p-3 border border-border">
              <p className="text-xs italic text-foreground/80 leading-relaxed">{t.example}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

'use client';

import { Shield, DollarSign, Briefcase } from 'lucide-react';

const pillars = [
  {
    icon: Shield,
    title: 'Security',
    subtitle: 'The Rule File',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-500/5 border-red-500/20',
    iconBg: 'bg-red-500/10',
    items: [
      'Never hardcode API keys — use env variables',
      'Always hash passwords before storing',
      'Validate all data on the server, never trust the browser',
    ],
  },
  {
    icon: DollarSign,
    title: 'Monetization',
    subtitle: 'From Project to Profit',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/5 border-emerald-500/20',
    iconBg: 'bg-emerald-500/10',
    items: [
      'SaaS — Solve a niche problem, charge monthly',
      'Marketplace — Build plugins for Shopify, Slack, etc.',
      'Freelancing — Ship prototypes in days, not months',
    ],
  },
  {
    icon: Briefcase,
    title: 'Career',
    subtitle: 'The Product Engineer',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-500/5 border-violet-500/20',
    iconBg: 'bg-violet-500/10',
    items: [
      'Combines product management + design + engineering',
      'Focus on finding problems, not writing syntax',
      'You are the architect; AI is the factory',
    ],
  },
];

export function ProductPillars() {
  return (
    <div className="not-prose my-10 grid grid-cols-1 md:grid-cols-3 gap-5">
      {pillars.map((p) => {
        const Icon = p.icon;
        return (
          <div key={p.title} className={`p-5 rounded-xl border ${p.bg} flex flex-col`}>
            <div className="flex items-center gap-3 mb-1">
              <div className={`${p.iconBg} p-2 rounded-lg ${p.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-base">{p.title}</h4>
            </div>
            <p className={`text-xs ${p.color} font-medium mb-4`}>{p.subtitle}</p>
            <ul className="space-y-2 flex-1">
              {p.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className={`${p.color} mt-1 shrink-0`}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

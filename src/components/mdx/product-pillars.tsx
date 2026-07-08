'use client';

const pillars = [
  {
    title: 'Security',
    subtitle: 'The Rule File',
    color: 'text-red-600 dark:text-red-400',
    borderColorStyle: '#ef4444',
    items: [
      'Never hardcode API keys: use env variables',
      'Always hash passwords before storing',
      'Validate all data on the server, never trust the browser',
    ],
  },
  {
    title: 'Monetization',
    subtitle: 'From Project to Profit',
    color: 'text-emerald-600 dark:text-emerald-400',
    borderColorStyle: '#10b981',
    items: [
      'SaaS: Solve a niche problem, charge monthly',
      'Marketplace: Build plugins for Shopify, Slack, etc.',
      'Freelancing: Ship prototypes in days, not months',
    ],
  },
  {
    title: 'Career',
    subtitle: 'The Product Engineer',
    color: 'text-violet-600 dark:text-violet-400',
    borderColorStyle: '#8b5cf6',
    items: [
      'Combines product management, design, and engineering',
      'Focus on finding problems, not writing syntax',
      'You are the architect; AI is the factory',
    ],
  },
];

export function ProductPillars() {
  return (
    <div className="not-prose my-10 grid grid-cols-1 md:grid-cols-3 gap-5">
      {pillars.map((p) => {
        return (
          <div 
            key={p.title} 
            className="p-5 rounded-[4px] border border-[#e3e3e0] dark:border-zinc-800 bg-[#fafafa] dark:bg-zinc-900/10 flex flex-col transition-all duration-200 hover:shadow-sm"
            style={{ borderLeftWidth: '3px', borderLeftColor: p.borderColorStyle }}
          >
            <h4 className="font-bold text-base text-[#37352f] dark:text-zinc-200">{p.title}</h4>
            <p className={`text-xs ${p.color} font-mono uppercase tracking-wider mt-0.5 mb-4`}>{p.subtitle}</p>
            <ul className="space-y-2.5 flex-1">
              {p.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
                  <span className="text-muted-foreground/40 mt-1 shrink-0">•</span>
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

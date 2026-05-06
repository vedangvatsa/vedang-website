'use client';

import React from 'react';

export function OutreachPipeline() {
  const steps = [
    { label: 'CSV / Apollo Leads', icon: '📋', color: '#f59e0b' },
    { label: 'AI Enrichment', icon: '🔍', color: '#f97316' },
    { label: 'AI Personalization', icon: '✍️', color: '#ef4444' },
    { label: 'Email Sequences', icon: '📧', color: '#a855f7' },
    { label: 'Tracking', icon: '📊', color: '#3b82f6' },
    { label: 'Sheets CRM', icon: '📁', color: '#10b981' },
  ];

  return (
    <div className="not-prose my-8 first:mt-0 last:mb-0">
      <div className="rounded-lg border border-border/50 bg-secondary/20 p-5 md:p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-4">Outreach Pipeline Architecture</div>
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-0">
          {steps.map((step, i) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center gap-2 min-w-[100px]">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-lg"
                  style={{ backgroundColor: step.color + '20', border: `1px solid ${step.color}40` }}
                >
                  {step.icon}
                </div>
                <span className="text-xs text-center text-muted-foreground leading-tight max-w-[90px]">{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <svg className="w-6 h-6 text-muted-foreground/40 flex-shrink-0 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AIMaturityLevels() {
  const levels = [
    {
      level: 'Level 0',
      title: 'No AI',
      description: 'Everything manual. Spreadsheets, copy-paste, human in every loop.',
      color: '#64748b',
      width: '10%',
    },
    {
      level: 'Level 1',
      title: 'Tool Adoption',
      description: 'Individual team members using ChatGPT, Copilot, Midjourney. No coordination.',
      color: '#f59e0b',
      width: '25%',
    },
    {
      level: 'Level 2',
      title: 'Pipeline Automation',
      description: 'End-to-end workflows automated. Content, outreach, and reporting run on agents.',
      color: '#3b82f6',
      width: '55%',
    },
    {
      level: 'Level 3',
      title: 'Agent-Native',
      description: 'Agents run the business. Humans review output and make strategic decisions.',
      color: '#10b981',
      width: '85%',
    },
    {
      level: 'Level 4',
      title: 'Autonomous Operations',
      description: 'Self-improving systems. Agents optimize their own pipelines based on performance data.',
      color: '#8b5cf6',
      width: '100%',
    },
  ];

  return (
    <div className="not-prose my-8 first:mt-0 last:mb-0">
      <div className="rounded-lg border border-border/50 bg-secondary/20 p-5 md:p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-5">AI Maturity Assessment</div>
        <div className="space-y-4">
          {levels.map((l) => (
            <div key={l.level} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold" style={{ color: l.color }}>{l.level}</span>
                  <span className="text-sm font-medium text-foreground">{l.title}</span>
                </div>
              </div>
              <div className="w-full bg-secondary/60 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ width: l.width, backgroundColor: l.color }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{l.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ImplementationTimeline() {
  const phases = [
    {
      period: 'Week 1',
      title: 'Foundation',
      items: ['Brand guidelines', 'Agent setup', 'AI discovery files'],
      color: '#f59e0b',
    },
    {
      period: 'Week 2',
      title: 'Infrastructure',
      items: ['Email setup (Resend/SES)', 'Email capture', 'Nurture sequences'],
      color: '#f97316',
    },
    {
      period: 'Week 3',
      title: 'Outreach',
      items: ['B2B pipeline', 'Lead import', 'Campaign launch'],
      color: '#ef4444',
    },
    {
      period: 'Week 4',
      title: 'Content',
      items: ['Content pipeline', 'Social automation', 'Dashboard'],
      color: '#a855f7',
    },
    {
      period: 'Month 2',
      title: 'Authority',
      items: ['First consulting report', 'AEO/GEO optimization', 'Scale outreach'],
      color: '#3b82f6',
    },
    {
      period: 'Month 3',
      title: 'Autonomous',
      items: ['Full agent ops', 'Review and iterate', 'Strategic focus'],
      color: '#10b981',
    },
  ];

  return (
    <div className="not-prose my-8 first:mt-0 last:mb-0">
      <div className="rounded-lg border border-border/50 bg-secondary/20 p-5 md:p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-5">Implementation Timeline</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {phases.map((phase) => (
            <div
              key={phase.period}
              className="rounded-lg border border-border/30 bg-background/50 p-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: phase.color }} />
                <span className="text-xs font-mono font-semibold" style={{ color: phase.color }}>{phase.period}</span>
              </div>
              <div className="text-sm font-medium text-foreground">{phase.title}</div>
              <ul className="space-y-1">
                {phase.items.map((item) => (
                  <li key={item} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-muted-foreground/40 mt-0.5">-</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NurtureSequence() {
  const steps = [
    { day: 'Day 0', type: 'Welcome', desc: 'What they signed up for, one best-content link', color: '#10b981' },
    { day: 'Day 3', type: 'Value', desc: 'Genuinely useful guide or framework', color: '#3b82f6' },
    { day: 'Day 7', type: 'Authority', desc: 'Case study or data-backed result', color: '#a855f7' },
    { day: 'Day 14', type: 'Soft CTA', desc: 'Book a call or reply with a challenge', color: '#f59e0b' },
    { day: 'Day 21+', type: 'Newsletter', desc: 'Ongoing weekly or biweekly value', color: '#ef4444' },
  ];

  return (
    <div className="not-prose my-8 first:mt-0 last:mb-0">
      <div className="rounded-lg border border-border/50 bg-secondary/20 p-5 md:p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-4">Email Nurture Sequence</div>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={step.day} className="flex items-center gap-3">
              <div className="w-16 text-xs font-mono font-semibold flex-shrink-0" style={{ color: step.color }}>{step.day}</div>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: step.color }} />
              {i < steps.length - 1 && (
                <div className="absolute ml-[4.75rem] mt-8 w-px h-4 bg-border/30" />
              )}
              <div className="flex-1 flex items-center gap-2 rounded-md bg-background/50 border border-border/30 px-3 py-2">
                <span className="text-sm font-medium text-foreground">{step.type}</span>
                <span className="text-xs text-muted-foreground hidden sm:inline">{step.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

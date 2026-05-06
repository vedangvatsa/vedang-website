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

export function ImplementationChecklist() {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('playbook-checklist');
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
  }, []);

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem('playbook-checklist', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const weeks = [
    {
      week: 'Week 1',
      title: 'Foundation',
      color: '#f59e0b',
      days: [
        {
          day: 'Day 1',
          tasks: [
            { id: 'w1d1t1', task: 'Write brand-guidelines.md', detail: 'Voice, tone, formatting rules, anti-patterns, visual identity (hex codes, fonts)', time: '2-3 hrs' },
            { id: 'w1d1t2', task: 'Place guidelines in agent config', detail: 'Copy to .gemini/style.md (Antigravity), CLAUDE.md (Claude Code), or .cursorrules (Cursor)', time: '15 min' },
          ],
        },
        {
          day: 'Day 2',
          tasks: [
            { id: 'w1d2t1', task: 'Install and configure your coding agent', detail: 'Antigravity, Claude Code, or Cursor. Connect to your GitHub repos.', time: '30 min' },
            { id: 'w1d2t2', task: 'Set up MCP servers', detail: 'Google Sheets MCP, Postgres MCP, filesystem access. Test each connection.', time: '1 hr' },
          ],
        },
        {
          day: 'Day 3-4',
          tasks: [
            { id: 'w1d3t1', task: 'Deploy AI discovery files', detail: 'Run: npx github:vedangvatsa/ai-discovery-standards', time: '30 min' },
            { id: 'w1d3t2', task: 'Add JSON-LD structured data to key pages', detail: 'Organization, Person, Article, FAQ schemas. Use schema.org validator.', time: '2 hrs' },
            { id: 'w1d3t3', task: 'Write llms.txt', detail: 'Markdown summary of your site for AI systems. See llmstxt.org for format.', time: '1 hr' },
          ],
        },
        {
          day: 'Day 5',
          tasks: [
            { id: 'w1d5t1', task: 'Audit robots.txt for AI crawlers', detail: 'Allow search bots (OAI-SearchBot, PerplexityBot). Block training bots if desired.', time: '30 min' },
            { id: 'w1d5t2', task: 'Submit sitemap to Google Search Console', detail: 'Verify ownership, submit XML sitemap, check for indexing errors.', time: '30 min' },
          ],
        },
      ],
    },
    {
      week: 'Week 2',
      title: 'Email Infrastructure',
      color: '#f97316',
      days: [
        {
          day: 'Day 8',
          tasks: [
            { id: 'w2d1t1', task: 'Set up Resend or AWS SES', detail: 'Create account. Verify sending domain. Add SPF, DKIM, DMARC DNS records.', time: '1 hr' },
            { id: 'w2d1t2', task: 'Test email delivery', detail: 'Send test emails. Check spam score with mail-tester.com. Fix any issues.', time: '30 min' },
          ],
        },
        {
          day: 'Day 9-10',
          tasks: [
            { id: 'w2d2t1', task: 'Build email capture forms', detail: 'Add contextual forms to top 3 highest-traffic pages. Connect to database or email platform.', time: '2 hrs' },
            { id: 'w2d2t2', task: 'Set up subscriber storage', detail: 'Supabase table, Postgres, or directly in Resend audiences. Tag by source page.', time: '1 hr' },
          ],
        },
        {
          day: 'Day 11-12',
          tasks: [
            { id: 'w2d3t1', task: 'Write 5-email nurture sequence', detail: 'Day 0 welcome, Day 3 value, Day 7 authority, Day 14 soft CTA, Day 21+ newsletter.', time: '3 hrs' },
            { id: 'w2d3t2', task: 'Build send automation', detail: 'Cron job or GitHub Action that checks subscriber ages and sends appropriate email.', time: '2 hrs' },
          ],
        },
      ],
    },
    {
      week: 'Week 3',
      title: 'Outreach Pipeline',
      color: '#ef4444',
      days: [
        {
          day: 'Day 15-16',
          tasks: [
            { id: 'w3d1t1', task: 'Clone and configure b2b-outreach', detail: 'git clone vedangvatsa/b2b-outreach. Set up .env with API keys.', time: '1 hr' },
            { id: 'w3d1t2', task: 'Define your ICP in config/icp.yaml', detail: 'Industries, company sizes, funding stages, target titles, geographies.', time: '1 hr' },
            { id: 'w3d1t3', task: 'Write email sequence templates', detail: 'Cold intro, value-add, social proof, breakup. 4 emails over 14 days.', time: '2 hrs' },
          ],
        },
        {
          day: 'Day 17-18',
          tasks: [
            { id: 'w3d2t1', task: 'Import first lead list (50-100 leads)', detail: 'CSV from LinkedIn Sales Navigator, Apollo, or manual research.', time: '1 hr' },
            { id: 'w3d2t2', task: 'Run enrichment and personalization', detail: 'outreach enrich && outreach personalize. Review AI-generated messages.', time: '2 hrs' },
          ],
        },
        {
          day: 'Day 19',
          tasks: [
            { id: 'w3d3t1', task: 'Dry-run first campaign', detail: 'outreach campaign run --sequence cold_outreach --dry-run. Check output quality.', time: '1 hr' },
            { id: 'w3d3t2', task: 'Launch campaign', detail: 'Remove --dry-run flag. Start with 10-20 sends/day. Monitor deliverability.', time: '30 min' },
            { id: 'w3d3t3', task: 'Set up Google Sheets CRM sync', detail: 'Connect tracking sheet. Verify leads, messages, and statuses sync correctly.', time: '30 min' },
          ],
        },
      ],
    },
    {
      week: 'Week 4',
      title: 'Content and Social',
      color: '#a855f7',
      days: [
        {
          day: 'Day 22-23',
          tasks: [
            { id: 'w4d1t1', task: 'Create content calendar in Google Sheets', detail: 'Columns: topic, keyword, audience, publish date, status, social variants.', time: '1 hr' },
            { id: 'w4d1t2', task: 'Write first 2 blog posts using agent', detail: 'Provide topic and keyword. Agent researches, drafts following brand-guidelines.md. You edit.', time: '3 hrs' },
          ],
        },
        {
          day: 'Day 24-25',
          tasks: [
            { id: 'w4d2t1', task: 'Set up social media automation', detail: 'Create posting scripts for Twitter API, LinkedIn API, Telegram Bot API.', time: '3 hrs' },
            { id: 'w4d2t2', task: 'Build social listening alerts', detail: 'Script that monitors brand mentions on Twitter/Reddit/HN. Posts to Slack on match.', time: '2 hrs' },
          ],
        },
        {
          day: 'Day 26',
          tasks: [
            { id: 'w4d3t1', task: 'Build management dashboard', detail: 'Google Sheets with tabs: SEO metrics, outreach stats, content calendar, pipeline.', time: '2 hrs' },
            { id: 'w4d3t2', task: 'Connect all pipelines to dashboard', detail: 'Each script writes completion metrics to the tracking sheet.', time: '1 hr' },
          ],
        },
      ],
    },
    {
      week: 'Month 2',
      title: 'Scale and Authority',
      color: '#3b82f6',
      days: [
        {
          day: 'Week 5-6',
          tasks: [
            { id: 'm2w1t1', task: 'Publish first consulting-grade report', detail: 'Clone consulting-report-framework. Pick topic. Agent drafts 12 sections. Generate charts. Compile PDF.', time: '8-10 hrs' },
            { id: 'm2w1t2', task: 'Deploy competitive intelligence scripts', detail: 'Pricing page monitor, careers page scraper, changelog reader. Schedule daily via cron.', time: '4 hrs' },
          ],
        },
        {
          day: 'Week 7-8',
          tasks: [
            { id: 'm2w2t1', task: 'Deploy customer support automation', detail: 'Connect inbox to AI triage. Build Tier 0 auto-responses. Set up draft queue for Tier 1.', time: '6 hrs' },
            { id: 'm2w2t2', task: 'Scale outreach to 50+ sends/day', detail: 'Warm up domain. Add second sending domain if needed. Expand lead lists.', time: '2 hrs' },
            { id: 'm2w2t3', task: 'Optimize for AEO/GEO', detail: 'Restructure top 10 pages with question-format H2s. Add FAQ schema. Publish llms-full.txt.', time: '4 hrs' },
          ],
        },
      ],
    },
    {
      week: 'Month 3',
      title: 'Full Automation',
      color: '#10b981',
      days: [
        {
          day: 'Week 9-10',
          tasks: [
            { id: 'm3w1t1', task: 'Build internal knowledge base', detail: 'Index Google Docs, Slack channels, meeting transcripts. Deploy query interface.', time: '6 hrs' },
            { id: 'm3w1t2', task: 'Set up meeting transcription pipeline', detail: 'Whisper for transcription. Agent extracts action items. Posts to Slack.', time: '3 hrs' },
          ],
        },
        {
          day: 'Week 11-12',
          tasks: [
            { id: 'm3w2t1', task: 'Build proposal generation pipeline', detail: 'Form input -> agent assembles case studies + pricing + scope -> PDF output.', time: '4 hrs' },
            { id: 'm3w2t2', task: 'Audit and iterate all pipelines', detail: 'Review metrics. Kill underperforming automations. Double down on what works.', time: '4 hrs' },
            { id: 'm3w2t3', task: 'Document all systems', detail: 'Write runbooks for each pipeline. Ensure any team member can maintain them.', time: '3 hrs' },
          ],
        },
      ],
    },
  ];

  const totalTasks = weeks.flatMap(w => w.days.flatMap(d => d.tasks)).length;
  const completedTasks = Object.values(checked).filter(Boolean).length;

  return (
    <div className="not-prose my-8 first:mt-0 last:mb-0">
      <div className="rounded-lg border border-border/50 bg-secondary/20 p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary/70">90-Day Implementation Checklist</div>
          <div className="text-xs text-muted-foreground">
            {completedTasks}/{totalTasks} tasks
          </div>
        </div>
        <div className="w-full bg-secondary/60 rounded-full h-2 mb-6">
          <div
            className="h-2 rounded-full transition-all duration-500 bg-green-500"
            style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
          />
        </div>
        <div className="space-y-6">
          {weeks.map((week) => (
            <details key={week.week} className="group">
              <summary className="cursor-pointer flex items-center gap-3 py-2 select-none">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: week.color }} />
                <span className="text-sm font-semibold text-foreground">{week.week}</span>
                <span className="text-xs text-muted-foreground">{week.title}</span>
                <svg className="w-4 h-4 text-muted-foreground/50 ml-auto transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </summary>
              <div className="pl-5 space-y-4 mt-2">
                {week.days.map((day) => (
                  <div key={day.day}>
                    <div className="text-xs font-mono font-semibold text-muted-foreground mb-2">{day.day}</div>
                    <div className="space-y-2">
                      {day.tasks.map((task) => (
                        <label
                          key={task.id}
                          className="flex items-start gap-3 rounded-md bg-background/50 border border-border/30 px-3 py-2.5 cursor-pointer hover:bg-background/80 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={!!checked[task.id]}
                            onChange={() => toggle(task.id)}
                            className="mt-0.5 rounded border-border"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-sm font-medium ${checked[task.id] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {task.task}
                              </span>
                              <span className="text-[10px] font-mono text-muted-foreground/60 flex-shrink-0">{task.time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{task.detail}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

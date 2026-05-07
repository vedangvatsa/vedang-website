'use client';

/* ─── Module 1: Vibe Coding Shift ─── */
export function VibeCodingShift() {
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Paradigm Shift</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">From writing code to directing AI</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-[3px] border-2 border-red-200 dark:border-red-900/40 p-4">
            <div className="text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-wider mb-3">Traditional Development</div>
            {['Learn syntax and frameworks', 'Debug semicolons and brackets', '90% coding, 10% product thinking', 'Months to ship a prototype', 'Bottleneck: typing speed'].map((item) => (
              <div key={item} className="text-[11px] text-muted-foreground py-1 border-b border-[#e3e3e0]/30 dark:border-zinc-800/30 last:border-0">{item}</div>
            ))}
          </div>
          <div className="rounded-[3px] border-2 border-blue-300 dark:border-blue-800/60 p-4">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">Vibe Coding</div>
            {['Describe what you want in English', 'AI handles syntax and debugging', '90% product thinking, 10% review', 'Days to ship a prototype', 'Bottleneck: clarity of thought'].map((item) => (
              <div key={item} className="text-[11px] text-muted-foreground py-1 border-b border-[#e3e3e0]/30 dark:border-zinc-800/30 last:border-0">{item}</div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 1: GCES Framework ─── */
export function GCESFramework() {
  const steps = [
    { letter: 'G', title: 'Goal', desc: 'What should the AI do? Start with a specific action verb.', example: '"Build a responsive pricing page with 3 tiers"', color: '#3b82f6' },
    { letter: 'C', title: 'Context', desc: 'Who are the users? What is the purpose? Why does this exist?', example: '"SaaS landing page for a developer tool"', color: '#8b5cf6' },
    { letter: 'E', title: 'Expectations', desc: 'What are the strict rules? Layout, behavior, responsiveness.', example: '"Dark mode, mobile-first, no external dependencies"', color: '#f59e0b' },
    { letter: 'S', title: 'Source', desc: 'Reference a design you admire. AI learns fastest from examples.', example: '"Similar to Linear.app pricing page"', color: '#10b981' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The GCES Framework</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">The four components of a perfect AI prompt</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {steps.map((s) => (
            <div key={s.letter} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderTopWidth: '3px', borderTopColor: s.color }}>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: s.color }}>{s.letter}</div>
                  <span className="text-xs font-bold" style={{ color: s.color }}>{s.title}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mb-1.5">{s.desc}</p>
                <p className="text-[10px] text-muted-foreground/60 italic">{s.example}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 6: Debugging Flow ─── */
export function DebuggingFlow() {
  const steps = [
    { num: '1', label: 'Error Appears', desc: 'Code breaks. Read the error message carefully.', color: '#ef4444' },
    { num: '2', label: 'Copy Full Context', desc: 'Copy the complete error text, not just the first line.', color: '#f59e0b' },
    { num: '3', label: 'Paste to AI', desc: 'Include the error, relevant code, and what you expected.', color: '#3b82f6' },
    { num: '4', label: 'Apply Fix', desc: 'Let AI explain the fix. Apply it. Run the code again.', color: '#8b5cf6' },
    { num: '5', label: 'Test & Loop', desc: 'Still broken? Loop again with the new error and more context.', color: '#10b981' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Debugging Cycle</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Error → Context → AI → Fix → Test → Loop</p>

        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-[#e3e3e0] dark:bg-zinc-800" />
          <div className="space-y-2.5">
            {steps.map((s) => (
              <div key={s.num} className="grid grid-cols-[36px_1fr] gap-3 items-start">
                <div className="relative flex items-center justify-center pt-1">
                  <div className="w-[9px] h-[9px] rounded-full" style={{ backgroundColor: s.color }} />
                </div>
                <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3">
                  <span className="text-xs font-bold" style={{ color: s.color }}>Step {s.num}: {s.label}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-[3px] bg-[#f7f6f3] dark:bg-zinc-800/40 px-4 py-2.5">
          <span className="text-[11px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)]"><strong>Key rule:</strong> Never just say "it's not working." Always give the AI the exact error message, the relevant code, and what you expected to happen.</span>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 7: Deployment Stack ─── */
export function DeploymentStack() {
  const layers = [
    { layer: 'Frontend', desc: 'Your application code', options: 'Next.js, React, Vite, HTML/CSS/JS', color: '#3b82f6' },
    { layer: 'Hosting', desc: 'Where it runs in the cloud', options: 'Vercel (recommended), Netlify, Cloudflare Pages', color: '#8b5cf6' },
    { layer: 'Database', desc: 'Persistent data storage', options: 'Supabase, Firebase, Neon, PlanetScale', color: '#10b981' },
    { layer: 'Domain', desc: 'Your custom web address', options: 'Namecheap, Cloudflare DNS, Google Domains', color: '#f59e0b' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Deployment Stack</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Four layers from code to production</p>

        <div className="space-y-1.5">
          {layers.map((l) => (
            <div key={l.layer} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderLeftWidth: '3px', borderLeftColor: l.color }}>
              <div className="px-4 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                <div>
                  <span className="text-xs font-bold" style={{ color: l.color }}>{l.layer}</span>
                  <span className="text-[10px] text-muted-foreground ml-2">{l.desc}</span>
                </div>
                <span className="text-[10px] text-muted-foreground/60">{l.options}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

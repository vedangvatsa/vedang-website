

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

/* ─── Module 1 (B): Vibe Coding Manifesto ─── */
export function VibeCodingManifesto() {
  const principles = [
    { principle: 'Intent over syntax', desc: 'Describe what you want, not how to code it', old: 'Write a for loop', now: '"Filter items where price > 50"' },
    { principle: 'Iterate fast', desc: 'First version in minutes, not hours', old: 'Plan, scaffold, implement', now: 'Prompt, review, ship' },
    { principle: 'AI handles boilerplate', desc: 'Config, setup, and plumbing are AI territory', old: 'Write webpack config by hand', now: '"Set up a Next.js project with TypeScript"' },
    { principle: 'Human handles taste', desc: 'UX decisions, design judgment, and product vision stay human', old: 'Both code and design', now: 'Design intent, AI implements' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Vibe Coding Manifesto</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Four principles that define the new way of building software</p>
        <div className="space-y-2">
          {principles.map(p => (
            <div key={p.principle} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3">
              <span className="text-xs font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{p.principle}</span>
              <p className="text-[10px] text-muted-foreground mt-0.5 mb-1.5">{p.desc}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-[10px] rounded-[3px] bg-red-50 dark:bg-red-900/10 px-2.5 py-1.5"><span className="font-bold text-red-600 dark:text-red-400">Before: </span><span className="text-red-800/70 dark:text-red-300/70">{p.old}</span></div>
                <div className="text-[10px] rounded-[3px] bg-green-50 dark:bg-green-900/10 px-2.5 py-1.5"><span className="font-bold text-green-600 dark:text-green-400">Now: </span><span className="text-green-800/70 dark:text-green-300/70">{p.now}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 2 (B): Tool Selection ─── */
export function ToolSelectionGuide() {
  const tools = [
    { name: 'Cursor', type: 'IDE', skill: 'Any', cost: '$20/mo', best: 'Daily coding with AI assistance', color: '#3b82f6' },
    { name: 'Lovable', type: 'Web Builder', skill: 'Beginner', cost: 'Free tier', best: 'Full-stack apps without local setup', color: '#8b5cf6' },
    { name: 'v0', type: 'Component Gen', skill: 'Intermediate', cost: 'Free tier', best: 'React/Next.js component generation', color: '#10b981' },
    { name: 'Claude Code', type: 'Terminal Agent', skill: 'Advanced', cost: 'API pricing', best: 'Autonomous multi-file changes', color: '#f59e0b' },
    { name: 'Antigravity', type: 'IDE Agent', skill: 'Any', cost: 'Included', best: 'Deep codebase understanding + execution', color: '#ef4444' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Tool Selection Guide</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Choosing the right AI coding tool for your workflow</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead><tr className="border-b border-[#e3e3e0] dark:border-zinc-800">
              {['Tool', 'Type', 'Skill Level', 'Cost', 'Best For'].map(h => (
                <th key={h} className="text-left px-2 py-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {tools.map(t => (
                <tr key={t.name} className="border-b border-[#e3e3e0]/40 dark:border-zinc-800/40">
                  <td className="px-2 py-2 font-bold" style={{ color: t.color }}>{t.name}</td>
                  <td className="px-2 py-2 text-muted-foreground">{t.type}</td>
                  <td className="px-2 py-2 text-muted-foreground">{t.skill}</td>
                  <td className="px-2 py-2 font-mono text-muted-foreground">{t.cost}</td>
                  <td className="px-2 py-2 text-muted-foreground/60">{t.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 3 (B): Prompt Library ─── */
export function PromptLibrary() {
  const prompts = [
    { category: 'Scaffold', prompt: '"Create a Next.js 14 app with TypeScript, Tailwind, and shadcn/ui"', output: 'Full project structure', color: '#3b82f6' },
    { category: 'Feature', prompt: '"Add user authentication with email/password using NextAuth"', output: 'Auth flow + UI', color: '#10b981' },
    { category: 'Debug', prompt: '"This error occurs on line 42. The expected behavior is X, actual is Y"', output: 'Root cause + fix', color: '#ef4444' },
    { category: 'Refactor', prompt: '"Extract the data fetching logic into a custom hook"', output: 'Clean abstraction', color: '#8b5cf6' },
    { category: 'Test', prompt: '"Write unit tests for the user service. Cover edge cases"', output: 'Test suite', color: '#f59e0b' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Prompt Library</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Battle-tested prompts for common development tasks</p>
        <div className="space-y-1.5">
          {prompts.map(p => (
            <div key={p.category} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 px-4 py-2.5 flex items-center gap-3" style={{ borderLeftWidth: '3px', borderLeftColor: p.color }}>
              <span className="text-xs font-bold min-w-[70px]" style={{ color: p.color }}>{p.category}</span>
              <span className="text-[10px] font-mono text-muted-foreground flex-1">{p.prompt}</span>
              <span className="text-[10px] text-muted-foreground/60 hidden md:block">{p.output}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 4 (B): Lab Projects ─── */
export function LabProjectIdeas() {
  const projects = [
    { name: 'Personal Dashboard', time: '2 hours', stack: 'Next.js + API routes', difficulty: 'Beginner', color: '#10b981' },
    { name: 'Blog with MDX', time: '3 hours', stack: 'Next.js + MDX + Vercel', difficulty: 'Beginner', color: '#3b82f6' },
    { name: 'SaaS Landing Page', time: '1 hour', stack: 'Next.js + shadcn/ui', difficulty: 'Beginner', color: '#f59e0b' },
    { name: 'Full-Stack CRUD App', time: '4 hours', stack: 'Next.js + Supabase + Auth', difficulty: 'Intermediate', color: '#8b5cf6' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Lab Project Ideas</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Start-to-finish projects you can build with AI assistance</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {projects.map(p => (
            <div key={p.name} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3" style={{ borderLeftWidth: '3px', borderLeftColor: p.color }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold" style={{ color: p.color }}>{p.name}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: p.color + '15', color: p.color }}>{p.difficulty}</span>
              </div>
              <div className="text-[10px] text-muted-foreground">{p.stack}</div>
              <div className="text-[10px] text-muted-foreground/60 mt-0.5">Estimated: {p.time}</div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 5 (B): Quality Gates ─── */
export function ProductQualityGates() {
  const gates = [
    { gate: 'Visual', checks: ['Responsive on mobile, tablet, desktop', 'Dark mode works correctly', 'No layout shifts on load'], color: '#3b82f6' },
    { gate: 'Functional', checks: ['All user flows work end-to-end', 'Error states handled gracefully', 'Forms validate input'], color: '#10b981' },
    { gate: 'Performance', checks: ['Lighthouse score > 90', 'No unnecessary re-renders', 'Images optimized'], color: '#f59e0b' },
    { gate: 'Shipping', checks: ['SEO meta tags present', 'Analytics tracking live', 'Deployed to production URL'], color: '#8b5cf6' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Product Quality Gates</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Four checkpoints before shipping any project</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {gates.map(g => (
            <div key={g.gate} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden">
              <div className="px-3 py-2 border-b border-[#e3e3e0] dark:border-zinc-800" style={{ backgroundColor: g.color + '08' }}>
                <span className="text-xs font-bold" style={{ color: g.color }}>{g.gate}</span>
              </div>
              <div className="px-3 py-2">
                {g.checks.map(c => (
                  <div key={c} className="flex items-start gap-2 py-1">
                    <div className="w-3 h-3 rounded-sm border border-[#e3e3e0] dark:border-zinc-700 shrink-0 mt-0.5" />
                    <span className="text-[10px] text-muted-foreground">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 6 (B): Debug Decision Tree ─── */
export function DebugDecisionTree() {
  const decisions = [
    { error: 'Build error', first: 'Read the error message line number', then: 'Paste exact error + surrounding code to AI', color: '#ef4444' },
    { error: 'Runtime crash', first: 'Check browser console for stack trace', then: 'Share component tree + state context with AI', color: '#f59e0b' },
    { error: 'Wrong output', first: 'Compare expected vs actual in detail', then: 'Describe the gap with specific examples', color: '#3b82f6' },
    { error: 'Performance issue', first: 'Profile with React DevTools or Lighthouse', then: 'Share metrics + component causing bottleneck', color: '#8b5cf6' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Debug Decision Tree</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">How to diagnose issues and get effective AI help</p>
        <div className="space-y-1.5">
          {decisions.map(d => (
            <div key={d.error} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 px-4 py-2.5 flex flex-col md:flex-row md:items-center gap-1 md:gap-3" style={{ borderLeftWidth: '3px', borderLeftColor: d.color }}>
              <span className="text-xs font-bold min-w-[120px]" style={{ color: d.color }}>{d.error}</span>
              <span className="text-[10px] text-muted-foreground">First: {d.first}</span>
              <span className="text-[10px] text-muted-foreground/60">Then: {d.then}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 7 (B): Deployment Checklist ─── */
export function DeploymentChecklist() {
  const steps = [
    { step: 'Build locally', desc: 'Run npm run build and fix all errors before deploying', status: 'Required', color: '#ef4444' },
    { step: 'Environment variables', desc: 'Set all secrets in the hosting provider dashboard', status: 'Required', color: '#ef4444' },
    { step: 'Custom domain', desc: 'Point your domain DNS to the hosting provider', status: 'Recommended', color: '#f59e0b' },
    { step: 'SSL certificate', desc: 'Most providers auto-issue via Let\'s Encrypt', status: 'Auto', color: '#10b981' },
    { step: 'Analytics', desc: 'Add Plausible, PostHog, or Vercel Analytics', status: 'Recommended', color: '#f59e0b' },
    { step: 'Error monitoring', desc: 'Set up Sentry or similar for production errors', status: 'Recommended', color: '#f59e0b' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Deployment Checklist</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Steps to go from local development to production</p>
        <div className="space-y-1.5">
          {steps.map(s => (
            <div key={s.step} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 px-4 py-2.5 flex items-center gap-3">
              <span className="text-xs font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] min-w-[150px]">{s.step}</span>
              <span className="text-[10px] text-muted-foreground flex-1">{s.desc}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: s.color + '15', color: s.color }}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}


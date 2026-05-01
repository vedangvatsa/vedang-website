'use client';

import { Eye, Lightbulb, Ruler, Image } from 'lucide-react';

/* ─── Module 1: Vibe Coding Shift ─── */
export function VibeCodingShift() {
  return (
    <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-5 rounded-xl border bg-slate-500/5 border-slate-500/20">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">Traditional Development</div>
        <div className="font-semibold text-sm mb-2">You write every line of code</div>
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />Learn syntax and frameworks</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />Debug semicolons and brackets</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />90% coding, 10% product thinking</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />Months to ship a prototype</div>
        </div>
      </div>
      <div className="p-5 rounded-xl border bg-blue-500/5 border-blue-500/20">
        <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">Vibe Coding</div>
        <div className="font-semibold text-sm mb-2">You direct, AI writes code</div>
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />Describe what you want in English</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />AI handles syntax and debugging</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />90% product thinking, 10% review</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />Days to ship a prototype</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Module 1: GCES Framework ─── */
export function GCESFramework() {
  const steps = [
    { icon: Eye, letter: 'G', title: 'Goal', desc: 'What should the AI do? Start with a specific action verb.', color: '#3b82f6', bg: 'bg-blue-500/10' },
    { icon: Lightbulb, letter: 'C', title: 'Context', desc: 'Who are the users? What is the purpose? Why does this exist?', color: '#8b5cf6', bg: 'bg-violet-500/10' },
    { icon: Ruler, letter: 'E', title: 'Expectations', desc: 'What are the strict rules? Layout, behavior, responsiveness.', color: '#f59e0b', bg: 'bg-amber-500/10' },
    { icon: Image, letter: 'S', title: 'Source', desc: 'Reference a design you admire. AI learns fastest from examples.', color: '#10b981', bg: 'bg-emerald-500/10' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-2 md:grid-cols-4 gap-3">
      {steps.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.letter} className="p-4 rounded-xl border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <div className={`${s.bg} p-1.5 rounded-lg`} style={{ color: s.color }}><Icon className="w-4 h-4" /></div>
              <span className="font-bold text-lg" style={{ color: s.color }}>{s.letter}</span>
            </div>
            <h4 className="font-semibold text-sm mb-1">{s.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

export function DebuggingFlow() {
  return (
    <div className="not-prose my-6">
      <svg viewBox="0 0 800 180" className="w-full h-auto hidden sm:block" role="img" aria-label="Debugging cycle: Error → Read → Copy → Paste to AI → Fix → Test">
        {/* Flow arrows */}
        {[
          { x: 20, label: '1. Error', desc: 'Code breaks', color: '#ef4444' },
          { x: 170, label: '2. Read', desc: 'Find the message', color: '#f59e0b' },
          { x: 320, label: '3. Copy', desc: 'Full error text', color: '#3b82f6' },
          { x: 470, label: '4. Paste to AI', desc: 'With context', color: '#8b5cf6' },
          { x: 620, label: '5. Apply Fix', desc: 'Test again', color: '#10b981' },
        ].map((step, i) => (
          <g key={step.label}>
            <rect x={step.x} y={30} width={130} height={90} rx={12} fill={`${step.color}15`} stroke={step.color} strokeWidth={1.5} />
            <text x={step.x + 65} y={65} textAnchor="middle" fill={step.color} fontSize={13} fontWeight={700}>{step.label}</text>
            <text x={step.x + 65} y={95} textAnchor="middle" fill="currentColor" fontSize={11} opacity={0.6}>{step.desc}</text>
            {i < 4 && (
              <path d={`M${step.x + 135} 75 L${step.x + 165} 75`} stroke="currentColor" strokeWidth={1.5} opacity={0.3} markerEnd="url(#arrowhead)" />
            )}
          </g>
        ))}
        {/* Loop back arrow */}
        <path d="M750 120 Q780 150 400 165 Q20 150 50 120" fill="none" stroke="#ef4444" strokeWidth={1.2} strokeDasharray="4 3" opacity={0.5} />
        <text x={400} y={160} textAnchor="middle" fill="#ef4444" fontSize={10} opacity={0.7}>Still broken? Loop again with more context</text>
        <defs>
          <marker id="arrowhead" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
            <path d="M0 0 L8 3 L0 6 Z" fill="currentColor" opacity={0.4} />
          </marker>
        </defs>
      </svg>
      {/* Mobile fallback */}
      <div className="sm:hidden grid grid-cols-1 gap-2">
        {[
          { label: '1. Error', desc: 'Code breaks', color: '#ef4444' },
          { label: '2. Read', desc: 'Find the message', color: '#f59e0b' },
          { label: '3. Copy', desc: 'Full error text', color: '#3b82f6' },
          { label: '4. Paste to AI', desc: 'With context', color: '#8b5cf6' },
          { label: '5. Apply Fix', desc: 'Test again', color: '#10b981' },
        ].map((item, i) => (
          <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl border bg-card">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: item.color }}>{i + 1}</div>
            <div>
              <h4 className="font-semibold text-sm" style={{ color: item.color }}>{item.label}</h4>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Module 7: Deployment & Databases ─── */
export function DeploymentStack() {
  const layers = [
    { label: 'Frontend', desc: 'Next.js, React, HTML/CSS', color: '#3b82f6', y: 20 },
    { label: 'Hosting', desc: 'Vercel, Netlify, Cloudflare', color: '#8b5cf6', y: 70 },
    { label: 'Database', desc: 'Supabase, Firebase, Neon', color: '#10b981', y: 120 },
    { label: 'Domain', desc: 'yourapp.com via DNS', color: '#f59e0b', y: 170 },
  ];
  return (
    <div className="not-prose my-6">
      <svg viewBox="0 0 700 220" className="w-full h-auto hidden sm:block" role="img" aria-label="Deployment stack: Frontend, Hosting, Database, Domain">
        {layers.map((l) => (
          <g key={l.label}>
            <rect x={50} y={l.y} width={600} height={40} rx={8} fill={`${l.color}12`} stroke={l.color} strokeWidth={1.5} />
            <text x={80} y={l.y + 25} fill={l.color} fontSize={14} fontWeight={700}>{l.label}</text>
            <text x={620} y={l.y + 25} textAnchor="end" fill="currentColor" fontSize={12} opacity={0.5}>{l.desc}</text>
          </g>
        ))}
        {/* Connecting lines */}
        {[55, 105, 155].map((y) => (
          <line key={y} x1={350} y1={y + 5} x2={350} y2={y + 15} stroke="currentColor" strokeWidth={1.2} opacity={0.2} strokeDasharray="3 2" />
        ))}
      </svg>
      {/* Mobile fallback */}
      <div className="sm:hidden flex flex-col gap-2">
        {layers.map((l) => (
          <div key={l.label} className="p-3 rounded-xl border bg-card flex items-center gap-3">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
            <div>
              <h4 className="font-semibold text-sm" style={{ color: l.color }}>{l.label}</h4>
              <p className="text-xs text-muted-foreground">{l.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

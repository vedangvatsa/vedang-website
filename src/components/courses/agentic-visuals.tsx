'use client';

import { Bot, Cpu, Globe, Wrench, Brain, Zap, ShieldAlert, Network } from 'lucide-react';

/* ─── Module 1: Information Web → Action Web ─── */
export function ActionWebEvolution() {
  const eras = [
    { label: 'Information Web', desc: 'Search → Read → Decide → Act (manually)', detail: 'You google, read results, compare options, then do the work yourself.', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-500/5 border-slate-500/20' },
    { label: 'Agentic Web', desc: 'Instruct → Agent Acts → Review', detail: 'You describe the goal. AI agents research, execute, and report back autonomously.', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/5 border-purple-500/20' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {eras.map((e, i) => (
        <div key={e.label} className={`p-5 rounded-xl border ${e.bg} relative`}>
          {i < eras.length - 1 && <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg z-10">→</div>}
          <div className={`text-xs font-bold uppercase tracking-wider ${e.color} mb-2`}>{e.label}</div>
          <div className="font-semibold text-sm mb-2">{e.desc}</div>
          <p className="text-xs text-muted-foreground leading-relaxed">{e.detail}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Module 2: Core Components ─── */
export function AgentComponents() {
  const components = [
    { icon: Brain, title: 'LLM Core', desc: 'The reasoning engine that plans, decides, and generates responses.', color: 'text-violet-600 dark:text-violet-400', iconBg: 'bg-violet-500/10' },
    { icon: Wrench, title: 'Tools', desc: 'APIs, databases, web browsers — the hands the agent uses to act in the world.', color: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-500/10' },
    { icon: Cpu, title: 'Memory', desc: 'Short-term (conversation) and long-term (vector DB) context for continuity.', color: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-500/10' },
    { icon: Network, title: 'Orchestration', desc: 'Planning loops, task decomposition, and self-reflection to coordinate work.', color: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-500/10' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {components.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.title} className="p-4 rounded-xl border bg-card">
            <div className={`${c.iconBg} p-2 rounded-lg ${c.color} inline-block mb-3`}><Icon className="w-5 h-5" /></div>
            <h4 className="font-semibold text-sm mb-1">{c.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Module 3: Three Dimensions ─── */
export function AgenticDimensions() {
  const dims = [
    { title: 'Single Agent', desc: 'One LLM with tools — handles tasks like research, coding, or data analysis.', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/5 border-blue-500/20' },
    { title: 'Multi-Agent', desc: 'Teams of specialized agents collaborating — researcher, coder, reviewer.', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/5 border-violet-500/20' },
    { title: 'Agent-to-Agent', desc: 'Agents across organizations communicate via protocols like MCP and A2A.', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/5 border-rose-500/20' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {dims.map((d) => (
        <div key={d.title} className={`p-5 rounded-xl border ${d.bg}`}>
          <h4 className={`font-semibold text-sm mb-2 ${d.color}`}>{d.title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{d.desc}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Module 4: Applications ─── */
export function AgenticApps() {
  const apps = [
    { icon: Bot, title: 'Coding Agents', desc: 'Devin, Claude Code, Cursor — write, test, and deploy code autonomously.', color: 'text-green-600 dark:text-green-400', iconBg: 'bg-green-500/10' },
    { icon: Globe, title: 'Research Agents', desc: 'Deep Research, Perplexity — multi-step web research with cited reports.', color: 'text-cyan-600 dark:text-cyan-400', iconBg: 'bg-cyan-500/10' },
    { icon: Zap, title: 'Workflow Agents', desc: 'Zapier AI, Make — automate business processes across SaaS tools.', color: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-500/10' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {apps.map((a) => {
        const Icon = a.icon;
        return (
          <div key={a.title} className="p-5 rounded-xl border bg-card">
            <div className={`${a.iconBg} p-2 rounded-lg ${a.color} inline-block mb-3`}><Icon className="w-5 h-5" /></div>
            <h4 className="font-semibold text-sm mb-1">{a.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Module 5: Challenges & Future ─── */
export function AgenticFuture() {
  const items = [
    { title: 'Hallucination Risk', desc: 'Agents can confidently take wrong actions. Human-in-the-loop checkpoints are essential.', type: 'challenge' },
    { title: 'Security', desc: 'Agents with tool access can cause real damage. Sandboxing and permission scopes are critical.', type: 'challenge' },
    { title: 'Cost', desc: 'Multi-step agent runs consume many API tokens. Optimizing reasoning loops reduces cost.', type: 'challenge' },
    { title: 'Personal AI Staff', desc: 'Every person will have AI agents managing email, scheduling, research, and finances.', type: 'opportunity' },
    { title: 'Agent Economy', desc: 'Agents will hire other agents for specialized tasks, creating autonomous marketplaces.', type: 'opportunity' },
    { title: 'Ambient Intelligence', desc: 'AI woven into every device and service — proactively acting before you ask.', type: 'opportunity' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Challenges</div>
        {items.filter(i => i.type === 'challenge').map((item) => (
          <div key={item.title} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
            <div className="font-medium text-sm mb-1">{item.title}</div>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2"><Zap className="w-4 h-4" /> Opportunities</div>
        {items.filter(i => i.type === 'opportunity').map((item) => (
          <div key={item.title} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
            <div className="font-medium text-sm mb-1">{item.title}</div>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

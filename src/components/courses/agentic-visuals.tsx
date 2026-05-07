'use client';

/* ─── Module 1: Information Web → Action Web ─── */
export function ActionWebEvolution() {
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Paradigm Shift</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">From searching and reading to instructing and reviewing</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-[3px] border-2 border-slate-200 dark:border-zinc-700 p-4">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Information Web (Today)</div>
            {['You Google a question', 'Read 10 links and compare', 'Make a decision yourself', 'Execute the task manually'].map((item) => (
              <div key={item} className="text-[11px] text-muted-foreground py-1 border-b border-[#e3e3e0]/30 dark:border-zinc-800/30 last:border-0">{item}</div>
            ))}
          </div>
          <div className="rounded-[3px] border-2 border-purple-300 dark:border-purple-800/60 p-4">
            <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-3">Agentic Web (Emerging)</div>
            {['You describe the goal in natural language', 'Agent researches, compares, decides', 'Agent executes across tools and APIs', 'You review the result and approve'].map((item) => (
              <div key={item} className="text-[11px] text-muted-foreground py-1 border-b border-[#e3e3e0]/30 dark:border-zinc-800/30 last:border-0">{item}</div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 2: Core Components ─── */
export function AgentComponents() {
  const components = [
    { title: 'LLM Core', desc: 'The reasoning engine that plans, decides, and generates responses', role: 'Brain: processes language and makes decisions', color: '#8b5cf6' },
    { title: 'Tools', desc: 'APIs, databases, browsers: the hands the agent uses to act', role: 'Hands: executes actions in the real world', color: '#3b82f6' },
    { title: 'Memory', desc: 'Short-term (conversation) and long-term (vector DB) context', role: 'Memory: maintains continuity across sessions', color: '#f59e0b' },
    { title: 'Orchestration', desc: 'Planning loops, task decomposition, and self-reflection', role: 'Manager: coordinates multi-step workflows', color: '#10b981' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Agent Architecture</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Four components that make an AI agent work</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {components.map((c) => (
            <div key={c.title} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderLeftWidth: '3px', borderLeftColor: c.color }}>
              <div className="px-4 py-2.5">
                <span className="text-xs font-bold" style={{ color: c.color }}>{c.title}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">{c.desc}</p>
                <p className="text-[10px] text-muted-foreground/60 italic mt-0.5">{c.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 3: Three Dimensions ─── */
export function AgenticDimensions() {
  const dims = [
    { title: 'Single Agent', desc: 'One LLM with tools: handles research, coding, data analysis', examples: 'Claude + MCP, Cursor, ChatGPT with plugins', complexity: 'Simple', color: '#3b82f6' },
    { title: 'Multi-Agent', desc: 'Teams of specialized agents collaborating on complex tasks', examples: 'Researcher + Coder + Reviewer pipeline', complexity: 'Moderate', color: '#8b5cf6' },
    { title: 'Agent-to-Agent', desc: 'Agents across organizations communicate via open protocols', examples: 'Your booking agent talks to airline agent via A2A', complexity: 'Advanced', color: '#ef4444' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Three Dimensions of Agency</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">From simple tool use to autonomous agent networks</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {dims.map((d) => (
            <div key={d.title} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderTopWidth: '3px', borderTopColor: d.color }}>
              <div className="p-3">
                <span className="text-xs font-bold" style={{ color: d.color }}>{d.title}</span>
                <p className="text-[10px] text-muted-foreground mt-1 mb-2">{d.desc}</p>
                <div className="text-[10px] text-muted-foreground/60"><strong>Examples:</strong> {d.examples}</div>
                <div className="text-[10px] text-muted-foreground/60 mt-0.5"><strong>Complexity:</strong> {d.complexity}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 4: Applications ─── */
export function AgenticApps() {
  const apps = [
    { title: 'Coding Agents', desc: 'Write, test, and deploy code autonomously', examples: 'Devin, Claude Code, Cursor, Antigravity', status: 'Production-ready', color: '#10b981' },
    { title: 'Research Agents', desc: 'Multi-step web research with cited reports', examples: 'Deep Research, Perplexity, Grok', status: 'Production-ready', color: '#3b82f6' },
    { title: 'Workflow Agents', desc: 'Automate business processes across SaaS tools', examples: 'n8n, Zapier AI, Make AI', status: 'Growing', color: '#f59e0b' },
    { title: 'Computer Use', desc: 'Control a full desktop GUI like a human', examples: 'Claude Computer Use, OpenAI Operator', status: 'Early stage', color: '#8b5cf6' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Agent Applications Today</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Where AI agents are already shipping value</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[420px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Category</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">What it does</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Products</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.title} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2 px-2 font-bold" style={{ color: a.color }}>{a.title}</td>
                  <td className="py-2 px-2 text-muted-foreground">{a.desc}</td>
                  <td className="py-2 px-2 text-muted-foreground/60">{a.examples}</td>
                  <td className="py-2 px-2 text-muted-foreground">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 5: Challenges & Opportunities ─── */
export function AgenticFuture() {
  const challenges = [
    { title: 'Hallucination Risk', desc: 'Agents can confidently take wrong actions. Human-in-the-loop checkpoints are essential.' },
    { title: 'Security Surface', desc: 'Agents with tool access can cause real damage. Sandboxing and permission scopes are critical.' },
    { title: 'Cost & Latency', desc: 'Multi-step agent runs consume many API tokens. Optimizing reasoning loops reduces cost.' },
  ];
  const opportunities = [
    { title: 'Personal AI Staff', desc: 'Every person will have AI agents managing email, scheduling, research, and finances.' },
    { title: 'Agent Economy', desc: 'Agents will hire other agents for specialized tasks, creating autonomous marketplaces.' },
    { title: 'Ambient Intelligence', desc: 'AI woven into every device and service: proactively acting before you ask.' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Challenges vs Opportunities</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">What's holding agents back, and what's pulling them forward</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden">
            <div className="px-4 py-2 border-b border-[#e3e3e0] dark:border-zinc-800 bg-red-500/5">
              <span className="text-xs font-bold text-red-500 dark:text-red-400">Challenges</span>
            </div>
            <div className="px-4 py-2.5">
              {challenges.map((c) => (
                <div key={c.title} className="py-1.5 border-b border-[#e3e3e0]/30 dark:border-zinc-800/30 last:border-0">
                  <span className="text-[11px] font-semibold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{c.title}</span>
                  <p className="text-[10px] text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden">
            <div className="px-4 py-2 border-b border-[#e3e3e0] dark:border-zinc-800 bg-green-500/5">
              <span className="text-xs font-bold text-green-600 dark:text-green-400">Opportunities</span>
            </div>
            <div className="px-4 py-2.5">
              {opportunities.map((o) => (
                <div key={o.title} className="py-1.5 border-b border-[#e3e3e0]/30 dark:border-zinc-800/30 last:border-0">
                  <span className="text-[11px] font-semibold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{o.title}</span>
                  <p className="text-[10px] text-muted-foreground">{o.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 6: Protocol Diagram (MCP + A2A) ─── */
export function ProtocolDiagram() {
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Two Protocols</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">MCP connects agents to tools; A2A connects agents to agents</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderLeftWidth: '3px', borderLeftColor: '#3b82f6' }}>
            <div className="px-4 py-2 border-b border-[#e3e3e0] dark:border-zinc-800 bg-blue-500/5">
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400">MCP: Model Context Protocol</div>
              <div className="text-[10px] text-muted-foreground">Agent ↔ Tools</div>
            </div>
            <div className="px-4 py-2.5">
              <div className="text-[10px] text-muted-foreground/60 uppercase font-semibold mb-1">Connects to</div>
              {['Search APIs', 'Databases (PostgreSQL, MongoDB)', 'File systems', 'Google Sheets, Slack, GitHub'].map((t) => (
                <div key={t} className="text-[10px] text-muted-foreground py-0.5 border-b border-[#e3e3e0]/30 dark:border-zinc-800/30 last:border-0">{t}</div>
              ))}
              <div className="text-[10px] text-muted-foreground/60 uppercase font-semibold mt-2 mb-1">Created by</div>
              <div className="text-[10px] text-muted-foreground">Anthropic (open standard)</div>
            </div>
          </div>
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderLeftWidth: '3px', borderLeftColor: '#10b981' }}>
            <div className="px-4 py-2 border-b border-[#e3e3e0] dark:border-zinc-800 bg-green-500/5">
              <div className="text-xs font-bold text-green-600 dark:text-green-400">A2A: Agent-to-Agent Protocol</div>
              <div className="text-[10px] text-muted-foreground">Agent ↔ Agent</div>
            </div>
            <div className="px-4 py-2.5">
              <div className="text-[10px] text-muted-foreground/60 uppercase font-semibold mb-1">Enables</div>
              {['Your agent hires a booking agent', 'Finance agent negotiates with vendor agent', 'Support agents escalate to specialist agents', 'Cross-organization agent collaboration'].map((t) => (
                <div key={t} className="text-[10px] text-muted-foreground py-0.5 border-b border-[#e3e3e0]/30 dark:border-zinc-800/30 last:border-0">{t}</div>
              ))}
              <div className="text-[10px] text-muted-foreground/60 uppercase font-semibold mt-2 mb-1">Created by</div>
              <div className="text-[10px] text-muted-foreground">Google (open standard)</div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 7: Build Your First Agent ─── */
export function AgentBuildSteps() {
  const steps = [
    { num: '1', label: 'Define Goal', desc: 'What should the agent accomplish? Be specific about the desired outcome.', time: '5 min', color: '#3b82f6' },
    { num: '2', label: 'Choose Tools', desc: 'Search, APIs, databases, code execution: what does the agent need access to?', time: '10 min', color: '#8b5cf6' },
    { num: '3', label: 'Write System Prompt', desc: 'Define role, rules, available tools, and output format expectations.', time: '15 min', color: '#f59e0b' },
    { num: '4', label: 'Build the Loop', desc: 'Observe → Think → Act → Repeat. Implement the core agent cycle.', time: '30 min', color: '#10b981' },
    { num: '5', label: 'Test & Evaluate', desc: 'Run against edge cases. Measure quality. Add guardrails for failures.', time: '20 min', color: '#ef4444' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Build Your First Agent in 5 Steps</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">From idea to working agent in about 80 minutes</p>

        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-[#e3e3e0] dark:bg-zinc-800" />
          <div className="space-y-2.5">
            {steps.map((s) => (
              <div key={s.num} className="grid grid-cols-[36px_1fr] gap-3 items-start">
                <div className="relative flex items-center justify-center pt-1">
                  <div className="w-[9px] h-[9px] rounded-full" style={{ backgroundColor: s.color }} />
                </div>
                <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold" style={{ color: s.color }}>Step {s.num}: {s.label}</span>
                    <span className="text-[10px] font-mono text-muted-foreground/60">{s.time}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

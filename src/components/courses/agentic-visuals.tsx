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

/* ─── Module 1 (B): Web Paradigm Stats ─── */
export function WebParadigmStats() {
  const stats = [
    { label: 'API calls/day globally', value: '50B+', source: 'Akamai 2024', color: '#3b82f6' },
    { label: 'AI agent market (2028)', value: '$65B', source: 'MarketsandMarkets', color: '#8b5cf6' },
    { label: 'Tasks delegated to agents', value: '35%', source: 'McKinsey 2025', color: '#10b981' },
    { label: 'MCP servers published', value: '2,500+', source: 'Anthropic Registry', color: '#f59e0b' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Agentic Web in Numbers</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Key metrics indicating the shift from search to action</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {stats.map(s => (
            <div key={s.label} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3 text-center">
              <div className="text-lg md:text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] mt-0.5">{s.label}</div>
              <div className="text-[9px] text-muted-foreground/60 mt-0.5">{s.source}</div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 2 (B): Tool Ecosystem ─── */
export function ToolEcosystem() {
  const categories = [
    { name: 'Search', tools: ['Perplexity', 'Genspark', 'You.com'], color: '#3b82f6' },
    { name: 'Code', tools: ['Cursor', 'Claude Code', 'Antigravity'], color: '#8b5cf6' },
    { name: 'Data', tools: ['MCP Sheets', 'Postgres MCP', 'Browser MCP'], color: '#10b981' },
    { name: 'Commerce', tools: ['Shopify Agents', 'Stripe MCP', 'Payment APIs'], color: '#f59e0b' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Agent Tool Ecosystem</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">How agents connect to real-world services across domains</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {categories.map(c => (
            <div key={c.name} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden">
              <div className="px-3 py-2 border-b border-[#e3e3e0] dark:border-zinc-800" style={{ backgroundColor: c.color + '08' }}>
                <span className="text-xs font-bold" style={{ color: c.color }}>{c.name}</span>
              </div>
              <div className="px-3 py-2">
                {c.tools.map(t => (
                  <div key={t} className="text-[10px] text-muted-foreground py-0.5">{t}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 3 (B): Autonomy Spectrum ─── */
export function AutonomySpectrum() {
  const levels = [
    { level: 'L1: Copilot', desc: 'AI suggests, human decides and executes', example: 'GitHub Copilot autocomplete', effort: '80% human', color: '#ef4444' },
    { level: 'L2: Assistant', desc: 'AI drafts, human reviews and approves', example: 'Claude drafting emails for review', effort: '50% human', color: '#f59e0b' },
    { level: 'L3: Agent', desc: 'AI plans and executes, human monitors', example: 'Antigravity building a feature end-to-end', effort: '20% human', color: '#3b82f6' },
    { level: 'L4: Autonomous', desc: 'AI runs independently, human sets goals', example: 'Cron-triggered pipeline with error recovery', effort: '5% human', color: '#10b981' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Autonomy Spectrum</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Four levels of AI agency, from copilot to fully autonomous</p>
        <div className="space-y-2">
          {levels.map(l => (
            <div key={l.level} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3 flex flex-col md:flex-row md:items-center gap-1 md:gap-4" style={{ borderLeftWidth: '3px', borderLeftColor: l.color }}>
              <div className="min-w-[100px]">
                <span className="text-xs font-bold" style={{ color: l.color }}>{l.level}</span>
              </div>
              <span className="text-[10px] text-muted-foreground flex-1">{l.desc}</span>
              <span className="text-[10px] text-muted-foreground/60 italic">{l.example}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: l.color + '15', color: l.color }}>{l.effort}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 4 (B): Industry Adoption ─── */
export function AgenticIndustryAdoption() {
  const sectors = [
    { sector: 'Software Dev', adoption: '72%', use: 'Code generation, testing, deployment', leader: 'Cursor, Antigravity', color: '#8b5cf6' },
    { sector: 'Customer Support', adoption: '58%', use: 'Ticket resolution, knowledge retrieval', leader: 'Intercom, Zendesk AI', color: '#3b82f6' },
    { sector: 'Finance', adoption: '41%', use: 'Fraud detection, report generation', leader: 'Bloomberg GPT, Stripe', color: '#10b981' },
    { sector: 'Legal', adoption: '23%', use: 'Contract review, case research', leader: 'Harvey AI, Casetext', color: '#f59e0b' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Agent Adoption by Industry</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Where agentic AI is deployed in production today</p>
        <div className="space-y-1.5">
          {sectors.map(s => (
            <div key={s.sector} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 px-4 py-2.5 flex items-center gap-3">
              <div className="w-12 text-right">
                <span className="text-sm font-bold" style={{ color: s.color }}>{s.adoption}</span>
              </div>
              <div className="w-16 h-1.5 rounded-full bg-[#e3e3e0] dark:bg-zinc-800 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: s.adoption, backgroundColor: s.color }} />
              </div>
              <span className="text-xs font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] min-w-[120px]">{s.sector}</span>
              <span className="text-[10px] text-muted-foreground flex-1 hidden md:block">{s.use}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 5 (B): Risk Matrix ─── */
export function AgentRiskMatrix() {
  const risks = [
    { risk: 'Prompt Injection', severity: 'Critical', mitigation: 'Input validation, output filtering, sandboxed execution', color: '#ef4444' },
    { risk: 'Hallucinated Actions', severity: 'High', mitigation: 'Human-in-the-loop for destructive operations, confirmation gates', color: '#f59e0b' },
    { risk: 'Data Exfiltration', severity: 'High', mitigation: 'Least-privilege tool access, audit logging, network isolation', color: '#f59e0b' },
    { risk: 'Cost Runaway', severity: 'Medium', mitigation: 'Token budgets, rate limiting, billing alerts per pipeline', color: '#3b82f6' },
    { risk: 'Stale Context', severity: 'Low', mitigation: 'Context window management, explicit memory resets', color: '#10b981' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Agent Risk Matrix</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Security and reliability risks in production agent deployments</p>
        <div className="space-y-1.5">
          {risks.map(r => (
            <div key={r.risk} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 px-4 py-2.5 flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
              <div className="flex items-center gap-2 min-w-[180px]">
                <span className="text-xs font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{r.risk}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: r.color + '15', color: r.color }}>{r.severity}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{r.mitigation}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 6 (B): Protocol Comparison ─── */
export function AgentProtocolComparison() {
  const protocols = [
    { name: 'MCP', org: 'Anthropic', transport: 'stdio / HTTP', focus: 'Tool calling for AI agents', status: 'Production', color: '#8b5cf6' },
    { name: 'OpenAPI', org: 'Linux Foundation', transport: 'HTTP REST', focus: 'API documentation and client generation', status: 'Mature', color: '#3b82f6' },
    { name: 'A2A', org: 'Google', transport: 'HTTP + SSE', focus: 'Agent-to-agent communication', status: 'Early', color: '#10b981' },
    { name: 'ACP', org: 'Cisco', transport: 'HTTP', focus: 'Enterprise agent collaboration', status: 'Draft', color: '#f59e0b' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Agent Protocol Landscape</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Competing standards for agent interoperability</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-[#e3e3e0] dark:border-zinc-800">
                {['Protocol', 'Org', 'Transport', 'Focus', 'Status'].map(h => (
                  <th key={h} className="text-left px-2 py-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {protocols.map(p => (
                <tr key={p.name} className="border-b border-[#e3e3e0]/40 dark:border-zinc-800/40">
                  <td className="px-2 py-2 font-bold" style={{ color: p.color }}>{p.name}</td>
                  <td className="px-2 py-2 text-muted-foreground">{p.org}</td>
                  <td className="px-2 py-2 font-mono text-muted-foreground">{p.transport}</td>
                  <td className="px-2 py-2 text-muted-foreground">{p.focus}</td>
                  <td className="px-2 py-2"><span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: p.color + '15', color: p.color }}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 7 (B): Agent Build Checklist ─── */
export function AgentBuildChecklist() {
  const phases = [
    { phase: 'Define', items: ['Write the agent goal in one sentence', 'List required tools and APIs', 'Identify the output format'], color: '#3b82f6' },
    { phase: 'Build', items: ['Set up MCP servers or tool definitions', 'Write the system prompt with constraints', 'Test with sample inputs'], color: '#f59e0b' },
    { phase: 'Harden', items: ['Add error handling and retry logic', 'Set token/cost budgets', 'Add human review gates for destructive actions'], color: '#10b981' },
    { phase: 'Deploy', items: ['Wire to a scheduler (cron, webhook)', 'Set up monitoring and alerting', 'Document the pipeline in a README'], color: '#8b5cf6' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Agent Build Checklist</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Four-phase workflow for shipping a production agent</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {phases.map(p => (
            <div key={p.phase} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden">
              <div className="px-3 py-2 border-b border-[#e3e3e0] dark:border-zinc-800" style={{ backgroundColor: p.color + '08' }}>
                <span className="text-xs font-bold" style={{ color: p.color }}>{p.phase}</span>
              </div>
              <div className="px-3 py-2">
                {p.items.map(item => (
                  <div key={item} className="flex items-start gap-2 py-1">
                    <div className="w-3 h-3 rounded-sm border border-[#e3e3e0] dark:border-zinc-700 shrink-0 mt-0.5" />
                    <span className="text-[10px] text-muted-foreground">{item}</span>
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

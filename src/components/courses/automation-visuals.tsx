'use client';

/* ─── Module 1: Automation Layers ─── */
export function AutomationLayers() {
  const layers = [
    { label: 'Manual', desc: 'You do everything by hand', effort: '100%', examples: 'Copy-paste, manual data entry, typing emails one-by-one', color: '#ef4444' },
    { label: 'Templates & Snippets', desc: 'Reusable shortcuts', effort: '60%', examples: 'Text expanders, saved replies, shell aliases', color: '#f59e0b' },
    { label: 'No-Code Workflows', desc: 'n8n, Make, Zapier', effort: '30%', examples: 'Visual automations, drag-and-drop triggers, app connectors', color: '#3b82f6' },
    { label: 'AI Agents', desc: 'Claude, Antigravity, GPT', effort: '10%', examples: 'Natural language instructions, tool calling, reasoning', color: '#8b5cf6' },
    { label: 'Autonomous Pipelines', desc: 'MCP + Agents + Cron', effort: '~0%', examples: 'Self-running systems, error recovery, continuous monitoring', color: '#10b981' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Five Layers of Automation</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">From manual effort to fully autonomous systems</p>

        <div className="space-y-2">
          {layers.map((l, i) => (
            <div key={l.label} className="grid grid-cols-[auto_1fr] gap-3 items-start">
              <div className="relative flex flex-col items-center pt-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: l.color }}>{i + 1}</div>
                {i < 4 && <div className="w-px h-full min-h-[16px] mt-1" style={{ backgroundColor: l.color, opacity: 0.2 }} />}
              </div>
              <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold" style={{ color: l.color }}>{l.label}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: l.color + '15', color: l.color }}>Effort: {l.effort}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">{l.desc}. {l.examples}.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 2: API Request Flow ─── */
export function APIFlowDiagram() {
  const flow = [
    { step: 'Your Script / Agent', detail: 'Sends HTTP request with method, URL, headers, and body', color: '#3b82f6' },
    { step: 'API Server', detail: 'Authenticates, validates, processes the request, queries data', color: '#f59e0b' },
    { step: 'Database / Service', detail: 'Stores or retrieves the requested data', color: '#10b981' },
    { step: 'JSON Response', detail: 'Structured data returned: status code, headers, body', color: '#8b5cf6' },
  ];
  const methods = [
    { method: 'GET', desc: 'Read data', example: 'Fetch job listings' },
    { method: 'POST', desc: 'Create new', example: 'Send a message' },
    { method: 'PUT', desc: 'Update existing', example: 'Edit a record' },
    { method: 'DELETE', desc: 'Remove', example: 'Delete a listing' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">How APIs Work</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">The request-response cycle that powers every automation</p>

        <div className="relative mb-5">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-[#e3e3e0] dark:bg-zinc-800" />
          <div className="space-y-2.5">
            {flow.map((f, i) => (
              <div key={f.step} className="grid grid-cols-[36px_1fr] gap-3 items-start">
                <div className="relative flex items-center justify-center pt-1.5">
                  <div className="w-[9px] h-[9px] rounded-full border-2" style={{ borderColor: f.color, backgroundColor: f.color }} />
                </div>
                <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-2.5">
                  <span className="text-xs font-bold" style={{ color: f.color }}>{f.step}</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {methods.map((m) => (
            <div key={m.method} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-2.5 text-center">
              <div className="text-sm font-bold font-mono text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{m.method}</div>
              <div className="text-[10px] text-muted-foreground">{m.desc}</div>
              <div className="text-[10px] text-muted-foreground/60 mt-0.5">{m.example}</div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 3: No-Code Tools Grid ─── */
export function NoCodeToolsGrid() {
  const tools = [
    {
      name: 'n8n', tagline: 'Open-source, self-hosted',
      pros: ['Self-host (full data control)', 'AI nodes for any LLM', 'JS/Python code nodes', 'No per-task pricing'],
      cons: ['Requires hosting setup', 'Smaller integration library'],
      best: 'AI pipelines, developers', color: '#ef4444',
    },
    {
      name: 'Make', tagline: 'Visual workflow builder',
      pros: ['Best visual branching logic', 'Great data mapping UI', 'Error handling routes', '1,500+ integrations'],
      cons: ['Per-operation pricing', 'No self-hosting option'],
      best: 'Complex multi-branch flows', color: '#8b5cf6',
    },
    {
      name: 'Zapier', tagline: 'Largest ecosystem',
      pros: ['7,000+ app connectors', 'Fastest setup time', 'Best for non-technical teams', 'Code by Zapier node'],
      cons: ['Expensive at scale', 'Limited AI features', '5-min minimum trigger interval'],
      best: 'Quick prototypes, simple zaps', color: '#f59e0b',
    },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">No-Code Automation Platforms</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Choosing the right tool for your automation needs</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {tools.map((t) => (
            <div key={t.name} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#e3e3e0] dark:border-zinc-800" style={{ backgroundColor: t.color + '08' }}>
                <div className="text-sm font-bold" style={{ color: t.color }}>{t.name}</div>
                <div className="text-[10px] text-muted-foreground">{t.tagline}</div>
              </div>
              <div className="px-4 py-3">
                <div className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1.5">Strengths</div>
                {t.pros.map((p) => (
                  <div key={p} className="text-[10px] text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)] py-0.5">+ {p}</div>
                ))}
                <div className="text-[10px] font-bold text-red-500 dark:text-red-400 uppercase tracking-wider mt-2 mb-1.5">Limitations</div>
                {t.cons.map((c) => (
                  <div key={c} className="text-[10px] text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)] py-0.5">- {c}</div>
                ))}
                <div className="mt-2 pt-2 border-t border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <span className="text-[10px] font-bold" style={{ color: t.color }}>Best for: {t.best}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 4: Agent Architecture ─── */
export function AgentArchitecture() {
  const phases = [
    { phase: 'Observe', desc: 'Read current context: user request, data from APIs, error messages, previous results', color: '#3b82f6', icon: '1' },
    { phase: 'Think', desc: 'Plan the next action. The LLM reasons about tools to call, order of operations, potential failures', color: '#f59e0b', icon: '2' },
    { phase: 'Act', desc: 'Execute the plan: call an API, run a query, send a message, write a file, browse a page', color: '#10b981', icon: '3' },
    { phase: 'Learn', desc: 'Evaluate the result. Did it work? If not, adjust the plan and loop again with new context', color: '#ef4444', icon: '4' },
  ];
  const capabilities = [
    { agent: 'Antigravity', features: ['File read/write', 'Terminal commands', 'MCP servers', 'Web browsing', 'Image generation'] },
    { agent: 'Claude Code', features: ['Code editing', 'Git operations', 'MCP servers', 'File system', 'Web search'] },
    { agent: 'GPT + Tools', features: ['Function calling', 'Code interpreter', 'Web browsing', 'DALL-E', 'File upload'] },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The AI Agent Loop</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Observe, Think, Act, Learn — the cycle that replaces rigid rule-based automation</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
          {phases.map((p) => (
            <div key={p.phase} className="rounded-[3px] border-t-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3" style={{ borderTopColor: p.color }}>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: p.color }}>{p.icon}</div>
                <span className="text-xs font-bold" style={{ color: p.color }}>{p.phase}</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {capabilities.map((c) => (
            <div key={c.agent} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3">
              <div className="text-xs font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] mb-2">{c.agent}</div>
              {c.features.map((f) => (
                <div key={f} className="text-[10px] text-muted-foreground py-0.5 border-b border-[#e3e3e0]/30 dark:border-zinc-800/30 last:border-0">{f}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 5: MCP Automation Stack ─── */
export function MCPAutomationStack() {
  const layers = [
    { layer: 'Natural Language', desc: 'You describe the automation in plain English', color: '#8b5cf6', examples: '"Pull sales data, calculate totals, update the sheet"' },
    { layer: 'AI Agent', desc: 'Claude / Antigravity / GPT interprets and plans', color: '#3b82f6', examples: 'Reasons about which tools to call in what order' },
    { layer: 'MCP Client', desc: 'Routes tool calls to the correct MCP server', color: '#f59e0b', examples: 'JSON-RPC protocol, tool discovery, schema validation' },
    { layer: 'MCP Servers', desc: 'Google Sheets, Slack, PostgreSQL, GitHub, Filesystem', color: '#10b981', examples: 'Each server exposes tools for one specific service' },
    { layer: 'External APIs', desc: 'The real-world services being automated', color: '#ef4444', examples: 'Google APIs, Slack API, database connections, file I/O' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The MCP Automation Stack</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">From natural language to real-world action in five layers</p>

        <div className="space-y-1.5">
          {layers.map((l, i) => (
            <div key={l.layer} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderLeftWidth: '3px', borderLeftColor: l.color }}>
              <div className="px-4 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                <div>
                  <span className="text-xs font-bold" style={{ color: l.color }}>{l.layer}</span>
                  <span className="text-[10px] text-muted-foreground ml-2">{l.desc}</span>
                </div>
                <span className="text-[10px] text-muted-foreground/60 italic">{l.examples}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[3px] bg-[#f7f6f3] dark:bg-zinc-800/40 px-4 py-2.5">
          <span className="text-[11px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)]"><strong>Key insight:</strong> Instead of writing API integration code, you give the agent MCP tools and describe the outcome. The agent handles auth, pagination, error handling, and data transformation.</span>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 6: Pipeline Blueprint ─── */
export function PipelineBlueprint() {
  const stages = [
    { num: '1', label: 'Trigger', desc: 'What starts the pipeline', examples: 'Cron schedule, webhook, database change, manual command', color: '#ef4444' },
    { num: '2', label: 'Fetch', desc: 'Gather input data', examples: 'API calls, database queries, web scraping, MCP reads', color: '#f59e0b' },
    { num: '3', label: 'Transform', desc: 'Process and enrich', examples: 'Filter, deduplicate, AI summarize, normalize formats', color: '#3b82f6' },
    { num: '4', label: 'Act', desc: 'Execute the output', examples: 'Write to DB, send messages, publish content, update sheets', color: '#8b5cf6' },
    { num: '5', label: 'Report', desc: 'Log and notify', examples: 'Console logs, Slack alerts, dashboard updates, error handling', color: '#10b981' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Pipeline Architecture</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Every automation pipeline follows this five-stage pattern</p>

        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-[#e3e3e0] dark:bg-zinc-800" />
          <div className="space-y-2.5">
            {stages.map((s) => (
              <div key={s.num} className="grid grid-cols-[36px_1fr] gap-3 items-start">
                <div className="relative flex items-center justify-center pt-1">
                  <div className="w-[9px] h-[9px] rounded-full" style={{ backgroundColor: s.color }} />
                </div>
                <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold" style={{ color: s.color }}>Stage {s.num}: {s.label}</span>
                  </div>
                  <p className="text-[10px] text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)] mb-1">{s.desc}</p>
                  <p className="text-[10px] text-muted-foreground/60">{s.examples}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-[3px] bg-[#f7f6f3] dark:bg-zinc-800/40 px-4 py-2.5">
          <span className="text-[11px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)]"><strong>Design principle:</strong> Make each stage independent and idempotent. If stage 3 fails, you can re-run it without duplicating the work from stages 1-2.</span>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 7: Production Monitoring Dashboard ─── */
export function MonitoringDashboard() {
  const metrics = [
    { label: 'Pipeline Uptime', value: '99.9%', detail: 'Last 30 days', color: '#10b981' },
    { label: 'Tasks / Day', value: '1,247', detail: 'Across all pipelines', color: '#3b82f6' },
    { label: 'Error Rate', value: '0.3%', detail: '3 failures / 1,247 tasks', color: '#f59e0b' },
    { label: 'Time Saved', value: '40h/wk', detail: 'vs manual processing', color: '#8b5cf6' },
  ];
  const checklist = [
    { item: 'Cron schedule configured', tool: 'GitHub Actions / Vercel Cron' },
    { item: 'Heartbeat monitor active', tool: 'UptimeRobot / Better Uptime' },
    { item: 'Error alerting wired', tool: 'Slack webhook / email' },
    { item: 'Secrets in env variables', tool: 'GitHub Secrets / Vercel Env' },
    { item: 'Audit log configured', tool: 'Google Sheets / database' },
    { item: 'Cost alerts enabled', tool: 'OpenAI / Anthropic billing' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Production Readiness Dashboard</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Key metrics and pre-launch checklist for production automation</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3 text-center">
              <div className="text-lg md:text-xl font-bold" style={{ color: m.color }}>{m.value}</div>
              <div className="text-[10px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] mt-0.5">{m.label}</div>
              <div className="text-[9px] text-muted-foreground/60 mt-0.5">{m.detail}</div>
            </div>
          ))}
        </div>

        <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden">
          <div className="px-4 py-2 border-b border-[#e3e3e0] dark:border-zinc-800 bg-[#f7f6f3] dark:bg-zinc-800/40">
            <span className="text-[10px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Pre-Launch Checklist</span>
          </div>
          {checklist.map((c) => (
            <div key={c.item} className="flex items-center justify-between px-4 py-2 border-b border-[#e3e3e0]/40 dark:border-zinc-800/40 last:border-0">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-sm border border-[#e3e3e0] dark:border-zinc-700 shrink-0" />
                <span className="text-[11px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{c.item}</span>
              </div>
              <span className="text-[10px] text-muted-foreground/60">{c.tool}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

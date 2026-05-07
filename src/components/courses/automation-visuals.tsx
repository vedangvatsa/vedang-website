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
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Observe, Think, Act, Learn: the cycle that replaces rigid rule-based automation</p>

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

/* ─── Module 1 (B): ROI Calculator Framework ─── */
export function ROICalculator() {
  const examples = [
    { task: 'Social media posting', freq: 'Daily', manual: '15 min', annual: '65 hrs', buildTime: '4 hrs', monthlyCost: '$20', annualSavings: '$2,210', verdict: 'Build' },
    { task: 'Job board aggregation', freq: '3x/day', manual: '30 min', annual: '390 hrs', buildTime: '8 hrs', monthlyCost: '$10', annualSavings: '$18,880', verdict: 'Build' },
    { task: 'Invoice processing', freq: 'Weekly', manual: '45 min', annual: '39 hrs', buildTime: '6 hrs', monthlyCost: '$15', annualSavings: '$1,370', verdict: 'Build' },
    { task: 'Quarterly strategy review', freq: '4x/year', manual: '4 hrs', annual: '16 hrs', buildTime: '12 hrs', monthlyCost: '$0', annualSavings: '-$200', verdict: 'Skip' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Automation ROI Calculator</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">When to automate vs when to stay manual</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-[#e3e3e0] dark:border-zinc-800">
                {['Task', 'Freq', 'Manual', 'Annual Hrs', 'Build', 'Monthly', 'Net Savings', ''].map(h => (
                  <th key={h} className="text-left px-2 py-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {examples.map(e => (
                <tr key={e.task} className="border-b border-[#e3e3e0]/40 dark:border-zinc-800/40">
                  <td className="px-2 py-2 font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{e.task}</td>
                  <td className="px-2 py-2 text-muted-foreground">{e.freq}</td>
                  <td className="px-2 py-2 text-muted-foreground">{e.manual}</td>
                  <td className="px-2 py-2 text-muted-foreground">{e.annual}</td>
                  <td className="px-2 py-2 text-muted-foreground">{e.buildTime}</td>
                  <td className="px-2 py-2 text-muted-foreground">{e.monthlyCost}</td>
                  <td className="px-2 py-2 font-bold" style={{ color: e.verdict === 'Build' ? '#10b981' : '#ef4444' }}>{e.annualSavings}</td>
                  <td className="px-2 py-2">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: e.verdict === 'Build' ? '#10b98115' : '#ef444415', color: e.verdict === 'Build' ? '#10b981' : '#ef4444' }}>{e.verdict}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-[3px] bg-[#f7f6f3] dark:bg-zinc-800/40 px-4 py-2.5">
          <span className="text-[11px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)]"><strong>Formula:</strong> Annual Savings = (Manual Hours x $50/hr) - (Build Hours x $50/hr) - (Monthly Cost x 12) - (Maintenance: 1hr/mo x $50 x 12)</span>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 2 (B): Authentication Patterns ─── */
export function AuthPatterns() {
  const patterns = [
    { method: 'API Key', security: 'Low', setup: 'Instant', use: 'Testing, internal tools', how: 'Header: Authorization: Bearer sk-xxx', color: '#f59e0b' },
    { method: 'OAuth 2.0', security: 'High', setup: '30 min', use: 'Production, user data', how: 'Token exchange flow with refresh tokens', color: '#10b981' },
    { method: 'Webhook Secret', security: 'Medium', setup: '5 min', use: 'Incoming webhooks', how: 'HMAC-SHA256 signature verification', color: '#3b82f6' },
    { method: 'Service Account', security: 'High', setup: '15 min', use: 'Server-to-server', how: 'JSON key file, no user interaction', color: '#8b5cf6' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">API Authentication Patterns</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Four methods ranked by security level and setup complexity</p>
        <div className="space-y-2">
          {patterns.map(p => (
            <div key={p.method} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderLeftWidth: '3px', borderLeftColor: p.color }}>
              <div className="px-4 py-2.5 flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <span className="text-xs font-bold" style={{ color: p.color }}>{p.method}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: p.color + '15', color: p.color }}>Security: {p.security}</span>
                </div>
                <span className="text-[10px] text-muted-foreground flex-1">{p.how}</span>
                <span className="text-[10px] text-muted-foreground/60">Best for: {p.use}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 3 (B): Workflow Decision Tree ─── */
export function WorkflowDecisionTree() {
  const decisions = [
    { question: 'Do you need to write custom code?', yes: 'Use n8n (Code Node) or raw scripts', no: 'Any no-code tool works', color: '#3b82f6' },
    { question: 'Do you need self-hosting / data control?', yes: 'n8n (Docker, Railway, VPS)', no: 'Make or Zapier (cloud-hosted)', color: '#8b5cf6' },
    { question: 'Do you need complex branching logic?', yes: 'Make (best visual branching)', no: 'Zapier (simplest setup)', color: '#f59e0b' },
    { question: 'Will you process >1,000 tasks/month?', yes: 'n8n (no per-task pricing)', no: 'Any tool (free tiers suffice)', color: '#10b981' },
    { question: 'Do you need AI processing in workflows?', yes: 'n8n (best AI node support)', no: 'All three support basic AI', color: '#ef4444' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">No-Code Tool Selection Guide</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Answer these five questions to pick the right platform</p>
        <div className="space-y-2">
          {decisions.map((d, i) => (
            <div key={d.question} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ backgroundColor: d.color }}>{i + 1}</div>
                <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{d.question}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 ml-7">
                <div className="text-[10px] rounded-[3px] bg-green-50 dark:bg-green-900/10 px-2.5 py-1.5 border border-green-200/50 dark:border-green-800/30">
                  <span className="font-bold text-green-700 dark:text-green-400">Yes:</span> <span className="text-green-800/70 dark:text-green-300/70">{d.yes}</span>
                </div>
                <div className="text-[10px] rounded-[3px] bg-red-50 dark:bg-red-900/10 px-2.5 py-1.5 border border-red-200/50 dark:border-red-800/30">
                  <span className="font-bold text-red-700 dark:text-red-400">No:</span> <span className="text-red-800/70 dark:text-red-300/70">{d.no}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 4 (B): Tool Calling Flow ─── */
export function ToolCallingFlow() {
  const steps = [
    { label: 'User Prompt', detail: '"Find all open engineering jobs at Stripe and add them to my spreadsheet"', type: 'input' },
    { label: 'Agent Reasoning', detail: 'I need to: (1) call the Stripe jobs API, (2) filter for engineering roles, (3) format the data, (4) write to Google Sheets', type: 'think' },
    { label: 'Tool Call 1', detail: 'fetch("https://api.stripe.com/jobs") → Returns 47 positions', type: 'action' },
    { label: 'Tool Call 2', detail: 'filter(jobs, department="Engineering") → 12 matches', type: 'action' },
    { label: 'Tool Call 3', detail: 'sheets.update("Jobs!A2:E13", formattedData) → 12 rows written', type: 'action' },
    { label: 'Result', detail: '"Done. Added 12 engineering positions from Stripe to your Jobs spreadsheet."', type: 'output' },
  ];
  const colors: Record<string, string> = { input: '#3b82f6', think: '#f59e0b', action: '#10b981', output: '#8b5cf6' };
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Tool Calling in Practice</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">How an agent decomposes a natural language request into API calls</p>
        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-[#e3e3e0] dark:bg-zinc-800" />
          <div className="space-y-2">
            {steps.map(s => (
              <div key={s.label} className="grid grid-cols-[36px_1fr] gap-3 items-start">
                <div className="relative flex items-center justify-center pt-2">
                  <div className="w-[9px] h-[9px] rounded-full" style={{ backgroundColor: colors[s.type] }} />
                </div>
                <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors[s.type] }}>{s.label}</span>
                  <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 5 (B): MCP Server Catalog ─── */
export function MCPServerCatalog() {
  const servers = [
    { name: 'Google Sheets', tools: 8, examples: 'read, write, create, search cells', category: 'Data', color: '#10b981' },
    { name: 'Slack', tools: 5, examples: 'post message, read channels, react', category: 'Communication', color: '#3b82f6' },
    { name: 'PostgreSQL', tools: 4, examples: 'query, insert, update, schema', category: 'Database', color: '#8b5cf6' },
    { name: 'GitHub', tools: 12, examples: 'create PR, read issues, merge, search', category: 'Development', color: '#ef4444' },
    { name: 'Filesystem', tools: 6, examples: 'read, write, list, search, move files', category: 'System', color: '#f59e0b' },
    { name: 'Browser', tools: 5, examples: 'navigate, click, screenshot, read page', category: 'Web', color: '#06b6d4' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">MCP Server Catalog</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Production-ready MCP servers for common automation targets</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {servers.map(s => (
            <div key={s.name} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-[3px] flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ backgroundColor: s.color }}>{s.tools}</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{s.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded border border-[#e3e3e0] dark:border-zinc-800 text-muted-foreground">{s.category}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">Tools: {s.examples}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-[3px] bg-[#f7f6f3] dark:bg-zinc-800/40 px-4 py-2.5">
          <span className="text-[11px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)]"><strong>Composability:</strong> Chain multiple MCP servers in a single agent session. Query PostgreSQL, transform with AI, write results to Google Sheets, notify via Slack.</span>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 6 (B): Pipeline Case Studies ─── */
export function PipelineCaseStudies() {
  const cases = [
    { name: 'Job Aggregation', trigger: 'Cron 3x/day', fetch: '50+ company APIs', transform: 'Deduplicate, filter roles', act: 'Post to Telegram', report: 'Log to Sheets', stack: 'Node.js + GitHub Actions', color: '#3b82f6' },
    { name: 'News Digest', trigger: 'Cron daily', fetch: '30 RSS feeds', transform: 'AI summarize, score', act: 'Email via SES', report: 'Slack notification', stack: 'Node.js + AWS SES', color: '#10b981' },
    { name: 'Lead Enrichment', trigger: 'New Sheets row', fetch: 'LinkedIn + Clearbit', transform: 'ICP scoring, AI personalize', act: 'Add to outreach sequence', report: 'CRM update', stack: 'n8n + Claude', color: '#8b5cf6' },
    { name: 'Content Publishing', trigger: 'Git push', fetch: 'MDX files', transform: 'Build + optimize images', act: 'Deploy to Vercel', report: 'Social post', stack: 'GitHub Actions + Vercel', color: '#f59e0b' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Pipeline Case Studies</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Four production pipelines showing the Trigger-Fetch-Transform-Act-Report pattern</p>
        <div className="space-y-2">
          {cases.map(c => (
            <div key={c.name} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden">
              <div className="px-4 py-2 border-b border-[#e3e3e0] dark:border-zinc-800 flex items-center justify-between" style={{ backgroundColor: c.color + '08' }}>
                <span className="text-xs font-bold" style={{ color: c.color }}>{c.name}</span>
                <span className="text-[9px] font-mono text-muted-foreground/60">{c.stack}</span>
              </div>
              <div className="grid grid-cols-5 divide-x divide-[#e3e3e0]/40 dark:divide-zinc-800/40">
                {[
                  { label: 'Trigger', val: c.trigger },
                  { label: 'Fetch', val: c.fetch },
                  { label: 'Transform', val: c.transform },
                  { label: 'Act', val: c.act },
                  { label: 'Report', val: c.report },
                ].map(s => (
                  <div key={s.label} className="px-2.5 py-2">
                    <div className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider">{s.label}</div>
                    <div className="text-[10px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)] mt-0.5">{s.val}</div>
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

/* ─── Module 7 (B): Cost Breakdown ─── */
export function CostBreakdown() {
  const items = [
    { service: 'GitHub Actions', free: '2,000 min/mo', paid: '$0.008/min', usage: 'Cron triggers, CI/CD', color: '#37352f' },
    { service: 'Claude API', free: 'None', paid: '$3/M input, $15/M output', usage: 'AI processing, summarization', color: '#8b5cf6' },
    { service: 'OpenAI API', free: 'None', paid: '$2.50/M input, $10/M output', usage: 'Embeddings, classification', color: '#10b981' },
    { service: 'Vercel Cron', free: '1 cron/day', paid: '$20/mo (Pro)', usage: 'Serverless triggers', color: '#37352f' },
    { service: 'n8n Cloud', free: 'None', paid: '$24/mo starter', usage: 'No-code workflows', color: '#ef4444' },
    { service: 'AWS SES', free: '3,000 emails/mo', paid: '$0.10 per 1,000', usage: 'Email delivery', color: '#f59e0b' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Automation Cost Breakdown</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Realistic monthly costs for a typical startup automation stack</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-[#e3e3e0] dark:border-zinc-800">
                {['Service', 'Free Tier', 'Paid Pricing', 'Use Case'].map(h => (
                  <th key={h} className="text-left px-2 py-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.service} className="border-b border-[#e3e3e0]/40 dark:border-zinc-800/40">
                  <td className="px-2 py-2 font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{item.service}</td>
                  <td className="px-2 py-2 text-muted-foreground">{item.free}</td>
                  <td className="px-2 py-2 font-mono text-muted-foreground">{item.paid}</td>
                  <td className="px-2 py-2 text-muted-foreground/60">{item.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-[3px] bg-[#f7f6f3] dark:bg-zinc-800/40 px-4 py-2.5">
          <span className="text-[11px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)]"><strong>Typical startup bill:</strong> $30-80/month for a stack running 5-10 automated pipelines. GitHub Actions free tier covers most scheduling needs. AI API costs scale with volume but stay low for batch processing.</span>
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

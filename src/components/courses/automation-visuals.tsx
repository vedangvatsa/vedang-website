'use client';

/* ─── Module 1: Automation Layers ─── */
export function AutomationLayers() {
  const layers = [
    { label: 'Manual', desc: 'You do everything by hand', color: '#ef4444', effort: '100%' },
    { label: 'Templates', desc: 'Reusable scripts and snippets', color: '#f59e0b', effort: '60%' },
    { label: 'No-Code', desc: 'n8n, Make, Zapier', color: '#3b82f6', effort: '30%' },
    { label: 'AI Agents', desc: 'Claude, Antigravity, GPT', color: '#8b5cf6', effort: '10%' },
    { label: 'Autonomous', desc: 'MCP + Agents + Cron', color: '#10b981', effort: '~0%' },
  ];
  return (
    <div className="not-prose my-6">
      <svg viewBox="0 0 800 180" className="w-full h-auto hidden sm:block" role="img" aria-label="Automation spectrum from manual to autonomous">
        {layers.map((l, i) => (
          <g key={l.label}>
            <rect x={i * 155 + 10} y={20} width={145} height={110} rx={12} fill={`${l.color}10`} stroke={l.color} strokeWidth={1.5} />
            <text x={i * 155 + 82} y={50} textAnchor="middle" fill={l.color} fontSize={13} fontWeight={700}>{l.label}</text>
            <text x={i * 155 + 82} y={72} textAnchor="middle" fill="currentColor" fontSize={9} opacity={0.5}>{l.desc}</text>
            <text x={i * 155 + 82} y={110} textAnchor="middle" fill={l.color} fontSize={12} fontWeight={600}>Effort: {l.effort}</text>
            {i < 4 && (
              <path d={`M${i * 155 + 155} 75 L${(i + 1) * 155 + 10} 75`} stroke="currentColor" strokeWidth={1} opacity={0.15} strokeDasharray="3 2" />
            )}
          </g>
        ))}
        <text x={400} y={160} textAnchor="middle" fill="currentColor" fontSize={11} opacity={0.3}>More manual · · · More autonomous</text>
      </svg>
      {/* Mobile fallback */}
      <div className="sm:hidden grid grid-cols-1 gap-2">
        {layers.map((l) => (
          <div key={l.label} className="flex items-center justify-between p-3 rounded-xl border bg-card">
            <div>
              <h4 className="font-semibold text-sm" style={{ color: l.color }}>{l.label}</h4>
              <p className="text-xs text-muted-foreground">{l.desc}</p>
            </div>
            <span className="text-sm font-bold shrink-0 ml-3" style={{ color: l.color }}>{l.effort}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Module 2: API Request Flow ─── */
export function APIFlowDiagram() {
  return (
    <div className="not-prose my-6">
      <svg viewBox="0 0 700 120" className="w-full h-auto hidden sm:block" role="img" aria-label="API request flow: Client sends request, server processes, returns response">
        <rect x={10} y={20} width={140} height={70} rx={10} fill="#3b82f610" stroke="#3b82f6" strokeWidth={1.5} />
        <text x={80} y={50} textAnchor="middle" fill="#3b82f6" fontSize={12} fontWeight={700}>Your Script</text>
        <text x={80} y={68} textAnchor="middle" fill="currentColor" fontSize={9} opacity={0.5}>or AI Agent</text>

        <line x1={150} y1={45} x2={270} y2={45} stroke="#10b981" strokeWidth={1.5} />
        <text x={210} y={38} textAnchor="middle" fill="#10b981" fontSize={9}>GET /api/data</text>
        <text x={210} y={85} textAnchor="middle" fill="#8b5cf6" fontSize={9}>JSON response</text>
        <line x1={270} y1={65} x2={150} y2={65} stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="4 3" />

        <rect x={270} y={20} width={140} height={70} rx={10} fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1.5} />
        <text x={340} y={50} textAnchor="middle" fill="#f59e0b" fontSize={12} fontWeight={700}>API Server</text>
        <text x={340} y={68} textAnchor="middle" fill="currentColor" fontSize={9} opacity={0.5}>Auth, Process, Return</text>

        <line x1={410} y1={55} x2={480} y2={55} stroke="currentColor" strokeWidth={1} opacity={0.2} strokeDasharray="3 2" />

        <rect x={480} y={20} width={140} height={70} rx={10} fill="#10b98110" stroke="#10b981" strokeWidth={1.5} />
        <text x={550} y={50} textAnchor="middle" fill="#10b981" fontSize={12} fontWeight={700}>Database</text>
        <text x={550} y={68} textAnchor="middle" fill="currentColor" fontSize={9} opacity={0.5}>or External Service</text>
      </svg>
      {/* Mobile fallback */}
      <div className="sm:hidden flex flex-col gap-2">
        {[
          { label: 'Your Script / Agent', desc: 'Sends API request', color: '#3b82f6' },
          { label: 'API Server', desc: 'Auth, process, return', color: '#f59e0b' },
          { label: 'Database', desc: 'Or external service', color: '#10b981' },
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

/* ─── Module 3: No-Code Tools Grid ─── */
export function NoCodeToolsGrid() {
  const tools = [
    { name: 'n8n', desc: 'Open-source, self-hostable', best: 'Full control, AI nodes', color: '#ef4444' },
    { name: 'Make', desc: 'Visual workflow builder', best: 'Complex branching logic', color: '#8b5cf6' },
    { name: 'Zapier', desc: 'Largest app ecosystem', best: 'Quick 2-step automations', color: '#f59e0b' },
    { name: 'Pipedream', desc: 'Code-friendly workflows', best: 'Developer-oriented', color: '#3b82f6' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-2 md:grid-cols-4 gap-3">
      {tools.map((t) => (
        <div key={t.name} className="p-4 rounded-xl border bg-card text-center">
          <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: t.color }}>{t.name[0]}</div>
          <h4 className="font-semibold text-sm">{t.name}</h4>
          <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
          <p className="text-xs mt-2 font-medium" style={{ color: t.color }}>Best for: {t.best}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Module 4: Agent Architecture ─── */
export function AgentArchitecture() {
  return (
    <div className="not-prose my-6">
      <svg viewBox="0 0 800 220" className="w-full h-auto hidden sm:block" role="img" aria-label="AI agent loop: Observe, Think, Act, Learn">
        {/* Center circle */}
        <circle cx={400} cy={110} r={50} fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={2} />
        <text x={400} y={106} textAnchor="middle" fill="#8b5cf6" fontSize={14} fontWeight={700}>AI Agent</text>
        <text x={400} y={122} textAnchor="middle" fill="currentColor" fontSize={9} opacity={0.5}>Reasoning Loop</text>

        {/* Four corners */}
        {[
          { x: 100, y: 35, label: '1. Observe', desc: 'Read context, data, errors', color: '#3b82f6' },
          { x: 570, y: 35, label: '2. Think', desc: 'Plan next action', color: '#f59e0b' },
          { x: 570, y: 145, label: '3. Act', desc: 'Call tools, APIs, MCP', color: '#10b981' },
          { x: 100, y: 145, label: '4. Learn', desc: 'Evaluate result, iterate', color: '#ef4444' },
        ].map((node) => (
          <g key={node.label}>
            <rect x={node.x} y={node.y} width={160} height={55} rx={10} fill={`${node.color}10`} stroke={node.color} strokeWidth={1.5} />
            <text x={node.x + 80} y={node.y + 24} textAnchor="middle" fill={node.color} fontSize={12} fontWeight={700}>{node.label}</text>
            <text x={node.x + 80} y={node.y + 42} textAnchor="middle" fill="currentColor" fontSize={9} opacity={0.5}>{node.desc}</text>
          </g>
        ))}

        {/* Arrows connecting them */}
        <path d="M260 62 Q330 25 350 65" fill="none" stroke="#3b82f6" strokeWidth={1.2} opacity={0.4} />
        <path d="M450 65 Q470 25 570 62" fill="none" stroke="#f59e0b" strokeWidth={1.2} opacity={0.4} />
        <path d="M570 145 Q470 195 450 155" fill="none" stroke="#10b981" strokeWidth={1.2} opacity={0.4} />
        <path d="M350 155 Q330 195 260 170" fill="none" stroke="#ef4444" strokeWidth={1.2} opacity={0.4} />
      </svg>
      {/* Mobile fallback */}
      <div className="sm:hidden grid grid-cols-2 gap-3">
        {[
          { label: '1. Observe', desc: 'Read context and data', color: '#3b82f6' },
          { label: '2. Think', desc: 'Plan next action', color: '#f59e0b' },
          { label: '3. Act', desc: 'Call tools and APIs', color: '#10b981' },
          { label: '4. Learn', desc: 'Evaluate and iterate', color: '#ef4444' },
        ].map((node) => (
          <div key={node.label} className="p-4 rounded-xl border bg-card text-center">
            <h4 className="font-semibold text-sm mb-1" style={{ color: node.color }}>{node.label}</h4>
            <p className="text-xs text-muted-foreground">{node.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Module 5: MCP Automation Stack ─── */
export function MCPAutomationStack() {
  const stack = [
    { label: 'AI Agent', desc: 'Claude / Antigravity / GPT; decides what to do', color: '#8b5cf6', y: 15 },
    { label: 'MCP Client', desc: 'Routes tool calls to the right server', color: '#3b82f6', y: 65 },
    { label: 'MCP Servers', desc: 'Google Sheets, Slack, Database, GitHub, Email', color: '#10b981', y: 115 },
    { label: 'External Services', desc: 'The real-world systems being automated', color: '#f59e0b', y: 165 },
  ];
  return (
    <div className="not-prose my-6">
      <svg viewBox="0 0 700 210" className="w-full h-auto hidden sm:block" role="img" aria-label="MCP automation stack">
        {stack.map((l) => (
          <g key={l.label}>
            <rect x={50} y={l.y} width={600} height={40} rx={8} fill={`${l.color}10`} stroke={l.color} strokeWidth={1.5} />
            <text x={80} y={l.y + 25} fill={l.color} fontSize={13} fontWeight={700}>{l.label}</text>
            <text x={620} y={l.y + 25} textAnchor="end" fill="currentColor" fontSize={11} opacity={0.5}>{l.desc}</text>
          </g>
        ))}
        {[50, 100, 150].map((y) => (
          <line key={y} x1={350} y1={y + 5} x2={350} y2={y + 15} stroke="currentColor" strokeWidth={1.2} opacity={0.15} strokeDasharray="3 2" />
        ))}
      </svg>
      {/* Mobile fallback */}
      <div className="sm:hidden flex flex-col gap-2">
        {[
          { label: 'AI Agent', desc: 'Decides what to do', color: '#8b5cf6' },
          { label: 'MCP Client', desc: 'Routes tool calls', color: '#3b82f6' },
          { label: 'MCP Servers', desc: 'Sheets, Slack, DB, GitHub', color: '#10b981' },
          { label: 'External Services', desc: 'The systems being automated', color: '#f59e0b' },
        ].map((l) => (
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

/* ─── Module 6: Pipeline Blueprint ─── */
export function PipelineBlueprint() {
  const steps = [
    { num: '1', label: 'Trigger', desc: 'Cron, webhook, event', color: '#ef4444' },
    { num: '2', label: 'Fetch', desc: 'API call or MCP resource', color: '#f59e0b' },
    { num: '3', label: 'Transform', desc: 'AI processes the data', color: '#3b82f6' },
    { num: '4', label: 'Act', desc: 'Write, send, update', color: '#8b5cf6' },
    { num: '5', label: 'Report', desc: 'Log, notify, dashboard', color: '#10b981' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {steps.map((s) => (
        <div key={s.num} className="p-4 rounded-xl border bg-card text-center">
          <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: s.color }}>{s.num}</div>
          <h4 className="font-semibold text-sm mb-1">{s.label}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Module 7: Production Monitoring ─── */
export function MonitoringDashboard() {
  const metrics = [
    { label: 'Uptime', value: '99.9%', color: '#10b981' },
    { label: 'Tasks / Day', value: '1,247', color: '#3b82f6' },
    { label: 'Errors', value: '3', color: '#f59e0b' },
    { label: 'Cost Saved', value: '40h/wk', color: '#8b5cf6' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-2 md:grid-cols-4 gap-3">
      {metrics.map((m) => (
        <div key={m.label} className="p-4 rounded-xl border bg-card text-center">
          <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: m.color }} />
          <div className="text-xl font-bold" style={{ color: m.color }}>{m.value}</div>
          <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
        </div>
      ))}
    </div>
  );
}

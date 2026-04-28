'use client';

/* ─── Module 1: Automation Layers ─── */
export function AutomationLayers() {
  const layers = [
    { label: 'Manual', desc: 'You do everything by hand', emoji: '🖱️', color: '#ef4444', effort: '100%' },
    { label: 'Templates', desc: 'Reusable scripts & snippets', emoji: '📋', color: '#f59e0b', effort: '60%' },
    { label: 'No-Code Tools', desc: 'n8n, Make, Zapier', emoji: '🔗', color: '#3b82f6', effort: '30%' },
    { label: 'AI Agents', desc: 'Claude, Antigravity, GPT', emoji: '🤖', color: '#8b5cf6', effort: '10%' },
    { label: 'Autonomous', desc: 'MCP + Agents + Cron = Zero-touch', emoji: '⚡', color: '#10b981', effort: '~0%' },
  ];
  return (
    <div className="not-prose my-6">
      <svg viewBox="0 0 800 200" className="w-full h-auto" role="img" aria-label="Automation spectrum from manual to autonomous">
        {layers.map((l, i) => (
          <g key={l.label}>
            <rect x={i * 155 + 10} y={20} width={145} height={120} rx={12} fill={`${l.color}10`} stroke={l.color} strokeWidth={1.5} />
            <text x={i * 155 + 82} y={50} textAnchor="middle" fontSize={22}>{l.emoji}</text>
            <text x={i * 155 + 82} y={75} textAnchor="middle" fill={l.color} fontSize={12} fontWeight={700}>{l.label}</text>
            <text x={i * 155 + 82} y={95} textAnchor="middle" fill="currentColor" fontSize={9} opacity={0.5}>{l.desc}</text>
            <text x={i * 155 + 82} y={125} textAnchor="middle" fill={l.color} fontSize={11} fontWeight={600}>Effort: {l.effort}</text>
            {i < 4 && (
              <path d={`M${i * 155 + 155} 80 L${(i + 1) * 155 + 10} 80`} stroke="currentColor" strokeWidth={1} opacity={0.15} strokeDasharray="3 2" />
            )}
          </g>
        ))}
        <text x={400} y={175} textAnchor="middle" fill="currentColor" fontSize={11} opacity={0.4}>← More manual effort · · · More autonomous →</text>
      </svg>
    </div>
  );
}

/* ─── Module 2: API Request Flow ─── */
export function APIFlowDiagram() {
  return (
    <div className="not-prose my-6">
      <svg viewBox="0 0 750 140" className="w-full h-auto" role="img" aria-label="API request flow: Client sends request, server processes, returns response">
        <rect x={10} y={30} width={140} height={70} rx={10} fill="#3b82f610" stroke="#3b82f6" strokeWidth={1.5} />
        <text x={80} y={60} textAnchor="middle" fill="#3b82f6" fontSize={12} fontWeight={700}>Your Script</text>
        <text x={80} y={78} textAnchor="middle" fill="currentColor" fontSize={9} opacity={0.5}>or AI Agent</text>

        <line x1={150} y1={55} x2={280} y2={55} stroke="#10b981" strokeWidth={1.5} />
        <text x={215} y={48} textAnchor="middle" fill="#10b981" fontSize={9}>GET /api/data</text>
        <text x={215} y={100} textAnchor="middle" fill="#8b5cf6" fontSize={9}>JSON response</text>
        <line x1={280} y1={75} x2={150} y2={75} stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="4 3" />

        <rect x={280} y={30} width={140} height={70} rx={10} fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1.5} />
        <text x={350} y={60} textAnchor="middle" fill="#f59e0b" fontSize={12} fontWeight={700}>API Server</text>
        <text x={350} y={78} textAnchor="middle" fill="currentColor" fontSize={9} opacity={0.5}>Auth → Process → Return</text>

        <line x1={420} y1={65} x2={500} y2={65} stroke="currentColor" strokeWidth={1} opacity={0.2} strokeDasharray="3 2" />

        <rect x={500} y={30} width={140} height={70} rx={10} fill="#10b98110" stroke="#10b981" strokeWidth={1.5} />
        <text x={570} y={60} textAnchor="middle" fill="#10b981" fontSize={12} fontWeight={700}>Database</text>
        <text x={570} y={78} textAnchor="middle" fill="currentColor" fontSize={9} opacity={0.5}>or External Service</text>
      </svg>
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
      <svg viewBox="0 0 800 230" className="w-full h-auto" role="img" aria-label="AI agent loop: Observe, Think, Act, Learn">
        {/* Center circle */}
        <circle cx={400} cy={115} r={50} fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={2} />
        <text x={400} y={110} textAnchor="middle" fill="#8b5cf6" fontSize={14} fontWeight={700}>AI Agent</text>
        <text x={400} y={128} textAnchor="middle" fill="currentColor" fontSize={9} opacity={0.5}>Reasoning Loop</text>

        {/* Four corners */}
        {[
          { x: 100, y: 40, label: '1. Observe', desc: 'Read context, data, errors', color: '#3b82f6', emoji: '👁️' },
          { x: 600, y: 40, label: '2. Think', desc: 'Plan next action', color: '#f59e0b', emoji: '🧠' },
          { x: 600, y: 155, label: '3. Act', desc: 'Call tools, APIs, MCP', color: '#10b981', emoji: '⚡' },
          { x: 100, y: 155, label: '4. Learn', desc: 'Evaluate result, iterate', color: '#ef4444', emoji: '🔄' },
        ].map((node) => (
          <g key={node.label}>
            <rect x={node.x} y={node.y} width={150} height={60} rx={10} fill={`${node.color}10`} stroke={node.color} strokeWidth={1.5} />
            <text x={node.x + 75} y={node.y + 25} textAnchor="middle" fill={node.color} fontSize={12} fontWeight={700}>{node.emoji} {node.label}</text>
            <text x={node.x + 75} y={node.y + 45} textAnchor="middle" fill="currentColor" fontSize={9} opacity={0.5}>{node.desc}</text>
          </g>
        ))}

        {/* Arrows connecting them */}
        <path d="M250 70 Q320 30 350 70" fill="none" stroke="#3b82f6" strokeWidth={1.2} opacity={0.4} />
        <path d="M450 70 Q480 30 600 70" fill="none" stroke="#f59e0b" strokeWidth={1.2} opacity={0.4} />
        <path d="M600 155 Q480 200 450 160" fill="none" stroke="#10b981" strokeWidth={1.2} opacity={0.4} />
        <path d="M350 160 Q320 200 250 185" fill="none" stroke="#ef4444" strokeWidth={1.2} opacity={0.4} />
      </svg>
    </div>
  );
}

/* ─── Module 5: MCP Automation Stack ─── */
export function MCPAutomationStack() {
  const stack = [
    { label: 'AI Agent', desc: 'Claude / Antigravity / GPT — decides what to do', color: '#8b5cf6', y: 15 },
    { label: 'MCP Client', desc: 'Routes tool calls to the right server', color: '#3b82f6', y: 65 },
    { label: 'MCP Servers', desc: 'Google Sheets · Slack · Database · GitHub · Email', color: '#10b981', y: 115 },
    { label: 'External Services', desc: 'The real-world systems being automated', color: '#f59e0b', y: 165 },
  ];
  return (
    <div className="not-prose my-6">
      <svg viewBox="0 0 700 215" className="w-full h-auto" role="img" aria-label="MCP automation stack">
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
    <div className="not-prose my-6 grid grid-cols-2 md:grid-cols-5 gap-3">
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
    { label: 'Uptime', value: '99.9%', icon: '🟢', color: '#10b981' },
    { label: 'Tasks / Day', value: '1,247', icon: '📊', color: '#3b82f6' },
    { label: 'Errors', value: '3', icon: '⚠️', color: '#f59e0b' },
    { label: 'Cost Saved', value: '40h/wk', icon: '💰', color: '#8b5cf6' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-2 md:grid-cols-4 gap-3">
      {metrics.map((m) => (
        <div key={m.label} className="p-4 rounded-xl border bg-card text-center">
          <div className="text-2xl mb-1">{m.icon}</div>
          <div className="text-xl font-bold" style={{ color: m.color }}>{m.value}</div>
          <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
        </div>
      ))}
    </div>
  );
}

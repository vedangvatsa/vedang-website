'use client';

/* ─── Module 1: MCP Architecture Overview ─── */
export function MCPArchitecture() {
  return (
    <div className="not-prose my-6">
      <svg viewBox="0 0 800 280" className="w-full h-auto hidden sm:block" role="img" aria-label="MCP architecture: Host contains Clients that connect to Servers">
        {/* Host */}
        <rect x={20} y={10} width={260} height={260} rx={16} fill="#3b82f608" stroke="#3b82f6" strokeWidth={2} strokeDasharray="6 4" />
        <text x={150} y={40} textAnchor="middle" fill="#3b82f6" fontSize={14} fontWeight={700}>MCP Host (e.g. Claude Desktop)</text>

        {/* LLM inside host */}
        <rect x={60} y={55} width={180} height={40} rx={8} fill="#8b5cf615" stroke="#8b5cf6" strokeWidth={1.5} />
        <text x={150} y={80} textAnchor="middle" fill="#8b5cf6" fontSize={12} fontWeight={600}>LLM (Claude, GPT, Gemini)</text>

        {/* Clients inside host */}
        {[
          { y: 115, label: 'MCP Client A' },
          { y: 160, label: 'MCP Client B' },
          { y: 205, label: 'MCP Client C' },
        ].map((c) => (
          <g key={c.label}>
            <rect x={60} y={c.y} width={180} height={35} rx={6} fill="#3b82f610" stroke="#3b82f6" strokeWidth={1} />
            <text x={150} y={c.y + 22} textAnchor="middle" fill="#3b82f6" fontSize={11}>{c.label}</text>
          </g>
        ))}

        {/* Arrows */}
        {[132, 177, 222].map((y) => (
          <line key={y} x1={240} y1={y} x2={420} y2={y} stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 3" />
        ))}
        <text x={330} y={125} textAnchor="middle" fill="#10b981" fontSize={9} fontWeight={600}>JSON-RPC</text>

        {/* Servers */}
        {[
          { y: 105, label: '🔍 Search Server', desc: 'Web search API', color: '#10b981' },
          { y: 155, label: '🗄️ Database Server', desc: 'PostgreSQL queries', color: '#f59e0b' },
          { y: 205, label: '📁 Filesystem Server', desc: 'Read/write files', color: '#ef4444' },
        ].map((s) => (
          <g key={s.label}>
            <rect x={420} y={s.y} width={200} height={40} rx={8} fill={`${s.color}10`} stroke={s.color} strokeWidth={1.5} />
            <text x={520} y={s.y + 18} textAnchor="middle" fill={s.color} fontSize={12} fontWeight={600}>{s.label}</text>
            <text x={520} y={s.y + 32} textAnchor="middle" fill="currentColor" fontSize={9} opacity={0.5}>{s.desc}</text>
          </g>
        ))}

        {/* Servers connecting to data */}
        {[125, 175, 225].map((y) => (
          <line key={y} x1={620} y1={y} x2={700} y2={y} stroke="currentColor" strokeWidth={1} opacity={0.2} strokeDasharray="3 2" />
        ))}
        <rect x={700} y={100} width={80} height={150} rx={8} fill="currentColor" opacity={0.05} stroke="currentColor" strokeWidth={1} />
        <text x={740} y={180} textAnchor="middle" fill="currentColor" fontSize={10} opacity={0.4}>Data Sources</text>
      </svg>
      {/* Mobile fallback */}
      <div className="sm:hidden grid grid-cols-1 gap-3">
        {[
          { label: 'MCP Host', desc: 'Claude Desktop, Cursor, etc.', color: '#3b82f6' },
          { label: 'MCP Client', desc: 'Routes tool calls via JSON-RPC', color: '#3b82f6' },
          { label: 'MCP Servers', desc: 'Search, Database, Filesystem', color: '#10b981' },
        ].map((item) => (
          <div key={item.label} className="p-4 rounded-xl border bg-card">
            <h4 className="font-semibold text-sm mb-1" style={{ color: item.color }}>{item.label}</h4>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Module 2: Transport Layers ─── */
export function TransportDiagram() {
  const transports = [
    { label: 'stdio', desc: 'Local process communication', use: 'CLI tools, local dev', color: '#3b82f6' },
    { label: 'SSE', desc: 'Server-Sent Events over HTTP', use: 'Remote servers, streaming', color: '#8b5cf6' },
    { label: 'HTTP', desc: 'Streamable HTTP (newest)', use: 'Production, stateless', color: '#10b981' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {transports.map((t) => (
        <div key={t.label} className="p-5 rounded-xl border bg-card">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mb-3" style={{ backgroundColor: t.color }}>{t.label[0]}</div>
          <h4 className="font-semibold text-base mb-1" style={{ color: t.color }}>{t.label}</h4>
          <p className="text-sm text-muted-foreground mb-2">{t.desc}</p>
          <p className="text-xs text-muted-foreground/70 italic">Best for: {t.use}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Module 3: Server Skeleton ─── */
export function ServerSkeleton() {
  const steps = [
    { num: '1', label: 'Initialize', desc: 'Install the MCP SDK', color: '#3b82f6' },
    { num: '2', label: 'Create Server', desc: 'Instantiate McpServer', color: '#8b5cf6' },
    { num: '3', label: 'Register Tools', desc: 'Define tool schemas', color: '#f59e0b' },
    { num: '4', label: 'Transport', desc: 'stdio, SSE, or HTTP', color: '#10b981' },
    { num: '5', label: 'Test', desc: 'MCP Inspector / Claude', color: '#ef4444' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {steps.map((s) => (
        <div key={s.num} className="p-4 rounded-xl border bg-card text-center">
          <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: s.color }}>{s.num}</div>
          <h4 className="font-semibold text-sm mb-1">{s.label}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed break-words">{s.desc}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Module 4: Three Primitives ─── */
export function MCPPrimitives() {
  const primitives = [
    { label: 'Tools', emoji: '🔧', desc: 'Functions the LLM can call', detail: 'Model-controlled. The LLM decides when to use them based on context.', color: '#3b82f6', bg: 'bg-blue-500/5 border-blue-500/20' },
    { label: 'Resources', emoji: '📄', desc: 'Data the app can read', detail: 'App-controlled. The host application decides when to fetch and inject them.', color: '#10b981', bg: 'bg-emerald-500/5 border-emerald-500/20' },
    { label: 'Prompts', emoji: '💬', desc: 'Reusable prompt templates', detail: 'User-controlled. The user selects which prompt template to use.', color: '#f59e0b', bg: 'bg-amber-500/5 border-amber-500/20' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {primitives.map((p) => (
        <div key={p.label} className={`p-5 rounded-xl border ${p.bg}`}>
          <div className="text-2xl mb-2">{p.emoji}</div>
          <h4 className="font-semibold text-base mb-1" style={{ color: p.color }}>{p.label}</h4>
          <p className="text-sm font-medium mb-2">{p.desc}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{p.detail}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Module 5: Client Ecosystem ─── */
export function ClientEcosystem() {
  const clients = [
    { name: 'Claude Desktop', type: 'Chat UI', status: 'Full support', color: '#8b5cf6' },
    { name: 'Cursor', type: 'Code Editor', status: 'Full support', color: '#3b82f6' },
    { name: 'VS Code (Copilot)', type: 'Code Editor', status: 'Growing support', color: '#10b981' },
    { name: 'Antigravity', type: 'AI Agent', status: 'Full support', color: '#f59e0b' },
    { name: 'Windsurf', type: 'Code Editor', status: 'Full support', color: '#ef4444' },
    { name: 'Custom App', type: 'Your own', status: 'Build with SDK', color: '#6366f1' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-2 md:grid-cols-3 gap-3">
      {clients.map((c) => (
        <div key={c.name} className="p-4 rounded-xl border bg-card">
          <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: c.color }} />
          <h4 className="font-semibold text-sm">{c.name}</h4>
          <p className="text-xs text-muted-foreground">{c.type}</p>
          <p className="text-xs mt-1 font-medium" style={{ color: c.color }}>{c.status}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Module 6: Real-World Pattern ─── */
export function DatabaseServerDiagram() {
  return (
    <div className="not-prose my-6">
      <svg viewBox="0 0 700 160" className="w-full h-auto hidden sm:block" role="img" aria-label="MCP Database Server pattern: LLM calls query tool which executes SQL">
        <rect x={10} y={40} width={120} height={70} rx={10} fill="#8b5cf615" stroke="#8b5cf6" strokeWidth={1.5} />
        <text x={70} y={80} textAnchor="middle" fill="#8b5cf6" fontSize={13} fontWeight={700}>LLM</text>

        <line x1={130} y1={75} x2={210} y2={75} stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={170} y={65} textAnchor="middle" fill="#3b82f6" fontSize={9}>tool call</text>

        <rect x={210} y={30} width={180} height={90} rx={10} fill="#3b82f610" stroke="#3b82f6" strokeWidth={1.5} />
        <text x={300} y={60} textAnchor="middle" fill="#3b82f6" fontSize={12} fontWeight={700}>MCP Server</text>
        <text x={300} y={80} textAnchor="middle" fill="currentColor" fontSize={10} opacity={0.5}>query_database tool</text>
        <text x={300} y={100} textAnchor="middle" fill="currentColor" fontSize={9} opacity={0.4}>validates → executes → formats</text>

        <line x1={390} y1={75} x2={470} y2={75} stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={430} y={65} textAnchor="middle" fill="#10b981" fontSize={9}>SQL</text>

        <rect x={470} y={40} width={120} height={70} rx={10} fill="#10b98110" stroke="#10b981" strokeWidth={1.5} />
        <text x={530} y={70} textAnchor="middle" fill="#10b981" fontSize={12} fontWeight={700}>PostgreSQL</text>
        <text x={530} y={90} textAnchor="middle" fill="currentColor" fontSize={9} opacity={0.4}>Your database</text>

        <line x1={590} y1={75} x2={640} y2={75} stroke="#f59e0b" strokeWidth={1} opacity={0.3} />
        <text x={670} y={80} textAnchor="middle" fill="#f59e0b" fontSize={10}>📊 Data</text>
      </svg>
      {/* Mobile fallback */}
      <div className="sm:hidden flex flex-col gap-2">
        {[
          { label: 'LLM', desc: 'Calls query tool', color: '#8b5cf6' },
          { label: 'MCP Server', desc: 'Validates → Executes → Formats', color: '#3b82f6' },
          { label: 'PostgreSQL', desc: 'Returns data', color: '#10b981' },
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

/* ─── Module 7: Production Checklist ─── */
export function ProductionChecklist() {
  const items = [
    { label: 'Input Validation', desc: 'Sanitize all parameters with Zod schemas', icon: '🛡️', color: '#ef4444' },
    { label: 'Error Handling', desc: 'Return MCP error codes, never expose internals', icon: '⚠️', color: '#f59e0b' },
    { label: 'Rate Limiting', desc: 'Prevent abuse and runaway costs', icon: '⏱️', color: '#3b82f6' },
    { label: 'Auth & Secrets', desc: 'Environment variables, never hardcode', icon: '🔑', color: '#8b5cf6' },
    { label: 'Logging', desc: 'Structured logs for every tool invocation', icon: '📋', color: '#10b981' },
    { label: 'Testing', desc: 'Unit tests + MCP Inspector integration tests', icon: '✅', color: '#6366f1' },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map((item) => (
        <div key={item.label} className="p-4 rounded-xl border bg-card">
          <div className="text-xl mb-2">{item.icon}</div>
          <h4 className="font-semibold text-sm mb-1">{item.label}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

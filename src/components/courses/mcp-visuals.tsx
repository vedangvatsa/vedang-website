'use client';

/* ─── Module 1: MCP Architecture Overview ─── */
export function MCPArchitecture() {
  const layers = [
    { component: 'MCP Host', desc: 'The AI application the user interacts with', examples: 'Claude Desktop, Cursor, VS Code, Antigravity, Windsurf', color: '#3b82f6' },
    { component: 'MCP Client', desc: 'Lightweight connector inside the host, 1:1 with each server', examples: 'JSON-RPC transport, tool discovery, schema validation', color: '#8b5cf6' },
    { component: 'MCP Server', desc: 'Exposes tools, resources, and prompts via the protocol', examples: 'Your custom server, community servers, npm packages', color: '#10b981' },
    { component: 'Data Source', desc: 'The real-world system being connected', examples: 'PostgreSQL, Google Sheets, Slack, GitHub, REST APIs', color: '#f59e0b' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">MCP Architecture</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">The universal connector between AI models and any data source</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          <div className="rounded-[3px] border-2 border-red-200 dark:border-red-900/40 p-4">
            <div className="text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-wider mb-2">Before MCP: N×M Problem</div>
            <p className="text-[11px] text-muted-foreground">5 AI apps × 10 data sources = <strong className="text-red-500">50 custom integrations</strong>. Each with its own auth, error handling, and data formatting.</p>
          </div>
          <div className="rounded-[3px] border-2 border-blue-300 dark:border-blue-800/60 p-4">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">After MCP: N+M Solution</div>
            <p className="text-[11px] text-muted-foreground">5 AI apps + 10 data sources = <strong className="text-blue-600 dark:text-blue-400">15 integrations</strong>. Each app implements one client. Each source implements one server.</p>
          </div>
        </div>

        <div className="space-y-1.5">
          {layers.map((l, i) => (
            <div key={l.component} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderLeftWidth: '3px', borderLeftColor: l.color }}>
              <div className="px-4 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                <div>
                  <span className="text-xs font-bold" style={{ color: l.color }}>{l.component}</span>
                  <span className="text-[10px] text-muted-foreground ml-2">{l.desc}</span>
                </div>
                <span className="text-[10px] text-muted-foreground/60">{l.examples}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 2: Transport Layers ─── */
export function TransportDiagram() {
  const transports = [
    {
      name: 'stdio', desc: 'Standard input/output pipes',
      how: 'Host spawns server as child process. Messages via stdin/stdout.',
      best: 'Local development, CLI tools, Claude Desktop',
      limitation: 'Same machine only, no network',
      color: '#3b82f6',
    },
    {
      name: 'SSE', desc: 'Server-Sent Events over HTTP',
      how: 'Client POSTs to /messages, server streams via /sse endpoint.',
      best: 'Remote servers, multi-user, cloud hosting',
      limitation: 'Requires persistent connection, two endpoints',
      color: '#8b5cf6',
    },
    {
      name: 'Streamable HTTP', desc: 'Single HTTP endpoint (newest)',
      how: 'Single endpoint, stateless by default, streams when needed.',
      best: 'Production, serverless (Vercel, Lambda, Workers)',
      limitation: 'Newest transport, some clients still adopting',
      color: '#10b981',
    },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">MCP Transport Layers</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Same protocol, different delivery mechanisms</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {transports.map((t) => (
            <div key={t.name} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#e3e3e0] dark:border-zinc-800" style={{ backgroundColor: t.color + '08' }}>
                <div className="text-sm font-bold" style={{ color: t.color }}>{t.name}</div>
                <div className="text-[10px] text-muted-foreground">{t.desc}</div>
              </div>
              <div className="px-4 py-3 space-y-2">
                <div><span className="text-[10px] font-bold text-muted-foreground/60 uppercase">How it works</span><p className="text-[10px] text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)] mt-0.5">{t.how}</p></div>
                <div><span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase">Best for</span><p className="text-[10px] text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)] mt-0.5">{t.best}</p></div>
                <div><span className="text-[10px] font-bold text-red-500 dark:text-red-400 uppercase">Limitation</span><p className="text-[10px] text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)] mt-0.5">{t.limitation}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 3: Server Skeleton ─── */
export function ServerSkeleton() {
  const steps = [
    { num: '1', label: 'Project Setup', desc: 'npm init, install @modelcontextprotocol/sdk, zod, tsx', time: '2 min', color: '#3b82f6' },
    { num: '2', label: 'Create Server', desc: 'Instantiate McpServer with name and version', time: '1 min', color: '#8b5cf6' },
    { num: '3', label: 'Register Tools', desc: 'Define tool name, description, Zod schema, async handler', time: '10 min', color: '#f59e0b' },
    { num: '4', label: 'Connect Transport', desc: 'StdioServerTransport for local, SSE/HTTP for remote', time: '1 min', color: '#10b981' },
    { num: '5', label: 'Test', desc: 'MCP Inspector for debugging, then connect to Claude Desktop', time: '5 min', color: '#ef4444' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Building an MCP Server in 5 Steps</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">From zero to a working tool in under 20 minutes</p>

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

/* ─── Module 4: Three Primitives ─── */
export function MCPPrimitives() {
  const primitives = [
    {
      name: 'Tools', controlled: 'Model-controlled', desc: 'Functions the LLM decides when to call',
      when: ['Actions that modify state (create, update, delete)', 'Computations or transformations', 'External API calls', 'Anything the AI invokes based on user intent'],
      color: '#3b82f6',
    },
    {
      name: 'Resources', controlled: 'App-controlled', desc: 'Data the host application loads for context',
      when: ['Configuration files and schemas', 'Documentation and knowledge bases', 'Database schemas (not data)', 'Read-only background context'],
      color: '#10b981',
    },
    {
      name: 'Prompts', controlled: 'User-controlled', desc: 'Reusable templates the user selects',
      when: ['Common workflows users repeat', 'Templates combining multiple tools', 'Guided experiences with specific output', 'Slash commands and menu items'],
      color: '#f59e0b',
    },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Three MCP Primitives</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Different control semantics for different use cases</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {primitives.map((p) => (
            <div key={p.name} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#e3e3e0] dark:border-zinc-800" style={{ backgroundColor: p.color + '08' }}>
                <div className="text-sm font-bold" style={{ color: p.color }}>{p.name}</div>
                <div className="text-[10px] text-muted-foreground">{p.controlled}</div>
              </div>
              <div className="px-4 py-3">
                <p className="text-[10px] text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)] mb-2">{p.desc}</p>
                <div className="text-[10px] font-bold text-muted-foreground/60 uppercase mb-1">Use when</div>
                {p.when.map((w) => (
                  <div key={w} className="text-[10px] text-muted-foreground py-0.5 border-b border-[#e3e3e0]/30 dark:border-zinc-800/30 last:border-0">{w}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 5: Client Ecosystem ─── */
export function ClientEcosystem() {
  const clients = [
    { name: 'Claude Desktop', type: 'Chat UI', config: 'claude_desktop_config.json', support: 'Full (reference client)', color: '#8b5cf6' },
    { name: 'Cursor', type: 'Code Editor', config: '.cursor/mcp.json', support: 'Full (per-project)', color: '#3b82f6' },
    { name: 'Antigravity', type: 'AI Agent', config: 'Settings UI', support: 'Full', color: '#f59e0b' },
    { name: 'VS Code + Copilot', type: 'Code Editor', config: '.vscode/mcp.json', support: 'Growing', color: '#10b981' },
    { name: 'Windsurf', type: 'Code Editor', config: 'Settings UI', support: 'Full', color: '#ef4444' },
    { name: 'Custom App', type: 'Your own', config: 'SDK Client class', support: 'Build with SDK', color: '#6366f1' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">MCP Client Ecosystem</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Every major AI tool supports MCP</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[420px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Client</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Type</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Config File</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Support</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.name} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2 px-2 font-bold" style={{ color: c.color }}>{c.name}</td>
                  <td className="py-2 px-2 text-muted-foreground">{c.type}</td>
                  <td className="py-2 px-2 font-mono text-[10px] text-muted-foreground/60">{c.config}</td>
                  <td className="py-2 px-2 text-muted-foreground">{c.support}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 6: Real-World Patterns ─── */
export function DatabaseServerDiagram() {
  const patterns = [
    {
      name: 'Database Server', desc: 'Let AI query your database with natural language',
      tools: ['query_database (read-only SQL)', 'get_schema (table structure)'],
      resources: ['db://schema (auto-loaded context)'],
      tips: 'Start read-only. Expose schema as resource. Block DROP/DELETE.',
      color: '#3b82f6',
    },
    {
      name: 'API Wrapper', desc: 'Wrap any REST API as an MCP server',
      tools: ['get_weather, search_users, create_task'],
      resources: ['api://docs (API documentation)'],
      tips: 'Handle errors with isError. Rate limit. Use env vars for keys.',
      color: '#10b981',
    },
    {
      name: 'Multi-Tool Server', desc: 'Group related tools into one coherent server',
      tools: ['list_projects, get_project, create_task, update_status'],
      resources: ['projects://active (project list)'],
      tips: 'Use verb_noun naming. Be specific. Group with common prefixes.',
      color: '#f59e0b',
    },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Real-World Server Patterns</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Common architectures for production MCP servers</p>

        <div className="space-y-3">
          {patterns.map((p) => (
            <div key={p.name} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderLeftWidth: '3px', borderLeftColor: p.color }}>
              <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: p.color + '08' }}>
                <span className="text-xs font-bold" style={{ color: p.color }}>{p.name}</span>
                <span className="text-[10px] text-muted-foreground">{p.desc}</span>
              </div>
              <div className="px-4 py-2.5 grid grid-cols-1 md:grid-cols-3 gap-3 text-[10px]">
                <div>
                  <span className="text-muted-foreground/60 uppercase font-semibold">Tools exposed</span>
                  {p.tools.map((t) => <p key={t} className="text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)] mt-0.5 font-mono">{t}</p>)}
                </div>
                <div>
                  <span className="text-muted-foreground/60 uppercase font-semibold">Resources</span>
                  {p.resources.map((r) => <p key={r} className="text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)] mt-0.5 font-mono">{r}</p>)}
                </div>
                <div>
                  <span className="text-muted-foreground/60 uppercase font-semibold">Key tip</span>
                  <p className="text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)] mt-0.5">{p.tips}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 7: Production Checklist ─── */
export function ProductionChecklist() {
  const categories = [
    {
      name: 'Security', color: '#ef4444',
      items: ['Input validation (Zod + manual checks)', 'Secrets in env variables only', 'Principle of least privilege', 'Never expose internals in errors'],
    },
    {
      name: 'Reliability', color: '#3b82f6',
      items: ['Structured error handling (McpError vs isError)', 'Rate limiting on all tools', 'Graceful shutdown handling', 'Timeout on external calls'],
    },
    {
      name: 'Observability', color: '#10b981',
      items: ['Structured logging to stderr', 'Tool invocation metrics', 'Response time tracking', 'Error rate monitoring'],
    },
    {
      name: 'Distribution', color: '#8b5cf6',
      items: ['npm package with bin field', 'Shebang in entry file', 'Published to mcp.run / smithery.ai', 'README with usage examples'],
    },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Production Readiness Checklist</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Ship a reliable, secure MCP server that others can depend on</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((cat) => (
            <div key={cat.name} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden">
              <div className="px-4 py-2 border-b border-[#e3e3e0] dark:border-zinc-800" style={{ backgroundColor: cat.color + '08' }}>
                <span className="text-xs font-bold" style={{ color: cat.color }}>{cat.name}</span>
              </div>
              <div className="px-4 py-2.5">
                {cat.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 py-1 border-b border-[#e3e3e0]/30 dark:border-zinc-800/30 last:border-0">
                    <div className="w-3.5 h-3.5 rounded-sm border border-[#e3e3e0] dark:border-zinc-700 shrink-0" />
                    <span className="text-[11px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{item}</span>
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

/* ─── Module 1 (B): MCP Ecosystem Map ─── */
export function MCPEcosystemMap() {
  const layers = [
    { name: 'Hosts', items: ['Claude Desktop', 'Cursor', 'Antigravity', 'Continue'], desc: 'Applications that connect to MCP servers', color: '#8b5cf6' },
    { name: 'Servers', items: ['Google Sheets', 'PostgreSQL', 'GitHub', 'Slack'], desc: 'Services that expose tools via MCP protocol', color: '#3b82f6' },
    { name: 'Transports', items: ['stdio', 'HTTP/SSE', 'Streamable HTTP'], desc: 'Communication channels between hosts and servers', color: '#10b981' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">MCP Ecosystem Map</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Three layers that make up the MCP architecture</p>
        <div className="space-y-2">
          {layers.map(l => (
            <div key={l.name} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden" style={{ borderLeftWidth: '3px', borderLeftColor: l.color }}>
              <div className="px-4 py-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold" style={{ color: l.color }}>{l.name}</span>
                  <span className="text-[9px] text-muted-foreground/60">{l.desc}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {l.items.map(i => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded border border-[#e3e3e0] dark:border-zinc-800 text-muted-foreground">{i}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 2 (B): Transport Comparison ─── */
export function TransportComparison() {
  const transports = [
    { name: 'stdio', latency: '<1ms', setup: 'Zero config', security: 'Process isolation', best: 'Local development, CLI tools', color: '#10b981' },
    { name: 'HTTP/SSE', latency: '~50ms', setup: 'Server + URL', security: 'Auth headers, TLS', best: 'Remote servers, cloud deployment', color: '#3b82f6' },
    { name: 'Streamable HTTP', latency: '~50ms', setup: 'Server + URL', security: 'Auth + streaming', best: 'Long-running operations, file transfers', color: '#8b5cf6' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Transport Comparison</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Choosing the right communication layer for your MCP server</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead><tr className="border-b border-[#e3e3e0] dark:border-zinc-800">
              {['Transport', 'Latency', 'Setup', 'Security', 'Best For'].map(h => (
                <th key={h} className="text-left px-2 py-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {transports.map(t => (
                <tr key={t.name} className="border-b border-[#e3e3e0]/40 dark:border-zinc-800/40">
                  <td className="px-2 py-2 font-bold" style={{ color: t.color }}>{t.name}</td>
                  <td className="px-2 py-2 font-mono text-muted-foreground">{t.latency}</td>
                  <td className="px-2 py-2 text-muted-foreground">{t.setup}</td>
                  <td className="px-2 py-2 text-muted-foreground">{t.security}</td>
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

/* ─── Module 3 (B): Server Boilerplate ─── */
export function ServerBoilerplate() {
  const files = [
    { file: 'index.ts', purpose: 'Entry point: creates server, registers tools, starts transport', lines: '~40', color: '#3b82f6' },
    { file: 'package.json', purpose: 'Dependencies: @modelcontextprotocol/sdk, zod for validation', lines: '~15', color: '#10b981' },
    { file: 'tsconfig.json', purpose: 'TypeScript config: strict mode, ES2022 target', lines: '~10', color: '#f59e0b' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Minimal MCP Server Structure</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Three files to go from zero to a working server</p>
        <div className="space-y-1.5">
          {files.map(f => (
            <div key={f.file} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 px-4 py-2.5 flex items-center gap-3" style={{ borderLeftWidth: '3px', borderLeftColor: f.color }}>
              <span className="text-xs font-mono font-bold min-w-[120px]" style={{ color: f.color }}>{f.file}</span>
              <span className="text-[10px] text-muted-foreground flex-1">{f.purpose}</span>
              <span className="text-[9px] text-muted-foreground/60">{f.lines} lines</span>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-[3px] bg-[#f7f6f3] dark:bg-zinc-800/40 px-4 py-2.5">
          <span className="text-[11px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)]"><strong>Total setup:</strong> Under 65 lines of code. The SDK handles protocol negotiation, message framing, and error serialization.</span>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 4 (B): Primitive Matrix ─── */
export function PrimitiveMatrix() {
  const primitives = [
    { name: 'Tools', direction: 'Server → Client', invocation: 'Client calls server', example: 'query_database, send_email', color: '#3b82f6' },
    { name: 'Resources', direction: 'Server → Client', invocation: 'Client reads data', example: 'file contents, DB schemas', color: '#10b981' },
    { name: 'Prompts', direction: 'Server → Client', invocation: 'User selects template', example: 'Summarize this PR, Debug this error', color: '#8b5cf6' },
    { name: 'Sampling', direction: 'Client → Server', invocation: 'Server requests LLM', example: 'Server asks host to generate text', color: '#f59e0b' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">MCP Primitive Matrix</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Four primitive types and their data flow directions</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead><tr className="border-b border-[#e3e3e0] dark:border-zinc-800">
              {['Primitive', 'Direction', 'Invocation', 'Examples'].map(h => (
                <th key={h} className="text-left px-2 py-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {primitives.map(p => (
                <tr key={p.name} className="border-b border-[#e3e3e0]/40 dark:border-zinc-800/40">
                  <td className="px-2 py-2 font-bold" style={{ color: p.color }}>{p.name}</td>
                  <td className="px-2 py-2 font-mono text-muted-foreground">{p.direction}</td>
                  <td className="px-2 py-2 text-muted-foreground">{p.invocation}</td>
                  <td className="px-2 py-2 text-muted-foreground/60 font-mono">{p.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 5 (B): Client Capabilities ─── */
export function ClientCapabilities() {
  const clients = [
    { name: 'Claude Desktop', tools: true, resources: true, prompts: true, sampling: false, color: '#8b5cf6' },
    { name: 'Cursor', tools: true, resources: false, prompts: false, sampling: false, color: '#3b82f6' },
    { name: 'Antigravity', tools: true, resources: true, prompts: false, sampling: false, color: '#10b981' },
    { name: 'Continue', tools: true, resources: true, prompts: true, sampling: false, color: '#f59e0b' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Client Capability Matrix</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Which MCP primitives each host application supports</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead><tr className="border-b border-[#e3e3e0] dark:border-zinc-800">
              {['Client', 'Tools', 'Resources', 'Prompts', 'Sampling'].map(h => (
                <th key={h} className="text-left px-2 py-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.name} className="border-b border-[#e3e3e0]/40 dark:border-zinc-800/40">
                  <td className="px-2 py-2 font-bold" style={{ color: c.color }}>{c.name}</td>
                  {[c.tools, c.resources, c.prompts, c.sampling].map((v, i) => (
                    <td key={i} className="px-2 py-2 text-center">{v ? '✓' : '—'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 6 (B): Integration Patterns ─── */
export function IntegrationPatterns() {
  const patterns = [
    { pattern: 'Read-Only Query', desc: 'Agent reads from a data source without modification', example: 'Query database, read file, fetch API', risk: 'Low', color: '#10b981' },
    { pattern: 'Read-Write', desc: 'Agent reads and modifies external state', example: 'Update spreadsheet, create GitHub issue', risk: 'Medium', color: '#f59e0b' },
    { pattern: 'Multi-Server Chain', desc: 'Agent chains calls across multiple MCP servers', example: 'DB → process → Sheets → Slack', risk: 'Medium', color: '#3b82f6' },
    { pattern: 'Human-in-the-Loop', desc: 'Agent prepares action, waits for human approval', example: 'Draft email → review → send', risk: 'Low', color: '#8b5cf6' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">MCP Integration Patterns</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Common architectural patterns for real-world MCP deployments</p>
        <div className="space-y-1.5">
          {patterns.map(p => (
            <div key={p.pattern} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 px-4 py-2.5 flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
              <span className="text-xs font-bold min-w-[140px]" style={{ color: p.color }}>{p.pattern}</span>
              <span className="text-[10px] text-muted-foreground flex-1">{p.desc}</span>
              <span className="text-[9px] font-mono text-muted-foreground/60 hidden md:block">{p.example}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: p.color + '15', color: p.color }}>Risk: {p.risk}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Module 7 (B): Production Readiness ─── */
export function ProductionReadiness() {
  const checks = [
    { category: 'Security', items: ['Input validation on all tool parameters', 'Least-privilege database access', 'Auth token rotation schedule'], color: '#ef4444' },
    { category: 'Reliability', items: ['Error handling with typed error codes', 'Graceful shutdown on SIGTERM', 'Retry logic for transient failures'], color: '#f59e0b' },
    { category: 'Observability', items: ['Structured logging (JSON format)', 'Tool call latency tracking', 'Error rate monitoring and alerting'], color: '#3b82f6' },
    { category: 'Distribution', items: ['npm package with bin entry', 'Docker image for remote deployment', 'README with connection instructions'], color: '#10b981' },
  ];
  return (
    <figure className="not-prose my-8 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-5 md:p-8">
        <h3 className="text-base md:text-lg font-bold tracking-tight mb-0.5 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Production Readiness Checklist</h3>
        <p className="text-[11px] text-muted-foreground mb-5 uppercase tracking-widest font-semibold">Four categories to audit before shipping an MCP server</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {checks.map(c => (
            <div key={c.category} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 overflow-hidden">
              <div className="px-3 py-2 border-b border-[#e3e3e0] dark:border-zinc-800" style={{ backgroundColor: c.color + '08' }}>
                <span className="text-xs font-bold" style={{ color: c.color }}>{c.category}</span>
              </div>
              <div className="px-3 py-2">
                {c.items.map(item => (
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


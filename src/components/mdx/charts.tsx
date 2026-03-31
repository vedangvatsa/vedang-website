'use client';

import React from 'react';

/* ─── Market Projection Chart: Horizontal bars comparing analyst estimates ─── */
export function MarketProjectionChart() {
  const projections = [
    { firm: 'Mordor Intelligence', range: '$218B', low: 218, high: 218, note: 'Retail AI by 2031', color: '#3b82f6' },
    { firm: 'Morgan Stanley', range: '$190-385B', low: 190, high: 385, note: 'US e-commerce via agents, 2030', color: '#6366f1' },
    { firm: 'Bain & Company', range: '$300-500B', low: 300, high: 500, note: 'US agentic commerce, 2030', color: '#8b5cf6' },
    { firm: 'McKinsey', range: '$3-5T', low: 3000, high: 5000, note: 'Global transaction volume, 2030', color: '#111' },
  ];
  const max = 5000;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Market Size Projections</h3>
        <p className="text-xs text-muted-foreground mb-8 uppercase tracking-widest font-semibold">Agentic commerce estimates by research firm</p>

        <div className="flex flex-col gap-5">
          {projections.map((p) => (
            <div key={p.firm} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{p.firm}</span>
                <span className="text-sm font-bold" style={{ color: p.color }}>{p.range}</span>
              </div>
              <div className="w-full h-7 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden relative">
                {p.low === p.high ? (
                  <div
                    className="h-full rounded-md transition-all"
                    style={{ width: `${(p.low / max) * 100}%`, backgroundColor: p.color, opacity: 0.8 }}
                  />
                ) : (
                  <>
                    <div
                      className="absolute h-full rounded-l-md"
                      style={{ width: `${(p.low / max) * 100}%`, backgroundColor: p.color, opacity: 0.5 }}
                    />
                    <div
                      className="absolute h-full rounded-md"
                      style={{ width: `${(p.high / max) * 100}%`, backgroundColor: p.color, opacity: 0.3 }}
                    />
                  </>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground/70">{p.note}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[10px] text-muted-foreground/60">
          Sources: Mordor Intelligence (2026), Morgan Stanley (2025), Bain & Company (2025), McKinsey (2025). Ranges reflect scenario modeling; not directly comparable across firms.
        </p>
      </div>
    </figure>
  );
}

/* ─── Trust Gap Chart: Usage vs Purchase Trust ─── */
export function TrustGapChart() {
  const data = [
    { label: 'Use AI agents regularly', value: 54, source: 'PYMNTS, Jan 2026', color: '#3b82f6' },
    { label: 'Trust agents to buy for them', value: 24, source: 'Forrester, Mar 2025', color: '#ef4444' },
    { label: 'Have completed an AI purchase', value: 13, source: 'Payments Industry Intel', color: '#f97316' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Trust Gap</h3>
        <p className="text-xs text-muted-foreground mb-8 uppercase tracking-widest font-semibold">% of US adults, 2025-2026</p>

        <div className="flex flex-col gap-6">
          {data.map((d) => (
            <div key={d.label} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{d.label}</span>
                <span className="text-xl font-bold" style={{ color: d.color }}>{d.value}%</span>
              </div>
              <div className="w-full h-8 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md transition-all flex items-center justify-end pr-3"
                  style={{ width: `${d.value}%`, backgroundColor: d.color, opacity: 0.8 }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground/70">{d.source}</span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Consumer Concerns Chart ─── */
export function ConsumerConcernsChart() {
  const concerns = [
    { label: 'Payment security', value: 32, color: '#ef4444' },
    { label: 'Privacy', value: 26, color: '#f97316' },
    { label: 'Agent errors', value: 18, color: '#eab308' },
    { label: 'Loss of control', value: 17, color: '#6b7280' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Top Consumer Concerns</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Why people hesitate to let agents buy for them</p>

        <div className="flex flex-col gap-4">
          {concerns.map((c) => (
            <div key={c.label} className="flex items-center gap-4">
              <span className="text-sm font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)] w-40 shrink-0">{c.label}</span>
              <div className="flex-1 h-6 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md"
                  style={{ width: `${(c.value / 32) * 100}%`, backgroundColor: c.color, opacity: 0.75 }}
                />
              </div>
              <span className="text-sm font-bold w-10 text-right" style={{ color: c.color }}>{c.value}%</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          Source: Kearney US Consumer Study, July 2025. Respondents could select multiple concerns.
        </p>
      </div>
    </figure>
  );
}

/* ─── Value Shift Grid: What gains vs loses value ─── */
export function ValueShiftGrid() {
  const loses = [
    'Display ads and retargeting',
    'Brand loyalty (agents switch on price)',
    'SEO keyword optimization',
    'Checkout UX / conversion funnels',
    'Product page design for humans',
  ];
  const gains = [
    'Structured product data (schema.org)',
    'Real-time inventory feeds',
    'Machine-readable specs and APIs',
    'Answer Engine Optimization (AEO)',
    'Agent-ready pricing and policies',
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-center text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">When the Buyer Is an Algorithm</h3>
        <p className="text-xs text-muted-foreground mb-8 uppercase tracking-widest font-semibold text-center">What changes in the value chain</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-[#f7f6f3] dark:bg-zinc-800/30 p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-[#37352f]/60 dark:text-zinc-400 mb-4">Loses value</div>
            <ul className="space-y-2.5">
              {loses.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">
                  <span className="text-[#37352f]/40 dark:text-zinc-500 mt-0.5 shrink-0">&#x2715;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-[#f7f6f3] dark:bg-zinc-800/30 p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Gains value</div>
            <ul className="space-y-2.5">
              {gains.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">
                  <span className="text-primary mt-0.5 shrink-0">&#x2713;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ─── Interaction Models Visual: McKinsey's 3 models ─── */
export function InteractionModelsVisual() {
  const models = [
    {
      title: 'Agent-to-Site',
      desc: 'Your agent talks directly to a merchant website or API. The merchant may not know the buyer is AI.',
      left: 'Buyer Agent',
      right: 'Merchant Site',
      color: '#3b82f6',
    },
    {
      title: 'Agent-to-Agent',
      desc: 'Your shopping agent negotiates with a retailer\'s commerce agent at machine speed through structured protocols.',
      left: 'Buyer Agent',
      right: 'Seller Agent',
      color: '#8b5cf6',
    },
    {
      title: 'Brokered',
      desc: 'An intermediary agent sits between you and multiple merchants, querying dozens of stores simultaneously.',
      left: 'Buyer Agent',
      right: 'Broker Agent',
      color: '#111',
    },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Three Interaction Models</h3>
        <p className="text-xs text-muted-foreground mb-8 uppercase tracking-widest font-semibold">McKinsey framework for agent-merchant communication</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {models.map((m) => (
            <div key={m.title} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-5 flex flex-col">
              <div className="text-sm font-bold mb-3" style={{ color: m.color }}>{m.title}</div>
              {/* Flow diagram */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="text-[10px] font-semibold text-center px-2 py-1.5 rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-[#f7f6f3] dark:bg-zinc-800/30 leading-tight">{m.left}</div>
                <svg width="40" height="16" viewBox="0 0 40 16" className="shrink-0">
                  <line x1="0" y1="8" x2="32" y2="8" stroke={m.color} strokeWidth="2" />
                  <polygon points="32,3 40,8 32,13" fill={m.color} />
                </svg>
                <div className="text-[10px] font-semibold text-center px-2 py-1.5 rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-[#f7f6f3] dark:bg-zinc-800/30 leading-tight">{m.right}</div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{m.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          Source: McKinsey, "The agentic commerce opportunity," October 2025.
        </p>
      </div>
    </figure>
  );
}

/* ─── Transaction Flow Diagram: 6-step agentic purchase ─── */
export function TransactionFlowDiagram() {
  const steps = [
    { num: '1', label: 'Intent', desc: 'You describe what you want' },
    { num: '2', label: 'Context', desc: 'Agent checks history and preferences' },
    { num: '3', label: 'Search', desc: 'Queries multiple stores simultaneously' },
    { num: '4', label: 'Compare', desc: 'Weighs price, reviews, shipping' },
    { num: '5', label: 'Pay', desc: 'Tokenized payment, no card exposed' },
    { num: '6', label: 'Learn', desc: 'Tracks delivery, updates model' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Anatomy of an Agentic Purchase</h3>
        <p className="text-xs text-muted-foreground mb-8 uppercase tracking-widest font-semibold">Six steps from intent to fulfillment</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {steps.map((s, i) => (
            <div key={s.num} className="relative flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-sm font-bold text-primary mb-2">
                {s.num}
              </div>
              <div className="text-xs font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] mb-0.5">{s.label}</div>
              <div className="text-[10px] text-muted-foreground leading-tight">{s.desc}</div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-5 -right-2 text-primary/40 text-xs">&#x2192;</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Commerce Evolution Timeline ─── */
export function CommerceEvolutionTimeline() {
  const eras = [
    { era: '2000s', label: 'Web Storefronts', desc: 'Browsers replace catalogs', color: '#a3a3a0' },
    { era: '2010s', label: 'Mobile Commerce', desc: 'Phones replace desktops', color: '#87877f' },
    { era: '2020s', label: 'Social Commerce', desc: 'Feeds replace search', color: '#6b6b63' },
    { era: '2025+', label: 'Agentic Commerce', desc: 'Agents replace humans', color: '#3b82f6' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-center text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Retail Evolution</h3>
        <p className="text-xs text-muted-foreground mb-8 uppercase tracking-widest font-semibold text-center">Each wave added a channel. This one removes the human.</p>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-0.5 bg-[#e3e3e0] dark:bg-zinc-800" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
            {eras.map((e) => (
              <div key={e.era} className="flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-bold mb-3 relative z-10"
                  style={{ backgroundColor: e.color }}
                >
                  {e.era}
                </div>
                <div className="text-sm font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{e.label}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{e.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ─── Protocol Comparison Table ─── */
export function ProtocolComparisonTable() {
  const protocols = [
    { name: 'MCP', creator: 'Anthropic', type: 'Tool integration', payment: 'None (context layer)', status: 'Adopted by all major AI platforms' },
    { name: 'A2A', creator: 'Google', type: 'Agent coordination', payment: 'None (negotiation layer)', status: '150+ organizations' },
    { name: 'AP2', creator: 'Google', type: 'Payment authorization', payment: 'Cryptographic mandates', status: 'Production' },
    { name: 'ACP', creator: 'OpenAI + Stripe', type: 'In-chat checkout', payment: 'Stripe card processing', status: 'Live in ChatGPT' },
    { name: 'x402', creator: 'Coinbase', type: 'HTTP-native payments', payment: 'Stablecoins (USDC)', status: 'V2 live, multi-chain' },
    { name: 'MPP', creator: 'Stripe + Paradigm', type: 'Multi-rail payments', payment: 'Stablecoins + cards + Lightning', status: 'Launched Mar 2026' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Protocol Comparison Matrix</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Six standards driving agentic commerce interoperability</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Protocol</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Creator</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Type</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Payment method</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {protocols.map((p) => (
                <tr key={p.name} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 font-bold text-primary">{p.name}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{p.creator}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{p.type}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{p.payment}</td>
                  <td className="py-2.5 px-2 text-muted-foreground">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

/* ─── Competitive Landscape: 6-card grid ─── */
export function CompetitiveLandscape() {
  const players = [
    {
      name: 'Google',
      bet: 'Open standard, owned distribution',
      detail: 'UCP is open for anyone to build on. Distribution runs through Google Search and Gemini, which Google owns. Same playbook as Android.',
    },
    {
      name: 'OpenAI',
      bet: 'Discovery and intent layer',
      detail: '800M weekly active users. Pivoting from owning checkout to owning where intent originates. Controlling discovery is more valuable than owning payment.',
    },
    {
      name: 'Coinbase',
      bet: 'Machine-to-machine payment layer',
      detail: 'x402 and Agentic Wallets position Coinbase as the payment layer. If agents pay each other in stablecoins, Coinbase wins regardless of which AI dominates.',
    },
    {
      name: 'Shopify',
      bet: 'Infrastructure for every AI surface',
      detail: 'Connected to every AI platform but owned by none. Checkout Kit, Catalog, and Universal Cart make merchants instantly available wherever agents shop.',
    },
    {
      name: 'Stripe + Paradigm',
      bet: 'Multi-rail payment abstraction',
      detail: 'MPP and Tempo bridge stablecoins, cards, and Lightning through one protocol. Backed by Anthropic, OpenAI, Mastercard, and Shopify.',
    },
    {
      name: 'Amazon',
      bet: 'Data depth and logistics moat',
      detail: 'Decades of purchase history, reviews, and fulfillment powering Rufus and Alexa+. Vulnerability: agents can access data through third-party reviews.',
    },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Competitive Landscape</h3>
        <p className="text-xs text-muted-foreground mb-8 uppercase tracking-widest font-semibold">Who controls the agent controls what gets bought</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((p) => (
            <div key={p.name} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-5">
              <span className="text-sm font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{p.name}</span>
              <div className="text-xs font-semibold text-muted-foreground mt-1 mb-2">{p.bet}</div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{p.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

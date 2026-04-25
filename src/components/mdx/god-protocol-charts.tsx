'use client';

import React from 'react';

/* ─── God Protocol Properties Comparison ─── */
export function GodProtocolComparison() {
  const properties = [
    { property: 'Faithful execution', god: 'Perfect', crypto: 'Deterministic (code)', traditional: 'Subject to error/corruption', godPct: 100, cryptoPct: 90, tradPct: 40 },
    { property: 'Confidentiality', god: 'Perfect', crypto: 'Public by default', traditional: 'Discretionary', godPct: 100, cryptoPct: 30, tradPct: 60 },
    { property: 'Availability', god: 'Always', crypto: '100% uptime (Ethereum, 10 yrs)', traditional: 'Business hours', godPct: 100, cryptoPct: 95, tradPct: 50 },
    { property: 'Self-interest', god: 'None', crypto: 'Validator incentives', traditional: 'Profit-motivated', godPct: 100, cryptoPct: 70, tradPct: 20 },
    { property: 'Universality', god: 'All computations', crypto: 'Turing-complete (EVM)', traditional: 'Domain-specific', godPct: 100, cryptoPct: 85, tradPct: 30 },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Approximating the God Protocol</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">How closely each system approaches Szabo&apos;s ideal TTP</p>

        <div className="space-y-4">
          {properties.map((p) => (
            <div key={p.property}>
              <div className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] mb-1.5">{p.property}</div>
              <div className="space-y-1">
                <div className="grid grid-cols-[90px_1fr_30px] gap-2 items-center">
                  <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'hsl(280 60% 45%)' }}>Ideal</span>
                  <div className="w-full h-3 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                    <div className="h-full rounded-md" style={{ width: `${p.godPct}%`, backgroundColor: 'hsl(280 60% 45%)', opacity: 0.4 }} />
                  </div>
                  <span className="text-[9px] text-muted-foreground text-right">{p.godPct}%</span>
                </div>
                <div className="grid grid-cols-[90px_1fr_30px] gap-2 items-center">
                  <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'hsl(210 90% 40%)' }}>Crypto</span>
                  <div className="w-full h-3 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                    <div className="h-full rounded-md" style={{ width: `${p.cryptoPct}%`, backgroundColor: 'hsl(210 90% 40%)', opacity: 0.5 }} />
                  </div>
                  <span className="text-[9px] text-muted-foreground text-right">{p.cryptoPct}%</span>
                </div>
                <div className="grid grid-cols-[90px_1fr_30px] gap-2 items-center">
                  <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'hsl(0 0% 55%)' }}>Traditional</span>
                  <div className="w-full h-3 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                    <div className="h-full rounded-md" style={{ width: `${p.tradPct}%`, backgroundColor: 'hsl(0 0% 55%)', opacity: 0.4 }} />
                  </div>
                  <span className="text-[9px] text-muted-foreground text-right">{p.tradPct}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          Directional assessment. &quot;Crypto&quot; refers to public blockchain systems (Ethereum). Confidentiality gap is being closed by ZKP and FHE technologies.
        </p>
      </div>
    </figure>
  );
}

/* ─── Cryptographic TTP Evolution Timeline ─── */
export function TTPEvolutionTimeline() {
  const milestones = [
    { year: '1997', event: 'Szabo publishes "The God Protocols"', type: 'concept', color: 'hsl(280 60% 45%)' },
    { year: '2009', event: 'Bitcoin: first trustless value transfer', type: 'launch', color: 'hsl(30 80% 50%)' },
    { year: '2015', event: 'Ethereum: Turing-complete smart contracts', type: 'launch', color: 'hsl(210 90% 40%)' },
    { year: '2017', event: 'zkSNARKs deployed (Zcash) for privacy', type: 'privacy', color: 'hsl(160 80% 35%)' },
    { year: '2020', event: 'DeFi summer: TVL surges past $10B', type: 'adoption', color: 'hsl(350 70% 45%)' },
    { year: '2022', event: 'Ethereum Merge: PoS transition, 99.95% energy reduction', type: 'launch', color: 'hsl(210 90% 40%)' },
    { year: '2023', event: 'ZK-rollups launch (zkSync, Polygon zkEVM)', type: 'privacy', color: 'hsl(160 80% 35%)' },
    { year: '2025', event: 'L2s handle 95% of Ethereum throughput, $28B TVL in ZK-rollups', type: 'adoption', color: 'hsl(350 70% 45%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Path Toward the God Protocol</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">28 years of building trustless infrastructure</p>

        <div className="relative">
          <div className="absolute left-[52px] top-0 bottom-0 w-px bg-[#e3e3e0] dark:bg-zinc-800" />
          <div className="space-y-3">
            {milestones.map((m) => (
              <div key={m.year} className="grid grid-cols-[42px_20px_1fr] gap-2 items-start">
                <span className="text-[11px] font-black text-right" style={{ color: m.color }}>{m.year}</span>
                <div className="flex items-center justify-center pt-0.5">
                  <div className="w-2.5 h-2.5 rounded-full border-2 bg-white dark:bg-zinc-900" style={{ borderColor: m.color }} />
                </div>
                <span className="text-[11px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{m.event}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          Sources: Szabo (1997), Bitcoin whitepaper (2008), Ethereum Foundation, DeFiLlama, L2Beat. ZK-rollup TVL as of late 2025.
        </p>
      </div>
    </figure>
  );
}

/* ─── Privacy Technology Stack ─── */
export function PrivacyTechStack() {
  const techs = [
    { name: 'Zero-Knowledge Proofs', abbr: 'ZKP', capability: 'Prove truth without revealing data', maturity: 85, status: 'Production (ZK-rollups, $28B TVL)', color: 'hsl(210 90% 40%)' },
    { name: 'Multi-Party Computation', abbr: 'MPC', capability: 'Joint computation without shared data', maturity: 65, status: 'Institutional custody, Chainlink DECO', color: 'hsl(160 80% 35%)' },
    { name: 'Fully Homomorphic Encryption', abbr: 'FHE', capability: 'Compute on encrypted data', maturity: 30, status: 'Research/early commercial (Zama, Microsoft SEAL)', color: 'hsl(280 60% 45%)' },
    { name: 'Trusted Execution Environments', abbr: 'TEE', capability: 'Isolated hardware computation', maturity: 75, status: 'Intel SGX, AWS Nitro Enclaves', color: 'hsl(30 80% 50%)' },
    { name: 'Decentralized Oracles', abbr: 'Oracle', capability: 'Trustless off-chain data feeds', maturity: 80, status: 'Chainlink ($16B+ TVS), Pyth', color: 'hsl(350 70% 45%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Privacy Technology Stack</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Closing the confidentiality gap in the God Protocol</p>

        <div className="space-y-3">
          {techs.map((t) => (
            <div key={t.abbr}>
              <div className="flex items-baseline justify-between mb-1">
                <div>
                  <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{t.name}</span>
                  <span className="text-[9px] ml-1.5 px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: t.color + '15', color: t.color }}>{t.abbr}</span>
                </div>
                <span className="text-[10px] font-bold" style={{ color: t.color }}>{t.maturity}%</span>
              </div>
              <div className="w-full h-3.5 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden mb-1">
                <div className="h-full rounded-md" style={{ width: `${t.maturity}%`, backgroundColor: t.color, opacity: 0.5 }} />
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] text-muted-foreground">{t.capability}</span>
                <span className="text-[9px] text-muted-foreground">{t.status}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          Maturity estimates are directional, based on production deployments and industry adoption. FHE remains computationally expensive but improving rapidly.
        </p>
      </div>
    </figure>
  );
}

/* ─── TTP Market Scale ─── */
export function TTPMarketScale() {
  const markets = [
    { name: 'Banking (correspondent)', value: 28, unit: 'T', color: 'hsl(0 0% 55%)' },
    { name: 'Legal services', value: 1.1, unit: 'T', color: 'hsl(0 0% 55%)' },
    { name: 'Title & escrow', value: 0.025, unit: 'T', color: 'hsl(0 0% 55%)' },
    { name: 'Insurance claims', value: 5.5, unit: 'T', color: 'hsl(0 0% 55%)' },
    { name: 'Bitcoin (trustless value)', value: 1.56, unit: 'T', color: 'hsl(30 80% 50%)' },
    { name: 'DeFi TVL (smart contract TTP)', value: 0.085, unit: 'T', color: 'hsl(210 90% 40%)' },
    { name: 'ZK-rollup TVL', value: 0.028, unit: 'T', color: 'hsl(160 80% 35%)' },
  ];
  const maxLog = Math.log10(28);

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Trusted Third Party Market</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Traditional intermediaries vs. cryptographic replacements (log scale)</p>

        <div className="space-y-2">
          {markets.map((m) => (
            <div key={m.name} className="grid grid-cols-[140px_1fr_65px] gap-2 items-center">
              <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{m.name}</span>
              <div className="w-full h-5 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div className="h-full rounded-md" style={{
                  width: `${Math.max((Math.log10(m.value * 1000) / Math.log10(28000)) * 100, 8)}%`,
                  backgroundColor: m.color,
                  opacity: 0.5,
                }} />
              </div>
              <span className="text-[11px] font-bold text-right" style={{ color: m.color }}>
                ${m.value >= 1 ? `${m.value}T` : `${(m.value * 1000).toFixed(0)}B`}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#e3e3e0] dark:border-zinc-800">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(0 0% 55%)' }} /><span className="text-[10px] text-muted-foreground">Traditional TTP</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(210 90% 40%)' }} /><span className="text-[10px] text-muted-foreground">Cryptographic TTP</span></div>
        </div>

        <p className="mt-2 text-[10px] text-muted-foreground/60">
          Sources: BIS (correspondent banking), IBIS World (legal services), CoinMarketCap (BTC market cap, April 2026), DeFiLlama (DeFi TVL, April 2026), L2Beat (ZK-rollup TVL). Logarithmic scale.
        </p>
      </div>
    </figure>
  );
}

/* ─── Distributed God Protocol Architecture ─── */
export function DistributedArchitectureChart() {
  const layers = [
    { layer: 'Verification', components: ['ZKPs', 'Attestation', 'DECO'], status: 'Production', color: 'hsl(210 90% 40%)' },
    { layer: 'Computation', components: ['Smart contracts', 'MPC', 'FHE'], status: 'Partial', color: 'hsl(160 80% 35%)' },
    { layer: 'Data Access', components: ['Chainlink oracles', 'The Graph', 'IPFS'], status: 'Production', color: 'hsl(30 80% 50%)' },
    { layer: 'Consensus', components: ['PoS validators', 'Cross-chain bridges', 'DA layers'], status: 'Production', color: 'hsl(280 60% 45%)' },
    { layer: 'Governance', components: ['DAOs', 'Token voting', 'Futarchy'], status: 'Experimental', color: 'hsl(350 70% 45%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Distributed God Protocol Architecture</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">No single entity possesses all properties. The network does.</p>

        <div className="space-y-3">
          {layers.map((l) => (
            <div key={l.layer} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3" style={{ borderLeftWidth: '3px', borderLeftColor: l.color }}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{l.layer}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: l.color + '15', color: l.color }}>{l.status}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {l.components.map((c) => (
                  <span key={c} className="text-[9px] px-2 py-0.5 rounded-full bg-[#f7f6f3] dark:bg-zinc-800/40 text-muted-foreground font-medium">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          Architecture is conceptual. &quot;Production&quot; = live, battle-tested systems. &quot;Partial&quot; = working implementations with limitations. &quot;Experimental&quot; = governance models still being validated.
        </p>
      </div>
    </figure>
  );
}

/* ─── Alignment Framework Comparison ─── */
export function AlignmentFrameworkChart() {
  const frameworks = [
    { name: 'Utilitarian', principle: 'Maximize aggregate welfare', godProtocol: 'Calculates optimal outcome for the greatest number', risk: 'Sacrifices minorities for majority benefit', color: 'hsl(210 90% 40%)' },
    { name: 'Deontological', principle: 'Follow universal rules', godProtocol: 'Enforces inviolable rights regardless of outcome', risk: 'Rule rigidity in novel situations', color: 'hsl(160 80% 35%)' },
    { name: 'Virtue Ethics', principle: 'Cultivate character traits', godProtocol: 'Models behavior on exemplary agents', risk: 'Whose "virtues" are selected?', color: 'hsl(280 60% 45%)' },
    { name: 'Care Ethics', principle: 'Prioritize relationships and context', godProtocol: 'Weighs relational impact of decisions', risk: 'Bias toward in-group over fairness', color: 'hsl(350 70% 45%)' },
    { name: 'Contractualist', principle: 'Rules no one could reasonably reject', godProtocol: 'Seeks unanimous reasonable consent', risk: 'Computationally intractable at scale', color: 'hsl(30 80% 50%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Alignment Problem as Ethics Selection</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Each framework produces a different &quot;God&quot;</p>

        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            <div className="grid grid-cols-[100px_1fr_1fr_1fr] gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Framework</span>
              <span className="text-[10px] font-bold uppercase text-muted-foreground text-center">Principle</span>
              <span className="text-[10px] font-bold uppercase text-center" style={{ color: 'hsl(280 60% 45%)' }}>God Protocol Behavior</span>
              <span className="text-[10px] font-bold uppercase text-muted-foreground text-center">Risk</span>
            </div>
            {frameworks.map((f) => (
              <div key={f.name} className="grid grid-cols-[100px_1fr_1fr_1fr] gap-2 border-t border-[#e3e3e0] dark:border-zinc-800 py-2 items-center">
                <span className="text-[11px] font-bold" style={{ color: f.color }}>{f.name}</span>
                <span className="text-[10px] text-muted-foreground text-center">{f.principle}</span>
                <span className="text-[10px] text-center px-2 py-1 rounded-md" style={{ backgroundColor: f.color + '08' }}>{f.godProtocol}</span>
                <span className="text-[10px] text-muted-foreground text-center italic">{f.risk}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          Framework analysis based on standard moral philosophy taxonomy. The alignment choice is a moral decision being treated as an engineering parameter.
        </p>
      </div>
    </figure>
  );
}

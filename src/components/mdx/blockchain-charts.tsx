'use client';

import React from 'react';

/* ─── Blockchain Ecosystem Snapshot ─── */
export function BlockchainSnapshot() {
  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Blockchain Ecosystem (March 2026)</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Key metrics across the major verticals</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4">
            <div className="text-2xl font-bold text-primary">$315B</div>
            <div className="text-xs text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1">Stablecoin market cap</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">All-time high, USDT 58% share</div>
          </div>
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4">
            <div className="text-2xl font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">$93B</div>
            <div className="text-xs text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1">DeFi TVL</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Down from $180B peak</div>
          </div>
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4">
            <div className="text-2xl font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">$85.8B</div>
            <div className="text-xs text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1">Bitcoin ETF AUM (US)</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">1.28M BTC held, IBIT leads at $52B</div>
          </div>
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4">
            <div className="text-2xl font-bold text-primary">$24-26B</div>
            <div className="text-xs text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1">Tokenized RWAs on-chain</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Treasuries &gt;$11B, excluding stables</div>
          </div>
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4">
            <div className="text-2xl font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">$40-72B</div>
            <div className="text-xs text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1">Blockchain tech market (2026)</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Hardware, software, services</div>
          </div>
          <div className="rounded-[3px] border border-primary/30 bg-primary/5 p-4">
            <div className="text-2xl font-bold text-primary">$10-16T</div>
            <div className="text-xs text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1">RWA forecast by 2030</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">BCG, Standard Chartered est.</div>
          </div>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: DefiLlama, CoinGecko, Bitbo (ETF tracker), DLNews, BCG, Fortune Business Insights. As of March 31, 2026.
        </p>
      </div>
    </figure>
  );
}

/* ─── Evolution Phases Timeline ─── */
export function BlockchainPhases() {
  const phases = [
    { era: '2009-2013', label: 'Cryptocurrency', tech: 'Bitcoin, PoW', achievement: 'Solved double-spending without intermediary', status: 'mature' },
    { era: '2014-2017', label: 'Programmable', tech: 'Ethereum, smart contracts', achievement: 'Distributed state machine, ICO funding', status: 'mature' },
    { era: '2018-2020', label: 'Infrastructure', tech: 'L2s, PoS, rollups', achievement: 'Scalability solutions, The Merge', status: 'mature' },
    { era: '2020-2023', label: 'DeFi + NFTs', tech: 'AMMs, lending, digital ownership', achievement: 'Product-market fit beyond payments', status: 'mature' },
    { era: '2024-2026', label: 'Institutional', tech: 'ETFs, RWA tokenization, stablecoins', achievement: 'TradFi integration, regulatory clarity', status: 'active' },
  ];

  const statusColor: Record<string, string> = {
    'mature': 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30',
    'active': 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
  };

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Five Phases of Blockchain</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">From cryptocurrency experiment to institutional infrastructure</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Era</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Phase</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Key achievement</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {phases.map((p) => (
                <tr key={p.era} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 text-primary font-semibold">{p.era}</td>
                  <td className="py-2.5 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{p.label}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)]">{p.achievement}</td>
                  <td className="py-2.5 px-2"><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${statusColor[p.status]}`}>{p.status === 'active' ? 'Active' : 'Mature'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}

/* ─── Layer 2 Scaling Landscape ─── */
export function L2ScalingLandscape() {
  const l2s = [
    { name: 'Base', type: 'Optimistic', tvl: '~$5B', focus: 'Consumer apps, social, Coinbase ecosystem', share: '60%+', status: 'dominant' },
    { name: 'Arbitrum', type: 'Optimistic', tvl: '~$18B', focus: 'Institutional DeFi, highest TVL', share: '~20%', status: 'leading' },
    { name: 'Optimism', type: 'Optimistic', tvl: '~$6-8B', focus: 'Superchain vision, interconnected rollups', share: '~10%', status: 'growing' },
    { name: 'Others', type: 'Various', tvl: 'Declining', focus: 'Long tail of smaller rollups losing activity', share: '~10%', status: 'consolidating' },
  ];

  const statusColor: Record<string, string> = {
    'dominant': 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
    'leading': 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30',
    'growing': 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30',
    'consolidating': 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30',
  };

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Layer 2 Scaling Landscape</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">The three-horse race (early 2026), combined ~2M transactions/day</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[520px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Network</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">TVL</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Tx share</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Focus</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {l2s.map((l) => (
                <tr key={l.name} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{l.name}</td>
                  <td className="py-2.5 px-2 text-primary font-semibold">{l.tvl}</td>
                  <td className="py-2.5 px-2 font-medium">{l.share}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/70 dark:text-[rgba(255,255,255,0.55)]">{l.focus}</td>
                  <td className="py-2.5 px-2"><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${statusColor[l.status]}`}>{l.status.charAt(0).toUpperCase() + l.status.slice(1)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: L2Beat, DefiLlama, BlockEden. Top 3 L2s control ~90% of transaction volume. TVL figures approximate, Q1 2026.
        </p>
      </div>
    </figure>
  );
}

/* ─── Stablecoin Regulatory Framework ─── */
export function StablecoinRegulatory() {
  const frameworks = [
    { jurisdiction: 'United States', framework: 'GENIUS Act', status: 'Signed July 2025', requirement: '1:1 reserves in high-quality liquid assets, banking-equivalent oversight', effective: 'Full effect early 2027' },
    { jurisdiction: 'European Union', framework: 'MiCA', status: 'In force Dec 2024', requirement: 'Full authorization of issuers, reserve transparency mandates', effective: 'Compliance deadline July 2026' },
    { jurisdiction: 'Singapore', framework: 'MAS framework', status: 'Active', requirement: 'Reserve requirements, licensing for stablecoin issuers', effective: 'Ongoing' },
    { jurisdiction: 'UAE', framework: 'CBUAE regulation', status: 'Active', requirement: 'AED-backed stablecoins, central bank oversight', effective: 'Ongoing' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Stablecoin Regulatory Landscape</h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">Major frameworks shaping the $315B stablecoin market</p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[520px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0] dark:border-zinc-700">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Jurisdiction</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Framework</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Key requirement</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">Timeline</th>
              </tr>
            </thead>
            <tbody>
              {frameworks.map((f) => (
                <tr key={f.jurisdiction} className="border-b border-[#e3e3e0]/60 dark:border-zinc-800/40">
                  <td className="py-2.5 px-2 font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{f.jurisdiction}</td>
                  <td className="py-2.5 px-2 text-primary font-semibold">{f.framework}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/70 dark:text-[rgba(255,255,255,0.55)]">{f.requirement}</td>
                  <td className="py-2.5 px-2"><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400">{f.effective}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: US Congress (GENIUS Act), EU Official Journal (MiCA), MAS, CBUAE. Status as of March 2026.
        </p>
      </div>
    </figure>
  );
}

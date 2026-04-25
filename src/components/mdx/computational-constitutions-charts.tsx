'use client';

import React from 'react';

/* ─── Governance Effectiveness Matrix ─── */
export function GovernanceEffectivenessChart() {
  const decisions = [
    { type: 'Parameter adjustment (rates, fees)', computational: 'Effective', human: 'Unnecessary', compPct: 95, humanPct: 20, color: 'hsl(160 80% 35%)' },
    { type: 'Treasury allocation', computational: 'Works with checks', human: 'Better for complex cases', compPct: 60, humanPct: 80, color: 'hsl(30 80% 50%)' },
    { type: 'Strategic direction', computational: 'Insufficient', human: 'Required', compPct: 20, humanPct: 90, color: 'hsl(350 70% 45%)' },
    { type: 'Dispute resolution', computational: 'Cannot assess context', human: 'Required', compPct: 10, humanPct: 95, color: 'hsl(350 70% 45%)' },
    { type: 'Emergency response', computational: 'Multi-sig works', human: 'Faster judgment', compPct: 55, humanPct: 85, color: 'hsl(30 80% 50%)' },
    { type: 'Protocol upgrades', computational: 'Good with timelocks', human: 'Adds oversight', compPct: 75, humanPct: 70, color: 'hsl(210 90% 40%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Where Computational Constitutions Work</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Effectiveness by decision type: code vs. human governance</p>

        <div className="space-y-3">
          {decisions.map((d) => (
            <div key={d.type}>
              <div className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] mb-1.5">{d.type}</div>
              <div className="space-y-1">
                <div className="grid grid-cols-[85px_1fr_30px] gap-2 items-center">
                  <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'hsl(210 90% 40%)' }}>Code</span>
                  <div className="w-full h-3 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                    <div className="h-full rounded-md" style={{ width: `${d.compPct}%`, backgroundColor: 'hsl(210 90% 40%)', opacity: 0.5 }} />
                  </div>
                  <span className="text-[9px] text-muted-foreground text-right">{d.compPct}%</span>
                </div>
                <div className="grid grid-cols-[85px_1fr_30px] gap-2 items-center">
                  <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'hsl(280 60% 45%)' }}>Human</span>
                  <div className="w-full h-3 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                    <div className="h-full rounded-md" style={{ width: `${d.humanPct}%`, backgroundColor: 'hsl(280 60% 45%)', opacity: 0.4 }} />
                  </div>
                  <span className="text-[9px] text-muted-foreground text-right">{d.humanPct}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#e3e3e0] dark:border-zinc-800">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(210 90% 40%)' }} /><span className="text-[10px] text-muted-foreground">Computational governance</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(280 60% 45%)' }} /><span className="text-[10px] text-muted-foreground">Human governance</span></div>
        </div>

        <p className="mt-2 text-[10px] text-muted-foreground/60">
          Directional assessment based on DAO operational history. Hybrid model (code + human oversight) emerging as the dominant pattern.
        </p>
      </div>
    </figure>
  );
}

/* ─── DAO Voter Participation ─── */
export function DAOVoterParticipation() {
  const daos = [
    { name: 'Uniswap', participation: 17, treasury: '$2.5B', highlight: 'UNIfication: 125M votes for, 742 against', color: 'hsl(350 70% 55%)' },
    { name: 'Aave', participation: 80, treasury: '$400M+', highlight: 'Delegate participation >80%, $50M buyback', color: 'hsl(160 80% 35%)' },
    { name: 'MakerDAO (Sky)', participation: 25, treasury: '$1B+', highlight: 'Endgame restructuring into MetaDAOs', color: 'hsl(210 90% 40%)' },
    { name: 'ENS DAO', participation: 12, treasury: '$600M+', highlight: 'Manages Ethereum Name Service governance', color: 'hsl(30 80% 50%)' },
    { name: 'Compound', participation: 15, treasury: '$150M+', highlight: 'Interest rate parameter governance', color: 'hsl(280 60% 45%)' },
    { name: 'Optimism', participation: 22, treasury: '$800M+', highlight: '21-day futarchy experiment (500K OP)', color: 'hsl(0 0% 55%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">DAO Voter Participation (2025)</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Average voter turnout across major governance DAOs</p>

        <div className="space-y-2">
          {daos.map((d) => (
            <div key={d.name} className="grid grid-cols-[90px_1fr_40px] gap-2 items-center">
              <div>
                <span className="text-[11px] font-bold" style={{ color: d.color }}>{d.name}</span>
                <span className="block text-[9px] text-muted-foreground">{d.treasury}</span>
              </div>
              <div className="w-full">
                <div className="w-full h-4 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                  <div className="h-full rounded-md flex items-center pl-1.5" style={{ width: `${d.participation}%`, backgroundColor: d.color, opacity: 0.5 }}>
                    {d.participation >= 20 && <span className="text-[8px] font-bold text-white">{d.participation}%</span>}
                  </div>
                </div>
                <span className="text-[8px] text-muted-foreground mt-0.5 block">{d.highlight}</span>
              </div>
              <span className="text-[11px] font-bold text-right" style={{ color: d.color }}>{d.participation}%</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: DeepDAO, Tally, Snapshot. Aave figure reflects delegate participation, not unique holders. Avg. across all DAOs: ~17%.
        </p>
      </div>
    </figure>
  );
}

/* ─── Voting Mechanism Innovations ─── */
export function VotingMechanismChart() {
  const mechanisms = [
    { name: 'Token-weighted (1 token = 1 vote)', advantage: 'Simple, Sybil-resistant', risk: 'Plutocratic: whales dominate', adoption: 'Default (90%+ of DAOs)', maturity: 95, color: 'hsl(0 0% 55%)' },
    { name: 'Quadratic voting', advantage: 'Reduces whale influence', risk: 'Sybil attacks (multiple wallets)', adoption: 'Gitcoin grants, CLR.fund', maturity: 55, color: 'hsl(210 90% 40%)' },
    { name: 'Conviction voting', advantage: 'Rewards sustained preference', risk: 'Slow decision-making', adoption: 'Gardens, 1Hive', maturity: 40, color: 'hsl(160 80% 35%)' },
    { name: 'Delegation', advantage: 'Expert decision-making', risk: 'Centralization to mega-delegates', adoption: 'Uniswap, Aave, ENS', maturity: 75, color: 'hsl(30 80% 50%)' },
    { name: 'Futarchy (prediction markets)', advantage: 'Outcome-based decisions', risk: 'Metric gaming, low liquidity', adoption: 'Optimism experiment (2025)', maturity: 20, color: 'hsl(280 60% 45%)' },
    { name: 'ZK private ballots', advantage: 'Prevents vote buying/coercion', risk: 'Complex implementation', adoption: 'Research, MACI', maturity: 30, color: 'hsl(350 70% 45%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Voting Mechanism Innovation</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Beyond one-token-one-vote: the governance design space</p>

        <div className="space-y-3">
          {mechanisms.map((m) => (
            <div key={m.name} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3" style={{ borderLeftWidth: '3px', borderLeftColor: m.color }}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{m.name}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: m.color + '15', color: m.color }}>{m.maturity}% mature</span>
              </div>
              <div className="w-full h-2 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden mb-1.5">
                <div className="h-full rounded-md" style={{ width: `${m.maturity}%`, backgroundColor: m.color, opacity: 0.5 }} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1 text-[9px]">
                <div><span className="text-muted-foreground">Advantage:</span> <span className="font-medium" style={{ color: m.color }}>{m.advantage}</span></div>
                <div><span className="text-muted-foreground">Risk:</span> <span className="text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{m.risk}</span></div>
                <div><span className="text-muted-foreground">Adoption:</span> <span className="text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{m.adoption}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Governance Stack Architecture ─── */
export function GovernanceStackChart() {
  const layers = [
    { name: 'Constitutional Layer', desc: 'Immutable core rules, amendment thresholds', examples: 'Cardano constitution, MakerDAO Endgame', color: 'hsl(350 70% 45%)' },
    { name: 'Proposal & Voting', desc: 'Submit, debate, and vote on changes', examples: 'Snapshot, Tally, Governor Bravo', color: 'hsl(280 60% 45%)' },
    { name: 'Timelock & Multi-sig', desc: '24-72hr delay, multi-party authorization', examples: 'OpenZeppelin TimelockController, Gnosis Safe', color: 'hsl(210 90% 40%)' },
    { name: 'Execution', desc: 'Automatic on-chain execution of passed proposals', examples: 'Ethereum smart contracts, Governor contracts', color: 'hsl(160 80% 35%)' },
    { name: 'Dispute Resolution', desc: 'Human judgment for ambiguous cases', examples: 'Kleros, Aragon Court, Celeste', color: 'hsl(30 80% 50%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Governance Stack</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Five layers of on-chain constitutional governance</p>

        <div className="space-y-2">
          {layers.map((l, i) => (
            <div key={l.name} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3" style={{ borderLeftWidth: '3px', borderLeftColor: l.color }}>
              <div className="flex items-baseline justify-between mb-0.5">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider mr-2" style={{ color: l.color }}>L{i + 1}</span>
                  <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{l.name}</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mb-1">{l.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {l.examples.split(', ').map((e) => (
                  <span key={e} className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: l.color + '10', color: l.color }}>{e}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

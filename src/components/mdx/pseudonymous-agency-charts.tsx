'use client';

import React from 'react';

/* ─── Identity Spectrum ─── */
export function IdentitySpectrumChart() {
  const spectra = [
    { type: 'Anonymity', persistence: 'None', reputation: 'Cannot accumulate', accountability: 'None', privacy: 'Maximum', barrier: 'Low', trustMech: 'None', color: 'hsl(0 0% 55%)', pct: 15 },
    { type: 'Pseudonymity', persistence: 'Persistent', reputation: 'Accumulates over time', accountability: 'Behavioral (track record)', privacy: 'Selective disclosure', barrier: 'Medium', trustMech: 'Earned through history', color: 'hsl(210 90% 40%)', pct: 65 },
    { type: 'Identity', persistence: 'Permanent', reputation: 'Full history', accountability: 'Legal (enforceable)', privacy: 'Minimal', barrier: 'High', trustMech: 'Inherited from institutions', color: 'hsl(280 60% 45%)', pct: 90 },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Identity Spectrum</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Anonymity → Pseudonymity → Identity: tradeoffs at each level</p>

        <div className="space-y-4">
          {spectra.map((s) => (
            <div key={s.type} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3" style={{ borderLeftWidth: '3px', borderLeftColor: s.color }}>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[12px] font-bold" style={{ color: s.color }}>{s.type}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: s.color + '15', color: s.color }}>Exposure: {s.pct}%</span>
              </div>
              <div className="w-full h-2 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden mb-2">
                <div className="h-full rounded-md" style={{ width: `${s.pct}%`, backgroundColor: s.color, opacity: 0.4 }} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-[9px]">
                <div><span className="text-muted-foreground">Persistence:</span> <span className="font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{s.persistence}</span></div>
                <div><span className="text-muted-foreground">Reputation:</span> <span className="font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{s.reputation}</span></div>
                <div><span className="text-muted-foreground">Accountability:</span> <span className="font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{s.accountability}</span></div>
                <div><span className="text-muted-foreground">Privacy:</span> <span className="font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{s.privacy}</span></div>
                <div><span className="text-muted-foreground">Barrier:</span> <span className="font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{s.barrier}</span></div>
                <div><span className="text-muted-foreground">Trust:</span> <span className="font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{s.trustMech}</span></div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Pseudonymity is the sweet spot: persistent identity with reputation accumulation, without full identity disclosure.
        </p>
      </div>
    </figure>
  );
}

/* ─── Pseudonymous Success Cases ─── */
export function PseudonymousSuccessCases() {
  const cases = [
    { name: 'Satoshi Nakamoto', domain: 'Protocol design', achievement: 'Built Bitcoin ($1.56T market cap)', duration: '2008–2010', status: 'Never revealed', value: 1560, color: 'hsl(30 80% 50%)' },
    { name: 'Banksy', domain: 'Art', achievement: 'Sotheby\'s auctions ($25M+ record)', duration: '1990s–present', status: 'Never confirmed', value: 25, color: 'hsl(350 70% 45%)' },
    { name: '@PlanB', domain: 'Quantitative finance', achievement: 'Stock-to-Flow model, 1.8M followers', duration: '2019–present', status: 'Revealed voluntarily', value: 0, color: 'hsl(210 90% 40%)' },
    { name: 'Bored Ape creators', domain: 'NFT / IP', achievement: '$4B+ valuation (Yuga Labs)', duration: '2021–2022', status: 'Doxxed by BuzzFeed', value: 4000, color: 'hsl(160 80% 35%)' },
    { name: 'Chef Nomi', domain: 'DeFi', achievement: 'SushiSwap ($1B+ TVL)', duration: '2020', status: 'Revealed after controversy', value: 1000, color: 'hsl(280 60% 45%)' },
    { name: 'Elena Ferrante', domain: 'Literature', achievement: 'Neapolitan Novels, global bestseller', duration: '1992–present', status: 'Never confirmed', value: 0, color: 'hsl(0 0% 55%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Pseudonymous Success Cases</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Building value without identity disclosure</p>

        <div className="space-y-2">
          {cases.map((c) => (
            <div key={c.name} className="grid grid-cols-[120px_1fr_100px] gap-2 items-center border-b border-[#e3e3e0] dark:border-zinc-800 pb-2 last:border-0">
              <div>
                <span className="text-[11px] font-bold" style={{ color: c.color }}>{c.name}</span>
                <span className="block text-[9px] text-muted-foreground">{c.domain}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{c.achievement}</span>
                <span className="block text-[9px] text-muted-foreground">{c.duration}</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold text-right" style={{ backgroundColor: c.color + '10', color: c.color }}>{c.status}</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: CoinMarketCap, Sotheby&apos;s, BuzzFeed News (Yuga Labs), DeFiLlama. Values as of April 2026.
        </p>
      </div>
    </figure>
  );
}

/* ─── Reputation Infrastructure ─── */
export function ReputationInfraChart() {
  const infra = [
    { name: 'ENS (Ethereum Name Service)', function: 'Pseudonymous identity anchor', metric: '2M+ domains registered', maturity: 85, color: 'hsl(210 90% 40%)' },
    { name: 'Human Passport (ex-Gitcoin)', function: 'Sybil-resistant personhood scoring', metric: '2M+ users, 43M+ credentials', maturity: 75, color: 'hsl(160 80% 35%)' },
    { name: 'W3C DIDs', function: 'Self-sovereign identifiers', metric: 'W3C Recommendation standard', maturity: 70, color: 'hsl(280 60% 45%)' },
    { name: 'Verifiable Credentials', function: 'Attestation without identity disclosure', metric: 'EU eIDAS 2.0 mandate (2026)', maturity: 65, color: 'hsl(30 80% 50%)' },
    { name: 'EAS (Ethereum Attestation)', function: 'On-chain attestation registry', metric: '4M+ attestations created', maturity: 60, color: 'hsl(350 70% 45%)' },
    { name: 'Worldcoin / World ID', function: 'Biometric proof of personhood', metric: '10M+ verified users', maturity: 50, color: 'hsl(0 0% 55%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Pseudonymous Reputation Infrastructure</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Building trust without revealing identity</p>

        <div className="space-y-3">
          {infra.map((i) => (
            <div key={i.name}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{i.name}</span>
                <span className="text-[10px] font-bold" style={{ color: i.color }}>{i.maturity}%</span>
              </div>
              <div className="w-full h-3 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden mb-1">
                <div className="h-full rounded-md" style={{ width: `${i.maturity}%`, backgroundColor: i.color, opacity: 0.5 }} />
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] text-muted-foreground">{i.function}</span>
                <span className="text-[9px] font-medium" style={{ color: i.color }}>{i.metric}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: ENS Labs, human.tech (2025), W3C, EU Official Journal, EAS Explorer, Worldcoin. Maturity estimates are directional.
        </p>
      </div>
    </figure>
  );
}

/* ─── Participation Expansion ─── */
export function ParticipationExpansionChart() {
  const groups = [
    { group: 'Dissidents & activists', barrier: 'Physical safety under real name', pseudonymous: 'Publish without lethal exposure', example: 'Arab Spring pseudonymous accounts', impact: 'High', color: 'hsl(350 70% 45%)' },
    { group: 'Women in tech', barrier: 'Gender bias in code review', pseudonymous: 'Contributions judged on merit only', example: 'GitHub blind review studies', impact: 'High', color: 'hsl(280 60% 45%)' },
    { group: 'Whistleblowers', barrier: 'Retaliation risk', pseudonymous: 'Evidence evaluated, not identity', example: 'SecureDrop (NYT, WaPo)', impact: 'Critical', color: 'hsl(210 90% 40%)' },
    { group: 'Career transitioners', barrier: 'Risk to current position', pseudonymous: 'Build parallel reputation safely', example: 'Tech bloggers, analysts', impact: 'Medium', color: 'hsl(160 80% 35%)' },
    { group: 'Marginalized communities', barrier: 'Discrimination based on name/origin', pseudonymous: 'Participate without demographic filtering', example: 'DeFi governance, DAOs', impact: 'High', color: 'hsl(30 80% 50%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Who Pseudonymity Unlocks</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Participation expansion for groups excluded by identity disclosure</p>

        <div className="space-y-2">
          {groups.map((g) => (
            <div key={g.group} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3" style={{ borderLeftWidth: '3px', borderLeftColor: g.color }}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{g.group}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: g.color + '15', color: g.color }}>{g.impact} impact</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1 text-[9px]">
                <div><span className="text-muted-foreground">Barrier:</span> <span className="text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{g.barrier}</span></div>
                <div><span className="text-muted-foreground">Solution:</span> <span className="font-medium" style={{ color: g.color }}>{g.pseudonymous}</span></div>
                <div><span className="text-muted-foreground">Example:</span> <span className="text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{g.example}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ─── Decentralized Identity Market ─── */
export function DecentralizedIdentityMarket() {
  const data = [
    { year: '2023', size: 1.2, color: 'hsl(210 70% 60%)' },
    { year: '2024', size: 2.0, color: 'hsl(210 80% 50%)' },
    { year: '2025', size: 3.0, color: 'hsl(210 90% 40%)' },
    { year: '2027E', size: 8.5, color: 'hsl(160 80% 35%)' },
    { year: '2030E', size: 45, color: 'hsl(160 80% 35%)' },
  ];
  const max = 45;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Decentralized Identity Market</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">From $1.2B (2023) to $45B+ projected (2030), ~50% CAGR</p>

        <div className="space-y-2">
          {data.map((d) => (
            <div key={d.year} className="grid grid-cols-[55px_1fr_55px] gap-3 items-center">
              <span className="text-[11px] font-medium text-muted-foreground text-right">{d.year}</span>
              <div className="w-full h-5 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div className="h-full rounded-md flex items-center pl-2" style={{ width: `${Math.max((d.size / max) * 100, 5)}%`, backgroundColor: d.color, opacity: 0.5 }}>
                  {d.size >= 8 && <span className="text-[9px] font-bold text-white">${d.size}B</span>}
                </div>
              </div>
              <span className="text-[11px] font-bold text-right" style={{ color: d.color }}>${d.size}B</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: GM Insights, Mordor Intelligence, Precedence Research. Market includes DID platforms, verifiable credential infrastructure, and self-sovereign identity solutions. CAGR estimates range 50-90%.
        </p>
      </div>
    </figure>
  );
}

'use client';

import React from 'react';

/* ─── Trust Primitives Comparison ─── */
export function TrustPrimitivesComparison() {
  const primitives = [
    { name: 'Zero-Knowledge Proofs', abbr: 'ZKP', trustBasis: 'Mathematics', privacy: 'Full', speed: 'Fast verify / slow prove', deployment: 'ZK rollups ($28B TVL), identity, DeFi', maturity: 85, color: 'hsl(210 90% 40%)' },
    { name: 'Trusted Execution Env.', abbr: 'TEE', trustBasis: 'Hardware', privacy: 'Hardware-enforced', speed: 'Near-native', deployment: 'Cloud, mobile, 3.5B+ Apple devices', maturity: 80, color: 'hsl(30 80% 50%)' },
    { name: 'Multi-Party Computation', abbr: 'MPC', trustBasis: 'Protocol', privacy: 'Distributed', speed: 'Slower (comms overhead)', deployment: 'Custody (Fireblocks), joint analytics', maturity: 65, color: 'hsl(160 80% 35%)' },
    { name: 'Fully Homomorphic Enc.', abbr: 'FHE', trustBasis: 'Mathematics', privacy: 'Full (compute on encrypted)', speed: 'Very slow (improving)', deployment: 'Research, early commercial (Zama)', maturity: 30, color: 'hsl(280 60% 45%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Programmable Trust Primitives</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Four cryptographic technologies replacing institutional trust</p>

        <div className="space-y-4">
          {primitives.map((p) => (
            <div key={p.abbr} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3" style={{ borderLeftWidth: '3px', borderLeftColor: p.color }}>
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{p.name}</span>
                  <span className="text-[9px] ml-1.5 px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: p.color + '15', color: p.color }}>{p.abbr}</span>
                </div>
                <span className="text-[10px] font-bold" style={{ color: p.color }}>{p.maturity}% mature</span>
              </div>
              <div className="w-full h-2.5 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden mb-2">
                <div className="h-full rounded-md" style={{ width: `${p.maturity}%`, backgroundColor: p.color, opacity: 0.5 }} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[9px]">
                <div><span className="text-muted-foreground">Trust basis:</span> <span className="font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{p.trustBasis}</span></div>
                <div><span className="text-muted-foreground">Privacy:</span> <span className="font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{p.privacy}</span></div>
                <div><span className="text-muted-foreground">Speed:</span> <span className="font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{p.speed}</span></div>
                <div><span className="text-muted-foreground">Deployed:</span> <span className="font-medium text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{p.deployment}</span></div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Maturity estimates are directional, based on production deployments and industry adoption. FHE performance improving ~10x annually.
        </p>
      </div>
    </figure>
  );
}

/* ─── DeFi Security Landscape ─── */
export function DeFiSecurityChart() {
  const years = [
    { year: '2020', losses: 0.1, color: 'hsl(160 80% 35%)' },
    { year: '2021', losses: 1.3, color: 'hsl(30 80% 50%)' },
    { year: '2022', losses: 3.8, color: 'hsl(350 70% 45%)' },
    { year: '2023', losses: 1.7, color: 'hsl(30 80% 50%)' },
    { year: '2024', losses: 2.2, color: 'hsl(350 70% 45%)' },
    { year: '2025', losses: 3.5, color: 'hsl(0 70% 50%)' },
  ];
  const max = 4;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Cost of Code-as-Trust</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Annual losses from smart contract exploits and DeFi hacks ($B)</p>

        <div className="space-y-2">
          {years.map((y) => (
            <div key={y.year} className="grid grid-cols-[45px_1fr_55px] gap-3 items-center">
              <span className="text-xs text-muted-foreground font-medium">{y.year}</span>
              <div className="w-full h-6 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div className="h-full rounded-md flex items-center pl-2" style={{ width: `${(y.losses / max) * 100}%`, backgroundColor: y.color, opacity: 0.55 }}>
                  {y.losses >= 1 && <span className="text-[9px] font-bold text-white">${y.losses}B</span>}
                </div>
              </div>
              <span className="text-xs font-bold text-right" style={{ color: y.color }}>${y.losses}B</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[3px] bg-[#f7f6f3] dark:bg-zinc-800/40 p-3">
          <p className="text-[11px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">
            <span className="font-bold">2025 breakdown:</span> Bybit supply-chain attack ($1.4B), Kelp DAO exploit, Drift Protocol hack. DeFi accounted for ~63% of all incidents. The smart contract audit market reached $1.8B.
          </p>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: SlowMist, Halborn, CryptoRank. 2025 estimates range $2.9-4B depending on methodology. Includes bridge exploits and operational security failures.
        </p>
      </div>
    </figure>
  );
}

/* ─── Trust Stack Architecture ─── */
export function TrustStackArchitecture() {
  const layers = [
    { layer: 4, name: 'Application Logic', components: ['Smart contracts', 'Identity wallets', 'DeFi protocols', 'Supply chain'], color: 'hsl(280 60% 45%)', desc: 'Inherits trust properties from lower layers' },
    { layer: 3, name: 'Protocol Coordination', components: ['MPC', 'Cross-chain bridges', 'Sequencers', 'DA layers'], color: 'hsl(160 80% 35%)', desc: 'Multi-party computation without input disclosure' },
    { layer: 2, name: 'Cryptographic Verification', components: ['ZKPs', 'zkSNARKs/STARKs', 'Digital signatures', 'FHE'], color: 'hsl(210 90% 40%)', desc: 'Mathematical proof of facts, zero data revealed' },
    { layer: 1, name: 'Hardware Trust', components: ['Intel SGX', 'AMD SEV', 'Apple Secure Enclave', 'ARM TrustZone'], color: 'hsl(30 80% 50%)', desc: 'Physical security boundary, tamper-proof enclaves' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Trust Stack</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Four layers replacing institutional verification</p>

        <div className="space-y-2">
          {layers.map((l) => (
            <div key={l.layer} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3" style={{ borderLeftWidth: '3px', borderLeftColor: l.color }}>
              <div className="flex items-baseline justify-between mb-1">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider mr-2" style={{ color: l.color }}>L{l.layer}</span>
                  <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{l.name}</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mb-1.5">{l.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {l.components.map((c) => (
                  <span key={c} className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: l.color + '10', color: l.color }}>{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Architecture is directional. Each layer adds trust guarantees. Applications at L4 inherit privacy and verification properties from all lower layers.
        </p>
      </div>
    </figure>
  );
}

/* ─── Institutional vs. Programmable Trust ─── */
export function TrustComparisonChart() {
  const dimensions = [
    { dim: 'Verification speed', institutional: 'Days to weeks', programmable: 'Milliseconds to seconds', advantage: '10,000x+', color: 'hsl(210 90% 40%)' },
    { dim: 'Data disclosed', institutional: 'Full financial/personal history', programmable: 'Zero (ZKP) to minimal', advantage: '100% reduction', color: 'hsl(160 80% 35%)' },
    { dim: 'Corruption risk', institutional: 'Human (bribery, error, bias)', programmable: 'Code (bugs, exploits)', advantage: 'Different risk profile', color: 'hsl(30 80% 50%)' },
    { dim: 'Availability', institutional: 'Business hours / jurisdiction', programmable: '24/7/365 (100% uptime)', advantage: '5-7x more hours', color: 'hsl(210 90% 40%)' },
    { dim: 'Cost per verification', institutional: '$50-5,000 (lawyer, notary)', programmable: '$0.004-0.10 (L2 tx)', advantage: '1,000-50,000x cheaper', color: 'hsl(160 80% 35%)' },
    { dim: 'Cross-border', institutional: 'Treaties, extradition, conflict of laws', programmable: 'Borderless by default', advantage: 'No jurisdictional friction', color: 'hsl(280 60% 45%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Institutional vs. Programmable Trust</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">The structural advantages of mathematical verification</p>

        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            <div className="grid grid-cols-[110px_1fr_1fr_90px] gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Dimension</span>
              <span className="text-[10px] font-bold uppercase text-muted-foreground text-center">Institutional</span>
              <span className="text-[10px] font-bold uppercase text-center" style={{ color: 'hsl(160 80% 35%)' }}>Programmable</span>
              <span className="text-[10px] font-bold uppercase text-muted-foreground text-right">Advantage</span>
            </div>
            {dimensions.map((d) => (
              <div key={d.dim} className="grid grid-cols-[110px_1fr_1fr_90px] gap-2 border-t border-[#e3e3e0] dark:border-zinc-800 py-2 items-center">
                <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{d.dim}</span>
                <span className="text-[10px] text-muted-foreground text-center bg-[#f7f6f3] dark:bg-zinc-800/40 px-2 py-1.5 rounded-md">{d.institutional}</span>
                <span className="text-[10px] text-center px-2 py-1.5 rounded-md font-medium" style={{ backgroundColor: 'hsl(160 80% 35% / 0.08)', color: 'hsl(160 80% 35%)' }}>{d.programmable}</span>
                <span className="text-[10px] font-bold text-right" style={{ color: d.color }}>{d.advantage}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          L2 transaction costs from L2Beat (late 2025). Institutional costs estimated from legal/notary fee schedules. Uptime from Ethereum 10-year track record.
        </p>
      </div>
    </figure>
  );
}

/* ─── eIDAS 2.0 & Digital Identity Timeline ─── */
export function DigitalIdentityTimeline() {
  const milestones = [
    { year: '2014', event: 'eIDAS 1.0: EU electronic identification framework', color: 'hsl(0 0% 55%)' },
    { year: '2017', event: 'W3C publishes DID Core specification (draft)', color: 'hsl(210 70% 50%)' },
    { year: '2022', event: 'W3C Verifiable Credentials v2.0 recommendation', color: 'hsl(210 90% 40%)' },
    { year: '2024', event: 'eIDAS 2.0 regulation enters into force', color: 'hsl(160 80% 35%)' },
    { year: '2026', event: 'EU Member States must provide EUDI Wallets (Dec 31)', color: 'hsl(160 80% 35%)' },
    { year: '2027', event: 'Regulated services must accept EUDI Wallets', color: 'hsl(280 60% 45%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Regulatory Path to Programmable Identity</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">EU eIDAS 2.0 mandates selective disclosure wallets for 450M citizens</p>

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
          Sources: EU Official Journal (eIDAS 2.0), W3C (VC/DID specs). EUDI Wallet supports selective disclosure (ZKP-compatible), qualified electronic signatures, and cross-border interoperability.
        </p>
      </div>
    </figure>
  );
}

/* ─── Application Domains ─── */
export function TrustApplicationDomains() {
  const domains = [
    { domain: 'Private identity (KYC)', current: 'Full document disclosure', programmable: 'ZKP: prove age/status without data', readiness: 75, color: 'hsl(210 90% 40%)' },
    { domain: 'Confidential DeFi', current: 'All transactions public', programmable: 'Aztec/Aleo: hidden amounts and parties', readiness: 55, color: 'hsl(160 80% 35%)' },
    { domain: 'Regulatory compliance', current: 'Full audit access', programmable: 'ZKP attestations: prove compliance, no data', readiness: 40, color: 'hsl(280 60% 45%)' },
    { domain: 'Supply chain audit', current: 'Supplier data exposed', programmable: 'TEE-secured audit with aggregate only', readiness: 50, color: 'hsl(30 80% 50%)' },
    { domain: 'Medical referrals', current: 'Full patient record', programmable: 'VC: prove relevant diagnosis only', readiness: 35, color: 'hsl(350 70% 45%)' },
    { domain: 'Cross-border payments', current: 'Correspondent banking ($28T)', programmable: 'Stablecoin + ZKP identity attestation', readiness: 60, color: 'hsl(210 90% 40%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Programmable Trust Application Domains</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">From data exposure to proof-based verification</p>

        <div className="space-y-3">
          {domains.map((d) => (
            <div key={d.domain}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{d.domain}</span>
                <span className="text-[10px] font-bold" style={{ color: d.color }}>{d.readiness}%</span>
              </div>
              <div className="w-full h-3 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden mb-1">
                <div className="h-full rounded-md" style={{ width: `${d.readiness}%`, backgroundColor: d.color, opacity: 0.5 }} />
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] text-muted-foreground">Now: {d.current}</span>
                <span className="text-[9px] font-medium" style={{ color: d.color }}>{d.programmable}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Readiness estimates are directional, based on production deployments and regulatory progress. Private identity is most mature due to EU eIDAS 2.0 mandate.
        </p>
      </div>
    </figure>
  );
}

'use client';

import React from 'react';

/* ─── Pillar budget allocation ─── */
export function IndiaAIPillarAllocation() {
  const pillars = [
    { name: 'Compute Capacity', cr: 4563.36, pct: 44.0, color: '#2563eb' },
    { name: 'Foundation Models', cr: 1971.37, pct: 19.0, color: '#7c3aed' },
    { name: 'Startup Financing', cr: 1942.5, pct: 18.7, color: '#0891b2' },
    { name: 'FutureSkills', cr: 882.94, pct: 8.5, color: '#059669' },
    { name: 'Application Development', cr: 689.05, pct: 6.6, color: '#d97706' },
    { name: 'Datasets Platform (AIKosh)', cr: 199.55, pct: 1.9, color: '#4f46e5' },
    { name: 'Overheads & Contingency', cr: 102.69, pct: 1.0, color: '#78716c' },
    { name: 'Safe & Trusted AI', cr: 20.46, pct: 0.2, color: '#dc2626' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">
          Where the ₹10,371.92 Cr Was Allocated
        </h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">
          IndiaAI Mission pillar outlay · five-year plan
        </p>

        <div className="space-y-3">
          {pillars.map((p) => (
            <div key={p.name} className="grid grid-cols-[1fr_auto] gap-3 items-center">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-[#37352f]">{p.name}</span>
                  <span className="text-[#37352f]/70 tabular-nums">₹{p.cr.toLocaleString('en-IN')} Cr · {p.pct}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-[#f4f4f0] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.max(p.pct, 0.8)}%`, backgroundColor: p.color, opacity: 0.65 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 text-[10px] text-muted-foreground/60">
          Source:{' '}
          <a
            href="https://www.medianama.com/wp-content/uploads/2026/04/annex_270_AU1668_ajohnN.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Rajya Sabha Unstarred Q.1668
          </a>
          , answered 13 Feb 2026 (MeitY). Percentages rounded; absolute figures sum to ₹10,371.92 Cr.
        </p>
      </div>
    </figure>
  );
}

/* ─── Funds released vs estimates ─── */
export function IndiaAIFundsReleased() {
  const rows = [
    { year: '2024-25', re: 173.0, received: 21.79, note: '12.6% of RE' },
    { year: '2025-26', re: 800.0, received: 379.15, note: '47.4% of RE (as of 9 Feb 2026)' },
    { year: '2026-27', re: 1000.0, received: 0, note: 'BE ₹1,000 Cr; none received yet in reply' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">
          Budget Estimates vs Cash Received
        </h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">
          Amount received by IndiaAI (₹ Cr) · parliamentary disclosure
        </p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[480px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0]">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider">Year</th>
                <th className="text-right py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider">RE / BE</th>
                <th className="text-right py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider">Received</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider">Gap</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.year} className="border-b border-[#e3e3e0]/60">
                  <td className="py-2.5 px-2 font-bold text-[#37352f]">{r.year}</td>
                  <td className="py-2.5 px-2 text-right tabular-nums text-[#37352f]/80">₹{r.re.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-2 text-right tabular-nums font-bold text-[#dc2626]">
                    ₹{r.received.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 px-2 text-[#37352f]/70">{r.note}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-[#e3e3e0]">
                <td className="py-2.5 px-2 font-bold text-[#37352f]">Total disclosed</td>
                <td className="py-2.5 px-2 text-right tabular-nums text-[#37352f]/80">n/a</td>
                <td className="py-2.5 px-2 text-right tabular-nums font-bold text-[#dc2626]">₹400.94</td>
                <td className="py-2.5 px-2 text-[#37352f]/70">3.9% of ₹10,371.92 Cr outlay</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          Source:{' '}
          <a
            href="https://www.medianama.com/wp-content/uploads/2026/04/annex_270_AU1668_ajohnN.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Rajya Sabha Unstarred Q.1668 annex
          </a>{' '}
          (answered 13 Feb 2026). FY25-26 figure starred as of 9 Feb 2026. Coverage:{' '}
          <a
            href="https://www.medianama.com/2026/04/223-indiaai-mission-400-crore-over-rs-10000-crore-5-year-outlay-released/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            MediaNama, 4 Apr 2026
          </a>
          .
        </p>
      </div>
    </figure>
  );
}

/* ─── Compute funnel: committed → assigned → utilised ─── */
export function IndiaAIComputeFunnel() {
  const steps = [
    { label: 'Committed by CSPs', value: '33,099', pct: 100, note: 'GPU units pledged' },
    { label: 'Assigned by IndiaAI', value: '12,638', pct: 38, note: '38% of committed' },
    { label: 'Utilised by end users', value: '7,418', pct: 22, note: '22% of committed' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">
          Compute Funnel: Committed → Assigned → Used
        </h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">
          IndiaAI Compute Portal utilisation (CSP letter reported by ET)
        </p>

        <div className="space-y-4">
          {steps.map((s) => (
            <div key={s.label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#37352f]">{s.label}</span>
                <span className="tabular-nums text-[#37352f]/80">
                  <span className="font-bold text-[#37352f]">{s.value}</span> GPUs · {s.note}
                </span>
              </div>
              <div className="h-8 rounded-[3px] bg-[#f4f4f0] overflow-hidden">
                <div
                  className="h-full flex items-center px-3 text-[11px] font-bold text-white"
                  style={{
                    width: `${s.pct}%`,
                    backgroundColor: s.pct === 100 ? '#2563eb' : s.pct >= 30 ? '#d97706' : '#dc2626',
                    opacity: 0.75,
                    minWidth: s.pct < 25 ? '4.5rem' : undefined,
                  }}
                >
                  {s.pct}%
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 text-[10px] text-muted-foreground/60">
          Figures as reported by{' '}
          <a
            href="https://economictimes.indiatimes.com/tech/artificial-intelligence/underused-gpus-raise-questions-about-indiaai-capacity-build-out/articleshow/128981840.cms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            The Economic Times
          </a>
          , citing an IndiaAI communication to empanelled cloud providers. Treat as secondary until MeitY publishes the same series in a parliamentary reply. Headline &quot;38,000+ GPUs&quot; counts onboarded capacity, not utilisation.
        </p>
      </div>
    </figure>
  );
}

/* ─── Who actually got subsidised access ─── */
export function IndiaAIUserCounts() {
  const users = [
    { group: 'Academic researchers', n: 114 },
    { group: 'Government entities', n: 58 },
    { group: 'Startups & MSMEs', n: 47 },
    { group: 'Early-stage startups', n: 36 },
    { group: 'Students', n: 32 },
    { group: 'Early-stage researchers', n: 10 },
    { group: 'IndiaAI Fellows', n: 8 },
  ];
  const max = Math.max(...users.map((u) => u.n));

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">
          Who Is Using Subsidised Compute
        </h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">
          Beneficiary counts disclosed to Parliament · as on reply date
        </p>

        <div className="space-y-2.5">
          {users.map((u) => (
            <div key={u.group} className="flex items-center gap-3">
              <div className="w-40 md:w-52 text-xs font-semibold text-[#37352f] shrink-0">{u.group}</div>
              <div className="flex-1 h-6 rounded-[2px] bg-[#f4f4f0] overflow-hidden">
                <div
                  className="h-full bg-[#2563eb]/60"
                  style={{ width: `${(u.n / max) * 100}%` }}
                />
              </div>
              <div className="w-10 text-right text-xs font-bold tabular-nums text-[#37352f]">{u.n}</div>
            </div>
          ))}
        </div>

        <p className="mt-5 text-[10px] text-muted-foreground/60">
          Source:{' '}
          <a
            href="https://www.medianama.com/wp-content/uploads/2026/04/annex_270_AU1668_ajohnN.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Rajya Sabha Unstarred Q.1668
          </a>
          . Categories are as listed by MeitY; some entities may overlap across buckets. Sum of listed rows = 305 beneficiary slots, not unique organisations.
        </p>
      </div>
    </figure>
  );
}

/* ─── Sample L1 GPU prices from PIB tender table ─── */
export function IndiaAIGPUPriceTable() {
  const rows = [
    { sku: 'NVIDIA L4 (1X)', onDemand: '45.07', month: '29.00', bidder: 'Sify / Netmagic' },
    { sku: 'Intel Gaudi 2 (1X)', onDemand: '57.60', month: '46.80', bidder: 'CyFuture' },
    { sku: 'NVIDIA L40S (1X)', onDemand: '67.50', month: '49.50', bidder: 'CyFuture' },
    { sku: 'NVIDIA A100 80GB (1X)', onDemand: '135.90', month: '89.10', bidder: 'CyFuture' },
    { sku: 'NVIDIA H200 SXM (1X)', onDemand: '140.00', month: '135.00', bidder: 'Netmagic' },
    { sku: 'NVIDIA H100 SXM (1X)', onDemand: '153.00', month: '134.10', bidder: 'CyFuture' },
    { sku: 'NVIDIA B200 SXM (1X)', onDemand: '323.00', month: '308.00', bidder: 'Yotta' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">
          L1 Bid Prices for Selected GPU SKUs
        </h3>
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest font-semibold">
          Hourly charges in ₹ · on-demand vs one-month · May 2025 PIB disclosure
        </p>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs border-collapse min-w-[520px]">
            <thead>
              <tr className="border-b-2 border-[#e3e3e0]">
                <th className="text-left py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider">SKU</th>
                <th className="text-right py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider">On-demand</th>
                <th className="text-right py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider">1-month</th>
                <th className="text-left py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider">L1 bidder</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.sku} className="border-b border-[#e3e3e0]/60">
                  <td className="py-2.5 px-2 font-bold text-[#37352f]">{r.sku}</td>
                  <td className="py-2.5 px-2 text-right tabular-nums">₹{r.onDemand}</td>
                  <td className="py-2.5 px-2 text-right tabular-nums">₹{r.month}</td>
                  <td className="py-2.5 px-2 text-[#37352f]/70">{r.bidder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-[10px] text-muted-foreground/60">
          Source:{' '}
          <a
            href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2132817"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            PIB Press Release ID 2132817
          </a>{' '}
          (30 May 2025), Table 1. The widely cited &quot;₹65/hour&quot; figure sits near entry-level SKUs (L4 / Gaudi 2 / L40S), not H100/H200 training clusters. End-user price after IndiaAI subsidy can be lower than these L1 rack rates.
        </p>
      </div>
    </figure>
  );
}

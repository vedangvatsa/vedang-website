'use client';

import React from 'react';

const ink = '#37352f';
const rule = '#d6d3d1';
const shortfall = '#9f1239';
const paper = '#ffffff';

function ChartShell({
  title,
  children,
  source,
}: {
  title: string;
  children: React.ReactNode;
  source: React.ReactNode;
}) {
  return (
    <figure
      className="not-prose my-10 w-full overflow-hidden border bg-white"
      style={{ borderColor: rule, borderRadius: 0 }}
    >
      <div className="border-b px-5 py-4 md:px-8" style={{ borderColor: rule }}>
        <h3 className="text-base md:text-lg font-semibold tracking-tight" style={{ color: ink }}>
          {title}
        </h3>
      </div>
      <div className="px-5 py-5 md:px-8 md:py-6">{children}</div>
      <div
        className="border-t px-5 py-3 md:px-8 text-[10px] leading-relaxed"
        style={{ borderColor: rule, color: `${ink}99` }}
      >
        {source}
      </div>
    </figure>
  );
}

function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-70">
      {children}
    </a>
  );
}

/* ─── Pillar allocation as ranked ledger rows ─── */
export function IndiaAIPillarAllocation() {
  const pillars = [
    { name: 'Compute Capacity', cr: 4563.36, pct: 44.0 },
    { name: 'Foundation Models', cr: 1971.37, pct: 19.0 },
    { name: 'Startup Financing', cr: 1942.5, pct: 18.7 },
    { name: 'FutureSkills', cr: 882.94, pct: 8.5 },
    { name: 'Application Development', cr: 689.05, pct: 6.6 },
    { name: 'Datasets Platform (AIKosh)', cr: 199.55, pct: 1.9 },
    { name: 'Overheads & Contingency', cr: 102.69, pct: 1.0 },
    { name: 'Safe & Trusted AI', cr: 20.46, pct: 0.2, alert: true },
  ];

  return (
    <ChartShell
      title="Pillar outlay (₹10,371.92 Cr total)"
      source={
        <>
          <SourceLink href="https://www.medianama.com/wp-content/uploads/2026/04/annex_270_AU1668_ajohnN.pdf">
            Rajya Sabha Unstarred Q.1668
          </SourceLink>
          , answered 13 Feb 2026 (MeitY). Absolute figures sum to ₹10,371.92 Cr.
        </>
      }
    >
      <div className="space-y-0">
        {pillars.map((p, i) => (
          <div
            key={p.name}
            className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)_auto] items-center gap-3 border-b py-2.5 last:border-b-0"
            style={{ borderColor: `${rule}` }}
          >
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] tabular-nums" style={{ color: `${ink}66` }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="truncate text-[13px] font-medium"
                  style={{ color: p.alert ? shortfall : ink }}
                >
                  {p.name}
                </span>
              </div>
            </div>
            <div className="h-[3px] w-full" style={{ backgroundColor: `${rule}` }}>
              <div
                className="h-full"
                style={{
                  width: `${p.pct}%`,
                  backgroundColor: p.alert ? shortfall : ink,
                  minWidth: p.pct < 1 ? '2px' : undefined,
                }}
              />
            </div>
            <div className="text-right text-[12px] tabular-nums whitespace-nowrap" style={{ color: ink }}>
              <span className="font-semibold">₹{p.cr.toLocaleString('en-IN')}</span>
              <span className="ml-2" style={{ color: `${ink}88` }}>
                {p.pct}%
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px]" style={{ color: `${ink}88` }}>
        Safe & Trusted AI (₹20.46 Cr) is smaller than overheads (₹102.69 Cr) in the same annex.
      </p>
    </ChartShell>
  );
}

/* ─── Funds. estimate bar vs cash fill ─── */
export function IndiaAIFundsReleased() {
  const rows = [
    { year: '2024-25', estimate: 173.0, received: 21.79, label: 'RE', note: '12.6% of RE' },
    { year: '2025-26', estimate: 800.0, received: 379.15, label: 'RE', note: '47.4% of RE to 9 Feb 2026' },
    { year: '2026-27', estimate: 1000.0, received: 0, label: 'BE', note: 'None received in reply' },
  ];
  const maxEst = Math.max(...rows.map((r) => r.estimate));

  return (
    <ChartShell
      title="Cash received by IndiaAI vs annual estimates"
      source={
        <>
          <SourceLink href="https://www.medianama.com/wp-content/uploads/2026/04/annex_270_AU1668_ajohnN.pdf">
            Rajya Sabha Unstarred Q.1668 annex
          </SourceLink>{' '}
          (13 Feb 2026). FY25-26 cut-off 9 Feb 2026. Coverage{' '}
          <SourceLink href="https://www.medianama.com/2026/04/223-indiaai-mission-400-crore-over-rs-10000-crore-5-year-outlay-released/">
            MediaNama, 4 Apr 2026
          </SourceLink>
          .
        </>
      }
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b pb-5" style={{ borderColor: rule }}>
        <div>
          <div className="text-[11px]" style={{ color: `${ink}88` }}>
            Total disclosed to IndiaAI
          </div>
          <div className="mt-1 text-4xl font-semibold tabular-nums tracking-tight" style={{ color: shortfall }}>
            ₹400.94 Cr
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px]" style={{ color: `${ink}88` }}>
            Share of ₹10,371.92 Cr outlay
          </div>
          <div className="mt-1 text-4xl font-semibold tabular-nums tracking-tight" style={{ color: ink }}>
            3.9%
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {rows.map((r) => {
          const estW = (r.estimate / maxEst) * 100;
          const recW = r.estimate > 0 ? (r.received / r.estimate) * estW : 0;
          return (
            <div key={r.year}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[12px]">
                <span className="font-medium" style={{ color: ink }}>
                  {r.year}{' '}
                  <span style={{ color: `${ink}77` }}>
                    ({r.label} ₹{r.estimate.toLocaleString('en-IN')} Cr)
                  </span>
                </span>
                <span className="tabular-nums font-semibold" style={{ color: shortfall }}>
                  ₹{r.received.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Cr received
                </span>
              </div>
              <div className="relative h-7 w-full" style={{ backgroundColor: `${ink}12` }}>
                <div className="absolute inset-y-0 left-0" style={{ width: `${estW}%`, backgroundColor: `${ink}18` }} />
                <div
                  className="absolute inset-y-0 left-0"
                  style={{ width: `${Math.max(recW, r.received > 0 ? 1.2 : 0)}%`, backgroundColor: shortfall }}
                />
              </div>
              <div className="mt-1 text-[10px]" style={{ color: `${ink}77` }}>
                {r.note}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex gap-5 text-[10px]" style={{ color: `${ink}88` }}>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-4" style={{ backgroundColor: `${ink}18` }} /> Estimate
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-4" style={{ backgroundColor: shortfall }} /> Received
        </span>
      </div>
    </ChartShell>
  );
}

/* ─── Compute attrition as nested blocks ─── */
export function IndiaAIComputeFunnel() {
  const steps = [
    { label: 'Committed by CSPs', value: 33099, pct: 100 },
    { label: 'Assigned by IndiaAI', value: 12638, pct: 38 },
    { label: 'Utilised by end users', value: 7418, pct: 22 },
  ];

  return (
    <ChartShell
      title="GPU attrition (committed → assigned → used)"
      source={
        <>
          Reported by{' '}
          <SourceLink href="https://economictimes.indiatimes.com/tech/artificial-intelligence/underused-gpus-raise-questions-about-indiaai-capacity-build-out/articleshow/128981840.cms">
            The Economic Times
          </SourceLink>
          , citing an IndiaAI letter to CSPs. Secondary until MeitY reprints the series. Headline
          &quot;38,000+ GPUs&quot; counts onboarded capacity, not utilisation.
        </>
      }
    >
      <div className="flex flex-col items-stretch gap-0">
        {steps.map((s, i) => (
          <div key={s.label} className="flex flex-col items-center">
            <div
              className="flex w-full items-center justify-between gap-4 px-4 py-3 md:px-6"
              style={{
                width: `${Math.max(s.pct, 28)}%`,
                backgroundColor: i === 2 ? shortfall : ink,
                color: paper,
              }}
            >
              <span className="text-[12px] font-medium">{s.label}</span>
              <span className="text-[12px] tabular-nums font-semibold whitespace-nowrap">
                {s.value.toLocaleString('en-IN')} · {s.pct}%
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="h-3 w-px" style={{ backgroundColor: rule }} />
            )}
          </div>
        ))}
      </div>
      <p className="mt-5 text-[11px]" style={{ color: `${ink}88` }}>
        22% of committed GPUs reached end-user utilisation in the reported letter.
      </p>
    </ChartShell>
  );
}

/* ─── Beneficiaries as numbered census ─── */
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
  const total = users.reduce((a, u) => a + u.n, 0);

  return (
    <ChartShell
      title="Who received subsidised compute access"
      source={
        <>
          <SourceLink href="https://www.medianama.com/wp-content/uploads/2026/04/annex_270_AU1668_ajohnN.pdf">
            Rajya Sabha Unstarred Q.1668
          </SourceLink>
          . Categories as listed by MeitY. Rows may overlap. Sum of listed slots = {total}, not unique
          organisations.
        </>
      }
    >
      <div className="mb-4 text-[11px]" style={{ color: `${ink}88` }}>
        Disclosed beneficiary slots as on the reply date. Against a public figure of 38,000+ onboarded
        GPUs.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        {users.map((u, i) => (
          <div
            key={u.group}
            className="flex items-baseline justify-between gap-4 border-b py-2.5"
            style={{ borderColor: rule }}
          >
            <span className="text-[13px]" style={{ color: ink }}>
              <span className="mr-2 tabular-nums" style={{ color: `${ink}55` }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {u.group}
            </span>
            <span className="text-[15px] font-semibold tabular-nums" style={{ color: ink }}>
              {u.n}
            </span>
          </div>
        ))}
      </div>
    </ChartShell>
  );
}

/* ─── GPU prices. highlight ₹65 band vs training SKUs ─── */
export function IndiaAIGPUPriceTable() {
  const rows = [
    { sku: 'NVIDIA L4 (1X)', onDemand: 45.07, month: 29.0, bidder: 'Sify / Netmagic', band: 'poster' as const },
    { sku: 'Intel Gaudi 2 (1X)', onDemand: 57.6, month: 46.8, bidder: 'CyFuture', band: 'poster' as const },
    { sku: 'NVIDIA L40S (1X)', onDemand: 67.5, month: 49.5, bidder: 'CyFuture', band: 'poster' as const },
    { sku: 'NVIDIA A100 80GB (1X)', onDemand: 135.9, month: 89.1, bidder: 'CyFuture', band: 'mid' as const },
    { sku: 'NVIDIA H200 SXM (1X)', onDemand: 140.0, month: 135.0, bidder: 'Netmagic', band: 'train' as const },
    { sku: 'NVIDIA H100 SXM (1X)', onDemand: 153.0, month: 134.1, bidder: 'CyFuture', band: 'train' as const },
    { sku: 'NVIDIA B200 SXM (1X)', onDemand: 323.0, month: 308.0, bidder: 'Yotta', band: 'train' as const },
  ];

  return (
    <ChartShell
      title="L1 hourly GPU prices (₹). PIB tender table"
      source={
        <>
          <SourceLink href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2132817">
            PIB Press Release ID 2132817
          </SourceLink>{' '}
          (30 May 2025), Table 1. The ₹65/hour slogan sits near entry-level SKUs. H100/H200/B200 are
          outside that band. End-user price after subsidy can be lower than these L1 rack rates.
        </>
      }
    >
      <div className="mb-4 flex flex-wrap gap-4 text-[10px]" style={{ color: `${ink}88` }}>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5" style={{ backgroundColor: `${ink}22` }} /> Near ₹65 poster
          band
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5" style={{ backgroundColor: shortfall }} /> Training-class
        </span>
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full min-w-[520px] border-collapse text-[12px]">
          <thead>
            <tr style={{ borderBottom: `1px solid ${ink}` }}>
              <th className="py-2 pr-3 text-left font-medium" style={{ color: ink }}>
                SKU
              </th>
              <th className="py-2 px-3 text-right font-medium" style={{ color: ink }}>
                On-demand
              </th>
              <th className="py-2 px-3 text-right font-medium" style={{ color: ink }}>
                1-month
              </th>
              <th className="py-2 pl-3 text-left font-medium" style={{ color: ink }}>
                L1 bidder
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.sku}
                style={{
                  borderBottom: `1px solid ${rule}`,
                  backgroundColor: r.band === 'train' ? `${shortfall}0d` : r.band === 'poster' ? `${ink}08` : paper,
                }}
              >
                <td className="py-2.5 pr-3 font-medium" style={{ color: ink }}>
                  {r.sku}
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums" style={{ color: ink }}>
                  ₹{r.onDemand.toFixed(2)}
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums font-semibold" style={{ color: ink }}>
                  ₹{r.month.toFixed(2)}
                </td>
                <td className="py-2.5 pl-3" style={{ color: `${ink}99` }}>
                  {r.bidder}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartShell>
  );
}

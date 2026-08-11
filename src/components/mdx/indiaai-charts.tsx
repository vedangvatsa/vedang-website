'use client';

import React from 'react';

const INK = '#37352f';
const SHORTFALL = 'hsl(0 70% 50%)';

function ChartFrame({
  title,
  subtitle,
  source,
  children,
}: {
  title: string;
  subtitle: string;
  source: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">{title}</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">{subtitle}</p>
        {children}
        <p className="mt-4 text-[10px] text-muted-foreground/60">{source}</p>
      </div>
    </figure>
  );
}

function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
      {children}
    </a>
  );
}

const TH = 'text-left py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider';
const TH_R = 'text-right py-2 px-2 font-bold text-[#37352f] uppercase tracking-wider';
const TD = 'py-2.5 px-2 text-[#37352f]/80';
const TD_NAME = 'py-2.5 px-2 font-bold text-[#37352f]';
const TD_R = 'py-2.5 px-2 text-right tabular-nums text-[#37352f]';

function BarRow({
  label,
  value,
  pct,
  tone = 'ink',
}: {
  label: string;
  value: string;
  pct: number;
  tone?: 'ink' | 'shortfall';
}) {
  const fill = tone === 'shortfall' ? SHORTFALL : INK;
  return (
    <div className="grid grid-cols-[minmax(0,10rem)_1fr_7rem] items-center gap-3 h-9">
      <div className="text-xs font-semibold text-[#37352f] truncate">{label}</div>
      <div className="h-2.5 w-full rounded-[3px] bg-[#f4f4f0] overflow-hidden">
        <div
          className="h-full rounded-[3px]"
          style={{ width: `${Math.min(Math.max(pct, 0.8), 100)}%`, backgroundColor: fill, opacity: 0.65 }}
        />
      </div>
      <div className="text-xs font-bold tabular-nums text-right text-[#37352f]">{value}</div>
    </div>
  );
}

export function IndiaAIFundsReleased() {
  const rows = [
    { year: '2024-25', estimate: 173, received: 21.79, share: '12.6%' },
    { year: '2025-26', estimate: 800, received: 379.15, share: '47.4%' },
    { year: '2026-27', estimate: 1000, received: 0, share: '0%' },
  ];

  return (
    <ChartFrame
      title="Cash received vs annual estimates"
      subtitle="Amount received by IndiaAI (₹ Cr) · parliamentary disclosure"
      source={
        <>
          Source{' '}
          <SourceLink href="https://www.medianama.com/wp-content/uploads/2026/04/annex_270_AU1668_ajohnN.pdf">
            Rajya Sabha Unstarred Q.1668 annex
          </SourceLink>{' '}
          (13 Feb 2026). FY 2025-26 cut-off 9 Feb 2026. Coverage{' '}
          <SourceLink href="https://www.medianama.com/2026/04/223-indiaai-mission-400-crore-over-rs-10000-crore-5-year-outlay-released/">
            MediaNama, 4 Apr 2026
          </SourceLink>
          .
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="rounded-[3px] border border-[#e3e3e0] px-4 py-4 text-center">
          <div className="text-2xl md:text-3xl font-bold tabular-nums tracking-tight" style={{ color: SHORTFALL }}>
            ₹400.94
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">Total received (₹ Cr)</div>
        </div>
        <div className="rounded-[3px] border border-[#e3e3e0] px-4 py-4 text-center">
          <div className="text-2xl md:text-3xl font-bold tabular-nums tracking-tight text-[#37352f]">3.9%</div>
          <div className="mt-1 text-[11px] text-muted-foreground">Share of ₹10,371.92 Cr outlay</div>
        </div>
      </div>

      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-xs border-collapse min-w-[520px] table-fixed">
          <thead>
            <tr className="border-b-2 border-[#e3e3e0]">
              <th className={`${TH} w-[22%]`}>Year</th>
              <th className={`${TH_R} w-[26%]`}>RE / BE</th>
              <th className={`${TH_R} w-[26%]`}>Received</th>
              <th className={`${TH_R} w-[26%]`}>Share of RE</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.year} className="border-b border-[#e3e3e0]/60">
                <td className={TD_NAME}>{r.year}</td>
                <td className={TD_R}>₹{r.estimate.toLocaleString('en-IN')}</td>
                <td className={`${TD_R} font-bold`} style={{ color: SHORTFALL }}>
                  ₹{r.received.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className={TD_R}>{r.share}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-[#e3e3e0]">
              <td className={TD_NAME}>Disclosed total</td>
              <td className={TD_R}>n/a</td>
              <td className={`${TD_R} font-bold`} style={{ color: SHORTFALL }}>
                ₹400.94
              </td>
              <td className={TD_R}>3.9% of outlay</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ChartFrame>
  );
}

export function IndiaAIPillarAllocation() {
  const pillars = [
    { name: 'Compute Capacity', cr: 4563.36, pct: 44.0 },
    { name: 'Foundation Models', cr: 1971.37, pct: 19.0 },
    { name: 'Startup Financing', cr: 1942.5, pct: 18.7 },
    { name: 'FutureSkills', cr: 882.94, pct: 8.5 },
    { name: 'Application Development', cr: 689.05, pct: 6.6 },
    { name: 'Datasets Platform', cr: 199.55, pct: 1.9 },
    { name: 'Overheads', cr: 102.69, pct: 1.0 },
    { name: 'Safe & Trusted AI', cr: 20.46, pct: 0.2, alert: true },
  ];

  return (
    <ChartFrame
      title="Where the ₹10,371.92 Cr was allocated"
      subtitle="IndiaAI Mission pillar outlay · five-year plan"
      source={
        <>
          Source{' '}
          <SourceLink href="https://www.medianama.com/wp-content/uploads/2026/04/annex_270_AU1668_ajohnN.pdf">
            Rajya Sabha Unstarred Q.1668
          </SourceLink>
          , answered 13 Feb 2026 (MeitY). Figures sum to ₹10,371.92 Cr.
        </>
      }
    >
      <div className="space-y-1">
        {pillars.map((p) => (
          <BarRow
            key={p.name}
            label={p.name}
            value={`${p.pct}%`}
            pct={p.pct}
            tone={p.alert ? 'shortfall' : 'ink'}
          />
        ))}
      </div>

      <div className="overflow-x-auto -mx-2 mt-8">
        <table className="w-full text-xs border-collapse min-w-[520px] table-fixed">
          <thead>
            <tr className="border-b-2 border-[#e3e3e0]">
              <th className={`${TH} w-[46%]`}>Pillar</th>
              <th className={`${TH_R} w-[27%]`}>Outlay (₹ Cr)</th>
              <th className={`${TH_R} w-[27%]`}>Share</th>
            </tr>
          </thead>
          <tbody>
            {pillars.map((p) => (
              <tr key={p.name} className="border-b border-[#e3e3e0]/60">
                <td className={TD_NAME}>{p.name}</td>
                <td className={TD_R}>₹{p.cr.toLocaleString('en-IN')}</td>
                <td className={TD_R}>{p.pct}%</td>
              </tr>
            ))}
            <tr className="border-t-2 border-[#e3e3e0]">
              <td className={TD_NAME}>Total</td>
              <td className={`${TD_R} font-bold`}>₹10,371.92</td>
              <td className={`${TD_R} font-bold`}>100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ChartFrame>
  );
}

export function IndiaAIComputeFunnel() {
  const steps = [
    { label: 'Committed', value: '33,099', pct: 100 },
    { label: 'Assigned', value: '12,638', pct: 38 },
    { label: 'Utilised', value: '7,418', pct: 22, alert: true },
  ];

  return (
    <ChartFrame
      title="Compute funnel"
      subtitle="Committed, assigned, and utilised GPUs · CSP letter reported by ET"
      source={
        <>
          Figures as reported by{' '}
          <SourceLink href="https://economictimes.indiatimes.com/tech/artificial-intelligence/underused-gpus-raise-questions-about-indiaai-capacity-build-out/articleshow/128981840.cms">
            The Economic Times
          </SourceLink>
          , citing an IndiaAI letter to empanelled providers. Secondary until MeitY reprints the series.
        </>
      }
    >
      <div className="space-y-1">
        {steps.map((s) => (
          <BarRow
            key={s.label}
            label={s.label}
            value={`${s.value} · ${s.pct}%`}
            pct={s.pct}
            tone={s.alert ? 'shortfall' : 'ink'}
          />
        ))}
      </div>
    </ChartFrame>
  );
}

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
  const total = users.reduce((a, u) => a + u.n, 0);

  return (
    <ChartFrame
      title="Who is using subsidised compute"
      subtitle="Beneficiary counts disclosed to Parliament · as on reply date"
      source={
        <>
          Source{' '}
          <SourceLink href="https://www.medianama.com/wp-content/uploads/2026/04/annex_270_AU1668_ajohnN.pdf">
            Rajya Sabha Unstarred Q.1668
          </SourceLink>
          . Categories as listed by MeitY. Rows may overlap. Listed slots sum to {total}.
        </>
      }
    >
      <div className="space-y-1">
        {users.map((u) => (
          <BarRow key={u.group} label={u.group} value={String(u.n)} pct={(u.n / max) * 100} />
        ))}
      </div>
    </ChartFrame>
  );
}

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
    <ChartFrame
      title="L1 bid prices for selected GPU SKUs"
      subtitle="Hourly charges in ₹ · on-demand vs one-month · May 2025 PIB disclosure"
      source={
        <>
          Source{' '}
          <SourceLink href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2132817">
            PIB Press Release ID 2132817
          </SourceLink>{' '}
          (30 May 2025), Table 1. The ₹65/hour figure sits near entry-level SKUs, not H100/H200 clusters.
        </>
      }
    >
      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-xs border-collapse min-w-[520px] table-fixed">
          <thead>
            <tr className="border-b-2 border-[#e3e3e0]">
              <th className={`${TH} w-[34%]`}>SKU</th>
              <th className={`${TH_R} w-[22%]`}>On-demand</th>
              <th className={`${TH_R} w-[22%]`}>1-month</th>
              <th className={`${TH} w-[22%]`}>L1 bidder</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.sku} className="border-b border-[#e3e3e0]/60">
                <td className={TD_NAME}>{r.sku}</td>
                <td className={TD_R}>₹{r.onDemand}</td>
                <td className={`${TD_R} font-semibold`}>₹{r.month}</td>
                <td className={TD}>{r.bidder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartFrame>
  );
}

export function IndiaAIClaimsTable() {
  const rows = [
    {
      actor: 'Cabinet / PIB',
      date: 'Mar 2024',
      claim: 'Outlay over Rs 10,300 crore. Plan for 10,000+ GPUs via PPP.',
      href: 'https://pib.gov.in/Pressreleaseshare.aspx?PRID=2012375',
      source: 'PIB 2012375',
    },
    {
      actor: 'PIB',
      date: '30 May 2025',
      claim: 'National compute crossed 34,000 GPUs (18,417 + 15,916).',
      href: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2132817',
      source: 'PIB 2132817',
    },
    {
      actor: 'PIB',
      date: '12 Oct 2025',
      claim: 'Over 38,000 GPUs onboarded. Subsidised rate of ₹65 per hour.',
      href: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2178092',
      source: 'PIB 2178092',
    },
    {
      actor: 'MeitY',
      date: '13 Feb 2026',
      claim: '₹21.79 Cr received in FY24-25. ₹379.15 Cr in FY25-26 to 9 Feb 2026.',
      href: 'https://www.medianama.com/wp-content/uploads/2026/04/annex_270_AU1668_ajohnN.pdf',
      source: 'Q.1668 annex',
    },
    {
      actor: 'MeitY',
      date: '13 Feb 2026',
      claim: 'More than 38,000 GPUs onboarded. 14 AI service providers empaneled.',
      href: 'https://www.medianama.com/wp-content/uploads/2026/04/annex_270_AU1668_ajohnN.pdf',
      source: 'Q.1668 annex',
    },
    {
      actor: 'MeitY',
      date: '13 Feb 2026',
      claim: 'Users include 114 academic researchers, 47 startups/MSMEs, 58 government entities.',
      href: 'https://www.medianama.com/wp-content/uploads/2026/04/annex_270_AU1668_ajohnN.pdf',
      source: 'Q.1668 annex',
    },
  ];

  return (
    <ChartFrame
      title="What officials said"
      subtitle="Public claims next to the parliamentary cash record"
      source={
        <>
          Primary documents linked in the Source column. Cash figures are from the{' '}
          <SourceLink href="https://www.medianama.com/wp-content/uploads/2026/04/annex_270_AU1668_ajohnN.pdf">
            13 Feb 2026 Rajya Sabha annex
          </SourceLink>
          .
        </>
      }
    >
      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-xs border-collapse min-w-[640px] table-fixed">
          <thead>
            <tr className="border-b-2 border-[#e3e3e0]">
              <th className={`${TH} w-[18%]`}>Actor</th>
              <th className={`${TH} w-[16%]`}>Date</th>
              <th className={`${TH} w-[48%]`}>Claim</th>
              <th className={`${TH} w-[18%]`}>Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.actor}-${r.date}-${r.source}-${r.claim.slice(0, 24)}`} className="border-b border-[#e3e3e0]/60 align-top">
                <td className={TD_NAME}>{r.actor}</td>
                <td className={`${TD} whitespace-nowrap`}>{r.date}</td>
                <td className={`${TD} leading-relaxed`}>{r.claim}</td>
                <td className="py-2.5 px-2">
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground text-[#37352f]"
                  >
                    {r.source}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartFrame>
  );
}

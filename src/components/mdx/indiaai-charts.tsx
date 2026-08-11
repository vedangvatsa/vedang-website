'use client';

import React from 'react';

const INK = '#37352f';
const SHORTFALL = 'hsl(0 70% 50%)';
const GRID = 'grid grid-cols-[10rem_7.5rem_minmax(0,1fr)_7.5rem] gap-x-3 items-center';

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

function Head({ cols }: { cols: [string, string, string, string] }) {
  return (
    <div className={`${GRID} min-h-11 border-b-2 border-[#e3e3e0] px-0`}>
      <div className="text-[10px] font-bold uppercase tracking-wider text-[#37352f]">{cols[0]}</div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-[#37352f] text-right">{cols[1]}</div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-[#37352f] text-right">{cols[2]}</div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-[#37352f] text-right">{cols[3]}</div>
    </div>
  );
}

function Row({
  a,
  b,
  c,
  d,
  dAlert,
  strong,
}: {
  a: React.ReactNode;
  b: React.ReactNode;
  c: React.ReactNode;
  d: React.ReactNode;
  dAlert?: boolean;
  strong?: boolean;
}) {
  return (
    <div className={`${GRID} min-h-11 border-b border-[#e3e3e0]/60`}>
      <div className={`text-xs truncate ${strong ? 'font-bold' : 'font-semibold'} text-[#37352f]`}>{a}</div>
      <div className="text-xs tabular-nums text-right text-[#37352f]">{b}</div>
      <div className="text-xs tabular-nums text-right text-[#37352f]/80">{c}</div>
      <div
        className={`text-xs tabular-nums text-right font-bold ${strong ? 'font-bold' : ''}`}
        style={{ color: dAlert ? SHORTFALL : INK }}
      >
        {d}
      </div>
    </div>
  );
}

function BarCell({ pct, tone = 'ink' }: { pct: number; tone?: 'ink' | 'shortfall' }) {
  return (
    <div className="h-2.5 w-full rounded-[3px] bg-[#f4f4f0] overflow-hidden">
      <div
        className="h-full rounded-[3px]"
        style={{
          width: `${Math.min(Math.max(pct, 0.8), 100)}%`,
          backgroundColor: tone === 'shortfall' ? SHORTFALL : INK,
          opacity: 0.65,
        }}
      />
    </div>
  );
}

function BarRow({
  label,
  mid,
  pct,
  end,
  tone = 'ink',
}: {
  label: string;
  mid: string;
  pct: number;
  end: string;
  tone?: 'ink' | 'shortfall';
}) {
  return (
    <div className={`${GRID} min-h-11 border-b border-[#e3e3e0]/60`}>
      <div className="text-xs font-semibold text-[#37352f] truncate">{label}</div>
      <div className="text-xs tabular-nums text-right text-[#37352f]">{mid}</div>
      <BarCell pct={pct} tone={tone} />
      <div className="text-xs tabular-nums text-right font-bold" style={{ color: tone === 'shortfall' ? SHORTFALL : INK }}>
        {end}
      </div>
    </div>
  );
}

export function IndiaAIFundsReleased() {
  const rows = [
    { year: '2024-25', estimate: '₹173.00', received: '₹21.79', share: '12.6%' },
    { year: '2025-26', estimate: '₹800.00', received: '₹379.15', share: '47.4%' },
    { year: '2026-27', estimate: '₹1,000.00', received: '₹0.00', share: '0%' },
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
        <div className="rounded-[3px] border border-[#e3e3e0] h-24 flex flex-col items-center justify-center text-center px-3">
          <div className="text-2xl md:text-3xl font-bold tabular-nums tracking-tight" style={{ color: SHORTFALL }}>
            ₹400.94
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">Received (₹ Cr)</div>
        </div>
        <div className="rounded-[3px] border border-[#e3e3e0] h-24 flex flex-col items-center justify-center text-center px-3">
          <div className="text-2xl md:text-3xl font-bold tabular-nums tracking-tight text-[#37352f]">3.9%</div>
          <div className="mt-1 text-[11px] text-muted-foreground">Of outlay</div>
        </div>
      </div>

      <Head cols={['Year', 'RE / BE', 'Received', 'Share']} />
      {rows.map((r) => (
        <Row key={r.year} a={r.year} b={r.estimate} c={r.received} d={r.share} dAlert />
      ))}
      <Row a="Total" b="n/a" c="₹400.94" d="3.9%" dAlert strong />
    </ChartFrame>
  );
}

export function IndiaAIPillarAllocation() {
  const pillars = [
    { name: 'Compute Capacity', cr: '₹4,563.36', pct: 44.0 },
    { name: 'Foundation Models', cr: '₹1,971.37', pct: 19.0 },
    { name: 'Startup Financing', cr: '₹1,942.50', pct: 18.7 },
    { name: 'FutureSkills', cr: '₹882.94', pct: 8.5 },
    { name: 'Applications', cr: '₹689.05', pct: 6.6 },
    { name: 'Datasets (AIKosh)', cr: '₹199.55', pct: 1.9 },
    { name: 'Overheads', cr: '₹102.69', pct: 1.0 },
    { name: 'Safe & Trusted AI', cr: '₹20.46', pct: 0.2, alert: true },
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
      <Head cols={['Pillar', 'Outlay', '', 'Share']} />
      {pillars.map((p) => (
        <BarRow
          key={p.name}
          label={p.name}
          mid={p.cr}
          pct={p.pct}
          end={`${p.pct}%`}
          tone={p.alert ? 'shortfall' : 'ink'}
        />
      ))}
      <Row a="Total" b="₹10,371.92" c="" d="100%" strong />
    </ChartFrame>
  );
}

export function IndiaAIComputeFunnel() {
  const steps = [
    { label: 'Committed', mid: '33,099', pct: 100 },
    { label: 'Assigned', mid: '12,638', pct: 38 },
    { label: 'Utilised', mid: '7,418', pct: 22, alert: true },
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
      <Head cols={['Stage', 'GPUs', '', 'Share']} />
      {steps.map((s) => (
        <BarRow
          key={s.label}
          label={s.label}
          mid={s.mid}
          pct={s.pct}
          end={`${s.pct}%`}
          tone={s.alert ? 'shortfall' : 'ink'}
        />
      ))}
    </ChartFrame>
  );
}

export function IndiaAIUserCounts() {
  const users = [
    { group: 'Researchers', n: 114 },
    { group: 'Government', n: 58 },
    { group: 'Startups & MSMEs', n: 47 },
    { group: 'Early startups', n: 36 },
    { group: 'Students', n: 32 },
    { group: 'Early researchers', n: 10 },
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
      <Head cols={['Group', 'Slots', '', 'Share']} />
      {users.map((u) => (
        <BarRow
          key={u.group}
          label={u.group}
          mid={String(u.n)}
          pct={(u.n / max) * 100}
          end={`${Math.round((u.n / total) * 100)}%`}
        />
      ))}
    </ChartFrame>
  );
}

export function IndiaAIGPUPriceTable() {
  const rows = [
    { sku: 'NVIDIA L4 (1X)', onDemand: '₹45.07', month: '₹29.00', bidder: 'Sify / Netmagic' },
    { sku: 'Intel Gaudi 2 (1X)', onDemand: '₹57.60', month: '₹46.80', bidder: 'CyFuture' },
    { sku: 'NVIDIA L40S (1X)', onDemand: '₹67.50', month: '₹49.50', bidder: 'CyFuture' },
    { sku: 'NVIDIA A100 80GB', onDemand: '₹135.90', month: '₹89.10', bidder: 'CyFuture' },
    { sku: 'NVIDIA H200 SXM', onDemand: '₹140.00', month: '₹135.00', bidder: 'Netmagic' },
    { sku: 'NVIDIA H100 SXM', onDemand: '₹153.00', month: '₹134.10', bidder: 'CyFuture' },
    { sku: 'NVIDIA B200 SXM', onDemand: '₹323.00', month: '₹308.00', bidder: 'Yotta' },
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
      <Head cols={['SKU', 'On-demand', '1-month', 'L1 bidder']} />
      {rows.map((r) => (
        <Row key={r.sku} a={r.sku} b={r.onDemand} c={r.month} d={r.bidder} />
      ))}
    </ChartFrame>
  );
}

export function IndiaAIClaimsTable() {
  const rows = [
    {
      actor: 'Cabinet / PIB',
      date: 'Mar 2024',
      claim: '₹10,300 Cr+ outlay. 10,000+ GPUs via PPP.',
      href: 'https://pib.gov.in/Pressreleaseshare.aspx?PRID=2012375',
      source: 'PIB 2012375',
    },
    {
      actor: 'PIB',
      date: '30 May 2025',
      claim: '34,333 GPUs empaneled (18,417 + 15,916).',
      href: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2132817',
      source: 'PIB 2132817',
    },
    {
      actor: 'PIB',
      date: '12 Oct 2025',
      claim: '38,000+ GPUs onboarded. ₹65 per hour.',
      href: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2178092',
      source: 'PIB 2178092',
    },
    {
      actor: 'MeitY',
      date: '13 Feb 2026',
      claim: '₹21.79 Cr then ₹379.15 Cr received.',
      href: 'https://www.medianama.com/wp-content/uploads/2026/04/annex_270_AU1668_ajohnN.pdf',
      source: 'Q.1668',
    },
    {
      actor: 'MeitY',
      date: '13 Feb 2026',
      claim: '38,000+ GPUs. 14 providers empaneled.',
      href: 'https://www.medianama.com/wp-content/uploads/2026/04/annex_270_AU1668_ajohnN.pdf',
      source: 'Q.1668',
    },
    {
      actor: 'MeitY',
      date: '13 Feb 2026',
      claim: '114 researchers, 47 startups, 58 govt.',
      href: 'https://www.medianama.com/wp-content/uploads/2026/04/annex_270_AU1668_ajohnN.pdf',
      source: 'Q.1668',
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
      <Head cols={['Actor', 'Date', 'Claim', 'Source']} />
      {rows.map((r) => (
        <div key={`${r.actor}-${r.date}-${r.claim}`} className={`${GRID} min-h-11 border-b border-[#e3e3e0]/60`}>
          <div className="text-xs font-semibold text-[#37352f] truncate">{r.actor}</div>
          <div className="text-xs tabular-nums text-right text-[#37352f]">{r.date}</div>
          <div className="text-xs text-right text-[#37352f]/80 truncate">{r.claim}</div>
          <div className="text-xs text-right font-bold text-[#37352f] truncate">
            <a href={r.href} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              {r.source}
            </a>
          </div>
        </div>
      ))}
    </ChartFrame>
  );
}

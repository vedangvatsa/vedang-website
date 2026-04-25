'use client';

import React from 'react';

/* ─── AI-Generated News Site Growth ─── */
export function AINewsSiteGrowth() {
  const data = [
    { date: 'May 2023', count: 49 },
    { date: 'Dec 2023', count: 600 },
    { date: 'Feb 2024', count: 700 },
    { date: 'Nov 2024', count: 1121 },
  ];
  const max = 1200;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">AI-Generated News Sites Tracked by NewsGuard</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Unreliable AI-Generated News Sites (UAINs) identified</p>

        <div className="space-y-3">
          {data.map((d) => (
            <div key={d.date} className="grid grid-cols-[80px_1fr_55px] gap-3 items-center">
              <span className="text-xs text-muted-foreground font-medium">{d.date}</span>
              <div className="w-full h-6 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md flex items-center pl-2"
                  style={{ width: `${(d.count / max) * 100}%`, backgroundColor: 'hsl(0 70% 50%)', opacity: 0.65 }}
                >
                  {d.count > 200 && <span className="text-[9px] font-bold text-white">{d.count.toLocaleString()}</span>}
                </div>
              </div>
              <span className="text-xs font-bold text-right text-red-600 dark:text-red-400">{d.count.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Source: NewsGuard AI-Generated News Tracking (2023-2024). Sites classified as producing content largely or entirely by AI without editorial oversight.
        </p>
      </div>
    </figure>
  );
}

/* ─── Information Spread Comparison ─── */
export function MisinfoSpreadChart() {
  const data = [
    { type: 'True information', reach: 1, speed: 1, color: 'hsl(160 80% 35%)' },
    { type: 'False information', reach: 6, speed: 6, color: 'hsl(0 70% 50%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Speed Asymmetry</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">How fast false vs. true information spreads on social media</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((d) => (
            <div key={d.type} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4 text-center" style={{ borderLeftWidth: '3px', borderLeftColor: d.color }}>
              <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: d.color }}>{d.reach}x</div>
              <div className="text-xs font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] uppercase tracking-wider">{d.type}</div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {d.type === 'True information' ? 'Baseline diffusion speed' : 'Reaches broader audiences, penetrates deeper into networks'}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[3px] bg-[#f7f6f3] dark:bg-zinc-800/40 p-3">
          <p className="text-[11px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">
            <span className="font-bold">Mechanism:</span> False claims tend to be more surprising and emotionally charged. The brain allocates attention to novel, emotionally arousing information preferentially.
          </p>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Source: Vosoughi, Roy, and Aral, "The spread of true and false news online," Science (2018). Analysis of ~126,000 stories shared by ~3 million people.
        </p>
      </div>
    </figure>
  );
}

/* ─── Media Trust Collapse Timeline ─── */
export function MediaTrustChart() {
  const data = [
    { year: '1976', trust: 72, party: 'Overall' },
    { year: '1997', trust: 53, party: 'Overall' },
    { year: '2005', trust: 50, party: 'Overall' },
    { year: '2016', trust: 32, party: 'Overall' },
    { year: '2020', trust: 40, party: 'Overall' },
    { year: '2024', trust: 31, party: 'Overall' },
    { year: '2025', trust: 28, party: 'Overall' },
  ];
  const partisan = [
    { label: 'Democrats', value: 51, color: 'hsl(210 80% 50%)' },
    { label: 'Independents', value: 27, color: 'hsl(45 80% 50%)' },
    { label: 'Republicans', value: 8, color: 'hsl(0 70% 50%)' },
  ];
  const max = 80;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Trust Collapse</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Americans who trust mass media to report "fully, accurately, and fairly"</p>

        {/* Timeline bars */}
        <div className="space-y-2 mb-6">
          {data.map((d) => (
            <div key={d.year} className="grid grid-cols-[45px_1fr_40px] gap-3 items-center">
              <span className="text-xs text-muted-foreground font-medium">{d.year}</span>
              <div className="w-full h-5 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md"
                  style={{
                    width: `${(d.trust / max) * 100}%`,
                    backgroundColor: d.trust > 50 ? 'hsl(160 60% 40%)' : d.trust > 35 ? 'hsl(45 80% 50%)' : 'hsl(0 70% 50%)',
                    opacity: 0.6,
                  }}
                />
              </div>
              <span className="text-xs font-bold text-right text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{d.trust}%</span>
            </div>
          ))}
        </div>

        {/* Partisan breakdown */}
        <div className="border-t border-[#e3e3e0] dark:border-zinc-800 pt-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-3">2025 Partisan Breakdown</p>
          <div className="grid grid-cols-3 gap-3">
            {partisan.map((p) => (
              <div key={p.label} className="text-center rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3" style={{ borderTopWidth: '3px', borderTopColor: p.color }}>
                <div className="text-2xl font-black" style={{ color: p.color }}>{p.value}%</div>
                <div className="text-[10px] font-bold text-muted-foreground mt-0.5">{p.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Source: Gallup annual "Confidence in Mass Media" tracking (1972-2025). 2025 partisan data from Gallup September survey.
        </p>
      </div>
    </figure>
  );
}

/* ─── Invisible Curation Factors ─── */
export function CurationFactorsChart() {
  const factors = [
    { factor: 'Algorithmic ranking', role: 'Amplifies emotionally charged, identity-reinforcing content', severity: 95, color: 'hsl(0 70% 50%)' },
    { factor: 'User choice', role: 'People seek confirmation; disconfirmation is cognitively effortful', severity: 80, color: 'hsl(30 80% 50%)' },
    { factor: 'Search behavior', role: 'Users phrase queries that reflect existing beliefs (PNAS, 2025)', severity: 70, color: 'hsl(30 80% 50%)' },
    { factor: 'Platform economics', role: 'Engagement-based monetization rewards division over understanding', severity: 90, color: 'hsl(0 70% 50%)' },
    { factor: 'Content velocity', role: 'False content spreads 6x faster, creating asymmetric advantage', severity: 85, color: 'hsl(350 70% 45%)' },
    { factor: 'Awareness gap', role: '74% of users don\'t notice algorithmic interventions on feeds', severity: 75, color: 'hsl(30 80% 50%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Invisible Curation</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Factors driving the plurality trap, ranked by structural impact</p>

        <div className="space-y-3">
          {factors.map((f) => (
            <div key={f.factor}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{f.factor}</span>
                <span className="text-[10px] font-bold" style={{ color: f.color }}>{f.severity}%</span>
              </div>
              <div className="w-full h-3 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden mb-1">
                <div className="h-full rounded-md" style={{ width: `${f.severity}%`, backgroundColor: f.color, opacity: 0.5 }} />
              </div>
              <span className="text-[10px] text-muted-foreground">{f.role}</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Impact ratings are directional estimates based on cited research (MIT/Science 2018, PNAS 2025, Gallup 2025). Not a precise measurement.
        </p>
      </div>
    </figure>
  );
}

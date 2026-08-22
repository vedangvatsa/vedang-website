'use client';

import React from 'react';

/* ─── Monastery Principle Chart (existing, expanded) ─── */
export function MonasteryPrincipleChart() {
  const mappings = [
    { monastic: 'Hours of silence', modern: 'Do Not Disturb / airplane mode', cognitive: 'Sustained attention', color: '#18181b' },
    { monastic: 'Lectio divina (slow reading)', modern: 'Long-form reading without hyperlinks', cognitive: 'Comprehension, synthesis', color: '#3f3f46' },
    { monastic: 'Manual labor between study', modern: 'Physical movement between deep work blocks', cognitive: 'Default-mode network activation', color: '#52525b' },
    { monastic: 'Communal meals at fixed hours', modern: 'Batched communication at fixed times', cognitive: 'Context-switch reduction', color: '#71717a' },
    { monastic: 'Cell (private workspace)', modern: 'Single-purpose device or physical workspace', cognitive: 'Environmental cue management', color: '#a1a1aa' },
  ];

  return (
    <figure className="not-prose chart-card">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">The Monastery Principle Applied to Knowledge Work</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">6th-century cognitive science, rediscovered</p>

        <div className="space-y-2">
          {mappings.map((m) => (
            <div key={m.monastic} className="rounded-[3px] border border-[#e3e3e0] p-3" style={{ borderLeftWidth: '3px', borderLeftColor: m.color }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold block mb-0.5">Monastic Practice</span>
                  <span className="text-[11px] font-bold text-[#37352f]">{m.monastic}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold block mb-0.5">Modern Equivalent</span>
                  <span className="text-[11px] font-medium" style={{ color: m.color }}>{m.modern}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold block mb-0.5">Cognitive Function Protected</span>
                  <span className="text-[11px] text-[#37352f]">{m.cognitive}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          The Benedictine Rule (6th century) is structurally identical to modern time-blocking with enforced attention hygiene.
        </p>
      </div>
    </figure>
  );
}

/* ─── Attention Span Decline ─── */
export function AttentionSpanDecline() {
  const data = [
    { year: '2004', seconds: 150, label: '2.5 min', color: '#3f3f46' },
    { year: '2008', seconds: 120, label: '2 min', color: '#3f3f46' },
    { year: '2012', seconds: 75, label: '75 sec', color: '#52525b' },
    { year: '2016', seconds: 60, label: '60 sec', color: '#52525b' },
    { year: '2020', seconds: 47, label: '47 sec', color: '#a1a1aa' },
    { year: '2024', seconds: 40, label: '40 sec', color: '#18181b' },
  ];
  const max = 150;

  return (
    <figure className="not-prose chart-card">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">The Attention Collapse</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Average sustained attention on a single screen (Dr. Gloria Mark, UC Irvine)</p>

        <div className="space-y-2">
          {data.map((d) => (
            <div key={d.year} className="grid grid-cols-[45px_1fr_55px] gap-3 items-center">
              <span className="text-[11px] font-medium text-muted-foreground text-right">{d.year}</span>
              <div className="w-full h-6 bg-[#f7f6f3] rounded-md overflow-hidden">
                <div className="h-full rounded-md flex items-center pl-2" style={{ width: `${(d.seconds / max) * 100}%`, backgroundColor: d.color, opacity: 0.5 }}>
                  {d.seconds >= 60 && <span className="text-[9px] font-bold text-white">{d.label}</span>}
                </div>
              </div>
              <span className="text-[11px] font-bold text-right" style={{ color: d.color }}>{d.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[3px] bg-[#f7f6f3] p-3">
          <p className="text-[11px] text-[#37352f]">
            <span className="font-bold">73% decline in 20 years.</span> This is measured through direct observation and screen-tracking software, not self-reported surveys. The median is even lower: 40 seconds.
          </p>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Source: Dr. Gloria Mark, <em>Attention Span</em> (2023), APA Monitor. Measured across thousands of participants over two decades.
        </p>
      </div>
    </figure>
  );
}

/* ─── Interruption Cost Calculator ─── */
export function InterruptionCostChart() {
  const scenarios = [
    { label: 'Zero notifications', notifications: 0, recoveryHrs: 0, deepWorkHrs: 5, color: '#3f3f46' },
    { label: 'Essential only (5/day)', notifications: 5, recoveryHrs: 1.9, deepWorkHrs: 3.1, color: '#18181b' },
    { label: 'Moderate (23/day)', notifications: 23, recoveryHrs: 4.4, deepWorkHrs: 0.6, color: '#52525b' },
    { label: 'US average (46/day)', notifications: 46, recoveryHrs: 8.8, deepWorkHrs: 0, color: '#a1a1aa' },
    { label: 'Heavy user (80/day)', notifications: 80, recoveryHrs: 15.3, deepWorkHrs: 0, color: '#18181b' },
  ];

  return (
    <figure className="not-prose chart-card">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">The Interruption Tax</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Each notification costs 23 minutes of recovery (Gloria Mark)</p>

        <div className="space-y-3">
          {scenarios.map((s) => (
            <div key={s.label} className="rounded-[3px] border border-[#e3e3e0] p-3" style={{ borderLeftWidth: '3px', borderLeftColor: s.color }}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-[11px] font-bold text-[#37352f]">{s.label}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: s.color + '15', color: s.color }}>{s.notifications} notifications</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground block mb-1">Recovery time lost</span>
                  <div className="w-full h-3 bg-[#f7f6f3] rounded-md overflow-hidden">
                    <div className="h-full rounded-md" style={{ width: `${Math.min((s.recoveryHrs / 16) * 100, 100)}%`, backgroundColor: s.color, opacity: 0.5 }} />
                  </div>
                  <span className="text-[10px] font-bold mt-0.5 block" style={{ color: s.color }}>{s.recoveryHrs}h</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground block mb-1">Deep work remaining</span>
                  <div className="w-full h-3 bg-[#f7f6f3] rounded-md overflow-hidden">
                    <div className="h-full rounded-md" style={{ width: `${(s.deepWorkHrs / 5) * 100}%`, backgroundColor: '#3f3f46', opacity: 0.5 }} />
                  </div>
                  <span className="text-[10px] font-bold mt-0.5 block" style={{ color: s.deepWorkHrs > 0 ? '#3f3f46' : '#18181b' }}>{s.deepWorkHrs > 0 ? `${s.deepWorkHrs}h` : 'None'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Assumes 76% response rate (industry average) and 23-minute recovery per interruption. Deep work capacity capped at 4-5 hours (Ericsson deliberate practice research).
        </p>
      </div>
    </figure>
  );
}

/* ─── Retreat Movements Timeline ─── */
export function RetreatMovementsTimeline() {
  const movements = [
    { era: '270 AD', movement: 'Desert Monasticism', trigger: 'Roman urban complexity', figure: 'Anthony the Great', practice: 'Silence, solitude, structured contemplation', color: '#52525b' },
    { era: '529 AD', movement: 'Benedictine Rule', trigger: 'Post-Roman chaos', figure: 'Benedict of Nursia', practice: 'Ora et labora: time-blocking, attention hygiene', color: '#52525b' },
    { era: '1845', movement: 'Transcendentalism', trigger: 'Industrial mechanization', figure: 'Thoreau, Emerson', practice: 'Deliberate withdrawal to nature, simplicity', color: '#3f3f46' },
    { era: '1960s', movement: 'Counterculture', trigger: 'Mass media saturation', figure: 'Ram Dass, Alan Watts', practice: 'Eastern meditation, conscious living', color: '#71717a' },
    { era: '2010s', movement: 'Digital Minimalism', trigger: 'Smartphone ubiquity', figure: 'Cal Newport', practice: 'Intentional technology use, deep work', color: '#18181b' },
    { era: '2020s', movement: 'Digital Monasticism', trigger: 'AI + infinite content', figure: 'Emerging practitioners', practice: 'Tech sabbaths, notification zero, device separation', color: '#a1a1aa' },
  ];

  return (
    <figure className="not-prose chart-card">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">The Pattern Repeats</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Every era of information excess produces structured retreat</p>

        <div className="relative">
          <div className="absolute left-[52px] top-0 bottom-0 w-px bg-[#e3e3e0]" />
          <div className="space-y-3">
            {movements.map((m) => (
              <div key={m.era} className="grid grid-cols-[42px_20px_1fr] gap-2 items-start">
                <span className="text-[10px] font-black text-right" style={{ color: m.color }}>{m.era}</span>
                <div className="flex items-center justify-center pt-0.5">
                  <div className="w-2.5 h-2.5 rounded-full border-2 bg-white" style={{ borderColor: m.color }} />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#37352f]">{m.movement}</span>
                  <span className="text-[9px] text-muted-foreground ml-1.5">({m.figure})</span>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Trigger: {m.trigger}</p>
                  <p className="text-[9px] font-medium mt-0.5" style={{ color: m.color }}>{m.practice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ─── Silence Economy ─── */
export function SilenceEconomyChart() {
  const products = [
    { name: 'Vipassana retreats (10-day)', cost: 'Free (donation)', waitlist: '3-6 months', type: 'Non-profit', color: '#3f3f46' },
    { name: 'Headspace / Calm subscriptions', cost: '$70-100/yr', users: '100M+ downloads', type: 'Consumer app', color: '#18181b' },
    { name: 'Executive digital detox retreats', cost: '$5K-15K/week', waitlist: '1-3 months', type: 'Luxury wellness', color: '#71717a' },
    { name: 'Hotel digital detox packages', cost: '$200-500/night premium', waitlist: 'On-demand', type: 'Hospitality', color: '#52525b' },
    { name: 'Corporate wellness programs', cost: '$500-2K/employee/yr', waitlist: 'Enterprise contract', type: 'B2B', color: '#a1a1aa' },
    { name: 'Light Phone / dumb phone market', cost: '$299-399', users: 'Growing niche', type: 'Hardware', color: '#a1a1aa' },
  ];

  return (
    <figure className="not-prose chart-card">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f]">The Silence Economy</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Silence as a premium product: $57B+ wellness tech market (2025)</p>

        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.name} className="rounded-[3px] border border-[#e3e3e0] p-3" style={{ borderLeftWidth: '3px', borderLeftColor: p.color }}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[11px] font-bold text-[#37352f]">{p.name}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: p.color + '15', color: p.color }}>{p.type}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[9px]">
                <div><span className="text-muted-foreground">Cost:</span> <span className="font-bold" style={{ color: p.color }}>{p.cost}</span></div>
                <div><span className="text-muted-foreground">{p.waitlist ? 'Waitlist:' : 'Users:'}</span> <span className="text-[#37352f]">{p.waitlist || p.users}</span></div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: Polaris Market Research, Precedence Research. Wellness tech market valued at $57.1B (2025), projected $200B+ by 2035.
        </p>
      </div>
    </figure>
  );
}

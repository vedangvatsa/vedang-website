'use client';

import React from 'react';

/* ─── Monastery Principle Chart ─── */
export function MonasteryPrincipleChart() {
  const mappings = [
    { monastic: 'Hours of silence', modern: 'Do Not Disturb / airplane mode', cognitive: 'Sustained attention', color: 'hsl(210 90% 40%)' },
    { monastic: 'Lectio divina (slow reading)', modern: 'Long-form reading without hyperlinks', cognitive: 'Comprehension, synthesis', color: 'hsl(160 80% 35%)' },
    { monastic: 'Manual labor between study', modern: 'Physical movement between deep work blocks', cognitive: 'Default-mode network activation', color: 'hsl(30 80% 50%)' },
    { monastic: 'Communal meals at fixed hours', modern: 'Batched communication at fixed times', cognitive: 'Context-switch reduction', color: 'hsl(280 60% 45%)' },
    { monastic: 'Cell (private workspace)', modern: 'Single-purpose device or physical workspace', cognitive: 'Environmental cue management', color: 'hsl(350 70% 45%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Monastery Principle Applied to Knowledge Work</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">6th-century cognitive science, rediscovered</p>

        <div className="space-y-2">
          {mappings.map((m) => (
            <div key={m.monastic} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3" style={{ borderLeftWidth: '3px', borderLeftColor: m.color }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold block mb-0.5">Monastic Practice</span>
                  <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{m.monastic}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold block mb-0.5">Modern Equivalent</span>
                  <span className="text-[11px] font-medium" style={{ color: m.color }}>{m.modern}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold block mb-0.5">Cognitive Function Protected</span>
                  <span className="text-[11px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{m.cognitive}</span>
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

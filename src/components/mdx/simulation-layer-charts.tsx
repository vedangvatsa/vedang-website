'use client';

import React from 'react';

/* ─── Simulation Domain Coverage ─── */
export function SimulationDomainChart() {
  const domains = [
    { name: 'Autonomous Vehicles', maturity: 95, examples: 'Waymo, Cruise, Tesla', color: 'hsl(210 90% 40%)' },
    { name: 'Drug Discovery', maturity: 75, examples: 'AlphaFold, Insilico Medicine', color: 'hsl(160 80% 35%)' },
    { name: 'Manufacturing', maturity: 85, examples: 'Boeing, Siemens, Foxconn', color: 'hsl(280 60% 45%)' },
    { name: 'Climate Science', maturity: 70, examples: 'CMIP6, GenCast, ECMWF', color: 'hsl(30 80% 50%)' },
    { name: 'Robotics Training', maturity: 80, examples: 'NVIDIA Isaac, MuJoCo', color: 'hsl(350 70% 45%)' },
    { name: 'Urban Planning', maturity: 50, examples: 'City-scale traffic, energy grids', color: 'hsl(190 70% 40%)' },
    { name: 'Military/Defense', maturity: 90, examples: 'Wargaming, battlefield sim', color: 'hsl(0 0% 50%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Simulation Maturity by Domain</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">How deeply simulation has penetrated each industry (illustrative)</p>

        <div className="space-y-3">
          {domains.map((d) => (
            <div key={d.name}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{d.name}</span>
                <span className="text-[10px] text-muted-foreground">{d.examples}</span>
              </div>
              <div className="w-full h-4 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md flex items-center justify-end pr-2"
                  style={{ width: `${d.maturity}%`, backgroundColor: d.color, opacity: 0.55 }}
                >
                  <span className="text-[9px] font-bold text-white">{d.maturity}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Maturity estimates are directional, based on industry adoption reports and analyst coverage. Not a precise measurement.
        </p>
      </div>
    </figure>
  );
}

/* ─── Simulation vs Physical Cost Comparison ─── */
export function SimCostComparison() {
  const data = [
    { activity: 'One test mile (AV)', physical: '$2-5', simulated: '~$0.001', ratio: '2,000-5,000x', color: 'hsl(210 90% 40%)' },
    { activity: 'One protein structure', physical: '$100-500K', simulated: 'Minutes of compute', ratio: '100,000x+', color: 'hsl(160 80% 35%)' },
    { activity: 'One labeled image', physical: '$1-5', simulated: '~$0.001', ratio: '1,000-5,000x', color: 'hsl(280 60% 45%)' },
    { activity: 'Factory commissioning', physical: '$50M+ rework', simulated: 'Software license', ratio: '500x+', color: 'hsl(30 80% 50%)' },
    { activity: 'Drug candidate screen', physical: '$2.6B to market', simulated: '$10-100K', ratio: '26,000x+', color: 'hsl(350 70% 45%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Cost Collapse</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Physical vs. simulated cost per unit of work</p>

        <div className="overflow-x-auto">
          <div className="min-w-[480px]">
            <div className="grid grid-cols-[140px_1fr_1fr_80px] gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Activity</span>
              <span className="text-[10px] font-bold uppercase text-muted-foreground text-center">Physical Cost</span>
              <span className="text-[10px] font-bold uppercase text-center" style={{ color: 'hsl(160 80% 35%)' }}>Simulation Cost</span>
              <span className="text-[10px] font-bold uppercase text-muted-foreground text-right">Ratio</span>
            </div>
            {data.map((d) => (
              <div key={d.activity} className="grid grid-cols-[140px_1fr_1fr_80px] gap-2 border-t border-[#e3e3e0] dark:border-zinc-800 py-2 items-center">
                <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{d.activity}</span>
                <span className="text-[11px] text-muted-foreground text-center bg-[#f7f6f3] dark:bg-zinc-800/40 px-2 py-1 rounded-md">{d.physical}</span>
                <span className="text-[11px] text-center px-2 py-1 rounded-md font-medium" style={{ backgroundColor: d.color + '10', color: d.color }}>{d.simulated}</span>
                <span className="text-[11px] font-bold text-right" style={{ color: d.color }}>{d.ratio}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: Tufts CSDD (drug costs), Waymo (AV miles), DeepMind/EMBL (AlphaFold), Boeing/Siemens (manufacturing), Scale AI (labeled data).
        </p>
      </div>
    </figure>
  );
}

/* ─── Simulation Gap: Haves vs Have-Nots ─── */
export function SimulationGapChart() {
  const haves = [
    { entity: 'Google DeepMind', capability: 'AlphaFold, GenCast, Gemini', access: 'Exascale GPU clusters' },
    { entity: 'Boeing / Airbus', capability: 'Full aircraft digital twins', access: 'Proprietary simulation suites' },
    { entity: 'Waymo / Tesla', capability: '20B+ simulated AV miles', access: 'Custom simulation engines' },
    { entity: 'National weather services', capability: 'CMIP6, 25km global models', access: 'Supercomputer allocations' },
    { entity: 'Foxconn / Siemens', capability: 'Factory-scale Omniverse twins', access: 'NVIDIA enterprise licensing' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Simulation Gap</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Entities with state-of-the-art simulation capabilities</p>

        <div className="space-y-2">
          {haves.map((h) => (
            <div key={h.entity} className="grid grid-cols-[140px_1fr_1fr] gap-2 items-center border-l-[3px] border-l-primary pl-3 py-2 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-r-md">
              <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{h.entity}</span>
              <span className="text-[11px] text-muted-foreground">{h.capability}</span>
              <span className="text-[10px] text-muted-foreground/70 italic">{h.access}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[3px] bg-[#f7f6f3] dark:bg-zinc-800/40 p-3 border-l-[3px] border-l-amber-500">
          <p className="text-[11px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">
            <span className="font-bold">Democratization in progress:</span> MuJoCo (open-sourced by DeepMind, 2022), AWS IoT TwinMaker, Azure Digital Twins, and NVIDIA Isaac Sim are reducing barriers, but state-of-the-art simulation remains concentrated.
          </p>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Capability assessments based on public reporting (2024-2025). "Access" column reflects resource requirements, not availability.
        </p>
      </div>
    </figure>
  );
}

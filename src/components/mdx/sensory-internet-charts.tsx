'use client';

import React from 'react';

/* ─── Sensory Bandwidth Distribution ─── */
export function SensoryBandwidthChart() {
  const senses = [
    { name: 'Vision', bps: 10000000, pct: 90.9, covered: true, color: 'hsl(210 90% 40%)' },
    { name: 'Touch', bps: 1000000, pct: 9.1, covered: false, color: 'hsl(350 70% 45%)' },
    { name: 'Hearing', bps: 100000, pct: 0.9, covered: true, color: 'hsl(160 80% 35%)' },
    { name: 'Smell', bps: 10000, pct: 0.09, covered: false, color: 'hsl(30 80% 50%)' },
    { name: 'Taste', bps: 1000, pct: 0.01, covered: false, color: 'hsl(280 60% 45%)' },
  ];
  const max = 10000000;

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Human Sensory Bandwidth</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">~11 million bits per second across all channels</p>

        <div className="space-y-3">
          {senses.map((s) => (
            <div key={s.name} className="grid grid-cols-[70px_1fr_90px] gap-3 items-center">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.covered ? 'hsl(160 80% 35%)' : 'hsl(0 70% 50%)' }} />
                <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{s.name}</span>
              </div>
              <div className="w-full h-5 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md"
                  style={{ width: `${Math.max((Math.log10(s.bps) / Math.log10(max)) * 100, 8)}%`, backgroundColor: s.color, opacity: 0.55 }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground text-right">{s.bps >= 1000000 ? `${(s.bps/1000000).toFixed(0)}M bps` : s.bps >= 1000 ? `${(s.bps/1000).toFixed(0)}K bps` : `${s.bps} bps`}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#e3e3e0] dark:border-zinc-800">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[hsl(160_80%_35%)]" /><span className="text-[10px] text-muted-foreground">Covered by current internet</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[hsl(0_70%_50%)]" /><span className="text-[10px] text-muted-foreground">Not covered</span></div>
        </div>

        <p className="mt-2 text-[10px] text-muted-foreground/60">
          Bandwidth estimates from neuroscience literature. Logarithmic scale. Vision dominates at ~91% of total sensory throughput.
        </p>
      </div>
    </figure>
  );
}

/* ─── Haptic Technology Generations ─── */
export function HapticGenerationsChart() {
  const gens = [
    { gen: 'Gen 1', name: 'Vibration (ERM)', era: '1990s-present', fidelity: 'Binary on/off', examples: 'Phone vibration, basic game rumble', color: 'hsl(0 0% 55%)', width: 20 },
    { gen: 'Gen 2', name: 'Linear Actuators (LRA)', era: '2015-present', fidelity: 'Variable intensity, waveform', examples: 'Apple Taptic Engine, Sony DualSense', color: 'hsl(210 90% 40%)', width: 55 },
    { gen: 'Gen 3', name: 'Force Feedback / Surface', era: '2020s-emerging', fidelity: 'Spatial, temperature, texture', examples: 'Ultraleap, HaptX, electroactive polymers', color: 'hsl(160 80% 35%)', width: 90 },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Three Generations of Haptic Technology</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">From binary vibration to spatial force feedback</p>

        <div className="space-y-4">
          {gens.map((g) => (
            <div key={g.gen} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4" style={{ borderLeftWidth: '3px', borderLeftColor: g.color }}>
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: g.color }}>{g.gen}</span>
                  <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] ml-2">{g.name}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{g.era}</span>
              </div>
              <div className="w-full h-3 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden mb-2">
                <div className="h-full rounded-md" style={{ width: `${g.width}%`, backgroundColor: g.color, opacity: 0.5 }} />
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] text-muted-foreground">Fidelity: {g.fidelity}</span>
                <span className="text-[10px] text-muted-foreground">{g.examples}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Classification based on actuator technology and sensory fidelity. Gen 3 technologies are in early commercial/research stages.
        </p>
      </div>
    </figure>
  );
}

/* ─── Spatial Computing Adoption ─── */
export function SpatialComputingAdoption() {
  const data = [
    { product: 'Apple Vision Pro', y2024: 390, y2025: 45, price: '$3,499', color: 'hsl(0 0% 20%)' },
    { product: 'Meta Quest 3/3S', y2024: 'Dominant (60-80% share)', y2025: 'All-time highest users', price: '$299-499', color: 'hsl(210 90% 40%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Spatial Computing Hardware Adoption</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Premium vs. accessible strategies, 2024-2025</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Apple */}
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4" style={{ borderTopWidth: '3px', borderTopColor: 'hsl(0 0% 20%)' }}>
            <div className="text-xs font-bold uppercase tracking-wider text-[#37352f] dark:text-[rgba(255,255,255,0.81)] mb-3">Apple Vision Pro</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center"><span className="text-[11px] text-muted-foreground">2024 shipments</span><span className="text-lg font-black text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">390K</span></div>
              <div className="flex justify-between items-center"><span className="text-[11px] text-muted-foreground">2025 shipments</span><span className="text-lg font-black text-red-500">45K</span></div>
              <div className="flex justify-between items-center"><span className="text-[11px] text-muted-foreground">Price</span><span className="text-[11px] font-bold">$3,499</span></div>
              <div className="flex justify-between items-center"><span className="text-[11px] text-muted-foreground">Pivot</span><span className="text-[10px]">Enterprise / luxury retail</span></div>
            </div>
          </div>
          {/* Meta */}
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4" style={{ borderTopWidth: '3px', borderTopColor: 'hsl(210 90% 40%)' }}>
            <div className="text-xs font-bold uppercase tracking-wider text-[#37352f] dark:text-[rgba(255,255,255,0.81)] mb-3">Meta Quest 3 / 3S</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center"><span className="text-[11px] text-muted-foreground">Market share</span><span className="text-lg font-black" style={{ color: 'hsl(210 90% 40%)' }}>60-80%</span></div>
              <div className="flex justify-between items-center"><span className="text-[11px] text-muted-foreground">2025 users</span><span className="text-[11px] font-bold text-green-600">All-time record</span></div>
              <div className="flex justify-between items-center"><span className="text-[11px] text-muted-foreground">Price</span><span className="text-[11px] font-bold">$299-499</span></div>
              <div className="flex justify-between items-center"><span className="text-[11px] text-muted-foreground">$1M+ apps</span><span className="text-[11px] font-bold">100+ titles</span></div>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: IDC (Vision Pro shipments), UploadVR/Meta (Quest metrics). Spatial computing market valued at ~$149-182B (2024), projected to exceed $800B by 2032.
        </p>
      </div>
    </figure>
  );
}

/* ─── BCI Competitive Landscape ─── */
export function BCILandscapeChart() {
  const players = [
    { name: 'Neuralink', approach: 'Invasive (motor cortex)', electrodes: '~1,024', status: 'Human trials (PRIME)', valuation: '$9-10B', color: 'hsl(350 70% 45%)' },
    { name: 'Synchron', approach: 'Endovascular (minimally invasive)', electrodes: '~16', status: 'Human trials', valuation: 'Private', color: 'hsl(210 90% 40%)' },
    { name: 'Precision Neuro', approach: 'Cortical surface', electrodes: '~1,024+', status: 'Human trials', valuation: 'Private', color: 'hsl(160 80% 35%)' },
    { name: 'Paradromics', approach: 'Invasive (cortical)', electrodes: '~1,600+', status: 'Pre-clinical', valuation: 'Private', color: 'hsl(280 60% 45%)' },
    { name: 'Emotiv / Muse', approach: 'Non-invasive (EEG)', electrodes: '5-32', status: 'Consumer available', valuation: 'Various', color: 'hsl(30 80% 50%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Brain-Computer Interface Landscape</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">$2.3-3B market (2025), projected $13-15B by 2035</p>

        <div className="space-y-2">
          {players.map((p) => (
            <div key={p.name} className="grid grid-cols-[100px_1fr_75px_90px] gap-2 items-center border-l-[3px] pl-3 py-2" style={{ borderLeftColor: p.color }}>
              <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{p.name}</span>
              <span className="text-[10px] text-muted-foreground">{p.approach}</span>
              <span className="text-[10px] text-muted-foreground text-center">{p.electrodes}</span>
              <span className="text-[10px] font-medium text-right" style={{ color: p.color }}>{p.status}</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Sources: Company disclosures, TSG Invest (Neuralink valuation), Spherical Insights (market size). Status as of mid-2025.
        </p>
      </div>
    </figure>
  );
}

/* ─── Sensory Stack Timeline ─── */
export function SensoryStackTimeline() {
  const phases = [
    { era: '1990s', label: 'Text Internet', channels: ['Vision (text)'], color: 'hsl(0 0% 55%)' },
    { era: '2000s', label: 'Rich Media', channels: ['Vision (images, video)', 'Audio (streaming)'], color: 'hsl(210 70% 50%)' },
    { era: '2020s', label: 'Spatial Era', channels: ['Vision (3D, spatial)', 'Audio (spatial)', 'Haptics (vibration, LRA)'], color: 'hsl(210 90% 40%)' },
    { era: '2030s', label: 'Sensory Internet', channels: ['Vision (AR glasses)', 'Audio (neural)', 'Haptics (force feedback)', 'Proprioception'], color: 'hsl(160 80% 35%)' },
    { era: '2040s+', label: 'Neural Internet', channels: ['Bidirectional BCI', 'Full sensory bypass', 'Novel modalities'], color: 'hsl(280 60% 45%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Sensory Internet Timeline</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">From text to full neural bandwidth</p>

        <div className="space-y-3">
          {phases.map((p) => (
            <div key={p.era} className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-3" style={{ borderLeftWidth: '3px', borderLeftColor: p.color }}>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-xs font-black" style={{ color: p.color }}>{p.era}</span>
                <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{p.label}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.channels.map((c) => (
                  <span key={c} className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: p.color + '10', color: p.color }}>{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Timeline is directional. Near-term projections based on current technology trajectories. Long-term projections are speculative.
        </p>
      </div>
    </figure>
  );
}

/* ─── Presence Threshold Requirements ─── */
export function PresenceThresholdChart() {
  const reqs = [
    { metric: 'Visual resolution', threshold: '60 ppd', current: '~34 ppd (Vision Pro)', pct: 57, color: 'hsl(210 90% 40%)' },
    { metric: 'Haptic latency', threshold: '<23ms', current: '10-20ms (5G)', pct: 85, color: 'hsl(160 80% 35%)' },
    { metric: 'Motion-to-photon', threshold: '<20ms', current: '~12ms (Quest 3)', pct: 100, color: 'hsl(160 80% 35%)' },
    { metric: 'Frame rate', threshold: '120 fps', current: '90-120fps (current HW)', pct: 90, color: 'hsl(160 80% 35%)' },
    { metric: 'Spatial audio', threshold: 'HRTF + tracking', current: 'Standard in XR devices', pct: 95, color: 'hsl(160 80% 35%)' },
    { metric: 'Haptic fidelity', threshold: 'Full force feedback', current: 'Vibration/LRA only', pct: 25, color: 'hsl(350 70% 45%)' },
    { metric: 'Form factor', threshold: '<100g glasses', current: '~600g headsets', pct: 15, color: 'hsl(350 70% 45%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Presence Threshold Progress</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">How close each requirement is to the perceptual threshold</p>

        <div className="space-y-2">
          {reqs.map((r) => (
            <div key={r.metric}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[11px] font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">{r.metric}</span>
                <span className="text-[10px] text-muted-foreground">Target: {r.threshold}</span>
              </div>
              <div className="w-full h-4 bg-[#f7f6f3] dark:bg-zinc-800/40 rounded-md overflow-hidden relative">
                <div
                  className="h-full rounded-md flex items-center justify-end pr-2"
                  style={{ width: `${r.pct}%`, backgroundColor: r.color, opacity: 0.5 }}
                >
                  {r.pct >= 30 && <span className="text-[9px] font-bold text-white">{r.pct}%</span>}
                </div>
                {r.pct < 30 && <span className="absolute right-2 top-0.5 text-[9px] font-bold" style={{ color: r.color }}>{r.pct}%</span>}
              </div>
              <span className="text-[9px] text-muted-foreground">{r.current}</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Progress estimates are directional, based on current hardware specifications and research benchmarks. "100%" = threshold met or exceeded.
        </p>
      </div>
    </figure>
  );
}

/* ─── Sensory Internet Stack Table ─── */
export function SensoryStackTable() {
  const layers = [
    { layer: 'Visual', current: 'Screens, Vision Pro (23 ppd)', nearTerm: 'Lightweight AR glasses (<100g)', longTerm: 'Retinal projection, neural visual', color: 'hsl(210 90% 40%)' },
    { layer: 'Audio', current: 'Speakers, spatial audio', nearTerm: 'Bone conduction, directional', longTerm: 'Neural audio bypass', color: 'hsl(160 80% 35%)' },
    { layer: 'Haptic', current: 'Vibration motors, Taptic Engine', nearTerm: 'Force feedback gloves, mid-air', longTerm: 'Full-body suits, neural touch', color: 'hsl(350 70% 45%)' },
    { layer: 'Olfactory', current: 'None commercially viable', nearTerm: 'Digital scent cartridges (niche)', longTerm: 'Neural olfactory stimulation', color: 'hsl(30 80% 50%)' },
    { layer: 'Proprioceptive', current: 'None', nearTerm: 'Motion platforms, vest feedback', longTerm: 'Neural proprioceptive input', color: 'hsl(280 60% 45%)' },
    { layer: 'Neural', current: 'Medical BCI (motor cortex)', nearTerm: 'Expanded medical, non-invasive', longTerm: 'Bidirectional high-bandwidth', color: 'hsl(0 0% 40%)' },
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Sensory Internet Stack</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Current state → near-term (2028-2030) → long-term (2035+)</p>

        <div className="overflow-x-auto">
          <div className="min-w-[520px]">
            <div className="grid grid-cols-[90px_1fr_1fr_1fr] gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Layer</span>
              <span className="text-[10px] font-bold uppercase text-muted-foreground text-center">Current (2025)</span>
              <span className="text-[10px] font-bold uppercase text-center" style={{ color: 'hsl(210 90% 40%)' }}>Near-Term</span>
              <span className="text-[10px] font-bold uppercase text-center" style={{ color: 'hsl(160 80% 35%)' }}>Long-Term</span>
            </div>
            {layers.map((l) => (
              <div key={l.layer} className="grid grid-cols-[90px_1fr_1fr_1fr] gap-2 border-t border-[#e3e3e0] dark:border-zinc-800 py-2 items-center">
                <span className="text-[11px] font-bold" style={{ color: l.color }}>{l.layer}</span>
                <span className="text-[10px] text-muted-foreground text-center bg-[#f7f6f3] dark:bg-zinc-800/40 px-2 py-1.5 rounded-md">{l.current}</span>
                <span className="text-[10px] text-center px-2 py-1.5 rounded-md" style={{ backgroundColor: 'hsl(210 90% 40% / 0.06)' }}>{l.nearTerm}</span>
                <span className="text-[10px] text-center px-2 py-1.5 rounded-md font-medium" style={{ backgroundColor: 'hsl(160 80% 35% / 0.06)', color: 'hsl(160 80% 35%)' }}>{l.longTerm}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground/60">
          Near-term projections based on current technology trajectories and announced product roadmaps. Long-term projections are speculative.
        </p>
      </div>
    </figure>
  );
}

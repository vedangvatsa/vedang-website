'use client';

import React from 'react';

export function StepwiseMaturityModel() {
  const stages = [
    { num: 1, name: 'Exploration', time: '1-3 months', impact: 'Low', desc: 'Isolated tools. Individuals using chat interfaces. No core integration.' },
    { num: 2, name: 'Active Pilot', time: '3-6 months', impact: 'Medium', desc: 'Specific tasks automated via API. Off-the-shelf bots handling narrow workflows.' },
    { num: 3, name: 'Operational', time: '6-12 months', impact: 'High', desc: 'AI integrated natively. RAG systems reading internal databases. Approvals remain manual.' },
    { num: 4, name: 'Systemic', time: '12+ months', impact: 'Transformational', desc: 'Agent-to-agent operations. Autonomous execution of core strategic functions.' }
  ];

  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">The Stepwise AI Maturity Model</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Four phases of enterprise adoption</p>

        <div className="flex flex-col gap-4">
          {stages.map((s, index) => (
            <div key={s.num} className={`p-4 rounded border ${index === 3 ? 'border-primary/50 bg-primary/5' : 'border-[#e3e3e0] dark:border-zinc-700'} relative`}>
              <div className="absolute top-4 right-4 text-[10px] font-bold px-2 py-1 bg-[#f7f6f3] dark:bg-zinc-800 text-muted-foreground rounded">
                Stage {s.num}
              </div>
              <div className="font-bold text-[#37352f] dark:text-[rgba(255,255,255,0.81)] text-base mb-1">{s.name}</div>
              <div className="text-xs text-primary font-semibold mb-2">{s.time} • {s.impact} Impact</div>
              <div className="text-xs text-[#37352f]/80 dark:text-[rgba(255,255,255,0.65)] leading-relaxed">
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

export function ROIImpactStats() {
  return (
    <figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">
      <div className="p-6 md:p-10">
        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1 text-[#37352f] dark:text-[rgba(255,255,255,0.81)]">Measured Automation ROI</h3>
        <p className="text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Data from marketing, sales, and HR initial phase pilot studies</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4">
            <div className="text-2xl font-bold text-primary">50%</div>
            <div className="text-[10px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1 uppercase">Capacity Increase</div>
            <div className="text-[10px] text-muted-foreground mt-2">Marketing reporting automation</div>
          </div>
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4">
            <div className="text-2xl font-bold text-primary">-90%</div>
            <div className="text-[10px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1 uppercase">Response Time</div>
            <div className="text-[10px] text-muted-foreground mt-2">Sales voice agent qualification</div>
          </div>
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4">
            <div className="text-2xl font-bold text-primary">300%</div>
            <div className="text-[10px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1 uppercase">Lead Conversions</div>
            <div className="text-[10px] text-muted-foreground mt-2">After business hours engagement</div>
          </div>
          <div className="rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 p-4">
            <div className="text-2xl font-bold text-primary">15 hrs</div>
            <div className="text-[10px] text-[#37352f] dark:text-[rgba(255,255,255,0.81)] font-medium mt-1 uppercase">Weekly Time Saved</div>
            <div className="text-[10px] text-muted-foreground mt-2">HR policy resolution via RAG</div>
          </div>
        </div>
      </div>
    </figure>
  );
}

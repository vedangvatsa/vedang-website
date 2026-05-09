"use client";
import React, { useState } from 'react';
export function SupplyRateVisualizer() {
  const [utilization, setUtilization] = useState(50);
  const baseRate = 2;
  const multiplier = 0.2;
  const supplyRate = baseRate + (utilization * multiplier);
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Supply Rate</h3>
        <p className="text-slate-500 mt-2">Interest earned by lenders, driven by pool utilization.</p>
      </div>
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
        <div><span className="text-sm font-semibold text-slate-700">Pool Utilization: {utilization}%</span></div>
        <input type="range" min="0" max="100" value={utilization} onChange={e => setUtilization(Number(e.target.value))} className="w-full accent-emerald-600" />
        <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
          <div className="text-sm text-emerald-600 uppercase tracking-wider font-semibold">Supply APY</div>
          <div className="text-4xl font-bold text-emerald-700 mt-2">{supplyRate.toFixed(2)}%</div>
        </div>
        <div className="bg-slate-100 rounded-xl p-4 text-center text-sm text-slate-600">
          Higher utilization means more borrowers paying interest, which increases the supply rate for lenders.
        </div>
      </div>
    </div>
  );
}
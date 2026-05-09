"use client";

import React, { useState } from 'react';

export function MevVisualizer() {
  const [step, setStep] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">MEV: Sandwich Attack</h3>
        <p className="text-slate-500 mt-2">How bots extract value from your pending transactions.</p>
      </div>
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
        <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Mempool</div>
        <div className={`p-4 rounded-xl border-2 transition-all duration-500 flex justify-between items-center ${step >= 2 ? 'border-rose-500 bg-rose-50' : 'border-transparent bg-transparent opacity-0'}`}>
          <div><div className="font-bold text-rose-600">MEV Bot: Buy (Front-run)</div><div className="text-xs text-rose-500 font-mono mt-1">High gas bribe</div></div>
          <div className="text-rose-600 font-mono font-bold">+ Profit</div>
        </div>
        <div className={`p-4 rounded-xl border-2 transition-all duration-500 flex justify-between items-center ${step === 0 ? 'border-blue-400 bg-blue-50 shadow-md' : step === 1 ? 'border-amber-400 bg-amber-50 animate-pulse' : 'border-slate-300 bg-slate-100'}`}>
          <div><div className="font-bold text-slate-700">User: Large Buy Order</div><div className="text-xs text-slate-500 font-mono mt-1">Standard gas</div></div>
          {step >= 2 && <div className="text-slate-500 font-mono text-sm">{"Worse price ↓"}</div>}
        </div>
        <div className={`p-4 rounded-xl border-2 transition-all duration-500 flex justify-between items-center ${step >= 2 ? 'border-rose-500 bg-rose-50' : 'border-transparent bg-transparent opacity-0'}`}>
          <div><div className="font-bold text-rose-600">MEV Bot: Sell (Back-run)</div></div>
          <div className="text-rose-600 font-mono font-bold">+ Profit</div>
        </div>
        <div className="mt-4 bg-slate-100 rounded-xl p-4 text-center font-mono text-sm text-slate-600 min-h-[60px] flex items-center justify-center">
          {step === 0 && "1. User submits a large buy. It sits in the public mempool."}
          {step === 1 && "2. MEV bot detects the order and calculates the price impact."}
          {step === 2 && "3. Bot front-runs (buys before user), then back-runs (sells after). Pockets the difference."}
        </div>
        <div className="flex gap-4 justify-center mt-2">
          <button onClick={() => setStep(0)} className="px-6 py-3 rounded-xl font-semibold bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 transition-all">Reset</button>
          <button onClick={() => { if (step < 2) setStep(step + 1); }} disabled={step === 2} className="px-6 py-3 rounded-xl font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-all disabled:opacity-50">{step === 0 ? "Scan Mempool" : step === 1 ? "Execute Sandwich!" : "Done"}</button>
        </div>
      </div>
    </div>
  );
}

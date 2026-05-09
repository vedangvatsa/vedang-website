"use client";

import React, { useState } from 'react';

export function AmmVisualizer() {
  const [eth, setEth] = useState(100);
  const [usdc, setUsdc] = useState(400000);
  const k = 40000000; // 100 * 400,000

  const handleSwap = () => {
    if (eth >= 250) return; // Prevent going off chart
    const ethAdded = 50;
    const newEth = eth + ethAdded;
    const newUsdc = k / newEth;
    
    setEth(newEth);
    setUsdc(newUsdc);
  };

  const resetPool = () => {
    setEth(100);
    setUsdc(400000);
  };

  // max eth we show is 300, max usdc is 1,200,000 for height scaling
  const ethHeight = `${(eth / 300) * 100}%`;
  const usdcHeight = `${(usdc / 1200000) * 100}%`;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">AMM Liquidity Pool</h3>
        <p className="text-slate-500 mt-2">Constant Product Formula (x * y = k)</p>
      </div>

      <div className="flex gap-16 p-10 bg-white rounded-2xl border border-slate-200 shadow-sm items-end justify-center w-full max-w-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="font-semibold text-slate-900">ETH Reserve (x)</div>
          <div className="w-24 h-[300px] bg-slate-100 rounded-xl flex items-end overflow-hidden relative">
            <div 
              className="w-full bg-blue-600 rounded-t-xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ height: ethHeight }}
            />
          </div>
          <div className="font-mono text-slate-500">{Math.round(eth)} ETH</div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="font-semibold text-slate-900">USDC Reserve (y)</div>
          <div className="w-24 h-[300px] bg-slate-100 rounded-xl flex items-end overflow-hidden relative">
            <div 
              className="w-full bg-emerald-500 rounded-t-xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ height: usdcHeight }}
            />
          </div>
          <div className="font-mono text-slate-500">{Math.round(usdc).toLocaleString()} USDC</div>
        </div>
      </div>

      <div className="font-mono text-xl bg-white px-6 py-3 rounded-xl border border-slate-200 shadow-sm">
        {Math.round(eth)} * {Math.round(usdc).toLocaleString()} = <span className="text-rose-600 font-bold">40,000,000 (k)</span>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={resetPool}
          className="px-6 py-3 rounded-xl font-semibold bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:-translate-y-0.5 transition-all"
        >
          Reset Pool
        </button>
        <button 
          onClick={handleSwap}
          disabled={eth >= 250}
          className="px-6 py-3 rounded-xl font-semibold bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
        >
          Swap 50 ETH for USDC
        </button>
      </div>
    </div>
  );
}

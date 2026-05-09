"use client";

import React, { useState } from 'react';

export function ImpermanentLossVisualizer() {
  const [priceRatio, setPriceRatio] = useState<number>(1); // 1 = 1x (no change), 2 = 2x, etc.

  // Initial State: 1 ETH = 2000 USDC
  const initialEthPrice = 2000;
  const initialEthQuantity = 1;
  const initialUsdcQuantity = 2000;
  
  const initialValue = (initialEthQuantity * initialEthPrice) + initialUsdcQuantity; // $4000
  
  // Calculate Current Values
  const currentEthPrice = initialEthPrice * priceRatio;
  
  // If holding (HODL):
  const hodlValue = (initialEthQuantity * currentEthPrice) + initialUsdcQuantity;
  
  // If in Liquidity Pool:
  // k = x * y = 1 * 2000 = 2000
  // price P = y / x
  // new_x = sqrt(k / P)
  // new_y = sqrt(k * P)
  const k = initialEthQuantity * initialUsdcQuantity;
  const poolEthQuantity = Math.sqrt(k / currentEthPrice);
  const poolUsdcQuantity = Math.sqrt(k * currentEthPrice);
  
  const poolValue = (poolEthQuantity * currentEthPrice) + poolUsdcQuantity;
  
  // Impermanent Loss
  const impermanentLossUSD = hodlValue - poolValue;
  const impermanentLossPercent = (impermanentLossUSD / hodlValue) * 100;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Impermanent Loss Visualizer</h3>
        <p className="text-slate-500 mt-2">Compare HODLing vs providing liquidity in an AMM.</p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-2xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        
        <div className="flex justify-between items-center mb-4">
          <div className="font-semibold text-slate-700">Change ETH Price:</div>
          <div className="text-lg font-bold text-blue-600">${currentEthPrice.toFixed(0)} ({priceRatio.toFixed(2)}x)</div>
        </div>

        <input 
          type="range" 
          min="0.2" 
          max="5" 
          step="0.1" 
          value={priceRatio} 
          onChange={(e) => setPriceRatio(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span>-80%</span>
          <span>Start ($2000)</span>
          <span>+400%</span>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-6">
          <div className="flex flex-col gap-2 p-6 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-500 uppercase text-xs tracking-wider">HODL Value</h4>
            <div className="text-3xl font-bold text-slate-900">${hodlValue.toFixed(2)}</div>
            <div className="text-sm font-mono text-slate-500 mt-2">
              1 ETH + 2000 USDC
            </div>
          </div>

          <div className="flex flex-col gap-2 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="font-semibold text-blue-500 uppercase text-xs tracking-wider">Pool Value</h4>
            <div className="text-3xl font-bold text-blue-700">${poolValue.toFixed(2)}</div>
            <div className="text-sm font-mono text-blue-600 mt-2">
              {poolEthQuantity.toFixed(2)} ETH + {poolUsdcQuantity.toFixed(0)} USDC
            </div>
          </div>
        </div>

        <div className="mt-4 p-6 bg-rose-50 rounded-xl border border-rose-100 flex justify-between items-center transition-all duration-300">
          <div>
            <h4 className="font-semibold text-rose-600 uppercase text-xs tracking-wider">Impermanent Loss</h4>
            <p className="text-sm text-rose-500 mt-1">Value "lost" compared to just holding.</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-rose-600">-${impermanentLossUSD.toFixed(2)}</div>
            <div className="text-rose-500 font-semibold">{impermanentLossPercent.toFixed(2)}%</div>
          </div>
        </div>

      </div>
    </div>
  );
}

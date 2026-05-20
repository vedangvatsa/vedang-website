"use client";

import { useState, useEffect } from 'react';

export function CollateralizationRatioVisualizer() {
  const [collateralValue, setCollateralValue] = useState(150);
  const [borrowedValue, setBorrowedValue] = useState(100);
  const [priceChange, setPriceChange] = useState(0);
  const [selectedProtocol, setSelectedProtocol] = useState<'aave' | 'compound' | 'makerdao'>('aave');
  const [isAnimating, setIsAnimating] = useState(false);

  const protocols = {
    aave: { name: 'Aave', liquidationThreshold: 150, safeThreshold: 200 },
    compound: { name: 'Compound', liquidationThreshold: 133, safeThreshold: 180 },
    makerdao: { name: 'MakerDAO', liquidationThreshold: 150, safeThreshold: 200 }
  };

  const currentProtocol = protocols[selectedProtocol];
  const adjustedCollateral = collateralValue * (1 + priceChange / 100);
  const currentRatio = (adjustedCollateral / borrowedValue) * 100;
  const isLiquidationRisk = currentRatio <= currentProtocol.liquidationThreshold;
  const isSafe = currentRatio >= currentProtocol.safeThreshold;

  const getRatioColor = () => {
    if (isLiquidationRisk) return 'text-rose-600';
    if (isSafe) return 'text-emerald-600';
    return 'text-amber-600';
  };

  const getRatioBarColor = () => {
    if (isLiquidationRisk) return 'bg-rose-500';
    if (isSafe) return 'bg-emerald-500';
    return 'bg-amber-500';
  };

  const simulatePriceCrash = () => {
    setIsAnimating(true);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setPriceChange(-step * 5);
      if (step >= 10 || currentRatio <= currentProtocol.liquidationThreshold) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 200);
  };

  const resetSimulation = () => {
    setPriceChange(0);
    setIsAnimating(false);
  };

  const maxRatio = Math.max(300, currentRatio * 1.2);
  const barWidth = Math.min(100, (currentRatio / maxRatio) * 100);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Collateralization Ratio Visualizer</h3>
        <p className="text-slate-600">Explore how collateral and borrowed asset values affect your DeFi lending position safety</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-4">Position Setup</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Collateral Value: ${collateralValue}
              </label>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={collateralValue}
                onChange={(e) => setCollateralValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Borrowed Amount: ${borrowedValue}
              </label>
              <input
                type="range"
                min="25"
                max="300"
                step="5"
                value={borrowedValue}
                onChange={(e) => setBorrowedValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Protocol</label>
              <select
                value={selectedProtocol}
                onChange={(e) => setSelectedProtocol(e.target.value as 'aave' | 'compound' | 'makerdao')}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              >
                {Object.entries(protocols).map(([key, protocol]) => (
                  <option key={key} value={key}>{protocol.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-4">Current Ratio</h4>
          
          <div className="text-center mb-6">
            <div className={`text-4xl font-bold ${getRatioColor()} mb-2`}>
              {currentRatio.toFixed(1)}%
            </div>
            <div className="text-sm text-slate-600">
              ${adjustedCollateral.toFixed(2)} ÷ ${borrowedValue} × 100
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Liquidation</span>
              <span className="text-rose-600 font-medium">{currentProtocol.liquidationThreshold}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Safe Zone</span>
              <span className="text-emerald-600 font-medium">{currentProtocol.safeThreshold}%+</span>
            </div>
          </div>

          <div className="mt-4 relative">
            <div className="w-full bg-slate-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all duration-300 ${getRatioBarColor()}`}
                style={{ width: `${barWidth}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0%</span>
              <span>{maxRatio.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-4">Price Impact Simulation</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Collateral Price Change: {priceChange > 0 ? '+' : ''}{priceChange}%
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={priceChange}
                onChange={(e) => setPriceChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                disabled={isAnimating}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={simulatePriceCrash}
                disabled={isAnimating}
                className="px-3 py-2 bg-rose-100 text-rose-700 rounded-lg text-sm font-medium hover:bg-rose-200 disabled:opacity-50 transition-colors"
              >
                {isAnimating ? 'Simulating...' : 'Price Crash'}
              </button>
              <button
                onClick={resetSimulation}
                className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Reset
              </button>
            </div>

            <div className={`p-3 rounded-lg text-sm font-medium ${
              isLiquidationRisk 
                ? 'bg-rose-50 text-rose-800 border border-rose-200' 
                : isSafe 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {isLiquidationRisk 
                ? '⚠️ Liquidation Risk!' 
                : isSafe 
                  ? '✅ Safe Position'
                  : '⚡ Monitor Closely'
              }
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full max-w-4xl">
        <h5 className="font-semibold text-blue-800 mb-2">How It Works</h5>
        <p className="text-blue-700 text-sm">
          The collateralization ratio = (Collateral Value ÷ Borrowed Amount) × 100. 
          When your collateral loses value or your debt increases, the ratio drops. 
          If it falls below the protocol's liquidation threshold, your position may be liquidated to protect lenders.
        </p>
      </div>
    </div>
  );
}
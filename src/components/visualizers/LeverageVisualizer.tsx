"use client";

import React, { useState, useEffect } from 'react';

export function LeverageVisualizer() {
  const [leverage, setLeverage] = useState(5);
  const [initialCapital, setInitialCapital] = useState(1000);
  const [priceChange, setPriceChange] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const positionSize = initialCapital * leverage;
  const pnl = (priceChange / 100) * positionSize;
  const totalValue = initialCapital + pnl;
  const returnPercentage = (pnl / initialCapital) * 100;
  const liquidationPrice = -100 / leverage;
  const isLiquidated = priceChange <= liquidationPrice;

  const animateScenario = (targetPriceChange: number) => {
    setIsAnimating(true);
    const steps = 30;
    const increment = targetPriceChange / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setPriceChange(increment * currentStep);
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 50);
  };

  const resetVisualization = () => {
    setPriceChange(0);
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Leverage Trading Visualizer</h3>
        <p className="text-slate-600">Adjust leverage and see how price movements affect your position and potential liquidation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Trading Parameters</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Initial Capital: ${initialCapital.toLocaleString()}
              </label>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                disabled={isAnimating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Leverage: {leverage}x
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                disabled={isAnimating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price Change: {priceChange > 0 ? '+' : ''}{priceChange.toFixed(1)}%
              </label>
              <input
                type="range"
                min={liquidationPrice - 5}
                max="30"
                step="0.5"
                value={priceChange}
                onChange={(e) => setPriceChange(Number(e.target.value))}
                className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                disabled={isAnimating}
              />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <button
              onClick={() => animateScenario(10)}
              disabled={isAnimating}
              className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
            >
              Simulate +10% Move
            </button>
            <button
              onClick={() => animateScenario(-5)}
              disabled={isAnimating}
              className="w-full px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50"
            >
              Simulate -5% Move
            </button>
            <button
              onClick={resetVisualization}
              disabled={isAnimating}
              className="w-full px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Position Overview</h4>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-slate-700">Position Size:</span>
              <span className="font-semibold text-blue-700">${positionSize.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-700">Liquidation at:</span>
              <span className="font-semibold text-rose-600">{liquidationPrice.toFixed(1)}%</span>
            </div>

            <div className={`flex justify-between items-center p-3 rounded-lg ${
              isLiquidated ? 'bg-rose-100' : pnl >= 0 ? 'bg-emerald-50' : 'bg-amber-50'
            }`}>
              <span className="text-slate-700">P&L:</span>
              <span className={`font-semibold ${
                isLiquidated ? 'text-rose-700' : pnl >= 0 ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                {isLiquidated ? 'LIQUIDATED' : `$${pnl.toFixed(0)}`}
              </span>
            </div>

            <div className={`flex justify-between items-center p-3 rounded-lg ${
              isLiquidated ? 'bg-rose-100' : returnPercentage >= 0 ? 'bg-emerald-50' : 'bg-amber-50'
            }`}>
              <span className="text-slate-700">Return:</span>
              <span className={`font-semibold ${
                isLiquidated ? 'text-rose-700' : returnPercentage >= 0 ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                {isLiquidated ? '-100%' : `${returnPercentage > 0 ? '+' : ''}${returnPercentage.toFixed(1)}%`}
              </span>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Portfolio Value</span>
                <span>${isLiquidated ? '0' : Math.max(0, totalValue).toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isLiquidated ? 'bg-rose-500' : totalValue >= initialCapital ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{
                    width: `${Math.max(0, Math.min(100, (totalValue / (initialCapital * 2)) * 100))}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center max-w-2xl">
        <div className={`p-4 rounded-lg ${
          isLiquidated ? 'bg-rose-100 border border-rose-200' : 
          priceChange === 0 ? 'bg-slate-100 border border-slate-200' :
          pnl >= 0 ? 'bg-emerald-100 border border-emerald-200' : 'bg-amber-100 border border-amber-200'
        }`}>
          <p className="text-sm text-slate-700">
            {isLiquidated ? 
              `With ${leverage}x leverage, your position was liquidated at ${liquidationPrice.toFixed(1)}% loss. You lost your entire ${initialCapital.toLocaleString()} capital.` :
              `Your ${leverage}x leveraged position amplifies the ${Math.abs(priceChange).toFixed(1)}% price movement to a ${Math.abs(returnPercentage).toFixed(1)}% ${returnPercentage >= 0 ? 'gain' : 'loss'} on your capital.`
            }
          </p>
        </div>
      </div>
    </div>
  );
}
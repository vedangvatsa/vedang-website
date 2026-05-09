"use client";

import { useState } from 'react';

export function TokenomicsVisualizer() {
  const [totalSupply, setTotalSupply] = useState(1000000);
  const [inflationRate, setInflationRate] = useState(2);
  const [demandGrowth, setDemandGrowth] = useState(5);
  const [currentYear, setCurrentYear] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const calculateTokenMetrics = (year: number) => {
    const supply = totalSupply * Math.pow(1 + inflationRate / 100, year);
    const demand = 100 * Math.pow(1 + demandGrowth / 100, year);
    const price = demand / (supply / 10000);
    return { supply: Math.round(supply), demand: Math.round(demand), price: price.toFixed(4) };
  };

  const currentMetrics = calculateTokenMetrics(currentYear);
  const priceChange = currentYear > 0 ? 
    ((parseFloat(currentMetrics.price) - parseFloat(calculateTokenMetrics(0).price)) / parseFloat(calculateTokenMetrics(0).price)) * 100 : 0;

  const startSimulation = () => {
    setIsAnimating(true);
    setCurrentYear(0);
    const interval = setInterval(() => {
      setCurrentYear(prev => {
        if (prev >= 10) {
          clearInterval(interval);
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 500);
  };

  const resetSimulation = () => {
    setCurrentYear(0);
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Tokenomics Simulator</h3>
        <p className="text-slate-600">Explore how supply, inflation, and demand affect token value over time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-semibold text-slate-800 mb-4">Token Parameters</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Total Supply: {totalSupply.toLocaleString()}
              </label>
              <input
                type="range"
                min="100000"
                max="10000000"
                step="100000"
                value={totalSupply}
                onChange={(e) => setTotalSupply(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                disabled={isAnimating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Inflation Rate: {inflationRate}% per year
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                disabled={isAnimating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Demand Growth: {demandGrowth}% per year
              </label>
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={demandGrowth}
                onChange={(e) => setDemandGrowth(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                disabled={isAnimating}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-semibold text-slate-800 mb-4">Current Metrics (Year {currentYear})</h4>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Supply:</span>
              <span className="font-semibold text-blue-600">{currentMetrics.supply.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Demand Index:</span>
              <span className="font-semibold text-emerald-600">{currentMetrics.demand}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Token Price:</span>
              <span className="font-semibold text-indigo-600">${currentMetrics.price}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Price Change:</span>
              <span className={`font-semibold ${priceChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500 mb-2">Supply vs Demand Balance</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-200 rounded-full h-3 relative overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: '50%' }}
                ></div>
                <div 
                  className="absolute top-0 right-0 h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(50, (currentMetrics.demand / 200) * 50)}%` }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Supply Pressure</span>
              <span>Demand Pressure</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-semibold text-slate-800 mb-4">Simulation Controls</h4>
          
          <div className="space-y-4">
            <button
              onClick={startSimulation}
              disabled={isAnimating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {isAnimating ? 'Simulating...' : 'Start 10-Year Simulation'}
            </button>
            
            <button
              onClick={resetSimulation}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Reset to Year 0
            </button>

            <div className="mt-4 p-3 bg-slate-100 rounded-lg">
              <div className="text-xs font-medium text-slate-700 mb-2">Economic Insight</div>
              <div className="text-xs text-slate-600">
                {demandGrowth > inflationRate ? (
                  <span className="text-emerald-600">
                    🟢 Demand outpacing supply growth - bullish tokenomics
                  </span>
                ) : demandGrowth === inflationRate ? (
                  <span className="text-amber-600">
                    🟡 Balanced growth - stable tokenomics
                  </span>
                ) : (
                  <span className="text-rose-600">
                    🔴 Supply outpacing demand - bearish tokenomics
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h4 className="font-semibold text-slate-800 mb-4">Price History Visualization</h4>
        <div className="flex items-end justify-between gap-2 h-32">
          {Array.from({ length: 11 }, (_, i) => {
            const yearMetrics = calculateTokenMetrics(i);
            const maxPrice = Math.max(...Array.from({ length: 11 }, (_, j) => parseFloat(calculateTokenMetrics(j).price)));
            const height = (parseFloat(yearMetrics.price) / maxPrice) * 100;
            const isActive = i <= currentYear;
            
            return (
              <div key={i} className="flex flex-col items-center flex-1">
                <div 
                  className={`w-full rounded-t transition-all duration-500 ${
                    isActive 
                      ? (parseFloat(yearMetrics.price) > parseFloat(calculateTokenMetrics(0).price) ? 'bg-emerald-500' : 'bg-rose-500')
                      : 'bg-slate-200'
                  }`}
                  style={{ height: isActive ? `${Math.max(height, 5)}%` : '5%' }}
                ></div>
                <div className="text-xs text-slate-500 mt-1">Y{i}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
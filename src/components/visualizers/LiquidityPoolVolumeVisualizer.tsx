"use client";

import { useState, useEffect } from 'react';

export function LiquidityPoolVolumeVisualizer() {
  const [selectedPool, setSelectedPool] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const pools = [
    { name: 'ETH/USDC', tvl: 1000000, dailyVolume: 10000000, feeRate: 0.003 },
    { name: 'DAI/USDC', tvl: 10000000, dailyVolume: 100000, feeRate: 0.001 },
    { name: 'WBTC/ETH', tvl: 5000000, dailyVolume: 2500000, feeRate: 0.003 },
  ];

  const currentPool = pools[selectedPool];
  const volumeToTvlRatio = currentPool.dailyVolume / currentPool.tvl;
  const dailyFeeRevenue = currentPool.dailyVolume * currentPool.feeRate;
  const annualizedAPY = (dailyFeeRevenue * 365) / currentPool.tvl * 100;
  
  const swapSize = 10000;
  const swapsPerHour = currentPool.dailyVolume / 24 / swapSize;
  const currentVolume = (timeElapsed / 24) * currentPool.dailyVolume;
  const currentFees = currentVolume * currentPool.feeRate;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          if (prev >= 24) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toFixed(0)}`;
  };

  const getEfficiencyColor = (ratio: number) => {
    if (ratio >= 5) return 'text-emerald-600 bg-emerald-100';
    if (ratio >= 2) return 'text-blue-600 bg-blue-100';
    if (ratio >= 1) return 'text-amber-600 bg-amber-100';
    return 'text-rose-600 bg-rose-100';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Liquidity Pool Volume</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how trading volume drives fee revenue and capital efficiency across different liquidity pools
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {pools.map((pool, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedPool(index);
              setTimeElapsed(0);
              setIsPlaying(false);
            }}
            className={`px-4 py-2 rounded-lg border transition-all ${
              selectedPool === index
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
            }`}
          >
            {pool.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="text-sm text-slate-500 mb-2">Total Value Locked (TVL)</div>
          <div className="text-2xl font-bold text-slate-800">{formatCurrency(currentPool.tvl)}</div>
          <div className="w-full bg-slate-200 rounded-full h-3 mt-3">
            <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="text-sm text-slate-500 mb-2">24h Volume Target</div>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(currentPool.dailyVolume)}</div>
          <div className="w-full bg-slate-200 rounded-full h-3 mt-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(100, (currentVolume / currentPool.dailyVolume) * 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Current: {formatCurrency(currentVolume)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="text-sm text-slate-500 mb-2">Fees Accumulated</div>
          <div className="text-2xl font-bold text-emerald-600">{formatCurrency(currentFees)}</div>
          <div className="w-full bg-slate-200 rounded-full h-3 mt-3">
            <div 
              className="bg-emerald-500 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(100, (currentFees / dailyFeeRevenue) * 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Target: {formatCurrency(dailyFeeRevenue)}
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold text-slate-800">24-Hour Volume Simulation</div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600">
              Hour: {timeElapsed.toFixed(1)} / 24
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-lg text-white transition-colors ${
                isPlaying ? 'bg-rose-500 hover:bg-rose-600' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isPlaying ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => {
                setTimeElapsed(0);
                setIsPlaying(false);
              }}
              className="px-4 py-2 rounded-lg bg-slate-500 text-white hover:bg-slate-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-slate-100 rounded-lg">
            <div className="text-xs text-slate-500">Swaps/Hour</div>
            <div className="text-lg font-bold text-slate-700">{swapsPerHour.toFixed(1)}</div>
          </div>
          <div className="text-center p-3 bg-blue-100 rounded-lg">
            <div className="text-xs text-slate-500">Volume/TVL Ratio</div>
            <div className="text-lg font-bold text-blue-600">{volumeToTvlRatio.toFixed(2)}x</div>
          </div>
          <div className="text-center p-3 bg-emerald-100 rounded-lg">
            <div className="text-xs text-slate-500">Daily APY</div>
            <div className="text-lg font-bold text-emerald-600">{(dailyFeeRevenue / currentPool.tvl * 100).toFixed(3)}%</div>
          </div>
          <div className={`text-center p-3 rounded-lg ${getEfficiencyColor(volumeToTvlRatio)}`}>
            <div className="text-xs">Capital Efficiency</div>
            <div className="text-lg font-bold">
              {volumeToTvlRatio >= 5 ? 'Excellent' : 
               volumeToTvlRatio >= 2 ? 'Good' : 
               volumeToTvlRatio >= 1 ? 'Fair' : 'Poor'}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Volume Progress</span>
            <span>{((currentVolume / currentPool.dailyVolume) * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
              style={{ width: `${Math.min(100, (currentVolume / currentPool.dailyVolume) * 100)}%` }}
            >
              {currentVolume > 0 && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-200">
            <div>
              <div className="text-sm font-medium text-slate-700 mb-2">Key Insight</div>
              <div className="text-sm text-slate-600">
                {volumeToTvlRatio >= 5 
                  ? "High volume relative to TVL means excellent capital efficiency and strong LP returns!"
                  : volumeToTvlRatio >= 1
                  ? "Moderate volume provides steady returns but could be more capital efficient."
                  : "Low volume means poor capital efficiency - LPs earn minimal fees relative to their capital."}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-700 mb-2">Projected Annual APY</div>
              <div className="text-2xl font-bold text-emerald-600">{annualizedAPY.toFixed(1)}%</div>
              <div className="text-xs text-slate-500">Based on current volume & fee rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
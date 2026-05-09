"use client";

import React, { useState } from 'react';

export function SlippageVisualizer() {
  const [tradeAmount, setTradeAmount] = useState(1000);
  const [liquidityPool, setLiquidityPool] = useState(100000);
  const [marketVolatility, setMarketVolatility] = useState(0.5);
  const [selectedType, setSelectedType] = useState<'impact' | 'movement'>('impact');
  const [isExecuting, setIsExecuting] = useState(false);

  // Calculate price impact slippage using AMM constant product formula
  const calculatePriceImpact = (amount: number, liquidity: number) => {
    const k = liquidity * liquidity; // x * y = k
    const newY = liquidity - amount;
    const newX = k / newY;
    const priceChange = ((newX - liquidity) / liquidity) * 100;
    return Math.max(0, priceChange);
  };

  // Calculate market movement slippage
  const calculateMarketMovement = (volatility: number) => {
    return volatility * (Math.random() * 2 - 1); // Random price movement
  };

  const priceImpactSlippage = calculatePriceImpact(tradeAmount, liquidityPool);
  const marketMovementSlippage = selectedType === 'movement' ? calculateMarketMovement(marketVolatility) : 0;
  
  const expectedPrice = 100;
  const actualPrice = selectedType === 'impact' 
    ? expectedPrice * (1 + priceImpactSlippage / 100)
    : expectedPrice * (1 + marketMovementSlippage / 100);
  
  const totalSlippage = ((actualPrice - expectedPrice) / expectedPrice) * 100;

  const executeSimulation = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Slippage Simulator</h3>
        <p className="text-slate-600">Explore how trade size and market conditions affect slippage</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedType('impact')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            selectedType === 'impact'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Price Impact Slippage
        </button>
        <button
          onClick={() => setSelectedType('movement')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            selectedType === 'movement'
              ? 'bg-indigo-500 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Market Movement Slippage
        </button>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Trade Parameters</h4>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Trade Amount: ${tradeAmount.toLocaleString()}
              </label>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {selectedType === 'impact' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Pool Liquidity: ${liquidityPool.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="10000"
                  value={liquidityPool}
                  onChange={(e) => setLiquidityPool(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            )}

            {selectedType === 'movement' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Market Volatility: {marketVolatility.toFixed(1)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={marketVolatility}
                  onChange={(e) => setMarketVolatility(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            )}

            <button
              onClick={executeSimulation}
              disabled={isExecuting}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                isExecuting
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700'
              }`}
            >
              {isExecuting ? 'Executing Trade...' : 'Execute Trade'}
            </button>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Price Impact</h4>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-100 rounded-lg">
              <span className="text-slate-600">Expected Price:</span>
              <span className="font-semibold text-slate-800">${expectedPrice.toFixed(2)}</span>
            </div>

            <div className={`flex justify-between items-center p-3 rounded-lg transition-all duration-500 ${
              isExecuting ? 'bg-amber-100 border border-amber-200' : 'bg-slate-100'
            }`}>
              <span className="text-slate-600">Actual Price:</span>
              <span className="font-semibold text-slate-800">${actualPrice.toFixed(2)}</span>
            </div>

            <div className={`flex justify-between items-center p-3 rounded-lg ${
              totalSlippage > 0 ? 'bg-rose-100' : totalSlippage < 0 ? 'bg-emerald-100' : 'bg-slate-100'
            }`}>
              <span className="text-slate-600">Slippage:</span>
              <span className={`font-bold ${
                totalSlippage > 0 ? 'text-rose-600' : totalSlippage < 0 ? 'text-emerald-600' : 'text-slate-600'
              }`}>
                {totalSlippage > 0 ? '+' : ''}{totalSlippage.toFixed(2)}%
              </span>
            </div>

            {/* Visual bar chart */}
            <div className="mt-6">
              <div className="flex items-end justify-between h-32 border-b border-slate-200">
                <div className="flex flex-col items-center">
                  <div 
                    className="w-16 bg-blue-400 rounded-t transition-all duration-500"
                    style={{ height: '80px' }}
                  ></div>
                  <span className="text-xs text-slate-600 mt-2">Expected</span>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-16 rounded-t transition-all duration-500 ${
                      totalSlippage > 0 ? 'bg-rose-400' : totalSlippage < 0 ? 'bg-emerald-400' : 'bg-blue-400'
                    }`}
                    style={{ 
                      height: `${80 * (actualPrice / expectedPrice)}px`
                    }}
                  ></div>
                  <span className="text-xs text-slate-600 mt-2">Actual</span>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
              {selectedType === 'impact' ? (
                <>
                  <strong>Price Impact:</strong> Larger trades relative to pool size cause more slippage.
                  Trade ratio: {((tradeAmount / liquidityPool) * 100).toFixed(2)}%
                </>
              ) : (
                <>
                  <strong>Market Movement:</strong> Price changes between submission and execution.
                  Volatility: {marketVolatility}%
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
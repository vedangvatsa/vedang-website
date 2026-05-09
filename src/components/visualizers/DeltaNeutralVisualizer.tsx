"use client";

import { useState } from 'react';

export function DeltaNeutralVisualizer() {
  const [ethPrice, setEthPrice] = useState(2000);
  const [fundingRate, setFundingRate] = useState(0.01);
  const [timeStep, setTimeStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const spotValue = ethPrice;
  const futuresValue = ethPrice;
  const spotPnL = ethPrice - 2000;
  const futuresPnL = -(ethPrice - 2000);
  const totalPnL = spotPnL + futuresPnL;
  const fundingPayment = fundingRate * timeStep * 2000;

  const startAnimation = () => {
    setIsAnimating(true);
    setTimeStep(0);
    const interval = setInterval(() => {
      setTimeStep(prev => {
        if (prev >= 8) {
          clearInterval(interval);
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 500);
  };

  const resetAnimation = () => {
    setTimeStep(0);
    setIsAnimating(false);
    setEthPrice(2000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Delta Neutral Strategy</h3>
        <p className="text-slate-600 max-w-2xl">
          Long spot + Short futures = Zero price exposure. Profit comes from funding rates, not price movements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Controls */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
          <h4 className="font-semibold text-slate-700 mb-4">Market Parameters</h4>
          
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              ETH Price: ${ethPrice}
            </label>
            <input
              type="range"
              min="1500"
              max="2500"
              value={ethPrice}
              onChange={(e) => setEthPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Funding Rate: {(fundingRate * 100).toFixed(2)}%
            </label>
            <input
              type="range"
              min="-0.02"
              max="0.02"
              step="0.001"
              value={fundingRate}
              onChange={(e) => setFundingRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={startAnimation}
              disabled={isAnimating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnimating ? 'Running...' : 'Start Funding'}
            </button>
            <button
              onClick={resetAnimation}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Position Visualization */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-4">Portfolio Positions</h4>
          
          {/* Spot Position */}
          <div className="mb-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-emerald-700">Long 1 ETH (Spot)</span>
              <span className="text-emerald-600">${spotValue.toFixed(0)}</span>
            </div>
            <div className="text-sm text-emerald-600">
              P&L: <span className={spotPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                ${spotPnL.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Futures Position */}
          <div className="mb-4 p-4 bg-rose-50 rounded-lg border border-rose-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-rose-700">Short 1 ETH (Futures)</span>
              <span className="text-rose-600">-${futuresValue.toFixed(0)}</span>
            </div>
            <div className="text-sm text-rose-600">
              P&L: <span className={futuresPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                ${futuresPnL.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Net Position */}
          <div className="p-4 bg-slate-100 rounded-lg border border-slate-300">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-slate-700">Net Price Exposure</span>
              <span className="font-bold text-slate-700">${totalPnL.toFixed(0)}</span>
            </div>
            <div className="text-sm text-slate-600">
              Delta: ~0 (Price neutral)
            </div>
          </div>
        </div>

        {/* Funding Payment Visualization */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-4">Funding Rate Payments</h4>
          
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-slate-600">
              Time Steps: {timeStep}/8
            </div>
            <div className="text-lg font-semibold text-blue-600">
              Total Earned: ${fundingPayment.toFixed(2)}
            </div>
          </div>

          {/* Funding Rate Timeline */}
          <div className="relative h-16 bg-slate-100 rounded-lg mb-4 overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-full border-r border-slate-300 flex items-center justify-center transition-all duration-500 ${
                    i < timeStep
                      ? fundingRate > 0
                        ? 'bg-emerald-200'
                        : 'bg-rose-200'
                      : 'bg-slate-100'
                  }`}
                >
                  {i < timeStep && (
                    <span className={`text-xs font-medium ${
                      fundingRate > 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      +${(fundingRate * 2000).toFixed(1)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-slate-600 text-center">
            {fundingRate > 0 
              ? "Positive funding: You receive payments as futures trade above spot"
              : "Negative funding: You pay as futures trade below spot"
            }
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 max-w-4xl">
        <p className="text-blue-800 text-sm text-center">
          <strong>Key Insight:</strong> Notice how changing the ETH price doesn't affect your total P&L - 
          gains and losses cancel out. Your profit comes from the funding rate payments over time, 
          regardless of price direction.
        </p>
      </div>
    </div>
  );
}
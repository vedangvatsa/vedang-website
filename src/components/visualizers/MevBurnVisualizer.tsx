"use client";

import React, { useState, useEffect } from 'react';

export function MevBurnVisualizer() {
  const [currentScenario, setCurrentScenario] = useState<'current' | 'burn'>('current');
  const [animationStep, setAnimationStep] = useState(0);
  const [burnRate, setBurnRate] = useState(80);
  const [isAnimating, setIsAnimating] = useState(false);

  const mevValue = 100;
  const burnedValue = (mevValue * burnRate) / 100;
  const extractedValue = mevValue - burnedValue;

  const transactions = [
    { id: 1, type: 'user', value: 1000, color: 'bg-blue-400' },
    { id: 2, type: 'arbitrage', value: 50, color: 'bg-rose-400' },
    { id: 3, type: 'user', value: 800, color: 'bg-blue-400' },
    { id: 4, type: 'sandwich', value: 30, color: 'bg-rose-500' },
    { id: 5, type: 'user', value: 1200, color: 'bg-blue-400' }
  ];

  useEffect(() => {
    if (isAnimating) {
      const timer = setInterval(() => {
        setAnimationStep(prev => {
          if (prev >= 4) {
            setIsAnimating(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isAnimating]);

  const startAnimation = () => {
    setAnimationStep(0);
    setIsAnimating(true);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">MEV Burn Mechanism</h3>
        <p className="text-lg text-slate-600">Explore how burning MEV can reduce harmful extraction behaviors</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setCurrentScenario('current')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            currentScenario === 'current'
              ? 'bg-rose-500 text-white shadow-lg'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Current MEV Flow
        </button>
        <button
          onClick={() => setCurrentScenario('burn')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            currentScenario === 'burn'
              ? 'bg-emerald-500 text-white shadow-lg'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          MEV Burn Scenario
        </button>
      </div>

      {currentScenario === 'burn' && (
        <div className="w-full max-w-md mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Burn Rate: {burnRate}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={burnRate}
            onChange={(e) => setBurnRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      )}

      <div className="relative w-full max-w-4xl bg-white rounded-xl p-6 shadow-lg">
        <button
          onClick={startAnimation}
          className="absolute top-4 right-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Animate Flow
        </button>

        {/* Transaction Pool */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Transaction Pool</h4>
          <div className="flex gap-2 flex-wrap">
            {transactions.map((tx, index) => (
              <div
                key={tx.id}
                className={`px-3 py-2 rounded-lg text-white text-sm font-medium transition-all duration-500 ${
                  tx.color
                } ${
                  isAnimating && index <= animationStep ? 'transform translate-y-2 opacity-70' : ''
                }`}
              >
                {tx.type === 'user' ? 'User Trade' : tx.type === 'arbitrage' ? 'Arbitrage' : 'Sandwich'}
              </div>
            ))}
          </div>
        </div>

        {/* MEV Extraction Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Searchers */}
          <div className="text-center">
            <div className="w-16 h-16 bg-rose-400 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <h5 className="font-semibold text-slate-700 mb-2">Searchers</h5>
            <div className="text-2xl font-bold text-rose-500 mb-2">
              {currentScenario === 'current' ? mevValue : extractedValue.toFixed(1)}Ξ
            </div>
            <div className="text-sm text-slate-600">
              {currentScenario === 'current' ? 'Extract full MEV' : `${100 - burnRate}% of MEV`}
            </div>
          </div>

          {/* Arrow or Burn */}
          <div className="flex items-center justify-center">
            {currentScenario === 'burn' ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-bold">🔥</span>
                </div>
                <div className="text-xl font-bold text-amber-600 mb-1">
                  {burnedValue.toFixed(1)}Ξ Burned
                </div>
                <div className="text-sm text-slate-600">Removed from circulation</div>
              </div>
            ) : (
              <div className="text-4xl text-slate-400">→</div>
            )}
          </div>

          {/* Validators */}
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-400 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <h5 className="font-semibold text-slate-700 mb-2">Validators</h5>
            <div className="text-2xl font-bold text-indigo-500 mb-2">
              {currentScenario === 'current' ? (mevValue * 0.3).toFixed(1) : (extractedValue * 0.3).toFixed(1)}Ξ
            </div>
            <div className="text-sm text-slate-600">
              {currentScenario === 'current' ? '30% commission' : `30% of remaining MEV`}
            </div>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-100 rounded-lg p-4 text-center">
            <div className="text-lg font-semibold text-slate-700">Sandwich Attack Profit</div>
            <div className={`text-2xl font-bold ${currentScenario === 'current' ? 'text-rose-500' : 'text-emerald-500'}`}>
              {currentScenario === 'current' ? '30Ξ' : (30 * (1 - burnRate / 100)).toFixed(1) + 'Ξ'}
            </div>
            <div className="text-sm text-slate-600">
              {currentScenario === 'current' ? 'High incentive' : `${burnRate}% reduction`}
            </div>
          </div>

          <div className="bg-slate-100 rounded-lg p-4 text-center">
            <div className="text-lg font-semibold text-slate-700">User Protection</div>
            <div className={`text-2xl font-bold ${currentScenario === 'current' ? 'text-rose-500' : 'text-emerald-500'}`}>
              {currentScenario === 'current' ? 'Low' : 'High'}
            </div>
            <div className="text-sm text-slate-600">
              {currentScenario === 'current' ? 'Frequent attacks' : 'Reduced exploitation'}
            </div>
          </div>

          <div className="bg-slate-100 rounded-lg p-4 text-center">
            <div className="text-lg font-semibold text-slate-700">Network Health</div>
            <div className={`text-2xl font-bold ${currentScenario === 'current' ? 'text-amber-500' : 'text-emerald-500'}`}>
              {currentScenario === 'current' ? 'Fair' : 'Excellent'}
            </div>
            <div className="text-sm text-slate-600">
              {currentScenario === 'current' ? 'MEV concentration' : 'Distributed benefits'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
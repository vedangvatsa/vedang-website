"use client";

import { useState } from 'react';

export function ApyVsAprVisualizer() {
  const [apr, setApr] = useState(12);
  const [compoundingFreq, setCompoundingFreq] = useState(12);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  const calculateAPY = (aprRate: number, frequency: number) => {
    return ((1 + aprRate / 100 / frequency) ** frequency - 1) * 100;
  };

  const apy = calculateAPY(apr, compoundingFreq);
  const monthlyRate = apr / 12;

  const compoundingOptions = [
    { label: 'Annually', value: 1 },
    { label: 'Semi-annually', value: 2 },
    { label: 'Quarterly', value: 4 },
    { label: 'Monthly', value: 12 },
    { label: 'Daily', value: 365 },
  ];

  const startAnimation = () => {
    setShowAnimation(true);
    setAnimationStep(0);
    const interval = setInterval(() => {
      setAnimationStep(prev => {
        if (prev >= 12) {
          clearInterval(interval);
          setTimeout(() => setShowAnimation(false), 2000);
          return 12;
        }
        return prev + 1;
      });
    }, 500);
  };

  const getCompoundValue = (month: number) => {
    return 1000 * ((1 + monthlyRate / 100) ** month);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">APY vs APR Interactive Calculator</h3>
        <p className="text-slate-600">Explore how compounding frequency affects your actual returns. APR ignores compounding, APY includes it.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Controls</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                APR: {apr}%
              </label>
              <input
                type="range"
                min="1"
                max="25"
                value={apr}
                onChange={(e) => setApr(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Compounding Frequency
              </label>
              <select
                value={compoundingFreq}
                onChange={(e) => setCompoundingFreq(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {compoundingOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.value}x/year)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={startAnimation}
              disabled={showAnimation}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {showAnimation ? 'Animating...' : 'Animate Monthly Compounding'}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Results Comparison</h4>
          
          <div className="space-y-4">
            <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
              <div className="text-sm text-rose-600 font-medium">APR (Simple)</div>
              <div className="text-2xl font-bold text-rose-800">{apr.toFixed(2)}%</div>
              <div className="text-xs text-rose-600">Ignores compounding</div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-sm text-emerald-600 font-medium">APY (Compound)</div>
              <div className="text-2xl font-bold text-emerald-800">{apy.toFixed(2)}%</div>
              <div className="text-xs text-emerald-600">Includes compounding effect</div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="text-sm text-indigo-600 font-medium">Difference</div>
              <div className="text-xl font-bold text-indigo-800">+{(apy - apr).toFixed(2)}%</div>
              <div className="text-xs text-indigo-600">Extra yield from compounding</div>
            </div>
          </div>
        </div>
      </div>

      {showAnimation && (
        <div className="w-full max-w-4xl bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">
            Monthly Compounding Animation ($1,000 initial)
          </h4>
          
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {Array.from({ length: 12 }, (_, i) => {
              const month = i + 1;
              const value = getCompoundValue(month);
              const isActive = animationStep >= month;
              
              return (
                <div
                  key={month}
                  className={`p-2 rounded-lg border-2 transition-all duration-300 ${
                    isActive
                      ? 'border-emerald-400 bg-emerald-50 scale-105'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-medium text-slate-600">Month {month}</div>
                  <div className={`text-sm font-bold ${isActive ? 'text-emerald-800' : 'text-slate-400'}`}>
                    ${value.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500">
                    +{((value - 1000) / 1000 * 100).toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-center">
              <div className="text-sm text-amber-700">Final Value After 12 Months</div>
              <div className="text-2xl font-bold text-amber-800">
                ${getCompoundValue(12).toFixed(2)}
              </div>
              <div className="text-sm text-amber-600">
                vs ${(1000 * (1 + apr/100)).toFixed(2)} with simple APR
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl bg-white p-6 rounded-xl border border-slate-200">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Formula Breakdown</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-rose-50 rounded-lg">
            <h5 className="font-semibold text-rose-800 mb-2">APR Formula</h5>
            <div className="font-mono text-sm text-rose-700 bg-white p-2 rounded">
              Simple Rate = {apr}%
            </div>
            <p className="text-xs text-rose-600 mt-2">
              No compounding considered
            </p>
          </div>

          <div className="p-4 bg-emerald-50 rounded-lg">
            <h5 className="font-semibold text-emerald-800 mb-2">APY Formula</h5>
            <div className="font-mono text-sm text-emerald-700 bg-white p-2 rounded">
              (1 + {apr}%/{compoundingFreq})^{compoundingFreq} - 1
            </div>
            <div className="font-mono text-xs text-emerald-600 mt-1">
              = (1 + {(apr/compoundingFreq).toFixed(4)})^{compoundingFreq} - 1
            </div>
            <div className="font-mono text-xs text-emerald-600">
              = {apy.toFixed(4)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";

export function YieldVisualizer() {
  const [selectedProtocol, setSelectedProtocol] = useState('amm');
  const [principal, setPrincipal] = useState(1000);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const protocols = {
    amm: {
      name: 'AMM Liquidity',
      baseAPY: 8,
      riskFactor: 0.1,
      yieldSource: 'Trading fees from swaps',
      sustainability: 'High',
      color: 'emerald'
    },
    lending: {
      name: 'Lending Protocol',
      baseAPY: 5,
      riskFactor: 0.05,
      yieldSource: 'Interest from borrowers',
      sustainability: 'High',
      color: 'blue'
    },
    ponzi: {
      name: 'Unsustainable Protocol',
      baseAPY: 50,
      riskFactor: 0.8,
      yieldSource: 'New user deposits',
      sustainability: 'Very Low',
      color: 'rose'
    }
  };

  const calculateYield = (days: number, protocol: any) => {
    const dailyRate = protocol.baseAPY / 365 / 100;
    if (protocol.name === 'Unsustainable Protocol') {
      // Ponzi scheme - high returns initially then crash
      const crashPoint = 30;
      if (days < crashPoint) {
        return principal * Math.pow(1 + dailyRate * 10, days);
      } else {
        const peakValue = principal * Math.pow(1 + dailyRate * 10, crashPoint);
        const crashMultiplier = Math.max(0.1, 1 - (days - crashPoint) * 0.1);
        return peakValue * crashMultiplier;
      }
    }
    return principal * Math.pow(1 + dailyRate, days);
  };

  const startAnimation = () => {
    setIsAnimating(true);
    setTimeElapsed(0);
    const interval = setInterval(() => {
      setTimeElapsed(prev => {
        if (prev >= 60) {
          setIsAnimating(false);
          clearInterval(interval);
          return 60;
        }
        return prev + 1;
      });
    }, 100);
  };

  const currentValue = calculateYield(timeElapsed, protocols[selectedProtocol]);
  const currentAPY = timeElapsed > 0 ? ((currentValue / principal) ** (365 / timeElapsed) - 1) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">DeFi Yield Visualization</h3>
        <p className="text-slate-600">Compare sustainable vs unsustainable yield sources and their long-term performance</p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {Object.entries(protocols).map(([key, protocol]) => (
          <button
            key={key}
            onClick={() => setSelectedProtocol(key)}
            className={`px-4 py-3 rounded-lg border-2 transition-all ${
              selectedProtocol === key
                ? `border-${protocol.color}-500 bg-${protocol.color}-50 text-${protocol.color}-700`
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="font-semibold">{protocol.name}</div>
            <div className="text-sm">{protocol.baseAPY}% APY</div>
          </button>
        ))}
      </div>

      <div className="w-full max-w-md">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Initial Investment: ${principal.toLocaleString()}
        </label>
        <input
          type="range"
          min="100"
          max="10000"
          step="100"
          value={principal}
          onChange={(e) => setPrincipal(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-slate-800">
            {protocols[selectedProtocol].name} Performance
          </h4>
          <button
            onClick={startAnimation}
            disabled={isAnimating}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnimating ? 'Simulating...' : 'Start 60-Day Simulation'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="text-sm text-slate-600">Current Value</div>
            <div className="text-xl font-bold text-slate-800">
              ${currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="text-sm text-slate-600">Actual APY</div>
            <div className={`text-xl font-bold ${currentAPY > 100 ? 'text-rose-600' : currentAPY > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
              {currentAPY.toFixed(1)}%
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="text-sm text-slate-600">Days Elapsed</div>
            <div className="text-xl font-bold text-slate-800">{timeElapsed}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-600 mb-1">
            <span>Portfolio Value Over Time</span>
            <span>Day {timeElapsed}/60</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 relative overflow-hidden">
            <div 
              className={`h-full bg-${protocols[selectedProtocol].color}-500 transition-all duration-100 relative`}
              style={{ width: `${(timeElapsed / 60) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-600">Yield Source:</span>
            <span className="font-medium text-slate-800">{protocols[selectedProtocol].yieldSource}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Sustainability:</span>
            <span className={`font-medium ${
              protocols[selectedProtocol].sustainability === 'High' ? 'text-emerald-600' :
              protocols[selectedProtocol].sustainability === 'Medium' ? 'text-amber-600' :
              'text-rose-600'
            }`}>
              {protocols[selectedProtocol].sustainability}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Risk Level:</span>
            <span className={`font-medium ${
              protocols[selectedProtocol].riskFactor < 0.1 ? 'text-emerald-600' :
              protocols[selectedProtocol].riskFactor < 0.3 ? 'text-amber-600' :
              'text-rose-600'
            }`}>
              {protocols[selectedProtocol].riskFactor < 0.1 ? 'Low' :
               protocols[selectedProtocol].riskFactor < 0.3 ? 'Medium' : 'High'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 w-full max-w-2xl">
        <div className="text-amber-800 text-sm">
          <strong>Key Insight:</strong> Sustainable yield comes from real economic activity (trading fees, lending interest), 
          while unsustainable protocols often rely on new deposits to pay returns, leading to inevitable collapse.
        </div>
      </div>
    </div>
  );
}
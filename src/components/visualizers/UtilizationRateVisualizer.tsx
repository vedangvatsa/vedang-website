"use client";

import { useState, useEffect } from 'react';

export function UtilizationRateVisualizer() {
  const [totalDeposited, setTotalDeposited] = useState(100);
  const [totalBorrowed, setTotalBorrowed] = useState(60);
  const [animationStep, setAnimationStep] = useState(0);
  const [showRiskWarning, setShowRiskWarning] = useState(false);

  const utilizationRate = (totalBorrowed / totalDeposited) * 100;
  
  const calculateInterestRate = (utilization: number) => {
    if (utilization < 80) {
      return 2 + (utilization / 80) * 8; // 2% to 10% for 0-80% utilization
    } else {
      return 10 + ((utilization - 80) / 20) * 40; // 10% to 50% for 80-100% utilization
    }
  };

  const interestRate = calculateInterestRate(utilizationRate);

  useEffect(() => {
    setShowRiskWarning(utilizationRate > 90);
  }, [utilizationRate]);

  const handleDepositChange = (value: number) => {
    setTotalDeposited(value);
    if (totalBorrowed > value) {
      setTotalBorrowed(value);
    }
  };

  const simulateScenario = (scenario: 'low' | 'optimal' | 'high') => {
    switch (scenario) {
      case 'low':
        setTotalDeposited(100);
        setTotalBorrowed(30);
        break;
      case 'optimal':
        setTotalDeposited(100);
        setTotalBorrowed(75);
        break;
      case 'high':
        setTotalDeposited(100);
        setTotalBorrowed(95);
        break;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">DeFi Lending Pool Utilization Rate</h3>
        <p className="text-slate-600">Adjust deposits and borrowing to see how utilization affects interest rates and protocol health</p>
      </div>

      {/* Quick Scenario Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => simulateScenario('low')}
          className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-colors"
        >
          Low Utilization (30%)
        </button>
        <button
          onClick={() => simulateScenario('optimal')}
          className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
        >
          Optimal (75%)
        </button>
        <button
          onClick={() => simulateScenario('high')}
          className="px-4 py-2 bg-rose-100 text-rose-800 rounded-lg hover:bg-rose-200 transition-colors"
        >
          High Risk (95%)
        </button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Total Deposited: ${totalDeposited}M
            </label>
            <input
              type="range"
              min="50"
              max="200"
              value={totalDeposited}
              onChange={(e) => handleDepositChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Total Borrowed: ${totalBorrowed}M
            </label>
            <input
              type="range"
              min="0"
              max={totalDeposited}
              value={totalBorrowed}
              onChange={(e) => setTotalBorrowed(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Visual Pool Representation */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Lending Pool Visualization</h4>
          <div className="relative h-40 bg-slate-100 rounded-lg overflow-hidden">
            {/* Available Liquidity */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-blue-200 transition-all duration-500"
              style={{ height: `${((totalDeposited - totalBorrowed) / totalDeposited) * 100}%` }}
            >
              <div className="absolute top-2 left-2 text-xs text-blue-800 font-medium">
                Available: ${totalDeposited - totalBorrowed}M
              </div>
            </div>
            
            {/* Borrowed Amount */}
            <div 
              className="absolute top-0 left-0 right-0 bg-indigo-400 transition-all duration-500"
              style={{ height: `${(totalBorrowed / totalDeposited) * 100}%` }}
            >
              <div className="absolute top-2 left-2 text-xs text-white font-medium">
                Borrowed: ${totalBorrowed}M
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
          <div className="text-2xl font-bold text-slate-800">{utilizationRate.toFixed(1)}%</div>
          <div className="text-sm text-slate-600">Utilization Rate</div>
          <div className={`w-full h-2 rounded-full mt-2 ${
            utilizationRate < 70 ? 'bg-emerald-200' :
            utilizationRate < 90 ? 'bg-amber-200' : 'bg-rose-200'
          }`}>
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                utilizationRate < 70 ? 'bg-emerald-500' :
                utilizationRate < 90 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(utilizationRate, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
          <div className="text-2xl font-bold text-slate-800">{interestRate.toFixed(1)}%</div>
          <div className="text-sm text-slate-600">Interest Rate (APY)</div>
          <div className="text-xs text-slate-500 mt-1">
            {utilizationRate > 80 ? 'Steep curve above 80%' : 'Linear below 80%'}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
          <div className="text-2xl font-bold text-slate-800">${totalDeposited - totalBorrowed}M</div>
          <div className="text-sm text-slate-600">Available Liquidity</div>
          <div className={`text-xs mt-1 ${
            (totalDeposited - totalBorrowed) / totalDeposited > 0.2 ? 'text-emerald-600' :
            (totalDeposited - totalBorrowed) / totalDeposited > 0.1 ? 'text-amber-600' : 'text-rose-600'
          }`}>
            {(totalDeposited - totalBorrowed) / totalDeposited > 0.2 ? 'Healthy liquidity' :
             (totalDeposited - totalBorrowed) / totalDeposited > 0.1 ? 'Low liquidity' : 'Critical!'}
          </div>
        </div>
      </div>

      {/* Interest Rate Curve Visualization */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 w-full max-w-4xl">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Dynamic Interest Rate Curve</h4>
        <div className="relative h-64 bg-slate-50 rounded-lg overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Grid lines */}
            {[0, 20, 40, 60, 80, 100].map(x => (
              <line key={x} x1={x * 4} y1="0" x2={x * 4} y2="200" stroke="#e2e8f0" strokeWidth="1" />
            ))}
            {[0, 10, 20, 30, 40, 50].map(y => (
              <line key={y} x1="0" y1={200 - y * 4} x2="400" y2={200 - y * 4} stroke="#e2e8f0" strokeWidth="1" />
            ))}
            
            {/* Interest rate curve */}
            <path
              d={`M 0 ${200 - 2 * 4} 
                  L ${80 * 4} ${200 - 10 * 4} 
                  L 400 ${200 - 50 * 4}`}
              stroke="#3b82f6"
              strokeWidth="3"
              fill="none"
            />
            
            {/* Current position indicator */}
            <circle
              cx={utilizationRate * 4}
              cy={200 - interestRate * 4}
              r="6"
              fill="#ef4444"
              stroke="white"
              strokeWidth="2"
            />
            
            {/* Labels */}
            <text x="200" y="190" textAnchor="middle" className="text-xs fill-slate-600">Utilization Rate (%)</text>
            <text x="20" y="20" className="text-xs fill-slate-600">Interest Rate (%)</text>
          </svg>
        </div>
      </div>

      {/* Risk Warning */}
      {showRiskWarning && (
        <div className="bg-rose-100 border border-rose-200 rounded-lg p-4 w-full max-w-4xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
            <div className="text-rose-800 font-semibold">High Utilization Warning</div>
          </div>
          <div className="text-rose-700 text-sm mt-1">
            Utilization above 90% creates withdrawal risk. Depositors may not be able to access their funds immediately.
          </div>
        </div>
      )}
    </div>
  );
}
"use client";
import { useState } from 'react';

export function BorrowRateVisualizer() {
  const [utilization, setUtilization] = useState(50);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Interest rate curve calculation
  const calculateBorrowRate = (util: number) => {
    if (util <= 80) {
      return 0.5 + (util / 80) * 4.5; // 0.5% to 5% for 0-80% utilization
    } else {
      return 5 + ((util - 80) / 20) * 45; // 5% to 50% for 80-100% utilization
    }
  };

  const borrowRate = calculateBorrowRate(utilization);
  const totalDeposited = 1000;
  const borrowed = (utilization / 100) * totalDeposited;
  const available = totalDeposited - borrowed;

  const animateScenario = async (targetUtilization: number) => {
    setIsAnimating(true);
    setAnimationStep(1);
    
    // Step through animation
    setTimeout(() => setAnimationStep(2), 1000);
    setTimeout(() => {
      setUtilization(targetUtilization);
      setAnimationStep(3);
    }, 2000);
    setTimeout(() => {
      setAnimationStep(0);
      setIsAnimating(false);
    }, 3500);
  };

  const getUtilizationColor = () => {
    if (utilization < 50) return 'bg-emerald-500';
    if (utilization < 80) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getRateColor = () => {
    if (borrowRate < 3) return 'text-emerald-600';
    if (borrowRate < 10) return 'text-amber-600';
    return 'text-rose-600';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">DeFi Borrow Rate Dynamics</h3>
        <p className="text-slate-600">Interactive demonstration of how utilization affects borrowing costs in lending protocols</p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pool Visualization */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Lending Pool Status</h4>
          
          {/* Pool Visual */}
          <div className="relative w-full h-48 bg-slate-100 rounded-lg border-2 border-slate-300 overflow-hidden mb-4">
            <div className="absolute bottom-0 w-full bg-blue-200 transition-all duration-500" 
                 style={{height: `${(totalDeposited / 1200) * 100}%`}}>
              <div className="text-xs text-blue-800 p-2 font-medium">Total Deposited</div>
            </div>
            <div className="absolute bottom-0 w-full transition-all duration-500" 
                 style={{height: `${(borrowed / 1200) * 100}%`}}>
              <div className={`h-full ${getUtilizationColor()} opacity-80`}>
                <div className="text-xs text-white p-2 font-medium">Borrowed</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{totalDeposited}</div>
              <div className="text-xs text-slate-600">ETH Deposited</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{borrowed.toFixed(0)}</div>
              <div className="text-xs text-slate-600">ETH Borrowed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{available.toFixed(0)}</div>
              <div className="text-xs text-slate-600">ETH Available</div>
            </div>
          </div>
        </div>

        {/* Interest Rate Curve */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Interest Rate Curve</h4>
          
          <div className="relative w-full h-48 mb-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)"/>
              
              {/* Rate curve */}
              <path 
                d="M 0 95 L 80 75 Q 85 70 100 5" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="2"
              />
              
              {/* Current position */}
              <circle 
                cx={utilization} 
                cy={100 - (borrowRate * 1.8)} 
                r="3" 
                fill="#ef4444"
                className="transition-all duration-500"
              />
              
              {/* Kink point at 80% */}
              <circle cx="80" cy="25" r="2" fill="#f59e0b"/>
            </svg>
          </div>

          <div className="text-center">
            <div className={`text-3xl font-bold ${getRateColor()} mb-1`}>
              {borrowRate.toFixed(2)}%
            </div>
            <div className="text-sm text-slate-600">APY Borrow Rate</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Utilization Control</h4>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-700">Pool Utilization</span>
              <span className="font-bold text-slate-800">{utilization}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={utilization}
              onChange={(e) => setUtilization(parseInt(e.target.value))}
              disabled={isAnimating}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0%</span>
              <span className="text-amber-600">80% (Kink)</span>
              <span>100%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => animateScenario(25)}
              disabled={isAnimating}
              className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Low Demand (25%)
            </button>
            <button
              onClick={() => animateScenario(78)}
              disabled={isAnimating}
              className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              High Demand (78%)
            </button>
            <button
              onClick={() => animateScenario(95)}
              disabled={isAnimating}
              className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Critical (95%)
            </button>
          </div>

          {animationStep > 0 && (
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="text-sm text-indigo-800 font-medium">
                {animationStep === 1 && "📈 Market demand changing..."}
                {animationStep === 2 && "⚡ Protocol adjusting rates..."}
                {animationStep === 3 && "✅ New equilibrium reached!"}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center max-w-2xl">
        <p className="text-sm text-slate-600">
          Move the slider or click scenarios to see how DeFi protocols use dynamic interest rates to balance supply and demand. 
          Notice the sharp increase after 80% utilization - this "kink" protects the protocol from liquidity shortages.
        </p>
      </div>
    </div>
  );
}
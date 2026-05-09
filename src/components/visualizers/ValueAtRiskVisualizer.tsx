"use client";

import { useState, useEffect } from 'react';

export function ValueAtRiskVisualizer() {
  const [portfolioValue, setPortfolioValue] = useState(1000000);
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  const [timeHorizon, setTimeHorizon] = useState(1);
  const [volatility, setVolatility] = useState(15);
  const [showSimulation, setShowSimulation] = useState(false);
  const [simulationDay, setSimulationDay] = useState(0);

  // Generate realistic daily returns based on normal distribution
  const generateDailyReturns = (days: number, vol: number) => {
    const returns = [];
    for (let i = 0; i < days; i++) {
      // Box-Muller transformation for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const dailyReturn = z * (vol / 100) / Math.sqrt(252); // Convert annual volatility to daily
      returns.push(dailyReturn);
    }
    return returns.sort((a, b) => a - b); // Sort for percentile calculation
  };

  const dailyReturns = generateDailyReturns(1000, volatility);
  
  // Calculate VaR using historical simulation method
  const calculateVaR = () => {
    const percentileIndex = Math.floor(((100 - confidenceLevel) / 100) * dailyReturns.length);
    const varReturn = dailyReturns[percentileIndex];
    const varAmount = Math.abs(varReturn * portfolioValue * Math.sqrt(timeHorizon));
    return { varReturn, varAmount };
  };

  const { varReturn, varAmount } = calculateVaR();
  const riskProbability = 100 - confidenceLevel;

  // Simulation data for visualization
  const simulationReturns = dailyReturns.slice(0, 100);
  
  useEffect(() => {
    if (showSimulation) {
      const timer = setInterval(() => {
        setSimulationDay((prev) => {
          if (prev >= 99) {
            setShowSimulation(false);
            return 0;
          }
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [showSimulation]);

  const getCurrentPortfolioValue = () => {
    if (!showSimulation) return portfolioValue;
    const currentReturn = simulationReturns[simulationDay];
    return portfolioValue * (1 + currentReturn);
  };

  const getCurrentLoss = () => {
    const currentValue = getCurrentPortfolioValue();
    return portfolioValue - currentValue;
  };

  const isVaRExceeded = () => {
    return getCurrentLoss() > varAmount;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Value at Risk (VaR) Calculator</h3>
        <p className="text-slate-600">Adjust parameters to see how VaR quantifies maximum expected loss at different confidence levels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Controls */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Portfolio Parameters</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Portfolio Value: ${portfolioValue.toLocaleString()}
              </label>
              <input
                type="range"
                min="100000"
                max="10000000"
                step="100000"
                value={portfolioValue}
                onChange={(e) => setPortfolioValue(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confidence Level: {confidenceLevel}%
              </label>
              <input
                type="range"
                min="90"
                max="99"
                step="1"
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Annual Volatility: {volatility}%
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={volatility}
                onChange={(e) => setVolatility(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Time Horizon: {timeHorizon} day{timeHorizon > 1 ? 's' : ''}
              </label>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setShowSimulation(true);
              setSimulationDay(0);
            }}
            disabled={showSimulation}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {showSimulation ? 'Simulating...' : 'Run 100-Day Simulation'}
          </button>
        </div>

        {/* VaR Results */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">VaR Calculation</h4>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Value at Risk</div>
              <div className="text-2xl font-bold text-blue-800">${varAmount.toLocaleString()}</div>
              <div className="text-sm text-blue-600 mt-1">
                {timeHorizon}-day {confidenceLevel}% VaR
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-sm text-slate-600">This means:</div>
              <div className="text-slate-800 font-medium">
                • {confidenceLevel}% probability of losing less than ${varAmount.toLocaleString()}
              </div>
              <div className="text-slate-800 font-medium">
                • {riskProbability}% probability of losing more than ${varAmount.toLocaleString()}
              </div>
            </div>

            {showSimulation && (
              <div className={`p-4 rounded-lg ${isVaRExceeded() ? 'bg-rose-50' : 'bg-emerald-50'}`}>
                <div className="text-sm font-medium mb-2">
                  Day {simulationDay + 1}/100
                </div>
                <div className="text-sm">
                  Portfolio Value: ${getCurrentPortfolioValue().toLocaleString()}
                </div>
                <div className="text-sm">
                  Loss: ${getCurrentLoss().toLocaleString()}
                </div>
                {isVaRExceeded() && (
                  <div className="text-sm font-semibold text-rose-600 mt-1">
                    ⚠️ VaR Exceeded!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Distribution Visualization */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 w-full max-w-6xl">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Return Distribution & VaR Threshold</h4>
        
        <div className="relative h-64 bg-slate-50 rounded-lg p-4">
          <div className="flex items-end justify-center h-full space-x-1">
            {/* Histogram bars */}
            {Array.from({ length: 50 }, (_, i) => {
              const returnRange = dailyReturns.slice(i * 20, (i + 1) * 20);
              const height = Math.max(returnRange.length * 3, 8);
              const isInVaRRegion = returnRange.some(r => r <= varReturn);
              
              return (
                <div
                  key={i}
                  className={`w-3 rounded-t ${
                    isInVaRRegion ? 'bg-rose-400' : 'bg-blue-400'
                  } transition-all duration-300`}
                  style={{ height: `${height}px` }}
                />
              );
            })}
          </div>
          
          {/* VaR line */}
          <div className="absolute bottom-4 left-20 bg-rose-600 w-0.5 h-full opacity-80" />
          <div className="absolute bottom-2 left-16 text-xs text-rose-600 font-semibold bg-white px-2 py-1 rounded">
            {riskProbability}% VaR
          </div>
          
          {/* Labels */}
          <div className="absolute bottom-2 left-4 text-xs text-slate-600">Losses</div>
          <div className="absolute bottom-2 right-4 text-xs text-slate-600">Gains</div>
        </div>
      </div>
    </div>
  );
}
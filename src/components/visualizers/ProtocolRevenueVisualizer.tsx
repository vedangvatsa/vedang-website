"use client";

import { useState, useEffect } from 'react';

export function ProtocolRevenueVisualizer() {
  const [selectedProtocol, setSelectedProtocol] = useState<'uniswap' | 'lido' | 'aave' | 'maker'>('uniswap');
  const [timeStep, setTimeStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userVolume, setUserVolume] = useState(1000000);

  const protocols = {
    uniswap: {
      name: 'Uniswap',
      color: 'rose',
      feeRate: 0.003,
      description: 'Trading fees from swaps',
      metric: 'Trading Volume',
      unit: '$'
    },
    lido: {
      name: 'Lido',
      color: 'blue',
      feeRate: 0.10,
      description: 'Commission on staking rewards',
      metric: 'Staking Rewards',
      unit: '$'
    },
    aave: {
      name: 'Aave',
      color: 'indigo',
      feeRate: 0.15,
      description: 'Interest rate spread',
      metric: 'Lending Volume',
      unit: '$'
    },
    maker: {
      name: 'MakerDAO',
      color: 'emerald',
      feeRate: 0.025,
      description: 'Stability fees on DAI loans',
      metric: 'DAI Borrowed',
      unit: '$'
    }
  };

  const currentProtocol = protocols[selectedProtocol];
  const revenue = userVolume * currentProtocol.feeRate;

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setTimeStep(prev => {
          if (prev >= 100) {
            setIsAnimating(false);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  const startAnimation = () => {
    setTimeStep(0);
    setIsAnimating(true);
  };

  const resetAnimation = () => {
    setTimeStep(0);
    setIsAnimating(false);
  };

  const getColorClasses = (color: string) => ({
    bg: `bg-${color}-500`,
    bgLight: `bg-${color}-100`,
    border: `border-${color}-500`,
    text: `text-${color}-600`,
    bgGradient: `from-${color}-400 to-${color}-600`
  });

  const colorClasses = getColorClasses(currentProtocol.color);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Protocol Revenue</h3>
        <p className="text-lg text-slate-600 max-w-2xl">
          Explore how different DeFi protocols generate revenue from user activity and fees
        </p>
      </div>

      {/* Protocol Selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(protocols).map(([key, protocol]) => {
          const isSelected = selectedProtocol === key;
          const colors = getColorClasses(protocol.color);
          return (
            <button
              key={key}
              onClick={() => {
                setSelectedProtocol(key as 'uniswap' | 'lido' | 'aave' | 'maker');
                resetAnimation();
              }}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                isSelected 
                  ? `${colors.bg} ${colors.border} text-white` 
                  : `${colors.bgLight} ${colors.border} ${colors.text} hover:${colors.bg} hover:text-white`
              }`}
            >
              {protocol.name}
            </button>
          );
        })}
      </div>

      {/* Volume Input */}
      <div className="w-full max-w-md">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {currentProtocol.metric}: ${userVolume.toLocaleString()}
        </label>
        <input
          type="range"
          min="100000"
          max="10000000"
          step="100000"
          value={userVolume}
          onChange={(e) => {
            setUserVolume(parseInt(e.target.value));
            resetAnimation();
          }}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>$100K</span>
          <span>$10M</span>
        </div>
      </div>

      {/* Revenue Visualization */}
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className={`text-xl font-semibold ${colorClasses.text}`}>
              {currentProtocol.name} Revenue Model
            </h4>
            <div className="flex gap-2">
              <button
                onClick={startAnimation}
                disabled={isAnimating}
                className={`px-4 py-2 ${colorClasses.bg} text-white rounded-lg hover:opacity-80 disabled:opacity-50`}
              >
                {isAnimating ? 'Processing...' : 'Show Flow'}
              </button>
              <button
                onClick={resetAnimation}
                className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Flow Visualization */}
          <div className="flex items-center justify-between mb-6">
            {/* User Activity */}
            <div className="text-center">
              <div className={`w-24 h-24 ${colorClasses.bgLight} rounded-full flex items-center justify-center border-4 ${colorClasses.border} transition-all duration-500 ${timeStep > 20 ? 'scale-110 shadow-lg' : ''}`}>
                <div className="text-center">
                  <div className={`text-2xl ${colorClasses.text} font-bold`}>👤</div>
                </div>
              </div>
              <div className="mt-2 text-sm font-medium text-slate-700">User Activity</div>
              <div className="text-xs text-slate-500">${userVolume.toLocaleString()}</div>
            </div>

            {/* Arrow */}
            <div className="flex-1 mx-4">
              <div className="relative">
                <div className="h-1 bg-slate-200 rounded"></div>
                <div 
                  className={`h-1 ${colorClasses.bg} rounded transition-all duration-1000 ease-out`}
                  style={{ width: `${timeStep}%` }}
                ></div>
                <div 
                  className={`absolute right-0 top-1/2 transform -translate-y-1/2 transition-all duration-1000 ${timeStep > 80 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                >
                  <div className={`w-0 h-0 border-l-8 ${colorClasses.border} border-t-4 border-b-4 border-t-transparent border-b-transparent`}></div>
                </div>
              </div>
              <div className="text-center mt-2 text-xs text-slate-500">
                {currentProtocol.description}
              </div>
            </div>

            {/* Protocol Revenue */}
            <div className="text-center">
              <div className={`w-24 h-24 bg-gradient-to-br ${colorClasses.bgGradient} rounded-full flex items-center justify-center border-4 border-amber-300 transition-all duration-500 ${timeStep > 80 ? 'scale-110 shadow-lg animate-pulse' : ''}`}>
                <div className="text-center">
                  <div className="text-2xl text-white font-bold">💰</div>
                </div>
              </div>
              <div className="mt-2 text-sm font-medium text-slate-700">Protocol Revenue</div>
              <div className={`text-xs font-bold ${timeStep > 80 ? colorClasses.text : 'text-slate-400'}`}>
                ${revenue.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Revenue Breakdown */}
          {timeStep > 50 && (
            <div className={`${colorClasses.bgLight} rounded-lg p-4 transition-opacity duration-500`}>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-slate-600">Fee Rate</div>
                  <div className={`text-lg font-bold ${colorClasses.text}`}>
                    {(currentProtocol.feeRate * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Volume</div>
                  <div className={`text-lg font-bold ${colorClasses.text}`}>
                    ${userVolume.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Revenue Generated</div>
                  <div className={`text-lg font-bold ${colorClasses.text}`}>
                    ${revenue.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Insight */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-2xl text-center">
        <div className="text-amber-800">
          <strong>💡 Key Insight:</strong> Protocol revenue determines sustainability and value accrual to token holders. 
          Higher revenue protocols can better weather market downturns and provide real economic value to stakeholders.
        </div>
      </div>
    </div>
  );
}
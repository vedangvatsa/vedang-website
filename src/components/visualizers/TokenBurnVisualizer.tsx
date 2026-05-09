"use client";

import { useState, useEffect } from 'react';

export function TokenBurnVisualizer() {
  const [totalSupply, setTotalSupply] = useState(1000000);
  const [burnAmount, setBurnAmount] = useState(0);
  const [burnedTokens, setBurnedTokens] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [burnType, setBurnType] = useState<'manual' | 'automatic'>('manual');
  const [transactionCount, setTransactionCount] = useState(0);
  const [autoBurnRate, setAutoBurnRate] = useState(0.1);

  const currentSupply = totalSupply - burnedTokens;
  const burnPercentage = burnedTokens > 0 ? (burnedTokens / totalSupply) * 100 : 0;
  const supplyReduction = totalSupply > 0 ? ((totalSupply - currentSupply) / totalSupply) * 100 : 0;

  const executeBurn = () => {
    if (burnAmount > 0 && burnAmount <= currentSupply && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setBurnedTokens(prev => prev + burnAmount);
        setBurnAmount(0);
        setIsAnimating(false);
      }, 1000);
    }
  };

  const executeAutoBurn = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      const burnAmount = Math.floor(currentSupply * (autoBurnRate / 100));
      setTimeout(() => {
        setBurnedTokens(prev => prev + burnAmount);
        setTransactionCount(prev => prev + 1);
        setIsAnimating(false);
      }, 800);
    }
  };

  const resetSupply = () => {
    setBurnedTokens(0);
    setBurnAmount(0);
    setTransactionCount(0);
  };

  const renderTokens = () => {
    const totalBars = 50;
    const burnedBars = Math.floor((burnedTokens / totalSupply) * totalBars);
    const activeBars = totalBars - burnedBars;

    return (
      <div className="flex flex-wrap gap-1 p-4 bg-slate-100 rounded-lg">
        {Array.from({ length: activeBars }, (_, i) => (
          <div
            key={`active-${i}`}
            className="w-3 h-6 bg-emerald-500 rounded transition-all duration-300"
          />
        ))}
        {Array.from({ length: burnedBars }, (_, i) => (
          <div
            key={`burned-${i}`}
            className={`w-3 h-6 rounded transition-all duration-1000 ${
              isAnimating ? 'bg-rose-400 animate-pulse' : 'bg-slate-400 opacity-50'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Token Burn Mechanism</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how token burning permanently removes tokens from circulation, creating deflationary pressure and reducing total supply.
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setBurnType('manual')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            burnType === 'manual' 
              ? 'bg-blue-500 text-white' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Manual Burn
        </button>
        <button
          onClick={() => setBurnType('automatic')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            burnType === 'automatic' 
              ? 'bg-indigo-500 text-white' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Automatic Burn
        </button>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Token Supply Visualization</h4>
            {renderTokens()}
            <div className="mt-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                <span>Circulating Tokens</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-3 h-3 bg-slate-400 opacity-50 rounded"></div>
                <span>Burned Tokens</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Supply Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Original Supply:</span>
                <span className="font-semibold text-slate-800">{totalSupply.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Current Supply:</span>
                <span className="font-semibold text-emerald-600">{currentSupply.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Burned Tokens:</span>
                <span className="font-semibold text-rose-600">{burnedTokens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Supply Reduction:</span>
                <span className="font-semibold text-amber-600">{supplyReduction.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {burnType === 'manual' ? (
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">Manual Token Burn</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Burn Amount: {burnAmount.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={Math.min(currentSupply, 50000)}
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    disabled={isAnimating}
                  />
                </div>
                <button
                  onClick={executeBurn}
                  disabled={burnAmount === 0 || isAnimating}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    burnAmount === 0 || isAnimating
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-rose-500 text-white hover:bg-rose-600'
                  }`}
                >
                  {isAnimating ? 'Burning...' : 'Execute Burn'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">Automatic Burn (Per Transaction)</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Burn Rate: {autoBurnRate}% per transaction
                  </label>
                  <input
                    type="range"
                    min="0.01"
                    max="1"
                    step="0.01"
                    value={autoBurnRate}
                    onChange={(e) => setAutoBurnRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    disabled={isAnimating}
                  />
                </div>
                <button
                  onClick={executeAutoBurn}
                  disabled={isAnimating || currentSupply === 0}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    isAnimating || currentSupply === 0
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  }`}
                >
                  {isAnimating ? 'Processing...' : 'Simulate Transaction'}
                </button>
                <div className="text-sm text-slate-600">
                  Transactions processed: {transactionCount}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Deflationary Impact</h4>
            <div className="space-y-3">
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-amber-400 to-rose-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(burnPercentage, 100)}%` }}
                ></div>
              </div>
              <div className="text-center text-sm text-slate-600">
                {burnPercentage.toFixed(2)}% of original supply burned
              </div>
              <div className="text-xs text-slate-500 text-center">
                {burnedTokens > 0 ? 'Creating deflationary pressure' : 'No deflationary pressure yet'}
              </div>
            </div>
          </div>

          <button
            onClick={resetSupply}
            className="w-full py-2 px-4 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Reset Supply
          </button>
        </div>
      </div>

      <div className="text-xs text-slate-500 max-w-3xl text-center">
        Token burning permanently removes tokens by sending them to inaccessible addresses. 
        Manual burns are controlled by protocols, while automatic burns happen with each transaction (like Ethereum's EIP-1559).
      </div>
    </div>
  );
}
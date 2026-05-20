"use client";

import { useState, useEffect } from 'react';

export function GasFeesVisualizer() {
  const [selectedTransaction, setSelectedTransaction] = useState<'simple' | 'swap' | 'nft' | 'complex'>('simple');
  const [gasPrice, setGasPrice] = useState(20);
  const [networkCongestion, setNetworkCongestion] = useState<'low' | 'medium' | 'high'>('medium');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionProgress, setExecutionProgress] = useState(0);

  const transactions = {
    simple: { name: 'Simple Transfer', baseGas: 21000, color: 'emerald', description: 'Send ETH to another wallet' },
    swap: { name: 'Token Swap', baseGas: 65000, color: 'blue', description: 'Exchange tokens on DEX' },
    nft: { name: 'NFT Mint', baseGas: 85000, color: 'indigo', description: 'Mint an NFT' },
    complex: { name: 'Complex Contract', baseGas: 180000, color: 'rose', description: 'Multi-step DeFi operation' }
  };

  const congestionMultipliers = {
    low: { multiplier: 0.8, name: 'Low', color: 'emerald' },
    medium: { multiplier: 1.0, name: 'Medium', color: 'amber' },
    high: { multiplier: 1.5, name: 'High', color: 'rose' }
  };

  const currentTx = transactions[selectedTransaction];
  const congestionData = congestionMultipliers[networkCongestion];
  const adjustedGasLimit = Math.round(currentTx.baseGas * congestionData.multiplier);
  const totalCostWei = adjustedGasLimit * gasPrice;
  const totalCostGwei = totalCostWei / 1e9;
  const totalCostEth = totalCostGwei / 1e9;

  const executeTransaction = () => {
    setIsExecuting(true);
    setExecutionProgress(0);
    
    const duration = 3000;
    const interval = 50;
    const increment = 100 / (duration / interval);
    
    const timer = setInterval(() => {
      setExecutionProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsExecuting(false);
            setExecutionProgress(0);
          }, 500);
          return 100;
        }
        return prev + increment;
      });
    }, interval);
  };

  const getGasPriceLabel = () => {
    if (gasPrice < 15) return 'Slow & Cheap';
    if (gasPrice < 25) return 'Standard';
    if (gasPrice < 40) return 'Fast';
    return 'Fastest & Expensive';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Gas Fees Interactive Calculator</h3>
        <p className="text-slate-600">Explore how transaction type, gas price, and network congestion affect blockchain fees</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Controls */}
        <div className="space-y-6">
          {/* Transaction Type */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Transaction Type</h4>
            <div className="grid grid-cols-1 gap-3">
            {Object.entries(transactions).map(([key, tx]) => (
              <button
                key={key}
                onClick={() => setSelectedTransaction(key as 'simple' | 'swap' | 'nft' | 'complex')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTransaction === key
                      ? `border-${tx.color}-500 bg-${tx.color}-50`
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-medium text-slate-800">{tx.name}</div>
                  <div className="text-sm text-slate-600">{tx.description}</div>
                  <div className="text-sm font-mono text-slate-500 mt-1">
                    Base Gas: {tx.baseGas.toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Gas Price Slider */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Gas Price (Gwei)</h4>
            <div className="space-y-4">
              <input
                type="range"
                min="5"
                max="100"
                value={gasPrice}
                onChange={(e) => setGasPrice(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">{gasPrice} Gwei</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  gasPrice < 15 ? 'bg-emerald-100 text-emerald-800' :
                  gasPrice < 25 ? 'bg-amber-100 text-amber-800' :
                  gasPrice < 40 ? 'bg-blue-100 text-blue-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  {getGasPriceLabel()}
                </span>
              </div>
            </div>
          </div>

          {/* Network Congestion */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Network Congestion</h4>
            <div className="flex gap-2">
              {Object.entries(congestionMultipliers).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setNetworkCongestion(key as 'low' | 'medium' | 'high')}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    networkCongestion === key
                      ? `border-${data.color}-500 bg-${data.color}-50`
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-medium text-slate-800">{data.name}</div>
                  <div className="text-sm text-slate-600">{data.multiplier}x gas</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="space-y-6">
          {/* Gas Calculation Breakdown */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Gas Calculation</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Base Gas Limit:</span>
                <span className="font-mono font-medium">{currentTx.baseGas.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Congestion Multiplier:</span>
                <span className="font-mono font-medium">{congestionData.multiplier}x</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-slate-600">Adjusted Gas Limit:</span>
                <span className="font-mono font-medium">{adjustedGasLimit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-slate-600">Gas Price:</span>
                <span className="font-mono font-medium">{gasPrice} Gwei</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                  <span className="font-semibold text-slate-800">Total Fee:</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-indigo-600">
                      ${(totalCostEth * 2000).toFixed(4)}
                    </div>
                    <div className="text-sm text-slate-600 font-mono">
                      {totalCostEth.toFixed(8)} ETH
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Execution Simulation */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Transaction Execution</h4>
            <button
              onClick={executeTransaction}
              disabled={isExecuting}
              className={`w-full py-4 px-6 rounded-lg font-semibold transition-all ${
                isExecuting
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : `bg-${currentTx.color}-500 hover:bg-${currentTx.color}-600 text-white`
              }`}
            >
              {isExecuting ? 'Processing...' : 'Execute Transaction'}
            </button>
            
            {isExecuting && (
              <div className="mt-4 space-y-3">
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className={`bg-${currentTx.color}-500 h-3 rounded-full transition-all duration-300`}
                    style={{ width: `${executionProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Gas consumed: {Math.round(adjustedGasLimit * executionProgress / 100).toLocaleString()}</span>
                  <span className="text-slate-600">{Math.round(executionProgress)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 max-w-4xl">
        <p className="text-blue-800 text-sm">
          <strong>How it works:</strong> Gas fees = Gas Limit × Gas Price. More complex operations need more gas. 
          Higher gas prices get faster confirmation. Network congestion increases gas requirements.
        </p>
      </div>
    </div>
  );
}
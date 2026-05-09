"use client";

import React, { useState } from 'react';

export function LiquidityProviderVisualizer() {
  const [ethAmount, setEthAmount] = useState(10);
  const [usdcAmount, setUsdcAmount] = useState(20000);
  const [totalTrades, setTotalTrades] = useState(0);
  const [isDeposited, setIsDeposited] = useState(false);
  const [poolEth, setPoolEth] = useState(100);
  const [poolUsdc, setPoolUsdc] = useState(200000);
  const [lpShare, setLpShare] = useState(0);
  const [earnedFees, setEarnedFees] = useState(0);

  const depositLiquidity = () => {
    const newPoolEth = poolEth + ethAmount;
    const newPoolUsdc = poolUsdc + usdcAmount;
    const share = (ethAmount / newPoolEth) * 100;
    
    setPoolEth(newPoolEth);
    setPoolUsdc(newPoolUsdc);
    setLpShare(share);
    setIsDeposited(true);
  };

  const simulateTrade = () => {
    const tradeVolume = 1000; // USDC
    const feeRate = 0.003; // 0.3%
    const tradeFee = tradeVolume * feeRate;
    const userFees = tradeFee * (lpShare / 100);
    
    setTotalTrades(prev => prev + 1);
    setEarnedFees(prev => prev + userFees);
    setPoolUsdc(prev => prev + tradeFee);
  };

  const withdrawLiquidity = () => {
    const withdrawEth = (lpShare / 100) * poolEth;
    const withdrawUsdc = (lpShare / 100) * poolUsdc;
    
    setPoolEth(prev => prev - withdrawEth);
    setPoolUsdc(prev => prev - withdrawUsdc);
    setEthAmount(withdrawEth);
    setUsdcAmount(withdrawUsdc);
    setIsDeposited(false);
    setLpShare(0);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Liquidity Provider Simulator</h3>
        <p className="text-slate-600">Deposit tokens into an AMM pool, earn fees from trades, and see your returns grow</p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl">
        {/* User Wallet */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm min-w-64">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Your Wallet</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-medium">ETH:</span>
              <span className="text-slate-800 font-mono">{ethAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-emerald-600 font-medium">USDC:</span>
              <span className="text-slate-800 font-mono">{usdcAmount.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-amber-600 font-medium">Fees Earned:</span>
              <span className="text-slate-800 font-mono">${earnedFees.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Pool Visualization */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm min-w-80">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">AMM Pool (ETH/USDC)</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-blue-100 rounded-lg p-3">
                <div className="text-blue-600 font-medium">ETH</div>
                <div className="text-slate-800 font-mono text-lg">{poolEth.toFixed(2)}</div>
              </div>
              <div className="text-slate-400">+</div>
              <div className="flex-1 bg-emerald-100 rounded-lg p-3">
                <div className="text-emerald-600 font-medium">USDC</div>
                <div className="text-slate-800 font-mono text-lg">{poolUsdc.toFixed(0)}</div>
              </div>
            </div>
            {lpShare > 0 && (
              <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                <div className="text-indigo-600 font-medium">Your Pool Share</div>
                <div className="text-slate-800 font-mono text-lg">{lpShare.toFixed(2)}%</div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm min-w-64">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Controls</h4>
          
          {!isDeposited ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">ETH Amount</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={ethAmount}
                  onChange={(e) => setEthAmount(Number(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-sm text-slate-500 mt-1">{ethAmount} ETH</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">USDC Amount</label>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={usdcAmount}
                  onChange={(e) => setUsdcAmount(Number(e.target.value))}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-sm text-slate-500 mt-1">{usdcAmount} USDC</div>
              </div>
              
              <button
                onClick={depositLiquidity}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Deposit Liquidity
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={simulateTrade}
                className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Simulate Trade ({totalTrades} completed)
              </button>
              
              <button
                onClick={withdrawLiquidity}
                className="w-full bg-rose-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-rose-700 transition-colors"
              >
                Withdraw Liquidity
              </button>
              
              <div className="text-sm text-slate-600 text-center">
                Each trade generates ~$3 in fees<br/>
                You earn {lpShare.toFixed(2)}% of all fees
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Messages */}
      <div className="text-center max-w-2xl">
        {!isDeposited ? (
          <p className="text-slate-600">
            💡 Adjust your token amounts and deposit into the pool to start earning trading fees
          </p>
        ) : (
          <p className="text-slate-600">
            🎉 You're now a liquidity provider! Click "Simulate Trade" to see how traders pay fees to your pool
          </p>
        )}
      </div>
    </div>
  );
}
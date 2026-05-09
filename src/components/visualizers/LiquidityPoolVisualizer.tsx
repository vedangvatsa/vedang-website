"use client";

import { useState, useEffect } from 'react';

export function LiquidityPoolVisualizer() {
  const [ethReserve, setEthReserve] = useState(1000);
  const [usdcReserve, setUsdcReserve] = useState(2000000);
  const [swapAmount, setSwapAmount] = useState(10);
  const [swapDirection, setSwapDirection] = useState<'ethToUsdc' | 'usdcToEth'>('ethToUsdc');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showImpact, setShowImpact] = useState(false);

  const k = ethReserve * usdcReserve;
  const currentPrice = usdcReserve / ethReserve;

  const calculateSwapOutput = () => {
    const fee = 0.003; // 0.3% fee
    if (swapDirection === 'ethToUsdc') {
      const ethAfterFee = swapAmount * (1 - fee);
      const newEthReserve = ethReserve + ethAfterFee;
      const newUsdcReserve = k / newEthReserve;
      return {
        output: usdcReserve - newUsdcReserve,
        newEthReserve,
        newUsdcReserve,
        newPrice: newUsdcReserve / newEthReserve,
        priceImpact: ((newUsdcReserve / newEthReserve - currentPrice) / currentPrice) * 100
      };
    } else {
      const usdcAfterFee = swapAmount * (1 - fee);
      const newUsdcReserve = usdcReserve + usdcAfterFee;
      const newEthReserve = k / newUsdcReserve;
      return {
        output: ethReserve - newEthReserve,
        newEthReserve,
        newUsdcReserve,
        newPrice: newUsdcReserve / newEthReserve,
        priceImpact: ((newUsdcReserve / newEthReserve - currentPrice) / currentPrice) * 100
      };
    }
  };

  const swapResult = calculateSwapOutput();

  const executeSwap = () => {
    setIsAnimating(true);
    setShowImpact(true);
    setTimeout(() => {
      setEthReserve(swapResult.newEthReserve);
      setUsdcReserve(swapResult.newUsdcReserve);
      setIsAnimating(false);
    }, 1000);
  };

  const resetPool = () => {
    setEthReserve(1000);
    setUsdcReserve(2000000);
    setShowImpact(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Liquidity Pool Visualizer</h3>
        <p className="text-slate-600 max-w-2xl">
          Interactive simulation of an ETH/USDC liquidity pool. Adjust swap parameters and see how trades affect reserves and prices in real-time.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Pool Visualization */}
        <div className="flex-1 bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-4 text-center">Liquidity Pool</h4>
          
          <div className="flex flex-col items-center gap-6">
            {/* Pool Reserves */}
            <div className="flex gap-4 w-full max-w-md">
              <div className={`flex-1 bg-blue-100 rounded-lg p-4 border-2 transition-all duration-1000 ${
                isAnimating && swapDirection === 'ethToUsdc' ? 'border-blue-500 shadow-lg' : 'border-blue-200'
              }`}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-800">{ethReserve.toFixed(1)}</div>
                  <div className="text-blue-600 text-sm font-medium">ETH</div>
                </div>
              </div>
              
              <div className={`flex-1 bg-emerald-100 rounded-lg p-4 border-2 transition-all duration-1000 ${
                isAnimating && swapDirection === 'usdcToEth' ? 'border-emerald-500 shadow-lg' : 'border-emerald-200'
              }`}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-800">{usdcReserve.toLocaleString()}</div>
                  <div className="text-emerald-600 text-sm font-medium">USDC</div>
                </div>
              </div>
            </div>

            {/* Current Price */}
            <div className="bg-slate-100 rounded-lg p-4 w-full max-w-md">
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Current Price</div>
                <div className="text-xl font-bold text-slate-800">1 ETH = ${currentPrice.toFixed(2)}</div>
                {showImpact && (
                  <div className={`text-sm font-medium mt-1 ${
                    Math.abs(swapResult.priceImpact) > 1 ? 'text-rose-600' : 'text-amber-600'
                  }`}>
                    Impact: {swapResult.priceImpact > 0 ? '+' : ''}{swapResult.priceImpact.toFixed(3)}%
                  </div>
                )}
              </div>
            </div>

            {/* Constant Product Formula */}
            <div className="bg-indigo-50 rounded-lg p-4 w-full max-w-md">
              <div className="text-center">
                <div className="text-sm text-indigo-600 mb-1">Constant Product (k)</div>
                <div className="text-lg font-mono text-indigo-800">
                  {ethReserve.toFixed(1)} × {usdcReserve.toLocaleString()} = {(k/1000000).toFixed(1)}M
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Swap Interface */}
        <div className="flex-1 bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-4 text-center">Swap Interface</h4>
          
          <div className="space-y-6">
            {/* Direction Toggle */}
            <div className="flex rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setSwapDirection('ethToUsdc')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  swapDirection === 'ethToUsdc'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                ETH → USDC
              </button>
              <button
                onClick={() => setSwapDirection('usdcToEth')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  swapDirection === 'usdcToEth'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                USDC → ETH
              </button>
            </div>

            {/* Swap Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Amount to Swap
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max={swapDirection === 'ethToUsdc' ? "100" : "100000"}
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(Number(e.target.value))}
                  className="flex-1"
                />
                <div className="w-24 text-right font-mono text-slate-800">
                  {swapAmount} {swapDirection === 'ethToUsdc' ? 'ETH' : 'USDC'}
                </div>
              </div>
            </div>

            {/* Swap Preview */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-2">You will receive:</div>
              <div className="text-xl font-bold text-slate-800">
                {swapResult.output.toFixed(swapDirection === 'ethToUsdc' ? 2 : 4)} {swapDirection === 'ethToUsdc' ? 'USDC' : 'ETH'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Fee: 0.3% • Slippage: {Math.abs(swapResult.priceImpact).toFixed(3)}%
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={executeSwap}
                disabled={isAnimating}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                {isAnimating ? 'Swapping...' : 'Execute Swap'}
              </button>
              <button
                onClick={resetPool}
                className="px-4 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Price Impact Warning */}
            {Math.abs(swapResult.priceImpact) > 1 && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                <div className="text-rose-800 text-sm font-medium">⚠️ High Price Impact</div>
                <div className="text-rose-600 text-xs mt-1">
                  Large swaps significantly affect the pool price
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-slate-500 max-w-2xl">
        This simulation demonstrates how AMM pools use the constant product formula (x × y = k) to automatically set prices based on supply and demand.
      </div>
    </div>
  );
}
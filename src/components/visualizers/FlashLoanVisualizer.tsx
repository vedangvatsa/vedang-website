"use client";

import { useState } from 'react';

export function FlashLoanVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loanAmount, setLoanAmount] = useState(100000);
  const [dexAPrice, setDexAPrice] = useState(100);
  const [dexBPrice, setDexBPrice] = useState(105);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const fee = loanAmount * 0.0009; // 0.09% flash loan fee
  const tokensFromA = loanAmount / dexAPrice;
  const revenueFromB = tokensFromA * dexBPrice;
  const profit = revenueFromB - loanAmount - fee;
  const isProftable = profit > 0;

  const steps = [
    { title: "Initiate Flash Loan", desc: `Borrow $${loanAmount.toLocaleString()} from lending protocol` },
    { title: "Buy from DEX A", desc: `Purchase ${tokensFromA.toFixed(2)} tokens at $${dexAPrice}/token` },
    { title: "Sell to DEX B", desc: `Sell tokens at $${dexBPrice}/token for $${revenueFromB.toFixed(2)}` },
    { title: "Repay Loan + Fee", desc: `Return $${(loanAmount + fee).toFixed(2)} to protocol` },
    { title: "Keep Profit", desc: `Net profit: $${profit.toFixed(2)}` }
  ];

  const executeFlashLoan = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setShowResult(false);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setShowResult(true);
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const reset = () => {
    setCurrentStep(0);
    setShowResult(false);
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Flash Loan Arbitrage</h3>
        <p className="text-slate-600">Borrow, arbitrage, and repay in a single transaction</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-2">Loan Amount</label>
          <input
            type="range"
            min="50000"
            max="1000000"
            step="10000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            disabled={isAnimating}
          />
          <div className="text-lg font-semibold text-blue-600">${loanAmount.toLocaleString()}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-2">DEX A Price</label>
          <input
            type="range"
            min="90"
            max="110"
            step="1"
            value={dexAPrice}
            onChange={(e) => setDexAPrice(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            disabled={isAnimating}
          />
          <div className="text-lg font-semibold text-emerald-600">${dexAPrice}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-2">DEX B Price</label>
          <input
            type="range"
            min="90"
            max="120"
            step="1"
            value={dexBPrice}
            onChange={(e) => setDexBPrice(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            disabled={isAnimating}
          />
          <div className="text-lg font-semibold text-indigo-600">${dexBPrice}</div>
        </div>
      </div>

      {/* Transaction Flow */}
      <div className="w-full max-w-6xl">
        <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-500 ${
                currentStep >= index 
                  ? 'bg-blue-500 scale-110' 
                  : 'bg-slate-300'
              }`}>
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-1 mx-2 transition-all duration-500 ${
                  currentStep > index ? 'bg-blue-500' : 'bg-slate-300'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Step Details */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 text-center min-h-24">
          {isAnimating || showResult ? (
            <div>
              <h4 className="text-xl font-semibold text-slate-800">{steps[currentStep]?.title}</h4>
              <p className="text-slate-600 mt-2">{steps[currentStep]?.desc}</p>
            </div>
          ) : (
            <p className="text-slate-500">Click "Execute Flash Loan" to start the arbitrage process</p>
          )}
        </div>
      </div>

      {/* Result Panel */}
      {showResult && (
        <div className={`w-full max-w-2xl p-6 rounded-lg border-2 transition-all duration-500 ${
          isProftable 
            ? 'bg-emerald-50 border-emerald-200' 
            : 'bg-rose-50 border-rose-200'
        }`}>
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${
              isProftable ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {isProftable ? '✓ Profitable!' : '✗ Unprofitable'}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Revenue:</span>
                <span className="font-semibold ml-2">${revenueFromB.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-600">Costs:</span>
                <span className="font-semibold ml-2">${(loanAmount + fee).toFixed(2)}</span>
              </div>
            </div>
            <div className={`text-xl font-bold mt-4 ${
              isProftable ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              Net: ${profit.toFixed(2)}
            </div>
            {!isProftable && (
              <p className="text-rose-600 text-sm mt-2">Transaction would revert - no loss!</p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={executeFlashLoan}
          disabled={isAnimating}
          className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnimating ? 'Executing...' : 'Execute Flash Loan'}
        </button>
        <button
          onClick={reset}
          className="px-6 py-3 bg-slate-500 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
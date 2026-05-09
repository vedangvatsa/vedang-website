"use client";

import { useState } from 'react';

export function RugPullVisualizer() {
  const [step, setStep] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(0.01);
  const [liquidityPool, setLiquidityPool] = useState(100000);
  const [investorTokens, setInvestorTokens] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    { title: "Project Launch", desc: "Anonymous devs create token with hype" },
    { title: "Add Liquidity", desc: "Creators add initial liquidity to DEX" },
    { title: "Marketing Push", desc: "Social media campaigns drive FOMO" },
    { title: "Investor Rush", desc: "Buyers purchase tokens, price rises" },
    { title: "Peak Hype", desc: "Maximum investment, highest token price" },
    { title: "The Rug Pull", desc: "Creators drain liquidity and disappear" },
    { title: "Aftermath", desc: "Investors left with worthless tokens" }
  ];

  const buyTokens = (investment: number) => {
    if (step >= 5) return;
    const tokens = investment / tokenPrice;
    setInvestorTokens(prev => prev + tokens);
    setTotalInvested(prev => prev + investment);
    setTokenPrice(prev => prev * 1.2);
    setLiquidityPool(prev => prev + investment);
  };

  const executeRugPull = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setLiquidityPool(0);
      setTokenPrice(0);
      setIsAnimating(false);
    }, 2000);
  };

  const resetDemo = () => {
    setStep(0);
    setTokenPrice(0.01);
    setLiquidityPool(100000);
    setInvestorTokens(0);
    setTotalInvested(0);
    setIsAnimating(false);
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      if (step === 1) setLiquidityPool(100000);
      if (step === 4) executeRugPull();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Rug Pull Simulator</h3>
        <p className="text-slate-600 max-w-2xl">Experience how cryptocurrency scams unfold as project creators abandon investors after extracting funds from liquidity pools.</p>
      </div>

      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((s, i) => (
              <div key={i} className={`flex flex-col items-center ${i <= step ? 'text-blue-600' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 ${
                  i <= step ? 'bg-blue-100 border-2 border-blue-500' : 'bg-slate-200'
                }`}>
                  {i + 1}
                </div>
                <span className="text-xs text-center max-w-20">{s.title}</span>
              </div>
            ))}
          </div>
          <div className="bg-slate-200 h-2 rounded-full">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Liquidity Pool Visualization */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold mb-4 text-slate-800">Liquidity Pool</h4>
            <div className="relative">
              <div className="w-full h-40 bg-slate-100 rounded-lg overflow-hidden relative">
                <div 
                  className={`absolute bottom-0 w-full transition-all duration-2000 ${
                    isAnimating ? 'bg-rose-500 animate-pulse' : 'bg-blue-400'
                  }`}
                  style={{ 
                    height: `${Math.max((liquidityPool / 200000) * 100, 5)}%`,
                    transition: 'height 2s ease-out'
                  }}
                />
                {isAnimating && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">DRAINING...</span>
                  </div>
                )}
              </div>
              <div className="mt-2 text-center">
                <span className="text-2xl font-bold text-slate-800">${liquidityPool.toLocaleString()}</span>
                <p className="text-slate-600">Available Liquidity</p>
              </div>
            </div>
          </div>

          {/* Token Metrics */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold mb-4 text-slate-800">Token Metrics</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Token Price:</span>
                <span className={`text-xl font-bold ${tokenPrice === 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  ${tokenPrice.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Your Tokens:</span>
                <span className="text-xl font-bold text-slate-800">{investorTokens.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Your Investment:</span>
                <span className="text-xl font-bold text-blue-600">${totalInvested}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Current Value:</span>
                <span className={`text-xl font-bold ${tokenPrice * investorTokens === 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  ${(tokenPrice * investorTokens).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 mb-6">
          <h4 className="text-lg font-semibold mb-4 text-slate-800">{steps[step].title}</h4>
          <p className="text-slate-600 mb-4">{steps[step].desc}</p>
          
          {step >= 2 && step < 5 && (
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => buyTokens(100)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Buy $100 worth
              </button>
              <button
                onClick={() => buyTokens(500)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Buy $500 worth
              </button>
              <button
                onClick={() => buyTokens(1000)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Buy $1000 worth
              </button>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={nextStep}
              disabled={step >= steps.length - 1}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {step < steps.length - 1 ? 'Next Step' : 'Complete'}
            </button>
            <button
              onClick={resetDemo}
              className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Reset Demo
            </button>
          </div>
        </div>

        {/* Warning Message */}
        {step >= 5 && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg">
            <h5 className="font-semibold text-rose-800 mb-2">⚠️ Rug Pull Complete</h5>
            <p className="text-rose-700">
              The developers have removed all liquidity from the pool and disappeared. 
              Your tokens are now worthless, and there's no way to sell them. 
              This is why it's key to research projects, verify team identities, and never invest more than you can afford to lose.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
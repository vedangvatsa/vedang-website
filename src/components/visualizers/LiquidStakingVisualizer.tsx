"use client";

import { useState } from 'react';

export function LiquidStakingVisualizer() {
  const [step, setStep] = useState(0);
  const [ethAmount, setEthAmount] = useState(32);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const stakingReward = (ethAmount * 0.04 * timeElapsed) / 12; // 4% APR, monthly periods
  const stEthValue = ethAmount + stakingReward;

  const steps = [
    'Traditional Staking',
    'Liquid Staking Protocol',
    'Receive stETH',
    'Use stETH in DeFi'
  ];

  const handleStake = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep(1);
      setIsAnimating(false);
    }, 1000);
  };

  const handleReceiveStEth = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep(2);
      setIsAnimating(false);
    }, 1000);
  };

  const handleUseDeFi = () => {
    setStep(3);
  };

  const simulateTime = () => {
    setTimeElapsed(prev => prev + 1);
  };

  const reset = () => {
    setStep(0);
    setTimeElapsed(0);
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Liquid Staking Visualization</h3>
        <p className="text-slate-600">Stake tokens while maintaining liquidity through derivative tokens</p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <label className="text-slate-700 font-medium">ETH Amount:</label>
        <input
          type="range"
          min="1"
          max="100"
          value={ethAmount}
          onChange={(e) => setEthAmount(Number(e.target.value))}
          className="w-32"
          disabled={step > 0}
        />
        <span className="text-slate-800 font-bold">{ethAmount} ETH</span>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {steps.map((stepName, index) => (
          <div
            key={index}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              index === step
                ? 'bg-blue-500 text-white'
                : index < step
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {stepName}
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-4xl h-80 bg-white rounded-xl border border-slate-200 overflow-hidden">
        {step === 0 && (
          <div className="flex items-center justify-center h-full gap-12">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {ethAmount} ETH
              </div>
              <p className="mt-2 text-slate-600">Your Tokens</p>
            </div>
            <button
              onClick={handleStake}
              className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              disabled={isAnimating}
            >
              Stake Traditionally →
            </button>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center text-slate-400">
                🔒
              </div>
              <p className="mt-2 text-slate-600">Locked Validator</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex items-center justify-center h-full gap-12">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {ethAmount} ETH
              </div>
              <p className="mt-2 text-slate-600">Your Tokens</p>
            </div>
            <button
              onClick={handleReceiveStEth}
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              disabled={isAnimating}
            >
              Use Liquid Staking →
            </button>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                Protocol
              </div>
              <p className="mt-2 text-slate-600">Lido/Rocket Pool</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex items-center justify-center h-full gap-8">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                Protocol
              </div>
              <p className="text-slate-600 text-sm">Stakes for you</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {ethAmount} stETH
              </div>
              <p className="mt-2 text-slate-600">Liquid Derivative</p>
              <button
                onClick={simulateTime}
                className="mt-2 px-4 py-1 bg-amber-500 text-white rounded text-sm hover:bg-amber-600"
              >
                +1 Month ({stakingReward.toFixed(3)} rewards)
              </button>
            </div>
            <button
              onClick={handleUseDeFi}
              className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            >
              Use in DeFi →
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-2 gap-8 p-8 h-full">
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {stEthValue.toFixed(2)}
              </div>
              <p className="mt-2 text-slate-600">stETH Value</p>
              <p className="text-emerald-600 font-medium">+{stakingReward.toFixed(3)} ETH rewards</p>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800">Trade stETH</h4>
                <p className="text-blue-600 text-sm">Sell anytime on DEXs</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <h4 className="font-medium text-indigo-800">Lend stETH</h4>
                <p className="text-indigo-600 text-sm">Earn additional yield</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                <h4 className="font-medium text-rose-800">Use as Collateral</h4>
                <p className="text-rose-600 text-sm">Borrow against stETH</p>
              </div>
            </div>
          </div>
        )}

        {(isAnimating) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
        >
          Reset Demo
        </button>
        {timeElapsed > 0 && (
          <div className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg">
            Months elapsed: {timeElapsed} | Total rewards: {stakingReward.toFixed(3)} ETH
          </div>
        )}
      </div>

      <div className="text-center text-sm text-slate-600 max-w-2xl">
        <strong>Key Benefit:</strong> Unlike traditional staking where your {ethAmount} ETH would be locked, 
        liquid staking gives you stETH tokens that you can trade, lend, or use as collateral while still earning staking rewards!
      </div>
    </div>
  );
}
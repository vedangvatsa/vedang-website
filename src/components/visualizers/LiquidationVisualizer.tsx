"use client";

import { useState } from 'react';

export function LiquidationVisualizer() {
  const [ethPrice, setEthPrice] = useState(1500);
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const ethAmount = 0.1;
  const borrowedDAI = 100;
  const liquidationThreshold = 150; // 150% collateralization ratio
  const liquidationPenalty = 12.5; // 12.5% penalty

  const collateralValue = ethPrice * ethAmount;
  const collateralizationRatio = (collateralValue / borrowedDAI) * 100;
  const isLiquidatable = collateralizationRatio < liquidationThreshold;
  
  const liquidationPrice = (borrowedDAI * liquidationThreshold) / (100 * ethAmount);
  const liquidatedAmount = borrowedDAI * 0.5; // Liquidate 50% of position
  const penaltyAmount = liquidatedAmount * (liquidationPenalty / 100);
  const liquidatorReward = liquidatedAmount + penaltyAmount;

  const handlePriceDrop = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStep(0);
    
    const steps = [
      { price: 1500, stepNum: 0 },
      { price: 1300, stepNum: 1 },
      { price: 1150, stepNum: 2 },
      { price: 1100, stepNum: 3 }
    ];

    steps.forEach((stepData, index) => {
      setTimeout(() => {
        setEthPrice(stepData.price);
        setStep(stepData.stepNum);
        if (index === steps.length - 1) {
          setIsAnimating(false);
        }
      }, index * 1000);
    });
  };

  const resetDemo = () => {
    if (isAnimating) return;
    setEthPrice(1500);
    setStep(0);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">DeFi Liquidation Mechanism</h3>
        <p className="text-slate-600">Watch how collateral gets liquidated when prices drop below the safety threshold</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Position Overview */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Your Position</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Collateral:</span>
              <span className="font-mono text-blue-600">{ethAmount} ETH</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Borrowed:</span>
              <span className="font-mono text-rose-600">{borrowedDAI} DAI</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">ETH Price:</span>
              <span className="font-mono text-slate-800">${ethPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Collateral Value:</span>
              <span className="font-mono text-blue-600">${collateralValue.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Collateralization Ratio:</span>
                <span className={`font-mono font-bold ${isLiquidatable ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {collateralizationRatio.toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isLiquidatable ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(collateralizationRatio / 2, 100)}%` }}
                />
              </div>
              <div className="text-sm text-slate-500 mt-1">
                Liquidation at {liquidationThreshold}% (${liquidationPrice.toFixed(0)} ETH price)
              </div>
            </div>
          </div>
        </div>

        {/* Price Controls */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Market Simulation</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-2">ETH Price: ${ethPrice}</label>
              <input
                type="range"
                min="800"
                max="2000"
                value={ethPrice}
                onChange={(e) => setEthPrice(Number(e.target.value))}
                disabled={isAnimating}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>$800</span>
                <span>$2000</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handlePriceDrop}
                disabled={isAnimating}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isAnimating 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                    : 'bg-rose-500 text-white hover:bg-rose-600'
                }`}
              >
                {isAnimating ? 'Simulating...' : 'Simulate Price Drop'}
              </button>
              <button
                onClick={resetDemo}
                disabled={isAnimating}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isAnimating
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-500 text-white hover:bg-slate-600'
                }`}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liquidation Flow */}
      <div className="w-full max-w-4xl">
        <h4 className="text-lg font-semibold text-slate-800 mb-4 text-center">Liquidation Process</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: "Safe Position", desc: "Collateral > 150% of debt", active: step === 0, color: "emerald" },
            { title: "Price Decline", desc: "ETH price starts falling", active: step === 1, color: "amber" },
            { title: "Near Liquidation", desc: "Approaching danger zone", active: step === 2, color: "rose" },
            { title: "LIQUIDATED", desc: "Bot repays debt, takes collateral + penalty", active: step === 3, color: "rose" }
          ].map((phase, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 transition-all duration-500 ${
              phase.active 
                ? `border-${phase.color}-500 bg-${phase.color}-50` 
                : 'border-slate-200 bg-white'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                phase.active ? `bg-${phase.color}-500 text-white` : 'bg-slate-200 text-slate-500'
              }`}>
                {index + 1}
              </div>
              <h5 className={`font-semibold mb-1 ${
                phase.active ? `text-${phase.color}-700` : 'text-slate-600'
              }`}>
                {phase.title}
              </h5>
              <p className="text-sm text-slate-600">{phase.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Liquidation Details */}
      {isLiquidatable && (
        <div className="w-full max-w-2xl bg-rose-50 border border-rose-200 p-6 rounded-xl">
          <h4 className="text-lg font-semibold text-rose-800 mb-4">⚠️ Liquidation Event</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-rose-600">Liquidated Debt:</span>
              <span className="font-mono ml-2">${liquidatedAmount}</span>
            </div>
            <div>
              <span className="text-rose-600">Penalty ({liquidationPenalty}%):</span>
              <span className="font-mono ml-2">${penaltyAmount.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-rose-600">Liquidator Gets:</span>
              <span className="font-mono ml-2">${liquidatorReward.toFixed(2)} worth of ETH</span>
            </div>
            <div>
              <span className="text-rose-600">Your Loss:</span>
              <span className="font-mono ml-2">${penaltyAmount.toFixed(2)} penalty</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
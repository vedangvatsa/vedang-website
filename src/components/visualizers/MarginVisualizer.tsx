"use client";

import React, { useState } from 'react';

export function MarginVisualizer() {
  const [positionSize, setPositionSize] = useState(10000);
  const [leverage, setLeverage] = useState(10);
  const [priceChange, setPriceChange] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const initialMargin = positionSize / leverage;
  const maintenanceMarginRate = 0.05; // 5%
  const maintenanceMargin = positionSize * maintenanceMarginRate;
  
  const pnl = (positionSize * priceChange) / 100;
  const currentEquity = initialMargin + pnl;
  const isLiquidated = currentEquity <= maintenanceMargin;
  const liquidationPrice = -((initialMargin - maintenanceMargin) / positionSize) * 100;

  const steps = [
    "Set Position Size & Leverage",
    "Calculate Initial Margin",
    "Set Maintenance Margin",
    "Simulate Price Movement",
    "Check Liquidation Risk"
  ];

  const getEquityColor = () => {
    if (isLiquidated) return 'bg-rose-500';
    if (currentEquity < maintenanceMargin * 1.5) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getEquityWidth = () => {
    const maxEquity = initialMargin * 2;
    return Math.max(0, Math.min(100, (currentEquity / maxEquity) * 100));
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Margin Trading Visualizer</h3>
        <p className="text-slate-600">Interactive demonstration of initial margin, maintenance margin, and liquidation risk</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentStep === index 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {index + 1}. {step}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Trading Parameters</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Position Size: ${positionSize.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={positionSize}
                  onChange={(e) => setPositionSize(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Leverage: {leverage}x
                </label>
                <input
                  type="range"
                  min="2"
                  max="50"
                  step="1"
                  value={leverage}
                  onChange={(e) => setLeverage(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Price Change: {priceChange > 0 ? '+' : ''}{priceChange}%
                </label>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="0.5"
                  value={priceChange}
                  onChange={(e) => setPriceChange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Margin Requirements</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Initial Margin</span>
                <span className="font-bold text-blue-600">${initialMargin.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Maintenance Margin</span>
                <span className="font-bold text-amber-600">${maintenanceMargin.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Liquidation at</span>
                <span className="font-bold text-rose-600">{liquidationPrice.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Position Status</h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Current Equity</span>
                  <span className={`font-bold ${currentEquity < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    ${currentEquity.toLocaleString()}
                  </span>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-4 relative overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${getEquityColor()}`}
                    style={{ width: `${getEquityWidth()}%` }}
                  />
                  <div 
                    className="absolute top-0 h-full w-0.5 bg-amber-600"
                    style={{ left: `${(maintenanceMargin / (initialMargin * 2)) * 100}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>$0</span>
                  <span className="text-amber-600">Maintenance</span>
                  <span>${(initialMargin * 2).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">P&L</span>
                  <span className={`font-bold ${pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {pnl >= 0 ? '+' : ''}${pnl.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Margin Ratio</span>
                  <span className={`font-bold ${currentEquity / positionSize < 0.03 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {((currentEquity / positionSize) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>

              {isLiquidated && (
                <div className="p-3 bg-rose-100 border border-rose-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-rose-800">LIQUIDATED</span>
                  </div>
                  <p className="text-xs text-rose-600 mt-1">
                    Equity fell below maintenance margin
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Risk Metrics</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <div className="text-xs text-slate-600 mb-1">Available Margin</div>
                <div className="text-lg font-bold text-indigo-600">
                  ${Math.max(0, currentEquity - maintenanceMargin).toLocaleString()}
                </div>
              </div>
              
              <div className="text-center p-3 bg-rose-50 rounded-lg">
                <div className="text-xs text-slate-600 mb-1">Risk Level</div>
                <div className={`text-lg font-bold ${
                  isLiquidated ? 'text-rose-600' : 
                  currentEquity < maintenanceMargin * 1.5 ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {isLiquidated ? 'CRITICAL' : 
                   currentEquity < maintenanceMargin * 1.5 ? 'HIGH' : 'SAFE'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
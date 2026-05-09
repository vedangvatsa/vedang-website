"use client";

import { useState } from 'react';

export function FundingRateVisualizer() {
  const [spotPrice, setSpotPrice] = useState(50000);
  const [perpPrice, setPerpPrice] = useState(51000);
  const [longPositions, setLongPositions] = useState(60);
  const [shortPositions, setShortPositions] = useState(40);
  const [timeStep, setTimeStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const fundingRate = ((perpPrice - spotPrice) / spotPrice) * 100;
  const isPositiveFunding = fundingRate > 0;
  const longBalance = 10000;
  const shortBalance = 10000;
  const paymentAmount = Math.abs(fundingRate * 100);

  const handleTimeStep = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeStep(prev => prev + 1);
    
    setTimeout(() => {
      if (isPositiveFunding) {
        // Positive funding: encourage shorts, discourage longs
        setPerpPrice(prev => Math.max(prev - 200, spotPrice));
        setLongPositions(prev => Math.max(prev - 5, 30));
        setShortPositions(prev => Math.min(prev + 5, 70));
      } else {
        // Negative funding: encourage longs, discourage shorts
        setPerpPrice(prev => Math.min(prev + 200, spotPrice));
        setLongPositions(prev => Math.min(prev + 5, 70));
        setShortPositions(prev => Math.max(prev - 5, 30));
      }
      setIsAnimating(false);
    }, 1000);
  };

  const reset = () => {
    setSpotPrice(50000);
    setPerpPrice(51000);
    setLongPositions(60);
    setShortPositions(40);
    setTimeStep(0);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Funding Rate Mechanism</h3>
        <p className="text-slate-600 max-w-2xl">
          Interactive simulation showing how funding rates balance perpetual futures prices with spot prices through trader incentives
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Price Display */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Market Prices</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Spot Price:</span>
              <span className="text-emerald-600 font-mono">${spotPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Perpetual Price:</span>
              <span className={`font-mono ${perpPrice > spotPrice ? 'text-rose-600' : perpPrice < spotPrice ? 'text-blue-600' : 'text-emerald-600'}`}>
                ${perpPrice.toLocaleString()}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Funding Rate:</span>
                <span className={`font-mono font-bold ${isPositiveFunding ? 'text-rose-600' : 'text-blue-600'}`}>
                  {fundingRate > 0 ? '+' : ''}{fundingRate.toFixed(4)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Market Sentiment */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Market Positions</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>Long Positions</span>
                <span>{longPositions}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${longPositions}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>Short Positions</span>
                <span>{shortPositions}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className="bg-rose-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${shortPositions}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Funding Payment Visualization */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 w-full max-w-2xl">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Payment Flow</h4>
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold ${isPositiveFunding ? 'bg-rose-500' : 'bg-emerald-500'}`}>
              {isPositiveFunding ? 'LONG' : 'SHORT'}
            </div>
            <p className="text-sm text-slate-600 mt-2">
              {isPositiveFunding ? 'Pays' : 'Receives'}
            </p>
            <p className="text-xs text-slate-500">
              ${(isPositiveFunding ? longBalance - paymentAmount : longBalance + paymentAmount).toFixed(0)}
            </p>
          </div>
          
          <div className="flex-1 mx-4 relative">
            <div className={`h-2 rounded-full ${isPositiveFunding ? 'bg-rose-300' : 'bg-blue-300'}`}></div>
            <div className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full ${isPositiveFunding ? 'bg-rose-500' : 'bg-blue-500'} ${isAnimating ? 'animate-pulse' : ''}`}
                 style={{ 
                   left: isPositiveFunding ? '10%' : '90%',
                   transform: 'translateY(-50%)',
                   transition: 'left 1s ease-in-out'
                 }}>
            </div>
            <p className="text-center text-xs text-slate-500 mt-1">
              ${paymentAmount.toFixed(0)}
            </p>
          </div>
          
          <div className="text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold ${isPositiveFunding ? 'bg-emerald-500' : 'bg-rose-500'}`}>
              {isPositiveFunding ? 'SHORT' : 'LONG'}
            </div>
            <p className="text-sm text-slate-600 mt-2">
              {isPositiveFunding ? 'Receives' : 'Pays'}
            </p>
            <p className="text-xs text-slate-500">
              ${(isPositiveFunding ? shortBalance + paymentAmount : shortBalance - paymentAmount).toFixed(0)}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex gap-2">
          <label className="text-sm text-slate-600">Adjust Perp Price:</label>
          <input
            type="range"
            min="48000"
            max="52000"
            step="100"
            value={perpPrice}
            onChange={(e) => setPerpPrice(Number(e.target.value))}
            className="w-32"
          />
        </div>
        <button
          onClick={handleTimeStep}
          disabled={isAnimating}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {isAnimating ? 'Processing...' : 'Next Funding Period'}
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="text-center max-w-2xl">
        <p className="text-sm text-slate-600">
          {isPositiveFunding 
            ? "Perpetual trading above spot → Positive funding makes longs pay shorts → Incentivizes shorting"
            : perpPrice < spotPrice
            ? "Perpetual trading below spot → Negative funding makes shorts pay longs → Incentivizes longing"
            : "Perpetual aligned with spot → No funding payments needed"
          }
        </p>
        <p className="text-xs text-slate-500 mt-2">Time Step: {timeStep}</p>
      </div>
    </div>
  );
}
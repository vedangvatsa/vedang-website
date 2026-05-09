"use client";

import { useState } from 'react';

export function BasisTradeVisualizer() {
  const [spotPrice, setSpotPrice] = useState(1000);
  const [futuresPrice, setFuturesPrice] = useState(1050);
  const [timeToExpiry, setTimeToExpiry] = useState(30);
  const [currentDay, setCurrentDay] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tradeType, setTradeType] = useState<'contango' | 'backwardation'>('contango');

  const basis = futuresPrice - spotPrice;
  const isContango = basis > 0;
  const convergenceRate = basis / timeToExpiry;
  
  // Calculate prices at current day
  const currentSpotPrice = spotPrice + (currentDay * convergenceRate * 0.8);
  const currentFuturesPrice = futuresPrice - (currentDay * convergenceRate * 1.2);
  
  // Trade profit calculation
  const spotPosition = isContango ? spotPrice : -spotPrice;
  const futuresPosition = isContango ? -futuresPrice : futuresPrice;
  const currentProfit = isContango 
    ? (currentSpotPrice - spotPrice) + (futuresPrice - currentFuturesPrice)
    : (spotPrice - currentSpotPrice) + (currentFuturesPrice - futuresPrice);

  const startAnimation = () => {
    setIsPlaying(true);
    setCurrentDay(0);
    
    const interval = setInterval(() => {
      setCurrentDay(prev => {
        if (prev >= timeToExpiry) {
          setIsPlaying(false);
          clearInterval(interval);
          return timeToExpiry;
        }
        return prev + 1;
      });
    }, 100);
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentDay(0);
  };

  const updateTradeType = (spot: number, futures: number) => {
    setTradeType(futures > spot ? 'contango' : 'backwardation');
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Basis Trade Visualizer</h3>
        <p className="text-slate-600">Explore how traders profit from spot-futures price differences through convergence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Controls */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Market Parameters</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Spot Price: ${spotPrice}
              </label>
              <input
                type="range"
                min="900"
                max="1100"
                value={spotPrice}
                onChange={(e) => {
                  const newSpot = Number(e.target.value);
                  setSpotPrice(newSpot);
                  updateTradeType(newSpot, futuresPrice);
                  setCurrentDay(0);
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Futures Price: ${futuresPrice}
              </label>
              <input
                type="range"
                min="900"
                max="1100"
                value={futuresPrice}
                onChange={(e) => {
                  const newFutures = Number(e.target.value);
                  setFuturesPrice(newFutures);
                  updateTradeType(spotPrice, newFutures);
                  setCurrentDay(0);
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Days to Expiry: {timeToExpiry}
              </label>
              <input
                type="range"
                min="10"
                max="90"
                value={timeToExpiry}
                onChange={(e) => {
                  setTimeToExpiry(Number(e.target.value));
                  setCurrentDay(0);
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-slate-100">
            <div className="text-sm text-slate-600">
              <div>Basis: ${basis.toFixed(2)}</div>
              <div>Market State: <span className={`font-semibold ${isContango ? 'text-blue-600' : 'text-rose-600'}`}>
                {isContango ? 'Contango' : 'Backwardation'}
              </span></div>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Price Convergence</h4>
          
          <div className="relative h-64 bg-slate-50 rounded-lg p-4 mb-4">
            <svg viewBox="0 0 300 200" className="w-full h-full">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line
                  key={i}
                  x1={0}
                  y1={40 * i}
                  x2={300}
                  y2={40 * i}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              ))}
              
              {/* Price lines */}
              <line
                x1={0}
                y1={200 - (currentSpotPrice - 950) * 2}
                x2={300}
                y2={200 - (currentSpotPrice - 950) * 2}
                stroke="#3b82f6"
                strokeWidth="3"
                strokeDasharray="5,5"
              />
              <line
                x1={0}
                y1={200 - (currentFuturesPrice - 950) * 2}
                x2={300}
                y2={200 - (currentFuturesPrice - 950) * 2}
                stroke="#ef4444"
                strokeWidth="3"
              />
              
              {/* Convergence indicator */}
              <circle
                cx={150}
                cy={200 - (currentSpotPrice - 950) * 2}
                r="6"
                fill="#3b82f6"
              />
              <circle
                cx={150}
                cy={200 - (currentFuturesPrice - 950) * 2}
                r="6"
                fill="#ef4444"
              />
              
              {/* Progress indicator */}
              <rect
                x={0}
                y={180}
                width={(currentDay / timeToExpiry) * 300}
                height="4"
                fill="#10b981"
                rx="2"
              />
            </svg>
            
            <div className="absolute top-2 right-2 text-xs text-slate-500">
              Day {currentDay} of {timeToExpiry}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-blue-500 border-dashed border-2 border-blue-500"></div>
              <span className="text-sm text-slate-600">Spot: ${currentSpotPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-red-500"></div>
              <span className="text-sm text-slate-600">Futures: ${currentFuturesPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={startAnimation}
              disabled={isPlaying}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlaying ? 'Running...' : 'Start Trade'}
            </button>
            <button
              onClick={resetAnimation}
              className="flex-1 bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Trade Strategy */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-xl border border-slate-200">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Current Strategy</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-4 rounded-lg border-2 ${isContango ? 'border-blue-500 bg-blue-50' : 'border-rose-500 bg-rose-50'}`}>
            <h5 className="font-semibold text-slate-800 mb-2">Position</h5>
            <div className="text-sm space-y-1">
              <div>Spot: {isContango ? 'BUY' : 'SELL'} at ${spotPrice}</div>
              <div>Futures: {isContango ? 'SELL' : 'BUY'} at ${futuresPrice}</div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h5 className="font-semibold text-slate-800 mb-2">Current P&L</h5>
            <div className={`text-lg font-bold ${currentProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ${currentProfit.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Target: ${Math.abs(basis).toFixed(2)}
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
            <h5 className="font-semibold text-slate-800 mb-2">Progress</h5>
            <div className="w-full bg-amber-200 rounded-full h-2 mb-2">
              <div 
                className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((currentDay / timeToExpiry) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-slate-600">
              {((currentDay / timeToExpiry) * 100).toFixed(0)}% Complete
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
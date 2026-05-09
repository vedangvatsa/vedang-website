"use client";

import React, { useState, useEffect } from 'react';

export function TwapVisualizer() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [windowSize, setWindowSize] = useState(10);
  const [manipulationDuration, setManipulationDuration] = useState(2);
  const [manipulationIntensity, setManipulationIntensity] = useState(50);

  // Generate price data with manipulation
  const generatePriceData = () => {
    const data = [];
    const basePrice = 100;
    const manipulationStart = 15;
    
    for (let i = 0; i <= 30; i++) {
      let price = basePrice + Math.sin(i * 0.3) * 5; // Natural fluctuation
      
      // Add manipulation
      if (i >= manipulationStart && i < manipulationStart + manipulationDuration) {
        price += manipulationIntensity;
      }
      
      data.push({ time: i, price: Math.max(price, 10) });
    }
    return data;
  };

  const priceData = generatePriceData();

  // Calculate TWAP for a given window
  const calculateTWAP = (endTime: number, windowSize: number) => {
    const startTime = Math.max(0, endTime - windowSize + 1);
    let totalWeightedPrice = 0;
    let totalTime = 0;

    for (let i = startTime; i <= endTime; i++) {
      if (priceData[i]) {
        totalWeightedPrice += priceData[i].price;
        totalTime += 1;
      }
    }

    return totalTime > 0 ? totalWeightedPrice / totalTime : 0;
  };

  const calculateSpotTWAP = (endTime: number, windowSize: number) => {
    // Simulate what TWAP would be if we only used spot prices
    const currentSpot = priceData[endTime]?.price || 0;
    return currentSpot;
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 30) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const currentTWAP = calculateTWAP(currentTime, windowSize);
  const currentSpot = priceData[currentTime]?.price || 0;
  const isInManipulation = currentTime >= 15 && currentTime < 15 + manipulationDuration;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Time-Weighted Average Price (TWAP)</h3>
        <p className="text-slate-600 max-w-2xl">
          TWAP calculates average price over time, making it resistant to brief manipulations. 
          Adjust parameters and watch how manipulation affects spot price vs TWAP.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-3">Controls</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">TWAP Window Size: {windowSize}</label>
              <input
                type="range"
                min="3"
                max="20"
                value={windowSize}
                onChange={(e) => setWindowSize(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm text-slate-600 mb-1">Manipulation Duration: {manipulationDuration}</label>
              <input
                type="range"
                min="1"
                max="8"
                value={manipulationDuration}
                onChange={(e) => setManipulationDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm text-slate-600 mb-1">Manipulation +${manipulationIntensity}</label>
              <input
                type="range"
                min="20"
                max="100"
                value={manipulationIntensity}
                onChange={(e) => setManipulationIntensity(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                isPlaying 
                  ? 'bg-rose-500 text-white hover:bg-rose-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isPlaying ? 'Pause' : 'Play'} Animation
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 col-span-1 md:col-span-2">
          <h4 className="font-semibold text-slate-700 mb-3">Price Chart (Time: {currentTime})</h4>
          
          <div className="relative h-64 bg-slate-50 rounded border">
            <svg className="w-full h-full">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line
                  key={i}
                  x1="0"
                  y1={`${20 + i * 20}%`}
                  x2="100%"
                  y2={`${20 + i * 20}%`}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              ))}
              
              {/* Price line */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                points={priceData.slice(0, currentTime + 1).map((point, i) => {
                  const x = (i / 30) * 100;
                  const y = 100 - ((point.price - 50) / 150) * 100;
                  return `${x},${Math.max(0, Math.min(100, y))}`;
                }).join(' ')}
              />
              
              {/* Manipulation highlight */}
              {manipulationDuration > 0 && (
                <rect
                  x={`${(15 / 30) * 100}%`}
                  y="0"
                  width={`${(manipulationDuration / 30) * 100}%`}
                  height="100%"
                  fill="rgba(239, 68, 68, 0.1)"
                  stroke="rgba(239, 68, 68, 0.3)"
                  strokeWidth="1"
                />
              )}
              
              {/* Current time indicator */}
              <line
                x1={`${(currentTime / 30) * 100}%`}
                y1="0"
                x2={`${(currentTime / 30) * 100}%`}
                y2="100%"
                stroke="#6366f1"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              
              {/* TWAP window indicator */}
              {currentTime >= windowSize - 1 && (
                <rect
                  x={`${(Math.max(0, currentTime - windowSize + 1) / 30) * 100}%`}
                  y="0"
                  width={`${(windowSize / 30) * 100}%`}
                  height="100%"
                  fill="rgba(16, 185, 129, 0.1)"
                  stroke="rgba(16, 185, 129, 0.5)"
                  strokeWidth="1"
                />
              )}
            </svg>
          </div>
          
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>Time 0</span>
            <span>Manipulation Period</span>
            <span>Time 30</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        <div className={`p-4 rounded-lg border-2 transition-colors ${
          isInManipulation ? 'bg-rose-50 border-rose-200' : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">${currentSpot.toFixed(2)}</div>
            <div className="text-sm text-slate-600">Spot Price</div>
            {isInManipulation && (
              <div className="text-xs text-rose-600 mt-1">⚠️ Under Attack</div>
            )}
          </div>
        </div>
        
        <div className="p-4 rounded-lg border-2 bg-emerald-50 border-emerald-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">${currentTWAP.toFixed(2)}</div>
            <div className="text-sm text-slate-600">TWAP ({windowSize} period)</div>
            <div className="text-xs text-emerald-600 mt-1">✓ Manipulation Resistant</div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg border-2 bg-amber-50 border-amber-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">{Math.abs(currentSpot - currentTWAP).toFixed(2)}</div>
            <div className="text-sm text-slate-600">Price Difference</div>
            <div className="text-xs text-amber-600 mt-1">Impact Measure</div>
          </div>
        </div>
      </div>

      <div className="text-center max-w-2xl">
        <p className="text-sm text-slate-600">
          Notice how TWAP remains stable during price manipulation attacks. The longer the TWAP window, 
          the more resistant it becomes to short-term manipulation, but the slower it adapts to real price changes.
        </p>
      </div>
    </div>
  );
}
"use client";

import { useState } from 'react';

export function ConcentratedLiquidityVisualizer() {
  const [selectedRange, setSelectedRange] = useState({ min: 1600, max: 2200 });
  const [currentPrice, setCurrentPrice] = useState(1900);
  const [liquidityAmount, setLiquidityAmount] = useState(10000);
  const [showV2, setShowV2] = useState(true);

  const priceRange = { min: 1000, max: 3000 };
  const totalRange = priceRange.max - priceRange.min;
  
  // Calculate liquidity distribution for V2 (uniform)
  const v2LiquidityPerDollar = liquidityAmount / totalRange;
  
  // Calculate concentrated liquidity density
  const concentratedRange = selectedRange.max - selectedRange.min;
  const v3LiquidityPerDollar = liquidityAmount / concentratedRange;
  
  // Calculate active liquidity at current price
  const isInRange = currentPrice >= selectedRange.min && currentPrice <= selectedRange.max;
  const activeLiquidityV2 = v2LiquidityPerDollar;
  const activeLiquidityV3 = isInRange ? v3LiquidityPerDollar : 0;
  
  // Calculate capital efficiency
  const capitalEfficiency = activeLiquidityV3 / activeLiquidityV2;

  const handleRangeChange = (type: 'min' | 'max', value: number) => {
    if (type === 'min' && value < selectedRange.max) {
      setSelectedRange(prev => ({ ...prev, min: value }));
    } else if (type === 'max' && value > selectedRange.min) {
      setSelectedRange(prev => ({ ...prev, max: value }));
    }
  };

  const getPositionLeft = (price: number) => {
    return ((price - priceRange.min) / totalRange) * 100;
  };

  const getBarHeight = (price: number, isV3: boolean) => {
    if (isV3) {
      return price >= selectedRange.min && price <= selectedRange.max ? 
        Math.min((v3LiquidityPerDollar / 50), 100) : 0;
    } else {
      return v2LiquidityPerDollar / 50;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Concentrated Liquidity Visualization</h3>
        <p className="text-slate-600">
          Compare how V2 spreads liquidity uniformly vs V3's concentrated approach for capital efficiency
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-center items-center bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Current ETH Price:</label>
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              step="50"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-sm font-mono text-slate-700">${currentPrice}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Liquidity:</label>
            <input
              type="range"
              min={5000}
              max={50000}
              step="1000"
              value={liquidityAmount}
              onChange={(e) => setLiquidityAmount(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-sm font-mono text-slate-700">${liquidityAmount.toLocaleString()}</span>
          </div>

          <button
            onClick={() => setShowV2(!showV2)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showV2 
                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {showV2 ? 'Hide V2' : 'Show V2'}
          </button>
        </div>

        {/* V3 Range Selection */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-3">V3 Concentrated Range</h4>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700">Min:</label>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step="25"
                value={selectedRange.min}
                onChange={(e) => handleRangeChange('min', Number(e.target.value))}
                className="w-32"
              />
              <span className="text-sm font-mono text-slate-700">${selectedRange.min}</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700">Max:</label>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step="25"
                value={selectedRange.max}
                onChange={(e) => handleRangeChange('max', Number(e.target.value))}
                className="w-32"
              />
              <span className="text-sm font-mono text-slate-700">${selectedRange.max}</span>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="space-y-6">
            {/* V2 Visualization */}
            {showV2 && (
              <div>
                <h4 className="font-semibold text-blue-700 mb-2">Uniswap V2 - Uniform Distribution</h4>
                <div className="relative h-24 bg-slate-100 rounded">
                  {Array.from({ length: 41 }, (_, i) => {
                    const price = priceRange.min + (i * totalRange / 40);
                    return (
                      <div
                        key={i}
                        className="absolute bottom-0 bg-blue-400 opacity-60"
                        style={{
                          left: `${getPositionLeft(price)}%`,
                          width: '2.5%',
                          height: `${getBarHeight(price, false)}%`
                        }}
                      />
                    );
                  })}
                  {/* Current price indicator */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-rose-500"
                    style={{ left: `${getPositionLeft(currentPrice)}%` }}
                  />
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Active Liquidity: ${activeLiquidityV2.toFixed(2)} per $1 price range
                </div>
              </div>
            )}

            {/* V3 Visualization */}
            <div>
              <h4 className="font-semibold text-indigo-700 mb-2">Uniswap V3 - Concentrated Liquidity</h4>
              <div className="relative h-24 bg-slate-100 rounded">
                {Array.from({ length: 41 }, (_, i) => {
                  const price = priceRange.min + (i * totalRange / 40);
                  const height = getBarHeight(price, true);
                  return (
                    <div
                      key={i}
                      className={`absolute bottom-0 ${
                        price >= selectedRange.min && price <= selectedRange.max
                          ? 'bg-indigo-500'
                          : 'bg-slate-300'
                      } opacity-80`}
                      style={{
                        left: `${getPositionLeft(price)}%`,
                        width: '2.5%',
                        height: `${height}%`
                      }}
                    />
                  );
                })}
                {/* Range indicators */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-emerald-500"
                  style={{ left: `${getPositionLeft(selectedRange.min)}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-emerald-500"
                  style={{ left: `${getPositionLeft(selectedRange.max)}%` }}
                />
                {/* Current price indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-rose-500"
                  style={{ left: `${getPositionLeft(currentPrice)}%` }}
                />
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Active Liquidity: ${activeLiquidityV3.toFixed(2)} per $1 price range
                {!isInRange && <span className="text-rose-600 ml-2">⚠️ Out of Range</span>}
              </div>
            </div>

            {/* Price scale */}
            <div className="relative h-4">
              <div className="absolute inset-0 flex justify-between items-center text-xs text-slate-500">
                <span>${priceRange.min}</span>
                <span>${(priceRange.min + priceRange.max) / 2}</span>
                <span>${priceRange.max}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <div className="text-emerald-800 font-semibold">Capital Efficiency</div>
            <div className="text-2xl font-bold text-emerald-700">
              {isInRange ? `${capitalEfficiency.toFixed(1)}x` : '0x'}
            </div>
            <div className="text-xs text-emerald-600">vs V2 uniform distribution</div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-blue-800 font-semibold">Range Size</div>
            <div className="text-2xl font-bold text-blue-700">
              {((concentratedRange / totalRange) * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-blue-600">of total price range</div>
          </div>
          
          <div className={`p-4 rounded-lg border ${
            isInRange 
              ? 'bg-emerald-50 border-emerald-200' 
              : 'bg-rose-50 border-rose-200'
          }`}>
            <div className={`font-semibold ${isInRange ? 'text-emerald-800' : 'text-rose-800'}`}>
              Position Status
            </div>
            <div className={`text-2xl font-bold ${isInRange ? 'text-emerald-700' : 'text-rose-700'}`}>
              {isInRange ? 'Active' : 'Inactive'}
            </div>
            <div className={`text-xs ${isInRange ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isInRange ? 'Earning fees' : 'No fees earned'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
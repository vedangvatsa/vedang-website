"use client";

import { useState, useEffect } from 'react';

export function PerpetualFuturesVisualizer() {
  const [spotPrice, setSpotPrice] = useState(50000);
  const [perpPrice, setPerpPrice] = useState(50000);
  const [position, setPosition] = useState<'long' | 'short' | null>(null);
  const [positionSize, setPositionSize] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [fundingRate, setFundingRate] = useState(0);
  const [pnl, setPnl] = useState(0);
  const [fundingPayment, setFundingPayment] = useState(0);
  const [entryPrice, setEntryPrice] = useState(50000);

  // Calculate funding rate based on price difference
  useEffect(() => {
    const priceDiff = perpPrice - spotPrice;
    const rate = (priceDiff / spotPrice) * 100 * 8; // 8 hours funding
    setFundingRate(rate);
    
    if (position) {
      const funding = position === 'long' ? -rate * positionSize * 100 : rate * positionSize * 100;
      setFundingPayment(funding);
      
      const unrealizedPnl = position === 'long' 
        ? (perpPrice - entryPrice) * positionSize
        : (entryPrice - perpPrice) * positionSize;
      setPnl(unrealizedPnl);
    }
  }, [perpPrice, spotPrice, position, positionSize, entryPrice]);

  const openPosition = (type: 'long' | 'short') => {
    setPosition(type);
    setEntryPrice(perpPrice);
    setPnl(0);
    setFundingPayment(0);
  };

  const closePosition = () => {
    setPosition(null);
    setPnl(0);
    setFundingPayment(0);
  };

  const simulateMarketMovement = () => {
    setIsAnimating(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step < 20) {
        const spotVariation = (Math.random() - 0.5) * 1000;
        const perpVariation = (Math.random() - 0.5) * 1200;
        setSpotPrice(prev => Math.max(30000, prev + spotVariation));
        setPerpPrice(prev => Math.max(30000, prev + perpVariation));
        step++;
      } else {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 200);
  };

  const resetPrices = () => {
    setSpotPrice(50000);
    setPerpPrice(50000);
    closePosition();
  };

  const getFundingColor = () => {
    if (Math.abs(fundingRate) < 0.01) return 'text-slate-600';
    return fundingRate > 0 ? 'text-rose-600' : 'text-emerald-600';
  };

  const getPriceColor = (price: number, reference: number) => {
    if (price > reference) return 'text-emerald-600';
    if (price < reference) return 'text-rose-600';
    return 'text-slate-900';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Perpetual Futures Trading</h3>
        <p className="text-slate-600 max-w-2xl">
          Interact with perpetual futures contracts that never expire. Watch how funding rates keep perp prices anchored to spot prices.
        </p>
      </div>

      {/* Price Display */}
      <div className="flex gap-8 items-center">
        <div className="text-center bg-white p-4 rounded-lg border">
          <div className="text-sm text-slate-500 mb-1">Spot Price</div>
          <div className={`text-2xl font-bold ${getPriceColor(spotPrice, 50000)}`}>
            ${spotPrice.toLocaleString()}
          </div>
        </div>
        
        <div className="text-center bg-white p-4 rounded-lg border">
          <div className="text-sm text-slate-500 mb-1">Perpetual Price</div>
          <div className={`text-2xl font-bold ${getPriceColor(perpPrice, spotPrice)}`}>
            ${perpPrice.toLocaleString()}
          </div>
        </div>

        <div className="text-center bg-white p-4 rounded-lg border">
          <div className="text-sm text-slate-500 mb-1">Funding Rate (8h)</div>
          <div className={`text-2xl font-bold ${getFundingColor()}`}>
            {fundingRate.toFixed(4)}%
          </div>
        </div>
      </div>

      {/* Price Controls */}
      <div className="flex gap-4 flex-wrap justify-center">
        <div className="flex flex-col items-center gap-2">
          <label className="text-sm text-slate-600">Spot Price</label>
          <input
            type="range"
            min="30000"
            max="70000"
            step="1000"
            value={spotPrice}
            onChange={(e) => setSpotPrice(Number(e.target.value))}
            className="w-32"
            disabled={isAnimating}
          />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <label className="text-sm text-slate-600">Perp Price</label>
          <input
            type="range"
            min="30000"
            max="70000"
            step="1000"
            value={perpPrice}
            onChange={(e) => setPerpPrice(Number(e.target.value))}
            className="w-32"
            disabled={isAnimating}
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <label className="text-sm text-slate-600">Position Size</label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={positionSize}
            onChange={(e) => setPositionSize(Number(e.target.value))}
            className="w-32"
            disabled={isAnimating}
          />
          <span className="text-xs text-slate-500">{positionSize} BTC</span>
        </div>
      </div>

      {/* Position Controls */}
      <div className="flex gap-4 flex-wrap justify-center">
        {!position ? (
          <>
            <button
              onClick={() => openPosition('long')}
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
              disabled={isAnimating}
            >
              Open Long Position
            </button>
            <button
              onClick={() => openPosition('short')}
              className="px-6 py-3 bg-rose-500 text-white rounded-lg font-semibold hover:bg-rose-600 transition-colors"
              disabled={isAnimating}
            >
              Open Short Position
            </button>
          </>
        ) : (
          <button
            onClick={closePosition}
            className="px-6 py-3 bg-slate-500 text-white rounded-lg font-semibold hover:bg-slate-600 transition-colors"
          >
            Close Position
          </button>
        )}
        
        <button
          onClick={simulateMarketMovement}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
          disabled={isAnimating}
        >
          {isAnimating ? 'Simulating...' : 'Simulate Market'}
        </button>
        
        <button
          onClick={resetPrices}
          className="px-6 py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Position Info */}
      {position && (
        <div className="bg-white p-6 rounded-lg border w-full max-w-md">
          <div className="text-center mb-4">
            <h4 className={`text-lg font-bold ${position === 'long' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {position.toUpperCase()} POSITION
            </h4>
            <div className="text-sm text-slate-500">Size: {positionSize} BTC</div>
            <div className="text-sm text-slate-500">Entry: ${entryPrice.toLocaleString()}</div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Unrealized P&L:</span>
              <span className={`font-bold ${pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ${pnl.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-600">Funding Payment:</span>
              <span className={`font-bold ${fundingPayment >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ${fundingPayment.toFixed(2)}
              </span>
            </div>
            
            <div className="pt-2 border-t">
              <div className="text-xs text-slate-500 text-center">
                {fundingRate > 0 ? 'Longs pay shorts' : 'Shorts pay longs'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="bg-blue-50 p-4 rounded-lg max-w-2xl text-sm text-slate-700">
        <div className="font-semibold mb-2">How it works:</div>
        <ul className="space-y-1 text-xs">
          <li>• When perp price > spot price: positive funding rate, longs pay shorts</li>
          <li>• When perp price < spot price: negative funding rate, shorts pay longs</li>
          <li>• Funding payments occur every 8 hours to keep prices anchored</li>
          <li>• No expiration date - positions can be held indefinitely</li>
        </ul>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from 'react';

export function LimitOrderVisualizer() {
  const [currentPrice, setCurrentPrice] = useState(105);
  const [buyLimitPrice, setBuyLimitPrice] = useState(100);
  const [sellLimitPrice, setSellLimitPrice] = useState(110);
  const [buyOrderActive, setBuyOrderActive] = useState(false);
  const [sellOrderActive, setSellOrderActive] = useState(false);
  const [buyOrderFilled, setBuyOrderFilled] = useState(false);
  const [sellOrderFilled, setSellOrderFilled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentPrice(prev => {
          const change = (Math.random() - 0.5) * 4;
          return Math.max(90, Math.min(120, prev + change));
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (buyOrderActive && currentPrice <= buyLimitPrice && !buyOrderFilled) {
      setBuyOrderFilled(true);
      setBuyOrderActive(false);
      setPosition(prev => prev + 1);
    }
    if (sellOrderActive && currentPrice >= sellLimitPrice && !sellOrderFilled) {
      setSellOrderFilled(true);
      setSellOrderActive(false);
      setPosition(prev => prev - 1);
    }
  }, [currentPrice, buyLimitPrice, sellLimitPrice, buyOrderActive, sellOrderActive, buyOrderFilled, sellOrderFilled]);

  const placeBuyOrder = () => {
    setBuyOrderActive(true);
    setBuyOrderFilled(false);
  };

  const placeSellOrder = () => {
    setSellOrderActive(true);
    setSellOrderFilled(false);
  };

  const reset = () => {
    setBuyOrderActive(false);
    setSellOrderActive(false);
    setBuyOrderFilled(false);
    setSellOrderFilled(false);
    setPosition(0);
    setCurrentPrice(105);
    setIsPlaying(false);
  };

  const priceInRange = currentPrice >= 90 && currentPrice <= 120;
  const buyCanExecute = currentPrice <= buyLimitPrice;
  const sellCanExecute = currentPrice >= sellLimitPrice;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Limit Order Trading</h3>
        <p className="text-slate-600 max-w-2xl">
          Set your desired buy/sell prices and watch how limit orders execute only when market conditions meet your criteria
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Price Chart */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-slate-800">Market Price: ${currentPrice.toFixed(2)}</h4>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isPlaying 
                  ? 'bg-rose-500 text-white hover:bg-rose-600' 
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              {isPlaying ? 'Pause Market' : 'Start Market'}
            </button>
          </div>
          
          <div className="relative h-32 bg-slate-100 rounded-lg overflow-hidden">
            {/* Price scale */}
            <div className="absolute left-2 top-0 h-full flex flex-col justify-between text-xs text-slate-500 py-2">
              <span>$120</span>
              <span>$110</span>
              <span>$100</span>
              <span>$90</span>
            </div>
            
            {/* Sell limit line */}
            <div 
              className="absolute w-full border-t-2 border-rose-400 opacity-70"
              style={{ top: `${((120 - sellLimitPrice) / 30) * 100}%` }}
            >
              <span className="text-xs text-rose-600 ml-12 bg-white px-1">Sell Limit: ${sellLimitPrice}</span>
            </div>
            
            {/* Buy limit line */}
            <div 
              className="absolute w-full border-t-2 border-emerald-400 opacity-70"
              style={{ top: `${((120 - buyLimitPrice) / 30) * 100}%` }}
            >
              <span className="text-xs text-emerald-600 ml-12 bg-white px-1">Buy Limit: ${buyLimitPrice}</span>
            </div>
            
            {/* Current price indicator */}
            <div 
              className="absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-x-2 -translate-y-2 transition-all duration-200"
              style={{ 
                left: '50%',
                top: `${((120 - currentPrice) / 30) * 100}%` 
              }}
            />
          </div>
        </div>

        {/* Order Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buy Order */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="text-lg font-semibold text-emerald-700 mb-4">Buy Limit Order</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Buy when price drops to: ${buyLimitPrice}
                </label>
                <input
                  type="range"
                  min="90"
                  max="115"
                  value={buyLimitPrice}
                  onChange={(e) => setBuyLimitPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  disabled={buyOrderActive}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${buyCanExecute ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span className="text-sm text-slate-600">
                  {buyCanExecute ? 'Can execute now' : 'Waiting for price drop'}
                </span>
              </div>
              
              <button
                onClick={placeBuyOrder}
                disabled={buyOrderActive || buyOrderFilled}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  buyOrderActive
                    ? 'bg-amber-500 text-white'
                    : buyOrderFilled
                    ? 'bg-emerald-500 text-white'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {buyOrderActive ? 'Order Active...' : buyOrderFilled ? 'Order Filled!' : 'Place Buy Order'}
              </button>
            </div>
          </div>

          {/* Sell Order */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="text-lg font-semibold text-rose-700 mb-4">Sell Limit Order</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sell when price rises to: ${sellLimitPrice}
                </label>
                <input
                  type="range"
                  min="105"
                  max="120"
                  value={sellLimitPrice}
                  onChange={(e) => setSellLimitPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  disabled={sellOrderActive}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${sellCanExecute ? 'bg-rose-500' : 'bg-slate-300'}`} />
                <span className="text-sm text-slate-600">
                  {sellCanExecute ? 'Can execute now' : 'Waiting for price rise'}
                </span>
              </div>
              
              <button
                onClick={placeSellOrder}
                disabled={sellOrderActive || sellOrderFilled || position <= 0}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  sellOrderActive
                    ? 'bg-amber-500 text-white'
                    : sellOrderFilled
                    ? 'bg-rose-500 text-white'
                    : position <= 0
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
              >
                {sellOrderActive ? 'Order Active...' : sellOrderFilled ? 'Order Filled!' : position <= 0 ? 'Need Position to Sell' : 'Place Sell Order'}
              </button>
            </div>
          </div>
        </div>

        {/* Status Panel */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <h5 className="text-sm font-medium text-slate-600 mb-1">Current Position</h5>
              <p className="text-2xl font-bold text-indigo-600">{position} tokens</p>
            </div>
            <div>
              <h5 className="text-sm font-medium text-slate-600 mb-1">Active Orders</h5>
              <p className="text-2xl font-bold text-amber-600">
                {(buyOrderActive ? 1 : 0) + (sellOrderActive ? 1 : 0)}
              </p>
            </div>
            <div>
              <h5 className="text-sm font-medium text-slate-600 mb-1">Filled Orders</h5>
              <p className="text-2xl font-bold text-emerald-600">
                {(buyOrderFilled ? 1 : 0) + (sellOrderFilled ? 1 : 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={reset}
            className="px-6 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
          >
            Reset Demo
          </button>
        </div>
      </div>
    </div>
  );
}
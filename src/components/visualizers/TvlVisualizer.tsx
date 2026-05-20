"use client";

import { useState, useEffect } from 'react';

type ProtocolKey = 'uniswap' | 'aave' | 'compound';

export function TvlVisualizer() {
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolKey>('uniswap');
  const [timeframe, setTimeframe] = useState(0);
  const [assetPriceMultiplier, setAssetPriceMultiplier] = useState(1);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const protocols = {
    uniswap: {
      name: 'Uniswap',
      color: 'bg-rose-500',
      baseAssets: { ETH: 1000, USDC: 2000000, DAI: 500000 },
      basePrices: { ETH: 2000, USDC: 1, DAI: 1 }
    },
    aave: {
      name: 'AAVE',
      color: 'bg-indigo-500',
      baseAssets: { ETH: 2500, USDC: 5000000, DAI: 1000000 },
      basePrices: { ETH: 2000, USDC: 1, DAI: 1 }
    },
    compound: {
      name: 'Compound',
      color: 'bg-emerald-500',
      baseAssets: { ETH: 1500, USDC: 3000000, DAI: 800000 },
      basePrices: { ETH: 2000, USDC: 1, DAI: 1 }
    }
  };

  const timeframes = [
    { label: 'Week 1', growthMultiplier: 1 },
    { label: 'Week 2', growthMultiplier: 1.2 },
    { label: 'Week 3', growthMultiplier: 1.5 },
    { label: 'Week 4', growthMultiplier: 1.3 }
  ];

  const getCurrentProtocol = () => protocols[selectedProtocol];
  const getCurrentTimeframe = () => timeframes[timeframe];

  const calculateTVL = () => {
    const protocol = getCurrentProtocol();
    const growth = getCurrentTimeframe().growthMultiplier;
    
    let totalValue = 0;
    const breakdown: Record<string, { amount: number; price: number; value: number }> = {};

    Object.entries(protocol.baseAssets).forEach(([asset, amount]) => {
      const adjustedAmount = amount * growth;
      const priceMultiplier = asset === 'ETH' ? assetPriceMultiplier : 1;
      const currentPrice = protocol.basePrices[asset as 'ETH' | 'USDC' | 'DAI'] * priceMultiplier;
      const value = adjustedAmount * currentPrice;
      
      totalValue += value;
      breakdown[asset] = {
        amount: adjustedAmount,
        price: currentPrice,
        value: value
      };
    });

    return { totalValue, breakdown };
  };

  const { totalValue, breakdown } = calculateTVL();
  const baseTVL = calculateTVL();
  baseTVL.totalValue = Object.entries(protocols[selectedProtocol].baseAssets).reduce((sum, [asset, amount]) => {
    return sum + (amount * protocols[selectedProtocol].basePrices[asset as 'ETH' | 'USDC' | 'DAI']);
  }, 0);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const getBarHeight = (value: number, maxValue: number) => {
    return Math.max((value / maxValue) * 200, 4);
  };

  const maxTVL = Math.max(...Object.values(protocols).map(p => {
    const growth = getCurrentTimeframe().growthMultiplier;
    return Object.entries(p.baseAssets).reduce((sum, [asset, amount]) => {
      const priceMultiplier = asset === 'ETH' ? assetPriceMultiplier : 1;
      return sum + (amount * growth * p.basePrices[asset as 'ETH' | 'USDC' | 'DAI'] * priceMultiplier);
    }, 0);
  }));

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Total Value Locked (TVL) Explorer</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how TVL changes with protocol growth, asset prices, and time. See how this key DeFi metric can be influenced by factors beyond actual adoption.
        </p>
      </div>

      <div className="flex flex-wrap gap-6 justify-center">
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-slate-700">Protocol</label>
          <div className="flex gap-2">
            {Object.entries(protocols).map(([key, protocol]) => (
              <button
                key={key}
                onClick={() => setSelectedProtocol(key as ProtocolKey)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedProtocol === key
                    ? `${protocol.color} text-white shadow-md`
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {protocol.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-slate-700">Time Period</label>
          <div className="flex gap-2">
            {timeframes.map((tf, idx) => (
              <button
                key={idx}
                onClick={() => setTimeframe(idx)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeframe === idx
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-slate-700">ETH Price Impact</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={assetPriceMultiplier}
              onChange={(e) => setAssetPriceMultiplier(parseFloat(e.target.value))}
              className="w-24"
            />
            <span className="text-sm text-slate-600 w-12">
              {(assetPriceMultiplier * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <div className="text-center">
          <div className="text-4xl font-bold text-slate-800 mb-2">
            {formatCurrency(totalValue)}
          </div>
          <div className="text-lg text-slate-600">
            Current TVL for {getCurrentProtocol().name}
          </div>
          <div className="text-sm text-slate-500">
            Growth: {((getCurrentTimeframe().growthMultiplier - 1) * 100).toFixed(0)}% | 
            ETH Impact: {((assetPriceMultiplier - 1) * 100).toFixed(0)}%
          </div>
        </div>

        <div className="w-full max-w-3xl">
          <div className="flex justify-between items-end h-64 bg-white rounded-xl p-6 border border-slate-200">
            {Object.values(protocols).map((protocol, idx) => {
              const protocolTVL = Object.entries(protocol.baseAssets).reduce((sum, [asset, amount]) => {
                const growth = getCurrentTimeframe().growthMultiplier;
                const priceMultiplier = asset === 'ETH' ? assetPriceMultiplier : 1;
                return sum + (amount * growth * protocol.basePrices[asset as 'ETH' | 'USDC' | 'DAI'] * priceMultiplier);
              }, 0);

              const isSelected = Object.keys(protocols)[idx] === selectedProtocol;

              return (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`w-16 ${protocol.color} rounded-t-lg transition-all duration-300 ${
                      isSelected ? 'opacity-100' : 'opacity-40'
                    }`}
                    style={{ height: `${getBarHeight(protocolTVL, maxTVL)}px` }}
                  />
                  <div className="text-xs font-medium text-slate-600 text-center">
                    {protocol.name}
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {formatCurrency(protocolTVL)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
        >
          {showBreakdown ? 'Hide' : 'Show'} Asset Breakdown
        </button>

        {showBreakdown && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
            {Object.entries(breakdown).map(([asset, data]) => (
              <div key={asset} className="bg-white rounded-lg p-4 border border-slate-200">
                <div className="font-bold text-slate-800 mb-2">{asset}</div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Amount:</span>
                    <span>{data.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Price:</span>
                    <span>${data.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-1">
                    <span className="text-slate-600">Value:</span>
                    <span>{formatCurrency(data.value)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-2xl">
          <div className="font-medium text-amber-800 mb-2">💡 Key Insight</div>
          <div className="text-sm text-amber-700">
            Notice how TVL can increase dramatically just from price changes (especially ETH), 
            even without new deposits. This shows why TVL alone isn't a perfect measure of protocol health or growth.
          </div>
        </div>
      </div>
    </div>
  );
}
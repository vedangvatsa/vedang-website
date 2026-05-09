"use client";

import React, { useState } from 'react';

export function MarketCapVisualizer() {
  const [selectedCrypto, setSelectedCrypto] = useState(0);
  const [customPrice, setCustomPrice] = useState(10);
  const [customSupply, setCustomSupply] = useState(100);

  const cryptos = [
    { name: 'Bitcoin', symbol: 'BTC', price: 45000, supply: 19.5, tier: 'mega-cap', color: 'amber' },
    { name: 'Ethereum', symbol: 'ETH', price: 2500, supply: 120, tier: 'mega-cap', color: 'blue' },
    { name: 'Cardano', symbol: 'ADA', price: 0.45, supply: 35000, tier: 'mid-cap', color: 'indigo' },
    { name: 'Chainlink', symbol: 'LINK', price: 15, supply: 500, tier: 'mid-cap', color: 'emerald' },
    { name: 'Small Cap Token', symbol: 'SCT', price: 2, supply: 50, tier: 'small-cap', color: 'rose' },
  ];

  const calculateMarketCap = (price: number, supply: number) => price * supply;

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000) return `$${(marketCap / 1000000).toFixed(1)}B`;
    if (marketCap >= 1000) return `$${(marketCap / 1000).toFixed(1)}M`;
    return `$${marketCap.toFixed(0)}K`;
  };

  const getTierInfo = (marketCap: number) => {
    if (marketCap >= 100000) return { tier: 'mega-cap', color: 'amber', risk: 'Low Risk' };
    if (marketCap >= 10000) return { tier: 'large-cap', color: 'blue', risk: 'Low-Mid Risk' };
    if (marketCap >= 1000) return { tier: 'mid-cap', color: 'indigo', risk: 'Medium Risk' };
    if (marketCap >= 100) return { tier: 'small-cap', color: 'emerald', risk: 'High Risk' };
    return { tier: 'micro-cap', color: 'rose', risk: 'Very High Risk' };
  };

  const currentCrypto = cryptos[selectedCrypto];
  const currentMarketCap = calculateMarketCap(currentCrypto.price, currentCrypto.supply);
  const customMarketCap = calculateMarketCap(customPrice, customSupply);
  const customTierInfo = getTierInfo(customMarketCap);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Market Cap Calculator</h3>
        <p className="text-slate-600">Explore how price × circulating supply determines cryptocurrency market capitalization and risk tiers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Real Cryptocurrencies</h4>
          <div className="space-y-3">
            {cryptos.map((crypto, index) => {
              const marketCap = calculateMarketCap(crypto.price, crypto.supply);
              const isSelected = selectedCrypto === index;
              return (
                <div
                  key={crypto.symbol}
                  onClick={() => setSelectedCrypto(index)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? `border-${crypto.color}-400 bg-${crypto.color}-50`
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-slate-800">{crypto.name} ({crypto.symbol})</div>
                      <div className="text-sm text-slate-600">
                        ${crypto.price.toLocaleString()} × {crypto.supply}M tokens
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-800">{formatMarketCap(marketCap)}</div>
                      <div className={`text-xs px-2 py-1 rounded text-${crypto.color}-700 bg-${crypto.color}-100`}>
                        {crypto.tier}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedCrypto !== null && (
            <div className="mt-6 p-4 bg-slate-100 rounded-lg">
              <h5 className="font-semibold text-slate-800 mb-2">Market Cap Breakdown</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Token Price:</span>
                  <span className="font-mono">${currentCrypto.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Circulating Supply:</span>
                  <span className="font-mono">{currentCrypto.supply}M tokens</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Market Cap:</span>
                  <span className="font-mono">{formatMarketCap(currentMarketCap)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Custom Calculator</h4>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Token Price: ${customPrice}
              </label>
              <input
                type="range"
                min="0.01"
                max="50000"
                step="0.01"
                value={customPrice}
                onChange={(e) => setCustomPrice(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>$0.01</span>
                <span>$50,000</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Circulating Supply: {customSupply}M tokens
              </label>
              <input
                type="range"
                min="1"
                max="1000"
                step="1"
                value={customSupply}
                onChange={(e) => setCustomSupply(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1M</span>
                <span>1,000M</span>
              </div>
            </div>

            <div className={`p-4 rounded-lg bg-${customTierInfo.color}-50 border border-${customTierInfo.color}-200`}>
              <h5 className="font-semibold text-slate-800 mb-3">Calculation Result</h5>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-slate-800">
                  {formatMarketCap(customMarketCap)}
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-${customTierInfo.color}-700 bg-${customTierInfo.color}-100`}>
                  {customTierInfo.tier.toUpperCase()}
                </div>
                <div className="text-sm text-slate-600">
                  {customTierInfo.risk}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
              <strong>Formula:</strong> Market Cap = Price × Circulating Supply<br/>
              <strong>Your calculation:</strong> ${customPrice.toLocaleString()} × {customSupply}M = {formatMarketCap(customMarketCap)}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl bg-white p-6 rounded-xl border border-slate-200">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Market Cap Tiers & Risk Levels</h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { tier: 'Mega-Cap', range: '$100B+', risk: 'Lowest Risk', color: 'amber', examples: 'BTC, ETH' },
            { tier: 'Large-Cap', range: '$10B-100B', risk: 'Low Risk', color: 'blue', examples: 'BNB, SOL' },
            { tier: 'Mid-Cap', range: '$1B-10B', risk: 'Medium Risk', color: 'indigo', examples: 'ADA, DOT' },
            { tier: 'Small-Cap', range: '$100M-1B', risk: 'High Risk', color: 'emerald', examples: 'New projects' },
            { tier: 'Micro-Cap', range: '<$100M', risk: 'Highest Risk', color: 'rose', examples: 'Emerging tokens' },
          ].map((tier) => (
            <div key={tier.tier} className={`p-4 rounded-lg bg-${tier.color}-50 border border-${tier.color}-200`}>
              <div className={`font-semibold text-${tier.color}-800 mb-1`}>{tier.tier}</div>
              <div className="text-sm text-slate-600 mb-2">{tier.range}</div>
              <div className={`text-xs text-${tier.color}-700 mb-2`}>{tier.risk}</div>
              <div className="text-xs text-slate-500">{tier.examples}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
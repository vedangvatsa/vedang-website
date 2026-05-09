"use client";

import { useState } from 'react';

export function CirculatingSupplyVisualizer() {
  const [selectedToken, setSelectedToken] = useState(0);
  const [animationPhase, setAnimationPhase] = useState(0);

  const tokens = [
    {
      name: "CryptoA",
      totalSupply: 1000000,
      lockedTokens: 300000,
      teamTokens: 200000,
      foundationReserve: 150000,
      burnedTokens: 50000,
      maxSupply: 1200000
    },
    {
      name: "CryptoB", 
      totalSupply: 21000000,
      lockedTokens: 0,
      teamTokens: 0,
      foundationReserve: 0,
      burnedTokens: 0,
      maxSupply: 21000000
    },
    {
      name: "CryptoC",
      totalSupply: 500000000,
      lockedTokens: 200000000,
      teamTokens: 100000000,
      foundationReserve: 75000000,
      burnedTokens: 25000000,
      maxSupply: null
    }
  ];

  const currentToken = tokens[selectedToken];
  const circulatingSupply = currentToken.totalSupply - currentToken.lockedTokens - currentToken.teamTokens - currentToken.foundationReserve;
  
  const categories = [
    { name: "Circulating", amount: circulatingSupply, color: "bg-emerald-500", included: true },
    { name: "Locked", amount: currentToken.lockedTokens, color: "bg-slate-400", included: false },
    { name: "Team", amount: currentToken.teamTokens, color: "bg-blue-500", included: false },
    { name: "Foundation", amount: currentToken.foundationReserve, color: "bg-indigo-500", included: false },
    { name: "Burned", amount: currentToken.burnedTokens, color: "bg-rose-500", included: false }
  ];

  const marketPrice = 2.50;
  const marketCapCirculating = circulatingSupply * marketPrice;
  const marketCapTotal = currentToken.totalSupply * marketPrice;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getBarWidth = (amount: number) => {
    const maxAmount = Math.max(...categories.map(c => c.amount));
    return Math.max((amount / maxAmount) * 100, 2);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Circulating Supply Breakdown</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how different token allocations affect circulating supply and market cap calculations. Only circulating tokens can be traded.
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        {tokens.map((token, index) => (
          <button
            key={index}
            onClick={() => setSelectedToken(index)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedToken === index 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {token.name}
          </button>
        ))}
      </div>

      <div className="w-full max-w-4xl bg-white rounded-xl p-6 border border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div>
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Token Allocation</h4>
            <div className="space-y-3">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-20 text-sm font-medium text-slate-700">{category.name}</div>
                  <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className={`h-full ${category.color} transition-all duration-1000 ease-out flex items-center justify-end pr-2`}
                      style={{ width: `${getBarWidth(category.amount)}%` }}
                    >
                      <span className="text-xs font-medium text-white">
                        {formatNumber(category.amount)}
                      </span>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${category.included ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Supply Metrics</h4>
            <div className="space-y-4">
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="text-sm text-emerald-700 font-medium">Circulating Supply</div>
                <div className="text-2xl font-bold text-emerald-800">{formatNumber(circulatingSupply)}</div>
                <div className="text-xs text-emerald-600 mt-1">Available for trading</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="text-sm text-slate-700 font-medium">Total Supply</div>
                <div className="text-xl font-bold text-slate-800">{formatNumber(currentToken.totalSupply)}</div>
                <div className="text-xs text-slate-600 mt-1">All existing tokens</div>
              </div>

              {currentToken.maxSupply && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-700 font-medium">Max Supply</div>
                  <div className="text-xl font-bold text-blue-800">{formatNumber(currentToken.maxSupply)}</div>
                  <div className="text-xs text-blue-600 mt-1">Maximum possible tokens</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Market Cap Impact (@ ${marketPrice})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-4">
              <div className="text-sm text-emerald-700 font-medium">Market Cap (Circulating)</div>
              <div className="text-xl font-bold text-emerald-800">${formatNumber(marketCapCirculating)}</div>
              <div className="text-xs text-emerald-600 mt-1">Used by most market data sites</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="text-sm text-slate-700 font-medium">Fully Diluted Market Cap</div>
              <div className="text-xl font-bold text-slate-800">${formatNumber(marketCapTotal)}</div>
              <div className="text-xs text-slate-600 mt-1">If all tokens were trading</div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="text-sm text-amber-800">
            <strong>Key Insight:</strong> Circulating supply ({formatNumber(circulatingSupply)}) represents only{' '}
            {((circulatingSupply / currentToken.totalSupply) * 100).toFixed(1)}% of total supply. 
            This affects token scarcity and price dynamics in the market.
          </div>
        </div>
      </div>
    </div>
  );
}
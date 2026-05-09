"use client";

import { useState } from 'react';

export function RealWorldAssetsVisualizer() {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [tokenizationStep, setTokenizationStep] = useState(0);
  const [liquidityAmount, setLiquidityAmount] = useState(50);

  const realWorldAssets = [
    {
      id: 'real-estate',
      name: 'Real Estate',
      value: 500000,
      description: 'Commercial property in downtown',
      icon: '🏢',
      yield: 4.2,
      tokens: 1000000
    },
    {
      id: 'treasury',
      name: 'Treasury Bills',
      value: 1000000,
      description: 'US Government bonds',
      icon: '🏛️',
      yield: 5.1,
      tokens: 1000000
    },
    {
      id: 'art',
      name: 'Fine Art',
      value: 250000,
      description: 'Contemporary painting collection',
      icon: '🖼️',
      yield: 3.8,
      tokens: 250000
    },
    {
      id: 'commodities',
      name: 'Gold',
      value: 100000,
      description: 'Physical gold reserves',
      icon: '🥇',
      yield: 2.5,
      tokens: 100000
    }
  ];

  const tokenizationSteps = [
    'Traditional Asset Exists Off-Chain',
    'Asset Valuation & Legal Structure',
    'Smart Contract Deployment',
    'Token Minting & Distribution',
    'DeFi Integration Complete'
  ];

  const selectedAssetData = realWorldAssets.find(asset => asset.id === selectedAsset);

  const calculateTokenPrice = () => {
    if (!selectedAssetData) return 0;
    return selectedAssetData.value / selectedAssetData.tokens;
  };

  const calculateYield = () => {
    if (!selectedAssetData) return 0;
    return (selectedAssetData.value * selectedAssetData.yield / 100) * (liquidityAmount / 100);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Real World Assets (RWA)</h3>
        <p className="text-slate-600 max-w-3xl">
          Explore how traditional assets are tokenized and brought on-chain to bridge DeFi with real-world value
        </p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Asset Selection */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-4">Select Real World Asset</h4>
          <div className="grid grid-cols-2 gap-4">
            {realWorldAssets.map((asset) => (
              <button
                key={asset.id}
                onClick={() => {
                  setSelectedAsset(asset.id);
                  setTokenizationStep(0);
                }}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedAsset === asset.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="text-3xl mb-2">{asset.icon}</div>
                <div className="text-sm font-medium text-slate-800">{asset.name}</div>
                <div className="text-xs text-slate-600">${asset.value.toLocaleString()}</div>
                <div className="text-xs text-emerald-600">{asset.yield}% APY</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tokenization Process */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-4">Tokenization Process</h4>
          <div className="space-y-4">
            {tokenizationSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  index <= tokenizationStep
                    ? 'bg-indigo-50 border border-indigo-200'
                    : 'bg-slate-50 border border-slate-200'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index <= tokenizationStep
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-300 text-slate-600'
                  }`}
                >
                  {index + 1}
                </div>
                <span className={`text-sm ${
                  index <= tokenizationStep ? 'text-indigo-800' : 'text-slate-600'
                }`}>
                  {step}
                </span>
              </div>
            ))}
            {selectedAsset && (
              <button
                onClick={() => setTokenizationStep(Math.min(tokenizationStep + 1, 4))}
                disabled={tokenizationStep >= 4}
                className="w-full mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
              >
                {tokenizationStep >= 4 ? 'Tokenization Complete' : 'Next Step'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Asset Details & DeFi Integration */}
      {selectedAssetData && tokenizationStep >= 4 && (
        <div className="w-full max-w-6xl bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-6">DeFi Integration Dashboard</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Asset Info */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-2xl mb-2">{selectedAssetData.icon}</div>
              <h5 className="font-semibold text-slate-800">{selectedAssetData.name}</h5>
              <p className="text-sm text-slate-600 mb-3">{selectedAssetData.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Asset Value:</span>
                  <span className="font-medium">${selectedAssetData.value.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Tokens:</span>
                  <span className="font-medium">{selectedAssetData.tokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Token Price:</span>
                  <span className="font-medium">${calculateTokenPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Liquidity Pool */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-semibold text-blue-800 mb-3">Liquidity Pool</h5>
              <div className="mb-4">
                <label className="block text-sm text-blue-700 mb-2">
                  Pool Participation: {liquidityAmount}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={liquidityAmount}
                  onChange={(e) => setLiquidityAmount(Number(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Your Position:</span>
                  <span className="font-medium">${(selectedAssetData.value * liquidityAmount / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Tokens Owned:</span>
                  <span className="font-medium">{(selectedAssetData.tokens * liquidityAmount / 100).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Yield Generation */}
            <div className="bg-emerald-50 rounded-lg p-4">
              <h5 className="font-semibold text-emerald-800 mb-3">Yield Generation</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-700">Base APY:</span>
                  <span className="font-medium">{selectedAssetData.yield}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Annual Yield:</span>
                  <span className="font-medium text-lg">${calculateYield().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Monthly Yield:</span>
                  <span className="font-medium">${(calculateYield() / 12).toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 bg-emerald-200 rounded-lg p-3">
                <div className="text-xs text-emerald-800 text-center">
                  Real-world asset backing provides sustainable yield vs. speculative DeFi farming
                </div>
              </div>
            </div>
          </div>

          {/* Before/After Comparison */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-rose-50 rounded-lg p-4">
              <h5 className="font-semibold text-rose-800 mb-3">🔴 Traditional DeFi (Before RWA)</h5>
              <ul className="space-y-2 text-sm text-rose-700">
                <li>• Circular, reflexive yields</li>
                <li>• High volatility and risk</li>
                <li>• Limited to crypto ecosystem</li>
                <li>• Speculative value only</li>
                <li>• Unsustainable farming rewards</li>
              </ul>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <h5 className="font-semibold text-emerald-800 mb-3">🟢 RWA-Enhanced DeFi (After)</h5>
              <ul className="space-y-2 text-sm text-emerald-700">
                <li>• Real-world asset backing</li>
                <li>• Stable, predictable yields</li>
                <li>• Bridge to traditional finance</li>
                <li>• Intrinsic value foundation</li>
                <li>• Sustainable income streams</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
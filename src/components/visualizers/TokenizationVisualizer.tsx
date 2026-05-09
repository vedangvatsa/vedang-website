"use client";

import { useState } from 'react';

export function TokenizationVisualizer() {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [tokenizationStep, setTokenizationStep] = useState(0);
  const [fractionValue, setFractionValue] = useState(10);

  const assets = [
    {
      id: 'realestate',
      name: 'Real Estate',
      value: 1000000,
      icon: '🏠',
      color: 'blue',
      description: 'Commercial Property'
    },
    {
      id: 'art',
      name: 'Fine Art',
      value: 500000,
      icon: '🎨',
      color: 'rose',
      description: 'Digital Artwork'
    },
    {
      id: 'company',
      name: 'Company Equity',
      value: 2000000,
      icon: '🏢',
      color: 'indigo',
      description: 'Startup Shares'
    }
  ];

  const steps = [
    'Select Asset',
    'Create Tokens',
    'Distribute Ownership',
    'Trade on Blockchain'
  ];

  const selectedAssetData = assets.find(a => a.id === selectedAsset);
  const totalTokens = selectedAssetData ? Math.floor(selectedAssetData.value / 1000) : 0;
  const tokensPerFraction = Math.floor(totalTokens / fractionValue);
  const valuePerToken = selectedAssetData ? Math.floor(selectedAssetData.value / totalTokens) : 0;

  const handleAssetSelect = (assetId: string) => {
    setSelectedAsset(assetId);
    setTokenizationStep(1);
  };

  const nextStep = () => {
    if (tokenizationStep < 3) {
      setTokenizationStep(tokenizationStep + 1);
    }
  };

  const resetVisualization = () => {
    setSelectedAsset(null);
    setTokenizationStep(0);
    setFractionValue(10);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500 border-blue-600 text-white hover:bg-blue-600';
      case 'rose': return 'bg-rose-500 border-rose-600 text-white hover:bg-rose-600';
      case 'indigo': return 'bg-indigo-500 border-indigo-600 text-white hover:bg-indigo-600';
      default: return 'bg-slate-500 border-slate-600 text-white hover:bg-slate-600';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Tokenization Process</h3>
        <p className="text-slate-600 text-lg">Convert real-world assets into blockchain tokens for fractional ownership</p>
      </div>

      <div className="flex gap-4 mb-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`px-4 py-2 rounded-lg border-2 transition-all ${
              index <= tokenizationStep 
                ? 'bg-emerald-500 border-emerald-600 text-white' 
                : 'bg-slate-200 border-slate-300 text-slate-600'
            }`}
          >
            <span className="text-sm font-medium">{index + 1}. {step}</span>
          </div>
        ))}
      </div>

      {tokenizationStep === 0 && (
        <div className="w-full max-w-4xl">
          <h4 className="text-xl font-semibold text-slate-700 mb-4 text-center">Choose an Asset to Tokenize</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => handleAssetSelect(asset.id)}
                className="cursor-pointer p-6 bg-white rounded-xl border-2 border-slate-200 hover:border-slate-400 transition-all hover:shadow-md"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{asset.icon}</div>
                  <h5 className="text-lg font-semibold text-slate-800">{asset.name}</h5>
                  <p className="text-slate-600 text-sm mb-2">{asset.description}</p>
                  <p className="text-xl font-bold text-slate-800">${asset.value.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tokenizationStep === 1 && selectedAssetData && (
        <div className="w-full max-w-4xl text-center">
          <h4 className="text-xl font-semibold text-slate-700 mb-6">Creating Tokens</h4>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="text-6xl mb-4">{selectedAssetData.icon}</div>
            <h5 className="text-xl font-bold text-slate-800 mb-2">{selectedAssetData.name}</h5>
            <p className="text-2xl font-bold text-slate-800 mb-4">${selectedAssetData.value.toLocaleString()}</p>
            <div className="flex items-center justify-center gap-4 my-6">
              <span className="text-4xl">→</span>
              <div className="bg-amber-100 border border-amber-300 rounded-lg p-4">
                <p className="text-lg font-semibold text-amber-800">{totalTokens.toLocaleString()} Tokens</p>
                <p className="text-sm text-amber-700">${valuePerToken} per token</p>
              </div>
            </div>
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
            >
              Create Tokens
            </button>
          </div>
        </div>
      )}

      {tokenizationStep === 2 && selectedAssetData && (
        <div className="w-full max-w-4xl">
          <h4 className="text-xl font-semibold text-slate-700 mb-6 text-center">Fractional Ownership</h4>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="mb-6">
              <label className="block text-lg font-medium text-slate-700 mb-3">
                Number of Owners: {fractionValue}
              </label>
              <input
                type="range"
                min="2"
                max="20"
                value={fractionValue}
                onChange={(e) => setFractionValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: fractionValue }, (_, i) => (
                <div key={i} className="bg-slate-100 rounded-lg p-3 text-center border">
                  <div className="text-2xl mb-1">👤</div>
                  <p className="text-sm font-medium text-slate-700">Owner {i + 1}</p>
                  <p className="text-xs text-slate-600">{tokensPerFraction} tokens</p>
                  <p className="text-xs font-semibold text-emerald-600">
                    ${Math.floor(selectedAssetData.value / fractionValue).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
              >
                Distribute Tokens
              </button>
            </div>
          </div>
        </div>
      )}

      {tokenizationStep === 3 && selectedAssetData && (
        <div className="w-full max-w-4xl">
          <h4 className="text-xl font-semibold text-slate-700 mb-6 text-center">Blockchain Trading</h4>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">⛓️</div>
              <p className="text-lg text-slate-700">Tokens are now tradeable on the blockchain!</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <h6 className="font-semibold text-blue-800 mb-2">Instant Trading</h6>
                <p className="text-sm text-blue-700">Buy/sell tokens 24/7</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                <h6 className="font-semibold text-emerald-800 mb-2">Global Access</h6>
                <p className="text-sm text-emerald-700">Anyone can invest</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                <h6 className="font-semibold text-amber-800 mb-2">Transparent</h6>
                <p className="text-sm text-amber-700">All trades on-chain</p>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={resetVisualization}
                className="px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors font-semibold"
              >
                Try Another Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
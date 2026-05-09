"use client";

import { useState } from 'react';

export function AirdropVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [distributionStarted, setDistributionStarted] = useState(false);
  const [tokensDistributed, setTokensDistributed] = useState(0);

  const criteria = [
    { id: 'early-user', label: 'Early Users', count: 1200, color: 'bg-emerald-500' },
    { id: 'governance', label: 'Governance Voters', count: 800, color: 'bg-blue-500' },
    { id: 'liquidity', label: 'Liquidity Providers', count: 600, color: 'bg-indigo-500' },
    { id: 'holders', label: 'Token Holders', count: 900, color: 'bg-rose-500' }
  ];

  const wallets = [
    { id: 1, address: '0x742d...a4c8', eligible: true, received: false },
    { id: 2, address: '0x1f9c...b2d7', eligible: true, received: false },
    { id: 3, address: '0x8e4a...f1b9', eligible: false, received: false },
    { id: 4, address: '0x3c7d...e8a2', eligible: true, received: false },
    { id: 5, address: '0x9b1f...c5d4', eligible: true, received: false },
    { id: 6, address: '0x4a8c...d9e1', eligible: false, received: false }
  ];

  const totalEligible = criteria
    .filter(c => selectedCriteria.includes(c.id))
    .reduce((sum, c) => sum + c.count, 0);

  const tokensPerUser = totalEligible > 0 ? Math.floor(100000 / totalEligible) : 0;

  const handleCriteriaToggle = (criteriaId: string) => {
    setSelectedCriteria(prev => 
      prev.includes(criteriaId) 
        ? prev.filter(id => id !== criteriaId)
        : [...prev, criteriaId]
    );
    setDistributionStarted(false);
    setTokensDistributed(0);
  };

  const startDistribution = () => {
    if (selectedCriteria.length === 0) return;
    
    setDistributionStarted(true);
    setTokensDistributed(0);
    
    const interval = setInterval(() => {
      setTokensDistributed(prev => {
        const next = prev + Math.floor(Math.random() * 200) + 50;
        if (next >= totalEligible) {
          clearInterval(interval);
          return totalEligible;
        }
        return next;
      });
    }, 100);
  };

  const steps = [
    'Select Eligibility Criteria',
    'Calculate Distribution',
    'Execute Airdrop'
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Airdrop Distribution Simulator</h3>
        <p className="text-slate-600">Design and execute a token airdrop campaign by selecting eligibility criteria</p>
      </div>

      <div className="flex gap-4 mb-6">
        {steps.map((step, index) => (
          <div key={index} className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentStep >= index 
              ? 'bg-blue-500 text-white' 
              : 'bg-slate-200 text-slate-500'
          }`}>
            {index + 1}. {step}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">1. Eligibility Criteria</h4>
            <div className="space-y-3">
              {criteria.map(criterion => (
                <div 
                  key={criterion.id}
                  onClick={() => handleCriteriaToggle(criterion.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedCriteria.includes(criterion.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${criterion.color}`}></div>
                    <span className="font-medium text-slate-700">{criterion.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-800">{criterion.count.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">wallets</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">2. Distribution Parameters</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Total Token Pool:</span>
                <span className="font-bold text-slate-800">100,000 TOKENS</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Eligible Recipients:</span>
                <span className="font-bold text-blue-600">{totalEligible.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Tokens per User:</span>
                <span className="font-bold text-emerald-600">{tokensPerUser}</span>
              </div>
            </div>
            
            <button
              onClick={startDistribution}
              disabled={selectedCriteria.length === 0 || distributionStarted}
              className="w-full mt-4 py-3 px-6 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {distributionStarted ? 'Distribution in Progress...' : 'Start Airdrop'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">3. Live Distribution Status</h4>
            
            {distributionStarted && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Progress</span>
                  <span className="text-slate-800">{Math.round((tokensDistributed / totalEligible) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(tokensDistributed / totalEligible) * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm text-slate-600 mt-2">
                  {tokensDistributed.toLocaleString()} / {totalEligible.toLocaleString()} recipients
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h5 className="font-medium text-slate-700 mb-3">Sample Wallet Addresses</h5>
              {wallets.map(wallet => (
                <div 
                  key={wallet.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    wallet.eligible && distributionStarted && tokensDistributed >= wallet.id * 200
                      ? 'border-emerald-200 bg-emerald-50'
                      : wallet.eligible 
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <span className="font-mono text-sm text-slate-700">{wallet.address}</span>
                  <div className="flex items-center gap-2">
                    {wallet.eligible ? (
                      <>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Eligible</span>
                        {distributionStarted && tokensDistributed >= wallet.id * 200 && (
                          <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded">
                            +{tokensPerUser} tokens
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-slate-100 text-slate-500 rounded">Not Eligible</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {tokensDistributed === totalEligible && tokensDistributed > 0 && (
        <div className="bg-emerald-100 border border-emerald-200 rounded-xl p-6 text-center">
          <div className="text-emerald-800 font-bold text-lg">🎉 Airdrop Complete!</div>
          <div className="text-emerald-700 mt-2">
            Successfully distributed {(totalEligible * tokensPerUser).toLocaleString()} tokens to {totalEligible.toLocaleString()} recipients
          </div>
        </div>
      )}
    </div>
  );
}
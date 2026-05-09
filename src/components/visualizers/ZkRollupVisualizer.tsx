"use client";

import React, { useState, useEffect } from 'react';

export function ZkRollupVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [batchSize, setBatchSize] = useState(100);
  const [showProof, setShowProof] = useState(false);
  const [transactions, setTransactions] = useState<Array<{id: number, amount: number, verified: boolean}>>([]);

  const steps = [
    "Collect Transactions",
    "Generate ZK Proof",
    "Submit to Layer 1",
    "Verify & Finalize"
  ];

  const gasUsage = {
    individual: batchSize * 21000,
    zkRollup: 500000 + (batchSize * 20)
  };

  const gasSavings = Math.round(((gasUsage.individual - gasUsage.zkRollup) / gasUsage.individual) * 100);

  useEffect(() => {
    const newTxs = Array.from({ length: Math.min(batchSize, 10) }, (_, i) => ({
      id: i + 1,
      amount: Math.floor(Math.random() * 1000) + 1,
      verified: currentStep >= 3
    }));
    setTransactions(newTxs);
  }, [batchSize, currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        if (currentStep === 1) setShowProof(true);
        setIsAnimating(false);
      }, 500);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setShowProof(false);
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">ZK Rollup Visualizer</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how Zero-Knowledge rollups batch transactions and use cryptographic proofs to scale Ethereum while maintaining security
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-8">
        {/* Batch Size Control */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-slate-700">Batch Size</span>
            <span className="text-2xl font-bold text-blue-600">{batchSize}</span>
          </div>
          <input
            type="range"
            min="10"
            max="1000"
            step="10"
            value={batchSize}
            onChange={(e) => setBatchSize(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          
          {/* Gas Usage Comparison */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-rose-50 rounded-lg p-4 border border-rose-200">
              <div className="text-sm text-rose-600 font-medium">Individual Txs</div>
              <div className="text-xl font-bold text-rose-700">{gasUsage.individual.toLocaleString()}</div>
              <div className="text-xs text-rose-500">gas units</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <div className="text-sm text-emerald-600 font-medium">ZK Rollup</div>
              <div className="text-xl font-bold text-emerald-700">{gasUsage.zkRollup.toLocaleString()}</div>
              <div className="text-xs text-emerald-500">gas units</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <div className="text-sm text-amber-600 font-medium">Gas Savings</div>
              <div className="text-xl font-bold text-amber-700">{gasSavings}%</div>
              <div className="text-xs text-amber-500">efficiency</div>
            </div>
          </div>
        </div>

        {/* Step Visualization */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    index <= currentStep
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {index + 1}. {step}
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleNext}
                disabled={currentStep >= steps.length - 1 || isAnimating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next Step
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Layer 2 (Rollup) */}
          <div className="border-2 border-indigo-200 rounded-xl p-6 mb-6 bg-indigo-50">
            <h4 className="text-lg font-semibold text-indigo-700 mb-4 flex items-center">
              <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
              Layer 2 - ZK Rollup
            </h4>
            
            {/* Transaction Pool */}
            <div className="mb-4">
              <div className="text-sm font-medium text-slate-600 mb-2">Transaction Batch</div>
              <div className="grid grid-cols-5 gap-2">
                {transactions.map((tx, index) => (
                  <div
                    key={tx.id}
                    className={`p-2 rounded-lg text-xs text-center transition-all duration-500 ${
                      currentStep >= 1
                        ? 'bg-indigo-200 text-indigo-700 border border-indigo-300'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    } ${isAnimating ? 'animate-pulse' : ''}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    Tx #{tx.id}<br/>${tx.amount}
                  </div>
                ))}
              </div>
            </div>

            {/* ZK Proof Generation */}
            {showProof && (
              <div className={`bg-slate-100 rounded-lg p-4 transition-all duration-500 ${
                currentStep >= 2 ? 'opacity-100' : 'opacity-50'
              }`}>
                <div className="text-sm font-medium text-slate-700 mb-2">ZK Proof Generated</div>
                <div className="font-mono text-xs bg-white p-3 rounded border overflow-hidden">
                  π = 0x{Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Compact proof verifies {batchSize} transactions without revealing details
                </div>
              </div>
            )}
          </div>

          {/* Layer 1 (Ethereum) */}
          <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50">
            <h4 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              Layer 1 - Ethereum Mainnet
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg transition-all duration-500 ${
                currentStep >= 2
                  ? 'bg-blue-200 text-blue-700 border border-blue-300'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}>
                <div className="text-sm font-medium mb-1">Proof Verification</div>
                <div className="text-xs">
                  {currentStep >= 2 ? '✓ Proof mathematically verified' : '⏳ Waiting for proof...'}
                </div>
              </div>
              
              <div className={`p-4 rounded-lg transition-all duration-500 ${
                currentStep >= 3
                  ? 'bg-emerald-200 text-emerald-700 border border-emerald-300'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}>
                <div className="text-sm font-medium mb-1">State Update</div>
                <div className="text-xs">
                  {currentStep >= 3 ? `✓ ${batchSize} transactions finalized` : '⏳ Pending verification...'}
                </div>
              </div>
            </div>

            {currentStep >= 3 && (
              <div className="mt-4 p-3 bg-emerald-100 rounded-lg border border-emerald-200">
                <div className="text-sm font-medium text-emerald-700">
                  🎉 Instant Finality Achieved!
                </div>
                <div className="text-xs text-emerald-600">
                  No fraud proofs or challenge periods needed - mathematical certainty via ZK proofs
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-sm font-medium text-slate-700">Instant Finality</div>
            <div className="text-xs text-slate-500">No challenge periods</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
            <div className="text-2xl mb-2">🛡️</div>
            <div className="text-sm font-medium text-slate-700">Mathematical Security</div>
            <div className="text-xs text-slate-500">Cryptographic guarantees</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
            <div className="text-2xl mb-2">💰</div>
            <div className="text-sm font-medium text-slate-700">Cost Efficient</div>
            <div className="text-xs text-slate-500">Batch verification</div>
          </div>
        </div>
      </div>
    </div>
  );
}
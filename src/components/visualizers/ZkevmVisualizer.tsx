"use client";

import { useState } from 'react';

export function ZkevmVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [transactionCount, setTransactionCount] = useState(1000);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const steps = [
    { title: "Off-chain Execution", desc: "Transactions execute on zkEVM" },
    { title: "Proof Generation", desc: "ZK proof created for batch" },
    { title: "Mainnet Submission", desc: "Small proof submitted to Ethereum" },
    { title: "Verification", desc: "Mainnet verifies without re-execution" }
  ];

  const handleProofGeneration = () => {
    setIsGeneratingProof(true);
    setTimeout(() => {
      setIsGeneratingProof(false);
      setCurrentStep(Math.min(currentStep + 1, 3));
    }, 2000);
  };

  const gasCostPerTx = 21000;
  const mainnetGasCost = transactionCount * gasCostPerTx;
  const zkevmGasCost = 500000; // Fixed cost for proof verification
  const savings = ((mainnetGasCost - zkevmGasCost) / mainnetGasCost * 100).toFixed(1);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Zero-Knowledge EVM (zkEVM)</h3>
        <p className="text-slate-600">Interactive demonstration of ZK-Rollup batch processing and proof generation</p>
      </div>

      <div className="w-full max-w-4xl">
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Transaction Batch Size: {transactionCount.toLocaleString()}
          </label>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={transactionCount}
            onChange={(e) => setTransactionCount(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">zkEVM Process</h4>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    index === currentStep
                      ? 'border-blue-500 bg-blue-50'
                      : index < currentStep
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === currentStep
                        ? 'bg-blue-500 text-white'
                        : index < currentStep
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-300 text-slate-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{step.title}</div>
                      <div className="text-sm text-slate-600">{step.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Transaction Visualization</h4>
            <div className="relative">
              <div className="bg-slate-100 p-4 rounded-lg mb-4">
                <div className="text-sm text-slate-600 mb-2">Off-chain Transactions</div>
                <div className="grid grid-cols-10 gap-1">
                  {Array.from({ length: Math.min(100, transactionCount / 10) }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded transition-all ${
                        currentStep >= 1 ? 'bg-blue-500' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {transactionCount.toLocaleString()} transactions
                </div>
              </div>

              {currentStep >= 1 && (
                <div className="flex items-center justify-center mb-4">
                  <div className="text-2xl">↓</div>
                </div>
              )}

              {currentStep >= 2 && (
                <div className="bg-indigo-100 p-4 rounded-lg mb-4">
                  <div className="text-sm text-slate-600 mb-2">ZK Proof</div>
                  <div className="w-full h-8 bg-indigo-500 rounded flex items-center justify-center text-white text-xs font-mono">
                    {isGeneratingProof ? 'Generating...' : '0x4f7a...bc3e'}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    ~256 bytes proof
                  </div>
                </div>
              )}

              {currentStep >= 3 && (
                <div className="text-center">
                  <div className="text-2xl mb-2">↓</div>
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <div className="text-sm text-emerald-700 font-medium">
                      Verified on Ethereum Mainnet
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleProofGeneration}
            disabled={isGeneratingProof}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingProof ? 'Generating Proof...' : 'Generate ZK Proof'}
          </button>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {showComparison ? 'Hide' : 'Show'} Gas Comparison
          </button>
          <button
            onClick={() => setCurrentStep(0)}
            className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
          >
            Reset
          </button>
        </div>

        {showComparison && (
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Gas Cost Comparison</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
                <div className="text-sm text-rose-600 mb-1">Mainnet (Individual TXs)</div>
                <div className="text-2xl font-bold text-rose-700">
                  {mainnetGasCost.toLocaleString()}
                </div>
                <div className="text-xs text-rose-500">gas units</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <div className="text-sm text-emerald-600 mb-1">zkEVM (Batch Proof)</div>
                <div className="text-2xl font-bold text-emerald-700">
                  {zkevmGasCost.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-500">gas units</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 mb-1">Gas Savings</div>
                <div className="text-2xl font-bold text-blue-700">
                  {savings}%
                </div>
                <div className="text-xs text-blue-500">reduction</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
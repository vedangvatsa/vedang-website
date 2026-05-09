"use client";

import { useState } from 'react';

export function RollupVisualizer() {
  const [activeStep, setActiveStep] = useState(0);
  const [rollupType, setRollupType] = useState<'optimistic' | 'zk'>('optimistic');
  const [isAnimating, setIsAnimating] = useState(false);
  const [txCount, setTxCount] = useState(100);

  const steps = [
    { name: 'User Transactions', description: 'Users submit transactions to rollup' },
    { name: 'Off-chain Execution', description: 'Transactions executed in rollup environment' },
    { name: 'Batch Creation', description: 'Multiple transactions batched together' },
    { name: 'L1 Submission', description: 'Batch + proof/data posted to Ethereum' }
  ];

  const handleAnimate = () => {
    setIsAnimating(true);
    setActiveStep(0);
    
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          setIsAnimating(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const l1Cost = txCount * 21000 * 50; // Base cost per tx
  const rollupCost = Math.floor(l1Cost / 50); // ~50x cheaper
  const gasReduction = Math.floor(((l1Cost - rollupCost) / l1Cost) * 100);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Rollup Scaling Solution</h3>
        <p className="text-slate-600 max-w-2xl">
          Interactive visualization of how rollups scale Ethereum by moving execution off-chain while inheriting L1 security
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setRollupType('optimistic')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            rollupType === 'optimistic'
              ? 'bg-blue-500 text-white'
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          }`}
        >
          Optimistic Rollup
        </button>
        <button
          onClick={() => setRollupType('zk')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            rollupType === 'zk'
              ? 'bg-indigo-500 text-white'
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          }`}
        >
          ZK Rollup
        </button>
      </div>

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Layer 2 (Rollup)</h4>
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-500 ${
                    activeStep >= 0 && activeStep <= 2
                      ? 'bg-emerald-100 text-emerald-700 scale-105'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  Tx {i + 1} - Fast & Cheap
                </div>
              ))}
              {rollupType === 'zk' && (
                <div className={`mt-4 p-3 rounded-lg border-2 border-dashed transition-all duration-500 ${
                  activeStep === 2 ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300'
                }`}>
                  <div className="text-sm font-medium text-indigo-600">ZK Proof Generation</div>
                  <div className="text-xs text-indigo-500">Cryptographic proof of validity</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Layer 1 (Ethereum)</h4>
            <div className="space-y-3">
              <div className={`h-16 rounded-lg border-2 border-dashed transition-all duration-500 flex items-center justify-center ${
                activeStep === 3
                  ? 'border-blue-400 bg-blue-50 scale-105'
                  : 'border-slate-300'
              }`}>
                <div className="text-center">
                  <div className="text-sm font-medium text-blue-600">Batch Data</div>
                  <div className="text-xs text-blue-500">
                    {rollupType === 'optimistic' ? '+ Fraud Proof System' : '+ ZK Validity Proof'}
                  </div>
                </div>
              </div>
              {rollupType === 'optimistic' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="text-sm font-medium text-amber-700">Challenge Period</div>
                  <div className="text-xs text-amber-600">7 days to dispute</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={handleAnimate}
            disabled={isAnimating}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white font-medium rounded-lg transition-colors"
          >
            {isAnimating ? 'Processing...' : 'Animate Transaction Flow'}
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Cost Comparison</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Number of transactions: {txCount}
            </label>
            <input
              type="range"
              min="10"
              max="1000"
              value={txCount}
              onChange={(e) => setTxCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-rose-600">${(l1Cost / 1000000).toFixed(2)}</div>
              <div className="text-sm text-slate-600">Direct L1 Cost</div>
              <div className="mt-2 h-4 bg-rose-200 rounded-full">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">${(rollupCost / 1000000).toFixed(2)}</div>
              <div className="text-sm text-slate-600">Rollup Cost</div>
              <div className="mt-2 h-4 bg-emerald-200 rounded-full">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300" 
                  style={{ width: `${(rollupCost / l1Cost) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="text-lg font-semibold text-slate-800">
              {gasReduction}% Gas Reduction
            </div>
            <div className="text-sm text-slate-600">
              {rollupType === 'optimistic' 
                ? 'Optimistic rollups assume validity, challenge if fraud detected'
                : 'ZK rollups provide mathematical proof of validity'
              }
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                activeStep === index
                  ? 'border-blue-400 bg-blue-50 scale-105'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 ${
                activeStep >= index ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {index + 1}
              </div>
              <div className="text-sm font-medium text-slate-800">{step.name}</div>
              <div className="text-xs text-slate-600 mt-1">{step.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
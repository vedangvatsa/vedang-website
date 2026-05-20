"use client";

import { useState, useEffect } from 'react';

export function OptimisticRollupVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [challengePeriodProgress, setChallengePeriodProgress] = useState(0);
  const [transactions, setTransactions] = useState([
    { id: 1, amount: 100, valid: true, status: 'pending' },
    { id: 2, amount: 50, valid: true, status: 'pending' },
    { id: 3, amount: 200, valid: false, status: 'pending' },
    { id: 4, amount: 75, valid: true, status: 'pending' }
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [fraudDetected, setFraudDetected] = useState(false);
  const [selectedTx, setSelectedTx] = useState<number | null>(null);

  const steps = [
    'Submit Transactions',
    'Optimistic Processing', 
    'Post to Layer 1',
    'Challenge Period',
    'Finalization'
  ];

  useEffect(() => {
    if (!isRunning) return;
    
    const timer = setTimeout(() => {
      if (currentStep === 3) {
        if (challengePeriodProgress < 100) {
          setChallengePeriodProgress(prev => Math.min(prev + 10, 100));
          return;
        }
      }
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
        if (currentStep === 1) {
          setTransactions(prev => prev.map(tx => ({ ...tx, status: 'processed' })));
        }
        if (currentStep === 2) {
          setTransactions(prev => prev.map(tx => ({ ...tx, status: 'posted' })));
        }
        if (currentStep === 4) {
          if (!fraudDetected) {
            setTransactions(prev => prev.map(tx => ({ ...tx, status: 'finalized' })));
          }
        }
      } else {
        setIsRunning(false);
      }
    }, currentStep === 3 ? 300 : 1500);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, challengePeriodProgress, fraudDetected]);

  const submitFraudProof = (txId: number) => {
    const tx = transactions.find(t => t.id === txId);
    if (tx && !tx.valid) {
      setFraudDetected(true);
      setTransactions(prev => prev.map(t => 
        t.id === txId ? { ...t, status: 'reverted' } : t
      ));
      setSelectedTx(txId);
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setChallengePeriodProgress(0);
    setIsRunning(false);
    setFraudDetected(false);
    setSelectedTx(null);
    setTransactions(prev => prev.map(tx => ({ ...tx, status: 'pending' })));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-slate-200 text-slate-600';
      case 'processed': return 'bg-blue-200 text-blue-800';
      case 'posted': return 'bg-indigo-200 text-indigo-800';
      case 'finalized': return 'bg-emerald-200 text-emerald-800';
      case 'reverted': return 'bg-rose-200 text-rose-800';
      default: return 'bg-slate-200 text-slate-600';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Optimistic Rollup Visualizer</h3>
        <p className="text-slate-600">Interactive demonstration of optimistic transaction processing with challenge period</p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold ${
                index <= currentStep ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {index + 1}
              </div>
              <span className={`text-xs text-center ${
                index <= currentStep ? 'text-blue-600' : 'text-slate-400'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Transaction Pool */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h4 className="text-lg font-semibold mb-4 text-slate-800">Transaction Pool</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedTx === tx.id ? 'ring-2 ring-rose-400' : ''
                } ${getStatusColor(tx.status)}`}
                onClick={() => currentStep >= 3 && !tx.valid && tx.status !== 'reverted' ? submitFraudProof(tx.id) : null}
              >
                <div className="text-sm font-medium">TX #{tx.id}</div>
                <div className="text-xs">Amount: {tx.amount}</div>
                <div className="text-xs mt-1 capitalize">{tx.status}</div>
                {!tx.valid && currentStep >= 3 && tx.status !== 'reverted' && (
                  <div className="mt-2 text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded">
                    ⚠️ Invalid - Click to challenge!
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Challenge Period Progress */}
        {currentStep >= 3 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h4 className="text-lg font-semibold mb-4 text-slate-800">Challenge Period (7 days)</h4>
            <div className="w-full bg-slate-200 rounded-full h-4 mb-4">
              <div 
                className="bg-amber-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${challengePeriodProgress}%` }}
              ></div>
            </div>
            <div className="text-sm text-slate-600">
              Progress: {challengePeriodProgress}% complete
              {challengePeriodProgress === 100 && !fraudDetected && (
                <span className="ml-2 text-emerald-600 font-semibold">✓ No challenges - Safe to finalize!</span>
              )}
            </div>
          </div>
        )}

        {/* Layer 1 vs Layer 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
            <h4 className="text-lg font-semibold mb-4 text-indigo-800">Layer 2 (Rollup)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Fast Processing:</span>
                <span className="font-semibold text-emerald-600">✓ Instant</span>
              </div>
              <div className="flex justify-between">
                <span>Gas Costs:</span>
                <span className="font-semibold text-emerald-600">✓ Low</span>
              </div>
              <div className="flex justify-between">
                <span>Security Model:</span>
                <span className="font-semibold text-blue-600">Optimistic</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h4 className="text-lg font-semibold mb-4 text-blue-800">Layer 1 (Ethereum)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Final Settlement:</span>
                <span className={`font-semibold ${currentStep >= 4 ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {currentStep >= 4 ? '✓ Complete' : '⏳ Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Security:</span>
                <span className="font-semibold text-emerald-600">✓ Guaranteed</span>
              </div>
              <div className="flex justify-between">
                <span>Challenge Window:</span>
                <span className="font-semibold text-amber-600">7 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            disabled={currentStep >= steps.length - 1}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-slate-400 transition-colors"
          >
            {isRunning ? 'Pause' : 'Start Demo'}
          </button>
          <button
            onClick={resetDemo}
            className="px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Reset
          </button>
        </div>

        {fraudDetected && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-center">
            <div className="text-rose-800 font-semibold">Fraud Detected!</div>
            <div className="text-rose-600 text-sm mt-1">
              Invalid transaction reverted. Malicious sequencer would be penalized.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
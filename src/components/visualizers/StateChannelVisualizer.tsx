"use client";

import React, { useState } from 'react';

export function StateChannelVisualizer() {
  const [step, setStep] = useState(0);
  const [aliceBalance, setAliceBalance] = useState(50);
  const [bobBalance, setBobBalance] = useState(50);
  const [offChainTransactions, setOffChainTransactions] = useState([]);
  const [channelState, setChannelState] = useState('closed'); // closed, open, active, disputed, settling

  const steps = [
    'Channel Setup',
    'Lock Funds On-Chain',
    'Off-Chain Transactions',
    'Channel Close'
  ];

  const handleOpenChannel = () => {
    setChannelState('open');
    setStep(1);
    setOffChainTransactions([]);
  };

  const handleLockFunds = () => {
    setChannelState('active');
    setStep(2);
  };

  const handleOffChainTransaction = (amount) => {
    const newAliceBalance = aliceBalance - amount;
    const newBobBalance = bobBalance + amount;
    
    if (newAliceBalance >= 0 && newBobBalance >= 0) {
      setAliceBalance(newAliceBalance);
      setBobBalance(newBobBalance);
      setOffChainTransactions(prev => [...prev, {
        from: 'Alice',
        to: 'Bob',
        amount,
        timestamp: Date.now(),
        aliceBalance: newAliceBalance,
        bobBalance: newBobBalance
      }]);
    }
  };

  const handleCloseChannel = () => {
    setChannelState('settling');
    setStep(3);
    setTimeout(() => {
      setChannelState('closed');
    }, 2000);
  };

  const handleReset = () => {
    setStep(0);
    setAliceBalance(50);
    setBobBalance(50);
    setOffChainTransactions([]);
    setChannelState('closed');
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">State Channel Visualization</h3>
        <p className="text-slate-600">Interactive demonstration of off-chain state updates with on-chain security</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-6">
        {steps.map((stepName, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              index <= step ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-600'
            }`}>
              {index + 1}
            </div>
            <span className={`text-sm ${index <= step ? 'text-blue-600' : 'text-slate-500'}`}>
              {stepName}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-8 h-1 ${index < step ? 'bg-blue-500' : 'bg-slate-300'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Main Visualization */}
      <div className="w-full max-w-4xl">
        {/* Blockchain Layer */}
        <div className="bg-indigo-100 p-6 rounded-lg mb-6">
          <h4 className="text-lg font-semibold text-indigo-800 mb-4">Blockchain Layer (On-Chain)</h4>
          <div className="flex justify-center">
            <div className={`border-2 border-dashed p-4 rounded-lg transition-all duration-500 ${
              channelState === 'open' || channelState === 'active' ? 'border-emerald-500 bg-emerald-50' :
              channelState === 'settling' ? 'border-amber-500 bg-amber-50' :
              'border-slate-400 bg-slate-100'
            }`}>
              <div className="text-center">
                <div className="text-sm font-medium mb-2">Smart Contract</div>
                <div className="text-xs text-slate-600">
                  {channelState === 'closed' && 'No active channel'}
                  {channelState === 'open' && 'Channel opened, awaiting funds'}
                  {channelState === 'active' && `Locked: ${aliceBalance + bobBalance} tokens`}
                  {channelState === 'settling' && 'Settling final state...'}
                </div>
                {channelState === 'active' && (
                  <div className="mt-2 text-xs">
                    <div>Alice: {aliceBalance} tokens</div>
                    <div>Bob: {bobBalance} tokens</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* State Channel Layer */}
        <div className="bg-blue-100 p-6 rounded-lg mb-6">
          <h4 className="text-lg font-semibold text-blue-800 mb-4">State Channel (Off-Chain)</h4>
          <div className="flex justify-between items-center mb-4">
            {/* Alice */}
            <div className="bg-rose-200 p-4 rounded-lg">
              <div className="font-semibold text-rose-800">Alice</div>
              <div className="text-sm">Balance: {aliceBalance}</div>
              <div className="text-xs text-rose-600">Signs transactions</div>
            </div>

            {/* Channel Messages */}
            <div className="flex-1 mx-4">
              {channelState === 'active' && (
                <div className="flex flex-col gap-2">
                  <div className="text-center text-sm font-medium text-blue-800">
                    Off-Chain Messages
                  </div>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleOffChainTransaction(5)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                      disabled={aliceBalance < 5}
                    >
                      Send 5 →
                    </button>
                    <button
                      onClick={() => handleOffChainTransaction(10)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                      disabled={aliceBalance < 10}
                    >
                      Send 10 →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bob */}
            <div className="bg-emerald-200 p-4 rounded-lg">
              <div className="font-semibold text-emerald-800">Bob</div>
              <div className="text-sm">Balance: {bobBalance}</div>
              <div className="text-xs text-emerald-600">Verifies signatures</div>
            </div>
          </div>

          {/* Transaction History */}
          {offChainTransactions.length > 0 && (
            <div className="bg-white p-4 rounded border">
              <div className="text-sm font-medium mb-2">Transaction History (Off-Chain)</div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {offChainTransactions.map((tx, index) => (
                  <div key={index} className="text-xs flex justify-between items-center py-1 border-b border-slate-100">
                    <span>#{index + 1}: Alice → Bob ({tx.amount} tokens)</span>
                    <span className="text-slate-500">A: {tx.aliceBalance}, B: {tx.bobBalance}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-slate-600 mt-2">
                ✓ Cryptographically signed • ✓ Instant • ✓ No gas fees
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {channelState === 'closed' && step === 0 && (
            <button
              onClick={handleOpenChannel}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Open Channel
            </button>
          )}
          
          {channelState === 'open' && step === 1 && (
            <button
              onClick={handleLockFunds}
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Lock Funds (100 total)
            </button>
          )}
          
          {channelState === 'active' && step === 2 && (
            <button
              onClick={handleCloseChannel}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Close Channel
            </button>
          )}
          
          {channelState === 'closed' && step === 3 && (
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Reset Demo
            </button>
          )}
        </div>

        {/* Benefits */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-emerald-50 p-3 rounded border border-emerald-200">
            <div className="text-emerald-800 font-semibold text-sm">Instant</div>
            <div className="text-emerald-600 text-xs">No block confirmation</div>
          </div>
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <div className="text-blue-800 font-semibold text-sm">Low Cost</div>
            <div className="text-blue-600 text-xs">No gas fees per transaction</div>
          </div>
          <div className="bg-indigo-50 p-3 rounded border border-indigo-200">
            <div className="text-indigo-800 font-semibold text-sm">Secure</div>
            <div className="text-indigo-600 text-xs">Blockchain-level guarantees</div>
          </div>
        </div>
      </div>
    </div>
  );
}
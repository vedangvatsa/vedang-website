"use client";

import { useState } from 'react';

export function DoubleSpendVisualizer() {
  const [selectedSystem, setSelectedSystem] = useState<'centralized' | 'blockchain'>('centralized');
  const [attemptingDoubleSpend, setAttemptingDoubleSpend] = useState(false);
  const [transactions, setTransactions] = useState<Array<{id: number, to: string, amount: number, status: 'pending' | 'approved' | 'rejected', timestamp: number}>>([]);
  const [balance, setBalance] = useState(100);
  const [step, setStep] = useState(0);

  const resetDemo = () => {
    setTransactions([]);
    setBalance(100);
    setStep(0);
    setAttemptingDoubleSpend(false);
  };

  const attemptTransaction = (recipient: string, amount: number) => {
    const newTx = {
      id: Date.now() + Math.random(),
      to: recipient,
      amount,
      status: 'pending' as const,
      timestamp: Date.now()
    };

    setTransactions(prev => [...prev, newTx]);
    setStep(prev => prev + 1);

    setTimeout(() => {
      if (selectedSystem === 'centralized') {
        // Centralized system - bank prevents double spend
        setTransactions(prev => prev.map(tx => {
          if (tx.id === newTx.id) {
            if (balance >= amount) {
              setBalance(b => b - amount);
              return { ...tx, status: 'approved' };
            } else {
              return { ...tx, status: 'rejected' };
            }
          }
          return tx;
        }));
      } else {
        // Blockchain system - consensus prevents double spend
        const pendingTxs = transactions.filter(tx => tx.status === 'pending');
        if (pendingTxs.length === 0 && balance >= amount) {
          setBalance(b => b - amount);
          setTransactions(prev => prev.map(tx => 
            tx.id === newTx.id ? { ...tx, status: 'approved' } : tx
          ));
        } else if (balance < amount) {
          setTransactions(prev => prev.map(tx => 
            tx.id === newTx.id ? { ...tx, status: 'rejected' } : tx
          ));
        } else {
          setTransactions(prev => prev.map(tx => 
            tx.id === newTx.id ? { ...tx, status: 'rejected' } : tx
          ));
        }
      }
    }, 1500);
  };

  const simulateDoubleSpend = () => {
    setAttemptingDoubleSpend(true);
    // Attempt to spend the same money twice quickly
    attemptTransaction('Alice', 60);
    setTimeout(() => {
      attemptTransaction('Bob', 60);
    }, 100);
    
    setTimeout(() => {
      setAttemptingDoubleSpend(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Double Spend Problem</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how different systems prevent spending the same digital money twice. Try the double-spend attack!
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedSystem('centralized')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            selectedSystem === 'centralized'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Centralized System
        </button>
        <button
          onClick={() => setSelectedSystem('blockchain')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            selectedSystem === 'blockchain'
              ? 'bg-indigo-500 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Blockchain System
        </button>
      </div>

      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div className="text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-lg font-semibold text-slate-800">Your Wallet</div>
              <div className={`text-2xl font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ${balance}
              </div>
            </div>

            <div className="text-center px-6">
              <div className="text-2xl mb-2">
                {selectedSystem === 'centralized' ? '🏦' : '⛓️'}
              </div>
              <div className="text-sm font-medium text-slate-600">
                {selectedSystem === 'centralized' ? 'Trusted Bank' : 'Blockchain Network'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {selectedSystem === 'centralized' 
                  ? 'Single source of truth' 
                  : 'Decentralized consensus'
                }
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">👩</div>
                <div className="text-sm font-medium text-slate-700">Alice</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">👨</div>
                <div className="text-sm font-medium text-slate-700">Bob</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => attemptTransaction('Alice', 30)}
              disabled={attemptingDoubleSpend}
              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              Send $30 to Alice
            </button>
            <button
              onClick={() => attemptTransaction('Bob', 40)}
              disabled={attemptingDoubleSpend}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              Send $40 to Bob
            </button>
            <button
              onClick={simulateDoubleSpend}
              disabled={attemptingDoubleSpend}
              className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-4 py-3 rounded-lg transition-colors disabled:opacity-50 font-medium"
            >
              🚨 Try Double Spend Attack
            </button>
          </div>

          {transactions.length > 0 && (
            <div className="border-t border-slate-200 pt-4">
              <h4 className="font-semibold text-slate-700 mb-3">Transaction History</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className={`flex justify-between items-center p-3 rounded-lg border ${
                      tx.status === 'approved'
                        ? 'bg-emerald-50 border-emerald-200'
                        : tx.status === 'rejected'
                        ? 'bg-rose-50 border-rose-200'
                        : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-slate-700">
                        To: {tx.to}
                      </div>
                      <div className="text-sm text-slate-600">
                        ${tx.amount}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      tx.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : tx.status === 'rejected'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {tx.status === 'pending' && '⏳ Pending'}
                      {tx.status === 'approved' && '✅ Approved'}
                      {tx.status === 'rejected' && '❌ Rejected'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button
              onClick={resetDemo}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2 rounded-lg transition-colors"
            >
              Reset Demo
            </button>
          </div>
        </div>

        <div className="mt-6 bg-slate-100 rounded-lg p-4">
          <div className="text-sm text-slate-600">
            <strong>How it works:</strong> {selectedSystem === 'centralized' 
              ? 'The bank maintains a single ledger and processes transactions sequentially, preventing double spends by checking balance before approval.'
              : 'The blockchain network uses consensus mechanisms to validate transactions, ensuring all nodes agree before confirming spending.'
            }
          </div>
        </div>
      </div>
    </div>
  );
}
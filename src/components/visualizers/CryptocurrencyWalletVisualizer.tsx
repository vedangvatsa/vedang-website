"use client";

import { useState } from 'react';

export function CryptocurrencyWalletVisualizer() {
  const [selectedWallet, setSelectedWallet] = useState<'hardware' | 'software' | 'paper' | null>(null);
  const [transactionStep, setTransactionStep] = useState(0);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [balance, setBalance] = useState(2.5);

  const walletTypes = {
    hardware: {
      name: 'Hardware Wallet',
      security: 'High',
      convenience: 'Medium',
      color: 'emerald',
      description: 'Physical device, offline storage'
    },
    software: {
      name: 'Software Wallet',
      security: 'Medium',
      convenience: 'High',
      color: 'blue',
      description: 'Mobile/desktop app, online'
    },
    paper: {
      name: 'Paper Wallet',
      security: 'High',
      convenience: 'Low',
      color: 'amber',
      description: 'Printed keys, completely offline'
    }
  };

  const transactionSteps = [
    'Initiate transaction',
    'Sign with private key',
    'Broadcast to network',
    'Transaction confirmed'
  ];

  const publicKey = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
  const privateKey = "5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ";

  const simulateTransaction = () => {
    if (transactionStep < 3) {
      setTransactionStep(transactionStep + 1);
      if (transactionStep === 3) {
        setBalance(balance - 0.1);
      }
    } else {
      setTransactionStep(0);
      setBalance(2.5);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Cryptocurrency Wallet</h3>
        <p className="text-slate-600">Interactive visualization of wallet types, keys, and transactions</p>
      </div>

      {/* Wallet Types Selection */}
      <div className="w-full max-w-4xl">
        <h4 className="text-lg font-semibold text-slate-700 mb-4">Choose a Wallet Type</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(walletTypes).map(([type, info]) => (
            <button
              key={type}
              onClick={() => setSelectedWallet(type as any)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedWallet === type
                  ? `border-${info.color}-500 bg-${info.color}-50`
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-left">
                <h5 className="font-semibold text-slate-800">{info.name}</h5>
                <p className="text-sm text-slate-600 mt-1">{info.description}</p>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Security:</span>
                    <span className={`font-medium ${
                      info.security === 'High' ? 'text-emerald-600' : 
                      info.security === 'Medium' ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {info.security}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Convenience:</span>
                    <span className={`font-medium ${
                      info.convenience === 'High' ? 'text-emerald-600' : 
                      info.convenience === 'Medium' ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {info.convenience}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedWallet && (
        <>
          {/* Key Management */}
          <div className="w-full max-w-4xl bg-white rounded-lg p-6 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-700 mb-4">Key Management</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h5 className="font-medium text-emerald-700">Public Key (Address)</h5>
                <div className="bg-emerald-50 p-3 rounded border border-emerald-200">
                  <p className="text-sm font-mono text-emerald-800 break-all">{publicKey}</p>
                </div>
                <p className="text-xs text-slate-600">✓ Safe to share • Used to receive funds</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h5 className="font-medium text-rose-700">Private Key</h5>
                  <button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="text-xs bg-rose-100 hover:bg-rose-200 px-2 py-1 rounded text-rose-700"
                  >
                    {showPrivateKey ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="bg-rose-50 p-3 rounded border border-rose-200">
                  <p className="text-sm font-mono text-rose-800 break-all">
                    {showPrivateKey ? privateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                  </p>
                </div>
                <p className="text-xs text-slate-600">⚠️ Never share • Required to spend funds</p>
              </div>
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="w-full max-w-4xl bg-white rounded-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-slate-700">Wallet Balance</h4>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-700">{balance.toFixed(1)} ETH</div>
                <div className="text-sm text-slate-500">${(balance * 2000).toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Transaction Simulation */}
          <div className="w-full max-w-4xl bg-white rounded-lg p-6 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-700 mb-4">Transaction Simulation</h4>
            
            <div className="flex items-center justify-between mb-6">
              {transactionSteps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= transactionStep 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="ml-2 text-xs text-slate-600 max-w-20">{step}</div>
                  {index < transactionSteps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      index < transactionStep ? 'bg-blue-500' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {transactionStep === 0 && (
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-700">Send 0.1 ETH to: 0x742d35Cc6634C0532925a3b8D0c30e36c7D</p>
              </div>
            )}

            {transactionStep === 1 && (
              <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
                <p className="text-sm text-rose-700">🔐 Signing transaction with private key...</p>
                <p className="text-xs text-slate-600 mt-1">This proves you own the funds and authorize the transfer</p>
              </div>
            )}

            {transactionStep === 2 && (
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-700">📡 Broadcasting to blockchain network...</p>
                <p className="text-xs text-slate-600 mt-1">Miners/validators will confirm this transaction</p>
              </div>
            )}

            {transactionStep === 3 && (
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <p className="text-sm text-emerald-700">✅ Transaction confirmed! Funds transferred.</p>
                <p className="text-xs text-slate-600 mt-1">Your wallet balance has been updated</p>
              </div>
            )}

            <button
              onClick={simulateTransaction}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {transactionStep === 3 ? 'Start New Transaction' : 'Next Step'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
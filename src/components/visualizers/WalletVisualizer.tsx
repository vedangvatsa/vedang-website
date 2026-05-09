"use client";

import React, { useState } from 'react';

export function WalletVisualizer() {
  const [walletType, setWalletType] = useState<'custodial' | 'non-custodial'>('custodial');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [transactionStep, setTransactionStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const privateKey = "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b";
  const publicAddress = "0x742d35Cc6634C0532925a3b8D4012345678ABCdef";

  const handleTransaction = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTransactionStep(1);
    
    setTimeout(() => setTransactionStep(2), 1000);
    setTimeout(() => setTransactionStep(3), 2000);
    setTimeout(() => setTransactionStep(4), 3000);
    setTimeout(() => {
      setTransactionStep(0);
      setIsAnimating(false);
    }, 4500);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Web3 Wallet</h3>
        <p className="text-slate-600 text-sm max-w-2xl">
          Interactive visualization showing how wallets store private keys and sign transactions
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setWalletType('custodial')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            walletType === 'custodial'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white text-slate-600 border border-slate-300 hover:border-blue-300'
          }`}
        >
          Custodial Wallet
        </button>
        <button
          onClick={() => setWalletType('non-custodial')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            walletType === 'non-custodial'
              ? 'bg-emerald-500 text-white shadow-lg'
              : 'bg-white text-slate-600 border border-slate-300 hover:border-emerald-300'
          }`}
        >
          Non-Custodial Wallet
        </button>
      </div>

      <div className="w-full max-w-4xl">
        {walletType === 'custodial' ? (
          <div className="bg-white rounded-xl p-6 border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Custodial Wallet (Exchange)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Your Account</h5>
                  <div className="text-sm text-slate-600">
                    <p>Username: user123</p>
                    <p>Password: ********</p>
                    <p className="text-rose-600 mt-2">⚠️ No direct access to private key</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-100 p-4 rounded-lg border-2 border-dashed border-slate-300">
                  <h5 className="font-medium text-slate-700 mb-2">Exchange Server</h5>
                  <div className="text-sm text-slate-600">
                    <p>🔐 Private Key: {showPrivateKey ? privateKey.slice(0, 20) + '...' : '••••••••••••••••••••'}</p>
                    <p>📝 Controls transactions for you</p>
                    <p className="text-amber-600 mt-2">⚡ Convenient but requires trust</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 border border-emerald-200">
            <h4 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              Non-Custodial Wallet (Self-Custody)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-emerald-50 p-4 rounded-lg border-2 border-emerald-200">
                  <h5 className="font-medium text-emerald-800 mb-2">Your Wallet</h5>
                  <div className="text-sm text-slate-600">
                    <p>🔐 Private Key: {showPrivateKey ? privateKey.slice(0, 20) + '...' : '••••••••••••••••••••'}</p>
                    <button
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded mt-2 hover:bg-emerald-200"
                    >
                      {showPrivateKey ? 'Hide' : 'Show'} Key
                    </button>
                    <p className="text-emerald-600 mt-2">✓ Full control & ownership</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h5 className="font-medium text-slate-700 mb-2">Public Address</h5>
                  <div className="text-xs text-slate-600 break-all">
                    {publicAddress}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Safe to share publicly</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-xl p-6 border border-indigo-200">
          <h4 className="text-lg font-semibold text-indigo-800 mb-4">Transaction Signing Process</h4>
          
          <button
            onClick={handleTransaction}
            disabled={isAnimating}
            className={`mb-6 px-6 py-3 rounded-lg font-medium transition-all ${
              isAnimating 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg hover:shadow-xl'
            }`}
          >
            {isAnimating ? 'Signing Transaction...' : 'Start Transaction'}
          </button>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg border-2 transition-all ${
              transactionStep >= 1 ? 'bg-blue-50 border-blue-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mb-2 ${
                transactionStep >= 1 ? 'bg-blue-500' : 'bg-slate-300'
              }`}>
                1
              </div>
              <h5 className="font-medium text-sm mb-1">Create Transaction</h5>
              <p className="text-xs text-slate-600">Send 0.1 ETH to friend</p>
            </div>

            <div className={`p-4 rounded-lg border-2 transition-all ${
              transactionStep >= 2 ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mb-2 ${
                transactionStep >= 2 ? 'bg-amber-500' : 'bg-slate-300'
              }`}>
                2
              </div>
              <h5 className="font-medium text-sm mb-1">Access Private Key</h5>
              <p className="text-xs text-slate-600">Retrieve signing key</p>
            </div>

            <div className={`p-4 rounded-lg border-2 transition-all ${
              transactionStep >= 3 ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mb-2 ${
                transactionStep >= 3 ? 'bg-rose-500' : 'bg-slate-300'
              }`}>
                3
              </div>
              <h5 className="font-medium text-sm mb-1">Sign Transaction</h5>
              <p className="text-xs text-slate-600">Cryptographic signature</p>
            </div>

            <div className={`p-4 rounded-lg border-2 transition-all ${
              transactionStep >= 4 ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mb-2 ${
                transactionStep >= 4 ? 'bg-emerald-500' : 'bg-slate-300'
              }`}>
                4
              </div>
              <h5 className="font-medium text-sm mb-1">Broadcast</h5>
              <p className="text-xs text-slate-600">Send to blockchain</p>
            </div>
          </div>

          {transactionStep >= 3 && (
            <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
              <p className="text-sm text-indigo-800">
                🔐 <strong>Digital Signature:</strong> Proves you own the private key without revealing it
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
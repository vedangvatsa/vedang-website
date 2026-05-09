"use client";

import { useState } from 'react';

export function ColdWalletVisualizer() {
  const [step, setStep] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isTransactionSigned, setIsTransactionSigned] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [animateTransaction, setAnimateTransaction] = useState(false);

  const steps = [
    "Cold wallet stores private keys offline",
    "Connect hardware wallet to computer",
    "Create transaction on computer",
    "Review transaction on device screen",
    "Confirm transaction on device",
    "Signed transaction sent to network"
  ];

  const handleConnect = () => {
    setIsConnected(!isConnected);
    if (!isConnected) {
      setStep(1);
    } else {
      setStep(0);
      setIsTransactionSigned(false);
      setAnimateTransaction(false);
    }
  };

  const handleCreateTransaction = () => {
    if (isConnected && step === 1) {
      setStep(2);
    }
  };

  const handleReviewTransaction = () => {
    if (step === 2) {
      setStep(3);
    }
  };

  const handleConfirmTransaction = () => {
    if (step === 3) {
      setStep(4);
      setIsTransactionSigned(true);
      setAnimateTransaction(true);
      setTimeout(() => {
        setStep(5);
        setAnimateTransaction(false);
      }, 2000);
    }
  };

  const resetDemo = () => {
    setStep(0);
    setIsConnected(false);
    setIsTransactionSigned(false);
    setAnimateTransaction(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Cold Wallet Security</h3>
        <p className="text-slate-600">Interact with this simulation to understand how cold wallets keep your crypto secure offline</p>
      </div>

      <div className="w-full max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Transaction Flow Progress</span>
            <span className="text-sm text-slate-500">{step + 1} / {steps.length}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-slate-600 mt-2">{steps[step]}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Internet/Computer Side */}
          <div className="bg-white rounded-xl p-6 border-2 border-rose-200">
            <h4 className="font-semibold text-rose-700 mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
              Internet-Connected Computer
            </h4>
            
            <div className="space-y-3">
              <div className="p-3 bg-slate-100 rounded-lg">
                <div className="text-xs text-slate-500 mb-1">Wallet Software</div>
                <div className="text-sm">🖥️ Online Interface</div>
              </div>
              
              <button
                onClick={handleCreateTransaction}
                disabled={!isConnected || step !== 1}
                className="w-full p-3 bg-blue-100 hover:bg-blue-200 disabled:bg-slate-100 disabled:text-slate-400 rounded-lg text-sm transition-colors"
              >
                Create Transaction
              </button>
              
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="text-xs text-amber-600 mb-1">⚠️ Security Note</div>
                <div className="text-xs text-amber-700">Private keys never stored here</div>
              </div>

              {animateTransaction && (
                <div className="p-3 bg-emerald-100 rounded-lg border-2 border-emerald-300">
                  <div className="text-xs text-emerald-600 mb-1">📡 Broadcasting...</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="text-xs">Sending to network</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Connection Visualization */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full">
              <div className="flex items-center justify-between">
                <div className="w-4 h-4 bg-rose-400 rounded-full"></div>
                <div className="flex-1 mx-4 relative">
                  <div className={`h-0.5 bg-gradient-to-r transition-all duration-500 ${
                    isConnected ? 'from-rose-400 to-indigo-400' : 'from-slate-300 to-slate-300'
                  }`}></div>
                  {isConnected && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs bg-white px-2 py-1 rounded shadow">
                      USB
                    </div>
                  )}
                </div>
                <div className={`w-4 h-4 rounded-full transition-colors ${
                  isConnected ? 'bg-indigo-400' : 'bg-slate-300'
                }`}></div>
              </div>
            </div>

            <button
              onClick={handleConnect}
              className={`mt-4 px-6 py-2 rounded-lg font-medium transition-all ${
                isConnected 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              {isConnected ? 'Disconnect' : 'Connect Wallet'}
            </button>

            <button
              onClick={resetDemo}
              className="mt-2 px-4 py-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
            >
              Reset Demo
            </button>
          </div>

          {/* Cold Wallet Device */}
          <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
            <h4 className="font-semibold text-indigo-700 mb-4 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full transition-colors ${
                isConnected ? 'bg-emerald-500' : 'bg-slate-400'
              }`}></div>
              Hardware Wallet (Cold Storage)
            </h4>
            
            <div className="space-y-3">
              <div className="p-4 bg-slate-900 rounded-lg text-center">
                <div className="text-xs text-slate-400 mb-2">Device Screen</div>
                {step >= 3 && (
                  <div className="text-xs text-emerald-400 mb-2">
                    📋 Review Transaction<br/>
                    Send: 0.1 BTC<br/>
                    To: bc1q...xyz
                  </div>
                )}
                <div className="text-xs text-white">
                  {!isConnected ? 'Offline' : 
                   step < 3 ? 'Ready' : 
                   step === 3 ? '✓ Confirm?' : 
                   step >= 4 ? '✅ Signed' : 'Ready'}
                </div>
              </div>

              {step >= 3 && step < 4 && (
                <button
                  onClick={handleConfirmTransaction}
                  className="w-full p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  👆 Press Button to Confirm
                </button>
              )}

              {step >= 2 && step < 3 && (
                <button
                  onClick={handleReviewTransaction}
                  className="w-full p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  📋 Review on Screen
                </button>
              )}
              
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="text-xs text-emerald-600 mb-1 flex items-center gap-1">
                  🔒 Private Key Storage
                  <button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="text-blue-500 underline ml-1"
                  >
                    {showPrivateKey ? 'hide' : 'show'}
                  </button>
                </div>
                <div className="text-xs text-emerald-700 font-mono">
                  {showPrivateKey ? 'E9873D79C6D87DC0FB6A577...' : '••••••••••••••••••••••••••••'}
                </div>
                <div className="text-xs text-emerald-600 mt-1">🔐 Never exposed to computer</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="font-medium text-blue-800 mb-2">🛡️ Why Cold Wallets Are Secure:</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5"></div>
              <span className="text-slate-700">Private keys never touch the internet</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5"></div>
              <span className="text-slate-700">Transactions signed inside secure device</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5"></div>
              <span className="text-slate-700">Protected from malware and hackers</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5"></div>
              <span className="text-slate-700">Physical confirmation required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
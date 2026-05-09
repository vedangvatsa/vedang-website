"use client";

import React, { useState } from 'react';

export function BridgeVisualizer() {
  const [step, setStep] = useState(0);
  const [btcAmount, setBtcAmount] = useState(1);
  const [lockedBTC, setLockedBTC] = useState(0);
  const [mintedWBTC, setMintedWBTC] = useState(0);
  
  const steps = [
    'Select Amount',
    'Lock BTC',
    'Mint WBTC',
    'Bridge Complete'
  ];

  const handleBridge = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      setLockedBTC(btcAmount);
      setStep(2);
    } else if (step === 2) {
      setMintedWBTC(btcAmount);
      setStep(3);
    }
  };

  const handleBurnAndUnlock = () => {
    if (step === 3) {
      setMintedWBTC(0);
      setLockedBTC(0);
      setStep(0);
    }
  };

  const resetDemo = () => {
    setStep(0);
    setLockedBTC(0);
    setMintedWBTC(0);
    setBtcAmount(1);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Bridge Protocol Visualizer</h3>
        <p className="text-slate-600 max-w-2xl">
          Interactive demonstration of how assets move between blockchains through lock-and-mint mechanisms
        </p>
      </div>

      {/* Step Progress */}
      <div className="flex items-center gap-4 mb-6">
        {steps.map((stepName, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              index <= step ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-600'
            }`}>
              {index + 1}
            </div>
            <span className={`text-sm ${index <= step ? 'text-blue-600' : 'text-slate-400'}`}>
              {stepName}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${index < step ? 'bg-blue-500' : 'bg-slate-300'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Amount Selector */}
      {step === 0 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Select BTC Amount to Bridge</h4>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={btcAmount}
              onChange={(e) => setBtcAmount(parseFloat(e.target.value))}
              className="w-48"
            />
            <span className="text-lg font-bold text-slate-800">{btcAmount} BTC</span>
          </div>
        </div>
      )}

      {/* Bridge Visualization */}
      <div className="flex items-center gap-12">
        {/* Bitcoin Chain */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-amber-100 border-2 border-amber-300 rounded-xl p-6 w-48 text-center">
            <h4 className="text-lg font-bold text-amber-800 mb-2">Bitcoin Chain</h4>
            <div className="text-sm text-amber-700 mb-3">Your Wallet</div>
            <div className="bg-amber-200 rounded-lg p-3 mb-3">
              <span className="text-lg font-bold text-amber-800">
                {step === 0 ? btcAmount : (btcAmount - lockedBTC)} BTC
              </span>
            </div>
            <div className="text-sm text-amber-700 mb-2">Bridge Contract</div>
            <div className={`rounded-lg p-3 transition-all duration-500 ${
              lockedBTC > 0 ? 'bg-amber-300 animate-pulse' : 'bg-amber-50'
            }`}>
              <span className="text-lg font-bold text-amber-800">
                {lockedBTC} BTC Locked
              </span>
            </div>
          </div>
        </div>

        {/* Bridge Animation */}
        <div className="flex flex-col items-center gap-2">
          <div className={`w-16 h-16 rounded-full border-4 transition-all duration-1000 ${
            step >= 1 && step < 3 ? 'border-blue-500 animate-spin border-t-transparent' : 'border-slate-300'
          } flex items-center justify-center`}>
            <span className="text-xs font-bold text-slate-600">
              {step === 1 ? 'LOCK' : step === 2 ? 'MINT' : step === 3 ? '✓' : '?'}
            </span>
          </div>
          <div className="text-xs text-slate-600 text-center">Bridge<br/>Protocol</div>
        </div>

        {/* Ethereum Chain */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-indigo-100 border-2 border-indigo-300 rounded-xl p-6 w-48 text-center">
            <h4 className="text-lg font-bold text-indigo-800 mb-2">Ethereum Chain</h4>
            <div className="text-sm text-indigo-700 mb-3">Your Wallet</div>
            <div className={`rounded-lg p-3 transition-all duration-500 ${
              mintedWBTC > 0 ? 'bg-indigo-300 animate-pulse' : 'bg-indigo-50'
            }`}>
              <span className="text-lg font-bold text-indigo-800">
                {mintedWBTC} WBTC
              </span>
            </div>
            <div className="text-xs text-indigo-600 mt-2">
              Wrapped Bitcoin (ERC-20)
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {step < 3 ? (
          <button
            onClick={handleBridge}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {step === 0 ? 'Start Bridge' : step === 1 ? 'Lock BTC' : 'Mint WBTC'}
          </button>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={handleBurnAndUnlock}
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Burn WBTC & Unlock BTC
            </button>
            <button
              onClick={resetDemo}
              className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              New Bridge
            </button>
          </div>
        )}
      </div>

      {/* Status Message */}
      <div className="text-center bg-white p-4 rounded-lg border border-slate-200 max-w-md">
        {step === 0 && (
          <p className="text-slate-600">Choose how much BTC you want to bridge to Ethereum as WBTC</p>
        )}
        {step === 1 && (
          <p className="text-amber-700">Your BTC will be locked in the bridge contract on Bitcoin chain</p>
        )}
        {step === 2 && (
          <p className="text-blue-600">Bridge is processing... BTC locked, preparing to mint WBTC</p>
        )}
        {step === 3 && (
          <p className="text-emerald-600">Success! You now have WBTC on Ethereum. You can burn it anytime to unlock your original BTC</p>
        )}
      </div>
    </div>
  );
}
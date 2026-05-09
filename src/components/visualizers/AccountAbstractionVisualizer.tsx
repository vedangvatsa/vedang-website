"use client";

import React, { useState } from 'react';

export function AccountAbstractionVisualizer() {
  const [selectedAccount, setSelectedAccount] = useState<'traditional' | 'abstracted'>('traditional');
  const [authMethod, setAuthMethod] = useState<'private-key' | 'multisig' | 'biometric' | 'social'>('private-key');
  const [gasToken, setGasToken] = useState<'ETH' | 'USDC' | 'DAI'>('ETH');
  const [isAnimating, setIsAnimating] = useState(false);
  const [transactionStep, setTransactionStep] = useState(0);

  const traditionalFeatures = {
    auth: ['Single Private Key', 'secp256k1 Signature'],
    gas: ['ETH Only'],
    recovery: ['Private Key Backup'],
    flexibility: ['Fixed Rules']
  };

  const abstractedFeatures = {
    auth: authMethod === 'multisig' ? ['Multiple Signers', '2-of-3 Multisig'] :
          authMethod === 'biometric' ? ['Fingerprint', 'Face Recognition'] :
          authMethod === 'social' ? ['Trusted Contacts', 'Recovery Network'] :
          ['Programmable Auth', 'Custom Logic'],
    gas: gasToken === 'ETH' ? ['ETH Payment'] : 
         gasToken === 'USDC' ? ['USDC Payment', 'Gasless for User'] :
         ['DAI Payment', 'Sponsored Gas'],
    recovery: authMethod === 'social' ? ['Social Recovery', 'Guardian Network'] :
              authMethod === 'multisig' ? ['Multi-Device Recovery', 'Hardware Backup'] :
              ['Biometric Recovery', 'Device Sync'],
    flexibility: ['Programmable Rules', 'Custom Logic', 'Upgradeable']
  };

  const simulateTransaction = () => {
    setIsAnimating(true);
    setTransactionStep(0);
    
    const steps = selectedAccount === 'traditional' ? 3 : 4;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      setTransactionStep(currentStep);
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnimating(false);
          setTransactionStep(0);
        }, 1000);
      }
    }, 800);
  };

  const getStepDescription = () => {
    if (selectedAccount === 'traditional') {
      switch (transactionStep) {
        case 1: return 'Validating secp256k1 signature...';
        case 2: return 'Checking ETH balance for gas...';
        case 3: return 'Transaction executed!';
        default: return 'Ready to transact';
      }
    } else {
      switch (transactionStep) {
        case 1: return `Validating ${authMethod} authentication...`;
        case 2: return `Processing ${gasToken} gas payment...`;
        case 3: return 'Executing custom validation logic...';
        case 4: return 'Transaction executed with account abstraction!';
        default: return 'Ready to transact with programmable rules';
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Account Abstraction</h3>
        <p className="text-slate-600 max-w-2xl">
          Compare traditional Ethereum accounts with programmable smart contract accounts that offer flexible authentication, gas payment, and recovery options.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedAccount('traditional')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            selectedAccount === 'traditional'
              ? 'bg-rose-500 text-white shadow-lg'
              : 'bg-white text-slate-600 border border-slate-300 hover:border-rose-300'
          }`}
        >
          Traditional EOA
        </button>
        <button
          onClick={() => setSelectedAccount('abstracted')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            selectedAccount === 'abstracted'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white text-slate-600 border border-slate-300 hover:border-blue-300'
          }`}
        >
          Smart Contract Account
        </button>
      </div>

      {selectedAccount === 'abstracted' && (
        <div className="flex flex-col gap-4 w-full max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Authentication Method</label>
              <select
                value={authMethod}
                onChange={(e) => setAuthMethod(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="private-key">Private Key</option>
                <option value="multisig">Multisig</option>
                <option value="biometric">Biometric</option>
                <option value="social">Social Recovery</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Gas Token</label>
              <select
                value={gasToken}
                onChange={(e) => setGasToken(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="ETH">ETH</option>
                <option value="USDC">USDC</option>
                <option value="DAI">DAI</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={simulateTransaction}
                disabled={isAnimating}
                className="w-full bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnimating ? 'Processing...' : 'Simulate Transaction'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedAccount === 'traditional' && (
        <div className="w-full max-w-2xl flex justify-center">
          <button
            onClick={simulateTransaction}
            disabled={isAnimating}
            className="bg-emerald-500 text-white py-3 px-6 rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isAnimating ? 'Processing...' : 'Simulate Transaction'}
          </button>
        </div>
      )}

      <div className="w-full max-w-4xl">
        <div className={`p-6 rounded-xl border-2 transition-all ${
          selectedAccount === 'traditional' 
            ? 'border-rose-300 bg-rose-50' 
            : 'border-blue-300 bg-blue-50'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Authentication</h4>
              <div className="space-y-2">
                {(selectedAccount === 'traditional' ? traditionalFeatures.auth : abstractedFeatures.auth).map((feature, index) => (
                  <div key={index} className={`p-2 rounded-lg text-sm ${
                    selectedAccount === 'traditional' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Gas Payment</h4>
              <div className="space-y-2">
                {(selectedAccount === 'traditional' ? traditionalFeatures.gas : abstractedFeatures.gas).map((feature, index) => (
                  <div key={index} className={`p-2 rounded-lg text-sm ${
                    selectedAccount === 'traditional' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Recovery</h4>
              <div className="space-y-2">
                {(selectedAccount === 'traditional' ? traditionalFeatures.recovery : abstractedFeatures.recovery).map((feature, index) => (
                  <div key={index} className={`p-2 rounded-lg text-sm ${
                    selectedAccount === 'traditional' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Flexibility</h4>
              <div className="space-y-2">
                {(selectedAccount === 'traditional' ? traditionalFeatures.flexibility : abstractedFeatures.flexibility).map((feature, index) => (
                  <div key={index} className={`p-2 rounded-lg text-sm ${
                    selectedAccount === 'traditional' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isAnimating && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full"></div>
              <span className="text-amber-800 font-medium">{getStepDescription()}</span>
            </div>
            <div className="mt-3">
              <div className="w-full bg-amber-200 rounded-full h-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(transactionStep / (selectedAccount === 'traditional' ? 3 : 4)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-sm text-slate-500 max-w-3xl">
        Traditional accounts use fixed rules: one private key, secp256k1 signatures, ETH for gas. 
        Account abstraction makes these rules programmable, enabling custom authentication, flexible gas payments, and sophisticated recovery mechanisms.
      </div>
    </div>
  );
}
"use client";

import React, { useState } from 'react';

export function SeedPhraseVisualizer() {
  const [step, setStep] = useState(0);
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [compromised, setCompromised] = useState(false);

  const sampleWords = [
    'abandon', 'ability', 'about', 'above', 'absent', 'absorb',
    'abstract', 'absurd', 'abuse', 'access', 'accident', 'account'
  ];

  const steps = [
    'Generate Random Words',
    'Create Seed Phrase',
    'Derive Private Keys',
    'Generate Addresses'
  ];

  const handleWordClick = (index: number) => {
    if (selectedWords.includes(index)) {
      setSelectedWords(selectedWords.filter(i => i !== index));
    } else if (selectedWords.length < 12) {
      setSelectedWords([...selectedWords, index]);
    }
  };

  const generateAddress = (keyIndex: number) => {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor((keyIndex * 7 + i * 3) % 16)];
    }
    return address;
  };

  const generatePrivateKey = (wordIndex: number) => {
    const chars = '0123456789abcdef';
    let key = '';
    for (let i = 0; i < 64; i++) {
      key += chars[Math.floor((wordIndex * 11 + i * 5) % 16)];
    }
    return key;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Seed Phrase Security</h3>
        <p className="text-slate-600">Interactive demonstration of how seed phrases control wallet access</p>
      </div>

      <div className="flex gap-4 mb-6">
        {steps.map((stepName, index) => (
          <button
            key={index}
            onClick={() => setStep(index)}
            className={`px-4 py-2 rounded-lg transition-all ${
              step === index
                ? 'bg-blue-500 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {index + 1}. {stepName}
          </button>
        ))}
      </div>

      {step === 0 && (
        <div className="w-full max-w-4xl">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Step 1: Select 12 Random Words</h4>
          <div className="grid grid-cols-6 gap-3 mb-4">
            {sampleWords.map((word, index) => (
              <button
                key={index}
                onClick={() => handleWordClick(index)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedWords.includes(index)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                }`}
              >
                {word}
              </button>
            ))}
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">Selected Words ({selectedWords.length}/12):</p>
            <div className="flex flex-wrap gap-2">
              {selectedWords.map((wordIndex, position) => (
                <span key={position} className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                  {position + 1}. {sampleWords[wordIndex]}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="w-full max-w-4xl">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Step 2: Your Complete Seed Phrase</h4>
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-lg border border-emerald-200 mb-4">
            <div className="grid grid-cols-3 gap-4">
              {selectedWords.slice(0, 12).map((wordIndex, position) => (
                <div key={position} className="flex items-center gap-3">
                  <span className="bg-slate-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    {position + 1}
                  </span>
                  <span className="font-mono text-slate-800">{sampleWords[wordIndex] || '---'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
            <p className="text-rose-800 font-semibold">⚠️ Critical Security Warning</p>
            <p className="text-rose-700 text-sm mt-1">
              Anyone with this seed phrase has COMPLETE control of your wallet. Never share it!
            </p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-4xl">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Step 3: Derive Private Keys</h4>
          <div className="space-y-4">
            {selectedWords.slice(0, 3).map((wordIndex, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-600">Account {index + 1}</span>
                  <button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded"
                  >
                    {showPrivateKey ? 'Hide' : 'Show'} Private Key
                  </button>
                </div>
                <div className="font-mono text-xs bg-slate-50 p-3 rounded">
                  {showPrivateKey ? generatePrivateKey(wordIndex) : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="w-full max-w-4xl">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Step 4: Generate Wallet Addresses</h4>
          <div className="space-y-4 mb-6">
            {selectedWords.slice(0, 3).map((wordIndex, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-600">Wallet {index + 1}</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">Active</span>
                </div>
                <div className="font-mono text-sm bg-slate-50 p-3 rounded">
                  {generateAddress(wordIndex)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
            <h5 className="font-semibold text-amber-800 mb-3">Test: What if someone gets your seed phrase?</h5>
            <button
              onClick={() => setCompromised(!compromised)}
              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg mb-4"
            >
              {compromised ? 'Restore Security' : 'Simulate Compromise'}
            </button>
            {compromised && (
              <div className="bg-rose-100 p-4 rounded border border-rose-300">
                <p className="text-rose-800 font-semibold">🚨 Wallet Compromised!</p>
                <p className="text-rose-700 text-sm mt-2">
                  The attacker can now generate the same private keys and addresses. 
                  All funds can be transferred immediately. There is no recovery mechanism.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-center bg-indigo-50 p-4 rounded-lg border border-indigo-200 w-full max-w-2xl">
        <p className="text-indigo-800 font-semibold">Key Takeaway</p>
        <p className="text-indigo-700 text-sm mt-1">
          Your seed phrase is your wallet. Lose it = lose everything. Share it = lose everything. 
          Store it securely offline!
        </p>
      </div>
    </div>
  );
}
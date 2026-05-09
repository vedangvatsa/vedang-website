"use client";

import React, { useState, useEffect } from 'react';

export function AtomicSwapVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(24);
  const [secret] = useState('7x9mK2p');
  const [secretHash] = useState('a8b2c4d6');
  const [aliceRevealed, setAliceRevealed] = useState(false);
  const [bobClaimed, setBobClaimed] = useState(false);

  const steps = [
    'Initial Setup',
    'Alice Creates Hash Lock',
    'Alice Locks Bitcoin',
    'Bob Locks Litecoin',
    'Alice Reveals Secret',
    'Bob Claims Bitcoin',
    'Alice Claims Litecoin',
    'Swap Complete'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        handleNextStep();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentStep]);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      if (nextStep === 4) setAliceRevealed(true);
      if (nextStep === 5) setBobClaimed(true);
      if (nextStep === 6) setTimeRemaining(12);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      if (prevStep < 4) setAliceRevealed(false);
      if (prevStep < 5) setBobClaimed(false);
      if (prevStep < 6) setTimeRemaining(24);
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsAutoPlaying(false);
    setAliceRevealed(false);
    setBobClaimed(false);
    setTimeRemaining(24);
  };

  const getContractState = (side: 'alice' | 'bob') => {
    if (side === 'alice') {
      if (currentStep < 2) return 'inactive';
      if (currentStep >= 6) return 'claimed';
      if (bobClaimed) return 'claimable';
      return 'locked';
    } else {
      if (currentStep < 3) return 'inactive';
      if (currentStep >= 7) return 'claimed';
      if (aliceRevealed) return 'claimable';
      return 'locked';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Atomic Swap Visualization</h3>
        <p className="text-slate-600">Interactive demonstration of trustless cross-chain cryptocurrency exchange using Hash Time-Locked Contracts (HTLCs)</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Alice Side */}
        <div className="flex-1 bg-white rounded-xl p-6 border border-slate-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-xl">A</span>
            </div>
            <h4 className="text-lg font-semibold text-slate-800">Alice</h4>
            <p className="text-slate-600 text-sm">Wants Litecoin</p>
          </div>

          <div className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-amber-700 font-medium">Bitcoin</span>
                <span className="text-amber-600">₿ 0.5</span>
              </div>
              <div className={`h-2 rounded-full transition-all duration-500 ${
                currentStep >= 2 ? 'bg-slate-300' : 'bg-amber-400'
              }`} />
              {currentStep >= 2 && <p className="text-xs text-slate-600 mt-1">Locked in HTLC</p>}
            </div>

            <div className={`p-4 rounded-lg border transition-all duration-500 ${
              getContractState('alice') === 'inactive' ? 'bg-slate-50 border-slate-200' :
              getContractState('alice') === 'locked' ? 'bg-indigo-50 border-indigo-200' :
              getContractState('alice') === 'claimable' ? 'bg-emerald-50 border-emerald-200' :
              'bg-rose-50 border-rose-200'
            }`}>
              <h5 className="font-medium text-slate-800 mb-2">Alice's Contract</h5>
              <div className="text-xs space-y-1">
                <p>Hash: <code className="bg-slate-200 px-1 rounded">{secretHash}</code></p>
                <p>Time Lock: {timeRemaining}h</p>
                <p>Status: {getContractState('alice')}</p>
              </div>
            </div>

            {currentStep >= 1 && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700">
                  Secret: {aliceRevealed ? secret : '•••••••'}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Hash: {secretHash}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Center Arrow */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
              currentStep >= 4 ? 'bg-emerald-500' : 'bg-slate-300'
            }`}>
              <span className="text-white text-xs">⟷</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="bg-slate-200 rounded-full px-3 py-1">
              <span className="text-xs font-medium text-slate-700">
                Step {currentStep + 1}/{steps.length}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2 max-w-24">
              {steps[currentStep]}
            </p>
          </div>
        </div>

        {/* Bob Side */}
        <div className="flex-1 bg-white rounded-xl p-6 border border-slate-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-indigo-600 font-bold text-xl">B</span>
            </div>
            <h4 className="text-lg font-semibold text-slate-800">Bob</h4>
            <p className="text-slate-600 text-sm">Wants Bitcoin</p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-700 font-medium">Litecoin</span>
                <span className="text-slate-600">Ł 10</span>
              </div>
              <div className={`h-2 rounded-full transition-all duration-500 ${
                currentStep >= 3 ? 'bg-slate-300' : 'bg-slate-400'
              }`} />
              {currentStep >= 3 && <p className="text-xs text-slate-600 mt-1">Locked in HTLC</p>}
            </div>

            <div className={`p-4 rounded-lg border transition-all duration-500 ${
              getContractState('bob') === 'inactive' ? 'bg-slate-50 border-slate-200' :
              getContractState('bob') === 'locked' ? 'bg-indigo-50 border-indigo-200' :
              getContractState('bob') === 'claimable' ? 'bg-emerald-50 border-emerald-200' :
              'bg-rose-50 border-rose-200'
            }`}>
              <h5 className="font-medium text-slate-800 mb-2">Bob's Contract</h5>
              <div className="text-xs space-y-1">
                <p>Hash: <code className="bg-slate-200 px-1 rounded">{secretHash}</code></p>
                <p>Time Lock: {timeRemaining - 2}h</p>
                <p>Status: {getContractState('bob')}</p>
              </div>
            </div>

            {currentStep >= 5 && (
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <p className="text-xs text-emerald-700">
                  ✓ Bitcoin claimed with secret
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  Secret learned: {secret}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            isAutoPlaying 
              ? 'bg-rose-500 text-white hover:bg-rose-600' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isAutoPlaying ? 'Pause' : 'Auto Play'}
        </button>
        <button
          onClick={handleNextStep}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors"
        >
          Next
        </button>
        <button
          onClick={resetDemo}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Status Description */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 max-w-2xl text-center">
        <p className="text-sm text-slate-700">
          {currentStep === 0 && "Alice wants to trade Bitcoin for Bob's Litecoin without a trusted intermediary."}
          {currentStep === 1 && "Alice generates a secret and creates its cryptographic hash."}
          {currentStep === 2 && "Alice locks her Bitcoin in a contract that Bob can claim with the secret within 24 hours."}
          {currentStep === 3 && "Bob locks his Litecoin in a contract that Alice can claim with the secret within 22 hours."}
          {currentStep === 4 && "Alice reveals the secret by claiming Bob's Litecoin."}
          {currentStep === 5 && "Bob learns the secret from the blockchain and uses it to claim Alice's Bitcoin."}
          {currentStep === 6 && "Alice successfully claims the Litecoin using her secret."}
          {currentStep === 7 && "Atomic swap complete! Both parties have their desired assets without trusting each other."}
        </p>
      </div>
    </div>
  );
}
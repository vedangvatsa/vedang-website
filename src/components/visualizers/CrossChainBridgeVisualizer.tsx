"use client";

import React, { useState, useEffect } from 'react';

export function CrossChainBridgeVisualizer() {
  const [selectedSourceChain, setSelectedSourceChain] = useState<'ethereum' | 'polygon' | 'bsc'>('ethereum');
  const [selectedDestChain, setSelectedDestChain] = useState<'polygon' | 'bsc' | 'ethereum'>('polygon');
  const [bridgeAmount, setBridgeAmount] = useState(100);
  const [bridgeStep, setBridgeStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sourceBalance, setSourceBalance] = useState(1000);
  const [destBalance, setDestBalance] = useState(0);
  const [lockedTokens, setLockedTokens] = useState(0);
  const [wrappedTokens, setWrappedTokens] = useState(0);

  const chains = {
    ethereum: { name: 'Ethereum', color: 'bg-blue-500', textColor: 'text-blue-700' },
    polygon: { name: 'Polygon', color: 'bg-indigo-500', textColor: 'text-indigo-700' },
    bsc: { name: 'BSC', color: 'bg-amber-500', textColor: 'text-amber-700' }
  };

  const bridgeSteps = [
    'Select chains and amount',
    'Lock tokens on source chain',
    'Validate transaction cross-chain',
    'Mint wrapped tokens on destination',
    'Bridge complete!'
  ];

  const startBridge = async () => {
    if (bridgeAmount > sourceBalance) return;
    
    setIsAnimating(true);
    setBridgeStep(1);
    
    // Step 1: Lock tokens
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSourceBalance(prev => prev - bridgeAmount);
    setLockedTokens(prev => prev + bridgeAmount);
    
    setBridgeStep(2);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setBridgeStep(3);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 2: Mint wrapped tokens
    setWrappedTokens(prev => prev + bridgeAmount);
    setDestBalance(prev => prev + bridgeAmount);
    
    setBridgeStep(4);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setBridgeStep(0);
    setIsAnimating(false);
  };

  const resetDemo = () => {
    setSourceBalance(1000);
    setDestBalance(0);
    setLockedTokens(0);
    setWrappedTokens(0);
    setBridgeStep(0);
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Cross-Chain Bridge Visualizer</h3>
        <p className="text-slate-600">See how tokens are locked on one chain and wrapped tokens are minted on another</p>
      </div>

      {/* Chain Selection */}
      <div className="flex items-center gap-8">
        <div className="text-center">
          <p className="text-sm font-medium text-slate-600 mb-2">Source Chain</p>
          <select 
            value={selectedSourceChain}
            onChange={(e) => setSelectedSourceChain(e.target.value as any)}
            className="px-4 py-2 border border-slate-300 rounded-lg"
            disabled={isAnimating}
          >
            {Object.entries(chains).map(([key, chain]) => (
              <option key={key} value={key}>{chain.name}</option>
            ))}
          </select>
        </div>
        
        <div className="text-2xl text-slate-400">→</div>
        
        <div className="text-center">
          <p className="text-sm font-medium text-slate-600 mb-2">Destination Chain</p>
          <select 
            value={selectedDestChain}
            onChange={(e) => setSelectedDestChain(e.target.value as any)}
            className="px-4 py-2 border border-slate-300 rounded-lg"
            disabled={isAnimating}
          >
            {Object.entries(chains).filter(([key]) => key !== selectedSourceChain).map(([key, chain]) => (
              <option key={key} value={key}>{chain.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Amount Input */}
      <div className="text-center">
        <p className="text-sm font-medium text-slate-600 mb-2">Bridge Amount</p>
        <input
          type="range"
          min="10"
          max="500"
          value={bridgeAmount}
          onChange={(e) => setBridgeAmount(Number(e.target.value))}
          className="w-48"
          disabled={isAnimating}
        />
        <p className="text-lg font-bold text-slate-800">{bridgeAmount} tokens</p>
      </div>

      {/* Bridge Visualization */}
      <div className="flex items-center gap-12 w-full max-w-4xl">
        {/* Source Chain */}
        <div className="flex-1">
          <div className={`${chains[selectedSourceChain].color} rounded-xl p-6 text-white text-center relative`}>
            <h4 className="text-xl font-bold mb-4">{chains[selectedSourceChain].name}</h4>
            
            <div className="space-y-3">
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-sm opacity-90">Your Balance</p>
                <p className="text-2xl font-bold">{sourceBalance}</p>
              </div>
              
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-sm opacity-90">Locked in Bridge</p>
                <p className="text-2xl font-bold">{lockedTokens}</p>
              </div>
            </div>

            {bridgeStep === 1 && (
              <div className="absolute inset-0 bg-white/20 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm">Locking tokens...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bridge Animation */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-24 h-2 bg-slate-300 rounded-full"></div>
            {isAnimating && (
              <div className="absolute top-0 left-0 w-6 h-2 bg-rose-500 rounded-full animate-pulse"
                   style={{
                     animation: 'bridge-transfer 4s linear infinite',
                     left: bridgeStep >= 2 ? '72px' : '0px',
                     transition: 'left 1s ease-in-out'
                   }}
              ></div>
            )}
          </div>
          
          <div className="text-center">
            <p className="text-xs text-slate-500 mb-2">Bridge Status</p>
            <p className="text-sm font-medium text-slate-700">
              {bridgeStep > 0 ? bridgeSteps[bridgeStep] : 'Ready to bridge'}
            </p>
          </div>
        </div>

        {/* Destination Chain */}
        <div className="flex-1">
          <div className={`${chains[selectedDestChain].color} rounded-xl p-6 text-white text-center relative`}>
            <h4 className="text-xl font-bold mb-4">{chains[selectedDestChain].name}</h4>
            
            <div className="space-y-3">
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-sm opacity-90">Your Balance</p>
                <p className="text-2xl font-bold">{destBalance}</p>
              </div>
              
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-sm opacity-90">Wrapped Tokens</p>
                <p className="text-2xl font-bold">{wrappedTokens}</p>
              </div>
            </div>

            {bridgeStep === 3 && (
              <div className="absolute inset-0 bg-white/20 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm">Minting wrapped tokens...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center gap-2 w-full max-w-2xl">
        {bridgeSteps.slice(1, 5).map((step, index) => (
          <div 
            key={index}
            className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-medium transition-all ${
              bridgeStep > index + 1 
                ? 'bg-emerald-100 text-emerald-700' 
                : bridgeStep === index + 1
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {step}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={startBridge}
          disabled={isAnimating || bridgeAmount > sourceBalance}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isAnimating ? 'Bridging...' : 'Start Bridge'}
        </button>
        
        <button
          onClick={resetDemo}
          className="px-6 py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
        >
          Reset Demo
        </button>
      </div>

      <div className="text-center text-sm text-slate-600 max-w-2xl">
        <p><strong>How it works:</strong> Original tokens are locked in a smart contract on the source chain, while equivalent "wrapped" tokens are minted on the destination chain. The bridge validators ensure the 1:1 backing relationship.</p>
      </div>
    </div>
  );
}
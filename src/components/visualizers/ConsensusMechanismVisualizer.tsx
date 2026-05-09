"use client";

import React, { useState, useEffect } from 'react';

export function ConsensusMechanismVisualizer() {
  const [mechanism, setMechanism] = useState<'pow' | 'pos'>('pow');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(1);
  const [miners, setMiners] = useState([
    { id: 1, hashPower: 25, stake: 1000, nonce: 0, solved: false, color: 'bg-blue-500' },
    { id: 2, hashPower: 20, stake: 800, nonce: 0, solved: false, color: 'bg-emerald-500' },
    { id: 3, hashPower: 30, stake: 1200, nonce: 0, solved: false, color: 'bg-rose-500' },
    { id: 4, hashPower: 25, stake: 900, nonce: 0, solved: false, color: 'bg-amber-500' }
  ]);
  const [targetHash, setTargetHash] = useState('0000');
  const [winner, setWinner] = useState<number | null>(null);

  const resetSimulation = () => {
    setIsAnimating(false);
    setWinner(null);
    setMiners(prev => prev.map(m => ({ ...m, nonce: 0, solved: false })));
  };

  const simulateHash = (minerId: number, nonce: number) => {
    // Simple hash simulation - check if hash starts with target
    const hash = (minerId * 1000 + nonce * 137 + currentBlock * 42) % 65536;
    const hashStr = hash.toString(16).padStart(4, '0');
    return hashStr.startsWith(targetHash.slice(0, 2));
  };

  const startMining = () => {
    if (isAnimating) return;
    
    resetSimulation();
    setIsAnimating(true);

    if (mechanism === 'pow') {
      // Proof of Work simulation
      const interval = setInterval(() => {
        setMiners(prev => {
          const updated = prev.map(miner => {
            if (miner.solved) return miner;
            
            // Mining speed based on hash power
            const increment = Math.ceil(miner.hashPower / 10);
            const newNonce = miner.nonce + increment;
            const solved = simulateHash(miner.id, newNonce);
            
            if (solved && !winner) {
              setWinner(miner.id);
              setIsAnimating(false);
              setTimeout(() => setCurrentBlock(prev => prev + 1), 1000);
            }
            
            return { ...miner, nonce: newNonce, solved };
          });
          
          return updated;
        });
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        setIsAnimating(false);
      }, 5000);

    } else {
      // Proof of Stake simulation - validator selection based on stake
      const totalStake = miners.reduce((sum, m) => sum + m.stake, 0);
      const random = Math.random() * totalStake;
      let cumulative = 0;
      
      for (const miner of miners) {
        cumulative += miner.stake;
        if (random <= cumulative) {
          setWinner(miner.id);
          setMiners(prev => prev.map(m => 
            m.id === miner.id ? { ...m, solved: true } : m
          ));
          setTimeout(() => setCurrentBlock(prev => prev + 1), 1000);
          break;
        }
      }
      setIsAnimating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Consensus Mechanism Simulator</h3>
        <p className="text-slate-600">Compare Proof of Work vs Proof of Stake consensus algorithms</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => { setMechanism('pow'); resetSimulation(); }}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            mechanism === 'pow' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
          }`}
        >
          Proof of Work
        </button>
        <button
          onClick={() => { setMechanism('pos'); resetSimulation(); }}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            mechanism === 'pos' 
              ? 'bg-indigo-600 text-white shadow-lg' 
              : 'bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50'
          }`}
        >
          Proof of Stake
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold text-slate-700">
            {mechanism === 'pow' ? 'Mining Competition' : 'Validator Selection'} - Block #{currentBlock}
          </h4>
          <button
            onClick={startMining}
            disabled={isAnimating}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              isAnimating 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
            }`}
          >
            {mechanism === 'pow' ? 'Start Mining' : 'Select Validator'}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {miners.map((miner) => (
            <div
              key={miner.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                miner.solved 
                  ? 'border-emerald-500 bg-emerald-50' 
                  : winner && winner !== miner.id
                    ? 'border-slate-200 bg-slate-50 opacity-50'
                    : 'border-slate-200 bg-white'
              }`}
            >
              <div className={`w-4 h-4 rounded-full ${miner.color} mb-2`}></div>
              <div className="text-sm font-semibold text-slate-700 mb-2">Node {miner.id}</div>
              
              {mechanism === 'pow' ? (
                <div className="space-y-2">
                  <div className="text-xs text-slate-600">
                    Hash Power: {miner.hashPower}%
                  </div>
                  <div className="text-xs text-slate-600">
                    Nonces Tried: {miner.nonce.toLocaleString()}
                  </div>
                  {isAnimating && (
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-100"
                        style={{ width: `${Math.min((miner.nonce / 1000) * 100, 100)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-slate-600">
                    Stake: {miner.stake} tokens
                  </div>
                  <div className="text-xs text-slate-600">
                    Selection Chance: {((miner.stake / miners.reduce((sum, m) => sum + m.stake, 0)) * 100).toFixed(1)}%
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(miner.stake / miners.reduce((sum, m) => sum + m.stake, 0)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {miner.solved && (
                <div className="text-xs font-semibold text-emerald-600 mt-2 animate-pulse">
                  {mechanism === 'pow' ? '✓ Block Mined!' : '✓ Selected!'}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-slate-100 rounded-lg">
          <h5 className="font-semibold text-slate-700 mb-2">
            {mechanism === 'pow' ? 'Proof of Work' : 'Proof of Stake'} Explanation:
          </h5>
          <p className="text-sm text-slate-600">
            {mechanism === 'pow' 
              ? 'Miners compete to solve cryptographic puzzles. Higher hash power = more attempts per second = higher chance to win. Energy-intensive but secure.'
              : 'Validators are randomly selected based on their stake. Higher stake = higher selection probability. Energy-efficient and still secure through economic incentives.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from 'react';

export function ProofOfWorkVisualizer() {
  const [blockData, setBlockData] = useState("Hello World");
  const [currentNonce, setCurrentNonce] = useState(0);
  const [targetDifficulty, setTargetDifficulty] = useState(3);
  const [isMining, setIsMining] = useState(false);
  const [minedBlocks, setMinedBlocks] = useState<Array<{data: string, nonce: number, hash: string}>>([]);
  const [attempts, setAttempts] = useState(0);

  // Simple hash function for demonstration
  const simpleHash = (input: string): string => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  };

  const getCurrentHash = () => {
    return simpleHash(blockData + currentNonce);
  };

  const isValidHash = (hash: string) => {
    return hash.startsWith('0'.repeat(targetDifficulty));
  };

  const startMining = async () => {
    setIsMining(true);
    setAttempts(0);
    let nonce = 0;
    let hash = '';
    let attemptCount = 0;

    while (true) {
      hash = simpleHash(blockData + nonce);
      attemptCount++;
      
      if (isValidHash(hash)) {
        setCurrentNonce(nonce);
        setAttempts(attemptCount);
        setMinedBlocks(prev => [...prev, {data: blockData, nonce, hash}]);
        setIsMining(false);
        break;
      }
      
      nonce++;
      
      // Update UI periodically
      if (nonce % 100 === 0) {
        setCurrentNonce(nonce);
        setAttempts(attemptCount);
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Safety break to prevent infinite loops
      if (nonce > 100000) {
        setIsMining(false);
        break;
      }
    }
  };

  const resetMining = () => {
    setCurrentNonce(0);
    setAttempts(0);
    setMinedBlocks([]);
  };

  const currentHash = getCurrentHash();
  const isCurrentHashValid = isValidHash(currentHash);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Proof of Work Mining Simulator</h3>
        <p className="text-lg text-slate-600">Experience how miners compete to solve cryptographic puzzles by finding the right nonce value</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Mining Controls */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-4">Mining Parameters</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Block Data</label>
              <input
                type="text"
                value={blockData}
                onChange={(e) => setBlockData(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isMining}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Difficulty (Leading Zeros): {targetDifficulty}
              </label>
              <input
                type="range"
                min="1"
                max="6"
                value={targetDifficulty}
                onChange={(e) => setTargetDifficulty(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                disabled={isMining}
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Easy</span>
                <span>Hard</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startMining}
                disabled={isMining}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  isMining 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isMining ? 'Mining...' : 'Start Mining'}
              </button>
              
              <button
                onClick={resetMining}
                className="px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Current Hash Display */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-4">Current Attempt</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nonce</label>
              <div className="p-3 bg-slate-100 rounded-lg font-mono text-lg">
                {currentNonce.toLocaleString()}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hash Output</label>
              <div className={`p-3 rounded-lg font-mono text-sm break-all transition-colors ${
                isCurrentHashValid 
                  ? 'bg-emerald-100 border border-emerald-300 text-emerald-800' 
                  : 'bg-rose-100 border border-rose-300 text-rose-800'
              }`}>
                {currentHash}
              </div>
              {isCurrentHashValid && (
                <div className="text-emerald-600 text-sm font-medium mt-2 flex items-center gap-2">
                  ✓ Valid! Starts with {targetDifficulty} zero(s)
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Attempts</label>
              <div className="p-3 bg-amber-100 rounded-lg font-mono text-lg text-amber-800">
                {attempts.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain */}
      {minedBlocks.length > 0 && (
        <div className="w-full max-w-6xl">
          <h4 className="text-xl font-semibold text-slate-800 mb-4">Mined Blocks</h4>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {minedBlocks.map((block, index) => (
              <div key={index} className="flex-shrink-0 bg-emerald-100 border border-emerald-300 rounded-lg p-4 min-w-[250px]">
                <div className="text-sm font-medium text-emerald-800 mb-2">Block #{index + 1}</div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div><span className="font-medium">Data:</span> {block.data}</div>
                  <div><span className="font-medium">Nonce:</span> {block.nonce}</div>
                  <div><span className="font-medium">Hash:</span> <span className="font-mono">{block.hash}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="font-semibold text-blue-800 mb-2">1. Input Data</div>
            <div className="text-blue-700">Block data + nonce number</div>
          </div>
          <div className="bg-indigo-100 p-4 rounded-lg">
            <div className="font-semibold text-indigo-800 mb-2">2. Hash Function</div>
            <div className="text-indigo-700">Creates fixed-length output</div>
          </div>
          <div className="bg-emerald-100 p-4 rounded-lg">
            <div className="font-semibold text-emerald-800 mb-2">3. Check Target</div>
            <div className="text-emerald-700">Must start with required zeros</div>
          </div>
        </div>
      </div>
    </div>
  );
}
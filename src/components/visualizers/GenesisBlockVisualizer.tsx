"use client";

import { useState } from 'react';

export function GenesisBlockVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [showHash, setShowHash] = useState(false);

  const genesisData = {
    timestamp: "Jan 3, 2009 18:15:05 GMT",
    data: "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks",
    nonce: 2083236893,
    previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
    merkleRoot: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b"
  };

  const steps = [
    { title: "Empty Blockchain", desc: "No blocks exist yet" },
    { title: "Genesis Data", desc: "Initial data and timestamp added" },
    { title: "No Previous Hash", desc: "First block has no predecessor" },
    { title: "Hash Calculation", desc: "Computing the genesis block hash" },
    { title: "Genesis Block Created", desc: "First block in the chain" }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setAnimating(false);
        if (currentStep === 2) setShowHash(true);
      }, 500);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setShowHash(false);
    setAnimating(false);
  };

  const calculateSimpleHash = (input: string) => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  };

  const genesisHash = calculateSimpleHash(genesisData.data + genesisData.timestamp + genesisData.nonce);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Genesis Block Visualizer</h3>
        <p className="text-slate-600">Explore how the first block in a blockchain is created without a predecessor</p>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <div className="flex items-center justify-between w-full">
          <div className="text-lg font-semibold text-slate-700">
            Step {currentStep + 1}: {steps[currentStep].title}
          </div>
          <div className="flex gap-2">
            <button
              onClick={nextStep}
              disabled={currentStep >= steps.length - 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="text-center text-slate-600 mb-4">
          {steps[currentStep].desc}
        </div>

        <div className="flex flex-col items-center gap-6">
          {currentStep >= 2 && (
            <div className="flex items-center gap-4">
              <div className="text-slate-500">Previous Hash:</div>
              <div className="bg-slate-200 px-4 py-2 rounded-lg font-mono text-sm">
                {genesisData.previousHash}
              </div>
              <div className="text-rose-500 font-semibold">← NULL (No predecessor!)</div>
            </div>
          )}

          <div className={`bg-white border-2 rounded-xl p-6 transition-all duration-500 ${
            currentStep >= 1 ? 'border-blue-400 shadow-lg' : 'border-slate-200'
          } ${animating ? 'scale-105' : 'scale-100'}`}>
            <div className="text-center font-bold text-lg mb-4 text-slate-800">
              {currentStep === 0 ? "Awaiting Genesis Block..." : "Genesis Block #0"}
            </div>
            
            {currentStep >= 1 && (
              <>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-600">Timestamp:</span>
                    <span className="font-mono text-sm">{genesisData.timestamp}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-slate-600">Data:</span>
                    <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400">
                      <span className="text-sm italic">&ldquo;{genesisData.data}&rdquo;</span>
                    </div>
                  </div>
                  {currentStep >= 2 && (
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-600">Nonce:</span>
                      <span className="font-mono text-sm">{genesisData.nonce}</span>
                    </div>
                  )}
                </div>

                {showHash && currentStep >= 3 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-emerald-600">Block Hash:</span>
                      <span className="font-mono text-sm bg-emerald-100 px-3 py-1 rounded">
                        {genesisHash}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {currentStep >= 4 && (
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 border-2 border-indigo-300 rounded-xl p-4 opacity-50">
                <div className="text-center font-bold text-indigo-800">Block #1</div>
                <div className="text-sm text-indigo-600 mt-2">Previous Hash: {genesisHash}</div>
                <div className="text-sm text-indigo-600">← References Genesis Block</div>
              </div>
              <div className="text-slate-400">→</div>
              <div className="bg-indigo-100 border-2 border-indigo-300 rounded-xl p-4 opacity-30">
                <div className="text-center font-bold text-indigo-800">Block #2</div>
                <div className="text-sm text-indigo-600 mt-2">Previous Hash: ...</div>
              </div>
              <div className="text-slate-400">→</div>
              <div className="text-slate-400 text-xl">...</div>
            </div>
          )}
        </div>

        {currentStep >= 4 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 w-full">
            <div className="text-emerald-800 font-semibold mb-2">✓ Genesis Block Created!</div>
            <div className="text-emerald-700 text-sm">
              The blockchain now has its foundation. All future blocks will reference back to this genesis block, 
              creating an immutable chain of records starting from Satoshi Nakamoto's first mining on January 3, 2009.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
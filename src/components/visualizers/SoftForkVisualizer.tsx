"use client";

import { useState } from 'react';

export function SoftForkVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      title: "Original Network",
      description: "All nodes follow the same rules. Old blocks are accepted by all nodes.",
      oldNodeAccepts: true,
      newNodeAccepts: true,
      blockType: "old"
    },
    {
      title: "Soft Fork Introduced",
      description: "New nodes have stricter rules, but still accept old blocks.",
      oldNodeAccepts: true,
      newNodeAccepts: true,
      blockType: "old"
    },
    {
      title: "New Block Created",
      description: "New stricter block is created. Old nodes still accept it (backward compatible).",
      oldNodeAccepts: true,
      newNodeAccepts: true,
      blockType: "new"
    },
    {
      title: "Network Consensus",
      description: "Both node types continue on the same chain. No split occurs.",
      oldNodeAccepts: true,
      newNodeAccepts: true,
      blockType: "new"
    }
  ];

  const handleStepChange = (step: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentStep(step);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Soft Fork Visualization</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how soft forks maintain backward compatibility, allowing network upgrades without forcing all nodes to update simultaneously.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => handleStepChange(index)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              currentStep === index
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Step {index + 1}
          </button>
        ))}
      </div>

      <div className="w-full max-w-4xl">
        <div className="text-center mb-6">
          <h4 className="text-xl font-semibold text-slate-800 mb-2">
            {currentStepData.title}
          </h4>
          <p className="text-slate-600">{currentStepData.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Old Node */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 bg-amber-400 rounded-full"></div>
              <h5 className="text-lg font-semibold text-slate-800">Old Node (v1)</h5>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm text-slate-600 mb-3">Rules: Basic validation only</div>
              
              <div className={`p-4 rounded-lg border-2 transition-all duration-500 ${
                currentStepData.oldNodeAccepts
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-rose-300 bg-rose-50'
              } ${isAnimating ? 'scale-105' : 'scale-100'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {currentStepData.blockType === 'new' ? 'New Block' : 'Old Block'}
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    currentStepData.oldNodeAccepts ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}>
                    {currentStepData.oldNodeAccepts ? '✓' : '✗'}
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {currentStepData.oldNodeAccepts ? 'Block Accepted' : 'Block Rejected'}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${
                  currentStepData.oldNodeAccepts ? 'bg-emerald-400' : 'bg-rose-400'
                }`}></div>
                <span className={currentStepData.oldNodeAccepts ? 'text-emerald-700' : 'text-rose-700'}>
                  {currentStepData.oldNodeAccepts ? 'On Main Chain' : 'Forked Chain'}
                </span>
              </div>
            </div>
          </div>

          {/* New Node */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <h5 className="text-lg font-semibold text-slate-800">New Node (v2)</h5>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm text-slate-600 mb-3">Rules: Stricter validation + old rules</div>
              
              <div className={`p-4 rounded-lg border-2 transition-all duration-500 ${
                currentStepData.newNodeAccepts
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-rose-300 bg-rose-50'
              } ${isAnimating ? 'scale-105' : 'scale-100'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {currentStepData.blockType === 'new' ? 'New Block' : 'Old Block'}
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    currentStepData.newNodeAccepts ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}>
                    {currentStepData.newNodeAccepts ? '✓' : '✗'}
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {currentStepData.newNodeAccepts ? 'Block Accepted' : 'Block Rejected'}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${
                  currentStepData.newNodeAccepts ? 'bg-emerald-400' : 'bg-rose-400'
                }`}></div>
                <span className={currentStepData.newNodeAccepts ? 'text-emerald-700' : 'text-rose-700'}>
                  {currentStepData.newNodeAccepts ? 'On Main Chain' : 'Forked Chain'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Blockchain Visualization */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-slate-200">
          <h5 className="text-lg font-semibold text-slate-800 mb-4">Blockchain State</h5>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((blockNum) => (
              <div key={blockNum} className="flex items-center">
                <div className={`w-16 h-12 rounded-lg border-2 flex items-center justify-center text-sm font-medium ${
                  blockNum <= 2
                    ? 'bg-slate-100 border-slate-300 text-slate-600'
                    : currentStepData.blockType === 'new'
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-amber-100 border-amber-300 text-amber-700'
                }`}>
                  Block {blockNum}
                </div>
                {blockNum < 3 && (
                  <div className="w-4 h-0.5 bg-slate-300"></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              currentStepData.oldNodeAccepts && currentStepData.newNodeAccepts
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}>
              {currentStepData.oldNodeAccepts && currentStepData.newNodeAccepts
                ? '✓ Single Chain (No Fork)'
                : '✗ Chain Split'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 max-w-2xl">
        <div className="text-sm text-indigo-800">
          <strong>Key Insight:</strong> Soft forks maintain network unity because new rules are always a 
          <em> stricter subset</em> of old rules. Old nodes continue to accept new blocks, preventing chain splits.
        </div>
      </div>
    </div>
  );
}
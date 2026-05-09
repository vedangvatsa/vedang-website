"use client";

import { useState } from 'react';

export function HardForkVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    { title: "Original Chain", description: "Unified blockchain with shared consensus rules" },
    { title: "Protocol Upgrade Proposed", description: "New rules are incompatible with old software" },
    { title: "Fork Occurs", description: "Network splits into two separate chains" },
    { title: "Divergent Evolution", description: "Chains develop independently with different rules" }
  ];

  const blocks = [
    { id: 1, type: "original", content: "Genesis" },
    { id: 2, type: "original", content: "Block 1" },
    { id: 3, type: "original", content: "Block 2" },
    { id: 4, type: "original", content: "Block 3" },
  ];

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentStep(0);
    
    const animate = (step: number) => {
      if (step < steps.length) {
        setTimeout(() => {
          setCurrentStep(step);
          animate(step + 1);
        }, animationSpeed);
      } else {
        setIsAnimating(false);
      }
    };
    
    animate(0);
  };

  const renderChain = (chainType: 'original' | 'chainA' | 'chainB', yOffset: number) => {
    const getBlocksForChain = () => {
      if (chainType === 'original') {
        return blocks;
      }
      
      const baseBlocks = blocks.slice(0, 4);
      if (currentStep >= 2) {
        if (chainType === 'chainA') {
          return [
            ...baseBlocks,
            { id: 5, type: 'chainA', content: 'New Rules A' },
            ...(currentStep >= 3 ? [{ id: 6, type: 'chainA', content: 'Block A1' }] : [])
          ];
        } else {
          return [
            ...baseBlocks,
            { id: 5, type: 'chainB', content: 'Old Rules B' },
            ...(currentStep >= 3 ? [{ id: 6, type: 'chainB', content: 'Block B1' }] : [])
          ];
        }
      }
      return baseBlocks;
    };

    const chainBlocks = getBlocksForChain();
    const chainColor = chainType === 'chainA' ? 'bg-blue-500' : 
                      chainType === 'chainB' ? 'bg-rose-500' : 'bg-indigo-500';

    return (
      <div 
        className={`flex items-center gap-2 transition-all duration-1000 ease-in-out`}
        style={{ transform: `translateY(${yOffset}px)` }}
      >
        {chainBlocks.map((block, index) => (
          <div key={block.id} className="flex items-center">
            <div
              className={`
                w-16 h-12 ${chainColor} text-white text-xs font-bold
                flex items-center justify-center rounded-lg shadow-md
                transition-all duration-500 ease-in-out
                ${block.type !== 'original' ? 'animate-pulse' : ''}
              `}
            >
              {block.content}
            </div>
            {index < chainBlocks.length - 1 && (
              <div className="w-4 h-0.5 bg-slate-400 mx-1"></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Hard Fork Visualizer</h3>
        <p className="text-slate-600">Interactive demonstration of blockchain hard forks and chain divergence</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-semibold text-slate-800">
            Step {currentStep + 1}: {steps[currentStep].title}
          </div>
          <div className="text-sm text-slate-600">
            {steps[currentStep].description}
          </div>
        </div>

        <div className="relative h-64 flex items-center justify-center overflow-hidden">
          {currentStep < 2 ? (
            <div className="flex flex-col items-center">
              {renderChain('original', 0)}
              {currentStep === 1 && (
                <div className="mt-4 text-amber-600 font-semibold animate-bounce">
                  ⚠️ Incompatible upgrade proposed
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-8">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-600">Chain A (New Rules)</span>
                {renderChain('chainA', -20)}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-rose-600">Chain B (Old Rules)</span>
                {renderChain('chainB', 20)}
              </div>
              {currentStep === 3 && (
                <div className="text-emerald-600 font-semibold">
                  ✅ Chains operating independently
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={handleStepBackward}
            disabled={currentStep === 0 || isAnimating}
            className="px-4 py-2 bg-slate-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleStepForward}
            disabled={currentStep === steps.length - 1 || isAnimating}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors"
          >
            Next
          </button>
          <button
            onClick={startAnimation}
            disabled={isAnimating}
            className="px-6 py-2 bg-emerald-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
          >
            {isAnimating ? 'Playing...' : 'Play Animation'}
          </button>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Animation Speed: {animationSpeed}ms
          </label>
          <input
            type="range"
            min="500"
            max="2000"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            disabled={isAnimating}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl text-sm">
        <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Chain A Characteristics</h4>
          <ul className="text-blue-700 space-y-1">
            <li>• New consensus rules</li>
            <li>• Enhanced features</li>
            <li>• Breaking changes</li>
          </ul>
        </div>
        <div className="bg-rose-100 p-4 rounded-lg border border-rose-200">
          <h4 className="font-semibold text-rose-800 mb-2">Chain B Characteristics</h4>
          <ul className="text-rose-700 space-y-1">
            <li>• Original consensus rules</li>
            <li>• Legacy compatibility</li>
            <li>• Conservative approach</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
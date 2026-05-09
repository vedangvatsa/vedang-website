"use client";

import { useState } from 'react';

export function FeedforwardNetworkVisualizer() {
  const [selectedPosition, setSelectedPosition] = useState(0);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hiddenDim, setHiddenDim] = useState(4);
  const [intermediateDim, setIntermediateDim] = useState(16);

  const sequenceLength = 6;
  const inputSequence = ['The', 'cat', 'sat', 'on', 'the', 'mat'];

  const startAnimation = () => {
    setIsAnimating(true);
    setAnimationStep(0);
    
    const steps = [0, 1, 2, 3];
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setAnimationStep(steps[currentStep]);
      } else {
        setIsAnimating(false);
        setAnimationStep(0);
        clearInterval(interval);
      }
    }, 1200);
  };

  const renderNeuron = (value: number, isActive: boolean, color: string) => (
    <div
      className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${
        isActive ? `bg-${color}-400 border-${color}-600 shadow-lg` : 'bg-slate-200 border-slate-300'
      }`}
    />
  );

  const renderLayer = (neurons: number, isActive: boolean, color: string, label: string) => (
    <div className="flex flex-col items-center gap-2">
      <div className="text-xs font-medium text-slate-600">{label}</div>
      <div className="flex flex-col gap-1">
        {Array.from({ length: neurons }, (_, i) => (
          <div key={i}>
            {renderNeuron(Math.random(), isActive, color)}
          </div>
        ))}
      </div>
    </div>
  );

  const renderConnections = (fromNeurons: number, toNeurons: number, isActive: boolean) => {
    if (!isActive) return null;
    
    return (
      <div className="flex flex-col justify-center h-full">
        {Array.from({ length: Math.min(3, fromNeurons) }, (_, i) => (
          <div
            key={i}
            className="h-px bg-gradient-to-r from-blue-400 to-indigo-400 w-8 my-1 opacity-60 animate-pulse"
          />
        ))}
      </div>
    );
  };

  const getStepDescription = (step: number) => {
    switch (step) {
      case 0:
        return "Input: Hidden representations from attention layer";
      case 1:
        return "Linear projection: Expand dimension (d → 4d)";
      case 2:
        return "Activation: Apply GELU nonlinearity";
      case 3:
        return "Linear projection: Contract back to original dimension (4d → d)";
      default:
        return "Feedforward processing complete";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Feedforward Network Visualizer</h3>
        <p className="text-slate-600 max-w-2xl">
          Interactive visualization of the feedforward network in transformers. Click positions in the sequence and watch the expand-activate-contract pattern.
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-4xl">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-slate-700">Hidden Dimension:</label>
            <input
              type="range"
              min="2"
              max="8"
              value={hiddenDim}
              onChange={(e) => setHiddenDim(Number(e.target.value))}
              className="flex-1 max-w-32"
            />
            <span className="text-sm text-slate-600">{hiddenDim}</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-slate-700">Intermediate Dimension:</label>
            <input
              type="range"
              min="8"
              max="32"
              value={intermediateDim}
              onChange={(e) => setIntermediateDim(Number(e.target.value))}
              className="flex-1 max-w-32"
            />
            <span className="text-sm text-slate-600">{intermediateDim}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {inputSequence.map((token, i) => (
            <button
              key={i}
              onClick={() => setSelectedPosition(i)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPosition === i
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {token}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div className="text-lg font-semibold text-slate-800">
              Processing: "{inputSequence[selectedPosition]}" (Position {selectedPosition})
            </div>
            <button
              onClick={startAnimation}
              disabled={isAnimating}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAnimating ? 'Animating...' : 'Animate FFN'}
            </button>
          </div>

          <div className="flex items-center justify-center gap-8">
            {renderLayer(hiddenDim, animationStep >= 0, 'blue', `Input\n(d=${hiddenDim})`)}
            {renderConnections(hiddenDim, intermediateDim, animationStep >= 1)}
            {renderLayer(intermediateDim, animationStep >= 1, 'indigo', `Intermediate\n(4d=${intermediateDim})`)}
            {renderConnections(intermediateDim, intermediateDim, animationStep >= 2)}
            {renderLayer(intermediateDim, animationStep >= 2, 'rose', 'GELU\nActivation')}
            {renderConnections(intermediateDim, hiddenDim, animationStep >= 3)}
            {renderLayer(hiddenDim, animationStep >= 3, 'emerald', `Output\n(d=${hiddenDim})`)}
          </div>

          <div className="mt-6 p-4 bg-slate-100 rounded-lg">
            <div className="text-sm font-medium text-slate-700 mb-2">Current Step:</div>
            <div className="text-slate-600">{getStepDescription(animationStep)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-2">Key Properties</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Applied identically to each position</li>
              <li>• Expansion ratio typically 4x hidden dimension</li>
              <li>• Provides computational capacity and nonlinearity</li>
              <li>• No interaction between sequence positions</li>
            </ul>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h4 className="font-semibold text-emerald-800 mb-2">Mathematical Flow</h4>
            <div className="text-sm text-emerald-700 space-y-1 font-mono">
              <div>x ∈ ℝᵈ (input)</div>
              <div>W₁x + b₁ ∈ ℝ⁴ᵈ (expand)</div>
              <div>GELU(W₁x + b₁) (activate)</div>
              <div>W₂ · GELU(W₁x + b₁) + b₂ ∈ ℝᵈ (contract)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
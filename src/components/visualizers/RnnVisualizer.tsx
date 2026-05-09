"use client";

import { useState, useEffect } from 'react';

export function RnnVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sequence, setSequence] = useState(['H', 'E', 'L', 'L', 'O']);
  const [hiddenStates, setHiddenStates] = useState([0]);
  const [outputs, setOutputs] = useState([]);
  const [weightInput, setWeightInput] = useState(0.6);
  const [weightHidden, setWeightHidden] = useState(0.8);
  const [selectedCell, setSelectedCell] = useState(null);

  const processStep = (step) => {
    if (step === 0) {
      return { hidden: 0, output: 0 };
    }
    
    const input = sequence[step - 1].charCodeAt(0) / 100; // Normalize character
    const prevHidden = hiddenStates[step - 1];
    
    // Simple RNN computation: tanh(W_input * input + W_hidden * prev_hidden)
    const newHidden = Math.tanh(weightInput * input + weightHidden * prevHidden);
    const output = Math.sigmoid(newHidden); // Output layer
    
    return { hidden: newHidden, output };
  };

  useEffect(() => {
    const newHiddenStates = [0];
    const newOutputs = [];
    
    for (let i = 1; i <= currentStep; i++) {
      const { hidden, output } = processStep(i);
      newHiddenStates.push(hidden);
      newOutputs.push(output);
    }
    
    setHiddenStates(newHiddenStates);
    setOutputs(newOutputs);
  }, [currentStep, weightInput, weightHidden, sequence]);

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < sequence.length) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= sequence.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (currentStep >= sequence.length) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, sequence.length]);

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setSelectedCell(null);
  };

  const updateSequence = (index, value) => {
    const newSeq = [...sequence];
    newSeq[index] = value.toUpperCase();
    setSequence(newSeq);
    if (currentStep > index + 1) {
      setCurrentStep(index + 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Recurrent Neural Network</h3>
        <p className="text-slate-600">Watch how RNNs process sequential data with memory across time steps</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4 w-full max-w-2xl">
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={currentStep >= sequence.length}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-slate-300"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(currentStep + 1, sequence.length))}
            disabled={currentStep >= sequence.length}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-slate-300"
          >
            Step
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
          >
            Reset
          </button>
        </div>

        {/* Weight Controls */}
        <div className="flex gap-6 items-center">
          <div className="flex flex-col items-center">
            <label className="text-sm text-slate-600 mb-1">Input Weight</label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.1"
              value={weightInput}
              onChange={(e) => setWeightInput(parseFloat(e.target.value))}
              className="w-24"
            />
            <span className="text-xs text-slate-500">{weightInput.toFixed(1)}</span>
          </div>
          <div className="flex flex-col items-center">
            <label className="text-sm text-slate-600 mb-1">Hidden Weight</label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.1"
              value={weightHidden}
              onChange={(e) => setWeightHidden(parseFloat(e.target.value))}
              className="w-24"
            />
            <span className="text-xs text-slate-500">{weightHidden.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Input Sequence Editor */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm text-slate-600">Edit Input Sequence:</span>
        <div className="flex gap-2">
          {sequence.map((char, index) => (
            <input
              key={index}
              type="text"
              value={char}
              onChange={(e) => updateSequence(index, e.target.value.slice(-1))}
              className="w-10 h-10 text-center border border-slate-300 rounded-lg bg-white"
              maxLength="1"
            />
          ))}
        </div>
      </div>

      {/* RNN Visualization */}
      <div className="w-full max-w-4xl overflow-x-auto">
        <div className="flex gap-4 pb-4" style={{ minWidth: `${sequence.length * 120 + 120}px` }}>
          {/* Initial State */}
          <div className="flex flex-col items-center gap-4 w-24">
            <div className="text-sm text-slate-600">t=0</div>
            <div className="w-16 h-12 bg-slate-200 border border-slate-300 rounded-lg flex items-center justify-center text-sm">
              Input
            </div>
            <div 
              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                selectedCell === 'h0' ? 'bg-blue-200 border-blue-500' : 'bg-emerald-100 border-emerald-400'
              }`}
              onClick={() => setSelectedCell(selectedCell === 'h0' ? null : 'h0')}
            >
              <div className="text-center">
                <div className="text-xs text-slate-600">h₀</div>
                <div className="text-sm font-mono">0.0</div>
              </div>
            </div>
            <div className="w-16 h-12 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-sm">
              -
            </div>
          </div>

          {/* Time Steps */}
          {sequence.map((char, index) => {
            const stepIndex = index + 1;
            const isActive = stepIndex <= currentStep;
            const hidden = hiddenStates[stepIndex] || 0;
            const output = outputs[index] || 0;
            
            return (
              <div key={index} className="flex flex-col items-center gap-4 w-24 relative">
                {/* Time label */}
                <div className="text-sm text-slate-600">t={stepIndex}</div>
                
                {/* Input */}
                <div className={`w-16 h-12 border rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                  isActive ? 'bg-blue-200 border-blue-400' : 'bg-slate-100 border-slate-200'
                }`}>
                  {char}
                </div>

                {/* Hidden State */}
                <div 
                  className={`w-16 h-16 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                    selectedCell === `h${stepIndex}` ? 'bg-blue-200 border-blue-500' : 
                    isActive ? 'bg-emerald-200 border-emerald-500' : 'bg-slate-100 border-slate-300'
                  }`}
                  onClick={() => setSelectedCell(selectedCell === `h${stepIndex}` ? null : `h${stepIndex}`)}
                >
                  <div className="text-center">
                    <div className="text-xs text-slate-600">h₊{stepIndex}</div>
                    <div className="text-xs font-mono">{isActive ? hidden.toFixed(2) : '---'}</div>
                  </div>
                </div>

                {/* Output */}
                <div className={`w-16 h-12 border rounded-lg flex items-center justify-center text-xs font-mono transition-colors ${
                  isActive ? 'bg-rose-200 border-rose-400' : 'bg-slate-100 border-slate-200'
                }`}>
                  {isActive ? output.toFixed(2) : '---'}
                </div>

                {/* Recurrent Arrow */}
                {index < sequence.length - 1 && (
                  <div className="absolute top-20 left-20 w-8 h-8 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 32 32">
                      <path
                        d="M 4 16 Q 16 8 28 16"
                        stroke={isActive ? "#10b981" : "#cbd5e1"}
                        strokeWidth="2"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                      />
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="10"
                          markerHeight="7"
                          refX="10"
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon
                            points="0 0, 10 3.5, 0 7"
                            fill={isActive ? "#10b981" : "#cbd5e1"}
                          />
                        </marker>
                      </defs>
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Information Panel */}
      {selectedCell && (
        <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-lg p-4">
          <h4 className="font-semibold text-slate-800 mb-2">Hidden State {selectedCell}</h4>
          <div className="text-sm text-slate-600 space-y-2">
            {selectedCell === 'h0' ? (
              <p>Initial hidden state, typically initialized to zero.</p>
            ) : (
              <>
                <p>Computed using: h₊ = tanh(W_input × input + W_hidden × h₋)</p>
                <div className="bg-slate-50 p-2 rounded font-mono text-xs">
                  h₊ = tanh({weightInput.toFixed(1)} × {(sequence[parseInt(selectedCell.slice(1)) - 1].charCodeAt(0) / 100).toFixed(2)} + {weightHidden.toFixed(1)} × {hiddenStates[parseInt(selectedCell.slice(1)) - 1].toFixed(2)})
                  = {hiddenStates[parseInt(selectedCell.slice(1))].toFixed(3)}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="text-center text-sm text-slate-600 max-w-2xl">
        This RNN processes each character sequentially, maintaining memory through hidden states. 
        Try adjusting the weights to see how they affect the network's internal representations!
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from 'react';

export function LstmVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [sequence, setSequence] = useState([0.8, -0.3, 0.6, -0.9, 0.4]);
  const [cellState, setCellState] = useState(0);
  const [hiddenState, setHiddenState] = useState(0);
  const [gates, setGates] = useState({ forget: 0.5, input: 0.5, output: 0.5 });
  const [candidateValue, setCandidateValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [forgetWeight, setForgetWeight] = useState(0.6);
  const [inputWeight, setInputWeight] = useState(0.7);
  const [outputWeight, setOutputWeight] = useState(0.8);

  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  const tanh = (x: number) => (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));

  const processStep = (input: number) => {
    // Forget gate
    const forgetGate = sigmoid(forgetWeight * input + 0.3 * hiddenState);
    
    // Input gate
    const inputGate = sigmoid(inputWeight * input + 0.4 * hiddenState);
    
    // Candidate values
    const candidate = tanh(0.5 * input + 0.2 * hiddenState);
    
    // Update cell state
    const newCellState = forgetGate * cellState + inputGate * candidate;
    
    // Output gate
    const outputGate = sigmoid(outputWeight * input + 0.3 * hiddenState);
    
    // Update hidden state
    const newHiddenState = outputGate * tanh(newCellState);
    
    setGates({ forget: forgetGate, input: inputGate, output: outputGate });
    setCandidateValue(candidate);
    setCellState(newCellState);
    setHiddenState(newHiddenState);
  };

  useEffect(() => {
    if (currentStep < sequence.length) {
      processStep(sequence[currentStep]);
    }
  }, [currentStep, forgetWeight, inputWeight, outputWeight]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < sequence.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500);
    } else if (currentStep >= sequence.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, sequence.length]);

  const reset = () => {
    setCurrentStep(0);
    setCellState(0);
    setHiddenState(0);
    setIsPlaying(false);
  };

  const updateSequence = (index: number, value: number) => {
    const newSequence = [...sequence];
    newSequence[index] = value;
    setSequence(newSequence);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">LSTM Cell Interactive</h3>
        <p className="text-slate-600">Explore how gates control information flow through an LSTM cell</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-3">Input Sequence</h4>
            <div className="flex gap-2 mb-3">
              {sequence.map((val, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.1"
                    value={val}
                    onChange={(e) => updateSequence(idx, parseFloat(e.target.value))}
                    className="w-16 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    style={{writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical'}}
                  />
                  <span className={`text-xs mt-1 px-2 py-1 rounded ${idx === currentStep ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}>
                    {val.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={currentStep >= sequence.length - 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-3">Gate Weights</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Forget Gate Weight: {forgetWeight.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={forgetWeight}
                  onChange={(e) => setForgetWeight(parseFloat(e.target.value))}
                  className="w-full h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Input Gate Weight: {inputWeight.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={inputWeight}
                  onChange={(e) => setInputWeight(parseFloat(e.target.value))}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Output Gate Weight: {outputWeight.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={outputWeight}
                  onChange={(e) => setOutputWeight(parseFloat(e.target.value))}
                  className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* LSTM Visualization */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-4">LSTM Cell State</h4>
          
          {/* Current Input */}
          <div className="mb-4 text-center">
            <div className="inline-block bg-blue-100 px-4 py-2 rounded-lg">
              <span className="text-blue-700 font-semibold">
                Input: {currentStep < sequence.length ? sequence[currentStep].toFixed(2) : 'End'}
              </span>
            </div>
          </div>

          {/* Gates */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-rose-50 p-3 rounded-lg text-center">
              <div className="text-xs text-rose-600 mb-1">Forget Gate</div>
              <div className="text-lg font-bold text-rose-700">{gates.forget.toFixed(3)}</div>
              <div 
                className="w-full bg-rose-200 rounded h-2 mt-2"
                style={{background: `linear-gradient(to right, #fda4af ${gates.forget * 100}%, #f1f5f9 ${gates.forget * 100}%)`}}
              />
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg text-center">
              <div className="text-xs text-emerald-600 mb-1">Input Gate</div>
              <div className="text-lg font-bold text-emerald-700">{gates.input.toFixed(3)}</div>
              <div 
                className="w-full bg-emerald-200 rounded h-2 mt-2"
                style={{background: `linear-gradient(to right, #86efac ${gates.input * 100}%, #f1f5f9 ${gates.input * 100}%)`}}
              />
            </div>
            <div className="bg-amber-50 p-3 rounded-lg text-center">
              <div className="text-xs text-amber-600 mb-1">Output Gate</div>
              <div className="text-lg font-bold text-amber-700">{gates.output.toFixed(3)}</div>
              <div 
                className="w-full bg-amber-200 rounded h-2 mt-2"
                style={{background: `linear-gradient(to right, #fcd34d ${gates.output * 100}%, #f1f5f9 ${gates.output * 100}%)`}}
              />
            </div>
          </div>

          {/* Cell State and Hidden State */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-sm text-indigo-600 mb-2">Cell State (C_t)</div>
              <div className="text-xl font-bold text-indigo-800">{cellState.toFixed(3)}</div>
              <div className="text-xs text-indigo-500 mt-1">Long-term memory</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 mb-2">Hidden State (h_t)</div>
              <div className="text-xl font-bold text-blue-800">{hiddenState.toFixed(3)}</div>
              <div className="text-xs text-blue-500 mt-1">Output & short-term</div>
            </div>
          </div>

          {/* Candidate Value */}
          <div className="mt-4 bg-slate-50 p-3 rounded-lg text-center">
            <div className="text-sm text-slate-600 mb-1">Candidate Value</div>
            <div className="text-lg font-semibold text-slate-700">{candidateValue.toFixed(3)}</div>
          </div>

          <div className="mt-4 text-xs text-slate-500 text-center">
            Step {currentStep + 1} of {sequence.length}
          </div>
        </div>
      </div>

      <div className="text-sm text-slate-600 max-w-4xl text-center">
        Adjust the gate weights and input sequence to see how LSTM cells selectively forget, remember, and output information. 
        The forget gate controls what to discard from cell state, input gate decides what new information to store, 
        and output gate determines what parts of the cell state to output.
      </div>
    </div>
  );
}
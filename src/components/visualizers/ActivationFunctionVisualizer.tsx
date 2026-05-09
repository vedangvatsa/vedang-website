"use client";

import { useState } from 'react';

export function ActivationFunctionVisualizer() {
  const [selectedFunction, setSelectedFunction] = useState('relu');
  const [inputValue, setInputValue] = useState(0);
  const [showLinearComparison, setShowLinearComparison] = useState(false);

  const activationFunctions = {
    relu: {
      name: 'ReLU',
      formula: 'f(x) = max(0, x)',
      color: 'blue',
      compute: (x: number) => Math.max(0, x),
      description: 'Introduces non-linearity by zeroing negative inputs'
    },
    sigmoid: {
      name: 'Sigmoid',
      formula: 'f(x) = 1/(1 + e^(-x))',
      color: 'indigo',
      compute: (x: number) => 1 / (1 + Math.exp(-x)),
      description: 'Squashes input to (0,1) range, creating non-linear transformation'
    },
    tanh: {
      name: 'Tanh',
      formula: 'f(x) = tanh(x)',
      color: 'emerald',
      compute: (x: number) => Math.tanh(x),
      description: 'Squashes input to (-1,1) range with zero-centered output'
    },
    linear: {
      name: 'Linear',
      formula: 'f(x) = x',
      color: 'rose',
      compute: (x: number) => x,
      description: 'No transformation - demonstrates why non-linearity is needed'
    }
  };

  const generatePoints = (func: (x: number) => number) => {
    const points = [];
    for (let x = -5; x <= 5; x += 0.1) {
      const y = func(x);
      points.push({ x, y });
    }
    return points;
  };

  const scaleToSVG = (x: number, y: number) => {
    const svgX = ((x + 5) / 10) * 280 + 10;
    const svgY = 150 - ((y + 2) / 4) * 120;
    return { x: svgX, y: svgY };
  };

  const currentFunc = activationFunctions[selectedFunction as keyof typeof activationFunctions];
  const points = generatePoints(currentFunc.compute);
  const pathData = points.map((point, index) => {
    const scaled = scaleToSVG(point.x, Math.max(-2, Math.min(2, point.y)));
    return `${index === 0 ? 'M' : 'L'} ${scaled.x} ${scaled.y}`;
  }).join(' ');

  const inputPoint = scaleToSVG(inputValue, Math.max(-2, Math.min(2, currentFunc.compute(inputValue))));
  const outputValue = currentFunc.compute(inputValue);

  const simulateNetwork = (input: number) => {
    // Simulate a 3-layer network
    const layer1 = [input * 0.5, input * -0.3, input * 0.8];
    const layer2 = layer1.map(currentFunc.compute);
    const layer3Output = layer2.reduce((sum, val, idx) => sum + val * [0.6, -0.4, 0.7][idx], 0);
    const finalOutput = currentFunc.compute(layer3Output);
    
    return { layer1, layer2, layer3Output, finalOutput };
  };

  const networkResult = simulateNetwork(inputValue);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Activation Functions</h3>
        <p className="text-slate-600">Interactive visualization showing how activation functions introduce non-linearity essential for neural networks</p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {Object.entries(activationFunctions).map(([key, func]) => (
          <button
            key={key}
            onClick={() => setSelectedFunction(key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedFunction === key
                ? `bg-${func.color}-500 text-white shadow-md`
                : `bg-white text-${func.color}-600 border border-${func.color}-200 hover:bg-${func.color}-50`
            }`}
          >
            {func.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Function Graph</h4>
          <svg width="300" height="200" className="border border-slate-200 rounded-lg">
            {/* Grid */}
            {[-4, -2, 0, 2, 4].map(x => (
              <line key={x} x1={scaleToSVG(x, -2).x} y1="10" x2={scaleToSVG(x, -2).x} y2="190" stroke="#e2e8f0" strokeWidth="1" />
            ))}
            {[-2, -1, 0, 1, 2].map(y => (
              <line key={y} x1="10" y1={scaleToSVG(-5, y).y} x2="290" y2={scaleToSVG(-5, y).y} stroke="#e2e8f0" strokeWidth="1" />
            ))}
            
            {/* Axes */}
            <line x1="10" y1="150" x2="290" y2="150" stroke="#64748b" strokeWidth="2" />
            <line x1="150" y1="10" x2="150" y2="190" stroke="#64748b" strokeWidth="2" />
            
            {/* Function curve */}
            <path d={pathData} stroke={`rgb(${currentFunc.color === 'blue' ? '59 130 246' : currentFunc.color === 'indigo' ? '99 102 241' : currentFunc.color === 'emerald' ? '16 185 129' : '244 63 94'})`} strokeWidth="3" fill="none" />
            
            {/* Input point */}
            <circle cx={inputPoint.x} cy={inputPoint.y} r="6" fill={`rgb(${currentFunc.color === 'blue' ? '59 130 246' : currentFunc.color === 'indigo' ? '99 102 241' : currentFunc.color === 'emerald' ? '16 185 129' : '244 63 94'})`} />
            
            {/* Input/output lines */}
            <line x1={inputPoint.x} y1="150" x2={inputPoint.x} y2={inputPoint.y} stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="150" y1={inputPoint.y} x2={inputPoint.x} y2={inputPoint.y} stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
          
          <div className="mt-4 space-y-2">
            <p className="text-sm font-mono text-slate-600">{currentFunc.formula}</p>
            <p className="text-xs text-slate-500">{currentFunc.description}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Interactive Control</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Input Value: {inputValue.toFixed(2)}</label>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={inputValue}
                onChange={(e) => setInputValue(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-slate-700">Input:</span>
                  <span className="ml-2 font-mono text-blue-600">{inputValue.toFixed(3)}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Output:</span>
                  <span className="ml-2 font-mono text-blue-600">{outputValue.toFixed(3)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLinearComparison(!showLinearComparison)}
              className="w-full py-2 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              {showLinearComparison ? 'Hide' : 'Show'} Network Simulation
            </button>
          </div>
        </div>
      </div>

      {showLinearComparison && (
        <div className="w-full max-w-4xl bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">3-Layer Network Simulation</h4>
          <div className="grid grid-cols-4 gap-4 items-center">
            <div className="text-center">
              <div className="text-sm font-medium text-slate-700 mb-2">Input Layer</div>
              <div className="w-12 h-12 bg-blue-100 border-2 border-blue-300 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xs font-mono">{inputValue.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-medium text-slate-700 mb-2">Hidden Layer</div>
              <div className="space-y-2">
                {networkResult.layer1.map((val, idx) => (
                  <div key={idx} className="w-10 h-10 bg-indigo-100 border-2 border-indigo-300 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xs font-mono">{val.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-medium text-slate-700 mb-2">After Activation</div>
              <div className="space-y-2">
                {networkResult.layer2.map((val, idx) => (
                  <div key={idx} className="w-10 h-10 bg-emerald-100 border-2 border-emerald-300 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xs font-mono">{val.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-medium text-slate-700 mb-2">Output</div>
              <div className="w-12 h-12 bg-amber-100 border-2 border-amber-300 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xs font-mono">{networkResult.finalOutput.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-600 mt-4 text-center">
            {selectedFunction === 'linear' 
              ? 'Notice: Linear activation collapses the network to a single linear transformation!'
              : 'Non-linear activation enables the network to learn complex patterns!'
            }
          </p>
        </div>
      )}
    </div>
  );
}
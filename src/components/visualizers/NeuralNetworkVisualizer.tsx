"use client";

import { useState } from 'react';

export function NeuralNetworkVisualizer() {
  const [weights, setWeights] = useState({
    w1: 0.5,
    w2: 0.3,
    w3: 0.8,
    w4: 0.2
  });
  const [bias, setBias] = useState(0.1);
  const [inputs, setInputs] = useState({ x1: 0.7, x2: 0.3 });
  const [activationFunction, setActivationFunction] = useState('sigmoid');
  const [hoveredNeuron, setHoveredNeuron] = useState(null);

  const sigmoid = (x) => 1 / (1 + Math.exp(-x));
  const relu = (x) => Math.max(0, x);
  const tanh = (x) => Math.tanh(x);

  const getActivation = (x) => {
    switch (activationFunction) {
      case 'sigmoid': return sigmoid(x);
      case 'relu': return relu(x);
      case 'tanh': return tanh(x);
      default: return sigmoid(x);
    }
  };

  const hiddenNeuron1 = weights.w1 * inputs.x1 + weights.w2 * inputs.x2 + bias;
  const hiddenNeuron2 = weights.w3 * inputs.x1 + weights.w4 * inputs.x2 + bias;
  const hiddenActivated1 = getActivation(hiddenNeuron1);
  const hiddenActivated2 = getActivation(hiddenNeuron2);
  
  const outputNeuron = 0.6 * hiddenActivated1 + 0.4 * hiddenActivated2 + bias;
  const finalOutput = getActivation(outputNeuron);

  const getNodeColor = (value) => {
    const intensity = Math.abs(value);
    if (intensity < 0.3) return 'bg-slate-200';
    if (intensity < 0.6) return 'bg-blue-300';
    return 'bg-indigo-400';
  };

  const getConnectionOpacity = (weight) => {
    return Math.min(Math.abs(weight), 1);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Neural Network</h3>
        <p className="text-slate-600">Interactive visualization of a simple feedforward neural network with adjustable weights and activation functions</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Controls */}
        <div className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-slate-200 lg:w-1/3">
          <h4 className="font-semibold text-slate-700">Input Values</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Input X1: {inputs.x1.toFixed(2)}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={inputs.x1}
                onChange={(e) => setInputs({...inputs, x1: parseFloat(e.target.value)})}
                className="w-full accent-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Input X2: {inputs.x2.toFixed(2)}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={inputs.x2}
                onChange={(e) => setInputs({...inputs, x2: parseFloat(e.target.value)})}
                className="w-full accent-blue-500"
              />
            </div>
          </div>

          <h4 className="font-semibold text-slate-700 mt-4">Weights</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(weights).map(([key, value]) => (
              <div key={key}>
                <label className="block text-xs text-slate-600 mb-1">{key}: {value.toFixed(2)}</label>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.1"
                  value={value}
                  onChange={(e) => setWeights({...weights, [key]: parseFloat(e.target.value)})}
                  className="w-full accent-rose-500"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Bias: {bias.toFixed(2)}</label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.1"
              value={bias}
              onChange={(e) => setBias(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Activation Function</label>
            <select
              value={activationFunction}
              onChange={(e) => setActivationFunction(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="sigmoid">Sigmoid</option>
              <option value="relu">ReLU</option>
              <option value="tanh">Tanh</option>
            </select>
          </div>
        </div>

        {/* Network Visualization */}
        <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200">
          <svg viewBox="0 0 500 300" className="w-full h-auto">
            {/* Connections */}
            <g className="opacity-70">
              <line x1="80" y1="80" x2="200" y2="120" stroke={weights.w1 >= 0 ? '#3b82f6' : '#f43f5e'} strokeWidth={Math.abs(weights.w1) * 4 + 1} opacity={getConnectionOpacity(weights.w1)} />
              <line x1="80" y1="220" x2="200" y2="120" stroke={weights.w2 >= 0 ? '#3b82f6' : '#f43f5e'} strokeWidth={Math.abs(weights.w2) * 4 + 1} opacity={getConnectionOpacity(weights.w2)} />
              <line x1="80" y1="80" x2="200" y2="180" stroke={weights.w3 >= 0 ? '#3b82f6' : '#f43f5e'} strokeWidth={Math.abs(weights.w3) * 4 + 1} opacity={getConnectionOpacity(weights.w3)} />
              <line x1="80" y1="220" x2="200" y2="180" stroke={weights.w4 >= 0 ? '#3b82f6' : '#f43f5e'} strokeWidth={Math.abs(weights.w4) * 4 + 1} opacity={getConnectionOpacity(weights.w4)} />
              <line x1="230" y1="120" x2="350" y2="150" stroke="#6366f1" strokeWidth="3" />
              <line x1="230" y1="180" x2="350" y2="150" stroke="#6366f1" strokeWidth="3" />
            </g>

            {/* Input Layer */}
            <g>
              <circle
                cx="50"
                cy="80"
                r="25"
                className={`${getNodeColor(inputs.x1)} stroke-slate-400 stroke-2`}
                onMouseEnter={() => setHoveredNeuron('x1')}
                onMouseLeave={() => setHoveredNeuron(null)}
              />
              <text x="50" y="85" textAnchor="middle" className="text-sm font-medium fill-slate-700">X1</text>
              <text x="50" y="115" textAnchor="middle" className="text-xs fill-slate-600">{inputs.x1.toFixed(2)}</text>

              <circle
                cx="50"
                cy="220"
                r="25"
                className={`${getNodeColor(inputs.x2)} stroke-slate-400 stroke-2`}
                onMouseEnter={() => setHoveredNeuron('x2')}
                onMouseLeave={() => setHoveredNeuron(null)}
              />
              <text x="50" y="225" textAnchor="middle" className="text-sm font-medium fill-slate-700">X2</text>
              <text x="50" y="255" textAnchor="middle" className="text-xs fill-slate-600">{inputs.x2.toFixed(2)}</text>
            </g>

            {/* Hidden Layer */}
            <g>
              <circle
                cx="200"
                cy="120"
                r="25"
                className={`${getNodeColor(hiddenActivated1)} stroke-slate-400 stroke-2`}
                onMouseEnter={() => setHoveredNeuron('h1')}
                onMouseLeave={() => setHoveredNeuron(null)}
              />
              <text x="200" y="125" textAnchor="middle" className="text-sm font-medium fill-slate-700">H1</text>
              <text x="200" y="155" textAnchor="middle" className="text-xs fill-slate-600">{hiddenActivated1.toFixed(2)}</text>

              <circle
                cx="200"
                cy="180"
                r="25"
                className={`${getNodeColor(hiddenActivated2)} stroke-slate-400 stroke-2`}
                onMouseEnter={() => setHoveredNeuron('h2')}
                onMouseLeave={() => setHoveredNeuron(null)}
              />
              <text x="200" y="185" textAnchor="middle" className="text-sm font-medium fill-slate-700">H2</text>
              <text x="200" y="215" textAnchor="middle" className="text-xs fill-slate-600">{hiddenActivated2.toFixed(2)}</text>
            </g>

            {/* Output Layer */}
            <g>
              <circle
                cx="350"
                cy="150"
                r="25"
                className={`${getNodeColor(finalOutput)} stroke-slate-400 stroke-2`}
                onMouseEnter={() => setHoveredNeuron('output')}
                onMouseLeave={() => setHoveredNeuron(null)}
              />
              <text x="350" y="155" textAnchor="middle" className="text-sm font-medium fill-slate-700">Out</text>
              <text x="350" y="185" textAnchor="middle" className="text-xs fill-slate-600">{finalOutput.toFixed(2)}</text>
            </g>

            {/* Layer Labels */}
            <text x="50" y="30" textAnchor="middle" className="text-sm font-semibold fill-slate-700">Input Layer</text>
            <text x="200" y="30" textAnchor="middle" className="text-sm font-semibold fill-slate-700">Hidden Layer</text>
            <text x="350" y="30" textAnchor="middle" className="text-sm font-semibold fill-slate-700">Output Layer</text>
          </svg>
        </div>
      </div>

      {/* Computation Details */}
      {hoveredNeuron && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 w-full max-w-2xl">
          <h5 className="font-semibold text-amber-800 mb-2">Computation for {hoveredNeuron.toUpperCase()}</h5>
          {hoveredNeuron === 'h1' && (
            <div className="text-sm text-amber-700">
              <p>Weighted Sum: {weights.w1.toFixed(2)} × {inputs.x1.toFixed(2)} + {weights.w2.toFixed(2)} × {inputs.x2.toFixed(2)} + {bias.toFixed(2)} = {hiddenNeuron1.toFixed(3)}</p>
              <p>After {activationFunction}: {hiddenActivated1.toFixed(3)}</p>
            </div>
          )}
          {hoveredNeuron === 'h2' && (
            <div className="text-sm text-amber-700">
              <p>Weighted Sum: {weights.w3.toFixed(2)} × {inputs.x1.toFixed(2)} + {weights.w4.toFixed(2)} × {inputs.x2.toFixed(2)} + {bias.toFixed(2)} = {hiddenNeuron2.toFixed(3)}</p>
              <p>After {activationFunction}: {hiddenActivated2.toFixed(3)}</p>
            </div>
          )}
          {hoveredNeuron === 'output' && (
            <div className="text-sm text-amber-700">
              <p>Weighted Sum: 0.60 × {hiddenActivated1.toFixed(2)} + 0.40 × {hiddenActivated2.toFixed(2)} + {bias.toFixed(2)} = {outputNeuron.toFixed(3)}</p>
              <p>Final Output: {finalOutput.toFixed(3)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
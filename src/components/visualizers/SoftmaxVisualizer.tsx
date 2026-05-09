"use client";

import { useState } from 'react';

export function SoftmaxVisualizer() {
  const [inputs, setInputs] = useState([1, 2, 3]);
  const [temperature, setTemperature] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const addInput = () => {
    if (inputs.length < 6) {
      setInputs([...inputs, 0]);
    }
  };

  const removeInput = (index: number) => {
    if (inputs.length > 2) {
      setInputs(inputs.filter((_, i) => i !== index));
    }
  };

  const updateInput = (index: number, value: number) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const computeSoftmax = (values: number[], temp: number = 1) => {
    const adjustedValues = values.map(v => v / temp);
    const maxVal = Math.max(...adjustedValues);
    const expValues = adjustedValues.map(v => Math.exp(v - maxVal));
    const sumExp = expValues.reduce((sum, exp) => sum + exp, 0);
    return expValues.map(exp => exp / sumExp);
  };

  const softmaxOutputs = computeSoftmax(inputs, temperature);

  const getBarColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500', 'bg-slate-500'];
    return colors[index % colors.length];
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Softmax Function</h3>
        <p className="text-slate-600 max-w-2xl">
          Transform any vector of real numbers into a probability distribution. Adjust inputs and temperature to see how softmax preserves ordering while creating valid probabilities.
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Temperature Control */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Temperature: {temperature.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Sharp (0.1)</span>
            <span>Smooth (5.0)</span>
          </div>
        </div>

        {/* Input Controls */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-slate-800">Raw Inputs</h4>
            <div className="space-x-2">
              <button
                onClick={addInput}
                disabled={inputs.length >= 6}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:bg-slate-300"
              >
                Add
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inputs.map((input, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-600">
                    x[{index}]: {input.toFixed(1)}
                  </label>
                  <button
                    onClick={() => removeInput(index)}
                    disabled={inputs.length <= 2}
                    className="text-rose-500 hover:text-rose-700 disabled:text-slate-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={input}
                  onChange={(e) => updateInput(index, parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Raw Values Visualization */}
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Raw Values</h4>
            <div className="space-y-3">
              {inputs.map((input, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">x[{index}]</span>
                    <span className="font-mono">{input.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 relative overflow-hidden">
                    <div
                      className={`h-full ${getBarColor(index)} transition-all duration-300`}
                      style={{
                        width: `${Math.max(0, (input + 5) / 10 * 100)}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Softmax Probabilities */}
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Softmax Probabilities</h4>
            <div className="space-y-3">
              {softmaxOutputs.map((prob, index) => (
                <div 
                  key={index} 
                  className="space-y-1 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">p[{index}]</span>
                    <span className="font-mono">{prob.toFixed(3)}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 relative overflow-hidden">
                    <div
                      className={`h-full ${getBarColor(index)} transition-all duration-300 ${
                        hoveredIndex === index ? 'opacity-80' : ''
                      }`}
                      style={{
                        width: `${prob * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-slate-500 border-t pt-3">
              Sum: {softmaxOutputs.reduce((sum, prob) => sum + prob, 0).toFixed(6)}
            </div>
          </div>
        </div>

        {/* Formula Display */}
        <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
          <h4 className="text-lg font-semibold text-indigo-800 mb-3">Softmax Formula</h4>
          <div className="font-mono text-sm text-indigo-700 bg-white p-3 rounded border">
            softmax(x_i) = exp(x_i / T) / Σ(exp(x_j / T)) for all j
          </div>
          <p className="text-sm text-indigo-600 mt-2">
            Where T is temperature. Lower T makes the distribution sharper (more confident), higher T makes it smoother.
          </p>
        </div>
      </div>
    </div>
  );
}
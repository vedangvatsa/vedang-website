"use client";

import { useState } from 'react';

export function CrossEntropyLossVisualizer() {
  const [predictions, setPredictions] = useState([0.7, 0.2, 0.1]);
  const [trueClass, setTrueClass] = useState(0);
  const [animating, setAnimating] = useState(false);

  const classes = ['Cat', 'Dog', 'Bird'];
  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-rose-500'];
  const lightColors = ['bg-blue-100', 'bg-emerald-100', 'bg-rose-100'];

  // Normalize predictions to sum to 1
  const sum = predictions.reduce((a, b) => a + b, 0);
  const normalizedPreds = predictions.map(p => p / sum);

  // Calculate cross-entropy loss
  const correctClassProb = normalizedPreds[trueClass];
  const crossEntropyLoss = -Math.log(Math.max(correctClassProb, 0.001)); // Prevent log(0)

  const updatePrediction = (index: number, value: number) => {
    const newPreds = [...predictions];
    newPreds[index] = value;
    setPredictions(newPreds);
  };

  const runExample = (example: 'confident_correct' | 'uncertain' | 'confident_wrong') => {
    setAnimating(true);
    
    setTimeout(() => {
      switch (example) {
        case 'confident_correct':
          setPredictions([0.9, 0.05, 0.05]);
          setTrueClass(0);
          break;
        case 'uncertain':
          setPredictions([0.4, 0.3, 0.3]);
          setTrueClass(0);
          break;
        case 'confident_wrong':
          setPredictions([0.1, 0.8, 0.1]);
          setTrueClass(0);
          break;
      }
      setAnimating(false);
    }, 300);
  };

  const getLossColor = (loss: number) => {
    if (loss < 0.5) return 'text-emerald-600';
    if (loss < 1.5) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getLossInterpretation = (loss: number) => {
    if (loss < 0.5) return 'Excellent! High confidence in correct answer';
    if (loss < 1.5) return 'Moderate loss - uncertain prediction';
    return 'High loss! Model is confident but wrong';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Cross-Entropy Loss Visualizer</h3>
        <p className="text-slate-600">Explore how prediction confidence affects loss values in classification</p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Interactive Controls */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Model Predictions</h4>
            
            {classes.map((className, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${colors[index]} ${trueClass === index ? 'ring-2 ring-slate-800' : ''}`}>
                    {className} {trueClass === index && '★'}
                  </span>
                  <span className="text-slate-600 font-mono">{normalizedPreds[index].toFixed(3)}</span>
                </div>
                
                <input
                  type="range"
                  min="0.01"
                  max="1"
                  step="0.01"
                  value={predictions[index]}
                  onChange={(e) => updatePrediction(index, parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                
                <div className="w-full bg-slate-200 rounded-full h-3 mt-2">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${colors[index]}`}
                    style={{ width: `${normalizedPreds[index] * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}

            <div className="mt-6">
              <h5 className="text-sm font-semibold text-slate-700 mb-3">True Label:</h5>
              <div className="flex gap-2">
                {classes.map((className, index) => (
                  <button
                    key={index}
                    onClick={() => setTrueClass(index)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      trueClass === index 
                        ? `${colors[index]} text-white` 
                        : `${lightColors[index]} text-slate-700 hover:opacity-80`
                    }`}
                  >
                    {className}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Quick Examples</h4>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => runExample('confident_correct')}
                className="p-3 text-left rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                <div className="font-medium text-emerald-800">Confident & Correct</div>
                <div className="text-sm text-emerald-600">High prob on true class → Low loss</div>
              </button>
              
              <button
                onClick={() => runExample('uncertain')}
                className="p-3 text-left rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                <div className="font-medium text-amber-800">Uncertain</div>
                <div className="text-sm text-amber-600">Low prob on true class → Medium loss</div>
              </button>
              
              <button
                onClick={() => runExample('confident_wrong')}
                className="p-3 text-left rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
              >
                <div className="font-medium text-rose-800">Confident & Wrong</div>
                <div className="text-sm text-rose-600">Very low prob on true class → High loss</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="space-y-6">
          <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all duration-300 ${animating ? 'scale-105' : ''}`}>
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Cross-Entropy Loss</h4>
            
            <div className="text-center mb-6">
              <div className={`text-4xl font-bold mb-2 ${getLossColor(crossEntropyLoss)}`}>
                {crossEntropyLoss.toFixed(3)}
              </div>
              <div className="text-slate-600 text-sm">
                {getLossInterpretation(crossEntropyLoss)}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h5 className="font-semibold text-slate-700 mb-2">Calculation:</h5>
              <div className="font-mono text-sm text-slate-600 space-y-1">
                <div>Loss = -log(p<sub>true</sub>)</div>
                <div>Loss = -log({normalizedPreds[trueClass].toFixed(3)})</div>
                <div className={`font-semibold ${getLossColor(crossEntropyLoss)}`}>
                  Loss = {crossEntropyLoss.toFixed(3)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Loss Visualization</h4>
            
            {/* Loss meter */}
            <div className="relative h-8 bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full mb-4">
              <div 
                className="absolute top-0 w-1 h-8 bg-slate-800 rounded transition-all duration-300"
                style={{ left: `${Math.min(crossEntropyLoss / 3 * 100, 100)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-slate-600 mb-6">
              <span>Low Loss (0)</span>
              <span>Medium (1.5)</span>
              <span>High Loss (3+)</span>
            </div>

            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium text-slate-700">Key Insight:</span>
                <p className="text-slate-600 mt-1">
                  The logarithmic penalty grows exponentially as confidence in wrong answers increases, 
                  creating strong gradients that guide learning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
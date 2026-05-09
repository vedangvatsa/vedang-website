"use client";

import { useState, useEffect } from 'react';

export function BackpropagationVisualizer() {
  const [step, setStep] = useState('forward');
  const [isAnimating, setIsAnimating] = useState(false);
  const [weights, setWeights] = useState({
    w1: 0.5,
    w2: 0.8,
    w3: 0.3,
    w4: 0.7
  });
  const [input, setInput] = useState(0.6);
  const [target, setTarget] = useState(0.9);
  const [activations, setActivations] = useState({ h1: 0, h2: 0, output: 0 });
  const [gradients, setGradients] = useState({ w1: 0, w2: 0, w3: 0, w4: 0 });
  const [loss, setLoss] = useState(0);

  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  const sigmoidDerivative = (x: number) => x * (1 - x);

  const runForwardPass = () => {
    const h1 = sigmoid(input * weights.w1);
    const h2 = sigmoid(input * weights.w2);
    const output = sigmoid(h1 * weights.w3 + h2 * weights.w4);
    const currentLoss = 0.5 * Math.pow(target - output, 2);

    setActivations({ h1, h2, output });
    setLoss(currentLoss);
    return { h1, h2, output, currentLoss };
  };

  const runBackwardPass = () => {
    const { h1, h2, output } = activations;
    
    // Output layer gradients
    const outputError = target - output;
    const outputGradient = -outputError * sigmoidDerivative(output);
    
    // Hidden layer gradients
    const dw3 = outputGradient * h1;
    const dw4 = outputGradient * h2;
    
    const h1Error = outputGradient * weights.w3;
    const h2Error = outputGradient * weights.w4;
    
    const h1Gradient = h1Error * sigmoidDerivative(h1);
    const h2Gradient = h2Error * sigmoidDerivative(h2);
    
    const dw1 = h1Gradient * input;
    const dw2 = h2Gradient * input;
    
    setGradients({ w1: dw1, w2: dw2, w3: dw3, w4: dw4 });
    return { w1: dw1, w2: dw2, w3: dw3, w4: dw4 };
  };

  const updateWeights = () => {
    const learningRate = 0.5;
    setWeights(prev => ({
      w1: prev.w1 - learningRate * gradients.w1,
      w2: prev.w2 - learningRate * gradients.w2,
      w3: prev.w3 - learningRate * gradients.w3,
      w4: prev.w4 - learningRate * gradients.w4
    }));
  };

  const runAnimation = async () => {
    setIsAnimating(true);
    setStep('forward');
    
    setTimeout(() => {
      runForwardPass();
      setStep('backward');
    }, 500);
    
    setTimeout(() => {
      runBackwardPass();
      setStep('update');
    }, 1000);
    
    setTimeout(() => {
      updateWeights();
      setStep('complete');
      setIsAnimating(false);
    }, 1500);
  };

  useEffect(() => {
    runForwardPass();
  }, [weights, input, target]);

  const NodeComponent = ({ 
    value, 
    label, 
    isActive, 
    className = "" 
  }: { 
    value: number; 
    label: string; 
    isActive: boolean; 
    className?: string; 
  }) => (
    <div className={`relative ${className}`}>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold transition-all duration-500 ${
        isActive ? 'bg-blue-600 shadow-lg scale-110' : 'bg-slate-400'
      }`}>
        {value.toFixed(2)}
      </div>
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-slate-600 whitespace-nowrap">
        {label}
      </div>
    </div>
  );

  const WeightComponent = ({ 
    weight, 
    gradient, 
    label, 
    isActive, 
    className = "" 
  }: { 
    weight: number; 
    gradient: number; 
    label: string; 
    isActive: boolean; 
    className?: string; 
  }) => (
    <div className={`${className} text-center`}>
      <div className={`px-3 py-1 rounded-lg text-white text-sm font-bold transition-all duration-500 ${
        isActive ? 'bg-rose-600 shadow-lg' : 'bg-slate-500'
      }`}>
        {weight.toFixed(2)}
      </div>
      {step === 'backward' && (
        <div className="text-xs text-rose-600 mt-1">
          ∇{gradient.toFixed(3)}
        </div>
      )}
      <div className="text-xs text-slate-600 mt-1">{label}</div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Backpropagation Visualizer</h3>
        <p className="text-slate-600 max-w-2xl">
          Watch how neural networks learn by propagating errors backward to update weights. Adjust inputs and see the algorithm in action.
        </p>
      </div>

      <div className="flex gap-8 mb-6">
        <div className="flex flex-col items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Input</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={input}
            onChange={(e) => setInput(parseFloat(e.target.value))}
            className="w-24"
          />
          <span className="text-xs text-slate-600">{input.toFixed(1)}</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Target</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={target}
            onChange={(e) => setTarget(parseFloat(e.target.value))}
            className="w-24"
          />
          <span className="text-xs text-slate-600">{target.toFixed(1)}</span>
        </div>
      </div>

      <div className="relative w-full max-w-4xl">
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
          {/* Input to hidden layer */}
          <line x1="120" y1="100" x2="220" y2="60" stroke="#64748b" strokeWidth="2" />
          <line x1="120" y1="100" x2="220" y2="140" stroke="#64748b" strokeWidth="2" />
          {/* Hidden to output layer */}
          <line x1="280" y1="60" x2="380" y2="100" stroke="#64748b" strokeWidth="2" />
          <line x1="280" y1="140" x2="380" y2="100" stroke="#64748b" strokeWidth="2" />
        </svg>

        <div className="flex justify-between items-center h-48">
          {/* Input Layer */}
          <div className="flex flex-col items-center">
            <NodeComponent 
              value={input} 
              label="Input" 
              isActive={step === 'forward'} 
            />
          </div>

          {/* Weights and Hidden Layer */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <WeightComponent 
                weight={weights.w1} 
                gradient={gradients.w1}
                label="w1" 
                isActive={step === 'backward'} 
              />
              <NodeComponent 
                value={activations.h1} 
                label="Hidden 1" 
                isActive={step === 'forward' || step === 'backward'} 
              />
              <WeightComponent 
                weight={weights.w3} 
                gradient={gradients.w3}
                label="w3" 
                isActive={step === 'backward'} 
              />
            </div>
            <div className="flex items-center gap-4">
              <WeightComponent 
                weight={weights.w2} 
                gradient={gradients.w2}
                label="w2" 
                isActive={step === 'backward'} 
              />
              <NodeComponent 
                value={activations.h2} 
                label="Hidden 2" 
                isActive={step === 'forward' || step === 'backward'} 
              />
              <WeightComponent 
                weight={weights.w4} 
                gradient={gradients.w4}
                label="w4" 
                isActive={step === 'backward'} 
              />
            </div>
          </div>

          {/* Output Layer */}
          <div className="flex flex-col items-center">
            <NodeComponent 
              value={activations.output} 
              label="Output" 
              isActive={step === 'forward' || step === 'backward'} 
            />
            <div className="mt-4 text-center">
              <div className="text-sm font-medium text-slate-700">Loss</div>
              <div className={`text-lg font-bold ${loss > 0.1 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {loss.toFixed(4)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={runAnimation}
          disabled={isAnimating}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            isAnimating 
              ? 'bg-slate-400 text-slate-200 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {isAnimating ? 'Running...' : 'Run Backpropagation'}
        </button>
        
        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
          step === 'forward' ? 'bg-blue-100 text-blue-800' :
          step === 'backward' ? 'bg-rose-100 text-rose-800' :
          step === 'update' ? 'bg-amber-100 text-amber-800' :
          'bg-emerald-100 text-emerald-800'
        }`}>
          {step === 'forward' && 'Forward Pass'}
          {step === 'backward' && 'Computing Gradients'}
          {step === 'update' && 'Updating Weights'}
          {step === 'complete' && 'Complete'}
        </div>
      </div>

      <div className="text-center text-sm text-slate-600 max-w-2xl">
        <div className="mb-2">
          <strong>Current Error:</strong> {(target - activations.output).toFixed(4)}
        </div>
        <div>
          Adjust input/target values and run backpropagation to see how gradients flow backward through the network to minimize error.
        </div>
      </div>
    </div>
  );
}
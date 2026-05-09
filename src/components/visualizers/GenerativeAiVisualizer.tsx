"use client";

import { useState } from 'react';

export function GenerativeAiVisualizer() {
  const [selectedModel, setSelectedModel] = useState('transformer');
  const [isGenerating, setIsGenerating] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [inputText, setInputText] = useState('The future of AI is');
  const [generatedTokens, setGeneratedTokens] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const modelTypes = {
    transformer: {
      name: 'Transformer',
      color: 'blue',
      description: 'Attention-based text generation',
      outputs: ['bright', 'revolutionary', 'transformative', 'promising', 'uncertain']
    },
    diffusion: {
      name: 'Diffusion Model',
      color: 'indigo',
      description: 'Iterative noise removal for images',
      outputs: ['🎨', '🖼️', '🌅', '🎭', '🖌️']
    },
    vae: {
      name: 'Variational Autoencoder',
      color: 'emerald',
      description: 'Latent space generation',
      outputs: ['∿', '◊', '⟡', '◈', '⬢']
    }
  };

  const startGeneration = () => {
    setIsGenerating(true);
    setGeneratedTokens([]);
    setCurrentStep(0);
    
    const outputs = modelTypes[selectedModel as keyof typeof modelTypes].outputs;
    
    const generateStep = (step: number) => {
      if (step < 5) {
        setTimeout(() => {
          const randomIndex = Math.floor(Math.random() * outputs.length);
          const token = outputs[randomIndex];
          setGeneratedTokens(prev => [...prev, token]);
          setCurrentStep(step + 1);
          generateStep(step + 1);
        }, 800);
      } else {
        setIsGenerating(false);
      }
    };
    
    generateStep(0);
  };

  const resetGeneration = () => {
    setGeneratedTokens([]);
    setCurrentStep(0);
    setIsGenerating(false);
  };

  const getModelColor = (model: string) => {
    return modelTypes[model as keyof typeof modelTypes].color;
  };

  const getProbabilityColor = (prob: number) => {
    if (prob > 0.7) return 'bg-emerald-500';
    if (prob > 0.4) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const mockProbabilities = generatedTokens.map(() => 
    Math.max(0.1, Math.min(0.9, temperature + (Math.random() - 0.5) * 0.4))
  );

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Generative AI Models</h3>
        <p className="text-slate-600">Interactive demonstration of how different generative models create new content from learned patterns</p>
      </div>

      <div className="flex gap-4 mb-4">
        {Object.entries(modelTypes).map(([key, model]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedModel(key);
              resetGeneration();
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedModel === key
                ? `bg-${model.color}-500 text-white shadow-md`
                : `bg-white text-${model.color}-600 border border-${model.color}-200 hover:bg-${model.color}-50`
            }`}
          >
            {model.name}
          </button>
        ))}
      </div>

      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Temperature (Creativity): {temperature.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-${getModelColor(selectedModel)}`}
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Conservative</span>
            <span>Creative</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Input Prompt:</label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your prompt..."
            />
          </div>

          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-2 min-h-[2rem]">
              <span className="text-slate-700 font-medium">{inputText}</span>
              {generatedTokens.map((token, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-white text-sm font-medium bg-${getModelColor(selectedModel)}-500 animate-pulse`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {token}
                  <span className="text-xs opacity-75">
                    {(mockProbabilities[index] * 100).toFixed(0)}%
                  </span>
                </span>
              ))}
              {isGenerating && (
                <div className={`w-3 h-3 bg-${getModelColor(selectedModel)}-500 rounded-full animate-pulse`} />
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startGeneration}
              disabled={isGenerating}
              className={`px-6 py-2 bg-${getModelColor(selectedModel)}-500 text-white rounded-lg font-medium hover:bg-${getModelColor(selectedModel)}-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
            <button
              onClick={resetGeneration}
              className="px-6 py-2 bg-slate-500 text-white rounded-lg font-medium hover:bg-slate-600 transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-2">
            {modelTypes[selectedModel as keyof typeof modelTypes].name} Architecture
          </h4>
          <p className="text-sm text-slate-600 mb-3">
            {modelTypes[selectedModel as keyof typeof modelTypes].description}
          </p>
          
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={`h-8 rounded-md border-2 transition-all duration-500 ${
                  i < currentStep
                    ? `bg-${getModelColor(selectedModel)}-100 border-${getModelColor(selectedModel)}-500`
                    : 'bg-slate-100 border-slate-300'
                }`}
              >
                <div className={`h-full rounded-sm transition-all duration-700 ${
                  i < currentStep ? getProbabilityColor(mockProbabilities[i] || 0.5) : ''
                }`} style={{
                  width: i < currentStep ? `${(mockProbabilities[i] || 0.5) * 100}%` : '0%'
                }} />
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-500 mt-2">Token prediction confidence</div>
        </div>
      </div>
    </div>
  );
}
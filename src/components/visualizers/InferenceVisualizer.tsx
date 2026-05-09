"use client";

import { useState, useEffect } from 'react';

export function InferenceVisualizer() {
  const [inputText, setInputText] = useState("What is AI?");
  const [isInferencing, setIsInferencing] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [tokens, setTokens] = useState<string[]>([]);
  const [currentToken, setCurrentToken] = useState(0);
  const [showParameters, setShowParameters] = useState(false);

  const layers = [
    { name: "Input Embedding", color: "bg-blue-500", description: "Convert text to numbers" },
    { name: "Attention Layer 1", color: "bg-indigo-500", description: "Understanding context" },
    { name: "Attention Layer 2", color: "bg-rose-500", description: "Deeper relationships" },
    { name: "Feed Forward", color: "bg-emerald-500", description: "Process information" },
    { name: "Output Layer", color: "bg-amber-500", description: "Generate response" }
  ];

  const responseTokens = ["AI", " stands", " for", " Artificial", " Intelligence,", " which", " refers", " to", " computer", " systems", " that", " can", " perform", " tasks", " requiring", " human-like", " intelligence."];

  const runInference = async () => {
    setIsInferencing(true);
    setCurrentLayer(0);
    setTokens([]);
    setCurrentToken(0);

    // Simulate layer processing
    for (let i = 0; i < layers.length; i++) {
      setCurrentLayer(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Simulate token generation
    for (let i = 0; i < responseTokens.length; i++) {
      setTokens(prev => [...prev, responseTokens[i]]);
      setCurrentToken(i);
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    setIsInferencing(false);
  };

  const reset = () => {
    setIsInferencing(false);
    setCurrentLayer(0);
    setTokens([]);
    setCurrentToken(0);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">AI Model Inference</h3>
        <p className="text-slate-600 max-w-2xl">
          Watch how a trained AI model processes your input through multiple layers to generate a response, token by token
        </p>
      </div>

      <div className="w-full max-w-4xl">
        {/* Input Section */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-3">User Input</h4>
          <div className="flex gap-4">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isInferencing}
            />
            <button
              onClick={runInference}
              disabled={isInferencing}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isInferencing ? 'Processing...' : 'Run Inference'}
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Model Architecture */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-slate-700">Neural Network Layers</h4>
            <button
              onClick={() => setShowParameters(!showParameters)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showParameters ? 'Hide' : 'Show'} Parameters
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            {layers.map((layer, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-20 h-20 rounded-lg flex items-center justify-center text-white text-xs text-center leading-tight transition-all duration-500 ${
                  currentLayer >= index && isInferencing ? layer.color : 'bg-slate-300'
                } ${currentLayer === index && isInferencing ? 'scale-110 shadow-lg' : ''}`}>
                  {layer.name}
                </div>
                <div className="text-xs text-slate-600 mt-2 text-center max-w-20">
                  {layer.description}
                </div>
                {showParameters && (
                  <div className="text-xs text-blue-600 mt-1">
                    {(Math.random() * 100).toFixed(1)}M params
                  </div>
                )}
                {index < layers.length - 1 && (
                  <div className={`absolute w-8 h-0.5 mt-10 ml-20 transition-colors duration-500 ${
                    currentLayer > index && isInferencing ? 'bg-blue-500' : 'bg-slate-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Token Generation */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-3">Generated Response</h4>
          <div className="min-h-[100px] p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex flex-wrap gap-1">
              {tokens.map((token, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded text-sm transition-all duration-300 ${
                    index === currentToken && isInferencing
                      ? 'bg-emerald-500 text-white animate-pulse'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {token}
                </span>
              ))}
              {isInferencing && currentLayer === layers.length - 1 && (
                <span className="px-2 py-1 bg-slate-300 text-slate-600 rounded text-sm animate-pulse">
                  ▊
                </span>
              )}
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-100 rounded-lg p-3">
              <div className="text-lg font-bold text-slate-800">{tokens.length}</div>
              <div className="text-sm text-slate-600">Tokens Generated</div>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <div className="text-lg font-bold text-blue-800">~2.3s</div>
              <div className="text-sm text-blue-600">Inference Time</div>
            </div>
            <div className="bg-emerald-100 rounded-lg p-3">
              <div className="text-lg font-bold text-emerald-800">$0.002</div>
              <div className="text-sm text-emerald-600">Cost (estimated)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
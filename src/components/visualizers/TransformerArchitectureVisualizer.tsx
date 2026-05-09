"use client";

import { useState } from 'react';

export function TransformerArchitectureVisualizer() {
  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const [showAttentionWeights, setShowAttentionWeights] = useState(false);
  const [encoderLayer, setEncoderLayer] = useState(0);
  const [decoderStep, setDecoderStep] = useState(0);

  const inputTokens = ['The', 'cat', 'sits', 'on', 'mat'];
  const outputTokens = ['Le', 'chat', 'est', 'assis'];
  const maxDecoderSteps = outputTokens.length;

  // Simulated attention weights (normally computed via softmax of Q·K^T)
  const getAttentionWeight = (from: number, to: number) => {
    const base = Math.exp(-Math.abs(from - to) * 0.5);
    return base + Math.random() * 0.3;
  };

  const normalizeAttentionWeights = (weights: number[]) => {
    const sum = weights.reduce((acc, w) => acc + w, 0);
    return weights.map(w => w / sum);
  };

  const getAttentionWeightsForToken = (tokenIndex: number) => {
    const weights = inputTokens.map((_, i) => getAttentionWeight(tokenIndex, i));
    return normalizeAttentionWeights(weights);
  };

  const EncoderBlock = ({ layerIndex, isActive }: { layerIndex: number; isActive: boolean }) => (
    <div className={`border-2 rounded-lg p-4 transition-all duration-300 ${
      isActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white'
    }`}>
      <div className="text-sm font-semibold text-slate-700 mb-2">Encoder Layer {layerIndex + 1}</div>
      <div className="space-y-2">
        <div className="bg-indigo-100 px-2 py-1 rounded text-xs">Multi-Head Self-Attention</div>
        <div className="bg-emerald-100 px-2 py-1 rounded text-xs">Feed Forward Network</div>
      </div>
    </div>
  );

  const DecoderBlock = ({ isActive }: { isActive: boolean }) => (
    <div className={`border-2 rounded-lg p-4 transition-all duration-300 ${
      isActive ? 'border-rose-500 bg-rose-50' : 'border-slate-300 bg-white'
    }`}>
      <div className="text-sm font-semibold text-slate-700 mb-2">Decoder</div>
      <div className="space-y-2">
        <div className="bg-rose-100 px-2 py-1 rounded text-xs">Masked Self-Attention</div>
        <div className="bg-amber-100 px-2 py-1 rounded text-xs">Cross-Attention</div>
        <div className="bg-emerald-100 px-2 py-1 rounded text-xs">Feed Forward Network</div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Transformer Architecture</h3>
        <p className="text-slate-600 text-lg">Explore how attention mechanisms process sequences in parallel</p>
      </div>

      <div className="w-full max-w-6xl space-y-8">
        {/* Input Tokens */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Input Sequence</h4>
          <div className="flex gap-2 justify-center">
            {inputTokens.map((token, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedToken(selectedToken === i ? null : i);
                  setShowAttentionWeights(true);
                }}
                className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                  selectedToken === i 
                    ? 'border-blue-500 bg-blue-100 text-blue-800' 
                    : 'border-slate-300 bg-slate-100 text-slate-700 hover:border-blue-300'
                }`}
              >
                {token}
              </button>
            ))}
          </div>
          {selectedToken !== null && (
            <div className="mt-4 text-sm text-slate-600 text-center">
              Click tokens to see attention patterns for "{inputTokens[selectedToken]}"
            </div>
          )}
        </div>

        {/* Attention Visualization */}
        {showAttentionWeights && selectedToken !== null && (
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-700 mb-4">Self-Attention Weights</h4>
            <div className="space-y-2">
              {getAttentionWeightsForToken(selectedToken).map((weight, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-12 text-sm text-slate-600">{inputTokens[i]}</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-4 relative">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-indigo-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${weight * 100}%` }}
                    />
                  </div>
                  <span className="w-12 text-xs text-slate-500">{(weight * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Architecture Flow */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Architecture Flow</h4>
          
          {/* Controls */}
          <div className="flex gap-6 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Encoder Layer:</label>
              <input
                type="range"
                min="0"
                max="2"
                value={encoderLayer}
                onChange={(e) => setEncoderLayer(parseInt(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-slate-600">{encoderLayer + 1}/3</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Decoder Step:</label>
              <input
                type="range"
                min="0"
                max={maxDecoderSteps - 1}
                value={decoderStep}
                onChange={(e) => setDecoderStep(parseInt(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-slate-600">{decoderStep + 1}/{maxDecoderSteps}</span>
            </div>
          </div>

          {/* Architecture Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Encoder Stack */}
            <div className="space-y-4">
              <h5 className="font-semibold text-slate-700 text-center">Encoder Stack</h5>
              {[0, 1, 2].reverse().map(layerIndex => (
                <EncoderBlock 
                  key={layerIndex} 
                  layerIndex={layerIndex} 
                  isActive={layerIndex === encoderLayer}
                />
              ))}
            </div>

            {/* Encoder-Decoder Connection */}
            <div className="flex flex-col justify-center items-center">
              <div className="bg-amber-100 border-2 border-amber-300 rounded-lg p-4 text-center">
                <div className="text-sm font-semibold text-amber-800">Encoded</div>
                <div className="text-sm font-semibold text-amber-800">Representations</div>
                <div className="mt-2 text-xs text-amber-700">Rich contextual embeddings</div>
              </div>
              <div className="w-px h-8 bg-slate-300 my-2"></div>
              <div className="text-xs text-slate-500 text-center">Cross-Attention</div>
            </div>

            {/* Decoder */}
            <div className="space-y-4">
              <h5 className="font-semibold text-slate-700 text-center">Decoder</h5>
              <DecoderBlock isActive={true} />
              
              {/* Output */}
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
                <div className="text-sm font-semibold text-emerald-800 mb-2">Generated Output</div>
                <div className="flex gap-1 justify-center">
                  {outputTokens.slice(0, decoderStep + 1).map((token, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 text-xs rounded ${
                        i === decoderStep 
                          ? 'bg-emerald-200 text-emerald-800' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {token}
                    </span>
                  ))}
                  {decoderStep < maxDecoderSteps - 1 && (
                    <span className="px-2 py-1 text-xs rounded bg-slate-200 text-slate-400">...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Innovations */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Key Innovations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h5 className="font-semibold text-blue-800 mb-2">Parallel Processing</h5>
              <p className="text-sm text-blue-700">All tokens processed simultaneously, not sequentially like RNNs</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <h5 className="font-semibold text-indigo-800 mb-2">Self-Attention</h5>
              <p className="text-sm text-indigo-700">Each token attends to all other tokens to capture dependencies</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
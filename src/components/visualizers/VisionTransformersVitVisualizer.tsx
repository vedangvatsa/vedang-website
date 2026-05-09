"use client";

import { useState } from 'react';

export function VisionTransformersVitVisualizer() {
  const [selectedPatch, setSelectedPatch] = useState<number | null>(null);
  const [showAttention, setShowAttention] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [patchSize, setPatchSize] = useState(4);

  const gridSize = 8;
  const patches = Array.from({ length: gridSize * gridSize }, (_, i) => i);
  
  const attentionWeights = patches.map(() => 
    patches.map(() => Math.random() * 0.8 + 0.2)
  );

  const getAttentionColor = (weight: number) => {
    const intensity = Math.floor(weight * 255);
    return `rgba(59, 130, 246, ${weight})`;
  };

  const getPatchColor = (index: number) => {
    if (!showAttention || selectedPatch === null) {
      return 'bg-slate-200 hover:bg-blue-200';
    }
    
    const weight = attentionWeights[selectedPatch][index];
    if (index === selectedPatch) return 'bg-indigo-500';
    
    if (weight > 0.7) return 'bg-blue-400';
    if (weight > 0.5) return 'bg-blue-300';
    if (weight > 0.3) return 'bg-blue-200';
    return 'bg-slate-200';
  };

  const steps = [
    'Original Image',
    'Split into Patches',
    'Flatten Patches',
    'Add Position Encoding',
    'Transformer Processing'
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Vision Transformers (ViT)</h3>
        <p className="text-slate-600 max-w-2xl">
          Interactive visualization showing how ViT splits images into patches and uses attention to capture spatial relationships
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentStep === index 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {step}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <label className="text-sm text-slate-600">
              Patch Size: {patchSize}x{patchSize}
            </label>
            <input
              type="range"
              min="2"
              max="8"
              step="2"
              value={patchSize}
              onChange={(e) => setPatchSize(Number(e.target.value))}
              className="w-20"
            />
          </div>
        </div>

        <div className="flex gap-8 items-start">
          <div className="flex-1">
            <div className="mb-4">
              <h4 className="font-semibold text-slate-700 mb-2">Image Patches</h4>
              <div 
                className="grid gap-1 p-4 bg-white rounded-lg border border-slate-300"
                style={{ 
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                  width: '300px',
                  height: '300px'
                }}
              >
                {patches.map((index) => (
                  <div
                    key={index}
                    className={`${getPatchColor(index)} border border-slate-300 cursor-pointer transition-all duration-200 flex items-center justify-center text-xs font-medium ${
                      selectedPatch === index ? 'ring-2 ring-indigo-400' : ''
                    }`}
                    onClick={() => {
                      setSelectedPatch(index === selectedPatch ? null : index);
                      setShowAttention(true);
                    }}
                    style={{
                      backgroundColor: showAttention && selectedPatch !== null ? getAttentionColor(attentionWeights[selectedPatch]?.[index] || 0) : undefined
                    }}
                  >
                    {currentStep >= 2 ? index : ''}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowAttention(!showAttention)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {showAttention ? 'Hide Attention' : 'Show Attention Map'}
            </button>
          </div>

          <div className="flex-1">
            <h4 className="font-semibold text-slate-700 mb-2">Processing Pipeline</h4>
            <div className="space-y-4">
              {currentStep >= 1 && (
                <div className="p-3 bg-emerald-100 rounded-lg border border-emerald-200">
                  <div className="font-medium text-emerald-800">1. Patch Extraction</div>
                  <div className="text-sm text-emerald-600">
                    Split {gridSize}×{gridSize} image into {patches.length} patches of {patchSize}×{patchSize} pixels each
                  </div>
                </div>
              )}

              {currentStep >= 2 && (
                <div className="p-3 bg-blue-100 rounded-lg border border-blue-200">
                  <div className="font-medium text-blue-800">2. Linear Projection</div>
                  <div className="text-sm text-blue-600">
                    Flatten each patch into vectors of length {patchSize * patchSize * 3}
                  </div>
                </div>
              )}

              {currentStep >= 3 && (
                <div className="p-3 bg-amber-100 rounded-lg border border-amber-200">
                  <div className="font-medium text-amber-800">3. Position Encoding</div>
                  <div className="text-sm text-amber-600">
                    Add learnable position embeddings to maintain spatial information
                  </div>
                </div>
              )}

              {currentStep >= 4 && (
                <div className="p-3 bg-rose-100 rounded-lg border border-rose-200">
                  <div className="font-medium text-rose-800">4. Self-Attention</div>
                  <div className="text-sm text-rose-600">
                    {selectedPatch !== null 
                      ? `Patch ${selectedPatch} attends to all other patches with varying weights`
                      : 'Click a patch to see attention weights'}
                  </div>
                </div>
              )}
            </div>

            {showAttention && selectedPatch !== null && (
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="font-medium text-indigo-800 mb-2">
                  Attention Weights for Patch {selectedPatch}
                </div>
                <div className="text-sm text-indigo-600">
                  <div>Strongest attention: {attentionWeights[selectedPatch].map((w, i) => ({ weight: w, index: i })).sort((a, b) => b.weight - a.weight).slice(0, 3).map(item => `Patch ${item.index}`).join(', ')}</div>
                  <div className="mt-1">Blue intensity shows attention strength</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-slate-500 mt-4">
          <p>Unlike CNNs that process local neighborhoods, ViT can attend to any patch regardless of distance, enabling global context understanding</p>
        </div>
      </div>
    </div>
  );
}
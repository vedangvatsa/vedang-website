"use client";

import React, { useState, useEffect } from 'react';

export function VitVisualizer() {
  const [selectedPatch, setSelectedPatch] = useState<number | null>(null);
  const [showAttention, setShowAttention] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const gridSize = 4; // 4x4 grid of patches
  const totalPatches = gridSize * gridSize;
  const maxLayers = 6;

  // Generate attention weights (simulated)
  const generateAttentionWeights = (queryPatch: number, layer: number) => {
    const weights = Array(totalPatches).fill(0).map((_, i) => {
      const distance = Math.abs(Math.floor(queryPatch / gridSize) - Math.floor(i / gridSize)) + 
                      Math.abs(queryPatch % gridSize - i % gridSize);
      const baseWeight = Math.exp(-distance * 0.3);
      const noise = 0.1 * Math.sin(i * layer * 0.5);
      return Math.max(0.1, baseWeight + noise);
    });
    
    // Normalize weights
    const sum = weights.reduce((a, b) => a + b, 0);
    return weights.map(w => w / sum);
  };

  const startAnimation = () => {
    setIsAnimating(true);
    setAnimationStep(0);
    const interval = setInterval(() => {
      setAnimationStep(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          setIsAnimating(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const getStepDescription = (step: number) => {
    switch(step) {
      case 1: return "1. Split image into 16 patches";
      case 2: return "2. Flatten patches to vectors + add position embeddings";
      case 3: return "3. Process through transformer layers";
      case 4: return "4. Apply self-attention mechanism";
      default: return "Vision Transformer Pipeline";
    }
  };

  const attentionWeights = selectedPatch !== null ? generateAttentionWeights(selectedPatch, currentLayer) : [];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Vision Transformer (ViT)</h3>
        <p className="text-slate-600 text-sm max-w-2xl">
          Interactive visualization of how Vision Transformers process images using patch embeddings and self-attention
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Image Patches Grid */}
        <div className="flex flex-col items-center gap-4">
          <h4 className="text-lg font-semibold text-slate-700">
            {isAnimating ? getStepDescription(animationStep) : "Click patches to explore attention"}
          </h4>
          
          <div className="relative">
            <div className="grid grid-cols-4 gap-1 p-4 bg-white rounded-lg border-2 border-slate-300">
              {Array(totalPatches).fill(0).map((_, i) => {
                const isSelected = selectedPatch === i;
                const attentionWeight = showAttention && selectedPatch !== null ? attentionWeights[i] : 0;
                const opacity = showAttention && selectedPatch !== null ? 
                  Math.max(0.2, attentionWeight * 2) : 1;
                
                return (
                  <div
                    key={i}
                    className={`w-16 h-16 border-2 cursor-pointer transition-all duration-300 flex items-center justify-center text-xs font-bold ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-100' 
                        : 'border-slate-300 bg-slate-100 hover:bg-slate-200'
                    } ${animationStep === 1 ? 'animate-pulse' : ''}`}
                    style={{ 
                      opacity,
                      backgroundColor: showAttention && selectedPatch !== null ? 
                        `rgba(59, 130, 246, ${attentionWeight})` : undefined
                    }}
                    onClick={() => {
                      setSelectedPatch(i);
                      setShowAttention(true);
                    }}
                  >
                    {i}
                  </div>
                );
              })}
            </div>
            
            {animationStep === 2 && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-20 rounded-lg">
                <div className="bg-white p-3 rounded border text-sm font-medium text-blue-700">
                  + Position Embeddings
                </div>
              </div>
            )}
          </div>

          <button
            onClick={startAnimation}
            disabled={isAnimating}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isAnimating 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isAnimating ? 'Processing...' : 'Animate Pipeline'}
          </button>
        </div>

        {/* Transformer Layers */}
        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-semibold text-slate-700">Transformer Layers</h4>
          
          <div className="flex flex-col gap-2">
            {Array(maxLayers).fill(0).map((_, layer) => (
              <div
                key={layer}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  currentLayer === layer
                    ? 'border-indigo-500 bg-indigo-100'
                    : 'border-slate-300 bg-white hover:bg-slate-50'
                } ${animationStep === 3 && layer <= currentLayer ? 'animate-pulse' : ''}`}
                onClick={() => setCurrentLayer(layer)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">Layer {layer + 1}</span>
                  <div className="flex gap-1">
                    {/* Multi-head attention visualization */}
                    {Array(8).fill(0).map((_, head) => (
                      <div
                        key={head}
                        className={`w-3 h-3 rounded-full ${
                          currentLayer === layer ? 'bg-indigo-500' : 'bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Multi-Head Self-Attention + FFN
                </div>
              </div>
            ))}
          </div>

          {/* Attention Weights Display */}
          {showAttention && selectedPatch !== null && (
            <div className="bg-white p-4 rounded-lg border border-slate-300">
              <h5 className="font-medium text-slate-700 mb-2">
                Attention Weights (Patch {selectedPatch}, Layer {currentLayer + 1})
              </h5>
              <div className="grid grid-cols-4 gap-1">
                {attentionWeights.map((weight, i) => (
                  <div
                    key={i}
                    className="text-xs text-center p-1 rounded"
                    style={{
                      backgroundColor: `rgba(99, 102, 241, ${weight})`,
                      color: weight > 0.5 ? 'white' : 'black'
                    }}
                  >
                    {weight.toFixed(2)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <button
          onClick={() => {
            setShowAttention(!showAttention);
            if (!showAttention && selectedPatch === null) {
              setSelectedPatch(0);
            }
          }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            showAttention 
              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
              : 'bg-slate-300 text-slate-700 hover:bg-slate-400'
          }`}
        >
          {showAttention ? 'Hide' : 'Show'} Attention
        </button>

        <button
          onClick={() => {
            setSelectedPatch(null);
            setShowAttention(false);
            setCurrentLayer(0);
          }}
          className="px-4 py-2 rounded-lg font-medium bg-rose-500 text-white hover:bg-rose-600 transition-colors"
        >
          Reset
        </button>

        <div className="text-sm text-slate-600">
          Patches: {totalPatches} | Current Layer: {currentLayer + 1}/{maxLayers}
        </div>
      </div>
    </div>
  );
}
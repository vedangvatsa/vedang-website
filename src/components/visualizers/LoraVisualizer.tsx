"use client";

import { useState } from 'react';

export function LoraVisualizer() {
  const [rank, setRank] = useState(4);
  const [hoveredMatrix, setHoveredMatrix] = useState<string | null>(null);
  const [showDecomposition, setShowDecomposition] = useState(false);
  const [animateUpdate, setAnimateUpdate] = useState(false);

  const originalDim = 8;
  const fullParams = originalDim * originalDim;
  const loraParams = 2 * originalDim * rank;
  const paramReduction = ((fullParams - loraParams) / fullParams * 100).toFixed(1);

  const generateMatrixValues = (rows: number, cols: number, seed: number) => {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push((Math.sin(seed + i * cols + j) * 0.5 + 0.5));
      }
      matrix.push(row);
    }
    return matrix;
  };

  const matrixA = generateMatrixValues(originalDim, rank, 123);
  const matrixB = generateMatrixValues(rank, originalDim, 456);

  const MatrixCell = ({ value, isHighlighted, size = 'normal' }: { value: number, isHighlighted: boolean, size?: 'normal' | 'small' }) => {
    const intensity = Math.round(value * 255);
    const cellSize = size === 'small' ? 'w-3 h-3' : 'w-4 h-4';
    
    return (
      <div 
        className={`${cellSize} border border-slate-300 transition-all duration-300 ${
          isHighlighted ? 'ring-2 ring-blue-400 scale-110' : ''
        } ${animateUpdate ? 'animate-pulse' : ''}`}
        style={{ backgroundColor: `rgb(${255-intensity}, ${255-intensity}, 255)` }}
      />
    );
  };

  const renderMatrix = (matrix: number[][], name: string, color: string) => (
    <div 
      className={`flex flex-col items-center gap-2 transition-all duration-300 ${
        hoveredMatrix === name ? 'scale-105' : ''
      }`}
      onMouseEnter={() => setHoveredMatrix(name)}
      onMouseLeave={() => setHoveredMatrix(null)}
    >
      <div className={`text-sm font-semibold ${color}`}>{name}</div>
      <div className={`grid gap-0.5 p-2 bg-white rounded border-2 ${
        hoveredMatrix === name ? 'border-blue-400' : 'border-slate-200'
      }`} style={{ gridTemplateColumns: `repeat(${matrix[0].length}, 1fr)` }}>
        {matrix.map((row, i) =>
          row.map((cell, j) => (
            <MatrixCell 
              key={`${i}-${j}`} 
              value={cell} 
              isHighlighted={hoveredMatrix === name}
              size={matrix.length > 6 ? 'small' : 'normal'}
            />
          ))
        )}
      </div>
      <div className="text-xs text-slate-600">
        {matrix.length} × {matrix[0].length}
      </div>
    </div>
  );

  const handleRankChange = (newRank: number) => {
    setRank(newRank);
    setAnimateUpdate(true);
    setTimeout(() => setAnimateUpdate(false), 500);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">LoRA: Low-Rank Adaptation</h3>
        <p className="text-slate-600 max-w-2xl">
          Interactive visualization of how LoRA decomposes weight updates into smaller matrices, dramatically reducing trainable parameters while maintaining model performance.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700">Rank (r):</label>
          <input
            type="range"
            min="1"
            max="8"
            value={rank}
            onChange={(e) => handleRankChange(parseInt(e.target.value))}
            className="w-32 accent-blue-500"
          />
          <span className="text-sm font-semibold text-blue-600 w-8">{rank}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-rose-600 mb-2">Traditional Fine-tuning</div>
              <div className="text-sm text-slate-600 mb-4">Update entire weight matrix</div>
              {renderMatrix(generateMatrixValues(originalDim, originalDim, 789), "ΔW", "text-rose-600")}
              <div className="mt-2 text-xs text-slate-600">
                Parameters: {fullParams}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="text-2xl text-slate-400">→</div>
            <button
              onClick={() => setShowDecomposition(!showDecomposition)}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              {showDecomposition ? 'Hide' : 'Show'} Decomposition
            </button>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-emerald-600 mb-2">LoRA Adaptation</div>
              <div className="text-sm text-slate-600 mb-4">ΔW ≈ B × A</div>
              
              {showDecomposition ? (
                <div className="flex items-center gap-3">
                  {renderMatrix(matrixB, "B", "text-emerald-600")}
                  <div className="text-lg text-slate-400">×</div>
                  {renderMatrix(matrixA, "A", "text-emerald-600")}
                </div>
              ) : (
                renderMatrix(generateMatrixValues(originalDim, originalDim, 321), "B×A", "text-emerald-600")
              )}
              
              <div className="mt-2 text-xs text-slate-600">
                Parameters: {loraParams}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <div className="text-2xl font-bold text-rose-600">{fullParams}</div>
            <div className="text-sm text-slate-600">Full Parameters</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <div className="text-2xl font-bold text-emerald-600">{loraParams}</div>
            <div className="text-sm text-slate-600">LoRA Parameters</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <div className="text-2xl font-bold text-amber-600">{paramReduction}%</div>
            <div className="text-sm text-slate-600">Reduction</div>
          </div>
        </div>

        <div className="text-sm text-slate-600 max-w-lg text-center bg-blue-50 p-4 rounded-lg border border-blue-200">
          <strong>Key Insight:</strong> By constraining updates to low-rank decompositions, LoRA captures the essential adaptations while using drastically fewer parameters. Adjust the rank to see the parameter trade-off.
        </div>
      </div>
    </div>
  );
}
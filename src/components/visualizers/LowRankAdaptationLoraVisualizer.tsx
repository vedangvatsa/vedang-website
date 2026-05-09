"use client";

import { useState } from 'react';

export function LowRankAdaptationLoraVisualizer() {
  const [selectedMode, setSelectedMode] = useState<'full' | 'lora'>('full');
  const [rank, setRank] = useState(2);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingStep, setTrainingStep] = useState(0);

  const originalSize = 8;
  const maxTrainingSteps = 20;

  const fullParams = originalSize * originalSize;
  const loraParams = rank * originalSize * 2;
  const reduction = ((fullParams - loraParams) / fullParams * 100).toFixed(1);

  const startTraining = () => {
    setIsTraining(true);
    setTrainingStep(0);
    const interval = setInterval(() => {
      setTrainingStep(prev => {
        if (prev >= maxTrainingSteps) {
          setIsTraining(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 100);
  };

  const resetTraining = () => {
    setIsTraining(false);
    setTrainingStep(0);
  };

  const getMatrixCellColor = (i: number, j: number, isOriginal: boolean) => {
    if (isOriginal) {
      return 'bg-slate-300 border-slate-400';
    }
    
    const intensity = Math.min(trainingStep / maxTrainingSteps, 1);
    if (selectedMode === 'lora') {
      const alpha = Math.floor(intensity * 255);
      return `bg-blue-200 border-blue-300`;
    } else {
      return `bg-emerald-200 border-emerald-300`;
    }
  };

  const Matrix = ({ size, label, isDecomposed = false, matrixType = 'main' }: {
    size: { rows: number, cols: number };
    label: string;
    isDecomposed?: boolean;
    matrixType?: 'main' | 'A' | 'B';
  }) => (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <div className="grid gap-1 p-2 bg-white rounded border" 
           style={{ gridTemplateColumns: `repeat(${size.cols}, 1fr)` }}>
        {Array.from({ length: size.rows * size.cols }).map((_, idx) => {
          const i = Math.floor(idx / size.cols);
          const j = idx % size.cols;
          let cellColor = 'bg-slate-200 border-slate-300';
          
          if (matrixType === 'A') {
            cellColor = 'bg-rose-200 border-rose-300';
          } else if (matrixType === 'B') {
            cellColor = 'bg-indigo-200 border-indigo-300';
          } else if (isDecomposed) {
            cellColor = getMatrixCellColor(i, j, false);
          } else {
            cellColor = getMatrixCellColor(i, j, true);
          }
          
          return (
            <div
              key={idx}
              className={`w-6 h-6 border ${cellColor} transition-colors duration-300`}
            />
          );
        })}
      </div>
      <span className="text-xs text-slate-500">
        {size.rows}×{size.cols} = {size.rows * size.cols} params
      </span>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Low-Rank Adaptation (LoRA) Visualization
        </h3>
        <p className="text-slate-600 max-w-2xl">
          Compare full fine-tuning vs LoRA: instead of updating all parameters, LoRA uses two small matrices to capture the most important changes
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setSelectedMode('full')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedMode === 'full'
              ? 'bg-emerald-500 text-white'
              : 'bg-white text-slate-600 border border-slate-300'
          }`}
        >
          Full Fine-tuning
        </button>
        <button
          onClick={() => setSelectedMode('lora')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedMode === 'lora'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-slate-600 border border-slate-300'
          }`}
        >
          LoRA
        </button>
      </div>

      {selectedMode === 'lora' && (
        <div className="flex items-center gap-4">
          <label className="text-slate-600 font-medium">Rank:</label>
          <input
            type="range"
            min="1"
            max="4"
            value={rank}
            onChange={(e) => setRank(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-slate-800 font-mono">{rank}</span>
        </div>
      )}

      <div className="flex items-center justify-center gap-8">
        <Matrix 
          size={{ rows: originalSize, cols: originalSize }} 
          label="Original Weight Matrix W"
          isDecomposed={false}
        />
        
        <div className="text-2xl text-slate-400">+</div>

        {selectedMode === 'full' ? (
          <Matrix 
            size={{ rows: originalSize, cols: originalSize }} 
            label="Update Matrix ΔW"
            isDecomposed={true}
          />
        ) : (
          <div className="flex items-center gap-4">
            <Matrix 
              size={{ rows: originalSize, cols: rank }} 
              label="Matrix A"
              matrixType="A"
            />
            <div className="text-xl text-slate-400">×</div>
            <Matrix 
              size={{ rows: rank, cols: originalSize }} 
              label="Matrix B"
              matrixType="B"
            />
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 w-full max-w-md">
        <h4 className="font-bold text-slate-800 mb-4">Training Statistics</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-600">Method:</span>
            <span className="font-mono text-slate-800">
              {selectedMode === 'full' ? 'Full Fine-tuning' : 'LoRA'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Trainable Params:</span>
            <span className="font-mono text-slate-800">
              {selectedMode === 'full' ? fullParams : loraParams}
            </span>
          </div>
          {selectedMode === 'lora' && (
            <div className="flex justify-between">
              <span className="text-slate-600">Reduction:</span>
              <span className="font-mono text-emerald-600">
                {reduction}%
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-600">Training Step:</span>
            <span className="font-mono text-slate-800">
              {trainingStep}/{maxTrainingSteps}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={startTraining}
          disabled={isTraining}
          className="px-6 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTraining ? 'Training...' : 'Start Training'}
        </button>
        <button
          onClick={resetTraining}
          className="px-6 py-2 bg-slate-500 text-white rounded-lg font-medium hover:bg-slate-600"
        >
          Reset
        </button>
      </div>

      {selectedMode === 'lora' && (
        <div className="text-center text-sm text-slate-600 bg-blue-50 p-4 rounded-lg max-w-2xl">
          <strong>LoRA Insight:</strong> Instead of learning {fullParams} parameters, 
          we only train {loraParams} parameters in two low-rank matrices. 
          The product A×B approximates the full update matrix, saving {reduction}% memory!
        </div>
      )}
    </div>
  );
}
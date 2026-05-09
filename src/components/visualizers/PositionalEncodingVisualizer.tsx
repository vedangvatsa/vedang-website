"use client";

import { useState } from 'react';

export function PositionalEncodingVisualizer() {
  const [selectedPosition, setSelectedPosition] = useState(0);
  const [hoveredDimension, setHoveredDimension] = useState<number | null>(null);
  const [sequenceLength, setSequenceLength] = useState(8);
  const [modelDimension, setModelDimension] = useState(16);

  const generatePositionalEncoding = (pos: number, dim: number, dModel: number) => {
    if (dim % 2 === 0) {
      return Math.sin(pos / Math.pow(10000, (2 * (dim / 2)) / dModel));
    } else {
      return Math.cos(pos / Math.pow(10000, (2 * Math.floor(dim / 2)) / dModel));
    }
  };

  const getColorIntensity = (value: number) => {
    const intensity = Math.abs(value);
    if (intensity > 0.8) return 'bg-indigo-800';
    if (intensity > 0.6) return 'bg-indigo-600';
    if (intensity > 0.4) return 'bg-indigo-400';
    if (intensity > 0.2) return 'bg-indigo-200';
    return 'bg-slate-100';
  };

  const tokens = ['the', 'cat', 'sat', 'on', 'the', 'mat', 'and', 'slept'].slice(0, sequenceLength);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Positional Encoding</h3>
        <p className="text-slate-600 max-w-2xl">
          Interactive visualization of how transformers inject position information using sine and cosine functions at different frequencies
        </p>
      </div>

      <div className="flex gap-6 mb-4">
        <div className="flex flex-col items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Sequence Length</label>
          <input
            type="range"
            min="4"
            max="8"
            value={sequenceLength}
            onChange={(e) => setSequenceLength(parseInt(e.target.value))}
            className="w-24"
          />
          <span className="text-xs text-slate-500">{sequenceLength}</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Model Dimension</label>
          <input
            type="range"
            min="8"
            max="32"
            step="2"
            value={modelDimension}
            onChange={(e) => setModelDimension(parseInt(e.target.value))}
            className="w-24"
          />
          <span className="text-xs text-slate-500">{modelDimension}</span>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-semibold text-slate-800 text-center">Input Tokens</h4>
          <div className="flex flex-col gap-2">
            {tokens.map((token, pos) => (
              <button
                key={pos}
                onClick={() => setSelectedPosition(pos)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedPosition === pos
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="text-sm font-medium">{token}</div>
                <div className="text-xs opacity-75">pos: {pos}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-semibold text-slate-800 text-center">
            Positional Encoding Matrix
          </h4>
          <div className="grid gap-1" style={{gridTemplateColumns: `repeat(${modelDimension}, 1fr)`}}>
            {Array.from({length: sequenceLength}, (_, pos) =>
              Array.from({length: modelDimension}, (_, dim) => {
                const value = generatePositionalEncoding(pos, dim, modelDimension);
                return (
                  <div
                    key={`${pos}-${dim}`}
                    className={`w-6 h-6 border border-slate-200 transition-all cursor-pointer ${
                      pos === selectedPosition ? 'ring-2 ring-blue-500' : ''
                    } ${getColorIntensity(value)}`}
                    onMouseEnter={() => setHoveredDimension(dim)}
                    onMouseLeave={() => setHoveredDimension(null)}
                    title={`pos: ${pos}, dim: ${dim}, value: ${value.toFixed(3)}`}
                  />
                );
              })
            )}
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Dimension 0</span>
            <span>Dimension {modelDimension - 1}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 max-w-xs">
          <h4 className="text-lg font-semibold text-slate-800">Formula Breakdown</h4>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="text-sm text-slate-700 mb-2">
              For position <span className="font-mono bg-blue-100 px-1 rounded">{selectedPosition}</span>:
            </div>
            {hoveredDimension !== null && (
              <div className="text-xs font-mono text-slate-600 space-y-1">
                <div>dim = {hoveredDimension}</div>
                <div>
                  {hoveredDimension % 2 === 0 ? 'sin' : 'cos'}({selectedPosition} / 10000^(
                  {hoveredDimension % 2 === 0 ? hoveredDimension : Math.floor(hoveredDimension / 2) * 2}/{modelDimension}))
                </div>
                <div className="text-indigo-600 font-semibold">
                  = {generatePositionalEncoding(selectedPosition, hoveredDimension, modelDimension).toFixed(3)}
                </div>
              </div>
            )}
            {hoveredDimension === null && (
              <div className="text-xs text-slate-500">
                Hover over encoding matrix to see calculation
              </div>
            )}
          </div>

          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
            <div className="text-xs font-medium text-amber-800 mb-1">Key Insight</div>
            <div className="text-xs text-amber-700">
              Each position gets a unique pattern of sine/cosine values across dimensions, allowing the model to distinguish word order.
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-800 rounded"></div>
          <span>High magnitude</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-400 rounded"></div>
          <span>Medium magnitude</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-100 border border-slate-200 rounded"></div>
          <span>Low magnitude</span>
        </div>
      </div>
    </div>
  );
}
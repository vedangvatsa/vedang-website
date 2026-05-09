"use client";

import { useState } from "react";

export function PatternRecognitionVisualizer() {
  const [selectedPattern, setSelectedPattern] = useState<'visual' | 'sequence' | 'classification'>('visual');
  const [trainingData, setTrainingData] = useState<Array<{x: number, y: number, label: 'A' | 'B'}>>([
    {x: 2, y: 8, label: 'A'}, {x: 3, y: 7, label: 'A'}, {x: 1, y: 9, label: 'A'},
    {x: 7, y: 2, label: 'B'}, {x: 8, y: 3, label: 'B'}, {x: 9, y: 1, label: 'B'}
  ]);
  const [testPoint, setTestPoint] = useState({x: 5, y: 5});
  const [sequence] = useState([1, 1, 2, 3, 5, 8, 13]);
  const [sequenceInput, setSequenceInput] = useState('');
  const [visualGrid, setVisualGrid] = useState<Array<Array<boolean>>>(
    Array(8).fill(null).map(() => Array(8).fill(false))
  );
  const [selectedShape, setSelectedShape] = useState<'circle' | 'square' | 'triangle'>('circle');

  const shapes = {
    circle: [[false,true,true,false],[true,false,false,true],[true,false,false,true],[false,true,true,false]],
    square: [[true,true,true,true],[true,false,false,true],[true,false,false,true],[true,true,true,true]],
    triangle: [[false,true,false,false],[true,false,true,false],[true,true,true,true],[false,false,false,false]]
  };

  const predictClassification = (point: {x: number, y: number}) => {
    const distances = trainingData.map(p => ({
      distance: Math.sqrt(Math.pow(p.x - point.x, 2) + Math.pow(p.y - point.y, 2)),
      label: p.label
    }));
    distances.sort((a, b) => a.distance - b.distance);
    return distances[0].label;
  };

  const predictNextInSequence = () => {
    if (sequence.length < 2) return '?';
    const last = sequence[sequence.length - 1];
    const secondLast = sequence[sequence.length - 2];
    return (last + secondLast).toString();
  };

  const matchesShape = (grid: boolean[][], shape: boolean[][]) => {
    for (let i = 0; i <= grid.length - shape.length; i++) {
      for (let j = 0; j <= grid[0].length - shape[0].length; j++) {
        let matches = true;
        for (let si = 0; si < shape.length && matches; si++) {
          for (let sj = 0; sj < shape[0].length && matches; sj++) {
            if (grid[i + si][j + sj] !== shape[si][sj]) {
              matches = false;
            }
          }
        }
        if (matches) return true;
      }
    }
    return false;
  };

  const toggleGridCell = (i: number, j: number) => {
    setVisualGrid(prev => prev.map((row, ri) => 
      ri === i ? row.map((cell, ci) => ci === j ? !cell : cell) : row
    ));
  };

  const resetGrid = () => {
    setVisualGrid(Array(8).fill(null).map(() => Array(8).fill(false)));
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Pattern Recognition</h3>
        <p className="text-slate-600 max-w-2xl">
          Discover how AI identifies regularities and structures in different types of data through interactive examples
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setSelectedPattern('visual')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedPattern === 'visual' 
              ? 'bg-blue-500 text-white' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Visual Patterns
        </button>
        <button
          onClick={() => setSelectedPattern('sequence')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedPattern === 'sequence' 
              ? 'bg-blue-500 text-white' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Sequence Patterns
        </button>
        <button
          onClick={() => setSelectedPattern('classification')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedPattern === 'classification' 
              ? 'bg-blue-500 text-white' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Data Classification
        </button>
      </div>

      {selectedPattern === 'visual' && (
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-slate-800 mb-2">Visual Pattern Detection</h4>
            <p className="text-slate-600">Click cells to draw patterns. AI detects known shapes.</p>
          </div>
          
          <div className="flex gap-4 mb-4">
            {(['circle', 'square', 'triangle'] as const).map(shape => (
              <button
                key={shape}
                onClick={() => setSelectedShape(shape)}
                className={`px-3 py-1 rounded ${
                  selectedShape === shape 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {shape}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-8 gap-1 p-4 bg-white rounded-lg border">
            {visualGrid.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  onClick={() => toggleGridCell(i, j)}
                  className={`w-6 h-6 border border-slate-300 cursor-pointer transition-colors ${
                    cell ? 'bg-blue-500' : 'bg-white hover:bg-slate-100'
                  }`}
                />
              ))
            )}
          </div>

          <div className="flex gap-4 items-center">
            <button
              onClick={resetGrid}
              className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
            >
              Reset Grid
            </button>
            <div className={`px-4 py-2 rounded-lg font-medium ${
              matchesShape(visualGrid, shapes[selectedShape])
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}>
              {matchesShape(visualGrid, shapes[selectedShape]) 
                ? `✓ ${selectedShape} detected!` 
                : `No ${selectedShape} found`
              }
            </div>
          </div>
        </div>
      )}

      {selectedPattern === 'sequence' && (
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-slate-800 mb-2">Sequence Pattern Recognition</h4>
            <p className="text-slate-600">Identify the pattern in the Fibonacci sequence</p>
          </div>

          <div className="flex items-center gap-4 p-6 bg-white rounded-lg border">
            <div className="text-xl font-mono">
              {sequence.map((num, i) => (
                <span key={i} className="mx-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {num}
                </span>
              ))}
              <span className="mx-2 text-2xl text-slate-400">→</span>
              <span className="mx-2 px-2 py-1 bg-amber-100 text-amber-800 rounded font-bold">
                {predictNextInSequence()}
              </span>
            </div>
          </div>

          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className="text-indigo-800 font-medium">Pattern Detected: Fibonacci Sequence</div>
            <div className="text-indigo-600 text-sm mt-1">Each number = sum of previous two numbers</div>
            <div className="text-indigo-600 text-sm">Rule: F(n) = F(n-1) + F(n-2)</div>
          </div>
        </div>
      )}

      {selectedPattern === 'classification' && (
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-slate-800 mb-2">Data Classification</h4>
            <p className="text-slate-600">Move the test point to see k-nearest neighbor classification</p>
          </div>

          <div className="relative w-80 h-80 bg-white border border-slate-300 rounded-lg">
            <svg width="320" height="320" className="absolute inset-0">
              {/* Grid lines */}
              {[...Array(11)].map((_, i) => (
                <g key={i}>
                  <line 
                    x1={i * 32} y1={0} x2={i * 32} y2={320} 
                    stroke="#e2e8f0" strokeWidth={1}
                  />
                  <line 
                    x1={0} y1={i * 32} x2={320} y2={i * 32} 
                    stroke="#e2e8f0" strokeWidth={1}
                  />
                </g>
              ))}
              
              {/* Training data points */}
              {trainingData.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x * 32}
                  cy={(10 - point.y) * 32}
                  r={8}
                  fill={point.label === 'A' ? '#3b82f6' : '#ef4444'}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}

              {/* Test point */}
              <circle
                cx={testPoint.x * 32}
                cy={(10 - testPoint.y) * 32}
                r={12}
                fill={predictClassification(testPoint) === 'A' ? '#93c5fd' : '#fca5a5'}
                stroke={predictClassification(testPoint) === 'A' ? '#1d4ed8' : '#dc2626'}
                strokeWidth={3}
                className="cursor-pointer"
                onMouseDown={(e) => {
                  const rect = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
                  const handleMouseMove = (e: MouseEvent) => {
                    const x = Math.round((e.clientX - rect.left) / 32);
                    const y = Math.round(10 - (e.clientY - rect.top) / 32);
                    setTestPoint({x: Math.max(0, Math.min(10, x)), y: Math.max(0, Math.min(10, y))});
                  };
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />
            </svg>
          </div>

          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-slate-700">Class A</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-slate-700">Class B</span>
            </div>
            <div className={`px-3 py-1 rounded-lg font-medium ${
              predictClassification(testPoint) === 'A' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              Predicted: Class {predictClassification(testPoint)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
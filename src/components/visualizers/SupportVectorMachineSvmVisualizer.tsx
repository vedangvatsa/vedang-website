"use client";

import React, { useState, useEffect } from 'react';

export function SupportVectorMachineSvmVisualizer() {
  const [points, setPoints] = useState<{x: number, y: number, class: 'A' | 'B'}[]>([]);
  const [C, setC] = useState(1);
  const [kernelType, setKernelType] = useState<'linear' | 'rbf'>('linear');
  const [gamma, setGamma] = useState(0.5);
  const [hyperplane, setHyperplane] = useState<{w1: number, w2: number, b: number} | null>(null);
  const [supportVectors, setSupportVectors] = useState<number[]>([]);
  const [margin, setMargin] = useState<number>(0);
  const [showDecisionBoundary, setShowDecisionBoundary] = useState(false);

  const svgWidth = 400;
  const svgHeight = 300;
  const scale = 20;
  const offsetX = svgWidth / 2;
  const offsetY = svgHeight / 2;

  useEffect(() => {
    // Initialize with some example points
    setPoints([
      {x: -4, y: -2, class: 'A'},
      {x: -3, y: -3, class: 'A'},
      {x: -2, y: -1, class: 'A'},
      {x: 2, y: 1, class: 'B'},
      {x: 3, y: 2, class: 'B'},
      {x: 4, y: 3, class: 'B'},
    ]);
  }, []);

  const addPoint = (event: React.MouseEvent<SVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left - offsetX) / scale);
    const y = (-(event.clientY - rect.top - offsetY) / scale);
    
    const newClass = event.shiftKey ? 'B' : 'A';
    setPoints([...points, {x, y, class: newClass}]);
  };

  const calculateSVM = () => {
    if (points.length < 2) return;

    const classA = points.filter(p => p.class === 'A');
    const classB = points.filter(p => p.class === 'B');

    if (classA.length === 0 || classB.length === 0) return;

    if (kernelType === 'linear') {
      // Simplified linear SVM calculation
      const avgA = {
        x: classA.reduce((sum, p) => sum + p.x, 0) / classA.length,
        y: classA.reduce((sum, p) => sum + p.y, 0) / classA.length
      };
      const avgB = {
        x: classB.reduce((sum, p) => sum + p.x, 0) / classB.length,
        y: classB.reduce((sum, p) => sum + p.y, 0) / classB.length
      };

      // Normal vector to the hyperplane
      const w1 = avgB.x - avgA.x;
      const w2 = avgB.y - avgA.y;
      const norm = Math.sqrt(w1 * w1 + w2 * w2);
      const normalizedW1 = w1 / norm;
      const normalizedW2 = w2 / norm;

      // Bias term
      const b = -(normalizedW1 * (avgA.x + avgB.x) / 2 + normalizedW2 * (avgA.y + avgB.y) / 2);

      setHyperplane({w1: normalizedW1, w2: normalizedW2, b});

      // Find support vectors (simplified - closest points to hyperplane)
      const distances = points.map((point, index) => ({
        index,
        distance: Math.abs(normalizedW1 * point.x + normalizedW2 * point.y + b)
      }));
      
      distances.sort((a, b) => a.distance - b.distance);
      const supportVectorIndices = distances.slice(0, Math.min(4, distances.length)).map(d => d.index);
      setSupportVectors(supportVectorIndices);

      // Calculate margin
      const minDistance = Math.min(...distances.map(d => d.distance));
      setMargin(minDistance * 2);
    }
  };

  useEffect(() => {
    calculateSVM();
  }, [points, C, kernelType, gamma]);

  const clearPoints = () => {
    setPoints([]);
    setHyperplane(null);
    setSupportVectors([]);
    setMargin(0);
  };

  const renderDecisionBoundary = () => {
    if (!hyperplane || !showDecisionBoundary) return null;

    const gridSize = 1;
    const elements = [];

    for (let x = -10; x <= 10; x += gridSize) {
      for (let y = -8; y <= 8; y += gridSize) {
        const decision = hyperplane.w1 * x + hyperplane.w2 * y + hyperplane.b;
        const color = decision > 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(244, 63, 94, 0.1)';
        
        elements.push(
          <rect
            key={`${x}-${y}`}
            x={offsetX + x * scale - scale/2}
            y={offsetY - y * scale - scale/2}
            width={scale}
            height={scale}
            fill={color}
          />
        );
      }
    }

    return elements;
  };

  const renderHyperplane = () => {
    if (!hyperplane) return null;

    const x1 = -10;
    const x2 = 10;
    const y1 = -(hyperplane.w1 * x1 + hyperplane.b) / hyperplane.w2;
    const y2 = -(hyperplane.w1 * x2 + hyperplane.b) / hyperplane.w2;

    return (
      <>
        <line
          x1={offsetX + x1 * scale}
          y1={offsetY - y1 * scale}
          x2={offsetX + x2 * scale}
          y2={offsetY - y2 * scale}
          stroke="#1e40af"
          strokeWidth="3"
        />
        {margin > 0 && (
          <>
            <line
              x1={offsetX + x1 * scale}
              y1={offsetY - (y1 + margin / 2) * scale}
              x2={offsetX + x2 * scale}
              y2={offsetY - (y2 + margin / 2) * scale}
              stroke="#1e40af"
              strokeWidth="1"
              strokeDasharray="5,5"
              opacity="0.6"
            />
            <line
              x1={offsetX + x1 * scale}
              y1={offsetY - (y1 - margin / 2) * scale}
              x2={offsetX + x2 * scale}
              y2={offsetY - (y2 - margin / 2) * scale}
              stroke="#1e40af"
              strokeWidth="1"
              strokeDasharray="5,5"
              opacity="0.6"
            />
          </>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Support Vector Machine (SVM)</h3>
        <p className="text-slate-600">Interactive visualization of SVM classification with hyperplane and support vectors</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        <div className="flex flex-col gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-3">Controls</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Regularization (C): {C}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={C}
                  onChange={(e) => setC(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kernel Type</label>
                <select
                  value={kernelType}
                  onChange={(e) => setKernelType(e.target.value as 'linear' | 'rbf')}
                  className="w-full p-2 border border-slate-300 rounded-md"
                >
                  <option value="linear">Linear</option>
                  <option value="rbf">RBF</option>
                </select>
              </div>

              {kernelType === 'rbf' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Gamma: {gamma}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={gamma}
                    onChange={(e) => setGamma(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showDecisionBoundary}
                    onChange={(e) => setShowDecisionBoundary(e.target.checked)}
                    className="mr-2"
                  />
                  Show Decision Boundary
                </label>
              </div>

              <button
                onClick={clearPoints}
                className="w-full px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors"
              >
                Clear All Points
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-3">Instructions</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Click to add Class A points (red)</li>
              <li>• Shift+Click to add Class B points (blue)</li>
              <li>• Adjust parameters to see changes</li>
              <li>• Support vectors are highlighted</li>
              <li>• Margin: {margin.toFixed(2)}</li>
            </ul>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <svg
              width={svgWidth}
              height={svgHeight}
              className="border border-slate-300 cursor-crosshair"
              onClick={addPoint}
            >
              {/* Grid */}
              <defs>
                <pattern id="grid" width={scale} height={scale} patternUnits="userSpaceOnUse">
                  <path d={`M ${scale} 0 L 0 0 0 ${scale}`} fill="none" stroke="#e2e8f0" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Axes */}
              <line x1={0} y1={offsetY} x2={svgWidth} y2={offsetY} stroke="#64748b" strokeWidth="2"/>
              <line x1={offsetX} y1={0} x2={offsetX} y2={svgHeight} stroke="#64748b" strokeWidth="2"/>

              {/* Decision boundary */}
              {renderDecisionBoundary()}

              {/* Hyperplane and margins */}
              {renderHyperplane()}

              {/* Data points */}
              {points.map((point, index) => (
                <g key={index}>
                  <circle
                    cx={offsetX + point.x * scale}
                    cy={offsetY - point.y * scale}
                    r={supportVectors.includes(index) ? 8 : 5}
                    fill={point.class === 'A' ? '#f43f5e' : '#3b82f6'}
                    stroke={supportVectors.includes(index) ? '#1e40af' : 'none'}
                    strokeWidth={supportVectors.includes(index) ? 3 : 0}
                  />
                  {supportVectors.includes(index) && (
                    <circle
                      cx={offsetX + point.x * scale}
                      cy={offsetY - point.y * scale}
                      r={12}
                      fill="none"
                      stroke="#1e40af"
                      strokeWidth="2"
                      strokeDasharray="3,3"
                    />
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 w-full max-w-4xl">
        <h4 className="font-semibold text-slate-800 mb-3">SVM Concepts</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded-md">
            <div className="font-medium text-blue-800">Hyperplane</div>
            <div className="text-blue-700">The decision boundary that separates classes with maximum margin</div>
          </div>
          <div className="bg-indigo-50 p-3 rounded-md">
            <div className="font-medium text-indigo-800">Support Vectors</div>
            <div className="text-indigo-700">Data points closest to the hyperplane that determine its position</div>
          </div>
          <div className="bg-emerald-50 p-3 rounded-md">
            <div className="font-medium text-emerald-800">Margin</div>
            <div className="text-emerald-700">Distance between hyperplane and nearest points from each class</div>
          </div>
        </div>
      </div>
    </div>
  );
}
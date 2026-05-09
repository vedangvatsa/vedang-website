"use client";

import React, { useState, useEffect } from 'react';

export function CnnVisualizer() {
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [filterPosition, setFilterPosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Sample input image (8x8 grid)
  const inputImage = [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 1, 1, 1],
    [1, 1, 1, 0, 0, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0]
  ];

  // Different filters
  const filters = [
    {
      name: "Edge Detection",
      kernel: [[-1, -1, -1], [0, 0, 0], [1, 1, 1]],
      color: "blue"
    },
    {
      name: "Blur",
      kernel: [[0.11, 0.11, 0.11], [0.11, 0.11, 0.11], [0.11, 0.11, 0.11]],
      color: "emerald"
    },
    {
      name: "Sharpen",
      kernel: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]],
      color: "rose"
    }
  ];

  const layers = [
    { name: "Input", size: "8×8", neurons: 64 },
    { name: "Conv1", size: "6×6", neurons: 36 },
    { name: "Pool1", size: "3×3", neurons: 9 },
    { name: "Conv2", size: "2×2", neurons: 4 },
    { name: "Dense", size: "1×10", neurons: 10 }
  ];

  // Calculate convolution at current filter position
  const calculateConvolution = (x: number, y: number, filterIndex: number) => {
    const filter = filters[filterIndex].kernel;
    let sum = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (y + i < 8 && x + j < 8) {
          sum += inputImage[y + i][x + j] * filter[i][j];
        }
      }
    }
    return Math.max(0, Math.min(1, sum)); // ReLU and normalize
  };

  // Generate feature map for current filter
  const generateFeatureMap = (filterIndex: number) => {
    const featureMap = [];
    for (let y = 0; y <= 5; y++) {
      const row = [];
      for (let x = 0; x <= 5; x++) {
        row.push(calculateConvolution(x, y, filterIndex));
      }
      featureMap.push(row);
    }
    return featureMap;
  };

  const startAnimation = () => {
    setIsAnimating(true);
    setCurrentStep(0);
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= 35) {
          setIsAnimating(false);
          clearInterval(interval);
          return 0;
        }
        const newX = (prev % 6);
        const newY = Math.floor(prev / 6);
        setFilterPosition({ x: newX, y: newY });
        return prev + 1;
      });
    }, 300);
  };

  const featureMap = generateFeatureMap(selectedLayer);
  const currentValue = filterPosition.y <= 5 && filterPosition.x <= 5 
    ? featureMap[filterPosition.y][filterPosition.x] 
    : 0;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Convolutional Neural Network</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how CNNs use sliding filters to detect patterns in images. Watch the convolution operation in action!
        </p>
      </div>

      {/* Filter Selection */}
      <div className="flex gap-4 mb-4">
        {filters.map((filter, index) => (
          <button
            key={index}
            onClick={() => setSelectedLayer(index)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedLayer === index
                ? `bg-${filter.color}-500 text-white`
                : `bg-${filter.color}-100 text-${filter.color}-700 hover:bg-${filter.color}-200`
            }`}
          >
            {filter.name}
          </button>
        ))}
      </div>

      <div className="flex gap-8 items-start">
        {/* Input Image */}
        <div className="flex flex-col items-center">
          <h4 className="text-lg font-semibold text-slate-700 mb-2">Input Image (8×8)</h4>
          <div className="grid grid-cols-8 gap-1 p-4 bg-white rounded-lg border">
            {inputImage.map((row, y) =>
              row.map((pixel, x) => (
                <div
                  key={`${y}-${x}`}
                  className={`w-6 h-6 border border-slate-200 transition-all ${
                    pixel ? 'bg-slate-800' : 'bg-slate-100'
                  } ${
                    filterPosition.x <= x && x < filterPosition.x + 3 &&
                    filterPosition.y <= y && y < filterPosition.y + 3
                      ? `ring-2 ring-${filters[selectedLayer].color}-500`
                      : ''
                  }`}
                />
              ))
            )}
          </div>
          
          {/* Filter Kernel Display */}
          <div className="mt-4 text-center">
            <h5 className="font-medium text-slate-600 mb-2">Filter Kernel</h5>
            <div className="grid grid-cols-3 gap-1 bg-white p-2 rounded border">
              {filters[selectedLayer].kernel.map((row, y) =>
                row.map((value, x) => (
                  <div
                    key={`${y}-${x}`}
                    className={`w-8 h-8 flex items-center justify-center text-xs font-mono bg-${filters[selectedLayer].color}-100 border`}
                  >
                    {value.toFixed(1)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center">
          <div className={`text-3xl text-${filters[selectedLayer].color}-500`}>→</div>
        </div>

        {/* Feature Map */}
        <div className="flex flex-col items-center">
          <h4 className="text-lg font-semibold text-slate-700 mb-2">Feature Map (6×6)</h4>
          <div className="grid grid-cols-6 gap-1 p-4 bg-white rounded-lg border">
            {featureMap.map((row, y) =>
              row.map((value, x) => (
                <div
                  key={`${y}-${x}`}
                  className={`w-6 h-6 border border-slate-200 transition-all cursor-pointer ${
                    filterPosition.x === x && filterPosition.y === y
                      ? `ring-2 ring-${filters[selectedLayer].color}-500`
                      : ''
                  }`}
                  style={{
                    backgroundColor: `rgba(59, 130, 246, ${value})`,
                  }}
                  onClick={() => setFilterPosition({ x, y })}
                />
              ))
            )}
          </div>
          
          {/* Current Calculation */}
          <div className="mt-4 text-center">
            <h5 className="font-medium text-slate-600 mb-1">Output Value</h5>
            <div className={`text-2xl font-bold text-${filters[selectedLayer].color}-600`}>
              {currentValue.toFixed(3)}
            </div>
            <div className="text-sm text-slate-500">
              Position: ({filterPosition.x}, {filterPosition.y})
            </div>
          </div>
        </div>
      </div>

      {/* Animation Controls */}
      <div className="flex gap-4 items-center">
        <button
          onClick={startAnimation}
          disabled={isAnimating}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isAnimating
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : `bg-${filters[selectedLayer].color}-500 hover:bg-${filters[selectedLayer].color}-600 text-white`
          }`}
        >
          {isAnimating ? 'Animating...' : 'Animate Convolution'}
        </button>
        
        <div className="text-sm text-slate-600">
          Click on feature map cells or use animation to see convolution in action
        </div>
      </div>

      {/* CNN Architecture Overview */}
      <div className="w-full max-w-4xl">
        <h4 className="text-lg font-semibold text-slate-700 mb-4 text-center">CNN Architecture Flow</h4>
        <div className="flex items-center justify-center gap-4 overflow-x-auto">
          {layers.map((layer, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center min-w-0">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold mb-2 ${
                  index === 0 ? 'bg-slate-600' :
                  index <= 2 ? 'bg-blue-500' :
                  index === 3 ? 'bg-emerald-500' : 'bg-rose-500'
                }`}>
                  {layer.size}
                </div>
                <div className="text-sm font-medium text-slate-700">{layer.name}</div>
                <div className="text-xs text-slate-500">{layer.neurons} units</div>
              </div>
              {index < layers.length - 1 && (
                <div className="text-slate-400 text-lg">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
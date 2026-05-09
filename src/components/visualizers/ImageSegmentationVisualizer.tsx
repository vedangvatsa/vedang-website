"use client";

import React, { useState } from 'react';

export function ImageSegmentationVisualizer() {
  const [segmentationType, setSegmentationType] = useState<'semantic' | 'instance' | 'panoptic'>('semantic');
  const [hoveredPixel, setHoveredPixel] = useState<{x: number, y: number} | null>(null);

  // Create a simplified 8x8 grid representing an image with different objects
  const imageData = [
    [0,0,0,1,1,1,0,0], // 0: sky, 1: building, 2: road, 3: car, 4: person, 5: tree
    [0,0,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,0],
    [5,5,2,2,3,3,2,2],
    [5,5,2,2,3,3,2,2],
    [2,2,2,4,2,2,2,2],
    [2,2,2,4,2,3,3,2],
    [2,2,2,2,2,3,3,2]
  ];

  // Instance IDs for each pixel (for instance and panoptic segmentation)
  const instanceData = [
    [0,0,0,1,1,1,0,0],
    [0,0,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,0],
    [1,1,0,0,1,1,0,0],
    [1,1,0,0,1,1,0,0],
    [0,0,0,1,0,0,2,2],
    [0,0,0,1,0,2,2,0],
    [0,0,0,0,0,2,2,0]
  ];

  const classNames = ['Sky', 'Building', 'Road', 'Car', 'Person', 'Tree'];
  const classColors = ['bg-blue-300', 'bg-slate-400', 'bg-slate-600', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-400'];
  
  const getPixelColor = (row: number, col: number) => {
    const classId = imageData[row][col];
    const instanceId = instanceData[row][col];
    
    switch (segmentationType) {
      case 'semantic':
        return classColors[classId];
      case 'instance':
        if (classId === 0 || classId === 2) return 'bg-slate-200'; // stuff classes get neutral color
        const instanceColors = ['bg-rose-200', 'bg-rose-400', 'bg-rose-600', 'bg-amber-300', 'bg-emerald-300'];
        return instanceColors[instanceId] || 'bg-slate-200';
      case 'panoptic':
        if (classId === 0 || classId === 2) return classColors[classId]; // stuff classes keep semantic color
        const panopticColors = ['bg-rose-200', 'bg-rose-400', 'bg-rose-600', 'bg-amber-300', 'bg-emerald-300'];
        return panopticColors[instanceId] || classColors[classId];
      default:
        return 'bg-slate-200';
    }
  };

  const getPixelInfo = (row: number, col: number) => {
    const classId = imageData[row][col];
    const instanceId = instanceData[row][col];
    const className = classNames[classId];
    
    switch (segmentationType) {
      case 'semantic':
        return `Class: ${className}`;
      case 'instance':
        if (classId === 0 || classId === 2) return `Stuff: ${className}`;
        return `${className} #${instanceId + 1}`;
      case 'panoptic':
        if (classId === 0 || classId === 2) return `Stuff: ${className}`;
        return `${className} #${instanceId + 1}`;
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Image Segmentation</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore different types of pixel-level image understanding. Hover over pixels to see their classifications.
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setSegmentationType('semantic')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            segmentationType === 'semantic'
              ? 'bg-blue-500 text-white'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          Semantic
        </button>
        <button
          onClick={() => setSegmentationType('instance')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            segmentationType === 'instance'
              ? 'bg-indigo-500 text-white'
              : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
          }`}
        >
          Instance
        </button>
        <button
          onClick={() => setSegmentationType('panoptic')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            segmentationType === 'panoptic'
              ? 'bg-rose-500 text-white'
              : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
          }`}
        >
          Panoptic
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex flex-col items-center gap-4">
          <h4 className="text-lg font-semibold text-slate-700">
            {segmentationType === 'semantic' && 'Semantic Segmentation'}
            {segmentationType === 'instance' && 'Instance Segmentation'}
            {segmentationType === 'panoptic' && 'Panoptic Segmentation'}
          </h4>
          
          <div className="grid grid-cols-8 gap-1 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            {imageData.map((row, rowIndex) =>
              row.map((_, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-8 h-8 border border-slate-300 cursor-pointer transition-all duration-200 ${getPixelColor(rowIndex, colIndex)} ${
                    hoveredPixel?.x === colIndex && hoveredPixel?.y === rowIndex
                      ? 'ring-2 ring-slate-800 scale-110'
                      : ''
                  }`}
                  onMouseEnter={() => setHoveredPixel({x: colIndex, y: rowIndex})}
                  onMouseLeave={() => setHoveredPixel(null)}
                />
              ))
            )}
          </div>

          {hoveredPixel && (
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 text-sm">
              <span className="font-medium text-slate-700">
                Pixel ({hoveredPixel.x}, {hoveredPixel.y}): {getPixelInfo(hoveredPixel.y, hoveredPixel.x)}
              </span>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 max-w-md">
          <h4 className="font-semibold text-slate-800 mb-3">
            {segmentationType === 'semantic' && 'Semantic Segmentation'}
            {segmentationType === 'instance' && 'Instance Segmentation'}
            {segmentationType === 'panoptic' && 'Panoptic Segmentation'}
          </h4>
          
          {segmentationType === 'semantic' && (
            <p className="text-sm text-slate-600 mb-4">
              Each pixel gets a class label. All pixels of the same class share the same color, regardless of which object they belong to.
            </p>
          )}
          
          {segmentationType === 'instance' && (
            <p className="text-sm text-slate-600 mb-4">
              Individual objects are distinguished with separate masks. "Stuff" classes (sky, road) are treated as background.
            </p>
          )}
          
          {segmentationType === 'panoptic' && (
            <p className="text-sm text-slate-600 mb-4">
              Combines semantic and instance: stuff classes get semantic labels, while individual objects get unique instance IDs.
            </p>
          )}

          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-700 mb-2">Legend:</div>
            {segmentationType === 'semantic' && classNames.map((name, index) => (
              <div key={name} className="flex items-center gap-2 text-xs">
                <div className={`w-3 h-3 ${classColors[index]} border border-slate-300`} />
                <span className="text-slate-600">{name}</span>
              </div>
            ))}
            
            {segmentationType === 'instance' && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-slate-200 border border-slate-300" />
                  <span className="text-slate-600">Stuff classes</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-rose-400 border border-slate-300" />
                  <span className="text-slate-600">Car #1</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-rose-600 border border-slate-300" />
                  <span className="text-slate-600">Car #2</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-amber-300 border border-slate-300" />
                  <span className="text-slate-600">Person #1</span>
                </div>
              </div>
            )}
            
            {segmentationType === 'panoptic' && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-blue-300 border border-slate-300" />
                  <span className="text-slate-600">Sky</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-slate-600 border border-slate-300" />
                  <span className="text-slate-600">Road</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-rose-400 border border-slate-300" />
                  <span className="text-slate-600">Car #1</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-rose-600 border border-slate-300" />
                  <span className="text-slate-600">Car #2</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
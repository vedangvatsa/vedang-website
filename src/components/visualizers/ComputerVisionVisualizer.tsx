"use client";

import React, { useState } from 'react';

export function ComputerVisionVisualizer() {
  const [selectedTask, setSelectedTask] = useState('classification');
  const [hoveredPixel, setHoveredPixel] = useState<{x: number, y: number} | null>(null);
  const [detectionBoxes, setDetectionBoxes] = useState([
    {id: 1, x: 2, y: 1, w: 3, h: 2, label: 'Car', confidence: 0.95},
    {id: 2, x: 6, y: 2, w: 2, h: 2, label: 'Person', confidence: 0.87}
  ]);
  
  const gridSize = 8;
  const pixelClasses = [
    ['sky', 'sky', 'sky', 'sky', 'sky', 'sky', 'sky', 'sky'],
    ['sky', 'sky', 'building', 'building', 'building', 'sky', 'sky', 'sky'],
    ['road', 'road', 'car', 'car', 'car', 'road', 'person', 'person'],
    ['road', 'road', 'car', 'car', 'car', 'road', 'person', 'person'],
    ['road', 'road', 'road', 'road', 'road', 'road', 'road', 'road'],
    ['grass', 'grass', 'grass', 'tree', 'tree', 'grass', 'grass', 'grass'],
    ['grass', 'grass', 'tree', 'tree', 'tree', 'tree', 'grass', 'grass'],
    ['grass', 'grass', 'grass', 'tree', 'tree', 'grass', 'grass', 'grass']
  ];

  const classColors: {[key: string]: string} = {
    sky: 'bg-blue-300',
    building: 'bg-slate-400',
    road: 'bg-slate-600',
    car: 'bg-rose-500',
    person: 'bg-amber-400',
    grass: 'bg-emerald-300',
    tree: 'bg-emerald-600'
  };

  const getPixelInfo = (x: number, y: number) => {
    const className = pixelClasses[y]?.[x] || 'unknown';
    return {
      className,
      color: classColors[className] || 'bg-slate-200',
      coordinates: `(${x}, ${y})`
    };
  };

  const renderClassification = () => (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-emerald-600">Street Scene</div>
        <div className="text-sm text-slate-600">Confidence: 94.2%</div>
      </div>
      <div className="grid grid-cols-8 gap-1 p-4 bg-white rounded-lg border">
        {Array.from({length: 64}).map((_, i) => {
          const x = i % gridSize;
          const y = Math.floor(i / gridSize);
          const pixelInfo = getPixelInfo(x, y);
          return (
            <div
              key={i}
              className={`w-6 h-6 ${pixelInfo.color} border border-slate-300`}
            />
          );
        })}
      </div>
    </div>
  );

  const renderDetection = () => (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="grid grid-cols-8 gap-1 p-4 bg-white rounded-lg border">
          {Array.from({length: 64}).map((_, i) => {
            const x = i % gridSize;
            const y = Math.floor(i / gridSize);
            const pixelInfo = getPixelInfo(x, y);
            return (
              <div
                key={i}
                className={`w-6 h-6 ${pixelInfo.color} border border-slate-300`}
              />
            );
          })}
        </div>
        {detectionBoxes.map(box => (
          <div
            key={box.id}
            className="absolute border-2 border-indigo-500 bg-indigo-500 bg-opacity-20"
            style={{
              left: `${16 + box.x * 28}px`,
              top: `${16 + box.y * 28}px`,
              width: `${box.w * 28 - 4}px`,
              height: `${box.h * 28 - 4}px`
            }}
          >
            <div className="absolute -top-6 left-0 bg-indigo-500 text-white text-xs px-2 py-1 rounded">
              {box.label} {(box.confidence * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <div className="text-sm text-slate-600">Detected: {detectionBoxes.length} objects</div>
      </div>
    </div>
  );

  const renderSegmentation = () => (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-8 gap-1 p-4 bg-white rounded-lg border">
        {Array.from({length: 64}).map((_, i) => {
          const x = i % gridSize;
          const y = Math.floor(i / gridSize);
          const pixelInfo = getPixelInfo(x, y);
          const isHovered = hoveredPixel?.x === x && hoveredPixel?.y === y;
          return (
            <div
              key={i}
              className={`w-6 h-6 ${pixelInfo.color} border-2 cursor-pointer transition-all ${
                isHovered ? 'border-slate-800 scale-110 z-10' : 'border-slate-300'
              }`}
              onMouseEnter={() => setHoveredPixel({x, y})}
              onMouseLeave={() => setHoveredPixel(null)}
            />
          );
        })}
      </div>
      {hoveredPixel && (
        <div className="bg-white p-3 rounded-lg border shadow-sm">
          <div className="text-sm font-medium">Pixel {getPixelInfo(hoveredPixel.x, hoveredPixel.y).coordinates}</div>
          <div className="text-sm text-slate-600">
            Class: <span className="font-medium">{getPixelInfo(hoveredPixel.x, hoveredPixel.y).className}</span>
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(classColors).map(([className, color]) => (
          <div key={className} className="flex items-center gap-1">
            <div className={`w-3 h-3 ${color} border border-slate-300`}></div>
            <span className="text-xs text-slate-600 capitalize">{className}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Computer Vision Tasks</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how machines interpret visual data through different levels of understanding: 
          from classifying entire scenes to analyzing individual pixels.
        </p>
      </div>

      <div className="flex gap-2 bg-white p-1 rounded-lg border">
        {[
          {id: 'classification', label: 'Classification'},
          {id: 'detection', label: 'Object Detection'},
          {id: 'segmentation', label: 'Segmentation'}
        ].map(task => (
          <button
            key={task.id}
            onClick={() => setSelectedTask(task.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedTask === task.id
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {task.label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md">
        {selectedTask === 'classification' && renderClassification()}
        {selectedTask === 'detection' && renderDetection()}
        {selectedTask === 'segmentation' && renderSegmentation()}
      </div>

      <div className="text-center max-w-lg">
        <div className="text-sm text-slate-600">
          {selectedTask === 'classification' && 'Image Classification assigns a single label to the entire image based on its dominant content.'}
          {selectedTask === 'detection' && 'Object Detection locates and identifies multiple objects within the image using bounding boxes.'}
          {selectedTask === 'segmentation' && 'Semantic Segmentation classifies every pixel in the image. Hover over pixels to explore their labels.'}
        </div>
      </div>
    </div>
  );
}
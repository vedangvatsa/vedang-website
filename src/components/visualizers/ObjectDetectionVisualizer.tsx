"use client";

import { useState } from 'react';

export function ObjectDetectionVisualizer() {
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [selectedDetector, setSelectedDetector] = useState('faster-rcnn');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hoveredBox, setHoveredBox] = useState<number | null>(null);

  // Mock detected objects with different confidence scores
  const detections = [
    { id: 1, label: 'Car', x: 20, y: 30, width: 80, height: 40, confidence: 0.92, color: 'blue' },
    { id: 2, label: 'Person', x: 120, y: 60, width: 30, height: 60, confidence: 0.85, color: 'emerald' },
    { id: 3, label: 'Dog', x: 200, y: 80, width: 40, height: 35, confidence: 0.73, color: 'rose' },
    { id: 4, label: 'Bike', x: 160, y: 40, width: 45, height: 35, confidence: 0.41, color: 'amber' },
    { id: 5, label: 'Tree', x: 280, y: 20, width: 35, height: 90, confidence: 0.67, color: 'indigo' },
    { id: 6, label: 'Bird', x: 250, y: 25, width: 20, height: 15, confidence: 0.38, color: 'slate' }
  ];

  const filteredDetections = detections.filter(d => d.confidence >= confidenceThreshold);

  const detectorTypes = {
    'faster-rcnn': { name: 'Faster R-CNN', speed: 'Slow', accuracy: 'High' },
    'yolo': { name: 'YOLO', speed: 'Fast', accuracy: 'Medium' },
    'ssd': { name: 'SSD', speed: 'Medium', accuracy: 'Medium' }
  };

  const processImage = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 1500);
  };

  const getBoxColor = (detection: typeof detections[0]) => {
    const colors = {
      blue: 'border-blue-500 bg-blue-100',
      emerald: 'border-emerald-500 bg-emerald-100',
      rose: 'border-rose-500 bg-rose-100',
      amber: 'border-amber-500 bg-amber-100',
      indigo: 'border-indigo-500 bg-indigo-100',
      slate: 'border-slate-500 bg-slate-100'
    };
    return colors[detection.color as keyof typeof colors];
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Object Detection</h3>
        <p className="text-lg text-slate-600">Interactive visualization showing how AI identifies and localizes multiple objects with bounding boxes and confidence scores</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-4xl">
        <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-700">Detection Settings</h4>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600">Confidence Threshold: {confidenceThreshold.toFixed(2)}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600">Detector Type</label>
            <select
              value={selectedDetector}
              onChange={(e) => setSelectedDetector(e.target.value)}
              className="p-2 border border-slate-300 rounded-lg text-sm"
            >
              {Object.entries(detectorTypes).map(([key, value]) => (
                <option key={key} value={key}>{value.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={processImage}
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isProcessing ? 'Processing...' : 'Run Detection'}
          </button>
        </div>

        {/* Image Canvas */}
        <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200">
          <div className="relative w-full h-64 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-lg overflow-hidden border border-slate-300">
            {isProcessing && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {/* Bounding Boxes */}
            {!isProcessing && filteredDetections.map((detection) => (
              <div
                key={detection.id}
                className={`absolute border-2 cursor-pointer transition-all duration-200 ${getBoxColor(detection)} ${
                  hoveredBox === detection.id ? 'scale-105 shadow-lg' : 'bg-opacity-20'
                }`}
                style={{
                  left: `${detection.x}px`,
                  top: `${detection.y}px`,
                  width: `${detection.width}px`,
                  height: `${detection.height}px`
                }}
                onMouseEnter={() => setHoveredBox(detection.id)}
                onMouseLeave={() => setHoveredBox(null)}
              >
                <div className="absolute -top-6 left-0 bg-white px-2 py-1 text-xs rounded shadow-sm border">
                  {detection.label} ({(detection.confidence * 100).toFixed(0)}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detection Results */}
      <div className="w-full max-w-4xl">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-3">
            Detection Results ({filteredDetections.length} objects found)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredDetections.map((detection) => (
              <div
                key={detection.id}
                className={`p-3 rounded-lg border-l-4 transition-all duration-200 cursor-pointer ${
                  hoveredBox === detection.id ? 'bg-slate-100 scale-105' : 'bg-slate-50'
                }`}
                style={{ borderLeftColor: `var(--${detection.color}-500)` }}
                onMouseEnter={() => setHoveredBox(detection.id)}
                onMouseLeave={() => setHoveredBox(null)}
              >
                <div className="font-medium text-slate-800">{detection.label}</div>
                <div className="text-sm text-slate-600">
                  Confidence: {(detection.confidence * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-slate-500">
                  Box: [{detection.x}, {detection.y}, {detection.width}, {detection.height}]
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Info */}
      <div className="w-full max-w-4xl bg-white p-4 rounded-xl border border-slate-200">
        <h4 className="font-semibold text-slate-700 mb-3">Model Characteristics</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-medium text-slate-800">{detectorTypes[selectedDetector as keyof typeof detectorTypes].name}</div>
            <div className="text-sm text-slate-600">Selected Model</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-slate-800">{detectorTypes[selectedDetector as keyof typeof detectorTypes].speed}</div>
            <div className="text-sm text-slate-600">Processing Speed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-slate-800">{detectorTypes[selectedDetector as keyof typeof detectorTypes].accuracy}</div>
            <div className="text-sm text-slate-600">Accuracy Level</div>
          </div>
        </div>
      </div>
    </div>
  );
}
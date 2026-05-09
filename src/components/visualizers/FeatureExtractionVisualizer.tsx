"use client";

import { useState } from 'react';

export function FeatureExtractionVisualizer() {
  const [selectedPixel, setSelectedPixel] = useState<{x: number, y: number} | null>(null);
  const [extractionStep, setExtractionStep] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  // Generate a simple 8x8 "image" with different patterns
  const generateImageData = () => {
    const data = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        // Create patterns: diagonal lines, corners, etc.
        let value = 0;
        if (x === y || x === 7 - y) value = 255; // Diagonals
        if (x < 2 && y < 2) value = 180; // Top-left corner
        if (x > 5 && y > 5) value = 120; // Bottom-right corner
        data.push(value);
      }
    }
    return data;
  };

  const imageData = generateImageData();

  // Feature extraction functions
  const extractFeatures = () => {
    const totalPixels = imageData.length;
    const brightness = Math.round(imageData.reduce((sum, val) => sum + val, 0) / totalPixels);
    
    // Edge detection (simplified)
    let edgeCount = 0;
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const current = imageData[i * 8 + j];
        const right = imageData[i * 8 + (j + 1)];
        const bottom = imageData[(i + 1) * 8 + j];
        if (Math.abs(current - right) > 50 || Math.abs(current - bottom) > 50) {
          edgeCount++;
        }
      }
    }

    // Corner detection
    const corners = [
      imageData[0], imageData[7], imageData[56], imageData[63]
    ];
    const cornerBrightness = Math.round(corners.reduce((sum, val) => sum + val, 0) / 4);

    // Symmetry score
    let symmetryScore = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 4; j++) {
        const left = imageData[i * 8 + j];
        const right = imageData[i * 8 + (7 - j)];
        symmetryScore += Math.abs(left - right);
      }
    }
    symmetryScore = Math.round(100 - (symmetryScore / 64));

    return {
      brightness,
      edgeCount,
      cornerBrightness,
      symmetryScore: Math.max(0, symmetryScore)
    };
  };

  const features = extractFeatures();

  const steps = [
    "Raw Image Data",
    "Brightness Analysis", 
    "Edge Detection",
    "Corner Analysis",
    "Symmetry Calculation",
    "Feature Vector"
  ];

  const getPixelColor = (value: number) => {
    const intensity = Math.round((value / 255) * 255);
    return `rgb(${intensity}, ${intensity}, ${intensity})`;
  };

  const getFeatureHighlight = (step: number, x: number, y: number) => {
    if (step === 1) return true; // All pixels for brightness
    if (step === 2) {
      // Highlight edge pixels
      const i = y, j = x;
      if (i < 7 && j < 7) {
        const current = imageData[i * 8 + j];
        const right = imageData[i * 8 + (j + 1)];
        const bottom = imageData[(i + 1) * 8 + j];
        return Math.abs(current - right) > 50 || Math.abs(current - bottom) > 50;
      }
    }
    if (step === 3) {
      // Highlight corners
      return (x === 0 && y === 0) || (x === 7 && y === 0) || (x === 0 && y === 7) || (x === 7 && y === 7);
    }
    if (step === 4) {
      // Highlight symmetry pairs
      return hoveredFeature === 'symmetry';
    }
    return false;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Feature Extraction Visualizer</h3>
        <p className="text-slate-600 max-w-2xl">
          Transform raw image pixels into meaningful features that AI models can understand. 
          Step through the extraction process to see how 64 pixels become 4 key features.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Image Visualization */}
        <div className="flex flex-col items-center gap-4">
          <h4 className="text-lg font-semibold text-slate-700">Raw Image (8×8 pixels)</h4>
          <div className="grid grid-cols-8 gap-1 p-4 bg-white rounded-lg border border-slate-300">
            {imageData.map((value, index) => {
              const x = index % 8;
              const y = Math.floor(index / 8);
              const isHighlighted = getFeatureHighlight(extractionStep, x, y);
              const isSelected = selectedPixel?.x === x && selectedPixel?.y === y;
              
              return (
                <div
                  key={index}
                  className={`w-8 h-8 cursor-pointer border transition-all duration-200 ${
                    isHighlighted ? 'border-2 border-blue-500 shadow-lg' : 'border-slate-200'
                  } ${isSelected ? 'ring-2 ring-rose-400' : ''}`}
                  style={{ backgroundColor: getPixelColor(value) }}
                  onClick={() => setSelectedPixel({x, y})}
                  title={`Pixel (${x},${y}): ${value}`}
                />
              );
            })}
          </div>
          
          {selectedPixel && (
            <div className="text-sm text-slate-600 bg-white px-3 py-1 rounded border">
              Pixel ({selectedPixel.x},{selectedPixel.y}): {imageData[selectedPixel.y * 8 + selectedPixel.x]}
            </div>
          )}
        </div>

        {/* Extraction Steps */}
        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-semibold text-slate-700">Extraction Process</h4>
          <div className="flex flex-wrap gap-2">
            {steps.map((step, index) => (
              <button
                key={index}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  extractionStep === index 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
                onClick={() => setExtractionStep(index)}
              >
                {index + 1}. {step}
              </button>
            ))}
          </div>

          {/* Step Descriptions */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 max-w-md">
            {extractionStep === 0 && (
              <div>
                <h5 className="font-semibold text-slate-800">Raw Image Data</h5>
                <p className="text-sm text-slate-600 mt-1">
                  64 individual pixel values (0-255). Click pixels to inspect values.
                </p>
              </div>
            )}
            {extractionStep === 1 && (
              <div>
                <h5 className="font-semibold text-slate-800">Average Brightness</h5>
                <p className="text-sm text-slate-600 mt-1">
                  Calculate mean pixel intensity: <span className="font-mono bg-slate-100 px-1">{features.brightness}/255</span>
                </p>
              </div>
            )}
            {extractionStep === 2 && (
              <div>
                <h5 className="font-semibold text-slate-800">Edge Detection</h5>
                <p className="text-sm text-slate-600 mt-1">
                  Find rapid intensity changes. Detected <span className="font-mono bg-slate-100 px-1">{features.edgeCount}</span> edges.
                </p>
              </div>
            )}
            {extractionStep === 3 && (
              <div>
                <h5 className="font-semibold text-slate-800">Corner Analysis</h5>
                <p className="text-sm text-slate-600 mt-1">
                  Average corner brightness: <span className="font-mono bg-slate-100 px-1">{features.cornerBrightness}</span>
                </p>
              </div>
            )}
            {extractionStep === 4 && (
              <div>
                <h5 className="font-semibold text-slate-800">Symmetry Score</h5>
                <p className="text-sm text-slate-600 mt-1">
                  Measure left-right symmetry: <span className="font-mono bg-slate-100 px-1">{features.symmetryScore}%</span>
                </p>
              </div>
            )}
            {extractionStep === 5 && (
              <div>
                <h5 className="font-semibold text-slate-800">Final Feature Vector</h5>
                <p className="text-sm text-slate-600 mt-1">
                  64 pixels → 4 meaningful features for AI models
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Feature Vector Output */}
        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-semibold text-slate-700">Extracted Features</h4>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="space-y-3">
              <div 
                className={`p-3 rounded cursor-pointer transition-colors ${
                  hoveredFeature === 'brightness' ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                }`}
                onMouseEnter={() => setHoveredFeature('brightness')}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="font-medium text-slate-800">Brightness</div>
                <div className="text-2xl font-bold text-blue-600">{features.brightness}</div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${(features.brightness/255)*100}%`}}
                  />
                </div>
              </div>

              <div 
                className={`p-3 rounded cursor-pointer transition-colors ${
                  hoveredFeature === 'edges' ? 'bg-indigo-50 border border-indigo-200' : 'bg-slate-50'
                }`}
                onMouseEnter={() => setHoveredFeature('edges')}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="font-medium text-slate-800">Edge Count</div>
                <div className="text-2xl font-bold text-indigo-600">{features.edgeCount}</div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${Math.min(features.edgeCount/20*100, 100)}%`}}
                  />
                </div>
              </div>

              <div 
                className={`p-3 rounded cursor-pointer transition-colors ${
                  hoveredFeature === 'corners' ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50'
                }`}
                onMouseEnter={() => setHoveredFeature('corners')}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="font-medium text-slate-800">Corner Brightness</div>
                <div className="text-2xl font-bold text-emerald-600">{features.cornerBrightness}</div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${(features.cornerBrightness/255)*100}%`}}
                  />
                </div>
              </div>

              <div 
                className={`p-3 rounded cursor-pointer transition-colors ${
                  hoveredFeature === 'symmetry' ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50'
                }`}
                onMouseEnter={() => setHoveredFeature('symmetry')}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="font-medium text-slate-800">Symmetry Score</div>
                <div className="text-2xl font-bold text-amber-600">{features.symmetryScore}%</div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-amber-500 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${features.symmetryScore}%`}}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-100 rounded">
              <div className="font-medium text-slate-800 mb-2">Feature Vector:</div>
              <div className="font-mono text-sm">
                [{features.brightness}, {features.edgeCount}, {features.cornerBrightness}, {features.symmetryScore}]
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-slate-500 text-center max-w-3xl">
        This demonstrates how AI systems convert complex raw data into structured numerical features. 
        In real applications, feature extraction might involve thousands of dimensions and sophisticated algorithms.
      </div>
    </div>
  );
}
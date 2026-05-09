"use client";

import { useState } from 'react';

export function OcrVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [noiseLevel, setNoiseLevel] = useState(0.2);
  const [selectedChar, setSelectedChar] = useState(0);
  const [showFeatures, setShowFeatures] = useState(false);

  const sampleText = "HELLO";
  const steps = ["Image Input", "Preprocessing", "Feature Extraction", "Character Recognition", "Text Output"];
  
  const characterPatterns = {
    'H': [
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,1,1,1,1],
      [1,0,0,0,1],
      [1,0,0,0,1]
    ],
    'E': [
      [1,1,1,1,1],
      [1,0,0,0,0],
      [1,1,1,1,0],
      [1,0,0,0,0],
      [1,1,1,1,1]
    ],
    'L': [
      [1,0,0,0,0],
      [1,0,0,0,0],
      [1,0,0,0,0],
      [1,0,0,0,0],
      [1,1,1,1,1]
    ],
    'O': [
      [0,1,1,1,0],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [0,1,1,1,0]
    ]
  };

  const addNoise = (pattern: number[][], noise: number) => {
    return pattern.map(row => 
      row.map(cell => {
        const random = Math.random();
        if (random < noise / 2) return 1 - cell;
        return cell;
      })
    );
  };

  const extractFeatures = (pattern: number[][]) => {
    const features = [];
    // Horizontal lines
    for (let i = 0; i < pattern.length; i++) {
      features.push(pattern[i].reduce((sum, cell) => sum + cell, 0) / pattern[i].length);
    }
    // Vertical lines
    for (let j = 0; j < pattern[0].length; j++) {
      features.push(pattern.reduce((sum, row) => sum + row[j], 0) / pattern.length);
    }
    return features;
  };

  const recognizeCharacter = (pattern: number[][]) => {
    const inputFeatures = extractFeatures(pattern);
    let bestMatch = '';
    let bestScore = -1;

    Object.entries(characterPatterns).forEach(([char, refPattern]) => {
      const refFeatures = extractFeatures(refPattern);
      const similarity = inputFeatures.reduce((sum, feat, i) => 
        sum - Math.abs(feat - refFeatures[i]), 0) / inputFeatures.length;
      
      if (similarity > bestScore) {
        bestScore = similarity;
        bestMatch = char;
      }
    });

    return { char: bestMatch, confidence: Math.max(0, (bestScore + 1) * 50) };
  };

  const getCurrentChar = () => {
    const chars = ['H', 'E', 'L', 'L', 'O'];
    return chars[selectedChar];
  };

  const getCurrentPattern = () => {
    const char = getCurrentChar();
    const basePattern = characterPatterns[char as keyof typeof characterPatterns];
    
    if (currentStep >= 1) {
      return addNoise(basePattern, noiseLevel);
    }
    return basePattern;
  };

  const renderPixelGrid = (pattern: number[][], showNoise = false) => {
    const noisyPattern = showNoise ? addNoise(pattern, noiseLevel) : pattern;
    
    return (
      <div className="grid grid-cols-5 gap-1 p-4 bg-white border border-slate-300 rounded-lg">
        {noisyPattern.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`w-6 h-6 rounded ${
                cell ? 'bg-slate-800' : 'bg-slate-100'
              } transition-colors duration-300`}
            />
          ))
        )}
      </div>
    );
  };

  const renderFeatureVisualization = () => {
    const pattern = getCurrentPattern();
    const features = extractFeatures(pattern);
    
    return (
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium text-slate-600">Extracted Features</div>
        <div className="flex gap-1">
          {features.map((feat, i) => (
            <div
              key={i}
              className="w-4 bg-slate-200 rounded overflow-hidden"
              style={{ height: '60px' }}
            >
              <div
                className="bg-blue-500 w-full transition-all duration-500"
                style={{ height: `${feat * 100}%`, marginTop: `${(1 - feat) * 100}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const currentPattern = getCurrentPattern();
  const recognition = currentStep >= 3 ? recognizeCharacter(currentPattern) : null;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Optical Character Recognition</h3>
        <p className="text-slate-600 max-w-2xl">
          Interactive demonstration of how OCR converts images of text into machine-readable format using pattern recognition and feature extraction.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {steps.map((step, index) => (
          <button
            key={step}
            onClick={() => setCurrentStep(index)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentStep >= index
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {index + 1}. {step}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-8 items-start">
        <div className="flex flex-col items-center gap-4">
          <div className="text-lg font-medium text-slate-700">Character Selection</div>
          <div className="flex gap-2">
            {['H', 'E', 'L', 'L', 'O'].map((char, index) => (
              <button
                key={`${char}-${index}`}
                onClick={() => setSelectedChar(index)}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${
                  selectedChar === index
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {char}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="text-lg font-medium text-slate-700">
            {currentStep === 0 && "Original Image"}
            {currentStep === 1 && "Preprocessed (with noise)"}
            {currentStep === 2 && "Feature Extraction"}
            {currentStep >= 3 && "Recognition Result"}
          </div>
          {renderPixelGrid(characterPatterns[getCurrentChar() as keyof typeof characterPatterns], currentStep >= 1)}
          
          {currentStep >= 2 && (
            <div className="mt-4">
              {renderFeatureVisualization()}
            </div>
          )}
        </div>

        {currentStep >= 1 && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-medium text-slate-700">Noise Level</div>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.05"
              value={noiseLevel}
              onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
              className="w-32"
            />
            <div className="text-sm text-slate-600">{(noiseLevel * 100).toFixed(0)}%</div>
          </div>
        )}

        {recognition && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-medium text-slate-700">OCR Result</div>
            <div className="p-6 bg-white rounded-lg border border-slate-200 text-center">
              <div className="text-3xl font-bold text-slate-800 mb-2">{recognition.char}</div>
              <div className="text-sm text-slate-600">
                Confidence: {recognition.confidence.toFixed(1)}%
              </div>
              <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                recognition.confidence > 70
                  ? 'bg-emerald-100 text-emerald-700'
                  : recognition.confidence > 40
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-rose-100 text-rose-700'
              }`}>
                {recognition.confidence > 70 ? 'High' : recognition.confidence > 40 ? 'Medium' : 'Low'} Accuracy
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-sm text-slate-500 max-w-3xl text-center">
        Adjust the noise level to see how OCR handles degraded images. The system extracts features (horizontal and vertical line densities) 
        and compares them against known character patterns to make recognition decisions.
      </div>
    </div>
  );
}
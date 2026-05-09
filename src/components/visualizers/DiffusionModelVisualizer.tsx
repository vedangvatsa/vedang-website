"use client";

import { useState, useEffect } from 'react';

export function DiffusionModelVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'reverse'>('forward');
  const [noiseLevel, setNoiseLevel] = useState(0);
  
  const totalSteps = 10;
  
  // Generate initial image pattern (simple geometric shape)
  const generateOriginalImage = () => {
    const grid = Array(8).fill(null).map(() => Array(8).fill(0));
    // Create a simple circle pattern
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const distance = Math.sqrt((i - 3.5) ** 2 + (j - 3.5) ** 2);
        if (distance <= 2.5) {
          grid[i][j] = 1;
        }
      }
    }
    return grid;
  };
  
  const [originalImage] = useState(generateOriginalImage());
  
  // Add noise to image based on step
  const addNoise = (image: number[][], step: number) => {
    const noiseAmount = step / totalSteps;
    return image.map(row => 
      row.map(pixel => {
        const noise = (Math.random() - 0.5) * noiseAmount * 2;
        return Math.max(0, Math.min(1, pixel + noise));
      })
    );
  };
  
  // Get current image state based on step and direction
  const getCurrentImage = () => {
    if (direction === 'forward') {
      return addNoise(originalImage, currentStep);
    } else {
      // Reverse process - gradually remove noise
      const reverseStep = totalSteps - currentStep;
      return addNoise(originalImage, reverseStep);
    }
  };
  
  const handleAnimate = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      setNoiseLevel(direction === 'forward' ? step / totalSteps : (totalSteps - step) / totalSteps);
      
      if (step >= totalSteps) {
        clearInterval(interval);
        setIsAnimating(false);
        setCurrentStep(0);
      }
    }, 300);
  };
  
  const resetAnimation = () => {
    setCurrentStep(0);
    setNoiseLevel(0);
    setIsAnimating(false);
  };
  
  const toggleDirection = () => {
    setDirection(direction === 'forward' ? 'reverse' : 'forward');
    resetAnimation();
  };
  
  useEffect(() => {
    setNoiseLevel(direction === 'forward' ? currentStep / totalSteps : (totalSteps - currentStep) / totalSteps);
  }, [currentStep, direction]);
  
  const currentImage = getCurrentImage();
  
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Diffusion Model Visualization</h3>
        <p className="text-slate-600">Watch how diffusion models learn to add or remove noise through iterative steps</p>
      </div>
      
      <div className="flex flex-col items-center gap-6">
        {/* Direction Toggle */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-700">Process:</span>
          <button
            onClick={toggleDirection}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              direction === 'forward' 
                ? 'bg-rose-100 text-rose-700 border border-rose-300'
                : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
            }`}
          >
            {direction === 'forward' ? 'Forward Diffusion (Add Noise)' : 'Reverse Diffusion (Denoise)'}
          </button>
        </div>
        
        {/* Image Display */}
        <div className="flex items-center gap-8">
          {/* Original Image */}
          <div className="text-center">
            <div className="text-sm font-medium text-slate-600 mb-2">Original</div>
            <div className="grid grid-cols-8 gap-1 p-4 bg-white rounded-lg border border-slate-300">
              {originalImage.map((row, i) =>
                row.map((pixel, j) => (
                  <div
                    key={`${i}-${j}`}
                    className="w-6 h-6 rounded-sm"
                    style={{
                      backgroundColor: `rgb(${Math.floor((1 - pixel) * 255)}, ${Math.floor((1 - pixel) * 255)}, ${Math.floor((1 - pixel) * 255)})`
                    }}
                  />
                ))
              )}
            </div>
          </div>
          
          {/* Arrow */}
          <div className="text-2xl text-slate-400">
            {direction === 'forward' ? '→' : '←'}
          </div>
          
          {/* Current State */}
          <div className="text-center">
            <div className="text-sm font-medium text-slate-600 mb-2">
              Step {currentStep}/{totalSteps}
            </div>
            <div className="grid grid-cols-8 gap-1 p-4 bg-white rounded-lg border border-slate-300">
              {currentImage.map((row, i) =>
                row.map((pixel, j) => (
                  <div
                    key={`current-${i}-${j}`}
                    className="w-6 h-6 rounded-sm"
                    style={{
                      backgroundColor: `rgb(${Math.floor((1 - pixel) * 255)}, ${Math.floor((1 - pixel) * 255)}, ${Math.floor((1 - pixel) * 255)})`
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Noise Level Indicator */}
        <div className="w-80">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Noise Level</span>
            <span>{Math.round(noiseLevel * 100)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                direction === 'forward' ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${noiseLevel * 100}%` }}
            />
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex gap-4">
          <button
            onClick={handleAnimate}
            disabled={isAnimating}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isAnimating
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isAnimating ? 'Animating...' : `Start ${direction === 'forward' ? 'Forward' : 'Reverse'} Process`}
          </button>
          
          <button
            onClick={resetAnimation}
            className="px-6 py-3 rounded-lg font-medium bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
          >
            Reset
          </button>
        </div>
        
        {/* Step Selector */}
        <div className="w-80">
          <div className="text-sm text-slate-600 mb-2">Manual Step Control</div>
          <input
            type="range"
            min="0"
            max={totalSteps}
            value={currentStep}
            onChange={(e) => setCurrentStep(parseInt(e.target.value))}
            disabled={isAnimating}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>
      
      {/* Explanation */}
      <div className="text-center max-w-2xl">
        <div className="text-sm text-slate-600 leading-relaxed">
          <strong>Forward Diffusion:</strong> Gradually adds noise until the image becomes pure noise. 
          <strong> Reverse Diffusion:</strong> The model learns to predict and remove noise at each step, 
          generating new samples by starting from random noise and iteratively denoising.
        </div>
      </div>
    </div>
  );
}
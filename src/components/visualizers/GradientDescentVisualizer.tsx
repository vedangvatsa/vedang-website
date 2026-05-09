"use client";

import { useState, useEffect } from 'react';

export function GradientDescentVisualizer() {
  const [currentPosition, setCurrentPosition] = useState({ x: 150, y: 150 });
  const [learningRate, setLearningRate] = useState(0.1);
  const [isTraining, setIsTraining] = useState(false);
  const [step, setStep] = useState(0);
  const [loss, setLoss] = useState(0);
  const [path, setPath] = useState([{ x: 150, y: 150 }]);

  // Loss function: simple quadratic bowl (x-200)^2 + (y-100)^2
  const calculateLoss = (x: number, y: number) => {
    const dx = (x - 200) / 100;
    const dy = (y - 100) / 100;
    return dx * dx + dy * dy;
  };

  // Gradient calculation
  const calculateGradient = (x: number, y: number) => {
    const gradX = 2 * (x - 200) / 10000;
    const gradY = 2 * (y - 100) / 10000;
    return { x: gradX, y: gradY };
  };

  // Update loss when position changes
  useEffect(() => {
    setLoss(calculateLoss(currentPosition.x, currentPosition.y));
  }, [currentPosition]);

  // Training step
  const performStep = () => {
    const gradient = calculateGradient(currentPosition.x, currentPosition.y);
    const newX = Math.max(50, Math.min(350, currentPosition.x - learningRate * gradient.x * 1000));
    const newY = Math.max(50, Math.min(250, currentPosition.y - learningRate * gradient.y * 1000));
    
    const newPosition = { x: newX, y: newY };
    setCurrentPosition(newPosition);
    setPath(prev => [...prev, newPosition]);
    setStep(prev => prev + 1);
  };

  // Auto training
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTraining && loss > 0.01) {
      interval = setInterval(performStep, 200);
    } else if (isTraining && loss <= 0.01) {
      setIsTraining(false);
    }
    return () => clearInterval(interval);
  }, [isTraining, loss, currentPosition, learningRate]);

  const reset = () => {
    setCurrentPosition({ x: 150, y: 150 });
    setIsTraining(false);
    setStep(0);
    setPath([{ x: 150, y: 150 }]);
  };

  const handleManualMove = (e: React.MouseEvent<SVGElement>) => {
    if (isTraining) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(50, Math.min(350, e.clientX - rect.left));
    const y = Math.max(50, Math.min(250, e.clientY - rect.top));
    setCurrentPosition({ x, y });
    setPath([{ x, y }]);
    setStep(0);
  };

  // Generate contour lines for loss landscape
  const generateContours = () => {
    const contours = [];
    const levels = [0.5, 1, 2, 4];
    
    for (let level of levels) {
      const points = [];
      for (let angle = 0; angle <= 360; angle += 10) {
        const rad = (angle * Math.PI) / 180;
        const radius = Math.sqrt(level) * 100;
        const x = 200 + radius * Math.cos(rad);
        const y = 100 + radius * Math.sin(rad);
        if (x >= 50 && x <= 350 && y >= 50 && y <= 250) {
          points.push(`${x},${y}`);
        }
      }
      if (points.length > 0) {
        contours.push(
          <polygon
            key={level}
            points={points.join(' ')}
            fill="none"
            stroke="rgb(148 163 184)"
            strokeWidth="1"
            opacity={0.3}
          />
        );
      }
    }
    return contours;
  };

  const gradient = calculateGradient(currentPosition.x, currentPosition.y);
  const arrowScale = 5000;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Gradient Descent Optimization</h3>
        <p className="text-slate-600">Watch the algorithm minimize loss by following gradients down the loss landscape</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        <div className="flex flex-col gap-4">
          <svg 
            width="400" 
            height="300" 
            viewBox="0 0 400 300" 
            className="border border-slate-300 rounded-lg bg-white cursor-pointer"
            onClick={handleManualMove}
          >
            {/* Loss landscape contours */}
            {generateContours()}
            
            {/* Global minimum */}
            <circle cx="200" cy="100" r="8" fill="rgb(34 197 94)" opacity="0.7" />
            <text x="210" y="105" fontSize="12" fill="rgb(34 197 94)" className="font-semibold">
              Global Min
            </text>
            
            {/* Path */}
            {path.length > 1 && (
              <path
                d={`M ${path.map(p => `${p.x},${p.y}`).join(' L ')}`}
                stroke="rgb(59 130 246)"
                strokeWidth="2"
                fill="none"
                opacity="0.7"
              />
            )}
            
            {/* Current position */}
            <circle 
              cx={currentPosition.x} 
              cy={currentPosition.y} 
              r="6" 
              fill="rgb(239 68 68)"
              className="animate-pulse"
            />
            
            {/* Gradient arrow */}
            {!isTraining && (
              <>
                <line
                  x1={currentPosition.x}
                  y1={currentPosition.y}
                  x2={currentPosition.x + gradient.x * arrowScale}
                  y2={currentPosition.y + gradient.y * arrowScale}
                  stroke="rgb(245 101 101)"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="rgb(245 101 101)"
                    />
                  </marker>
                </defs>
                <text 
                  x={currentPosition.x + gradient.x * arrowScale + 10} 
                  y={currentPosition.y + gradient.y * arrowScale - 5}
                  fontSize="10"
                  fill="rgb(245 101 101)"
                  className="font-medium"
                >
                  Gradient
                </text>
              </>
            )}
          </svg>
          
          <p className="text-sm text-slate-600 text-center">
            Click anywhere to move • Contour lines show loss levels
          </p>
        </div>

        <div className="flex flex-col gap-6 min-w-[280px]">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Training Controls</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Learning Rate: {learningRate.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.01"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  disabled={isTraining}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsTraining(!isTraining)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isTraining 
                      ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {isTraining ? 'Stop' : 'Start Training'}
                </button>
                
                <button
                  onClick={performStep}
                  disabled={isTraining}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
                >
                  Single Step
                </button>
                
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Metrics</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Loss:</span>
                <span className={`font-mono font-medium ${
                  loss < 0.1 ? 'text-emerald-600' : loss < 1 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {loss.toFixed(4)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-600">Step:</span>
                <span className="font-mono font-medium text-slate-800">{step}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-600">Position:</span>
                <span className="font-mono text-sm text-slate-800">
                  ({currentPosition.x.toFixed(0)}, {currentPosition.y.toFixed(0)})
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-600">Gradient:</span>
                <span className="font-mono text-sm text-slate-800">
                  ({gradient.x.toFixed(3)}, {gradient.y.toFixed(3)})
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">How it works:</p>
              <ul className="space-y-1 text-xs">
                <li>• Gradient points toward steepest increase</li>
                <li>• Move opposite direction to minimize loss</li>
                <li>• Learning rate controls step size</li>
                <li>• Repeat until convergence</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
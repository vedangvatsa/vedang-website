"use client";

import { useState } from 'react';

export function SamVisualizer() {
  const [selectedPrompt, setSelectedPrompt] = useState<'point' | 'box' | 'text' | null>(null);
  const [pointPosition, setPointPosition] = useState({ x: 50, y: 40 });
  const [boxPosition, setBoxPosition] = useState({ x: 30, y: 30, width: 40, height: 30 });
  const [textPrompt, setTextPrompt] = useState('cat');
  const [isSegmenting, setIsSegmenting] = useState(false);
  const [showMask, setShowMask] = useState(false);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedPrompt === 'point') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPointPosition({ x, y });
      triggerSegmentation();
    }
  };

  const triggerSegmentation = () => {
    setIsSegmenting(true);
    setShowMask(false);
    setTimeout(() => {
      setIsSegmenting(false);
      setShowMask(true);
    }, 1500);
  };

  const resetSegmentation = () => {
    setShowMask(false);
    setSelectedPrompt(null);
  };

  const getSegmentationMask = () => {
    if (selectedPrompt === 'point') {
      return (
        <div 
          className="absolute rounded-full bg-emerald-400 opacity-60 animate-pulse"
          style={{
            left: `${Math.max(0, pointPosition.x - 15)}%`,
            top: `${Math.max(0, pointPosition.y - 10)}%`,
            width: '30%',
            height: '20%'
          }}
        />
      );
    } else if (selectedPrompt === 'box') {
      return (
        <div 
          className="absolute bg-emerald-400 opacity-60 animate-pulse rounded-lg"
          style={{
            left: `${boxPosition.x}%`,
            top: `${boxPosition.y}%`,
            width: `${boxPosition.width}%`,
            height: `${boxPosition.height}%`
          }}
        />
      );
    } else if (selectedPrompt === 'text') {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-blue-400 opacity-50 animate-pulse rounded-lg" />
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">SAM: Segment Anything Model</h3>
        <p className="text-slate-600">Interactive foundation model for zero-shot image segmentation using point, box, or text prompts</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Choose Prompt Type</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setSelectedPrompt('point')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPrompt === 'point'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="text-2xl mb-2">📍</div>
              <div className="font-medium">Point Prompt</div>
              <div className="text-sm">Click to segment</div>
            </button>
            <button
              onClick={() => {
                setSelectedPrompt('box');
                triggerSegmentation();
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPrompt === 'box'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="text-2xl mb-2">📦</div>
              <div className="font-medium">Box Prompt</div>
              <div className="text-sm">Bounding box</div>
            </button>
            <button
              onClick={() => {
                setSelectedPrompt('text');
                triggerSegmentation();
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPrompt === 'text'
                  ? 'border-rose-500 bg-rose-50 text-rose-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="text-2xl mb-2">💬</div>
              <div className="font-medium">Text Prompt</div>
              <div className="text-sm">Natural language</div>
            </button>
          </div>

          {selectedPrompt === 'text' && (
            <div className="mb-4">
              <input
                type="text"
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
                placeholder="Enter object to segment..."
                className="w-full p-3 border border-slate-300 rounded-lg focus:border-rose-500 focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && triggerSegmentation()}
              />
            </div>
          )}

          <div className="bg-white border-2 border-slate-300 rounded-lg p-4">
            <h4 className="font-medium text-slate-700 mb-3">Simulated Image</h4>
            <div 
              className="relative w-full h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg cursor-pointer overflow-hidden"
              onClick={handleImageClick}
            >
              <div className="absolute inset-4 bg-amber-200 rounded-full opacity-80" />
              <div className="absolute bottom-4 left-8 w-16 h-20 bg-slate-400 rounded-lg opacity-70" />
              <div className="absolute top-8 right-8 w-12 h-12 bg-blue-300 rounded-lg opacity-80" />
              <div className="absolute bottom-8 right-4 w-20 h-8 bg-rose-300 rounded-full opacity-70" />

              {selectedPrompt === 'point' && (
                <div
                  className="absolute w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg z-10"
                  style={{
                    left: `${pointPosition.x}%`,
                    top: `${pointPosition.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              )}

              {selectedPrompt === 'box' && (
                <div
                  className="absolute border-4 border-indigo-600 bg-indigo-200 bg-opacity-20 z-10"
                  style={{
                    left: `${boxPosition.x}%`,
                    top: `${boxPosition.y}%`,
                    width: `${boxPosition.width}%`,
                    height: `${boxPosition.height}%`
                  }}
                />
              )}

              {isSegmenting && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 animate-pulse z-20 flex items-center justify-center">
                  <div className="text-white font-semibold bg-blue-600 px-4 py-2 rounded-lg">
                    SAM Processing...
                  </div>
                </div>
              )}

              {showMask && getSegmentationMask()}
            </div>

            {selectedPrompt === 'point' && (
              <p className="text-sm text-slate-600 mt-2">Click anywhere on the image to segment</p>
            )}
          </div>

          <button
            onClick={resetSegmentation}
            className="mt-4 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Reset Segmentation
          </button>
        </div>

        <div className="flex-1">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">SAM Architecture</h4>
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="space-y-6">
              <div className={`p-4 rounded-lg border-2 transition-all ${
                selectedPrompt ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50'
              }`}>
                <h5 className="font-medium text-slate-700 mb-2">1. Prompt Encoder</h5>
                <div className="text-sm text-slate-600">
                  {selectedPrompt === 'point' && "Point coordinates → Dense embeddings"}
                  {selectedPrompt === 'box' && "Box coordinates → Spatial embeddings"}
                  {selectedPrompt === 'text' && "Text tokens → Language embeddings"}
                  {!selectedPrompt && "Select a prompt type above"}
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 transition-all ${
                selectedPrompt ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-slate-50'
              }`}>
                <h5 className="font-medium text-slate-700 mb-2">2. Image Encoder (ViT)</h5>
                <div className="text-sm text-slate-600">
                  Vision Transformer processes image patches into feature representations
                </div>
                <div className="grid grid-cols-8 gap-1 mt-2">
                  {Array.from({length: 32}).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2 rounded-sm ${
                        selectedPrompt ? 'bg-indigo-400 animate-pulse' : 'bg-slate-300'
                      }`}
                      style={{animationDelay: `${i * 50}ms`}}
                    />
                  ))}
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 transition-all ${
                isSegmenting ? 'border-rose-500 bg-rose-50' : 'border-slate-200 bg-slate-50'
              }`}>
                <h5 className="font-medium text-slate-700 mb-2">3. Mask Decoder</h5>
                <div className="text-sm text-slate-600">
                  Combines prompt + image embeddings → Segmentation mask
                </div>
                {isSegmenting && (
                  <div className="mt-2 flex space-x-1">
                    {Array.from({length: 6}).map((_, i) => (
                      <div 
                        key={i}
                        className="w-4 h-4 bg-rose-400 rounded animate-bounce"
                        style={{animationDelay: `${i * 100}ms`}}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className={`p-4 rounded-lg border-2 transition-all ${
                showMask ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50'
              }`}>
                <h5 className="font-medium text-slate-700 mb-2">4. Output Mask</h5>
                <div className="text-sm text-slate-600">
                  {showMask 
                    ? "✅ Zero-shot segmentation complete!"
                    : "Precise object boundaries predicted"}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-slate-100 rounded-lg">
              <h5 className="font-medium text-slate-700 mb-2">Training Scale</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-slate-600">Images</div>
                  <div className="text-xl font-bold text-blue-600">11M</div>
                </div>
                <div>
                  <div className="font-medium text-slate-600">Masks</div>
                  <div className="text-xl font-bold text-emerald-600">1B+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
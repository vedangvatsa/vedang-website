"use client";

import { useState, useEffect } from 'react';

export function SpeechRecognitionVisualizer() {
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [processingStage, setProcessingStage] = useState<'audio' | 'features' | 'neural' | 'text'>('audio');
  const [confidence, setConfidence] = useState(0.85);
  const [noiseLevel, setNoiseLevel] = useState(0.2);
  const [isProcessing, setIsProcessing] = useState(false);

  const audioWaveform = [0.3, 0.7, 0.5, 0.9, 0.4, 0.8, 0.6, 0.2, 0.5, 0.7, 0.3, 0.6];
  const spokenText = "Hello world";
  const words = ["Hello", "world"];
  const phonemes = [["HH", "EH", "L", "OW"], ["W", "ER", "L", "D"]];

  const neuralWeights = [
    [0.8, 0.2, 0.6, 0.9],
    [0.3, 0.7, 0.4, 0.5],
    [0.9, 0.1, 0.8, 0.3],
    [0.2, 0.6, 0.5, 0.7]
  ];

  useEffect(() => {
    if (isProcessing) {
      const timer = setTimeout(() => {
        setProcessingStage(prev => {
          switch(prev) {
            case 'audio': return 'features';
            case 'features': return 'neural';
            case 'neural': return 'text';
            case 'text': return 'audio';
          }
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [processingStage, isProcessing]);

  const getWordConfidence = (wordIndex: number) => {
    return Math.max(0.3, confidence - noiseLevel * 0.5 - wordIndex * 0.1);
  };

  const getFeatureIntensity = (index: number) => {
    return Math.max(0.1, audioWaveform[index] - noiseLevel);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Speech Recognition Pipeline</h3>
        <p className="text-slate-600">Interactive visualization of how speech is converted to text through neural networks</p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-4xl">
        {/* Controls */}
        <div className="flex gap-6 justify-center items-center bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Confidence: {confidence.toFixed(2)}</label>
            <input
              type="range"
              min="0.3"
              max="0.95"
              step="0.05"
              value={confidence}
              onChange={(e) => setConfidence(parseFloat(e.target.value))}
              className="w-32"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Noise Level: {noiseLevel.toFixed(2)}</label>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.05"
              value={noiseLevel}
              onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
              className="w-32"
            />
          </div>
          <button
            onClick={() => setIsProcessing(!isProcessing)}
            className={`px-4 py-2 rounded-lg font-medium ${
              isProcessing 
                ? 'bg-rose-500 text-white hover:bg-rose-600' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            } transition-colors`}
          >
            {isProcessing ? 'Stop' : 'Process Audio'}
          </button>
        </div>

        {/* Pipeline Stages */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Audio Input */}
          <div className={`bg-white p-4 rounded-xl border-2 transition-colors ${
            processingStage === 'audio' && isProcessing ? 'border-blue-400 bg-blue-50' : 'border-slate-200'
          }`}>
            <h4 className="font-semibold text-slate-800 mb-3">1. Audio Signal</h4>
            <div className="flex items-end gap-1 h-20 mb-3">
              {audioWaveform.map((amplitude, i) => (
                <div
                  key={i}
                  className="bg-blue-500 flex-1 transition-all duration-300"
                  style={{ 
                    height: `${Math.max(10, amplitude * 80)}px`,
                    opacity: processingStage === 'audio' && isProcessing ? 1 : 0.6 
                  }}
                />
              ))}
            </div>
            <div className="text-xs text-slate-600">Raw waveform data</div>
          </div>

          {/* Feature Extraction */}
          <div className={`bg-white p-4 rounded-xl border-2 transition-colors ${
            processingStage === 'features' && isProcessing ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200'
          }`}>
            <h4 className="font-semibold text-slate-800 mb-3">2. Features</h4>
            <div className="grid grid-cols-3 gap-1 mb-3">
              {Array.from({length: 12}).map((_, i) => (
                <div
                  key={i}
                  className="bg-indigo-500 h-4 transition-all duration-300"
                  style={{ 
                    opacity: getFeatureIntensity(i % audioWaveform.length),
                    transform: processingStage === 'features' && isProcessing ? 'scale(1.1)' : 'scale(1)'
                  }}
                />
              ))}
            </div>
            <div className="text-xs text-slate-600">MFCC coefficients</div>
          </div>

          {/* Neural Network */}
          <div className={`bg-white p-4 rounded-xl border-2 transition-colors ${
            processingStage === 'neural' && isProcessing ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200'
          }`}>
            <h4 className="font-semibold text-slate-800 mb-3">3. Neural Net</h4>
            <div className="grid grid-cols-4 gap-1 mb-3">
              {neuralWeights.map((row, i) => 
                row.map((weight, j) => (
                  <div
                    key={`${i}-${j}`}
                    className="bg-emerald-500 h-3 transition-all duration-300"
                    style={{ 
                      opacity: weight * (confidence - noiseLevel * 0.3),
                      transform: processingStage === 'neural' && isProcessing ? 'scale(1.2)' : 'scale(1)'
                    }}
                  />
                ))
              )}
            </div>
            <div className="text-xs text-slate-600">Deep learning layers</div>
          </div>

          {/* Text Output */}
          <div className={`bg-white p-4 rounded-xl border-2 transition-colors ${
            processingStage === 'text' && isProcessing ? 'border-amber-400 bg-amber-50' : 'border-slate-200'
          }`}>
            <h4 className="font-semibold text-slate-800 mb-3">4. Text Output</h4>
            <div className="space-y-2 mb-3">
              {words.map((word, i) => (
                <div
                  key={i}
                  className={`px-2 py-1 rounded text-sm font-mono cursor-pointer transition-all duration-300 ${
                    selectedWord === i 
                      ? 'bg-amber-200 text-amber-800 scale-105' 
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-150'
                  }`}
                  onClick={() => setSelectedWord(selectedWord === i ? null : i)}
                  style={{ 
                    opacity: processingStage === 'text' && isProcessing ? 1 : 0.8
                  }}
                >
                  {word}
                </div>
              ))}
            </div>
            <div className="text-xs text-slate-600">Final transcription</div>
          </div>
        </div>

        {/* Word Analysis */}
        {selectedWord !== null && (
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">
              Word Analysis: "{words[selectedWord]}"
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-sm font-medium text-slate-700 mb-2">Phonemes</h5>
                <div className="flex gap-2">
                  {phonemes[selectedWord].map((phoneme, i) => (
                    <div
                      key={i}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono"
                    >
                      {phoneme}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-slate-700 mb-2">Confidence Score</h5>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-200 h-4 rounded">
                    <div
                      className="bg-emerald-500 h-4 rounded transition-all duration-300"
                      style={{ width: `${getWordConfidence(selectedWord) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono text-slate-700">
                    {(getWordConfidence(selectedWord) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-sm text-slate-600 text-center max-w-2xl">
        Adjust confidence and noise levels to see how they affect recognition accuracy. 
        Click "Process Audio" to see the pipeline in action. Click words to analyze phonemes and confidence scores.
      </div>
    </div>
  );
}
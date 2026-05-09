"use client";

import { useState } from 'react';

export function PerplexityVisualizer() {
  const [selectedModel, setSelectedModel] = useState<'good' | 'poor'>('good');
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const sentence = ["The", "cat", "sat", "on", "the", "mat"];
  
  const goodModelProbs = [
    [0.7, 0.2, 0.1], // "The" - high confidence
    [0.6, 0.3, 0.1], // "cat" - good confidence
    [0.8, 0.15, 0.05], // "sat" - very confident
    [0.5, 0.3, 0.2], // "on" - moderate confidence
    [0.9, 0.08, 0.02], // "the" - very confident
    [0.75, 0.2, 0.05] // "mat" - high confidence
  ];
  
  const poorModelProbs = [
    [0.4, 0.35, 0.25], // "The" - uncertain
    [0.35, 0.33, 0.32], // "cat" - very uncertain
    [0.45, 0.3, 0.25], // "sat" - uncertain
    [0.38, 0.32, 0.3], // "on" - very uncertain
    [0.42, 0.31, 0.27], // "the" - uncertain
    [0.36, 0.34, 0.3] // "mat" - very uncertain
  ];

  const calculatePerplexity = (probs: number[][]) => {
    const logLikelihood = probs.reduce((sum, wordProbs) => {
      return sum + Math.log2(wordProbs[0]); // log of correct prediction probability
    }, 0);
    const avgNegLogLikelihood = -logLikelihood / probs.length;
    return Math.pow(2, avgNegLogLikelihood);
  };

  const goodPerplexity = calculatePerplexity(goodModelProbs);
  const poorPerplexity = calculatePerplexity(poorModelProbs);

  const currentProbs = selectedModel === 'good' ? goodModelProbs : poorModelProbs;
  const currentPerplexity = selectedModel === 'good' ? goodPerplexity : poorPerplexity;

  const choices = ["correct", "alternative", "wrong"];
  
  const animate = () => {
    setIsAnimating(true);
    setCurrentPosition(0);
    
    const interval = setInterval(() => {
      setCurrentPosition(prev => {
        if (prev >= sentence.length - 1) {
          clearInterval(interval);
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Perplexity Visualization</h3>
        <p className="text-slate-600 max-w-2xl">
          Watch how different language models predict the next word. Lower perplexity means better predictions and less uncertainty.
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setSelectedModel('good')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            selectedModel === 'good'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-300 hover:border-emerald-300'
          }`}
        >
          Good Model (Perplexity: {goodPerplexity.toFixed(1)})
        </button>
        <button
          onClick={() => setSelectedModel('poor')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            selectedModel === 'poor'
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-300 hover:border-rose-300'
          }`}
        >
          Poor Model (Perplexity: {poorPerplexity.toFixed(1)})
        </button>
      </div>

      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-center gap-4 mb-6">
          {sentence.map((word, index) => (
            <div
              key={index}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                index === currentPosition
                  ? 'border-blue-500 bg-blue-100 text-blue-800 scale-110'
                  : index < currentPosition
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-white text-slate-500'
              }`}
            >
              {word}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">
            Predicting: "{sentence[currentPosition]}" (Position {currentPosition + 1})
          </h4>
          
          <div className="grid grid-cols-3 gap-4">
            {choices.map((choice, index) => {
              const prob = currentProbs[currentPosition][index];
              const isCorrect = index === 0;
              
              return (
                <div key={choice} className="text-center">
                  <div className={`h-32 rounded-lg mb-2 flex items-end justify-center p-2 ${
                    isCorrect ? 'bg-emerald-100' : 'bg-slate-100'
                  }`}>
                    <div
                      className={`w-full rounded transition-all duration-500 ${
                        isCorrect 
                          ? selectedModel === 'good' ? 'bg-emerald-500' : 'bg-emerald-400'
                          : 'bg-slate-400'
                      }`}
                      style={{ height: `${prob * 100}%` }}
                    />
                  </div>
                  <p className="text-sm font-medium text-slate-700">{choice}</p>
                  <p className={`text-lg font-bold ${isCorrect ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {(prob * 100).toFixed(1)}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-center">
            <button
              onClick={animate}
              disabled={isAnimating}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                isAnimating
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
              }`}
            >
              {isAnimating ? 'Predicting...' : 'Animate Predictions'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-600 mb-1">Current Perplexity</p>
            <div className={`text-3xl font-bold px-4 py-2 rounded-lg ${
              selectedModel === 'good'
                ? 'text-emerald-600 bg-emerald-100'
                : 'text-rose-600 bg-rose-100'
            }`}>
              {currentPerplexity.toFixed(2)}
            </div>
          </div>

          <div className="text-right">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPosition(Math.max(0, currentPosition - 1))}
                disabled={currentPosition === 0}
                className="px-3 py-2 rounded bg-slate-200 text-slate-600 hover:bg-slate-300 disabled:opacity-50"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentPosition(Math.min(sentence.length - 1, currentPosition + 1))}
                disabled={currentPosition === sentence.length - 1}
                className="px-3 py-2 rounded bg-slate-200 text-slate-600 hover:bg-slate-300 disabled:opacity-50"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-slate-500 max-w-2xl">
        <p>
          The good model shows higher confidence (taller green bars) in correct predictions, resulting in lower perplexity. 
          The poor model is more uncertain across all choices, leading to higher perplexity.
        </p>
      </div>
    </div>
  );
}
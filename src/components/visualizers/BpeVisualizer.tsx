"use client";

import { useState } from 'react';

export function BpeVisualizer() {
  const [inputText, setInputText] = useState("hello world hello");
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize with character-level tokens
  const initializeTokens = (text: string) => {
    const chars = text.split('');
    const vocab = new Set(chars);
    return {
      tokens: chars,
      vocabulary: Array.from(vocab),
      mergeHistory: []
    };
  };

  const performBPE = (text: string, maxSteps: number = 5) => {
    let tokens = text.split('');
    let vocabulary = new Set(tokens);
    const steps: {
      tokens: string[];
      vocabulary: string[];
      pairs: [string, number][];
      mergedPair: string | null;
    }[] = [{ tokens: [...tokens], vocabulary: Array.from(vocabulary), pairs: [], mergedPair: null }];

    for (let step = 0; step < maxSteps; step++) {
      // Count pairs
      const pairCounts: { [key: string]: number } = {};
      for (let i = 0; i < tokens.length - 1; i++) {
        const pair = tokens[i] + tokens[i + 1];
        pairCounts[pair] = (pairCounts[pair] || 0) + 1;
      }

      if (Object.keys(pairCounts).length === 0) break;

      // Find most frequent pair
      const sortedPairs = Object.entries(pairCounts).sort((a, b) => b[1] - a[1]);
      const [mostFrequentPair, count] = sortedPairs[0];

      if (count < 2) break; // Only merge if appears at least twice

      // Merge the most frequent pair
      const newTokens = [];
      let i = 0;
      while (i < tokens.length) {
        if (i < tokens.length - 1 && tokens[i] + tokens[i + 1] === mostFrequentPair) {
          newTokens.push(mostFrequentPair);
          i += 2;
        } else {
          newTokens.push(tokens[i]);
          i++;
        }
      }

      tokens = newTokens;
      vocabulary.add(mostFrequentPair);

      steps.push({
        tokens: [...tokens],
        vocabulary: Array.from(vocabulary),
        pairs: sortedPairs,
        mergedPair: mostFrequentPair
      });
    }

    return steps;
  };

  const steps = performBPE(inputText);

  const handlePlay = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const currentStepData = steps[currentStep] || steps[0];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Byte-Pair Encoding (BPE)</h3>
        <p className="text-slate-600">Watch how BPE iteratively merges frequent character pairs to build a subword vocabulary</p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-slate-700">Input Text:</label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter text to tokenize..."
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePlay}
              disabled={isPlaying}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlaying ? 'Playing...' : 'Play BPE'}
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Step:</span>
              <input
                type="range"
                min="0"
                max={steps.length - 1}
                value={currentStep}
                onChange={(e) => setCurrentStep(parseInt(e.target.value))}
                className="w-32"
                disabled={isPlaying}
              />
              <span className="text-sm font-medium text-slate-700">{currentStep} / {steps.length - 1}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-3">Current Tokenization</h4>
            <div className="flex flex-wrap gap-2">
              {currentStepData.tokens.map((token, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded text-sm font-mono border ${
                    token.length > 1
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                      : 'bg-slate-100 border-slate-300 text-slate-800'
                  }`}
                >
                  {token === ' ' ? '␣' : token}
                </span>
              ))}
            </div>
            
            {currentStepData.mergedPair && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm font-medium text-blue-800">
                  Merged pair: "{currentStepData.mergedPair === ' ' ? '␣' : currentStepData.mergedPair}"
                </span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-3">
              Vocabulary (Size: {currentStepData.vocabulary.length})
            </h4>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {currentStepData.vocabulary.map((token, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded text-xs font-mono border ${
                    token.length > 1
                      ? 'bg-rose-100 border-rose-300 text-rose-800'
                      : 'bg-amber-100 border-amber-300 text-amber-800'
                  }`}
                >
                  {token === ' ' ? '␣' : token}
                </span>
              ))}
            </div>
          </div>
        </div>

        {currentStepData.pairs && currentStepData.pairs.length > 0 && (
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-3">Pair Frequencies</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {currentStepData.pairs.slice(0, 8).map(([pair, count], index) => (
                <div
                  key={pair}
                  className={`p-2 rounded border text-sm ${
                    index === 0
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-800 font-semibold'
                      : 'bg-slate-100 border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-mono">"{pair === ' ' ? '␣' : pair}"</div>
                  <div className="text-xs">Count: {count}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <h4 className="text-sm font-semibold text-indigo-800 mb-2">BPE Progress</h4>
          <div className="text-sm text-indigo-700">
            <div>Original characters: {inputText.length}</div>
            <div>Current tokens: {currentStepData.tokens.length}</div>
            <div>Compression ratio: {((inputText.length - currentStepData.tokens.length) / inputText.length * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
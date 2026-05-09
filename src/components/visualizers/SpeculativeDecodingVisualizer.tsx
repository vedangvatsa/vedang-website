"use client";

import { useState, useEffect } from 'react';

export function SpeculativeDecodingVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<'standard' | 'speculative'>('standard');
  const [draftTokens, setDraftTokens] = useState(3);
  const [acceptedTokens, setAcceptedTokens] = useState<number[]>([]);
  const [currentBatch, setCurrentBatch] = useState(0);

  const targetSequence = ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"];
  const draftCandidates = [
    ["The", "A", "One"],
    ["quick", "fast", "slow"],
    ["brown", "red", "black"],
    ["fox", "cat", "dog"],
    ["jumps", "runs", "walks"],
    ["over", "under", "around"],
    ["the", "a", "some"],
    ["lazy", "tired", "sleepy"],
    ["dog", "cat", "pet"]
  ];

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        if (mode === 'standard') {
          if (step < targetSequence.length) {
            setStep(step + 1);
          } else {
            setIsPlaying(false);
            setStep(0);
          }
        } else {
          if (currentBatch * draftTokens + acceptedTokens.length < targetSequence.length) {
            const newAccepted = [];
            for (let i = 0; i < draftTokens && currentBatch * draftTokens + i < targetSequence.length; i++) {
              if (Math.random() > 0.3) {
                newAccepted.push(i);
              } else {
                break;
              }
            }
            setAcceptedTokens(newAccepted);
            setTimeout(() => {
              setStep(step + newAccepted.length);
              setCurrentBatch(currentBatch + 1);
              setAcceptedTokens([]);
            }, 1000);
          } else {
            setIsPlaying(false);
            setStep(0);
            setCurrentBatch(0);
          }
        }
      }, mode === 'standard' ? 800 : 1600);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, step, mode, draftTokens, currentBatch, acceptedTokens]);

  const reset = () => {
    setIsPlaying(false);
    setStep(0);
    setCurrentBatch(0);
    setAcceptedTokens([]);
  };

  const standardPasses = step;
  const speculativePasses = Math.ceil(step / draftTokens);
  const speedup = step > 0 ? (standardPasses / Math.max(speculativePasses, 1)).toFixed(1) : "1.0";

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Speculative Decoding</h3>
        <p className="text-slate-600 max-w-2xl">
          Watch how a fast draft model proposes multiple tokens that a larger model verifies in parallel, 
          reducing sequential forward passes compared to standard autoregressive generation.
        </p>
      </div>

      <div className="flex gap-4 items-center flex-wrap justify-center">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('standard')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'standard' 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Standard Decoding
          </button>
          <button
            onClick={() => setMode('speculative')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'speculative' 
                ? 'bg-indigo-500 text-white' 
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Speculative Decoding
          </button>
        </div>
        
        {mode === 'speculative' && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Draft tokens:</label>
            <input
              type="range"
              min="1"
              max="4"
              value={draftTokens}
              onChange={(e) => setDraftTokens(Number(e.target.value))}
              className="w-20"
              disabled={isPlaying}
            />
            <span className="text-sm font-medium text-slate-800">{draftTokens}</span>
          </div>
        )}

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-6 py-2 rounded-lg text-white transition-colors ${
            isPlaying ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'
          }`}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <button
          onClick={reset}
          className="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {mode === 'standard' ? (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-slate-700">Standard Autoregressive Generation</h4>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex flex-wrap gap-2 mb-4">
                {targetSequence.slice(0, step).map((token, i) => (
                  <div
                    key={i}
                    className={`px-3 py-2 rounded-lg border-2 transition-all duration-300 ${
                      i === step - 1 
                        ? 'bg-blue-100 border-blue-400 text-blue-800 animate-pulse' 
                        : 'bg-slate-100 border-slate-300 text-slate-700'
                    }`}
                  >
                    {token}
                  </div>
                ))}
                {step < targetSequence.length && (
                  <div className="px-3 py-2 rounded-lg border-2 border-dashed border-slate-300 text-slate-400">
                    ?
                  </div>
                )}
              </div>
              <div className="text-sm text-slate-600">
                Forward passes: <span className="font-semibold text-blue-600">{standardPasses}</span>
                <span className="ml-4">Each token requires one sequential forward pass through the large model</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-slate-700">Speculative Decoding</h4>
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex flex-wrap gap-2">
                {targetSequence.slice(0, step).map((token, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 bg-emerald-100 border-2 border-emerald-300 text-emerald-800 rounded-lg"
                  >
                    {token}
                  </div>
                ))}
              </div>
              
              {isPlaying && currentBatch * draftTokens < targetSequence.length && (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-indigo-700">Draft Model Proposals:</div>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: Math.min(draftTokens, targetSequence.length - currentBatch * draftTokens) }).map((_, i) => {
                      const tokenIndex = currentBatch * draftTokens + i;
                      const candidates = draftCandidates[tokenIndex] || ["?", "?", "?"];
                      const isAccepted = acceptedTokens.includes(i);
                      const isCorrect = candidates[0] === targetSequence[tokenIndex];
                      
                      return (
                        <div key={i} className="space-y-1">
                          {candidates.map((candidate, j) => (
                            <div
                              key={j}
                              className={`px-3 py-1 text-sm rounded-lg transition-all duration-300 ${
                                j === 0 
                                  ? isAccepted
                                    ? 'bg-emerald-200 border-2 border-emerald-400 text-emerald-800'
                                    : 'bg-indigo-100 border-2 border-indigo-300 text-indigo-700'
                                  : 'bg-slate-100 border border-slate-300 text-slate-600'
                              }`}
                            >
                              {candidate}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-sm text-indigo-600">
                    Target model verifying {Math.min(draftTokens, targetSequence.length - currentBatch * draftTokens)} tokens in parallel...
                  </div>
                </div>
              )}
              
              <div className="text-sm text-slate-600 space-y-1">
                <div>Forward passes: <span className="font-semibold text-indigo-600">{speculativePasses}</span></div>
                <div>Speedup: <span className="font-semibold text-emerald-600">{speedup}x</span></div>
                <div className="text-xs">Draft model generates {draftTokens} candidates, target model verifies them in one pass</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-2xl">
        <div className="text-sm text-amber-800">
          <strong>Key Insight:</strong> Speculative decoding trades draft model computation (cheap) for target model sequential passes (expensive), 
          achieving speedups when the draft model's proposals have reasonable acceptance rates.
        </div>
      </div>
    </div>
  );
}
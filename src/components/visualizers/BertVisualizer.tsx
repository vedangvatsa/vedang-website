"use client";

import { useState } from 'react';

export function BertVisualizer() {
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [maskingStep, setMaskingStep] = useState(0);
  const [showAttention, setShowAttention] = useState(false);

  const sentence = ["The", "cat", "sat", "on", "the", "mat"];
  const maskedVersions = [
    ["The", "cat", "sat", "on", "the", "mat"],
    ["[MASK]", "cat", "sat", "on", "the", "mat"],
    ["The", "[MASK]", "sat", "on", "the", "mat"],
    ["The", "cat", "[MASK]", "on", "the", "mat"]
  ];

  const attentionWeights = [
    [0.1, 0.3, 0.2, 0.1, 0.2, 0.1],
    [0.2, 0.1, 0.4, 0.1, 0.1, 0.1],
    [0.1, 0.4, 0.1, 0.2, 0.1, 0.1],
    [0.1, 0.1, 0.3, 0.1, 0.2, 0.2],
    [0.3, 0.1, 0.1, 0.2, 0.1, 0.2],
    [0.1, 0.1, 0.1, 0.3, 0.2, 0.2]
  ];

  const predictions = [
    { word: "The", confidence: 0.95 },
    { word: "dog", confidence: 0.12 },
    { word: "cat", confidence: 0.78 },
    { word: "bird", confidence: 0.05 }
  ];

  const getAttentionColor = (weight: number) => {
    if (weight > 0.3) return "bg-rose-500";
    if (weight > 0.2) return "bg-amber-400";
    if (weight > 0.1) return "bg-blue-400";
    return "bg-slate-300";
  };

  const getAttentionOpacity = (weight: number) => {
    return Math.max(0.2, weight * 2);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">BERT: Bidirectional Language Understanding</h3>
        <p className="text-slate-600 text-lg">Explore how BERT uses context from both directions and masked language modeling</p>
      </div>

      <div className="w-full max-w-4xl space-y-8">
        {/* Bidirectional Context Visualization */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-4">Bidirectional Context Processing</h4>
          <div className="flex items-center justify-center gap-4 mb-4">
            {sentence.map((word, index) => (
              <div key={index} className="relative">
                <div
                  className={`px-4 py-2 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    selectedWord === index
                      ? "bg-indigo-100 border-indigo-500 text-indigo-800"
                      : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                  }`}
                  onClick={() => setSelectedWord(selectedWord === index ? null : index)}
                >
                  {word}
                </div>
                {selectedWord === index && (
                  <>
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {index > 0 && (
                        <div className="w-8 h-1 bg-emerald-500 rounded animate-pulse"></div>
                      )}
                    </div>
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {index < sentence.length - 1 && (
                        <div className="w-8 h-1 bg-emerald-500 rounded animate-pulse"></div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-slate-600">
            Click on any word to see bidirectional context flow
          </div>
        </div>

        {/* Masked Language Modeling */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-4">Masked Language Modeling (15% masking)</h4>
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setMaskingStep((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              disabled={maskingStep === 0}
            >
              Previous
            </button>
            <div className="flex-1 text-center">
              <div className="flex justify-center gap-3 mb-2">
                {maskedVersions[maskingStep].map((word, index) => (
                  <div
                    key={index}
                    className={`px-3 py-2 rounded-lg ${
                      word === "[MASK]"
                        ? "bg-rose-200 border-2 border-rose-400 text-rose-800 font-bold"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {word}
                  </div>
                ))}
              </div>
              <div className="text-sm text-slate-500">Step {maskingStep + 1} of {maskedVersions.length}</div>
            </div>
            <button
              onClick={() => setMaskingStep((prev) => Math.min(maskedVersions.length - 1, prev + 1))}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              disabled={maskingStep === maskedVersions.length - 1}
            >
              Next
            </button>
          </div>

          {maskingStep > 0 && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <h5 className="font-semibold text-slate-800 mb-2">Predictions for [MASK]:</h5>
              <div className="grid grid-cols-2 gap-2">
                {predictions.map((pred, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-slate-700">{pred.word}</span>
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pred.confidence * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500">{(pred.confidence * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Attention Matrix */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-semibold text-slate-800">Attention Weights Matrix</h4>
            <button
              onClick={() => setShowAttention(!showAttention)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showAttention
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              {showAttention ? "Hide" : "Show"} Attention
            </button>
          </div>

          {showAttention && (
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2 text-center">
                <div></div>
                {sentence.map((word, index) => (
                  <div key={index} className="text-sm font-medium text-slate-600 p-2">
                    {word}
                  </div>
                ))}
                {sentence.map((word, rowIndex) => (
                  <>
                    <div key={`label-${rowIndex}`} className="text-sm font-medium text-slate-600 p-2">
                      {word}
                    </div>
                    {attentionWeights[rowIndex].map((weight, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-8 h-8 rounded ${getAttentionColor(weight)} flex items-center justify-center text-xs text-white font-semibold cursor-pointer hover:scale-110 transition-transform`}
                        style={{ opacity: getAttentionOpacity(weight) }}
                        title={`Attention: ${weight.toFixed(2)}`}
                      >
                        {weight.toFixed(1)}
                      </div>
                    ))}
                  </>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span>Attention Strength:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-300 rounded"></div>
                  <span>Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-400 rounded"></div>
                  <span>High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-rose-500 rounded"></div>
                  <span>Very High</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from 'react';

export function ReRankingVisualizer() {
  const [activeStage, setActiveStage] = useState<'initial' | 'rerank' | 'complete'>('initial');
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);
  const [showScores, setShowScores] = useState(false);

  const documents = [
    { id: 1, title: "Machine Learning Fundamentals", initialScore: 0.85, rerankScore: 0.92, relevance: "high" },
    { id: 2, title: "Deep Learning Applications", initialScore: 0.78, rerankScore: 0.89, relevance: "high" },
    { id: 3, title: "Neural Network Architectures", initialScore: 0.82, rerankScore: 0.88, relevance: "high" },
    { id: 4, title: "Computer Vision Basics", initialScore: 0.75, rerankScore: 0.65, relevance: "medium" },
    { id: 5, title: "Natural Language Processing", initialScore: 0.73, rerankScore: 0.85, relevance: "high" },
    { id: 6, title: "Database Systems Overview", initialScore: 0.70, rerankScore: 0.45, relevance: "low" },
    { id: 7, title: "Web Development Guide", initialScore: 0.68, rerankScore: 0.35, relevance: "low" },
    { id: 8, title: "Transformer Models Explained", initialScore: 0.65, rerankScore: 0.91, relevance: "high" }
  ];

  const query = "machine learning neural networks";

  const getInitialRanking = () => {
    return [...documents].sort((a, b) => b.initialScore - a.initialScore);
  };

  const getFinalRanking = () => {
    return [...documents].sort((a, b) => b.rerankScore - a.rerankScore);
  };

  const getCurrentRanking = () => {
    if (activeStage === 'initial') return getInitialRanking();
    return getFinalRanking();
  };

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case 'high': return 'bg-emerald-100 border-emerald-300';
      case 'medium': return 'bg-amber-100 border-amber-300';
      case 'low': return 'bg-rose-100 border-rose-300';
      default: return 'bg-slate-100 border-slate-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 0.8) return 'text-emerald-600';
    if (score > 0.6) return 'text-amber-600';
    return 'text-rose-600';
  };

  const runReranking = () => {
    setActiveStage('rerank');
    setTimeout(() => setActiveStage('complete'), 2000);
  };

  const reset = () => {
    setActiveStage('initial');
    setSelectedDoc(null);
    setShowScores(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Re-ranking Visualization</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how re-ranking improves search quality by first retrieving candidates with a fast model, 
          then re-scoring them with a more powerful cross-encoder for better relevance.
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-lg p-6 mb-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold text-slate-800">
              Query: <span className="text-blue-600">"{query}"</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowScores(!showScores)}
                className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded transition-colors"
              >
                {showScores ? 'Hide Scores' : 'Show Scores'}
              </button>
              <button
                onClick={runReranking}
                disabled={activeStage === 'rerank'}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              >
                {activeStage === 'initial' ? 'Run Re-ranking' : activeStage === 'rerank' ? 'Re-ranking...' : 'Re-ranking Complete'}
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <div className="mb-4">
                <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  Stage 1: Initial Retrieval
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Fast BM25/Dense</span>
                </h4>
                <div className="space-y-2">
                  {getInitialRanking().map((doc, index) => (
                    <div
                      key={`initial-${doc.id}`}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedDoc === doc.id ? 'ring-2 ring-blue-500' : ''
                      } ${getRelevanceColor(doc.relevance)}`}
                      onClick={() => setSelectedDoc(selectedDoc === doc.id ? null : doc.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500">#{index + 1}</span>
                          <span className="text-sm font-medium">{doc.title}</span>
                        </div>
                        {showScores && (
                          <span className={`text-xs font-mono ${getScoreColor(doc.initialScore)}`}>
                            {doc.initialScore.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center px-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                activeStage === 'rerank' ? 'bg-blue-600 animate-pulse' : 
                activeStage === 'complete' ? 'bg-emerald-600' : 'bg-slate-300'
              }`}>
                <div className="w-6 h-0.5 bg-white transform rotate-45"></div>
                <div className="w-6 h-0.5 bg-white transform -rotate-45 -ml-6"></div>
              </div>
            </div>

            <div className="flex-1">
              <div className="mb-4">
                <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  Stage 2: Re-ranked Results
                  <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded">Cross-Encoder</span>
                </h4>
                <div className="space-y-2">
                  {(activeStage === 'initial' ? getInitialRanking() : getFinalRanking()).map((doc, index) => (
                    <div
                      key={`rerank-${doc.id}`}
                      className={`p-3 border rounded-lg cursor-pointer transition-all duration-500 ${
                        selectedDoc === doc.id ? 'ring-2 ring-blue-500' : ''
                      } ${
                        activeStage === 'initial' ? 'bg-slate-100 border-slate-200' : getRelevanceColor(doc.relevance)
                      } ${
                        activeStage === 'rerank' ? 'animate-pulse' : ''
                      }`}
                      onClick={() => setSelectedDoc(selectedDoc === doc.id ? null : doc.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500">#{index + 1}</span>
                          <span className="text-sm font-medium">{doc.title}</span>
                        </div>
                        {showScores && activeStage !== 'initial' && (
                          <span className={`text-xs font-mono ${getScoreColor(doc.rerankScore)}`}>
                            {doc.rerankScore.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedDoc && (
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <h5 className="font-semibold text-slate-800 mb-3">Document Analysis</h5>
            {(() => {
              const doc = documents.find(d => d.id === selectedDoc)!;
              const initialRank = getInitialRanking().findIndex(d => d.id === selectedDoc) + 1;
              const finalRank = getFinalRanking().findIndex(d => d.id === selectedDoc) + 1;
              const rankChange = initialRank - finalRank;
              
              return (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Initial Rank:</span>
                    <div className="font-semibold">#{initialRank}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Re-ranked Position:</span>
                    <div className="font-semibold">#{finalRank}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Rank Change:</span>
                    <div className={`font-semibold ${
                      rankChange > 0 ? 'text-emerald-600' : rankChange < 0 ? 'text-rose-600' : 'text-slate-600'
                    }`}>
                      {rankChange > 0 ? `+${rankChange}` : rankChange < 0 ? rankChange : 'No change'}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 text-sm text-indigo-800">
          <strong>How it works:</strong> The initial retriever quickly scans millions of documents using BM25 or dense embeddings. 
          The top candidates are then re-scored by a cross-encoder that deeply analyzes query-document pairs, 
          significantly improving relevance at a fraction of the computational cost.
        </div>
      </div>
    </div>
  );
}
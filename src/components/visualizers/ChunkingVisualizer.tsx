"use client";

import React, { useState } from 'react';

export function ChunkingVisualizer() {
  const [chunkSize, setChunkSize] = useState(50);
  const [hoveredChunk, setHoveredChunk] = useState<number | null>(null);
  const [query, setQuery] = useState("machine learning algorithms");
  const [showRelevance, setShowRelevance] = useState(false);

  const document = "Machine learning algorithms are computational methods that enable systems to learn patterns from data without explicit programming. These algorithms form the foundation of artificial intelligence applications. There are three main types: supervised learning uses labeled data to train models, unsupervised learning finds hidden patterns in unlabeled data, and reinforcement learning learns through trial and error interactions. Popular algorithms include neural networks, decision trees, and support vector machines. Neural networks consist of interconnected nodes that process information similarly to biological neurons. Decision trees use branching logic to make predictions based on feature values. Support vector machines find optimal boundaries between different classes of data. The choice of algorithm depends on the problem type, data characteristics, and performance requirements.";

  const createChunks = (text: string, size: number) => {
    const words = text.split(' ');
    const chunks = [];
    for (let i = 0; i < words.length; i += size) {
      chunks.push(words.slice(i, i + size).join(' '));
    }
    return chunks;
  };

  const calculateRelevance = (chunk: string, query: string) => {
    const chunkWords = chunk.toLowerCase().split(' ');
    const queryWords = query.toLowerCase().split(' ');
    const matches = queryWords.filter(word => chunkWords.some(cWord => cWord.includes(word)));
    return matches.length / queryWords.length;
  };

  const chunks = createChunks(document, chunkSize);
  const totalChunks = chunks.length;

  const getChunkColor = (index: number, relevance: number) => {
    if (!showRelevance) {
      return hoveredChunk === index ? 'bg-blue-200' : 'bg-blue-100';
    }
    
    if (relevance > 0.6) return 'bg-emerald-200 border-emerald-400';
    if (relevance > 0.3) return 'bg-amber-200 border-amber-400';
    return 'bg-rose-200 border-rose-400';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Chunking Strategy Visualizer</h3>
        <p className="text-lg text-slate-600">Explore how chunk size affects retrieval precision and context in RAG systems</p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Chunk Size: {chunkSize} words ({totalChunks} chunks)
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>More Precise</span>
                <span>More Context</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Query:</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter search query..."
              />
            </div>

            <button
              onClick={() => setShowRelevance(!showRelevance)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showRelevance 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {showRelevance ? 'Hide Relevance Scores' : 'Show Relevance Scores'}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Document Chunks</h4>
          <div className="grid gap-3">
            {chunks.map((chunk, index) => {
              const relevance = calculateRelevance(chunk, query);
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${getChunkColor(index, relevance)}`}
                  onMouseEnter={() => setHoveredChunk(index)}
                  onMouseLeave={() => setHoveredChunk(null)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-slate-600">Chunk {index + 1}</span>
                    {showRelevance && (
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        relevance > 0.6 ? 'bg-emerald-600 text-white' :
                        relevance > 0.3 ? 'bg-amber-600 text-white' :
                        'bg-rose-600 text-white'
                      }`}>
                        {(relevance * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{chunk}</p>
                  <div className="mt-2 text-xs text-slate-500">
                    {chunk.split(' ').length} words
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showRelevance && (
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Retrieval Analysis</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">
                  {chunks.filter(chunk => calculateRelevance(chunk, query) > 0.6).length}
                </div>
                <div className="text-sm text-emerald-700">High Relevance</div>
                <div className="text-xs text-emerald-600">&gt;60% match</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {chunks.filter(chunk => calculateRelevance(chunk, query) > 0.3 && calculateRelevance(chunk, query) <= 0.6).length}
                </div>
                <div className="text-sm text-amber-700">Medium Relevance</div>
                <div className="text-xs text-amber-600">30-60% match</div>
              </div>
              <div className="text-center p-4 bg-rose-50 rounded-lg">
                <div className="text-2xl font-bold text-rose-600">
                  {chunks.filter(chunk => calculateRelevance(chunk, query) <= 0.3).length}
                </div>
                <div className="text-sm text-rose-700">Low Relevance</div>
                <div className="text-xs text-rose-600">&lt;30% match</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
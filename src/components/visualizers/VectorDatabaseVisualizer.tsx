"use client";

import { useState } from 'react';

export function VectorDatabaseVisualizer() {
  const [selectedText, setSelectedText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showVectors, setShowVectors] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const textItems = [
    { text: "Dog running in park", vector: [0.8, 0.2, 0.9, 0.1], category: "animals" },
    { text: "Cat playing with toy", vector: [0.7, 0.3, 0.8, 0.2], category: "animals" },
    { text: "Car driving fast", vector: [0.1, 0.9, 0.2, 0.8], category: "vehicles" },
    { text: "Airplane in sky", vector: [0.2, 0.8, 0.3, 0.7], category: "vehicles" },
    { text: "Happy birthday party", vector: [0.5, 0.1, 0.4, 0.9], category: "events" },
    { text: "Wedding celebration", vector: [0.6, 0.2, 0.3, 0.8], category: "events" }
  ];

  const calculateSimilarity = (vec1: number[], vec2: number[]): number => {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (mag1 * mag2);
  };

  const getQueryVector = (query: string): number[] => {
    if (query.toLowerCase().includes('dog') || query.toLowerCase().includes('pet')) return [0.75, 0.25, 0.85, 0.15];
    if (query.toLowerCase().includes('car') || query.toLowerCase().includes('drive')) return [0.15, 0.85, 0.25, 0.75];
    if (query.toLowerCase().includes('party') || query.toLowerCase().includes('celebration')) return [0.55, 0.15, 0.35, 0.85];
    return [0.5, 0.5, 0.5, 0.5];
  };

  const getSearchResults = () => {
    if (!searchQuery) return [];
    const queryVector = getQueryVector(searchQuery);
    return textItems
      .map(item => ({
        ...item,
        similarity: calculateSimilarity(item.vector, queryVector)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'animals': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'vehicles': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'events': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Vector Database</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how text is converted to vectors and how semantic similarity search works. Try searching to see the most similar items!
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        <div className="flex gap-4 items-center justify-center">
          <button
            onClick={() => setShowVectors(!showVectors)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showVectors 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {showVectors ? 'Hide' : 'Show'} Vectors
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {textItems.map((item, index) => (
            <div
              key={index}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedText === item.text
                  ? 'border-indigo-400 bg-indigo-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              } ${getCategoryColor(item.category)}`}
              onClick={() => setSelectedText(selectedText === item.text ? '' : item.text)}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="text-sm font-medium mb-2">{item.text}</div>
              {showVectors && (
                <div className="text-xs text-slate-600 space-y-1">
                  <div>Vector:</div>
                  <div className="grid grid-cols-4 gap-1">
                    {item.vector.map((val, i) => (
                      <div
                        key={i}
                        className="bg-slate-100 px-1 py-0.5 rounded text-center"
                        style={{ backgroundColor: `rgba(99, 102, 241, ${val})` }}
                      >
                        {val.toFixed(1)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {hoveredItem === index && (
                <div className="mt-2 text-xs text-slate-500">
                  Category: {item.category}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h4 className="font-semibold text-slate-800 mb-4">Semantic Search</h4>
          <input
            type="text"
            placeholder="Try: 'pet animals', 'vehicles', or 'celebration'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          
          {searchQuery && (
            <div className="mt-4 space-y-3">
              <h5 className="font-medium text-slate-700">Most Similar Results:</h5>
              {getSearchResults().map((result, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
                >
                  <span className="text-sm">{result.text}</span>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-slate-600">
                      {(result.similarity * 100).toFixed(1)}% match
                    </div>
                    <div 
                      className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden"
                    >
                      <div
                        className="h-full bg-indigo-500 transition-all duration-300"
                        style={{ width: `${result.similarity * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedText && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h5 className="font-medium text-amber-800 mb-2">Selected: "{selectedText}"</h5>
            <p className="text-sm text-amber-700">
              This text has been converted to a 4-dimensional vector. In real vector databases, 
              embeddings typically have 768-4096 dimensions, capturing much more semantic nuance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
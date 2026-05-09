"use client";

import { useState, useMemo } from 'react';

export function EmbeddingsVisualizer() {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [showSimilarities, setShowSimilarities] = useState(false);
  const [animateSearch, setAnimateSearch] = useState(false);

  // Predefined words with their 2D embeddings (simplified for visualization)
  const words = [
    { text: 'dog', x: 150, y: 120, category: 'animal' },
    { text: 'puppy', x: 180, y: 140, category: 'animal' },
    { text: 'cat', x: 120, y: 160, category: 'animal' },
    { text: 'kitten', x: 140, y: 180, category: 'animal' },
    { text: 'car', x: 350, y: 200, category: 'vehicle' },
    { text: 'truck', x: 380, y: 220, category: 'vehicle' },
    { text: 'vehicle', x: 365, y: 180, category: 'vehicle' },
    { text: 'apple', x: 250, y: 80, category: 'food' },
    { text: 'fruit', x: 230, y: 60, category: 'food' },
    { text: 'orange', x: 280, y: 90, category: 'food' },
    { text: 'happy', x: 100, y: 300, category: 'emotion' },
    { text: 'joy', x: 120, y: 320, category: 'emotion' },
    { text: 'sad', x: 350, y: 320, category: 'emotion' },
  ];

  const calculateDistance = (word1: any, word2: any) => {
    return Math.sqrt(Math.pow(word1.x - word2.x, 2) + Math.pow(word1.y - word2.y, 2));
  };

  const similarities = useMemo(() => {
    if (!selectedWord) return [];
    const selected = words.find(w => w.text === selectedWord);
    if (!selected) return [];

    return words
      .filter(w => w.text !== selectedWord)
      .map(word => ({
        word: word.text,
        distance: calculateDistance(selected, word),
        similarity: Math.max(0, 100 - calculateDistance(selected, word) / 3)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);
  }, [selectedWord]);

  const handleWordClick = (word: string) => {
    setSelectedWord(word);
    setShowSimilarities(true);
    setAnimateSearch(true);
    setTimeout(() => setAnimateSearch(false), 1000);
  };

  const getColorByCategory = (category: string) => {
    const colors = {
      animal: 'bg-emerald-500',
      vehicle: 'bg-blue-500',
      food: 'bg-amber-500',
      emotion: 'bg-rose-500'
    };
    return colors[category as keyof typeof colors] || 'bg-slate-500';
  };

  const getConnectionOpacity = (word: any) => {
    if (!selectedWord || !showSimilarities) return 0;
    const selected = words.find(w => w.text === selectedWord);
    if (!selected) return 0;
    
    const distance = calculateDistance(selected, word);
    const maxDistance = 300;
    return Math.max(0, 1 - distance / maxDistance);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Embeddings Visualization</h3>
        <p className="text-slate-600 max-w-2xl">
          Click on any word to see how embeddings represent semantic similarity as geometric distance. 
          Similar words cluster together in the vector space.
        </p>
      </div>

      <div className="flex gap-8 w-full max-w-6xl">
        {/* Vector Space */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">2D Embedding Space</h4>
          <div className="relative w-full h-96 bg-white rounded-lg border-2 border-slate-200 overflow-hidden">
            {/* Grid lines */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Connection lines */}
            {selectedWord && showSimilarities && words.map(word => {
              const selected = words.find(w => w.text === selectedWord);
              if (!selected || word.text === selectedWord) return null;
              
              const opacity = getConnectionOpacity(word);
              if (opacity < 0.1) return null;

              return (
                <svg key={word.text} className="absolute inset-0 w-full h-full pointer-events-none">
                  <line
                    x1={selected.x}
                    y1={selected.y}
                    x2={word.x}
                    y2={word.y}
                    stroke="#6366f1"
                    strokeWidth="2"
                    opacity={opacity}
                    className={animateSearch ? "animate-pulse" : ""}
                  />
                </svg>
              );
            })}

            {/* Words */}
            {words.map(word => (
              <div
                key={word.text}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                  selectedWord === word.text 
                    ? 'scale-125 z-10' 
                    : selectedWord && showSimilarities && getConnectionOpacity(word) > 0.3
                      ? 'scale-110'
                      : 'hover:scale-105'
                }`}
                style={{ left: word.x, top: word.y }}
                onClick={() => handleWordClick(word.text)}
              >
                <div className={`px-3 py-2 rounded-full text-white text-sm font-medium shadow-lg ${getColorByCategory(word.category)} ${
                  selectedWord === word.text ? 'ring-4 ring-indigo-300' : ''
                }`}>
                  {word.text}
                </div>
              </div>
            ))}

            {/* Search radius visualization */}
            {selectedWord && showSimilarities && (
              <div className="absolute pointer-events-none">
                {(() => {
                  const selected = words.find(w => w.text === selectedWord);
                  if (!selected) return null;
                  return (
                    <div
                      className="absolute border-2 border-indigo-300 rounded-full opacity-30 animate-ping"
                      style={{
                        left: selected.x - 100,
                        top: selected.y - 100,
                        width: 200,
                        height: 200
                      }}
                    />
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Similarity Results */}
        <div className="w-80">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Nearest Neighbors</h4>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            {!selectedWord ? (
              <p className="text-slate-500 text-center py-8">Click a word to find similar embeddings</p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span className="font-semibold text-slate-800">Selected: {selectedWord}</span>
                </div>
                
                <div className="space-y-3">
                  {similarities.map((item, index) => (
                    <div 
                      key={item.word} 
                      className={`flex items-center justify-between p-3 rounded-lg bg-slate-50 transition-all duration-500 ${
                        animateSearch ? 'animate-pulse' : ''
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-600">#{index + 1}</span>
                        <span className="font-medium text-slate-800">{item.word}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 transition-all duration-700"
                            style={{ width: `${item.similarity}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 w-10">
                          {Math.round(item.similarity)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>Distance Formula:</strong> √[(x₁-x₂)² + (y₁-y₂)²]
                    <br />
                    <strong>Similarity:</strong> Closer distance = Higher similarity
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 bg-white rounded-lg border border-slate-200 p-4">
            <h5 className="font-semibold text-slate-700 mb-3">Categories</h5>
            <div className="grid grid-cols-2 gap-2">
              {['animal', 'vehicle', 'food', 'emotion'].map(category => (
                <div key={category} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getColorByCategory(category)}`}></div>
                  <span className="text-sm text-slate-600 capitalize">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          setSelectedWord(null);
          setShowSimilarities(false);
          setAnimateSearch(false);
        }}
        className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
      >
        Reset Visualization
      </button>
    </div>
  );
}
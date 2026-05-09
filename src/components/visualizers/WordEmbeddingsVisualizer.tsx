"use client";

import { useState } from 'react';

export function WordEmbeddingsVisualizer() {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [showAnalogy, setShowAnalogy] = useState(false);

  // Pre-computed 2D embeddings for visualization (simplified from higher dimensions)
  const embeddings: Record<string, [number, number]> = {
    'king': [0.8, 0.6],
    'queen': [0.7, -0.4],
    'man': [0.5, 0.8],
    'woman': [0.4, -0.2],
    'prince': [0.9, 0.3],
    'princess': [0.8, -0.7],
    'dog': [-0.6, 0.4],
    'cat': [-0.5, 0.2],
    'puppy': [-0.7, 0.6],
    'kitten': [-0.6, 0.0],
    'apple': [-0.3, -0.8],
    'orange': [-0.1, -0.6],
    'fruit': [-0.2, -0.9],
    'car': [0.1, 0.9],
    'vehicle': [0.0, 0.7],
  };

  const calculateDistance = (word1: string, word2: string): number => {
    const [x1, y1] = embeddings[word1];
    const [x2, y2] = embeddings[word2];
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  };

  const getNearestWords = (word: string, count: number = 3): string[] => {
    if (!embeddings[word]) return [];
    
    const distances = Object.keys(embeddings)
      .filter(w => w !== word)
      .map(w => ({ word: w, distance: calculateDistance(word, w) }))
      .sort((a, b) => a.distance - b.distance);
    
    return distances.slice(0, count).map(d => d.word);
  };

  const mapToPixels = (coords: [number, number]): [number, number] => {
    const [x, y] = coords;
    return [(x + 1) * 150 + 50, (-y + 1) * 150 + 50];
  };

  const getWordCategory = (word: string): string => {
    if (['king', 'queen', 'man', 'woman', 'prince', 'princess'].includes(word)) return 'people';
    if (['dog', 'cat', 'puppy', 'kitten'].includes(word)) return 'animals';
    if (['apple', 'orange', 'fruit'].includes(word)) return 'food';
    if (['car', 'vehicle'].includes(word)) return 'transport';
    return 'other';
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'people': return 'bg-rose-500';
      case 'animals': return 'bg-emerald-500';
      case 'food': return 'bg-amber-500';
      case 'transport': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  const renderAnalogyVector = () => {
    if (!showAnalogy) return null;
    
    const kingPos = mapToPixels(embeddings['king']);
    const queenPos = mapToPixels(embeddings['queen']);
    const manPos = mapToPixels(embeddings['man']);
    const womanPos = mapToPixels(embeddings['woman']);
    
    return (
      <>
        {/* King to Queen vector */}
        <line
          x1={kingPos[0]} y1={kingPos[1]}
          x2={queenPos[0]} y2={queenPos[1]}
          stroke="#e11d48" strokeWidth="3" markerEnd="url(#arrowhead)"
        />
        {/* Man to Woman vector */}
        <line
          x1={manPos[0]} y1={manPos[1]}
          x2={womanPos[0]} y2={womanPos[1]}
          stroke="#e11d48" strokeWidth="3" markerEnd="url(#arrowhead)"
        />
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" 
            refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#e11d48" />
          </marker>
        </defs>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Word Embeddings</h3>
        <p className="text-lg text-slate-600">
          Interactive visualization of words in vector space - click words to explore relationships
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Vector Space Visualization */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-semibold text-slate-700">2D Vector Space</h4>
              <button
                onClick={() => setShowAnalogy(!showAnalogy)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showAnalogy 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {showAnalogy ? 'Hide' : 'Show'} King-Queen Analogy
              </button>
            </div>
            
            <svg width="400" height="350" className="border border-slate-200 rounded">
              {/* Grid */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Axes */}
              <line x1="50" y1="200" x2="350" y2="200" stroke="#64748b" strokeWidth="2"/>
              <line x1="200" y1="50" x2="200" y2="350" stroke="#64748b" strokeWidth="2"/>
              
              {/* Analogy vectors */}
              {renderAnalogyVector()}
              
              {/* Word points */}
              {Object.entries(embeddings).map(([word, coords]) => {
                const [x, y] = mapToPixels(coords);
                const category = getWordCategory(word);
                const isSelected = selectedWord === word;
                const isHovered = hoveredWord === word;
                const isNearSelected = selectedWord && getNearestWords(selectedWord).includes(word);
                
                return (
                  <g key={word}>
                    <circle
                      cx={x} cy={y} r={isSelected ? 10 : isHovered ? 8 : 6}
                      className={`cursor-pointer transition-all ${getCategoryColor(category)} ${
                        isSelected ? 'ring-4 ring-indigo-300' : 
                        isNearSelected ? 'ring-2 ring-blue-300' : ''
                      }`}
                      onMouseEnter={() => setHoveredWord(word)}
                      onMouseLeave={() => setHoveredWord(null)}
                      onClick={() => setSelectedWord(selectedWord === word ? null : word)}
                    />
                    <text
                      x={x} y={y - 15}
                      textAnchor="middle"
                      className={`text-sm font-medium cursor-pointer ${
                        isSelected ? 'text-indigo-700 font-bold' : 
                        isNearSelected ? 'text-blue-600' : 'text-slate-700'
                      }`}
                      onClick={() => setSelectedWord(selectedWord === word ? null : word)}
                    >
                      {word}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Information Panel */}
        <div className="w-full lg:w-80 space-y-4">
          {/* Legend */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="text-lg font-semibold text-slate-700 mb-3">Categories</h4>
            <div className="space-y-2">
              {[
                { name: 'People', category: 'people' },
                { name: 'Animals', category: 'animals' },
                { name: 'Food', category: 'food' },
                { name: 'Transport', category: 'transport' }
              ].map(({ name, category }) => (
                <div key={name} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${getCategoryColor(category)}`}></div>
                  <span className="text-sm text-slate-600">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Word Info */}
          {selectedWord && (
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <h4 className="text-lg font-semibold text-slate-700 mb-3">
                Word: <span className="text-indigo-600">{selectedWord}</span>
              </h4>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Vector Coordinates:</p>
                  <p className="text-sm text-slate-700 font-mono bg-slate-100 px-2 py-1 rounded">
                    [{embeddings[selectedWord][0].toFixed(2)}, {embeddings[selectedWord][1].toFixed(2)}]
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Nearest Words:</p>
                  <div className="space-y-1">
                    {getNearestWords(selectedWord).map((word, index) => (
                      <div key={word} className="flex justify-between items-center text-sm">
                        <span className="text-slate-700">{index + 1}. {word}</span>
                        <span className="text-slate-500 font-mono">
                          {calculateDistance(selectedWord, word).toFixed(3)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-indigo-50 rounded-lg border border-indigo-200 p-4">
            <h4 className="text-lg font-semibold text-indigo-700 mb-2">How to Explore</h4>
            <ul className="text-sm text-indigo-600 space-y-1">
              <li>• Click words to see nearest neighbors</li>
              <li>• Notice semantic clusters (people, animals, etc.)</li>
              <li>• Toggle analogy vectors to see king-queen relationship</li>
              <li>• Similar words appear closer together</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
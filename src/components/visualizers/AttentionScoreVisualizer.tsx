"use client";
import { useState } from 'react';

export function AttentionScoreVisualizer() {
  const [selectedQuery, setSelectedQuery] = useState(0);
  const [hoveredKey, setHoveredKey] = useState(-1);
  const [temperature, setTemperature] = useState(1.0);
  
  // Sample sequence: "The cat sat"
  const tokens = ["The", "cat", "sat"];
  
  // Predefined Query, Key, and Value vectors (simplified to 3D for visualization)
  const queries = [
    [0.8, 0.2, 0.3],  // "The"
    [0.1, 0.9, 0.4],  // "cat"
    [0.3, 0.2, 0.8]   // "sat"
  ];
  
  const keys = [
    [0.7, 0.1, 0.2],  // "The"
    [0.2, 0.8, 0.3],  // "cat"
    [0.4, 0.3, 0.9]   // "sat"
  ];
  
  const values = [
    [0.9, 0.1, 0.1],  // "The"
    [0.1, 0.8, 0.2],  // "cat"
    [0.2, 0.3, 0.7]   // "sat"
  ];

  // Calculate attention scores (dot product of query and key)
  const calculateAttentionScore = (queryIdx: number, keyIdx: number) => {
    const q = queries[queryIdx];
    const k = keys[keyIdx];
    return q[0] * k[0] + q[1] * k[1] + q[2] * k[2];
  };

  // Calculate softmax for attention weights
  const calculateAttentionWeights = (queryIdx: number) => {
    const scores = tokens.map((_, keyIdx) => calculateAttentionScore(queryIdx, keyIdx));
    const scaledScores = scores.map(score => score / temperature);
    const expScores = scaledScores.map(score => Math.exp(score));
    const sumExp = expScores.reduce((sum, exp) => sum + exp, 0);
    return expScores.map(exp => exp / sumExp);
  };

  const attentionWeights = calculateAttentionWeights(selectedQuery);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Attention Score Mechanism</h3>
        <p className="text-slate-600">
          Explore how each token queries and attends to other tokens in the sequence
        </p>
      </div>

      {/* Temperature Control */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-slate-700">Temperature:</label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-32"
        />
        <span className="text-sm text-slate-600">{temperature.toFixed(1)}</span>
      </div>

      {/* Sequence Tokens */}
      <div className="flex gap-4 mb-4">
        {tokens.map((token, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedQuery(idx)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedQuery === idx
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            {token}
          </button>
        ))}
      </div>

      {/* Query Vector Display */}
      <div className="bg-white rounded-lg p-4 border border-slate-200 w-full max-w-md">
        <h4 className="font-semibold text-slate-800 mb-2">
          Query Vector for "{tokens[selectedQuery]}"
        </h4>
        <div className="flex gap-2">
          {queries[selectedQuery].map((val, idx) => (
            <div
              key={idx}
              className="flex-1 bg-blue-100 rounded p-2 text-center"
              style={{
                backgroundColor: `rgba(59, 130, 246, ${val})`,
                color: val > 0.5 ? 'white' : 'black'
              }}
            >
              {val.toFixed(2)}
            </div>
          ))}
        </div>
      </div>

      {/* Attention Matrix */}
      <div className="bg-white rounded-lg p-6 border border-slate-200 w-full max-w-2xl">
        <h4 className="font-semibold text-slate-800 mb-4 text-center">
          Attention Scores & Weights
        </h4>
        
        <div className="grid grid-cols-4 gap-2 text-sm">
          <div></div>
          {tokens.map((token, idx) => (
            <div key={idx} className="text-center font-medium text-slate-700 p-2">
              {token}
            </div>
          ))}
          
          <div className="font-medium text-slate-700 p-2 text-center">
            {tokens[selectedQuery]}
          </div>
          
          {tokens.map((_, keyIdx) => {
            const score = calculateAttentionScore(selectedQuery, keyIdx);
            const weight = attentionWeights[keyIdx];
            const isHovered = hoveredKey === keyIdx;
            
            return (
              <div
                key={keyIdx}
                className="p-3 rounded-lg border-2 transition-all cursor-pointer"
                style={{
                  backgroundColor: `rgba(34, 197, 94, ${weight})`,
                  borderColor: isHovered ? '#3b82f6' : 'transparent'
                }}
                onMouseEnter={() => setHoveredKey(keyIdx)}
                onMouseLeave={() => setHoveredKey(-1)}
              >
                <div className="text-xs text-slate-600">Score:</div>
                <div className="font-medium text-slate-800">{score.toFixed(3)}</div>
                <div className="text-xs text-slate-600 mt-1">Weight:</div>
                <div className="font-medium text-slate-800">{weight.toFixed(3)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Vector Display (when hovering) */}
      {hoveredKey >= 0 && (
        <div className="bg-white rounded-lg p-4 border border-slate-200 w-full max-w-md">
          <h4 className="font-semibold text-slate-800 mb-2">
            Key Vector for "{tokens[hoveredKey]}"
          </h4>
          <div className="flex gap-2">
            {keys[hoveredKey].map((val, idx) => (
              <div
                key={idx}
                className="flex-1 bg-emerald-100 rounded p-2 text-center"
                style={{
                  backgroundColor: `rgba(34, 197, 94, ${val})`,
                  color: val > 0.5 ? 'white' : 'black'
                }}
              >
                {val.toFixed(2)}
              </div>
            ))}
          </div>
          <div className="mt-3 text-sm text-slate-600">
            Dot Product: {queries[selectedQuery].map((q, idx) => 
              `${q.toFixed(2)} × ${keys[hoveredKey][idx].toFixed(2)}`
            ).join(' + ')} = {calculateAttentionScore(selectedQuery, hoveredKey).toFixed(3)}
          </div>
        </div>
      )}

      <div className="text-sm text-slate-600 max-w-2xl text-center">
        Click tokens to change the query position. Hover over attention scores to see the key vectors and dot product calculation. 
        Adjust temperature to see how it affects the attention distribution.
      </div>
    </div>
  );
}
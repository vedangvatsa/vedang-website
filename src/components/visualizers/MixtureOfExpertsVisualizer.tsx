"use client";

import React, { useState, useEffect } from 'react';

export function MixtureOfExpertsVisualizer() {
  const [selectedToken, setSelectedToken] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeExperts, setActiveExperts] = useState<number[]>([]);
  const [showRouting, setShowRouting] = useState(false);
  const [topK, setTopK] = useState(2);

  const tokens = ["The", "cat", "quickly", "climbed", "the", "tree"];
  const experts = [
    { id: 0, name: "Grammar", specialty: "Articles, pronouns", color: "bg-blue-500" },
    { id: 1, name: "Animals", specialty: "Animal-related words", color: "bg-emerald-500" },
    { id: 2, name: "Actions", specialty: "Verbs, adverbs", color: "bg-rose-500" },
    { id: 3, name: "Objects", specialty: "Nouns, things", color: "bg-amber-500" },
    { id: 4, name: "Descriptors", specialty: "Adjectives", color: "bg-indigo-500" },
    { id: 5, name: "Spatial", specialty: "Location, direction", color: "bg-slate-500" }
  ];

  // Router logic - determines which experts are most relevant for each token
  const getExpertScores = (tokenIndex: number) => {
    const tokenExpertScores = [
      [0.9, 0.1, 0.0, 0.0, 0.0, 0.0], // "The" - Grammar heavy
      [0.1, 0.8, 0.0, 0.1, 0.0, 0.0], // "cat" - Animals heavy
      [0.0, 0.0, 0.7, 0.0, 0.3, 0.0], // "quickly" - Actions + Descriptors
      [0.1, 0.0, 0.8, 0.1, 0.0, 0.0], // "climbed" - Actions heavy
      [0.9, 0.0, 0.0, 0.1, 0.0, 0.0], // "the" - Grammar heavy
      [0.0, 0.0, 0.0, 0.7, 0.0, 0.3]  // "tree" - Objects + Spatial
    ];
    return tokenExpertScores[tokenIndex] || [0, 0, 0, 0, 0, 0];
  };

  const getTopKExperts = (scores: number[], k: number) => {
    return scores
      .map((score, index) => ({ score, index }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map(item => item.index);
  };

  useEffect(() => {
    const scores = getExpertScores(selectedToken);
    const topExperts = getTopKExperts(scores, topK);
    setActiveExperts(topExperts);
  }, [selectedToken, topK]);

  const handleTokenSelect = (tokenIndex: number) => {
    setSelectedToken(tokenIndex);
    setIsAnimating(true);
    setShowRouting(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const handleAutoRoute = () => {
    setShowRouting(true);
    let currentToken = 0;
    const interval = setInterval(() => {
      setSelectedToken(currentToken);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 800);
      currentToken++;
      if (currentToken >= tokens.length) {
        clearInterval(interval);
        setShowRouting(false);
      }
    }, 1500);
  };

  const scores = getExpertScores(selectedToken);
  const totalActiveParams = activeExperts.length * 8.3; // 8.3B params per expert
  const totalParams = experts.length * 8.3; // Total possible params
  const efficiency = ((totalParams - totalActiveParams) / totalParams * 100).toFixed(1);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Mixture of Experts (MoE)</h3>
        <p className="text-slate-600 max-w-2xl">
          Click on tokens to see how the router network selectively activates only the most relevant expert networks, 
          achieving parameter efficiency by using a fraction of the total model capacity.
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Top-K Experts:</label>
          <input
            type="range"
            min="1"
            max="4"
            value={topK}
            onChange={(e) => setTopK(parseInt(e.target.value))}
            className="w-20"
          />
          <span className="text-sm font-mono text-slate-800">{topK}</span>
        </div>
        <button
          onClick={handleAutoRoute}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          Auto Route All
        </button>
      </div>

      {/* Input Tokens */}
      <div className="w-full max-w-4xl">
        <h4 className="text-lg font-semibold text-slate-700 mb-4 text-center">Input Tokens</h4>
        <div className="flex gap-3 justify-center flex-wrap">
          {tokens.map((token, index) => (
            <button
              key={index}
              onClick={() => handleTokenSelect(index)}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${
                selectedToken === index
                  ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              {token}
            </button>
          ))}
        </div>
      </div>

      {/* Router Network Visualization */}
      {showRouting && (
        <div className="w-full max-w-4xl">
          <h4 className="text-lg font-semibold text-slate-700 mb-4 text-center">Router Network Scores</h4>
          <div className="grid grid-cols-6 gap-3">
            {experts.map((expert, index) => (
              <div key={expert.id} className="text-center">
                <div className="h-24 bg-slate-200 rounded-lg relative overflow-hidden">
                  <div
                    className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ${expert.color} opacity-80`}
                    style={{ height: `${scores[index] * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white drop-shadow">
                      {scores[index].toFixed(2)}
                    </span>
                  </div>
                </div>
                <p className="text-xs font-semibold mt-2 text-slate-700">{expert.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expert Networks */}
      <div className="w-full max-w-4xl">
        <h4 className="text-lg font-semibold text-slate-700 mb-4 text-center">Expert Networks</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {experts.map((expert) => {
            const isActive = activeExperts.includes(expert.id);
            return (
              <div
                key={expert.id}
                className={`p-4 rounded-lg border-2 transition-all duration-500 ${
                  isActive
                    ? `${expert.color} text-white shadow-lg transform scale-105`
                    : 'bg-white border-slate-300 text-slate-700'
                } ${isAnimating && isActive ? 'animate-pulse' : ''}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-white' : expert.color}`} />
                  <h5 className="font-semibold text-sm">{expert.name}</h5>
                </div>
                <p className={`text-xs ${isActive ? 'text-white' : 'text-slate-500'}`}>
                  {expert.specialty}
                </p>
                <div className="mt-2 text-xs font-mono">
                  8.3B params
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Efficiency Metrics */}
      <div className="w-full max-w-2xl bg-white rounded-lg p-6 border border-slate-200">
        <h4 className="text-lg font-semibold text-slate-700 mb-4 text-center">Parameter Efficiency</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{totalParams.toFixed(1)}B</div>
            <div className="text-xs text-slate-600">Total Parameters</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">{totalActiveParams.toFixed(1)}B</div>
            <div className="text-xs text-slate-600">Active Parameters</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-600">{efficiency}%</div>
            <div className="text-xs text-slate-600">Parameters Saved</div>
          </div>
        </div>
        <div className="mt-4 bg-slate-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${(totalActiveParams / totalParams) * 100}%` }}
          />
        </div>
        <p className="text-xs text-slate-600 text-center mt-2">
          Only {((totalActiveParams / totalParams) * 100).toFixed(1)}% of model parameters active per token
        </p>
      </div>
    </div>
  );
}
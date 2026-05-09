"use client";

import { useState } from 'react';

export function SparseExpertVisualizer() {
  const [selectedInput, setSelectedInput] = useState(0);
  const [topK, setTopK] = useState(2);
  const [animating, setAnimating] = useState(false);

  const inputs = [
    { text: "Code Question", pattern: [0.9, 0.1, 0.2, 0.8, 0.1, 0.3, 0.2, 0.1] },
    { text: "Math Problem", pattern: [0.2, 0.8, 0.9, 0.3, 0.1, 0.7, 0.1, 0.2] },
    { text: "Creative Writing", pattern: [0.1, 0.3, 0.2, 0.1, 0.9, 0.8, 0.6, 0.4] },
    { text: "Data Analysis", pattern: [0.6, 0.7, 0.8, 0.2, 0.1, 0.3, 0.9, 0.8] }
  ];

  const experts = [
    { name: "Programming", color: "bg-blue-500", specialty: "Code & Logic" },
    { name: "Mathematics", color: "bg-indigo-500", specialty: "Calculations" },
    { name: "Science", color: "bg-emerald-500", specialty: "Analysis" },
    { name: "Language", color: "bg-rose-500", specialty: "Text Processing" },
    { name: "Creative", color: "bg-amber-500", specialty: "Generation" },
    { name: "Reasoning", color: "bg-slate-500", specialty: "Logic" },
    { name: "Data", color: "bg-blue-600", specialty: "Statistics" },
    { name: "Pattern", color: "bg-indigo-600", specialty: "Recognition" }
  ];

  const currentInput = inputs[selectedInput];
  const expertScores = currentInput.pattern;
  const sortedExperts = experts.map((expert, idx) => ({
    ...expert,
    score: expertScores[idx],
    index: idx
  })).sort((a, b) => b.score - a.score);

  const activeExperts = sortedExperts.slice(0, topK);
  const inactiveExperts = sortedExperts.slice(topK);

  const handleRoute = async () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Sparse Expert Routing</h3>
        <p className="text-slate-600">See how a gating network routes inputs to the most relevant expert modules</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Input Selection */}
        <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-4">Input Selection</h4>
          <div className="grid grid-cols-2 gap-3">
            {inputs.map((input, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedInput(idx)}
                className={`p-3 rounded-lg text-sm font-medium transition-all ${
                  selectedInput === idx
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {input.text}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Top-K Experts: {topK}
            </label>
            <input
              type="range"
              min="1"
              max="4"
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <button
            onClick={handleRoute}
            className="w-full mt-4 bg-indigo-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-600 transition-colors"
          >
            Route Input
          </button>
        </div>

        {/* Gating Network */}
        <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-4">Gating Network Scores</h4>
          <div className="space-y-3">
            {expertScores.map((score, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-16 text-sm font-medium text-slate-600">
                  {experts[idx].name}
                </div>
                <div className="flex-1 bg-slate-200 rounded-full h-3 relative overflow-hidden">
                  <div
                    className={`h-full ${experts[idx].color} transition-all duration-500 ${
                      animating ? 'animate-pulse' : ''
                    }`}
                    style={{ width: `${score * 100}%` }}
                  />
                </div>
                <div className="w-12 text-sm font-mono text-slate-600">
                  {score.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expert Modules */}
        <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-4">Expert Modules</h4>
          
          <div className="mb-4">
            <h5 className="text-sm font-medium text-emerald-600 mb-2">Active Experts ({topK})</h5>
            <div className="grid grid-cols-1 gap-2">
              {activeExperts.map((expert) => (
                <div
                  key={expert.index}
                  className={`p-3 rounded-lg border-2 transition-all duration-500 ${
                    animating ? 'scale-105 shadow-lg' : 'scale-100'
                  } bg-emerald-50 border-emerald-200`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${expert.color}`} />
                    <span className="font-medium text-slate-800">{expert.name}</span>
                    <span className="ml-auto text-sm font-mono text-emerald-600">
                      {expert.score.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">{expert.specialty}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-sm font-medium text-slate-400 mb-2">Inactive Experts</h5>
            <div className="grid grid-cols-2 gap-2">
              {inactiveExperts.map((expert) => (
                <div
                  key={expert.index}
                  className="p-2 rounded-lg bg-slate-100 opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${expert.color}`} />
                    <span className="text-xs text-slate-600">{expert.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-100 rounded-lg">
            <div className="text-xs text-slate-600">
              <div>Efficiency: {((topK / experts.length) * 100).toFixed(0)}% of parameters active</div>
              <div>Sparsity: {experts.length - topK}/{experts.length} experts pruned</div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-slate-600 max-w-4xl">
        This visualization shows how sparse expert routing works: the gating network evaluates each input and activates only the top-K most relevant experts,
        dramatically reducing computational cost while maintaining specialized knowledge across domains.
      </div>
    </div>
  );
}
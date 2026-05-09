"use client";

import React, { useState } from 'react';

export function GitVisualizer() {
  const [commits, setCommits] = useState([
    { id: 'a1b2c3', msg: 'Initial commit', branch: 'main', x: 100, y: 200 },
    { id: 'd4e5f6', msg: 'Add login page', branch: 'main', x: 200, y: 200 },
    { id: 'g7h8i9', msg: 'Add feature flag', branch: 'feature', x: 300, y: 120 },
    { id: 'j1k2l3', msg: 'Fix navbar bug', branch: 'main', x: 300, y: 200 },
    { id: 'm4n5o6', msg: 'Style updates', branch: 'feature', x: 400, y: 120 },
    { id: 'p7q8r9', msg: 'Update tests', branch: 'main', x: 400, y: 200 },
  ]);
  const [merged, setMerged] = useState(false);
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null);
  const [showConflict, setShowConflict] = useState(false);

  const edges = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 5 },
  ];

  const handleMerge = () => {
    if (!merged) {
      setShowConflict(true);
      setTimeout(() => {
        setShowConflict(false);
        setMerged(true);
        setCommits(prev => [...prev, {
          id: 's1t2u3',
          msg: 'Merge feature → main',
          branch: 'merge',
          x: 500,
          y: 200
        }]);
      }, 1500);
    }
  };

  const resetGraph = () => {
    setMerged(false);
    setShowConflict(false);
    setSelectedCommit(null);
    setCommits(c => c.filter(commit => commit.id !== 's1t2u3'));
  };

  const branchColors: Record<string, string> = {
    main: '#3b82f6',
    feature: '#8b5cf6',
    merge: '#22c55e',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Git Branching and Merging</h3>
        <p className="text-slate-600 max-w-2xl">Visualize how branches diverge and merge in version control</p>
      </div>

      <div className="w-full max-w-2xl">
        <svg viewBox="0 0 600 320" className="w-full border border-slate-200 rounded-xl bg-white">
          {/* Branch labels */}
          <text x={20} y={125} fontSize="11" fill="#8b5cf6" fontWeight="600">feature</text>
          <text x={20} y={205} fontSize="11" fill="#3b82f6" fontWeight="600">main</text>

          {/* Branch lines */}
          <line x1={80} y1={200} x2={merged ? 520 : 420} y2={200} stroke="#3b82f6" strokeWidth="3" opacity={0.3} />
          <line x1={200} y1={200} x2={200} y2={120} stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 3" opacity={0.4} />
          <line x1={200} y1={120} x2={420} y2={120} stroke="#8b5cf6" strokeWidth="3" opacity={0.3} />

          {/* Merge arrow */}
          {merged && (
            <line x1={420} y1={120} x2={500} y2={200} stroke="#22c55e" strokeWidth="2.5" strokeDasharray="6 3" />
          )}

          {/* Conflict flash */}
          {showConflict && (
            <g transform="translate(460, 160)">
              <rect x={-50} y={-20} width={100} height={40} rx={8} fill="#fef2f2" stroke="#ef4444" strokeWidth="2">
                <animate attributeName="opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite" />
              </rect>
              <text textAnchor="middle" y={5} fontSize="10" fill="#dc2626" fontWeight="bold">⚡ Resolving...</text>
            </g>
          )}

          {/* Edge lines */}
          {edges.map(({ from, to }, i) => (
            <line
              key={i}
              x1={commits[from].x} y1={commits[from].y}
              x2={commits[to].x} y2={commits[to].y}
              stroke={branchColors[commits[to].branch]}
              strokeWidth="2"
              opacity={0.5}
            />
          ))}
          {merged && (
            <>
              <line x1={commits[4].x} y1={commits[4].y} x2={500} y2={200} stroke="#22c55e" strokeWidth="2" opacity={0.5} />
              <line x1={commits[5].x} y1={commits[5].y} x2={500} y2={200} stroke="#22c55e" strokeWidth="2" opacity={0.5} />
            </>
          )}

          {/* Commit nodes */}
          {commits.map((commit) => {
            const isSelected = selectedCommit === commit.id;
            const color = branchColors[commit.branch];
            return (
              <g
                key={commit.id}
                transform={`translate(${commit.x}, ${commit.y})`}
                onClick={() => setSelectedCommit(isSelected ? null : commit.id)}
                className="cursor-pointer"
              >
                {isSelected && (
                  <circle r={22} fill={color} opacity={0.15}>
                    <animate attributeName="r" from="18" to="28" dur="1.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.2" to="0" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle r={16} fill={color} />
                <text y={1} textAnchor="middle" fontSize="7" fill="white" fontWeight="600">
                  {commit.id.slice(0, 4)}
                </text>
                <text y={35} textAnchor="middle" fontSize="8" fill="#64748b" className="select-none">
                  {commit.msg}
                </text>
              </g>
            );
          })}

          {/* Legend */}
          <g transform="translate(20, 280)">
            {Object.entries(branchColors).map(([name, color], i) => (
              <g key={name} transform={`translate(${i * 120}, 0)`}>
                <circle r={6} fill={color} cx={6} cy={0} />
                <text x={18} y={4} fontSize="10" fill="#64748b">{name}</text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      {selectedCommit && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 max-w-md">
          <div className="font-mono text-sm text-indigo-800 font-semibold">
            commit {selectedCommit}
          </div>
          <div className="text-indigo-700 text-sm mt-1">
            {commits.find(c => c.id === selectedCommit)?.msg}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleMerge}
          disabled={merged || showConflict}
          className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium transition-all"
        >
          🔀 Merge Feature Branch
        </button>
        <button
          onClick={resetGraph}
          className="px-5 py-2.5 bg-slate-500 text-white rounded-lg hover:bg-slate-600 font-medium transition-all"
        >
          ↺ Reset
        </button>
      </div>

      <p className="text-slate-500 text-sm text-center max-w-xl">
        Git tracks every change as a commit on a branch. Developers create feature branches to work independently, then merge changes back. Click any commit to inspect it, or merge the feature branch to see how parallel work combines.
      </p>
    </div>
  );
}

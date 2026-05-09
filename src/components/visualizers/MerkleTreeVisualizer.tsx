"use client";

import React, { useState, useEffect } from 'react';

export function MerkleTreeVisualizer() {
  const [selectedData, setSelectedData] = useState<string[]>(['A', 'B', 'C', 'D']);
  const [highlightedPath, setHighlightedPath] = useState<number[]>([]);
  const [selectedLeaf, setSelectedLeaf] = useState<number | null>(null);
  const [animatingStep, setAnimatingStep] = useState<number>(-1);

  // Simple hash function for demonstration
  const simpleHash = (input: string): string => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).slice(0, 6).toUpperCase();
  };

  // Build the Merkle tree
  const buildTree = () => {
    const tree: { value: string; hash: string; level: number; position: number }[][] = [];
    
    // Level 0: Leaf nodes
    const leaves = selectedData.map((data, index) => ({
      value: data,
      hash: simpleHash(data),
      level: 0,
      position: index
    }));
    tree.push(leaves);

    // Build up the tree
    let currentLevel = leaves;
    let level = 1;
    
    while (currentLevel.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = currentLevel[i + 1] || left; // Handle odd numbers
        const combinedHash = simpleHash(left.hash + right.hash);
        nextLevel.push({
          value: `${left.hash}+${right.hash}`,
          hash: combinedHash,
          level,
          position: Math.floor(i / 2)
        });
      }
      tree.push(nextLevel);
      currentLevel = nextLevel;
      level++;
    }

    return tree;
  };

  const tree = buildTree();
  const treeHeight = tree.length;

  const updateData = (index: number, newValue: string) => {
    const newData = [...selectedData];
    newData[index] = newValue;
    setSelectedData(newData);
  };

  const showVerificationPath = (leafIndex: number) => {
    setSelectedLeaf(leafIndex);
    const path: number[] = [];
    let currentIndex = leafIndex;
    let currentLevel = 0;

    // Calculate path from leaf to root
    while (currentLevel < treeHeight - 1) {
      path.push(currentLevel * 1000 + currentIndex); // Encode level and position
      currentIndex = Math.floor(currentIndex / 2);
      currentLevel++;
    }
    path.push((treeHeight - 1) * 1000); // Root

    setHighlightedPath(path);
  };

  const animateConstruction = () => {
    setAnimatingStep(0);
    const animate = (step: number) => {
      if (step < treeHeight) {
        setAnimatingStep(step);
        setTimeout(() => animate(step + 1), 800);
      } else {
        setAnimatingStep(-1);
      }
    };
    animate(0);
  };

  const isNodeHighlighted = (level: number, position: number): boolean => {
    const nodeId = level * 1000 + position;
    return highlightedPath.includes(nodeId);
  };

  const isNodeAnimating = (level: number): boolean => {
    return animatingStep === level;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Merkle Tree Visualizer</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how Merkle trees enable efficient data verification. Edit leaf data to see hash propagation, 
          click leaves to view verification paths, or animate tree construction.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={animateConstruction}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Animate Construction
        </button>
        <button
          onClick={() => {setHighlightedPath([]); setSelectedLeaf(null);}}
          className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
        >
          Clear Highlights
        </button>
      </div>

      <div className="relative">
        <svg width="600" height="400" viewBox="0 0 600 400" className="border border-slate-300 rounded-lg bg-white">
          {/* Draw tree levels from top (root) to bottom (leaves) */}
          {tree.slice().reverse().map((level, levelIndex) => {
            const actualLevel = treeHeight - 1 - levelIndex;
            const y = 50 + levelIndex * 80;
            const nodeWidth = Math.min(120, 500 / level.length);
            const startX = (600 - (level.length * nodeWidth)) / 2;

            return (
              <g key={actualLevel}>
                {/* Draw connections */}
                {actualLevel > 0 && tree[actualLevel - 1].map((_, childIndex) => {
                  const parentIndex = Math.floor(childIndex / 2);
                  const childX = startX + (childIndex + 0.5) * (500 / tree[actualLevel - 1].length);
                  const parentX = (600 - (level.length * nodeWidth)) / 2 + (parentIndex + 0.5) * nodeWidth;
                  
                  return (
                    <line
                      key={`${actualLevel}-${childIndex}`}
                      x1={childX}
                      y1={y + 80}
                      x2={parentX}
                      y2={y + 30}
                      stroke="#64748b"
                      strokeWidth="2"
                    />
                  );
                })}

                {/* Draw nodes */}
                {level.map((node, nodeIndex) => {
                  const x = startX + nodeIndex * nodeWidth;
                  const isHighlighted = isNodeHighlighted(actualLevel, node.position);
                  const isAnimating = isNodeAnimating(actualLevel);
                  const isLeaf = actualLevel === 0;
                  
                  return (
                    <g key={`${actualLevel}-${nodeIndex}`}>
                      <rect
                        x={x}
                        y={y}
                        width={nodeWidth - 10}
                        height={50}
                        fill={isHighlighted ? "#3b82f6" : isAnimating ? "#10b981" : isLeaf ? "#e2e8f0" : "#f1f5f9"}
                        stroke={isHighlighted ? "#1d4ed8" : "#64748b"}
                        strokeWidth="2"
                        rx="8"
                        className={`cursor-pointer transition-all duration-300 ${isAnimating ? 'animate-pulse' : ''}`}
                        onClick={() => isLeaf && showVerificationPath(node.position)}
                      />
                      <text
                        x={x + (nodeWidth - 10) / 2}
                        y={y + 20}
                        textAnchor="middle"
                        className="text-xs font-semibold fill-slate-700"
                      >
                        {isLeaf ? `Data: ${node.value}` : 'Hash'}
                      </text>
                      <text
                        x={x + (nodeWidth - 10) / 2}
                        y={y + 35}
                        textAnchor="middle"
                        className={`text-xs font-mono ${isHighlighted ? 'fill-white' : 'fill-slate-600'}`}
                      >
                        {node.hash}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
        {selectedData.map((data, index) => (
          <div key={index} className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Leaf {index + 1}
            </label>
            <input
              type="text"
              value={data}
              onChange={(e) => updateData(index, e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={5}
            />
            <button
              onClick={() => showVerificationPath(index)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                selectedLeaf === index 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Show Path
            </button>
          </div>
        ))}
      </div>

      {selectedLeaf !== null && (
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 max-w-2xl">
          <h4 className="font-semibold text-indigo-900 mb-2">
            Verification Path for Leaf {selectedLeaf + 1}
          </h4>
          <p className="text-sm text-indigo-700">
            To verify this leaf is in the tree, you only need {highlightedPath.length - 1} sibling hashes 
            (highlighted in blue). This is O(log n) instead of O(n) for the full dataset!
          </p>
        </div>
      )}
    </div>
  );
}
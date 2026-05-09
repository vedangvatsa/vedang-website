"use client";

import { useState } from 'react';

export function KnowledgeGraphVisualizer() {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [showAttributes, setShowAttributes] = useState(false);

  const entities = {
    'albert-einstein': { name: 'Albert Einstein', type: 'Person', x: 200, y: 150, color: 'bg-blue-500' },
    'relativity': { name: 'Theory of Relativity', type: 'Concept', x: 400, y: 100, color: 'bg-indigo-500' },
    'princeton': { name: 'Princeton University', type: 'Organization', x: 200, y: 300, color: 'bg-emerald-500' },
    'nobel-prize': { name: 'Nobel Prize', type: 'Award', x: 50, y: 200, color: 'bg-amber-500' },
    'physics': { name: 'Physics', type: 'Field', x: 400, y: 250, color: 'bg-rose-500' }
  };

  const relationships = [
    { 
      from: 'albert-einstein', 
      to: 'relativity', 
      type: 'developed',
      confidence: 0.99,
      year: 1905,
      id: 'rel-1'
    },
    { 
      from: 'albert-einstein', 
      to: 'princeton', 
      type: 'worked_at',
      confidence: 0.95,
      year: 1933,
      id: 'rel-2'
    },
    { 
      from: 'albert-einstein', 
      to: 'nobel-prize', 
      type: 'received',
      confidence: 0.98,
      year: 1921,
      id: 'rel-3'
    },
    { 
      from: 'relativity', 
      to: 'physics', 
      type: 'belongs_to',
      confidence: 1.0,
      year: 1905,
      id: 'rel-4'
    },
    { 
      from: 'princeton', 
      to: 'physics', 
      type: 'teaches',
      confidence: 0.92,
      year: 1746,
      id: 'rel-5'
    }
  ];

  const attributes = {
    'albert-einstein': {
      born: '1879',
      died: '1955',
      nationality: 'German-American',
      profession: 'Theoretical Physicist'
    },
    'relativity': {
      type: 'Scientific Theory',
      impact: 'Revolutionary',
      applications: 'GPS, Nuclear Energy'
    },
    'princeton': {
      founded: '1746',
      location: 'New Jersey, USA',
      type: 'Ivy League University'
    }
  };

  const getEdgePath = (from: string, to: string) => {
    const fromEntity = entities[from as keyof typeof entities];
    const toEntity = entities[to as keyof typeof entities];
    return `M ${fromEntity.x + 30} ${fromEntity.y + 15} L ${toEntity.x + 30} ${toEntity.y + 15}`;
  };

  const getRelationshipForEdge = (from: string, to: string) => {
    return relationships.find(rel => rel.from === from && rel.to === to);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Knowledge Graph</h3>
        <p className="text-slate-600 max-w-2xl">
          Click entities to explore their connections and attributes. Hover over edges to see relationship details and confidence scores.
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setShowAttributes(!showAttributes)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            showAttributes 
              ? 'bg-blue-500 text-white' 
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {showAttributes ? 'Hide' : 'Show'} Attributes
        </button>
        <button
          onClick={() => {
            setSelectedEntity(null);
            setHoveredEdge(null);
          }}
          className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Clear Selection
        </button>
      </div>

      <div className="relative">
        <svg width="500" height="400" className="border border-slate-200 rounded-lg bg-white">
          {/* Edges */}
          {relationships.map((rel) => (
            <g key={rel.id}>
              <path
                d={getEdgePath(rel.from, rel.to)}
                stroke={hoveredEdge === rel.id ? '#3b82f6' : '#94a3b8'}
                strokeWidth={hoveredEdge === rel.id ? 3 : 2}
                fill="none"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredEdge(rel.id)}
                onMouseLeave={() => setHoveredEdge(null)}
              />
              {/* Edge label */}
              <text
                x={(entities[rel.from as keyof typeof entities].x + entities[rel.to as keyof typeof entities].x) / 2 + 30}
                y={(entities[rel.from as keyof typeof entities].y + entities[rel.to as keyof typeof entities].y) / 2 + 10}
                fill="#475569"
                fontSize="10"
                textAnchor="middle"
                className="pointer-events-none"
              >
                {rel.type}
              </text>
            </g>
          ))}

          {/* Nodes */}
          {Object.entries(entities).map(([id, entity]) => (
            <g key={id}>
              <circle
                cx={entity.x + 30}
                cy={entity.y + 15}
                r={selectedEntity === id ? 25 : 20}
                className={`${entity.color} cursor-pointer transition-all opacity-80 hover:opacity-100`}
                onClick={() => setSelectedEntity(selectedEntity === id ? null : id)}
              />
              <text
                x={entity.x + 30}
                y={entity.y + 20}
                fill="white"
                fontSize="10"
                textAnchor="middle"
                className="pointer-events-none font-medium"
              >
                {entity.name.length > 12 ? entity.name.substring(0, 10) + '...' : entity.name}
              </text>
              <text
                x={entity.x + 30}
                y={entity.y - 5}
                fill="#64748b"
                fontSize="8"
                textAnchor="middle"
                className="pointer-events-none"
              >
                {entity.type}
              </text>
            </g>
          ))}
        </svg>

        {/* Relationship details popup */}
        {hoveredEdge && (
          <div className="absolute top-4 right-4 bg-white p-3 rounded-lg border border-slate-200 shadow-lg z-10">
            {(() => {
              const rel = relationships.find(r => r.id === hoveredEdge);
              return rel ? (
                <div className="text-sm">
                  <div className="font-medium text-slate-800">{rel.type}</div>
                  <div className="text-slate-600">Year: {rel.year}</div>
                  <div className="text-slate-600">
                    Confidence: {(rel.confidence * 100).toFixed(0)}%
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${rel.confidence * 100}%` }}
                    />
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>

      {/* Entity details */}
      {selectedEntity && (
        <div className="w-full max-w-md bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-2">
            {entities[selectedEntity as keyof typeof entities].name}
          </h4>
          <p className="text-sm text-slate-600 mb-3">
            Type: {entities[selectedEntity as keyof typeof entities].type}
          </p>
          
          {showAttributes && attributes[selectedEntity as keyof typeof attributes] && (
            <div className="space-y-2">
              <h5 className="font-medium text-slate-700">Attributes:</h5>
              {Object.entries(attributes[selectedEntity as keyof typeof attributes]).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-slate-600 capitalize">{key.replace('_', ' ')}:</span>
                  <span className="text-slate-800">{value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3">
            <h5 className="font-medium text-slate-700 mb-2">Connected to:</h5>
            <div className="space-y-1">
              {relationships
                .filter(rel => rel.from === selectedEntity || rel.to === selectedEntity)
                .map(rel => {
                  const connectedId = rel.from === selectedEntity ? rel.to : rel.from;
                  const connectedEntity = entities[connectedId as keyof typeof entities];
                  return (
                    <div key={rel.id} className="text-sm text-slate-600">
                      {connectedEntity.name} 
                      <span className="text-blue-500 mx-1">({rel.type})</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-sm text-slate-500 max-w-lg">
        This knowledge graph demonstrates how entities are interconnected through typed relationships. 
        Each connection has metadata like confidence scores and timestamps, enabling rich contextual queries.
      </div>
    </div>
  );
}
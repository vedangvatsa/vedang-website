"use client";

import React, { useState, useEffect } from 'react';

interface Agent {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  goal: { x: number; y: number };
  color: string;
  type: 'cooperative' | 'competitive' | 'neutral';
}

export function MultiAgentSystemsVisualizer() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [agentCount, setAgentCount] = useState(8);
  const [cooperationLevel, setCooperationLevel] = useState(0.5);
  const [selectedScenario, setSelectedScenario] = useState<'traffic' | 'swarm' | 'competition'>('traffic');

  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-indigo-500'];

  const initializeAgents = () => {
    const newAgents: Agent[] = [];
    for (let i = 0; i < agentCount; i++) {
      const type = Math.random() < cooperationLevel ? 'cooperative' : 
                   Math.random() < 0.5 ? 'competitive' : 'neutral';
      
      newAgents.push({
        id: i,
        x: Math.random() * 350 + 25,
        y: Math.random() * 250 + 25,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        goal: {
          x: selectedScenario === 'traffic' ? 350 : Math.random() * 350 + 25,
          y: selectedScenario === 'traffic' ? 150 : Math.random() * 250 + 25
        },
        color: colors[i % colors.length],
        type
      });
    }
    setAgents(newAgents);
  };

  useEffect(() => {
    initializeAgents();
  }, [agentCount, cooperationLevel, selectedScenario]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setAgents(prevAgents => {
        return prevAgents.map(agent => {
          const neighbors = prevAgents.filter(other => 
            other.id !== agent.id && 
            Math.sqrt((other.x - agent.x) ** 2 + (other.y - agent.y) ** 2) < 50
          );

          let fx = 0, fy = 0;

          // Goal seeking force
          const goalDx = agent.goal.x - agent.x;
          const goalDy = agent.goal.y - agent.y;
          const goalDist = Math.sqrt(goalDx ** 2 + goalDy ** 2);
          if (goalDist > 5) {
            fx += (goalDx / goalDist) * 0.3;
            fy += (goalDy / goalDist) * 0.3;
          }

          // Agent interaction forces
          neighbors.forEach(neighbor => {
            const dx = neighbor.x - agent.x;
            const dy = neighbor.y - agent.y;
            const dist = Math.sqrt(dx ** 2 + dy ** 2);
            
            if (dist > 0) {
              if (agent.type === 'cooperative' && neighbor.type === 'cooperative') {
                // Alignment and cohesion
                fx += neighbor.vx * 0.1;
                fy += neighbor.vy * 0.1;
                if (dist > 30) {
                  fx += (dx / dist) * 0.05; // Attraction
                  fy += (dy / dist) * 0.05;
                }
              } else if (agent.type === 'competitive' || neighbor.type === 'competitive') {
                // Repulsion
                fx -= (dx / dist) * 0.2;
                fy -= (dy / dist) * 0.2;
              }
              
              // Separation (avoid collision)
              if (dist < 25) {
                fx -= (dx / dist) * 0.4;
                fy -= (dy / dist) * 0.4;
              }
            }
          });

          // Update velocity and position
          const newVx = (agent.vx + fx) * 0.98; // Damping
          const newVy = (agent.vy + fy) * 0.98;
          
          let newX = agent.x + newVx;
          let newY = agent.y + newVy;

          // Boundary conditions
          if (newX < 10 || newX > 390) newX = Math.max(10, Math.min(390, newX));
          if (newY < 10 || newY > 290) newY = Math.max(10, Math.min(290, newY));

          return {
            ...agent,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy
          };
        });
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Multi-Agent Systems</h3>
        <p className="text-slate-600 max-w-2xl">
          Autonomous agents interact in a shared environment, exhibiting emergent behaviors through cooperation, competition, and negotiation
        </p>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Scenario:</label>
          <select 
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value as any)}
            className="px-3 py-1 border border-slate-300 rounded text-sm"
          >
            <option value="traffic">Traffic Flow</option>
            <option value="swarm">Swarm Intelligence</option>
            <option value="competition">Resource Competition</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Agents:</label>
          <input
            type="range"
            min="4"
            max="16"
            value={agentCount}
            onChange={(e) => setAgentCount(parseInt(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-slate-600 w-6">{agentCount}</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Cooperation:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={cooperationLevel}
            onChange={(e) => setCooperationLevel(parseFloat(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-slate-600 w-8">{(cooperationLevel * 100).toFixed(0)}%</span>
        </div>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-4 py-2 rounded font-medium text-white ${
            isRunning ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'
          } transition-colors`}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>

        <button
          onClick={initializeAgents}
          className="px-4 py-2 rounded font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="relative">
        <svg width="400" height="300" className="border border-slate-300 rounded bg-white">
          {/* Goals visualization */}
          {selectedScenario === 'traffic' && (
            <rect x="340" y="140" width="60" height="20" fill="#10b981" opacity="0.3" />
          )}
          {selectedScenario !== 'traffic' && agents.map(agent => (
            <circle
              key={`goal-${agent.id}`}
              cx={agent.goal.x}
              cy={agent.goal.y}
              r="3"
              fill="#10b981"
              opacity="0.5"
            />
          ))}

          {/* Agents */}
          {agents.map(agent => (
            <g key={agent.id}>
              {/* Velocity vector */}
              <line
                x1={agent.x}
                y1={agent.y}
                x2={agent.x + agent.vx * 10}
                y2={agent.y + agent.vy * 10}
                stroke={agent.type === 'cooperative' ? '#3b82f6' : agent.type === 'competitive' ? '#ef4444' : '#64748b'}
                strokeWidth="1"
                opacity="0.6"
              />
              
              {/* Agent body */}
              <circle
                cx={agent.x}
                cy={agent.y}
                r="6"
                fill={agent.type === 'cooperative' ? '#3b82f6' : agent.type === 'competitive' ? '#ef4444' : '#64748b'}
                stroke="white"
                strokeWidth="1"
              />
              
              {/* Agent ID */}
              <text
                x={agent.x}
                y={agent.y + 2}
                textAnchor="middle"
                fontSize="8"
                fill="white"
                fontWeight="bold"
              >
                {agent.id}
              </text>
            </g>
          ))}
        </svg>

        <div className="mt-4 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-slate-600">Cooperative</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-slate-600">Competitive</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
            <span className="text-slate-600">Neutral</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-emerald-500 rounded-full opacity-50"></div>
            <span className="text-slate-600">Goals</span>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-slate-600 max-w-2xl">
        <p>
          <strong>Cooperative agents</strong> (blue) align with neighbors and move together. 
          <strong> Competitive agents</strong> (red) avoid others and compete for space. 
          Adjust cooperation level to see how collective behavior emerges from individual agent interactions.
        </p>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from 'react';

export function ReinforcementLearningVisualizer() {
  const [agentPosition, setAgentPosition] = useState({ x: 0, y: 0 });
  const [episode, setEpisode] = useState(1);
  const [totalReward, setTotalReward] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [qTable, setQTable] = useState({});
  const [explorationRate, setExplorationRate] = useState(0.9);
  const [learningRate, setLearningRate] = useState(0.1);
  const [stepCount, setStepCount] = useState(0);
  const [lastReward, setLastReward] = useState(0);

  const gridSize = 5;
  const goal = { x: 4, y: 4 };
  const obstacles = [{ x: 1, y: 1 }, { x: 2, y: 3 }, { x: 3, y: 1 }];
  
  const getStateKey = (x, y) => `${x},${y}`;
  
  const getReward = (x, y) => {
    if (x === goal.x && y === goal.y) return 100;
    if (obstacles.some(obs => obs.x === x && obs.y === y)) return -50;
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return -10;
    return -1; // Small negative reward for each step
  };

  const getPossibleActions = (x, y) => {
    const actions = [];
    if (x > 0) actions.push('left');
    if (x < gridSize - 1) actions.push('right');
    if (y > 0) actions.push('up');
    if (y < gridSize - 1) actions.push('down');
    return actions;
  };

  const getNextPosition = (x, y, action) => {
    switch (action) {
      case 'up': return { x, y: y - 1 };
      case 'down': return { x, y: y + 1 };
      case 'left': return { x: x - 1, y };
      case 'right': return { x: x + 1, y };
      default: return { x, y };
    }
  };

  const getBestAction = (x, y) => {
    const stateKey = getStateKey(x, y);
    const stateValues = qTable[stateKey] || {};
    const actions = getPossibleActions(x, y);
    
    let bestAction = actions[0];
    let bestValue = stateValues[bestAction] || 0;
    
    for (const action of actions) {
      const value = stateValues[action] || 0;
      if (value > bestValue) {
        bestValue = value;
        bestAction = action;
      }
    }
    
    return bestAction;
  };

  const updateQTable = (state, action, reward, nextState) => {
    const stateKey = getStateKey(state.x, state.y);
    const nextStateKey = getStateKey(nextState.x, nextState.y);
    
    setQTable(prev => {
      const newQTable = { ...prev };
      if (!newQTable[stateKey]) newQTable[stateKey] = {};
      
      const currentQ = newQTable[stateKey][action] || 0;
      const nextStateValues = newQTable[nextStateKey] || {};
      const maxNextQ = Math.max(...Object.values(nextStateValues), 0);
      
      // Q-learning formula: Q(s,a) = Q(s,a) + α[r + γ*max(Q(s',a')) - Q(s,a)]
      const gamma = 0.9; // discount factor
      newQTable[stateKey][action] = currentQ + learningRate * (reward + gamma * maxNextQ - currentQ);
      
      return newQTable;
    });
  };

  const takeAction = () => {
    if (agentPosition.x === goal.x && agentPosition.y === goal.y) {
      // Reset episode
      setAgentPosition({ x: 0, y: 0 });
      setEpisode(prev => prev + 1);
      setStepCount(0);
      setExplorationRate(prev => Math.max(0.01, prev * 0.995)); // Decay exploration
      return;
    }

    const currentPos = agentPosition;
    const actions = getPossibleActions(currentPos.x, currentPos.y);
    
    let selectedAction;
    if (Math.random() < explorationRate) {
      // Explore: random action
      selectedAction = actions[Math.floor(Math.random() * actions.length)];
    } else {
      // Exploit: best known action
      selectedAction = getBestAction(currentPos.x, currentPos.y);
    }

    const nextPos = getNextPosition(currentPos.x, currentPos.y, selectedAction);
    const reward = getReward(nextPos.x, nextPos.y);
    
    // Ensure agent stays within bounds and doesn't enter obstacles
    let finalPos = nextPos;
    if (nextPos.x < 0 || nextPos.x >= gridSize || nextPos.y < 0 || nextPos.y >= gridSize ||
        obstacles.some(obs => obs.x === nextPos.x && obs.y === nextPos.y)) {
      finalPos = currentPos; // Stay in place if invalid move
    }

    updateQTable(currentPos, selectedAction, reward, finalPos);
    setAgentPosition(finalPos);
    setTotalReward(prev => prev + reward);
    setLastReward(reward);
    setStepCount(prev => prev + 1);
  };

  useEffect(() => {
    let interval;
    if (isTraining) {
      interval = setInterval(takeAction, 200);
    }
    return () => clearInterval(interval);
  }, [isTraining, agentPosition, qTable, explorationRate, learningRate]);

  const resetEnvironment = () => {
    setAgentPosition({ x: 0, y: 0 });
    setEpisode(1);
    setTotalReward(0);
    setQTable({});
    setExplorationRate(0.9);
    setStepCount(0);
    setLastReward(0);
    setIsTraining(false);
  };

  const getCellColor = (x, y) => {
    if (x === agentPosition.x && y === agentPosition.y) return 'bg-blue-500';
    if (x === goal.x && y === goal.y) return 'bg-emerald-500';
    if (obstacles.some(obs => obs.x === x && obs.y === y)) return 'bg-slate-800';
    
    // Color based on Q-values
    const stateKey = getStateKey(x, y);
    const stateValues = qTable[stateKey];
    if (stateValues) {
      const maxValue = Math.max(...Object.values(stateValues));
      const intensity = Math.min(Math.abs(maxValue) / 50, 1);
      if (maxValue > 0) {
        return `bg-indigo-${Math.floor(intensity * 400) + 100}`;
      } else {
        return `bg-rose-${Math.floor(intensity * 400) + 100}`;
      }
    }
    return 'bg-slate-200';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Reinforcement Learning Agent</h3>
        <p className="text-slate-600">Watch an AI agent learn to navigate to the goal through trial and error</p>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="grid grid-cols-5 gap-1 p-4 bg-white rounded-xl border border-slate-300">
            {Array.from({ length: gridSize }, (_, y) =>
              Array.from({ length: gridSize }, (_, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`w-12 h-12 rounded-lg border border-slate-300 flex items-center justify-center text-white font-bold ${getCellColor(x, y)}`}
                >
                  {x === agentPosition.x && y === agentPosition.y && '🤖'}
                  {x === goal.x && y === goal.y && x !== agentPosition.x && y !== agentPosition.y && '🎯'}
                  {obstacles.some(obs => obs.x === x && obs.y === y) && '🚫'}
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsTraining(!isTraining)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                isTraining 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isTraining ? 'Pause Training' : 'Start Training'}
            </button>
            <button
              onClick={resetEnvironment}
              className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-semibold"
            >
              Reset
            </button>
            {!isTraining && (
              <button
                onClick={takeAction}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold"
              >
                Step
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 min-w-64">
          <div className="bg-white p-4 rounded-xl border border-slate-300">
            <h4 className="font-semibold text-slate-800 mb-3">Training Statistics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Episode:</span>
                <span className="font-bold text-blue-600">{episode}</span>
              </div>
              <div className="flex justify-between">
                <span>Steps:</span>
                <span className="font-bold">{stepCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Reward:</span>
                <span className={`font-bold ${totalReward >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {totalReward.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Reward:</span>
                <span className={`font-bold ${lastReward >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {lastReward}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-300">
            <h4 className="font-semibold text-slate-800 mb-3">Hyperparameters</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">
                  Exploration Rate: {explorationRate.toFixed(3)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={explorationRate}
                  onChange={(e) => setExplorationRate(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">
                  Learning Rate: {learningRate.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="1"
                  step="0.01"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-300">
            <h4 className="font-semibold text-slate-800 mb-2">Legend</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Agent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                <span>Goal (+100)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-800 rounded"></div>
                <span>Obstacle (-50)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-300 rounded"></div>
                <span>High Q-value</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-rose-300 rounded"></div>
                <span>Low Q-value</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
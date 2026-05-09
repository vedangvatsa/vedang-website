"use client";

import { useState, useEffect } from 'react';

export function AgentVisualizer() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [agentPosition, setAgentPosition] = useState({ x: 2, y: 2 });
  const [goal, setGoal] = useState({ x: 7, y: 7 });
  const [obstacles, setObstacles] = useState([
    { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 },
    { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }
  ]);
  const [path, setPath] = useState<{x: number, y: number}[]>([]);
  const [agentThought, setAgentThought] = useState("Ready to start");
  const [autonomyLevel, setAutonomyLevel] = useState(3);

  const steps = ["Observe", "Decide", "Act", "Evaluate"];
  const gridSize = 10;

  const calculateDistance = (pos1: {x: number, y: number}, pos2: {x: number, y: number}) => {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  };

  const findBestMove = () => {
    const possibleMoves = [
      { x: agentPosition.x + 1, y: agentPosition.y },
      { x: agentPosition.x - 1, y: agentPosition.y },
      { x: agentPosition.x, y: agentPosition.y + 1 },
      { x: agentPosition.x, y: agentPosition.y - 1 }
    ];

    const validMoves = possibleMoves.filter(move => 
      move.x >= 0 && move.x < gridSize && 
      move.y >= 0 && move.y < gridSize &&
      !obstacles.some(obs => obs.x === move.x && obs.y === move.y)
    );

    if (validMoves.length === 0) return agentPosition;

    return validMoves.reduce((best, move) => 
      calculateDistance(move, goal) < calculateDistance(best, goal) ? move : best
    );
  };

  const executeAgentStep = () => {
    const stepIndex = currentStep % 4;
    
    switch (stepIndex) {
      case 0: // Observe
        setAgentThought(`Observing environment... Goal at (${goal.x}, ${goal.y}), ${obstacles.length} obstacles detected`);
        break;
      case 1: // Decide
        const nextPos = findBestMove();
        const distance = calculateDistance(agentPosition, goal);
        setAgentThought(`Planning move to (${nextPos.x}, ${nextPos.y}). Distance to goal: ${distance}`);
        break;
      case 2: // Act
        const newPos = findBestMove();
        setAgentPosition(newPos);
        setPath(prev => [...prev, newPos]);
        setAgentThought(`Moving to (${newPos.x}, ${newPos.y})`);
        break;
      case 3: // Evaluate
        const currentDistance = calculateDistance(agentPosition, goal);
        if (currentDistance === 0) {
          setAgentThought("Goal achieved! Mission complete.");
          setIsRunning(false);
        } else {
          setAgentThought(`Progress evaluated. ${currentDistance} steps from goal. Continuing...`);
        }
        break;
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        executeAgentStep();
        setCurrentStep(prev => prev + 1);
      }, 1000 + (4 - autonomyLevel) * 500);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentStep, agentPosition, goal, autonomyLevel]);

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setAgentPosition({ x: 2, y: 2 });
    setPath([]);
    setAgentThought("Ready to start");
  };

  const addObstacle = (x: number, y: number) => {
    if (x === agentPosition.x && y === agentPosition.y) return;
    if (x === goal.x && y === goal.y) return;
    if (obstacles.some(obs => obs.x === x && obs.y === y)) {
      setObstacles(prev => prev.filter(obs => !(obs.x === x && obs.y === y)));
    } else {
      setObstacles(prev => [...prev, { x, y }]);
    }
  };

  const isAtGoal = agentPosition.x === goal.x && agentPosition.y === goal.y;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">AI Agent Behavior</h3>
        <p className="text-slate-600 max-w-2xl">
          Watch an autonomous AI agent navigate to its goal using the classic observe-decide-act-evaluate loop. 
          Unlike chatbots that respond to prompts, agents set and pursue their own objectives.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        <div className="flex-1">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Environment Grid</h4>
            <div className="grid grid-cols-10 gap-1 mb-4 aspect-square max-w-md mx-auto">
              {Array.from({ length: gridSize * gridSize }, (_, i) => {
                const x = i % gridSize;
                const y = Math.floor(i / gridSize);
                const isAgent = agentPosition.x === x && agentPosition.y === y;
                const isGoal = goal.x === x && goal.y === y;
                const isObstacle = obstacles.some(obs => obs.x === x && obs.y === y);
                const isOnPath = path.some(p => p.x === x && p.y === y);

                return (
                  <div
                    key={i}
                    className={`
                      aspect-square border border-slate-300 cursor-pointer flex items-center justify-center text-xs font-bold
                      ${isAgent ? 'bg-blue-500 text-white' : ''}
                      ${isGoal ? 'bg-emerald-500 text-white' : ''}
                      ${isObstacle ? 'bg-slate-800' : ''}
                      ${isOnPath && !isAgent && !isGoal && !isObstacle ? 'bg-blue-100' : ''}
                      ${!isAgent && !isGoal && !isObstacle && !isOnPath ? 'bg-slate-50 hover:bg-slate-100' : ''}
                    `}
                    onClick={() => !isRunning && addObstacle(x, y)}
                  >
                    {isAgent && '🤖'}
                    {isGoal && '🎯'}
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-slate-600 text-center">
              Click empty cells to add/remove obstacles
            </p>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Agent Decision Loop</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all
                    ${(currentStep % 4) === index ? 'bg-blue-500 text-white scale-105' : 'bg-slate-100 text-slate-600'}
                  `}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="bg-slate-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-slate-700 font-medium">Agent Thought:</p>
              <p className="text-sm text-slate-600 italic">"{agentThought}"</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Controls</h4>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Autonomy Level: {autonomyLevel}/5
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={autonomyLevel}
                onChange={(e) => setAutonomyLevel(parseInt(e.target.value))}
                className="w-full"
                disabled={isRunning}
              />
              <p className="text-xs text-slate-500 mt-1">
                Higher autonomy = faster decisions
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                disabled={isAtGoal}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all flex-1
                  ${isRunning ? 'bg-rose-500 hover:bg-rose-600' : 'bg-blue-500 hover:bg-blue-600'} 
                  text-white disabled:bg-slate-300 disabled:cursor-not-allowed
                `}
              >
                {isRunning ? 'Stop Agent' : 'Start Agent'}
              </button>
              <button
                onClick={resetSimulation}
                className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-medium transition-all"
              >
                Reset
              </button>
            </div>

            {isAtGoal && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-emerald-800 font-medium">🎉 Goal Achieved!</p>
                <p className="text-emerald-700 text-sm">The agent autonomously navigated to its target.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
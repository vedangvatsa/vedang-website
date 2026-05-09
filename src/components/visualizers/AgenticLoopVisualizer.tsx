"use client";

import { useState, useEffect } from 'react';

export function AgenticLoopVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [agentState, setAgentState] = useState({
    position: { x: 2, y: 2 },
    energy: 100,
    hasKey: false,
    goalReached: false
  });
  const [environment, setEnvironment] = useState([
    [0, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 2, 0, 0],
    [1, 0, 0, 0, 3],
    [0, 0, 1, 0, 4]
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [reasoning, setReasoning] = useState("");
  const [action, setAction] = useState("");

  const steps = ["Perceive", "Reason", "Act", "Observe"];
  const stepColors = ["bg-blue-500", "bg-indigo-500", "bg-rose-500", "bg-emerald-500"];

  useEffect(() => {
    if (isRunning) {
      const timer = setTimeout(() => {
        executeStep();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isRunning]);

  const executeStep = () => {
    switch (currentStep) {
      case 0: // Perceive
        const surroundings = getSurroundings();
        setReasoning(`Perceiving: Position (${agentState.position.x}, ${agentState.position.y}), Energy: ${agentState.energy}, Key: ${agentState.hasKey ? 'Yes' : 'No'}`);
        setCurrentStep(1);
        break;
      case 1: // Reason
        const nextAction = reasonAboutAction();
        setReasoning(`Reasoning: ${nextAction.reasoning}`);
        setAction(nextAction.action);
        setCurrentStep(2);
        break;
      case 2: // Act
        performAction();
        setCurrentStep(3);
        break;
      case 3: // Observe
        observeResults();
        if (agentState.goalReached || agentState.energy <= 0) {
          setIsRunning(false);
          setCurrentStep(0);
        } else {
          setCurrentStep(0);
        }
        break;
    }
  };

  const getSurroundings = () => {
    const { x, y } = agentState.position;
    const surroundings = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const newX = x + dx;
        const newY = y + dy;
        if (newX >= 0 && newX < 5 && newY >= 0 && newY < 5) {
          surroundings.push(environment[newY][newX]);
        }
      }
    }
    return surroundings;
  };

  const reasonAboutAction = () => {
    const { x, y } = agentState.position;
    
    // Check for key first
    if (environment[y][x] === 3 && !agentState.hasKey) {
      return { action: "collect", reasoning: "Key found at current position - collect it!" };
    }
    
    // Check for goal
    if (environment[y][x] === 4 && agentState.hasKey) {
      return { action: "goal", reasoning: "At goal with key - mission complete!" };
    }
    
    // Find best move
    const moves = [
      { dx: 0, dy: -1, dir: "up" },
      { dx: 1, dy: 0, dir: "right" },
      { dx: 0, dy: 1, dir: "down" },
      { dx: -1, dy: 0, dir: "left" }
    ];
    
    const validMoves = moves.filter(move => {
      const newX = x + move.dx;
      const newY = y + move.dy;
      return newX >= 0 && newX < 5 && newY >= 0 && newY < 5 && environment[newY][newX] !== 1;
    });
    
    if (validMoves.length === 0) {
      return { action: "wait", reasoning: "No valid moves available - waiting" };
    }
    
    // Prefer moves toward key or goal
    const target = agentState.hasKey ? 4 : 3;
    let bestMove = validMoves[0];
    let bestScore = -1;
    
    for (const move of validMoves) {
      const newX = x + move.dx;
      const newY = y + move.dy;
      let score = Math.random() * 0.1; // Add randomness
      
      if (environment[newY][newX] === target) {
        score += 10;
      } else if (environment[newY][newX] === 3 || environment[newY][newX] === 4) {
        score += 5;
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    
    return { 
      action: bestMove.dir, 
      reasoning: `Moving ${bestMove.dir} - seeking ${agentState.hasKey ? 'goal' : 'key'}` 
    };
  };

  const performAction = () => {
    const newState = { ...agentState };
    newState.energy -= 5;
    
    switch (action) {
      case "collect":
        newState.hasKey = true;
        setReasoning("Action: Collected the key!");
        break;
      case "goal":
        newState.goalReached = true;
        setReasoning("Action: Reached the goal! Mission accomplished!");
        break;
      case "up":
        newState.position.y = Math.max(0, newState.position.y - 1);
        setReasoning("Action: Moved up");
        break;
      case "down":
        newState.position.y = Math.min(4, newState.position.y + 1);
        setReasoning("Action: Moved down");
        break;
      case "left":
        newState.position.x = Math.max(0, newState.position.x - 1);
        setReasoning("Action: Moved left");
        break;
      case "right":
        newState.position.x = Math.min(4, newState.position.x + 1);
        setReasoning("Action: Moved right");
        break;
      case "wait":
        setReasoning("Action: Waiting...");
        break;
    }
    
    setAgentState(newState);
  };

  const observeResults = () => {
    if (agentState.goalReached) {
      setReasoning("Observation: Mission completed successfully!");
    } else if (agentState.energy <= 0) {
      setReasoning("Observation: Out of energy - mission failed");
    } else {
      setReasoning(`Observation: Energy remaining: ${agentState.energy}, continuing mission`);
    }
  };

  const resetAgent = () => {
    setAgentState({
      position: { x: 2, y: 2 },
      energy: 100,
      hasKey: false,
      goalReached: false
    });
    setCurrentStep(0);
    setIsRunning(false);
    setReasoning("");
    setAction("");
  };

  const getCellColor = (value: number, x: number, y: number) => {
    if (agentState.position.x === x && agentState.position.y === y) {
      return "bg-rose-400 border-rose-600";
    }
    switch (value) {
      case 0: return "bg-slate-100 border-slate-300";
      case 1: return "bg-slate-800 border-slate-900";
      case 2: return "bg-slate-200 border-slate-400";
      case 3: return "bg-amber-400 border-amber-600";
      case 4: return "bg-emerald-400 border-emerald-600";
      default: return "bg-slate-100 border-slate-300";
    }
  };

  const getCellContent = (value: number, x: number, y: number) => {
    if (agentState.position.x === x && agentState.position.y === y) {
      return "🤖";
    }
    switch (value) {
      case 1: return "🧱";
      case 3: return agentState.hasKey ? "" : "🗝️";
      case 4: return "🎯";
      default: return "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Agentic Loop Visualizer</h3>
        <p className="text-slate-600">Watch an AI agent navigate through its perception-reasoning-action-observation cycle</p>
      </div>

      <div className="flex gap-8 w-full max-w-4xl">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Environment</h4>
          <div className="grid grid-cols-5 gap-1 mb-4">
            {environment.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`w-12 h-12 border-2 flex items-center justify-center text-lg ${getCellColor(cell, x, y)}`}
                >
                  {getCellContent(cell, x, y)}
                </div>
              ))
            )}
          </div>
          
          <div className="text-sm text-slate-600 space-y-1">
            <div>🤖 Agent (Energy: {agentState.energy})</div>
            <div>🗝️ Key {agentState.hasKey ? "(Collected)" : "(Needed)"}</div>
            <div>🎯 Goal</div>
            <div>🧱 Wall</div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Agentic Loop</h4>
          
          <div className="flex justify-center mb-6">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold ${
                    currentStep === index ? stepColors[index] : 'bg-slate-300'
                  } ${currentStep === index ? 'scale-110 shadow-lg' : ''} transition-all duration-300`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-slate-300 mx-2"></div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mb-4">
            <div className="text-lg font-semibold text-slate-700 mb-2">
              Current Step: {steps[currentStep]}
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 min-h-[80px] flex items-center justify-center text-slate-600">
              {reasoning || "Click Start to begin the agentic loop"}
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                isRunning 
                  ? 'bg-rose-500 text-white hover:bg-rose-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              disabled={agentState.goalReached || agentState.energy <= 0}
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            
            <button
              onClick={resetAgent}
              className="px-6 py-2 bg-slate-500 text-white rounded-lg font-semibold hover:bg-slate-600 transition-colors"
            >
              Reset
            </button>
          </div>

          {(agentState.goalReached || agentState.energy <= 0) && (
            <div className={`mt-4 p-3 rounded-lg text-center font-semibold ${
              agentState.goalReached 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-rose-100 text-rose-800'
            }`}>
              {agentState.goalReached ? 'Mission Completed!' : 'Mission Failed - Out of Energy'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
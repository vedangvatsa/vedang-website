"use client";

import React, { useState, useEffect } from 'react';

export function AutonomousAgentsVisualizer() {
  const [agentType, setAgentType] = useState('traditional');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [agentThoughts, setAgentThoughts] = useState('');

  const traditionalSteps = [
    'Wait for user input',
    'Process request',
    'Return response',
    'Wait for next input'
  ];

  const autonomousSteps = [
    'Analyze goal: "Plan a vacation"',
    'Break down into subtasks',
    'Research flight options',
    'Compare hotel prices',
    'Check weather forecasts',
    'Create itinerary',
    'Book reservations',
    'Send confirmation'
  ];

  const getCurrentSteps = () => agentType === 'traditional' ? traditionalSteps : autonomousSteps;
  const getStepColor = (index) => {
    if (index < currentStep) return 'bg-emerald-500 text-white';
    if (index === currentStep && isRunning) return 'bg-blue-500 text-white animate-pulse';
    return 'bg-slate-200 text-slate-600';
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        const steps = getCurrentSteps();
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
          if (agentType === 'autonomous') {
            setAgentThoughts(`Executing: ${steps[currentStep + 1]}`);
          }
        } else {
          setIsRunning(false);
          setCompletedTasks(prev => [...prev, agentType]);
          if (agentType === 'autonomous') {
            setAgentThoughts('Goal achieved! Ready for next objective.');
          }
        }
      }, agentType === 'traditional' ? 1500 : 800);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentStep, agentType]);

  const handleStart = () => {
    setCurrentStep(0);
    setIsRunning(true);
    setAgentThoughts(agentType === 'autonomous' ? 'Initiating autonomous planning...' : 'Waiting for instructions...');
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setCompletedTasks([]);
    setAgentThoughts('');
  };

  const handleAgentSwitch = (type) => {
    setAgentType(type);
    handleReset();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Autonomous Agents</h3>
        <p className="text-slate-600 max-w-2xl">
          Compare traditional reactive systems with autonomous agents that proactively execute multi-step goals
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => handleAgentSwitch('traditional')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            agentType === 'traditional' 
              ? 'bg-rose-500 text-white shadow-lg' 
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          }`}
        >
          Traditional System
        </button>
        <button
          onClick={() => handleAgentSwitch('autonomous')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            agentType === 'autonomous' 
              ? 'bg-indigo-500 text-white shadow-lg' 
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          }`}
        >
          Autonomous Agent
        </button>
      </div>

      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold text-slate-700">
            {agentType === 'traditional' ? 'Traditional Reactive System' : 'Autonomous Agent Execution'}
          </h4>
          <div className="flex gap-2">
            <button
              onClick={handleStart}
              disabled={isRunning}
              className={`px-4 py-2 rounded-md font-medium ${
                isRunning 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isRunning ? 'Running...' : 'Start'}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-400 text-white rounded-md hover:bg-slate-500"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid gap-3 mb-6">
          {getCurrentSteps().map((step, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all duration-500 ${getStepColor(index)} ${
                index === currentStep && isRunning ? 'border-blue-300 scale-105' : 'border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index < currentStep ? 'bg-emerald-600' : 
                  index === currentStep && isRunning ? 'bg-blue-600' : 'bg-slate-400'
                }`}>
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <span className="font-medium">{step}</span>
              </div>
            </div>
          ))}
        </div>

        {agentType === 'autonomous' && agentThoughts && (
          <div className="bg-indigo-100 border border-indigo-300 rounded-lg p-4 mb-4">
            <h5 className="font-semibold text-indigo-800 mb-2">Agent Thoughts:</h5>
            <p className="text-indigo-700">{agentThoughts}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h5 className="font-semibold text-slate-800 mb-3">Traditional System</h5>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Waits for user input</li>
              <li>• Processes one request at a time</li>
              <li>• Returns to idle state</li>
              <li>• Requires human guidance</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h5 className="font-semibold text-slate-800 mb-3">Autonomous Agent</h5>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Proactively breaks down goals</li>
              <li>• Executes multiple steps independently</li>
              <li>• Adapts strategy as needed</li>
              <li>• Minimal human intervention</li>
            </ul>
          </div>
        </div>

        {completedTasks.length > 0 && (
          <div className="mt-6 p-4 bg-emerald-100 rounded-lg border border-emerald-300">
            <p className="text-emerald-800 font-medium">
              Completed runs: {completedTasks.length} ({completedTasks.filter(t => t === 'autonomous').length} autonomous, {completedTasks.filter(t => t === 'traditional').length} traditional)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
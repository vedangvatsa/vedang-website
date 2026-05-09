"use client";

import { useState, useEffect } from 'react';

export function CiCdVisualizer() {
  const [currentStage, setCurrentStage] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState({ passed: 0, failed: 0 });
  const [deploymentStatus, setDeploymentStatus] = useState('waiting');
  const [codeChanges, setCodeChanges] = useState([]);

  const stages = [
    { name: 'Code Commit', status: 'waiting', duration: 1000 },
    { name: 'CI Tests', status: 'waiting', duration: 2000 },
    { name: 'Build', status: 'waiting', duration: 1500 },
    { name: 'Deploy', status: 'waiting', duration: 1000 }
  ];

  const runPipeline = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setCurrentStage(0);
    setDeploymentStatus('waiting');
    
    // Generate random test results
    const passed = Math.floor(Math.random() * 10) + 5;
    const failed = Math.floor(Math.random() * 3);
    setTestResults({ passed, failed });
    
    // Add new code change
    const newChange = {
      id: Date.now(),
      feature: `Feature ${codeChanges.length + 1}`,
      author: `Dev${Math.floor(Math.random() * 3) + 1}`,
      success: failed === 0
    };
    setCodeChanges(prev => [newChange, ...prev.slice(0, 4)]);
    
    // Simulate pipeline stages
    let stageIndex = 0;
    const interval = setInterval(() => {
      if (stageIndex < stages.length) {
        setCurrentStage(stageIndex);
        stageIndex++;
      } else {
        setIsRunning(false);
        setDeploymentStatus(failed === 0 ? 'success' : 'failed');
        clearInterval(interval);
      }
    }, 800);
  };

  const getStageStatus = (index) => {
    if (index < currentStage) return 'completed';
    if (index === currentStage && isRunning) return 'running';
    if (index === 1 && index <= currentStage && testResults.failed > 0) return 'failed';
    return 'waiting';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500';
      case 'running': return 'bg-blue-500 animate-pulse';
      case 'failed': return 'bg-rose-500';
      default: return 'bg-slate-300';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">CI/CD Pipeline Visualizer</h3>
        <p className="text-slate-600">Watch how Continuous Integration and Continuous Deployment automate code delivery</p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Pipeline Flow */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-slate-800">Pipeline Stages</h4>
            <button
              onClick={runPipeline}
              disabled={isRunning}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                isRunning 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isRunning ? 'Running...' : 'Push Code'}
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            {stages.map((stage, index) => (
              <div key={stage.name} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    getStatusColor(getStageStatus(index))
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-sm text-slate-600 mt-2 text-center">{stage.name}</span>
                </div>
                {index < stages.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${
                    getStageStatus(index) === 'completed' ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Test Results */}
        {isRunning && currentStage >= 1 && (
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">CI Test Results</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-emerald-600">{testResults.passed}</div>
                <div className="text-emerald-700">Tests Passed</div>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-rose-600">{testResults.failed}</div>
                <div className="text-rose-700">Tests Failed</div>
              </div>
            </div>
            {testResults.failed > 0 && (
              <div className="mt-4 p-3 bg-rose-100 border border-rose-300 rounded-lg">
                <span className="text-rose-800 font-medium">⚠️ Pipeline blocked - fix failing tests before deployment</span>
              </div>
            )}
          </div>
        )}

        {/* Deployment Status */}
        {deploymentStatus !== 'waiting' && (
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Deployment Status</h4>
            <div className={`p-4 rounded-lg border ${
              deploymentStatus === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              {deploymentStatus === 'success' 
                ? '✅ Automatically deployed to production!' 
                : '❌ Deployment blocked due to test failures'}
            </div>
          </div>
        )}

        {/* Recent Changes */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Recent Code Changes</h4>
          {codeChanges.length === 0 ? (
            <div className="text-slate-500 text-center py-4">No commits yet - push some code to see the CI/CD pipeline in action!</div>
          ) : (
            <div className="space-y-3">
              {codeChanges.map((change) => (
                <div key={change.id} className={`p-3 rounded-lg border flex items-center justify-between ${
                  change.success ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                }`}>
                  <div>
                    <span className="font-medium">{change.feature}</span>
                    <span className="text-slate-600 ml-2">by {change.author}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    change.success ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'
                  }`}>
                    {change.success ? 'Deployed' : 'Blocked'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
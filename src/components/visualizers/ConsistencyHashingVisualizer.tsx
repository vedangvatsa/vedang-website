"use client";

import { useState, useEffect } from 'react';

export function ConsistencyHashingVisualizer() {
  const [servers, setServers] = useState([
    { id: 'S1', angle: 0, color: 'bg-blue-500' },
    { id: 'S2', angle: 120, color: 'bg-emerald-500' },
    { id: 'S3', angle: 240, color: 'bg-rose-500' }
  ]);
  const [keys, setKeys] = useState([
    { id: 'K1', angle: 45 },
    { id: 'K2', angle: 90 },
    { id: 'K3', angle: 180 },
    { id: 'K4', angle: 270 },
    { id: 'K5', angle: 315 }
  ]);
  const [newServerAngle, setNewServerAngle] = useState(60);
  const [showNewServer, setShowNewServer] = useState(false);
  const [animating, setAnimating] = useState(false);

  const getNextServerClockwise = (keyAngle, serverList) => {
    const sortedServers = [...serverList].sort((a, b) => a.angle - b.angle);
    for (let server of sortedServers) {
      if (server.angle >= keyAngle) return server;
    }
    return sortedServers[0];
  };

  const getKeyAssignments = (serverList) => {
    return keys.map(key => ({
      ...key,
      assignedServer: getNextServerClockwise(key.angle, serverList)
    }));
  };

  const currentAssignments = getKeyAssignments(servers);
  const newServerAssignments = showNewServer 
    ? getKeyAssignments([...servers, { id: 'S4', angle: newServerAngle, color: 'bg-indigo-500' }])
    : currentAssignments;

  const addServer = () => {
    setAnimating(true);
    setShowNewServer(true);
    setTimeout(() => {
      setServers(prev => [...prev, { id: 'S4', angle: newServerAngle, color: 'bg-indigo-500' }]);
      setShowNewServer(false);
      setAnimating(false);
    }, 1000);
  };

  const removeLastServer = () => {
    if (servers.length > 2) {
      setAnimating(true);
      setTimeout(() => {
        setServers(prev => prev.slice(0, -1));
        setAnimating(false);
      }, 500);
    }
  };

  const resetServers = () => {
    setServers([
      { id: 'S1', angle: 0, color: 'bg-blue-500' },
      { id: 'S2', angle: 120, color: 'bg-emerald-500' },
      { id: 'S3', angle: 240, color: 'bg-rose-500' }
    ]);
    setShowNewServer(false);
  };

  const getChangedKeys = () => {
    const current = getKeyAssignments(servers);
    const withNew = getKeyAssignments([...servers, { id: 'S4', angle: newServerAngle, color: 'bg-indigo-500' }]);
    return withNew.filter((newKey, i) => newKey.assignedServer.id !== current[i].assignedServer.id);
  };

  const changedKeys = getChangedKeys();

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Consistency Hashing</h3>
        <p className="text-slate-600 max-w-3xl">
          Keys and servers are placed on a ring. Each key is assigned to the next server clockwise. 
          When servers are added/removed, only nearby keys are reassigned, minimizing data movement.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Ring Visualization */}
        <div className="flex-1 flex flex-col items-center">
          <div className="relative w-80 h-80">
            {/* Ring */}
            <svg className="w-full h-full" viewBox="0 0 320 320">
              <circle cx="160" cy="160" r="120" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              
              {/* Servers */}
              {servers.map(server => {
                const x = 160 + 120 * Math.cos((server.angle - 90) * Math.PI / 180);
                const y = 160 + 120 * Math.sin((server.angle - 90) * Math.PI / 180);
                return (
                  <g key={server.id}>
                    <circle cx={x} cy={y} r="15" className={server.color} />
                    <text x={x} y={y + 5} textAnchor="middle" className="text-xs font-bold fill-white">
                      {server.id}
                    </text>
                  </g>
                );
              })}

              {/* New Server Preview */}
              {showNewServer && (
                <g className={animating ? 'animate-pulse' : ''}>
                  <circle 
                    cx={160 + 120 * Math.cos((newServerAngle - 90) * Math.PI / 180)}
                    cy={160 + 120 * Math.sin((newServerAngle - 90) * Math.PI / 180)}
                    r="15" 
                    className="bg-indigo-500 opacity-70" 
                  />
                  <text 
                    x={160 + 120 * Math.cos((newServerAngle - 90) * Math.PI / 180)}
                    y={160 + 120 * Math.sin((newServerAngle - 90) * Math.PI / 180) + 5}
                    textAnchor="middle" 
                    className="text-xs font-bold fill-white"
                  >
                    S4
                  </text>
                </g>
              )}

              {/* Keys */}
              {(showNewServer ? newServerAssignments : currentAssignments).map(key => {
                const x = 160 + 90 * Math.cos((key.angle - 90) * Math.PI / 180);
                const y = 160 + 90 * Math.sin((key.angle - 90) * Math.PI / 180);
                const isChanged = changedKeys.some(k => k.id === key.id) && showNewServer;
                
                return (
                  <g key={key.id}>
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="8" 
                      className={`${isChanged ? 'fill-amber-400' : 'fill-slate-400'} ${animating && isChanged ? 'animate-bounce' : ''}`}
                    />
                    <text x={x} y={y + 3} textAnchor="middle" className="text-xs font-bold fill-white">
                      {key.id}
                    </text>
                    
                    {/* Assignment line */}
                    <line
                      x1={x}
                      y1={y}
                      x2={160 + 120 * Math.cos((key.assignedServer.angle - 90) * Math.PI / 180)}
                      y2={160 + 120 * Math.sin((key.assignedServer.angle - 90) * Math.PI / 180)}
                      stroke={isChanged ? '#f59e0b' : '#94a3b8'}
                      strokeWidth="1"
                      strokeDasharray="2,2"
                      opacity="0.6"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
              <span className="text-sm text-slate-600">Keys</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Servers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <span className="text-sm text-slate-600">Reassigned</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-6 min-w-72">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Add New Server</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Position: {newServerAngle}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="359"
                  value={newServerAngle}
                  onChange={(e) => setNewServerAngle(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  disabled={animating}
                />
              </div>

              <button
                onClick={addServer}
                disabled={animating || showNewServer}
                className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                {animating ? 'Adding...' : showNewServer ? 'Preview Mode' : 'Add Server'}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={removeLastServer}
                  disabled={animating || servers.length <= 2}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Remove
                </button>
                <button
                  onClick={resetServers}
                  disabled={animating}
                  className="flex-1 bg-slate-500 hover:bg-slate-600 disabled:bg-slate-300 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Key Assignments */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Key Assignments</h4>
            
            <div className="space-y-2">
              {currentAssignments.map(key => {
                const newAssignment = newServerAssignments.find(k => k.id === key.id);
                const willChange = showNewServer && newAssignment.assignedServer.id !== key.assignedServer.id;
                
                return (
                  <div key={key.id} className={`flex justify-between items-center p-2 rounded ${willChange ? 'bg-amber-50' : 'bg-slate-50'}`}>
                    <span className="font-mono text-sm">{key.id}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{key.assignedServer.id}</span>
                      {willChange && (
                        <>
                          <span className="text-amber-500">→</span>
                          <span className="text-sm text-amber-600">{newAssignment.assignedServer.id}</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {showNewServer && (
              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">{changedKeys.length}</span> out of {keys.length} keys would be reassigned
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
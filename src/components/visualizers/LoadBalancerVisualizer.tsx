"use client";

import { useState, useEffect } from 'react';

export function LoadBalancerVisualizer() {
  const [algorithm, setAlgorithm] = useState<'round-robin' | 'least-connections' | 'resource-based'>('round-robin');
  const [isRunning, setIsRunning] = useState(false);
  const [servers, setServers] = useState([
    { id: 1, load: 0, connections: 0, cpuUsage: 20 },
    { id: 2, load: 0, connections: 0, cpuUsage: 35 },
    { id: 3, load: 0, connections: 0, cpuUsage: 15 }
  ]);
  const [requests, setRequests] = useState<Array<{ id: number, x: number, y: number, targetServer: number }>>([]);
  const [currentRoundRobin] = useState({ index: 0 });
  const [totalRequests, setTotalRequests] = useState(0);

  const generateRequest = () => {
    let targetServer = 1;
    
    switch (algorithm) {
      case 'round-robin':
        targetServer = (currentRoundRobin.index % 3) + 1;
        currentRoundRobin.index++;
        break;
      case 'least-connections':
        const minConnections = Math.min(...servers.map(s => s.connections));
        targetServer = servers.find(s => s.connections === minConnections)?.id || 1;
        break;
      case 'resource-based':
        const minCpu = Math.min(...servers.map(s => s.cpuUsage));
        targetServer = servers.find(s => s.cpuUsage === minCpu)?.id || 1;
        break;
    }

    const newRequest = {
      id: Date.now(),
      x: 0,
      y: 150,
      targetServer
    };

    setRequests(prev => [...prev, newRequest]);
    setTotalRequests(prev => prev + 1);

    // Update server load
    setServers(prev => prev.map(server => 
      server.id === targetServer 
        ? { 
            ...server, 
            connections: server.connections + 1,
            load: Math.min(server.load + 20, 100),
            cpuUsage: Math.min(server.cpuUsage + Math.random() * 15, 95)
          }
        : server
    ));

    // Remove request after animation
    setTimeout(() => {
      setRequests(prev => prev.filter(req => req.id !== newRequest.id));
      setServers(prev => prev.map(server => 
        server.id === targetServer 
          ? { 
              ...server, 
              connections: Math.max(server.connections - 1, 0),
              load: Math.max(server.load - 20, 0),
              cpuUsage: Math.max(server.cpuUsage - 5, 10)
            }
          : server
      ));
    }, 2000);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(generateRequest, 800);
    }
    return () => clearInterval(interval);
  }, [isRunning, algorithm, servers]);

  const resetSimulation = () => {
    setIsRunning(false);
    setRequests([]);
    setServers([
      { id: 1, load: 0, connections: 0, cpuUsage: 20 },
      { id: 2, load: 0, connections: 0, cpuUsage: 35 },
      { id: 3, load: 0, connections: 0, cpuUsage: 15 }
    ]);
    setTotalRequests(0);
    currentRoundRobin.index = 0;
  };

  const getServerColor = (load: number) => {
    if (load < 30) return 'bg-emerald-500';
    if (load < 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Load Balancer Visualization</h3>
        <p className="text-slate-600">Watch how different algorithms distribute traffic across servers</p>
      </div>

      <div className="flex gap-4 mb-4">
        <select 
          value={algorithm} 
          onChange={(e) => setAlgorithm(e.target.value as any)}
          className="px-4 py-2 border border-slate-300 rounded-lg bg-white"
        >
          <option value="round-robin">Round Robin</option>
          <option value="least-connections">Least Connections</option>
          <option value="resource-based">Resource Based</option>
        </select>
        
        <button 
          onClick={() => setIsRunning(!isRunning)}
          className={`px-6 py-2 rounded-lg font-medium ${
            isRunning 
              ? 'bg-rose-500 hover:bg-rose-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isRunning ? 'Stop' : 'Start'} Traffic
        </button>
        
        <button 
          onClick={resetSimulation}
          className="px-6 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-medium"
        >
          Reset
        </button>
      </div>

      <div className="relative w-full max-w-4xl h-96 bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Load Balancer */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
          LB
        </div>
        <div className="absolute left-8 top-1/2 transform translate-y-8 text-sm text-slate-600 font-medium">
          Load Balancer
        </div>

        {/* Servers */}
        {servers.map((server, index) => (
          <div key={server.id} className="absolute right-8" style={{ top: `${20 + index * 120}px` }}>
            <div className={`w-16 h-16 ${getServerColor(server.load)} rounded-lg flex items-center justify-center text-white font-bold`}>
              S{server.id}
            </div>
            <div className="mt-2 text-xs text-slate-600 space-y-1">
              <div>Load: {server.load}%</div>
              <div>Conn: {server.connections}</div>
              <div>CPU: {server.cpuUsage.toFixed(0)}%</div>
            </div>
            
            {/* Load bar */}
            <div className="w-16 h-2 bg-slate-200 rounded mt-1">
              <div 
                className={`h-full rounded transition-all duration-300 ${getServerColor(server.load)}`}
                style={{ width: `${server.load}%` }}
              />
            </div>
          </div>
        ))}

        {/* Animated Requests */}
        {requests.map((request) => (
          <div
            key={request.id}
            className="absolute w-3 h-3 bg-blue-500 rounded-full transition-all duration-2000 ease-linear"
            style={{
              left: '96px',
              top: `${140 + (request.targetServer - 1) * 120}px`,
              transform: `translateX(${window.innerWidth > 768 ? 250 : 150}px)`
            }}
          />
        ))}

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {servers.map((server, index) => (
            <line
              key={server.id}
              x1="96"
              y1="192"
              x2={window.innerWidth > 768 ? "360" : "280"}
              y2={148 + index * 120}
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="4,4"
            />
          ))}
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-2">Algorithm: {algorithm}</h4>
          <p className="text-sm text-slate-600">
            {algorithm === 'round-robin' && 'Distributes requests evenly in rotation'}
            {algorithm === 'least-connections' && 'Routes to server with fewest connections'}
            {algorithm === 'resource-based' && 'Routes to server with lowest CPU usage'}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-2">Total Requests</h4>
          <p className="text-2xl font-bold text-blue-600">{totalRequests}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-2">Status</h4>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            <span className="text-sm text-slate-600">{isRunning ? 'Active' : 'Stopped'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
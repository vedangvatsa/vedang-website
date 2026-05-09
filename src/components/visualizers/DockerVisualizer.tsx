"use client";

import React, { useState } from 'react';

export function DockerVisualizer() {
  const [selectedApp, setSelectedApp] = useState<number | null>(null);
  const [containerStates, setContainerStates] = useState<Record<number, 'stopped' | 'building' | 'running'>>({});
  const [showComparison, setShowComparison] = useState(false);

  const applications = [
    { id: 1, name: 'Node.js API', color: 'emerald', runtime: 'Node.js 18', deps: ['Express', 'MongoDB'] },
    { id: 2, name: 'Python ML', color: 'blue', runtime: 'Python 3.9', deps: ['TensorFlow', 'NumPy'] },
    { id: 3, name: 'Java Web', color: 'amber', runtime: 'OpenJDK 11', deps: ['Spring Boot', 'MySQL'] }
  ];

  const buildContainer = (appId: number) => {
    setContainerStates(prev => ({ ...prev, [appId]: 'building' }));
    setTimeout(() => {
      setContainerStates(prev => ({ ...prev, [appId]: 'running' }));
    }, 2000);
  };

  const stopContainer = (appId: number) => {
    setContainerStates(prev => ({ ...prev, [appId]: 'stopped' }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'building': return 'bg-amber-500';
      case 'running': return 'bg-emerald-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Docker Container Platform</h3>
        <p className="text-slate-600 max-w-2xl">
          Package applications with their dependencies into lightweight containers. Click apps to build containers and explore the difference between containers and VMs.
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setShowComparison(false)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !showComparison ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Container Platform
        </button>
        <button
          onClick={() => setShowComparison(true)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            showComparison ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          vs Virtual Machines
        </button>
      </div>

      {!showComparison ? (
        <div className="w-full max-w-5xl">
          {/* Docker Host */}
          <div className="bg-slate-800 p-6 rounded-xl text-white mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <h4 className="text-xl font-semibold">Docker Host (Operating System)</h4>
            </div>
            
            {/* Docker Engine */}
            <div className="bg-slate-700 p-4 rounded-lg mb-4">
              <h5 className="font-medium mb-3 text-blue-300">Docker Engine</h5>
              
              {/* Applications Grid */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className={`bg-slate-600 p-4 rounded-lg cursor-pointer transition-all hover:bg-slate-500 ${
                      selectedApp === app.id ? 'ring-2 ring-blue-400' : ''
                    }`}
                    onClick={() => setSelectedApp(app.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="font-medium text-sm">{app.name}</h6>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(containerStates[app.id] || 'stopped')}`}></div>
                    </div>
                    <div className="text-xs text-slate-300 mb-2">{app.runtime}</div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {app.deps.map((dep, idx) => (
                        <span key={idx} className="bg-slate-500 px-2 py-1 rounded text-xs">{dep}</span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          buildContainer(app.id);
                        }}
                        disabled={containerStates[app.id] === 'running' || containerStates[app.id] === 'building'}
                        className="px-2 py-1 bg-emerald-600 text-xs rounded hover:bg-emerald-700 disabled:bg-slate-500 disabled:cursor-not-allowed"
                      >
                        {containerStates[app.id] === 'building' ? 'Building...' : 'Run'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          stopContainer(app.id);
                        }}
                        disabled={containerStates[app.id] !== 'running'}
                        className="px-2 py-1 bg-rose-600 text-xs rounded hover:bg-rose-700 disabled:bg-slate-500 disabled:cursor-not-allowed"
                      >
                        Stop
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-xs text-slate-400">
                Running containers: {Object.values(containerStates).filter(s => s === 'running').length} | 
                Memory usage: ~{Object.values(containerStates).filter(s => s === 'running').length * 50}MB
              </div>
            </div>
          </div>

          {/* Container Details */}
          {selectedApp && (
            <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">
                Container: {applications.find(a => a.id === selectedApp)?.name}
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-slate-700 mb-2">Image Layers</h5>
                  <div className="space-y-2">
                    <div className="bg-slate-200 p-2 rounded text-sm">Base OS (Alpine Linux)</div>
                    <div className="bg-blue-200 p-2 rounded text-sm">{applications.find(a => a.id === selectedApp)?.runtime}</div>
                    <div className="bg-emerald-200 p-2 rounded text-sm">Dependencies</div>
                    <div className="bg-amber-200 p-2 rounded text-sm">Application Code</div>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-slate-700 mb-2">Container Benefits</h5>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>• Isolated application environment</li>
                    <li>• Consistent across dev/staging/prod</li>
                    <li>• Fast startup (~2-3 seconds)</li>
                    <li>• Minimal resource overhead</li>
                    <li>• Portable across any Docker host</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-6xl grid grid-cols-2 gap-8">
          {/* Containers */}
          <div className="bg-slate-800 p-6 rounded-xl text-white">
            <h4 className="text-xl font-semibold mb-4 text-center">Docker Containers</h4>
            <div className="space-y-2">
              <div className="bg-slate-700 p-3 rounded text-center text-sm">Host Operating System</div>
              <div className="bg-blue-600 p-2 rounded text-center text-xs">Docker Engine</div>
              <div className="grid grid-cols-3 gap-1">
                <div className="bg-emerald-500 p-2 rounded text-center text-xs">App A</div>
                <div className="bg-amber-500 p-2 rounded text-center text-xs">App B</div>
                <div className="bg-rose-500 p-2 rounded text-center text-xs">App C</div>
              </div>
            </div>
            <div className="mt-4 text-xs space-y-1">
              <div>• Memory: ~150MB total</div>
              <div>• Startup: 2-3 seconds</div>
              <div>• Isolation: Process-level</div>
              <div>• OS: Shared kernel</div>
            </div>
          </div>

          {/* Virtual Machines */}
          <div className="bg-slate-800 p-6 rounded-xl text-white">
            <h4 className="text-xl font-semibold mb-4 text-center">Virtual Machines</h4>
            <div className="space-y-2">
              <div className="bg-slate-700 p-2 rounded text-center text-xs">Host Operating System</div>
              <div className="bg-indigo-600 p-2 rounded text-center text-xs">Hypervisor (VMware/VirtualBox)</div>
              <div className="space-y-1">
                <div className="bg-slate-600 p-1 rounded text-center text-xs">Guest OS A</div>
                <div className="bg-emerald-500 p-2 rounded text-center text-xs">App A</div>
              </div>
              <div className="space-y-1">
                <div className="bg-slate-600 p-1 rounded text-center text-xs">Guest OS B</div>
                <div className="bg-amber-500 p-2 rounded text-center text-xs">App B</div>
              </div>
            </div>
            <div className="mt-4 text-xs space-y-1">
              <div>• Memory: ~2-4GB total</div>
              <div>• Startup: 30-60 seconds</div>
              <div>• Isolation: Hardware-level</div>
              <div>• OS: Full virtualization</div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-sm text-slate-600 max-w-3xl">
        <strong>Key Insight:</strong> Containers share the host OS kernel and virtualize only the application layer, making them much more efficient than VMs which virtualize the entire hardware stack.
      </div>
    </div>
  );
}
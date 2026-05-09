"use client";

import { useState } from 'react';

export function MonorepoVisualizer() {
  const [selectedRepo, setSelectedRepo] = useState<'separate' | 'mono'>('separate');
  const [animatingChange, setAnimatingChange] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const projects = [
    { id: 'frontend', name: 'Frontend App', color: 'bg-blue-500', deps: ['shared-ui', 'utils'] },
    { id: 'backend', name: 'Backend API', color: 'bg-emerald-500', deps: ['utils', 'database'] },
    { id: 'mobile', name: 'Mobile App', color: 'bg-indigo-500', deps: ['shared-ui', 'utils'] },
    { id: 'shared-ui', name: 'UI Library', color: 'bg-rose-400', deps: [] },
    { id: 'utils', name: 'Utils', color: 'bg-amber-500', deps: [] },
    { id: 'database', name: 'DB Schema', color: 'bg-slate-500', deps: [] }
  ];

  const handleRepoSwitch = (type: 'separate' | 'mono') => {
    setAnimatingChange(true);
    setTimeout(() => {
      setSelectedRepo(type);
      setAnimatingChange(false);
    }, 300);
  };

  const getDependencyLines = (project: any, index: number) => {
    if (selectedRepo === 'separate') return null;
    
    return project.deps.map((depId: string) => {
      const depIndex = projects.findIndex(p => p.id === depId);
      if (depIndex === -1) return null;
      
      const startY = 120 + (index * 80) + 20;
      const endY = 120 + (depIndex * 80) + 20;
      const startX = 250;
      const endX = 180;
      
      return (
        <line
          key={`${project.id}-${depId}`}
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#64748b"
          strokeWidth="2"
          strokeDasharray="4,4"
          className={`transition-opacity duration-300 ${selectedProject && selectedProject !== project.id ? 'opacity-30' : 'opacity-100'}`}
        />
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Monorepo Architecture</h3>
        <p className="text-slate-600 max-w-2xl">
          Compare separate repositories vs monorepo structure. Click projects to see dependencies and switch between architectures.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => handleRepoSwitch('separate')}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            selectedRepo === 'separate'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white text-slate-600 border border-slate-300 hover:border-blue-300'
          }`}
        >
          Separate Repos
        </button>
        <button
          onClick={() => handleRepoSwitch('mono')}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            selectedRepo === 'mono'
              ? 'bg-indigo-500 text-white shadow-lg'
              : 'bg-white text-slate-600 border border-slate-300 hover:border-indigo-300'
          }`}
        >
          Monorepo
        </button>
      </div>

      <div className={`relative transition-all duration-300 ${animatingChange ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        {selectedRepo === 'separate' ? (
          <div className="grid grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                className={`relative cursor-pointer transform transition-all duration-200 hover:scale-105 ${
                  selectedProject && selectedProject !== project.id ? 'opacity-50' : 'opacity-100'
                }`}
              >
                <div className="bg-white border-2 border-slate-200 rounded-lg p-4 shadow-sm">
                  <div className={`w-4 h-4 rounded ${project.color} mb-2`}></div>
                  <div className="text-sm font-medium text-slate-800">{project.name}</div>
                  <div className="text-xs text-slate-500 mt-1">Separate Repo</div>
                  {project.deps.length > 0 && (
                    <div className="mt-2 text-xs text-slate-400">
                      Deps: {project.deps.join(', ')}
                    </div>
                  )}
                </div>
                {selectedProject === project.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="bg-white border-4 border-indigo-300 rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="text-lg font-bold text-indigo-700">Single Monorepo</div>
                <div className="text-sm text-slate-600">All projects in one repository</div>
              </div>
              
              <svg width="500" height="500" className="absolute top-0 left-0">
                {projects.map((project, index) => getDependencyLines(project, index))}
              </svg>
              
              <div className="space-y-3 relative z-10">
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-50 ${
                      selectedProject === project.id ? 'bg-indigo-50 border border-indigo-200' : 'bg-transparent'
                    } ${selectedProject && selectedProject !== project.id ? 'opacity-50' : 'opacity-100'}`}
                  >
                    <div className={`w-6 h-6 rounded ${project.color} flex-shrink-0`}></div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-800">{project.name}</div>
                      {project.deps.length > 0 && (
                        <div className="text-xs text-slate-500 mt-1">
                          Dependencies: {project.deps.join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 flex flex-col items-end">
                      <span>✓ Shared tooling</span>
                      <span>✓ Atomic commits</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg p-4 max-w-2xl text-center border border-slate-200">
        <div className="text-sm text-slate-600">
          {selectedRepo === 'separate' ? (
            <span>Separate repos require complex coordination for cross-project changes and duplicate tooling setup.</span>
          ) : (
            <span>Monorepo enables atomic commits across projects, shared tooling, and simplified dependency management.</span>
          )}
        </div>
      </div>
    </div>
  );
}
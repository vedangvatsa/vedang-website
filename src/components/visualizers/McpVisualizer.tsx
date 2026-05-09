"use client";

import { useState } from 'react';

export function McpVisualizer() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [showMcp, setShowMcp] = useState(false);
  const [animatingConnection, setAnimatingConnection] = useState(false);

  const models = [
    { id: 'claude', name: 'Claude', color: 'bg-blue-500' },
    { id: 'gpt', name: 'GPT-4', color: 'bg-indigo-500' },
    { id: 'gemini', name: 'Gemini', color: 'bg-rose-500' }
  ];

  const tools = [
    { id: 'database', name: 'Database', icon: '🗄️', color: 'bg-emerald-500' },
    { id: 'browser', name: 'Web Browser', icon: '🌐', color: 'bg-amber-500' },
    { id: 'filesystem', name: 'File System', icon: '📁', color: 'bg-slate-500' },
    { id: 'api', name: 'REST API', icon: '🔗', color: 'bg-blue-500' }
  ];

  const handleConnect = () => {
    if (selectedModel && selectedTool) {
      setAnimatingConnection(true);
      setTimeout(() => {
        setAnimatingConnection(false);
      }, 2000);
    }
  };

  const resetDemo = () => {
    setSelectedModel(null);
    setSelectedTool(null);
    setShowMcp(false);
    setAnimatingConnection(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Model Context Protocol (MCP)</h3>
        <p className="text-slate-600 max-w-2xl">
          Interactive demo: See how MCP standardizes AI model connections to external tools
        </p>
      </div>

      <div className="flex items-center gap-8 mb-6">
        <label className="flex items-center gap-2 text-slate-700">
          <input
            type="checkbox"
            checked={showMcp}
            onChange={(e) => setShowMcp(e.target.checked)}
            className="w-4 h-4 accent-blue-500"
          />
          Show MCP Layer
        </label>
        <button
          onClick={resetDemo}
          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
        >
          Reset Demo
        </button>
      </div>

      <div className="relative w-full max-w-4xl">
        {/* AI Models */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-600 mb-3">AI Models</p>
            <div className="flex gap-4">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center text-white font-semibold transition-all hover:scale-105 ${
                    model.color
                  } ${
                    selectedModel === model.id ? 'ring-4 ring-blue-300 scale-105' : ''
                  }`}
                >
                  <div className="text-2xl mb-1">🤖</div>
                  <div className="text-xs">{model.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MCP Layer */}
        {showMcp && (
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-2xl mb-2">🔄</div>
                <div className="font-bold">MCP Protocol</div>
                <div className="text-xs opacity-90">Standardized Interface</div>
              </div>
            </div>
          </div>
        )}

        {/* Connection Animation */}
        {animatingConnection && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
          </div>
        )}

        {/* Tools */}
        <div className="flex justify-center">
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-600 mb-3">External Tools</p>
            <div className="grid grid-cols-2 gap-4">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`w-24 h-24 rounded-xl flex flex-col items-center justify-center text-white font-semibold transition-all hover:scale-105 ${
                    tool.color
                  } ${
                    selectedTool === tool.id ? 'ring-4 ring-emerald-300 scale-105' : ''
                  }`}
                >
                  <div className="text-2xl mb-1">{tool.icon}</div>
                  <div className="text-xs text-center">{tool.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="text-center">
        {selectedModel && selectedTool && (
          <button
            onClick={handleConnect}
            disabled={animatingConnection}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg font-semibold transition-colors"
          >
            {animatingConnection ? 'Connecting...' : 'Connect via MCP'}
          </button>
        )}
        
        {!selectedModel && (
          <p className="text-slate-500">👆 Select an AI model above</p>
        )}
        
        {selectedModel && !selectedTool && (
          <p className="text-slate-500">👇 Now select a tool below</p>
        )}
      </div>

      {/* Benefits Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <div className={`p-4 rounded-lg border-2 transition-all ${
          showMcp ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
        }`}>
          <h4 className={`font-bold mb-2 ${showMcp ? 'text-emerald-800' : 'text-rose-800'}`}>
            {showMcp ? 'With MCP' : 'Without MCP'}
          </h4>
          <ul className={`text-sm space-y-1 ${showMcp ? 'text-emerald-700' : 'text-rose-700'}`}>
            {showMcp ? (
              <>
                <li>✅ One standard protocol</li>
                <li>✅ Any tool works with any model</li>
                <li>✅ No custom integration code</li>
                <li>✅ Easy to add new tools</li>
              </>
            ) : (
              <>
                <li>❌ Custom code for each tool</li>
                <li>❌ Model-specific integrations</li>
                <li>❌ Duplicate development effort</li>
                <li>❌ Hard to maintain</li>
              </>
            )}
          </ul>
        </div>
        
        <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <h4 className="font-bold text-blue-800 mb-2">How MCP Works</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <div>1. Tools implement MCP server spec</div>
            <div>2. Models use MCP client interface</div>
            <div>3. Standard protocol handles communication</div>
            <div>4. Universal compatibility achieved</div>
          </div>
        </div>
      </div>
    </div>
  );
}
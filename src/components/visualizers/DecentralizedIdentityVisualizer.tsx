"use client";

import { useState } from 'react';

export function DecentralizedIdentityVisualizer() {
  const [selectedIdentity, setSelectedIdentity] = useState<'centralized' | 'decentralized'>('centralized');
  const [animationPhase, setAnimationPhase] = useState(0);
  const [userAction, setUserAction] = useState<'login' | 'share' | 'revoke' | null>(null);

  const centralizedProviders = ['Google', 'Facebook', 'Apple'];
  const decentralizedNodes = ['Node A', 'Node B', 'Node C', 'Node D'];

  const handleIdentitySwitch = (type: 'centralized' | 'decentralized') => {
    setSelectedIdentity(type);
    setAnimationPhase(0);
    setUserAction(null);
  };

  const handleUserAction = (action: 'login' | 'share' | 'revoke') => {
    setUserAction(action);
    setAnimationPhase(1);
    setTimeout(() => setAnimationPhase(2), 1000);
    setTimeout(() => {
      setAnimationPhase(0);
      setUserAction(null);
    }, 3000);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login': return 'blue';
      case 'share': return 'emerald';
      case 'revoke': return 'rose';
      default: return 'slate';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Decentralized Identity (DID) Visualization</h3>
        <p className="text-slate-600">Compare centralized vs decentralized identity management by switching modes and triggering actions</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => handleIdentitySwitch('centralized')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            selectedIdentity === 'centralized'
              ? 'bg-rose-500 text-white shadow-lg'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Web2 (Centralized)
        </button>
        <button
          onClick={() => handleIdentitySwitch('decentralized')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            selectedIdentity === 'decentralized'
              ? 'bg-emerald-500 text-white shadow-lg'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Web3 (Decentralized)
        </button>
      </div>

      <div className="w-full max-w-4xl h-96 relative bg-white rounded-xl border border-slate-300 p-6">
        {selectedIdentity === 'centralized' ? (
          <div className="flex items-center justify-between h-full">
            {/* User */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mb-2">
                You
              </div>
              <div className="text-sm text-slate-600">User</div>
              {userAction && (
                <div className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-${getActionColor(userAction)}-100 text-${getActionColor(userAction)}-700`}>
                  {userAction}
                </div>
              )}
            </div>

            {/* Data Flow Lines */}
            <div className="flex-1 relative mx-8">
              {animationPhase > 0 && userAction && (
                <div className={`absolute top-1/2 left-0 h-1 bg-${getActionColor(userAction)}-500 transition-all duration-1000 ${
                  animationPhase === 1 ? 'w-full' : 'w-full opacity-50'
                }`} style={{ transform: 'translateY(-50%)' }} />
              )}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-100 px-3 py-1 rounded text-xs">
                All data controlled by provider
              </div>
            </div>

            {/* Centralized Providers */}
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-1 gap-3">
                {centralizedProviders.map((provider, index) => (
                  <div
                    key={provider}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                      animationPhase > 0 && userAction
                        ? `border-${getActionColor(userAction)}-500 bg-${getActionColor(userAction)}-50 scale-105`
                        : 'border-rose-300 bg-rose-50'
                    }`}
                  >
                    {provider}
                  </div>
                ))}
              </div>
              <div className="text-sm text-slate-600 mt-2">Centralized Providers</div>
              {animationPhase === 2 && (
                <div className="mt-2 text-xs text-rose-700 bg-rose-100 px-2 py-1 rounded">
                  Can revoke access anytime
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between h-full">
            {/* User with DID */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold mb-2 relative">
                You
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs">
                  🔑
                </div>
              </div>
              <div className="text-sm text-slate-600">You (with DID)</div>
              {userAction && (
                <div className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-${getActionColor(userAction)}-100 text-${getActionColor(userAction)}-700`}>
                  {userAction}
                </div>
              )}
            </div>

            {/* Distributed Network */}
            <div className="flex-1 relative mx-8">
              <div className="grid grid-cols-2 gap-4 h-full">
                {decentralizedNodes.map((node, index) => (
                  <div
                    key={node}
                    className={`flex items-center justify-center rounded-lg border-2 text-xs font-semibold transition-all ${
                      animationPhase > 0 && userAction
                        ? `border-${getActionColor(userAction)}-400 bg-${getActionColor(userAction)}-50 scale-105`
                        : 'border-emerald-300 bg-emerald-50'
                    }`}
                  >
                    {node}
                    {animationPhase > 0 && userAction && (
                      <div className={`ml-2 w-3 h-3 rounded-full bg-${getActionColor(userAction)}-500 animate-pulse`} />
                    )}
                  </div>
                ))}
              </div>
              {animationPhase === 0 && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-100 px-3 py-1 rounded text-xs">
                  Distributed consensus
                </div>
              )}
            </div>

            {/* Services */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-lg flex items-center justify-center border-2 border-indigo-300">
                <div className="text-center">
                  <div className="text-lg">🌐</div>
                  <div className="text-xs font-semibold">Services</div>
                </div>
              </div>
              <div className="text-sm text-slate-600 mt-2">Apps & Services</div>
              {animationPhase === 2 && (
                <div className="mt-2 text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
                  You control access
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => handleUserAction('login')}
          disabled={animationPhase > 0}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Simulate Login
        </button>
        <button
          onClick={() => handleUserAction('share')}
          disabled={animationPhase > 0}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Share Data
        </button>
        <button
          onClick={() => handleUserAction('revoke')}
          disabled={animationPhase > 0}
          className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Revoke Access
        </button>
      </div>

      <div className="max-w-2xl text-center space-y-2">
        <div className="text-sm text-slate-700 font-semibold">
          {selectedIdentity === 'centralized' 
            ? "Web2: Identity controlled by big tech companies" 
            : "Web3: You own and control your digital identity"}
        </div>
        <div className="text-xs text-slate-600">
          {selectedIdentity === 'centralized'
            ? "Data flows through centralized servers. Companies can monitor, restrict, or revoke your access at any time."
            : "Your identity exists on a distributed network. You hold the cryptographic keys and control who has access to your data."}
        </div>
      </div>
    </div>
  );
}
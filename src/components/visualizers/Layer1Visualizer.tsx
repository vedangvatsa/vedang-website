"use client";

import { useState } from 'react';

export function Layer1Visualizer() {
  const [selectedNetwork, setSelectedNetwork] = useState<'bitcoin' | 'ethereum'>('ethereum');
  const [attackProgress, setAttackProgress] = useState(0);
  const [isAttacking, setIsAttacking] = useState(false);
  const [showConsensus, setShowConsensus] = useState(false);

  const networks = {
    bitcoin: {
      name: 'Bitcoin',
      consensus: 'Proof of Work',
      security: 'Mining Power',
      tps: 7,
      securityValue: '$50B+',
      attackCost: '51% of mining power',
      color: 'amber'
    },
    ethereum: {
      name: 'Ethereum',
      consensus: 'Proof of Stake',
      security: 'Staked ETH',
      tps: 15,
      securityValue: '$60B+',
      attackCost: '51% of staked ETH',
      color: 'blue'
    }
  };

  const network = networks[selectedNetwork];

  const startAttack = () => {
    setIsAttacking(true);
    setAttackProgress(0);
    const interval = setInterval(() => {
      setAttackProgress(prev => {
        if (prev >= 50) {
          setIsAttacking(false);
          clearInterval(interval);
          return 50;
        }
        return prev + 1;
      });
    }, 100);
  };

  const resetAttack = () => {
    setAttackProgress(0);
    setIsAttacking(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Layer 1 Blockchain Security</h3>
        <p className="text-slate-600">Explore how base blockchain protocols maintain security through consensus mechanisms</p>
      </div>

      <div className="flex gap-4 mb-4">
        {Object.entries(networks).map(([key, net]) => (
          <button
            key={key}
            onClick={() => setSelectedNetwork(key as 'bitcoin' | 'ethereum')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedNetwork === key
                ? `bg-${net.color}-500 text-white`
                : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            {net.name}
          </button>
        ))}
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Network Overview */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">{network.name} Layer 1</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Consensus:</span>
              <span className={`font-semibold text-${network.color}-600`}>{network.consensus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Security Value:</span>
              <span className="font-semibold text-emerald-600">{network.securityValue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Throughput:</span>
              <span className="font-semibold">{network.tps} TPS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Attack Cost:</span>
              <span className="font-semibold text-rose-600">{network.attackCost}</span>
            </div>
          </div>
        </div>

        {/* Security Visualization */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Network Security</h4>
          <div className="relative h-32 bg-slate-100 rounded-lg overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r from-${network.color}-400 to-${network.color}-600 transition-all duration-500 flex items-center justify-center`}
              style={{ width: `${100 - attackProgress}%` }}
            >
              <span className="text-white font-semibold">Honest Network</span>
            </div>
            {attackProgress > 0 && (
              <div 
                className="absolute top-0 right-0 h-full bg-gradient-to-r from-rose-400 to-rose-600 flex items-center justify-center transition-all duration-100"
                style={{ width: `${attackProgress}%` }}
              >
                <span className="text-white font-semibold text-sm">Attack</span>
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={startAttack}
              disabled={isAttacking}
              className="flex-1 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAttacking ? 'Attacking...' : 'Simulate 51% Attack'}
            </button>
            <button
              onClick={resetAttack}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
            >
              Reset
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {attackProgress >= 50 
              ? "⚠️ Network compromised! Attacker controls majority." 
              : attackProgress > 0 
                ? `Attack progress: ${attackProgress}%. Network still secure.`
                : "Network is secure. Attack would require massive resources."
            }
          </p>
        </div>
      </div>

      {/* Consensus Mechanism */}
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-slate-800">Consensus Mechanism</h4>
            <button
              onClick={() => setShowConsensus(!showConsensus)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                showConsensus 
                  ? `bg-${network.color}-500 text-white` 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {showConsensus ? 'Hide Process' : 'Show Process'}
            </button>
          </div>
          
          {showConsensus && (
            <div className="space-y-4">
              {selectedNetwork === 'ethereum' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="w-8 h-8 bg-blue-500 rounded-full mb-2 animate-pulse"></div>
                    <h5 className="font-semibold text-blue-800">Validators</h5>
                    <p className="text-sm text-blue-600">Stake ETH to participate in consensus</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full mb-2 animate-pulse"></div>
                    <h5 className="font-semibold text-indigo-800">Propose Block</h5>
                    <p className="text-sm text-indigo-600">Selected validator proposes new block</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full mb-2 animate-pulse"></div>
                    <h5 className="font-semibold text-emerald-800">Finalize</h5>
                    <p className="text-sm text-emerald-600">2/3+ validators attest to finalize</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <div className="w-8 h-8 bg-amber-500 rounded-full mb-2 animate-spin"></div>
                    <h5 className="font-semibold text-amber-800">Mining</h5>
                    <p className="text-sm text-amber-600">Miners compete to solve puzzle</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="w-8 h-8 bg-orange-500 rounded-full mb-2 animate-pulse"></div>
                    <h5 className="font-semibold text-orange-800">Proof of Work</h5>
                    <p className="text-sm text-orange-600">Find valid hash with difficulty target</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full mb-2 animate-pulse"></div>
                    <h5 className="font-semibold text-emerald-800">Block Added</h5>
                    <p className="text-sm text-emerald-600">Longest chain rule determines truth</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 max-w-4xl">
        <p className="text-indigo-800 text-sm">
          <strong>Key Insight:</strong> Layer 1 networks are the foundational source of truth. Their security comes from 
          the economic cost of attacking them - requiring control of majority stake or mining power worth billions of dollars.
        </p>
      </div>
    </div>
  );
}
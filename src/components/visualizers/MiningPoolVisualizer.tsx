"use client";

import { useState, useEffect } from 'react';

export function MiningPoolVisualizer() {
  const [mode, setMode] = useState<'solo' | 'pool'>('solo');
  const [isActive, setIsActive] = useState(false);
  const [soloProgress, setSoloProgress] = useState(0);
  const [poolProgress, setPoolProgress] = useState(0);
  const [soloRewards, setSoloRewards] = useState(0);
  const [poolRewards, setPoolRewards] = useState(0);
  const [miners, setMiners] = useState([
    { id: 1, hashRate: 20, contribution: 0, active: true },
    { id: 2, hashRate: 15, contribution: 0, active: true },
    { id: 3, hashRate: 10, contribution: 0, active: true },
    { id: 4, hashRate: 25, contribution: 0, active: true },
  ]);
  const [blocksSolved, setBlocksSolved] = useState({ solo: 0, pool: 0 });

  const totalHashRate = miners.filter(m => m.active).reduce((sum, m) => sum + m.hashRate, 0);
  const yourHashRate = 20;
  const blockReward = 6.25;
  const difficultyTarget = 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        if (mode === 'solo') {
          setSoloProgress(prev => {
            const increment = yourHashRate / 10;
            const newProgress = prev + increment;
            if (newProgress >= difficultyTarget) {
              setSoloRewards(prev => prev + blockReward);
              setBlocksSolved(prev => ({ ...prev, solo: prev.solo + 1 }));
              return 0;
            }
            return newProgress;
          });
        } else {
          setPoolProgress(prev => {
            const increment = totalHashRate / 10;
            const newProgress = prev + increment;
            if (newProgress >= difficultyTarget) {
              const yourShare = (yourHashRate / totalHashRate) * blockReward;
              setPoolRewards(prev => prev + yourShare);
              setBlocksSolved(prev => ({ ...prev, pool: prev.pool + 1 }));
              
              setMiners(prevMiners => 
                prevMiners.map(miner => ({
                  ...miner,
                  contribution: miner.active ? (miner.hashRate / totalHashRate) * 100 : 0
                }))
              );
              return 0;
            }
            return newProgress;
          });
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isActive, mode, totalHashRate, yourHashRate]);

  const resetSimulation = () => {
    setIsActive(false);
    setSoloProgress(0);
    setPoolProgress(0);
    setSoloRewards(0);
    setPoolRewards(0);
    setBlocksSolved({ solo: 0, pool: 0 });
    setMiners(prev => prev.map(m => ({ ...m, contribution: 0 })));
  };

  const toggleMiner = (id: number) => {
    setMiners(prev => prev.map(m => 
      m.id === id ? { ...m, active: !m.active } : m
    ));
  };

  const currentProgress = mode === 'solo' ? soloProgress : poolProgress;
  const currentRewards = mode === 'solo' ? soloRewards : poolRewards;
  const progressPercent = (currentProgress / difficultyTarget) * 100;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Mining Pool Visualizer</h3>
        <p className="text-slate-600">Compare solo mining vs pool mining rewards and efficiency</p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setMode('solo')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            mode === 'solo' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          Solo Mining
        </button>
        <button
          onClick={() => setMode('pool')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            mode === 'pool' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          Pool Mining
        </button>
      </div>

      <div className="w-full max-w-4xl">
        {mode === 'solo' ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-600 rounded"></div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-800">Your Solo Miner</h4>
                <p className="text-slate-600">{yourHashRate} TH/s</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-slate-700">Block Progress</span>
                <span className="text-slate-700">{progressPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Mining Pool</h4>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {miners.map((miner) => (
                <div 
                  key={miner.id}
                  onClick={() => toggleMiner(miner.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    miner.active 
                      ? 'border-indigo-300 bg-indigo-50' 
                      : 'border-slate-200 bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800">
                        {miner.id === 1 ? 'You' : `Miner ${miner.id}`}
                      </div>
                      <div className="text-sm text-slate-600">{miner.hashRate} TH/s</div>
                      {miner.contribution > 0 && (
                        <div className="text-sm text-emerald-600 font-medium">
                          {miner.contribution.toFixed(1)}% share
                        </div>
                      )}
                    </div>
                    <div className={`w-4 h-4 rounded-full ${
                      miner.active ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-slate-700">Pool Progress (Combined: {totalHashRate} TH/s)</span>
                <span className="text-slate-700">{progressPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4">
                <div 
                  className="bg-indigo-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-8 py-3 rounded-lg font-semibold transition-all ${
            isActive 
              ? 'bg-rose-600 text-white hover:bg-rose-700' 
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {isActive ? 'Stop Mining' : 'Start Mining'}
        </button>
        <button
          onClick={resetSimulation}
          className="px-8 py-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-all"
        >
          Reset
        </button>
      </div>

      <div className="w-full max-w-2xl bg-white p-6 rounded-xl border border-slate-200">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Mining Statistics</h4>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{soloRewards.toFixed(3)}</div>
            <div className="text-slate-600">Solo BTC Earned</div>
            <div className="text-sm text-slate-500">{blocksSolved.solo} blocks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{poolRewards.toFixed(3)}</div>
            <div className="text-slate-600">Pool BTC Earned</div>
            <div className="text-sm text-slate-500">{blocksSolved.pool} blocks</div>
          </div>
        </div>
        
        {blocksSolved.solo > 0 && blocksSolved.pool > 0 && (
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-sm text-amber-800">
              <strong>Pool Advantage:</strong> {((poolRewards / poolRewards) / (soloRewards / soloRewards) * 100).toFixed(0)}% more consistent rewards
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
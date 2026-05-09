"use client";

import { useState, useEffect } from 'react';

export function EmissionRateVisualizer() {
  const [currentBlock, setCurrentBlock] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('bitcoin');
  const [timeSpeed, setTimeSpeed] = useState(1);

  const networks = {
    bitcoin: {
      name: 'Bitcoin',
      initialReward: 50,
      halvingInterval: 210000,
      blockTime: 10, // minutes
      color: 'amber'
    },
    ethereum: {
      name: 'Ethereum 2.0',
      initialReward: 2,
      halvingInterval: null,
      blockTime: 0.2, // 12 seconds
      color: 'blue'
    },
    custom: {
      name: 'Custom Token',
      initialReward: 100,
      halvingInterval: 100000,
      blockTime: 5,
      color: 'emerald'
    }
  };

  const network = networks[selectedNetwork];

  const calculateReward = (block) => {
    if (selectedNetwork === 'ethereum') {
      return 2; // Simplified constant emission
    }
    
    if (!network.halvingInterval) return network.initialReward;
    
    const halvings = Math.floor(block / network.halvingInterval);
    return network.initialReward / Math.pow(2, halvings);
  };

  const calculateTotalSupply = (block) => {
    if (selectedNetwork === 'ethereum') {
      return block * 2;
    }
    
    let total = 0;
    let currentBlock = 0;
    
    while (currentBlock < block) {
      const reward = calculateReward(currentBlock);
      const blocksInThisEra = Math.min(network.halvingInterval - (currentBlock % network.halvingInterval), block - currentBlock);
      total += blocksInThisEra * reward;
      currentBlock += blocksInThisEra;
    }
    
    return total;
  };

  const getAnnualInflation = () => {
    const currentReward = calculateReward(currentBlock);
    const blocksPerYear = (365 * 24 * 60) / network.blockTime;
    const annualEmission = blocksPerYear * currentReward;
    const totalSupply = calculateTotalSupply(currentBlock);
    
    if (totalSupply === 0) return 0;
    return (annualEmission / totalSupply) * 100;
  };

  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setCurrentBlock(prev => prev + (1000 * timeSpeed));
    }, 100);
    
    return () => clearInterval(interval);
  }, [isAnimating, timeSpeed]);

  const resetSimulation = () => {
    setCurrentBlock(0);
    setIsAnimating(false);
  };

  const getColorClasses = (color) => {
    const colors = {
      amber: 'bg-amber-500 border-amber-300 text-amber-900',
      blue: 'bg-blue-500 border-blue-300 text-blue-900',
      emerald: 'bg-emerald-500 border-emerald-300 text-emerald-900'
    };
    return colors[color] || colors.blue;
  };

  const halvingEvents = [];
  for (let i = 1; i <= 5; i++) {
    if (network.halvingInterval) {
      halvingEvents.push(i * network.halvingInterval);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Token Emission Rate Simulator</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how different emission schedules affect token supply and inflation rates over time. 
          Watch halving events reduce block rewards and their impact on annual inflation.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {Object.entries(networks).map(([key, net]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedNetwork(key);
              resetSimulation();
            }}
            className={`px-4 py-2 rounded-lg border-2 transition-all ${
              selectedNetwork === key 
                ? getColorClasses(net.color)
                : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {net.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-4xl">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-sm text-slate-500">Current Block</div>
          <div className="text-2xl font-bold text-slate-800">
            {currentBlock.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-sm text-slate-500">Block Reward</div>
          <div className="text-2xl font-bold text-blue-600">
            {calculateReward(currentBlock).toFixed(4)}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-sm text-slate-500">Total Supply</div>
          <div className="text-2xl font-bold text-emerald-600">
            {calculateTotalSupply(currentBlock).toLocaleString()}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-sm text-slate-500">Annual Inflation</div>
          <div className="text-2xl font-bold text-rose-600">
            {getAnnualInflation().toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white p-6 rounded-lg border border-slate-200">
        <div className="mb-4">
          <div className="text-sm font-medium text-slate-700 mb-2">Emission Timeline</div>
          <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
            <div 
              className={`h-full ${getColorClasses(network.color)} transition-all duration-300`}
              style={{ 
                width: network.halvingInterval 
                  ? `${Math.min((currentBlock % network.halvingInterval) / network.halvingInterval * 100, 100)}%`
                  : '100%'
              }}
            />
            {network.halvingInterval && halvingEvents.map((halvingBlock, idx) => (
              <div
                key={idx}
                className="absolute top-0 h-full w-1 bg-rose-500"
                style={{ left: `${(halvingBlock / (halvingEvents[halvingEvents.length - 1] * 1.2)) * 100}%` }}
              >
                <div className="absolute -top-8 -left-6 text-xs text-rose-600 font-medium">
                  Halving {idx + 1}
                </div>
              </div>
            ))}
          </div>
          {network.halvingInterval && (
            <div className="text-xs text-slate-500 mt-1">
              Next halving in: {(network.halvingInterval - (currentBlock % network.halvingInterval)).toLocaleString()} blocks
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center items-center">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            isAnimating 
              ? 'bg-rose-500 text-white hover:bg-rose-600' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isAnimating ? 'Pause' : 'Start'} Simulation
        </button>
        
        <button
          onClick={resetSimulation}
          className="px-6 py-3 rounded-lg font-medium bg-slate-500 text-white hover:bg-slate-600 transition-all"
        >
          Reset
        </button>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Speed:</label>
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.5"
            value={timeSpeed}
            onChange={(e) => setTimeSpeed(parseFloat(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-slate-600 w-8">{timeSpeed}x</span>
        </div>
      </div>

      <div className="text-center max-w-2xl">
        <div className="text-sm text-slate-600">
          <strong>Key Insights:</strong> Emission rates directly affect token inflation. Bitcoin's halving mechanism 
          creates a deflationary pressure over time, while constant emission models maintain steady inflation. 
          The emission schedule is key for balancing network security incentives with token value preservation.
        </div>
      </div>
    </div>
  );
}
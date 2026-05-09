"use client";

import { useState, useEffect } from 'react';

export function YieldFarmingVisualizer() {
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [stakedAmount, setStakedAmount] = useState(1000);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const protocols = [
    {
      id: 'lending',
      name: 'Lending Protocol',
      baseAPR: 5,
      tokenReward: 15,
      color: 'blue',
      description: 'Earn interest + governance tokens'
    },
    {
      id: 'liquidity',
      name: 'Liquidity Pool',
      baseAPR: 8,
      tokenReward: 25,
      color: 'emerald',
      description: 'Trading fees + LP rewards'
    },
    {
      id: 'staking',
      name: 'Staking Pool',
      baseAPR: 12,
      tokenReward: 35,
      color: 'indigo',
      description: 'High yield but higher risk'
    }
  ];

  const selectedProtocolData = protocols.find(p => p.id === selectedProtocol);
  const totalAPY = selectedProtocolData ? selectedProtocolData.baseAPR + selectedProtocolData.tokenReward : 0;
  const earnedAmount = selectedProtocolData ? (stakedAmount * (totalAPY / 100) * (timeElapsed / 365)) : 0;
  const totalValue = stakedAmount + earnedAmount;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnimating && selectedProtocol) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isAnimating, selectedProtocol]);

  const resetAnimation = () => {
    setTimeElapsed(0);
    setIsAnimating(false);
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500 border-blue-200 text-blue-700',
      emerald: 'bg-emerald-500 border-emerald-200 text-emerald-700',
      indigo: 'bg-indigo-500 border-indigo-200 text-indigo-700'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Yield Farming Simulator</h3>
        <p className="text-slate-600 max-w-2xl">
          Deploy your crypto across DeFi protocols to maximize returns through trading fees, interest, and token rewards
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Investment Amount Slider */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Investment Amount: ${stakedAmount.toLocaleString()}
          </label>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={stakedAmount}
            onChange={(e) => setStakedAmount(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Protocol Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {protocols.map((protocol) => (
            <button
              key={protocol.id}
              onClick={() => {
                setSelectedProtocol(protocol.id);
                resetAnimation();
              }}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                selectedProtocol === protocol.id
                  ? `border-${protocol.color}-400 bg-${protocol.color}-50`
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-lg ${getColorClasses(protocol.color).split(' ')[0]} flex items-center justify-center`}>
                  <div className="w-6 h-6 bg-white rounded opacity-80"></div>
                </div>
                <h4 className="font-semibold text-slate-800 mb-1">{protocol.name}</h4>
                <p className="text-sm text-slate-600 mb-2">{protocol.description}</p>
                <div className="text-sm">
                  <span className="text-slate-500">Base APR: </span>
                  <span className="font-semibold text-emerald-600">{protocol.baseAPR}%</span>
                </div>
                <div className="text-sm">
                  <span className="text-slate-500">Token Rewards: </span>
                  <span className="font-semibold text-rose-600">+{protocol.tokenReward}%</span>
                </div>
                <div className="text-lg font-bold text-slate-800 mt-2">
                  Total APY: {protocol.baseAPR + protocol.tokenReward}%
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Yield Simulation */}
        {selectedProtocol && (
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 mb-4">Yield Generation</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Initial Investment:</span>
                    <span className="font-semibold">${stakedAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Days Elapsed:</span>
                    <span className="font-semibold">{timeElapsed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Earned:</span>
                    <span className="font-semibold text-emerald-600">+${earnedAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-800 font-semibold">Total Value:</span>
                      <span className="font-bold text-lg">${totalValue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => setIsAnimating(!isAnimating)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    isAnimating
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {isAnimating ? 'Pause' : 'Start Farming'}
                </button>
                <button
                  onClick={resetAnimation}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Progress (365 days)</span>
                <span>{((timeElapsed / 365) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    selectedProtocolData ? `bg-${selectedProtocolData.color}-500` : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min((timeElapsed / 365) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Yield Breakdown */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Base Interest</div>
                <div className="text-lg font-bold text-blue-700">
                  ${((stakedAmount * (selectedProtocolData?.baseAPR || 0) / 100) * (timeElapsed / 365)).toFixed(2)}
                </div>
              </div>
              <div className="bg-rose-50 p-4 rounded-lg">
                <div className="text-sm text-rose-600 font-medium">Token Rewards</div>
                <div className="text-lg font-bold text-rose-700">
                  ${((stakedAmount * (selectedProtocolData?.tokenReward || 0) / 100) * (timeElapsed / 365)).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
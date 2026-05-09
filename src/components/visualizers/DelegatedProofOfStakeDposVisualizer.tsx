"use client";

import React, { useState, useEffect } from 'react';

export function DelegatedProofOfStakeDposVisualizer() {
  const [selectedDelegate, setSelectedDelegate] = useState<number | null>(null);
  const [voterStake, setVoterStake] = useState<number[]>([100, 150, 200, 80, 120, 90, 160, 110]);
  const [delegateVotes, setDelegateVotes] = useState<number[]>([320, 280, 240, 160]);
  const [isElecting, setIsElecting] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [blockProducer, setBlockProducer] = useState(0);
  const [animatingVote, setAnimatingVote] = useState<{ voter: number; delegate: number } | null>(null);

  const delegates = [
    { name: 'Delegate A', performance: 95, status: 'active' },
    { name: 'Delegate B', performance: 88, status: 'active' },
    { name: 'Delegate C', performance: 92, status: 'active' },
    { name: 'Delegate D', performance: 76, status: 'warning' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBlock(prev => prev + 1);
      setBlockProducer(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleVote = (voterIndex: number, delegateIndex: number) => {
    if (isElecting) return;
    
    setAnimatingVote({ voter: voterIndex, delegate: delegateIndex });
    
    setTimeout(() => {
      const stakeAmount = voterStake[voterIndex];
      setDelegateVotes(prev => {
        const newVotes = [...prev];
        newVotes[delegateIndex] += stakeAmount * 0.1;
        return newVotes;
      });
      setAnimatingVote(null);
    }, 500);
  };

  const triggerElection = () => {
    setIsElecting(true);
    
    setTimeout(() => {
      const sortedIndices = delegateVotes
        .map((votes, index) => ({ votes, index }))
        .sort((a, b) => b.votes - a.votes)
        .map(item => item.index);
      
      const newVotes = [...delegateVotes];
      sortedIndices.forEach((index, rank) => {
        if (rank >= 3) {
          newVotes[index] *= 0.9;
        }
      });
      
      setDelegateVotes(newVotes);
      setIsElecting(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Delegated Proof of Stake (DPoS)</h3>
        <p className="text-slate-600 max-w-2xl">
          Token holders elect delegates to validate blocks. Click voters to cast votes, watch the election process, and see how delegates produce blocks based on their voting power.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Voters Section */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-slate-700 mb-4">Token Holders (Voters)</h4>
          <div className="grid grid-cols-4 gap-3">
            {voterStake.map((stake, index) => (
              <div
                key={index}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  animatingVote?.voter === index 
                    ? 'bg-blue-100 border-blue-400 scale-105' 
                    : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
                onClick={() => selectedDelegate !== null && handleVote(index, selectedDelegate)}
              >
                <div className="text-sm font-medium text-slate-700">Voter {index + 1}</div>
                <div className="text-xs text-slate-500">{stake} tokens</div>
                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
                  stake > 150 ? 'bg-emerald-400' : stake > 100 ? 'bg-amber-400' : 'bg-slate-400'
                }`} />
                {animatingVote?.voter === index && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Select a delegate below, then click voters to cast votes
          </p>
        </div>

        {/* Delegates Section */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-slate-700">Elected Delegates</h4>
            <button
              onClick={triggerElection}
              disabled={isElecting}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isElecting 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isElecting ? 'Electing...' : 'Trigger Election'}
            </button>
          </div>
          
          <div className="space-y-3">
            {delegates.map((delegate, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  selectedDelegate === index 
                    ? 'bg-indigo-100 border-indigo-400' 
                    : blockProducer === index
                    ? 'bg-emerald-100 border-emerald-400'
                    : 'bg-white border-slate-200 hover:border-indigo-300'
                } ${isElecting ? 'animate-pulse' : ''}`}
                onClick={() => setSelectedDelegate(selectedDelegate === index ? null : index)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-slate-700">{delegate.name}</div>
                    <div className="text-sm text-slate-500">
                      {delegateVotes[index].toFixed(1)} votes
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {blockProducer === index && (
                      <div className="px-2 py-1 bg-emerald-200 text-emerald-800 text-xs rounded-full">
                        Producing
                      </div>
                    )}
                    <div className={`w-3 h-3 rounded-full ${
                      delegate.performance > 90 ? 'bg-emerald-400' : 
                      delegate.performance > 80 ? 'bg-amber-400' : 'bg-rose-400'
                    }`} />
                  </div>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((delegateVotes[index] / Math.max(...delegateVotes)) * 100, 100)}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Performance: {delegate.performance}%</span>
                  <span>Rank: #{delegateVotes.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v).findIndex(item => item.i === index) + 1}</span>
                </div>
                
                {animatingVote?.delegate === index && (
                  <div className="absolute inset-0 border-2 border-blue-400 rounded-lg animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Block Production Status */}
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-slate-700">Block Production</h4>
            <div className="text-sm text-slate-500">Current Block: #{currentBlock}</div>
          </div>
          
          <div className="flex justify-center items-center gap-4">
            {delegates.map((delegate, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 rounded-full border-4 transition-all duration-500 flex items-center justify-center ${
                  blockProducer === index 
                    ? 'border-emerald-400 bg-emerald-100 scale-110' 
                    : 'border-slate-300 bg-slate-100'
                }`}>
                  <span className="text-xs font-medium">{delegate.name.split(' ')[1]}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">{delegate.name}</div>
                {blockProducer === index && (
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mx-auto mt-1 animate-pulse" />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center text-sm text-slate-600">
            Delegates take turns producing blocks every 2 seconds based on their voting power
          </div>
        </div>
      </div>
    </div>
  );
}
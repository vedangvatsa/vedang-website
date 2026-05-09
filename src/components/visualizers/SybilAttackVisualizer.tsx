"use client";

import { useState } from 'react';

export function SybilAttackVisualizer() {
  const [step, setStep] = useState(0);
  const [sybilCount, setSybilCount] = useState(1);
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);

  const legitimateUsers = [
    { id: 1, name: 'Alice', vote: 'A' },
    { id: 2, name: 'Bob', vote: 'A' },
    { id: 3, name: 'Carol', vote: 'B' },
    { id: 4, name: 'Dave', vote: 'B' },
    { id: 5, name: 'Eve', vote: 'A' }
  ];

  const proposals = [
    { id: 'A', name: 'Proposal A', color: 'bg-blue-500' },
    { id: 'B', name: 'Proposal B', color: 'bg-emerald-500' }
  ];

  const generateSybilAddresses = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `sybil-${i + 1}`,
      address: `0x${Math.random().toString(16).substr(2, 8)}...`,
      vote: 'B'
    }));
  };

  const sybilAddresses = generateSybilAddresses(sybilCount);

  const getVoteCount = (proposal: string) => {
    const legitVotes = legitimateUsers.filter(u => u.vote === proposal).length;
    const sybilVotes = step >= 2 ? sybilAddresses.filter(s => s.vote === proposal).length : 0;
    return { legit: legitVotes, sybil: sybilVotes, total: legitVotes + sybilVotes };
  };

  const voteCountA = getVoteCount('A');
  const voteCountB = getVoteCount('B');
  const totalVotes = voteCountA.total + voteCountB.total;

  const steps = [
    "Normal DAO: 5 legitimate users vote on proposals",
    "Attacker creates multiple fake identities (Sybil addresses)",
    "Sybil addresses vote together to manipulate outcome"
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Sybil Attack Visualization</h3>
        <p className="text-slate-600 text-lg">See how fake identities can manipulate DAO voting outcomes</p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {/* Step Controls */}
        <div className="flex justify-center gap-4">
          {steps.map((stepText, index) => (
            <button
              key={index}
              onClick={() => setStep(index)}
              className={`px-4 py-2 rounded-lg transition-all ${
                step === index
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              Step {index + 1}
            </button>
          ))}
        </div>

        <div className="text-center text-slate-700 font-medium">
          {steps[step]}
        </div>

        {/* Sybil Count Slider (visible in step 1+) */}
        {step >= 1 && (
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center gap-4">
              <label className="text-slate-700 font-medium whitespace-nowrap">
                Sybil Addresses:
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={sybilCount}
                onChange={(e) => setSybilCount(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-rose-600 font-bold text-lg w-8 text-center">
                {sybilCount}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Legitimate Users */}
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h4 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              Legitimate Users ({legitimateUsers.length})
            </h4>
            <div className="space-y-2">
              {legitimateUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <span className="font-medium text-slate-700">{user.name}</span>
                  <div className={`px-3 py-1 rounded-full text-white text-sm ${
                    user.vote === 'A' ? 'bg-blue-500' : 'bg-emerald-500'
                  }`}>
                    Votes {user.vote}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sybil Addresses */}
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h4 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
              Sybil Addresses ({step >= 1 ? sybilCount : 0})
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {step >= 1 ? (
                sybilAddresses.map(sybil => (
                  <div
                    key={sybil.id}
                    className="flex items-center justify-between p-3 bg-rose-50 rounded-lg border border-rose-200"
                  >
                    <span className="font-mono text-sm text-slate-600">{sybil.address}</span>
                    <div className={`px-3 py-1 rounded-full text-white text-sm ${
                      step >= 2 ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}>
                      {step >= 2 ? `Votes ${sybil.vote}` : 'Created'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 py-8">
                  No Sybil addresses yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vote Results */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-4">Voting Results</h4>
          <div className="grid grid-cols-2 gap-4">
            {proposals.map(proposal => {
              const votes = getVoteCount(proposal.id);
              const percentage = totalVotes > 0 ? (votes.total / totalVotes * 100).toFixed(1) : '0.0';
              
              return (
                <div
                  key={proposal.id}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedProposal === proposal.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setSelectedProposal(selectedProposal === proposal.id ? null : proposal.id)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-4 h-4 rounded-full ${proposal.color}`}></div>
                    <span className="font-semibold text-slate-800">{proposal.name}</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-800 mb-1">
                    {votes.total} votes ({percentage}%)
                  </div>
                  {step >= 2 && (
                    <div className="text-sm text-slate-600">
                      <span className="text-emerald-600">{votes.legit} legitimate</span>
                      {votes.sybil > 0 && (
                        <>
                          <span className="mx-2">+</span>
                          <span className="text-rose-600">{votes.sybil} Sybil</span>
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* Vote bar */}
                  <div className="mt-3 bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${proposal.color}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {step >= 2 && voteCountB.total > voteCountA.total && (
            <div className="mt-4 p-4 bg-amber-100 border border-amber-300 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <span className="font-semibold text-amber-800">
                  Sybil Attack Successful: Proposal B wins due to fake votes!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
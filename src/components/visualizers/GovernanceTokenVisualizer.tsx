"use client";

import { useState } from 'react';

export function GovernanceTokenVisualizer() {
  const [selectedProposal, setSelectedProposal] = useState(0);
  const [userTokens, setUserTokens] = useState(100);
  const [userVote, setUserVote] = useState<'for' | 'against' | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const proposals = [
    {
      id: 0,
      title: "Increase Staking Rewards",
      description: "Raise APY from 5% to 8%",
      forVotes: 15420,
      againstVotes: 8340,
      totalTokens: 50000,
      status: "active"
    },
    {
      id: 1,
      title: "Treasury Allocation",
      description: "Allocate 500K for marketing",
      forVotes: 22100,
      againstVotes: 12800,
      totalTokens: 50000,
      status: "active"
    },
    {
      id: 2,
      title: "Protocol Upgrade",
      description: "Implement Layer 2 scaling",
      forVotes: 28900,
      againstVotes: 5600,
      totalTokens: 50000,
      status: "passed"
    }
  ];

  const steps = [
    "Select a proposal to vote on",
    "Choose your voting power",
    "Cast your vote",
    "See results and impact"
  ];

  const handleVote = (vote: 'for' | 'against') => {
    setUserVote(vote);
    setHasVoted(true);
    setCurrentStep(3);
  };

  const resetVote = () => {
    setUserVote(null);
    setHasVoted(false);
    setCurrentStep(0);
  };

  const getCurrentProposal = () => {
    const proposal = proposals[selectedProposal];
    const userVoteWeight = hasVoted ? userTokens : 0;
    const adjustedFor = proposal.forVotes + (userVote === 'for' ? userVoteWeight : 0);
    const adjustedAgainst = proposal.againstVotes + (userVote === 'against' ? userVoteWeight : 0);
    const totalVotes = adjustedFor + adjustedAgainst;
    
    return {
      ...proposal,
      forVotes: adjustedFor,
      againstVotes: adjustedAgainst,
      forPercentage: totalVotes > 0 ? (adjustedFor / totalVotes) * 100 : 50,
      againstPercentage: totalVotes > 0 ? (adjustedAgainst / totalVotes) * 100 : 50,
      userInfluence: totalVotes > 0 ? (userVoteWeight / totalVotes) * 100 : 0
    };
  };

  const proposal = getCurrentProposal();

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Governance Token Voting</h3>
        <p className="text-slate-600">Experience how governance tokens give holders voting power in decentralized decisions</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              index <= currentStep ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-600'
            }`}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-1 mx-2 ${
                index < currentStep ? 'bg-blue-500' : 'bg-slate-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Your Tokens */}
      <div className="bg-white rounded-lg p-6 border border-slate-200 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-slate-800">Your Governance Tokens</h4>
          <div className="text-2xl font-bold text-blue-600">{userTokens.toLocaleString()}</div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-slate-600 mb-2">Adjust your token holdings:</label>
          <input
            type="range"
            min="0"
            max="1000"
            value={userTokens}
            onChange={(e) => {
              setUserTokens(parseInt(e.target.value));
              setCurrentStep(1);
              if (hasVoted) {
                setHasVoted(false);
                setUserVote(null);
              }
            }}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0 tokens</span>
            <span>1,000 tokens</span>
          </div>
        </div>
        <div className="text-sm text-slate-600">
          Voting Power: <span className="font-semibold text-blue-600">
            {((userTokens / proposal.totalTokens) * 100).toFixed(2)}%
          </span> of total supply
        </div>
      </div>

      {/* Proposal Selection */}
      <div className="bg-white rounded-lg p-6 border border-slate-200 w-full max-w-4xl">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Active Proposals</h4>
        <div className="grid gap-3">
          {proposals.map((prop) => (
            <button
              key={prop.id}
              onClick={() => {
                setSelectedProposal(prop.id);
                setCurrentStep(Math.max(1, currentStep));
                resetVote();
              }}
              className={`p-4 rounded-lg border text-left transition-all ${
                selectedProposal === prop.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-slate-800">{prop.title}</div>
                  <div className="text-sm text-slate-600">{prop.description}</div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  prop.status === 'passed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {prop.status}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Voting Interface */}
      <div className="bg-white rounded-lg p-6 border border-slate-200 w-full max-w-4xl">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">
          {proposal.title}
        </h4>
        <p className="text-slate-600 mb-6">{proposal.description}</p>

        {/* Current Results */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Current Results</span>
            <span>{(proposal.forVotes + proposal.againstVotes).toLocaleString()} votes cast</span>
          </div>
          <div className="flex bg-slate-200 rounded-full overflow-hidden h-6">
            <div 
              className="bg-emerald-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${proposal.forPercentage}%` }}
            >
              {proposal.forPercentage > 15 && `${proposal.forPercentage.toFixed(1)}%`}
            </div>
            <div 
              className="bg-rose-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${proposal.againstPercentage}%` }}
            >
              {proposal.againstPercentage > 15 && `${proposal.againstPercentage.toFixed(1)}%`}
            </div>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-emerald-600">For: {proposal.forVotes.toLocaleString()}</span>
            <span className="text-rose-600">Against: {proposal.againstVotes.toLocaleString()}</span>
          </div>
        </div>

        {/* Voting Buttons */}
        {!hasVoted && userTokens > 0 && (
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => handleVote('for')}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Vote For
            </button>
            <button
              onClick={() => handleVote('against')}
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Vote Against
            </button>
          </div>
        )}

        {hasVoted && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-blue-800">
                  You voted {userVote?.toUpperCase()} with {userTokens.toLocaleString()} tokens
                </div>
                <div className="text-sm text-blue-600">
                  Your influence: {proposal.userInfluence.toFixed(2)}% of this vote
                </div>
              </div>
              <button
                onClick={resetVote}
                className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              >
                Change Vote
              </button>
            </div>
          </div>
        )}

        {userTokens === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
            <div className="font-semibold">No Voting Power</div>
            <div className="text-sm">You need governance tokens to participate in votes. Adjust the slider above to acquire tokens.</div>
          </div>
        )}
      </div>

      <div className="text-center text-sm text-slate-600 max-w-2xl">
        <strong>Key Concept:</strong> Governance tokens represent voting power in decentralized organizations. 
        Unlike utility or currency tokens, they grant control over protocol decisions. More tokens = more influence over the platform's future.
      </div>
    </div>
  );
}
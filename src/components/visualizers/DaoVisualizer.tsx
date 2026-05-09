"use client";

import { useState } from "react";

export function DaoVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [proposals, setProposals] = useState([
    { id: 1, title: "Hire Marketing Team", yesVotes: 0, noVotes: 0, threshold: 60, executed: false },
    { id: 2, title: "Invest in DeFi Protocol", yesVotes: 0, noVotes: 0, threshold: 70, executed: false },
    { id: 3, title: "Update Treasury Rules", yesVotes: 0, noVotes: 0, threshold: 50, executed: false }
  ]);
  const [selectedProposal, setSelectedProposal] = useState(0);
  const [userTokens, setUserTokens] = useState(100);

  const steps = [
    "Token Distribution",
    "Proposal Creation", 
    "Community Voting",
    "Automated Execution"
  ];

  const members = [
    { id: 1, name: "Alice", tokens: 250, voted: false },
    { id: 2, name: "Bob", tokens: 150, voted: false },
    { id: 3, name: "Carol", tokens: 200, voted: false },
    { id: 4, name: "Dave", tokens: 100, voted: false },
    { id: 5, name: "You", tokens: userTokens, voted: false }
  ];

  const totalTokens = members.reduce((sum, member) => sum + member.tokens, 0);

  const vote = (proposalId: number, voteType: 'yes' | 'no', tokens: number) => {
    setProposals(prev => prev.map(proposal => {
      if (proposal.id === proposalId) {
        return {
          ...proposal,
          yesVotes: voteType === 'yes' ? proposal.yesVotes + tokens : proposal.yesVotes,
          noVotes: voteType === 'no' ? proposal.noVotes + tokens : proposal.noVotes
        };
      }
      return proposal;
    }));
  };

  const executeProposal = (proposalId: number) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) return;

    const totalVotes = proposal.yesVotes + proposal.noVotes;
    const yesPercentage = totalVotes > 0 ? (proposal.yesVotes / totalVotes) * 100 : 0;

    if (yesPercentage >= proposal.threshold) {
      setProposals(prev => prev.map(p => 
        p.id === proposalId ? { ...p, executed: true } : p
      ));
    }
  };

  const simulateVoting = () => {
    const proposal = proposals[selectedProposal];
    if (!proposal) return;

    // Simulate other members voting
    let yesVotes = proposal.yesVotes;
    let noVotes = proposal.noVotes;

    members.slice(0, 4).forEach(member => {
      const voteYes = Math.random() > 0.4; // 60% chance of yes vote
      if (voteYes) {
        yesVotes += member.tokens;
      } else {
        noVotes += member.tokens;
      }
    });

    setProposals(prev => prev.map(p => 
      p.id === proposal.id ? { ...p, yesVotes, noVotes } : p
    ));
  };

  const currentProposal = proposals[selectedProposal];
  const totalVotes = currentProposal.yesVotes + currentProposal.noVotes;
  const yesPercentage = totalVotes > 0 ? (currentProposal.yesVotes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (currentProposal.noVotes / totalVotes) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-4">
          Decentralized Autonomous Organization (DAO)
        </h3>
        <p className="text-lg text-slate-600 max-w-3xl">
          Explore how DAOs operate through token-based governance, community voting, and automated smart contract execution
        </p>
      </div>

      {/* Step Navigation */}
      <div className="flex gap-4 mb-8">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentStep === index
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {index + 1}. {step}
          </button>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 0 && (
        <div className="w-full max-w-4xl bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-4">Token Distribution</h4>
          <div className="grid grid-cols-5 gap-4 mb-6">
            {members.map(member => (
              <div key={member.id} className="text-center p-4 bg-slate-50 rounded-lg border">
                <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                  {member.name[0]}
                </div>
                <p className="font-medium text-slate-700">{member.name}</p>
                <p className="text-sm text-slate-500">{member.tokens} tokens</p>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(member.tokens / totalTokens) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <p className="text-indigo-800">
              <strong>Your voting power:</strong> {userTokens} tokens = {((userTokens / totalTokens) * 100).toFixed(1)}% of total supply
            </p>
            <input
              type="range"
              min="50"
              max="300"
              value={userTokens}
              onChange={(e) => setUserTokens(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div className="w-full max-w-4xl bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-4">Active Proposals</h4>
          <div className="grid gap-4">
            {proposals.map((proposal, index) => (
              <div 
                key={proposal.id}
                onClick={() => setSelectedProposal(index)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedProposal === index ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium text-slate-800">{proposal.title}</h5>
                    <p className="text-sm text-slate-500">Threshold: {proposal.threshold}% approval needed</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    proposal.executed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {proposal.executed ? 'Executed' : 'Active'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="w-full max-w-4xl bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-4">Voting on: {currentProposal.title}</h4>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <h5 className="font-medium text-emerald-800 mb-2">YES Votes</h5>
              <p className="text-2xl font-bold text-emerald-700">{currentProposal.yesVotes} tokens</p>
              <p className="text-sm text-emerald-600">{yesPercentage.toFixed(1)}% of votes cast</p>
            </div>
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
              <h5 className="font-medium text-rose-800 mb-2">NO Votes</h5>
              <p className="text-2xl font-bold text-rose-700">{currentProposal.noVotes} tokens</p>
              <p className="text-sm text-rose-600">{noPercentage.toFixed(1)}% of votes cast</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Approval Progress</span>
              <span>{currentProposal.threshold}% needed</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 relative">
              <div 
                className="bg-emerald-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(yesPercentage, 100)}%` }}
              ></div>
              <div 
                className="absolute top-0 w-1 h-4 bg-slate-700"
                style={{ left: `${currentProposal.threshold}%` }}
              ></div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => vote(currentProposal.id, 'yes', userTokens)}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
            >
              Vote YES ({userTokens} tokens)
            </button>
            <button
              onClick={() => vote(currentProposal.id, 'no', userTokens)}
              className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-medium"
            >
              Vote NO ({userTokens} tokens)
            </button>
            <button
              onClick={simulateVoting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Simulate Community Voting
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="w-full max-w-4xl bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-xl font-semibold text-slate-800 mb-4">Smart Contract Execution</h4>
          
          <div className="bg-slate-50 p-4 rounded-lg border mb-6">
            <p className="text-slate-700 mb-2">
              <strong>Current Status:</strong> {currentProposal.title}
            </p>
            <p className="text-slate-600">
              Approval Rate: {yesPercentage.toFixed(1)}% | Required: {currentProposal.threshold}%
            </p>
            <p className={`font-medium ${
              yesPercentage >= currentProposal.threshold ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {yesPercentage >= currentProposal.threshold 
                ? '✓ Proposal meets threshold - Ready for execution' 
                : '⏳ Proposal needs more approval votes'
              }
            </p>
          </div>

          {yesPercentage >= currentProposal.threshold && !currentProposal.executed && (
            <div className="text-center">
              <button
                onClick={() => executeProposal(currentProposal.id)}
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-lg"
              >
                Execute Proposal Automatically
              </button>
              <p className="text-sm text-slate-500 mt-2">
                Smart contract will execute this proposal on-chain
              </p>
            </div>
          )}

          {currentProposal.executed && (
            <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200 text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">✓</span>
              </div>
              <h5 className="text-xl font-semibold text-emerald-800 mb-2">Proposal Executed!</h5>
              <p className="text-emerald-600">The smart contract has automatically implemented this decision.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
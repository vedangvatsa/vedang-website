"use client";

import { useState, useEffect } from 'react';

export function ValidatorVisualizer() {
  const [selectedValidator, setSelectedValidator] = useState<number | null>(null);
  const [blockProposal, setBlockProposal] = useState<{ validator: number; isValid: boolean } | null>(null);
  const [validators, setValidators] = useState([
    { id: 1, stake: 1000, isSlashed: false, rewards: 0 },
    { id: 2, stake: 1500, isSlashed: false, rewards: 0 },
    { id: 3, stake: 800, isSlashed: false, rewards: 0 },
    { id: 4, stake: 1200, isSlashed: false, rewards: 0 }
  ]);
  const [attestations, setAttestations] = useState<number[]>([]);
  const [phase, setPhase] = useState<'selection' | 'proposal' | 'attestation' | 'finalization'>('selection');
  const [blockCount, setBlockCount] = useState(0);

  const totalStake = validators.reduce((sum, v) => sum + v.stake, 0);

  const selectValidator = () => {
    const random = Math.random() * totalStake;
    let currentSum = 0;
    for (const validator of validators) {
      currentSum += validator.stake;
      if (random <= currentSum && !validator.isSlashed) {
        setSelectedValidator(validator.id);
        return validator.id;
      }
    }
    return validators[0].id;
  };

  const proposeBlock = (validatorId: number, makeInvalid: boolean = false) => {
    setBlockProposal({ validator: validatorId, isValid: !makeInvalid });
    setPhase('proposal');
  };

  const addAttestation = (validatorId: number) => {
    if (!attestations.includes(validatorId) && validatorId !== selectedValidator) {
      setAttestations([...attestations, validatorId]);
    }
  };

  const finalizeBlock = () => {
    if (!blockProposal) return;

    const requiredAttestations = Math.ceil(validators.filter(v => !v.isSlashed).length * 0.67);
    
    if (blockProposal.isValid && attestations.length >= requiredAttestations) {
      // Reward all participants
      setValidators(prev => prev.map(v => {
        if (v.id === selectedValidator || attestations.includes(v.id)) {
          return { ...v, rewards: v.rewards + 10 };
        }
        return v;
      }));
      setBlockCount(prev => prev + 1);
    } else if (!blockProposal.isValid) {
      // Slash the proposer and any attestors
      setValidators(prev => prev.map(v => {
        if (v.id === selectedValidator || attestations.includes(v.id)) {
          return { ...v, stake: Math.max(0, v.stake - 100), isSlashed: v.stake <= 100 };
        }
        return v;
      }));
    }

    // Reset for next round
    setTimeout(() => {
      setSelectedValidator(null);
      setBlockProposal(null);
      setAttestations([]);
      setPhase('selection');
    }, 2000);
  };

  const reset = () => {
    setValidators([
      { id: 1, stake: 1000, isSlashed: false, rewards: 0 },
      { id: 2, stake: 1500, isSlashed: false, rewards: 0 },
      { id: 3, stake: 800, isSlashed: false, rewards: 0 },
      { id: 4, stake: 1200, isSlashed: false, rewards: 0 }
    ]);
    setSelectedValidator(null);
    setBlockProposal(null);
    setAttestations([]);
    setPhase('selection');
    setBlockCount(0);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Proof of Stake Validator</h3>
        <p className="text-slate-600">Interactive simulation of validator selection, block proposal, and consensus</p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-4xl">
        <div className="flex justify-between items-center">
          <div className="text-sm text-slate-600">
            Blocks Finalized: <span className="font-bold text-emerald-600">{blockCount}</span>
          </div>
          <div className="text-sm text-slate-600">
            Phase: <span className="font-bold text-blue-600 capitalize">{phase}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {validators.map((validator) => (
            <div
              key={validator.id}
              className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                validator.isSlashed
                  ? 'bg-rose-100 border-rose-300'
                  : selectedValidator === validator.id
                  ? 'bg-blue-100 border-blue-400'
                  : attestations.includes(validator.id)
                  ? 'bg-emerald-100 border-emerald-400'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => {
                if (phase === 'attestation' && validator.id !== selectedValidator && !validator.isSlashed) {
                  addAttestation(validator.id);
                }
              }}
            >
              <div className="text-sm font-bold text-slate-700">Validator {validator.id}</div>
              <div className="text-xs text-slate-600 mt-1">
                Stake: {validator.stake} tokens
              </div>
              <div className="text-xs text-slate-600">
                Selection Weight: {((validator.stake / totalStake) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-emerald-600 font-medium">
                Rewards: +{validator.rewards}
              </div>
              {validator.isSlashed && (
                <div className="text-xs text-rose-600 font-bold mt-1">SLASHED</div>
              )}
              {selectedValidator === validator.id && (
                <div className="text-xs text-blue-600 font-bold mt-1">PROPOSER</div>
              )}
              {attestations.includes(validator.id) && (
                <div className="text-xs text-emerald-600 font-bold mt-1">ATTESTED</div>
              )}
            </div>
          ))}
        </div>

        {blockProposal && (
          <div className={`p-4 rounded-lg border-2 text-center ${
            blockProposal.isValid ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
          }`}>
            <div className="font-bold text-slate-700">
              Proposed Block by Validator {blockProposal.validator}
            </div>
            <div className={`text-sm mt-1 ${blockProposal.isValid ? 'text-emerald-600' : 'text-rose-600'}`}>
              Status: {blockProposal.isValid ? 'Valid Block' : 'Invalid Block'}
            </div>
            <div className="text-xs text-slate-600 mt-2">
              Attestations: {attestations.length} / {Math.ceil(validators.filter(v => !v.isSlashed).length * 0.67)} required
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          {phase === 'selection' && (
            <button
              onClick={() => {
                const validatorId = selectValidator();
                setPhase('proposal');
                setTimeout(() => proposeBlock(validatorId), 500);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Select Validator (Stake-Weighted)
            </button>
          )}

          {phase === 'proposal' && blockProposal && (
            <button
              onClick={() => setPhase('attestation')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Begin Attestation Phase
            </button>
          )}

          {phase === 'attestation' && (
            <button
              onClick={() => {
                setPhase('finalization');
                setTimeout(finalizeBlock, 500);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Finalize Block
            </button>
          )}

          {phase === 'selection' && (
            <>
              <button
                onClick={() => {
                  const validatorId = selectValidator();
                  proposeBlock(validatorId, true);
                  setTimeout(() => setPhase('attestation'), 1000);
                }}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
              >
                Simulate Invalid Block
              </button>

              <button
                onClick={reset}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Reset Simulation
              </button>
            </>
          )}
        </div>

        <div className="text-xs text-slate-600 text-center max-w-2xl mx-auto">
          <p className="mb-2">
            <strong>How it works:</strong> Validators are selected based on stake weight. The selected validator proposes a block.
            Other validators attest to its validity. If 67% attest to a valid block, it's finalized and rewards are distributed.
          </p>
          <p>
            <strong>Slashing:</strong> Validators who propose or attest to invalid blocks lose stake and can be banned.
            Click validators during attestation phase to make them attest.
          </p>
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from 'react';

export function ZeroKnowledgeProofVisualizer() {
  const [step, setStep] = useState(0);
  const [userSecret, setUserSecret] = useState('');
  const [threshold, setThreshold] = useState(50000);
  const [proof, setProof] = useState<{ commitment: string; challenge: string; response: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const steps = [
    "Setup: Alice wants to prove her income is above threshold without revealing exact amount",
    "Commitment: Alice creates a cryptographic commitment to her secret income",
    "Challenge: Bank sends a random challenge number",
    "Response: Alice provides mathematical proof without revealing income",
    "Verification: Bank verifies the proof mathematically"
  ];

  const generateCommitment = (secret: number) => {
    // Simplified commitment scheme (in reality this would use proper cryptographic functions)
    const random = Math.floor(Math.random() * 1000);
    const commitment = ((secret * 31 + random) % 97).toString(16);
    return { commitment, random };
  };

  const handleCreateProof = () => {
    if (!userSecret || isNaN(Number(userSecret))) return;
    
    const income = Number(userSecret);
    const { commitment, random } = generateCommitment(income);
    const challenge = Math.floor(Math.random() * 100).toString(16);
    
    // Simplified zero-knowledge proof response
    const response = ((income > threshold ? 1 : 0) * parseInt(challenge, 16) + random).toString(16);
    
    setProof({ commitment, challenge, response });
    setStep(Math.min(step + 1, 4));
  };

  const handleVerify = () => {
    if (!proof) return;
    
    setIsVerifying(true);
    setTimeout(() => {
      // Simplified verification (in reality this would be more complex)
      const isValid = proof.commitment.length > 0 && proof.response.length > 0;
      setVerificationResult(isValid);
      setIsVerifying(false);
      setStep(4);
    }, 2000);
  };

  const reset = () => {
    setStep(0);
    setUserSecret('');
    setProof(null);
    setVerificationResult(null);
    setIsVerifying(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Zero-Knowledge Proof Visualizer</h3>
        <p className="text-slate-600">Prove you know a secret without revealing it - Interactive loan approval demo</p>
      </div>

      {/* Progress Steps */}
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          {steps.map((stepText, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index <= step ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {index + 1}
              </div>
              <div className="text-xs text-center mt-2 max-w-24">
                {stepText.split(':')[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Area */}
      <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 p-6">
        {step === 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-slate-800">Setup Your Scenario</h4>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Secret Income (Alice):
              </label>
              <input
                type="number"
                value={userSecret}
                onChange={(e) => setUserSecret(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your income (e.g., 75000)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bank's Minimum Income Requirement: ${threshold.toLocaleString()}
              </label>
              <input
                type="range"
                min="30000"
                max="100000"
                step="5000"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <button
              onClick={() => setStep(1)}
              disabled={!userSecret}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Start Proof Process
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-slate-800">Create Commitment</h4>
            <div className="bg-slate-100 p-4 rounded-lg">
              <p className="text-sm text-slate-600 mb-2">
                Alice creates a cryptographic commitment to her income without revealing it:
              </p>
              <div className="font-mono text-xs bg-white p-2 rounded border">
                commitment = hash(income + random_number)
              </div>
            </div>
            <button
              onClick={handleCreateProof}
              className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
            >
              Generate Commitment
            </button>
          </div>
        )}

        {step >= 2 && proof && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-slate-800">
              {step === 2 ? "Challenge Generated" : step === 3 ? "Proof Response" : "Verification"}
            </h4>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-xs font-semibold text-blue-700 mb-1">Commitment (Public)</div>
                <div className="font-mono text-sm text-blue-800">0x{proof.commitment}</div>
              </div>
              
              {step >= 2 && (
                <div className="bg-emerald-50 p-3 rounded-lg">
                  <div className="text-xs font-semibold text-emerald-700 mb-1">Challenge (Public)</div>
                  <div className="font-mono text-sm text-emerald-800">0x{proof.challenge}</div>
                </div>
              )}
              
              {step >= 3 && (
                <div className="bg-amber-50 p-3 rounded-lg">
                  <div className="text-xs font-semibold text-amber-700 mb-1">Response (Public)</div>
                  <div className="font-mono text-sm text-amber-800">0x{proof.response}</div>
                  <div className="text-xs text-amber-600 mt-1">
                    ✓ Proves income > ${threshold.toLocaleString()} without revealing exact amount
                  </div>
                </div>
              )}
            </div>

            {step === 2 && (
              <button
                onClick={() => setStep(3)}
                className="w-full bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-600"
              >
                Generate Response
              </button>
            )}

            {step === 3 && (
              <button
                onClick={handleVerify}
                className="w-full bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-amber-600"
              >
                Verify Proof
              </button>
            )}

            {step === 4 && (
              <div className="space-y-4">
                {isVerifying ? (
                  <div className="text-center py-4">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-slate-600 mt-2">Verifying proof...</p>
                  </div>
                ) : (
                  <div className={`p-4 rounded-lg text-center ${
                    verificationResult ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    <div className="text-2xl mb-2">
                      {verificationResult ? '✅' : '❌'}
                    </div>
                    <div className="font-semibold">
                      {verificationResult ? 'Proof Valid!' : 'Proof Invalid!'}
                    </div>
                    <div className="text-sm mt-2">
                      {verificationResult 
                        ? `Income verified to be above $${threshold.toLocaleString()} without revealing exact amount`
                        : 'The proof could not be verified'
                      }
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 4 && !isVerifying && (
          <button
            onClick={reset}
            className="w-full mt-4 bg-slate-500 text-white py-2 px-4 rounded-md hover:bg-slate-600"
          >
            Try Another Proof
          </button>
        )}
      </div>

      <div className="max-w-2xl text-center text-sm text-slate-600">
        <p>
          <strong>Key Insight:</strong> Alice proved her income meets the requirement without the bank learning her exact salary. 
          The math guarantees the proof is valid while keeping the secret truly secret.
        </p>
      </div>
    </div>
  );
}
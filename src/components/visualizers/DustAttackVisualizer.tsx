"use client";

import { useState, useEffect } from "react";

export function DustAttackVisualizer() {
  const [step, setStep] = useState(0);
  const [selectedWallet, setSelectedWallet] = useState<number | null>(null);
  const [isAttacking, setIsAttacking] = useState(false);
  const [showLinks, setShowLinks] = useState(false);

  const wallets = [
    { id: 1, address: "1A1z...", balance: 2.5, dustReceived: false, spent: false, linkedAddresses: ["1B2c...", "1C3d..."] },
    { id: 2, address: "1B2c...", balance: 1.8, dustReceived: false, spent: false, linkedAddresses: ["1A1z...", "1D4e..."] },
    { id: 3, address: "1C3d...", balance: 3.2, dustReceived: false, spent: false, linkedAddresses: ["1A1z...", "1E5f..."] },
    { id: 4, address: "1D4e...", balance: 0.9, dustReceived: false, spent: false, linkedAddresses: ["1B2c...", "1F6g..."] },
    { id: 5, address: "1E5f...", balance: 1.5, dustReceived: false, spent: false, linkedAddresses: ["1C3d...", "1G7h..."] },
    { id: 6, address: "1F6g...", balance: 2.1, dustReceived: false, spent: false, linkedAddresses: ["1D4e...", "1H8i..."] },
  ];

  const [walletStates, setWalletStates] = useState(wallets);
  const [attackerKnowledge, setAttackerKnowledge] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isAttacking && step === 1) {
      const timer = setTimeout(() => {
        setWalletStates(prev => prev.map(wallet => ({ ...wallet, dustReceived: true })));
        setStep(2);
        setIsAttacking(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAttacking, step]);

  const steps = [
    "Initial State: Multiple wallets with normal balances",
    "Dust Attack: Sending tiny amounts to all wallets",
    "Monitoring Phase: Waiting for transactions",
    "Privacy Breach: Linking wallets through dust usage"
  ];

  const startDustAttack = () => {
    if (step === 0) {
      setStep(1);
      setIsAttacking(true);
    }
  };

  const simulateSpending = (walletId: number) => {
    if (step === 2) {
      const wallet = walletStates.find(w => w.id === walletId);
      if (wallet && wallet.dustReceived) {
        setWalletStates(prev => prev.map(w => 
          w.id === walletId ? { ...w, spent: true } : w
        ));
        
        const newKnowledge = new Set(attackerKnowledge);
        wallet.linkedAddresses.forEach(addr => newKnowledge.add(addr));
        newKnowledge.add(wallet.address);
        setAttackerKnowledge(newKnowledge);
        
        if (walletStates.filter(w => w.spent).length >= 2) {
          setStep(3);
          setShowLinks(true);
        }
      }
    }
  };

  const reset = () => {
    setStep(0);
    setSelectedWallet(null);
    setIsAttacking(false);
    setShowLinks(false);
    setWalletStates(wallets);
    setAttackerKnowledge(new Set());
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Dust Attack Privacy Breach</h3>
        <p className="text-slate-600 max-w-2xl">
          Watch how attackers send tiny amounts of cryptocurrency to trace wallet connections and break user privacy
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {steps.map((stepText, index) => (
          <div
            key={index}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              step === index
                ? "bg-blue-500 text-white"
                : step > index
                ? "bg-emerald-500 text-white"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {index + 1}. {stepText}
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-4xl">
        {step === 1 && isAttacking && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-rose-500 text-white px-6 py-3 rounded-lg font-bold animate-pulse">
              Sending 0.00000546 BTC to all wallets...
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {walletStates.map((wallet) => (
            <div
              key={wallet.id}
              onClick={() => simulateSpending(wallet.id)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                wallet.spent
                  ? "bg-rose-100 border-rose-300"
                  : wallet.dustReceived
                  ? "bg-amber-100 border-amber-300 hover:bg-amber-200"
                  : "bg-white border-slate-200 hover:border-slate-300"
              } ${attackerKnowledge.has(wallet.address) ? "ring-4 ring-rose-300" : ""}`}
            >
              <div className="font-mono text-sm text-slate-700">{wallet.address}</div>
              <div className="text-lg font-bold text-slate-800 mt-1">
                {wallet.balance} BTC
              </div>
              {wallet.dustReceived && (
                <div className="text-xs text-amber-600 mt-1">
                  + 0.00000546 BTC (dust)
                </div>
              )}
              {wallet.spent && (
                <div className="text-xs text-rose-600 mt-1 font-medium">
                  Transaction sent (dust combined)
                </div>
              )}
              {step === 2 && wallet.dustReceived && !wallet.spent && (
                <div className="text-xs text-blue-600 mt-2">
                  Click to spend funds
                </div>
              )}
            </div>
          ))}
        </div>

        {showLinks && step === 3 && (
          <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl">
            <h4 className="font-bold text-rose-800 mb-2">Privacy Compromised!</h4>
            <p className="text-rose-700 text-sm mb-3">
              Attacker has linked these addresses by tracking dust usage:
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.from(attackerKnowledge).map((address) => (
                <span
                  key={address}
                  className="px-3 py-1 bg-rose-200 text-rose-800 rounded-lg text-sm font-mono"
                >
                  {address}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {step === 0 && (
          <button
            onClick={startDustAttack}
            className="px-6 py-3 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors"
          >
            Launch Dust Attack
          </button>
        )}
        {step >= 2 && (
          <button
            onClick={reset}
            className="px-6 py-3 bg-slate-500 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors"
          >
            Reset Simulation
          </button>
        )}
      </div>

      {step === 3 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 max-w-2xl">
          <h4 className="font-bold text-indigo-800 mb-2">Defense Strategies:</h4>
          <ul className="text-indigo-700 text-sm space-y-1">
            <li>• Use coin control features to avoid spending dust</li>
            <li>• Employ privacy-focused wallets with dust protection</li>
            <li>• Consider using mixing services or privacy coins</li>
            <li>• Monitor for unexpected small deposits</li>
          </ul>
        </div>
      )}
    </div>
  );
}
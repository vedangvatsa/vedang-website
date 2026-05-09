"use client";

import { useState } from 'react';

export function DefiVisualizer() {
  const [activeTab, setActiveTab] = useState('lending');
  const [depositAmount, setDepositAmount] = useState(1000);
  const [borrowAmount, setBorrowAmount] = useState(500);
  const [timeMonths, setTimeMonths] = useState(12);
  const [showComparison, setShowComparison] = useState(false);

  const lendingAPY = 0.05; // 5%
  const borrowAPY = 0.08; // 8%
  const tradeFee = 0.003; // 0.3%
  const bankAPY = 0.01; // 1%
  const bankFees = 25; // monthly fees

  const calculateLendingReturn = () => {
    const interest = depositAmount * lendingAPY * (timeMonths / 12);
    return { total: depositAmount + interest, interest };
  };

  const calculateBorrowCost = () => {
    const interest = borrowAmount * borrowAPY * (timeMonths / 12);
    return { total: borrowAmount + interest, interest };
  };

  const calculateBankReturn = () => {
    const interest = depositAmount * bankAPY * (timeMonths / 12);
    const totalFees = bankFees * timeMonths;
    const netReturn = interest - totalFees;
    return { total: depositAmount + netReturn, netReturn };
  };

  const lendingResult = calculateLendingReturn();
  const borrowResult = calculateBorrowCost();
  const bankResult = calculateBankReturn();

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Decentralized Finance (DeFi)</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how DeFi protocols replace traditional financial intermediaries with smart contracts, 
          offering transparent, permissionless financial services.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('lending')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'lending'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Lending Protocol
        </button>
        <button
          onClick={() => setActiveTab('dex')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'dex'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          DEX Trading
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'comparison'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          DeFi vs Traditional
        </button>
      </div>

      {activeTab === 'lending' && (
        <div className="w-full max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-slate-800">Lending Protocol Controls</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Deposit Amount: ${depositAmount.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Time Period: {timeMonths} months
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="24"
                    step="1"
                    value={timeMonths}
                    onChange={(e) => setTimeMonths(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Borrow Amount: ${borrowAmount.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="100"
                    max={depositAmount * 0.8}
                    step="50"
                    value={borrowAmount}
                    onChange={(e) => setBorrowAmount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-slate-800">Protocol Results</h4>
              
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <h5 className="font-medium text-emerald-800">Lending Returns</h5>
                <p className="text-emerald-700">Interest Earned: ${lendingResult.interest.toFixed(2)}</p>
                <p className="text-emerald-700">Total Value: ${lendingResult.total.toFixed(2)}</p>
                <p className="text-sm text-emerald-600">APY: {(lendingAPY * 100).toFixed(1)}%</p>
              </div>

              <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
                <h5 className="font-medium text-rose-800">Borrowing Costs</h5>
                <p className="text-rose-700">Interest Owed: ${borrowResult.interest.toFixed(2)}</p>
                <p className="text-rose-700">Total Repayment: ${borrowResult.total.toFixed(2)}</p>
                <p className="text-sm text-rose-600">APY: {(borrowAPY * 100).toFixed(1)}%</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-800">Collateralization Ratio</h5>
                <p className="text-blue-700">
                  {((borrowAmount / depositAmount) * 100).toFixed(1)}% 
                  <span className="text-sm ml-2">
                    ({borrowAmount < depositAmount * 0.8 ? 'Safe' : 'Risk of Liquidation'})
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dex' && (
        <div className="w-full max-w-3xl">
          <h4 className="text-xl font-semibold text-slate-800 mb-6 text-center">Decentralized Exchange Flow</h4>
          
          <div className="flex items-center justify-between mb-8">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                You
              </div>
              <p className="text-sm text-blue-700">Want to swap ETH → USDC</p>
            </div>

            <div className="flex-1 mx-4">
              <div className="bg-indigo-500 h-1 rounded-full relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-indigo-500 w-4 h-4 rounded-full"></div>
              </div>
              <p className="text-center text-sm text-slate-600 mt-2">Smart Contract</p>
            </div>

            <div className="bg-emerald-100 p-4 rounded-lg text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
                LP
              </div>
              <p className="text-sm text-emerald-700">Liquidity Provider</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <h5 className="font-medium text-slate-800 mb-2">1. No Intermediary</h5>
              <p className="text-sm text-slate-600">Direct peer-to-peer trading through smart contracts</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <h5 className="font-medium text-slate-800 mb-2">2. Automated Market Making</h5>
              <p className="text-sm text-slate-600">Prices determined by liquidity pools and algorithms</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <h5 className="font-medium text-slate-800 mb-2">3. Low Fees</h5>
              <p className="text-sm text-slate-600">Typically {(tradeFee * 100).toFixed(2)}% vs 0.1-0.5% on centralized exchanges</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="w-full max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h4 className="text-xl font-semibold text-slate-800 mb-4">Traditional Finance</h4>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                  <span className="text-slate-700">Requires intermediaries (banks, brokers)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                  <span className="text-slate-700">High fees and monthly charges</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                  <span className="text-slate-700">Can freeze or deny service</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                  <span className="text-slate-700">Limited operating hours</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-rose-50 rounded-lg">
                <h5 className="font-medium text-rose-800">Bank Savings Example</h5>
                <p className="text-rose-700">Net Return: ${bankResult.netReturn.toFixed(2)}</p>
                <p className="text-rose-700">After Fees: ${bankResult.total.toFixed(2)}</p>
                <p className="text-sm text-rose-600">
                  {bankAPY * 100}% APY - ${bankFees}/mo fees
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h4 className="text-xl font-semibold text-slate-800 mb-4">DeFi</h4>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-700">Peer-to-peer via smart contracts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-700">Lower fees, no monthly charges</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-700">Permissionless and censorship-resistant</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-700">24/7 global access</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                <h5 className="font-medium text-emerald-800">DeFi Protocol Example</h5>
                <p className="text-emerald-700">Interest Earned: ${lendingResult.interest.toFixed(2)}</p>
                <p className="text-emerald-700">Total Value: ${lendingResult.total.toFixed(2)}</p>
                <p className="text-sm text-emerald-600">
                  {lendingAPY * 100}% APY - No monthly fees
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-4 bg-amber-50 p-4 rounded-lg border border-amber-200">
              <span className="text-amber-800 font-medium">
                DeFi Advantage: ${(lendingResult.interest - bankResult.netReturn).toFixed(2)} more earned
              </span>
              <span className="text-amber-600">
                ({(((lendingResult.interest - bankResult.netReturn) / depositAmount) * 100).toFixed(2)}% better return)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
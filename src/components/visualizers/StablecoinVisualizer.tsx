"use client";

import { useState } from 'react';

export function StablecoinVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [cryptoPrice, setCryptoPrice] = useState(30000);
  const [reserveRatio, setReserveRatio] = useState(100);
  const [selectedCoin, setSelectedCoin] = useState<'bitcoin' | 'ethereum' | 'dogecoin'>('bitcoin');

  const steps = [
    { title: 'Traditional Crypto Volatility', description: 'See how regular cryptocurrencies fluctuate wildly' },
    { title: 'Stablecoin Pegging', description: 'Stablecoins maintain $1.00 value through backing mechanisms' },
    { title: 'Reserve Backing', description: 'Adjust reserves to see impact on stability' },
    { title: 'Trust & Risk', description: 'What happens when backing fails?' }
  ];

  const cryptoData = {
    bitcoin: { name: 'Bitcoin', color: 'bg-amber-500', volatility: 0.15 },
    ethereum: { name: 'Ethereum', color: 'bg-indigo-500', volatility: 0.12 },
    dogecoin: { name: 'Dogecoin', color: 'bg-rose-500', volatility: 0.25 }
  };

  const getVolatilePrice = (basePrice: number, volatility: number) => {
    const variation = Math.sin(Date.now() / 1000) * volatility;
    return basePrice * (1 + variation);
  };

  const stablecoinValue = reserveRatio >= 100 ? 1.00 : reserveRatio / 100;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-900 mb-2">Stablecoin Mechanics</h3>
        <p className="text-lg text-slate-600">Interactive exploration of how stablecoins maintain price stability</p>
      </div>

      {/* Step Navigation */}
      <div className="flex gap-2">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentStep === index
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {index + 1}. {step.title}
          </button>
        ))}
      </div>

      <div className="text-center mb-4">
        <h4 className="text-xl font-semibold text-slate-800">{steps[currentStep].title}</h4>
        <p className="text-slate-600">{steps[currentStep].description}</p>
      </div>

      {/* Step 0: Traditional Crypto Volatility */}
      {currentStep === 0 && (
        <div className="w-full max-w-4xl">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Cryptocurrency:</label>
            <div className="flex gap-2">
              {Object.entries(cryptoData).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCoin(key as 'bitcoin' | 'ethereum' | 'dogecoin')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    selectedCoin === key
                      ? `${data.color} text-white`
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {data.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <h5 className="text-lg font-semibold text-slate-800 mb-4">{cryptoData[selectedCoin].name} Price</h5>
              <div className="bg-white p-6 rounded-xl border-2 border-slate-200">
                <div className={`w-24 h-24 ${cryptoData[selectedCoin].color} rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl animate-pulse`}>
                  ${Math.floor(getVolatilePrice(cryptoPrice, cryptoData[selectedCoin].volatility)).toLocaleString()}
                </div>
                <p className="text-sm text-slate-600">Highly volatile - unsuitable for payments</p>
              </div>
            </div>

            <div className="text-center">
              <h5 className="text-lg font-semibold text-slate-800 mb-4">USDC Stablecoin</h5>
              <div className="bg-white p-6 rounded-xl border-2 border-emerald-200">
                <div className="w-24 h-24 bg-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                  $1.00
                </div>
                <p className="text-sm text-slate-600">Stable value - perfect for payments</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Stablecoin Pegging */}
      {currentStep === 1 && (
        <div className="w-full max-w-4xl">
          <div className="bg-white p-6 rounded-xl border-2 border-slate-200">
            <h5 className="text-lg font-semibold text-center text-slate-800 mb-6">1:1 USD Backing Mechanism</h5>
            
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-2">
                  1 USDC
                </div>
                <p className="text-sm text-slate-600">Stablecoin Token</p>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center">
                  <div className="h-1 w-24 bg-blue-500"></div>
                  <div className="w-0 h-0 border-l-8 border-l-blue-500 border-y-4 border-y-transparent"></div>
                </div>
                <span className="mx-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Pegged 1:1
                </span>
                <div className="flex items-center">
                  <div className="w-0 h-0 border-r-8 border-r-blue-500 border-y-4 border-y-transparent"></div>
                  <div className="h-1 w-24 bg-blue-500"></div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-2">
                  $1 USD
                </div>
                <p className="text-sm text-slate-600">Bank Reserve</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-center">
                <strong>Key Principle:</strong> For every stablecoin issued, $1 USD is held in reserve by the issuer
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Reserve Backing */}
      {currentStep === 2 && (
        <div className="w-full max-w-4xl">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Reserve Ratio: {reserveRatio}%
            </label>
            <input
              type="range"
              min="0"
              max="150"
              value={reserveRatio}
              onChange={(e) => setReserveRatio(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <h6 className="font-semibold text-slate-800 mb-3">Circulating Supply</h6>
              <div className="bg-white p-4 rounded-xl border-2 border-slate-200">
                <div className="text-3xl font-bold text-emerald-600">1M</div>
                <p className="text-sm text-slate-600">USDC Tokens</p>
              </div>
            </div>

            <div className="text-center">
              <h6 className="font-semibold text-slate-800 mb-3">USD Reserves</h6>
              <div className="bg-white p-4 rounded-xl border-2 border-slate-200">
                <div className={`text-3xl font-bold ${reserveRatio >= 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  ${(reserveRatio * 10000).toLocaleString()}
                </div>
                <p className="text-sm text-slate-600">In Bank Accounts</p>
              </div>
            </div>

            <div className="text-center">
              <h6 className="font-semibold text-slate-800 mb-3">Token Value</h6>
              <div className="bg-white p-4 rounded-xl border-2 border-slate-200">
                <div className={`text-3xl font-bold ${reserveRatio >= 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  ${stablecoinValue.toFixed(2)}
                </div>
                <p className="text-sm text-slate-600">Per USDC</p>
              </div>
            </div>
          </div>

          <div className={`mt-6 p-4 rounded-lg ${
            reserveRatio >= 100 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
          }`}>
            <p className="text-center font-medium">
              {reserveRatio >= 100 
                ? '✅ Fully backed - stable $1.00 peg maintained'
                : '⚠️ Under-collateralized - peg breaking down!'
              }
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Trust & Risk */}
      {currentStep === 3 && (
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border-2 border-emerald-200">
              <h5 className="text-lg font-semibold text-emerald-800 mb-4">✅ Trusted Issuer (USDC)</h5>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Transparency</span>
                  <span className="font-semibold text-emerald-600">High</span>
                </div>
                <div className="flex justify-between">
                  <span>Regular Audits</span>
                  <span className="font-semibold text-emerald-600">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span>Reserve Ratio</span>
                  <span className="font-semibold text-emerald-600">100%+</span>
                </div>
                <div className="flex justify-between">
                  <span>Token Value</span>
                  <span className="font-semibold text-emerald-600">$1.00</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                <p className="text-sm text-emerald-700">Users can redeem tokens for USD safely</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-rose-200">
              <h5 className="text-lg font-semibold text-rose-800 mb-4">❌ Failed Issuer (Terra/UST)</h5>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Transparency</span>
                  <span className="font-semibold text-rose-600">Low</span>
                </div>
                <div className="flex justify-between">
                  <span>Regular Audits</span>
                  <span className="font-semibold text-rose-600">No</span>
                </div>
                <div className="flex justify-between">
                  <span>Reserve Ratio</span>
                  <span className="font-semibold text-rose-600">0%</span>
                </div>
                <div className="flex justify-between">
                  <span>Token Value</span>
                  <span className="font-semibold text-rose-600">$0.00</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-rose-50 rounded-lg">
                <p className="text-sm text-rose-700">Users lost billions when reserves were mismanaged</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-amber-50 rounded-xl border-2 border-amber-200">
            <h6 className="font-semibold text-amber-800 mb-2">🔍 Key Lesson: Trust is Critical</h6>
            <p className="text-amber-700">
              Stablecoins require trust in the issuer to maintain proper reserves. 
              Always verify audits and transparency reports before using any stablecoin.
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-6 py-3 rounded-lg font-medium bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="px-6 py-3 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
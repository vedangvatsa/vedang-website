"use client";

import React, { useState } from 'react';

export function SelfSovereignIdentityVisualizer() {
  const [mode, setMode] = useState<'traditional' | 'ssi'>('traditional');
  const [selectedIdentity, setSelectedIdentity] = useState<string | null>(null);
  const [animationStep, setAnimationStep] = useState(0);

  const platforms = [
    { id: 'google', name: 'Google', color: 'bg-blue-500', data: ['Email', 'Search History', 'Location'] },
    { id: 'facebook', name: 'Meta', color: 'bg-indigo-500', data: ['Social Graph', 'Interests', 'Messages'] },
    { id: 'bank', name: 'Bank', color: 'bg-emerald-500', data: ['Credit Score', 'Transactions', 'Income'] },
    { id: 'gov', name: 'Government', color: 'bg-rose-500', data: ['ID Number', 'Address', 'Documents'] }
  ];

  const ssiCredentials = [
    { id: 'verified-email', name: 'Verified Email', issuer: 'Email Provider', color: 'bg-blue-400' },
    { id: 'education', name: 'Degree Certificate', issuer: 'University', color: 'bg-indigo-400' },
    { id: 'credit-score', name: 'Credit Score', issuer: 'Credit Agency', color: 'bg-emerald-400' },
    { id: 'id-document', name: 'ID Document', issuer: 'Government', color: 'bg-rose-400' }
  ];

  const startAnimation = () => {
    setAnimationStep(1);
    setTimeout(() => setAnimationStep(2), 1000);
    setTimeout(() => setAnimationStep(3), 2000);
    setTimeout(() => setAnimationStep(0), 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Self-Sovereign Identity (SSI)</h3>
        <p className="text-slate-600 max-w-2xl">
          Compare traditional fragmented identity vs. user-controlled SSI. Click platforms to see data silos, then explore how SSI puts you in control.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setMode('traditional')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            mode === 'traditional' 
              ? 'bg-rose-500 text-white shadow-md' 
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          }`}
        >
          Traditional Identity
        </button>
        <button
          onClick={() => setMode('ssi')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            mode === 'ssi' 
              ? 'bg-emerald-500 text-white shadow-md' 
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          }`}
        >
          Self-Sovereign Identity
        </button>
      </div>

      {mode === 'traditional' ? (
        <div className="w-full max-w-4xl">
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold text-slate-700 mb-2">Your Identity is Fragmented</h4>
            <p className="text-sm text-slate-500">Click on each platform to see what data they control</p>
          </div>
          
          <div className="relative">
            {/* User in center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-16 h-16 bg-slate-400 rounded-full flex items-center justify-center text-white font-bold">
                You
              </div>
            </div>

            {/* Platform silos */}
            <div className="grid grid-cols-2 gap-8 p-16">
              {platforms.map((platform, index) => {
                const positions = ['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'];
                return (
                  <div
                    key={platform.id}
                    className={`relative cursor-pointer transform transition-all hover:scale-105 ${
                      selectedIdentity === platform.id ? 'scale-110' : ''
                    }`}
                    onClick={() => setSelectedIdentity(selectedIdentity === platform.id ? null : platform.id)}
                  >
                    <div className={`${platform.color} p-4 rounded-xl text-white shadow-lg`}>
                      <div className="font-semibold mb-2">{platform.name}</div>
                      <div className="text-sm opacity-90">Controls Your Data</div>
                      {selectedIdentity === platform.id && (
                        <div className="mt-3 space-y-1">
                          {platform.data.map((item, idx) => (
                            <div key={idx} className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                              {item}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Connection line */}
                    <div className={`absolute w-8 h-0.5 bg-slate-300 ${
                      index === 0 ? 'bottom-0 right-0 transform rotate-45 origin-right' :
                      index === 1 ? 'bottom-0 left-0 transform -rotate-45 origin-left' :
                      index === 2 ? 'top-0 right-0 transform -rotate-45 origin-right' :
                      'top-0 left-0 transform rotate-45 origin-left'
                    }`}></div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-4 bg-rose-100 rounded-lg border border-rose-200">
            <div className="text-rose-800 font-medium mb-2">Problems with Traditional Identity:</div>
            <ul className="text-sm text-rose-700 space-y-1">
              <li>• Platforms can delete your account without warning</li>
              <li>• Your data is sold to advertisers</li>
              <li>• No portability between services</li>
              <li>• Single points of failure and data breaches</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold text-slate-700 mb-2">You Own and Control Your Identity</h4>
            <p className="text-sm text-slate-500">Click credentials to see verification flow</p>
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={startAnimation}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Show Verification Flow
            </button>
          </div>

          <div className="relative flex items-center justify-between">
            {/* User's Digital Wallet */}
            <div className="relative">
              <div className="w-48 bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-2xl text-white shadow-xl">
                <div className="font-bold text-lg mb-4 text-center">Your Digital Wallet</div>
                <div className="space-y-3">
                  {ssiCredentials.map((cred) => (
                    <div
                      key={cred.id}
                      className={`${cred.color} p-3 rounded-lg cursor-pointer transform transition-all hover:scale-105 ${
                        selectedIdentity === cred.id ? 'ring-2 ring-white scale-105' : ''
                      } ${
                        animationStep === 2 && cred.id === 'education' ? 'animate-pulse ring-2 ring-amber-400' : ''
                      }`}
                      onClick={() => setSelectedIdentity(selectedIdentity === cred.id ? null : cred.id)}
                    >
                      <div className="font-medium text-sm">{cred.name}</div>
                      <div className="text-xs opacity-90">by {cred.issuer}</div>
                      {selectedIdentity === cred.id && (
                        <div className="mt-2 text-xs bg-white bg-opacity-20 p-2 rounded">
                          ✓ Cryptographically signed<br/>
                          ✓ Tamper-proof<br/>
                          ✓ You control sharing
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {animationStep >= 1 && (
                <div className="absolute -right-16 top-1/2 transform -translate-y-1/2">
                  <div className="w-12 h-0.5 bg-emerald-500 animate-pulse"></div>
                  <div className="absolute right-0 top-0 w-0 h-0 border-l-4 border-l-emerald-500 border-y-2 border-y-transparent transform -translate-y-1/2"></div>
                </div>
              )}
            </div>

            {/* Blockchain Network */}
            <div className="relative">
              <div className={`w-32 h-32 rounded-full border-4 border-emerald-500 flex items-center justify-center transition-all ${
                animationStep >= 1 ? 'bg-emerald-100 animate-pulse' : 'bg-slate-100'
              }`}>
                <div className="text-center">
                  <div className="text-sm font-semibold text-emerald-700">Blockchain</div>
                  <div className="text-xs text-emerald-600">Network</div>
                </div>
              </div>

              {animationStep >= 2 && (
                <div className="absolute -right-16 top-1/2 transform -translate-y-1/2">
                  <div className="w-12 h-0.5 bg-blue-500 animate-pulse"></div>
                  <div className="absolute right-0 top-0 w-0 h-0 border-l-4 border-l-blue-500 border-y-2 border-y-transparent transform -translate-y-1/2"></div>
                </div>
              )}
            </div>

            {/* Service Provider */}
            <div className="relative">
              <div className={`w-48 bg-slate-100 border-2 border-slate-300 p-6 rounded-2xl transition-all ${
                animationStep >= 2 ? 'border-blue-500 bg-blue-50' : ''
              }`}>
                <div className="font-bold text-lg mb-4 text-center text-slate-700">Job Portal</div>
                <div className="text-center mb-4">
                  <div className="text-sm text-slate-600">Requests:</div>
                  <div className="font-medium text-blue-600">Education Credential</div>
                </div>
                {animationStep >= 3 && (
                  <div className="text-center p-3 bg-emerald-100 rounded-lg border border-emerald-300">
                    <div className="text-emerald-700 font-medium">✓ Verified!</div>
                    <div className="text-xs text-emerald-600">No personal data stored</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-emerald-100 rounded-lg border border-emerald-200">
            <div className="text-emerald-800 font-medium mb-2">Benefits of Self-Sovereign Identity:</div>
            <ul className="text-sm text-emerald-700 space-y-1">
              <li>• You own and control your identity data</li>
              <li>• Share only what's needed (selective disclosure)</li>
              <li>• Portable across all services</li>
              <li>• Cryptographic proof without revealing personal details</li>
              <li>• No single point of failure or control</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
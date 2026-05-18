"use client";

import React, { useState, useEffect } from 'react';

export function ColdStorageVisualizer() {
  const [mode, setMode] = useState<'hot' | 'cold'>('hot');
  const [showAttack, setShowAttack] = useState(false);
  const [attackProgress, setAttackProgress] = useState(0);
  const [shieldPulse, setShieldPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setShieldPulse(p => (p + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showAttack && mode === 'hot') {
      const interval = setInterval(() => {
        setAttackProgress(p => Math.min(p + 2, 100));
      }, 50);
      return () => clearInterval(interval);
    }
    if (showAttack && mode === 'cold') {
      setAttackProgress(0);
    }
  }, [showAttack, mode]);

  const hotThreats = [
    { name: 'Malware', angle: 30, color: '#ef4444' },
    { name: 'Phishing', angle: 90, color: '#f97316' },
    { name: 'Keylogger', angle: 150, color: '#eab308' },
    { name: 'Remote Hack', angle: 210, color: '#ef4444' },
    { name: 'Man-in-Middle', angle: 270, color: '#f97316' },
    { name: 'DNS Spoof', angle: 330, color: '#eab308' },
  ];

  const coldFeatures = [
    { label: 'Air-gapped', icon: '🔌', desc: 'No internet connection' },
    { label: 'Hardware Key', icon: '🔑', desc: 'Physical device required' },
    { label: 'PIN Protected', icon: '🔢', desc: 'Multi-factor auth' },
    { label: 'Backup Seed', icon: '📝', desc: 'Recovery phrase stored offline' },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Cold Storage vs Hot Wallet</h3>
        <p className="text-slate-600 max-w-2xl">See how offline storage protects crypto assets from online threats</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => { setMode('hot'); setShowAttack(false); setAttackProgress(0); }}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all ${mode === 'hot' ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
        >
          🌐 Hot Wallet
        </button>
        <button
          onClick={() => { setMode('cold'); setShowAttack(false); setAttackProgress(0); }}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all ${mode === 'cold' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
        >
          🧊 Cold Storage
        </button>
      </div>

      <div className="w-full max-w-2xl">
        <svg viewBox="0 0 600 400" className="w-full border border-slate-200 rounded-xl bg-white">
          {/* Central wallet */}
          <g transform="translate(300, 200)">
            {/* Shield / vault */}
            <circle
              r={mode === 'cold' ? 70 : 60}
              fill={mode === 'cold' ? '#1e40af' : '#f59e0b'}
              opacity={0.15}
              className="transition-all duration-500"
            />
            {mode === 'cold' && (
              <circle
                r={85}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeDasharray="8 4"
                opacity={0.6 + 0.3 * Math.sin(shieldPulse * Math.PI / 180)}
                className="transition-all duration-300"
              />
            )}
            <circle
              r={50}
              fill={mode === 'cold' ? '#1e3a8a' : '#fbbf24'}
              className="transition-all duration-500"
            />
            <text y={-8} textAnchor="middle" className="text-2xl" fill="white">
              {mode === 'cold' ? '🔒' : '💰'}
            </text>
            <text y={18} textAnchor="middle" fontSize="11" fill="white" fontWeight="600">
              {mode === 'cold' ? 'VAULT' : 'WALLET'}
            </text>

            {/* Internet connection lines for hot wallet */}
            {mode === 'hot' && (
              <>
                {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  const x1 = Math.cos(rad) * 55;
                  const y1 = Math.sin(rad) * 55;
                  const x2 = Math.cos(rad) * 140;
                  const y2 = Math.sin(rad) * 140;
                  return (
                    <line
                      key={i}
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke="#fcd34d"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      opacity={0.5}
                    />
                  );
                })}
                <text y={-70} textAnchor="middle" fontSize="10" fill="#92400e">
                  Connected to Internet
                </text>
              </>
            )}

            {/* Cold storage - no connections, air gap visualization */}
            {mode === 'cold' && (
              <>
                <text y={-95} textAnchor="middle" fontSize="10" fill="#1e40af" fontWeight="600">
                  AIR-GAPPED - No Internet
                </text>
                {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  const x = Math.cos(rad) * 100;
                  const y = Math.sin(rad) * 100;
                  return (
                    <g key={i}>
                      <line
                        x1={Math.cos(rad) * 90} y1={Math.sin(rad) * 90}
                        x2={x} y2={y}
                        stroke="#ef4444" strokeWidth="3"
                      />
                      <line
                        x1={Math.cos(rad) * 90 - 5} y1={Math.sin(rad) * 90 + 5}
                        x2={Math.cos(rad) * 100 + 5} y2={Math.sin(rad) * 100 - 5}
                        stroke="#ef4444" strokeWidth="2"
                      />
                    </g>
                  );
                })}
              </>
            )}

            {/* Threats for hot wallet */}
            {mode === 'hot' && hotThreats.map((threat, i) => {
              const rad = (threat.angle * Math.PI) / 180;
              const x = Math.cos(rad) * 150;
              const y = Math.sin(rad) * 150;
              const attackX = showAttack ? Math.cos(rad) * (150 - attackProgress * 1.0) : x;
              const attackY = showAttack ? Math.sin(rad) * (150 - attackProgress * 1.0) : y;
              return (
                <g key={i}>
                  <circle
                    cx={attackX} cy={attackY} r={18}
                    fill={threat.color}
                    opacity={showAttack ? 0.9 : 0.7}
                    className="transition-all duration-100"
                  />
                  <text x={attackX} y={attackY - 2} textAnchor="middle" fontSize="10" fill="white">⚡</text>
                  <text x={attackX} y={attackY + 10} textAnchor="middle" fontSize="7" fill="white" fontWeight="600">
                    {threat.name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Legend */}
          {mode === 'hot' && (
            <g transform="translate(20, 360)">
              <text fontSize="11" fill="#92400e" fontWeight="600">
                ⚠ Always online = Always vulnerable
              </text>
            </g>
          )}
          {mode === 'cold' && (
            <g transform="translate(20, 360)">
              <text fontSize="11" fill="#1e40af" fontWeight="600">
                ✅ Offline = Immune to remote attacks
              </text>
            </g>
          )}
        </svg>
      </div>

      {mode === 'hot' && (
        <button
          onClick={() => { setShowAttack(true); setAttackProgress(0); }}
          className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-all"
        >
          ⚡ Simulate Attack
        </button>
      )}

      {mode === 'cold' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
          {coldFeatures.map((f, i) => (
            <div key={i} className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="font-semibold text-blue-900 text-sm">{f.label}</div>
              <div className="text-blue-700 text-xs mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      )}

      <p className="text-slate-500 text-sm text-center max-w-xl">
        {mode === 'hot'
          ? 'Hot wallets stay connected to the internet for quick transactions, but this constant connection exposes them to remote attacks.'
          : 'Cold storage keeps private keys completely offline. Hardware wallets like Ledger or Trezor only connect briefly to sign transactions, then go back offline.'}
      </p>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';

export function SslTlsVisualizer() {
  const [step, setStep] = useState(-1);
  const [isHandshaking, setIsHandshaking] = useState(false);
  const [encrypted, setEncrypted] = useState(false);
  const [message, setMessage] = useState('My secret password');

  const handshakeSteps = [
    { label: 'Client Hello', desc: 'Browser says hello and lists supported encryption methods', from: 'client', color: '#3b82f6' },
    { label: 'Server Hello', desc: 'Server picks encryption method and sends its certificate', from: 'server', color: '#22c55e' },
    { label: 'Certificate Check', desc: 'Browser verifies the certificate is valid and trusted', from: 'client', color: '#f59e0b' },
    { label: 'Key Exchange', desc: 'Both sides agree on a shared secret key using math', from: 'both', color: '#8b5cf6' },
    { label: 'Secure Channel', desc: 'All data is now encrypted with the shared key', from: 'both', color: '#22c55e' },
  ];

  const startHandshake = () => {
    setIsHandshaking(true);
    setEncrypted(false);
    setStep(0);
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= handshakeSteps.length) {
        clearInterval(interval);
        setIsHandshaking(false);
        setEncrypted(true);
      }
      setStep(current);
    }, 1200);
  };

  const scramble = (text: string) => {
    return text.split('').map(c => {
      const code = c.charCodeAt(0);
      return String.fromCharCode(((code * 7 + 13) % 94) + 33);
    }).join('');
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">TLS Handshake and Encryption</h3>
        <p className="text-slate-600 max-w-2xl">Watch how browsers establish a secure connection before sending data</p>
      </div>

      <div className="w-full max-w-2xl">
        <svg viewBox="0 0 600 350" className="w-full border border-slate-200 rounded-xl bg-white">
          {/* Client */}
          <g transform="translate(100, 60)">
            <rect x={-60} y={-35} width={120} height={70} rx={12} fill="#eff6ff" stroke="#93c5fd" strokeWidth="2" />
            <text y={-8} textAnchor="middle" fontSize="22">💻</text>
            <text y={15} textAnchor="middle" fontSize="10" fill="#1e40af" fontWeight="bold">Browser</text>
          </g>

          {/* Server */}
          <g transform="translate(500, 60)">
            <rect x={-60} y={-35} width={120} height={70} rx={12} fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
            <text y={-8} textAnchor="middle" fontSize="22">🖥️</text>
            <text y={15} textAnchor="middle" fontSize="10" fill="#166534" fontWeight="bold">Server</text>
          </g>

          {/* Lock indicator */}
          <g transform="translate(300, 55)">
            <circle r={20} fill={encrypted ? '#22c55e' : '#ef4444'} opacity={0.15} />
            <text y={6} textAnchor="middle" fontSize="20">{encrypted ? '🔒' : '🔓'}</text>
          </g>

          {/* Handshake steps */}
          {handshakeSteps.map((hs, i) => {
            const y = 130 + i * 45;
            const isActive = step >= i;
            const isCurrent = step === i;
            const isClient = hs.from === 'client';
            const isBoth = hs.from === 'both';

            return (
              <g key={i}>
                {/* Arrow */}
                {!isBoth ? (
                  <>
                    <line
                      x1={isClient ? 160 : 440}
                      y1={y}
                      x2={isClient ? 440 : 160}
                      y2={y}
                      stroke={isActive ? hs.color : '#e2e8f0'}
                      strokeWidth={isCurrent ? 2.5 : 1.5}
                      strokeDasharray={isActive ? 'none' : '6 3'}
                      className="transition-all duration-500"
                    />
                    <polygon
                      points={isClient
                        ? `435,${y-5} 445,${y} 435,${y+5}`
                        : `165,${y-5} 155,${y} 165,${y+5}`
                      }
                      fill={isActive ? hs.color : '#e2e8f0'}
                    />
                  </>
                ) : (
                  <>
                    <line x1={160} y1={y} x2={440} y2={y} stroke={isActive ? hs.color : '#e2e8f0'} strokeWidth={isCurrent ? 2.5 : 1.5} className="transition-all duration-500" />
                  </>
                )}

                {/* Label */}
                <rect
                  x={225} y={y - 12} width={150} height={24} rx={6}
                  fill={isActive ? hs.color : '#f1f5f9'}
                  opacity={isActive ? 1 : 0.5}
                  className="transition-all duration-300"
                />
                <text x={300} y={y + 4} textAnchor="middle" fontSize="9" fill={isActive ? 'white' : '#94a3b8'} fontWeight="600">
                  {hs.label}
                </text>

                {isCurrent && (
                  <rect x={220} y={y - 14} width={160} height={28} rx={8} fill="none" stroke={hs.color} strokeWidth="2" opacity={0.5}>
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="1s" repeatCount="indefinite" />
                  </rect>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {step >= 0 && step < handshakeSteps.length && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 max-w-lg text-center">
          <p className="text-indigo-800 text-sm font-medium">{handshakeSteps[step].desc}</p>
        </div>
      )}

      <button
        onClick={startHandshake}
        disabled={isHandshaking}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-all"
      >
        {isHandshaking ? '🤝 Handshaking...' : '🔐 Start TLS Handshake'}
      </button>

      {/* Encryption demo */}
      {encrypted && (
        <div className="w-full max-w-lg space-y-3">
          <div className="text-sm font-semibold text-slate-700 text-center">Try sending an encrypted message</div>
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-xs font-semibold text-red-800 mb-1">Without TLS (plain text)</div>
              <div className="font-mono text-xs text-red-700 break-all">{message}</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <div className="text-xs font-semibold text-emerald-800 mb-1">With TLS (encrypted)</div>
              <div className="font-mono text-xs text-emerald-700 break-all">{scramble(message)}</div>
            </div>
          </div>
        </div>
      )}

      <p className="text-slate-500 text-sm text-center max-w-xl">
        TLS (Transport Layer Security) creates an encrypted tunnel between your browser and a server. The handshake establishes trust through certificates and negotiates encryption keys. Once complete, all data travels encrypted, making it unreadable to anyone intercepting the connection.
      </p>
    </div>
  );
}

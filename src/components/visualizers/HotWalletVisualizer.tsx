"use client";

import React, { useState, useEffect } from 'react';

export function HotWalletVisualizer() {
  const [txCount, setTxCount] = useState(0);
  const [packets, setPackets] = useState<{id: number; x: number; y: number; targetX: number; targetY: number; progress: number; type: string}[]>([]);
  const [isTransacting, setIsTransacting] = useState(false);

  const services = [
    { name: 'DEX', x: 480, y: 80, icon: '🔄', color: '#8b5cf6' },
    { name: 'DeFi', x: 520, y: 200, icon: '🏦', color: '#3b82f6' },
    { name: 'NFT', x: 480, y: 320, icon: '🎨', color: '#ec4899' },
    { name: 'dApp', x: 80, y: 80, icon: '📱', color: '#10b981' },
    { name: 'Bridge', x: 40, y: 200, icon: '🌉', color: '#f59e0b' },
    { name: 'Game', x: 80, y: 320, icon: '🎮', color: '#06b6d4' },
  ];

  useEffect(() => {
    if (!isTransacting) return;
    const interval = setInterval(() => {
      const service = services[Math.floor(Math.random() * services.length)];
      const outgoing = Math.random() > 0.5;
      setPackets(prev => [...prev.slice(-12), {
        id: Date.now() + Math.random(),
        x: outgoing ? 300 : service.x,
        y: outgoing ? 200 : service.y,
        targetX: outgoing ? service.x : 300,
        targetY: outgoing ? service.y : 200,
        progress: 0,
        type: outgoing ? 'send' : 'receive'
      }]);
      setTxCount(c => c + 1);
    }, 400);
    return () => clearInterval(interval);
  }, [isTransacting]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPackets(prev => prev.map(p => ({
        ...p,
        progress: Math.min(p.progress + 0.05, 1)
      })).filter(p => p.progress < 1));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Hot Wallet Activity</h3>
        <p className="text-slate-600 max-w-2xl">Watch how a hot wallet constantly communicates with blockchain services</p>
      </div>

      <div className="w-full max-w-2xl">
        <svg viewBox="0 0 600 400" className="w-full border border-slate-200 rounded-xl bg-white">
          {/* Connection lines */}
          {services.map((s, i) => (
            <line
              key={i}
              x1={300} y1={200} x2={s.x} y2={s.y}
              stroke={s.color} strokeWidth="1.5" strokeDasharray="6 3" opacity={0.3}
            />
          ))}

          {/* Animated packets */}
          {packets.map(p => {
            const cx = p.x + (p.targetX - p.x) * p.progress;
            const cy = p.y + (p.targetY - p.y) * p.progress;
            return (
              <circle
                key={p.id}
                cx={cx} cy={cy} r={5}
                fill={p.type === 'send' ? '#ef4444' : '#22c55e'}
                opacity={1 - p.progress * 0.5}
              />
            );
          })}

          {/* Central wallet */}
          <g transform="translate(300, 200)">
            <circle r={55} fill="#fbbf24" opacity={0.2} />
            <circle r={40} fill="#f59e0b" />
            <text y={-5} textAnchor="middle" fontSize="20" fill="white">💰</text>
            <text y={15} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">HOT</text>
            {isTransacting && (
              <circle r={60} fill="none" stroke="#f59e0b" strokeWidth="2" opacity={0.4}>
                <animate attributeName="r" from="45" to="75" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
          </g>

          {/* Service nodes */}
          {services.map((s, i) => (
            <g key={i} transform={`translate(${s.x}, ${s.y})`}>
              <circle r={30} fill={s.color} opacity={0.15} />
              <circle r={22} fill={s.color} />
              <text y={-3} textAnchor="middle" fontSize="14" fill="white">{s.icon}</text>
              <text y={12} textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">{s.name}</text>
            </g>
          ))}

          {/* Online indicator */}
          <g transform="translate(300, 30)">
            <rect x={-60} y={-12} width={120} height={24} rx={12} fill={isTransacting ? '#22c55e' : '#94a3b8'} />
            <circle cx={-40} cy={0} r={5} fill="white">
              {isTransacting && <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />}
            </circle>
            <text x={5} y={4} textAnchor="middle" fontSize="10" fill="white" fontWeight="600">
              {isTransacting ? 'ONLINE' : 'IDLE'}
            </text>
          </g>

          {/* TX counter */}
          {isTransacting && (
            <text x={300} y={385} textAnchor="middle" fontSize="12" fill="#64748b">
              Transactions: {txCount}
            </text>
          )}
        </svg>
      </div>

      <button
        onClick={() => { setIsTransacting(!isTransacting); if (!isTransacting) setTxCount(0); }}
        className={`px-6 py-3 rounded-lg font-medium transition-all ${
          isTransacting
            ? 'bg-slate-600 text-white hover:bg-slate-700'
            : 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-200'
        }`}
      >
        {isTransacting ? '⏸ Stop Activity' : '▶ Start Transacting'}
      </button>

      <div className="grid grid-cols-2 gap-4 max-w-lg text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-slate-600">Outgoing transactions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-slate-600">Incoming transactions</span>
        </div>
      </div>

      <p className="text-slate-500 text-sm text-center max-w-xl">
        Hot wallets maintain persistent internet connections for instant transactions with DEXs, DeFi protocols, and dApps. This convenience comes with higher security risk since private keys remain on an internet-connected device.
      </p>
    </div>
  );
}

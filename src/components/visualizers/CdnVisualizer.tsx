"use client";

import React, { useState, useEffect } from 'react';

export function CdnVisualizer() {
  const [userLocation, setUserLocation] = useState<{name: string; x: number; y: number}>({ name: 'New York', x: 170, y: 140 });
  const [useCdn, setUseCdn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [packetProgress, setPacketProgress] = useState(0);

  const origin = { name: 'Origin (San Francisco)', x: 80, y: 150 };

  const edgeNodes = [
    { name: 'NYC Edge', x: 180, y: 120 },
    { name: 'London Edge', x: 340, y: 90 },
    { name: 'Tokyo Edge', x: 520, y: 130 },
    { name: 'São Paulo Edge', x: 200, y: 260 },
    { name: 'Sydney Edge', x: 530, y: 270 },
    { name: 'Mumbai Edge', x: 430, y: 180 },
  ];

  const userLocations = [
    { name: 'New York', x: 170, y: 140 },
    { name: 'London', x: 330, y: 100 },
    { name: 'Tokyo', x: 510, y: 140 },
    { name: 'São Paulo', x: 190, y: 270 },
    { name: 'Sydney', x: 540, y: 280 },
  ];

  const getNearestEdge = () => {
    let nearest = edgeNodes[0];
    let minDist = Infinity;
    edgeNodes.forEach(e => {
      const dist = Math.sqrt((e.x - userLocation.x) ** 2 + (e.y - userLocation.y) ** 2);
      if (dist < minDist) { minDist = dist; nearest = e; }
    });
    return nearest;
  };

  const loadPage = () => {
    setIsLoading(true);
    setLoadTime(null);
    setPacketProgress(0);

    const dist = useCdn
      ? Math.sqrt((getNearestEdge().x - userLocation.x) ** 2 + (getNearestEdge().y - userLocation.y) ** 2)
      : Math.sqrt((origin.x - userLocation.x) ** 2 + (origin.y - userLocation.y) ** 2);

    const time = Math.round(useCdn ? dist * 2 + 20 : dist * 8 + 200);

    const interval = setInterval(() => {
      setPacketProgress(p => {
        if (p >= 1) { clearInterval(interval); return 1; }
        return p + 0.03;
      });
    }, 30);

    setTimeout(() => {
      setLoadTime(time);
      setIsLoading(false);
    }, Math.min(time * 3, 2500));
  };

  const target = useCdn ? getNearestEdge() : origin;
  const packetX = userLocation.x + (target.x - userLocation.x) * packetProgress;
  const packetY = userLocation.y + (target.y - userLocation.y) * packetProgress;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Content Delivery Network</h3>
        <p className="text-slate-600 max-w-2xl">Compare loading speed with and without edge servers near the user</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => { setUseCdn(false); setLoadTime(null); setPacketProgress(0); }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${!useCdn ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-700'}`}
        >
          ❌ No CDN
        </button>
        <button
          onClick={() => { setUseCdn(true); setLoadTime(null); setPacketProgress(0); }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${useCdn ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}
        >
          ✅ With CDN
        </button>
      </div>

      <div className="w-full max-w-3xl">
        <svg viewBox="0 0 600 340" className="w-full border border-slate-200 rounded-xl bg-gradient-to-b from-blue-50 to-emerald-50">
          {/* World map background (simplified) */}
          <rect x={50} y={60} width={500} height={250} rx={12} fill="white" opacity={0.5} stroke="#cbd5e1" />

          {/* Origin server */}
          <g transform={`translate(${origin.x}, ${origin.y})`}>
            <circle r={18} fill="#1e40af" />
            <text y={4} textAnchor="middle" fontSize="12" fill="white">🖥️</text>
            <text y={35} textAnchor="middle" fontSize="8" fill="#1e40af" fontWeight="600">Origin</text>
          </g>

          {/* Edge nodes */}
          {useCdn && edgeNodes.map((node, i) => (
            <g key={i} transform={`translate(${node.x}, ${node.y})`}>
              <circle r={12} fill="#22c55e" opacity={0.8} />
              <text y={4} textAnchor="middle" fontSize="9" fill="white">⚡</text>
              <text y={25} textAnchor="middle" fontSize="7" fill="#166534">{node.name}</text>
              {/* Line to origin */}
              <line x1={0} y1={0} x2={origin.x - node.x} y2={origin.y - node.y} stroke="#22c55e" strokeWidth="1" strokeDasharray="3 3" opacity={0.3} />
            </g>
          ))}

          {/* Connection line */}
          {packetProgress > 0 && (
            <line
              x1={userLocation.x} y1={userLocation.y}
              x2={target.x} y2={target.y}
              stroke={useCdn ? '#22c55e' : '#ef4444'} strokeWidth="2" strokeDasharray="4 4" opacity={0.5}
            />
          )}

          {/* Animated packet */}
          {isLoading && packetProgress < 1 && (
            <circle cx={packetX} cy={packetY} r={5} fill={useCdn ? '#22c55e' : '#ef4444'}>
              <animate attributeName="r" values="4;7;4" dur="0.5s" repeatCount="indefinite" />
            </circle>
          )}

          {/* User location */}
          <g transform={`translate(${userLocation.x}, ${userLocation.y})`} className="cursor-pointer">
            <circle r={15} fill="#6366f1" opacity={0.2}>
              <animate attributeName="r" from="12" to="22" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r={12} fill="#6366f1" />
            <text y={4} textAnchor="middle" fontSize="10" fill="white">👤</text>
            <text y={-20} textAnchor="middle" fontSize="8" fill="#4338ca" fontWeight="600">{userLocation.name}</text>
          </g>

          {/* Load time result */}
          {loadTime !== null && (
            <g transform="translate(300, 320)">
              <rect x={-80} y={-14} width={160} height={28} rx={8} fill={useCdn ? '#dcfce7' : '#fef2f2'} stroke={useCdn ? '#86efac' : '#fca5a5'} />
              <text textAnchor="middle" y={5} fontSize="11" fill={useCdn ? '#166534' : '#991b1b'} fontWeight="bold">
                ⏱ {loadTime}ms {useCdn ? '(fast!)' : '(slow)'}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* User location selector */}
      <div className="flex gap-2 flex-wrap justify-center">
        <span className="text-sm text-slate-600 self-center mr-2">Your location</span>
        {userLocations.map(loc => (
          <button
            key={loc.name}
            onClick={() => { setUserLocation(loc); setLoadTime(null); setPacketProgress(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              userLocation.name === loc.name ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {loc.name}
          </button>
        ))}
      </div>

      <button
        onClick={loadPage}
        disabled={isLoading}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium transition-all"
      >
        {isLoading ? '⏳ Loading...' : '🌐 Load Page'}
      </button>

      <p className="text-slate-500 text-sm text-center max-w-xl">
        A CDN caches content on edge servers distributed around the world. Instead of every request traveling to a distant origin server, users get content from the nearest edge node. This dramatically reduces latency, especially for users far from the origin.
      </p>
    </div>
  );
}

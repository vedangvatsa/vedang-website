"use client";

import React, { useState, useEffect } from 'react';

export function TcpIpVisualizer() {
  const [sending, setSending] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(-1);
  const [direction, setDirection] = useState<'down' | 'up'>('down');
  const [packets, setPackets] = useState<{id: number; progress: number}[]>([]);

  const layers = [
    { name: 'Application', protocol: 'HTTP / HTTPS', color: '#6366f1', desc: 'Your browser sends "GET /index.html"', icon: '🌐' },
    { name: 'Transport', protocol: 'TCP', color: '#8b5cf6', desc: 'Data split into segments, ports assigned', icon: '📦' },
    { name: 'Internet', protocol: 'IP', color: '#a855f7', desc: 'Source and destination IP addresses added', icon: '🗺️' },
    { name: 'Network Access', protocol: 'Ethernet / WiFi', color: '#c084fc', desc: 'Converted to electrical signals or radio waves', icon: '📡' },
  ];

  const sendData = () => {
    setSending(true);
    setDirection('down');
    setCurrentLayer(0);

    // Animate going down the stack
    let layer = 0;
    const goDown = setInterval(() => {
      layer++;
      if (layer >= layers.length) {
        clearInterval(goDown);
        // Pause at network
        setTimeout(() => {
          // Send packets across
          setPackets([
            { id: 1, progress: 0 },
            { id: 2, progress: 0 },
            { id: 3, progress: 0 },
          ]);
          setTimeout(() => {
            setDirection('up');
            // Animate going up
            let upLayer = layers.length - 1;
            setCurrentLayer(upLayer);
            const goUp = setInterval(() => {
              upLayer--;
              if (upLayer < 0) {
                clearInterval(goUp);
                setSending(false);
                setCurrentLayer(-1);
                setPackets([]);
              } else {
                setCurrentLayer(upLayer);
              }
            }, 600);
          }, 1500);
        }, 500);
      } else {
        setCurrentLayer(layer);
      }
    }, 600);
  };

  useEffect(() => {
    if (packets.length === 0) return;
    const interval = setInterval(() => {
      setPackets(prev => prev.map(p => ({ ...p, progress: Math.min(p.progress + 0.03, 1) })));
    }, 30);
    return () => clearInterval(interval);
  }, [packets.length]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">TCP/IP Layer Model</h3>
        <p className="text-slate-600 max-w-2xl">Watch data travel through the network stack from application to wire and back</p>
      </div>

      <div className="w-full max-w-3xl">
        <svg viewBox="0 0 700 380" className="w-full border border-slate-200 rounded-xl bg-white">
          {/* Sender stack */}
          <text x={150} y={30} textAnchor="middle" fontSize="13" fill="#334155" fontWeight="bold">Sender</text>
          {layers.map((layer, i) => {
            const y = 50 + i * 75;
            const isActive = currentLayer === i;
            const isSending = direction === 'down' && isActive;
            const isReceiving = direction === 'up' && isActive;
            return (
              <g key={`send-${i}`} transform={`translate(50, ${y})`}>
                {isActive && (
                  <rect x={-5} y={-5} width={210} height={60} rx={14} fill={layer.color} opacity={0.1}>
                    <animate attributeName="opacity" values="0.1;0.25;0.1" dur="0.8s" repeatCount="indefinite" />
                  </rect>
                )}
                <rect width={200} height={50} rx={10} fill={isActive ? layer.color : '#f8fafc'} stroke={layer.color} strokeWidth="2" className="transition-all duration-300" />
                <text x={30} y={20} fontSize="11" fill={isActive ? 'white' : '#334155'} fontWeight="bold">{layer.icon} {layer.name}</text>
                <text x={30} y={36} fontSize="9" fill={isActive ? 'rgba(255,255,255,0.8)' : '#64748b'}>{layer.protocol}</text>
                {isSending && <polygon points="210,25 225,20 225,30" fill={layer.color} />}
              </g>
            );
          })}

          {/* Receiver stack */}
          <text x={550} y={30} textAnchor="middle" fontSize="13" fill="#334155" fontWeight="bold">Receiver</text>
          {layers.map((layer, i) => {
            const y = 50 + i * 75;
            const isActive = direction === 'up' && currentLayer === i;
            return (
              <g key={`recv-${i}`} transform={`translate(450, ${y})`}>
                {isActive && (
                  <rect x={-5} y={-5} width={210} height={60} rx={14} fill={layer.color} opacity={0.1}>
                    <animate attributeName="opacity" values="0.1;0.25;0.1" dur="0.8s" repeatCount="indefinite" />
                  </rect>
                )}
                <rect width={200} height={50} rx={10} fill={isActive ? layer.color : '#f8fafc'} stroke={layer.color} strokeWidth="2" className="transition-all duration-300" />
                <text x={30} y={20} fontSize="11" fill={isActive ? 'white' : '#334155'} fontWeight="bold">{layer.icon} {layer.name}</text>
                <text x={30} y={36} fontSize="9" fill={isActive ? 'rgba(255,255,255,0.8)' : '#64748b'}>{layer.protocol}</text>
              </g>
            );
          })}

          {/* Physical link between stacks */}
          <line x1={250} y1={300} x2={450} y2={300} stroke="#c084fc" strokeWidth="3" strokeDasharray="8 4" opacity={0.5} />
          <text x={350} y={340} textAnchor="middle" fontSize="10" fill="#7c3aed">Physical Network</text>

          {/* Animated packets */}
          {packets.map((p) => (
            <g key={p.id}>
              <rect
                x={250 + (450 - 250) * p.progress}
                y={290 + (p.id - 2) * 8}
                width={20}
                height={8}
                rx={3}
                fill="#8b5cf6"
                opacity={1 - p.progress * 0.3}
              />
            </g>
          ))}

          {/* Direction arrows */}
          {sending && direction === 'down' && (
            <g transform="translate(160, 50)">
              <text fontSize="18" fill="#6366f1">↓</text>
            </g>
          )}
          {sending && direction === 'up' && (
            <g transform="translate(560, 50)">
              <text fontSize="18" fill="#6366f1">↑</text>
            </g>
          )}
        </svg>
      </div>

      {currentLayer >= 0 && currentLayer < layers.length && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 max-w-lg text-center">
          <div className="font-semibold text-purple-900 text-sm">{layers[currentLayer].name} Layer</div>
          <p className="text-purple-700 text-sm mt-1">{layers[currentLayer].desc}</p>
        </div>
      )}

      <button
        onClick={sendData}
        disabled={sending}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium transition-all"
      >
        {sending ? '📡 Transmitting...' : '📤 Send Data Across Network'}
      </button>

      <p className="text-slate-500 text-sm text-center max-w-xl">
        TCP/IP organizes network communication into layers. Data travels down the sender's stack (each layer adds headers), crosses the physical network as packets, then travels up the receiver's stack (each layer removes headers) to reconstruct the original message.
      </p>
    </div>
  );
}

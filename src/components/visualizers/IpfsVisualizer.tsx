"use client";

import React, { useState, useEffect } from 'react';

export function IpfsVisualizer() {
  const [mode, setMode] = useState<'http' | 'ipfs'>('http');
  const [requestedFile, setRequestedFile] = useState<string>('');
  const [animatingRequest, setAnimatingRequest] = useState(false);
  const [serverDown, setServerDown] = useState(false);
  const [peers, setPeers] = useState([
    { id: 'A', files: ['QmXYZ123', 'QmABC456'], active: false, x: 20, y: 30 },
    { id: 'B', files: ['QmXYZ123', 'QmDEF789'], active: false, x: 80, y: 20 },
    { id: 'C', files: ['QmABC456', 'QmGHI012'], active: false, x: 60, y: 70 },
    { id: 'D', files: ['QmXYZ123', 'QmGHI012'], active: false, x: 30, y: 80 }
  ]);

  const files = [
    { name: 'document.pdf', hash: 'QmXYZ123', url: 'server1.com/doc.pdf' },
    { name: 'image.jpg', hash: 'QmABC456', url: 'server2.com/img.jpg' },
    { name: 'video.mp4', hash: 'QmDEF789', url: 'server3.com/vid.mp4' },
    { name: 'data.json', hash: 'QmGHI012', url: 'server4.com/data.json' }
  ];

  const handleRequest = async (file: typeof files[0]) => {
    if (animatingRequest) return;
    
    setRequestedFile(file.hash);
    setAnimatingRequest(true);
    
    if (mode === 'http') {
      // Simulate HTTP request animation
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (serverDown) {
        // Request fails
        setAnimatingRequest(false);
        setRequestedFile('');
        return;
      }
    } else {
      // IPFS mode - activate peers that have the file
      const newPeers = peers.map(peer => ({
        ...peer,
        active: peer.files.includes(file.hash)
      }));
      setPeers(newPeers);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset peer states
      setPeers(peers.map(peer => ({ ...peer, active: false })));
    }
    
    setAnimatingRequest(false);
    setRequestedFile('');
  };

  const getPeersWithFile = (hash: string) => {
    return peers.filter(peer => peer.files.includes(hash)).length;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">IPFS vs HTTP File Sharing</h3>
        <p className="text-slate-600">Compare location-based HTTP with content-addressed IPFS protocols</p>
      </div>

      {/* Protocol Mode Toggle */}
      <div className="flex bg-slate-200 rounded-lg p-1">
        <button
          onClick={() => {setMode('http'); setServerDown(false);}}
          className={`px-6 py-2 rounded-md font-medium transition-all ${
            mode === 'http' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          HTTP (Location-based)
        </button>
        <button
          onClick={() => setMode('ipfs')}
          className={`px-6 py-2 rounded-md font-medium transition-all ${
            mode === 'ipfs' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          IPFS (Content-based)
        </button>
      </div>

      {/* Network Visualization */}
      <div className="w-full max-w-4xl bg-white rounded-xl border border-slate-200 p-6">
        {mode === 'http' ? (
          <div className="flex flex-col items-center gap-8">
            <div className="flex justify-between items-center w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                  You
                </div>
                <span className="text-sm text-slate-600">Client</span>
              </div>
              
              {animatingRequest && (
                <div className="flex-1 mx-4 relative">
                  <div className="h-1 bg-slate-200 rounded-full">
                    <div className="h-1 bg-blue-500 rounded-full animate-pulse" style={{width: serverDown ? '50%' : '100%'}}></div>
                  </div>
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-blue-600 font-medium">
                    Requesting {files.find(f => f.hash === requestedFile)?.url}
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 transition-all ${
                  serverDown ? 'bg-rose-500' : 'bg-blue-500'
                }`}>
                  S
                </div>
                <span className="text-sm text-slate-600">
                  {serverDown ? 'Server Down!' : 'Central Server'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setServerDown(!serverDown)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  serverDown 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                    : 'bg-rose-500 text-white hover:bg-rose-600'
                }`}
              >
                {serverDown ? 'Restore Server' : 'Simulate Server Failure'}
              </button>
              {serverDown && (
                <span className="text-rose-600 font-medium">Files are inaccessible!</span>
              )}
            </div>
          </div>
        ) : (
          <div className="relative h-80">
            {/* IPFS Network */}
            <div className="absolute inset-0">
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full">
                {peers.map((peer1, i) => 
                  peers.slice(i + 1).map((peer2, j) => {
                    const x1 = (peer1.x / 100) * 100 + 32;
                    const y1 = (peer1.y / 100) * 100 + 32;
                    const x2 = (peer2.x / 100) * 100 + 32;
                    const y2 = (peer2.y / 100) * 100 + 32;
                    
                    return (
                      <line
                        key={`${i}-${j}`}
                        x1={`${x1}%`}
                        y1={`${y1}%`}
                        x2={`${x2}%`}
                        y2={`${y2}%`}
                        stroke={peer1.active && peer2.active ? '#6366f1' : '#e2e8f0'}
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />
                    );
                  })
                )}
              </svg>

              {/* Peers */}
              {peers.map((peer) => (
                <div
                  key={peer.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
                  style={{ left: `${peer.x}%`, top: `${peer.y}%` }}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 transition-all duration-300 ${
                    peer.active ? 'bg-indigo-500 ring-4 ring-indigo-200 scale-110' : 'bg-slate-400'
                  }`}>
                    {peer.id}
                  </div>
                  <span className="text-xs text-slate-600">
                    Peer {peer.id}
                  </span>
                </div>
              ))}

              {/* You node */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                  You
                </div>
                <span className="text-sm text-slate-600">Your Node</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* File List */}
      <div className="w-full max-w-4xl">
        <h4 className="text-lg font-bold text-slate-800 mb-4">
          {mode === 'http' ? 'Request by URL' : 'Request by Content Hash'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {files.map((file) => (
            <div
              key={file.hash}
              className="bg-white rounded-lg border border-slate-200 p-4 hover:border-blue-300 transition-colors cursor-pointer"
              onClick={() => handleRequest(file)}
            >
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-semibold text-slate-800">{file.name}</h5>
                <button
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    animatingRequest && requestedFile === file.hash
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                  disabled={animatingRequest}
                >
                  {animatingRequest && requestedFile === file.hash ? 'Requesting...' : 'Request'}
                </button>
              </div>
              
              {mode === 'http' ? (
                <div className="text-sm text-slate-600">
                  <span className="font-medium">URL:</span> {file.url}
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">Hash:</span> {file.hash}
                  </div>
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">Available on:</span> {getPeersWithFile(file.hash)} peers
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="w-full max-w-4xl bg-slate-100 rounded-lg p-4">
        <p className="text-sm text-slate-700">
          {mode === 'http' 
            ? "HTTP requests files by location (URL). If the server goes down, files become inaccessible. Try simulating server failure!"
            : "IPFS requests files by content hash. Any peer with the file can serve it, creating redundancy. Notice how multiple peers can provide the same file!"
          }
        </p>
      </div>
    </div>
  );
}
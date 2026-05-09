"use client";

import { useState } from 'react';

export function NftVisualizer() {
  const [selectedAsset, setSelectedAsset] = useState<number | null>(null);
  const [ownershipHistory, setOwnershipHistory] = useState<{[key: number]: Array<{owner: string, timestamp: string, price?: string}>}>({
    0: [{owner: 'Artist', timestamp: '2024-01-01', price: 'Minted'}],
    1: [{owner: 'Creator', timestamp: '2024-01-02', price: 'Minted'}],
    2: [{owner: 'Dev Team', timestamp: '2024-01-03', price: 'Minted'}]
  });
  const [activeTab, setActiveTab] = useState<'uniqueness' | 'ownership' | 'transfer'>('uniqueness');

  const assets = [
    { id: 0, name: 'Digital Art #1', type: 'Art', color: 'bg-rose-100 border-rose-300', uniqueId: '0x1a2b3c...' },
    { id: 1, name: 'Game Sword', type: 'Gaming', color: 'bg-blue-100 border-blue-300', uniqueId: '0x4d5e6f...' },
    { id: 2, name: 'Domain Name', type: 'Domain', color: 'bg-emerald-100 border-emerald-300', uniqueId: '0x7g8h9i...' }
  ];

  const transferAsset = (assetId: number) => {
    const buyers = ['Alice', 'Bob', 'Carol', 'David', 'Eve'];
    const prices = ['0.5 ETH', '1.2 ETH', '0.8 ETH', '2.0 ETH', '1.5 ETH'];
    const currentHistory = ownershipHistory[assetId] || [];
    const newOwner = buyers[Math.floor(Math.random() * buyers.length)];
    const newPrice = prices[Math.floor(Math.random() * prices.length)];
    const newTimestamp = new Date().toISOString().split('T')[0];
    
    setOwnershipHistory(prev => ({
      ...prev,
      [assetId]: [...currentHistory, {
        owner: newOwner,
        timestamp: newTimestamp,
        price: newPrice
      }]
    }));
  };

  const getCurrentOwner = (assetId: number) => {
    const history = ownershipHistory[assetId] || [];
    return history[history.length - 1]?.owner || 'Unknown';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Non-Fungible Token (NFT) Explorer</h3>
        <p className="text-slate-600 text-lg">Discover how NFTs provide unique, provable ownership of digital assets</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('uniqueness')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'uniqueness' 
              ? 'bg-indigo-500 text-white shadow-lg' 
              : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
          }`}
        >
          Uniqueness
        </button>
        <button
          onClick={() => setActiveTab('ownership')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'ownership' 
              ? 'bg-indigo-500 text-white shadow-lg' 
              : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
          }`}
        >
          Ownership
        </button>
        <button
          onClick={() => setActiveTab('transfer')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'transfer' 
              ? 'bg-indigo-500 text-white shadow-lg' 
              : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
          }`}
        >
          Transfer History
        </button>
      </div>

      {activeTab === 'uniqueness' && (
        <div className="w-full max-w-4xl">
          <h4 className="text-xl font-semibold text-slate-800 mb-4 text-center">Each NFT is Unique & Identifiable</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => setSelectedAsset(selectedAsset === asset.id ? null : asset.id)}
                className={`${asset.color} border-2 rounded-xl p-6 cursor-pointer transition-all hover:scale-105 ${
                  selectedAsset === asset.id ? 'ring-4 ring-indigo-300 scale-105' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {asset.type === 'Art' ? '🎨' : asset.type === 'Gaming' ? '⚔️' : '🌐'}
                  </div>
                  <h5 className="font-bold text-slate-800">{asset.name}</h5>
                  <p className="text-sm text-slate-600 mt-1">{asset.type}</p>
                  <div className="mt-3 p-2 bg-white rounded-lg">
                    <p className="text-xs font-mono text-slate-700">ID: {asset.uniqueId}</p>
                  </div>
                  {selectedAsset === asset.id && (
                    <div className="mt-4 p-3 bg-white rounded-lg">
                      <p className="text-sm font-medium text-slate-800">✓ Cryptographically Unique</p>
                      <p className="text-sm font-medium text-slate-800">✓ Cannot be Replicated</p>
                      <p className="text-sm font-medium text-slate-800">✓ Verifiable on Blockchain</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-600 mt-4">Click on any NFT to see its unique properties</p>
        </div>
      )}

      {activeTab === 'ownership' && (
        <div className="w-full max-w-4xl">
          <h4 className="text-xl font-semibold text-slate-800 mb-4 text-center">Provable Ownership</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {assets.map((asset) => {
              const currentOwner = getCurrentOwner(asset.id);
              return (
                <div key={asset.id} className={`${asset.color} border-2 rounded-xl p-6`}>
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {asset.type === 'Art' ? '🎨' : asset.type === 'Gaming' ? '⚔️' : '🌐'}
                    </div>
                    <h5 className="font-bold text-slate-800">{asset.name}</h5>
                    <div className="mt-4 p-3 bg-white rounded-lg">
                      <p className="text-sm font-medium text-slate-600">Current Owner</p>
                      <p className="text-lg font-bold text-indigo-600">{currentOwner}</p>
                    </div>
                    <div className="mt-2 p-2 bg-white rounded-lg">
                      <p className="text-xs text-slate-600">🔒 Ownership verified on blockchain</p>
                      <p className="text-xs text-slate-600">📋 Publicly auditable</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'transfer' && (
        <div className="w-full max-w-4xl">
          <h4 className="text-xl font-semibold text-slate-800 mb-4 text-center">Transfer History & Provenance</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {assets.map((asset) => {
              const history = ownershipHistory[asset.id] || [];
              return (
                <div key={asset.id} className={`${asset.color} border-2 rounded-xl p-6`}>
                  <div className="text-center mb-4">
                    <div className="text-xl mb-1">
                      {asset.type === 'Art' ? '🎨' : asset.type === 'Gaming' ? '⚔️' : '🌐'}
                    </div>
                    <h5 className="font-medium text-slate-800">{asset.name}</h5>
                  </div>
                  
                  <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                    {history.slice().reverse().map((record, index) => (
                      <div key={index} className="bg-white rounded-lg p-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium text-slate-800">{record.owner}</span>
                          <span className="text-xs text-slate-500">{record.timestamp}</span>
                        </div>
                        <div className="text-xs text-slate-600">
                          {record.price === 'Minted' ? '🎯 Minted' : `💰 ${record.price}`}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => transferAsset(asset.id)}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                  >
                    Simulate Transfer
                  </button>
                </div>
              );
            })}
          </div>
          <p className="text-center text-slate-600 mt-4">Click "Simulate Transfer" to see how ownership changes are recorded</p>
        </div>
      )}
    </div>
  );
}
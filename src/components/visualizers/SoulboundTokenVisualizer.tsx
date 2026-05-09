"use client";

import { useState } from 'react';

export function SoulboundTokenVisualizer() {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [attemptingTransfer, setAttemptingTransfer] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const soulboundTokens = [
    { id: 'diploma', name: 'University Diploma', issuer: 'MIT', color: 'bg-indigo-100 border-indigo-300', icon: '🎓' },
    { id: 'license', name: 'Driver License', issuer: 'DMV', color: 'bg-blue-100 border-blue-300', icon: '🪪' },
    { id: 'cert', name: 'Professional Cert', issuer: 'AWS', color: 'bg-emerald-100 border-emerald-300', icon: '📜' },
    { id: 'badge', name: 'Community Badge', issuer: 'DAO', color: 'bg-amber-100 border-amber-300', icon: '🏆' }
  ];

  const regularNFTs = [
    { id: 'art', name: 'Digital Art', price: '2.5 ETH', color: 'bg-rose-100 border-rose-300', icon: '🎨' },
    { id: 'music', name: 'Music NFT', price: '0.8 ETH', color: 'bg-indigo-100 border-indigo-300', icon: '🎵' },
    { id: 'game', name: 'Game Item', price: '1.2 ETH', color: 'bg-blue-100 border-blue-300', icon: '⚔️' }
  ];

  const handleSoulboundTransfer = () => {
    setAttemptingTransfer(true);
    setTimeout(() => {
      setAttemptingTransfer(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Soulbound Token (SBT) Visualizer</h3>
        <p className="text-slate-600 max-w-3xl">
          Explore the difference between transferable NFTs and non-transferable Soulbound Tokens that represent identity and credentials
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowComparison(false)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            !showComparison
              ? 'bg-indigo-500 text-white shadow-md'
              : 'bg-white text-indigo-500 border border-indigo-300 hover:bg-indigo-50'
          }`}
        >
          SBT Wallet
        </button>
        <button
          onClick={() => setShowComparison(true)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            showComparison
              ? 'bg-indigo-500 text-white shadow-md'
              : 'bg-white text-indigo-500 border border-indigo-300 hover:bg-indigo-50'
          }`}
        >
          Compare with NFTs
        </button>
      </div>

      {!showComparison ? (
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h4 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
              Your Soulbound Tokens
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {soulboundTokens.map((token) => (
                <div
                  key={token.id}
                  onClick={() => setSelectedToken(token.id)}
                  className={`${token.color} p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                    selectedToken === token.id ? 'ring-2 ring-indigo-400 scale-105' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{token.icon}</span>
                    <div>
                      <div className="font-medium text-slate-700">{token.name}</div>
                      <div className="text-sm text-slate-500">Issued by: {token.issuer}</div>
                      <div className="text-xs text-slate-400 mt-1">🔒 Non-transferable</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedToken && (
              <div className="bg-slate-100 rounded-lg p-4 border">
                <h5 className="font-medium text-slate-700 mb-3">Try to Transfer Token</h5>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Recipient wallet address"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                  <button
                    onClick={handleSoulboundTransfer}
                    disabled={attemptingTransfer}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      attemptingTransfer
                        ? 'bg-rose-500 text-white cursor-not-allowed'
                        : 'bg-slate-600 text-white hover:bg-slate-700'
                    }`}
                  >
                    {attemptingTransfer ? 'Transfer Blocked' : 'Transfer'}
                  </button>
                </div>
                {attemptingTransfer && (
                  <div className="mt-3 p-3 bg-rose-100 border border-rose-300 rounded-lg">
                    <div className="text-rose-700 font-medium flex items-center gap-2">
                      <span>❌</span>
                      Transfer Failed: This is a Soulbound Token
                    </div>
                    <div className="text-rose-600 text-sm mt-1">
                      SBTs are permanently bound to your identity and cannot be transferred or sold
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h4 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
              Soulbound Tokens
            </h4>
            <div className="space-y-3 mb-4">
              {soulboundTokens.slice(0, 3).map((token) => (
                <div key={token.id} className={`${token.color} p-3 rounded-lg border`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{token.icon}</span>
                      <div>
                        <div className="font-medium text-slate-700">{token.name}</div>
                        <div className="text-xs text-slate-500">{token.issuer}</div>
                      </div>
                    </div>
                    <span className="text-xs bg-slate-600 text-white px-2 py-1 rounded">🔒 Bound</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-sm text-slate-600 space-y-1">
                <div>✓ Represents identity & credentials</div>
                <div>✓ Cannot be transferred or sold</div>
                <div>✓ Prevents fake credentials</div>
                <div>✓ Builds verifiable reputation</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h4 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-rose-500 rounded-full"></span>
              Regular NFTs
            </h4>
            <div className="space-y-3 mb-4">
              {regularNFTs.map((nft) => (
                <div key={nft.id} className={`${nft.color} p-3 rounded-lg border`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{nft.icon}</span>
                      <div>
                        <div className="font-medium text-slate-700">{nft.name}</div>
                        <div className="text-xs text-slate-500">Price: {nft.price}</div>
                      </div>
                    </div>
                    <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded">🔄 Tradable</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-sm text-slate-600 space-y-1">
                <div>✓ Represents digital assets</div>
                <div>✓ Can be bought and sold</div>
                <div>✓ Ownership is transferable</div>
                <div>✓ Creates liquid markets</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center max-w-2xl">
        <div className="text-sm text-slate-600 bg-white p-4 rounded-lg border border-slate-200">
          <strong>Key Insight:</strong> SBTs solve the problem of fake credentials and identity verification in Web3 
          by creating non-transferable tokens that truly represent your achievements and affiliations.
        </div>
      </div>
    </div>
  );
}
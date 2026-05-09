"use client";

import { useState } from 'react';

export function BlockchainVisualizer() {
  const [blocks, setBlocks] = useState([
    { id: 0, data: 'Genesis', hash: 'abc123', prevHash: '000000', isValid: true },
    { id: 1, data: 'Alice→Bob: 10 BTC', hash: 'def456', prevHash: 'abc123', isValid: true },
    { id: 2, data: 'Bob→Carol: 5 BTC', hash: 'ghi789', prevHash: 'def456', isValid: true },
    { id: 3, data: 'Carol→Dave: 3 BTC', hash: 'jkl012', prevHash: 'ghi789', isValid: true }
  ]);
  const [editingBlock, setEditingBlock] = useState<number | null>(null);
  const [newData, setNewData] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  const generateHash = (data: string, prevHash: string) => {
    let hash = 0;
    const str = data + prevHash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).substring(0, 6);
  };

  const validateChain = () => {
    const newBlocks = [...blocks];
    let isChainValid = true;
    
    for (let i = 1; i < newBlocks.length; i++) {
      const currentBlock = newBlocks[i];
      const prevBlock = newBlocks[i - 1];
      
      if (currentBlock.prevHash !== prevBlock.hash) {
        currentBlock.isValid = false;
        isChainValid = false;
      } else {
        currentBlock.isValid = true;
      }
    }
    
    return newBlocks;
  };

  const editBlock = (blockId: number) => {
    setEditingBlock(blockId);
    setNewData(blocks[blockId].data);
  };

  const saveEdit = () => {
    if (editingBlock === null) return;
    
    const newBlocks = [...blocks];
    const block = newBlocks[editingBlock];
    const prevHash = editingBlock === 0 ? '000000' : newBlocks[editingBlock - 1].hash;
    
    block.data = newData;
    block.hash = generateHash(newData, prevHash);
    
    setBlocks(validateChain(newBlocks));
    setEditingBlock(null);
    setNewData('');
    setShowValidation(true);
  };

  const repairChain = () => {
    const newBlocks = [...blocks];
    
    for (let i = 1; i < newBlocks.length; i++) {
      const currentBlock = newBlocks[i];
      const prevBlock = newBlocks[i - 1];
      
      if (currentBlock.prevHash !== prevBlock.hash) {
        currentBlock.prevHash = prevBlock.hash;
        currentBlock.hash = generateHash(currentBlock.data, currentBlock.prevHash);
      }
    }
    
    setBlocks(validateChain(newBlocks));
  };

  const resetChain = () => {
    setBlocks([
      { id: 0, data: 'Genesis', hash: 'abc123', prevHash: '000000', isValid: true },
      { id: 1, data: 'Alice→Bob: 10 BTC', hash: 'def456', prevHash: 'abc123', isValid: true },
      { id: 2, data: 'Bob→Carol: 5 BTC', hash: 'ghi789', prevHash: 'def456', isValid: true },
      { id: 3, data: 'Carol→Dave: 3 BTC', hash: 'jkl012', prevHash: 'ghi789', isValid: true }
    ]);
    setShowValidation(false);
    setEditingBlock(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Blockchain Immutability</h3>
        <p className="text-slate-600">Edit a block to see how changing data breaks the chain's integrity</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-4xl">
        {blocks.map((block, index) => (
          <div key={block.id} className="flex items-center gap-4">
            <div className={`p-4 rounded-lg border-2 transition-all duration-300 flex-1 ${
              block.isValid 
                ? 'bg-emerald-50 border-emerald-300' 
                : 'bg-rose-50 border-rose-300 animate-pulse'
            }`}>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-slate-700">Block #{block.id}</div>
                  {editingBlock === block.id ? (
                    <input
                      type="text"
                      value={newData}
                      onChange={(e) => setNewData(e.target.value)}
                      className="mt-1 p-1 border rounded text-xs w-full"
                      autoFocus
                    />
                  ) : (
                    <div className="text-slate-600 truncate">{block.data}</div>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-slate-700">Hash</div>
                  <div className="text-blue-600 font-mono text-xs">{block.hash}</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-700">Prev Hash</div>
                  <div className="text-indigo-600 font-mono text-xs">{block.prevHash}</div>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                {editingBlock === block.id ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingBlock(null)}
                      className="px-3 py-1 text-xs bg-slate-400 text-white rounded hover:bg-slate-500"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => editBlock(block.id)}
                    className="px-3 py-1 text-xs bg-amber-500 text-white rounded hover:bg-amber-600"
                  >
                    Edit Data
                  </button>
                )}
              </div>
            </div>
            
            {index < blocks.length - 1 && (
              <div className={`flex items-center ${
                blocks[index + 1].isValid ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                <div className="text-2xl">→</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showValidation && (
        <div className="bg-rose-100 border border-rose-300 rounded-lg p-4 w-full max-w-4xl">
          <h4 className="font-semibold text-rose-800 mb-2">Chain Validation Failed!</h4>
          <p className="text-rose-700 text-sm mb-3">
            Changing block data modified its hash, breaking the link to subsequent blocks. 
            Each invalid block shows where the previous hash doesn't match.
          </p>
          <div className="flex gap-2">
            <button
              onClick={repairChain}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Repair Chain (Recalculate All Hashes)
            </button>
            <button
              onClick={resetChain}
              className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 text-sm"
            >
              Reset to Original
            </button>
          </div>
        </div>
      )}

      <div className="text-center max-w-2xl">
        <p className="text-slate-600 text-sm">
          Try editing any block's data to see how it breaks the cryptographic chain. 
          This demonstrates why blockchain is immutable - changing history requires recalculating all subsequent blocks.
        </p>
      </div>
    </div>
  );
}
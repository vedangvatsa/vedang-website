"use client";

import React, { useState, useEffect } from 'react';

export function FiftyOnePercentAttackVisualizer() {
  const [attackerPower, setAttackerPower] = useState(30);
  const [blocks, setBlocks] = useState<{id: number; miner: 'honest' | 'attacker'; y: number}[]>([]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [forkPoint, setForkPoint] = useState(-1);
  const [attackChain, setAttackChain] = useState<{id: number; x: number}[]>([]);

  const startAttack = () => {
    setIsAttacking(true);
    setBlocks([]);
    setAttackChain([]);
    setForkPoint(-1);

    const honest: {id: number; miner: 'honest' | 'attacker'; y: number}[] = [];
    const attack: {id: number; x: number}[] = [];
    let step = 0;
    let forkSet = false;

    const interval = setInterval(() => {
      step++;
      const isAttackerBlock = Math.random() * 100 < attackerPower;

      if (step < 5) {
        // Normal blocks first
        honest.push({ id: step, miner: isAttackerBlock ? 'attacker' : 'honest', y: 150 });
        setBlocks([...honest]);
      } else {
        if (!forkSet) {
          setForkPoint(honest.length);
          forkSet = true;
        }
        // Fork: attacker mines secretly
        if (isAttackerBlock) {
          attack.push({ id: step, x: attack.length });
          setAttackChain([...attack]);
        } else {
          honest.push({ id: step, miner: 'honest', y: 150 });
          setBlocks([...honest]);
        }
      }

      if (step >= 15) {
        clearInterval(interval);
        setTimeout(() => setIsAttacking(false), 500);
      }
    }, 400);
  };

  const canAttackSucceed = attackerPower > 50;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">51% Attack Simulation</h3>
        <p className="text-slate-600 max-w-2xl">See what happens when one miner controls more than half the network power</p>
      </div>

      {/* Power slider */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-blue-600 font-semibold">Honest Miners: {100 - attackerPower}%</span>
          <span className="text-red-600 font-semibold">Attacker: {attackerPower}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={90}
          value={attackerPower}
          onChange={e => setAttackerPower(Number(e.target.value))}
          className="w-full accent-red-500"
        />
        <div className="w-full h-4 rounded-full overflow-hidden bg-blue-200 mt-2">
          <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${attackerPower}%` }} />
        </div>
        <div className="text-center mt-2 text-sm font-medium" style={{ color: canAttackSucceed ? '#dc2626' : '#16a34a' }}>
          {canAttackSucceed ? '⚠️ Attacker has majority — attack likely succeeds' : '✅ Honest majority — network is secure'}
        </div>
      </div>

      {/* Chain visualization */}
      <div className="w-full max-w-3xl">
        <svg viewBox="0 0 650 250" className="w-full border border-slate-200 rounded-xl bg-white">
          {/* Main chain label */}
          <text x={20} y={145} fontSize="10" fill="#3b82f6" fontWeight="600">Honest Chain</text>

          {/* Main chain blocks */}
          {blocks.map((block, i) => (
            <g key={`main-${block.id}`}>
              {i > 0 && (
                <line x1={80 + (i - 1) * 55 + 40} y1={150} x2={80 + i * 55} y2={150} stroke="#94a3b8" strokeWidth="2" />
              )}
              <rect
                x={80 + i * 55} y={130} width={40} height={40} rx={6}
                fill={block.miner === 'attacker' ? '#fecaca' : '#dbeafe'}
                stroke={block.miner === 'attacker' ? '#ef4444' : '#3b82f6'}
                strokeWidth="2"
              />
              <text x={100 + i * 55} y={155} textAnchor="middle" fontSize="8" fill="#334155" fontWeight="bold">
                #{block.id}
              </text>
            </g>
          ))}

          {/* Fork point */}
          {forkPoint > 0 && (
            <line
              x1={80 + forkPoint * 55 - 15} y1={130}
              x2={80 + forkPoint * 55 - 15} y2={60}
              stroke="#ef4444" strokeWidth="2" strokeDasharray="4 3"
            />
          )}

          {/* Attack chain */}
          {attackChain.length > 0 && (
            <text x={80 + forkPoint * 55 - 10} y={55} fontSize="10" fill="#ef4444" fontWeight="600">Secret Attacker Chain</text>
          )}
          {attackChain.map((block, i) => {
            const x = 80 + (forkPoint + i) * 55;
            return (
              <g key={`attack-${block.id}`}>
                {i > 0 && (
                  <line x1={x - 15} y1={80} x2={x} y2={80} stroke="#ef4444" strokeWidth="2" />
                )}
                <rect
                  x={x} y={60} width={40} height={40} rx={6}
                  fill="#fef2f2" stroke="#ef4444" strokeWidth="2"
                  className="animate-pulse"
                />
                <text x={x + 20} y={85} textAnchor="middle" fontSize="8" fill="#dc2626" fontWeight="bold">
                  #{block.id}
                </text>
              </g>
            );
          })}

          {/* Result indicator */}
          {!isAttacking && blocks.length > 0 && (
            <g transform="translate(325, 220)">
              <rect x={-120} y={-14} width={240} height={28} rx={8}
                fill={attackChain.length > blocks.length - forkPoint ? '#fef2f2' : '#f0fdf4'}
                stroke={attackChain.length > blocks.length - forkPoint ? '#fca5a5' : '#86efac'} />
              <text textAnchor="middle" y={5} fontSize="10" fill="#334155" fontWeight="600">
                {attackChain.length > blocks.length - forkPoint
                  ? '❌ Attacker chain is longer — history rewritten!'
                  : '✅ Honest chain wins — attack failed'}
              </text>
            </g>
          )}
        </svg>
      </div>

      <button
        onClick={startAttack}
        disabled={isAttacking}
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium transition-all"
      >
        {isAttacking ? '⛏ Mining...' : '⚔️ Simulate 51% Attack'}
      </button>

      <p className="text-slate-500 text-sm text-center max-w-xl">
        A 51% attack happens when a single entity controls more than half the network's mining power. They can secretly build a longer chain and then replace the honest chain, potentially reversing transactions and double-spending coins. Larger networks are more resistant because acquiring 51% of hashpower becomes prohibitively expensive.
      </p>
    </div>
  );
}

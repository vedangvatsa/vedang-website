"use client";

import { useState } from 'react';

export function DatabaseShardingVisualizer() {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [queryType, setQueryType] = useState<'single' | 'aggregate'>('single');
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResult, setQueryResult] = useState<string>('');

  const shards = [
    { id: 1, name: 'Shard 1', range: '0 - 999,999', color: 'bg-blue-100 border-blue-300', activeColor: 'bg-blue-200 border-blue-500' },
    { id: 2, name: 'Shard 2', range: '1,000,000 - 1,999,999', color: 'bg-emerald-100 border-emerald-300', activeColor: 'bg-emerald-200 border-emerald-500' },
    { id: 3, name: 'Shard 3', range: '2,000,000 - 2,999,999', color: 'bg-rose-100 border-rose-300', activeColor: 'bg-rose-200 border-rose-500' },
    { id: 4, name: 'Shard 4', range: '3,000,000 - 3,999,999', color: 'bg-amber-100 border-amber-300', activeColor: 'bg-amber-200 border-amber-500' }
  ];

  const determineTargetShard = (userId: number) => {
    return Math.floor(userId / 1000000) + 1;
  };

  const [activeShard, setActiveShard] = useState<number | null>(null);
  const [allShardsActive, setAllShardsActive] = useState(false);

  const executeQuery = async () => {
    setIsQuerying(true);
    setQueryResult('');
    setActiveShard(null);
    setAllShardsActive(false);

    if (queryType === 'single' && selectedUserId) {
      const userId = parseInt(selectedUserId);
      const targetShard = determineTargetShard(userId);
      
      // Simulate query routing
      await new Promise(resolve => setTimeout(resolve, 500));
      setActiveShard(targetShard);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setQueryResult(`User ${userId} found in ${shards[targetShard - 1].name}`);
    } else if (queryType === 'aggregate') {
      // Simulate hitting all shards
      setAllShardsActive(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setQueryResult('Aggregated data from all 4 shards: Total users: 4,000,000');
    }

    setIsQuerying(false);
  };

  const getSampleUsers = (shardId: number) => {
    const baseId = (shardId - 1) * 1000000;
    return [
      baseId + 1,
      baseId + 500000,
      baseId + 999999
    ];
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Database Sharding</h3>
        <p className="text-slate-600 max-w-2xl">
          Explore how data is distributed across multiple database shards and how queries are routed based on shard keys
        </p>
      </div>

      {/* Query Controls */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm w-full max-w-4xl">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Query Interface</h4>
        
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="queryType"
                value="single"
                checked={queryType === 'single'}
                onChange={(e) => setQueryType(e.target.value as 'single')}
                className="text-blue-600"
              />
              <span className="text-slate-700">Single User Query</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="queryType"
                value="aggregate"
                checked={queryType === 'aggregate'}
                onChange={(e) => setQueryType(e.target.value as 'aggregate')}
                className="text-blue-600"
              />
              <span className="text-slate-700">Aggregate Query</span>
            </label>
          </div>

          {queryType === 'single' && (
            <div className="flex gap-2 items-center">
              <label className="text-slate-700">User ID:</label>
              <input
                type="number"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                placeholder="Enter user ID (0-3,999,999)"
                className="px-3 py-2 border border-slate-300 rounded-lg w-48"
                min="0"
                max="3999999"
              />
            </div>
          )}

          <button
            onClick={executeQuery}
            disabled={isQuerying || (queryType === 'single' && !selectedUserId)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {isQuerying ? 'Querying...' : 'Execute Query'}
          </button>
        </div>
      </div>

      {/* Shards Visualization */}
      <div className="w-full max-w-6xl">
        <h4 className="text-lg font-semibold text-slate-800 mb-4 text-center">Database Shards</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {shards.map((shard) => {
            const isActive = activeShard === shard.id || allShardsActive;
            const shouldPulse = isQuerying && isActive;
            
            return (
              <div
                key={shard.id}
                className={`p-4 rounded-xl border-2 transition-all duration-500 ${
                  isActive ? shard.activeColor : shard.color
                } ${shouldPulse ? 'animate-pulse' : ''}`}
              >
                <h5 className="font-semibold text-slate-800 mb-2">{shard.name}</h5>
                <p className="text-sm text-slate-600 mb-3">User IDs: {shard.range}</p>
                
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 mb-1">Sample Users:</p>
                  {getSampleUsers(shard.id).map((userId) => (
                    <div
                      key={userId}
                      className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded cursor-pointer hover:bg-opacity-80 transition-colors"
                      onClick={() => {
                        setSelectedUserId(userId.toString());
                        setQueryType('single');
                      }}
                    >
                      User {userId.toLocaleString()}
                    </div>
                  ))}
                </div>
                
                {isActive && isQuerying && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                    <span className="text-xs text-indigo-600">Querying...</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Query Result */}
      {queryResult && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 w-full max-w-4xl">
          <h5 className="font-semibold text-indigo-800 mb-2">Query Result</h5>
          <p className="text-indigo-700">{queryResult}</p>
          
          {queryType === 'single' && selectedUserId && (
            <div className="mt-2 text-sm text-indigo-600">
              <p>Routing logic: User ID {selectedUserId} → Shard {determineTargetShard(parseInt(selectedUserId))}</p>
              <p>Formula: Math.floor(userId / 1,000,000) + 1</p>
            </div>
          )}
          
          {queryType === 'aggregate' && (
            <div className="mt-2 text-sm text-indigo-600">
              <p>All shards queried and results aggregated</p>
            </div>
          )}
        </div>
      )}

      {/* Key Concepts */}
      <div className="bg-slate-100 rounded-xl p-6 w-full max-w-4xl">
        <h4 className="text-lg font-semibold text-slate-800 mb-3">Key Sharding Concepts</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded-lg">
            <h5 className="font-medium text-blue-800 mb-1">Shard Key</h5>
            <p className="text-slate-600">User ID determines which shard contains the data</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <h5 className="font-medium text-emerald-800 mb-1">Single Shard Query</h5>
            <p className="text-slate-600">Fast queries that hit only one database</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <h5 className="font-medium text-rose-800 mb-1">Cross-Shard Query</h5>
            <p className="text-slate-600">Slower queries that must aggregate from all shards</p>
          </div>
        </div>
      </div>
    </div>
  );
}
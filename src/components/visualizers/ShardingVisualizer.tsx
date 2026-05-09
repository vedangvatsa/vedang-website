"use client";

import { useState } from 'react';

export function ShardingVisualizer() {
  const [numShards, setNumShards] = useState(4);
  const [totalRecords, setTotalRecords] = useState(1000000);
  const [selectedShard, setSelectedShard] = useState<number | null>(null);
  const [queryKey, setQueryKey] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);

  const recordsPerShard = Math.floor(totalRecords / numShards);
  const shardColors = ['bg-blue-400', 'bg-indigo-400', 'bg-rose-400', 'bg-emerald-400', 'bg-amber-400'];

  const getShardForKey = (key: string): number => {
    if (!key) return -1;
    const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % numShards;
  };

  const handleQuery = () => {
    if (!queryKey) return;
    setIsQuerying(true);
    const targetShard = getShardForKey(queryKey);
    setSelectedShard(targetShard);
    setTimeout(() => {
      setIsQuerying(false);
    }, 1500);
  };

  const maxThroughput = numShards * 1000;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Database Sharding Visualization</h3>
        <p className="text-slate-600">See how data is distributed across multiple database instances for horizontal scaling</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        <div className="flex flex-col gap-4 lg:w-1/3">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-3">Configuration</h4>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Number of Shards: {numShards}
              </label>
              <input
                type="range"
                min="2"
                max="8"
                value={numShards}
                onChange={(e) => {
                  setNumShards(parseInt(e.target.value));
                  setSelectedShard(null);
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Total Records: {totalRecords.toLocaleString()}
              </label>
              <input
                type="range"
                min="100000"
                max="10000000"
                step="100000"
                value={totalRecords}
                onChange={(e) => setTotalRecords(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-3">Query Router</h4>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Enter query key..."
                value={queryKey}
                onChange={(e) => setQueryKey(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
              />
              <button
                onClick={handleQuery}
                disabled={!queryKey || isQuerying}
                className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                Query
              </button>
            </div>
            {queryKey && (
              <p className="text-sm text-slate-600">
                Routes to Shard {getShardForKey(queryKey)}
              </p>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-2">Performance</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Records per shard:</span>
                <span className="font-medium">{recordsPerShard.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Max throughput:</span>
                <span className="font-medium">{maxThroughput.toLocaleString()} req/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Scaling factor:</span>
                <span className="font-medium text-emerald-600">{numShards}x</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-2/3">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-4">Shard Distribution</h4>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: numShards }, (_, i) => (
                <div
                  key={i}
                  className={`
                    relative p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer
                    ${selectedShard === i 
                      ? 'border-blue-500 shadow-lg transform scale-105' 
                      : 'border-slate-200 hover:border-slate-300'
                    }
                    ${isQuerying && selectedShard === i ? 'animate-pulse' : ''}
                  `}
                  onClick={() => setSelectedShard(selectedShard === i ? null : i)}
                >
                  <div className={`w-full h-16 ${shardColors[i % shardColors.length]} rounded mb-3 flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">S{i}</span>
                  </div>
                  
                  <div className="text-center space-y-1">
                    <div className="text-sm font-medium text-slate-700">Shard {i}</div>
                    <div className="text-xs text-slate-500">{recordsPerShard.toLocaleString()} records</div>
                    <div className="text-xs text-slate-500">1,000 req/s</div>
                  </div>

                  {selectedShard === i && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                  )}
                </div>
              ))}
            </div>

            {selectedShard !== null && (
              <div className="bg-slate-100 p-4 rounded-lg">
                <h5 className="font-medium text-slate-700 mb-2">Shard {selectedShard} Details</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Record Range:</span>
                    <div className="font-medium">
                      {(selectedShard * recordsPerShard).toLocaleString()} - {((selectedShard + 1) * recordsPerShard - 1).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-600">Data Size:</span>
                    <div className="font-medium">{Math.round(totalRecords / numShards / 10000) / 100} GB</div>
                  </div>
                  <div>
                    <span className="text-slate-600">CPU Usage:</span>
                    <div className="font-medium text-emerald-600">{Math.round(100 / numShards)}%</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Memory Usage:</span>
                    <div className="font-medium text-blue-600">{Math.round(800 / numShards)} MB</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white p-4 rounded-lg border border-slate-200">
        <h4 className="font-semibold text-slate-700 mb-2">Key Benefits</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-emerald-50 rounded-lg">
            <div className="text-emerald-600 font-semibold">Horizontal Scaling</div>
            <div className="text-slate-600">Add more shards to handle more data</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-blue-600 font-semibold">Parallel Processing</div>
            <div className="text-slate-600">Queries run simultaneously across shards</div>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-lg">
            <div className="text-amber-600 font-semibold">Fault Isolation</div>
            <div className="text-slate-600">One shard failure doesn't affect others</div>
          </div>
        </div>
      </div>
    </div>
  );
}
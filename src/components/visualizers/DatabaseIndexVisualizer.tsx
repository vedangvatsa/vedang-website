"use client";

import { useState } from 'react';

export function DatabaseIndexVisualizer() {
  const [searchTerm, setSearchTerm] = useState('Alice');
  const [useIndex, setUseIndex] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStep, setSearchStep] = useState(0);

  const tableData = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 35 },
    { id: 4, name: 'Diana', age: 28 },
    { id: 5, name: 'Eve', age: 32 },
    { id: 6, name: 'Frank', age: 27 },
    { id: 7, name: 'Grace', age: 29 },
    { id: 8, name: 'Henry', age: 31 },
    { id: 9, name: 'Alice', age: 26 },
    { id: 10, name: 'Jack', age: 33 }
  ];

  const indexStructure = [
    { name: 'Alice', rowIds: [1, 9] },
    { name: 'Bob', rowIds: [2] },
    { name: 'Charlie', rowIds: [3] },
    { name: 'Diana', rowIds: [4] },
    { name: 'Eve', rowIds: [5] },
    { name: 'Frank', rowIds: [6] },
    { name: 'Grace', rowIds: [7] },
    { name: 'Henry', rowIds: [8] },
    { name: 'Jack', rowIds: [10] }
  ];

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchStep(0);

    if (useIndex) {
      // Index search - direct lookup
      for (let i = 0; i <= 2; i++) {
        setSearchStep(i);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } else {
      // Full table scan
      for (let i = 0; i <= tableData.length; i++) {
        setSearchStep(i);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    setIsSearching(false);
    setSearchStep(0);
  };

  const getRowHighlight = (index: number) => {
    if (!isSearching) return '';
    if (useIndex) return '';
    if (searchStep > index) {
      return tableData[index].name === searchTerm ? 'bg-emerald-200' : 'bg-rose-100';
    }
    if (searchStep === index) return 'bg-blue-200';
    return '';
  };

  const getIndexHighlight = (name: string) => {
    if (!isSearching || !useIndex) return '';
    if (searchStep >= 1 && name === searchTerm) return 'bg-emerald-200';
    if (searchStep === 1) return 'bg-blue-200';
    return '';
  };

  const getResultRowHighlight = (rowId: number) => {
    if (!isSearching || !useIndex || searchStep < 2) return '';
    const indexEntry = indexStructure.find(entry => entry.name === searchTerm);
    if (indexEntry && indexEntry.rowIds.includes(rowId)) return 'bg-emerald-200';
    return '';
  };

  const matchingRows = tableData.filter(row => row.name === searchTerm);
  const scannedRows = useIndex ? Math.log2(tableData.length) : tableData.length;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Database Index Visualization</h3>
        <p className="text-slate-600 max-w-2xl">
          Compare how databases find data with and without indexes. A full table scan checks every row, while an index provides direct lookup.
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-4xl">
        {/* Controls */}
        <div className="flex flex-col gap-4 items-center bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex gap-4 items-center">
            <label className="text-slate-700">Search for:</label>
            <select 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md"
              disabled={isSearching}
            >
              {Array.from(new Set(tableData.map(row => row.name))).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-6 items-center">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={!useIndex}
                onChange={() => setUseIndex(false)}
                disabled={isSearching}
                className="text-rose-500"
              />
              <span className="text-slate-700">Full Table Scan</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={useIndex}
                onChange={() => setUseIndex(true)}
                disabled={isSearching}
                className="text-emerald-500"
              />
              <span className="text-slate-700">Use Index</span>
            </label>
          </div>

          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? 'Searching...' : 'Start Search'}
          </button>
        </div>

        {/* Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table */}
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-3">Users Table</h4>
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-2 p-2 bg-slate-100 rounded text-sm font-medium text-slate-700">
                <span>ID</span>
                <span>Name</span>
                <span>Age</span>
              </div>
              {tableData.map((row, index) => (
                <div 
                  key={row.id}
                  className={`grid grid-cols-3 gap-2 p-2 rounded text-sm transition-colors ${
                    getRowHighlight(index) || getResultRowHighlight(row.id)
                  }`}
                >
                  <span>{row.id}</span>
                  <span>{row.name}</span>
                  <span>{row.age}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Index */}
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-3">Name Index (B-Tree)</h4>
            <div className="space-y-1">
              <div className="grid grid-cols-2 gap-2 p-2 bg-slate-100 rounded text-sm font-medium text-slate-700">
                <span>Name</span>
                <span>Row IDs</span>
              </div>
              {indexStructure.map((entry) => (
                <div 
                  key={entry.name}
                  className={`grid grid-cols-2 gap-2 p-2 rounded text-sm transition-colors ${
                    getIndexHighlight(entry.name)
                  }`}
                >
                  <span>{entry.name}</span>
                  <span>{entry.rowIds.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <div className="text-2xl font-bold text-blue-600">{matchingRows.length}</div>
            <div className="text-sm text-slate-600">Results Found</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <div className="text-2xl font-bold text-amber-600">
              {useIndex ? '~3' : tableData.length}
            </div>
            <div className="text-sm text-slate-600">Rows Examined</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {useIndex ? `${Math.round(tableData.length / 3)}x` : '1x'}
            </div>
            <div className="text-sm text-slate-600">Speed Improvement</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 rounded"></div>
            <span className="text-slate-600">Currently Scanning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-200 rounded"></div>
            <span className="text-slate-600">Match Found</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-rose-100 rounded"></div>
            <span className="text-slate-600">No Match</span>
          </div>
        </div>
      </div>
    </div>
  );
}
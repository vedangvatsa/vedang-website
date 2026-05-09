"use client";

import React, { useState } from 'react';

export function GraphqlVisualizer() {
  const [selectedAPI, setSelectedAPI] = useState<'rest' | 'graphql'>('rest');
  const [selectedFields, setSelectedFields] = useState<string[]>(['name']);
  const [isAnimating, setIsAnimating] = useState(false);

  const userData = {
    name: "Alice Johnson",
    email: "alice@example.com",
    age: 28,
    address: "123 Main St, City, State",
    avatar: "profile.jpg",
    phone: "+1-555-0123",
    bio: "Software developer passionate about web technologies"
  };

  const availableFields = Object.keys(userData);

  const handleFieldToggle = (field: string) => {
    if (selectedAPI === 'graphql') {
      setSelectedFields(prev => 
        prev.includes(field) 
          ? prev.filter(f => f !== field)
          : [...prev, field]
      );
    }
  };

  const makeRequest = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  const getRestResponse = () => userData;

  const getGraphQLResponse = () => {
    const response: any = {};
    selectedFields.forEach(field => {
      response[field] = userData[field as keyof typeof userData];
    });
    return response;
  };

  const currentResponse = selectedAPI === 'rest' ? getRestResponse() : getGraphQLResponse();
  const responseSize = JSON.stringify(currentResponse).length;
  const fullSize = JSON.stringify(userData).length;
  const efficiency = Math.round((responseSize / fullSize) * 100);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">GraphQL vs REST APIs</h3>
        <p className="text-slate-600">Compare how different API approaches handle data fetching</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedAPI('rest')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            selectedAPI === 'rest'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          REST API
        </button>
        <button
          onClick={() => setSelectedAPI('graphql')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            selectedAPI === 'graphql'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          GraphQL
        </button>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Request Configuration</h4>
          
          {selectedAPI === 'rest' ? (
            <div className="space-y-4">
              <p className="text-slate-600">REST endpoint returns all user data:</p>
              <div className="bg-slate-100 p-3 rounded-lg font-mono text-sm">
                GET /api/users/123
              </div>
              <p className="text-amber-600 text-sm">⚠️ Cannot customize fields returned</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-600">Select fields to fetch:</p>
              <div className="grid grid-cols-2 gap-2">
                {availableFields.map(field => (
                  <label
                    key={field}
                    className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-slate-100"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field)}
                      onChange={() => handleFieldToggle(field)}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="text-slate-700">{field}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={makeRequest}
            disabled={isAnimating}
            className="w-full mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-all"
          >
            {isAnimating ? 'Making Request...' : 'Make Request'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-slate-800">Response</h4>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">Efficiency:</span>
              <span className={`px-2 py-1 rounded text-sm font-semibold ${
                efficiency <= 50 ? 'bg-rose-100 text-rose-700' :
                efficiency <= 80 ? 'bg-amber-100 text-amber-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {efficiency}%
              </span>
            </div>
          </div>

          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-50 transform scale-95' : ''}`}>
            <div className="bg-slate-100 p-4 rounded-lg overflow-auto max-h-64">
              <pre className="text-sm font-mono text-slate-800">
                {JSON.stringify(currentResponse, null, 2)}
              </pre>
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-600">
            <p>Data size: {responseSize} / {fullSize} characters</p>
            {selectedAPI === 'rest' && selectedFields.length < availableFields.length && (
              <p className="text-rose-600 mt-1">⚠️ Over-fetching: Getting unused data</p>
            )}
            {selectedAPI === 'graphql' && selectedFields.length > 0 && (
              <p className="text-emerald-600 mt-1">✓ Optimized: Only requested data</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl text-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-semibold text-blue-800 mb-2">REST API</h5>
            <p className="text-blue-700">Fixed response structure. Simple but may over-fetch or under-fetch data.</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h5 className="font-semibold text-indigo-800 mb-2">GraphQL</h5>
            <p className="text-indigo-700">Client specifies exact data needs. More complex but highly efficient.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
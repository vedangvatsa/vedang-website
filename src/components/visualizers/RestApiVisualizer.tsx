"use client";

import React, { useState, useEffect } from 'react';

export function RestApiVisualizer() {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [endpoint, setEndpoint] = useState('/users');
  const [isRequesting, setIsRequesting] = useState(false);
  const [response, setResponse] = useState<{status: number; body: string; time: number} | null>(null);
  const [animPhase, setAnimPhase] = useState<'idle' | 'request' | 'processing' | 'response'>('idle');

  const methods = [
    { name: 'GET' as const, color: '#22c55e', desc: 'Read data' },
    { name: 'POST' as const, color: '#3b82f6', desc: 'Create new' },
    { name: 'PUT' as const, color: '#f59e0b', desc: 'Update existing' },
    { name: 'DELETE' as const, color: '#ef4444', desc: 'Remove' },
  ];

  const endpoints = ['/users', '/users/42', '/posts', '/posts/7/comments'];

  const mockResponses: Record<string, Record<string, {status: number; body: string}>> = {
    'GET': {
      '/users': { status: 200, body: '[{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]' },
      '/users/42': { status: 200, body: '{ id: 42, name: "Charlie", email: "charlie@mail.com" }' },
      '/posts': { status: 200, body: '[{ id: 1, title: "Hello World" }]' },
      '/posts/7/comments': { status: 200, body: '[{ id: 1, text: "Great post!" }]' },
    },
    'POST': {
      '/users': { status: 201, body: '{ id: 43, name: "New User", created: true }' },
      '/posts': { status: 201, body: '{ id: 2, title: "New Post", created: true }' },
    },
    'PUT': {
      '/users/42': { status: 200, body: '{ id: 42, name: "Updated", modified: true }' },
    },
    'DELETE': {
      '/users/42': { status: 204, body: '(empty - resource deleted)' },
    },
  };

  const sendRequest = () => {
    setIsRequesting(true);
    setResponse(null);
    setAnimPhase('request');

    setTimeout(() => setAnimPhase('processing'), 600);
    setTimeout(() => {
      setAnimPhase('response');
      const mock = mockResponses[method]?.[endpoint] || { status: 404, body: '{ error: "Not Found" }' };
      setResponse({ ...mock, time: Math.floor(Math.random() * 200 + 50) });
    }, 1200);
    setTimeout(() => {
      setIsRequesting(false);
      setAnimPhase('idle');
    }, 1800);
  };

  const getMethodColor = () => methods.find(m => m.name === method)?.color || '#64748b';

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">REST API Explorer</h3>
        <p className="text-slate-600 max-w-2xl">Build and send HTTP requests to see how REST APIs work</p>
      </div>

      {/* Method selector */}
      <div className="flex gap-2 flex-wrap justify-center">
        {methods.map(m => (
          <button
            key={m.name}
            onClick={() => setMethod(m.name)}
            className={`px-4 py-2 rounded-lg font-mono font-bold text-sm transition-all ${
              method === m.name
                ? 'text-white shadow-lg'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
            }`}
            style={method === m.name ? { backgroundColor: m.color } : {}}
          >
            {m.name}
            <span className="ml-2 font-sans font-normal text-xs opacity-80">{m.desc}</span>
          </button>
        ))}
      </div>

      {/* Endpoint selector */}
      <div className="flex gap-2 flex-wrap justify-center">
        {endpoints.map(ep => (
          <button
            key={ep}
            onClick={() => setEndpoint(ep)}
            className={`px-3 py-1.5 rounded font-mono text-xs transition-all ${
              endpoint === ep
                ? 'bg-slate-800 text-white'
                : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {ep}
          </button>
        ))}
      </div>

      {/* Visual */}
      <div className="w-full max-w-2xl">
        <svg viewBox="0 0 600 200" className="w-full border border-slate-200 rounded-xl bg-white">
          {/* Client */}
          <g transform="translate(100, 100)">
            <rect x={-60} y={-40} width={120} height={80} rx={10} fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
            <text y={-10} textAnchor="middle" fontSize="20">💻</text>
            <text y={15} textAnchor="middle" fontSize="10" fill="#334155" fontWeight="600">Client</text>
          </g>

          {/* Server */}
          <g transform="translate(500, 100)">
            <rect x={-60} y={-40} width={120} height={80} rx={10} fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="2" />
            <text y={-10} textAnchor="middle" fontSize="20">🖥️</text>
            <text y={15} textAnchor="middle" fontSize="10" fill="#166534" fontWeight="600">Server</text>
            {animPhase === 'processing' && (
              <circle cx={0} cy={0} r={45} fill="none" stroke="#22c55e" strokeWidth="2" opacity={0.5}>
                <animate attributeName="r" from="40" to="55" dur="0.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="0.6s" repeatCount="indefinite" />
              </circle>
            )}
          </g>

          {/* Request arrow */}
          <g>
            <line x1={170} y1={90} x2={430} y2={90} stroke={getMethodColor()} strokeWidth="2" strokeDasharray="8 4" />
            <polygon points="425,83 440,90 425,97" fill={getMethodColor()} />
            <rect x={230} y={72} width={140} height={22} rx={4} fill={getMethodColor()} />
            <text x={300} y={87} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold" className="font-mono">
              {method} {endpoint}
            </text>

            {animPhase === 'request' && (
              <circle r={6} fill={getMethodColor()}>
                <animate attributeName="cx" from="170" to="430" dur="0.6s" fill="freeze" />
                <animate attributeName="cy" values="90" dur="0.6s" />
              </circle>
            )}
          </g>

          {/* Response arrow */}
          <g>
            <line x1={430} y1={115} x2={170} y2={115} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 3" />
            <polygon points="175,108 160,115 175,122" fill="#94a3b8" />
            {response && (
              <g>
                <rect x={240} y={106} width={120} height={20} rx={4} fill={response.status < 300 ? '#dcfce7' : response.status < 400 ? '#fef3c7' : '#fef2f2'} stroke={response.status < 300 ? '#86efac' : response.status < 400 ? '#fcd34d' : '#fca5a5'} />
                <text x={300} y={120} textAnchor="middle" fontSize="9" fill="#334155" fontWeight="600" className="font-mono">
                  {response.status} ({response.time}ms)
                </text>
              </g>
            )}
            {animPhase === 'response' && (
              <circle r={6} fill="#22c55e">
                <animate attributeName="cx" from="430" to="170" dur="0.6s" fill="freeze" />
                <animate attributeName="cy" values="115" dur="0.6s" />
              </circle>
            )}
          </g>
        </svg>
      </div>

      <button
        onClick={sendRequest}
        disabled={isRequesting}
        className="px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
        style={{ backgroundColor: getMethodColor(), color: 'white' }}
      >
        {isRequesting ? '⏳ Sending...' : `📤 Send ${method} Request`}
      </button>

      {/* Response body */}
      {response && (
        <div className="w-full max-w-xl bg-slate-900 rounded-xl p-4 font-mono text-xs">
          <div className="flex justify-between text-slate-400 mb-2">
            <span>Response Body</span>
            <span className={response.status < 300 ? 'text-emerald-400' : 'text-red-400'}>
              HTTP {response.status}
            </span>
          </div>
          <div className="text-emerald-300">{response.body}</div>
        </div>
      )}

      <p className="text-slate-500 text-sm text-center max-w-xl">
        REST APIs use standard HTTP methods to perform operations on resources. GET reads data, POST creates new resources, PUT updates existing ones, and DELETE removes them. Each endpoint represents a resource, and the server responds with a status code indicating success or failure.
      </p>
    </div>
  );
}

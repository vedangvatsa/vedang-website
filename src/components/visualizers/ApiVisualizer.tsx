"use client";

import { useState } from 'react';

export function ApiVisualizer() {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [animatingRequest, setAnimatingRequest] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [apiType, setApiType] = useState<'REST' | 'GraphQL' | 'gRPC'>('REST');

  const apps = [
    { id: 'mobile', name: 'Mobile App', color: 'bg-blue-500' },
    { id: 'web', name: 'Web App', color: 'bg-emerald-500' },
    { id: 'desktop', name: 'Desktop App', color: 'bg-rose-500' }
  ];

  const restResponses = {
    GET: { status: '200 OK', data: '{ "users": [{"id": 1, "name": "Alice"}] }' },
    POST: { status: '201 Created', data: '{ "id": 2, "name": "Bob", "created": true }' },
    PUT: { status: '200 OK', data: '{ "id": 1, "name": "Alice Updated", "modified": true }' },
    DELETE: { status: '204 No Content', data: '{ "deleted": true }' }
  };

  const graphqlResponse = {
    status: '200 OK',
    data: '{ "data": { "user": { "name": "Alice", "email": "alice@example.com" } } }'
  };

  const grpcResponse = {
    status: 'OK',
    data: 'Binary Protocol Buffer: User{name="Alice", id=1}'
  };

  const handleSendRequest = () => {
    if (!selectedApp) return;
    
    setAnimatingRequest(true);
    setShowResponse(false);
    
    setTimeout(() => {
      setAnimatingRequest(false);
      setShowResponse(true);
    }, 1500);
  };

  const getResponse = () => {
    switch (apiType) {
      case 'REST':
        return restResponses[selectedMethod];
      case 'GraphQL':
        return graphqlResponse;
      case 'gRPC':
        return grpcResponse;
      default:
        return restResponses[selectedMethod];
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">API Communication</h3>
        <p className="text-slate-600">Explore how applications communicate through different API types</p>
      </div>

      <div className="flex gap-4 mb-4">
        {['REST', 'GraphQL', 'gRPC'].map((type) => (
          <button
            key={type}
            onClick={() => {
              setApiType(type as any);
              setShowResponse(false);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              apiType === type
                ? 'bg-indigo-500 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          {/* Applications */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-slate-700 text-center">Applications</h4>
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => {
                  setSelectedApp(app.id);
                  setShowResponse(false);
                }}
                className={`w-24 h-16 rounded-lg text-white font-medium transition-all transform ${
                  app.color
                } ${
                  selectedApp === app.id 
                    ? 'scale-110 ring-4 ring-blue-200' 
                    : 'hover:scale-105'
                }`}
              >
                {app.name}
              </button>
            ))}
          </div>

          {/* Request Animation */}
          <div className="flex-1 flex items-center justify-center relative">
            {animatingRequest && (
              <div className="absolute w-8 h-2 bg-amber-400 rounded-full animate-pulse"
                   style={{
                     animation: 'moveRight 1.5s ease-in-out'
                   }}>
              </div>
            )}
            <div className="w-full h-0.5 bg-slate-300"></div>
          </div>

          {/* API Gateway */}
          <div className="flex flex-col items-center">
            <h4 className="font-semibold text-slate-700 mb-4">API Gateway</h4>
            <div className="w-32 h-24 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
              {apiType} API
            </div>
          </div>

          {/* Response Animation */}
          <div className="flex-1 flex items-center justify-center relative">
            {showResponse && (
              <div className="absolute w-8 h-2 bg-emerald-400 rounded-full"
                   style={{
                     animation: 'moveLeft 1s ease-in-out'
                   }}>
              </div>
            )}
            <div className="w-full h-0.5 bg-slate-300"></div>
          </div>

          {/* Database */}
          <div className="flex flex-col items-center">
            <h4 className="font-semibold text-slate-700 mb-4">Database</h4>
            <div className="w-20 h-16 bg-slate-600 rounded-lg flex items-center justify-center text-white font-bold">
              DB
            </div>
          </div>
        </div>

        {/* Controls */}
        {apiType === 'REST' && (
          <div className="flex gap-2 mb-6 justify-center">
            {(['GET', 'POST', 'PUT', 'DELETE'] as const).map((method) => (
              <button
                key={method}
                onClick={() => {
                  setSelectedMethod(method);
                  setShowResponse(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedMethod === method
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        )}

        <div className="text-center mb-6">
          <button
            onClick={handleSendRequest}
            disabled={!selectedApp || animatingRequest}
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 disabled:scale-100"
          >
            {animatingRequest ? 'Sending...' : 'Send Request'}
          </button>
        </div>

        {/* Request Details */}
        {selectedApp && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-700 mb-2">Request</h5>
              <div className="text-sm text-slate-600">
                <p><span className="font-medium">From:</span> {apps.find(a => a.id === selectedApp)?.name}</p>
                <p><span className="font-medium">Type:</span> {apiType}</p>
                {apiType === 'REST' && <p><span className="font-medium">Method:</span> {selectedMethod}</p>}
                {apiType === 'GraphQL' && <p><span className="font-medium">Query:</span> user(id: 1) &#123; name, email &#125;</p>}
                {apiType === 'gRPC' && <p><span className="font-medium">Method:</span> GetUser(UserRequest)</p>}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-700 mb-2">Response</h5>
              {showResponse ? (
                <div className="text-sm text-slate-600">
                  <p><span className="font-medium text-emerald-600">Status:</span> {getResponse().status}</p>
                  <p className="mt-2 text-xs bg-slate-50 p-2 rounded font-mono">{getResponse().data}</p>
                </div>
              ) : (
                <p className="text-slate-400 text-sm">Send a request to see response</p>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes moveRight {
          from { left: 0; }
          to { left: calc(100% - 2rem); }
        }
        @keyframes moveLeft {
          from { right: 0; }
          to { right: calc(100% - 2rem); }
        }
      `}</style>
    </div>
  );
}
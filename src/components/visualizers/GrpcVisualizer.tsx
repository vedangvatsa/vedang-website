"use client";

import { useState } from 'react';

export function GrpcVisualizer() {
  const [selectedProtocol, setSelectedProtocol] = useState<'grpc' | 'rest'>('grpc');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [selectedService, setSelectedService] = useState<'getUserInfo' | 'updateUser' | 'streamData'>('getUserInfo');

  const startAnimation = () => {
    setIsAnimating(true);
    setAnimationStep(0);
    
    const steps = selectedProtocol === 'grpc' ? 4 : 3;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setAnimationStep(step);
      if (step >= steps) {
        setTimeout(() => {
          setIsAnimating(false);
          setAnimationStep(0);
        }, 1000);
        clearInterval(interval);
      }
    }, 1200);
  };

  const grpcServices = {
    getUserInfo: { method: 'GetUserInfo', input: 'UserRequest', output: 'UserResponse' },
    updateUser: { method: 'UpdateUser', input: 'UpdateRequest', output: 'UpdateResponse' },
    streamData: { method: 'StreamData', input: 'StreamRequest', output: 'DataStream' }
  };

  const restEndpoints = {
    getUserInfo: { method: 'GET', path: '/api/users/{id}', response: 'JSON' },
    updateUser: { method: 'PUT', path: '/api/users/{id}', response: 'JSON' },
    streamData: { method: 'GET', path: '/api/stream', response: 'JSON' }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">gRPC vs REST Communication</h3>
        <p className="text-slate-600">Interactive comparison of gRPC and REST protocols with animated request flows</p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setSelectedProtocol('grpc')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            selectedProtocol === 'grpc'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          gRPC Protocol
        </button>
        <button
          onClick={() => setSelectedProtocol('rest')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            selectedProtocol === 'rest'
              ? 'bg-emerald-500 text-white shadow-lg'
              : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          REST Protocol
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value as any)}
          className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700"
        >
          <option value="getUserInfo">Get User Info</option>
          <option value="updateUser">Update User</option>
          <option value="streamData">Stream Data</option>
        </select>
        <button
          onClick={startAnimation}
          disabled={isAnimating}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            isAnimating
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg'
          }`}
        >
          {isAnimating ? 'Sending...' : 'Send Request'}
        </button>
      </div>

      <div className="w-full max-w-4xl">
        {selectedProtocol === 'grpc' ? (
          <div className="bg-white rounded-xl p-6 border border-blue-200">
            <div className="text-center mb-6">
              <h4 className="text-xl font-bold text-blue-700 mb-2">gRPC Communication Flow</h4>
              <div className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">
                <strong>Transport:</strong> HTTP/2 | <strong>Serialization:</strong> Protocol Buffers | <strong>Type Safety:</strong> Strong
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center mb-2 border-2 border-blue-300">
                  <div className="text-blue-700 font-bold text-sm">Client</div>
                </div>
                <div className="text-xs text-slate-600">gRPC Client</div>
              </div>
              
              <div className="flex-1 mx-8">
                <div className="relative">
                  <div className="h-2 bg-slate-200 rounded-full mb-2">
                    <div 
                      className={`h-2 bg-blue-500 rounded-full transition-all duration-1000 ${
                        animationStep >= 1 ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                  <div className="text-center mb-4">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs transition-all ${
                      animationStep >= 1 ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {grpcServices[selectedService].input} (Protobuf)
                    </div>
                  </div>
                  
                  <div className="text-center mb-2">
                    <div className={`inline-block px-3 py-1 rounded text-xs transition-all ${
                      animationStep >= 2 ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-slate-100 text-slate-400'
                    }`}>
                      HTTP/2 Stream
                    </div>
                  </div>
                  
                  <div className="h-2 bg-slate-200 rounded-full mb-2">
                    <div 
                      className={`h-2 bg-blue-400 rounded-full transition-all duration-1000 ${
                        animationStep >= 3 ? 'w-full' : 'w-0'
                      }`}
                      style={{ direction: 'rtl' }}
                    />
                  </div>
                  <div className="text-center">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs transition-all ${
                      animationStep >= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {grpcServices[selectedService].output} (Protobuf)
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className={`w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center mb-2 border-2 transition-all ${
                  animationStep >= 2 ? 'border-blue-500 bg-blue-200' : 'border-blue-300'
                }`}>
                  <div className="text-blue-700 font-bold text-sm">Server</div>
                </div>
                <div className="text-xs text-slate-600">gRPC Service</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className={`inline-block px-4 py-2 rounded-lg transition-all ${
                animationStep >= 4 ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-slate-100 text-slate-400'
              }`}>
                <strong>Method Called:</strong> {grpcServices[selectedService].method}()
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 border border-emerald-200">
            <div className="text-center mb-6">
              <h4 className="text-xl font-bold text-emerald-700 mb-2">REST Communication Flow</h4>
              <div className="text-sm text-slate-600 bg-emerald-50 p-3 rounded-lg">
                <strong>Transport:</strong> HTTP/1.1 | <strong>Serialization:</strong> JSON | <strong>Type Safety:</strong> Runtime
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-emerald-100 rounded-lg flex items-center justify-center mb-2 border-2 border-emerald-300">
                  <div className="text-emerald-700 font-bold text-sm">Client</div>
                </div>
                <div className="text-xs text-slate-600">HTTP Client</div>
              </div>
              
              <div className="flex-1 mx-8">
                <div className="relative">
                  <div className="h-2 bg-slate-200 rounded-full mb-2">
                    <div 
                      className={`h-2 bg-emerald-500 rounded-full transition-all duration-1000 ${
                        animationStep >= 1 ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                  <div className="text-center mb-4">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs transition-all ${
                      animationStep >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {restEndpoints[selectedService].method} {restEndpoints[selectedService].path}
                    </div>
                  </div>
                  
                  <div className="text-center mb-2">
                    <div className={`inline-block px-3 py-1 rounded text-xs transition-all ${
                      animationStep >= 2 ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-slate-100 text-slate-400'
                    }`}>
                      HTTP/1.1 Connection
                    </div>
                  </div>
                  
                  <div className="h-2 bg-slate-200 rounded-full mb-2">
                    <div 
                      className={`h-2 bg-emerald-400 rounded-full transition-all duration-1000 ${
                        animationStep >= 3 ? 'w-full' : 'w-0'
                      }`}
                      style={{ direction: 'rtl' }}
                    />
                  </div>
                  <div className="text-center">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs transition-all ${
                      animationStep >= 3 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {restEndpoints[selectedService].response} Response
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className={`w-24 h-24 bg-emerald-100 rounded-lg flex items-center justify-center mb-2 border-2 transition-all ${
                  animationStep >= 2 ? 'border-emerald-500 bg-emerald-200' : 'border-emerald-300'
                }`}>
                  <div className="text-emerald-700 font-bold text-sm">Server</div>
                </div>
                <div className="text-xs text-slate-600">REST API</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className={`inline-block px-4 py-2 rounded-lg transition-all ${
                animationStep >= 3 ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-slate-100 text-slate-400'
              }`}>
                <strong>HTTP Status:</strong> 200 OK
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-xl border border-blue-200">
          <h5 className="font-bold text-blue-700 mb-3">gRPC Advantages</h5>
          <ul className="text-sm text-slate-600 space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Binary serialization (faster)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              HTTP/2 multiplexing
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Strong type safety
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Built-in streaming support
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-emerald-200">
          <h5 className="font-bold text-emerald-700 mb-3">REST Advantages</h5>
          <ul className="text-sm text-slate-600 space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              Human-readable JSON
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              Universal browser support
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              Simple debugging tools
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              Stateless architecture
            </li>
          </ul>
        </div>
      </div>
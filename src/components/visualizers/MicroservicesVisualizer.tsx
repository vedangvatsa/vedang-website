"use client";

import { useState } from 'react';

export function MicroservicesVisualizer() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeRequest, setActiveRequest] = useState<string | null>(null);
  const [showMonolith, setShowMonolith] = useState(false);
  const [requestHistory, setRequestHistory] = useState<string[]>([]);

  const services = [
    { id: 'user', name: 'User Service', color: 'bg-blue-500', function: 'Authentication & Profiles', port: '3001' },
    { id: 'payment', name: 'Payment Service', color: 'bg-emerald-500', function: 'Transactions & Billing', port: '3002' },
    { id: 'order', name: 'Order Service', color: 'bg-indigo-500', function: 'Order Management', port: '3003' },
    { id: 'inventory', name: 'Inventory Service', color: 'bg-amber-500', function: 'Stock Management', port: '3004' }
  ];

  const handleServiceClick = (serviceId: string) => {
    if (selectedService === serviceId) {
      setSelectedService(null);
    } else {
      setSelectedService(serviceId);
      setActiveRequest(serviceId);
      setRequestHistory(prev => [...prev.slice(-2), serviceId]);
      setTimeout(() => setActiveRequest(null), 1000);
    }
  };

  const getServiceConnections = (serviceId: string) => {
    const connections: { [key: string]: string[] } = {
      'user': ['payment', 'order'],
      'payment': ['user', 'order'],
      'order': ['user', 'payment', 'inventory'],
      'inventory': ['order']
    };
    return connections[serviceId] || [];
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Microservices Architecture</h3>
        <p className="text-lg text-slate-600">Click services to see API communication vs monolithic structure</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowMonolith(false)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            !showMonolith 
              ? 'bg-blue-500 text-white shadow-lg' 
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          }`}
        >
          Microservices
        </button>
        <button
          onClick={() => setShowMonolith(true)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            showMonolith 
              ? 'bg-rose-500 text-white shadow-lg' 
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          }`}
        >
          Monolith
        </button>
      </div>

      {!showMonolith ? (
        <div className="relative">
          <div className="grid grid-cols-2 gap-8 mb-8">
            {services.map((service, index) => {
              const isSelected = selectedService === service.id;
              const isConnected = selectedService && getServiceConnections(selectedService).includes(service.id);
              const isActive = activeRequest === service.id;

              return (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service.id)}
                  className={`relative cursor-pointer transition-all duration-300 ${
                    isSelected ? 'scale-105' : 'hover:scale-102'
                  }`}
                >
                  <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    isSelected 
                      ? 'border-blue-400 shadow-xl' 
                      : isConnected
                      ? 'border-emerald-400 shadow-lg'
                      : 'border-slate-200 shadow-sm hover:border-slate-300'
                  } ${
                    isActive ? 'animate-pulse' : ''
                  }`}>
                    <div className={`w-4 h-4 rounded-full ${service.color} mb-3`}></div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">{service.name}</h4>
                    <p className="text-sm text-slate-600 mb-2">{service.function}</p>
                    <p className="text-xs text-slate-500">Port: {service.port}</p>
                    <div className="mt-3 flex gap-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-xs text-slate-500 ml-2">Independent DB</span>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-slate-800 text-white px-3 py-1 rounded text-xs whitespace-nowrap">
                      API Endpoint: /{service.id}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedService && (
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <h5 className="font-semibold text-slate-800 mb-2">API Communications</h5>
              <div className="flex flex-wrap gap-2">
                {getServiceConnections(selectedService).map(connectedId => {
                  const connectedService = services.find(s => s.id === connectedId);
                  return (
                    <span key={connectedId} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                      → {connectedService?.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <div className="p-8 bg-rose-100 border-2 border-rose-300 rounded-xl max-w-md mx-auto">
            <div className="w-6 h-6 bg-rose-500 rounded-full mx-auto mb-4"></div>
            <h4 className="text-xl font-bold text-rose-800 mb-3">Monolithic Application</h4>
            <p className="text-rose-700 mb-4">Single codebase handling all functions:</p>
            <div className="space-y-2 text-sm text-rose-600">
              <div>• User management</div>
              <div>• Payment processing</div>
              <div>• Order handling</div>
              <div>• Inventory tracking</div>
            </div>
            <div className="mt-4 pt-4 border-t border-rose-300">
              <div className="flex justify-center gap-1 mb-2">
                <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
              </div>
              <span className="text-xs text-rose-500">Single Database</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-emerald-50 p-4 rounded-lg">
              <h5 className="font-semibold text-emerald-800 mb-2">Microservices Benefits</h5>
              <ul className="text-emerald-700 space-y-1 text-left">
                <li>• Independent scaling</li>
                <li>• Technology diversity</li>
                <li>• Fault isolation</li>
                <li>• Team autonomy</li>
              </ul>
            </div>
            <div className="bg-rose-50 p-4 rounded-lg">
              <h5 className="font-semibold text-rose-800 mb-2">Monolith Challenges</h5>
              <ul className="text-rose-700 space-y-1 text-left">
                <li>• All-or-nothing deployment</li>
                <li>• Single technology stack</li>
                <li>• Cascading failures</li>
                <li>• Coordination overhead</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {requestHistory.length > 0 && !showMonolith && (
        <div className="bg-slate-100 p-3 rounded-lg text-sm text-slate-600">
          <span className="font-semibold">Recent API calls: </span>
          {requestHistory.slice(-3).map((serviceId, index) => {
            const service = services.find(s => s.id === serviceId);
            return (
              <span key={index} className="ml-2 text-blue-600">
                {service?.name}
                {index < requestHistory.slice(-3).length - 1 && ' →'}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
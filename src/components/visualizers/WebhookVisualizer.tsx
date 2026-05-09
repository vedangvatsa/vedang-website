"use client";

import React, { useState, useEffect } from 'react';

export function WebhookVisualizer() {
  const [events, setEvents] = useState<{id: number; type: string; status: 'pending' | 'sending' | 'delivered' | 'failed'; payload: string; retries: number}[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://api.myapp.com/webhooks');
  const [deliveredCount, setDeliveredCount] = useState(0);

  const eventTypes = [
    { type: 'payment.completed', payload: '{ amount: $49.99, customer: "alice" }', icon: '💳', color: '#22c55e' },
    { type: 'user.signup', payload: '{ email: "bob@mail.com", plan: "pro" }', icon: '👤', color: '#3b82f6' },
    { type: 'order.shipped', payload: '{ order: #1234, tracking: "UPS123" }', icon: '📦', color: '#f59e0b' },
    { type: 'invoice.failed', payload: '{ invoice: #567, reason: "card_declined" }', icon: '⚠️', color: '#ef4444' },
  ];

  useEffect(() => {
    if (!isListening) return;
    const interval = setInterval(() => {
      const et = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const newEvent = {
        id: Date.now(),
        type: et.type,
        status: 'pending' as const,
        payload: et.payload,
        retries: 0,
      };
      setEvents(prev => [newEvent, ...prev].slice(0, 8));

      // Animate delivery
      setTimeout(() => {
        setEvents(prev => prev.map(e => e.id === newEvent.id ? { ...e, status: 'sending' as const } : e));
      }, 400);
      setTimeout(() => {
        const success = Math.random() > 0.15;
        setEvents(prev => prev.map(e =>
          e.id === newEvent.id ? { ...e, status: success ? 'delivered' as const : 'failed' as const } : e
        ));
        if (success) setDeliveredCount(c => c + 1);
      }, 1200);
    }, 2500);
    return () => clearInterval(interval);
  }, [isListening]);

  const getEventConfig = (type: string) => eventTypes.find(e => e.type === type) || eventTypes[0];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Webhooks in Action</h3>
        <p className="text-slate-600 max-w-2xl">Watch events get pushed to your endpoint in real-time instead of polling</p>
      </div>

      <div className="w-full max-w-3xl">
        <svg viewBox="0 0 700 300" className="w-full border border-slate-200 rounded-xl bg-white">
          {/* Source server */}
          <g transform="translate(120, 150)">
            <rect x={-80} y={-60} width={160} height={120} rx={12} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
            <text y={-35} textAnchor="middle" fontSize="12" fill="#334155" fontWeight="bold">Source App</text>
            <text y={-15} textAnchor="middle" fontSize="9" fill="#64748b">(Stripe, GitHub, etc.)</text>
            {isListening && (
              <circle cx={60} cy={-45} r={6} fill="#22c55e">
                <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Recent event icons */}
            {events.slice(0, 3).map((event, i) => {
              const config = getEventConfig(event.type);
              return (
                <text key={event.id} x={-50 + i * 35} y={25} fontSize="18">{config.icon}</text>
              );
            })}
          </g>

          {/* Arrow with animated data packets */}
          <g>
            <line x1={210} y1={150} x2={440} y2={150} stroke="#94a3b8" strokeWidth="2" strokeDasharray="8 4" />
            <polygon points="435,143 450,150 435,157" fill="#94a3b8" />
            <text x={325} y={135} textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="600">HTTP POST</text>

            {/* Animated packets */}
            {events.filter(e => e.status === 'sending').map((event) => {
              const config = getEventConfig(event.type);
              return (
                <circle key={event.id} r={8} fill={config.color} opacity={0.8}>
                  <animate attributeName="cx" from="210" to="440" dur="0.8s" fill="freeze" />
                  <animate attributeName="cy" values="150" dur="0.8s" />
                </circle>
              );
            })}
          </g>

          {/* Destination server */}
          <g transform="translate(540, 150)">
            <rect x={-80} y={-60} width={160} height={120} rx={12} fill="#eff6ff" stroke="#93c5fd" strokeWidth="2" />
            <text y={-35} textAnchor="middle" fontSize="12" fill="#1e40af" fontWeight="bold">Your Server</text>
            <text y={-15} textAnchor="middle" fontSize="8" fill="#3b82f6" className="font-mono">{webhookUrl.replace('https://', '')}</text>
            <text y={15} textAnchor="middle" fontSize="11" fill="#1e40af">
              {deliveredCount > 0 ? `${deliveredCount} received` : 'Waiting...'}
            </text>
            <text y={35} textAnchor="middle" fontSize="22">
              {events[0]?.status === 'delivered' ? '✅' : events[0]?.status === 'failed' ? '❌' : '📡'}
            </text>
          </g>

          {/* "No Polling" badge */}
          <g transform="translate(325, 200)">
            <rect x={-55} y={-12} width={110} height={24} rx={12} fill="#dcfce7" stroke="#86efac" />
            <text textAnchor="middle" y={4} fontSize="9" fill="#166534" fontWeight="600">No polling needed!</text>
          </g>
        </svg>
      </div>

      {/* Event log */}
      {events.length > 0 && (
        <div className="w-full max-w-2xl bg-slate-900 rounded-xl p-4 font-mono text-xs overflow-hidden">
          <div className="text-slate-400 mb-2">Webhook Event Log</div>
          {events.slice(0, 5).map(event => {
            const config = getEventConfig(event.type);
            return (
              <div key={event.id} className="flex items-center gap-3 py-1.5 border-b border-slate-800">
                <span>{config.icon}</span>
                <span className="text-blue-400">{event.type}</span>
                <span className={`ml-auto px-2 py-0.5 rounded text-xs ${
                  event.status === 'delivered' ? 'bg-emerald-900 text-emerald-300' :
                  event.status === 'failed' ? 'bg-red-900 text-red-300' :
                  event.status === 'sending' ? 'bg-amber-900 text-amber-300' :
                  'bg-slate-700 text-slate-300'
                }`}>
                  {event.status}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => { setIsListening(!isListening); if (!isListening) { setEvents([]); setDeliveredCount(0); } }}
        className={`px-6 py-3 rounded-lg font-medium transition-all ${
          isListening ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200'
        }`}
      >
        {isListening ? '⏹ Stop Listening' : '▶ Start Receiving Webhooks'}
      </button>

      <p className="text-slate-500 text-sm text-center max-w-xl">
        Webhooks push data to your server the instant an event happens. Instead of repeatedly asking "has anything changed?" (polling), the source app sends an HTTP POST to your endpoint automatically. Failed deliveries are typically retried with exponential backoff.
      </p>
    </div>
  );
}

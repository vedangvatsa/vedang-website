"use client";

import { useState, useEffect, useRef } from 'react';

export function WebsocketVisualizer() {
  const [protocolMode, setProtocolMode] = useState<'http' | 'websocket'>('http');
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Array<{id: number, type: 'client' | 'server', text: string, timestamp: number}>>([]);
  const [animatingMessage, setAnimatingMessage] = useState<{id: number, type: 'client' | 'server', text: string} | null>(null);
  const [connectionCount, setConnectionCount] = useState(0);
  const [messageInput, setMessageInput] = useState('');
  const messageIdRef = useRef(0);

  const simulateHttpRequest = () => {
    const messageId = messageIdRef.current++;
    const requestText = 'GET /api/data';
    
    // Animate request
    setAnimatingMessage({id: messageId, type: 'client', text: requestText});
    setTimeout(() => {
      setMessages(prev => [...prev, {id: messageId, type: 'client', text: requestText, timestamp: Date.now()}]);
      setConnectionCount(prev => prev + 1);
      
      // Animate response
      const responseText = '200 OK: {"data": "value"}';
      setAnimatingMessage({id: messageId + 1, type: 'server', text: responseText});
      setTimeout(() => {
        setMessages(prev => [...prev, {id: messageId + 1, type: 'server', text: responseText, timestamp: Date.now()}]);
        setAnimatingMessage(null);
        setTimeout(() => {
          setMessages([]);
          setConnectionCount(0);
        }, 2000);
      }, 1000);
    }, 1000);
  };

  const toggleWebSocketConnection = () => {
    if (!isConnected) {
      setIsConnected(true);
      setConnectionCount(1);
      setMessages([{id: messageIdRef.current++, type: 'server', text: 'WebSocket connection established', timestamp: Date.now()}]);
    } else {
      setIsConnected(false);
      setConnectionCount(0);
      setMessages([]);
    }
  };

  const sendWebSocketMessage = () => {
    if (!isConnected || !messageInput.trim()) return;
    
    const messageId = messageIdRef.current++;
    const clientMessage = messageInput.trim();
    
    // Animate client message
    setAnimatingMessage({id: messageId, type: 'client', text: clientMessage});
    setTimeout(() => {
      setMessages(prev => [...prev, {id: messageId, type: 'client', text: clientMessage, timestamp: Date.now()}]);
      
      // Auto-respond from server
      const serverResponse = `Echo: ${clientMessage}`;
      setAnimatingMessage({id: messageId + 1, type: 'server', text: serverResponse});
      setTimeout(() => {
        setMessages(prev => [...prev, {id: messageId + 1, type: 'server', text: serverResponse, timestamp: Date.now()}]);
        setAnimatingMessage(null);
      }, 800);
    }, 800);
    
    setMessageInput('');
  };

  const MessageBubble = ({ message, isAnimating = false }: { message: {type: 'client' | 'server', text: string}, isAnimating?: boolean }) => (
    <div className={`max-w-xs p-3 rounded-lg ${
      message.type === 'client' 
        ? 'bg-blue-500 text-white ml-auto' 
        : 'bg-slate-200 text-slate-800'
    } ${isAnimating ? 'animate-pulse' : ''}`}>
      <div className="text-sm">{message.text}</div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">WebSocket vs HTTP Communication</h3>
        <p className="text-slate-600">Compare persistent WebSocket connections with traditional HTTP request-response cycles</p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setProtocolMode('http')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            protocolMode === 'http'
              ? 'bg-rose-500 text-white shadow-lg'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          HTTP Mode
        </button>
        <button
          onClick={() => setProtocolMode('websocket')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            protocolMode === 'websocket'
              ? 'bg-emerald-500 text-white shadow-lg'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          WebSocket Mode
        </button>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500 rounded"></div>
            </div>
            <span className="font-medium text-slate-700">Client</span>
          </div>
          
          <div className="flex-1 mx-8 relative">
            <div className={`h-2 rounded-full ${
              protocolMode === 'websocket' && isConnected 
                ? 'bg-emerald-400' 
                : protocolMode === 'http' 
                ? 'bg-rose-400' 
                : 'bg-slate-300'
            }`}></div>
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <span className={`text-xs px-2 py-1 rounded ${
                protocolMode === 'websocket' && isConnected 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : protocolMode === 'http' 
                  ? 'bg-rose-100 text-rose-700' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {protocolMode === 'websocket' && isConnected ? 'Connected' : 
                 protocolMode === 'http' ? 'Request/Response' : 'Disconnected'}
              </span>
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <span className="text-xs text-slate-500">
                Connections: {connectionCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-medium text-slate-700">Server</span>
            <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-indigo-500 rounded"></div>
            </div>
          </div>
        </div>

        {protocolMode === 'http' && (
          <div className="text-center">
            <button
              onClick={simulateHttpRequest}
              className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium"
            >
              Send HTTP Request
            </button>
            <p className="text-sm text-slate-600 mt-2">Each request opens a new connection</p>
          </div>
        )}

        {protocolMode === 'websocket' && (
          <div className="space-y-4">
            <div className="text-center">
              <button
                onClick={toggleWebSocketConnection}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isConnected
                    ? 'bg-rose-500 text-white hover:bg-rose-600'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                {isConnected ? 'Disconnect' : 'Connect WebSocket'}
              </button>
            </div>

            {isConnected && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendWebSocketMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={sendWebSocketMessage}
                  className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 h-48 bg-slate-50 rounded-lg p-4 overflow-y-auto">
          <div className="space-y-3">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {animatingMessage && (
              <MessageBubble message={animatingMessage} isAnimating />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl text-sm">
        <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
          <h4 className="font-semibold text-rose-800 mb-2">HTTP Characteristics</h4>
          <ul className="space-y-1 text-rose-700">
            <li>• New connection per request</li>
            <li>• Request-response only</li>
            <li>• Higher overhead</li>
            <li>• Stateless</li>
          </ul>
        </div>
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <h4 className="font-semibold text-emerald-800 mb-2">WebSocket Characteristics</h4>
          <ul className="space-y-1 text-emerald-700">
            <li>• Persistent connection</li>
            <li>• Bi-directional messaging</li>
            <li>• Lower latency</li>
            <li>• Real-time communication</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
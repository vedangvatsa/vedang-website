"use client";

import { useState, useEffect } from 'react';

export function MessageQueueVisualizer() {
  const [messages, setMessages] = useState<Array<{id: number, content: string, timestamp: number}>>([]);
  const [processing, setProcessing] = useState<{id: number, content: string} | null>(null);
  const [processed, setProcessed] = useState<Array<{id: number, content: string, processTime: number}>>([]);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [nextId, setNextId] = useState(1);
  const [producerSpeed, setProducerSpeed] = useState(2000);
  const [consumerSpeed, setConsumerSpeed] = useState(3000);

  const messageTypes = ['Order', 'Payment', 'Email', 'Notification', 'Report'];

  const addMessage = () => {
    const newMessage = {
      id: nextId,
      content: messageTypes[Math.floor(Math.random() * messageTypes.length)],
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
    setNextId(prev => prev + 1);
  };

  const processMessage = () => {
    if (messages.length > 0 && !processing) {
      const messageToProcess = messages[0];
      setMessages(prev => prev.slice(1));
      setProcessing(messageToProcess);
      
      setTimeout(() => {
        setProcessing(null);
        setProcessed(prev => [...prev, {...messageToProcess, processTime: Date.now()}].slice(-5));
      }, 1500);
    }
  };

  useEffect(() => {
    let producerInterval: NodeJS.Timeout;
    let consumerInterval: NodeJS.Timeout;

    if (isAutoMode) {
      producerInterval = setInterval(addMessage, producerSpeed);
      consumerInterval = setInterval(processMessage, consumerSpeed);
    }

    return () => {
      clearInterval(producerInterval);
      clearInterval(consumerInterval);
    };
  }, [isAutoMode, messages.length, processing, producerSpeed, consumerSpeed]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Message Queue</h3>
        <p className="text-slate-600">Interactive demonstration of asynchronous message processing with producer-consumer decoupling</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        <div className="flex flex-col gap-6">
          <div className="bg-blue-100 p-6 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-4">Producer (Service A)</h4>
            <button 
              onClick={addMessage}
              disabled={isAutoMode}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send Message
            </button>
            {isAutoMode && (
              <div className="mt-3">
                <label className="text-sm text-blue-700 block mb-1">Speed (ms)</label>
                <input
                  type="range"
                  min="500"
                  max="4000"
                  value={producerSpeed}
                  onChange={(e) => setProducerSpeed(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <span className="text-xs text-blue-600">{producerSpeed}ms</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center gap-4">
          <div className="bg-indigo-100 p-6 rounded-xl border border-indigo-200 w-full">
            <h4 className="font-semibold text-indigo-800 mb-4 text-center">Message Queue</h4>
            <div className="min-h-32 bg-white rounded-lg border-2 border-dashed border-indigo-300 p-4">
              {messages.length === 0 ? (
                <div className="text-center text-indigo-400 text-sm">Queue is empty</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {messages.map((message, index) => (
                    <div 
                      key={message.id}
                      className={`bg-indigo-200 p-3 rounded-lg border border-indigo-300 transform transition-all duration-500 ${
                        index === 0 ? 'animate-pulse' : ''
                      }`}
                      style={{
                        transform: `translateX(${index * 4}px)`,
                        zIndex: messages.length - index
                      }}
                    >
                      <div className="text-sm font-medium text-indigo-800">#{message.id} {message.content}</div>
                      <div className="text-xs text-indigo-600">Queued</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-3 text-center text-sm text-indigo-700">
              Queue Length: {messages.length}
            </div>
          </div>

          {processing && (
            <div className="bg-amber-100 p-4 rounded-xl border border-amber-200 w-full animate-pulse">
              <h5 className="font-semibold text-amber-800 mb-2 text-center">Processing...</h5>
              <div className="bg-amber-200 p-3 rounded-lg border border-amber-300">
                <div className="text-sm font-medium text-amber-800">#{processing.id} {processing.content}</div>
                <div className="text-xs text-amber-600">In Progress</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-emerald-100 p-6 rounded-xl border border-emerald-200">
            <h4 className="font-semibold text-emerald-800 mb-4">Consumer (Service B)</h4>
            <button 
              onClick={processMessage}
              disabled={messages.length === 0 || processing !== null || isAutoMode}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Process Message
            </button>
            {isAutoMode && (
              <div className="mt-3">
                <label className="text-sm text-emerald-700 block mb-1">Speed (ms)</label>
                <input
                  type="range"
                  min="1000"
                  max="5000"
                  value={consumerSpeed}
                  onChange={(e) => setConsumerSpeed(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <span className="text-xs text-emerald-600">{consumerSpeed}ms</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-rose-100 p-4 rounded-xl border border-rose-200 w-full max-w-2xl">
        <h5 className="font-semibold text-rose-800 mb-3 text-center">Processed Messages</h5>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {processed.length === 0 ? (
            <div className="text-center text-rose-400 text-sm">No messages processed yet</div>
          ) : (
            processed.map((msg) => (
              <div key={`${msg.id}-${msg.processTime}`} className="bg-rose-200 p-2 rounded border border-rose-300">
                <div className="text-sm font-medium text-rose-800">#{msg.id} {msg.content} ✓</div>
                <div className="text-xs text-rose-600">Completed</div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={() => setIsAutoMode(!isAutoMode)}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isAutoMode 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isAutoMode ? 'Stop Auto Mode' : 'Start Auto Mode'}
        </button>
        
        <button
          onClick={() => {
            setMessages([]);
            setProcessing(null);
            setProcessed([]);
            setNextId(1);
          }}
          className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="text-center text-sm text-slate-600 max-w-2xl">
        <p><strong>Key Benefits:</strong> Producers and consumers are decoupled - they operate independently. 
        Messages are queued for processing when consumers are ready, enabling scalability and fault tolerance.</p>
      </div>
    </div>
  );
}
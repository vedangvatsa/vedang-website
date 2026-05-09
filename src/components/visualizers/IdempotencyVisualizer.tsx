"use client";

import { useState } from 'react';

export function IdempotencyVisualizer() {
  const [getRequests, setGetRequests] = useState(0);
  const [deleteRequests, setDeleteRequests] = useState(0);
  const [putRequests, setPutRequests] = useState(0);
  const [postRequests, setPostRequests] = useState(0);
  const [resourceExists, setResourceExists] = useState(true);
  const [userData, setUserData] = useState({ name: "John Doe", email: "john@example.com" });
  const [orderCount, setOrderCount] = useState(0);

  const handleGet = () => {
    setGetRequests(prev => prev + 1);
  };

  const handleDelete = () => {
    setDeleteRequests(prev => prev + 1);
    if (resourceExists) {
      setResourceExists(false);
    }
  };

  const handlePut = () => {
    setPutRequests(prev => prev + 1);
    setUserData({ name: "Jane Smith", email: "jane@example.com" });
  };

  const handlePost = () => {
    setPostRequests(prev => prev + 1);
    setOrderCount(prev => prev + 1);
  };

  const resetDemo = () => {
    setGetRequests(0);
    setDeleteRequests(0);
    setPutRequests(0);
    setPostRequests(0);
    setResourceExists(true);
    setUserData({ name: "John Doe", email: "john@example.com" });
    setOrderCount(0);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">HTTP Idempotency Interactive Demo</h3>
        <p className="text-slate-600 max-w-2xl">
          Click the HTTP method buttons below to see how idempotent operations produce the same result when repeated, 
          while non-idempotent operations create different outcomes each time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {/* GET Request */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">GET</span>
            <span className="text-xs text-slate-500">Idempotent ✓</span>
          </div>
          
          <button
            onClick={handleGet}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors mb-4"
          >
            Fetch User Data
          </button>
          
          <div className="text-sm text-slate-600 mb-2">Requests: {getRequests}</div>
          
          <div className="bg-emerald-50 p-3 rounded-lg">
            <div className="text-xs font-medium text-emerald-700 mb-1">Response:</div>
            <div className="text-xs text-slate-700">
              {userData.name}<br />
              {userData.email}
            </div>
          </div>
        </div>

        {/* DELETE Request */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-rose-700 bg-rose-100 px-2 py-1 rounded">DELETE</span>
            <span className="text-xs text-slate-500">Idempotent ✓</span>
          </div>
          
          <button
            onClick={handleDelete}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 px-4 rounded-lg transition-colors mb-4"
          >
            Delete User
          </button>
          
          <div className="text-sm text-slate-600 mb-2">Requests: {deleteRequests}</div>
          
          <div className="bg-rose-50 p-3 rounded-lg">
            <div className="text-xs font-medium text-rose-700 mb-1">Resource Status:</div>
            <div className={`text-xs font-medium ${resourceExists ? 'text-emerald-600' : 'text-rose-600'}`}>
              {resourceExists ? 'EXISTS' : 'DELETED'}
            </div>
          </div>
        </div>

        {/* PUT Request */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded">PUT</span>
            <span className="text-xs text-slate-500">Idempotent ✓</span>
          </div>
          
          <button
            onClick={handlePut}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors mb-4"
          >
            Update User
          </button>
          
          <div className="text-sm text-slate-600 mb-2">Requests: {putRequests}</div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-xs font-medium text-blue-700 mb-1">Current Data:</div>
            <div className="text-xs text-slate-700">
              {userData.name}<br />
              {userData.email}
            </div>
          </div>
        </div>

        {/* POST Request */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded">POST</span>
            <span className="text-xs text-slate-500">Not Idempotent ✗</span>
          </div>
          
          <button
            onClick={handlePost}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors mb-4"
          >
            Create Order
          </button>
          
          <div className="text-sm text-slate-600 mb-2">Requests: {postRequests}</div>
          
          <div className="bg-amber-50 p-3 rounded-lg">
            <div className="text-xs font-medium text-amber-700 mb-1">Orders Created:</div>
            <div className="text-xs font-bold text-slate-700">
              {orderCount} order{orderCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 max-w-4xl">
        <h4 className="text-lg font-semibold text-indigo-800 mb-3">Observation</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-emerald-700 mb-1">Idempotent Operations:</div>
            <ul className="text-slate-600 space-y-1 text-xs">
              <li>• GET: Always returns same data</li>
              <li>• DELETE: Resource stays deleted</li>
              <li>• PUT: Same final state achieved</li>
            </ul>
          </div>
          <div>
            <div className="font-medium text-amber-700 mb-1">Non-Idempotent Operation:</div>
            <ul className="text-slate-600 space-y-1 text-xs">
              <li>• POST: Creates new resource each time</li>
              <li>• Each request has side effects</li>
              <li>• Repeated calls change system state</li>
            </ul>
          </div>
        </div>
      </div>

      <button
        onClick={resetDemo}
        className="bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
      >
        Reset Demo
      </button>
    </div>
  );
}
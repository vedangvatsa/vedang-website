"use client";

import { useState } from 'react';

export function OrderBookVisualizer() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [newOrderPrice, setNewOrderPrice] = useState(100);
  const [newOrderQuantity, setNewOrderQuantity] = useState(10);
  const [newOrderType, setNewOrderType] = useState<'bid' | 'ask'>('bid');
  const [orders, setOrders] = useState({
    bids: [
      { id: '1', price: 98, quantity: 15 },
      { id: '2', price: 97, quantity: 25 },
      { id: '3', price: 96, quantity: 30 },
      { id: '4', price: 95, quantity: 20 },
      { id: '5', price: 94, quantity: 35 }
    ],
    asks: [
      { id: '6', price: 102, quantity: 18 },
      { id: '7', price: 103, quantity: 22 },
      { id: '8', price: 104, quantity: 28 },
      { id: '9', price: 105, quantity: 15 },
      { id: '10', price: 106, quantity: 40 }
    ]
  });

  const highestBid = Math.max(...orders.bids.map(b => b.price));
  const lowestAsk = Math.min(...orders.asks.map(a => a.price));
  const spread = lowestAsk - highestBid;
  const spreadPercentage = ((spread / highestBid) * 100).toFixed(3);

  const addOrder = () => {
    const newOrder = {
      id: Date.now().toString(),
      price: newOrderPrice,
      quantity: newOrderQuantity
    };

    setOrders(prev => {
      const updated = { ...prev };
      if (newOrderType === 'bid') {
        updated.bids = [...prev.bids, newOrder].sort((a, b) => b.price - a.price);
      } else {
        updated.asks = [...prev.asks, newOrder].sort((a, b) => a.price - b.price);
      }
      return updated;
    });
  };

  const removeOrder = (orderId: string, type: 'bid' | 'ask') => {
    setOrders(prev => ({
      ...prev,
      [type === 'bid' ? 'bids' : 'asks']: prev[type === 'bid' ? 'bids' : 'asks'].filter(order => order.id !== orderId)
    }));
    setSelectedOrderId(null);
  };

  const getBarWidth = (quantity: number) => {
    const maxQuantity = Math.max(
      ...orders.bids.map(b => b.quantity),
      ...orders.asks.map(a => a.quantity)
    );
    return (quantity / maxQuantity) * 100;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Order Book Visualization</h3>
        <p className="text-slate-600">Interactive order book showing bids, asks, and market spread. Click orders to remove them or add new ones.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        <div className="flex-1 bg-white rounded-xl p-6 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Asks (Sell Orders) */}
            <div className="order-2 md:order-1">
              <h4 className="text-lg font-semibold text-rose-600 mb-4 text-center">Asks (Sell Orders)</h4>
              <div className="space-y-1">
                <div className="grid grid-cols-3 text-xs font-medium text-slate-500 mb-2 px-2">
                  <span>Price</span>
                  <span className="text-center">Size</span>
                  <span className="text-right">Total</span>
                </div>
                {orders.asks.map((ask, index) => {
                  const cumulativeQuantity = orders.asks.slice(0, index + 1).reduce((sum, a) => sum + a.quantity, 0);
                  return (
                    <div
                      key={ask.id}
                      className={`relative grid grid-cols-3 text-sm py-1 px-2 rounded cursor-pointer transition-all ${
                        selectedOrderId === ask.id
                          ? 'bg-rose-100 border border-rose-300'
                          : 'hover:bg-rose-50'
                      }`}
                      onClick={() => setSelectedOrderId(selectedOrderId === ask.id ? null : ask.id)}
                    >
                      <div
                        className="absolute right-0 top-0 h-full bg-rose-100 opacity-50 rounded"
                        style={{ width: `${getBarWidth(ask.quantity)}%` }}
                      />
                      <span className="relative z-10 font-mono text-rose-700">${ask.price}</span>
                      <span className="relative z-10 text-center text-slate-700">{ask.quantity}</span>
                      <span className="relative z-10 text-right text-slate-600">{cumulativeQuantity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bids (Buy Orders) */}
            <div className="order-1 md:order-2">
              <h4 className="text-lg font-semibold text-emerald-600 mb-4 text-center">Bids (Buy Orders)</h4>
              <div className="space-y-1">
                <div className="grid grid-cols-3 text-xs font-medium text-slate-500 mb-2 px-2">
                  <span>Price</span>
                  <span className="text-center">Size</span>
                  <span className="text-right">Total</span>
                </div>
                {orders.bids.map((bid, index) => {
                  const cumulativeQuantity = orders.bids.slice(0, index + 1).reduce((sum, b) => sum + b.quantity, 0);
                  return (
                    <div
                      key={bid.id}
                      className={`relative grid grid-cols-3 text-sm py-1 px-2 rounded cursor-pointer transition-all ${
                        selectedOrderId === bid.id
                          ? 'bg-emerald-100 border border-emerald-300'
                          : 'hover:bg-emerald-50'
                      }`}
                      onClick={() => setSelectedOrderId(selectedOrderId === bid.id ? null : bid.id)}
                    >
                      <div
                        className="absolute left-0 top-0 h-full bg-emerald-100 opacity-50 rounded"
                        style={{ width: `${getBarWidth(bid.quantity)}%` }}
                      />
                      <span className="relative z-10 font-mono text-emerald-700">${bid.price}</span>
                      <span className="relative z-10 text-center text-slate-700">{bid.quantity}</span>
                      <span className="relative z-10 text-right text-slate-600">{cumulativeQuantity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Spread Info */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
            <div className="text-sm text-slate-600 mb-1">Market Spread</div>
            <div className="text-xl font-bold text-amber-700">${spread.toFixed(2)}</div>
            <div className="text-xs text-slate-500">({spreadPercentage}% of bid price)</div>
            <div className="text-xs text-slate-600 mt-2">
              Best Bid: ${highestBid} | Best Ask: ${lowestAsk}
            </div>
          </div>
        </div>

        {/* Order Controls */}
        <div className="w-full lg:w-80 bg-white rounded-xl p-6 border border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Add New Order</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Order Type</label>
              <div className="flex gap-2">
                <button
                  className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                    newOrderType === 'bid'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                  onClick={() => setNewOrderType('bid')}
                >
                  Bid (Buy)
                </button>
                <button
                  className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                    newOrderType === 'ask'
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                  onClick={() => setNewOrderType('ask')}
                >
                  Ask (Sell)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Price ($)</label>
              <input
                type="range"
                min="80"
                max="120"
                value={newOrderPrice}
                onChange={(e) => setNewOrderPrice(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-lg font-mono text-slate-800 mt-1">${newOrderPrice}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
              <input
                type="range"
                min="5"
                max="50"
                value={newOrderQuantity}
                onChange={(e) => setNewOrderQuantity(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-lg font-mono text-slate-800 mt-1">{newOrderQuantity}</div>
            </div>

            <button
              onClick={addOrder}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                newOrderType === 'bid'
                  ? 'bg-emerald-500 hover:bg-emerald-600'
                  : 'bg-rose-500 hover:bg-rose-600'
              }`}
            >
              Add {newOrderType === 'bid' ? 'Bid' : 'Ask'} Order
            </button>
          </div>

          {selectedOrderId && (
            <div className="mt-6 p-4 bg-slate-100 rounded-lg">
              <h5 className="font-medium text-slate-800 mb-2">Selected Order</h5>
              <button
                onClick={() => {
                  const orderType = orders.bids.some(b => b.id === selectedOrderId) ? 'bid' : 'ask';
                  removeOrder(selectedOrderId, orderType);
                }}
                className="w-full py-2 px-3 bg-slate-500 hover:bg-slate-600 text-white rounded transition-colors"
              >
                Remove Order
              </button>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <strong>Tips:</strong>
            <ul className="mt-2 space-y-1 text-xs">
              <li>• Tighter spreads = more liquid market</li>
              <li>• Bar length shows order size</li>
              <li>• Click orders to select/remove them</li>
              <li>• Add orders to see spread changes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
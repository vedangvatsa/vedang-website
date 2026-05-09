"use client";

import { useState } from 'react';

export function MarketOrderVisualizer() {
  const [orderSize, setOrderSize] = useState(100);
  const [marketLiquidity, setMarketLiquidity] = useState(50);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStep, setExecutionStep] = useState(0);
  const [executedTrades, setExecutedTrades] = useState([]);

  // Generate order book based on liquidity
  const generateOrderBook = () => {
    const basePrice = 100;
    const liquidityFactor = marketLiquidity / 100;
    const orders = [];
    
    for (let i = 0; i < 5; i++) {
      const priceOffset = (i + 1) * (2 - liquidityFactor);
      const size = Math.max(20, liquidityFactor * 80 - i * 10);
      orders.push({
        price: basePrice + priceOffset,
        size: Math.round(size),
        id: i
      });
    }
    return orders.sort((a, b) => a.price - b.price);
  };

  const orderBook = generateOrderBook();
  const bestPrice = orderBook[0]?.price || 100;

  const executeMarketOrder = () => {
    setIsExecuting(true);
    setExecutionStep(0);
    setExecutedTrades([]);
    
    let remainingSize = orderSize;
    let currentStep = 0;
    const trades = [];
    
    const stepExecution = () => {
      if (remainingSize > 0 && currentStep < orderBook.length) {
        const currentOrder = orderBook[currentStep];
        const fillSize = Math.min(remainingSize, currentOrder.size);
        
        trades.push({
          price: currentOrder.price,
          size: fillSize,
          step: currentStep
        });
        
        remainingSize -= fillSize;
        currentStep++;
        
        setExecutionStep(currentStep);
        setExecutedTrades([...trades]);
        
        setTimeout(stepExecution, 800);
      } else {
        setTimeout(() => setIsExecuting(false), 1000);
      }
    };
    
    setTimeout(stepExecution, 500);
  };

  const calculateSlippage = () => {
    if (executedTrades.length === 0) return 0;
    const avgPrice = executedTrades.reduce((sum, trade) => sum + trade.price * trade.size, 0) / 
                     executedTrades.reduce((sum, trade) => sum + trade.size, 0);
    return ((avgPrice - bestPrice) / bestPrice * 100);
  };

  const totalExecuted = executedTrades.reduce((sum, trade) => sum + trade.size, 0);
  const avgExecutionPrice = executedTrades.length > 0 ? 
    executedTrades.reduce((sum, trade) => sum + trade.price * trade.size, 0) / totalExecuted : 0;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm my-12 w-full font-sans gap-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Market Order Execution</h3>
        <p className="text-slate-600">Adjust order size and market liquidity to see how market orders execute against the order book</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-700 mb-4">Order Parameters</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Order Size: {orderSize} tokens
                </label>
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={orderSize}
                  onChange={(e) => setOrderSize(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  disabled={isExecuting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Market Liquidity: {marketLiquidity}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="90"
                  value={marketLiquidity}
                  onChange={(e) => setMarketLiquidity(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  disabled={isExecuting}
                />
              </div>
            </div>

            <button
              onClick={executeMarketOrder}
              disabled={isExecuting}
              className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              {isExecuting ? 'Executing...' : 'Execute Market Order'}
            </button>
          </div>

          {executedTrades.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="text-lg font-semibold text-slate-700 mb-4">Execution Results</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-slate-600">Total Executed</div>
                  <div className="text-lg font-semibold text-slate-800">{totalExecuted} tokens</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-slate-600">Avg Price</div>
                  <div className="text-lg font-semibold text-slate-800">${avgExecutionPrice.toFixed(2)}</div>
                </div>
                <div className="p-3 bg-rose-50 rounded-lg">
                  <div className="text-rose-600">Slippage</div>
                  <div className="text-lg font-semibold text-rose-700">{calculateSlippage().toFixed(2)}%</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-blue-600">Best Price</div>
                  <div className="text-lg font-semibold text-blue-700">${bestPrice.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="text-lg font-semibold text-slate-700 mb-4">Order Book (Ask Side)</h4>
            <div className="space-y-2">
              {orderBook.map((order, index) => {
                const isCurrentLevel = isExecuting && index === executionStep - 1;
                const isExecuted = executionStep > index;
                const executedAtLevel = executedTrades.find(trade => trade.step === index);
                
                return (
                  <div
                    key={order.id}
                    className={`flex justify-between items-center p-3 rounded-lg border transition-all duration-500 ${
                      isCurrentLevel 
                        ? 'bg-amber-100 border-amber-300 scale-105' 
                        : isExecuted 
                        ? 'bg-emerald-50 border-emerald-200' 
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        isCurrentLevel ? 'bg-amber-500' : isExecuted ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}></div>
                      <span className="font-mono text-slate-800">${order.price.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-600 text-sm">{order.size} tokens</div>
                      {executedAtLevel && (
                        <div className="text-emerald-600 text-xs font-semibold">
                          Filled: {executedAtLevel.size}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-indigo-50 p-6 rounded-xl border border-indigo-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h5 className="font-semibold text-indigo-800 mb-2">High Liquidity</h5>
            <p className="text-indigo-600">Tight spreads, minimal slippage, execution close to best price</p>
          </div>
          <div>
            <h5 className="font-semibold text-indigo-800 mb-2">Medium Liquidity</h5>
            <p className="text-indigo-600">Moderate spreads, some slippage on larger orders</p>
          </div>
          <div>
            <h5 className="font-semibold text-indigo-800 mb-2">Low Liquidity</h5>
            <p className="text-indigo-600">Wide spreads, significant slippage, higher execution costs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
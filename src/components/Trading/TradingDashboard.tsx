import React, { useState, useEffect } from 'react';
import { tradingService } from '../../services/trading';
import { TradingPair } from '../../types';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';

const TradingDashboard: React.FC = () => {
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([]);
  const [selectedPair, setSelectedPair] = useState<TradingPair | null>(null);
  const [orderBook, setOrderBook] = useState<any>(null);
  const [tradingStats, setTradingStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTradingPairs = async () => {
      try {
        const { pairs } = await tradingService.getTradingPairs();
        setTradingPairs(pairs);
        if (pairs.length > 0) {
          setSelectedPair(pairs[0]);
        }
      } catch (error) {
        console.error('Error fetching trading pairs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTradingPairs();
  }, []);

  useEffect(() => {
    if (selectedPair) {
      const fetchPairData = async () => {
        try {
          const [orderBookData, statsData] = await Promise.all([
            tradingService.getOrderBook(selectedPair.id),
            tradingService.getTradingStats(selectedPair.id),
          ]);
          setOrderBook(orderBookData);
          setTradingStats(statsData);
        } catch (error) {
          console.error('Error fetching pair data:', error);
        }
      };

      fetchPairData();
    }
  }, [selectedPair]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Trading Dashboard</h2>
        <p className="text-gray-600">Monitor market activity and trading pairs</p>
      </div>

      {/* Trading Pairs Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trading Pairs</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tradingPairs.map((pair) => (
            <button
              key={pair.id}
              onClick={() => setSelectedPair(pair)}
              className={`p-4 border rounded-lg text-left transition-colors ${
                selectedPair?.id === pair.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">{pair.symbol}</h4>
                  <p className="text-sm text-gray-600">
                    {pair.baseCurrency?.symbol}/{pair.quoteCurrency?.symbol}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Fee: {(pair.tradingFee * 100).toFixed(2)}%</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    pair.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {pair.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedPair && (
        <>
          {/* Trading Stats */}
          {tradingStats && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                24h Statistics - {selectedPair.symbol}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Last Price</p>
                  <p className="text-xl font-bold text-gray-900">${tradingStats.lastPrice}</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">24h Change</p>
                  <div className="flex items-center justify-center">
                    {tradingStats.priceChange >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <p className={`text-xl font-bold ${
                      tradingStats.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tradingStats.priceChangePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">24h High</p>
                  <p className="text-xl font-bold text-gray-900">${tradingStats.high}</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">24h Low</p>
                  <p className="text-xl font-bold text-gray-900">${tradingStats.low}</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">24h Volume</p>
                  <p className="text-xl font-bold text-gray-900">{tradingStats.volume.toFixed(4)}</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Trades</p>
                  <p className="text-xl font-bold text-gray-900">{tradingStats.count}</p>
                </div>
              </div>
            </div>
          )}

          {/* Order Book */}
          {orderBook && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Order Book - {selectedPair.symbol}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sell Orders (Asks) */}
                <div>
                  <h4 className="font-medium text-red-600 mb-3">Sell Orders</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {orderBook.asks.length > 0 ? (
                      orderBook.asks.map((order: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                          <span className="text-sm text-gray-600">{order.amount}</span>
                          <span className="text-sm font-medium text-red-600">${order.price}</span>
                          <span className="text-sm text-gray-600">${order.totalValue.toFixed(2)}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No sell orders</p>
                    )}
                  </div>
                </div>

                {/* Buy Orders (Bids) */}
                <div>
                  <h4 className="font-medium text-green-600 mb-3">Buy Orders</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {orderBook.bids.length > 0 ? (
                      orderBook.bids.map((order: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                          <span className="text-sm text-gray-600">{order.amount}</span>
                          <span className="text-sm font-medium text-green-600">${order.price}</span>
                          <span className="text-sm text-gray-600">${order.totalValue.toFixed(2)}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No buy orders</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TradingDashboard;
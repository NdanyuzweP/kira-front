import api from './api';
import { TradingPair } from '../types';

export const tradingService = {
  async getTradingPairs(): Promise<{ pairs: TradingPair[] }> {
    const response = await api.get('/trading/pairs');
    return response.data;
  },

  async createTradingPair(pairData: {
    baseCurrencyId: number;
    quoteCurrencyId: number;
    symbol: string;
    minOrderAmount?: number;
    maxOrderAmount?: number;
    tradingFee?: number;
  }): Promise<{ message: string; pair: TradingPair }> {
    const response = await api.post('/trading/pairs', pairData);
    return response.data;
  },

  async getOrderBook(pairId: number): Promise<{ pair: TradingPair; bids: any[]; asks: any[] }> {
    const response = await api.get(`/trading/orderbook/${pairId}`);
    return response.data;
  },

  async getTradingHistory(pairId: number, limit?: number): Promise<{ trades: any[] }> {
    const response = await api.get(`/trading/history/${pairId}`, { params: { limit } });
    return response.data;
  },

  async getTradingStats(pairId: number): Promise<{
    pair: string;
    lastPrice: number;
    priceChange: number;
    priceChangePercent: number;
    high: number;
    low: number;
    volume: number;
    count: number;
  }> {
    const response = await api.get(`/trading/stats/${pairId}`);
    return response.data;
  },
};
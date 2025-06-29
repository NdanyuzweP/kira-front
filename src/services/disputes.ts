import api from './api';
import { Dispute } from '../types';

export const disputeService = {
  async createDispute(disputeData: {
    orderId: number;
    reason: string;
    description: string;
  }): Promise<{ message: string; dispute: Dispute }> {
    const response = await api.post('/disputes', disputeData);
    return response.data;
  },

  async getMyDisputes(): Promise<{ disputes: Dispute[] }> {
    const response = await api.get('/disputes');
    return response.data;
  },

  async getAllDisputes(params?: { status?: string }): Promise<{ disputes: Dispute[] }> {
    const response = await api.get('/disputes/all', { params });
    return response.data;
  },

  async resolveDispute(id: number, resolution: string): Promise<{ message: string; dispute: Dispute }> {
    const response = await api.patch(`/disputes/${id}/resolve`, { resolution });
    return response.data;
  },

  async closeDispute(id: number): Promise<{ message: string; dispute: Dispute }> {
    const response = await api.patch(`/disputes/${id}/close`);
    return response.data;
  },
};
import api from './api';
import { PaymentMethod } from '../types';

export const paymentService = {
  async getPaymentMethods(): Promise<{ paymentMethods: PaymentMethod[] }> {
    const response = await api.get('/payments/methods');
    return response.data;
  },

  async createPaymentMethod(paymentData: {
    name: string;
    type: 'bank_transfer' | 'paypal' | 'crypto' | 'mobile_money' | 'cash';
    details: any;
  }): Promise<{ message: string; paymentMethod: PaymentMethod }> {
    const response = await api.post('/payments/methods', paymentData);
    return response.data;
  },

  async updatePaymentMethod(id: number, paymentData: { name?: string; details?: any }): Promise<{ message: string; paymentMethod: PaymentMethod }> {
    const response = await api.put(`/payments/methods/${id}`, paymentData);
    return response.data;
  },

  async deletePaymentMethod(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/payments/methods/${id}`);
    return response.data;
  },
};
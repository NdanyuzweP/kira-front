import api from './api';
import { Message, SendMessageRequest } from '../types';

export const messageService = {
  async sendMessage(messageData: SendMessageRequest): Promise<{ message: string; data: Message }> {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  async getMessages(params?: { orderId?: number; withUserId?: number }): Promise<{ messages: Message[] }> {
    const response = await api.get('/messages', { params });
    return response.data;
  },

  async markAsRead(messageId: number): Promise<{ message: string }> {
    const response = await api.patch(`/messages/${messageId}/read`);
    return response.data;
  },

  async getConversations(): Promise<{ conversations: any[] }> {
    const response = await api.get('/messages/conversations');
    return response.data;
  },
};
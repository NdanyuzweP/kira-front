import api from './api';
import { KYC, KYCSubmissionRequest } from '../types';

export const kycService = {
  async submitKYC(kycData: KYCSubmissionRequest, files: {
    documentFront: File;
    documentBack?: File;
    selfie: File;
  }): Promise<{ message: string; kyc: any }> {
    const formData = new FormData();
    
    // Add text fields
    Object.entries(kycData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // Add files
    formData.append('documentFront', files.documentFront);
    if (files.documentBack) {
      formData.append('documentBack', files.documentBack);
    }
    formData.append('selfie', files.selfie);
    
    const response = await api.post('/kyc/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getKYCStatus(): Promise<{ status: string; level: number; rejectionReason?: string; verifiedAt?: string; expiresAt?: string }> {
    const response = await api.get('/kyc/status');
    return response.data;
  },

  async getPendingKYCs(): Promise<{ kycs: KYC[] }> {
    const response = await api.get('/kyc/pending');
    return response.data;
  },

  async reviewKYC(id: number, reviewData: { status: 'approved' | 'rejected'; rejectionReason?: string; level?: number }): Promise<{ message: string; kyc: KYC }> {
    const response = await api.patch(`/kyc/${id}/review`, reviewData);
    return response.data;
  },
};
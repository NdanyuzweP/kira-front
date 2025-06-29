import React, { useState, useEffect } from 'react';
import { kycService } from '../../services/kyc';
import { KYCSubmissionRequest } from '../../types';
import { Upload, FileText, Camera, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const KYCVerification: React.FC = () => {
  const [kycStatus, setKycStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<KYCSubmissionRequest>({
    documentType: 'passport',
    documentNumber: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [files, setFiles] = useState<{
    documentFront: File | null;
    documentBack: File | null;
    selfie: File | null;
  }>({
    documentFront: null,
    documentBack: null,
    selfie: null,
  });

  useEffect(() => {
    const fetchKYCStatus = async () => {
      try {
        const status = await kycService.getKYCStatus();
        setKycStatus(status);
      } catch (error) {
        console.error('Error fetching KYC status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKYCStatus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: keyof typeof files) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles({
        ...files,
        [fileType]: file,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!files.documentFront || !files.selfie) {
      toast.error('Please upload required documents');
      return;
    }

    setSubmitting(true);
    try {
      await kycService.submitKYC(formData, {
        documentFront: files.documentFront,
        documentBack: files.documentBack || undefined,
        selfie: files.selfie,
      });
      
      toast.success('KYC verification submitted successfully!');
      
      // Refresh status
      const status = await kycService.getKYCStatus();
      setKycStatus(status);
    } catch (error) {
      console.error('Error submitting KYC:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-8 w-8 text-red-500" />;
      case 'pending':
        return <Clock className="h-8 w-8 text-yellow-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show status if KYC exists
  if (kycStatus && kycStatus.status !== 'not_submitted') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-6">
            {getStatusIcon(kycStatus.status)}
            <h2 className="text-xl font-semibold text-gray-900 mt-4">KYC Verification Status</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(kycStatus.status)}`}>
                {kycStatus.status.toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Verification Level</span>
              <span className="text-blue-600 font-semibold">Level {kycStatus.level}</span>
            </div>

            {kycStatus.verifiedAt && (
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Verified At</span>
                <span className="text-gray-600">{new Date(kycStatus.verifiedAt).toLocaleDateString()}</span>
              </div>
            )}

            {kycStatus.expiresAt && (
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Expires At</span>
                <span className="text-gray-600">{new Date(kycStatus.expiresAt).toLocaleDateString()}</span>
              </div>
            )}

            {kycStatus.rejectionReason && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Rejection Reason</h4>
                <p className="text-red-700">{kycStatus.rejectionReason}</p>
              </div>
            )}
          </div>

          {kycStatus.status === 'rejected' && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setKycStatus({ status: 'not_submitted' })}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit New Application
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show submission form
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-6">
          <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">KYC Verification</h2>
          <p className="text-gray-600">Complete your identity verification to unlock full platform features</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Document Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="passport">Passport</option>
              <option value="id_card">ID Card</option>
              <option value="driving_license">Driving License</option>
            </select>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Number</label>
            <input
              type="text"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* File Uploads */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Document Upload</h3>
            
            {/* Document Front */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Front Side *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, 'documentFront')}
                  className="hidden"
                  id="documentFront"
                  required
                />
                <label htmlFor="documentFront" className="cursor-pointer flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {files.documentFront ? files.documentFront.name : 'Click to upload document front'}
                  </span>
                </label>
              </div>
            </div>

            {/* Document Back */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Back Side (if applicable)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, 'documentBack')}
                  className="hidden"
                  id="documentBack"
                />
                <label htmlFor="documentBack" className="cursor-pointer flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {files.documentBack ? files.documentBack.name : 'Click to upload document back'}
                  </span>
                </label>
              </div>
            </div>

            {/* Selfie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selfie with Document *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'selfie')}
                  className="hidden"
                  id="selfie"
                  required
                />
                <label htmlFor="selfie" className="cursor-pointer flex flex-col items-center">
                  <Camera className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {files.selfie ? files.selfie.name : 'Click to upload selfie'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Important Notes:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Ensure all documents are clear and readable</li>
              <li>• Photos should be well-lit with no glare</li>
              <li>• All information must match your official documents</li>
              <li>• Processing time: 1-3 business days</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit KYC Verification'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default KYCVerification;
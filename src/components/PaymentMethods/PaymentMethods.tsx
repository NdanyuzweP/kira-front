import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/payments';
import { PaymentMethod } from '../../types';
import { CreditCard, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentMethods: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'bank_transfer' as PaymentMethod['type'],
    details: {},
  });

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const { paymentMethods } = await paymentService.getPaymentMethods();
        setPaymentMethods(paymentMethods);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('details.')) {
      const detailKey = name.replace('details.', '');
      setFormData({
        ...formData,
        details: {
          ...formData.details,
          [detailKey]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingMethod) {
        await paymentService.updatePaymentMethod(editingMethod.id, {
          name: formData.name,
          details: formData.details,
        });
        toast.success('Payment method updated successfully');
      } else {
        await paymentService.createPaymentMethod(formData);
        toast.success('Payment method created successfully');
      }

      // Refresh payment methods
      const { paymentMethods } = await paymentService.getPaymentMethods();
      setPaymentMethods(paymentMethods);
      
      // Reset form
      setFormData({ name: '', type: 'bank_transfer', details: {} });
      setShowCreateForm(false);
      setEditingMethod(null);
    } catch (error) {
      console.error('Error saving payment method:', error);
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      name: method.name,
      type: method.type,
      details: method.details,
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (methodId: number) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;
    
    try {
      await paymentService.deletePaymentMethod(methodId);
      toast.success('Payment method deleted successfully');
      
      // Refresh payment methods
      const { paymentMethods } = await paymentService.getPaymentMethods();
      setPaymentMethods(paymentMethods);
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'bank_transfer':
        return '🏦';
      case 'paypal':
        return '💳';
      case 'crypto':
        return '₿';
      case 'mobile_money':
        return '📱';
      case 'cash':
        return '💵';
      default:
        return '💳';
    }
  };

  const getPaymentTypeFields = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'bank_transfer':
        return [
          { key: 'bankName', label: 'Bank Name', type: 'text' },
          { key: 'accountNumber', label: 'Account Number', type: 'text' },
          { key: 'accountName', label: 'Account Name', type: 'text' },
          { key: 'routingNumber', label: 'Routing Number', type: 'text' },
        ];
      case 'paypal':
        return [
          { key: 'email', label: 'PayPal Email', type: 'email' },
        ];
      case 'crypto':
        return [
          { key: 'address', label: 'Wallet Address', type: 'text' },
          { key: 'network', label: 'Network', type: 'text' },
        ];
      case 'mobile_money':
        return [
          { key: 'provider', label: 'Provider', type: 'text' },
          { key: 'phoneNumber', label: 'Phone Number', type: 'tel' },
        ];
      case 'cash':
        return [
          { key: 'location', label: 'Preferred Location', type: 'text' },
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
          <p className="text-gray-600">Manage your payment methods for trading</p>
        </div>
        
        <button
          onClick={() => {
            setShowCreateForm(true);
            setEditingMethod(null);
            setFormData({ name: '', type: 'bank_transfer', details: {} });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </button>
      </div>

      {/* Payment Methods List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {paymentMethods.length > 0 ? (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">
                        {getPaymentTypeIcon(method.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{method.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {method.type.replace('_', ' ')}
                        </p>
                        <div className="flex items-center mt-1">
                          {method.isVerified ? (
                            <span className="flex items-center text-green-600 text-sm">
                              <Check className="h-4 w-4 mr-1" />
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center text-yellow-600 text-sm">
                              <X className="h-4 w-4 mr-1" />
                              Pending Verification
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(method)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(method.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    {Object.entries(method.details).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}: 
                        </span>
                        <span className="text-gray-600 ml-1">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No payment methods found</p>
              <p className="text-sm text-gray-400 mt-1">Add a payment method to start trading</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Payment Method Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., My Bank Account"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!!editingMethod}
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              {/* Dynamic fields based on payment type */}
              {getPaymentTypeFields(formData.type).map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={`details.${field.key}`}
                    value={(formData.details as any)[field.key] || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingMethod ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingMethod(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
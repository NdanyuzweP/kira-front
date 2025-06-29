import React, { useState, useEffect } from 'react';
import { disputeService } from '../../services/disputes';
import { orderService } from '../../services/orders';
import { Dispute, Order } from '../../types';
import { AlertTriangle, Plus, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const DisputeCenter: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    reason: '',
    description: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [disputesData, ordersData] = await Promise.all([
          disputeService.getMyDisputes(),
          orderService.getMyOrders({ status: 'confirmed' }),
        ]);
        setDisputes(disputesData.disputes);
        setOrders(ordersData.orders);
      } catch (error) {
        console.error('Error fetching disputes data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await disputeService.createDispute({
        orderId: parseInt(formData.orderId),
        reason: formData.reason,
        description: formData.description,
      });

      toast.success('Dispute created successfully');
      setShowCreateForm(false);
      setFormData({ orderId: '', reason: '', description: '' });
      
      // Refresh disputes
      const disputesData = await disputeService.getMyDisputes();
      setDisputes(disputesData.disputes);
    } catch (error) {
      console.error('Error creating dispute:', error);
    }
  };

  const handleCloseDispute = async (disputeId: number) => {
    try {
      await disputeService.closeDispute(disputeId);
      toast.success('Dispute closed successfully');
      
      // Refresh disputes
      const disputesData = await disputeService.getMyDisputes();
      setDisputes(disputesData.disputes);
    } catch (error) {
      console.error('Error closing dispute:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'in_review':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'closed':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_review':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Dispute Center</h2>
          <p className="text-gray-600">Manage order disputes and resolutions</p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Dispute
        </button>
      </div>

      {/* Disputes List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {disputes.length > 0 ? (
            <div className="space-y-4">
              {disputes.map((dispute) => (
                <div key={dispute.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Dispute #{dispute.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Order #{dispute.orderId} • Created {new Date(dispute.createdAt!).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(dispute.status)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(dispute.status)}`}>
                        {dispute.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div>
                      <span className="font-medium text-gray-700">Reason: </span>
                      <span className="text-gray-600">{dispute.reason}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Description: </span>
                      <span className="text-gray-600">{dispute.description}</span>
                    </div>
                  </div>

                  {dispute.resolution && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <h4 className="font-medium text-green-800 mb-1">Resolution</h4>
                      <p className="text-green-700">{dispute.resolution}</p>
                      {dispute.resolvedAt && (
                        <p className="text-sm text-green-600 mt-1">
                          Resolved on {new Date(dispute.resolvedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {dispute.status === 'open' && (
                      <button
                        onClick={() => handleCloseDispute(dispute.id)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                      >
                        Close Dispute
                      </button>
                    )}
                    
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      View Messages
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No disputes found</p>
              <p className="text-sm text-gray-400 mt-1">Create a dispute if you have issues with an order</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Dispute Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Dispute</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <select
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Order</option>
                  {orders.map((order) => (
                    <option key={order.id} value={order.id}>
                      Order #{order.id} - {order.currency?.symbol} {order.amount}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief reason for dispute"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Detailed description of the issue"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Create Dispute
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
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

export default DisputeCenter;
import React, { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, X, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface ExchangeRequest {
  id: string;
  order_id: string;
  email: string;
  phone: string;
  reason: string;
  description: string;
  video_url: string | null;
  status: string;
  created_at: string;
  admin_notes: string | null;
}

export default function AdminExchanges() {
  const [exchanges, setExchanges] = useState<ExchangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedExchange, setSelectedExchange] = useState<ExchangeRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    try {
      const { data, error } = await supabase
        .from('exchange_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setExchanges(data || []);
    } catch (error) {
      console.error('Error fetching exchanges:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateExchangeStatus = async (exchangeId: string, newStatus: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('exchange_requests')
        .update({ 
          status: newStatus,
          admin_notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', exchangeId);
      
      if (error) throw error;
      fetchExchanges();
      setSelectedExchange(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error updating exchange status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredExchanges = exchanges.filter(exchange => {
    const matchesSearch = 
      exchange.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exchange.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exchange.phone.includes(searchTerm);
    const matchesStatus = !statusFilter || exchange.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading exchange requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Exchanges</h1>
          <p className="text-gray-600">Review and process exchange requests</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by Order ID, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Exchanges Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExchanges.map((exchange) => (
                  <tr key={exchange.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{exchange.order_id.slice(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{exchange.email}</div>
                        <div className="text-sm text-gray-500">{exchange.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {exchange.reason.replace('-', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exchange.status)}`}>
                        {exchange.status.charAt(0).toUpperCase() + exchange.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(exchange.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedExchange(exchange)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {exchange.video_url && (
                          <a
                            href={exchange.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Video className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredExchanges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No exchange requests found.</p>
          </div>
        )}

        {/* Exchange Details Modal */}
        {selectedExchange && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Exchange Request Details
                </h2>
                <button
                  onClick={() => setSelectedExchange(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Order ID</p>
                    <p className="text-sm text-gray-900">#{selectedExchange.order_id.slice(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedExchange.status)}`}>
                      {selectedExchange.status.charAt(0).toUpperCase() + selectedExchange.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer Email</p>
                    <p className="text-sm text-gray-900">{selectedExchange.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{selectedExchange.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reason</p>
                    <p className="text-sm text-gray-900 capitalize">
                      {selectedExchange.reason.replace('-', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Request Date</p>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedExchange.created_at).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {selectedExchange.description}
                  </p>
                </div>

                {selectedExchange.video_url && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Video Proof</p>
                    <video
                      controls
                      className="w-full max-h-64 rounded-lg"
                      src={selectedExchange.video_url}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {selectedExchange.admin_notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Admin Notes</p>
                    <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded-lg">
                      {selectedExchange.admin_notes}
                    </p>
                  </div>
                )}

                {selectedExchange.status === 'pending' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Admin Notes (Optional)
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Add notes for the customer..."
                    />
                  </div>
                )}

                {selectedExchange.status === 'pending' && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => updateExchangeStatus(selectedExchange.id, 'approved', adminNotes)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => updateExchangeStatus(selectedExchange.id, 'rejected', adminNotes)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
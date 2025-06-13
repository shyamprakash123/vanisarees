import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Package, Truck, CheckCircle, X, CreditCard, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/Admin/AdminLayout';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  email: string;
  phone: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_id: string | null;
  tracking_id: string | null;
  delivery_charges: number;
  cod_charges: number;
  discount_amount: number;
  coupon_code: string | null;
  shipping_address: any;
  items: any[];
  created_at: string;
  updated_at: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingId, setTrackingId] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (error) throw error;
      toast.success('Order status updated successfully');
      fetchOrders();
      
      // Update selected order if it's the one being updated
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const updateTrackingId = async (orderId: string, newTrackingId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          tracking_id: newTrackingId,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (error) throw error;
      toast.success('Tracking ID updated successfully');
      fetchOrders();
      
      // Update selected order if it's the one being updated
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, tracking_id: newTrackingId } : null);
      }
    } catch (error) {
      console.error('Error updating tracking ID:', error);
      toast.error('Failed to update tracking ID');
    }
  };

  const verifyPayment = async (orderId: string) => {
    try {
      // In a real app, you would verify payment with your payment gateway
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (error) throw error;
      toast.success('Payment verified successfully');
      fetchOrders();
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: 'paid' } : null);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Failed to verify payment');
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (error) throw error;
      toast.success('Order cancelled successfully');
      fetchOrders();
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: 'cancelled' } : null);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Package className="w-4 h-4 text-yellow-500" />;
      case 'confirmed':
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    return method === 'cod' ? <Banknote className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm);
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateSubtotal = (order: Order) => {
    return order.total_amount - order.delivery_charges - order.cod_charges + order.discount_amount;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
            <p className="text-gray-600">View and manage customer orders</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6">
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
                <option value="confirmed">Confirmed</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
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
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
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
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.id.slice(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.email}</div>
                        <div className="text-sm text-gray-500">{order.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{order.total_amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {getPaymentMethodIcon(order.payment_method)}
                        <span className="text-sm text-gray-900">
                          {order.payment_method === 'cod' ? 'COD' : 'Prepaid'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="paid">Paid</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No orders found.</p>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order Details - #{selectedOrder.id.slice(0, 8)}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Order Status & Payment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Order Status</h3>
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(selectedOrder.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Last updated: {new Date(selectedOrder.updated_at).toLocaleString('en-IN')}
                    </p>
                    
                    {/* Status Update */}
                    <div className="mt-3">
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Payment Method:</span>
                        <div className="flex items-center space-x-1">
                          {getPaymentMethodIcon(selectedOrder.payment_method)}
                          <span className="font-medium">
                            {selectedOrder.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                          </span>
                        </div>
                      </div>
                      {selectedOrder.payment_id && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Payment ID:</span>
                          <span className="font-medium text-sm">{selectedOrder.payment_id}</span>
                        </div>
                      )}
                      
                      {/* Payment Actions */}
                      <div className="mt-3 space-y-2">
                        {selectedOrder.payment_method === 'prepaid' && selectedOrder.status === 'pending' && (
                          <button
                            onClick={() => verifyPayment(selectedOrder.id)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-300"
                          >
                            Verify Payment
                          </button>
                        )}
                        {['pending', 'confirmed'].includes(selectedOrder.status) && (
                          <button
                            onClick={() => cancelOrder(selectedOrder.id)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-300"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Information */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Tracking Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={trackingId || selectedOrder.tracking_id || ''}
                        onChange={(e) => setTrackingId(e.target.value)}
                        placeholder="Enter tracking ID"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <button
                        onClick={() => {
                          updateTrackingId(selectedOrder.id, trackingId || '');
                          setTrackingId('');
                        }}
                        className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-sm text-primary-600 font-medium">₹{item.price.toLocaleString()} each</p>
                        </div>
                        <p className="font-semibold text-lg">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Price Breakdown</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Subtotal</span>
                        <span className="font-medium">₹{calculateSubtotal(selectedOrder).toLocaleString()}</span>
                      </div>
                      
                      {selectedOrder.delivery_charges > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Delivery Charges</span>
                          <span className="font-medium">₹{selectedOrder.delivery_charges.toLocaleString()}</span>
                        </div>
                      )}
                      
                      {selectedOrder.cod_charges > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">COD Charges</span>
                          <span className="font-medium">₹{selectedOrder.cod_charges.toLocaleString()}</span>
                        </div>
                      )}
                      
                      {selectedOrder.discount_amount > 0 && (
                        <div className="flex justify-between items-center text-green-600">
                          <span>Discount {selectedOrder.coupon_code && `(${selectedOrder.coupon_code})`}</span>
                          <span className="font-medium">-₹{selectedOrder.discount_amount.toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span>Total Amount</span>
                          <span className="text-primary-600">₹{selectedOrder.total_amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shipping_address && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-700">
                        <p className="font-medium">{selectedOrder.shipping_address.firstName} {selectedOrder.shipping_address.lastName}</p>
                        <p>{selectedOrder.shipping_address.address}</p>
                        <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.pincode}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
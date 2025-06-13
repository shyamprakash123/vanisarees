import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface Order {
  id: string;
  email: string;
  phone: string;
  total_amount: number;
  status: string;
  payment_id: string | null;
  tracking_id: string | null;
  created_at: string;
  updated_at: string;
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [contact, setContact] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .or(`email.eq.${contact},phone.eq.${contact}`)
        .single();

      if (error || !data) {
        setError('Order not found. Please check your Order ID and contact information.');
        return;
      }

      setOrder(data);
    } catch (error) {
      setError('Error tracking order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'paid':
      case 'confirmed':
        return <CheckCircle className="w-6 h-6 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-purple-500" />;
      case 'delivered':
        return <Package className="w-6 h-6 text-green-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'paid':
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const orderStatuses = [
    { key: 'pending', label: 'Order Placed', description: 'Your order has been received' },
    { key: 'confirmed', label: 'Confirmed', description: 'Order confirmed and being prepared' },
    { key: 'shipped', label: 'Shipped', description: 'Your order is on the way' },
    { key: 'delivered', label: 'Delivered', description: 'Order delivered successfully' }
  ];

  const getCurrentStatusIndex = (status: string) => {
    const statusMap: { [key: string]: number } = {
      'pending': 0,
      'paid': 0,
      'confirmed': 1,
      'shipped': 2,
      'delivered': 3
    };
    return statusMap[status] ?? 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Order</h1>
            <p className="text-gray-600">
              Enter your Order ID and email/phone number to track your order status
            </p>
          </div>

          {/* Track Order Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID *
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your order ID"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email or Phone Number *
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter email or phone number"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Track Order</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Order Details */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="border-b pb-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Order ID</p>
                    <p className="font-medium">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Order Date</p>
                    <p className="font-medium">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="font-medium text-lg">₹{order.total_amount.toLocaleString()}</p>
                  </div>
                  {order.tracking_id && (
                    <div>
                      <p className="text-gray-600">Tracking ID</p>
                      <p className="font-medium">{order.tracking_id}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Status Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h3>
                <div className="space-y-4">
                  {orderStatuses.map((statusItem, index) => {
                    const currentIndex = getCurrentStatusIndex(order.status);
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    
                    return (
                      <div key={statusItem.key} className="flex items-center">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-primary-100 text-primary-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {getStatusIcon(statusItem.key)}
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <div className="flex items-center">
                            <h4 className={`font-medium ${
                              isCompleted ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {statusItem.label}
                            </h4>
                            {isCurrent && (
                              <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-600 text-xs rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${
                            isCompleted ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {statusItem.description}
                          </p>
                        </div>
                        
                        {isCompleted && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contact Support */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  If you have any questions about your order, feel free to contact us.
                </p>
                <div className="flex space-x-4">
                  <a
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=Hi, I need help with my order ${order.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                  >
                    WhatsApp Support
                  </a>
                  <a
                    href={`mailto:${import.meta.env.VITE_ADMIN_EMAIL}?subject=Order Support - ${order.id}`}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                  >
                    Email Support
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
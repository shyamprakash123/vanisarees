import React, { useState, useEffect } from 'react';
import { Package, Eye, X, Truck, CheckCircle, Clock, AlertCircle, CreditCard, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_method: string;
  delivery_charges: number;
  cod_charges: number;
  discount_amount: number;
  coupon_code: string | null;
  created_at: string;
  updated_at: string;
  items: any[];
  shipping_address: any;
  tracking_id: string | null;
  payment_id: string | null;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);
      
      if (error) throw error;
      
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <Package className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
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

  const getPaymentMethodLabel = (method: string) => {
    return method === 'cod' ? 'Cash on Delivery' : 'Online Payment';
  };

  const canCancelOrder = (order: Order) => {
    return ['pending', 'confirmed', 'paid'].includes(order.status);
  };

  const calculateSubtotal = (order: Order) => {
    return order.total_amount - order.delivery_charges - order.cod_charges + order.discount_amount;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-8">You need to sign in to view your orders.</p>
          <Link
            to="/login"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-8">Start shopping to see your orders here.</p>
            <Link
              to="/products"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Order #{order.id.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-semibold text-lg">₹{order.total_amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <div className="flex items-center space-x-1">
                      {getPaymentMethodIcon(order.payment_method)}
                      <p className="font-medium">{getPaymentMethodLabel(order.payment_method)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Items</p>
                    <p className="font-medium">{order.items?.length || 0} items</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount to Pay</p>
                    <p className="font-semibold text-lg text-primary-600">
                      ₹{order.total_amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    <Link
                      to={`/track-order?id=${order.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      Track Order
                    </Link>
                    {order.tracking_id && (
                      <span className="text-sm text-gray-600">
                        Tracking: {order.tracking_id}
                      </span>
                    )}
                  </div>
                  
                  {canCancelOrder(order) && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Enhanced Order Details Modal */}
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
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Payment Method:</span>
                        <div className="flex items-center space-x-1">
                          {getPaymentMethodIcon(selectedOrder.payment_method)}
                          <span className="font-medium">{getPaymentMethodLabel(selectedOrder.payment_method)}</span>
                        </div>
                      </div>
                      {selectedOrder.payment_id && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Payment ID:</span>
                          <span className="font-medium text-sm">{selectedOrder.payment_id}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Order Type:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedOrder.payment_method === 'cod' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {selectedOrder.payment_method === 'cod' ? 'Cash on Delivery' : 'Prepaid'}
                        </span>
                      </div>
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

                {/* Enhanced Price Breakdown */}
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
                          <span className="text-gray-700 flex items-center">
                            <Truck className="w-4 h-4 mr-1" />
                            Delivery Charges
                          </span>
                          <span className="font-medium">₹{selectedOrder.delivery_charges.toLocaleString()}</span>
                        </div>
                      )}
                      
                      {selectedOrder.cod_charges > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 flex items-center">
                            <Banknote className="w-4 h-4 mr-1" />
                            COD Charges
                          </span>
                          <span className="font-medium">₹{selectedOrder.cod_charges.toLocaleString()}</span>
                        </div>
                      )}
                      
                      {selectedOrder.discount_amount > 0 && (
                        <div className="flex justify-between items-center text-green-600">
                          <span className="flex items-center">
                            Discount {selectedOrder.coupon_code && `(${selectedOrder.coupon_code})`}
                          </span>
                          <span className="font-medium">-₹{selectedOrder.discount_amount.toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span>Total Amount</span>
                          <span className="text-primary-600">₹{selectedOrder.total_amount.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Amount to Pay Section */}
                      <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-primary-800">
                            {selectedOrder.payment_method === 'cod' ? 'Amount to Pay on Delivery:' : 'Amount Paid:'}
                          </span>
                          <span className="text-xl font-bold text-primary-600">
                            ₹{selectedOrder.total_amount.toLocaleString()}
                          </span>
                        </div>
                        {selectedOrder.payment_method === 'cod' && selectedOrder.status !== 'delivered' && (
                          <p className="text-sm text-primary-700 mt-1">
                            Please keep exact change ready for delivery
                          </p>
                        )}
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

                {/* Actions */}
                <div className="flex space-x-3">
                  <Link
                    to={`/track-order?id=${selectedOrder.id}`}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium text-center transition-colors duration-300"
                  >
                    Track Order
                  </Link>
                  {canCancelOrder(selectedOrder) && (
                    <button
                      onClick={() => {
                        cancelOrder(selectedOrder.id);
                        setSelectedOrder(null);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
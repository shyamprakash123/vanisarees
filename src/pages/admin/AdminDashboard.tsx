import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  DollarSign,
  Eye,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingExchanges: number;
  recentOrders: any[];
  topProducts: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingExchanges: 0,
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch orders
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch products
      const { data: products } = await supabase
        .from('products')
        .select('*');

      // Fetch exchange requests
      const { data: exchanges } = await supabase
        .from('exchange_requests')
        .select('*')
        .eq('status', 'pending');

      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const totalProducts = products?.length || 0;
      const pendingExchanges = exchanges?.length || 0;
      const recentOrders = orders?.slice(0, 5) || [];

      setStats({
        totalOrders,
        totalRevenue,
        totalProducts,
        pendingExchanges,
        recentOrders,
        topProducts: products?.slice(0, 5) || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-purple-500',
      change: '+3%'
    },
    {
      title: 'Pending Exchanges',
      value: stats.pendingExchanges,
      icon: RefreshCw,
      color: 'bg-orange-500',
      change: '-2%'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change} from last month</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <Link
                to="/admin/orders"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">#{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-600">{order.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{order.total_amount.toLocaleString()}</p>
                    <p className={`text-sm capitalize ${
                      order.status === 'delivered' ? 'text-green-600' :
                      order.status === 'shipped' ? 'text-blue-600' :
                      order.status === 'pending' ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/admin/products"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-center"
              >
                <Package className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Manage Products</p>
              </Link>
              
              <Link
                to="/admin/orders"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-center"
              >
                <ShoppingBag className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">View Orders</p>
              </Link>
              
              <Link
                to="/admin/exchanges"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-center"
              >
                <RefreshCw className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Exchanges</p>
              </Link>
              
              <Link
                to="/admin/analytics"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-center"
              >
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Analytics</p>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Alerts */}
        {stats.pendingExchanges > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-4"
          >
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
              <p className="text-orange-800">
                You have {stats.pendingExchanges} pending exchange request{stats.pendingExchanges > 1 ? 's' : ''} that need attention.
              </p>
              <Link
                to="/admin/exchanges"
                className="ml-auto text-orange-600 hover:text-orange-700 font-medium"
              >
                Review Now
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
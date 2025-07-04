import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Tag, Calendar, Percent, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/Admin/AdminLayout';
import toast from 'react-hot-toast';

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount: number | null;
  min_products: number;
  max_products: number | null;
  max_order_value: number | null;
  usage_limit: number | null;
  max_usage_per_user: number | null;
  used_count: number;
  active: boolean;
  expires_at: string | null;
  created_at: string;
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 0,
    min_order_amount: 0,
    max_discount: '',
    min_products: 1,
    max_products: '',
    max_order_value: '',
    usage_limit: '',
    max_usage_per_user: '',
    expires_at: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['discount_value', 'min_order_amount', 'min_products'].includes(name) 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_order_amount: 0,
      max_discount: '',
      min_products: 1,
      max_products: '',
      max_order_value: '',
      usage_limit: '',
      max_usage_per_user: '',
      expires_at: ''
    });
    setShowAddModal(false);
    setEditingCoupon(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const couponData = {
        code: formData.code.toUpperCase(),
        discount_type: formData.discount_type,
        discount_value: formData.discount_value,
        min_order_amount: formData.min_order_amount,
        max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
        min_products: formData.min_products,
        max_products: formData.max_products ? parseInt(formData.max_products) : null,
        max_order_value: formData.max_order_value ? parseFloat(formData.max_order_value) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        max_usage_per_user: formData.max_usage_per_user ? parseInt(formData.max_usage_per_user) : null,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
        active: true
      };

      if (editingCoupon) {
        const { error } = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', editingCoupon.id);
        
        if (error) throw error;
        toast.success('Coupon updated successfully');
      } else {
        const { error } = await supabase
          .from('coupons')
          .insert(couponData);
        
        if (error) throw error;
        toast.success('Coupon created successfully');
      }

      fetchCoupons();
      resetForm();
    } catch (error: any) {
      console.error('Error saving coupon:', error);
      toast.error(error.message || 'Failed to save coupon');
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_amount: coupon.min_order_amount,
      max_discount: coupon.max_discount?.toString() || '',
      min_products: coupon.min_products || 1,
      max_products: coupon.max_products?.toString() || '',
      max_order_value: coupon.max_order_value?.toString() || '',
      usage_limit: coupon.usage_limit?.toString() || '',
      max_usage_per_user: coupon.max_usage_per_user?.toString() || '',
      expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().split('T')[0] : ''
    });
    setShowAddModal(true);
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (error: any) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon');
    }
  };

  const toggleCouponStatus = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ active: !active })
        .eq('id', id);
      
      if (error) throw error;
      toast.success(`Coupon ${!active ? 'activated' : 'deactivated'} successfully`);
      fetchCoupons();
    } catch (error: any) {
      console.error('Error updating coupon status:', error);
      toast.error('Failed to update coupon status');
    }
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading coupons...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Manage Coupons</h1>
            <p className="text-gray-600">Create and manage discount coupon codes</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Coupon</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conditions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 text-primary-600 mr-2" />
                        <span className="font-mono font-semibold text-gray-900">
                          {coupon.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {coupon.discount_type === 'percentage' ? (
                          <Percent className="w-4 h-4 text-green-600 mr-1" />
                        ) : (
                          <span className="text-green-600 mr-1">₹</span>
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          {coupon.discount_value}
                          {coupon.discount_type === 'percentage' ? '%' : ''}
                        </span>
                        {coupon.max_discount && coupon.discount_type === 'percentage' && (
                          <span className="text-xs text-gray-500 ml-1">
                            (max ₹{coupon.max_discount})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Min: ₹{coupon.min_order_amount.toLocaleString()}</div>
                        <div>Products: {coupon.min_products}{coupon.max_products && ` - ${coupon.max_products}`}</div>
                        {coupon.max_order_value && (
                          <div>Max: ₹{coupon.max_order_value.toLocaleString()}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{coupon.used_count}{coupon.usage_limit && ` / ${coupon.usage_limit}`}</div>
                        {coupon.max_usage_per_user && (
                          <div className="text-xs text-gray-500">Max per user: {coupon.max_usage_per_user}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.expires_at ? (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                          <span className={`text-sm ${
                            isExpired(coupon.expires_at) ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {new Date(coupon.expires_at).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No expiry</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          coupon.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {coupon.active ? 'Active' : 'Inactive'}
                        </span>
                        {isExpired(coupon.expires_at) && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Expired
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleCouponStatus(coupon.id, coupon.active)}
                          className={`${
                            coupon.active ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {coupon.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteCoupon(coupon.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredCoupons.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No coupons found.</p>
          </div>
        )}

        {/* Add/Edit Coupon Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Coupon Code *
                      </label>
                      <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                        placeholder="SAVE20"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Type *
                      </label>
                      <select
                        name="discount_type"
                        value={formData.discount_type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Value *
                      </label>
                      <input
                        type="number"
                        name="discount_value"
                        value={formData.discount_value}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={formData.discount_type === 'percentage' ? '20' : '500'}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Order Amount
                      </label>
                      <input
                        type="number"
                        name="min_order_amount"
                        value={formData.min_order_amount}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    {formData.discount_type === 'percentage' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Discount Amount
                        </label>
                        <input
                          type="number"
                          name="max_discount"
                          value={formData.max_discount}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="1000"
                          min="0"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Order Value
                      </label>
                      <input
                        type="number"
                        name="max_order_value"
                        value={formData.max_order_value}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="50000"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Products
                      </label>
                      <input
                        type="number"
                        name="min_products"
                        value={formData.min_products}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="1"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Products
                      </label>
                      <input
                        type="number"
                        name="max_products"
                        value={formData.max_products}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="10"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Usage Limit
                      </label>
                      <input
                        type="number"
                        name="usage_limit"
                        value={formData.usage_limit}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="100"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Usage Per User
                      </label>
                      <input
                        type="number"
                        name="max_usage_per_user"
                        value={formData.max_usage_per_user}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="1"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        name="expires_at"
                        value={formData.expires_at}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300"
                    >
                      {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-semibold transition-colors duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Package, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/Admin/AdminLayout';
import toast from 'react-hot-toast';

interface Combo {
  id: string;
  name: string;
  description: string | null;
  product_ids: string[];
  combo_price: number;
  image_url: string | null;
  active: boolean;
  created_at: string;
  products?: {
    id: string;
    name: string;
    price: number;
    images: string[];
  }[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
}

export default function AdminCombos() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    product_ids: [] as string[],
    combo_price: 0,
    image_url: '',
    active: true
  });

  useEffect(() => {
    fetchCombos();
    fetchProducts();
  }, []);

  const fetchCombos = async () => {
    try {
      const { data, error } = await supabase
        .from('combos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Fetch product details for each combo
      const combosWithProducts = await Promise.all(
        (data || []).map(async (combo) => {
          const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, name, price, images')
            .in('id', combo.product_ids);
          
          if (productsError) throw productsError;
          
          return { ...combo, products };
        })
      );

      setCombos(combosWithProducts);
    } catch (error) {
      console.error('Error fetching combos:', error);
      toast.error('Failed to fetch combos');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, images')
        .order('name');
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: name === 'combo_price' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleProductSelection = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      product_ids: prev.product_ids.includes(productId)
        ? prev.product_ids.filter(id => id !== productId)
        : [...prev.product_ids, productId]
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      product_ids: [],
      combo_price: 0,
      image_url: '',
      active: true
    });
    setShowAddModal(false);
    setEditingCombo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.product_ids.length < 2) {
      toast.error('Please select at least 2 products for the combo');
      return;
    }

    try {
      const comboData = {
        name: formData.name,
        description: formData.description || null,
        product_ids: formData.product_ids,
        combo_price: formData.combo_price,
        image_url: formData.image_url || null,
        active: formData.active
      };

      if (editingCombo) {
        const { error } = await supabase
          .from('combos')
          .update(comboData)
          .eq('id', editingCombo.id);
        
        if (error) throw error;
        toast.success('Combo updated successfully');
      } else {
        const { error } = await supabase
          .from('combos')
          .insert(comboData);
        
        if (error) throw error;
        toast.success('Combo created successfully');
      }

      fetchCombos();
      resetForm();
    } catch (error: any) {
      console.error('Error saving combo:', error);
      toast.error(error.message || 'Failed to save combo');
    }
  };

  const handleEdit = (combo: Combo) => {
    setEditingCombo(combo);
    setFormData({
      name: combo.name,
      description: combo.description || '',
      product_ids: combo.product_ids,
      combo_price: combo.combo_price,
      image_url: combo.image_url || '',
      active: combo.active
    });
    setShowAddModal(true);
  };

  const deleteCombo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this combo?')) return;

    try {
      const { error } = await supabase
        .from('combos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Combo deleted successfully');
      fetchCombos();
    } catch (error: any) {
      console.error('Error deleting combo:', error);
      toast.error('Failed to delete combo');
    }
  };

  const toggleComboStatus = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('combos')
        .update({ active: !active })
        .eq('id', id);
      
      if (error) throw error;
      toast.success(`Combo ${!active ? 'activated' : 'deactivated'} successfully`);
      fetchCombos();
    } catch (error: any) {
      console.error('Error updating combo status:', error);
      toast.error('Failed to update combo status');
    }
  };

  const getComboProducts = (productIds: string[]) => {
    return products.filter(product => productIds.includes(product.id));
  };

  const getOriginalPrice = (productIds: string[]) => {
    const comboProducts = getComboProducts(productIds);
    return comboProducts.reduce((total, product) => total + product.price, 0);
  };

  const filteredCombos = combos.filter(combo =>
    combo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading combos...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Manage Combos</h1>
            <p className="text-gray-600">Create and manage product combo offers</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Combo</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search combos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Combos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCombos.map((combo) => {
            const comboProducts = getComboProducts(combo.product_ids);
            const originalPrice = getOriginalPrice(combo.product_ids);
            const savings = originalPrice - combo.combo_price;
            const savingsPercentage = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

            return (
              <motion.div
                key={combo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={combo.image_url || comboProducts[0]?.images[0] || 'https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=600'}
                    alt={combo.name}
                    className="w-full h-48 object-cover"
                  />
                  
                  {savingsPercentage > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      Save {savingsPercentage}%
                    </div>
                  )}
                  
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-sm font-medium ${
                    combo.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {combo.active ? 'Active' : 'Inactive'}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{combo.name}</h3>
                  {combo.description && (
                    <p className="text-sm text-gray-600 mb-3">{combo.description}</p>
                  )}

                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Includes ({comboProducts.length} items):</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {comboProducts.map((product) => (
                        <li key={product.id} className="flex items-center">
                          <div className="w-2 h-2 bg-primary-400 rounded-full mr-2"></div>
                          {product.name}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Original Price:</span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{originalPrice.toLocaleString()}
                      </span>
                    </div>
                    {savings > 0 && (
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-green-600 font-semibold">You Save:</span>
                        <span className="text-sm text-green-600 font-semibold">
                          ₹{savings.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-gray-900">Combo Price:</span>
                      <span className="text-xl font-bold text-primary-600">
                        ₹{combo.combo_price.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(combo)}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-300"
                      >
                        <Edit className="w-4 h-4 inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => toggleComboStatus(combo.id, combo.active)}
                        className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors duration-300 ${
                          combo.active
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {combo.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => deleteCombo(combo.id)}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredCombos.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No combos found.</p>
          </div>
        )}

        {/* Add/Edit Combo Modal */}
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
                    {editingCombo ? 'Edit Combo' : 'Add New Combo'}
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
                        Combo Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Combo Price *
                      </label>
                      <input
                        type="number"
                        name="combo_price"
                        value={formData.combo_price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Combo Image URL
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Products * (minimum 2)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4">
                      {products.map((product) => (
                        <label key={product.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            checked={formData.product_ids.includes(product.id)}
                            onChange={() => handleProductSelection(product.id)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <img
                            src={product.images[0] || 'https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=600'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600">₹{product.price.toLocaleString()}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Selected: {formData.product_ids.length} products
                    </p>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Active Combo
                    </label>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300"
                    >
                      {editingCombo ? 'Update Combo' : 'Create Combo'}
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
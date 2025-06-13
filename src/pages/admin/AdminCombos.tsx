import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface Combo {
  id: string;
  name: string;
  description: string | null;
  product_ids: string[];
  combo_price: number;
  image_url: string | null;
  active: boolean;
  created_at: string;
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
      setCombos(data || []);
    } catch (error) {
      console.error('Error fetching combos:', error);
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

  const deleteCombo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this combo?')) return;

    try {
      const { error } = await supabase
        .from('combos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchCombos();
    } catch (error) {
      console.error('Error deleting combo:', error);
    }
  };

  const toggleComboStatus = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('combos')
        .update({ active: !active })
        .eq('id', id);
      
      if (error) throw error;
      fetchCombos();
    } catch (error) {
      console.error('Error updating combo status:', error);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading combos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                    Save {savingsPercentage}%
                  </div>
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
                    <p className="text-sm font-medium text-gray-700 mb-1">Includes:</p>
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
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-gray-900">Combo Price:</span>
                      <span className="text-xl font-bold text-primary-600">
                        ₹{combo.combo_price.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingCombo(combo)}
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
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { supabase } from '../../lib/supabase';

interface Combo {
  id: string;
  name: string;
  description: string | null;
  product_ids: string[];
  combo_price: number;
  image_url: string | null;
  active: boolean;
  products?: {
    id: string;
    name: string;
    price: number;
    images: string[];
  }[];
}

export default function ComboSection() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    try {
      const { data: combosData, error: combosError } = await supabase
        .from('combos')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (combosError) throw combosError;

      // Fetch product details for each combo
      const combosWithProducts = await Promise.all(
        combosData.map(async (combo) => {
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
    } finally {
      setLoading(false);
    }
  };

  const handleAddComboToCart = (combo: Combo) => {
    // Add combo as a single item with all products included
    addItem({
      id: `combo-${combo.id}`,
      name: combo.name,
      price: combo.combo_price,
      image: combo.image_url || combo.products?.[0]?.images[0] || '/placeholder-combo.jpg'
    });
  };

  const calculateOriginalPrice = (combo: Combo) => {
    return combo.products?.reduce((total, product) => total + product.price, 0) || 0;
  };

  const getSavingsAmount = (combo: Combo) => {
    const originalPrice = calculateOriginalPrice(combo);
    return originalPrice - combo.combo_price;
  };

  const getSavingsPercentage = (combo: Combo) => {
    const originalPrice = calculateOriginalPrice(combo);
    if (originalPrice === 0) return 0;
    return Math.round(((originalPrice - combo.combo_price) / originalPrice) * 100);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Combo Offers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (combos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-primary-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Combo Offers
            </h2>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get more value with our specially curated combo packages. 
            Perfect sarees paired with matching accessories.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {combos.map((combo, index) => {
            const originalPrice = calculateOriginalPrice(combo);
            const savings = getSavingsAmount(combo);
            const savingsPercentage = getSavingsPercentage(combo);

            return (
              <motion.div
                key={combo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {/* Combo Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={combo.image_url || combo.products?.[0]?.images[0] || 'https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=600'}
                    alt={combo.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Savings Badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Save {savingsPercentage}%
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {combo.name}
                  </h3>
                  
                  {combo.description && (
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {combo.description}
                    </p>
                  )}

                  {/* Product List */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Includes:</h4>
                    <ul className="space-y-1">
                      {combo.products?.map((product) => (
                        <li key={product.id} className="text-sm text-gray-600 flex items-center">
                          <div className="w-2 h-2 bg-primary-400 rounded-full mr-2"></div>
                          {product.name}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Original Price:</span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-green-600 font-semibold">You Save:</span>
                      <span className="text-sm text-green-600 font-semibold">
                        ₹{savings.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-gray-900">Combo Price:</span>
                      <span className="text-2xl font-bold text-primary-600">
                        ₹{combo.combo_price.toLocaleString()}
                      </span>
                    </div>

                    <motion.button
                      onClick={() => handleAddComboToCart(combo)}
                      className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add Combo to Cart</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="/combos"
            className="inline-block bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            View All Combos
          </a>
        </motion.div>
      </div>
    </section>
  );
}
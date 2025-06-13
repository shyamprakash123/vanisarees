import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: number;
  slug: string;
  description?: string | null;
  images: string[];
}

interface Combo {
  id: string;
  name: string;
  description: string | null;
  product_ids: string[];
  combo_price: number;
  image_url: string | null;
  products?: Product[];
}

export default function ComboDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [combo, setCombo] = useState<Combo | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    fetchComboDetail();
  }, [id]);

  const fetchComboDetail = async () => {
    setLoading(true);
    try {
      const { data: comboData, error: comboError } = await supabase
        .from('combos')
        .select('*')
        .eq('id', id)
        .single();

      if (comboError) throw comboError;

      const { data: products, error: productError } = await supabase
        .from('products')
        .select('id, name, price, description, images, slug')
        .in('id', comboData.product_ids);

      if (productError) throw productError;

      setCombo({ ...comboData, products });
    } catch (error) {
      console.error('Error loading combo details:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateOriginalPrice = () =>
    combo?.products?.reduce((total, p) => total + p.price, 0) || 0;

  const getSavingsAmount = () =>
    calculateOriginalPrice() - (combo?.combo_price || 0);

  const getSavingsPercentage = () => {
    const original = calculateOriginalPrice();
    return original ? Math.round(((original - (combo?.combo_price || 0)) / original) * 100) : 0;
  };

  const handleAddToCart = () => {
    if (!combo) return;
    addItem({
      id: `combo-${combo.id}`,
      name: combo.name,
      price: combo.combo_price,
      image: combo.image_url || combo.products?.[0]?.images[0] || '/placeholder-combo.jpg'
    });
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">Loading combo details...</div>
    );
  }

  if (!combo) {
    return (
      <div className="py-20 text-center text-red-500">Combo not found.</div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Combo Image */}
          <img
            src={combo.image_url || combo.products?.[0]?.images[0] || '/placeholder-combo.jpg'}
            alt={combo.name}
            className="w-full rounded-xl shadow-md object-cover"
          />

          {/* Combo Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{combo.name}</h1>
            {combo.description && (
              <p className="text-gray-700 mb-4">{combo.description}</p>
            )}

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Includes:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {combo.products?.map(p => (
                  <li key={p.id}>{p.name} (₹{p.price.toLocaleString()})</li>
                ))}
              </ul>
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Original Price:</span>
                <span className="line-through">₹{calculateOriginalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>You Save:</span>
                <span className="text-green-600 font-semibold">
                  ₹{getSavingsAmount().toLocaleString()} ({getSavingsPercentage()}%)
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Combo Price:</span>
                <span className="text-primary-600">₹{combo.combo_price.toLocaleString()}</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add Combo to Cart
            </motion.button>
          </div>
        </div>

        {/* === Product Details Section === */}
        <div className="mt-12 border-t pt-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Products in this Combo</h2>
          <div className="space-y-10">
            {combo.products?.map((product) => (
              <Link key={product.id} to={`/products/${product.slug}`} className="border group rounded-lg p-4 flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <div className="w-full md:w-1/3">
                  <img
                    src={product.images?.[0] || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-auto object-cover rounded-lg shadow"
                  />
                </div>

                {/* Product Info */}
                <div className="w-full md:w-2/3">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary-500">{product.name}</h3>
                  {product.description && (
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  )}
                  <div className="text-sm text-gray-700 font-medium">
                    Price: <span className="text-primary-600 font-bold">₹{product.price.toLocaleString()}</span>
                  </div>

                  {/* Thumbnails */}
                  {product.images?.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-auto">
                      {product.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`thumb-${i}`}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

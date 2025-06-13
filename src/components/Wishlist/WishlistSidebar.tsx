import React from 'react';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';

export default function WishlistSidebar() {
  const { state, removeItem, clearWishlist, toggleWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();

  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      slug: item.slug
    });
    removeItem(item.id);
  };

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={toggleWishlist}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-bold text-gray-900">
                  Wishlist ({state.items.length})
                </h2>
              </div>
              <button
                onClick={toggleWishlist}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Wishlist Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {state.items.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Your wishlist is empty</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Save your favorite sarees here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <Link to={`/products/${item.slug}`} 
                          onClick={toggleWishlist}
                          className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 hover:text-primary-500">
                            {item.name}
                          </Link>
                          <p className="text-primary-600 font-bold">
                            ₹{item.price.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <motion.button
                            onClick={() => handleMoveToCart(item)}
                            className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            title="Move to Cart"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            onClick={() => removeItem(item.id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            title="Remove from Wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {state.items.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={clearWishlist}
                        className="text-sm text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        Clear wishlist
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {state.items.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-3">
                <button
                  onClick={() => {
                    state.items.forEach(item => handleMoveToCart(item));
                  }}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Move All to Cart</span>
                </button>
                
                <button
                  onClick={toggleWishlist}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors duration-300"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
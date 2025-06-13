import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function CartSidebar() {
  const { state, removeItem, updateQuantity, clearCart, toggleCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (state.items.length === 0) {
      alert('Your cart is empty. Please add some items before checkout.');
      return;
    }
    
    // Close the cart sidebar
    toggleCart();
    
    // Navigate to checkout page
    navigate('/checkout');
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
            onClick={toggleCart}
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
                <ShoppingBag className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Shopping Cart ({state.items.length})
                </h2>
              </div>
              <button
                onClick={toggleCart}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {state.items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Add some beautiful sarees to get started
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
                           className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 hover:text-primary-500"
                           onClick={toggleCart}
                           >
                            {item.name}
                          </Link>
                          <p className="text-primary-600 font-bold">
                            ₹{item.price.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {state.items.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={clearCart}
                        className="text-sm text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        Clear all items
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer with Total and Checkout */}
            {state.items.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ₹{state.total.toLocaleString()}
                  </span>
                </div>
                
                <motion.button
                  onClick={handleCheckout}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Checkout
                </motion.button>
                
                <button
                  onClick={toggleCart}
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
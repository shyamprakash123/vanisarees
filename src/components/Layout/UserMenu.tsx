import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Package, Heart, Settings, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link
          to="/login"
          className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-primary-600" />
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-64 bg-white shadow-xl rounded-xl py-2 border border-gray-100 z-50"
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">
                {user.user_metadata?.first_name || 'User'}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <div className="py-2">
              <Link
                to="/orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <Package className="w-4 h-4 mr-3" />
                My Orders
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <Heart className="w-4 h-4 mr-3" />
                Wishlist
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <Settings className="w-4 h-4 mr-3" />
                Profile Settings
              </Link>
            </div>

            <div className="border-t border-gray-100 py-2">
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
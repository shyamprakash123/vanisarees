import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Heart, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import UserMenu from './UserMenu';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  images: string[];
}

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdminPath = location.pathname.startsWith('/admin');
  const isAdmin = user?.app_metadata?.role === "admin";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { state: cartState, toggleCart } = useCart();
  const { state: wishlistState, toggleWishlist } = useWishlist();

  useEffect(() => {
    fetchCategories();

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm.trim()) {
        performSearch(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, slug, price, sale_price, images')
        .ilike('name', `%${query}%`)
        .limit(5);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setIsSearchOpen(false);
      setSearchTerm('');
      setSearchResults([]);
    }
  };

  const handleProductClick = (slug: string) => {
    navigate(`/products/${slug}`);
    setIsSearchOpen(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  if (isAdmin && isAdminPath) {
    return null;
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
      ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
      : 'bg-white shadow-md'
      }`}>
      {/* Top Navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                VaniSarees
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Authentic Traditional Wear</p>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <motion.div
              className="text-gray-700 hover:text-primary-600 transition-all duration-200 font-medium relative group"
              whileHover={{ y: -2 }}
            >
              <Link to="/">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </motion.div>

            {/* Categories Dropdown */}
            <div className="relative">
              <motion.button
                className="text-gray-700 hover:text-primary-600 transition-all duration-200 font-medium flex items-center space-x-1 relative group"
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
                whileHover={{ y: -2 }}
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300"></span>
              </motion.button>

              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-xl py-4 border border-gray-100"
                    onMouseEnter={() => setIsCategoriesOpen(true)}
                    onMouseLeave={() => setIsCategoriesOpen(false)}
                  >
                    <div className="px-4 pb-2 mb-2 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900">Shop by Category</h3>
                    </div>
                    {categories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600 transition-all duration-200 group"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link to={`/category/${category.slug}`}>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                            <span className="font-medium">{category.name}</span>
                          </div>
                        </Link>

                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              className="text-gray-700 hover:text-primary-600 transition-all duration-200 font-medium relative group"
              whileHover={{ y: -2 }}
            >
              <Link to="/combos">
                Combos
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </motion.div>
            <motion.div
              className="text-gray-700 hover:text-primary-600 transition-all duration-200 font-medium relative group"
              whileHover={{ y: -2 }}
            >
              <Link to="/about">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </motion.div>
            <motion.div
              className="text-gray-700 hover:text-primary-600 transition-all duration-200 font-medium relative group"
              whileHover={{ y: -2 }}
            >
              <Link to="/contact">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </motion.div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Toggle */}
            <motion.button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Wishlist */}
            <motion.button
              onClick={toggleWishlist}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all duration-200 relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="w-5 h-5" />
              {wishlistState.items.length > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-secondary-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {wishlistState.items.length}
                </motion.span>
              )}
            </motion.button>

            {/* Cart */}
            <motion.button
              onClick={toggleCart}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all duration-200 relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartState.items.length > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-secondary-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {cartState.items.length}
                </motion.span>
              )}
            </motion.button>

            {/* User Menu */}
            <UserMenu />

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 relative"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search for beautiful sarees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <motion.button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Search
                </motion.button>
              </form>

              {/* Search Results */}
              {(searchResults.length > 0 || isSearching) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg mt-2 max-h-96 overflow-y-auto z-50"
                >
                  {isSearching ? (
                    <div className="p-4 text-center">
                      <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-gray-600">Searching...</p>
                    </div>
                  ) : (
                    <>
                      {searchResults.map((product) => (
                        <motion.div
                          key={product.id}
                          onClick={() => handleProductClick(product.slug)}
                          className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          whileHover={{ backgroundColor: '#f9fafb' }}
                        >
                          <img
                            src={product.images[0] || 'https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=100'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 line-clamp-1">{product.name}</h4>
                            <div className="flex items-center space-x-2">
                              {product.sale_price ? (
                                <>
                                  <span className="text-primary-600 font-semibold">₹{product.sale_price.toLocaleString()}</span>
                                  <span className="text-gray-500 line-through text-sm">₹{product.price.toLocaleString()}</span>
                                </>
                              ) : (
                                <span className="text-primary-600 font-semibold">₹{product.price.toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {searchTerm && (
                        <div className="p-3 border-t border-gray-200">
                          <button
                            onClick={() => handleSearchSubmit(new Event('submit') as any)}
                            className="w-full text-left text-primary-600 hover:text-primary-700 font-medium"
                          >
                            View all results for "{searchTerm}"
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 bg-gradient-to-br from-gray-50 to-primary-50 rounded-xl p-6 border border-gray-100"
            >
              <div className="space-y-4">
                <Link
                  to="/"
                  className="block text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium py-2"
                >
                  Home
                </Link>

                <div>
                  <h3 className="text-gray-900 font-semibold mb-3 text-sm uppercase tracking-wide">Categories</h3>
                  <div className="space-y-2 ml-4">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${category.slug}`}
                        className="block text-gray-600 hover:text-primary-600 transition-colors duration-200 py-1"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  to="/combos"
                  className="block text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium py-2"
                >
                  Combos
                </Link>
                <Link
                  to="/about"
                  className="block text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium py-2"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="block text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium py-2"
                >
                  Contact
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Eye, Star, Sparkles, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  images: string[];
  category_id: string;
  video_url?: string; // Optional video URL
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [videoDelayTimeout, setVideoDelayTimeout] = useState<NodeJS.Timeout | null>(null);
  const { addItem } = useCart();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist();

  // Sample video URLs for demonstration
  const sampleVideos = [
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://www.youtube.com/embed/9bZkp7q19f0',
    'https://www.youtube.com/embed/kJQP7kiw5Fk',
    'https://www.youtube.com/embed/tgbNymZ7vqY',
    'https://www.youtube.com/embed/60ItHLz5WEA'
  ];

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(8)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Add sample video URLs to products for demonstration
      const productsWithVideos = (data || []).map((product, index) => ({
        ...product,
        video_url: sampleVideos[index % sampleVideos.length]
      }));
      
      setProducts(productsWithVideos);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.sale_price || product.price,
      image: product.images[0] || '/placeholder-saree.jpg'
    });
  };

  const handleToggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.sale_price || product.price,
        image: product.images[0] || '/placeholder-saree.jpg'
      });
    }
  };

  const handleMouseEnter = (productId: string) => {
    // Clear any existing timeout
    if (videoDelayTimeout) {
      clearTimeout(videoDelayTimeout);
    }
    
    // Set a 2-second delay before showing video
    const timeout = setTimeout(() => {
      setHoveredProduct(productId);
    }, 2000);
    
    setVideoDelayTimeout(timeout);
  };

  const handleMouseLeave = () => {
    // Clear timeout and hide video immediately
    if (videoDelayTimeout) {
      clearTimeout(videoDelayTimeout);
      setVideoDelayTimeout(null);
    }
    setHoveredProduct(null);
  };

  const getDiscountPercentage = (originalPrice: number, salePrice: number) => {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="w-16 h-8 bg-gray-300 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="w-64 h-10 bg-gray-300 rounded mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                <div className="w-full h-64 bg-gray-300 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-secondary-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-secondary-200/30 to-accent-200/30 rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-200/30 to-secondary-200/30 rounded-full blur-3xl translate-x-48 translate-y-48"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-primary-500 mr-3" />
            <span className="text-primary-600 font-semibold text-lg tracking-wide uppercase">
              Handpicked Collection
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Featured{' '}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Sarees
            </span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Discover our handpicked collection of exquisite sarees,
            crafted with traditional techniques and modern elegance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
              onMouseEnter={() => handleMouseEnter(product.id)}
              onMouseLeave={handleMouseLeave}
            >
              <Link to={`/products/${product.slug}`} className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="relative overflow-hidden h-64">
                  {/* Product Image */}
                  <img
                    src={product.images[0] || 'https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=600'}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      hoveredProduct === product.id ? 'opacity-0 scale-110' : 'opacity-100 group-hover:scale-110'
                    }`}
                  />

                  {/* Video Overlay */}
                  {hoveredProduct === product.id && product.video_url && (
                    <div className="absolute inset-0 bg-black">
                      <iframe
                        src={`${product.video_url}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1`}
                        className="w-full h-full object-cover"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title={`${product.name} video`}
                      />
                    </div>
                  )}

                  {/* Video Play Icon (shown when not hovered) */}
                  {product.video_url && hoveredProduct !== product.id && (
                    <div className="absolute top-2 left-2 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Play className="w-4 h-4" />
                    </div>
                  )}

                  {/* Discount Badge */}
                  {product.sale_price && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {getDiscountPercentage(product.price, product.sale_price)}% OFF
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleToggleWishlist(product);
                      }}
                      className={`p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 ${isInWishlist(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
                        }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Heart className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Quick Add to Cart */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      className="w-full bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 py-2 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </motion.button>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
                    {product.name}
                  </h3>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">(4.0)</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {product.sale_price ? (
                      <>
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                          ₹{product.sale_price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.price.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        ₹{product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Decorative Element */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-secondary-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.a
            href="/products"
            className="inline-flex items-center bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View All Products</span>
            <Sparkles className="w-5 h-5 ml-2" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
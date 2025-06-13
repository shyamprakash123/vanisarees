import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Play, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  images: string[];
  video_url?: string;
  stock_quantity: number;
  categories?: {
    name: string;
  };
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: boolean;
  viewMode: 'grid' | 'list';
}

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  viewMode
}: ProductCardProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [videoDelayTimeout, setVideoDelayTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (videoDelayTimeout) {
      clearTimeout(videoDelayTimeout);
    }
    
    const timeout = setTimeout(() => {
      setHoveredProduct(product.id);
    }, 2000);
    
    setVideoDelayTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (videoDelayTimeout) {
      clearTimeout(videoDelayTimeout);
      setVideoDelayTimeout(null);
    }
    setHoveredProduct(null);
  };

  const getDiscountPercentage = (originalPrice: number, salePrice: number) => {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group ${
        viewMode === 'list' ? 'flex' : ''
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
        {/* Product Image */}
        <img
          src={product.images[0] || 'https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=600'}
          alt={product.name}
          className={`w-full object-cover transition-all duration-700 ${
            viewMode === 'list' ? 'h-full' : 'h-64'
          } ${hoveredProduct === product.id ? 'opacity-0' : 'opacity-100'}`}
        />

        {/* Video Overlay */}
        {hoveredProduct === product.id && product.video_url && (
          <div className={`absolute inset-0 bg-black ${viewMode === 'list' ? 'h-full' : ''}`}>
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

        {/* Video Play Icon */}
        {product.video_url && hoveredProduct !== product.id && (
          <div className="absolute top-2 left-2 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Play className="w-4 h-4" />
          </div>
        )}
        
        {/* Discount Badge */}
        {product.sale_price && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
            {getDiscountPercentage(product.price, product.sale_price)}% OFF
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            onClick={() => onToggleWishlist(product)}
            className={`p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 ${
              isInWishlist
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className="w-4 h-4" />
          </motion.button>
          
          <Link
            to={`/products/${product.slug}`}
            className="p-2 bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-full shadow-lg transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Stock Status */}
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors duration-200">
            {product.name}
          </h3>
        </Link>
        
        {product.categories && (
          <p className="text-sm text-gray-500 mb-2">{product.categories.name}</p>
        )}

        {/* Rating */}
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-500 ml-2">(4.0)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {product.sale_price ? (
              <>
                <span className="text-lg font-bold text-primary-600">
                  ₹{product.sale_price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary-600">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>
          
          {product.stock_quantity === 0 && (
            <span className="text-sm text-red-500 font-medium">Out of Stock</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`flex gap-2 ${viewMode === 'list' ? 'flex-col' : ''}`}>
          <motion.button
            onClick={() => onAddToCart(product)}
            disabled={product.stock_quantity === 0}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </motion.button>
          
          <Link
            to={`/products/${product.slug}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold transition-colors duration-300 text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
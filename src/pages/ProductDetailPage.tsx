import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, ShoppingCart, Share2, Star, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, ZoomIn, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import ImageZoom from '../components/UI/ImageZoom';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  images: string[];
  category_id: string;
  stock_quantity: number;
  featured: boolean;
  video_url?: string;
  categories?: {
    name: string;
  };
}

interface SuggestedProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<SuggestedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist();

  // Sample multiple images for demonstration
  const sampleImages = [
    'https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/8553879/pexels-photo-8553879.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/8553881/pexels-photo-8553881.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/8553883/pexels-photo-8553883.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/8553884/pexels-photo-8553884.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  // Sample video URLs for demonstration
  const sampleVideoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      
      // Add sample images and video to the product for demonstration
      const productWithMedia = {
        ...data,
        images: data.images.length > 0 ? [...data.images, ...sampleImages.slice(1)] : sampleImages,
        video_url: sampleVideoUrl
      };
      
      setProduct(productWithMedia);
      
      // Fetch suggested products from same category
      if (data.category_id) {
        fetchSuggestedProducts(data.category_id, data.id);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestedProducts = async (categoryId: string, currentProductId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, images')
        .eq('category_id', categoryId)
        .neq('id', currentProductId)
        .limit(4);
      
      if (error) throw error;
      setSuggestedProducts(data || []);
    } catch (error) {
      console.error('Error fetching suggested products:', error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.sale_price || product.price,
        image: product.images[0] || '/placeholder-saree.jpg'
      });
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    
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

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const getDiscountPercentage = (originalPrice: number, salePrice: number) => {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-300 rounded-lg h-96 animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded w-1/3 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <a
            href="/products"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
          >
            Browse All Products
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li><a href="/" className="text-gray-500 hover:text-primary-600">Home</a></li>
            <li><span className="text-gray-400">/</span></li>
            <li><a href="/products" className="text-gray-500 hover:text-primary-600">Products</a></li>
            <li><span className="text-gray-400">/</span></li>
            <li><span className="text-gray-900">{product.name}</span></li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image/Video */}
            <div className="relative bg-white rounded-lg overflow-hidden shadow-lg group">
              {showVideo && product.video_url ? (
                <div className="relative w-full h-96">
                  <iframe
                    src={`${product.video_url}?autoplay=1&controls=1&showinfo=0&rel=0`}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={`${product.name} video`}
                  />
                  <button
                    onClick={() => setShowVideo(false)}
                    className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <img
                    src={product.images[currentImageIndex] || sampleImages[0]}
                    alt={product.name}
                    className="w-full h-96 object-cover cursor-zoom-in"
                    onClick={() => setIsZoomOpen(true)}
                  />
                  
                  {/* Video Play Button */}
                  {product.video_url && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className="absolute top-4 left-4 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-all duration-200 flex items-center space-x-2"
                    >
                      <Play className="w-5 h-5" />
                      <span className="text-sm font-medium">Watch Video</span>
                    </button>
                  )}
                  
                  {/* Zoom Icon */}
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ZoomIn className="w-5 h-5 text-gray-700" />
                  </div>
                  
                  {product.sale_price && (
                    <div className="absolute top-4 right-16 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {getDiscountPercentage(product.price, product.sale_price)}% OFF
                    </div>
                  )}

                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.slice(0, 5).map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setShowVideo(false);
                    }}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentImageIndex && !showVideo
                        ? 'border-primary-500 ring-2 ring-primary-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === currentImageIndex && !showVideo && (
                      <div className="absolute inset-0 bg-primary-500/20"></div>
                    )}
                  </motion.button>
                ))}
                
                {/* Video Thumbnail */}
                {product.video_url && (
                  <motion.button
                    onClick={() => setShowVideo(true)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 bg-black flex items-center justify-center ${
                      showVideo
                        ? 'border-primary-500 ring-2 ring-primary-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-6 h-6 text-white" />
                    {showVideo && (
                      <div className="absolute inset-0 bg-primary-500/20"></div>
                    )}
                  </motion.button>
                )}
                
                {/* Show more indicator if there are more than 5 images */}
                {product.images.length > 5 && (
                  <div className="aspect-square rounded-lg border-2 border-gray-200 flex items-center justify-center bg-gray-100 text-gray-500 text-sm font-medium">
                    +{product.images.length - 5}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              {product.categories && (
                <p className="text-lg text-gray-600">{product.categories.name}</p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">(4.0) • 127 reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              {product.sale_price ? (
                <>
                  <span className="text-3xl font-bold text-primary-600">
                    ₹{product.sale_price.toLocaleString()}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                    Save ₹{(product.price - product.sale_price).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-primary-600">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div>
              {product.stock_quantity > 0 ? (
                <span className="text-green-600 font-semibold">
                  ✓ In Stock ({product.stock_quantity} available)
                </span>
              ) : (
                <span className="text-red-600 font-semibold">✗ Out of Stock</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
              <div className="flex space-x-2">
                {['Free Size', 'S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg font-medium transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <motion.button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </motion.button>

              <motion.button
                onClick={handleToggleWishlist}
                className={`p-3 border rounded-lg transition-all duration-300 ${
                  isInWishlist(product.id)
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-5 h-5" />
              </motion.button>

              <motion.button
                className="p-3 border border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Truck className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Free Shipping</p>
                    <p className="text-sm text-gray-600">On orders above ₹5000</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Easy Returns</p>
                    <p className="text-sm text-gray-600">7-day return policy</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Secure Payment</p>
                    <p className="text-sm text-gray-600">100% secure checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Products */}
        {suggestedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedProducts.map((suggestedProduct) => (
                <motion.div
                  key={suggestedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={suggestedProduct.images[0] || sampleImages[0]}
                    alt={suggestedProduct.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {suggestedProduct.name}
                    </h3>
                    <p className="text-lg font-bold text-primary-600">
                      ₹{suggestedProduct.price.toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Image Zoom Modal */}
        <ImageZoom
          src={product.images[currentImageIndex] || sampleImages[0]}
          alt={product.name}
          isOpen={isZoomOpen}
          onClose={() => setIsZoomOpen(false)}
        />
      </div>
    </div>
  );
}
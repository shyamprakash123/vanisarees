import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface SlideContent {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  order_index: number;
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<SlideContent[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0 || isVideoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length, isVideoPlaying]);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('active', true)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setSlides(data);
      } else {
        // Fallback to default slides if no data
        setSlides([
          {
            id: '1',
            type: 'image',
            url: 'https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
            title: 'Exquisite Silk Sarees',
            subtitle: 'Discover our premium collection of traditional silk sarees',
            button_text: 'Shop Silk Collection',
            button_link: '/category/silk-sarees',
            order_index: 1
          },
          {
            id: '2',
            type: 'image',
            url: 'https://images.pexels.com/photos/8553879/pexels-photo-8553879.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
            title: 'Bridal Elegance',
            subtitle: 'Perfect sarees for your special day',
            button_text: 'Explore Bridal Wear',
            button_link: '/category/wedding-sarees',
            order_index: 2
          },
          {
            id: '3',
            type: 'video',
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            title: 'See Our Sarees in Motion',
            subtitle: 'Watch how beautifully our sarees drape',
            button_text: 'View Collection',
            button_link: '/products',
            order_index: 3
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      // Use fallback slides on error
      setSlides([
        {
          id: '1',
          type: 'image',
          url: 'https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
          title: 'Exquisite Silk Sarees',
          subtitle: 'Discover our premium collection of traditional silk sarees',
          button_text: 'Shop Silk Collection',
          button_link: '/category/silk-sarees',
          order_index: 1
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsVideoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsVideoPlaying(false);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsVideoPlaying(false);
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoClose = () => {
    setIsVideoPlaying(false);
  };

  if (loading || slides.length === 0) {
    return (
      <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {currentSlideData.type === 'image' ? (
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${currentSlideData.url})` }}
            >
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ) : (
            <div className="w-full h-full relative">
              {!isVideoPlaying ? (
                <>
                  <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)` }}
                  >
                    <div className="absolute inset-0 bg-black/50" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      onClick={handleVideoPlay}
                      className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-6 text-white hover:bg-white/30 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="w-12 h-12" />
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full relative">
                  <iframe
                    src={`${currentSlideData.url}?autoplay=1&controls=1&showinfo=0&rel=0&modestbranding=1`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={currentSlideData.title}
                    className="w-full h-full"
                  />
                  <button
                    onClick={handleVideoClose}
                    className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors duration-200 z-10"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay - Hide when video is playing */}
      {!isVideoPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <motion.h1
              key={`title-${currentSlide}`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
            >
              {currentSlideData.title}
            </motion.h1>
            
            <motion.p
              key={`subtitle-${currentSlide}`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-200"
            >
              {currentSlideData.subtitle}
            </motion.p>
            
            <motion.div
              key={`button-${currentSlide}`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {currentSlideData.type === 'video' ? (
                <button
                  onClick={handleVideoPlay}
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  {currentSlideData.button_text}
                </button>
              ) : (
                <a
                  href={currentSlideData.button_link}
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  {currentSlideData.button_text}
                </a>
              )}
            </motion.div>
          </div>
        </div>
      )}

      {/* Navigation Arrows - Hide when video is playing */}
      {!isVideoPlaying && slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm border border-white/30 text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm border border-white/30 text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Slide Indicators - Hide when video is playing */}
      {!isVideoPlaying && slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
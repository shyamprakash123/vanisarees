import React from 'react';
import HeroSlider from '../components/Home/HeroSlider';
import CategoriesSection from '../components/Home/CategoriesSection';
import FeaturedProducts from '../components/Home/FeaturedProducts';
import ComboSection from '../components/Home/ComboSection';
import TestimonialsSection from '../components/Home/TestimonialsSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      <HeroSlider />
      <CategoriesSection />
      <FeaturedProducts />
      <ComboSection />
      <TestimonialsSection />
    </div>
  );
}
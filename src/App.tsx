import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';

// Layout Components
import Header from './components/Layout/Header';
import AnnouncementBar from './components/Layout/AnnouncementBar';
import Footer from './components/Layout/Footer';

// Home Components
import HeroSlider from './components/Home/HeroSlider';
import CategoriesSection from './components/Home/CategoriesSection';
import FeaturedProducts from './components/Home/FeaturedProducts';
import ComboSection from './components/Home/ComboSection';
import TestimonialsSection from './components/Home/TestimonialsSection';

// Sidebar Components
import CartSidebar from './components/Cart/CartSidebar';
import WishlistSidebar from './components/Wishlist/WishlistSidebar';

// Float Components
import WhatsAppFloat from './components/WhatsApp/WhatsAppFloat';

function HomePage() {
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

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <AnnouncementBar />
            <Header />
            
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                {/* Add more routes as needed */}
              </Routes>
            </main>
            
            <Footer />
            
            {/* Floating Components */}
            <WhatsAppFloat />
            
            {/* Sidebar Components */}
            <CartSidebar />
            <WishlistSidebar />
          </div>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
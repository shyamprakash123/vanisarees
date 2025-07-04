import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { AuthProvider } from './contexts/AuthContext';
import { DialogProvider } from './hooks/useDialog';

// Layout Components
import Header from './components/Layout/Header';
import AnnouncementBar from './components/Layout/AnnouncementBar';
import Footer from './components/Layout/Footer';
import LoadingSpinner from './components/UI/LoadingSpinner';
import Toast from './components/UI/Toast';

// Sidebar Components
import CartSidebar from './components/Cart/CartSidebar';
import WishlistSidebar from './components/Wishlist/WishlistSidebar';

// Float Components
import AdminLayout from './components/Admin/AdminLayout';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfService';
import ExchangePolicyPage from './pages/ExchangePolicy';
import ShippingPolicyPage from './pages/ShippingPolicy';
import ReturnRefundPolicyPage from './pages/ReturnsAndRefunds';
import ScrollToTop from './components/Layout/ScrollToTop';
import FAQPage from './pages/FAQ';
import CombosPage from './pages/CombosPage';
import CategoriesPage from './pages/CategoriesPage';
import ComboDetailPage from './pages/ComboDetailPage';

// Lazy load pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const CartPage = React.lazy(() => import('./pages/CartPage'));
const WishlistPage = React.lazy(() => import('./pages/WishlistPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = React.lazy(() => import('./pages/OrderConfirmationPage'));
const OrdersPage = React.lazy(() => import('./pages/OrdersPage'));
const TrackOrderPage = React.lazy(() => import('./pages/TrackOrderPage'));
const ExchangeRequestPage = React.lazy(() => import('./pages/ExchangeRequestPage'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminCategories = React.lazy(() => import('./pages/admin/AdminCategories'));
const AdminProducts = React.lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = React.lazy(() => import('./pages/admin/AdminOrders'));
const AdminExchanges = React.lazy(() => import('./pages/admin/AdminExchanges'));
const AdminCombos = React.lazy(() => import('./pages/admin/AdminCombos'));
const AdminAnalytics = React.lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminCoupons = React.lazy(() => import('./pages/admin/AdminCoupons'));
const AdminCustomers = React.lazy(() => import('./pages/admin/AdminCustomers'));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'));
const AdminAnnouncements = React.lazy(() => import('./pages/admin/AdminAnnouncements'));
const AdminHeroSlider = React.lazy(() => import('./pages/admin/AdminHeroSlider'));

function App() {
  return (
    <DialogProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <div className="min-h-screen bg-white">
                <AnnouncementBar />
                <Header />
                <ScrollToTop />
                
                <main>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/reset-password" element={<ResetPasswordPage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/category/:slug" element={<CategoryPage />} />
                      <Route path="/products/:slug" element={<ProductDetailPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/wishlist" element={<WishlistPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="/track-order" element={<TrackOrderPage />} />
                      <Route path="/exchange-request" element={<ExchangeRequestPage />} />
                      <Route path="/combos" element={<CombosPage />} />
                      <Route path="/categories" element={<CategoriesPage />} />
                      <Route path="/combos/:id" element={<ComboDetailPage />} />

                      
                      {/* Admin Routes */}
                      <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                      <Route path="/admin/categories" element={<AdminLayout><AdminCategories /></AdminLayout>} />
                      <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
                      <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
                      <Route path="/admin/exchanges" element={<AdminLayout><AdminExchanges /></AdminLayout>} />
                      <Route path="/admin/combos" element={<AdminLayout><AdminCombos /></AdminLayout>} />
                      <Route path="/admin/analytics" element={<AdminLayout><AdminAnalytics /></AdminLayout>} />
                      <Route path="/admin/coupons" element={<AdminLayout><AdminCoupons /></AdminLayout>} />
                      <Route path="/admin/customers" element={<AdminLayout><AdminCustomers /></AdminLayout>} />
                      <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
                      <Route path="/admin/announcements" element={<AdminLayout><AdminAnnouncements /></AdminLayout>} />
                      <Route path="/admin/hero-slider" element={<AdminLayout><AdminHeroSlider /></AdminLayout>} />

                      {/* About & Policies */}
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                      <Route path="/exchange-policy" element={<ExchangePolicyPage />} />
                      <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                      <Route path="/returns-refunds" element={<ReturnRefundPolicyPage />} />
                      <Route path="/faq" element={<FAQPage />} />
                    </Routes>
                  </Suspense>
                </main>
                
                <Footer />
                
                {/* Sidebar Components */}
                <CartSidebar />
                <WishlistSidebar />
                
                {/* Toast Notifications */}
                <Toast />
              </div>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </DialogProvider>
  );
}

export default App;
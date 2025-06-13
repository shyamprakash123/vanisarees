import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { AuthProvider } from './contexts/AuthContext';

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
import WhatsAppFloat from './components/WhatsApp/WhatsAppFloat';

// Lazy load pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
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
const AdminProducts = React.lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = React.lazy(() => import('./pages/admin/AdminOrders'));
const AdminExchanges = React.lazy(() => import('./pages/admin/AdminExchanges'));
const AdminCombos = React.lazy(() => import('./pages/admin/AdminCombos'));
const AdminAnalytics = React.lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminCoupons = React.lazy(() => import('./pages/admin/AdminCoupons'));
const AdminCustomers = React.lazy(() => import('./pages/admin/AdminCustomers'));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'));

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div className="min-h-screen bg-white">
              <AnnouncementBar />
              <Header />
              
              <main>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:slug" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/track-order" element={<TrackOrderPage />} />
                    <Route path="/exchange-request" element={<ExchangeRequestPage />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/exchanges" element={<AdminExchanges />} />
                    <Route path="/admin/combos" element={<AdminCombos />} />
                    <Route path="/admin/analytics" element={<AdminAnalytics />} />
                    <Route path="/admin/coupons" element={<AdminCoupons />} />
                    <Route path="/admin/customers" element={<AdminCustomers />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                  </Routes>
                </Suspense>
              </main>
              
              <Footer />
              
              {/* Floating Components */}
              <WhatsAppFloat />
              
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
  );
}

export default App;
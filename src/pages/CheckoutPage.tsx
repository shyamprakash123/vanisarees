import React, { useState, useEffect } from 'react';
import { CreditCard, MapPin, User, Phone, Mail, Tag, Truck, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount: number | null;
  active: boolean;
  expires_at: string | null;
}

export default function CheckoutPage() {
  const { state: cartState, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  });

  const subtotal = cartState.total;
  const deliveryCharges = subtotal < 999 ? 100 : 0;
  const discount = appliedCoupon ? calculateDiscount(subtotal, appliedCoupon) : 0;
  const codCharges = formData.paymentMethod === 'cod' ? (subtotal < 999 ? 100 : 0) : 0;
  const total = subtotal + deliveryCharges + codCharges - discount;

  function calculateDiscount(amount: number, coupon: Coupon): number {
    if (coupon.discount_type === 'percentage') {
      const discountAmount = (amount * coupon.discount_value) / 100;
      return coupon.max_discount ? Math.min(discountAmount, coupon.max_discount) : discountAmount;
    } else {
      return coupon.discount_value;
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setCouponError('');
    
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('active', true)
        .single();
      
      if (error || !data) {
        setCouponError('Invalid coupon code');
        return;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setCouponError('Coupon has expired');
        return;
      }

      if (subtotal < data.min_order_amount) {
        setCouponError(`Minimum order amount is ₹${data.min_order_amount}`);
        return;
      }

      setAppliedCoupon(data);
      setCouponCode('');
      toast.success('Coupon applied successfully!');
    } catch (error) {
      setCouponError('Error applying coupon');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    toast.success('Coupon removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order in database
      const orderData = {
        user_id: user?.id || null,
        email: formData.email,
        phone: formData.phone,
        total_amount: total,
        status: 'pending',
        payment_method: formData.paymentMethod,
        delivery_charges: deliveryCharges,
        cod_charges: codCharges,
        discount_amount: discount,
        coupon_code: appliedCoupon?.code || null,
        shipping_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        items: cartState.items
      };

      const { data: order, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      if (formData.paymentMethod === 'prepaid') {
        // Initialize Razorpay payment
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: total * 100,
          currency: 'INR',
          name: 'VaniSarees',
          description: 'Purchase from VaniSarees',
          order_id: order.id,
          handler: async (response: any) => {
            await supabase
              .from('orders')
              .update({
                payment_id: response.razorpay_payment_id,
                status: 'paid'
              })
              .eq('id', order.id);

            clearCart();
            toast.success('Payment successful! Your order has been placed.');
            navigate(`/order-confirmation/${order.id}`);
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: '#F97316'
          }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      } else {
        // COD order
        clearCart();
        toast.success('Order placed successfully! You can pay on delivery.');
        navigate(`/order-confirmation/${order.id}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error creating order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some beautiful sarees to your cart first.</p>
          <Link
            to="/products"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Street address, apartment, suite, etc."
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Banknote className="w-5 h-5 text-green-600 mr-2" />
                          <p className="font-medium text-gray-900">Cash on Delivery</p>
                        </div>
                        <span className="text-sm text-gray-600">
                          +₹{subtotal < 999 ? 100 : 0} COD charges
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Pay when you receive your order</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="prepaid"
                      checked={formData.paymentMethod === 'prepaid'}
                      onChange={handleInputChange}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                        <p className="font-medium text-gray-900">Online Payment</p>
                        <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                          No COD charges
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">UPI, Cards, Wallets via Razorpay</p>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartState.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-300 text-sm"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-600 text-sm mt-1">{couponError}</p>
                )}
                {appliedCoupon && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                    <span className="text-green-700 text-sm font-medium">
                      {appliedCoupon.code} applied
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                
                {deliveryCharges > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Truck className="w-4 h-4 mr-1" />
                      Delivery Charges
                    </span>
                    <span className="font-medium">₹{deliveryCharges}</span>
                  </div>
                )}
                
                {codCharges > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">COD Charges</span>
                    <span className="font-medium">₹{codCharges}</span>
                  </div>
                )}
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                
                {formData.paymentMethod === 'cod' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-800 text-sm">
                      <strong>Amount to pay on delivery:</strong> ₹{total.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Place Order Button */}
              <motion.button
                type="submit"
                form="checkout-form"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-6 bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Processing...' : 
                  formData.paymentMethod === 'cod' 
                    ? `Place Order - ₹${total.toLocaleString()}` 
                    : `Pay Now - ₹${total.toLocaleString()}`
                }
              </motion.button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Save, Upload, Globe, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/Admin/AdminLayout';
import toast from 'react-hot-toast';

interface Settings {
  store_name: string;
  store_description: string;
  store_email: string;
  store_phone: string;
  store_address: string;
  whatsapp_number: string;
  free_shipping_threshold: number;
  cod_charges: number;
  delivery_charges: number;
  business_hours: string;
  social_media: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    store_name: 'VaniSarees',
    store_description: 'Authentic Traditional Sarees with Modern Elegance',
    store_email: 'info@vanisarees.com',
    store_phone: '+91 9876543210',
    store_address: '123 Traditional Street, Silk City, Karnataka 560001',
    whatsapp_number: '919876543210',
    free_shipping_threshold: 5000,
    cod_charges: 100,
    delivery_charges: 200,
    business_hours: '9:00 AM - 8:00 PM (Mon-Sat)',
    social_media: {
      facebook: 'https://facebook.com/vanisarees',
      instagram: 'https://instagram.com/vanisarees',
      twitter: 'https://twitter.com/vanisarees'
    }
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const socialKey = name.replace('social_', '');
      setSettings(prev => ({
        ...prev,
        social_media: {
          ...prev.social_media,
          [socialKey]: value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: name.includes('threshold') || name.includes('charges') ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // In a real app, you would save these to a settings table
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'shipping', label: 'Shipping', icon: MapPin },
    { id: 'social', label: 'Social Media', icon: Globe }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
            <p className="text-gray-600">Manage your store configuration and preferences</p>
          </div>
          <motion.button
            onClick={handleSaveSettings}
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center space-x-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Saving...' : 'Save Settings'}</span>
          </motion.button>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Name
                  </label>
                  <input
                    type="text"
                    name="store_name"
                    value={settings.store_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Description
                  </label>
                  <textarea
                    name="store_description"
                    value={settings.store_description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Hours
                  </label>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="business_hours"
                      value={settings.business_hours}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Contact Settings */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Email
                  </label>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="store_email"
                      value={settings.store_email}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Phone
                  </label>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="store_phone"
                      value={settings.store_phone}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    name="whatsapp_number"
                    value={settings.whatsapp_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="919876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Address
                  </label>
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-5 h-5 text-gray-400 mt-2" />
                    <textarea
                      name="store_address"
                      value={settings.store_address}
                      onChange={handleInputChange}
                      rows={3}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Settings */}
            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Free Shipping Threshold (₹)
                  </label>
                  <input
                    type="number"
                    name="free_shipping_threshold"
                    value={settings.free_shipping_threshold}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Orders above this amount will have free shipping
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Charges (₹)
                  </label>
                  <input
                    type="number"
                    name="delivery_charges"
                    value={settings.delivery_charges}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    COD Charges (₹)
                  </label>
                  <input
                    type="number"
                    name="cod_charges"
                    value={settings.cod_charges}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Additional charges for cash on delivery orders
                  </p>
                </div>
              </div>
            )}

            {/* Social Media Settings */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook Page URL
                  </label>
                  <input
                    type="url"
                    name="social_facebook"
                    value={settings.social_media.facebook}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://facebook.com/vanisarees"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram Profile URL
                  </label>
                  <input
                    type="url"
                    name="social_instagram"
                    value={settings.social_media.instagram}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://instagram.com/vanisarees"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter Profile URL
                  </label>
                  <input
                    type="url"
                    name="social_twitter"
                    value={settings.social_media.twitter}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://twitter.com/vanisarees"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
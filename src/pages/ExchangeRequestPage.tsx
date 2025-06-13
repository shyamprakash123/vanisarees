import React, { useState } from 'react';
import { Upload, Video, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import imageCompression from 'browser-image-compression';
import { Link } from 'react-router-dom';

export default function ExchangeRequestPage() {
  const [formData, setFormData] = useState({
    orderId: '',
    email: '',
    phone: '',
    reason: '',
    description: ''
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setError('Video file size should be less than 50MB');
        return;
      }
      setVideoFile(file);
      setError('');
    }
  };

  const uploadVideo = async (file: File): Promise<string> => {
    const fileName = `exchange-videos/${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('exchange-videos')
      .upload(fileName, file);

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('exchange-videos')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      let videoUrl = '';
      
      if (videoFile) {
        videoUrl = await uploadVideo(videoFile);
      }

      // Create exchange request
      const { error } = await supabase
        .from('exchange_requests')
        .insert({
          order_id: formData.orderId,
          email: formData.email,
          phone: formData.phone,
          reason: formData.reason,
          description: formData.description,
          video_url: videoUrl,
          status: 'pending'
        });

      if (error) throw error;
      
      setSubmitted(true);
    } catch (error: any) {
      setError(error.message || 'Error submitting exchange request');
    } finally {
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-8 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Exchange Request Submitted!</h1>
              <p className="text-gray-600 mb-8">
                Your exchange request has been submitted successfully. Our team will review it and get back to you within 24-48 hours.
              </p>
              <div className="space-y-4">
                <Link
                  to="/"
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
                >
                  Back to Home
                </Link>
                <p className="text-sm text-gray-500">
                  You can track the status of your exchange request by contacting our support team.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Exchange Request</h1>
            <p className="text-gray-600">
              Submit Link request to exchange your product. Please provide video proof of the issue.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order ID *
                  </label>
                  <input
                    type="text"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your order ID"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Exchange *
                </label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Link reason</option>
                  <option value="damaged">Product Damaged</option>
                  <option value="defective">Product Defective</option>
                  <option value="wrong-item">Wrong Item Received</option>
                  <option value="size-issue">Size Issue</option>
                  <option value="color-difference">Color Difference</option>
                  <option value="quality-issue">Quality Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Please describe the issue in detail..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Proof *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {videoFile ? (
                    <div className="space-y-2">
                      <Video className="w-12 h-12 text-green-500 mx-auto" />
                      <p className="text-sm font-medium text-gray-900">{videoFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={() => setVideoFile(null)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <label className="cursor-pointer">
                          <span className="text-primary-600 hover:text-primary-700 font-medium">
                            Click to upload video
                          </span>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          MP4, MOV, AVI up to 50MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Please upload Link video showing the unboxing or the issue with the product. This helps us process your request faster.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Important Notes:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Exchange requests must be submitted within 7 days of delivery</li>
                      <li>Products must be in original condition with tags attached</li>
                      <li>Video proof is mandatory for processing exchange requests</li>
                      <li>Processing time: 3-5 business days after approval</li>
                    </ul>
                  </div>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={uploading || !videoFile}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {uploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Request...</span>
                  </div>
                ) : (
                  'Submit Exchange Request'
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
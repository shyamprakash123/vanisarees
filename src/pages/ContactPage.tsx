import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+91 9876543210', '+91 9876543211'],
      description: 'Mon-Sat, 9 AM - 8 PM'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@vanisarees.com', 'support@vanisarees.com'],
      description: 'We reply within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: ['123 Traditional Street', 'Silk City, Karnataka 560001'],
      description: 'Visit our showroom'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon-Sat: 9:00 AM - 8:00 PM', 'Sunday: 10:00 AM - 6:00 PM'],
      description: 'We are here to help'
    }
  ];

  const faqs = [
    {
      question: 'What is your return policy?',
      answer: 'We offer Link 7-day return policy for all products. Items must be in original condition with tags attached.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we only ship within India. We are working on expanding to international markets soon.'
    },
    {
      question: 'How can I track my order?',
      answer: 'You can track your order using the Order ID and contact information on our Track Order page.'
    },
    {
      question: 'Do you have Link physical store?',
      answer: 'Yes, we have Link showroom in Bangalore. You can visit us during business hours to see our collection.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary-200/30 to-secondary-200/30 rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-secondary-200/30 to-accent-200/30 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Get in{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
              We'd love to hear from you. Send us Link message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gradient-to-br from-gray-50 to-primary-50 rounded-2xl"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-700 mb-1">{detail}</p>
                ))}
                <p className="text-sm text-gray-500 mt-2">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us Link Message</h2>
              
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Thank you for contacting us. We'll get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Link subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="product">Product Question</option>
                      <option value="return">Return/Exchange</option>
                      <option value="wholesale">Wholesale Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Tell us how we can help you..."
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* Quick Contact & FAQ */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Quick Contact */}
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Contact</h3>
                <div className="space-y-4">
                  <Link
                    to={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-300"
                  >
                    <MessageCircle className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">WhatsApp</p>
                      <p className="text-sm text-gray-600">Get instant support</p>
                    </div>
                  </Link>
                  
                  <Link
                    to="tel:+919876543210"
                    className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-300"
                  >
                    <Phone className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">Call Us</p>
                      <p className="text-sm text-gray-600">+91 9876543210</p>
                    </div>
                  </Link>
                  
                  <Link
                    to="mailto:info@vanisarees.com"
                    className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-300"
                  >
                    <Mail className="w-6 h-6 text-purple-600 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">Email Us</p>
                      <p className="text-sm text-gray-600">info@vanisarees.com</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <details key={index} className="group">
                      <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <span className="text-gray-500 group-open:rotate-180 transition-transform duration-300">
                          ▼
                        </span>
                      </summary>
                      <div className="mt-2 p-4 text-gray-700 bg-gray-50 rounded-lg">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
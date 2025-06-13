import React from 'react';
import { CheckCircle, Info, Shield, Gavel, Users, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TermsOfServicePage() {
  const termsSections = [
    {
      icon: Info,
      title: 'Acceptance of Terms',
      content: [
        'By accessing or using VaniSarees, you agree to be bound by these Terms of Service and all applicable laws and regulations.',
        'If you do not agree with any part of the terms, you are prohibited from using this site.'
      ]
    },
    {
      icon: Users,
      title: 'User Accounts',
      content: [
        'You are responsible for maintaining the confidentiality of your account and password.',
        'You agree to accept responsibility for all activities that occur under your account.',
        'We reserve the right to terminate accounts or cancel orders at our discretion.'
      ]
    },
    {
      icon: CheckCircle,
      title: 'Product Information',
      content: [
        'We strive to provide accurate descriptions and images of our products.',
        'However, colors may vary due to monitor settings, and minor differences may exist.',
        'All prices are subject to change without prior notice.'
      ]
    },
    {
      icon: Gavel,
      title: 'Orders & Payments',
      content: [
        'Orders are subject to acceptance and availability.',
        'We reserve the right to refuse or cancel any order for any reason.',
        'Payments must be made in full at the time of placing the order using approved payment methods.'
      ]
    },
    {
      icon: Shield,
      title: 'Intellectual Property',
      content: [
        'All content on this site including images, text, and graphics are the property of VaniSarees.',
        'You may not use, reproduce, or distribute any content without written permission.'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Limitation of Liability',
      content: [
        'We are not liable for any indirect, incidental, or consequential damages arising from your use of the site.',
        'Our maximum liability to you shall not exceed the total amount paid by you for the products purchased.'
      ]
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
            <div className="flex items-center justify-center mb-6">
              <Gavel className="w-8 h-8 text-primary-500 mr-3" />
              <span className="text-primary-600 font-semibold text-lg tracking-wide uppercase">
                Terms of Use
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Terms{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                of Service
              </span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8">
              Please read these terms carefully before using our website or making a purchase.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <p className="text-blue-800 text-sm">
                <strong>Effective Date:</strong> January 15, 2024
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {termsSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-4">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>

                <ul className="space-y-3">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              If you have any questions about these Terms of Service, you can contact us at:
            </p>
            <p className="text-gray-700 leading-relaxed font-medium">support@vanisarees.in</p>
          </div>
        </div>
      </section>
    </div>
  );
}

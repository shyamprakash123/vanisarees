import React from 'react';
import { Shield, Eye, Lock, Users, FileText, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: FileText,
      title: 'Information We Collect',
      content: [
        'Personal Information: Name, email address, phone number, shipping address, and billing information when you create an account or make a purchase.',
        'Payment Information: Credit card details and other payment information (processed securely through our payment partners).',
        'Usage Data: Information about how you use our website, including pages visited, time spent, and interactions.',
        'Device Information: IP address, browser type, operating system, and device identifiers.',
        'Cookies and Tracking: We use cookies and similar technologies to enhance your browsing experience.'
      ]
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        'Process and fulfill your orders, including shipping and customer service.',
        'Communicate with you about your orders, account, and promotional offers.',
        'Improve our website, products, and services based on your feedback and usage patterns.',
        'Personalize your shopping experience and provide relevant product recommendations.',
        'Prevent fraud and ensure the security of our platform.',
        'Comply with legal obligations and resolve disputes.'
      ]
    },
    {
      icon: Users,
      title: 'Information Sharing',
      content: [
        'Service Providers: We share information with trusted third-party service providers who help us operate our business (payment processors, shipping companies, email services).',
        'Legal Requirements: We may disclose information when required by law or to protect our rights and safety.',
        'Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be transferred.',
        'Consent: We may share information with your explicit consent for specific purposes.',
        'We do not sell, rent, or trade your personal information to third parties for marketing purposes.'
      ]
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        'We implement industry-standard security measures to protect your personal information.',
        'All payment transactions are processed through secure, encrypted connections (SSL).',
        'We regularly update our security practices and conduct security audits.',
        'Access to personal information is restricted to authorized personnel only.',
        'We use secure servers and databases with appropriate access controls.',
        'While we strive to protect your information, no method of transmission over the internet is 100% secure.'
      ]
    },
    {
      icon: Shield,
      title: 'Your Rights and Choices',
      content: [
        'Access: You can request access to the personal information we hold about you.',
        'Correction: You can update or correct your personal information through your account settings.',
        'Deletion: You can request deletion of your personal information, subject to legal requirements.',
        'Opt-out: You can unsubscribe from marketing communications at any time.',
        'Cookies: You can control cookie settings through your browser preferences.',
        'Data Portability: You can request a copy of your data in a portable format.'
      ]
    },
    {
      icon: AlertCircle,
      title: 'Cookies and Tracking',
      content: [
        'Essential Cookies: Required for basic website functionality and security.',
        'Performance Cookies: Help us understand how visitors interact with our website.',
        'Functional Cookies: Remember your preferences and personalize your experience.',
        'Marketing Cookies: Used to deliver relevant advertisements and track campaign effectiveness.',
        'You can manage cookie preferences through your browser settings.',
        'Disabling certain cookies may affect website functionality.'
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
              <Shield className="w-8 h-8 text-primary-500 mr-3" />
              <span className="text-primary-600 font-semibold text-lg tracking-wide uppercase">
                Your Privacy Matters
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Privacy{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8">
              We are committed to protecting your privacy and ensuring the security of your personal information. 
              This policy explains how we collect, use, and safeguard your data.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <p className="text-blue-800 text-sm">
                <strong>Last Updated:</strong> January 15, 2024 | 
                <strong> Effective Date:</strong> January 15, 2024
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                VaniSarees ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
                website or make a purchase from us.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using our website or services, you agree to the collection and use of information in accordance with this policy. 
                If you do not agree with our policies and practices, please do not use our services.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {sections.map((section, index) => (
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

      {/* Additional Sections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are not intended for children under the age of 13. We do not knowingly collect personal 
                information from children under 13. If you are a parent or guardian and believe your child has provided 
                us with personal information, please contact us immediately.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or other factors.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We encourage you to review this policy periodically. Continued use of our website after any updates constitutes your acceptance of the new terms.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                If you have any questions, concerns, or feedback about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-700 leading-relaxed font-semibold">
                Email: <Link to="mailto:support@vanisarees.com" className="text-primary-600 hover:underline">support@vanisarees.com</Link>
              </p>
              <p className="text-gray-700 leading-relaxed font-semibold">
                Address: 123 Saree Street, Hyderabad, Telangana, India - 500084
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

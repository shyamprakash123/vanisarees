import React from 'react';
import { RefreshCcw, Video, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExchangePolicyPage() {
  const sections = [
    {
      icon: Video,
      title: 'Mandatory Unboxing Video',
      content: [
        'To be eligible for an exchange, customers must record a clear **unboxing video** of the package from start to finish without any cuts or pauses.',
        'The video must show the unopened parcel, proper unsealing, and the damaged or incorrect item received.',
        'Videos taken after the package is opened or without continuous footage will not be considered for exchange.'
      ]
    },
    {
      icon: AlertCircle,
      title: 'Conditions for Exchange',
      content: [
        'Exchange is only applicable for products that are **damaged**, **defective**, or **incorrectly delivered**.',
        'The product must be unused, unwashed, and in its original packaging with all tags intact.',
        'Requests must be raised within **24 hours** of delivery through our support email or WhatsApp.',
        'Only one exchange request per order will be accepted.'
      ]
    },
    {
      icon: ShieldCheck,
      title: 'How to Request an Exchange',
      content: [
        'Email us at **support@vanisarees.in** or message us on WhatsApp with:',
        '1. Your order ID',
        '2. A clear unboxing video',
        '3. Images showing the issue (if necessary)',
        'Our team will review the submission and respond within 48 hours with approval or clarification.',
        'If approved, we will arrange reverse pickup or request you to courier the product based on your pin code.'
      ]
    },
    {
      icon: RefreshCcw,
      title: 'Exchange Timeline & Process',
      content: [
        'Once your request is approved and the product is received back by us, we will inspect it.',
        'After successful inspection, we will dispatch the replacement product within **5–7 working days**.',
        'Exchanges are subject to product availability. If a replacement is not available, we will provide store credit.'
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
              <RefreshCcw className="w-8 h-8 text-primary-500 mr-3" />
              <span className="text-primary-600 font-semibold text-lg tracking-wide uppercase">
                Hassle-Free Exchange
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Exchange{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8">
              We ensure customer satisfaction by accepting exchanges for damaged or incorrect products—with proof.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Exchange is **only valid** with unboxing video proof sent within 24 hours of delivery.
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

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Reach out to our support team for any questions or concerns regarding your exchange.
            </p>
            <p className="text-gray-700 font-medium">Email: support@vanisarees.in</p>
            <p className="text-gray-700 font-medium">WhatsApp: +91-XXXXXXXXXX</p>
          </div>
        </div>
      </section>
    </div>
  );
}

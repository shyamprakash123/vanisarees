import React from 'react';
import { HelpCircle, ShoppingBag, RefreshCcw, Truck, Lock, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FAQPage() {
  const faqs = [
    {
      icon: ShoppingBag,
      question: 'How do I place an order?',
      answer: 'Browse our products, add your favorite items to the cart, and proceed to checkout. Fill in your shipping details and make a secure payment to complete your order.'
    },
    {
      icon: Truck,
      question: 'How long does shipping take?',
      answer: 'Shipping typically takes 5–7 business days depending on your location. You’ll receive tracking details once your order is dispatched.'
    },
    {
      icon: RefreshCcw,
      question: 'Can I return or exchange my product?',
      answer: 'All sales are final. We do not offer returns or refunds. Replacements are provided only for damaged items with proper unboxing video proof.'
    },
    {
      icon: Lock,
      question: 'Is my payment information safe?',
      answer: 'Absolutely. All payments are processed through secure, encrypted gateways. We do not store any card or banking information on our servers.'
    },
    {
      icon: HelpCircle,
      question: 'What should I do if I receive a damaged item?',
      answer: 'Please record a clear unboxing video starting before the package is opened. If valid damage is found, contact us within 24 hours for a possible replacement.'
    },
    {
      icon: Info,
      question: 'How can I contact customer support?',
      answer: 'You can reach us at support@vanisarees.in or via WhatsApp at +91-XXXXXXXXXX. We typically respond within 24–48 hours.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary-200/30 to-secondary-200/30 rounded-full blur-3xl -translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-secondary-200/30 to-accent-200/30 rounded-full blur-3xl translate-x-48 translate-y-48" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Questions</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Got questions? We’ve got answers. Find everything you need to know below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-6 rounded-xl shadow-md flex items-start space-x-4"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0">
                <faq.icon className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Prompt */}
      <section className="py-12 bg-primary-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
          <p className="text-gray-700 mb-4">
            Contact us directly at <strong>support@vanisarees.in</strong> or WhatsApp us at <strong>+91-XXXXXXXXXX</strong>.
          </p>
        </div>
      </section>
    </div>
  );
}

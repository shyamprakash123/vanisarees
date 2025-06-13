import React from 'react';
import { Ban, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReturnRefundPolicyPage() {
  const sections = [
    {
      icon: Ban,
      title: 'No Returns or Exchanges',
      content: [
        'All sales made on our platform are **final**.',
        'We do **not** offer returns or exchanges under any circumstances, including dissatisfaction with the product, color mismatch, size concerns, or change of mind.',
        'This policy ensures hygiene, quality control, and fair pricing for all customers.',
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Damaged or Defective Items',
      content: [
        'While we take utmost care in quality checks and packaging, if you receive a damaged product, we require **unboxing video proof**.',
        'The unboxing video must start **before the package is opened** and clearly show the damage without cuts or edits.',
        'If valid, we may offer a replacement at our sole discretion. However, refunds will not be provided.',
        'No complaints will be accepted without proper video proof.'
      ]
    },
    {
      icon: Info,
      title: 'Important Exceptions',
      content: [
        'We do not accept return requests due to color variation caused by lighting or screen resolution.',
        'Minor irregularities in handloom or handcrafted products are not considered defects—they reflect the authenticity of the product.',
        'Return shipping charges (if any) for approved replacements are to be borne by the customer unless otherwise stated.'
      ]
    },
    {
      icon: CheckCircle,
      title: 'Customer Responsibility',
      content: [
        'Please read product details and specifications carefully before placing your order.',
        'Ensure your shipping address and contact number are accurate.',
        'We are not responsible for orders undelivered due to incorrect information.'
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
              <Ban className="w-8 h-8 text-primary-500 mr-3" />
              <span className="text-primary-600 font-semibold text-lg tracking-wide uppercase">
                Please Read Carefully
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Returns &{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Refunds
              </span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8">
              We believe in transparency and clarity. Kindly review our return & refund terms before making a purchase.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
              <p className="text-red-800 text-sm">
                <strong>Effective Date:</strong> January 15, 2024 | 
                <strong> Last Updated:</strong> January 15, 2024
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

      {/* Contact */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gray-100 rounded-2xl p-6 text-gray-800">
            <h2 className="text-xl font-semibold mb-2">Need Help?</h2>
            <p>If you have any questions or concerns, feel free to contact us:</p>
            <ul className="mt-3 space-y-1">
              <li>Email: <strong>support@vanisarees.in</strong></li>
              <li>WhatsApp: <strong>+91-XXXXXXXXXX</strong></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

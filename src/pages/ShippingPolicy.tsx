import React from 'react';
import { Truck, Clock, Globe, AlertCircle, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ShippingPolicyPage() {
  const sections = [
    {
      icon: Globe,
      title: 'Shipping Coverage',
      content: [
        'We currently ship across all major cities and towns in India.',
        'International shipping is available to select countries; please contact us before placing an international order.',
        'Pincode serviceability can be checked at checkout or by contacting our support.'
      ]
    },
    {
      icon: Clock,
      title: 'Processing Time',
      content: [
        'Orders are processed within **1–2 business days** after successful payment.',
        'During peak seasons, sales, or holidays, processing may take an additional 1–2 days.',
        'Custom or pre-order items may take longer to dispatch as mentioned in the product description.'
      ]
    },
    {
      icon: Truck,
      title: 'Delivery Timeline',
      content: [
        '**Metro Cities:** 2–4 business days',
        '**Tier 2/3 Cities & Rural Areas:** 4–7 business days',
        '**International Orders:** 7–15 business days depending on destination and customs clearance.',
        'Delays may occur due to weather, public holidays, or courier service issues.'
      ]
    },
    {
      icon: AlertCircle,
      title: 'Shipping Charges',
      content: [
        '**Free Shipping** on all prepaid orders above ₹999 within India.',
        'For orders below ₹999, a standard shipping fee of ₹60 will be applied.',
        'Cash on Delivery (COD) may incur an additional ₹50 handling fee.',
        'International shipping charges are calculated at checkout or quoted upon request.'
      ]
    },
    {
      icon: PhoneCall,
      title: 'Tracking & Support',
      content: [
        'Once your order is dispatched, you will receive an email and SMS with the tracking number and link.',
        'You can also track your order in the "My Orders" section of your account.',
        'For any shipping-related queries, contact us via:',
        '**Email:** support@vanisarees.in',
        '**WhatsApp:** +91-XXXXXXXXXX'
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
              <Truck className="w-8 h-8 text-primary-500 mr-3" />
              <span className="text-primary-600 font-semibold text-lg tracking-wide uppercase">
                Reliable Delivery
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Shipping{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8">
              Get your sarees delivered safely and swiftly to your doorstep. Here's everything you need to know about our shipping process.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
              <p className="text-green-800 text-sm">
                <strong>Last Updated:</strong> January 15, 2024
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Shipping Info Sections */}
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

      {/* Note Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Important Notes:</h2>
            <ul className="list-disc pl-5 text-yellow-700 space-y-2">
              <li>Incorrect address or contact details may result in failed delivery or return to origin.</li>
              <li>We are not responsible for delays caused by courier companies, natural disasters, or political events.</li>
              <li>Please ensure availability at the delivery address during expected delivery dates.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

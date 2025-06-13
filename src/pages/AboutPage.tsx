import React from 'react';
import { Heart, Award, Users, Truck, Shield, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Passion for Tradition',
      description: 'We are passionate about preserving the rich heritage of Indian textiles while making them accessible to modern women.'
    },
    {
      icon: Award,
      title: 'Quality Excellence',
      description: 'Every saree in our collection is carefully selected for its superior quality, craftsmanship, and authentic materials.'
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Our customers are at the heart of everything we do. We strive to provide exceptional service and unforgettable experiences.'
    },
    {
      icon: Shield,
      title: 'Trust & Authenticity',
      description: 'We guarantee the authenticity of every product and maintain transparent business practices to earn your trust.'
    }
  ];

  const milestones = [
    { year: '2020', title: 'Founded', description: 'VaniSarees was born with a vision to bring authentic traditional sarees to every home.' },
    { year: '2021', title: 'First 1000 Customers', description: 'Reached our first milestone of serving 1000 happy customers across India.' },
    { year: '2022', title: 'Expanded Collection', description: 'Introduced designer and bridal collections to cater to diverse preferences.' },
    { year: '2023', title: 'Pan-India Delivery', description: 'Extended our reach to deliver beautiful sarees across all states in India.' },
    { year: '2024', title: '10,000+ Happy Customers', description: 'Celebrating the trust of over 10,000 customers who chose VaniSarees for their special moments.' }
  ];

  const team = [
    {
      name: 'Vani Sharma',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      description: 'With over 15 years in the textile industry, Vani founded VaniSarees to share her love for traditional Indian wear.'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Head of Operations',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      description: 'Rajesh ensures smooth operations and timely delivery of every order with his expertise in logistics.'
    },
    {
      name: 'Priya Patel',
      role: 'Design Curator',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      description: 'Priya curates our collection with an eye for contemporary trends while respecting traditional aesthetics.'
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
              <Sparkles className="w-8 h-8 text-primary-500 mr-3" />
              <span className="text-primary-600 font-semibold text-lg tracking-wide uppercase">
                Our Story
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                VaniSarees
              </span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
              We are passionate about bringing you the finest collection of authentic traditional sarees, 
              combining timeless elegance with modern convenience. Every saree tells a story, and we're here 
              to help you find yours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                To preserve and promote the rich heritage of Indian textiles by making authentic, 
                high-quality sarees accessible to women everywhere. We believe that every woman 
                deserves to feel beautiful and confident in traditional wear that celebrates our culture.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Through our carefully curated collection, we aim to bridge the gap between traditional 
                craftsmanship and modern lifestyle, ensuring that the art of saree-making continues 
                to thrive for generations to come.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Traditional saree craftsmanship"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              These core values guide everything we do and shape our commitment to you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From a small dream to serving thousands of customers across India
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6">
                    <h3 className="text-2xl font-bold text-primary-600 mb-2">{milestone.year}</h3>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">{milestone.title}</h4>
                    <p className="text-gray-700">{milestone.description}</p>
                  </div>
                </div>
                
                <div className="w-4 h-4 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full animate-ping opacity-25"></div>
                </div>
                
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-secondary-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The passionate people behind VaniSarees who make it all possible
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10,000+', label: 'Happy Customers' },
              { number: '50,000+', label: 'Sarees Sold' },
              { number: '500+', label: 'Designs' },
              { number: '99%', label: 'Satisfaction Rate' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image: string;
  purchasedItem: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    comment: 'Absolutely stunning sarees! The quality is exceptional and the colors are even more beautiful in person. VaniSarees has become my go-to place for traditional wear.',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    purchasedItem: 'Silk Wedding Saree'
  },
  {
    id: '2',
    name: 'Anita Reddy',
    location: 'Bangalore, Karnataka',
    rating: 5,
    comment: 'The customer service is outstanding! They helped me choose the perfect saree for my daughter\'s wedding. The fabric quality and craftsmanship are top-notch.',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    purchasedItem: 'Designer Bridal Collection'
  },
  {
    id: '3',
    name: 'Meera Patel',
    location: 'Ahmedabad, Gujarat',
    rating: 5,
    comment: 'I ordered a combo pack and saved so much money! The sarees arrived perfectly packaged and the colors were exactly as shown. Highly recommend VaniSarees!',
    image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    purchasedItem: 'Cotton Saree Combo'
  },
  {
    id: '4',
    name: 'Lakshmi Iyer',
    location: 'Chennai, Tamil Nadu',
    rating: 5,
    comment: 'Traditional designs with modern touch! The sarees are comfortable to wear and the delivery was super fast. Will definitely order again for upcoming festivals.',
    image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    purchasedItem: 'Festival Special Saree'
  },
  {
    id: '5',
    name: 'Kavya Nair',
    location: 'Kochi, Kerala',
    rating: 5,
    comment: 'The WhatsApp support is amazing! They answered all my questions and even sent additional photos. The saree quality exceeded my expectations.',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    purchasedItem: 'Silk Designer Saree'
  },
  {
    id: '6',
    name: 'Sunita Gupta',
    location: 'Delhi, NCR',
    rating: 5,
    comment: 'Excellent collection and reasonable prices! The sarees are perfect for both casual and formal occasions. VaniSarees has earned a loyal customer in me.',
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    purchasedItem: 'Casual Wear Collection'
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-primary-200/20 to-secondary-200/20 rounded-full blur-3xl translate-x-36 -translate-y-36"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-secondary-200/20 to-accent-200/20 rounded-full blur-3xl -translate-x-48 translate-y-48"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Quote className="w-8 h-8 text-primary-500 mr-3" />
            <span className="text-primary-600 font-semibold text-lg tracking-wide uppercase">
              Customer Stories
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            What Our{' '}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who trust VaniSarees for their traditional wear needs
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100/50 to-secondary-100/50 rounded-full blur-2xl translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
                
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-primary-200 group-hover:text-primary-300 transition-colors duration-300">
                  <Quote className="w-8 h-8" />
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-700 leading-relaxed mb-6 relative z-10">
                  "{testimonial.comment}"
                </p>

                {/* Customer Info */}
                <div className="flex items-center space-x-4 relative z-10">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary-100"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                    <p className="text-xs text-primary-600 font-medium mt-1">
                      Purchased: {testimonial.purchasedItem}
                    </p>
                  </div>
                </div>

                {/* Decorative Element */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-secondary-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: '10,000+', label: 'Happy Customers' },
            { number: '50,000+', label: 'Sarees Sold' },
            { number: '4.9/5', label: 'Average Rating' },
            { number: '99%', label: 'Customer Satisfaction' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
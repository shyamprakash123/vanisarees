import React from 'react';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  Sparkles
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-secondary-500/10 to-accent-500/10 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  VaniSarees
                </h3>
                <p className="text-xs text-gray-400">Authentic Traditional Wear</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Authentic traditional sarees crafted with love and attention to detail. 
              Bringing you the finest collection of Indian ethnic wear with modern convenience.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="p-3 bg-gray-800 hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-500 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-3 bg-gray-800 hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-500 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-3 bg-gray-800 hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-500 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-3 bg-gray-800 hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-500 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Categories', href: '/categories' },
                { name: 'Combo Offers', href: '/combos' },
                { name: 'Track Order', href: '/track-order' },
                { name: 'Exchange Policy', href: '/exchange' }
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-primary-400 transition-all duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-primary-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Customer Service</h4>
            <ul className="space-y-3">
              {[
                { name: 'Contact Us', href: '/contact' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Shipping Info', href: '/shipping' },
                { name: 'Returns & Refunds', href: '/returns' },
                { name: 'Size Guide', href: '/size-guide' }
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-primary-400 transition-all duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-primary-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  123 Traditional Street,<br />
                  Silk City, Karnataka 560001
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">+91 9876543210</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">info@vanisarees.com</p>
              </div>
            </div>

            {/* WhatsApp Support */}
            <div className="mt-6">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 2.011C6.498 2.011 2.011 6.498 2.011 12.017c0 1.756.455 3.456 1.318 4.952L2 22l5.153-1.351a9.96 9.96 0 004.864 1.368c5.518 0 9.983-4.487 9.983-10.006C21.99 6.493 17.535 2.011 12.017 2.011zm5.975 14.152c-.274.77-.79 1.42-1.44 1.853-.65.433-1.392.65-2.183.65-.574 0-1.243-.13-2.005-.39-.762-.26-1.556-.65-2.378-1.17-.822-.52-1.596-1.147-2.322-1.883s-1.363-1.5-1.883-2.322c-.52-.822-.91-1.616-1.17-2.378-.26-.762-.39-1.431-.39-2.005 0-.791.217-1.533.65-2.183.433-.65 1.083-1.166 1.853-1.44.308-.11.64-.165.995-.165.26 0 .52.055.78.165.26.11.455.242.585.396l1.495 2.38c.13.208.195.416.195.624 0 .208-.055.396-.165.564-.11.168-.273.351-.488.549l-.793.793c-.11.11-.165.26-.165.451 0 .143.039.299.117.468.078.169.208.364.39.585.764 1.001 1.664 1.82 2.7 2.457.221.143.416.247.585.312.169.065.325.098.468.098.191 0 .341-.055.451-.165l.793-.793c.198-.215.381-.378.549-.488.168-.11.356-.165.564-.165.208 0 .416.065.624.195l2.38 1.495c.154.13.286.325.396.585.11.26.165.52.165.78 0 .355-.055.687-.165.995z"/>
                </svg>
                <span className="text-sm font-semibold">WhatsApp Support</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 VaniSarees. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-1 text-gray-400 text-sm mb-4 md:mb-0">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for traditional fashion lovers</span>
            </div>
            
            <div className="flex space-x-6">
              <a 
                href="/privacy" 
                className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-200"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
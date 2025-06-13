import React, { useState, useEffect } from 'react';
import { X, Gift, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface Announcement {
  id: string;
  message: string;
  active: boolean;
}

export default function AnnouncementBar() {
  const location = useLocation();
  const { user } = useAuth();

  const isAdminPath = location.pathname.startsWith('/admin');
  const isAdmin = user?.app_metadata?.role === "admin";

  if (isAdmin && isAdminPath) {
    return null;
  }

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [announcements.length]);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  if (!announcements.length) return null;

  const currentAnnouncement = announcements[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-4 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="flex space-x-4 animate-pulse">
            <Gift className="w-6 h-6" />
            <Zap className="w-6 h-6" />
            <Gift className="w-6 h-6" />
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="container mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2">
            <Gift className="w-5 h-5 text-yellow-300" />
            <motion.span
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-sm md:text-base font-medium"
            >
              {currentAnnouncement.message}
            </motion.span>
          </div>

          {/* Progress Indicators */}
          {announcements.length > 1 && (
            <div className="hidden md:flex items-center space-x-2">
              {announcements.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sliding Animation Bar */}
        {announcements.length > 1 && (
          <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full">
            <motion.div
              className="h-full bg-white"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 4, ease: 'linear' }}
              key={currentIndex}
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
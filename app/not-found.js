'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1E0B40] flex items-center justify-center p-4">
      <div className="relative">
        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl -z-10"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="blue-glass rounded-2xl p-8 md:p-12 max-w-2xl text-center"
        >
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-8xl font-bold text-white mb-4"
          >
            404
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-2xl md:text-3xl font-semibold text-white mb-4"
          >
            Page Not Found
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-white/70 mb-8"
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-white text-purple-900 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              <FiArrowLeft size={20} />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
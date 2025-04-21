'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebookF, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#120726] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and About Section */}
          <div className="space-y-4">
            <Link href="/" className="block">
              <Image src="/images/logo.png" alt="Off White" width={150} height={50} className="brightness-0 invert" />
            </Link>
            <p className="text-white/70 leading-relaxed">
              Bangladesh's premier event management company, creating unforgettable moments and exceptional experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/70 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/packages" className="text-white/70 hover:text-white transition-colors">Packages</Link>
              </li>
              <li>
                <Link href="/team" className="text-white/70 hover:text-white transition-colors">Our Team</Link>
              </li>
              <li>
                <Link href="/login" className="text-white/70 hover:text-white transition-colors">Login</Link>
              </li>
              <li>
                <Link href="/register" className="text-white/70 hover:text-white transition-colors">Register</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/70">
                <FaMapMarkerAlt className="text-purple-400" />
                <span>Kuakata, Mahipur, Ptuakhali, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <FaPhone className="text-purple-400" />
                <a href="tel:+880199728069" className="hover:text-white transition-colors">+880 1997 28069</a>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <FaEnvelope className="text-purple-400" />
                <a href="mailto:contact@offwhite.com.bd" className="hover:text-white transition-colors">contact@offwhite.com.bd</a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-purple-500 transition-colors"
              >
                <FaInstagram size={18} />
              </motion.a>
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-purple-500 transition-colors"
              >
                <FaFacebookF size={18} />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-purple-500 transition-colors"
              >
                <FaTwitter size={18} />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">&copy; {new Date().getFullYear()} Off White. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

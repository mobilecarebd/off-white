'use client';
import { motion } from 'framer-motion';

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-[#1E0B40]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h3 className="text-purple-300 font-medium mb-4 tracking-wider">Get in Touch</h3>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">Find Us</h2>
          <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto transform rotate-45"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="blue-glass rounded-xl overflow-hidden shadow-lg"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29626.694258191827!2d90.11653211680473!3d21.844541536304984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30aa871b7d2f1ea5%3A0x495c3b4b7ebd4baf!2z4KaF4KarIOCmueCni-Cnn-CmvuCmh-Cmnw!5e0!3m2!1sen!2sbd!4v1744956302676!5m2!1sen!2sbd"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
}
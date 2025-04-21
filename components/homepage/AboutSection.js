'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="blue-glass rounded-2xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Column */}
            <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden">
              <Image
                src="/images/about-photo.jpg"
                alt="About Off White Photography"
                fill
                className="object-cover"
              />
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-purple-500/30 rounded-full"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-pink-500/30 rounded-full"></div>
            </div>

            {/* Content Column */}
            <div className="space-y-6">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent"
              >
                Capturing Your Special Moments
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-white/80 leading-relaxed"
              >
                At Off White Photography, we believe every moment tells a unique story. With over a decade of experience in wedding and event photography, we've mastered the art of capturing those fleeting moments that make life beautiful.
              </motion.p>

              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-white/80 leading-relaxed"
              >
                Our passion lies in creating timeless photographs that not only document your special day but also capture the emotions, the laughter, and the love that make it unforgettable.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-6 pt-6"
              >
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">500+</h3>
                  <p className="text-white/60">Happy Couples</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">10+</h3>
                  <p className="text-white/60">Years Experience</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
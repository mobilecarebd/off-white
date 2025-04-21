'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function CreativePhotography() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/photos`);
        if (!response.ok) {
          throw new Error('Failed to fetch photos');
        }
        const data = await response.json();
        setPhotos(data.photos);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <section className="w-full relative overflow-hidden py-12 ">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h3 className="text-purple-300 font-medium mb-4 tracking-wider">PORTFOLIO SHOWCASE</h3>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">Our Creative Photography</h2>
          <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto transform rotate-45"></div>
        </motion.div>
        
        <div className="grid grid-cols-1 gap-4 mx-auto max-w-7xl">
          {/* Top row with three images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((index) => photos[index] && (
              <motion.div
                key={photos[index]._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-[280px] relative rounded-2xl overflow-hidden shadow-xl"
              >
                <Image
                  src={photos[index].url}
                  alt={photos[index].title || 'Featured Photography'}
                  fill
                  className="object-cover transition-all duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw"
                  priority={index === 0}
                />
              </motion.div>
            ))}
          </div>

          {/* Bottom row with left image and two stacked images on right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left image */}
            {photos[3] && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="md:col-span-5 h-[400px] relative rounded-2xl overflow-hidden shadow-xl"
              >
                <Image
                  src={photos[3].url}
                  alt={photos[3].title || 'Vertical Photography'}
                  fill
                  className="object-cover transition-all duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </motion.div>
            )}

            {/* Two stacked images on right (2x2 grid) */}
            <div className="md:col-span-7 grid grid-cols-2 grid-rows-2 gap-4">
              {[4, 5, 6, 7].map((index) => photos[index] && (
                <motion.div
                  key={photos[index]._id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + (index - 4) * 0.1 }}
                  className="h-[190px] relative rounded-2xl overflow-hidden shadow-xl" // Adjusted height for 2x2 grid
                >
                  <Image
                    src={photos[index].url}
                    alt={photos[index].title || 'Stacked Photography'}
                    fill
                    className="object-cover transition-all duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
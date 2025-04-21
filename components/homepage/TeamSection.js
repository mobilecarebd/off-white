'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaInstagram, FaFacebook, FaTwitter, FaShare } from 'react-icons/fa';
import Link from 'next/link';

export default function TeamSection({ limit }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeShare, setActiveShare] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team`);
        if (!response.ok) {
          throw new Error('Failed to fetch team members');
        }
        const data = await response.json();
        setMembers(limit ? data.members.slice(0, limit) : data.members);
        setError(null);
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();

    // Close share menu when clicking outside
    const handleClickOutside = (e) => {
      if (!e.target.closest('.share-menu')) {
        setActiveShare(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [limit]);

  const handleShare = (e, memberId) => {
    e.stopPropagation();
    setActiveShare(activeShare === memberId ? null : memberId);
  };

  return (
    <section id="team" className="py-20 bg-[#1E0B40]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h3 className="text-purple-300 font-medium mb-4 tracking-wider">OUR TEAM</h3>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">Meet Our Team</h2>
          <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto transform rotate-45"></div>
          {limit && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-6"
            >
              <Link 
                href="/team" 
                className="text-white/60 hover:text-white transition-colors"
              >
                Meet All Team Members →
              </Link>
            </motion.div>
          )}
        </motion.div>

        {loading && <p className="text-center text-white/80">Loading team members...</p>}
        {error && <p className="text-center text-red-400">Error: {error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {members.map((member, index) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-purple-100/5 via-white/10 to-transparent">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-300/5 to-white/5"></div>
                  
                  {/* Image Container */}
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_UPLOADS_URL}${member.imageUrl.replace('/uploads', '')}`}
                      alt={member.name}
                      fill
                      className="object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Info Bar - Always visible */}
                  <div className="absolute top-6 left-6 p-4">
                    <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{member.name}</h3>
                    <p className="text-white/90 font-light">{member.role}</p>
                  </div>

                  {/* Share Button */}
                  <button
                    onClick={(e) => handleShare(e, member._id)}
                    className="share-menu absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all z-20"
                  >
                    <FaShare size={16} />
                  </button>

                  {/* Social Icons - Animated on share click */}
                  <AnimatePresence>
                    {activeShare === member._id && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-20 right-6 flex flex-col items-end space-y-2"
                      >
                        {member.socialLinks?.instagram && (
                          <motion.a
                            href={member.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
                          >
                            <FaInstagram size={20} />
                          </motion.a>
                        )}
                        {member.socialLinks?.facebook && (
                          <motion.a
                            href={member.socialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2, delay: 0.2 }}
                            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
                          >
                            <FaFacebook size={20} />
                          </motion.a>
                        )}
                        {member.socialLinks?.twitter && (
                          <motion.a
                            href={member.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2, delay: 0.3 }}
                            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
                          >
                            <FaTwitter size={20} />
                          </motion.a>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {members.length === 0 && !loading && !error && (
          <p className="text-center text-white/80">No team members available at the moment.</p>
        )}
      </div>

      {limit && (
        <div className="text-center mt-8">
          <Link href="/team" className="blue-glass-button px-6 py-3 rounded-lg text-white font-semibold transition-transform transform hover:scale-105">
            View All Team Members
          </Link>
        </div>
      )}
    </section>
  );
}
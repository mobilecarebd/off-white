'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function PackagesSection({ limit }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingData, setBookingData] = useState({
    customerName: '',
    phone: '',
    address: '',
    bookingDate: ''
  });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/packages`);
        if (!response.ok) {
          throw new Error('Failed to fetch packages');
        }
        const data = await response.json();
        setPackages(limit ? data.packages.slice(0, limit) : data.packages);
        setError(null);
      } catch (err) {
        console.error('Error fetching packages:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [limit]);

  const handleBookingClick = (pkg) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          packageId: selectedPackage._id,
          packageName: selectedPackage.name,
          packagePrice: selectedPackage.offerPrice || selectedPackage.regularPrice,
          ...bookingData
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Booking submitted successfully');
        setIsModalOpen(false);
        setBookingData({
          customerName: '',
          phone: '',
          address: '',
          bookingDate: ''
        });
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Failed to submit booking');
    }
  };

  return (
    <section id="packages" className="py-20 bg-[#1E0B40]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h3 className="text-purple-300 font-medium mb-4 tracking-wider">For Your Choose</h3>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">Our Packages</h2>
          <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto transform rotate-45"></div>
          
        </motion.div>

        {loading && <p className="text-center text-white/80">Loading packages...</p>}
        {error && <p className="text-center text-red-400">Error: {error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="blue-glass rounded-xl overflow-hidden shadow-lg flex flex-col h-full transform hover:scale-105 transition-transform duration-300"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_UPLOADS_URL}${pkg.imageUrl.replace('/uploads', '')}`}
                    alt={pkg.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-white mb-3">{pkg.name}</h3>
                  <p className="text-white/70 mb-4 text-sm flex-grow">{pkg.description}</p>
                  <ul className="space-y-2 mb-6 text-white/80 text-sm">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-4 border-t border-white/10">
                    {pkg.offerPrice && pkg.offerPrice < pkg.regularPrice ? (
                      <div className="flex items-baseline justify-end gap-2">
                        <span className="text-xl text-white/60 line-through">{pkg.regularPrice.toFixed(2)} BDT</span>
                        <span className="text-3xl font-bold text-pink-400">{pkg.offerPrice.toFixed(2)} BDT</span>
                      </div>
                    ) : (
                      <p className="text-3xl font-bold text-white text-right">{pkg.regularPrice.toFixed(2)} BDT</p>
                    )}
                  </div>
                </div>
                <div className="p-6 mt-auto border-t border-white/10">
                  <button
                    onClick={() => handleBookingClick(pkg)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {packages.length === 0 && !loading && !error && (
           <p className="text-center text-white/80">No packages available at the moment.</p>
        )}
      </div>
      {limit && (
        <div className="text-center mt-8">
          <Link href="/packages" className="blue-glass-button px-6 py-3 rounded-lg text-white font-semibold transition-transform transform hover:scale-105">
            View All Packages
          </Link>
        </div>
      )}

      {/* Booking Modal */}
      {isModalOpen && selectedPackage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="blue-glass rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Book Package: {selectedPackage.name}</h3>
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={bookingData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={bookingData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Address</label>
                <textarea
                  name="address"
                  value={bookingData.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Booking Date</label>
                <input
                  type="date"
                  name="bookingDate"
                  value={bookingData.bookingDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
}
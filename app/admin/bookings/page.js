'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/admin/DashboardLayout';
import { FiCheck, FiX, FiTrash2, FiEye } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function AdminBookings() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/');
      return;
    }
    fetchBookings();
  }, [user, router]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          throw new Error('Session expired. Please login again.');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      toast.error(error.message || 'Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          throw new Error('Session expired. Please login again.');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to update status');
      }

      toast.success(`Booking ${newStatus} successfully`);
      fetchBookings();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || 'Error updating booking status');
    }
  };

  const handleDelete = async (bookingId) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          throw new Error('Session expired. Please login again.');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete booking');
      }

      toast.success('Booking deleted successfully');
      fetchBookings();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || 'Error deleting booking');
    }
  };

  if (!user?.isAdmin) {
    return (
      <DashboardLayout>
        <div className="blue-glass rounded-xl p-6">
          <p className="text-white">Access denied. Admin privileges required.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-2 sm:p-0">
        <div className="blue-glass rounded-xl p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Bookings Management</h1>
          <p className="text-white/60">Manage and track all package bookings</p>
        </div>

        {loading ? (
          <p className="text-center text-white/60">Loading bookings...</p>
        ) : (
          <div className="blue-glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-white/60">Package</th>
                    <th className="text-left p-4 text-white/60">Customer</th>
                    <th className="text-left p-4 text-white/60">Date</th>
                    <th className="text-left p-4 text-white/60">Status</th>
                    <th className="text-right p-4 text-white/60">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-white/10 last:border-0">
                      <td className="p-4">
                        <p className="font-medium text-white">{booking.packageName}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-white">{booking.customerName}</p>
                        <p className="text-white/60 text-sm">{booking.phone}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-white">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                        <p className="text-white/60 text-sm">{new Date(booking.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          booking.status === 'approved' ? 'bg-green-500/30 text-green-300' :
                          booking.status === 'rejected' ? 'bg-red-500/30 text-red-300' :
                          'bg-yellow-500/30 text-yellow-300'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setIsModalOpen(true);
                            }}
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            <FiEye size={18} />
                          </button>
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(booking._id, 'approved')}
                                className="text-green-400 hover:text-green-300 transition-colors"
                              >
                                <FiCheck size={18} />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <FiX size={18} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(booking._id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {bookings.length === 0 && (
              <p className="text-center py-8 text-white/60">No bookings found.</p>
            )}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="blue-glass rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-white mb-4">Booking Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-white/60 text-sm">Package</p>
                <p className="text-white font-medium">{selectedBooking.packageName}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Customer Name</p>
                <p className="text-white">{selectedBooking.customerName}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Phone</p>
                <p className="text-white">{selectedBooking.phone}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Address</p>
                <p className="text-white">{selectedBooking.address}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Booking Date</p>
                <p className="text-white">{new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Status</p>
                <span className={`inline-block px-2 py-1 rounded text-xs ${
                  selectedBooking.status === 'approved' ? 'bg-green-500/30 text-green-300' :
                  selectedBooking.status === 'rejected' ? 'bg-red-500/30 text-red-300' :
                  'bg-yellow-500/30 text-yellow-300'
                }`}>
                  {selectedBooking.status}
                </span>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/admin/DashboardLayout';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [bookingChart, setBookingChart] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/');
      return;
    }
    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        credentials: 'include'
      });
      const usersData = await usersResponse.json();

      // Fetch bookings
      const bookingsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        credentials: 'include'
      });
      const bookingsData = await bookingsResponse.json();

      // Process data for stats
      const totalUsers = usersData.users.length;
      const totalBookings = bookingsData.bookings.length;
      const pendingBookings = bookingsData.bookings.filter(b => b.status === 'pending').length;
      const totalRevenue = bookingsData.bookings
        .filter(b => b.status === 'approved')
        .reduce((sum, booking) => sum + (booking.packagePrice || 0), 0);

      // Get recent bookings and users
      const recentBookings = bookingsData.bookings.slice(0, 5);
      const recentUsers = usersData.users.slice(0, 5);

      // Process data for chart (last 7 days)
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();

      const bookingsByDate = last7Days.map(date => ({
        date,
        count: bookingsData.bookings.filter(b => 
          new Date(b.createdAt).toISOString().split('T')[0] === date
        ).length
      }));

      setStats({
        totalUsers,
        totalBookings,
        pendingBookings,
        totalRevenue
      });

      setRecentBookings(recentBookings);
      setRecentUsers(recentUsers);

      setBookingChart({
        labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [{
          label: 'Daily Bookings',
          data: bookingsByDate.map(b => b.count),
          fill: false,
          borderColor: 'rgb(147, 51, 234)',
          backgroundColor: 'rgba(147, 51, 234, 0.5)',
          tension: 0.3
        }]
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-2 sm:p-0">
        <div className="blue-glass rounded-xl p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Welcome to Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-white/80">Manage your website content and settings from here.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Stats Cards */}
          <div className="blue-glass rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-white/80 mb-1 sm:mb-2">Total Users</h3>
            <p className="text-2xl sm:text-3xl font-bold text-white">{stats.totalUsers}</p>
          </div>
          <div className="blue-glass rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-white/80 mb-1 sm:mb-2">Total Bookings</h3>
            <p className="text-2xl sm:text-3xl font-bold text-white">{stats.totalBookings}</p>
          </div>
          <div className="blue-glass rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-white/80 mb-1 sm:mb-2">Total Revenue</h3>
            <p className="text-2xl sm:text-3xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="blue-glass rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-white/80 mb-1 sm:mb-2">Pending Bookings</h3>
            <p className="text-2xl sm:text-3xl font-bold text-white">{stats.pendingBookings}</p>
          </div>
        </div>

        {/* Booking Chart */}
        <div className="blue-glass rounded-xl p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Booking Trends</h2>
          {bookingChart.labels.length > 0 && (
            <div className="h-[300px]">
              <Line
                data={bookingChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        stepSize: 1
                      },
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      }
                    },
                    x: {
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                      },
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      labels: {
                        color: 'rgba(255, 255, 255, 0.7)'
                      }
                    }
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="blue-glass rounded-xl p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Recent Bookings</h2>
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="flex justify-between items-center border-b border-white/10 last:border-0 py-3">
                  <div>
                    <p className="text-white font-medium">{booking.packageName}</p>
                    <p className="text-sm text-white/60">{booking.customerName}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded ${
                      booking.status === 'approved' ? 'bg-green-500/30 text-green-300' :
                      booking.status === 'rejected' ? 'bg-red-500/30 text-red-300' :
                      'bg-yellow-500/30 text-yellow-300'
                    }`}>
                      {booking.status}
                    </span>
                    <p className="text-xs text-white/60 mt-1">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="blue-glass rounded-xl p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Recent Users</h2>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user._id} className="flex justify-between items-center border-b border-white/10 last:border-0 py-3">
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-sm text-white/60">{user.email}</p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      user.isAdmin ? 'bg-purple-500/30 text-purple-300' : 'bg-blue-500/30 text-blue-300'
                    }`}>
                      {user.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
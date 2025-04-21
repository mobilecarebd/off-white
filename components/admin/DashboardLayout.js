'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiHome, FiImage, FiPackage, FiUsers, FiUser, FiCalendar } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  // Protect admin routes
  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-500/10 to-blue-500/10">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Don't render the dashboard until we confirm the user is an admin
  if (!user?.isAdmin) {
    return null;
  }

  const isActiveLink = (path) => {
    return pathname === path;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-500/10 to-blue-500/10">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-[280px] sm:w-64 blue-glass transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out z-[60]`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-white/10">
            <Link href="/admin/dashboard" className="flex items-center" onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}>
              <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
            </Link>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-3">
              {[
                { href: '/admin/dashboard', icon: <FiHome size={20} />, label: 'Dashboard' },
                { href: '/admin/bookings', icon: <FiCalendar size={20} />, label: 'Bookings' },
                { href: '/admin/photos', icon: <FiImage size={20} />, label: 'Photos' },
                { href: '/admin/packages', icon: <FiPackage size={20} />, label: 'Packages' },
                { href: '/admin/team', icon: <FiUsers size={20} />, label: 'Team' },
                { href: '/admin/users', icon: <FiUser size={20} />, label: 'Users' }
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActiveLink(item.href)
                        ? 'bg-white/20 text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.icon}
                    <span className="text-base">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1">
                <p className="text-sm text-white">{user?.name}</p>
                <p className="text-xs text-white/60">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col w-full ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Header */}
        <header className="blue-glass sticky top-0 z-[55]">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white/80 hover:text-white p-2"
              aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            >
              {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
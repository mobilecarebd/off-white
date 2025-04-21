'use client';

import { usePathname } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import Header from './Header'
import Footer from './Footer'
import { Toaster } from 'react-hot-toast'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const { loading } = useAuth();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isAuthRoute = pathname?.startsWith('/(auth)') || pathname?.startsWith('/login') || pathname?.startsWith('/register');

  // Show loading spinner only when checking authentication and not on auth routes
  if (loading && !isAuthRoute) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {!isAdminRoute && <Header />}
      <main className={`flex-grow ${isAdminRoute ? '' : 'pt-16'}`}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
      <Toaster position="top-right" />
    </>
  );
}
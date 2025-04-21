'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (path) => pathname === path;

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
  };

  // Function to handle smooth scrolling to sections
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  // Check if we're on the home page
  const isHomePage = pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav>
        <div className="blue-glass border-b border-blue-400/20">
          <div className="flex justify-center">
            <div className="w-full lg:max-w-[77%] px-4 md:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <Link href="/">
                    <img 
                      src="/images/logo.png" 
                      alt="Off White Logo" 
                      className="h-8 w-auto"
                    />
                  </Link>
                </div>

                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden text-white/90 hover:text-white p-2"
                >
                  {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>

                <div className="hidden md:flex items-center gap-8">
                  <div className="flex items-center gap-6">
                    {isHomePage ? (
                      <>
                        <button onClick={() => scrollToSection('home')} className="text-white/60 hover:text-white transition-colors">Home</button>
                        <button onClick={() => scrollToSection('packages')} className="text-white/60 hover:text-white transition-colors">Packages</button>
                        <button onClick={() => scrollToSection('team')} className="text-white/60 hover:text-white transition-colors">Team</button>
                        <button onClick={() => scrollToSection('about')} className="text-white/60 hover:text-white transition-colors">About</button>
                        <button onClick={() => scrollToSection('contact')} className="text-white/60 hover:text-white transition-colors">Contact</button>
                      </>
                    ) : (
                      <>
                        <Link href="/" className={`text-white/90 hover:text-white ${isActive('/') ? 'text-white' : 'text-white/60'} transition-colors`}>Home</Link>
                        <Link href="/packages" className={`text-white/90 hover:text-white ${isActive('/packages') ? 'text-white' : 'text-white/60'} transition-colors`}>Packages</Link>
                        <Link href="/team" className={`text-white/90 hover:text-white ${isActive('/team') ? 'text-white' : 'text-white/60'} transition-colors`}>Team</Link>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {!user ? (
                      <>
                        <Link href="/login" className={`text-white/90 hover:text-white transition-all hover:scale-105 ${isActive('/login') ? 'text-white' : 'text-white/60'} transition-colors`}>
                          Login
                        </Link>
                        <Link href="/register" className={`blue-glass-button px-6 py-2 rounded-lg transition-all hover:scale-105 shadow-lg ${isActive('/register') ? 'text-white' : 'text-white/60'} transition-colors`}>
                          Register
                        </Link>
                      </>
                    ) : (
                      <div className="relative">
                        <button
                          onClick={() => setIsProfileOpen(!isProfileOpen)}
                          className="flex items-center gap-2 text-white/90 hover:text-white"
                        >
                          <FiUser size={20} />
                          <span>{user.name}</span>
                        </button>
                        
                        {isProfileOpen && (
                          <div className="absolute right-0 mt-2 w-48 blue-glass rounded-lg shadow-xl py-2">
                            <Link
                              href="/profile"
                              className="block px-4 py-2 text-white/90 hover:text-white hover:bg-white/10"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              My Profile
                            </Link>
                            {user.isAdmin && (
                              <Link
                                href="/admin/dashboard"
                                className="block px-4 py-2 text-white/90 hover:text-white hover:bg-white/10"
                                onClick={() => setIsProfileOpen(false)}
                              >
                                Admin Dashboard
                              </Link>
                            )}
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 flex items-center gap-2"
                            >
                              <FiLogOut size={16} />
                              <span>Logout</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden blue-glass border-t border-blue-400/20 ${isMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-4 py-4 space-y-3">
              {isHomePage ? (
                <>
                  <button 
                    onClick={() => scrollToSection('home')} 
                    className="block w-full text-left text-white/90 hover:text-white py-2"
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => scrollToSection('packages')} 
                    className="block w-full text-left text-white/90 hover:text-white py-2"
                  >
                    Packages
                  </button>
                  <button 
                    onClick={() => scrollToSection('team')} 
                    className="block w-full text-left text-white/90 hover:text-white py-2"
                  >
                    Team
                  </button>
                  <button 
                    onClick={() => scrollToSection('about')} 
                    className="block w-full text-left text-white/90 hover:text-white py-2"
                  >
                    About
                  </button>
                  <button 
                    onClick={() => scrollToSection('contact')} 
                    className="block w-full text-left text-white/90 hover:text-white py-2"
                  >
                    Contact
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/" 
                    className={`block text-white/90 hover:text-white py-2 ${isActive('/') ? 'text-white' : 'text-white/60'} transition-colors`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    href="/packages" 
                    className={`block text-white/90 hover:text-white py-2 ${isActive('/packages') ? 'text-white' : 'text-white/60'} transition-colors`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Packages
                  </Link>
                  <Link 
                    href="/team" 
                    className={`block text-white/90 hover:text-white py-2 ${isActive('/team') ? 'text-white' : 'text-white/60'} transition-colors`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Team
                  </Link>
                </>
              )}

              {!user ? (
                <div className="pt-4 flex flex-col gap-3">
                  <Link 
                    href="/login" 
                    className={`text-white/90 hover:text-white py-2 ${isActive('/login') ? 'text-white' : 'text-white/60'} transition-colors`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className={`blue-glass-button px-6 py-2 text-center rounded-lg transition-all hover:scale-105 shadow-lg ${isActive('/register') ? 'text-white' : 'text-white/60'} transition-colors`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="pt-4 border-t border-white/10">
                  <Link 
                    href="/profile" 
                    className={`block text-white/90 hover:text-white py-2 ${isActive('/profile') ? 'text-white' : 'text-white/60'} transition-colors`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  {user.isAdmin && (
                    <Link 
                      href="/admin/dashboard" 
                      className={`block text-white/90 hover:text-white py-2 ${isActive('/admin/dashboard') ? 'text-white' : 'text-white/60'} transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-white/90 hover:text-white py-2 flex items-center gap-2"
                  >
                    <FiLogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

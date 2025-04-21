'use client'
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        credentials: 'include'
      });
      
      if (res.ok) {
        const { user } = await res.json();
        setUser(user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone, password) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.user) {
        setUser(data.user);
        return { success: true };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'An error occurred during login' 
      };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async ({ name, phone, email, password }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, email: email || undefined, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Registration failed');
      }

      const { user } = await res.json();
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      register,
      isAdmin: user?.isAdmin || false,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

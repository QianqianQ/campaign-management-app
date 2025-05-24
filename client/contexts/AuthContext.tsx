'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'
import api from '@/services/api';

interface AuthContextType {
  // TODO: add type for user
  user: Record<string, string> | null;
  signin: (formData: Record<string, string>) => Promise<{ success: boolean; errors?: any }>;
  signout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true)
  const router = useRouter();

  const signout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    router.push('/signin');
  }, [router]);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('access_token');
      console.log(token);
      if (token) {
        try {
          const { data } = await api.get('profile/');
          setUser(data);
          setIsAuthenticated(true);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    };
    loadUser();
  }, [signout]);

  // signin with email and password
  const signin = async (formData: Record<string, string>) => {
    try {
      const res = await api.post('signin/', formData);
      const { access_token, refresh_token, user } = res.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      setIsAuthenticated(false);
      if (axios.isAxiosError(error) && error.response) {
        // Server responded with error status
        return { success: false, errors: error.response.data }
      } else {
        // Network or other error
        return { success: false, errors: { general: 'Network error occurred' } }
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { SecureTokenStorage } from '@/lib/token-storage';

export interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Auto-refresh token before expiration
  useEffect(() => {
    if (accessToken) {
      try {
        const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
        const expiresAt = tokenData.exp * 1000;
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;

        // Refresh token 1 minute before expiration
        if (timeUntilExpiry > 60000) {
          const refreshTimer = setTimeout(() => {
            refreshAccessToken();
          }, timeUntilExpiry - 60000);

          return () => clearTimeout(refreshTimer);
        } else {
          // Token already expired, refresh immediately
          refreshAccessToken();
        }
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, [accessToken]);

  // Load user data from secure storage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedAccessToken = SecureTokenStorage.getAccessToken();
        const savedUser = sessionStorage.getItem('medgenie_user');

        if (savedAccessToken && savedUser) {
          setAccessToken(savedAccessToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Clear invalid data
        SecureTokenStorage.clearTokens();
        sessionStorage.removeItem('medgenie_user');
      }
      setIsLoading(false);
    };

    loadUserData();
  }, []);

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const { accessToken: newAccessToken } = await response.json();
        setAccessToken(newAccessToken);
        SecureTokenStorage.setTokens(newAccessToken, ''); // Refresh token in cookie
        return true;
      } else {
        // Refresh failed, logout user
        await logout();
        return false;
      }
    } catch (error) {
      await logout();
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.accessToken && data.user) {
        setAccessToken(data.accessToken);
        setUser(data.user);

        // Store in secure storage
        SecureTokenStorage.setTokens(data.accessToken, data.refreshToken || '');
        sessionStorage.setItem('medgenie_user', JSON.stringify(data.user));

        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await response.json();

      if (data.success && data.accessToken && data.user) {
        setAccessToken(data.accessToken);
        setUser(data.user);

        // Store in secure storage
        SecureTokenStorage.setTokens(data.accessToken, data.refreshToken || '');
        sessionStorage.setItem('medgenie_user', JSON.stringify(data.user));

        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call logout API to blacklist tokens
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setAccessToken(null);
      SecureTokenStorage.clearTokens();
      sessionStorage.removeItem('medgenie_user');
      router.push('/login');
    }
  };

  const value: AuthContextType = {
    user,
    accessToken,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user && !!accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

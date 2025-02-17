// context/AuthContext.tsx
'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface AuthUser {
  id: number;
  email: string;
  name: string;
  givenName: string;
  familyName: string;
  picture: string;
  locale: string;
  authenticationProvider: string;
  providerKey: string;
  isVerified: boolean;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem('user');
        if (storedData) {
          const authData = JSON.parse(storedData);
          setToken(authData.token);
          setUser(authData.user);
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = (authData: AuthResponse) => {
    try {
      localStorage.setItem('user', JSON.stringify(authData));
      setToken(authData.token);
      setUser(authData.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('An error occurred while logging in', {
        position: "bottom-center"
      });
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('An error occurred while logging out', {
        position: "bottom-center"
      });
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
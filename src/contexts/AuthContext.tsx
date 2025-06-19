import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';

export interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  role: 'customer' | 'provider' | 'admin';
  avatar?: string;
  verified?: boolean;
  rating?: number;
  serviceCategory?: string;
  description?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any, userType: 'customer' | 'provider') => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('go_local_user');
    const token = localStorage.getItem('auth_token');
    
    if (savedUser && token) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('go_local_user');
        localStorage.removeItem('auth_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = await apiService.login({ username, password });
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data as any;
        
        setUser(userData);
        localStorage.setItem('go_local_user', JSON.stringify(userData));
        localStorage.setItem('auth_token', token);
        
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const register = async (userData: any, userType: 'customer' | 'provider'): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = userType === 'customer' 
        ? await apiService.registerCustomer(userData)
        : await apiService.registerProvider(userData);
      
      if (response.success && response.data) {
        const { user: newUser, token } = response.data as any;
        
        setUser(newUser);
        localStorage.setItem('go_local_user', JSON.stringify(newUser));
        localStorage.setItem('auth_token', token);
        
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('go_local_user');
    localStorage.removeItem('auth_token');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    loading,
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
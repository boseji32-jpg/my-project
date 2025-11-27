import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<AuthResponse>;
  signup: (username: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    // Check if user is logged in on initial load
    const tokenFromStorage = localStorage.getItem('token');
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
      // In a real app, you would validate the token and get user details
      // For now, we'll just assume the user is valid
    }
  }, []);

  const login = async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch('/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    setToken(data.access_token);
    localStorage.setItem('token', data.access_token);
    
    // In a real app, you would get user details with the token
    // For now, we'll use a dummy user
    const dummyUser: User = {
      id: 1,
      username,
      email: '', // We don't get email from login response
      created_at: new Date().toISOString(),
    };
    setUser(dummyUser);
    
    return data;
  };

  const signup = async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch('/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Signup failed');
    }

    const data: AuthResponse = await response.json();
    setToken(data.access_token);
    localStorage.setItem('token', data.access_token);
    
    // For signup, we get full user data in response
    // In this implementation, we'll fake the user object
    const newUser: User = {
      id: 1,
      username,
      email,
      created_at: new Date().toISOString(),
    };
    setUser(newUser);
    
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isAuthenticated }}>
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
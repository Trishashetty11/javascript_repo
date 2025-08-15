import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { getFromStorage, setToStorage, removeFromStorage } from '../utils/localStorage';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = getFromStorage<User | null>('authUser', null);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation - in real app, this would be server-side
    const users = getFromStorage<any[]>('registeredUsers', []);
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    
    if (user) {
      const authUser: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };
      
      setCurrentUser(authUser);
      setIsAuthenticated(true);
      setToStorage('authUser', authUser);
      toast.success(`Welcome back, ${user.name}!`);
      return true;
    } else {
      toast.error('Invalid credentials');
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = getFromStorage<any[]>('registeredUsers', []);
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      toast.error('Email already registered');
      return false;
    }
    
    const newUser = {
      id: Math.random().toString(36).slice(2),
      ...userData
    };
    
    users.push(newUser);
    setToStorage('registeredUsers', users);
    toast.success('Registration successful! Please login.');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    removeFromStorage('authUser');
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
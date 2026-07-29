'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('authToken', 'dummy-token');
    localStorage.setItem('userData', JSON.stringify(userData));
    setShowLoginModal(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const openLoginModal = () => {
    console.log('AuthContext: openLoginModal called');
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    console.log('AuthContext: closeLoginModal called');
    setShowLoginModal(false);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    showLoginModal,
    openLoginModal,
    closeLoginModal
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};